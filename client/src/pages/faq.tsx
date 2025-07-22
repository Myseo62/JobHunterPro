import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, HelpCircle, Users, Briefcase, Building2, CreditCard } from "lucide-react";

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All", icon: HelpCircle },
    { id: "job-seekers", label: "Job Seekers", icon: Users },
    { id: "employers", label: "Employers", icon: Building2 },
    { id: "applications", label: "Applications", icon: Briefcase },
    { id: "billing", label: "Billing", icon: CreditCard }
  ];

  const faqs = [
    // Job Seekers
    {
      id: 1,
      category: "job-seekers",
      question: "How do I create an account on Career-Bazaar?",
      answer: "Creating an account is simple! Click the 'Register' button in the top navigation, fill out your personal information, add your skills and experience, and verify your email address. Your account will be ready to use immediately."
    },
    {
      id: 2,
      category: "job-seekers",
      question: "Is Career-Bazaar free for job seekers?",
      answer: "Yes! Career-Bazaar is completely free for job seekers. You can create an account, browse jobs, apply to positions, and use all candidate features at no cost."
    },
    {
      id: 3,
      category: "job-seekers",
      question: "How do I search for jobs?",
      answer: "Use our powerful job search on the home page or jobs page. You can search by keywords, location, salary range, experience level, and job type. Use filters to narrow down results to find the perfect match."
    },
    {
      id: 4,
      category: "job-seekers",
      question: "Can I save jobs for later?",
      answer: "Absolutely! Click the bookmark icon on any job listing to save it to your 'Saved Jobs' page. You can access all your saved jobs from your profile menu."
    },
    {
      id: 5,
      category: "job-seekers",
      question: "How do I set up job alerts?",
      answer: "Go to your 'Job Alerts' page and create custom alerts based on your preferences. You'll receive email notifications when new jobs matching your criteria are posted."
    },
    
    // Applications
    {
      id: 6,
      category: "applications",
      question: "How do I apply for a job?",
      answer: "Find a job you're interested in, click 'Apply Now', review the job details, and submit your application. Make sure your profile is complete for the best results."
    },
    {
      id: 7,
      category: "applications",
      question: "Can I track my job applications?",
      answer: "Yes! Visit your 'Applications' page to see all your submitted applications, their current status, and any updates from employers."
    },
    {
      id: 8,
      category: "applications",
      question: "Why was my application rejected?",
      answer: "Application decisions depend on many factors including experience, skills match, and competition. Use rejections as learning opportunities to improve your profile and application strategy."
    },
    {
      id: 9,
      category: "applications",
      question: "How long does it take to hear back after applying?",
      answer: "Response times vary by company and position. Most employers respond within 1-2 weeks. You can track your application status in your Applications dashboard."
    },
    
    // Employers
    {
      id: 10,
      category: "employers",
      question: "How do I post a job on Career-Bazaar?",
      answer: "Register as an employer, verify your company information, and use our job posting interface. You can create detailed job descriptions, set requirements, and manage applications all in one place."
    },
    {
      id: 11,
      category: "employers",
      question: "How much does it cost to post jobs?",
      answer: "We offer various pricing plans for employers. Basic job postings start at ₹2,999 per month, with premium plans offering additional features like candidate search and enhanced visibility."
    },
    {
      id: 12,
      category: "employers",
      question: "How do I manage job applications?",
      answer: "Use your Employer Dashboard to view, sort, and respond to applications. You can shortlist candidates, schedule interviews, and communicate directly with applicants."
    },
    {
      id: 13,
      category: "employers",
      question: "Can I search for candidates directly?",
      answer: "Yes! Premium employer accounts include access to our candidate database where you can search profiles, view resumes, and reach out to potential hires directly."
    },
    {
      id: 14,
      category: "employers",
      question: "How do I verify my company?",
      answer: "During registration, provide your company registration documents and official email domain. Our team will verify your company within 24-48 hours."
    },
    
    // Billing
    {
      id: 15,
      category: "billing",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, net banking, UPI, and digital wallets. All payments are processed securely through encrypted channels."
    },
    {
      id: 16,
      category: "billing",
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period."
    },
    {
      id: 17,
      category: "billing",
      question: "Do you offer refunds?",
      answer: "We offer refunds within 7 days of purchase if you haven't used any paid features. Contact our support team for refund requests."
    },
    {
      id: 18,
      category: "billing",
      question: "How do I download invoices?",
      answer: "All invoices are available in your account settings under the 'Billing' section. You can download them as PDF files for your records."
    },

    // General
    {
      id: 19,
      category: "general",
      question: "Is my personal information secure?",
      answer: "Yes! We use industry-standard encryption and security measures to protect your data. Read our Privacy Policy for detailed information about how we handle your personal information."
    },
    {
      id: 20,
      category: "general",
      question: "How do I contact customer support?",
      answer: "You can reach our support team through our Contact page, email us at support@career-bazaar.com, or call our helpline. We're available Monday-Friday 9 AM to 6 PM."
    },
    {
      id: 21,
      category: "general",
      question: "Can I use Career-Bazaar on mobile?",
      answer: "Yes! Our website is fully responsive and works great on mobile devices. We're also working on dedicated mobile apps for iOS and Android."
    },
    {
      id: 22,
      category: "general",
      question: "How do I delete my account?",
      answer: "You can delete your account from the Account Settings page. This action is permanent and will remove all your data from our platform."
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find quick answers to common questions about Career-Bazaar
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-lg"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1 flex items-center gap-1"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <category.icon className="w-3 h-3" />
                  {category.label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Results */}
        {filteredFAQs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No FAQs found</p>
              <p className="text-sm text-gray-500">
                Try adjusting your search terms or selecting a different category
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>
                {filteredFAQs.length} {filteredFAQs.length === 1 ? 'Question' : 'Questions'} Found
              </CardTitle>
              {selectedCategory !== "all" && (
                <CardDescription>
                  Showing results for: {categories.find(c => c.id === selectedCategory)?.label}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((faq) => (
                  <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="mt-1 flex-shrink-0">
                          {categories.find(c => c.id === faq.category)?.label}
                        </Badge>
                        <span className="font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 pl-20">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}

        {/* Still have questions? */}
        <Card className="mt-12">
          <CardHeader className="text-center">
            <CardTitle>Still have questions?</CardTitle>
            <CardDescription>
              Can't find what you're looking for? We're here to help!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Our support team is available Monday through Friday from 9:00 AM to 6:00 PM IST
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="text-sm">
                <p className="font-medium text-gray-900">Email Support</p>
                <p className="text-gray-600">support@career-bazaar.com</p>
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">Phone Support</p>
                <p className="text-gray-600">+91 1800-123-4567</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}