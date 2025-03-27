import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const faqs = [
  { question: "What is PlanWise?", answer: "PlanWise is a project management tool designed to help teams collaborate, organize tasks, and improve productivity." },
  { question: "How can I get started?", answer: "Sign up for a free account and start organizing your projects in minutes. No credit card required!" },
  { question: "Is there a free plan available?", answer: "Yes, we offer a free plan with basic features. You can upgrade anytime for additional functionality." },
  { question: "Can I cancel my subscription?", answer: "Absolutely! You can cancel your subscription anytime from your account settings." },
  { question: "Is my data secure?", answer: "Yes, we use industry-standard encryption and security measures to protect your data." },
];

const API_KEY = "AIzaSyCe34mcf29RVJKnzf92ut9G6p93xy6MVxc"; // Replace with your actual API key

const FAQPage = () => {
  const { t, i18n } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);
  const [translatedFAQs, setTranslatedFAQs] = useState(faqs);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const translateFAQs = async () => {
      if (i18n.language === "en") {
        setTranslatedFAQs(faqs);
        return;
      }

      const textsToTranslate = faqs.flatMap((faq) => [faq.question, faq.answer]);
      const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ q: textsToTranslate, target: i18n.language }),
        });

        const data = await response.json();
        if (data?.data?.translations) {
          const translatedTexts = data.data.translations.map((t) => t.translatedText);
          const updatedFAQs = faqs.map((faq, index) => ({
            question: translatedTexts[index * 2],
            answer: translatedTexts[index * 2 + 1],
          }));
          setTranslatedFAQs(updatedFAQs);
        }
      } catch (error) {
        console.error("Translation error:", error);
      }
    };

    translateFAQs();
  }, [i18n.language]);

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
            {translatedFAQs.map((faq, index) => (
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
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-[var(--features-icon-color)]" />
                  ) : (
                    <Plus className="w-5 h-5 text-[var(--features-icon-color)]" />
                  )}
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
