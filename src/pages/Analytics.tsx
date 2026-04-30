import { ChevronLeft, ChevronRight, BarChart3, TrendingUp, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { cn } from "@/src/lib/utils";

const chartData = [
  { name: "Oct 1", value: 400 },
  { name: "Oct 4", value: 300 },
  { name: "Oct 8", value: 500 },
  { name: "Oct 12", value: 450 },
  { name: "Oct 15", value: 650 },
  { name: "Oct 18", value: 550 },
  { name: "Oct 22", value: 800 },
  { name: "Oct 26", value: 700 },
  { name: "Oct 31", value: 850 },
];

const summaryStats = [
  { label: "Total Spent", value: "$4,250.00" },
  { label: "Avg / Day", value: "$137.09" },
  { label: "Highest Day", value: "$450.00", sub: "Oct 12 (Dining)" },
];

const categories = [
  { name: "Housing", value: 2100, percentage: 45, color: "bg-primary-fixed-dim" },
  { name: "Dining", value: 850, percentage: 20, color: "bg-secondary-container" },
  { name: "Groceries", value: 600, percentage: 15, color: "bg-tertiary-fixed-dim" },
  { name: "Transportation", value: 400, percentage: 10, color: "bg-outline-variant" },
  { name: "Entertainment", value: 300, percentage: 8, color: "bg-surface-tint/30" },
];

export default function Analytics() {
  return (
    <div className="space-y-12 pb-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <h1 className="font-serif text-6xl text-primary">Analytics</h1>
        <div className="flex items-center gap-4 bg-surface-container rounded-full px-6 py-3 shadow-inner border border-outline-variant/10">
          <button className="text-on-surface-variant hover:text-primary transition-colors">
            <ChevronLeft className="w-5 h-5 stroke-[1.5px]" />
          </button>
          <span className="font-sans text-[10px] font-bold text-on-surface w-32 text-center uppercase tracking-[0.2em]">October 2024</span>
          <button className="text-on-surface-variant hover:text-on-surface transition-colors">
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
                {["Week", "Month", "Year"].map((tab, i) => (
                  <button 
                    key={tab}
                    className={cn(
                      "px-8 py-2.5 rounded-full font-sans text-[10px] font-bold uppercase tracking-[0.2em] transition-all",
                      i === 1 
                        ? "bg-secondary-container text-on-secondary-container shadow-sm" 
                        : "text-on-surface-variant hover:text-on-surface"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[340px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fdd8cb" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#fdd8cb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#7e756f', fontWeight: '500', fontFamily: 'Inter' }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
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
            {summaryStats.map((stat) => (
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
              <div className="bg-secondary-container text-on-secondary-container p-3 rounded-[18px] shadow-sm">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="space-y-3">
                <h3 className="font-sans text-lg font-bold text-primary">Dining out is trending up</h3>
                <p className="font-sans text-sm text-on-surface-variant/80 leading-relaxed">
                  You've spent 15% more on Dining this month compared to September. Consider adjusting your weekly budget to stay on track.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Categories Card */}
          <motion.div 
            className="glass-card rounded-[32px] p-8 flex flex-col gap-8 flex-1"
          >
            <h3 className="font-serif text-2xl text-on-surface border-b border-outline-variant/10 pb-6">Spending by Category</h3>
            <div className="space-y-8 flex-1">
              {categories.map((cat) => (
                <div key={cat.name} className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <span className="font-sans text-[10px] font-bold text-on-surface uppercase tracking-[0.2em]">{cat.name}</span>
                    <span className="font-serif text-xl text-on-surface">${cat.value.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-surface-container-highest/20 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.percentage}%` }}
                      className={cn("h-full rounded-full", cat.color)} 
                    />
                  </div>
                </div>
              ))}
            </div>
            <button className="group mt-auto pt-8 font-sans text-[10px] font-bold text-on-surface-variant hover:text-primary flex justify-center items-center gap-3 transition-all w-full border-t border-outline-variant/10 uppercase tracking-[0.2em]">
              View All Categories
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
