import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, TrendingUp, Heart, CheckCircle, ArrowRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTranslation } from 'react-i18next';

const AboutUs = () => {
  const {t} = useTranslation();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 bg-[var(--bg-color)]">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="absolute top-0 left-0 w-full h-full bg-[var(--features-icon-color)] opacity-20 z-0"></div>
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
                className="text-4xl md:text-5xl font-bold mb-6 text-[var(--features-text-color)] font-serif"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {t("ASTit")}
              </motion.h1>
              <motion.p 
                className="text-xl text-[var(--text-color3)] mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {t("ASSubtit")}
              </motion.p>
            </div>
          </div>
        </section>

        {/* Our Story Section - Revised without image */}
        <section className="py-16 md:py-24 container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[var(--features-icon-color)] text-center font-mono tracking-tight">{t("ASd")}</h2>
            <div className="space-y-6 text-lg text-[var(--text-color3)]">
              <p>
                {t("ASd1")}
              </p>
              <p>
                {t("ASd2")}
              </p>
              <p>
                {t("ASd3")}
              </p>
              <div className="pt-6 flex justify-center">
                <motion.div 
                  className="h-1 w-24 bg-[var(--features-icon)] rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: 96 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: true }}
                ></motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Our Values Section */}
        <section className="py-16 md:py-24 bg-[var(--loginpage-bg)]">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
              <h2 className="text-3xl font-bold mb-4 text-[var(--features-text-color)] font-mono tracking-tight">{t("ASMtit")}</h2>
              <p className="text-lg text-[var(--text-color3)]">
              {t("ASMtitd")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Users,
                  title: t("ASM1"),
                  description: t("ASM1d")
                },
                {
                  icon: Award,
                  title: t("ASM2"),
                  description: t("ASM2d")
                },
                {
                  icon: TrendingUp,
                  title: t("ASM3"),
                  description: t("ASM3d")
                },
                {
                  icon: Heart,
                  title: t("ASM4"),
                  description: t("ASM4d")
                }
              ].map((value, index) => (
                <motion.div 
                  key={index}
                  className="bg-[var(--bg-color)] p-6 rounded-xl shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="rounded-full bg-[var(--loginpage-bg)] w-12 h-12 flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-[var(--features-icon-color)]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[var(--text-color3)]">{value.title}</h3>
                  <p className="text-[var(--text-color3)]">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section remains commented out */}

        {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-[var(--loginpage-bg2)]">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
              <h2 className="text-3xl font-bold mb-4 text-[var(--features-text-color)] font-sans underline decoration-[var(--features-icon-color)] decoration-4 underline-offset-8">{t("AS.user.tit")}</h2>
              <p className="text-lg text-[var(--text-color3)]">
              {t("AS.user.subtit")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: t("AS.user1"),
                  author: "Jennifer L.",
                  role: t("AS.user1d"),
                  company: "TechCorp Inc."
                },
                {
                  quote: t("AS.user2"),
                  author: "Marcus T.",
                  role: t("AS.user2d"),
                  company: "Design Studio Co."
                },
                {
                  quote: t("AS.user3"),
                  author: "Sophia K.",
                  role: t("AS.user3d"),
                  company: "Global Services Ltd."
                }
              ].map((testimonial, index) => (
                <motion.div 
                  key={index}
                  className="bg-[var(--bg-color)] p-6 rounded-xl shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="mb-4 text-[var(--features-icon-color)]">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.667 13.333H5.33366C5.33366 8 10.667 8 10.667 8C10.667 5.333 8.00033 2.667 5.33366 5.333C2.66699 8 2.66699 13.333 2.66699 13.333V18.667C2.66699 20.133 3.86699 21.333 5.33366 21.333H10.667C12.1337 21.333 13.3337 20.133 13.3337 18.667V16C13.3337 14.533 12.1337 13.333 10.667 13.333ZM26.667 13.333H21.3337C21.3337 8 26.667 8 26.667 8C26.667 5.333 24.0003 2.667 21.3337 5.333C18.667 8 18.667 13.333 18.667 13.333V18.667C18.667 20.133 19.867 21.333 21.3337 21.333H26.667C28.1337 21.333 29.3337 20.133 29.3337 18.667V16C29.3337 14.533 28.1337 13.333 26.667 13.333Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <p className="text-[var(--features-text-color)] mb-6 italic">{testimonial.quote}</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[var(--loginpage-bg)] rounded-full flex items-center justify-center mr-3">
                      <span className="text-[var(--features-icon-color)] font-bold">{testimonial.author.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[var(--features-text-color)]">{testimonial.author}</h4>
                      <p className="text-sm text-[var(--features-text-color)]">{testimonial.role}, {testimonial.company}</p>
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
              className="bg-[var(--homepage-card-color)] rounded-2xl p-8 md:p-12 text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6 font-sans text-[var(--features-icon-color)] drop-shadow-md">{t("ASFtit")}</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-[var(--features-icon-color)] mr-3 mt-1 flex-shrink-0" />
                  <p>{t("ASF1")}</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-[var(--features-icon-color)] mr-3 mt-1 flex-shrink-0" />
                  <p>{t("ASF2")}</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-[var(--features-icon-color)] mr-3 mt-1 flex-shrink-0" />
                  <p>{t("ASF3")}</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-[var(--features-icon-color)] mr-3 mt-1 flex-shrink-0" />
                  <p>{t("ASF4")}</p>
                </div>
              </div>
              <a 
                href="/signup" 
                className="inline-flex items-center bg-[var(--features-icon-color)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[var(--hover-color)] transition-colors"
              >
                {t("ASFButt")}
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