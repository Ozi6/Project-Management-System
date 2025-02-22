// src/components/FeaturesSection.jsx
import React from 'react';
import { 
  CheckSquare, Users, Layout, 
  Clock, Shield, Zap,
  BarChart2, Globe, MessageSquare,
  Calendar, FileText, Settings
} from 'lucide-react';
import './FeaturesSection.css';

const FeaturesSection = () => {
  const features = [
    {
      icon: CheckSquare,
      title: "Task Management",
      description: "Easily create, assign, and track tasks in real-time."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work seamlessly with your team members across projects."
    },
    {
      icon: Layout,
      title: "Customizable Boards",
      description: "Tailor your boards and workflows to fit your needs."
    },
    {
      icon: Clock,
      title: "Time Tracking",
      description: "Monitor project hours and team productivity efficiently."
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Enterprise-grade security for your project data."
    },
    {
      icon: Zap,
      title: "Automation",
      description: "Automate repetitive tasks and workflows."
    },
    {
      icon: BarChart2,
      title: "Analytics",
      description: "Get insights with detailed project analytics and reports."
    },
    {
      icon: Globe,
      title: "Remote Ready",
      description: "Perfect for distributed teams and remote work."
    },
    {
      icon: MessageSquare,
      title: "Built-in Chat",
      description: "Communicate with your team without switching apps."
    }
  ];

  return (
    <>
      <section className="features py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Why Choose PlanWise?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="feature bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <feature.icon className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-800">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="bg-gray-900 p-6 rounded-xl">
                <p className="text-white mb-4">"PlanWise has transformed how our team collaborates. It's intuitive and powerful!"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-semibold text-white">John Doe</h4>
                    <p className="text-sm text-gray-300">Project Manager at Tech Co</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Simple, Transparent Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Basic', 'Pro', 'Enterprise'].map((plan, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{plan}</h3>
                <p className="text-4xl font-bold mb-6 text-blue-600">{
                  plan === 'Basic' ? 'Free' : 
                  plan === 'Pro' ? '$9.99/mo' : 
                  'Custom'
                }</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-800">
                    <CheckSquare className="h-5 w-5 text-green-500 mr-2" />
                    <span>Feature 1</span>
                  </li>
                  <li className="flex items-center text-gray-800">
                    <CheckSquare className="h-5 w-5 text-green-500 mr-2" />
                    <span>Feature 2</span>
                  </li>
                  <li className="flex items-center text-gray-800">
                    <CheckSquare className="h-5 w-5 text-green-500 mr-2" />
                    <span>Feature 3</span>
                  </li>
                </ul>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-white mb-8">Join thousands of teams already using PlanWise to improve their productivity.</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-300">
            Start Free Trial
          </button>
        </div>
      </section>
    </>
  );
};

export default FeaturesSection;