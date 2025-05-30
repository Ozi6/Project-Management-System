// src/components/FeaturesSection.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckSquare, Users, Layout, 
  Clock, Shield, Zap,
  BarChart2, Globe, MessageSquare,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { useTranslation } from "react-i18next";

const FeaturesSection = () => {
  const {t } = useTranslation();
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
      title: t("mid1"),
      description: t("mid1d")
    },
    {
      icon: Users,
      title: t("mid2"),
      description: t("mid2d")
    },
    {
      icon: Layout,
      title: t("mid3"),
      description: t("mid3d")
    },
    {
      icon: Clock,
      title: t("mid4"),
      description: t("mid4d")
    },
    {
      icon: Shield,
      title: t("mid5"),
      description: t("mid5d")
    },
    {
      icon: Globe,
      title: t("mid6"),
      description: t("mid6d"),
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
      <section className="py-8 md:py-16 px-4 md:px-5 text-center"
        style={{backgroundColor: "var(--features-bg)"}}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-10 ffont-mono tracking-tight"
              style={{color: "var(--features-title-color)"}}
          >
            {t("why-planwise")}
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
                    p-6 md:p-8 bg-[var(--bg-color)] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <feature.icon className="h-10 w-10 md:h-12 md:w-12 mb-4 md:mb-6"
                    style={{color: "var(--features-icon-color)"}}
                  />
                  <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 text-gray-900 font-sans"
                  style={{color: "var(--features-title-color)"}}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-base md:text-lg"
                    style={{color: "var(--features-text-color)"}}
                  >
                    
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
                    ? 'w-6 md:w-8 bg-[var(--features-icon-color)]' 
                    : 'w-2 bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-10 md:py-16"
        style={{backgroundColor: "var(--features-bg)"}}
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 font-mono tracking-tight"
          style={{color: "var(--features-title-color)"}}
          >
            {t("what-user")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { 
                name: "Emir Özen", 
                role: t("user1"),
                comment: t("user1d"),
                avatar: "https://i.pravatar.cc/100?img=68"
              },
              { 
                name: "Ozan Nurcan", 
                role: t("user2"), 
                comment: t("user2d"),
                avatar: "https://i.pravatar.cc/100?img=53"
              },
              { 
                name: "Elif Batcı", 
                role: t("user3"),
                comment: t("user3d"),
                avatar: "https://i.pravatar.cc/100?img=45"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-900 p-5 md:p-6 rounded-xl"
              style={{backgroundColor: "var(--homepage-card-color)"}}
              >
                <p className="text-sm md:text-base text-white mb-4">
                  "{testimonial.comment}"
                </p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full mr-3 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-white text-sm md:text-base">{testimonial.name}</h4>
                    <p className="text-xs md:text-sm text-gray-300">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Replacing Pricing Section with Features Comparison */}
      <section className="py-10 md:py-16"
        style={{backgroundColor: "var(--bg-color2)"}}
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 font-sans uppercase tracking-wider"
            style={{color: "var(--features-title-color)"}}
          >
            {t("bottTit")}
          </h2>
          
          {/* Improved alignment for 7 components - 4-3 layout on large screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {[
                { 
                  icon: CheckSquare, 
                  title: t("features1"), 
                  description: t("bott1d"), 
                },
                { 
                  icon: Users, 
                  title: t("bott2"), 
                  description: t("bott2d"), 
                },
                { 
                  icon: Clock, 
                  title: t("bott3"), 
                  description: t("bott3d"), 
                },
                { 
                  icon: BarChart2, 
                  title: t("bott4"), 
                  description: t("bott4d"), 
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="p-5 md:p-6 rounded-xl hover:bg-gray-700 transition-all duration-300"
                  style={{backgroundColor: "var(--alt-card-color)"}}
                  whileHover={{backgroundColor: "var(--features-hover-bg)"}}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <div className="p-3 rounded-lg inline-block mb-4"
                    style={{backgroundColor: "var(--features-icon-bg-color)"}}
                  >
                    <feature.icon className="h-6 w-6" 
                      style={{color: "var(--features-icon-color)"}}
                    />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-2"
                    style={{color: "var(--text-color2)"}}
                  >{feature.title}</h3>
                  <p className="text-sm md:text-base text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:mx-auto lg:max-w-[75%]">
              {[
                { 
                  icon: Globe, 
                  title: t("bott5"), 
                  description: t("bott5d"), 
                },
                { 
                  icon: Shield, 
                  title: t("bott6"), 
                  description: t("bott6d"), 
                },
                { 
                  icon: Layout, 
                  title: t("bott7"), 
                  description: t("bott7d"), 
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="p-5 md:p-6 rounded-xl transition-all duration-300"
                  style={{backgroundColor: "var(--alt-card-color)"}}
                  whileHover={{backgroundColor: "var(--features-hover-bg)"}}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index + 4) * 0.05 }}
                  viewport={{ once: true }}
                >
                  <div className="p-3 rounded-lg inline-block mb-4"
                    style={{backgroundColor: "var(--features-icon-bg-color)"}}
                  >
                    <feature.icon className="h-6 w-6" 
                      style={{color: "var(--features-icon-color)"}}
                    />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-2"
                    style={{color: "var(--text-color2)"}}
                  >{feature.title}</h3>
                  <p className="text-sm md:text-base text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          
        </div>
      </section>

      {/* Updated Call to Action with Login Link */}
      <section className="py-10 md:py-16 bg-blue-600"
        style={{backgroundColor: "var(--features-icon-color)"}}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6 font-serif"
            style={{color: "white"}}
          >
            {t("startToday")}
          </h2>
          <p className="mb-6 md:mb-8 text-sm md:text-base"
            style={{color: "white"}}
          >
            {t("startTodayd")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="/login" 
              className="bg-white text-blue-600 px-6 py-2 md:px-8 md:py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-300 text-sm md:text-base w-full sm:w-auto inline-block"
              style={{
                color: "var(--features-icon-color)",
                backgroundColor: "var(--bg-color)",
              }}
            >
              {t("startTodayButt")}
            </a>
            
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturesSection;
