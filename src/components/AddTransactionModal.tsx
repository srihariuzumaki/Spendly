import React, { useState } from "react";
import { X, Check, Utensils, Car, ShoppingBag, Home, Zap, MoreHorizontal, Briefcase, Plane, Heart, Music } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { useApp, TransactionCategory, TransactionType } from "@/src/context/AppContext";

const EXPENSE_CATEGORIES: { id: TransactionCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "Food",          label: "Food",         icon: Utensils },
  { id: "Transit",       label: "Transit",       icon: Car },
  { id: "Shopping",      label: "Shopping",      icon: ShoppingBag },
  { id: "Housing",       label: "Housing",       icon: Home },
  { id: "Bills",         label: "Bills",         icon: Zap },
  { id: "Entertainment", label: "Entertain",     icon: Music },
  { id: "Healthcare",    label: "Health",        icon: Heart },
  { id: "Travel",        label: "Travel",        icon: Plane },
  { id: "Groceries",     label: "Groceries",     icon: Utensils },
  { id: "Other",         label: "Other",         icon: MoreHorizontal },
];

const INCOME_CATEGORIES: { id: TransactionCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "Salary",    label: "Salary",    icon: Briefcase },
  { id: "Freelance", label: "Freelance", icon: Briefcase },
  { id: "Other",     label: "Other",     icon: MoreHorizontal },
];

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
  const { addTransaction } = useApp();

  const [type, setType] = useState<TransactionType>("expense");
  const [rawAmount, setRawAmount] = useState("");
  const [category, setCategory] = useState<TransactionCategory>("Food");
  const [merchant, setMerchant] = useState("");
  const [note, setNote] = useState("");
  const [dateInput, setDateInput] = useState(() => new Date().toISOString().split("T")[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  // Switch type → reset category to first option
  const handleTypeSwitch = (t: TransactionType) => {
    setType(t);
    setCategory(t === "expense" ? "Food" : "Salary");
    setErrors({});
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and one decimal
    const val = e.target.value.replace(/[^0-9.]/g, "");
    const parts = val.split(".");
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    setRawAmount(val);
    if (errors.amount) setErrors((prev) => ({ ...prev, amount: "" }));
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    const amount = parseFloat(rawAmount);
    if (!rawAmount || isNaN(amount) || amount <= 0) newErrors.amount = "Enter a valid amount";
    if (!merchant.trim()) newErrors.merchant = "Merchant is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addTransaction({
      type,
      amount,
      category,
      merchant: merchant.trim(),
      note: note.trim(),
      date: new Date(dateInput + "T12:00:00").toISOString(),
    });

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      // Reset
      setRawAmount("");
      setMerchant("");
      setNote("");
      setDateInput(new Date().toISOString().split("T")[0]);
      setErrors({});
      setType("expense");
      setCategory("Food");
      onClose();
    }, 800);
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
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
                  onClick={handleClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
                >
                  <X className="w-6 h-6 stroke-[1.5px]" />
                </button>
                <h2 className="font-sans text-sm font-medium text-on-surface uppercase tracking-[0.2em]">New Entry</h2>
                <div className="w-10 h-10" />
              </header>

              <div className="flex-1 flex flex-col gap-10">
                {/* Type Switcher */}
                <div className="flex p-1 bg-surface-container-low rounded-full mx-auto w-fit border border-outline-variant/20">
                  {(["expense", "income"] as TransactionType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => handleTypeSwitch(t)}
                      className={cn(
                        "py-2.5 px-6 rounded-full font-sans text-xs font-semibold transition-all capitalize",
                        type === t
                          ? t === "expense"
                            ? "bg-surface shadow-sm text-on-surface"
                            : "bg-tertiary-container text-on-tertiary-container shadow-sm"
                          : "text-on-surface-variant hover:text-on-surface"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Amount Input */}
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="relative w-full max-w-[280px]">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 font-serif text-5xl text-on-surface-variant/30 select-none">$</span>
                    <input 
                      autoFocus
                      className={cn(
                        "w-full bg-transparent border-b pb-2 pt-2 pl-10 pr-2 font-serif text-5xl text-on-surface focus:outline-none transition-colors placeholder:text-on-surface-variant/30 text-center tracking-tight",
                        errors.amount ? "border-error" : "border-outline-variant/30 focus:border-on-surface"
                      )}
                      placeholder="0.00" 
                      type="text"
                      inputMode="decimal"
                      value={rawAmount}
                      onChange={handleAmountChange}
                    />
                  </div>
                  {errors.amount && (
                    <p className="font-sans text-[10px] text-error mt-2 uppercase tracking-widest">{errors.amount}</p>
                  )}
                </div>

                {/* Category Selector */}
                <div className="flex flex-col gap-4">
                  <span className="font-sans text-[10px] text-on-surface-variant font-semibold uppercase tracking-[0.2em]">Category</span>
                  <div className="flex overflow-x-auto gap-4 pb-4 snap-x no-scrollbar -mx-6 px-6 md:-mx-10 md:px-10">
                    {categories.map((cat) => (
                      <button 
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className="flex flex-col items-center gap-3 min-w-[72px] snap-start group outline-none"
                      >
                        <div className={cn(
                          "w-16 h-16 rounded-[20px] flex items-center justify-center transition-all active:scale-95",
                          category === cat.id
                            ? "bg-secondary-container text-on-secondary-container shadow-inner" 
                            : "bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high"
                        )}>
                          <cat.icon className="w-7 h-7 stroke-[1.5px]" />
                        </div>
                        <span className={cn(
                          "font-sans text-[10px] font-medium transition-colors",
                          category === cat.id ? "text-on-surface font-bold" : "text-on-surface-variant"
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
                    <label className="font-sans text-[10px] font-semibold text-on-surface-variant uppercase tracking-[0.1em] block mb-2 transition-colors group-focus-within:text-on-surface">
                      Merchant / Source
                    </label>
                    <input 
                      className={cn(
                        "w-full bg-transparent border-b pb-3 font-sans text-lg text-on-surface focus:outline-none transition-colors placeholder:text-outline-variant/60",
                        errors.merchant ? "border-error" : "border-outline-variant/40 focus:border-on-surface"
                      )}
                      placeholder="e.g. Whole Foods" 
                      type="text"
                      value={merchant}
                      onChange={(e) => {
                        setMerchant(e.target.value);
                        if (errors.merchant) setErrors((prev) => ({ ...prev, merchant: "" }));
                      }}
                    />
                    {errors.merchant && (
                      <p className="font-sans text-[10px] text-error mt-1 uppercase tracking-widest">{errors.merchant}</p>
                    )}
                  </div>

                  <div className="relative group">
                    <label className="font-sans text-[10px] font-semibold text-on-surface-variant uppercase tracking-[0.1em] block mb-2 transition-colors group-focus-within:text-on-surface">
                      Note
                    </label>
                    <input 
                      className="w-full bg-transparent border-b border-outline-variant/40 pb-3 font-sans text-lg text-on-surface focus:outline-none focus:border-on-surface transition-colors placeholder:text-outline-variant/60" 
                      placeholder="Add a description..." 
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>

                  <div className="relative group">
                    <label className="font-sans text-[10px] font-semibold text-on-surface-variant uppercase tracking-[0.1em] block mb-2 transition-colors group-focus-within:text-on-surface">
                      Date
                    </label>
                    <input 
                      className="w-full bg-transparent border-b border-outline-variant/40 pb-3 font-sans text-lg text-on-surface focus:outline-none focus:border-on-surface transition-colors" 
                      type="date"
                      value={dateInput}
                      max={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setDateInput(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="mt-12 shrink-0">
                <motion.button 
                  onClick={handleSave}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "w-full py-4 px-8 rounded-full font-sans text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2",
                    saved
                      ? "bg-tertiary text-on-tertiary"
                      : "bg-primary text-on-primary hover:opacity-90"
                  )}
                >
                  {saved ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2px]" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <span>Save Transaction</span>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
