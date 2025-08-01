import { z } from "zod";

// Resume parsing service for extracting data from uploaded resumes
export class ResumeParser {
  
  // Parse resume text and extract structured data
  static async parseResumeText(resumeText: string): Promise<ParsedResumeData> {
    try {
      const extractedData = {
        personalInfo: this.extractPersonalInfo(resumeText),
        skills: this.extractSkills(resumeText),
        workExperience: this.extractWorkExperience(resumeText),
        education: this.extractEducation(resumeText),
        certifications: this.extractCertifications(resumeText),
        projects: this.extractProjects(resumeText),
        languages: this.extractLanguages(resumeText),
        summary: this.extractSummary(resumeText),
      };

      return extractedData;
    } catch (error) {
      console.error('Error parsing resume:', error);
      throw new Error('Failed to parse resume');
    }
  }

  // Extract personal information
  private static extractPersonalInfo(text: string): PersonalInfo {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phoneRegex = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const linkedinRegex = /linkedin\.com\/in\/[\w-]+/gi;
    const githubRegex = /github\.com\/[\w-]+/gi;

    const emails = text.match(emailRegex) || [];
    const phones = text.match(phoneRegex) || [];
    const linkedinUrls = text.match(linkedinRegex) || [];
    const githubUrls = text.match(githubRegex) || [];

    return {
      email: emails[0] || null,
      phone: phones[0] || null,
      linkedinUrl: linkedinUrls[0] ? `https://${linkedinUrls[0]}` : null,
      githubUrl: githubUrls[0] ? `https://${githubUrls[0]}` : null,
    };
  }

