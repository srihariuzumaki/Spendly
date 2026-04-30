import { X, Check, Utensils, Car, ShoppingBag, Home, Zap, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

const categories = [
  { id: "food", label: "Food", icon: Utensils },
  { id: "transit", label: "Transit", icon: Car },
  { id: "shop", label: "Shop", icon: ShoppingBag },
  { id: "home", label: "Home", icon: Home },
  { id: "bills", label: "Bills", icon: Zap },
  { id: "more", label: "More", icon: MoreHorizontal },
];

export function AddTransactionModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-surface-variant/40 backdrop-blur-sm z-[60]"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center pointer-events-none p-0 md:p-6">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-full max-w-lg bg-surface/95 backdrop-blur-[32px] rounded-t-[32px] md:rounded-[32px] border-t md:border border-white/40 shadow-2xl pointer-events-auto flex flex-col pt-8 pb-12 px-6 md:px-10 max-h-[95vh] overflow-y-auto no-scrollbar"
            >
              <header className="flex justify-between items-center mb-10 shrink-0">
                <button 
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
                >
                  <X className="w-6 h-6 stroke-[1.5px]" />
                </button>
                <h2 className="font-sans text-sm font-medium text-on-surface uppercase tracking-[0.2em]">New Entry</h2>
                <div className="w-10 h-10" /> {/* Balancer */}
              </header>

              <div className="flex-1 flex flex-col gap-10">
                {/* Type Switcher */}
                <div className="flex p-1 bg-surface-container-low rounded-full mx-auto w-fit border border-outline-variant/20">
                  <button className="py-2.5 px-6 bg-surface rounded-full shadow-sm font-sans text-xs font-semibold text-on-surface transition-all">Expense</button>
                  <button className="py-2.5 px-6 rounded-full font-sans text-xs font-medium text-on-surface-variant hover:text-on-surface transition-all">Income</button>
                </div>

                {/* Amount Input */}
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="relative w-full max-w-[280px]">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 font-serif text-5xl text-on-surface-variant/30 select-none">$</span>
                    <input 
                      autoFocus
                      className="w-full bg-transparent border-b border-outline-variant/30 pb-2 pt-2 pl-10 pr-2 font-serif text-5xl text-on-surface focus:outline-none focus:border-on-surface transition-colors placeholder:text-on-surface-variant/30 text-center tracking-tight" 
                      placeholder="0.00" 
                      type="text" 
                      defaultValue="0.00"
                    />
                  </div>
                </div>

                {/* Category Selector */}
                <div className="flex flex-col gap-4">
                  <span className="font-sans text-[10px] text-on-surface-variant font-semibold uppercase tracking-[0.2em]">Category</span>
                  <div className="flex overflow-x-auto gap-4 pb-4 snap-x no-scrollbar -mx-6 px-6 md:-mx-10 md:px-10">
                    {categories.map((cat, i) => (
                      <button 
                        key={cat.id}
                        className="flex flex-col items-center gap-3 min-w-[72px] snap-start group outline-none"
                      >
                        <div className={cn(
                          "w-16 h-16 rounded-[20px] flex items-center justify-center transition-all active:scale-95",
                          i === 0 
                            ? "bg-secondary-container text-on-secondary-container shadow-inner" 
                            : "bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high"
                        )}>
                          <cat.icon className="w-7 h-7 stroke-[1.5px]" />
                        </div>
                        <span className={cn(
                          "font-sans text-[10px] font-medium transition-colors",
                          i === 0 ? "text-on-surface" : "text-on-surface-variant"
                        )}>
                          {cat.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Inputs */}
                <div className="flex flex-col gap-8">
                  <div className="relative group">
                    <label className="font-sans text-[10px] font-semibold text-on-surface-variant uppercase tracking-[0.1em] block mb-2 transition-colors group-focus-within:text-on-surface">Merchant</label>
                    <input 
                      className="w-full bg-transparent border-b border-outline-variant/40 pb-3 font-sans text-lg text-on-surface focus:outline-none focus:border-on-surface transition-colors placeholder:text-outline-variant/60" 
                      placeholder="e.g. Whole Foods" 
                      type="text"
                    />
                  </div>
                  <div className="relative group">
                    <label className="font-sans text-[10px] font-semibold text-on-surface-variant uppercase tracking-[0.1em] block mb-2 transition-colors group-focus-within:text-on-surface">Note</label>
                    <input 
                      className="w-full bg-transparent border-b border-outline-variant/40 pb-3 font-sans text-lg text-on-surface focus:outline-none focus:border-on-surface transition-colors placeholder:text-outline-variant/60" 
                      placeholder="Add a description..." 
                      type="text"
                    />
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="mt-12 shrink-0">
                <button 
                  onClick={onClose}
                  className="w-full py-4 px-8 rounded-full bg-primary text-on-primary font-sans text-xs font-semibold uppercase tracking-[0.2em] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>Save Transaction</span>
                  <Check className="w-4 h-4 stroke-[2px]" />
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
