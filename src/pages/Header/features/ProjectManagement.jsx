import React from 'react';
import { ClipboardList, Users, Calendar, ArrowRight, Layers, Workflow, GitMerge } from 'lucide-react';
import FeaturePageTemplate from "../../../components/FeaturePageTemplate";
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const ProjectManagement = () => {
  const {t} = useTranslation();
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
      title: t("proM1"),
      description: t("proM1d")
    },
    {
      icon: Users,
      title: t("proM2"),
      description: t("proM2d")
    },
    {
      icon: Calendar,
      title: t("proM3"),
      description: t("proM3d")
    },
    {
      icon: Layers,
      title: t("proM4"),
      description: t("proM4d")
    },
    {
      icon: Workflow,
      title: t("proM5"),
      description: t("proM5d")
    },
    {
      icon: GitMerge,
      title: t("proM6"),
      description: t("proM6d")
    }
  ];

  return (
    <FeaturePageTemplate
      title={t("features1")}
      description={t("proMd")}
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[var(--loginpage-bg)] to-[var(--loginpage-bg2)] rounded-3xl p-8 mb-16">

        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-[var(--features-title-color)] mb-4 font-serif italic">{t("proMH")}</h2>
            <p className="text-lg text-[var(--features-text-color)] mb-6">
            {t("proMHd")}
            </p>
            <a 
              href="/signup" 
              className="inline-flex items-center bg-[var(--features-icon-color)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--hover-color)] transition-colors"
            >
              {t("proMHButt")}
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
        <h2 className="text-3xl font-bold text-center mb-12 font-mono text-[var(--features-icon-color)] tracking-tight">{t("proMF")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-[var(--loginpage-bg)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-[var(--features-icon-color)]">1</span>
            </div>
            <h3 className="text-xl font-semibold text-[var(--features-text-color)] mb-2">{t("proMF1")}</h3>
            <p className="text-[var(--features-title-color)]">
            {t("proMF1d")}
            </p>
          </div>
          <div className="text-center">
            <div className="bg-[var(--loginpage-bg)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-[var(--features-icon-color)]">2</span>
            </div>
            <h3 className="text-xl font-semibold text-[var(--features-text-color)] mb-2">{t("proMF2")}</h3>
            <p className="text-[var(--features-title-color)]">
            {t("proMF2d")}
            </p>
          </div>
          <div className="text-center">
            <div className="bg-[var(--loginpage-bg)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-[var(--features-icon-color)]">3</span>
            </div>
            <h3 className="text-xl font-semibold text-[var(--features-text-color)] mb-2">{t("proMF3")}</h3>
            <p className="text-[var(--features-title-color)]">
            {t("proMF3d")}
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6 font-sans uppercase text-[var(--features-icon-color)]/70 tracking-wider">{t("proMF4")}</h2>
        <a 
          href="/signup" 
          className="inline-block bg-[var(--features-icon-color)] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[var(--hover-color)] transition-colors text-lg"
        >
          {t("proMF4Butt")}
        </a>
      </div>
    </FeaturePageTemplate>
  );
};

export default ProjectManagement;