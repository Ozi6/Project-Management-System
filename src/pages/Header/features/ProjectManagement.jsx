import React from 'react';
import { ClipboardList, Users, Calendar, ArrowRight, Layers, Workflow, GitMerge } from 'lucide-react';
import FeaturePageTemplate from "../../../components/FeaturePageTemplate";
import { motion } from 'framer-motion';

const ProjectManagement = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const features = [
    {
      icon: ClipboardList,
      title: "Project Planning",
      description: "Create comprehensive project plans with milestones, dependencies, and critical paths."
    },
    {
      icon: Users,
      title: "Resource Allocation",
      description: "Easily assign team members to projects based on availability and skills."
    },
    {
      icon: Calendar,
      title: "Timeline Management",
      description: "Visualize project timelines with interactive Gantt charts and calendar views."
    },
    {
      icon: Layers,
      title: "Project Templates",
      description: "Save time by creating reusable templates for common project types."
    },
    {
      icon: Workflow,
      title: "Workflow Automation",
      description: "Automate routine tasks and notifications to keep projects moving forward."
    },
    {
      icon: GitMerge,
      title: "Version Control",
      description: "Track changes to project plans with comprehensive version history."
    }
  ];

  return (
    <FeaturePageTemplate
      title="Project Management"
      description="Plan, execute, and track your projects with powerful yet intuitive tools."
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[var(--loginpage-bg)] to-[var(--loginpage-bg2)] rounded-3xl p-8 mb-16">

        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-[var(--features-title-color)] mb-4 font-serif italic">Complete Control Over Your Projects</h2>
            <p className="text-lg text-[var(--features-text-color)] mb-6">
              PlanWise gives you everything you need to manage projects effectively, from initial planning to final delivery.
              Our comprehensive suite of project management tools helps you stay on schedule and within budget.
            </p>
            <a 
              href="/signup" 
              className="inline-flex items-center bg-[var(--features-icon-color)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--hover-color)] transition-colors"
            >
              Start managing projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
          <div className="lg:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" 
              alt="Project Management Dashboard" 
              className="rounded-xl shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {features.map((feature, index) => (
          <motion.div 
            key={index}
            className="bg-[var(--bg-color)] p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            variants={itemVariants}
          >
            <feature.icon className="h-10 w-10 text-[var(--features-icon-color)] mb-4" />
            <h3 className="text-xl font-semibold text-[var(--features-icon-color)] mb-2">{feature.title}</h3>
            <p className="text-[var(--features-title-color)]">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* How It Works Section */}
      <div className="bg-[var(--bg-color)] rounded-2xl shadow-md p-8 mb-16">
        <h2 className="text-3xl font-bold text-center mb-12 font-mono text-[var(--features-icon-color)] tracking-tight">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-[var(--loginpage-bg)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-[var(--features-icon-color)]">1</span>
            </div>
            <h3 className="text-xl font-semibold text-[var(--features-text-color)] mb-2">Set Up Your Project</h3>
            <p className="text-[var(--features-title-color)]">
              Define project goals, timelines, and team members with our easy-to-use project creation wizard.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-[var(--loginpage-bg)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-[var(--features-icon-color)]">2</span>
            </div>
            <h3 className="text-xl font-semibold text-[var(--features-text-color)] mb-2">Assign & Monitor Tasks</h3>
            <p className="text-[var(--features-title-color)]">
              Break down projects into tasks, assign them to team members, and track progress in real-time.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-[var(--loginpage-bg)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-[var(--features-icon-color)]">3</span>
            </div>
            <h3 className="text-xl font-semibold text-[var(--features-text-color)] mb-2">Deliver Successfully</h3>
            <p className="text-[var(--features-title-color)]">
              Use built-in analytics and reporting tools to ensure projects complete on time and within scope.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6 font-sans uppercase text-[var(--features-icon-color)]/70 tracking-wider">Ready to transform your project management?</h2>
        <a 
          href="/signup" 
          className="inline-block bg-[var(--features-icon-color)] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[var(--hover-color)] transition-colors text-lg"
        >
          Get Started Free
        </a>
      </div>
    </FeaturePageTemplate>
  );
};

export default ProjectManagement;