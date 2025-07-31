import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  location: text("location"),
  experience: integer("experience"),
  currentSalary: decimal("current_salary"),
  expectedSalary: decimal("expected_salary"),
  skills: text("skills").array(),
  resumeUrl: text("resume_url"),
  profileCompleted: boolean("profile_completed").default(false),
  rewardPoints: integer("reward_points").default(0),
});

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  industry: text("industry"),
  website: text("website"),
  location: text("location"),
  logo: text("logo"),
  employeeCount: text("employee_count"),
  rating: decimal("rating"),
  reviewCount: integer("review_count").default(0),
  companyType: text("company_type"), // MNC, Startup, Product, etc.
});

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  companyId: integer("company_id").references(() => companies.id).notNull(),
  location: text("location").notNull(),
  experience: text("experience"), // "0-1 years", "2-4 years", etc.
  salaryMin: decimal("salary_min"),
  salaryMax: decimal("salary_max"),
  jobType: text("job_type"), // Full-time, Part-time, Contract, etc.
  skills: text("skills").array(),
  requirements: text("requirements").array(),
  benefits: text("benefits").array(),
  isActive: boolean("is_active").default(true),
  postedAt: timestamp("posted_at").defaultNow(),
  applicationCount: integer("application_count").default(0),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  jobId: integer("job_id").references(() => jobs.id).notNull(),
  status: text("status").notNull().default("applied"), // applied, reviewed, shortlisted, rejected, hired
  appliedAt: timestamp("applied_at").defaultNow(),
  coverLetter: text("cover_letter"),
});

export const jobCategories = pgTable("job_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  jobCount: integer("job_count").default(0),
});

// Reward Points System
export const rewardActivities = pgTable("reward_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  activityType: text("activity_type").notNull(), // blog_read, blog_write, profile_complete, friend_refer, job_apply, etc.
  points: integer("points").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rewardRedemptions = pgTable("reward_redemptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  rewardType: text("reward_type").notNull(), // premium_job_alerts, featured_profile, resume_boost, etc.
  pointsCost: integer("points_cost").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("active"), // active, expired, used
  redeemedAt: timestamp("redeemed_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  profileCompleted: true,
}).extend({
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experience: z.string().optional(),
  expectedSalary: z.number().optional(),
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  rating: true,
  reviewCount: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  postedAt: true,
  applicationCount: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  appliedAt: true,
});

export const insertJobCategorySchema = createInsertSchema(jobCategories).omit({
  id: true,
  jobCount: true,
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Search schema
export const jobSearchSchema = z.object({
  query: z.string().optional(),
  location: z.string().optional(),
  experience: z.string().optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  companyType: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type JobCategory = typeof jobCategories.$inferSelect;
export type InsertJobCategory = z.infer<typeof insertJobCategorySchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type JobSearchParams = z.infer<typeof jobSearchSchema>;

// Extended types for API responses
export type JobWithCompany = Job & {
  company: Company;
};

export type ApplicationWithJobAndCompany = Application & {
  job: JobWithCompany;
};

export type RewardActivity = typeof rewardActivities.$inferSelect;
export type InsertRewardActivity = typeof rewardActivities.$inferInsert;
export type RewardRedemption = typeof rewardRedemptions.$inferSelect;
export type InsertRewardRedemption = typeof rewardRedemptions.$inferInsert;
