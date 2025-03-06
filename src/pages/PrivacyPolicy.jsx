import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />
      <main className="flex-1 bg-gray-50 pt-16">
        <div className="bg-blue-600 text-white py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl">How we protect and manage your data</p>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 py-12 bg-white shadow-md rounded-md mt-8 mb-12">
          <p className="text-sm text-gray-500 mb-8">Last updated: March 1, 2025</p>
          
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p>
                Welcome to PlanWise's Privacy Policy. At PlanWise, we respect your privacy and are committed 
                to protecting your personal data. This Privacy Policy will inform you about how we look after 
                your personal data when you visit our website and use our services, regardless of where you 
                visit it from, and tell you about your privacy rights and how the law protects you.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              <p>
                We collect several different types of information for various purposes to provide and improve 
                our service to you:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>
                  <strong>Personal Information:</strong> When you register for an account, we collect your name, 
                  email address, and other contact details.
                </li>
                <li>
                  <strong>Usage Information:</strong> We collect information about how you use our services, 
                  including your activity on our platform, features you use, and time spent on the platform.
                </li>
                <li>
                  <strong>Device Information:</strong> We collect information about the device you use to 
                  access our services, including hardware model, operating system, and browser type.
                </li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <p>We use the information we collect in various ways, including to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Provide, operate, and maintain our services</li>
                <li>Improve, personalize, and expand our services</li>
                <li>Understand and analyze how you use our services</li>
                <li>Develop new products, services, features, and functionality</li>
                <li>Communicate with you about updates, security alerts, and support</li>
                <li>Find and prevent fraud</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p>
                We have implemented appropriate security measures to prevent your personal data from being 
                accidentally lost, used, accessed, altered, or disclosed in an unauthorized way. We limit access 
                to your personal data to those employees, agents, contractors, and other third parties who have 
                a business need to know.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
                <br />
                <a href="mailto:planwise.team@outlook.com" className="text-blue-500 hover:underline">
                  planwise.team@outlook.com
                </a>
              </p>
            </section>
          </div>
          
          <div className="mt-12 border-t border-gray-200 pt-6">
            <Link to="/" className="text-blue-500 hover:underline">
              &larr; Return to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;