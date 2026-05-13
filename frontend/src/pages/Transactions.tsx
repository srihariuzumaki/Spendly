import React, { useState, useMemo, useCallback } from "react";
import { Search, SlidersHorizontal, Utensils, Car, ShoppingBag, Home, Zap, Music, Heart, Plane, MoreHorizontal, Briefcase, Store, Trash2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { useApp, formatDate, TransactionCategory, Transaction } from "@/src/context/AppContext";
import { AddTransactionModal } from "@/src/components/AddTransactionModal";

const CATEGORY_ICONS: Record<TransactionCategory, React.ComponentType<{ className?: string }>> = {
  Food: Utensils, Transit: Car, Shopping: ShoppingBag, Housing: Home,
  Bills: Zap, Groceries: Store, Entertainment: Music, Healthcare: Heart,
  Travel: Plane, Other: MoreHorizontal, Salary: Briefcase, Freelance: Briefcase,
};

const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  Food: "bg-secondary-container text-on-secondary-container",
  Transit: "bg-surface-variant text-on-surface-variant",
  Shopping: "bg-surface-container-high text-on-surface-variant",
  Housing: "bg-primary-container text-on-primary-container",
  Bills: "bg-error-container text-on-error-container",
  Groceries: "bg-secondary-container text-on-secondary-container",
  Entertainment: "bg-tertiary-fixed text-on-tertiary-fixed",
  Healthcare: "bg-surface-tint/20 text-on-surface",
  Travel: "bg-tertiary-container text-on-tertiary-container",
  Other: "bg-surface-container text-on-surface-variant",
  Salary: "bg-tertiary-container text-on-tertiary-container",
  Freelance: "bg-tertiary-fixed text-on-tertiary-fixed",
};

type FilterChip = "All" | "Income" | "Expenses" | TransactionCategory;
const FILTER_CHIPS: FilterChip[] = ["All", "Income", "Expenses", "Food", "Groceries", "Transit", "Shopping", "Housing", "Entertainment"];

function groupByDate(transactions: Transaction[]): { date: string; transactions: Transaction[]; total: number }[] {
  const groups: Record<string, Transaction[]> = {};
  for (const tx of transactions) {
    const label = formatDate(tx.date);
    if (!groups[label]) groups[label] = [];
    groups[label].push(tx);
  }
  return Object.entries(groups).map(([date, txs]) => ({
    date,
    transactions: txs,
    total: txs.reduce((s, t) => s + (t.type === "income" ? t.amount : -t.amount), 0),
  }));
}

