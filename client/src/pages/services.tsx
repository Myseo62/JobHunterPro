import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, FileText, Target, Briefcase, TrendingUp, Star, ArrowRight } from "lucide-react";

interface ServicesProps {
  user?: any;
}

export default function Services({ user }: ServicesProps) {
  const services = [
    {
      id: 1,
      title: "Resume Building",
      description: "Professional resume creation and optimization service",
      features: [
        "ATS-optimized templates",
        "Industry-specific formatting",
        "Professional review",
        "Unlimited revisions"
      ],
      price: "₹999",
      duration: "2-3 days",
      icon: FileText,
      popular: false
    },
    {
      id: 2,
      title: "Career Counseling", 
      description: "One-on-one career guidance from industry experts",
      features: [
        "60-minute consultation",
        "Career roadmap planning",
        "Skill gap analysis",
        "Industry insights"
      ],
      price: "₹1,999",
      duration: "1 hour",
      icon: Target,
      popular: true
    },
    {
      id: 3,
      title: "Interview Preparation",
      description: "Mock interviews and personalized feedback",
      features: [
        "Live mock interviews",
        "Behavioral questions practice",
        "Technical assessment prep",
        "Confidence building"
      ],
      price: "₹1,499",
      duration: "90 minutes",
      icon: Users,
      popular: false
    },
    {
      id: 4,
      title: "Job Search Premium",
      description: "Enhanced job search with priority support",
      features: [
        "Priority job alerts",
        "Direct recruiter contact",
        "Application tracking",
        "Salary negotiation tips"
      ],
      price: "₹2,999/month",
      duration: "Monthly",
      icon: Briefcase,
      popular: true
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer at Google",
      content: "The career counseling service helped me transition from a service company to a product role. The guidance was invaluable!",
      rating: 5
    },
    {
      name: "Rahul Singh",
      role: "Data Scientist at Microsoft",
      content: "Resume building service transformed my profile. I started getting interview calls within a week of updating my resume.",
      rating: 5
    },
    {
      name: "Anjali Patel",
      role: "Product Manager at Flipkart",
      content: "Interview preparation sessions boosted my confidence significantly. Landed my dream job on the first try!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Career Services That Get Results
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Professional career services designed to accelerate your job search and career growth
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Expert Career Coaches</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Proven Success Rate</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Money-back Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Service</h2>
          <p className="text-lg text-gray-600">Tailored solutions for every stage of your career journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={service.id} 
                className={`relative overflow-hidden border-0 cb-shadow-glow bg-white/95 backdrop-blur-md hover:shadow-xl transition-all duration-300 ${
                  service.popular ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                {service.popular && (
                  <div className="absolute top-4 right-4">
                    <Badge className="cb-gradient-primary border-0">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 cb-gradient-primary rounded-lg flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">{service.title}</CardTitle>
                      <p className="text-gray-600 mt-1">{service.description}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{service.price}</div>
                      <div className="text-sm text-gray-500">Delivery: {service.duration}</div>
                    </div>
                    <Button className="cb-gradient-primary border-0 hover:shadow-lg transition-all duration-300">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Success Stories */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-lg text-gray-600">Hear from professionals who transformed their careers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 cb-shadow-glow bg-white/95 backdrop-blur-md">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Accelerate Your Career?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals who have transformed their careers with our services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 transition-colors"
            >
              Book Free Consultation
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-purple-600 transition-colors"
            >
              View All Services
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}