import React, { useMemo, useState } from "react";
import { Ghost, Calendar, AlertCircle, Ban, RefreshCw, Activity, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useApp, Transaction } from "@/src/context/AppContext";
import { cn } from "@/src/lib/utils";

interface SubscriptionData {
  merchant: string;
  amount: number;
  frequency: "Monthly" | "Weekly" | "Yearly";
  lastPaidDate: string;
  estimatedNextDate: string;
  transactions: Transaction[];
  avgDays: number;
}

export default function Subscriptions() {
  const { transactions, formatCurrency } = useApp();
  const [cancelledSubs, setCancelledSubs] = useState<string[]>([]);

  const subscriptions = useMemo(() => {
    const expenses = transactions.filter(t => t.type === "expense");
    
    // Group by merchant
    const grouped: Record<string, Transaction[]> = {};
    expenses.forEach(t => {
      const key = t.merchant.trim().toLowerCase();
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(t);
    });

    const subs: SubscriptionData[] = [];

    Object.values(grouped).forEach(group => {
      if (group.length < 2) return; // Need at least 2 to establish a pattern

      // Sort ascending by date
      group.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Check if amounts are identical or very close (within 10%)
      const amounts = group.map(t => t.amount);
      const minAmt = Math.min(...amounts);
      const maxAmt = Math.max(...amounts);
      if (maxAmt - minAmt > minAmt * 0.1) return;

      // Check intervals
      let totalDays = 0;
      for (let i = 1; i < group.length; i++) {
        const d1 = new Date(group[i-1].date).getTime();
        const d2 = new Date(group[i].date).getTime();
        totalDays += (d2 - d1) / (1000 * 60 * 60 * 24);
      }
      const avgDays = totalDays / (group.length - 1);

      let freq: "Monthly" | "Weekly" | "Yearly" | null = null;
      if (avgDays >= 25 && avgDays <= 35) freq = "Monthly";
      else if (avgDays >= 6 && avgDays <= 8) freq = "Weekly";
      else if (avgDays >= 350 && avgDays <= 380) freq = "Yearly";

      if (freq) {
        const lastTx = group[group.length - 1];
        const nextDate = new Date(lastTx.date);
        if (freq === "Monthly") nextDate.setMonth(nextDate.getMonth() + 1);
        if (freq === "Weekly") nextDate.setDate(nextDate.getDate() + 7);
        if (freq === "Yearly") nextDate.setFullYear(nextDate.getFullYear() + 1);

        subs.push({
          merchant: group[group.length - 1].merchant,
          amount: lastTx.amount,
          frequency: freq,
          lastPaidDate: lastTx.date,
          estimatedNextDate: nextDate.toISOString(),
          transactions: group,
          avgDays
        });
      }
    });

    return subs.sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const activeSubs = subscriptions.filter(s => !cancelledSubs.includes(s.merchant));
  
  // Calculate total monthly burn rate roughly
  const monthlyBurn = activeSubs.reduce((acc, sub) => {
    if (sub.frequency === "Monthly") return acc + sub.amount;
    if (sub.frequency === "Weekly") return acc + (sub.amount * 4.33);
    if (sub.frequency === "Yearly") return acc + (sub.amount / 12);
    return acc;
  }, 0);

  const toggleCancel = (merchant: string) => {
    setCancelledSubs(prev => 
      prev.includes(merchant) ? prev.filter(m => m !== merchant) : [...prev, merchant]
    );
  };

  return (
    <div className="space-y-12">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <Ghost className="w-8 h-8 text-primary" />
          <h1 className="font-serif italic text-4xl text-on-background">Ghost Subscriptions</h1>
        </div>
        <p className="font-sans text-sm text-on-surface-variant max-w-lg">
          Our algorithm scans your transaction history for recurring payment patterns to automatically identify silent subscriptions draining your wallet.
        </p>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 flex flex-col justify-center">
          <span className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">Detected Subscriptions</span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-5xl text-primary">{subscriptions.length}</span>
            <span className="font-sans text-sm text-on-surface-variant">total found</span>
          </div>
        </div>
        <div className="glass-card p-6 flex flex-col justify-center">
          <span className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">Monthly Subscription Burn</span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-5xl text-error">{formatCurrency(monthlyBurn)}</span>
            <span className="font-sans text-sm text-on-surface-variant">/ month</span>
          </div>
        </div>
      </div>

      {subscriptions.length === 0 ? (
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
          <Activity className="w-16 h-16 text-on-surface-variant/30 mb-4" />
          <h3 className="font-serif text-xl text-on-surface mb-2">No Subscriptions Detected</h3>
          <p className="font-sans text-sm text-on-surface-variant max-w-md">
            We couldn't find any recurring patterns in your transaction history. Add more transactions for the algorithm to detect subscriptions.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="font-sans text-xs uppercase tracking-widest text-on-surface-variant ml-4">Identified Patterns</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence>
              {subscriptions.map((sub, idx) => {
                const isCancelled = cancelledSubs.includes(sub.merchant);
                return (
                  <motion.div 
                    key={sub.merchant}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={cn(
                      "glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-500",
                      isCancelled && "opacity-60 grayscale"
                    )}
                  >
                    <div className="flex items-center gap-6">
                      <div className={cn(
                        "w-14 h-14 rounded-full flex items-center justify-center shrink-0",
                        isCancelled ? "bg-surface-variant text-on-surface-variant" : "bg-primary-container text-on-primary-container"
                      )}>
                        <RefreshCw className={cn("w-6 h-6", isCancelled ? "" : "animate-spin-slow")} />
                      </div>
                      
                      <div>
                        <h3 className={cn("font-serif text-2xl mb-1", isCancelled ? "text-on-surface-variant line-through" : "text-on-surface")}>
                          {sub.merchant}
                        </h3>
                        <div className="flex items-center gap-4 text-xs font-sans text-on-surface-variant uppercase tracking-wider">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {sub.frequency}
                          </span>
                          <span>•</span>
                          <span>{sub.transactions.length} payments found</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end gap-2">
                      <div className="font-serif text-3xl text-on-surface">
                        {formatCurrency(sub.amount)}
                      </div>
                      <div className="text-xs font-sans text-on-surface-variant flex items-center gap-1">
                        {isCancelled ? (
                          <span className="text-error flex items-center gap-1"><Ban className="w-3 h-3" /> Marked as Cancelled</span>
                        ) : (
                          <>
                            <span>Next bill approx.</span>
                            <span className="font-semibold text-on-surface">{new Date(sub.estimatedNextDate).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-outline-variant/30 pt-4 md:pt-0 md:pl-6 mt-2 md:mt-0">
                      <button 
                        onClick={() => toggleCancel(sub.merchant)}
                        className={cn(
                          "flex-1 md:flex-none px-4 py-2 rounded-full font-sans text-[10px] uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2",
                          isCancelled 
                            ? "bg-surface-container text-on-surface hover:bg-surface-variant"
                            : "bg-error/10 text-error hover:bg-error hover:text-on-error"
                        )}
                      >
                        {isCancelled ? "Restore" : "Mark Cancelled"}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
