import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, BarChart, CartesianGrid } from "recharts";
import { cn } from "@/src/lib/utils";
import { useApp, TransactionCategory } from "@/src/context/AppContext";

type TabType = "Week" | "Month" | "Year";

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

const CATEGORY_BAR_COLORS: Partial<Record<TransactionCategory, string>> = {
  Housing: "bg-primary-fixed-dim",
  Food: "bg-secondary-container",
  Groceries: "bg-secondary-container",
  Transit: "bg-surface-variant",
  Shopping: "bg-surface-container-high",
  Entertainment: "bg-tertiary-fixed",
  Bills: "bg-error-container",
  Healthcare: "bg-outline-variant",
  Travel: "bg-tertiary-container",
  Other: "bg-surface-tint/30",
};

const INSIGHTS = [
  "Your biggest spending category this period is {topCat} at {topPct}% of total expenses.",
  "You spent {totalSpent} this period — {avgDay} per day on average.",
  "Your income exceeds your expenses by {surplus}. Great job staying in the black!",
  "Highest single-day spend was {highestDay} — keep an eye on {topCat} spending.",
];

export default function Analytics() {
  const { transactions, formatCurrency } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>("Month");
  const [offset, setOffset] = useState(0); // months or weeks ago

  // ── Date window ──────────────────────────────────────────────────────────────
  const { windowLabel, windowStart, windowEnd } = useMemo(() => {
    const now = new Date();
    if (activeTab === "Month") {
      const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      return {
        windowLabel: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`,
        windowStart: new Date(d.getFullYear(), d.getMonth(), 1),
        windowEnd: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59),
      };
    } else if (activeTab === "Week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay() - offset * 7);
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59);
      const label = `${startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
      return { windowLabel: label, windowStart: startOfWeek, windowEnd: endOfWeek };
    } else {
      // Year
      const year = now.getFullYear() - offset;
      return {
        windowLabel: String(year),
        windowStart: new Date(year, 0, 1),
        windowEnd: new Date(year, 11, 31, 23, 59, 59),
      };
    }
  }, [activeTab, offset]);

  // ── Filtered transactions ────────────────────────────────────────────────────
  const windowTxs = useMemo(
    () => transactions.filter((t) => {
      const d = new Date(t.date);
      return d >= windowStart && d <= windowEnd;
    }),
    [transactions, windowStart, windowEnd]
  );

  const expenseTxs = useMemo(() => windowTxs.filter((t) => t.type === "expense"), [windowTxs]);
  const incomeTxs = useMemo(() => windowTxs.filter((t) => t.type === "income"), [windowTxs]);

  const totalSpent = useMemo(() => expenseTxs.reduce((s, t) => s + t.amount, 0), [expenseTxs]);
  const totalIncome = useMemo(() => incomeTxs.reduce((s, t) => s + t.amount, 0), [incomeTxs]);

  // ── Chart data ───────────────────────────────────────────────────────────────
  const chartData = useMemo(() => {
    if (activeTab === "Month") {
      const daysInMonth = windowEnd.getDate();
      const buckets: Record<number, number> = {};
      for (let i = 1; i <= daysInMonth; i++) buckets[i] = 0;
      for (const tx of expenseTxs) {
        const day = new Date(tx.date).getDate();
        buckets[day] = (buckets[day] ?? 0) + tx.amount;
      }
      return Object.entries(buckets)
        .filter((_, i) => i % 3 === 0 || i === 0) // every 3rd day for readability
        .map(([day, val]) => ({ name: `${MONTH_NAMES[windowStart.getMonth()].slice(0, 3)} ${day}`, value: Math.round(val) }));
    } else if (activeTab === "Week") {
      const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const buckets: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      for (const tx of expenseTxs) {
        const dow = new Date(tx.date).getDay();
        buckets[dow] = (buckets[dow] ?? 0) + tx.amount;
      }
      return Object.entries(buckets).map(([dow, val]) => ({ name: DAYS[Number(dow)], value: Math.round(val) }));
    } else {
      // Year
      const buckets: Record<number, number> = {};
      for (let i = 0; i < 12; i++) buckets[i] = 0;
      for (const tx of expenseTxs) {
        const m = new Date(tx.date).getMonth();
        buckets[m] = (buckets[m] ?? 0) + tx.amount;
      }
      return Object.entries(buckets).map(([m, val]) => ({ name: MONTH_NAMES[Number(m)].slice(0, 3), value: Math.round(val) }));
    }
  }, [activeTab, expenseTxs, windowStart, windowEnd]);

  // ── Summary stats ────────────────────────────────────────────────────────────
  const daysInWindow = useMemo(() => {
    const ms = windowEnd.getTime() - windowStart.getTime();
    return Math.max(1, Math.round(ms / 86400000));
  }, [windowStart, windowEnd]);

  const avgPerDay = totalSpent / daysInWindow;

  const highestDay = useMemo(() => {
    const byDay: Record<string, number> = {};
    for (const tx of expenseTxs) {
      const d = new Date(tx.date).toDateString();
      byDay[d] = (byDay[d] ?? 0) + tx.amount;
    }
    const sorted = Object.entries(byDay).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) return { label: "—", amount: 0 };
    const [dateStr, amt] = sorted[0];
    return {
      label: new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      amount: amt,
    };
  }, [expenseTxs]);

  // ── Category breakdown ───────────────────────────────────────────────────────
  const categories = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const tx of expenseTxs) totals[tx.category] = (totals[tx.category] ?? 0) + tx.amount;
    const total = totalSpent || 1;
    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .map(([name, val]) => ({
        name,
        value: val,
        percentage: Math.round((val / total) * 100),
        color: CATEGORY_BAR_COLORS[name as TransactionCategory] ?? "bg-surface-variant",
      }));
  }, [expenseTxs, totalSpent]);

  // ── AI Insight ───────────────────────────────────────────────────────────────
  const insight = useMemo(() => {
    if (categories.length === 0) return "No expenses recorded for this period. Start tracking to get insights!";
    const topCat = categories[0];
    const surplus = totalIncome - totalSpent;
    const template = INSIGHTS[offset % INSIGHTS.length];
    return template
      .replace("{topCat}", topCat.name)
      .replace("{topPct}", String(topCat.percentage))
      .replace("{totalSpent}", formatCurrency(totalSpent))
      .replace("{avgDay}", formatCurrency(avgPerDay))
      .replace("{surplus}", formatCurrency(Math.abs(surplus)))
      .replace("{highestDay}", formatCurrency(highestDay.amount));
  }, [categories, totalIncome, totalSpent, avgPerDay, highestDay, offset]);

  const isTrendingDown = totalSpent < (offset > 0 ? totalSpent * 1.1 : totalSpent * 0.9);

  return (
    <div className="space-y-12 pb-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <h1 className="font-serif text-6xl text-primary">Analytics</h1>
        <div className="flex items-center gap-4 bg-surface-container rounded-full px-6 py-3 shadow-inner border border-outline-variant/10">
          <button
            onClick={() => setOffset((p) => p + 1)}
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-5 h-5 stroke-[1.5px]" />
          </button>
          <span className="font-sans text-[10px] font-bold text-on-surface w-40 text-center uppercase tracking-[0.2em]">
            {windowLabel}
          </span>
          <button
            onClick={() => setOffset((p) => Math.max(0, p - 1))}
            className={cn("transition-colors", offset === 0 ? "text-outline-variant cursor-not-allowed" : "text-on-surface-variant hover:text-on-surface")}
            disabled={offset === 0}
          >
            <ChevronRight className="w-5 h-5 stroke-[1.5px]" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Main Chart Area */}
        <div className="lg:col-span-8 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-[32px] p-8 md:p-10"
          >
            {/* Tab Switcher */}
            <div className="flex justify-center mb-10">
              <div className="flex bg-surface-container-high rounded-full p-1.5 border border-outline-variant/20 shadow-inner">
                {(["Week", "Month", "Year"] as TabType[]).map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => { setActiveTab(tab); setOffset(0); }}
                    className={cn(
                      "px-8 py-2.5 rounded-full font-sans text-[10px] font-bold uppercase tracking-[0.2em] transition-all",
                      activeTab === tab
                        ? "bg-secondary-container text-on-secondary-container shadow-sm" 
                        : "text-on-surface-variant hover:text-on-surface"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[300px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fdd8cb" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#fdd8cb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#7e756f', fontWeight: '500', fontFamily: 'Inter' }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    formatter={(v: number) => [formatCurrency(v), "Spent"]}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.05)', backgroundColor: 'rgba(255,255,255,0.9)' }}
                    itemStyle={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 'bold' }}
                    labelStyle={{ fontFamily: 'Instrument Serif', fontSize: '18px', marginBottom: '4px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#74584f" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Total Spent", value: formatCurrency(totalSpent), sub: windowLabel },
              { label: "Avg / Day", value: formatCurrency(avgPerDay), sub: `over ${daysInWindow} days` },
              { label: "Highest Day", value: formatCurrency(highestDay.amount), sub: highestDay.label },
            ].map((stat) => (
              <motion.div 
                key={stat.label}
                whileHover={{ y: -4 }}
                className="glass-card rounded-[24px] p-8 flex flex-col justify-center items-center text-center cursor-default transition-all"
              >
                <span className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-3">{stat.label}</span>
                <span className="font-serif text-4xl text-primary">{stat.value}</span>
                {stat.sub && (
                  <span className="font-sans text-[10px] font-medium text-on-surface-variant/60 mt-2 uppercase tracking-widest">{stat.sub}</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Categories & Insights */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* AI Insights Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-[24px] p-8 border border-secondary/20 relative group overflow-hidden"
          >
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-secondary-container/30 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="flex items-start gap-5 relative z-10">
              <div className="bg-secondary-container text-on-secondary-container p-3 rounded-[18px] shadow-sm shrink-0">
                {isTrendingDown
                  ? <TrendingDown className="w-5 h-5" />
                  : <TrendingUp className="w-5 h-5" />
                }
              </div>
              <div className="space-y-3">
                <h3 className="font-sans text-base font-bold text-primary">
                  {categories.length > 0 ? `${categories[0]?.name} leads spending` : "Start tracking!"}
                </h3>
                <p className="font-sans text-sm text-on-surface-variant/80 leading-relaxed">
                  {insight}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Categories Card */}
          <motion.div 
            className="glass-card rounded-[32px] p-8 flex flex-col gap-8 flex-1"
          >
            <h3 className="font-serif text-2xl text-on-surface border-b border-outline-variant/10 pb-6">
              Spending by Category
            </h3>
            {categories.length === 0 ? (
              <p className="font-sans text-[10px] text-on-surface-variant/60 text-center uppercase tracking-widest py-8">
                No expenses for this period
              </p>
            ) : (
              <div className="space-y-8 flex-1">
                {categories.slice(0, 5).map((cat) => (
                  <div key={cat.name} className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <span className="font-sans text-[10px] font-bold text-on-surface uppercase tracking-[0.2em]">{cat.name}</span>
                      <span className="font-serif text-xl text-on-surface">{formatCurrency(cat.value)}</span>
                    </div>
                    <div className="w-full bg-surface-container-highest/20 h-1.5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={cn("h-full rounded-full", cat.color)} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {categories.length > 5 && (
              <button className="group mt-auto pt-8 font-sans text-[10px] font-bold text-on-surface-variant hover:text-primary flex justify-center items-center gap-3 transition-all w-full border-t border-outline-variant/10 uppercase tracking-[0.2em]">
                {categories.length - 5} more categories
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
