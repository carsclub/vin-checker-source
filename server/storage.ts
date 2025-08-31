import {
  users,
  vinChecks,
  vinSearches,
  carHistoryReports,
  paymentRecords,
  type User,
  type InsertUser,
  type VinCheck,
  type InsertVinCheck,
  type VinSearch,
  type InsertVinSearch,
  type CarHistoryReport,
  type InsertCarHistoryReport,
  type PaymentRecord,
  type InsertPaymentRecord,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // VIN Check operations
  getVinCheck(vin: string): Promise<VinCheck | undefined>;
  createVinCheck(vinCheck: InsertVinCheck): Promise<VinCheck>;
  getAllVinChecks(): Promise<VinCheck[]>;

  // VIN search tracking operations
  createVinSearch(insertVinSearch: InsertVinSearch): Promise<VinSearch>;
  updateVinSearchEmailStatus(id: string, emailSent: boolean): Promise<void>;
  getAllVinSearches(): Promise<VinSearch[]>;

  // Payment tracking operations
  createPaymentRecord(insertPaymentRecord: InsertPaymentRecord): Promise<PaymentRecord>;
  updatePaymentStatus(paymentIntentId: string, status: string, amountPaid?: number): Promise<void>;
  getPaymentRecord(paymentIntentId: string): Promise<PaymentRecord | undefined>;
  getPaymentsByUser(userEmail: string): Promise<PaymentRecord[]>;
  getPaymentsByVin(vin: string): Promise<PaymentRecord[]>;
  getAllPaymentRecords(): Promise<PaymentRecord[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
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

  async getVinCheck(vin: string): Promise<VinCheck | undefined> {
    const [vinCheck] = await db.select().from(vinChecks).where(eq(vinChecks.vin, vin));
    return vinCheck;
  }

  async createVinCheck(insertVinCheck: InsertVinCheck): Promise<VinCheck> {
    const [vinCheck] = await db
      .insert(vinChecks)
      .values(insertVinCheck)
      .returning();
    return vinCheck;
  }

  async getAllVinChecks(): Promise<VinCheck[]> {
    return await db.select().from(vinChecks);
  }

  async createVinSearch(insertVinSearch: InsertVinSearch): Promise<VinSearch> {
    const [vinSearch] = await db
      .insert(vinSearches)
      .values(insertVinSearch)
      .returning();
    return vinSearch;
  }

  async updateVinSearchEmailStatus(id: string, emailSent: boolean): Promise<void> {
    await db
      .update(vinSearches)
      .set({ 
        emailSent,
        emailSentAt: emailSent ? new Date() : null
      })
      .where(eq(vinSearches.id, id));
  }

  async getAllVinSearches(): Promise<VinSearch[]> {
    return await db.select().from(vinSearches);
  }

  // Car History Report operations
  async getCarHistoryReport(vin: string): Promise<CarHistoryReport | undefined> {
    const [report] = await db
      .select()
      .from(carHistoryReports)
      .where(eq(carHistoryReports.vin, vin))
      .limit(1);
    return report;
  }

  async createCarHistoryReport(reportData: InsertCarHistoryReport): Promise<CarHistoryReport> {
    const [report] = await db
      .insert(carHistoryReports)
      .values(reportData)
      .returning();
    return report;
  }

  // Payment tracking operations
  async createPaymentRecord(insertPaymentRecord: InsertPaymentRecord): Promise<PaymentRecord> {
    const [paymentRecord] = await db
      .insert(paymentRecords)
      .values(insertPaymentRecord)
      .returning();
    return paymentRecord;
  }

  async updatePaymentStatus(paymentIntentId: string, status: string, amountPaid?: number): Promise<void> {
    const updateData: any = {
      paymentStatus: status,
      updatedAt: new Date(),
    };
    
    if (amountPaid !== undefined) {
      updateData.amountPaid = amountPaid;
    }

    await db
      .update(paymentRecords)
      .set(updateData)
      .where(eq(paymentRecords.stripePaymentIntentId, paymentIntentId));
  }

  async getPaymentRecord(paymentIntentId: string): Promise<PaymentRecord | undefined> {
    const [paymentRecord] = await db
      .select()
      .from(paymentRecords)
      .where(eq(paymentRecords.stripePaymentIntentId, paymentIntentId));
    return paymentRecord;
  }

  async getPaymentsByUser(userEmail: string): Promise<PaymentRecord[]> {
    return await db
      .select()
      .from(paymentRecords)
      .where(eq(paymentRecords.userEmail, userEmail));
  }

  async getPaymentsByVin(vin: string): Promise<PaymentRecord[]> {
    return await db
      .select()
      .from(paymentRecords)
      .where(eq(paymentRecords.vin, vin));
  }

  async getAllPaymentRecords(): Promise<PaymentRecord[]> {
    return await db.select().from(paymentRecords);
  }
}

export const storage = new DatabaseStorage();
