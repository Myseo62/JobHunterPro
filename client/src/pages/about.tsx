import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, Briefcase, Globe, TrendingUp, Heart, Shield } from "lucide-react";
import { useLocation } from "wouter";

export default function About() {
  const [, setLocation] = useLocation();

  const stats = [
    { icon: Users, label: "Active Users", value: "50,000+", color: "text-blue-600" },
    { icon: Briefcase, label: "Job Listings", value: "10,000+", color: "text-green-600" },
    { icon: Globe, label: "Companies", value: "2,500+", color: "text-purple-600" },
    { icon: TrendingUp, label: "Success Rate", value: "85%", color: "text-orange-600" }
  ];

  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description: "We're committed to connecting talent with opportunity, helping people find meaningful careers that align with their goals and aspirations."
    },
    {
      icon: Shield,
      title: "Trust & Transparency",
      description: "We prioritize honest communication, transparent processes, and building trust between job seekers and employers."
    },
    {
      icon: Heart,
      title: "People-Centric",
      description: "Every feature we build is designed with real people in mind, focusing on user experience and genuine career growth."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for excellence in everything we do, from our platform technology to our customer support experience."
    }
  ];

  const team = [
    {
      name: "Priya Sharma",
      role: "CEO & Co-Founder",
      description: "Former HR Director at tech unicorn with 12+ years experience in talent acquisition and career development.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Rajesh Kumar",
      role: "CTO & Co-Founder",
      description: "Ex-Senior Engineer at major Indian IT company, passionate about building technology that scales and serves millions.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Ananya Gupta",
      role: "Head of Operations",
      description: "Operations expert with experience scaling marketplaces, focused on creating seamless user experiences.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Vikram Singh",
      role: "Head of Engineering",
      description: "Full-stack engineer and team leader, committed to building reliable, secure, and user-friendly platforms.",
      image: "/api/placeholder/150/150"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About Career-Bazaar
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            We're on a mission to revolutionize how people find careers and how companies discover talent. 
            Career-Bazaar is more than just a job board—we're your partner in career growth and professional success.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={() => setLocation("/jobs")}>
              Browse Jobs
            </Button>
            <Button size="lg" variant="outline" onClick={() => setLocation("/contact")}>
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Our Story</CardTitle>
              <CardDescription className="text-lg">
                How Career-Bazaar came to life
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6">
                Founded in 2023 by a team of HR professionals and technology experts, Career-Bazaar was born from a simple observation: 
                the job search process was broken for both job seekers and employers.
              </p>
              
              <p className="text-gray-700 mb-6">
                Job seekers were spending countless hours applying to positions that weren't the right fit, while employers 
                struggled to find qualified candidates among thousands of applications. We knew there had to be a better way.
              </p>
              
              <p className="text-gray-700 mb-6">
                Our founders combined their expertise in human resources, technology, and user experience design to create 
                a platform that truly serves both sides of the hiring equation. Today, Career-Bazaar helps thousands of 
                professionals find meaningful work while enabling companies to discover exceptional talent.
              </p>
              
              <p className="text-gray-700">
                We're just getting started. Our vision is to become India's most trusted career platform, where every 
                interaction leads to better outcomes for everyone involved.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <value.icon className="w-8 h-8 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                      <p className="text-gray-600">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">
              The people building the future of career discovery
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-green-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <Badge variant="secondary" className="mb-3">{member.role}</Badge>
                  <p className="text-sm text-gray-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Target className="w-6 h-6 text-purple-600 mr-2" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  To democratize career opportunities by creating India's most comprehensive and user-friendly 
                  job platform. We strive to make career advancement accessible to everyone, regardless of their 
                  background, location, or experience level.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Globe className="w-6 h-6 text-green-600 mr-2" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  To become the bridge that connects every professional with their dream career while helping 
                  companies build exceptional teams. We envision a world where finding the right job or the 
                  perfect candidate is simple, transparent, and meaningful.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of professionals who have found their perfect career match on Career-Bazaar
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={() => setLocation("/register")}>
              Get Started Today
            </Button>
            <Button size="lg" variant="outline" onClick={() => setLocation("/employer/register")}>
              Hire Talent
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}