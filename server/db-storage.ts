import { users, companies, jobs, applications, jobCategories, companyEmployees, type User, type InsertUser, type Company, type InsertCompany, type Job, type InsertJob, type Application, type InsertApplication, type JobCategory, type InsertJobCategory, type JobWithCompany, type ApplicationWithJobAndCompany, type JobSearchParams, type CompanyEmployee, type InsertCompanyEmployee } from "@shared/schema";
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
      .values({
        ...insertUser,
        profileCompleted: false
      })
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
      .values({
        ...insertCompany,
        reviewCount: insertCompany.reviewCount || 0
      })
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
}