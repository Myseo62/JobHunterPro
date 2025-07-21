import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
        </div>

        <div className="space-y-8">
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                We collect information you provide directly to us when you:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Create an account and complete your profile</li>
                <li>Apply for jobs or post job listings</li>
                <li>Contact us for support or inquiries</li>
                <li>Subscribe to our newsletters or marketing communications</li>
                <li>Participate in surveys or feedback forms</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Types of Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                The personal information we may collect includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Name, email address, and phone number</li>
                <li>Professional information such as work experience, skills, and education</li>
                <li>Resume and portfolio files</li>
                <li>Location and salary preferences</li>
                <li>Company information for employer accounts</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the collected information for various purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our service</li>
                <li>To allow you to participate in interactive features</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information to improve our service</li>
                <li>To monitor the usage of our service</li>
                <li>To detect, prevent and address technical issues</li>
                <li>To match job seekers with relevant opportunities</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Information Sharing</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>When you apply for a job, your information is shared with the respective employer</li>
                <li>With service providers who assist us in operating our platform</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Data Security</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate security measures to protect your personal information against unauthorized access, 
                alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic 
                storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Access and update your personal information</li>
                <li>Delete your account and personal data</li>
                <li>Opt-out of marketing communications</li>
                <li>Request a copy of your data</li>
                <li>Withdraw consent for data processing</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our service and store certain information. 
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 font-medium">Email: privacy@career-bazaar.com</p>
                <p className="text-gray-700 font-medium">Phone: +91 98765 43210</p>
                <p className="text-gray-700 font-medium">Address: 123 Business District, Mumbai, India</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 text-gray-600">
          <p>Last updated: July 17, 2025</p>
        </div>
      </div>
    </div>
  );
}