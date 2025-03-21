import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Instagram, CheckSquare, Users, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">PlanWise</h3>
            <p className="text-sm">
              Streamline your project management with our intuitive and powerful solution.
            </p>
            <div className="flex space-x-4">
              
            <a href="https://x.com/teamplanwise" className="hover:text-blue-500 transition-colors">
                <Twitter size={20} />
              </a>
                <a href="https://www.instagram.com/planwise.team/" className="hover:text-blue-500 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Features Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Features</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/features/project-management" className="hover:text-blue-500 transition-colors flex items-center gap-2">
                  <CheckSquare size={16} />
                  <span>Project Management</span>
                </Link>
              </li>
              <li>
                <Link to="/features/team-collaboration" className="hover:text-blue-500 transition-colors flex items-center gap-2">
                  <Users size={16} />
                  <span>Team Collaboration</span>
                </Link>
              </li>
              <li>
                <Link to="/features/task-tracking" className="hover:text-blue-500 transition-colors flex items-center gap-2">
                  <Clock size={16} />
                  <span>Task Tracking</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-blue-500 transition-colors">About Us</Link></li>
              <li><Link to="/faq" className="hover:text-blue-500 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/login" className="hover:text-blue-500 transition-colors">Login</Link></li>
              <li><Link to="/signup" className="hover:text-blue-500 transition-colors">Sign Up</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} PlanWise. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm hover:text-blue-500 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm hover:text-blue-500 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;