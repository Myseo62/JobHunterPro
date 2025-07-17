import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold text-blue-500 mb-4">Naukri.com</div>
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
                  <a className="hover:text-white">Search Jobs</a>
                </Link>
              </li>
              <li>
                <Link href="/companies">
                  <a className="hover:text-white">Browse Companies</a>
                </Link>
              </li>
              <li>
                <Link href="/resume">
                  <a className="hover:text-white">Create Resume</a>
                </Link>
              </li>
              <li>
                <Link href="/job-alerts">
                  <a className="hover:text-white">Job Alerts</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Employers</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/employer/post-job">
                  <a className="hover:text-white">Post Jobs</a>
                </Link>
              </li>
              <li>
                <Link href="/employer/search-resume">
                  <a className="hover:text-white">Search Resume</a>
                </Link>
              </li>
              <li>
                <Link href="/employer/login">
                  <a className="hover:text-white">Recruiter Login</a>
                </Link>
              </li>
              <li>
                <Link href="/employer/pricing">
                  <a className="hover:text-white">Pricing</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/career-advice">
                  <a className="hover:text-white">Career Advice</a>
                </Link>
              </li>
              <li>
                <Link href="/interview-tips">
                  <a className="hover:text-white">Interview Tips</a>
                </Link>
              </li>
              <li>
                <Link href="/salary-calculator">
                  <a className="hover:text-white">Salary Calculator</a>
                </Link>
              </li>
              <li>
                <Link href="/resume-builder">
                  <a className="hover:text-white">Resume Builder</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; 2025 Naukri.com. All rights reserved. |{" "}
            <Link href="/privacy">
              <a className="hover:text-white">Privacy Policy</a>
            </Link>{" "}
            |{" "}
            <Link href="/terms">
              <a className="hover:text-white">Terms of Service</a>
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
