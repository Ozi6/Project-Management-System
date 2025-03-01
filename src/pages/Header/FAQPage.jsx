import React from "react";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const faqs = [
  {
    question: "What is PlanWise?",
    answer: "PlanWise is a project management tool designed to help teams collaborate, organize tasks, and improve productivity.",
  },
  {
    question: "How can I get started?",
    answer: "Sign up for a free account and start organizing your projects in minutes. No credit card required!",
  },
  {
    question: "Is there a free plan available?",
    answer: "Yes, we offer a free plan with basic features. You can upgrade anytime for additional functionality.",
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Absolutely! You can cancel your subscription anytime from your account settings.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we use industry-standard encryption and security measures to protect your data.",
  },
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = React.useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="absolute top-0 left-0 w-full h-full bg-blue-50 opacity-50 z-0"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1
                className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Frequently Asked Questions
              </motion.h1>
              <motion.p
                className="text-xl text-gray-700 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Find answers to the most common questions about PlanWise.
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
                  className="w-full flex justify-between items-center text-left text-lg font-semibold text-gray-900 focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                  {openIndex === index ? <Minus className="w-5 h-5 text-gray-600" /> : <Plus className="w-5 h-5 text-gray-600" />}
                </button>
                <motion.p
                  className={`text-gray-700 mt-2 ${openIndex === index ? "block" : "hidden"}`}
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