import { users, companies, jobs, applications, jobCategories, type User, type InsertUser, type Company, type InsertCompany, type Job, type InsertJob, type Application, type InsertApplication, type JobCategory, type InsertJobCategory, type JobWithCompany, type ApplicationWithJobAndCompany, type JobSearchParams } from "@shared/schema";
import { db } from "./db";
import { eq, and, like, gte, lte, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Company operations
  getCompany(id: number): Promise<Company | undefined>;
  getCompanies(): Promise<Company[]>;
  createCompany(company: InsertCompany): Promise<Company>;
  getFeaturedCompanies(): Promise<Company[]>;
  getCompanyIndustries(): Promise<string[]>;
  
  // Job operations
  getJob(id: number): Promise<Job | undefined>;
  getJobWithCompany(id: number): Promise<JobWithCompany | undefined>;
  getJobs(params?: JobSearchParams): Promise<JobWithCompany[]>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: number, job: Partial<InsertJob>): Promise<Job | undefined>;
  
  // Application operations
  getApplication(id: number): Promise<Application | undefined>;
  getApplicationsByUser(userId: number): Promise<ApplicationWithJobAndCompany[]>;
  getApplicationsByJob(jobId: number): Promise<Application[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: number, application: Partial<InsertApplication>): Promise<Application | undefined>;
  hasUserApplied(userId: number, jobId: number): Promise<boolean>;
  
  // Job category operations
  getJobCategories(): Promise<JobCategory[]>;
  createJobCategory(category: InsertJobCategory): Promise<JobCategory>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private companies: Map<number, Company>;
  private jobs: Map<number, Job>;
  private applications: Map<number, Application>;
  private jobCategories: Map<number, JobCategory>;
  private currentId: { users: number; companies: number; jobs: number; applications: number; categories: number };

  constructor() {
    this.users = new Map();
    this.companies = new Map();
    this.jobs = new Map();
    this.applications = new Map();
    this.jobCategories = new Map();
    this.currentId = { users: 1, companies: 1, jobs: 1, applications: 1, categories: 1 };
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize with test users for easy login
    const testUsers: InsertUser[] = [
      {
        username: "candidate",
        email: "candidate@test.com",
        password: "password123", // In real app, this would be hashed
        fullName: "Test Candidate",
        userType: "candidate",
        skills: ["React", "JavaScript", "Node.js"],
        experience: "3 years",
        location: "Mumbai",
        expectedSalary: "12 LPA"
      },
      {
        username: "employer",
        email: "employer@test.com", 
        password: "password123", // In real app, this would be hashed
        fullName: "Test Employer",
        userType: "employer",
        companyName: "Test Company Ltd"
      }
    ];

    testUsers.forEach(user => {
      const newUser: User = {
        id: this.currentId.users++,
        ...user,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.users.set(newUser.id, newUser);
    });

    // Initialize with sample companies
    const sampleCompanies: InsertCompany[] = [
      {
        name: "Tata Consultancy Services",
        description: "Leading IT services company providing technology solutions",
        industry: "Technology",
        website: "https://tcs.com",
        location: "Mumbai",
        logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=64&h=64&fit=crop",
        employeeCount: "500,000+",
        rating: "4.1",
        reviewCount: 25000,
        companyType: "MNC"
      },
      {
        name: "Infosys Limited",
        description: "Global leader in technology services and consulting",
        industry: "Technology",
        website: "https://infosys.com",
        location: "Bangalore",
        logo: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=64&h=64&fit=crop",
        employeeCount: "300,000+",
        rating: "4.3",
        reviewCount: 18000,
        companyType: "MNC"
      },
      {
        name: "ICICI Bank",
        description: "Leading private sector bank in India",
        industry: "Banking",
        website: "https://icicibank.com",
        location: "Mumbai",
        logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=64&h=64&fit=crop",
        employeeCount: "100,000+",
        rating: "4.0",
        reviewCount: 12000,
        companyType: "MNC"
      },
      {
        name: "Wipro Technologies",
        description: "Global information technology company",
        industry: "Technology",
        website: "https://wipro.com",
        location: "Bangalore",
        logo: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=64&h=64&fit=crop",
        employeeCount: "250,000+",
        rating: "3.9",
        reviewCount: 15000,
        companyType: "MNC"
      },
      {
        name: "Amazon India",
        description: "Global e-commerce and cloud computing company",
        industry: "E-commerce",
        website: "https://amazon.in",
        location: "Bangalore",
        logo: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=64&h=64&fit=crop",
        employeeCount: "70,000+",
        rating: "4.2",
        reviewCount: 8000,
        companyType: "MNC"
      },
      {
        name: "Microsoft India",
        description: "Technology innovation leader",
        industry: "Technology",
        website: "https://microsoft.com",
        location: "Hyderabad",
        logo: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=64&h=64&fit=crop",
        employeeCount: "50,000+",
        rating: "4.4",
        reviewCount: 6000,
        companyType: "MNC"
      },
      {
        name: "Accenture",
        description: "Global consulting and technology services",
        industry: "Consulting",
        website: "https://accenture.com",
        location: "Bangalore",
        logo: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=64&h=64&fit=crop",
        employeeCount: "200,000+",
        rating: "4.1",
        reviewCount: 22000,
        companyType: "MNC"
      }
    ];

    sampleCompanies.forEach(company => {
      this.createCompany(company);
    });

    // Initialize job categories
    const sampleCategories: InsertJobCategory[] = [
      { name: "Software & IT", slug: "software-it", description: "Technology and software development roles" },
      { name: "Banking & Finance", slug: "banking-finance", description: "Financial services and banking roles" },
      { name: "Marketing", slug: "marketing", description: "Marketing and digital marketing roles" },
      { name: "Data Science", slug: "data-science", description: "Data analysis and machine learning roles" },
      { name: "Engineering", slug: "engineering", description: "Engineering and technical roles" },
      { name: "HR", slug: "hr", description: "Human resources and talent management roles" }
    ];

    sampleCategories.forEach(category => {
      this.createJobCategory(category);
    });

    // Initialize with sample jobs
    const sampleJobs: InsertJob[] = [
      {
        title: "Senior Software Engineer",
        description: "Looking for experienced software engineers to work on cutting-edge technology projects. Strong background in Java, Spring Boot, and microservices required.",
        companyId: 1, // TCS
        location: "Bangalore",
        experience: "3-6 years",
        salaryMin: "800000",
        salaryMax: "1500000",
        jobType: "Full-time",
        skills: ["Java", "Spring Boot", "Microservices", "REST APIs", "MySQL"],
        requirements: ["Bachelor's degree in Computer Science", "3+ years of Java development experience", "Experience with microservices architecture"],
        benefits: ["Health insurance", "Flexible working hours", "Professional development"],
        isActive: true
      },
      {
        title: "Product Manager",
        description: "Lead product strategy and roadmap for digital transformation initiatives. Experience with agile methodologies and stakeholder management required.",
        companyId: 2, // Infosys
        location: "Mumbai",
        experience: "5-8 years",
        salaryMin: "1200000",
        salaryMax: "2000000",
        jobType: "Full-time",
        skills: ["Product Strategy", "Agile", "Analytics", "Stakeholder Management", "Product Roadmap"],
        requirements: ["MBA or equivalent experience", "5+ years of product management experience", "Experience with agile development"],
        benefits: ["Stock options", "Health insurance", "Flexible working", "Learning budget"],
        isActive: true
      },
      {
        title: "Data Scientist",
        description: "Build and deploy machine learning models for business intelligence. Strong background in Python, R, and statistical analysis required.",
        companyId: 4, // Wipro
        location: "Hyderabad",
        experience: "2-5 years",
        salaryMin: "600000",
        salaryMax: "1200000",
        jobType: "Full-time",
        skills: ["Python", "Machine Learning", "Statistics", "R", "SQL", "Data Visualization"],
        requirements: ["Master's degree in Statistics or Computer Science", "2+ years of ML experience", "Strong analytical skills"],
        benefits: ["Research opportunities", "Conference attendance", "Health insurance"],
        isActive: true
      },
      {
        title: "Frontend Developer",
        description: "Develop responsive web applications using React and modern JavaScript frameworks. Experience with TypeScript and modern development practices required.",
        companyId: 5, // Amazon
        location: "Bangalore",
        experience: "2-4 years",
        salaryMin: "700000",
        salaryMax: "1400000",
        jobType: "Full-time",
        skills: ["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Redux"],
        requirements: ["Bachelor's degree in Computer Science", "2+ years of React development", "Strong JavaScript fundamentals"],
        benefits: ["Stock options", "Health insurance", "Free meals", "Learning resources"],
        isActive: true
      },
      {
        title: "Marketing Manager",
        description: "Drive digital marketing strategies and campaigns. Experience with social media marketing, content marketing, and analytics required.",
        companyId: 3, // ICICI Bank
        location: "Mumbai",
        experience: "3-6 years",
        salaryMin: "600000",
        salaryMax: "1100000",
        jobType: "Full-time",
        skills: ["Digital Marketing", "Social Media", "Content Marketing", "Analytics", "SEO/SEM"],
        requirements: ["MBA in Marketing", "3+ years of digital marketing experience", "Strong analytical skills"],
        benefits: ["Performance bonuses", "Health insurance", "Flexible working"],
        isActive: true
      },
      {
        title: "DevOps Engineer",
        description: "Manage and maintain cloud infrastructure and deployment pipelines. Experience with AWS, Docker, and Kubernetes required.",
        companyId: 6, // Microsoft
        location: "Hyderabad",
        experience: "4-7 years",
        salaryMin: "900000",
        salaryMax: "1600000",
        jobType: "Full-time",
        skills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Linux", "Python"],
        requirements: ["Bachelor's degree in Computer Science", "4+ years of DevOps experience", "Strong cloud infrastructure knowledge"],
        benefits: ["Stock options", "Health insurance", "Remote work options", "Professional development"],
        isActive: true
      }
    ];

    sampleJobs.forEach(job => {
      this.createJob(job);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Company operations
  async getCompany(id: number): Promise<Company | undefined> {
    return this.companies.get(id);
  }

  async getCompanies(): Promise<Company[]> {
    return Array.from(this.companies.values());
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const id = this.currentId.companies++;
    const company: Company = { ...insertCompany, id };
    this.companies.set(id, company);
    return company;
  }

  async getFeaturedCompanies(): Promise<Company[]> {
    return Array.from(this.companies.values()).slice(0, 8);
  }

  async getCompanyIndustries(): Promise<string[]> {
    const industries = new Set<string>();
    Array.from(this.companies.values()).forEach(company => {
      if (company.industry) {
        industries.add(company.industry);
      }
    });
    return Array.from(industries).sort();
  }

  // Job operations
  async getJob(id: number): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async getJobWithCompany(id: number): Promise<JobWithCompany | undefined> {
    const job = this.jobs.get(id);
    if (!job) return undefined;
    
    const company = this.companies.get(job.companyId);
    if (!company) return undefined;
    
    return { ...job, company };
  }

  async getJobs(params?: JobSearchParams): Promise<JobWithCompany[]> {
    let jobs = Array.from(this.jobs.values()).filter(job => job.isActive);
    
    if (params?.query) {
      const query = params.query.toLowerCase();
      jobs = jobs.filter(job => 
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.skills?.some(skill => skill.toLowerCase().includes(query))
      );
    }
    
    if (params?.location) {
      jobs = jobs.filter(job => 
        job.location.toLowerCase().includes(params.location!.toLowerCase())
      );
    }
    
    if (params?.experience) {
      jobs = jobs.filter(job => job.experience === params.experience);
    }
    
    if (params?.skills && params.skills.length > 0) {
      jobs = jobs.filter(job => 
        job.skills?.some(skill => 
          params.skills!.some(paramSkill => 
            skill.toLowerCase().includes(paramSkill.toLowerCase())
          )
        )
      );
    }
    
    // Convert to JobWithCompany
    return jobs.map(job => {
      const company = this.companies.get(job.companyId)!;
      return { ...job, company };
    }).sort((a, b) => new Date(b.postedAt!).getTime() - new Date(a.postedAt!).getTime());
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = this.currentId.jobs++;
    const job: Job = { 
      ...insertJob, 
      id,
      postedAt: new Date(),
      applicationCount: 0
    };
    this.jobs.set(id, job);
    return job;
  }

  async updateJob(id: number, updateData: Partial<InsertJob>): Promise<Job | undefined> {
    const job = this.jobs.get(id);
    if (!job) return undefined;
    
    const updatedJob = { ...job, ...updateData };
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }

  // Application operations
  async getApplication(id: number): Promise<Application | undefined> {
    return this.applications.get(id);
  }

  async getApplicationsByUser(userId: number): Promise<ApplicationWithJobAndCompany[]> {
    const applications = Array.from(this.applications.values()).filter(app => app.userId === userId);
    
    return applications.map(app => {
      const job = this.jobs.get(app.jobId)!;
      const company = this.companies.get(job.companyId)!;
      return { ...app, job: { ...job, company } };
    });
  }

  async getApplicationsByJob(jobId: number): Promise<Application[]> {
    return Array.from(this.applications.values()).filter(app => app.jobId === jobId);
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const id = this.currentId.applications++;
    const application: Application = { 
      ...insertApplication, 
      id,
      appliedAt: new Date()
    };
    this.applications.set(id, application);
    
    // Update job application count
    const job = this.jobs.get(insertApplication.jobId);
    if (job) {
      job.applicationCount = (job.applicationCount || 0) + 1;
      this.jobs.set(job.id, job);
    }
    
    return application;
  }

  async updateApplication(id: number, updateData: Partial<InsertApplication>): Promise<Application | undefined> {
    const application = this.applications.get(id);
    if (!application) return undefined;
    
    const updatedApplication = { ...application, ...updateData };
    this.applications.set(id, updatedApplication);
    return updatedApplication;
  }

  async hasUserApplied(userId: number, jobId: number): Promise<boolean> {
    return Array.from(this.applications.values()).some(app => 
      app.userId === userId && app.jobId === jobId
    );
  }

  // Job category operations
  async getJobCategories(): Promise<JobCategory[]> {
    return Array.from(this.jobCategories.values());
  }

  async createJobCategory(insertCategory: InsertJobCategory): Promise<JobCategory> {
    const id = this.currentId.categories++;
    const category: JobCategory = { ...insertCategory, id };
    this.jobCategories.set(id, category);
    return category;
  }
}

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
    return await db.select().from(companies).limit(8);
  }

  async getCompanyIndustries(): Promise<string[]> {
    const result = await db
      .selectDistinct({ industry: companies.industry })
      .from(companies)
      .where(sql`${companies.industry} IS NOT NULL`);
    
    return result.map(r => r.industry).filter(Boolean).sort();
  }

  // Job operations
  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job || undefined;
  }

  async getJobWithCompany(id: number): Promise<JobWithCompany | undefined> {
    const [result] = await db
      .select()
      .from(jobs)
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .where(eq(jobs.id, id));
    
    if (!result) return undefined;
    
    return {
      ...result.jobs,
      company: result.companies
    };
  }

  async getJobs(params?: JobSearchParams): Promise<JobWithCompany[]> {
    let query = db
      .select()
      .from(jobs)
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .where(eq(jobs.isActive, true));

    // Apply filters
    const conditions = [eq(jobs.isActive, true)];
    
    if (params?.query) {
      conditions.push(
        sql`(${jobs.title} ILIKE ${'%' + params.query + '%'} OR 
             ${jobs.description} ILIKE ${'%' + params.query + '%'})`
      );
    }
    
    if (params?.location) {
      conditions.push(like(jobs.location, `%${params.location}%`));
    }
    
    if (params?.experience) {
      conditions.push(eq(jobs.experience, params.experience));
    }
    
    if (params?.salaryMin) {
      conditions.push(gte(jobs.salaryMin, params.salaryMin.toString()));
    }
    
    if (params?.salaryMax) {
      conditions.push(lte(jobs.salaryMax, params.salaryMax.toString()));
    }

    const results = await query
      .where(and(...conditions))
      .orderBy(desc(jobs.postedAt));

    return results.map(result => ({
      ...result.jobs,
      company: result.companies
    }));
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db
      .insert(jobs)
      .values(insertJob)
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
    const results = await db
      .select()
      .from(applications)
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .where(eq(applications.userId, userId))
      .orderBy(desc(applications.appliedAt));

    return results.map(result => ({
      ...result.applications,
      job: {
        ...result.jobs,
        company: result.companies
      }
    }));
  }

  async getApplicationsByJob(jobId: number): Promise<Application[]> {
    return await db.select().from(applications).where(eq(applications.jobId, jobId));
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const [application] = await db
      .insert(applications)
      .values(insertApplication)
      .returning();
    
    // Update job application count
    await db
      .update(jobs)
      .set({ applicationCount: sql`${jobs.applicationCount} + 1` })
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
      .select()
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
      .values(insertCategory)
      .returning();
    return category;
  }
}

export const storage = new DatabaseStorage();
