import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, MessageCircle, HelpCircle, FileText, Mail } from "lucide-react";
import { cn } from "@/src/lib/utils";

const FAQS = [
  {
    question: "How do I add a new transaction?",
    answer: "You can add a new transaction by clicking the '+' button in the top right of the navigation bar from anywhere in the app, or by going to the Transactions page and using the 'Add Transaction' button."
  },
  {
    question: "Is my financial data secure?",
    answer: "Yes, Spendly uses local storage within your browser to store your data. This means your financial information never leaves your device and is not uploaded to any remote servers. Please note: if you clear your browser data, your Spendly data will be deleted."
  },
  {
    question: "Can I change my base currency?",
    answer: "Absolutely! Go to the Settings page to update your preferred base currency symbol. It will automatically update across your entire dashboard, transactions, and goals."
  },
  {
    question: "How do Savings Goals work?",
    answer: "Goals allow you to set financial targets (like saving for a trip or a new car). You can track your progress by 'adding funds' directly into the goal via the Goals page. It calculates your percentage completion dynamically!"
  },
  {
    question: "How do I export my data?",
    answer: "Currently, Data Export is a planned feature for our upcoming version. Once available, you will be able to export your transactions to a CSV format from the Settings page."
  }
];

export default function Help() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-12 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <header className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-6 pt-10">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-20 h-20 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center">
          <HelpCircle className="w-10 h-10" />
        </motion.div>
        <div>
          <h1 className="font-serif text-5xl text-primary mb-4">How can we help?</h1>
          <p className="font-sans text-on-surface-variant leading-relaxed">
            Find answers to common questions, learn how to use Spendly effectively, or get in touch if you need further assistance.
          </p>
        </div>
      </header>

      {/* Support Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        {[
          { icon: FileText, title: "Getting Started", desc: "View our quick onboarding guide." },
          { icon: MessageCircle, title: "Community", desc: "Join other users on Discord." },
          { icon: Mail, title: "Contact Support", desc: "Email us directly." }
        ].map((item, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}
            key={item.title}
            className="bg-surface-container rounded-3xl p-8 flex flex-col items-center text-center cursor-pointer hover:bg-surface-container-high transition-colors"
          >
            <item.icon className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-sans font-bold text-on-surface mb-2">{item.title}</h3>
            <p className="font-sans text-xs text-on-surface-variant/80">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* FAQ Accordion */}
      <motion.section 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="pt-10"
      >
        <h2 className="font-sans text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-6 pl-4">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="glass-card rounded-[24px] overflow-hidden">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="font-sans font-bold text-on-surface">{faq.question}</span>
                <ChevronDown className={cn("w-5 h-5 text-on-surface-variant transition-transform", openIndex === i ? "rotate-180" : "")} />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6 pt-0 font-sans text-sm text-on-surface-variant leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
