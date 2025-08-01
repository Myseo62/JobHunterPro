import { storage } from "./storage";
import type { Job, User, Company } from "@shared/schema";

export interface JobMatch {
  job: Job & { company: Company };
  matchScore: number;
  matchReasons: string[];
  skillsMatched: string[];
  skillsMissing: string[];
}

export interface UserProfile {
  skills: string[];
  experience: string;
  expectedSalary?: number;
  preferredLocations: string[];
  jobTypes: string[];
}

export class JobMatchingService {
  
  /**
   * Get personalized job recommendations for a user
   */
  async getJobRecommendations(userId: number, limit: number = 10): Promise<JobMatch[]> {
    const user = await storage.getUser(userId);
    if (!user) return [];

    const userProfile = this.extractUserProfile(user);
    const allJobs = await storage.getJobs();
    
    // Calculate match scores for all jobs
    const jobMatches: JobMatch[] = [];
    
    for (const job of allJobs) {
      if (!job.isActive) continue;
      
      const company = await storage.getCompany(job.companyId);
      if (!company) continue;
      
      const matchResult = this.calculateJobMatch(userProfile, job);
      
      if (matchResult.matchScore > 0.3) { // Only include jobs with >30% match
        jobMatches.push({
          job: { ...job, company },
          ...matchResult
        });
      }
    }
    
    // Sort by match score and return top matches
    return jobMatches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  }

  /**
   * Find similar jobs based on a specific job
   */
  async getSimilarJobs(jobId: number, limit: number = 5): Promise<Job[]> {
    const targetJob = await storage.getJob(jobId);
    if (!targetJob) return [];

    const allJobs = await storage.getJobs();
    const similarJobs: { job: Job; similarity: number }[] = [];

    for (const job of allJobs) {
      if (job.id === jobId || !job.isActive) continue;
      
      const similarity = this.calculateJobSimilarity(targetJob, job);
      if (similarity > 0.4) { // 40% similarity threshold
        similarJobs.push({ job, similarity });
      }
    }

    return similarJobs
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(item => item.job);
  }

