import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function Landing() {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col relative overflow-hidden">
      {/* Subtle Abstract Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary-container/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-tertiary-fixed/20 rounded-full blur-[120px] pointer-events-none" />
      
      <main className="flex-grow flex flex-col items-center justify-center px-6 z-10 w-full max-w-[1280px] mx-auto">
        {/* Brand Centerpiece */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-12 w-full max-w-md"
        >
          <h1 className="font-serif italic text-7xl md:text-8xl text-primary mb-4">
            Spendly
          </h1>
          <p className="font-sans text-lg md:text-xl text-on-surface-variant/80">
            Your money, clearly.
          </p>
        </motion.div>

        {/* Call to Action Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-xs flex flex-col gap-6"
        >
          <Link 
            to="/onboarding"
            className="w-full bg-secondary-container text-on-secondary-container font-sans text-sm font-semibold tracking-widest uppercase rounded-full py-5 px-8 hover:bg-secondary-fixed transition-all flex justify-center items-center gap-2 group shadow-sm active:scale-95"
          >
            Get Started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/dashboard"
            className="text-center font-sans text-sm font-medium tracking-widest uppercase text-outline hover:text-primary transition-all underline decoration-outline/30 underline-offset-8 hover:decoration-primary/50"
          >
            Sign in
          </Link>
        </motion.div>
      </main>
      
      {/* Decorative Footer Detail */}
      <footer className="p-8 text-center">
        <p className="font-sans text-[10px] tracking-[0.3em] uppercase opacity-30">
          Crafted for intentional living
        </p>
      </footer>
    </div>
  );
}
