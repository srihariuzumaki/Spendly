import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { AddTransactionModal } from "./AddTransactionModal";
import { Bell, Menu } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useApp } from "@/src/context/AppContext";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { profile } = useApp();

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-secondary-container selection:text-on-secondary-container">
      <Sidebar onAddClick={() => setIsModalOpen(true)} />
      
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 w-full z-40 flex justify-between items-center px-6 h-20 bg-surface/60 backdrop-blur-2xl border-b border-outline-variant/30">
        <div className="font-serif italic text-2xl text-primary">Spendly</div>
        <div className="flex items-center gap-4">
          <button className="text-on-surface-variant hover:text-primary">
            <Bell className="w-5 h-5 stroke-[1.5px]" />
          </button>
          <Link to="/settings" className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center bg-surface text-lg hover:border-primary transition-all">
            {profile.avatar}
          </Link>
          <button className="text-on-surface-variant">
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
