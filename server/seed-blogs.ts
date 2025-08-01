import { db } from "./db";
import { blogPosts, users } from "@shared/schema";
import { eq } from "drizzle-orm";

const sampleBlogs = [
  {
    title: "Top 10 Interview Questions That Every Software Engineer Should Master",
    excerpt: "Prepare for your next tech interview with these essential questions that top companies ask. From coding challenges to system design, we cover it all.",
    content: `<div class="prose prose-lg">
      <h2>Introduction</h2>
      <p>Landing your dream job in software engineering requires more than just technical skills. You need to be prepared for the interview process, which can be challenging and competitive. Based on insights from top tech companies and career experts, here are the 10 most important interview questions every software engineer should master.</p>
      
      <h2>1. Tell me about yourself</h2>
      <p>This classic opener sets the tone for your entire interview. Craft a compelling 2-3 minute narrative that highlights your technical journey, key achievements, and what drives you as a developer.</p>
      
      <h2>2. What's your experience with [specific technology]?</h2>
      <p>Be prepared to discuss your hands-on experience with technologies listed in the job description. Share specific projects and challenges you've overcome.</p>
      
      <h2>3. Describe a challenging project you worked on</h2>
      <p>Use the STAR method (Situation, Task, Action, Result) to structure your response. Focus on technical challenges and your problem-solving approach.</p>
      
      <h2>4. How do you handle debugging and troubleshooting?</h2>
      <p>Demonstrate your systematic approach to identifying and resolving issues. Mention tools and methodologies you use.</p>
      
      <h2>5. Explain a complex technical concept to a non-technical person</h2>
      <p>This tests your communication skills. Choose a concept you know well and break it down using analogies and simple language.</p>
      
      <h2>6. How do you stay updated with technology trends?</h2>
      <p>Show your passion for continuous learning. Mention specific resources, communities, and practices you follow.</p>
      
      <h2>7. Describe your experience with version control</h2>
      <p>Git is essential in modern development. Be ready to discuss branching strategies, merge conflicts, and collaboration workflows.</p>
      
      <h2>8. How do you approach code reviews?</h2>
      <p>Demonstrate your understanding of code quality, team collaboration, and constructive feedback.</p>
      
      <h2>9. What's your experience with testing?</h2>
      <p>Discuss unit testing, integration testing, and your approach to writing maintainable, testable code.</p>
      
      <h2>10. Why do you want to work here?</h2>
      <p>Research the company thoroughly. Connect your career goals with the company's mission and the specific role.</p>
      
      <h2>Conclusion</h2>
      <p>Remember, interviews are conversations, not interrogations. Prepare thoughtful questions about the role, team, and company culture. Good luck!</p>
    </div>`,
    category: "interview",
    tags: ["interview", "software engineering", "career advice", "tech jobs"],
    viewCount: 245,
    likeCount: 18,
    isPublished: true
  },
  {
    title: "Remote Work Best Practices: Thriving in a Digital-First Career",
    excerpt: "Master the art of remote work with proven strategies for productivity, communication, and career growth in the digital age.",
    content: `<div class="prose prose-lg">
      <h2>The Remote Work Revolution</h2>
      <p>The shift to remote work has fundamentally changed how we approach our careers. Whether you're new to remote work or looking to optimize your current setup, these best practices will help you thrive in a digital-first environment.</p>
      
      <h2>Creating Your Ideal Workspace</h2>
      <p>Your physical environment significantly impacts your productivity and well-being:</p>
      <ul>
        <li>Invest in ergonomic furniture and proper lighting</li>
        <li>Separate your work area from personal spaces</li>
        <li>Minimize distractions and optimize for focus</li>
        <li>Ensure reliable internet and backup solutions</li>
      </ul>
      
      <h2>Mastering Communication</h2>
      <p>Effective communication is crucial in remote teams:</p>
      <ul>
        <li>Over-communicate rather than under-communicate</li>
        <li>Use video calls for complex discussions</li>
        <li>Document decisions and important conversations</li>
        <li>Respect time zones and response expectations</li>
      </ul>
      
      <h2>Building Strong Relationships</h2>
      <p>Maintaining professional relationships remotely requires intentional effort:</p>
      <ul>
        <li>Schedule regular one-on-ones with your manager</li>
        <li>Participate actively in team virtual events</li>
        <li>Find informal ways to connect with colleagues</li>
        <li>Be visible and available during core hours</li>
      </ul>
      
      <h2>Career Development Strategies</h2>
      <p>Don't let distance hinder your career growth:</p>
      <ul>
        <li>Set clear goals and communicate them to your manager</li>
        <li>Seek out stretch assignments and new challenges</li>
        <li>Build your online professional presence</li>
        <li>Invest in continuous learning and skill development</li>
      </ul>
      
      <h2>Work-Life Balance</h2>
      <p>Remote work can blur boundaries, making balance crucial:</p>
      <ul>
        <li>Establish clear start and end times</li>
        <li>Take regular breaks and lunch away from your desk</li>
        <li>Create rituals to transition between work and personal time</li>
        <li>Prioritize physical activity and social connections</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Remote work offers incredible opportunities for flexibility and career growth. By implementing these best practices, you'll not only succeed in your current role but position yourself for long-term career success in our increasingly digital world.</p>
    </div>`,
    category: "career",
    tags: ["remote work", "productivity", "career growth", "work-life balance"],
    viewCount: 189,
    likeCount: 24,
    isPublished: true
  },
  {
    title: "Transitioning from Junior to Senior Developer: A Practical Roadmap",
    excerpt: "Navigate your career progression with concrete steps and strategies to advance from junior to senior developer status.",
    content: `<div class="prose prose-lg">
      <h2>Understanding the Journey</h2>
      <p>The transition from junior to senior developer isn't just about years of experience—it's about developing a comprehensive skill set that encompasses technical expertise, leadership abilities, and business acumen.</p>
      
      <h2>Technical Mastery</h2>
      <p>Build deep expertise in your chosen technology stack:</p>
      <ul>
        <li>Master advanced concepts and design patterns</li>
        <li>Understand system architecture and scalability</li>
        <li>Learn multiple programming languages and paradigms</li>
        <li>Gain experience with databases, APIs, and cloud platforms</li>
      </ul>
      
      <h2>Problem-Solving Skills</h2>
      <p>Senior developers are distinguished by their approach to complex problems:</p>
      <ul>
        <li>Break down complex requirements into manageable tasks</li>
        <li>Consider multiple solutions and their trade-offs</li>
        <li>Think about long-term maintainability and scalability</li>
        <li>Debug efficiently and systematically</li>
      </ul>
      
      <h2>Code Quality and Best Practices</h2>
      <p>Write code that others can understand and maintain:</p>
      <ul>
        <li>Follow clean code principles and coding standards</li>
        <li>Write comprehensive tests and documentation</li>
        <li>Conduct thorough code reviews</li>
        <li>Understand security best practices</li>
      </ul>
      
      <h2>Leadership and Mentorship</h2>
      <p>Senior developers guide and support their teams:</p>
      <ul>
        <li>Mentor junior developers and share knowledge</li>
        <li>Lead technical discussions and decision-making</li>
        <li>Communicate effectively with stakeholders</li>
        <li>Take ownership of project outcomes</li>
      </ul>
      
      <h2>Business Understanding</h2>
      <p>Connect technical decisions to business value:</p>
      <ul>
        <li>Understand the product and its users</li>
        <li>Consider cost and time implications of technical choices</li>
        <li>Contribute to product planning and strategy</li>
        <li>Communicate technical concepts to non-technical stakeholders</li>
      </ul>
      
      <h2>Continuous Learning</h2>
      <p>Stay current in a rapidly evolving field:</p>
      <ul>
        <li>Follow industry trends and emerging technologies</li>
        <li>Attend conferences and participate in communities</li>
        <li>Contribute to open source projects</li>
        <li>Read technical books and research papers</li>
      </ul>
      
      <h2>Creating Your Action Plan</h2>
      <p>Set specific, measurable goals for your growth:</p>
      <ol>
        <li>Assess your current skills and identify gaps</li>
        <li>Create a learning plan with timelines</li>
        <li>Seek challenging projects and responsibilities</li>
        <li>Find mentors and build your professional network</li>
        <li>Document your achievements and impact</li>
      </ol>
      
      <h2>Conclusion</h2>
      <p>The journey to senior developer is rewarding but requires dedication and strategic thinking. Focus on building both technical depth and breadth while developing the soft skills that distinguish senior engineers. Remember, it's not just about what you know—it's about how you apply that knowledge to create value for your team and organization.</p>
    </div>`,
    category: "career",
    tags: ["career progression", "senior developer", "technical leadership", "professional development"],
    viewCount: 312,
    likeCount: 35,
    isPublished: true
  },
  {
    title: "Salary Negotiation Strategies for Tech Professionals",
    excerpt: "Learn effective techniques to negotiate fair compensation and advance your career financially in the competitive tech industry.",
    content: `<div class="prose prose-lg">
      <h2>Know Your Worth</h2>
      <p>Before entering any negotiation, research is crucial:</p>
      <ul>
        <li>Use salary comparison websites and industry reports</li>
        <li>Network with professionals in similar roles</li>
        <li>Consider location, company size, and industry factors</li>
        <li>Factor in total compensation, not just base salary</li>
      </ul>
      
      <h2>Timing Your Negotiation</h2>
      <p>Strategic timing can significantly impact your success:</p>
      <ul>
        <li>During performance reviews and promotion cycles</li>
        <li>After completing major projects or achievements</li>
        <li>When taking on additional responsibilities</li>
        <li>During job offer negotiations</li>
      </ul>
      
      <h2>Building Your Case</h2>
      <p>Present compelling evidence for your request:</p>
      <ul>
        <li>Document your achievements and impact</li>
        <li>Quantify your contributions with metrics</li>
        <li>Highlight skills that are in high demand</li>
        <li>Show how you've grown beyond your current role</li>
      </ul>
      
      <h2>Negotiation Techniques</h2>
      <p>Approach the conversation professionally and strategically:</p>
      <ul>
        <li>Start with relationship-building, not demands</li>
        <li>Present your case clearly and confidently</li>
        <li>Listen actively to understand their perspective</li>
        <li>Be prepared to negotiate beyond just salary</li>
      </ul>
      
      <h2>Beyond Base Salary</h2>
      <p>Consider the full compensation package:</p>
      <ul>
        <li>Equity and stock options</li>
        <li>Bonuses and performance incentives</li>
        <li>Professional development budget</li>
        <li>Flexible work arrangements</li>
        <li>Health benefits and retirement contributions</li>
      </ul>
      
      <h2>Common Mistakes to Avoid</h2>
      <ul>
        <li>Making it personal rather than professional</li>
        <li>Negotiating based on personal needs alone</li>
        <li>Accepting the first offer without discussion</li>
        <li>Burning bridges if negotiations don't go as planned</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Successful salary negotiation is a skill that pays dividends throughout your career. Approach it with preparation, professionalism, and confidence. Remember, the worst they can say is no, but they're more likely to say yes when you present a compelling case for your value.</p>
    </div>`,
    category: "career",
    tags: ["salary negotiation", "compensation", "career advice", "professional growth"],
    viewCount: 198,
    likeCount: 22,
    isPublished: true
  },
  {
    title: "Building a Strong Professional Network in Tech",
    excerpt: "Discover effective strategies to build meaningful professional relationships that can accelerate your career in technology.",
    content: `<div class="prose prose-lg">
      <h2>The Power of Professional Networks</h2>
      <p>In the tech industry, your network can be just as valuable as your technical skills. Strong professional relationships open doors to opportunities, provide learning resources, and offer support throughout your career journey.</p>
      
      <h2>Start Where You Are</h2>
      <p>Building a network doesn't require starting from scratch:</p>
      <ul>
        <li>Connect with current and former colleagues</li>
        <li>Reach out to classmates and bootcamp peers</li>
        <li>Engage with mentors and industry leaders you admire</li>
        <li>Join professional organizations and local meetups</li>
      </ul>
      
      <h2>Online Networking Strategies</h2>
      <p>Leverage digital platforms to expand your reach:</p>
      <ul>
        <li>Optimize your LinkedIn profile with keywords and achievements</li>
        <li>Share valuable content and engage thoughtfully with others' posts</li>
        <li>Participate in Twitter discussions and tech communities</li>
        <li>Contribute to open source projects and developer forums</li>
      </ul>
      
      <h2>In-Person Networking</h2>
      <p>Face-to-face interactions create deeper connections:</p>
      <ul>
        <li>Attend tech conferences and industry events</li>
        <li>Join local developer meetups and user groups</li>
        <li>Participate in hackathons and coding competitions</li>
        <li>Volunteer for tech organizations and causes</li>
      </ul>
      
      <h2>Providing Value to Others</h2>
      <p>The best networking is about giving, not just receiving:</p>
      <ul>
        <li>Share knowledge and resources freely</li>
        <li>Make introductions between people who should know each other</li>
        <li>Offer help with projects or challenges</li>
        <li>Mentor newcomers to the industry</li>
      </ul>
      
      <h2>Maintaining Relationships</h2>
      <p>Building a network is ongoing work:</p>
      <ul>
        <li>Follow up consistently but not excessively</li>
        <li>Remember personal details and celebrate others' successes</li>
        <li>Share opportunities that might interest your connections</li>
        <li>Schedule regular check-ins with key contacts</li>
      </ul>
      
      <h2>Quality Over Quantity</h2>
      <p>Focus on building meaningful relationships rather than collecting contacts:</p>
      <ul>
        <li>Invest time in getting to know people personally</li>
        <li>Be authentic and genuine in your interactions</li>
        <li>Look for mutual interests and shared values</li>
        <li>Build relationships before you need them</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>A strong professional network is built over time through consistent, authentic engagement. Focus on building genuine relationships, providing value to others, and staying connected with your community. Your network will become one of your most valuable career assets.</p>
    </div>`,
    category: "career",
    tags: ["networking", "professional development", "career growth", "relationships"],
    viewCount: 167,
    likeCount: 19,
    isPublished: true
  }
];

export async function seedBlogs() {
  try {
    // Find the first candidate user to assign blogs to
    const [candidateUser] = await db
      .select()
      .from(users)
      .where(eq(users.role, 'candidate'))
      .limit(1);

    if (!candidateUser) {
      console.log("No candidate users found. Skipping blog seeding.");
      return;
    }

    // Check if blogs already exist
    const existingBlogs = await db.select().from(blogPosts).limit(1);
    if (existingBlogs.length > 0) {
      console.log("Blogs already exist. Skipping seeding.");
      return;
    }

    // Insert sample blogs
    for (const blog of sampleBlogs) {
      await db.insert(blogPosts).values({
        ...blog,
        userId: candidateUser.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    console.log(`Seeded ${sampleBlogs.length} sample blogs successfully!`);
  } catch (error) {
    console.error("Error seeding blogs:", error);
  }
}