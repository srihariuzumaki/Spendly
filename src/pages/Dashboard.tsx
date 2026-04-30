import { Eye, Bell, Send, ArrowDown, CreditCard, QrCode, Store, Briefcase, Car, Coffee } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

const stats = [
  { label: "Total Balance", value: "$12,480.00", subValues: [{ label: "Income", val: "$4,200.00" }, { label: "Expenses", val: "$1,830.00" }] },
];

const quickActions = [
  { icon: Send, label: "Send", color: "bg-secondary-container text-on-secondary-container" },
  { icon: ArrowDown, label: "Receive", color: "bg-tertiary-fixed text-on-tertiary-fixed" },
  { icon: CreditCard, label: "Pay", color: "bg-error-container text-on-error-container" },
  { icon: QrCode, label: "Scan", color: "bg-surface-container-high text-on-surface-variant" },
];

const transactions = [
  { id: 1, name: "Whole Foods Market", category: "Groceries", date: "Today", amount: "-$142.50", icon: Store, color: "bg-secondary-container text-on-secondary-container" },
  { id: 2, name: "Acme Corp Inc.", category: "Salary", date: "Yesterday", amount: "+$4,200.00", icon: Briefcase, color: "bg-tertiary-container text-on-tertiary-container" },
  { id: 3, name: "Uber Ride", category: "Transport", date: "Oct 24", amount: "-$24.00", icon: Car, color: "bg-surface-variant text-on-surface-variant" },
  { id: 4, name: "Kinfolk Coffee", category: "Dining", date: "Oct 23", amount: "-$6.50", icon: Coffee, color: "bg-surface-variant text-on-surface-variant" },
];

export default function Dashboard() {
  return (
    <div className="space-y-12">
      {/* Header Section */}
      <header className="flex justify-between items-end">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="font-serif text-4xl text-primary">Good morning, Aryan 👋</h1>
          <p className="font-sans text-sm text-on-surface-variant/80 mt-2">Here is a summary of your financial wellness today.</p>
        </motion.div>
        
        <div className="hidden lg:flex items-center gap-6">
          <button className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary transition-all">
            <Bell className="w-5 h-5 stroke-[1.5px]" />
          </button>
          <div className="w-12 h-12 rounded-full overflow-hidden border border-outline-variant shadow-sm">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNm6g1sbwH_PPlv8T84ud22k6Ly55YaMdetHqk3Fm4AVrjdb3NninRiMHKNBJSrgCadviQMUDG_9dDmdu5XoC6nIw7SDPcxOMePK5LJM7kn-x-bPU27uQNE9eWWKRMt3xzcZ0rRPAYSWoLHfkqPCsZUaMGwAAnkvHckC_E_cyd0vyZKyY8hy_xq7NmvZ8uTIH51BCQe54WskJJGDl4c6cUWUAWcqvyab25ISfh_vRimnNgNjT2P-OQNpSJ5xQAz9Gd7HiFrssZvwY" 
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Hero Balance Card */}
        <section className="lg:col-span-8 glass-card rounded-[32px] p-8 md:p-10 relative overflow-hidden flex flex-col justify-between min-h-[340px]">
          {/* Dusty Rose Accent line */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary-fixed/80 rounded-l-[32px]" />
          
          <div className="relative z-10">
            <p className="font-sans text-[10px] font-semibold text-on-surface-variant uppercase tracking-[0.2em] mb-6">Total Balance</p>
            <div className="flex items-center gap-4">
              <h2 className="font-serif text-6xl md:text-7xl text-primary tracking-tight">$12,480.00</h2>
              <button className="text-on-surface-variant/40 hover:text-primary transition-colors mt-2">
                <Eye className="w-6 h-6 stroke-[1.5px]" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 mt-12 relative z-10 border-t border-outline-variant/20 pt-8">
            <div>
              <p className="font-sans text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-[0.2em] mb-2">Income</p>
              <p className="font-serif text-3xl text-primary">$4,200.00</p>
            </div>
            <div>
              <p className="font-sans text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-[0.2em] mb-2">Expenses</p>
              <p className="font-serif text-3xl text-primary">$1,830.00</p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="lg:col-span-4 glass-card rounded-[32px] p-8 flex flex-col justify-center">
          <p className="font-sans text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-[0.2em] mb-8 text-center">Quick Actions</p>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <button key={action.label} className="flex flex-col items-center gap-4 group">
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
            <span className="font-sans text-[10px] text-outline px-2 py-0.5 border border-outline-variant/30 rounded-full uppercase tracking-widest">This Month</span>
          </div>
          
          <div className="flex flex-col items-center">
            {/* Donut Visualization Placeholder using CSS */}
            <div className="relative w-52 h-52 rounded-full flex items-center justify-center shadow-sm" style={{ background: 'conic-gradient(from 0deg, #fdd8cb 0% 35%, #cde9d5 35% 65%, #e5e2de 65% 100%)' }}>
              <div className="w-36 h-36 bg-background rounded-full flex flex-col items-center justify-center shadow-inner">
                <span className="font-sans text-[10px] font-medium text-on-surface-variant uppercase tracking-widest">Spent</span>
                <span className="font-serif text-3xl text-primary mt-1">$1,830</span>
              </div>
            </div>

            <div className="mt-10 w-full space-y-4 px-2">
              {[
                { label: "Housing", color: "bg-secondary-container", percentage: "35%" },
                { label: "Food", color: "bg-tertiary-fixed", percentage: "30%" },
                { label: "Transport", color: "bg-surface-variant", percentage: "35%" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-2.5 h-2.5 rounded-full", item.color)} />
                    <span className="font-sans text-sm font-medium text-primary">{item.label}</span>
                  </div>
                  <span className="font-sans text-xs font-medium text-on-surface-variant">{item.percentage}</span>
                </div>
              ))}
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
            {transactions.map((tx) => (
              <motion.div 
                key={tx.id}
                whileHover={{ x: 4 }}
                className="flex items-center justify-between py-5 border-b border-outline-variant/10 last:border-0 group cursor-pointer"
              >
                <div className="flex items-center gap-5">
                  <div className={cn("w-14 h-14 rounded-full flex items-center justify-center transition-all group-hover:scale-105", tx.color)}>
                    <tx.icon className="w-6 h-6 stroke-[1.5px]" />
                  </div>
                  <div>
                    <h3 className="font-sans text-sm font-semibold text-primary">{tx.name}</h3>
                    <p className="font-sans text-[10px] text-on-surface-variant/60 mt-1 uppercase tracking-widest">{tx.category} • {tx.date}</p>
                  </div>
                </div>
                <span className={cn("font-serif text-2xl tracking-tight text-primary")}>
                  {tx.amount}
                </span>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
