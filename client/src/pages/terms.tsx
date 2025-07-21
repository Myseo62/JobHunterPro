import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
          <p className="text-xl text-gray-600">
            Please read these terms and conditions carefully before using our service
          </p>
        </div>

        <div className="space-y-8">
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                By accessing and using Career-Bazaar, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">2. Use License</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Permission is granted to temporarily download one copy of the materials on Career-Bazaar's website for personal, 
                non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">3. User Account</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. 
                You are responsible for safeguarding the password and for all activities that occur under your account.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You agree not to disclose your password to any third party and to take sole responsibility for activities and actions 
                under your password, whether or not you have authorized such activities or actions.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">4. Job Listings and Applications</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Career-Bazaar provides a platform for job seekers and employers to connect. We do not guarantee the accuracy, 
                completeness, or reliability of job listings posted by employers.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Users are responsible for verifying the legitimacy of job opportunities and exercising due diligence when 
                applying for positions or sharing personal information.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">5. Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information 
                when you use our service. By using our service, you agree to the collection and use of information in accordance 
                with our Privacy Policy.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">6. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                In no event shall Career-Bazaar or its suppliers be liable for any damages (including, without limitation, 
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use 
                the materials on Career-Bazaar's website, even if Career-Bazaar or a Career-Bazaar authorized representative has 
                been notified orally or in writing of the possibility of such damage.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">7. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms & Conditions, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 font-medium">Email: legal@career-bazaar.com</p>
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