  // Extract skills using common patterns and keywords
  private static extractSkills(text: string): string[] {
    const skillKeywords = [
      // Programming Languages
      'JavaScript', 'Python', 'Java', 'C++', 'C#', 'TypeScript', 'PHP', 'Ruby', 'Go', 'Rust', 'Kotlin', 'Swift',
      'HTML', 'CSS', 'SQL', 'R', 'MATLAB', 'Scala', 'Perl', 'Dart', 'Objective-C',
      
      // Frameworks & Libraries
      'React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'Rails',
      'Bootstrap', 'Tailwind', 'jQuery', 'Next.js', 'Nuxt.js', 'Svelte', 'Gatsby',
      
      // Databases
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'Cassandra', 'DynamoDB', 'Firebase',
      
      // Cloud & DevOps
      'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab', 'CircleCI', 'Terraform',
      'Ansible', 'Chef', 'Puppet', 'Vagrant', 'Nginx', 'Apache',
      
      // Tools & Technologies
      'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Slack', 'Teams', 'Figma', 'Sketch', 'Adobe XD',
      'Photoshop', 'Illustrator', 'InDesign', 'Tableau', 'Power BI', 'Excel', 'Google Analytics',
      
      // Mobile Development
      'React Native', 'Flutter', 'Ionic', 'Xamarin', 'Android', 'iOS', 'Swift', 'Kotlin',
      
      // Data Science & AI
      'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn',
      'Jupyter', 'Keras', 'OpenCV', 'NLP', 'Computer Vision', 'Data Analysis', 'Statistics',
      
      // Testing
      'Jest', 'Mocha', 'Cypress', 'Selenium', 'JUnit', 'PyTest', 'PHPUnit', 'Karma', 'Jasmine',
      
      // Project Management
      'Agile', 'Scrum', 'Kanban', 'Waterfall', 'Project Management', 'Team Leadership', 'Stakeholder Management',
      
      // Soft Skills
      'Communication', 'Leadership', 'Problem Solving', 'Team Collaboration', 'Critical Thinking',
      'Time Management', 'Adaptability', 'Creativity', 'Analytical Thinking'
    ];

    const foundSkills: string[] = [];
    const normalizedText = text.toLowerCase();

    skillKeywords.forEach(skill => {
      if (normalizedText.includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    });

    // Remove duplicates and return
    return [...new Set(foundSkills)];
  }

  // Extract work experience
  private static extractWorkExperience(text: string): WorkExperienceData[] {
    const experienceSection = this.extractSection(text, ['experience', 'work history', 'employment', 'professional experience']);
    if (!experienceSection) return [];

    // Simple pattern matching for job titles and companies
    const jobPatterns = [
      /(?:^|\n)([A-Z][^|\n]+?)(?:\s*[-|]\s*)([A-Z][^|\n]+?)(?:\s*[-|]\s*)?(\d{4}(?:\s*[-]\s*\d{4}|\s*[-]\s*present)?)/gim,
    ];

    const experiences: WorkExperienceData[] = [];
    
    jobPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(experienceSection)) !== null) {
        experiences.push({
          jobTitle: match[1]?.trim() || '',
          companyName: match[2]?.trim() || '',
          duration: match[3]?.trim() || '',
          description: '',
        });
      }
    });

    return experiences;
  }

  // Extract education information
  private static extractEducation(text: string): EducationData[] {
    const educationSection = this.extractSection(text, ['education', 'academic background', 'qualification']);
    if (!educationSection) return [];

    const degreePatterns = [
      /(?:bachelor|master|phd|diploma|certificate|b\.?tech|m\.?tech|mba|bba|bca|mca|be|me|ms|bs|ba|ma)/gi,
    ];

    const educationEntries: EducationData[] = [];
    const lines = educationSection.split('\n');

    lines.forEach(line => {
      degreePatterns.forEach(pattern => {
        if (pattern.test(line)) {
          // Extract year if present
          const yearMatch = line.match(/\b(19|20)\d{2}\b/);
          educationEntries.push({
            degree: line.trim(),
            institution: '',
            year: yearMatch ? yearMatch[0] : '',
          });
        }
      });
    });

    return educationEntries;
  }

  // Extract certifications
  private static extractCertifications(text: string): CertificationData[] {
    const certSection = this.extractSection(text, ['certification', 'certificates', 'licensed', 'credentials']);
    if (!certSection) return [];

    const certificationKeywords = [
      'AWS', 'Azure', 'Google Cloud', 'PMP', 'Scrum Master', 'Six Sigma', 'CISSP', 'CISA', 'CompTIA',
      'Oracle', 'Microsoft', 'Cisco', 'VMware', 'Red Hat', 'Kubernetes', 'Docker'
    ];

    const certifications: CertificationData[] = [];
    const lines = certSection.split('\n');

    lines.forEach(line => {
      certificationKeywords.forEach(keyword => {
        if (line.toLowerCase().includes(keyword.toLowerCase())) {
          certifications.push({
            name: line.trim(),
            issuer: keyword,
          });
        }
      });
    });

    return certifications;
  }

  // Extract projects
  private static extractProjects(text: string): ProjectData[] {
    const projectSection = this.extractSection(text, ['project', 'portfolio', 'work samples']);
    if (!projectSection) return [];

    const projects: ProjectData[] = [];
    const lines = projectSection.split('\n').filter(line => line.trim().length > 10);

    lines.forEach(line => {
      if (line.length > 20) { // Assume substantial lines are project descriptions
        projects.push({
          name: line.substring(0, 50).trim() + '...',
          description: line.trim(),
        });
      }
    });

    return projects.slice(0, 5); // Limit to 5 projects
  }

  // Extract languages
  private static extractLanguages(text: string): string[] {
    const languageSection = this.extractSection(text, ['language', 'linguistic']);
    if (!languageSection) return [];

    const commonLanguages = [
      'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 'Arabic',
      'Hindi', 'Bengali', 'Portuguese', 'Russian', 'Italian', 'Dutch', 'Swedish', 'Norwegian'
    ];

    const foundLanguages: string[] = [];
    const normalizedText = languageSection.toLowerCase();

    commonLanguages.forEach(lang => {
      if (normalizedText.includes(lang.toLowerCase())) {
        foundLanguages.push(lang);
      }
    });

    return foundLanguages;
  }

  // Extract professional summary
  private static extractSummary(text: string): string {
    const summarySection = this.extractSection(text, ['summary', 'objective', 'profile', 'about']);
    if (summarySection) {
      return summarySection.substring(0, 500).trim();
    }

    // If no specific summary section, take first few lines
    const lines = text.split('\n').filter(line => line.trim().length > 20);
    return lines.slice(0, 3).join(' ').substring(0, 500).trim();
  }

  // Helper method to extract sections by keywords
  private static extractSection(text: string, keywords: string[]): string | null {
    const lines = text.split('\n');
    let sectionStart = -1;
    let sectionEnd = lines.length;

    // Find section start
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (keywords.some(keyword => line.includes(keyword))) {
        sectionStart = i;
        break;
      }
    }

    if (sectionStart === -1) return null;

    // Find section end (next major heading or end of document)
    const majorHeadings = ['experience', 'education', 'skills', 'projects', 'awards', 'references'];
    for (let i = sectionStart + 1; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (majorHeadings.some(heading => line.includes(heading) && !keywords.includes(heading))) {
        sectionEnd = i;
        break;
      }
    }

    return lines.slice(sectionStart, sectionEnd).join('\n');
  }
}

// Type definitions for parsed resume data
export interface ParsedResumeData {
  personalInfo: PersonalInfo;
  skills: string[];
  workExperience: WorkExperienceData[];
  education: EducationData[];
  certifications: CertificationData[];
  projects: ProjectData[];
  languages: string[];
  summary: string;
}

export interface PersonalInfo {
  email: string | null;
  phone: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
}

export interface WorkExperienceData {
  jobTitle: string;
  companyName: string;
  duration: string;
  description: string;
}

export interface EducationData {
  degree: string;
  institution: string;
  year: string;
}

export interface CertificationData {
  name: string;
  issuer: string;
}

export interface ProjectData {
  name: string;
  description: string;
}

// Validation schemas
export const resumeUploadSchema = z.object({
  fileName: z.string().min(1),
  fileSize: z.number().positive(),
  fileType: z.string().regex(/^application\/pdf$|^text\/|^application\/msword|^application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document$/),
});

export const profileUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedinUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  portfolioUrl: z.string().url().optional(),
  profileSummary: z.string().optional(),
  careerObjective: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experience: z.number().min(0).optional(),
  currentSalary: z.number().positive().optional(),
  expectedSalary: z.number().positive().optional(),
  noticePeriod: z.string().optional(),
  willingToRelocate: z.boolean().optional(),
});