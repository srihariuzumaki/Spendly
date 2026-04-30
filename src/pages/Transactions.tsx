import { Search, SlidersHorizontal, Utensils, Train, Wallet, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

const filters = ["All", "Income", "Expenses", "Food", "Transport"];

const groups = [
  {
    date: "Today",
    transactions: [
      { id: 1, name: "Whole Foods Market", category: "Groceries", time: "10:42 AM", amount: "-$142.50", icon: Utensils, color: "bg-secondary-container text-on-secondary-container" },
      { id: 2, name: "Metro Transit", category: "Transportation", time: "08:15 AM", amount: "-$4.50", icon: Train, color: "bg-surface-variant text-on-surface-variant" },
    ]
  },
  {
    date: "Yesterday",
    transactions: [
      { id: 3, name: "Kinfolk Magazine", category: "Freelance Writing", time: "14:20 PM", amount: "+$1,250.00", icon: Wallet, color: "bg-tertiary-container text-on-tertiary-container" },
      { id: 4, name: "Everlane", category: "Clothing", time: "11:05 AM", amount: "-$85.00", icon: ShoppingBag, color: "bg-surface-container-high text-on-surface-variant" },
    ]
  }
];

export default function Transactions() {
  return (
    <div className="space-y-12">
      {/* Header Section */}
      <header className="flex justify-between items-center">
        <h1 className="font-serif text-5xl text-primary">Transactions</h1>
        <button className="w-12 h-12 flex items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest hover:bg-surface-container transition-all shadow-sm">
          <SlidersHorizontal className="w-5 h-5 text-on-surface stroke-[1.5px]" />
        </button>
      </header>

      {/* Search Bar */}
      <div className="bg-surface-container-low rounded-full px-8 py-4 flex items-center gap-4 border border-outline-variant/20 shadow-inner">
        <Search className="w-5 h-5 text-outline stroke-[1.5px]" />
        <input 
          className="bg-transparent border-none outline-none font-sans text-sm font-medium flex-1 text-on-surface placeholder:text-outline w-full focus:ring-0 p-0" 
          placeholder="Search by merchant, category, or amount..." 
          type="text"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-3">
        {filters.map((filter, i) => (
          <button 
            key={filter}
            className={cn(
              "px-8 py-3 rounded-full font-sans text-[10px] font-bold uppercase tracking-[0.2em] transition-all",
              i === 0 
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
        {groups.map((group) => (
          <section key={group.date}>
            <h2 className="font-sans text-[10px] font-bold text-outline-variant uppercase tracking-[0.3em] mb-6 pl-2">
              {group.date}
            </h2>
            <div className="space-y-4">
              {group.transactions.map((tx) => (
                <motion.div 
                  key={tx.id}
                  whileHover={{ y: -4 }}
                  className="flex items-center justify-between p-8 glass-card rounded-[24px] group cursor-pointer transition-all hover:bg-white/60"
                >
                  <div className="flex items-center gap-8">
                    <div className={cn("w-14 h-14 rounded-full flex items-center justify-center shadow-inner", tx.color)}>
                      <tx.icon className="w-6 h-6 stroke-[1.5px]" />
                    </div>
                    <div>
                      <h3 className="font-sans text-base font-semibold text-on-surface">{tx.name}</h3>
                      <span className="font-sans text-[11px] font-medium text-outline mt-1 block uppercase tracking-widest leading-none opacity-60">
                        {tx.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      "font-serif text-3xl tracking-tight",
                      tx.amount.startsWith('+') ? "text-tertiary" : "text-primary"
                    )}>
                      {tx.amount}
                    </div>
                    <div className="font-sans text-[10px] font-bold text-outline/40 mt-1 uppercase tracking-widest">{tx.time}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
