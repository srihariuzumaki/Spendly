import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { AddTransactionModal } from "./AddTransactionModal";
import { Bell, Menu } from "lucide-react";
import { cn } from "@/src/lib/utils";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAupAUagnx5EVOA2Q6HmFgQFgUJGyQp1GUOZrWB__0Rh3w9j_cK-UoLN-clsv-1CR1JK6ok2ay7CNCypr2ElyrP4aFA7w69Oh0C_mDUAPUUJK_4wqLvaUSQSUfwPOCDU3Iwiunvo2lq8Dl97IX3CK3n-lzVypro1yxHgfPNZk2bgeObOZR6VtFgWySD2xCR5Uir5GwZS7BPaINv70nxzbSx06CMlEBtcdjPO1SacbQIUf3xPkWYYHNyyHxYBx8R49x0JF28y1ybc1A" 
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
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
