import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { AddTransactionModal } from "./AddTransactionModal";
import { Bell, Menu, Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";
import { useApp } from "@/src/context/AppContext";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { profile, theme, toggleTheme } = useApp();

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-secondary-container selection:text-on-secondary-container">
      <Sidebar 
        onAddClick={() => { setIsModalOpen(true); setIsMobileMenuOpen(false); }} 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 w-full z-40 flex justify-between items-center px-6 h-20 bg-surface/60 backdrop-blur-2xl border-b border-outline-variant/30">
        <div className="font-serif italic text-2xl text-primary">Spendly</div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-all relative overflow-hidden"
          >
            <motion.div
              initial={false}
              animate={{ rotate: theme === "dark" ? 90 : 0, scale: theme === "dark" ? 0 : 1, opacity: theme === "dark" ? 0 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute"
            >
              <Moon className="w-5 h-5 stroke-[1.5px]" />
            </motion.div>
            <motion.div
              initial={false}
              animate={{ rotate: theme === "dark" ? 0 : -90, scale: theme === "dark" ? 1 : 0, opacity: theme === "dark" ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute"
            >
              <Sun className="w-5 h-5 stroke-[1.5px]" />
            </motion.div>
          </button>
          
          <button className="text-on-surface-variant hover:text-primary relative mt-1">
            <Bell className="w-5 h-5 stroke-[1.5px]" />
          </button>
          <Link to="/settings" className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center bg-surface text-lg hover:border-primary overflow-hidden transition-all">
            {profile.avatar && (profile.avatar.startsWith('data:') || profile.avatar.startsWith('http')) ? (
              <img src={profile.avatar} alt="User" className="w-full h-full object-cover" />
            ) : (
              profile.avatar || "👤"
            )}
          </Link>
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-on-surface-variant">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="lg:ml-72 pt-24 lg:pt-12 px-margin-mobile md:px-margin-desktop pb-24 max-w-container-max mx-auto">
        {children}
      </main>

      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