  /**
   * Search jobs with intelligent ranking
   */
  async searchJobsWithRanking(
    query: string, 
    userId?: number, 
    filters?: any
  ): Promise<JobMatch[]> {
    let user: User | undefined;
    let userProfile: UserProfile | undefined;
    
    if (userId) {
      user = await storage.getUser(userId);
      userProfile = user ? this.extractUserProfile(user) : undefined;
    }

    const jobs = await storage.searchJobs(query, filters);
    const jobMatches: JobMatch[] = [];

    for (const job of jobs) {
      const company = await storage.getCompany(job.companyId);
      if (!company) continue;

      let matchResult;
      if (userProfile) {
        // Personalized ranking for logged-in users
        matchResult = this.calculateJobMatch(userProfile, job);
      } else {
        // Basic relevance scoring for guests
        matchResult = this.calculateRelevanceScore(query, job);
      }

      jobMatches.push({
        job: { ...job, company },
        ...matchResult
      });
    }

    return jobMatches.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Extract user profile for matching
   */
  private extractUserProfile(user: User): UserProfile {
    return {
      skills: user.skills || [],
      experience: user.experience || "entry",
      expectedSalary: user.expectedSalary,
      preferredLocations: user.location ? [user.location] : [],
      jobTypes: ["full-time"] // Default, could be expanded
    };
  }

  /**
   * Calculate job match score for a user
   */
  private calculateJobMatch(userProfile: UserProfile, job: Job): {
    matchScore: number;
    matchReasons: string[];
    skillsMatched: string[];
    skillsMissing: string[];
  } {
    let score = 0;
    const reasons: string[] = [];
    const skillsMatched: string[] = [];
    const skillsMissing: string[] = [];

    // Skills matching (40% of total score)
    const jobSkills = job.skills || [];
    const userSkills = userProfile.skills;
    
    const matchedSkills = jobSkills.filter(skill => 
      userSkills.some(userSkill => 
        this.skillsMatch(skill, userSkill)
      )
    );
    
    const missedSkills = jobSkills.filter(skill => 
      !userSkills.some(userSkill => 
        this.skillsMatch(skill, userSkill)
      )
    );

    skillsMatched.push(...matchedSkills);
    skillsMissing.push(...missedSkills);

    if (jobSkills.length > 0) {
      const skillsScore = matchedSkills.length / jobSkills.length;
      score += skillsScore * 0.4;
      
      if (skillsScore > 0.7) {
        reasons.push(`Strong skills match (${matchedSkills.length}/${jobSkills.length} skills)`);
      } else if (skillsScore > 0.4) {
        reasons.push(`Good skills match (${matchedSkills.length}/${jobSkills.length} skills)`);
      }
    }

    // Experience level matching (25% of total score)
    const experienceScore = this.calculateExperienceMatch(userProfile.experience, job.experience || "");
    score += experienceScore * 0.25;
    
    if (experienceScore > 0.8) {
      reasons.push("Perfect experience level match");
    } else if (experienceScore > 0.5) {
      reasons.push("Good experience level fit");
    }

    // Salary matching (20% of total score)
    if (userProfile.expectedSalary && job.salaryMin && job.salaryMax) {
      const salaryScore = this.calculateSalaryMatch(
        userProfile.expectedSalary, 
        parseFloat(job.salaryMin), 
        parseFloat(job.salaryMax)
      );
      score += salaryScore * 0.2;
      
      if (salaryScore > 0.8) {
        reasons.push("Salary aligns with expectations");
      }
    }

    // Location matching (15% of total score)
    if (userProfile.preferredLocations.length > 0) {
      const locationScore = userProfile.preferredLocations.some(loc => 
        this.locationsMatch(loc, job.location)
      ) ? 1 : 0;
      score += locationScore * 0.15;
      
      if (locationScore > 0) {
        reasons.push("Location matches preference");
      }
    }

    return {
      matchScore: Math.min(score, 1), // Cap at 100%
      matchReasons: reasons,
      skillsMatched,
      skillsMissing
    };
  }

  /**
   * Calculate job similarity for "similar jobs" feature
   */
  private calculateJobSimilarity(job1: Job, job2: Job): number {
    let similarity = 0;

    // Skills similarity (50%)
    const skills1 = job1.skills || [];
    const skills2 = job2.skills || [];
    const commonSkills = skills1.filter(skill => skills2.includes(skill));
    const allSkills = [...new Set([...skills1, ...skills2])];
    
    if (allSkills.length > 0) {
      similarity += (commonSkills.length / allSkills.length) * 0.5;
    }

    // Experience level similarity (25%)
    const expSimilarity = this.calculateExperienceMatch(job1.experience || "", job2.experience || "");
    similarity += expSimilarity * 0.25;

    // Job type similarity (15%)
    if (job1.jobType === job2.jobType) {
      similarity += 0.15;
    }

    // Location similarity (10%)
    if (this.locationsMatch(job1.location, job2.location)) {
      similarity += 0.1;
    }

    return similarity;
  }

  /**
   * Calculate relevance score for guest users
   */
  private calculateRelevanceScore(query: string, job: Job): {
    matchScore: number;
    matchReasons: string[];
    skillsMatched: string[];
    skillsMissing: string[];
  } {
    const queryLower = query.toLowerCase();
    let score = 0;
    const reasons: string[] = [];

    // Title match (40%)
    if (job.title.toLowerCase().includes(queryLower)) {
      score += 0.4;
      reasons.push("Title matches search");
    }

    // Description match (30%)
    if (job.description.toLowerCase().includes(queryLower)) {
      score += 0.3;
      reasons.push("Description matches search");
    }

    // Skills match (30%)
    const skillMatches = (job.skills || []).filter(skill => 
      skill.toLowerCase().includes(queryLower)
    );
    
    if (skillMatches.length > 0) {
      score += 0.3;
      reasons.push("Skills match search");
    }

    return {
      matchScore: score,
      matchReasons: reasons,
      skillsMatched: skillMatches,
      skillsMissing: []
    };
  }

  /**
   * Check if two skills match (fuzzy matching)
   */
  private skillsMatch(skill1: string, skill2: string): boolean {
    const s1 = skill1.toLowerCase().trim();
    const s2 = skill2.toLowerCase().trim();
    
    // Exact match
    if (s1 === s2) return true;
    
    // Contains match
    if (s1.includes(s2) || s2.includes(s1)) return true;
    
    // Common skill variations
    const skillVariations: { [key: string]: string[] } = {
      'javascript': ['js', 'ecmascript', 'node.js', 'nodejs'],
      'react': ['reactjs', 'react.js'],
      'python': ['py'],
      'typescript': ['ts'],
      'css': ['css3'],
      'html': ['html5'],
    };

    for (const [canonical, variations] of Object.entries(skillVariations)) {
      if ((s1 === canonical && variations.includes(s2)) ||
          (s2 === canonical && variations.includes(s1))) {
        return true;
      }
    }

    return false;
  }

  /**
   * Calculate experience level match
   */
  private calculateExperienceMatch(userExp: string, jobExp: string): number {
    const expLevels = {
      'entry': 1,
      'junior': 1,
      'mid': 2,
      'senior': 3,
      'lead': 4,
      'executive': 5,
      'director': 5
    };

    const userLevel = expLevels[userExp.toLowerCase()] || 1;
    const jobLevel = expLevels[jobExp.toLowerCase()] || 1;

    const difference = Math.abs(userLevel - jobLevel);
    
    if (difference === 0) return 1;
    if (difference === 1) return 0.7;
    if (difference === 2) return 0.4;
    return 0.1;
  }

  /**
   * Calculate salary match
   */
  private calculateSalaryMatch(expectedSalary: number, salaryMin: number, salaryMax: number): number {
    if (expectedSalary >= salaryMin && expectedSalary <= salaryMax) {
      return 1; // Perfect match
    }
    
    if (expectedSalary < salaryMin) {
      const gap = salaryMin - expectedSalary;
      const tolerance = salaryMin * 0.2; // 20% tolerance
      return Math.max(0, 1 - (gap / tolerance));
    }
    
    if (expectedSalary > salaryMax) {
      const gap = expectedSalary - salaryMax;
      const tolerance = salaryMax * 0.3; // 30% tolerance for higher expectations
      return Math.max(0, 1 - (gap / tolerance));
    }
    
    return 0;
  }

  /**
   * Check if locations match
   */
  private locationsMatch(loc1: string, loc2: string): boolean {
    const l1 = loc1.toLowerCase().trim();
    const l2 = loc2.toLowerCase().trim();
    
    // Exact match
    if (l1 === l2) return true;
    
    // City name match (handles "Mumbai, India" vs "Mumbai")
    if (l1.includes(l2) || l2.includes(l1)) return true;
    
    return false;
  }
}

export const jobMatchingService = new JobMatchingService();