// Transaction detail sheet
function TransactionSheet({ tx, onClose, onDelete }: { tx: Transaction; onClose: () => void; onDelete: () => void }) {
  const { formatCurrency } = useApp();
  const Icon = CATEGORY_ICONS[tx.category] ?? Store;
  const colClass = CATEGORY_COLORS[tx.category] ?? "bg-surface-variant text-on-surface-variant";
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 bg-surface-variant/40 backdrop-blur-sm z-[60]" />
      <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center pointer-events-none p-0 md:p-6">
        <motion.div
          initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="w-full max-w-md bg-surface/95 backdrop-blur-[32px] rounded-t-[32px] md:rounded-[32px] border-t md:border border-outline-variant/30 shadow-2xl pointer-events-auto p-8 md:p-10"
        >
          <div className="flex flex-col items-center gap-6 mb-10">
            <div className={cn("w-20 h-20 rounded-full flex items-center justify-center shadow-inner", colClass)}>
              <Icon className="w-9 h-9 stroke-[1.5px]" />
            </div>
            <div className="text-center">
              <h2 className="font-sans text-xl font-bold text-on-surface">{tx.merchant}</h2>
              <p className="font-sans text-[10px] text-on-surface-variant/60 mt-1 uppercase tracking-widest">{tx.category}</p>
            </div>
            <span className={cn("font-serif text-5xl tracking-tight", tx.type === "income" ? "text-tertiary" : "text-primary")}>
              {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
            </span>
          </div>

          <div className="space-y-4 border-t border-outline-variant/10 pt-6">
            {[
              { label: "Type", value: tx.type === "income" ? "Income" : "Expense" },
              { label: "Date", value: new Date(tx.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) },
              { label: "Note", value: tx.note || "—" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-baseline">
                <span className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">{label}</span>
                <span className="font-sans text-sm text-on-surface text-right max-w-[60%]">{value}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-10">
            <button onClick={onClose}
              className="flex-1 py-3 rounded-full border border-outline-variant font-sans text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant hover:bg-surface-container transition-all">
              Close
            </button>
            <button onClick={onDelete}
              className="flex-1 py-3 rounded-full bg-error-container text-on-error-container font-sans text-xs font-semibold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:opacity-80 transition-all">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default function Transactions() {
  const { transactions, deleteTransaction, formatCurrency } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterChip>("All");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = [...transactions];
    // Filter
    if (activeFilter === "Income") result = result.filter((t) => t.type === "income");
    else if (activeFilter === "Expenses") result = result.filter((t) => t.type === "expense");
    else if (activeFilter !== "All") result = result.filter((t) => t.category === activeFilter);
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.merchant.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.note.toLowerCase().includes(q) ||
          String(t.amount).includes(q)
      );
    }
    return result;
  }, [transactions, activeFilter, searchQuery]);

  const groups = useMemo(() => groupByDate(filtered), [filtered]);

  const handleDelete = useCallback((id: string) => {
    deleteTransaction(id);
    setSelectedTx(null);
  }, [deleteTransaction]);

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex justify-between items-center">
        <h1 className="font-serif text-5xl text-primary">Transactions</h1>
        <button className="w-12 h-12 flex items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest hover:bg-surface-container transition-all shadow-sm">
          <SlidersHorizontal className="w-5 h-5 text-on-surface stroke-[1.5px]" />
        </button>
      </header>

      {/* Search Bar */}
      <div className="bg-surface-container-low rounded-full px-8 py-4 flex items-center gap-4 border border-outline-variant/20 shadow-inner">
        <Search className="w-5 h-5 text-outline stroke-[1.5px] shrink-0" />
        <input 
          className="bg-transparent border-none outline-none font-sans text-sm font-medium flex-1 text-on-surface placeholder:text-outline w-full focus:ring-0 p-0" 
          placeholder="Search by merchant, category, or amount..." 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="text-on-surface-variant/40 hover:text-on-surface transition-colors text-lg leading-none">✕</button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-3">
        {FILTER_CHIPS.map((filter) => (
          <button 
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "px-8 py-3 rounded-full font-sans text-[10px] font-bold uppercase tracking-[0.2em] transition-all",
              activeFilter === filter
                ? "bg-secondary-container text-on-secondary-container shadow-sm border border-secondary/10" 
                : "bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Transaction Ledger */}
      <div className="space-y-16">
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-6">
              <Store className="w-9 h-9 text-on-surface-variant/30" />
            </div>
            <p className="font-serif text-2xl text-on-surface mb-2">No transactions found</p>
            <p className="font-sans text-sm text-on-surface-variant/60">
              {searchQuery ? "Try a different search term." : "Add your first transaction to get started."}
            </p>
          </div>
        ) : (
          groups.map((group) => (
            <section key={group.date}>
              <div className="flex justify-between items-center mb-6 pl-2">
                <h2 className="font-sans text-[10px] font-bold text-outline-variant uppercase tracking-[0.3em]">
                  {group.date}
                </h2>
                <span className={cn(
                  "font-serif text-base",
                  group.total >= 0 ? "text-tertiary" : "text-primary"
                )}>
                  {group.total >= 0 ? "+" : ""}{formatCurrency(Math.abs(group.total))}
                </span>
              </div>
              <div className="space-y-4">
                <AnimatePresence>
                  {group.transactions.map((tx) => {
                    const Icon = CATEGORY_ICONS[tx.category] ?? Store;
                    const colClass = CATEGORY_COLORS[tx.category] ?? "bg-surface-variant text-on-surface-variant";
                    return (
                      <motion.div 
                        key={tx.id}
                        layout
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -40, height: 0 }}
                        whileHover={{ y: -4 }}
                        onClick={() => setSelectedTx(tx)}
                        className="flex items-center justify-between p-8 glass-card rounded-[24px] group cursor-pointer transition-all hover:bg-surface-container-highest/80"
                      >
                        <div className="flex items-center gap-8">
                          <div className={cn("w-14 h-14 rounded-full flex items-center justify-center shadow-inner shrink-0", colClass)}>
                            <Icon className="w-6 h-6 stroke-[1.5px]" />
                          </div>
                          <div>
                            <h3 className="font-sans text-base font-semibold text-on-surface">{tx.merchant}</h3>
                            <span className="font-sans text-[11px] font-medium text-outline mt-1 block uppercase tracking-widest leading-none opacity-60">
                              {tx.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className={cn("font-serif text-3xl tracking-tight", tx.type === "income" ? "text-tertiary" : "text-primary")}>
                              {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                            </div>
                            <div className="font-sans text-[10px] font-bold text-outline/40 mt-1 uppercase tracking-widest">
                              {new Date(tx.date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(tx.id); }}
                            className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full bg-error-container/80 text-on-error-container flex items-center justify-center transition-all hover:bg-error hover:text-on-error"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </section>
          ))
        )}
      </div>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center z-50 lg:hidden"
      >
        <Plus className="w-7 h-7 stroke-[1.5px]" />
      </motion.button>

      {/* Transaction Detail Sheet */}
      <AnimatePresence>
        {selectedTx && (
          <TransactionSheet
            tx={selectedTx}
            onClose={() => setSelectedTx(null)}
            onDelete={() => handleDelete(selectedTx.id)}
          />
        )}
      </AnimatePresence>

      {/* Add Transaction Modal */}
      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
