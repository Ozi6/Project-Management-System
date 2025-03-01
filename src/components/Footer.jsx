// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Instagram } from 'lucide-react';

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
              <a href="https://github.com" className="hover:text-blue-500 transition-colors">
                <Github size={20} />
              </a>
              <a href="https://twitter.com" className="hover:text-blue-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" className="hover:text-blue-500 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://instagram.com" className="hover:text-blue-500 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/features" className="hover:text-blue-500 transition-colors">Features</Link></li>
              <li><Link to="/security" className="hover:text-blue-500 transition-colors">Security</Link></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/docs" className="hover:text-blue-500 transition-colors">Documentation</Link></li>
              <li><Link to="/support" className="hover:text-blue-500 transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-blue-500 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-blue-500 transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-blue-500 transition-colors">FAQ</Link></li>
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