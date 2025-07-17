import { db } from './db';
import { users, companies, jobs, applications, jobCategories } from '@shared/schema';

async function seed() {
  try {
    console.log('🌱 Seeding database...');

    // Clear existing data (be careful with this in production!)
    await db.delete(applications);
    await db.delete(jobs);
    await db.delete(jobCategories);
    await db.delete(companies);
    await db.delete(users);

    // Insert sample companies
    const insertedCompanies = await db.insert(companies).values([
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
    ]).returning();

    console.log(`✅ Inserted ${insertedCompanies.length} companies`);

    // Insert job categories
    const insertedCategories = await db.insert(jobCategories).values([
      { name: "Software & IT", slug: "software-it", description: "Technology and software development roles" },
      { name: "Banking & Finance", slug: "banking-finance", description: "Financial services and banking roles" },
      { name: "Marketing", slug: "marketing", description: "Marketing and digital marketing roles" },
      { name: "Data Science", slug: "data-science", description: "Data analysis and machine learning roles" },
      { name: "Engineering", slug: "engineering", description: "Engineering and technical roles" },
      { name: "HR", slug: "hr", description: "Human resources and talent management roles" }
    ]).returning();

    console.log(`✅ Inserted ${insertedCategories.length} job categories`);

    // Insert sample jobs
    const insertedJobs = await db.insert(jobs).values([
      {
        title: "Senior Software Engineer",
        description: "Looking for experienced software engineers to work on cutting-edge technology projects. Strong background in Java, Spring Boot, and microservices required.",
        companyId: insertedCompanies[0].id, // TCS
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
        companyId: insertedCompanies[1].id, // Infosys
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
        companyId: insertedCompanies[3].id, // Wipro
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
        companyId: insertedCompanies[4].id, // Amazon
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
        companyId: insertedCompanies[2].id, // ICICI Bank
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
        companyId: insertedCompanies[5].id, // Microsoft
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
    ]).returning();

    console.log(`✅ Inserted ${insertedJobs.length} jobs`);

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
seed()
  .then(() => {
    console.log('✅ Seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });

export { seed };