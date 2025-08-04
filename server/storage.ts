import {
  businesses,
  customers,
  campaigns,
  campaignDeliveries,
  type Business,
  type Customer,
  type Campaign,
  type CampaignDelivery,
  type InsertBusiness,
  type InsertCustomer,
  type InsertCampaign,
  users,
  type User, 
  type InsertUser
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // Business operations
  getBusiness(id: number): Promise<Business | undefined>;
  getBusinessByEmail(email: string): Promise<Business | undefined>;
  createBusiness(business: InsertBusiness): Promise<Business>;
  updateBusiness(id: number, updates: Partial<InsertBusiness>): Promise<Business>;

  // Customer operations
  getCustomer(id: number): Promise<Customer | undefined>;
  getCustomersByBusiness(businessId: number): Promise<Customer[]>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, updates: Partial<InsertCustomer>): Promise<Customer>;
  deleteCustomer(id: number): Promise<void>;

  // Campaign operations
  getCampaign(id: number): Promise<Campaign | undefined>;
  getCampaignsByBusiness(businessId: number): Promise<Campaign[]>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, updates: Partial<InsertCampaign>): Promise<Campaign>;
  deleteCampaign(id: number): Promise<void>;

  // Campaign delivery operations
  createCampaignDelivery(delivery: Omit<CampaignDelivery, 'id'>): Promise<CampaignDelivery>;
  updateCampaignDelivery(id: number, updates: Partial<CampaignDelivery>): Promise<CampaignDelivery>;
  getCampaignDeliveries(campaignId: number): Promise<CampaignDelivery[]>;

  // Legacy user operations (for compatibility)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  // Business operations
  async getBusiness(id: number): Promise<Business | undefined> {
    const [business] = await db.select().from(businesses).where(eq(businesses.id, id));
    return business;
  }

  async getBusinessByEmail(email: string): Promise<Business | undefined> {
    const [business] = await db.select().from(businesses).where(eq(businesses.email, email));
    return business;
  }

  async createBusiness(business: InsertBusiness): Promise<Business> {
    const [newBusiness] = await db
      .insert(businesses)
      .values(business)
      .returning();
    return newBusiness;
  }

  async updateBusiness(id: number, updates: Partial<InsertBusiness>): Promise<Business> {
    const [updatedBusiness] = await db
      .update(businesses)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(businesses.id, id))
      .returning();
    return updatedBusiness;
  }

  // Customer operations
  async getCustomer(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }

  async getCustomersByBusiness(businessId: number): Promise<Customer[]> {
    return await db
      .select()
      .from(customers)
      .where(eq(customers.businessId, businessId))
      .orderBy(desc(customers.createdAt));
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db
      .insert(customers)
      .values(customer)
      .returning();
    return newCustomer;
  }

  async updateCustomer(id: number, updates: Partial<InsertCustomer>): Promise<Customer> {
    const [updatedCustomer] = await db
      .update(customers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(customers.id, id))
      .returning();
    return updatedCustomer;
  }

  async deleteCustomer(id: number): Promise<void> {
    await db.delete(customers).where(eq(customers.id, id));
  }

  // Campaign operations
  async getCampaign(id: number): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign;
  }

  async getCampaignsByBusiness(businessId: number): Promise<Campaign[]> {
    return await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.businessId, businessId))
      .orderBy(desc(campaigns.createdAt));
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const [newCampaign] = await db
      .insert(campaigns)
      .values(campaign)
      .returning();
    return newCampaign;
  }

  async updateCampaign(id: number, updates: Partial<InsertCampaign>): Promise<Campaign> {
    const [updatedCampaign] = await db
      .update(campaigns)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(campaigns.id, id))
      .returning();
    return updatedCampaign;
  }

  async deleteCampaign(id: number): Promise<void> {
    await db.delete(campaigns).where(eq(campaigns.id, id));
  }

  // Campaign delivery operations
  async createCampaignDelivery(delivery: Omit<CampaignDelivery, 'id'>): Promise<CampaignDelivery> {
    const [newDelivery] = await db
      .insert(campaignDeliveries)
      .values(delivery)
      .returning();
    return newDelivery;
  }

  async updateCampaignDelivery(id: number, updates: Partial<CampaignDelivery>): Promise<CampaignDelivery> {
    const [updatedDelivery] = await db
      .update(campaignDeliveries)
      .set(updates)
      .where(eq(campaignDeliveries.id, id))
      .returning();
    return updatedDelivery;
  }

  async getCampaignDeliveries(campaignId: number): Promise<CampaignDelivery[]> {
    return await db
      .select()
      .from(campaignDeliveries)
      .where(eq(campaignDeliveries.campaignId, campaignId));
  }

  // Legacy user operations (for compatibility)
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
}

export const storage = new DatabaseStorage();
