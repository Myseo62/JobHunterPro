import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, insertJobSchema, insertApplicationSchema, jobSearchSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      const user = await storage.createUser(userData);
      // Remove password from response
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Remove password from response
      const { password: _, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Login failed" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertUserSchema.partial().parse(req.body);
      
      const user = await storage.updateUser(id, updateData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Update failed" });
    }
  });

  // Job routes
  app.get("/api/jobs", async (req, res) => {
    try {
      const searchParams = jobSearchSchema.parse(req.query);
      const jobs = await storage.getJobs(searchParams);
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const job = await storage.getJobWithCompany(id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job" });
    }
  });

  app.post("/api/jobs", async (req, res) => {
    try {
      const jobData = insertJobSchema.parse(req.body);
      const job = await storage.createJob(jobData);
      res.json(job);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Job creation failed" });
    }
  });

  // Company routes
  app.get("/api/companies", async (req, res) => {
    try {
      let companies = await storage.getCompanies();
      
      // Apply filters
      const { search, industry, type } = req.query;
      
      if (search && typeof search === 'string') {
        companies = companies.filter(company => 
          company.name.toLowerCase().includes(search.toLowerCase()) ||
          company.description?.toLowerCase().includes(search.toLowerCase()) ||
          company.location.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (industry && typeof industry === 'string') {
        companies = companies.filter(company => company.industry === industry);
      }
      
      if (type && typeof type === 'string') {
        companies = companies.filter(company => company.companyType === type);
      }
      
      res.json(companies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch companies" });
    }
  });

  app.get("/api/companies/featured", async (req, res) => {
    try {
      const companies = await storage.getFeaturedCompanies();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured companies" });
    }
  });

  app.get("/api/companies/industries", async (req, res) => {
    try {
      const industries = await storage.getCompanyIndustries();
      res.json(industries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch company industries" });
    }
  });

  app.get("/api/companies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const company = await storage.getCompany(id);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch company" });
    }
  });

  // Application routes
  app.post("/api/applications", async (req, res) => {
    try {
      const applicationData = insertApplicationSchema.parse(req.body);
      
      // Check if user already applied
      const hasApplied = await storage.hasUserApplied(applicationData.userId, applicationData.jobId);
      if (hasApplied) {
        return res.status(400).json({ message: "You have already applied for this job" });
      }
      
      const application = await storage.createApplication(applicationData);
      res.json(application);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Application failed" });
    }
  });

  app.get("/api/applications/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const applications = await storage.getApplicationsByUser(userId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.get("/api/applications/job/:jobId", async (req, res) => {
    try {
      const jobId = parseInt(req.params.jobId);
      const applications = await storage.getApplicationsByJob(jobId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job applications" });
    }
  });

  // Job categories routes
  app.get("/api/job-categories", async (req, res) => {
    try {
      const categories = await storage.getJobCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job categories" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
