import React from "react";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";

const FAQPage = () => {
  const {t}=useTranslation();
  const [openIndex, setOpenIndex] = React.useState(null);

  const faqs = [
    {
      question: t("faq1"),
      answer: t("faq1a"),
    },
    {
      question: t("faq2"),
      answer: t("faq2a"),
    },
    {
      question: t("faq3"),
      answer: t("faq3a"),
    },
    {
      question: t("faq4"),
      answer: t("faq4a"),
    },
    {
      question: t("faq5"),
      answer: t("faq5a"),
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 bg-[var(--bg-color)]">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="absolute top-0 left-0 w-full h-full bg-[var(--features-icon-color)] opacity-10 z-0"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1
                className="text-4xl md:text-5xl font-bold mb-6 text-[var(--features-text-color)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {t("faq.title")}
              </motion.h1>
              <motion.p
                className="text-xl text-[var(--features-text-color)] mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {t("faq.subtitle")}
              </motion.p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24 container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="border-b border-gray-300 py-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <button
                  className="w-full flex justify-between items-center text-left text-lg font-semibold text-[var(--features-title-color)] focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                  {openIndex === index ? <Minus className="w-5 h-5 text-[var(--features-icon-color)]" /> : <Plus className="w-5 h-5 text-[var(--features-icon-color)]" />}
                </button>
                <motion.p
                  className={`text-[var(--text-color3)] mt-2 ${openIndex === index ? "block" : "hidden"}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={openIndex === index ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {faq.answer}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default FAQPage;