// src/components/FeaturesSection.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckSquare, Users, Layout, 
  Clock, Shield, Zap,
  BarChart2, Globe, MessageSquare,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';

const FeaturesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuresPerView, setFeaturesPerView] = useState(3);
  const [isMobile, setIsMobile] = useState(false);

  // Check window size and adjust features per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setFeaturesPerView(1);
        setIsMobile(true);
      } else if (window.innerWidth < 1024) {
        setFeaturesPerView(2);
        setIsMobile(false);
      } else {
        setFeaturesPerView(3);
        setIsMobile(false);
      }
    };

    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      icon: Globe,
      title: "Remote Ready",
      description: "Perfect for distributed teams and remote work."
    }
  ];

  
  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const maxStart = features.length - featuresPerView;
      return prev >= maxStart ? 0 : prev + featuresPerView;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const maxStart = features.length - featuresPerView;
      return prev <= 0 ? maxStart : prev - featuresPerView;
    });
  };

  return (
    <>
      <section className="py-8 md:py-16 px-4 md:px-5 text-center bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-10 ffont-mono tracking-tight">
            Why Choose PlanWise?
          </h2>
          
          <div className="relative overflow-hidden px-4 md:px-16">
            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-0 md:left-2 top-1/2 -translate-y-1/2 bg-white p-2 md:p-3 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 z-10 hover:scale-110"
            >
              <ChevronLeft className="h-6 w-6 md:h-8 md:w-8 text-gray-600" />
            </button>
            
            <motion.div
              className="flex gap-4 md:gap-8"
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
                  className={`flex-shrink-0 ${
                    isMobile 
                      ? 'w-full' 
                      : featuresPerView === 2 
                        ? 'w-[calc(50%-0.5rem)]' 
                        : 'w-[calc(33.333%-1rem)]'
                  } flex flex-col items-center text-center 
                    p-6 md:p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <feature.icon className="h-10 w-10 md:h-12 md:w-12 text-blue-600 mb-4 md:mb-6" />
                  <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 text-gray-900 font-sans">
                    {feature.title}
                  </h3>
                  <p className="text-base md:text-lg text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <button
              onClick={nextSlide}
              className="absolute right-0 md:right-2 top-1/2 -translate-y-1/2 bg-white p-2 md:p-3 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 z-10 hover:scale-110"
            >
              <ChevronRight className="h-6 w-6 md:h-8 md:w-8 text-gray-600" />
            </button>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-6 md:mt-8">
            {Array.from({ length: Math.ceil(features.length / featuresPerView) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * featuresPerView)}
                className={`h-2 rounded-full transition-all duration-200 ${
                  Math.floor(currentIndex / featuresPerView) === index 
                    ? 'w-6 md:w-8 bg-blue-600' 
                    : 'w-2 bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-10 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-900 font-mono tracking-tight">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="bg-gray-900 p-5 md:p-6 rounded-xl">
                <p className="text-sm md:text-base text-white mb-4">
                  "PlanWise has transformed how our team collaborates. It's intuitive and powerful!"
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-semibold text-white text-sm md:text-base">John Doe</h4>
                    <p className="text-xs md:text-sm text-gray-300">Project Manager at Tech Co</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Replacing Pricing Section with Features Comparison */}
      <section className="py-10 md:py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-white font-sans uppercase tracking-wider">
            Everything You Need to Succeed
          </h2>
          
          {/* Improved alignment for 7 components - 4-3 layout on large screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {[
                { 
                  icon: CheckSquare, 
                  title: "Task Management", 
                  description: "Create, assign, and track tasks with customizable workflows" 
                },
                { 
                  icon: Users, 
                  title: "Team Collaboration", 
                  description: "Chat, comment, and share files in real-time" 
                },
                { 
                  icon: Clock, 
                  title: "Time Tracking", 
                  description: "Monitor hours spent on tasks and projects" 
                },
                { 
                  icon: BarChart2, 
                  title: "Detailed Analytics", 
                  description: "Visualize progress with customizable dashboards" 
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800 p-5 md:p-6 rounded-xl hover:bg-gray-700 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-blue-600/20 p-3 rounded-lg inline-block mb-4">
                    <feature.icon className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-sm md:text-base text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:mx-auto lg:max-w-[75%]">
              {[
                { 
                  icon: Globe, 
                  title: "Anywhere Access", 
                  description: "Work from any device, anywhere in the world" 
                },
                { 
                  icon: Shield, 
                  title: "Advanced Security", 
                  description: "Enterprise-level protection for your data" 
                },
                { 
                  icon: Layout, 
                  title: "Custom Workflows", 
                  description: "Design processes that match your team's needs" 
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800 p-5 md:p-6 rounded-xl hover:bg-gray-700 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index + 4) * 0.05 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-blue-600/20 p-3 rounded-lg inline-block mb-4">
                    <feature.icon className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-sm md:text-base text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          
        </div>
      </section>

      {/* Updated Call to Action with Login Link */}
      <section className="py-10 md:py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6 font-serif">
            Get Started with PlanWise Today!
          </h2>
          <p className="text-white mb-6 md:mb-8 text-sm md:text-base">
            Join thousands of teams using PlanWise to boost productivity, enhance collaboration, and achieve more together.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="/login" 
              className="bg-white text-blue-600 px-6 py-2 md:px-8 md:py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-300 text-sm md:text-base w-full sm:w-auto inline-block"
            >
              Get Started
            </a>
            <button className="bg-transparent text-white border border-white px-6 py-2 md:px-8 md:py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors duration-300 text-sm md:text-base w-full sm:w-auto">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturesSection;