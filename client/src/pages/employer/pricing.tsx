import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";
import { useLocation } from "wouter";

export default function EmployerPricing() {
  const [, setLocation] = useLocation();

  const plans = [
    {
      name: "Starter",
      price: "₹9,999",
      period: "/month",
      description: "Perfect for small businesses and startups",
      icon: <Zap className="h-6 w-6" />,
      features: [
        "Post up to 5 jobs per month",
        "Access to basic candidate database",
        "Email support",
        "Basic analytics",
        "30-day job posting duration",
        "Company profile page"
      ],
      buttonText: "Start Free Trial",
      popular: false
    },
    {
      name: "Professional",
      price: "₹19,999",
      period: "/month",
      description: "Most popular choice for growing companies",
      icon: <Star className="h-6 w-6" />,
      features: [
        "Post unlimited jobs",
        "Advanced candidate search & filters",
        "Priority support",
        "Advanced analytics & insights",
        "60-day job posting duration",
        "Featured company listing",
        "Resume database access",
        "Bulk messaging to candidates",
        "ATS integration"
      ],
      buttonText: "Start Professional",
      popular: true
    },
    {
      name: "Enterprise",
      price: "₹49,999",
      period: "/month",
      description: "For large organizations with complex needs",
      icon: <Crown className="h-6 w-6" />,
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Custom integrations",
        "White-label solutions",
        "Advanced reporting & analytics",
        "Multiple recruiter accounts",
        "Custom branding options",
        "API access",
        "24/7 phone support",
        "Onboarding assistance"
      ],
      buttonText: "Contact Sales",
      popular: false
    }
  ];

  const additionalFeatures = [
    {
      title: "Advanced Search",
      description: "Find the perfect candidates with powerful search filters including skills, experience, location, and salary expectations."
    },
    {
      title: "Analytics Dashboard",
      description: "Track your hiring performance with detailed analytics on job views, applications, and conversion rates."
    },
    {
      title: "ATS Integration",
      description: "Seamlessly integrate with your existing Applicant Tracking System for streamlined workflow."
    },
    {
      title: "Employer Branding",
      description: "Showcase your company culture and values to attract top talent with customizable company profiles."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Hiring Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the perfect plan to meet your recruitment needs. All plans include access to our 
            extensive candidate database and powerful hiring tools.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name} 
              className={`relative border-0 shadow-lg bg-white/95 backdrop-blur-md ${
                plan.popular ? 'ring-2 ring-purple-600 transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-green-600 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-purple-600 to-green-600 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl text-gray-900">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-1">{plan.period}</span>
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700' 
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                  onClick={() => {
                    if (plan.name === "Enterprise") {
                      // Handle contact sales
                      window.location.href = "mailto:sales@career-bazaar.com";
                    } else {
                      setLocation("/employer/register");
                    }
                  }}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Recruiting
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to find and hire the best talent efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {additionalFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
              <CardContent className="p-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-2">Can I change my plan anytime?</h3>
                <p className="text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
              <CardContent className="p-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial available?</h3>
                <p className="text-gray-600">
                  Yes, we offer a 14-day free trial for all plans. No credit card required to get started.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
              <CardContent className="p-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">
                  We accept all major credit cards, bank transfers, and UPI payments. All transactions are secure and encrypted.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-green-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Hiring?</h2>
          <p className="text-xl mb-8 text-purple-100">
            Join thousands of companies that trust Career-Bazaar for their recruitment needs
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => setLocation("/employer/register")}
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-600"
              onClick={() => window.location.href = "mailto:sales@career-bazaar.com"}
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}