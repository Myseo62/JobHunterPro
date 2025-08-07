import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { RewardService, REWARD_CATALOG } from "./reward-service";
import { rewardPointsService } from "./reward-points";
import { jobMatchingService } from "./job-matching-service";
// Removed ResumeParser import since we're not using AI parsing for now
import { insertUserSchema, updateUserSchema, loginSchema, insertJobSchema, insertApplicationSchema, jobSearchSchema, employerRegistrationSchema, insertBlogPostSchema, friendReferralSchema } from "@shared/schema";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { ObjectPermission } from "./objectAcl";
import { z } from "zod";
import session from "express-session";
import passport from "passport";
import { setupSocialAuth } from "./auth/social-auth";
import bcrypt from "bcrypt";
import multer from "multer";
import * as fs from "fs";
import * as path from "path";

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Feature flag for candidate functionalities (now enabled)
  const CANDIDATE_FEATURES_ENABLED = true;

  // Set up session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'career-bazaar-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true in production with HTTPS
  }));

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Passport serialization
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
  
  // Set up social authentication strategies
  setupSocialAuth();
  // Google OAuth routes
  app.get('/api/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  app.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/login' }),
    (req, res) => {
      // Successful authentication, redirect to home
      res.redirect('/');
    }
  );

  // LinkedIn OAuth routes
  app.get('/api/auth/linkedin',
    passport.authenticate('linkedin', { scope: ['r_emailaddress', 'r_liteprofile'] })
  );

  app.get('/api/auth/linkedin/callback',
    passport.authenticate('linkedin', { failureRedirect: '/auth/login' }),
    (req, res) => {
      // Successful authentication, redirect to home
      res.redirect('/');
    }
  );

  // Logout route
  app.post('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });

  // Get current user
  app.get('/api/auth/user', (req, res) => {
    if (req.isAuthenticated() || req.session?.user) {
      const user = req.user || req.session?.user;
      const { password, ...userResponse } = user as any;
      res.json(userResponse);
    } else {
      res.status(401).json({ message: 'Not authenticated' });
    }
  });

  // Role-based authentication middleware
  const requireRole = (allowedRoles: string[]) => {
    return (req: any, res: any, next: any) => {
      if (!req.session?.user && !req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = req.session?.user || req.user;
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }
      
      req.user = user;
      next();
    };
  };

  const requireEmployer = requireRole(['employer_admin', 'employer_hr']);
  const requireCandidate = requireRole(['candidate']);

  // Simple authentication middleware
  const isAuthenticated = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated() && !(req.session as any)?.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    // Set user from session if not set by passport
    if (!(req.user) && (req.session as any)?.user) {
      req.user = (req.session as any).user;
    }
    next();
  };

  // Employer authentication routes
  app.post("/api/auth/employer-register", async (req, res) => {
    try {
      const data = employerRegistrationSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      // Create company first
      const company = await storage.createCompany({
        name: data.companyName,
        website: data.companyWebsite,
        industry: data.industry,
        employeeCount: data.companySize,
        companyType: "Employer",
      });

      // Create user
      const user = await storage.createUser({
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: "employer_admin",
      });

      // Store user in session
      req.session.user = user;
      
      res.json({ 
        message: "Employer account created successfully", 
        user: { ...user, password: undefined },
        company 
      });
    } catch (error: any) {
      console.error("Employer registration error:", error);
      res.status(400).json({ message: error.message || "Registration failed" });
    }
  });

  app.post("/api/auth/employer-login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check if user is an employer
      if (!user.role.startsWith('employer_')) {
        return res.status(401).json({ message: "This login is for employers only" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Store user in session
      req.session.user = user;
      
      res.json({ 
        message: "Login successful", 
        user: { ...user, password: undefined } 
      });
    } catch (error: any) {
      console.error("Employer login error:", error);
      res.status(400).json({ message: error.message || "Login failed" });
    }
  });

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      // Hash password for manual registration
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
        role: "candidate", // Default role for manual registration
      });
      
      // Log in user using Passport.js
      (req as any).login(user, (err: any) => {
        if (err) {
          return res.status(500).json({ message: "Registration failed" });
        }
        // Remove password from response
        const { password, ...userResponse } = user;
        res.json(userResponse);
      });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Registration failed" });
    }
  });

  // Candidate login route removed - handled by the Passport-based login route below

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
      // Clean up empty strings to null for optional fields
      const cleanedBody = { ...req.body };
      Object.keys(cleanedBody).forEach(key => {
        if (cleanedBody[key] === '' || cleanedBody[key] === undefined) {
          cleanedBody[key] = null;
        }
      });
      
      const updateData = updateUserSchema.parse(cleanedBody);
      
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

  // Job routes with intelligent search and recommendations
  app.get("/api/jobs", async (req, res) => {
    try {
      const { search, userId } = req.query;
      
      if (search && typeof search === 'string') {
        // Intelligent search with ranking
        const userIdNum = userId ? parseInt(userId as string) : undefined;
        const rankedJobs = await jobMatchingService.searchJobsWithRanking(search, userIdNum, req.query);
        res.json(rankedJobs.map(match => ({
          ...match.job,
          matchScore: match.matchScore,
          matchReasons: match.matchReasons
        })));
      } else {
        // Default job listing
        const searchParams = jobSearchSchema.parse(req.query);
        const jobs = await storage.getJobs(searchParams);
        res.json(jobs);
      }
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

  // Job recommendations for specific user
  app.get("/api/jobs/recommendations/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = parseInt(req.query.limit as string) || 10;
      const recommendations = await jobMatchingService.getJobRecommendations(userId, limit);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job recommendations" });
    }
  });

  // Similar jobs for a specific job
  app.get("/api/jobs/:id/similar", async (req, res) => {
    try {
      const jobId = parseInt(req.params.id);
      const limit = parseInt(req.query.limit as string) || 5;
      const similarJobs = await jobMatchingService.getSimilarJobs(jobId, limit);
      res.json(similarJobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch similar jobs" });
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
          company.location?.toLowerCase().includes(search.toLowerCase())
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
  app.post("/api/applications", isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user || (req.session as any)?.user;

      const { jobId } = req.body;
      
      if (!user || !user.id) {
        return res.status(401).json({ message: "User not authenticated properly" });
      }
      
      // Check if user already applied
      const hasApplied = await storage.hasUserApplied(user.id, jobId);
      if (hasApplied) {
        return res.status(400).json({ message: "You have already applied for this job" });
      }
      
      const applicationData = {
        userId: user.id,
        jobId: jobId,
        status: "pending"
      };
      
      const application = await storage.createApplication(applicationData);
      res.json(application);
    } catch (error) {

      res.status(400).json({ message: error instanceof Error ? error.message : "Application failed" });
    }
  });

  app.get("/api/applications", isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user || (req.session as any)?.user;
      const applications = await storage.getApplicationsByUser(user.id);
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

  // Reward Points API Routes
  app.get("/api/rewards/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const points = await RewardService.getUserPoints(userId);
      const history = await RewardService.getUserRewardHistory(userId, 20);
      const redemptions = await RewardService.getUserRedemptions(userId);
      
      res.json({
        points,
        history,
        redemptions,
        catalog: REWARD_CATALOG
      });
    } catch (error) {
      console.error("Error fetching user rewards:", error);
      res.status(500).json({ message: "Failed to fetch rewards" });
    }
  });

  app.post("/api/rewards/redeem", async (req, res) => {
    try {
      const { userId, rewardType } = req.body;
      const success = await RewardService.redeemReward(userId, rewardType);
      res.json({ success });
    } catch (error) {
      console.error("Error redeeming reward:", error);
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to redeem reward" });
    }
  });

  app.get("/api/rewards/leaderboard", async (req, res) => {
    try {
      const leaderboard = await RewardService.getLeaderboard(10);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  app.post("/api/rewards/activity", async (req, res) => {
    try {
      const { userId, activityType, customPoints } = req.body;
      await RewardService.awardPoints(userId, activityType, customPoints);
      res.json({ success: true });
    } catch (error) {
      console.error("Error awarding points:", error);
      res.status(500).json({ message: "Failed to award points" });
    }
  });

  // Employer Authentication API (separate from regular users)
  const employerUsers: Array<{ 
    id: number; 
    email: string; 
    password: string; 
    firstName: string; 
    lastName: string; 
    companyName: string; 
    role: 'employer_admin' | 'employer_hr' | 'hr';
  }> = [
    // Pre-seeded test employers with different roles
    // Login: admin@techcorp.com / admin123
    {
      id: 1,
      email: "admin@techcorp.com",
      password: "$2b$10$ExMgotLekOOM2dEImamJBOn6P.PGE3zSAgUHjbiyzyGvpWtsaJ2CK",
      firstName: "John",
      lastName: "Admin",
      companyName: "TechCorp Inc",
      role: "employer_admin"
    },
    // Login: hr@techcorp.com / hr123
    {
      id: 2,
      email: "hr@techcorp.com", 
      password: "$2b$10$M1CCQjhfDkL/rZFQbPv.5OJxsph7Avq69g3hY0Hxm4QBORPq22sla",
      firstName: "Jane",
      lastName: "HR",
      companyName: "TechCorp Inc",
      role: "hr"
    }
  ];

  // Middleware for employer endpoints
  const requireEmployerAuth = (req: any, res: any, next: any) => {
    if (!req.session?.employerId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    next();
  };

  // Employer authentication endpoints (also create auth/ prefixed routes for consistency)
  app.post("/api/auth/employer-register", async (req, res) => {
    try {
      const { email, password, firstName, lastName, companyName, role } = req.body;
      
      // Check if employer already exists
      const existingEmployer = employerUsers.find(u => u.email === email);
      if (existingEmployer) {
        return res.status(400).json({ message: "Employer already exists" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create employer user with role (default to employer_admin)
      const newEmployer = {
        id: employerUsers.length + 1,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        companyName,
        role: role || 'employer_admin' as const
      };
      
      employerUsers.push(newEmployer);
      
      // Create session
      req.session.employerId = newEmployer.id;
      
      res.json({ 
        message: "Employer registered successfully",
        employer: { id: newEmployer.id, email, firstName, lastName, companyName, role: newEmployer.role }
      });
    } catch (error) {
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/employer/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName, companyName } = req.body;
      
      // Check if employer already exists
      const existingEmployer = employerUsers.find(u => u.email === email);
      if (existingEmployer) {
        return res.status(400).json({ message: "Employer already exists" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create employer user
      const newEmployer = {
        id: employerUsers.length + 1,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        companyName
      };
      
      employerUsers.push(newEmployer);
      
      // Create session
      req.session.employerId = newEmployer.id;
      
      res.json({ 
        message: "Employer registered successfully",
        employer: { id: newEmployer.id, email, firstName, lastName, companyName }
      });
    } catch (error) {
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/employer-login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Find employer
      const employer = employerUsers.find(u => u.email === email);
      if (!employer) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, employer.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Create session
      req.session.employerId = employer.id;
      
      res.json({ 
        message: "Login successful",
        employer: { id: employer.id, email: employer.email, firstName: employer.firstName, lastName: employer.lastName, companyName: employer.companyName, role: employer.role }
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/employer/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Find employer
      const employer = employerUsers.find(u => u.email === email);
      if (!employer) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, employer.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Create session
      req.session.employerId = employer.id;
      
      res.json({ 
        message: "Login successful",
        employer: { id: employer.id, email: employer.email, firstName: employer.firstName, lastName: employer.lastName, companyName: employer.companyName }
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.get("/api/employer/profile", requireEmployerAuth, async (req: any, res) => {
    try {
      const employer = employerUsers.find(u => u.id === req.session.employerId);
      if (!employer) {
        return res.status(404).json({ message: "Employer not found" });
      }
      
      res.json({
        id: employer.id,
        email: employer.email,
        firstName: employer.firstName,
        lastName: employer.lastName,
        companyName: employer.companyName,
        role: employer.role
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.post("/api/auth/employer-logout", (req: any, res) => {
    req.session.employerId = null;
    res.json({ message: "Logged out successfully" });
  });

  app.post("/api/employer/logout", (req: any, res) => {
    req.session.employerId = null;
    res.json({ message: "Logged out successfully" });
  });



  // Employer dashboard endpoints
  app.get("/api/employer/stats", requireEmployerAuth, async (req: any, res) => {
    try {
      const employer = employerUsers.find(u => u.id === req.session.employerId);
      if (!employer) {
        return res.status(404).json({ message: "Employer not found" });
      }
      
      // Mock stats for demo (real app would query database)
      const stats = {
        activeJobs: 5,
        totalApplications: 23,
        monthlySearchLimit: 50,
        searchesUsed: 12,
        downloadLimit: 25,
        downloadsUsed: 8
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Protected route: Only employers can post jobs
  app.post("/api/employer/jobs", requireEmployerAuth, async (req: any, res) => {
    try {
      const employer = employerUsers.find(u => u.id === req.session.employerId);
      if (!employer) {
        return res.status(404).json({ message: "Employer not found" });
      }
      
      const jobData = {
        ...req.body,
        companyId: 1, // For demo, use first company
        isActive: true,
        postedAt: new Date(),
        applicationCount: 0
      };
      
      const job = await storage.createJob(jobData);
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: "Failed to create job" });
    }
  });

  // Blog endpoints
  app.get("/api/blogs", async (req, res) => {
    try {
      const blogs = await storage.getAllBlogs();
      res.json(blogs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blogs" });
    }
  });

  app.get("/api/blogs/:id", async (req, res) => {
    try {
      const blogId = parseInt(req.params.id);
      const blog = await storage.getBlogById(blogId);
      
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      // Award reading points if user is authenticated
      if (req.isAuthenticated()) {
        const user = req.user as any;
        if (user.role === 'candidate') {
          await rewardPointsService.awardBlogReadPoints(user.id, blogId);
        }
      }

      res.json(blog);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog" });
    }
  });

  app.post("/api/blogs", requireRole(['candidate']), async (req, res) => {
    try {
      const user = req.user as any;
      const blogData = insertBlogPostSchema.parse({
        ...req.body,
        userId: user.id
      });

      const blog = await storage.createBlog(blogData);
      
      // Award points for blog writing if published
      if (blogData.isPublished) {
        await rewardPointsService.awardBlogWritePoints(user.id, blog.id);
      }

      const userBlogs = await storage.getUserBlogs(user.id);
      res.json({ blog, totalPosts: userBlogs.length });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create blog" });
    }
  });

  // Friend referral endpoints  
  app.post("/api/referrals", requireRole(['candidate']), async (req, res) => {
    try {
      const user = req.user as any;
      const { referredEmail } = friendReferralSchema.parse(req.body);
      
      const referral = await storage.createFriendReferral({
        referrerId: user.id,
        referredEmail,
        status: 'pending'
      });

      res.json({ message: "Friend referral sent", referral });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to send referral" });
    }
  });

  // Saved Jobs API Routes (with authentication)
  app.post("/api/saved-jobs", isAuthenticated, async (req: any, res) => {
    try {
      const { jobId } = req.body;
      const user = req.user || (req.session as any)?.user;
      const savedJob = await storage.saveJob(user.id, jobId);
      res.json(savedJob);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to save job" });
    }
  });

  app.delete("/api/saved-jobs", isAuthenticated, async (req: any, res) => {
    try {
      const { jobId } = req.body;
      const user = req.user || (req.session as any)?.user;
      await storage.unsaveJob(user.id, jobId);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to unsave job" });
    }
  });

  app.get("/api/saved-jobs", isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user || (req.session as any)?.user;
      const savedJobs = await storage.getSavedJobsByUser(user.id);
      res.json(savedJobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch saved jobs" });
    }
  });

  app.get("/api/saved-jobs/check/:userId/:jobId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const jobId = parseInt(req.params.jobId);
      const isSaved = await storage.isJobSaved(userId, jobId);
      res.json({ isSaved });
    } catch (error) {
      res.status(500).json({ message: "Failed to check job save status" });
    }
  });

  // Job Alerts API Routes (with authentication) 
  app.post("/api/job-alerts", isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user || (req.session as any)?.user;
      const alertData = { ...req.body, userId: user.id };
      const alert = await storage.createJobAlert(alertData);
      res.json(alert);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create job alert" });
    }
  });

  app.get("/api/job-alerts", isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user || (req.session as any)?.user;
      const alerts = await storage.getJobAlertsByUser(user.id);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job alerts" });
    }
  });

  app.put("/api/job-alerts/:id", isAuthenticated, async (req: any, res) => {
    try {
      const alertId = parseInt(req.params.id);
      const updateData = req.body;
      const alert = await storage.updateJobAlert(alertId, updateData);
      res.json(alert);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to update job alert" });
    }
  });

  app.delete("/api/job-alerts/:id", isAuthenticated, async (req: any, res) => {
    try {
      const alertId = parseInt(req.params.id);
      await storage.deleteJobAlert(alertId);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to delete job alert" });
    }
  });



  // Followed Companies API Routes
  app.post("/api/followed-companies", async (req, res) => {
    try {
      const { userId, companyId } = req.body;
      const followedCompany = await storage.followCompany(userId, companyId);
      res.json(followedCompany);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to follow company" });
    }
  });

  app.delete("/api/followed-companies", async (req, res) => {
    try {
      const { userId, companyId } = req.body;
      await storage.unfollowCompany(userId, companyId);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to unfollow company" });
    }
  });

  app.get("/api/followed-companies/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const followedCompanies = await storage.getFollowedCompaniesByUser(userId);
      res.json(followedCompanies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch followed companies" });
    }
  });

  app.get("/api/followed-companies/check/:userId/:companyId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const companyId = parseInt(req.params.companyId);
      const isFollowed = await storage.isCompanyFollowed(userId, companyId);
      res.json({ isFollowed });
    } catch (error) {
      res.status(500).json({ message: "Failed to check company follow status" });
    }
  });

  // Messages API Routes
  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = req.body;
      const message = await storage.sendMessage(messageData);
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to send message" });
    }
  });

  app.get("/api/messages/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const messages = await storage.getMessagesByUser(userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.put("/api/messages/:id/read", async (req, res) => {
    try {
      const messageId = parseInt(req.params.id);
      await storage.markMessageAsRead(messageId);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to mark message as read" });
    }
  });

  // Company Reviews API Routes
  app.post("/api/company-reviews", async (req, res) => {
    try {
      const reviewData = req.body;
      const review = await storage.createCompanyReview(reviewData);
      res.json(review);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create review" });
    }
  });

  app.get("/api/company-reviews/:companyId", async (req, res) => {
    try {
      const companyId = parseInt(req.params.companyId);
      const reviews = await storage.getCompanyReviews(companyId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch company reviews" });
    }
  });

  // Dashboard Stats API Route
  app.get("/api/dashboard/stats/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Reward endpoints
  app.get("/api/rewards/activities", requireRole(['candidate']), async (req, res) => {
    try {
      const user = req.user as any;
      const activities = await rewardPointsService.getUserActivities(user.id);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.get("/api/rewards/leaderboard", async (req, res) => {
    try {
      const leaderboard = await rewardPointsService.getLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Login endpoint with daily login reward
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Award daily login points for candidates
      if (user.role === 'candidate') {
        await rewardPointsService.awardDailyLoginPoints(user.id);
      }

      (req as any).login(user, (err: any) => {
        if (err) {
          return res.status(500).json({ message: "Login failed" });
        }
        const { password: _, ...userResponse } = user;
        res.json({ message: "Login successful", user: userResponse });
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Login failed" });
    }
  });

  // Resume upload endpoints with object storage
  const objectStorageService = new ObjectStorageService();

  // Get presigned URL for resume upload
  app.post('/api/resume/upload-url', async (req: any, res) => {
    try {
      const user = req.user || (req.session as any)?.passport?.user;
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      // If user is just an ID, fetch full user object
      const fullUser = typeof user === 'number' ? await storage.getUser(user) : user;
      if (!fullUser?.id) {
        return res.status(401).json({ message: "User not found" });
      }

      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error('Failed to generate upload URL:', error);
      res.status(500).json({ message: 'Failed to generate upload URL' });
    }
  });

  // Save resume metadata after upload
  app.post('/api/resume/save', async (req: any, res) => {
    try {
      const user = req.user || (req.session as any)?.passport?.user;
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      // If user is just an ID, fetch full user object
      const fullUser = typeof user === 'number' ? await storage.getUser(user) : user;
      if (!fullUser?.id) {
        return res.status(401).json({ message: "User not found" });
      }

      const { fileName, fileUrl, fileSize } = req.body;
      
      // Set ACL policy for the uploaded file
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        fileUrl,
        {
          owner: String(fullUser.id),
          visibility: "private"
        }
      );

      // Save resume record to database
      const resumeData = {
        userId: fullUser.id,
        fileName,
        fileUrl: objectPath,
        fileSize,
        isActive: true // Make new upload active by default
      };

      // Deactivate other resumes first
      await storage.deactivateUserResumes(fullUser.id);
      
      const resume = await storage.createResumeUpload(resumeData);
      
      // Update user's resume URL
      await storage.updateUser(fullUser.id, { resumeUrl: objectPath });

      res.json({ message: 'Resume saved successfully', resume });
    } catch (error) {
      console.error('Failed to save resume:', error);
      res.status(500).json({ message: 'Failed to save resume' });
    }
  });

  // Get user's resume versions
  app.get('/api/resume/versions/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const resumes = await storage.getUserResumeVersions(userId);
      res.json(resumes);
    } catch (error) {
      console.error('Failed to fetch resume versions:', error);
      res.status(500).json({ message: 'Failed to fetch resume versions' });
    }
  });

  // Delete resume version
  app.delete('/api/resume/:resumeId', async (req: any, res) => {
    try {
      const user = req.user || (req.session as any)?.passport?.user;
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      // If user is just an ID, fetch full user object
      const fullUser = typeof user === 'number' ? await storage.getUser(user) : user;
      if (!fullUser?.id) {
        return res.status(401).json({ message: "User not found" });
      }

      const resumeId = parseInt(req.params.resumeId);
      
      // Check ownership
      const resume = await storage.getResumeUpload(resumeId);
      if (!resume || resume.userId !== fullUser.id) {
        return res.status(404).json({ message: 'Resume not found' });
      }

      await storage.deleteResumeUpload(resumeId);
      res.json({ message: 'Resume deleted successfully' });
    } catch (error) {
      console.error('Failed to delete resume:', error);
      res.status(500).json({ message: 'Failed to delete resume' });
    }
  });

  // Activate resume version
  app.put('/api/resume/:resumeId/activate', async (req: any, res) => {
    try {
      const user = req.user || (req.session as any)?.passport?.user;
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      // If user is just an ID, fetch full user object
      const fullUser = typeof user === 'number' ? await storage.getUser(user) : user;
      if (!fullUser?.id) {
        return res.status(401).json({ message: "User not found" });
      }

      const resumeId = parseInt(req.params.resumeId);
      
      // Check ownership
      const resume = await storage.getResumeUpload(resumeId);
      if (!resume || resume.userId !== fullUser.id) {
        return res.status(404).json({ message: 'Resume not found' });
      }

      // Deactivate other resumes and activate this one
      await storage.deactivateUserResumes(fullUser.id);
      await storage.activateResumeUpload(resumeId);
      
      // Update user's resume URL
      await storage.updateUser(fullUser.id, { resumeUrl: resume.fileUrl });

      res.json({ message: 'Resume activated successfully' });
    } catch (error) {
      console.error('Failed to activate resume:', error);
      res.status(500).json({ message: 'Failed to activate resume' });
    }
  });

  // Serve private resume files
  app.get("/api/resume/file/:path(*)", async (req: any, res) => {
    try {
      const user = req.user || (req.session as any)?.passport?.user;
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      // If user is just an ID, fetch full user object
      const fullUser = typeof user === 'number' ? await storage.getUser(user) : user;
      if (!fullUser?.id) {
        return res.status(401).json({ message: "User not found" });
      }

      const objectPath = `/objects/${req.params.path}`;
      
      const objectFile = await objectStorageService.getObjectEntityFile(objectPath);
      const canAccess = await objectStorageService.canAccessObjectEntity({
        objectFile,
        userId: String(fullUser.id),
        requestedPermission: ObjectPermission.READ,
      });
      
      if (!canAccess) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error accessing resume file:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.status(404).json({ message: 'File not found' });
      }
      return res.status(500).json({ message: 'Server error' });
    }
  });

  // Direct resume file upload endpoint (for legacy components)
  app.post('/api/upload-resume-file', upload.single('resume'), async (req: any, res) => {
    try {
      const user = req.user || (req.session as any)?.user;
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const file = req.file;
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.mimetype)) {
        // Clean up uploaded file
        fs.unlinkSync(file.path);
        return res.status(400).json({ message: 'Invalid file type. Please upload PDF, DOC, or DOCX files only.' });
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        fs.unlinkSync(file.path);
        return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
      }

      // Create resume record in database
      const resumeData = {
        userId: user.id,
        fileName: file.originalname,
        fileUrl: `/uploads/${file.filename}`,
        fileSize: file.size,
        isActive: true
      };

      // Deactivate other resumes first
      await storage.deactivateUserResumes(user.id);
      
      const resume = await storage.createResumeUpload(resumeData);

      res.json({
        message: 'Resume uploaded successfully',
        fileInfo: {
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          mimetype: file.mimetype
        },
        resume
      });
    } catch (error: any) {
      console.error('Resume upload error:', error);
      res.status(500).json({ message: 'Failed to upload resume: ' + error.message });
    }
  });

  // Update user resume URL
  app.post('/api/users/:id/resume', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { resumeUrl, originalName } = req.body;
      
      const updatedUser = await storage.updateUser(userId, { resumeUrl });
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({ message: 'Resume URL updated successfully', user: updatedUser });
    } catch (error: any) {
      console.error('Resume URL update error:', error);
      res.status(500).json({ message: 'Failed to update resume URL: ' + error.message });
    }
  });

  // Update user skills
  app.post('/api/users/:id/skills', async (req, res) => {
    try {
      const { id } = req.params;
      const { skills } = req.body;
      
      // Mock update - in real app, save to database
      res.json({ message: 'Skills updated successfully', skills });
    } catch (error: any) {
      console.error('Skills update error:', error);
      res.status(500).json({ message: 'Failed to update skills: ' + error.message });
    }
  });

  // Add work experience
  app.post('/api/users/:id/experience', async (req, res) => {
    try {
      const { id } = req.params;
      const experienceData = req.body;
      
      // Mock add - in real app, save to database
      res.json({ message: 'Work experience added successfully', experience: experienceData });
    } catch (error: any) {
      console.error('Experience add error:', error);
      res.status(500).json({ message: 'Failed to add work experience: ' + error.message });
    }
  });

  // Add education
  app.post('/api/users/:id/education', async (req, res) => {
    try {
      const { id } = req.params;
      const educationData = req.body;
      
      // Mock add - in real app, save to database
      res.json({ message: 'Education details added successfully', education: educationData });
    } catch (error: any) {
      console.error('Education add error:', error);
      res.status(500).json({ message: 'Failed to add education details: ' + error.message });
    }
  });

  // Update user profile with parsed resume data
  app.post('/api/users/:id/apply-resume-data', isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { skills, workExperience, education } = req.body;
      
      // Get current user data
      const currentUser = await storage.getUserById(userId);
      if (!currentUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Update user with parsed resume data
      const updatedData = {
        skills: [...(currentUser.skills || []), ...(skills || [])],
        // Merge work experience and education arrays
        workExperience: [...(currentUser.workExperience || []), ...(workExperience || [])],
        education: [...(currentUser.education || []), ...(education || [])]
      };
      
      const updatedUser = await storage.updateUser(userId, updatedData);
      
      res.json({
        message: 'Profile updated with resume data',
        user: updatedUser
      });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ message: 'Failed to update profile' });
    }
  });

  // Serve uploaded files
  app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });

  const httpServer = createServer(app);
  return httpServer;
}
