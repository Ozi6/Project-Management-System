// src/components/FeaturesSection.jsx
import React, { useState, useRef } from 'react';
import { 
  CheckSquare, Users, Layout, 
  Clock, Shield, Zap,
  BarChart2, Globe, MessageSquare,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
// Remove this line: import './FeaturesSection.css';

const FeaturesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featuresPerView = 3;

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

  const sponsors = [
    { id: 1, name: 'Spotify', logo: '/logos/spotify.svg' },
    { id: 2, name: 'Slack', logo: '/logos/slack.svg' },
    { id: 3, name: 'Microsoft', logo: '/logos/microsoft.svg' },
    { id: 4, name: 'Google', logo: '/logos/google.svg' },
    { id: 5, name: 'Adobe', logo: '/logos/adobe.svg' },
    { id: 6, name: 'Netflix', logo: '/logos/netflix.svg' },
    { id: 7, name: 'Amazon', logo: '/logos/amazon.svg' },
    { id: 8, name: 'Meta', logo: '/logos/meta.svg' }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + featuresPerView >= features.length ? 0 : prev + featuresPerView
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev - featuresPerView < 0 ? features.length - featuresPerView : prev - featuresPerView
    );
  };

  const ScrollingLogos = () => {
    return (
      <div className="relative overflow-hidden py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Trusted by Industry Leaders
          </h2>
          <ScrollVelocity baseVelocity={2}>
            <div className="flex gap-16 items-center">
              {[...sponsors, ...sponsors].map((sponsor, index) => (
                <div
                  key={`${sponsor.id}-${index}`}
                  className="flex-shrink-0 w-40 h-20 bg-white/10 rounded-xl p-4 
                  flex items-center justify-center group transition-all duration-300 
                  hover:bg-white/20"
                >
                  <img 
                    src={sponsor.logo} 
                    alt={`${sponsor.name} logo`}
                    className="w-full h-full object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300 
                    filter brightness-0 invert" // This makes the logos white
                  />
                </div>
              ))}
            </div>
          </ScrollVelocity>
        </div>
      </div>
    );
  };

  return (
    <>
      <section className="py-16 px-5 text-center bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-10">
            Why Choose PlanWise?
          </h2>
          
          <div className="relative overflow-hidden px-16">
            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 z-10 hover:scale-110"
            >
              <ChevronLeft className="h-8 w-8 text-gray-600" /> {/* Increased arrow size */}
            </button>
            
            <motion.div
              className="flex gap-8"
              animate={{
                x: `-${currentIndex * (100 / featuresPerView)}%`
              }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 20
              }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex-shrink-0 w-[calc(33.333%-1rem)] flex flex-col items-center text-center 
                    p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <feature.icon className="h-12 w-12 text-blue-600 mb-6" />
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 z-10 hover:scale-110"
            >
              <ChevronRight className="h-8 w-8 text-gray-600" />
            </button>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: Math.ceil(features.length / featuresPerView) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * featuresPerView)}
                className={`h-2 rounded-full transition-all duration-200 ${
                  Math.floor(currentIndex / featuresPerView) === index 
                    ? 'w-8 bg-blue-600' 
                    : 'w-2 bg-gray-400'
                }`}
              />
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