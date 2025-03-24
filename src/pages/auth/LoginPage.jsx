import React from 'react';
import { SignIn } from "@clerk/clerk-react";
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--loginpage-bg2)]">
      <div className="flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center text-[var(--features-icon-color)] hover:text-[var(--features-icon-color)] transition-colors duration-200">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Back to home</span>
        </Link>
      </div>
      
      <div className="flex flex-col items-center justify-center flex-grow px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[var(--features-icon-color)]">Welcome Back</h1>
            <p className="mt-2 text-[var(--features-text-color)]">Log in to your PlanWise account</p>
          </div>
          
          <div className="w-full bg-[var(--loginpage-bg)] p-6 rounded-lg shadow-md">
            <SignIn 
              signUpUrl="/signup"
              redirectUrl="/dashboard"
              appearance={{
                elements: {
                  formButtonPrimary: "bg-[var(--features-icon-color)] hover:bg-[var(--hover-color)] text-white",
                  footerActionLink: "text-[var(--features-icon-color)] hover:text-[var(--hover-color)]",
                }
              }}
            />
            
            <div className="mt-6 text-center text-sm text-[var(--text-color3)]">
              <p>Forgot your password? <Link to="/forgot-password" className="text-[var(--features-icon-color)] hover:underline">Reset your password</Link></p>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="py-4 px-6 text-center text-sm text-[var(--text-color3)]">
        <p>© {new Date().getFullYear()} PlanWise. All rights reserved.</p>
      </footer>
    </div>
  );
}