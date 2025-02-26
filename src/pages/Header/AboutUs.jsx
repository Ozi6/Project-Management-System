import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, TrendingUp, Heart, CheckCircle, ArrowRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const AboutUs = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="absolute top-0 left-0 w-full h-full bg-blue-50 opacity-50 z-0"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <svg className="absolute right-0 top-0 h-full opacity-20" viewBox="0 0 150 350" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0L150 0L100 350L0 0Z" fill="#4F46E5" />
            </svg>
            <svg className="absolute left-0 bottom-0 h-full opacity-20" viewBox="0 0 150 350" xmlns="http://www.w3.org/2000/svg">
              <path d="M150 350L0 350L50 0L150 350Z" fill="#4F46E5" />
            </svg>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                We're on a mission to make teamwork more efficient
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-700 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                PlanWise is built by a team passionate about helping organizations achieve more through better collaboration and task management.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 md:py-24 container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Story</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  PlanWise was born out of frustration with existing project management tools that were either too complex or too simplistic. In 2022, our founders set out to create a solution that strikes the perfect balance between comprehensive features and intuitive usability.
                </p>
                <p>
                  What started as a simple task board has evolved into a full-featured project management platform that helps thousands of teams organize their work effectively. Our approach focuses on visual workflows inspired by Trello but extended with the features teams actually need.
                </p>
                <p>
                  Today, PlanWise is used by organizations of all sizes to manage projects, track tasks, and collaborate seamlessly. We're continuously evolving based on user feedback to create the most effective project management experience possible.
                </p>
              </div>
            </motion.div>
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-200 rounded-lg transform translate-x-3 translate-y-3"></div>
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
                  alt="Team collaborating" 
                  className="relative rounded-lg shadow-lg w-full h-auto z-10"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Values</h2>
              <p className="text-lg text-gray-700">
                These core principles guide everything we do at PlanWise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Users,
                  title: "Collaboration First",
                  description: "We believe that great things happen when people work together effectively."
                },
                {
                  icon: Award,
                  title: "Excellence",
                  description: "We're committed to quality in our product and in our support for customers."
                },
                {
                  icon: TrendingUp,
                  title: "Continuous Improvement",
                  description: "We're always learning and evolving to better serve our users' needs."
                },
                {
                  icon: Heart,
                  title: "User-Centered",
                  description: "Every decision we make starts with understanding our users' challenges."
                }
              ].map((value, index) => (
                <motion.div 
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{value.title}</h3>
                  <p className="text-gray-700">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section - Temporarily Commented Out
        <section className="py-16 md:py-24 container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Meet Our Team</h2>
            <p className="text-lg text-gray-700">
              The passionate people behind PlanWise who are dedicated to making your work life better.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Johnson",
                role: "Co-Founder & CEO",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80",
                bio: "Alex combines technical expertise with a passion for user experience. Previously led product teams at major tech companies."
              },
              {
                name: "Sarah Chen",
                role: "Co-Founder & CTO",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=988&q=80",
                bio: "Sarah is a full-stack developer with over 10 years of experience building scalable web applications and elegant user interfaces."
              },
              {
                name: "Michael Rodriguez",
                role: "Head of Customer Success",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80",
                bio: "Michael ensures that every PlanWise customer gets the most value from our platform through education and support."
              },
              {
                name: "Lisa Park",
                role: "Lead Designer",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1061&q=80",
                bio: "Lisa crafts the intuitive and beautiful user experiences that make PlanWise a joy to use every day."
              },
              {
                name: "David Thompson",
                role: "Marketing Director",
                image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80",
                bio: "David leads our marketing efforts, sharing PlanWise's story with the world and helping teams discover better ways to work."
              },
              {
                name: "Aisha Williams",
                role: "Product Manager",
                image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=988&q=80",
                bio: "Aisha translates user feedback into product roadmaps, ensuring PlanWise evolves to meet our users' changing needs."
              }
            ].map((member, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-64 object-cover object-center"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1 text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 mb-3">{member.role}</p>
                  <p className="text-gray-700">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        */}

        {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-blue-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">What Our Users Say</h2>
              <p className="text-lg text-gray-700">
                Don't just take our word for it - hear what teams using PlanWise have to say.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "PlanWise transformed how our marketing team collaborates. We've increased productivity by 30% since switching from our previous tool.",
                  author: "Jennifer L.",
                  role: "Marketing Director",
                  company: "TechCorp Inc."
                },
                {
                  quote: "The visual workflow and task assignment features are exactly what we needed. Our project delivery time has improved dramatically.",
                  author: "Marcus T.",
                  role: "Project Manager",
                  company: "Design Studio Co."
                },
                {
                  quote: "As a remote team, we needed something to keep everyone aligned. PlanWise gave us the structure we needed without being restrictive.",
                  author: "Sophia K.",
                  role: "Operations Lead",
                  company: "Global Services Ltd."
                }
              ].map((testimonial, index) => (
                <motion.div 
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="mb-4 text-blue-600">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.667 13.333H5.33366C5.33366 8 10.667 8 10.667 8C10.667 5.333 8.00033 2.667 5.33366 5.333C2.66699 8 2.66699 13.333 2.66699 13.333V18.667C2.66699 20.133 3.86699 21.333 5.33366 21.333H10.667C12.1337 21.333 13.3337 20.133 13.3337 18.667V16C13.3337 14.533 12.1337 13.333 10.667 13.333ZM26.667 13.333H21.3337C21.3337 8 26.667 8 26.667 8C26.667 5.333 24.0003 2.667 21.3337 5.333C18.667 8 18.667 13.333 18.667 13.333V18.667C18.667 20.133 19.867 21.333 21.3337 21.333H26.667C28.1337 21.333 29.3337 20.133 29.3337 18.667V16C29.3337 14.533 28.1337 13.333 26.667 13.333Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <p className="text-gray-700 mb-6 italic">{testimonial.quote}</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-bold">{testimonial.author.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Commitment Section */}
        <section className="py-16 md:py-24 container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="bg-gray-900 rounded-2xl p-8 md:p-12 text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Commitment to You</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <p>We'll never stop improving PlanWise based on your feedback and needs.</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <p>Your data security and privacy are our top priorities.</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <p>We're committed to providing responsive support when you need help.</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <p>We design every feature with real workflow efficiency in mind.</p>
                </div>
              </div>
              <a 
                href="/login" 
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Join PlanWise Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;