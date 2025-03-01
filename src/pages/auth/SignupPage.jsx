import React from 'react';
import { SignUp } from "@clerk/clerk-react";
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function SignupPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Back to home</span>
        </Link>
      </div>
      
      <div className="flex flex-col items-center justify-center flex-grow px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#2D5CF2]">Get Started with PlanWise</h1>
            <p className="mt-2 text-[#1E0342]">Create your account and start managing projects today</p>
          </div>
          
          <div className="w-full bg-[#C4D1FB] p-6 rounded-lg shadow-md">
            <SignUp 
              signInUrl="/login"
              redirectUrl="/profile"
              appearance={{
                elements: {
                  formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
                  footerActionLink: "text-blue-600 hover:text-blue-700",
                }
              }}
            />
          </div>
        </div>
      </div>
      
      <footer className="py-4 px-6 text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} PlanWise. All rights reserved.</p>
      </footer>
    </div>
  );
}