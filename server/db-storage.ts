import { users, companies, jobs, applications, jobCategories, companyEmployees, blogPosts, friendReferrals, savedJobs, jobAlerts, followedCompanies, messages, companyReviews, resumeUploads, type User, type InsertUser, type Company, type InsertCompany, type Job, type InsertJob, type Application, type InsertApplication, type JobCategory, type InsertJobCategory, type JobWithCompany, type ApplicationWithJobAndCompany, type JobSearchParams, type CompanyEmployee, type InsertCompanyEmployee, type SavedJob, type InsertSavedJob, type JobAlert, type InsertJobAlert, type FollowedCompany, type InsertFollowedCompany, type Message, type InsertMessage, type CompanyReview, type InsertCompanyReview, type ResumeUpload, type InsertResumeUpload } from "@shared/schema";
import { db } from "./db";
import { eq, and, like, gte, lte, desc, sql, ilike, or } from "drizzle-orm";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Company operations
  async getCompany(id: number): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company || undefined;
  }

  async getCompanies(): Promise<Company[]> {
    return await db.select().from(companies);
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const [company] = await db
      .insert(companies)
      .values(insertCompany)
      .returning();
    return company;
  }

  async getFeaturedCompanies(): Promise<Company[]> {
    return await db
      .select()
      .from(companies)
      .orderBy(desc(companies.rating))
      .limit(6);
  }

  async getCompanyIndustries(): Promise<string[]> {
    const result = await db
      .selectDistinct({ industry: companies.industry })
      .from(companies)
      .where(sql`${companies.industry} IS NOT NULL`);
    
    return result.map(r => r.industry).filter(Boolean) as string[];
  }

  // Job operations
  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job || undefined;
  }

  async getJobWithCompany(id: number): Promise<JobWithCompany | undefined> {
    const result = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        description: jobs.description,
        location: jobs.location,
        experience: jobs.experience,
        salaryMin: jobs.salaryMin,
        salaryMax: jobs.salaryMax,
        jobType: jobs.jobType,
        skills: jobs.skills,
        requirements: jobs.requirements,
        benefits: jobs.benefits,
        isActive: jobs.isActive,
        postedAt: jobs.postedAt,
        applicationCount: jobs.applicationCount,
        companyId: jobs.companyId,
        company: {
          id: companies.id,
          name: companies.name,
          description: companies.description,
          industry: companies.industry,
          website: companies.website,
          location: companies.location,
          logo: companies.logo,
          employeeCount: companies.employeeCount,
          rating: companies.rating,
          reviewCount: companies.reviewCount,
          companyType: companies.companyType,
        }
      })
      .from(jobs)
      .leftJoin(companies, eq(jobs.companyId, companies.id))
      .where(eq(jobs.id, id));

    return result[0] || undefined;
  }

  async getJobs(params?: JobSearchParams): Promise<JobWithCompany[]> {
    let query = db
      .select({
        id: jobs.id,
        title: jobs.title,
        description: jobs.description,
        location: jobs.location,
        experience: jobs.experience,
        salaryMin: jobs.salaryMin,
        salaryMax: jobs.salaryMax,
        jobType: jobs.jobType,
        skills: jobs.skills,
        requirements: jobs.requirements,
        benefits: jobs.benefits,
        isActive: jobs.isActive,
        postedAt: jobs.postedAt,
        applicationCount: jobs.applicationCount,
        companyId: jobs.companyId,
        company: {
          id: companies.id,
          name: companies.name,
          description: companies.description,
          industry: companies.industry,
          website: companies.website,
          location: companies.location,
          logo: companies.logo,
          employeeCount: companies.employeeCount,
          rating: companies.rating,
          reviewCount: companies.reviewCount,
          companyType: companies.companyType,
        }
      })
      .from(jobs)
      .leftJoin(companies, eq(jobs.companyId, companies.id))
      .where(eq(jobs.isActive, true));

    // Apply filters if provided
    if (params?.search) {
      query = query.where(
        or(
          ilike(jobs.title, `%${params.search}%`),
          ilike(jobs.description, `%${params.search}%`)
        )
      );
    }

    if (params?.location) {
      query = query.where(ilike(jobs.location, `%${params.location}%`));
    }

    if (params?.companyId) {
      query = query.where(eq(jobs.companyId, params.companyId));
    }

    // Order by posted date (most recent first)
    query = query.orderBy(desc(jobs.postedAt));

    return await query;
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db
      .insert(jobs)
      .values({
        ...insertJob,
        applicationCount: 0
      })
      .returning();
    return job;
  }

  async updateJob(id: number, updateData: Partial<InsertJob>): Promise<Job | undefined> {
    const [job] = await db
      .update(jobs)
      .set(updateData)
      .where(eq(jobs.id, id))
      .returning();
    return job || undefined;
  }

  async searchJobs(query: string, filters?: any): Promise<Job[]> {
    let queryBuilder = db.select().from(jobs);
    
    if (query) {
      queryBuilder = queryBuilder.where(
        or(
          ilike(jobs.title, `%${query}%`),
          ilike(jobs.description, `%${query}%`),
          sql`${jobs.skills}::text ILIKE '%' || ${query} || '%'`
        )
      );
    }
    
    return await queryBuilder.where(eq(jobs.isActive, true));
  }

  // Application operations
  async getApplication(id: number): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application || undefined;
  }

  async getApplicationsByUser(userId: number): Promise<ApplicationWithJobAndCompany[]> {
    const result = await db
      .select({
        id: applications.id,
        userId: applications.userId,
        jobId: applications.jobId,
        status: applications.status,
        appliedAt: applications.appliedAt,
        coverLetter: applications.coverLetter,
        job: {
          id: jobs.id,
          title: jobs.title,
          description: jobs.description,
          location: jobs.location,
          experience: jobs.experience,
          salaryMin: jobs.salaryMin,
          salaryMax: jobs.salaryMax,
          jobType: jobs.jobType,
          skills: jobs.skills,
          requirements: jobs.requirements,
          benefits: jobs.benefits,
          isActive: jobs.isActive,
          postedAt: jobs.postedAt,
          applicationCount: jobs.applicationCount,
          companyId: jobs.companyId,
        },
        company: {
          id: companies.id,
          name: companies.name,
          description: companies.description,
          industry: companies.industry,
          website: companies.website,
          location: companies.location,
          logo: companies.logo,
          employeeCount: companies.employeeCount,
          rating: companies.rating,
          reviewCount: companies.reviewCount,
          companyType: companies.companyType,
        }
      })
      .from(applications)
      .leftJoin(jobs, eq(applications.jobId, jobs.id))
      .leftJoin(companies, eq(jobs.companyId, companies.id))
      .where(eq(applications.userId, userId))
      .orderBy(desc(applications.appliedAt));

    return result;
  }

  async getApplicationsByJob(jobId: number): Promise<Application[]> {
    return await db
      .select()
      .from(applications)
      .where(eq(applications.jobId, jobId))
      .orderBy(desc(applications.appliedAt));
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const [application] = await db
      .insert(applications)
      .values(insertApplication)
      .returning();

    // Increment application count for the job
    await db
      .update(jobs)
      .set({
        applicationCount: sql`${jobs.applicationCount} + 1`
      })
      .where(eq(jobs.id, insertApplication.jobId));

    return application;
  }

  async updateApplication(id: number, updateData: Partial<InsertApplication>): Promise<Application | undefined> {
    const [application] = await db
      .update(applications)
      .set(updateData)
      .where(eq(applications.id, id))
      .returning();
    return application || undefined;
  }

  async hasUserApplied(userId: number, jobId: number): Promise<boolean> {
    const [application] = await db
      .select({ id: applications.id })
      .from(applications)
      .where(and(eq(applications.userId, userId), eq(applications.jobId, jobId)));
    
    return !!application;
  }

  // Job category operations
  async getJobCategories(): Promise<JobCategory[]> {
    return await db.select().from(jobCategories);
  }

  async createJobCategory(insertCategory: InsertJobCategory): Promise<JobCategory> {
    const [category] = await db
      .insert(jobCategories)
      .values({
        ...insertCategory,
        jobCount: 0
      })
      .returning();
    return category;
  }

  // Company operations (for employers)
  async createCompanyEmployee(employee: InsertCompanyEmployee): Promise<CompanyEmployee> {
    const [newEmployee] = await db
      .insert(companyEmployees)
      .values(employee)
      .returning();
    return newEmployee;
  }

  async getCompanyByEmployerId(userId: number): Promise<Company | undefined> {
    // Get company through company_employees relationship
    const result = await db
      .select({ company: companies })
      .from(companies)
      .innerJoin(companyEmployees, eq(companies.id, companyEmployees.companyId))
      .where(eq(companyEmployees.userId, userId))
      .limit(1);
    
    return result[0]?.company;
  }

  async getEmployerStats(companyId: number): Promise<{ activeJobs: number; totalApplications: number; }> {
    // Get active jobs count
    const jobsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(jobs)
      .where(and(eq(jobs.companyId, companyId), eq(jobs.isActive, true)));
    
    // Get total applications count for company jobs
    const applicationsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(applications)
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .where(eq(jobs.companyId, companyId));
    
    return {
      activeJobs: jobsResult[0]?.count || 0,
      totalApplications: applicationsResult[0]?.count || 0,
    };
  }

  // Blog methods
  async getAllBlogs(): Promise<any[]> {
    const blogs = await db.select({
      id: blogPosts.id,
      title: blogPosts.title,
      excerpt: blogPosts.excerpt,
      content: blogPosts.content,
      category: blogPosts.category,
      tags: blogPosts.tags,
      viewCount: blogPosts.viewCount,
      likeCount: blogPosts.likeCount,
      createdAt: blogPosts.createdAt,
      author: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
      }
    })
    .from(blogPosts)
    .innerJoin(users, eq(blogPosts.userId, users.id))
    .where(eq(blogPosts.isPublished, true))
    .orderBy(desc(blogPosts.createdAt));
    
    return blogs;
  }

  async getBlogById(id: number): Promise<any | null> {
    const [blog] = await db.select({
      id: blogPosts.id,
      title: blogPosts.title,
      excerpt: blogPosts.excerpt,
      content: blogPosts.content,
      category: blogPosts.category,
      tags: blogPosts.tags,
      viewCount: blogPosts.viewCount,
      likeCount: blogPosts.likeCount,
      createdAt: blogPosts.createdAt,
      author: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
      }
    })
    .from(blogPosts)
    .innerJoin(users, eq(blogPosts.userId, users.id))
    .where(eq(blogPosts.id, id))
    .limit(1);
    
    return blog || null;
  }

  async createBlog(blogData: any): Promise<any> {
    const [blog] = await db.insert(blogPosts)
      .values(blogData)
      .returning();
    return blog;
  }

  async getUserBlogs(userId: number): Promise<any[]> {
    return await db.select()
      .from(blogPosts)
      .where(eq(blogPosts.userId, userId))
      .orderBy(desc(blogPosts.createdAt));
  }

  // Friend referral methods
  async createFriendReferral(referralData: any): Promise<any> {
    const [referral] = await db.insert(friendReferrals)
      .values(referralData)
      .returning();
    return referral;
  }

  // Blog interaction methods
  async incrementBlogView(blogId: number): Promise<void> {
    await db.update(blogPosts)
      .set({ viewCount: sql`${blogPosts.viewCount} + 1` })
      .where(eq(blogPosts.id, blogId));
  }

  async incrementBlogLike(blogId: number): Promise<void> {
    await db.update(blogPosts)
      .set({ likeCount: sql`${blogPosts.likeCount} + 1` })
      .where(eq(blogPosts.id, blogId));
  }

  // Saved Jobs methods
  async saveJob(userId: number, jobId: number): Promise<SavedJob> {
    const [savedJob] = await db.insert(savedJobs)
      .values({ userId, jobId })
      .returning();
    return savedJob;
  }

  async unsaveJob(userId: number, jobId: number): Promise<void> {
    await db.delete(savedJobs)
      .where(and(eq(savedJobs.userId, userId), eq(savedJobs.jobId, jobId)));
  }

  async getSavedJobsByUser(userId: number): Promise<any[]> {
    return await db.select({
      id: savedJobs.id,
      savedAt: savedJobs.savedAt,
      job: {
        id: jobs.id,
        title: jobs.title,
        location: jobs.location,
        salaryMin: jobs.salaryMin,
        salaryMax: jobs.salaryMax,
        jobType: jobs.jobType,
        postedAt: jobs.postedAt,
        company: {
          id: companies.id,
          name: companies.name,
          logo: companies.logo,
        }
      }
    })
    .from(savedJobs)
    .innerJoin(jobs, eq(savedJobs.jobId, jobs.id))
    .innerJoin(companies, eq(jobs.companyId, companies.id))
    .where(eq(savedJobs.userId, userId))
    .orderBy(desc(savedJobs.savedAt));
  }

  async isJobSaved(userId: number, jobId: number): Promise<boolean> {
    const [result] = await db.select()
      .from(savedJobs)
      .where(and(eq(savedJobs.userId, userId), eq(savedJobs.jobId, jobId)))
      .limit(1);
    return !!result;
  }

  // Job Alerts methods
  async createJobAlert(alertData: InsertJobAlert): Promise<JobAlert> {
    const [alert] = await db.insert(jobAlerts)
      .values(alertData)
      .returning();
    return alert;
  }

  async getJobAlertsByUser(userId: number): Promise<JobAlert[]> {
    return await db.select()
      .from(jobAlerts)
      .where(eq(jobAlerts.userId, userId))
      .orderBy(desc(jobAlerts.createdAt));
  }

  async updateJobAlert(id: number, updateData: Partial<InsertJobAlert>): Promise<JobAlert | undefined> {
    const [alert] = await db.update(jobAlerts)
      .set(updateData)
      .where(eq(jobAlerts.id, id))
      .returning();
    return alert || undefined;
  }

  async deleteJobAlert(id: number): Promise<void> {
    await db.delete(jobAlerts).where(eq(jobAlerts.id, id));
  }

  // Followed Companies methods
  async followCompany(userId: number, companyId: number): Promise<FollowedCompany> {
    const [followedCompany] = await db.insert(followedCompanies)
      .values({ userId, companyId })
      .returning();
    return followedCompany;
  }

  async unfollowCompany(userId: number, companyId: number): Promise<void> {
    await db.delete(followedCompanies)
      .where(and(eq(followedCompanies.userId, userId), eq(followedCompanies.companyId, companyId)));
  }

  async getFollowedCompaniesByUser(userId: number): Promise<any[]> {
    return await db.select({
      id: followedCompanies.id,
      followedAt: followedCompanies.followedAt,
      company: {
        id: companies.id,
        name: companies.name,
        logo: companies.logo,
        industry: companies.industry,
        location: companies.location,
        rating: companies.rating,
        reviewCount: companies.reviewCount,
      }
    })
    .from(followedCompanies)
    .innerJoin(companies, eq(followedCompanies.companyId, companies.id))
    .where(eq(followedCompanies.userId, userId))
    .orderBy(desc(followedCompanies.followedAt));
  }

  async isCompanyFollowed(userId: number, companyId: number): Promise<boolean> {
    const [result] = await db.select()
      .from(followedCompanies)
      .where(and(eq(followedCompanies.userId, userId), eq(followedCompanies.companyId, companyId)))
      .limit(1);
    return !!result;
  }

  // Messages methods
  async sendMessage(messageData: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages)
      .values(messageData)
      .returning();
    return message;
  }

  async getMessagesByUser(userId: number): Promise<any[]> {
    return await db.select({
      id: messages.id,
      subject: messages.subject,
      content: messages.content,
      isRead: messages.isRead,
      sentAt: messages.sentAt,
      sender: {
        id: sql`sender.id`,
        firstName: sql`sender.first_name`,
        lastName: sql`sender.last_name`,
      },
      receiver: {
        id: sql`receiver.id`,
        firstName: sql`receiver.first_name`,
        lastName: sql`receiver.last_name`,
      }
    })
    .from(messages)
    .leftJoin(sql`${users} as sender`, eq(messages.senderId, sql`sender.id`))
    .leftJoin(sql`${users} as receiver`, eq(messages.receiverId, sql`receiver.id`))
    .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
    .orderBy(desc(messages.sentAt));
  }

  async markMessageAsRead(messageId: number): Promise<void> {
    await db.update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, messageId));
  }

  // Company Reviews methods
  async createCompanyReview(reviewData: InsertCompanyReview): Promise<CompanyReview> {
    const [review] = await db.insert(companyReviews)
      .values(reviewData)
      .returning();
    return review;
  }

  async getCompanyReviews(companyId: number): Promise<any[]> {
    return await db.select({
      id: companyReviews.id,
      rating: companyReviews.rating,
      title: companyReviews.title,
      pros: companyReviews.pros,
      cons: companyReviews.cons,
      isAnonymous: companyReviews.isAnonymous,
      recommendToFriend: companyReviews.recommendToFriend,
      createdAt: companyReviews.createdAt,
      reviewer: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
      }
    })
    .from(companyReviews)
    .innerJoin(users, eq(companyReviews.userId, users.id))
    .where(eq(companyReviews.companyId, companyId))
    .orderBy(desc(companyReviews.createdAt));
  }

  // Dashboard stats methods
  async getDashboardStats(userId: number): Promise<{
    savedJobsCount: number;
    applicationsCount: number;
    profileViews: number;
    jobAlertsCount: number;
  }> {
    const [savedJobsResult] = await db.select({ count: sql<number>`count(*)` })
      .from(savedJobs)
      .where(eq(savedJobs.userId, userId));

    const [applicationsResult] = await db.select({ count: sql<number>`count(*)` })
      .from(applications)
      .where(eq(applications.userId, userId));

    const [jobAlertsResult] = await db.select({ count: sql<number>`count(*)` })
      .from(jobAlerts)
      .where(and(eq(jobAlerts.userId, userId), eq(jobAlerts.isActive, true)));

    return {
      savedJobsCount: savedJobsResult?.count || 0,
      applicationsCount: applicationsResult?.count || 0,
      profileViews: Math.floor(Math.random() * 100) + 50, // Simulated for now
      jobAlertsCount: jobAlertsResult?.count || 0,
    };
  }

  // Resume operations
  async createResumeUpload(resume: InsertResumeUpload): Promise<ResumeUpload> {
    const [created] = await db.insert(resumeUploads).values(resume).returning();
    return created;
  }

  async getUserResumeVersions(userId: number): Promise<ResumeUpload[]> {
    return await db
      .select()
      .from(resumeUploads)
      .where(eq(resumeUploads.userId, userId))
      .orderBy(desc(resumeUploads.uploadDate))
      .limit(3);
  }

  async getResumeUpload(id: number): Promise<ResumeUpload | undefined> {
    const [resume] = await db
      .select()
      .from(resumeUploads)
      .where(eq(resumeUploads.id, id));
    return resume;
  }

  async deleteResumeUpload(id: number): Promise<void> {
    await db.delete(resumeUploads).where(eq(resumeUploads.id, id));
  }

  async activateResumeUpload(id: number): Promise<void> {
    await db
      .update(resumeUploads)
      .set({ isActive: true })
      .where(eq(resumeUploads.id, id));
  }

  async deactivateUserResumes(userId: number): Promise<void> {
    await db
      .update(resumeUploads)
      .set({ isActive: false })
      .where(eq(resumeUploads.userId, userId));
  }
}