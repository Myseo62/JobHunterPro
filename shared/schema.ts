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
  role: text("role").notNull().default("candidate"), // candidate, employer_admin, employer_hr
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
  subscriptionPlan: text("subscription_plan").default("free"), // free, basic, premium, enterprise
  monthlySearchLimit: integer("monthly_search_limit").default(10),
  monthlyDownloadLimit: integer("monthly_download_limit").default(5),
  searchesUsed: integer("searches_used").default(0),
  downloadsUsed: integer("downloads_used").default(0),
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Company-User relationship for employers
export const companyEmployees = pgTable("company_employees", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").references(() => companies.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  role: text("role").notNull(), // admin, hr, recruiter
  permissions: text("permissions").array(), // post_jobs, search_candidates, manage_employees, etc.
  isActive: boolean("is_active").default(true),
  joinedAt: timestamp("joined_at").defaultNow(),
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

// Candidate search tracking for employers
export const candidateSearches = pgTable("candidate_searches", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").references(() => companies.id).notNull(),
  searcherId: integer("searcher_id").references(() => users.id).notNull(), // HR/Admin who performed search
  searchQuery: text("search_query"),
  filters: text("filters"), // JSON string of search filters
  resultsCount: integer("results_count").default(0),
  searchedAt: timestamp("searched_at").defaultNow(),
});

// Candidate profile downloads tracking
export const candidateDownloads = pgTable("candidate_downloads", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").references(() => companies.id).notNull(),
  downloaderId: integer("downloader_id").references(() => users.id).notNull(),
  candidateId: integer("candidate_id").references(() => users.id).notNull(),
  downloadType: text("download_type").notNull(), // resume, profile, contact_info
  downloadedAt: timestamp("downloaded_at").defaultNow(),
});

// Blog posts by candidates
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  tags: text("tags").array(),
  category: text("category"), // tech, career, experience, tips, etc.
  isPublished: boolean("is_published").default(false),
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog post views for tracking
export const blogViews = pgTable("blog_views", {
  id: serial("id").primaryKey(),
  blogId: integer("blog_id").references(() => blogPosts.id).notNull(),
  userId: integer("user_id").references(() => users.id), // Can be null for anonymous views
  viewedAt: timestamp("viewed_at").defaultNow(),
});

// Friend referrals tracking
export const friendReferrals = pgTable("friend_referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").references(() => users.id).notNull(),
  referredEmail: text("referred_email").notNull(),
  referredUserId: integer("referred_user_id").references(() => users.id), // Set when they register
  status: text("status").notNull().default("pending"), // pending, completed, failed
  pointsAwarded: integer("points_awarded").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Daily login tracking
export const dailyLogins = pgTable("daily_logins", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  loginDate: timestamp("login_date").defaultNow(),
  pointsAwarded: integer("points_awarded").default(5),
});

// Company subscription plans
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // Free, Basic, Premium, Enterprise
  price: decimal("price").notNull(),
  currency: text("currency").default("USD"),
  billingPeriod: text("billing_period").notNull(), // monthly, yearly
  searchLimit: integer("search_limit").notNull(),
  downloadLimit: integer("download_limit").notNull(),
  jobPostingLimit: integer("job_posting_limit").notNull(),
  features: text("features").array(), // advanced_analytics, priority_support, etc.
  isActive: boolean("is_active").default(true),
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

// Blog schemas
export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  viewCount: true,
  likeCount: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
});

// Friend referral schema
export const friendReferralSchema = z.object({
  referredEmail: z.string().email("Valid email required"),
});

// Login schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const employerRegistrationSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  companyName: z.string().min(2),
  companyWebsite: z.string().url().optional(),
  companySize: z.string(),
  industry: z.string(),
  role: z.literal("employer_admin"),
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
export type CompanyEmployee = typeof companyEmployees.$inferSelect;
export type InsertCompanyEmployee = typeof companyEmployees.$inferInsert;
export type CandidateSearch = typeof candidateSearches.$inferSelect;
export type InsertCandidateSearch = typeof candidateSearches.$inferInsert;
export type CandidateDownload = typeof candidateDownloads.$inferSelect;
export type InsertCandidateDownload = typeof candidateDownloads.$inferInsert;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = typeof subscriptionPlans.$inferInsert;
export type EmployerRegistrationData = z.infer<typeof employerRegistrationSchema>;

// Blog types
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogView = typeof blogViews.$inferSelect;
export type FriendReferral = typeof friendReferrals.$inferSelect;
export type InsertFriendReferral = z.infer<typeof friendReferralSchema>;
export type DailyLogin = typeof dailyLogins.$inferSelect;
