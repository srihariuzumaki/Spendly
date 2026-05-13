import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowLeft, Target, PieChart, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/src/lib/utils";

const ONBOARDING_STEPS = [
  {
    id: "track",
    title: "Track effortlessly",
    subtitle: "Say goodbye to messy spreadsheets. Add transactions in seconds.",
    icon: CreditCard,
    visual: (
      <div className="relative w-full h-full flex flex-col items-center justify-center gap-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="glass-card w-[80%] p-4 rounded-xl flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="h-4 bg-on-surface-variant/20 rounded w-2/3 mb-2" />
            <div className="h-3 bg-on-surface-variant/10 rounded w-1/3" />
          </div>
          <div className="font-serif text-lg">-$45</div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="glass-card w-[80%] p-4 rounded-xl flex items-center gap-4 opacity-70"
        >
          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="h-4 bg-on-surface-variant/20 rounded w-1/2 mb-2" />
            <div className="h-3 bg-on-surface-variant/10 rounded w-1/4" />
          </div>
          <div className="font-serif text-lg">-$12</div>
        </motion.div>
      </div>
    ),
  },
  {
    id: "save",
    title: "Save for what matters",
    subtitle: "Set goals and watch your progress grow day by day.",
    icon: Target,
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="glass-card w-[80%] p-6 rounded-2xl flex flex-col gap-4"
        >
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">New Mac</p>
              <p className="font-serif text-2xl">$1,200 <span className="text-sm font-sans text-outline">/ $2,000</span></p>
            </div>
            <div className="text-2xl">💻</div>
          </div>
          <div className="h-2 bg-surface-variant rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "60%" }}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              className="h-full bg-primary rounded-full"
            />
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: "insights",
    title: "Insights that make sense",
    subtitle: "Understand your spending habits with clear, beautiful charts.",
    icon: PieChart,
    visual: (
      <div className="relative w-full h-full flex items-center justify-center gap-2 items-end pb-8">
        {[40, 70, 45, 90, 60].map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: `${h}%`, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
            className={cn(
              "w-8 rounded-t-md",
              i === 3 ? "bg-primary" : "bg-surface-variant"
            )}
          />
        ))}
      </div>
    ),
  }
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < ONBOARDING_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      navigate("/signup");
    }
  };

  const currentStep = ONBOARDING_STEPS[step];

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary-container/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-tertiary-fixed/20 rounded-full blur-[120px] pointer-events-none" />
      
      <main className="flex-grow flex flex-col items-center justify-center z-10 w-full max-w-lg mx-auto py-12 px-6">
        
        {/* Visual Area */}
        <div className="w-full h-64 md:h-80 mb-8 relative rounded-3xl bg-surface-container-lowest/50 border border-outline-variant/30 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 w-full h-full"
            >
              {currentStep.visual}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Text Area */}
        <div className="w-full text-center flex flex-col items-center flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container mb-6">
                <currentStep.icon className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-4xl mb-4 text-primary">
                {currentStep.title}
              </h2>
              <p className="font-sans text-on-surface-variant leading-relaxed">
                {currentStep.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="w-full flex items-center justify-between mt-8 pt-8 border-t border-outline-variant/20">
          <button 
            onClick={() => navigate("/login")}
            className="text-sm font-sans tracking-widest uppercase text-outline hover:text-primary transition-colors py-2"
          >
            Skip
          </button>
          
          <div className="flex gap-2">
            {ONBOARDING_STEPS.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === step ? "w-6 bg-primary" : "w-1.5 bg-outline-variant"
                )}
              />
            ))}
          </div>

          <button 
            onClick={handleNext}
            className="bg-primary text-on-primary rounded-full px-6 py-3 font-sans text-sm font-medium tracking-wide flex items-center gap-2 hover:bg-inverse-surface transition-colors active:scale-95"
          >
            {step === ONBOARDING_STEPS.length - 1 ? "Start" : "Next"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </main>
    </div>
  );
}
