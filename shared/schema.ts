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
  // Additional profile fields
  dateOfBirth: timestamp("date_of_birth"),
  gender: text("gender"),
  maritalStatus: text("marital_status"),
  nationality: text("nationality"),
  languages: text("languages").array(),
  linkedinUrl: text("linkedin_url"),
  githubUrl: text("github_url"),
  portfolioUrl: text("portfolio_url"),
  profileSummary: text("profile_summary"),
  careerObjective: text("career_objective"),
  noticePeriod: text("notice_period"),
  availability: text("availability"),
  workAuthorization: text("work_authorization"),
  willingToRelocate: boolean("willing_to_relocate").default(false),
  profileImageUrl: text("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Work Experience Table
export const workExperiences = pgTable("work_experiences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  companyName: text("company_name").notNull(),
  jobTitle: text("job_title").notNull(),
  department: text("department"),
  location: text("location"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  isCurrentJob: boolean("is_current_job").default(false),
  description: text("description"),
  achievements: text("achievements").array(),
  technologies: text("technologies").array(),
  salaryRange: text("salary_range"),
  employmentType: text("employment_type"), // Full-time, Part-time, Contract, Internship
  createdAt: timestamp("created_at").defaultNow(),
});

// Education Table
export const educations = pgTable("educations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  institutionName: text("institution_name").notNull(),
  degree: text("degree").notNull(),
  fieldOfStudy: text("field_of_study"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  isCurrentStudy: boolean("is_current_study").default(false),
  grade: text("grade"),
  percentage: decimal("percentage"),
  cgpa: decimal("cgpa"),
  description: text("description"),
  achievements: text("achievements").array(),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Certifications Table
export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  issuingOrganization: text("issuing_organization").notNull(),
  issueDate: timestamp("issue_date").notNull(),
  expiryDate: timestamp("expiry_date"),
  credentialId: text("credential_id"),
  credentialUrl: text("credential_url"),
  description: text("description"),
  skills: text("skills").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Projects Table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  role: text("role"),
  technologies: text("technologies").array(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isOngoing: boolean("is_ongoing").default(false),
  projectUrl: text("project_url"),
  githubUrl: text("github_url"),
  achievements: text("achievements").array(),
  teamSize: integer("team_size"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Awards and Recognitions Table
export const awards = pgTable("awards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  issuingOrganization: text("issuing_organization").notNull(),
  dateReceived: timestamp("date_received").notNull(),
  description: text("description"),
  category: text("category"), // Academic, Professional, Sports, etc.
  level: text("level"), // International, National, State, Local
  createdAt: timestamp("created_at").defaultNow(),
});

// References Table
export const references = pgTable("references", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  designation: text("designation"),
  company: text("company"),
  email: text("email"),
  phone: text("phone"),
  relationship: text("relationship"), // Manager, Colleague, Client, etc.
  yearsKnown: integer("years_known"),
  isContactable: boolean("is_contactable").default(true),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Skills Assessment Table
export const skillAssessments = pgTable("skill_assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  skillName: text("skill_name").notNull(),
  proficiencyLevel: text("proficiency_level").notNull(), // Beginner, Intermediate, Advanced, Expert
  yearsOfExperience: integer("years_of_experience"),
  lastUsed: timestamp("last_used"),
  isVerified: boolean("is_verified").default(false),
  verificationSource: text("verification_source"),
  endorsements: integer("endorsements").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Resume Upload History
export const resumeUploads = pgTable("resume_uploads", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"),
  uploadDate: timestamp("upload_date").defaultNow(),
  isActive: boolean("is_active").default(true),
  parsedData: text("parsed_data"), // JSON string of extracted data
  parsingStatus: text("parsing_status").default("pending"), // pending, completed, failed
  extractedSkills: text("extracted_skills").array(),
  extractedExperience: text("extracted_experience"),
  extractedEducation: text("extracted_education"),
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
}).extend({
  skills: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  appliedAt: true,
});

export const insertJobCategorySchema = createInsertSchema(jobCategories).omit({
  id: true,
  jobCount: true,
});

// Saved Jobs table
export const savedJobs = pgTable("saved_jobs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  jobId: integer("job_id").references(() => jobs.id).notNull(),
  savedAt: timestamp("saved_at").defaultNow(),
});

// Job Alerts table
export const jobAlerts = pgTable("job_alerts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  keywords: text("keywords"),
  location: text("location"),
  experienceLevel: text("experience_level"),
  salaryMin: decimal("salary_min"),
  salaryMax: decimal("salary_max"),
  jobType: text("job_type"),
  skills: text("skills").array(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Followed Companies table
export const followedCompanies = pgTable("followed_companies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  companyId: integer("company_id").references(() => companies.id).notNull(),
  followedAt: timestamp("followed_at").defaultNow(),
});

// Messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  receiverId: integer("receiver_id").references(() => users.id).notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  sentAt: timestamp("sent_at").defaultNow(),
});

// Company Reviews table
export const companyReviews = pgTable("company_reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  companyId: integer("company_id").references(() => companies.id).notNull(),
  rating: decimal("rating").notNull(),
  title: text("title").notNull(),
  pros: text("pros"),
  cons: text("cons"),
  isAnonymous: boolean("is_anonymous").default(false),
  recommendToFriend: boolean("recommend_to_friend").default(false),
  createdAt: timestamp("created_at").defaultNow(),
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

// New candidate functionality schemas
export const insertSavedJobSchema = createInsertSchema(savedJobs).omit({
  id: true,
  savedAt: true,
});

export const insertJobAlertSchema = createInsertSchema(jobAlerts).omit({
  id: true,
  createdAt: true,
}).extend({
  title: z.string().min(3, "Title must be at least 3 characters"),
  skills: z.array(z.string()).optional(),
});

export const insertFollowedCompanySchema = createInsertSchema(followedCompanies).omit({
  id: true,
  followedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  sentAt: true,
}).extend({
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  content: z.string().min(10, "Message must be at least 10 characters"),
});

export const insertCompanyReviewSchema = createInsertSchema(companyReviews).omit({
  id: true,
  createdAt: true,
}).extend({
  rating: z.number().min(1).max(5),
  title: z.string().min(5, "Title must be at least 5 characters"),
  pros: z.string().optional(),
  cons: z.string().optional(),
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
export type InsertWorkExperience = typeof workExperiences.$inferInsert;
export type WorkExperience = typeof workExperiences.$inferSelect;
export type InsertEducation = typeof educations.$inferInsert;
export type Education = typeof educations.$inferSelect;
export type InsertCertification = typeof certifications.$inferInsert;
export type Certification = typeof certifications.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type InsertAward = typeof awards.$inferInsert;
export type Award = typeof awards.$inferSelect;
export type InsertReference = typeof references.$inferInsert;
export type Reference = typeof references.$inferSelect;
export type InsertSkillAssessment = typeof skillAssessments.$inferInsert;
export type SkillAssessment = typeof skillAssessments.$inferSelect;
export type InsertResumeUpload = typeof resumeUploads.$inferInsert;
export type ResumeUpload = typeof resumeUploads.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type JobCategory = typeof jobCategories.$inferSelect;
export type InsertJobCategory = z.infer<typeof insertJobCategorySchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type JobSearchParams = z.infer<typeof jobSearchSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type SavedJob = typeof savedJobs.$inferSelect;
export type InsertSavedJob = z.infer<typeof insertSavedJobSchema>;
export type JobAlert = typeof jobAlerts.$inferSelect;
export type InsertJobAlert = z.infer<typeof insertJobAlertSchema>;
export type FollowedCompany = typeof followedCompanies.$inferSelect;
export type InsertFollowedCompany = z.infer<typeof insertFollowedCompanySchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type CompanyReview = typeof companyReviews.$inferSelect;
export type InsertCompanyReview = z.infer<typeof insertCompanyReviewSchema>;

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

export type BlogView = typeof blogViews.$inferSelect;
export type InsertBlogView = typeof blogViews.$inferInsert;
export type DailyLogin = typeof dailyLogins.$inferSelect;
export type InsertDailyLogin = typeof dailyLogins.$inferInsert;
