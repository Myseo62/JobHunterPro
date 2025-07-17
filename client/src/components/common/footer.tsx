import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold text-blue-500 mb-4">Career-Bazaar</div>
            <p className="text-gray-300 text-sm mb-4">
              India's largest job portal helping millions find their dream careers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Job Seekers</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/jobs">
                  <span className="hover:text-white cursor-pointer">Search Jobs</span>
                </Link>
              </li>
              <li>
                <Link href="/companies">
                  <span className="hover:text-white cursor-pointer">Browse Companies</span>
                </Link>
              </li>
              <li>
                <Link href="/resume">
                  <span className="hover:text-white cursor-pointer">Create Resume</span>
                </Link>
              </li>
              <li>
                <Link href="/job-alerts">
                  <span className="hover:text-white cursor-pointer">Job Alerts</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Employers</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/employer/post-job">
                  <span className="hover:text-white cursor-pointer">Post Jobs</span>
                </Link>
              </li>
              <li>
                <Link href="/employer/search-resume">
                  <span className="hover:text-white cursor-pointer">Search Resume</span>
                </Link>
              </li>
              <li>
                <Link href="/employer/login">
                  <span className="hover:text-white cursor-pointer">Recruiter Login</span>
                </Link>
              </li>
              <li>
                <Link href="/employer/pricing">
                  <span className="hover:text-white cursor-pointer">Pricing</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/career-advice">
                  <span className="hover:text-white cursor-pointer">Career Advice</span>
                </Link>
              </li>
              <li>
                <Link href="/interview-tips">
                  <span className="hover:text-white cursor-pointer">Interview Tips</span>
                </Link>
              </li>
              <li>
                <Link href="/salary-calculator">
                  <span className="hover:text-white cursor-pointer">Salary Calculator</span>
                </Link>
              </li>
              <li>
                <Link href="/resume-builder">
                  <span className="hover:text-white cursor-pointer">Resume Builder</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; 2025 Career-Bazaar. All rights reserved. |{" "}
            <Link href="/privacy">
              <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            </Link>{" "}
            |{" "}
            <Link href="/terms">
              <span className="hover:text-white cursor-pointer">Terms of Service</span>
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
