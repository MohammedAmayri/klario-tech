import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { 
  superAdmins, 
  adminActionLogs, 
  businessOversight, 
  platformStats,
  superAdminLoginSchema,
  superAdminRegistrationSchema,
  type SuperAdmin,
  type InsertAdminActionLogInput
} from "@shared/superadmin-schema";
import { businesses, customers, campaigns } from "@shared/schema";
import { eq, desc, count, sql } from "drizzle-orm";

const router = Router();

// Middleware to check if super admin is authenticated
const requireSuperAdmin = async (req: any, res: any, next: any) => {
  if (!req.session?.superAdminId) {
    return res.status(401).json({ message: "Super admin authentication required" });
  }
  
  try {
    const admin = await db.select().from(superAdmins)
      .where(eq(superAdmins.id, req.session.superAdminId))
      .limit(1);
    
    if (!admin.length || !admin[0].isActive) {
      req.session.superAdminId = null;
      return res.status(401).json({ message: "Super admin access revoked" });
    }
    
    req.superAdmin = admin[0];
    next();
  } catch (error) {
    console.error("Super admin auth error:", error);
    res.status(500).json({ message: "Authentication error" });
  }
};

// Log admin actions for audit trail
const logAdminAction = async (
  adminId: string, 
  action: string, 
  targetType?: string, 
  targetId?: string, 
  details?: any,
  req?: any
) => {
  try {
    const logEntry: InsertAdminActionLogInput = {
      adminId,
      action,
      targetType,
      targetId,
      details: details ? JSON.stringify(details) : null,
      ipAddress: req?.ip || req?.connection?.remoteAddress,
      userAgent: req?.get('User-Agent'),
    };
    
    await db.insert(adminActionLogs).values(logEntry);
  } catch (error) {
    console.error("Failed to log admin action:", error);
  }
};

// Super Admin Registration (only for initial setup)
router.post("/register", async (req, res) => {
  try {
    const data = superAdminRegistrationSchema.parse(req.body);
    
    // Check if setup key is correct (should be an environment variable)
    const expectedSetupKey = process.env.SUPER_ADMIN_SETUP_KEY || "klario-admin-setup-2025";
    if (data.setupKey !== expectedSetupKey) {
      return res.status(403).json({ message: "Invalid setup key" });
    }
    
    // Check if any super admin already exists
    const existingAdmins = await db.select().from(superAdmins).limit(1);
    if (existingAdmins.length > 0) {
      return res.status(403).json({ message: "Super admin already exists. Contact existing admin for access." });
    }
    
    // Check if email already exists
    const existingAdmin = await db.select().from(superAdmins)
      .where(eq(superAdmins.email, data.email))
      .limit(1);
    
    if (existingAdmin.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 12);
    
    // Create super admin
    const [newAdmin] = await db.insert(superAdmins).values({
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      role: "super_admin",
    }).returning();
    
    // Log the action
    await logAdminAction(newAdmin.id, "super_admin_registration", "super_admin", newAdmin.id, {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName
    }, req);
    
    // Remove password hash from response
    const { passwordHash: _, ...adminResponse } = newAdmin;
    
    res.status(201).json({ 
      message: "Super admin created successfully",
      admin: adminResponse 
    });
    
  } catch (error: any) {
    console.error("Super admin registration error:", error);
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: "Validation error", errors: error.issues });
    }
    res.status(500).json({ message: "Failed to create super admin" });
  }
});

// Super Admin Login
router.post("/login", async (req, res) => {
  try {
    const data = superAdminLoginSchema.parse(req.body);
    
    // Find admin by email
    const [admin] = await db.select().from(superAdmins)
      .where(eq(superAdmins.email, data.email))
      .limit(1);
    
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    if (!admin.isActive) {
      return res.status(401).json({ message: "Account is deactivated" });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, admin.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    // Update last login
    await db.update(superAdmins)
      .set({ lastLoginAt: new Date() })
      .where(eq(superAdmins.id, admin.id));
    
    // Set session
    req.session.superAdminId = admin.id;
    
    // Log the action
    await logAdminAction(admin.id, "super_admin_login", "super_admin", admin.id, {
      email: admin.email
    }, req);
    
    // Remove password hash from response
    const { passwordHash: _, ...adminResponse } = admin;
    
    res.json({ 
      message: "Login successful",
      admin: adminResponse 
    });
    
  } catch (error: any) {
    console.error("Super admin login error:", error);
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: "Validation error", errors: error.issues });
    }
    res.status(500).json({ message: "Login failed" });
  }
});

// Super Admin Logout
router.post("/logout", requireSuperAdmin, async (req: any, res) => {
  try {
    await logAdminAction(req.superAdmin.id, "super_admin_logout", "super_admin", req.superAdmin.id, null, req);
    req.session.superAdminId = null;
    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Super admin logout error:", error);
    res.status(500).json({ message: "Logout failed" });
  }
});

// Get current super admin info
router.get("/me", requireSuperAdmin, (req: any, res) => {
  const { passwordHash: _, ...adminResponse } = req.superAdmin;
  res.json(adminResponse);
});

