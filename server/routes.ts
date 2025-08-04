import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBusinessSchema, insertCustomerSchema, insertCampaignSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import session from "express-session";
import MemoryStore from "memorystore";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for Docker and load balancers
  app.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });
  // Session configuration
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const MemStore = MemoryStore(session);
  const sessionStore = new MemStore({
    checkPeriod: sessionTtl, // prune expired entries every 24h
  });

  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Allow cookies over HTTP in development
      maxAge: sessionTtl,
      sameSite: 'lax',
    },
    name: 'connect.sid',
  }));

  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session || !req.session.businessId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Business authentication routes
  app.get('/api/auth/me', requireAuth, async (req: any, res) => {
    try {
      const business = await storage.getBusiness(req.session.businessId);
      res.json({ business });
    } catch (error: any) {
      console.error("Get business error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post('/api/auth/signup', async (req: any, res) => {
    try {
      const validatedData = insertBusinessSchema.parse(req.body);
      
      // Check if business already exists
      const existingBusiness = await storage.getBusinessByEmail(validatedData.email);
      if (existingBusiness) {
        return res.status(400).json({ message: "Business with this email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 12);
      
      // Create business
      const business = await storage.createBusiness({
        ...validatedData,
        password: hashedPassword,
      });

      // Set session
      req.session.businessId = business.id;

      // Return business without password
      const { password, ...businessWithoutPassword } = business;
      res.json({ business: businessWithoutPassword });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(400).json({ message: "Invalid data provided" });
    }
  });

  app.post('/api/auth/signin', async (req: any, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Find business
      const business = await storage.getBusinessByEmail(email);
      if (!business) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isValid = await bcrypt.compare(password, business.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set session
      req.session.businessId = business.id;

      // Return business without password
      const { password: _, ...businessWithoutPassword } = business;
      res.json({ business: businessWithoutPassword });
    } catch (error) {
      console.error("Signin error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post('/api/auth/signout', (req: any, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Could not sign out" });
      }
      res.json({ message: "Signed out successfully" });
    });
  });

  app.get('/api/auth/me', requireAuth, async (req: any, res) => {
    try {
      const business = await storage.getBusiness((req.session as any).businessId);
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }
      
      const { password, ...businessWithoutPassword } = business;
      res.json({ business: businessWithoutPassword });
    } catch (error) {
      console.error("Get me error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Customer management routes
  app.get('/api/customers', requireAuth, async (req: any, res) => {
    try {
      const customers = await storage.getCustomersByBusiness((req.session as any).businessId);
      res.json({ customers });
    } catch (error) {
      console.error("Get customers error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post('/api/customers', requireAuth, async (req: any, res) => {
    try {
      // Add businessId from session to the request data
      const customerData = {
        ...req.body,
        businessId: req.session.businessId
      };
      
      const validatedData = insertCustomerSchema.parse(customerData);
      const customer = await storage.createCustomer(validatedData);
      res.json({ customer });
    } catch (error: any) {
      console.error("Create customer error:", error);
      res.status(400).json({ message: "Invalid data provided" });
    }
  });

  app.put('/api/customers/:id', requireAuth, async (req: any, res) => {
    try {
      const customerId = parseInt(req.params.id);
      const updates = req.body;
      
      // Verify customer belongs to business
      const customer = await storage.getCustomer(customerId);
      if (!customer || customer.businessId !== (req.session as any).businessId) {
        return res.status(404).json({ message: "Customer not found" });
      }

      const updatedCustomer = await storage.updateCustomer(customerId, updates);
      res.json({ customer: updatedCustomer });
    } catch (error) {
      console.error("Update customer error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete('/api/customers/:id', requireAuth, async (req: any, res) => {
    try {
      const customerId = parseInt(req.params.id);
      
      // Verify customer belongs to business
      const customer = await storage.getCustomer(customerId);
      if (!customer || customer.businessId !== (req.session as any).businessId) {
        return res.status(404).json({ message: "Customer not found" });
      }

      await storage.deleteCustomer(customerId);
      res.json({ message: "Customer deleted successfully" });
    } catch (error) {
      console.error("Delete customer error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Campaign management routes
  app.get('/api/campaigns', requireAuth, async (req: any, res) => {
    try {
      const campaigns = await storage.getCampaignsByBusiness((req.session as any).businessId);
      res.json({ campaigns });
    } catch (error) {
      console.error("Get campaigns error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Save campaign
  app.post('/api/campaigns/save', requireAuth, async (req: any, res) => {
    try {
      const campaignData = {
        name: req.body.title || req.body.name || 'Untitled Campaign',
        ...req.body,
        businessId: req.session.businessId,
        status: req.body.status || 'draft'
      };
      
      const validatedData = insertCampaignSchema.parse(campaignData);
      const campaign = await storage.createCampaign(validatedData);
      res.json({ campaign });
    } catch (error: any) {
      console.error("Save campaign error:", error);
      res.status(400).json({ message: "Invalid campaign data" });
    }
  });

  // Update campaign
  app.put('/api/campaigns/:id', requireAuth, async (req: any, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      
      // Verify campaign belongs to business
      const campaign = await storage.getCampaign(campaignId);
      if (!campaign || campaign.businessId !== req.session.businessId) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      const updates = {
        name: req.body.name || req.body.title,
        type: req.body.type,
        subject: req.body.subject,
        message: req.body.message,
        status: req.body.status || campaign.status
      };

      const updatedCampaign = await storage.updateCampaign(campaignId, updates);
      res.json({ campaign: updatedCampaign });
    } catch (error) {
      console.error("Update campaign error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Delete campaign
  app.delete('/api/campaigns/:id', requireAuth, async (req: any, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      
      // Verify campaign belongs to business
      const campaign = await storage.getCampaign(campaignId);
      if (!campaign || campaign.businessId !== req.session.businessId) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      await storage.deleteCampaign(campaignId);
      res.json({ message: "Campaign deleted successfully" });
    } catch (error) {
      console.error("Delete campaign error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Duplicate campaign (reuse)
  app.post('/api/campaigns/:id/duplicate', requireAuth, async (req: any, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      
      // Get original campaign
      const originalCampaign = await storage.getCampaign(campaignId);
      if (!originalCampaign || originalCampaign.businessId !== req.session.businessId) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      // Create duplicate with new name
      const duplicateData = {
        name: `${originalCampaign.name} (Copy)`,
        type: originalCampaign.type,
        subject: originalCampaign.subject,
        message: originalCampaign.message,
        businessId: req.session.businessId,
        status: 'draft'
      };

      const validatedData = insertCampaignSchema.parse(duplicateData);
      const duplicatedCampaign = await storage.createCampaign(validatedData);
      res.json({ campaign: duplicatedCampaign });
    } catch (error) {
      console.error("Duplicate campaign error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Send campaign via SMS
  app.post('/api/campaigns/:id/send-sms', requireAuth, async (req: any, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      const { customerIds, smsFrom } = req.body; // Array of customer IDs, or empty for all customers, smsFrom for custom sender name
      
      // Get campaign
      const campaign = await storage.getCampaign(campaignId);
      if (!campaign || campaign.businessId !== req.session.businessId) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      // Get business info
      const business = await storage.getBusiness(req.session.businessId);
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      // Get customers to send to
      let customers;
      if (customerIds && customerIds.length > 0) {
        customers = [];
        for (const id of customerIds) {
          const customer = await storage.getCustomer(id);
          if (customer && customer.businessId === req.session.businessId) {
            customers.push(customer);
          }
        }
      } else {
        customers = await storage.getCustomersByBusiness(req.session.businessId);
      }

      // Only include customers who have phone numbers (consent check removed for testing)
      const validCustomers = customers.filter(customer => 
        customer.phone
      );

      console.log(`📱 Found ${customers.length} total customers, ${validCustomers.length} with phone numbers`);
      validCustomers.forEach(c => console.log(`📱 Customer: ${c.name} - ${c.phone}`));

      if (validCustomers.length === 0) {
        return res.status(400).json({ message: "No customers with phone numbers found" });
      }

      // Import SMS service
      const { smsService } = await import('./services/smsService');

      // Send SMS to each customer
      const results = [];
      for (const customer of validCustomers) {
        try {
          // Replace template variables in message
          const personalizedMessage = campaign.message
            .replace(/\{\{name\}\}/g, customer.name)
            .replace(/\{\{email\}\}/g, customer.email || '')
            .replace(/\{\{phone\}\}/g, customer.phone || '');

          // Use custom SMS sender name from frontend, fallback to business smsFromName, or truncate business name
          const smsFromName = smsFrom || business.smsFromName || business.name.substring(0, 11);
          const smsResult = await smsService.sendSMS(customer.phone!, personalizedMessage, smsFromName);
          
          results.push({
            customerId: customer.id,
            customerName: customer.name,
            status: smsResult.success ? 'sent' : 'failed',
            messageId: smsResult.messageId,
            error: smsResult.error
          });

          // Update customer last contact
          if (smsResult.success) {
            await storage.updateCustomer(customer.id, {
              lastContact: new Date()
            });
          }

        } catch (error: any) {
          results.push({
            customerId: customer.id,
            customerName: customer.name,
            status: 'failed',
            error: error.message
          });
        }
      }

      // Update campaign status
      await storage.updateCampaign(campaignId, {
        status: 'sent',
        sentAt: new Date()
      });

      const summary = {
        total: results.length,
        sent: results.filter(r => r.status === 'sent').length,
        failed: results.filter(r => r.status === 'failed').length
      };

      res.json({ 
        campaign,
        results,
        summary
      });

    } catch (error: any) {
      console.error("Send SMS campaign error:", error);
      res.status(500).json({ message: "Failed to send SMS campaign" });
    }
  });

  // Send campaign via Email
  app.post('/api/campaigns/:id/send-email', requireAuth, async (req: any, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      const { customerIds } = req.body; // Array of customer IDs, or empty for all customers
      
      // Get campaign
      const campaign = await storage.getCampaign(campaignId);
      if (!campaign || campaign.businessId !== req.session.businessId) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      // Get business info
      const business = await storage.getBusiness(req.session.businessId);
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      // Get customers to send to
      let customers;
      if (customerIds && customerIds.length > 0) {
        customers = [];
        for (const id of customerIds) {
          const customer = await storage.getCustomer(id);
          if (customer && customer.businessId === req.session.businessId) {
            customers.push(customer);
          }
        }
      } else {
        customers = await storage.getCustomersByBusiness(req.session.businessId);
      }

      // Only include customers who have given consent and have email addresses
      const validCustomers = customers.filter(customer => 
        customer.consentGiven && customer.email
      );

      if (validCustomers.length === 0) {
        return res.status(400).json({ message: "No valid customers to send to (need consent and email address)" });
      }

      // Import email service
      const { SendGridEmailService } = await import('./services/emailService');
      const emailService = new SendGridEmailService();

      // Send email to each customer
      const results = [];
      for (const customer of validCustomers) {
        try {
          // Replace template variables in message
          const personalizedMessage = campaign.message
            .replace(/\{\{name\}\}/g, customer.name)
            .replace(/\{\{email\}\}/g, customer.email || '')
            .replace(/\{\{phone\}\}/g, customer.phone || '');

          // Use campaign subject or generate one
          const subject = campaign.subject || `Message from ${business.name}`;

          const emailResult = await emailService.sendEmail(
            customer.email!, 
            subject, 
            personalizedMessage,
            business.name
          );
          
          results.push({
            customerId: customer.id,
            customerName: customer.name,
            customerEmail: customer.email,
            status: emailResult.success ? 'sent' : 'failed',
            messageId: emailResult.messageId,
            error: emailResult.error
          });

          // Update customer last contact
          if (emailResult.success) {
            await storage.updateCustomer(customer.id, {
              lastContact: new Date()
            });
          }

        } catch (error: any) {
          results.push({
            customerId: customer.id,
            customerName: customer.name,
            customerEmail: customer.email,
            status: 'failed',
            error: error.message
          });
        }
      }

      // Update campaign status
      await storage.updateCampaign(campaignId, {
        status: 'sent',
        sentAt: new Date()
      });

      const summary = {
        total: results.length,
        sent: results.filter(r => r.status === 'sent').length,
        failed: results.filter(r => r.status === 'failed').length
      };

      res.json({ 
        campaign,
        results,
        summary
      });

    } catch (error: any) {
      console.error("Send email campaign error:", error);
      res.status(500).json({ message: "Failed to send email campaign" });
    }
  });

  // AI Campaign Generation Routes
  app.post('/api/campaigns/generate', requireAuth, async (req: any, res) => {
    try {
      const { getAICampaignService } = await import('./services/aiCampaignService');
      const aiService = getAICampaignService();
      
      const result = await aiService.generateCampaign({
        businessName: req.body.businessName,
        businessType: req.body.businessType || 'business',
        campaignType: req.body.campaignType,
        campaignGoal: req.body.campaignGoal,
        targetAudience: req.body.targetAudience,
        productService: req.body.productService,
        tone: req.body.tone,
        keyMessage: req.body.keyMessage,
        callToAction: req.body.callToAction,
        maxLength: req.body.maxLength,
      });

      res.json({ campaign: result });
    } catch (error) {
      console.error("AI Campaign Generation Error:", error);
      if (error instanceof Error && error.message.includes('OPENAI_API_KEY')) {
        res.status(400).json({ message: "OpenAI API key not configured. Please add your API key to use AI features." });
      } else {
        res.status(500).json({ message: "Failed to generate campaign" });
      }
    }
  });

  // AI Enhancement endpoint that frontend expects
  app.post('/api/ai/enhance-campaign', requireAuth, async (req: any, res) => {
    try {
      const { getAICampaignService } = await import('./services/aiCampaignService');
      const aiService = getAICampaignService();
      
      // Get business info for context
      const business = await storage.getBusiness(req.session.businessId);
      if (!business) {
        return res.status(401).json({ message: "Business not found" });
      }
      
      const result = await aiService.enhanceCampaign({
        originalMessage: req.body.message,
        campaignType: req.body.type,
        improvements: ['engagement', 'clarity', 'personalization'],
        businessName: business.name,
        targetAudience: req.body.targetAudience || 'customers'
      });

      console.log('AI Enhancement Result:', result);
      res.json({ 
        enhancedMessage: result.message || req.body.message,
        enhancedSubject: result.subject || req.body.subject 
      });
    } catch (error) {
      console.error("AI Campaign Enhancement Error:", error);
      if (error instanceof Error && error.message.includes('OPENAI_API_KEY')) {
        res.status(400).json({ message: "OpenAI API key not configured. Please add your API key to use AI features." });
      } else {
        res.status(500).json({ message: "Failed to enhance campaign" });
      }
    }
  });

  app.post('/api/campaigns/enhance', async (req: any, res) => {
    try {
      const { getAICampaignService } = await import('./services/aiCampaignService');
      const aiService = getAICampaignService();
      
      const result = await aiService.enhanceCampaign({
        originalMessage: req.body.originalMessage,
        campaignType: req.body.campaignType,
        improvements: req.body.improvements || ['engagement', 'clarity'],
        businessName: req.body.businessName,
        targetAudience: req.body.targetAudience,
      });

      res.json({ campaign: result });
    } catch (error) {
      console.error("AI Campaign Enhancement Error:", error);
      if (error instanceof Error && error.message.includes('OPENAI_API_KEY')) {
        res.status(400).json({ message: "OpenAI API key not configured. Please add your API key to use AI features." });
      } else {
        res.status(500).json({ message: "Failed to enhance campaign" });
      }
    }
  });

  app.post('/api/campaigns/variations', async (req: any, res) => {
    try {
      const { getAICampaignService } = await import('./services/aiCampaignService');
      const aiService = getAICampaignService();
      
      const variations = await aiService.generateCampaignVariations(
        req.body.originalMessage,
        req.body.count || 3
      );

      res.json({ variations });
    } catch (error) {
      console.error("AI Campaign Variations Error:", error);
      if (error instanceof Error && error.message.includes('OPENAI_API_KEY')) {
        res.status(400).json({ message: "OpenAI API key not configured. Please add your API key to use AI features." });
      } else {
        res.status(500).json({ message: "Failed to generate variations" });
      }
    }
  });

  // Simple AI route for dashboard (enhancement focused)
  app.post('/api/ai-campaigns/generate', requireAuth, async (req: any, res) => {
    try {
      const { getAICampaignService } = await import('./services/aiCampaignService');
      const aiService = getAICampaignService();
      
      const { type, objective, targetAudience, tone, existingContent } = req.body;
      
      if (existingContent) {
        // Enhancement mode
        const result = await aiService.enhanceCampaign({
          originalMessage: existingContent,
          campaignType: type,
          improvements: ['engagement', 'clarity', 'cta'],
          businessName: req.session.business?.name || 'Your Business',
          targetAudience: targetAudience
        });
        
        res.json({
          title: `Enhanced ${type.toUpperCase()} Campaign`,
          message: result.message,
          subject: result.subject
        });
      } else {
        // Generation mode
        const result = await aiService.generateCampaign({
          businessName: req.session.business?.name || 'Your Business',
          businessType: req.session.business?.type || 'business',
          campaignType: type,
          campaignGoal: 'promotion',
          targetAudience: targetAudience,
          tone: tone,
          keyMessage: objective
        });
        
        res.json({
          title: `AI ${type.toUpperCase()} Campaign`,
          message: result.message,
          subject: result.subject
        });
      }
    } catch (error) {
      console.error("AI Campaign Generation Error:", error);
      if (error instanceof Error && error.message.includes('OPENAI_API_KEY')) {
        res.status(400).json({ message: "OpenAI API key not configured. Please add your API key to use AI features." });
      } else {
        res.status(500).json({ message: "Failed to generate campaign content" });
      }
    }
  });

  // Test endpoints - no auth required
  app.get('/api/test/db', async (req, res) => {
    try {
      // Test database connection by checking if we can query
      const testBusiness = await storage.getBusiness(1);
      res.json({ status: 'Database connected', connectionTest: 'success' });
    } catch (error: any) {
      res.status(500).json({ error: 'Database connection failed', message: error.message });
    }
  });

  app.post('/api/test/sms', async (req, res) => {
    try {
      const { to, message } = req.body;
      const { smsService } = await import('./services/smsService');
      const result = await smsService.sendSMS(to, message);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: 'SMS test failed', message: error.message });
    }
  });

  app.post('/api/test/email', async (req, res) => {
    try {
      const { to, subject, message } = req.body;
      const { SendGridEmailService } = await import('./services/emailService');
      const emailService = new SendGridEmailService();
      const result = await emailService.sendEmail(to, subject, message);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: 'Email test failed', message: error.message });
    }
  });

  // Payment routes
  app.get('/api/payment/initiate', async (req, res) => {
    try {
      const { plan } = req.query;
      
      // Plan pricing
      const planPricing: Record<string, { amount: number; name: string }> = {
        starter: { amount: 399, name: 'Starter Plan' },
        professional: { amount: 799, name: 'Professional Plan' },
        enterprise: { amount: 1999, name: 'Enterprise Plan' }
      };

      const selectedPlan = planPricing[plan as string];
      if (!selectedPlan) {
        return res.status(400).json({ message: 'Invalid plan selected' });
      }

      // Redirect to payment selection page with plan info
      res.redirect(`/payment/select?plan=${plan}&amount=${selectedPlan.amount}&name=${encodeURIComponent(selectedPlan.name)}`);
    } catch (error: any) {
      console.error('Payment initiation error:', error);
      res.status(500).json({ message: 'Failed to initiate payment' });
    }
  });

  app.post('/api/payment/klarna/create', async (req, res) => {
    try {
      const { amount, plan, customerInfo } = req.body;
      const { KlarnaPaymentProvider } = await import('./services/payment-service');
      
      const klarnaProvider = new KlarnaPaymentProvider();
      const result = await klarnaProvider.createPayment(amount, 'SEK', {
        planName: plan,
        ...customerInfo
      });

      res.json(result);
    } catch (error: any) {
      console.error('Klarna payment creation error:', error);
      res.status(500).json({ message: 'Failed to create Klarna payment' });
    }
  });

  app.post('/api/payment/swish/create', async (req, res) => {
    try {
      const { amount, plan, customerInfo } = req.body;
      const { SwishPaymentProvider } = await import('./services/payment-service');
      
      const swishProvider = new SwishPaymentProvider();
      const result = await swishProvider.createPayment(amount, 'SEK', {
        planName: plan,
        ...customerInfo
      });

      res.json(result);
    } catch (error: any) {
      console.error('Swish payment creation error:', error);
      res.status(500).json({ message: 'Failed to create Swish payment' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
