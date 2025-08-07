import { users, companies, jobs, applications, jobCategories, companyEmployees, resumeUploads, type User, type InsertUser, type Company, type InsertCompany, type Job, type InsertJob, type Application, type InsertApplication, type JobCategory, type InsertJobCategory, type JobWithCompany, type ApplicationWithJobAndCompany, type JobSearchParams, type CompanyEmployee, type InsertCompanyEmployee, type ResumeUpload, type InsertResumeUpload } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Company operations (for employers)
  createCompany(company: InsertCompany): Promise<Company>;
  getCompanyByEmployerId(userId: number): Promise<Company | undefined>;
  createCompanyEmployee(employee: InsertCompanyEmployee): Promise<CompanyEmployee>;
  
  // Employer stats
  getEmployerStats(companyId: number): Promise<{ activeJobs: number; totalApplications: number; }>;
  
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
  searchJobs(query: string, filters?: any): Promise<Job[]>;
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
  
  // Resume operations
  createResumeUpload(resume: InsertResumeUpload): Promise<ResumeUpload>;
  getUserResumeVersions(userId: number): Promise<ResumeUpload[]>;
  getResumeUpload(id: number): Promise<ResumeUpload | undefined>;
  deleteResumeUpload(id: number): Promise<void>;
  activateResumeUpload(id: number): Promise<void>;
  deactivateUserResumes(userId: number): Promise<void>;
}

import { DatabaseStorage } from "./db-storage";

export const storage = new DatabaseStorage();