// Dashboard - Platform Overview
router.get("/dashboard", requireSuperAdmin, async (req: any, res) => {
  try {
    // Get platform statistics
    const [businessCount] = await db.select({ count: count() }).from(businesses);
    const [customerCount] = await db.select({ count: count() }).from(customers);
    const [campaignCount] = await db.select({ count: count() }).from(campaigns);
    
    // Get recent businesses
    const recentBusinesses = await db.select().from(businesses)
      .orderBy(desc(businesses.createdAt))
      .limit(10);
    
    // Get platform stats for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentStats = await db.select().from(platformStats)
      .where(sql`${platformStats.date} >= ${thirtyDaysAgo.toISOString().split('T')[0]}`)
      .orderBy(desc(platformStats.date))
      .limit(30);
    
    await logAdminAction(req.superAdmin.id, "view_dashboard", "dashboard", null, null, req);
    
    res.json({
      statistics: {
        totalBusinesses: businessCount.count,
        totalCustomers: customerCount.count,
        totalCampaigns: campaignCount.count,
      },
      recentBusinesses,
      chartData: recentStats,
    });
    
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
});

// Business Management - List all businesses
router.get("/businesses", requireSuperAdmin, async (req: any, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    const allBusinesses = await db.select().from(businesses)
      .orderBy(desc(businesses.createdAt))
      .limit(limit)
      .offset(offset);
    
    const [totalCount] = await db.select({ count: count() }).from(businesses);
    
    await logAdminAction(req.superAdmin.id, "view_businesses", "business", null, { page, limit }, req);
    
    res.json({
      businesses: allBusinesses,
      pagination: {
        page,
        limit,
        total: totalCount.count,
        totalPages: Math.ceil(totalCount.count / limit),
      },
    });
    
  } catch (error) {
    console.error("Businesses list error:", error);
    res.status(500).json({ message: "Failed to load businesses" });
  }
});

// Business Management - Get specific business details
router.get("/businesses/:id", requireSuperAdmin, async (req: any, res) => {
  try {
    const businessId = parseInt(req.params.id);
    
    // Get business details
    const [business] = await db.select().from(businesses)
      .where(eq(businesses.id, businessId));
    
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }
    
    // Get business customers count
    const [customerCount] = await db.select({ count: count() }).from(customers)
      .where(eq(customers.businessId, businessId));
    
    // Get business campaigns count
    const [campaignCount] = await db.select({ count: count() }).from(campaigns)
      .where(eq(campaigns.businessId, businessId));
    
    // Get oversight record
    const [oversight] = await db.select().from(businessOversight)
      .where(eq(businessOversight.businessId, businessId));
    
    await logAdminAction(req.superAdmin.id, "view_business_details", "business", businessId.toString(), null, req);
    
    res.json({
      business,
      statistics: {
        customerCount: customerCount.count,
        campaignCount: campaignCount.count,
      },
      oversight,
    });
    
  } catch (error) {
    console.error("Business details error:", error);
    res.status(500).json({ message: "Failed to load business details" });
  }
});

// Business Management - Suspend/Activate business
router.patch("/businesses/:id/status", requireSuperAdmin, async (req: any, res) => {
  try {
    const businessId = parseInt(req.params.id);
    const { status, reason, notes } = req.body;
    
    if (!['active', 'suspended', 'under_review', 'terminated'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    
    // Update or create oversight record
    const existingOversight = await db.select().from(businessOversight)
      .where(eq(businessOversight.businessId, businessId));
    
    if (existingOversight.length > 0) {
      await db.update(businessOversight)
        .set({
          status,
          suspensionReason: reason,
          notes,
          reviewedAt: new Date(),
          reviewedBy: req.superAdmin.id,
          updatedAt: new Date(),
        })
        .where(eq(businessOversight.businessId, businessId));
    } else {
      await db.insert(businessOversight).values({
        businessId,
        status,
        suspensionReason: reason,
        notes,
        reviewedAt: new Date(),
        reviewedBy: req.superAdmin.id,
      });
    }
    
    await logAdminAction(req.superAdmin.id, "change_business_status", "business", businessId.toString(), {
      newStatus: status,
      reason,
      notes
    }, req);
    
    res.json({ message: "Business status updated successfully" });
    
  } catch (error) {
    console.error("Business status update error:", error);
    res.status(500).json({ message: "Failed to update business status" });
  }
});

// Audit Log
router.get("/audit-log", requireSuperAdmin, async (req: any, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;
    
    const logs = await db.select().from(adminActionLogs)
      .orderBy(desc(adminActionLogs.createdAt))
      .limit(limit)
      .offset(offset);
    
    const [totalCount] = await db.select({ count: count() }).from(adminActionLogs);
    
    await logAdminAction(req.superAdmin.id, "view_audit_log", "audit_log", null, { page, limit }, req);
    
    res.json({
      logs,
      pagination: {
        page,
        limit,
        total: totalCount.count,
        totalPages: Math.ceil(totalCount.count / limit),
      },
    });
    
  } catch (error) {
    console.error("Audit log error:", error);
    res.status(500).json({ message: "Failed to load audit log" });
  }
});

export default router;