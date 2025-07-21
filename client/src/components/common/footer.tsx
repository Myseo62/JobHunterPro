import { useLocation } from "wouter";

export default function Footer() {
  const [, setLocation] = useLocation();
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
                <button 
                  onClick={() => setLocation("/jobs")}
                  className="hover:text-white cursor-pointer"
                >
                  Search Jobs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setLocation("/companies")}
                  className="hover:text-white cursor-pointer"
                >
                  Browse Companies
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setLocation("/services")}
                  className="hover:text-white cursor-pointer"
                >
                  Services
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setLocation("/resources")}
                  className="hover:text-white cursor-pointer"
                >
                  Resources
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Employers</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <button 
                  onClick={() => setLocation("/employer/post-job")}
                  className="hover:text-white cursor-pointer"
                >
                  Post Jobs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setLocation("/employer/search-resume")}
                  className="hover:text-white cursor-pointer"
                >
                  Search Resume
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setLocation("/employer/login")}
                  className="hover:text-white cursor-pointer"
                >
                  Recruiter Login
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setLocation("/employer/pricing")}
                  className="hover:text-white cursor-pointer"
                >
                  Pricing
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <button 
                  onClick={() => setLocation("/about")}
                  className="hover:text-white cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setLocation("/contact")}
                  className="hover:text-white cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setLocation("/careers")}
                  className="hover:text-white cursor-pointer"
                >
                  Careers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setLocation("/blog")}
                  className="hover:text-white cursor-pointer"
                >
                  Blog
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; 2025 Career-Bazaar. All rights reserved. |{" "}
            <button 
              onClick={() => setLocation("/privacy")}
              className="hover:text-white cursor-pointer"
            >
              Privacy Policy
            </button>{" "}
            |{" "}
            <button 
              onClick={() => setLocation("/terms")}
              className="hover:text-white cursor-pointer"
            >
              Terms of Service
            </button>
          </p>
        </div>
      </div>
    </footer>
  );
}
