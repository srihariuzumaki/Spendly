import React, { useState, useMemo, useEffect } from "react";
import { Eye, EyeOff, Bell, Plus, Camera, Target, Download, Users, Store, Briefcase, Car, Coffee, Utensils, ShoppingBag, Home, Zap, Music, Heart, Plane, MoreHorizontal, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { useApp, formatDate, TransactionCategory } from "@/src/context/AppContext";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { SplitExpenseModal } from "@/src/components/SplitExpenseModal";
import { ExportModal } from "@/src/components/ExportModal";

// Icon map for categories
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

function getTimeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const { profile, transactions, totalBalance, thisMonthIncome, thisMonthExpenses, formatCurrency, theme, toggleTheme } = useApp();
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [clearedNotifs, setClearedNotifs] = useState(false);
  const [hiddenNotifList, setHiddenNotifList] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Recent 4 transactions
  const recentTxs = useMemo(() => transactions.slice(0, 4), [transactions]);

  // Reset notification state if a new transaction arrives
  useEffect(() => {
    const topId = recentTxs[0]?.id;
    if (topId) {
      setClearedNotifs(localStorage.getItem("spendly_cleared_tx") === topId);
      setHiddenNotifList(localStorage.getItem("spendly_hidden_tx") === topId);
    }
  }, [recentTxs]);

  const handleMarkAsRead = () => {
    setClearedNotifs(true);
    setNotifOpen(false);
    if (recentTxs.length > 0) {
      localStorage.setItem("spendly_cleared_tx", recentTxs[0].id);
    }
  };

  const handleClearNotifs = () => {
    setClearedNotifs(true);
    setHiddenNotifList(true);
    if (recentTxs.length > 0) {
      localStorage.setItem("spendly_cleared_tx", recentTxs[0].id);
      localStorage.setItem("spendly_hidden_tx", recentTxs[0].id);
    }
  };

  // Spending by category (this month)
  const categoryBreakdown = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const totals: Record<string, number> = {};
    for (const tx of expenses) {
      totals[tx.category] = (totals[tx.category] ?? 0) + tx.amount;
    }
    const total = Object.values(totals).reduce((s, v) => s + v, 0);
    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat, val]) => ({
        label: cat,
        value: val,
        color: CATEGORY_COLORS[cat as TransactionCategory]?.split(" ")[0] ?? "bg-surface-variant",
        percentage: total > 0 ? Math.round((val / total) * 100) : 0,
      }));
  }, [transactions]);

  // Donut gradient from top 3
  const donutColors = [
    "#fdd8cb", // secondary-container
    "#cde9d5", // tertiary-fixed
    "#e5e2de", // surface-variant
  ];
  const donutGradient = useMemo(() => {
    if (categoryBreakdown.length === 0) return "conic-gradient(from 0deg, #e5e2de 0% 100%)";
    let cumulative = 0;
    const stops = categoryBreakdown.map((c, i) => {
      const start = cumulative;
      cumulative += c.percentage;
      return `${donutColors[i % donutColors.length]} ${start}% ${cumulative}%`;
    });
    // Fill remainder
    if (cumulative < 100) stops.push(`#e5e2de ${cumulative}% 100%`);
    return `conic-gradient(from 0deg, ${stops.join(", ")})`;
  }, [categoryBreakdown]);

  const quickActions = [
    {
      icon: Plus,
      label: "Add Entry",
      color: "bg-secondary-container text-on-secondary-container",
      onClick: () => alert("Use the sidebar/nav to add a transaction!"),
    },
    {
      icon: Camera,
      label: "Scan Receipt",
      color: "bg-tertiary-fixed text-on-tertiary-fixed",
      onClick: () => alert("AI Receipt Scanner — coming soon!"),
    },
    {
      icon: Target,
      label: "Set Budget",
      color: "bg-error-container text-on-error-container",
      onClick: () => alert("Category Budgets — coming soon!"),
    },
    {
      icon: Download,
      label: "Export",
      color: "bg-surface-container-high text-on-surface-variant",
      onClick: () => setIsExportModalOpen(true),
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <header className="flex justify-between items-end">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="font-serif text-4xl text-primary">{getTimeGreeting()}, {profile.name} </h1>
          <p className="font-sans text-sm text-on-surface-variant/80 mt-2">Here is a summary of your financial wellness today.</p>
        </motion.div>
        
        <div className="hidden lg:flex items-center gap-6">
          {/* Theme Switch */}
          <button
            onClick={toggleTheme}
            className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary transition-all relative overflow-hidden group space-x-1"
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

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen((p) => !p)}
              className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary transition-all"
            >
              <Bell className="w-5 h-5 stroke-[1.5px]" />
              {recentTxs.length > 0 && !clearedNotifs && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-on-error text-[8px] font-bold rounded-full flex items-center justify-center">
                  {Math.min(recentTxs.length, 9)}
                </span>
              )}
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 top-14 w-72 bg-surface/95 backdrop-blur-2xl border border-outline-variant/30 rounded-[20px] shadow-2xl p-4 z-50"
                >
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">Recent Activity</p>
                    {!clearedNotifs && recentTxs.length > 0 && (
                      <button 
                        onClick={handleMarkAsRead}
                        className="font-sans text-[10px] font-semibold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                  
                  {(!hiddenNotifList && recentTxs.length > 0) ? (
                    <>
                      {recentTxs.slice(0, 3).map((tx) => {
                        const Icon = CATEGORY_ICONS[tx.category] ?? Store;
                        return (
                          <div key={tx.id} className="flex items-center gap-3 py-2 border-b border-outline-variant/10 last:border-0">
                            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", CATEGORY_COLORS[tx.category])}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-sans text-xs font-semibold text-on-surface truncate">{tx.merchant}</p>
                              <p className="font-sans text-[9px] text-on-surface-variant/60 uppercase tracking-widest">{formatDate(tx.date)}</p>
                            </div>
                            <span className={cn("font-serif text-sm", tx.type === "income" ? "text-tertiary" : "text-primary")}>
                              {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                            </span>
                          </div>
                        );
                      })}
                      <div className="flex gap-2 mt-2 pt-3 border-t border-outline-variant/10">
                        <button 
                          onClick={handleClearNotifs}
                          className="flex-1 font-sans text-[10px] text-error hover:text-error/80 transition-colors uppercase tracking-widest text-center"
                        >
                          Clear
                        </button>
                        <button className="flex-1 font-sans text-[10px] text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest text-center">
                          <Link to="/transactions" onClick={() => setNotifOpen(false)}>View all</Link>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="py-6 text-center">
                      <p className="font-sans text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider">No new notifications</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/settings" className="w-12 h-12 rounded-full border border-outline-variant shadow-sm flex items-center justify-center bg-surface text-2xl hover:border-primary overflow-hidden transition-all">
            {profile.avatar && (profile.avatar.startsWith('data:') || profile.avatar.startsWith('http')) ? (
              <img src={profile.avatar} alt="User avatar" className="w-full h-full object-cover" />
            ) : (
              profile.avatar || "👤"
            )}
          </Link>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Hero Balance Card */}
        <section className="lg:col-span-8 glass-card rounded-[32px] p-8 md:p-10 relative overflow-hidden flex flex-col justify-between min-h-[340px]">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary-fixed/80 rounded-l-[32px]" />
          
          <div className="relative z-10">
            <p className="font-sans text-[10px] font-semibold text-on-surface-variant uppercase tracking-[0.2em] mb-6">Total Balance</p>
            <div className="flex items-center gap-4">
              <h2 className="font-serif text-6xl md:text-7xl text-primary tracking-tight">
                {balanceHidden ? "••••••" : formatCurrency(totalBalance)}
              </h2>
              <button
                onClick={() => setBalanceHidden((p) => !p)}
                className="text-on-surface-variant/40 hover:text-primary transition-colors mt-2"
              >
                {balanceHidden
                  ? <EyeOff className="w-6 h-6 stroke-[1.5px]" />
                  : <Eye className="w-6 h-6 stroke-[1.5px]" />
                }
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 mt-12 relative z-10 border-t border-outline-variant/20 pt-8">
            <div>
              <p className="font-sans text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-[0.2em] mb-2">Income</p>
              <p className="font-serif text-3xl text-primary">
                {balanceHidden ? "••••" : formatCurrency(thisMonthIncome)}
              </p>
              <p className="font-sans text-[9px] text-on-surface-variant/40 uppercase tracking-widest mt-1">This month</p>
            </div>
            <div>
              <p className="font-sans text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-[0.2em] mb-2">Expenses</p>
              <p className="font-serif text-3xl text-primary">
                {balanceHidden ? "••••" : formatCurrency(thisMonthExpenses)}
              </p>
              <p className="font-sans text-[9px] text-on-surface-variant/40 uppercase tracking-widest mt-1">This month</p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="lg:col-span-4 glass-card rounded-[32px] p-8 flex flex-col justify-center">
          <p className="font-sans text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-[0.2em] mb-8 text-center">Quick Actions</p>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <button key={action.label} onClick={action.onClick} className="flex flex-col items-center gap-4 group">
                <div className={cn("w-16 h-16 rounded-full flex items-center justify-center transition-all group-hover:scale-105 active:scale-95 group-hover:shadow-md", action.color)}>
                  <action.icon className="w-6 h-6 stroke-[1.5px]" />
                </div>
                <span className="font-sans text-xs font-semibold text-primary">{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Spending Analysis */}
        <section className="lg:col-span-5 glass-card rounded-[32px] p-8">
          <div className="flex justify-between items-center mb-8">
            <p className="font-sans text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-[0.2em]">Spending</p>
            <span className="font-sans text-[10px] text-outline px-2 py-0.5 border border-outline-variant/30 rounded-full uppercase tracking-widest">All Time</span>
          </div>
          
          <div className="flex flex-col items-center">
            {/* Live Chart */}
            <div className="relative w-52 h-52 flex items-center justify-center">
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
                <span className="font-sans text-[10px] font-medium text-on-surface-variant uppercase tracking-widest">Spent</span>
                <span className="font-serif text-3xl text-primary mt-1">
                  {formatCurrency(
                    transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0)
                  ).split(".")[0]}
                </span>
              </div>
              
              <div className="w-full h-full z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryBreakdown.length > 0 ? categoryBreakdown : [{ label: "No Expenses", value: 1, isEmpty: true }]}
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="label"
                      stroke="none"
                    >
                      {categoryBreakdown.length > 0 ? (
                        categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={donutColors[index % donutColors.length]} />
                        ))
                      ) : (
                        <Cell fill="#e5e2de" />
                      )}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-surface/90 backdrop-blur-md px-4 py-3 rounded-[16px] shadow-lg border border-outline-variant/30 flex flex-col gap-1">
                              <span className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                                {payload[0].name || payload[0].payload.label}
                              </span>
                              <span className="font-serif text-lg text-primary">
                                {payload[0].payload.isEmpty ? formatCurrency(0) : formatCurrency(payload[0].value as number)}
                              </span>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-10 w-full space-y-4 px-2">
              {categoryBreakdown.map((item, i) => (
                <div key={item.label} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: donutColors[i % donutColors.length] }} />
                    <span className="font-sans text-sm font-medium text-primary">{item.label}</span>
                  </div>
                  <span className="font-sans text-xs font-medium text-on-surface-variant">{item.percentage}%</span>
                </div>
              ))}
              {categoryBreakdown.length === 0 && (
                <p className="font-sans text-[10px] text-on-surface-variant/60 text-center uppercase tracking-widest">No transactions yet</p>
              )}
            </div>
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="lg:col-span-7 glass-card rounded-[32px] p-8">
          <div className="flex justify-between items-center mb-8">
            <p className="font-sans text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-[0.2em]">Recent Transactions</p>
            <Link to="/transactions" className="font-sans text-[10px] font-bold text-primary hover:underline underline-offset-4 uppercase tracking-[0.2em]">View All</Link>
          </div>
          
          <div className="space-y-2">
            {recentTxs.length === 0 ? (
              <p className="font-sans text-sm text-on-surface-variant/60 text-center py-8 uppercase tracking-widest">No transactions yet. Add your first one!</p>
            ) : (
              recentTxs.map((tx) => {
                const Icon = CATEGORY_ICONS[tx.category] ?? Store;
                const colClass = CATEGORY_COLORS[tx.category] ?? "bg-surface-variant text-on-surface-variant";
                return (
                  <motion.div 
                    key={tx.id}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between py-5 border-b border-outline-variant/10 last:border-0 group cursor-pointer"
                  >
                    <div className="flex items-center gap-5">
                      <div className={cn("w-14 h-14 rounded-full flex items-center justify-center transition-all group-hover:scale-105", colClass)}>
                        <Icon className="w-6 h-6 stroke-[1.5px]" />
                      </div>
                      <div>
                        <h3 className="font-sans text-sm font-semibold text-primary">{tx.merchant}</h3>
                        <p className="font-sans text-[10px] text-on-surface-variant/60 mt-1 uppercase tracking-widest">{tx.category} • {formatDate(tx.date)}</p>
                      </div>
                    </div>
                    <span className={cn("font-serif text-2xl tracking-tight", tx.type === "income" ? "text-tertiary" : "text-primary")}>
                      {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                    </span>
                  </motion.div>
                );
              })
            )}
          </div>
        </section>
      </div>

      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </div>
  );
}
