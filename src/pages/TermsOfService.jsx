import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TermsOfService = () => {
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: March 1, 2025</p>
        
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
            <p>
              These Terms of Service ("Terms") govern your access to and use of the PlanWise platform and 
              services, including our website, mobile applications, and any other software or services 
              offered by PlanWise ("Services"). By accessing or using our Services, you agree to be bound 
              by these Terms. If you do not agree to these Terms, you may not access or use the Services.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
            <p>
              To access certain features of the Services, you may need to create an account. You are 
              responsible for maintaining the confidentiality of your account credentials and for all 
              activities that occur under your account. You agree to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Provide accurate and complete information when creating your account</li>
              <li>Update your account information to keep it current</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Take responsibility for all activities that occur under your account</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Acceptable Use</h2>
            <p>
              You agree not to use the Services to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>
                Upload, post, or transmit content that infringes or violates the intellectual property rights
                or any other rights of others
              </li>
              <li>
                Upload, post, or transmit any content that is illegal, harmful, threatening, abusive, 
                harassing, defamatory, or otherwise objectionable
              </li>
              <li>
                Attempt to gain unauthorized access to any portion of the Services or any other systems or 
                networks connected to the Services
              </li>
              <li>
                Interfere with or disrupt the Services or servers or networks connected to the Services
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
            <p>
              The Services and all content, features, and functionality thereof, including but not limited to 
              all information, software, text, displays, images, video, and audio, and the design, selection, 
              and arrangement thereof, are owned by PlanWise or its licensors and are protected by copyright, 
              trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
            <p>
              In no event shall PlanWise, its directors, employees, partners, agents, suppliers, or affiliates, 
              be liable for any indirect, incidental, special, consequential, or punitive damages, including 
              without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Your access to or use of or inability to access or use the Services</li>
              <li>
                Any conduct or content of any third party on the Services
              </li>
              <li>
                Any content obtained from the Services
              </li>
              <li>
                Unauthorized access, use, or alteration of your transmissions or content
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. If we make changes, we will provide 
              notice of such changes, such as by sending an email notification, providing notice through the 
              Services, or updating the "Last Updated" date at the top of these Terms. Your continued use of 
              the Services following the posting of revised Terms means that you accept and agree to the changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
              <br />
              <a href="mailto:legal@planwise.com" className="text-blue-500 hover:underline">
                legal@planwise.com
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
      <Footer />
    </>
  );
};

export default TermsOfService;