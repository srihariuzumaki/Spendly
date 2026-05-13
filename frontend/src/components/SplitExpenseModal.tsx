import React, { useState, useMemo } from "react";
import { X, Check, Users, Utensils, Car, ShoppingBag, Home, Zap, MoreHorizontal, Music, Heart, Plane } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { useApp, TransactionCategory } from "@/src/context/AppContext";

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

interface SplitExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SplitExpenseModal({ isOpen, onClose }: SplitExpenseModalProps) {
  const { addTransaction, profile } = useApp();

  const formatLocalCurrency = (amount: number) => {
    return `${profile.currency}${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const [rawAmount, setRawAmount] = useState("");
  const [people, setPeople] = useState(2);
  const [category, setCategory] = useState<TransactionCategory>("Food");
  const [merchant, setMerchant] = useState("");
  const [note, setNote] = useState("");
  const [dateInput, setDateInput] = useState(() => new Date().toISOString().split("T")[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const totalAmount = parseFloat(rawAmount) || 0;
  const myShare = totalAmount > 0 ? totalAmount / people : 0;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, "");
    const parts = val.split(".");
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    setRawAmount(val);
    if (errors.amount) setErrors((prev) => ({ ...prev, amount: "" }));
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!rawAmount || isNaN(totalAmount) || totalAmount <= 0) newErrors.amount = "Enter a valid amount";
    if (!merchant.trim()) newErrors.merchant = "Merchant is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addTransaction({
      type: "expense",
      amount: myShare,
      category,
      merchant: merchant.trim(),
      note: `Split bill with ${people - 1} others${note ? ` - ${note}` : ''}`,
      date: new Date(dateInput + "T12:00:00").toISOString(),
    });

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setRawAmount("");
      setMerchant("");
      setNote("");
      setDateInput(new Date().toISOString().split("T")[0]);
      setPeople(2);
      setErrors({});
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
              className="w-full max-w-lg bg-surface/95 backdrop-blur-[32px] rounded-t-[32px] md:rounded-[32px] border-t md:border border-outline-variant/30 shadow-2xl pointer-events-auto flex flex-col pt-8 pb-12 px-6 md:px-10 max-h-[95vh] overflow-y-auto no-scrollbar"
            >
              <header className="flex justify-between items-center mb-8 shrink-0">
                <button 
                  onClick={handleClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
                >
                  <X className="w-6 h-6 stroke-[1.5px]" />
                </button>
                <h2 className="font-sans text-sm font-medium text-on-surface uppercase tracking-[0.2em]">Split Bill</h2>
                <div className="w-10 h-10" />
              </header>

              <div className="flex-1 flex flex-col gap-8">
                {/* Amount Input */}
                <div className="flex flex-col items-center justify-center pt-2">
                  <span className="font-sans text-[10px] text-on-surface-variant font-semibold uppercase tracking-[0.2em] mb-4">Total Bill Amount</span>
                  <div className="relative w-full max-w-[280px]">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 font-serif text-5xl text-on-surface-variant/30 select-none">{profile.currency}</span>
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

                {/* People Splitter */}
                <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/20 flex flex-col items-center gap-6">
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => setPeople(Math.max(2, people - 1))}
                      className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-xl text-on-surface hover:bg-surface-variant transition-colors"
                    >-</button>
                    <div className="flex flex-col items-center min-w-[80px]">
                      <span className="font-serif text-3xl text-primary">{people}</span>
                      <span className="font-sans text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">People</span>
                    </div>
                    <button 
                      onClick={() => setPeople(people + 1)}
                      className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-xl text-on-surface hover:bg-surface-variant transition-colors"
                    >+</button>
                  </div>
                  
                  <div className="w-full h-[1px] bg-outline-variant/20" />
                  
                  <div className="flex justify-between items-end w-full px-2">
                    <span className="font-sans text-xs text-on-surface-variant font-medium">Your Share:</span>
                    <span className="font-serif text-3xl text-tertiary">
                      {totalAmount > 0 ? formatLocalCurrency(myShare) : `${profile.currency}0.00`}
                    </span>
                  </div>
                </div>

                {/* Category Selector */}
                <div className="flex flex-col gap-4 mt-2">
                  <span className="font-sans text-[10px] text-on-surface-variant font-semibold uppercase tracking-[0.2em]">Category</span>
                  <div className="flex overflow-x-auto gap-4 pb-4 snap-x no-scrollbar -mx-6 px-6 md:-mx-10 md:px-10">
                    {EXPENSE_CATEGORIES.map((cat) => (
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
                      Merchant / Place
                    </label>
                    <input 
                      className={cn(
                        "w-full bg-transparent border-b pb-3 font-sans text-lg text-on-surface focus:outline-none transition-colors placeholder:text-outline-variant/60",
                        errors.merchant ? "border-error" : "border-outline-variant/40 focus:border-on-surface"
                      )}
                      placeholder="e.g. Dinner at Mario's" 
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
                    <>
                      <Users className="w-4 h-4 stroke-[2px]" />
                      <span>Log My Share ({formatLocalCurrency(myShare || 0)})</span>
                    </>
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
