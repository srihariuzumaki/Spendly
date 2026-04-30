import { 
  BarChart3, 
  LayoutDashboard, 
  ListOrdered, 
  Target, 
  User, 
  HelpCircle, 
  LogOut, 
  Plus
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/src/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: ListOrdered, label: "Transactions", href: "/transactions" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Target, label: "Goals", href: "/goals" },
  { icon: User, label: "Settings", href: "/settings" },
];

const footerItems = [
  { icon: HelpCircle, label: "Help", href: "/help" },
  { icon: LogOut, label: "Sign Out", href: "/sign-out" },
];

export function Sidebar({ onAddClick }: { onAddClick: () => void }) {
  const location = useLocation();

  return (
    <nav className="hidden lg:flex flex-col h-screen w-72 fixed left-0 top-0 border-r border-outline-variant/30 bg-surface/70 backdrop-blur-3xl px-6 py-12 z-50">
      <div className="mb-8">
        <h1 className="font-serif italic text-3xl text-primary mb-2">Spendly</h1>
        <p className="font-sans text-[10px] tracking-widest uppercase text-on-surface-variant/60">
          Financial Wellness
        </p>
      </div>

      <button 
        onClick={onAddClick}
        className="w-full py-3 px-6 rounded-full bg-primary text-on-primary font-sans text-sm font-medium tracking-widest uppercase mb-6 flex justify-center items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
      >
        <Plus className="w-4 h-4" />
        Add Transaction
      </button>

      <div className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex items-center gap-4 px-6 py-3 rounded-full transition-all duration-300 font-sans text-xs tracking-widest uppercase",
                isActive 
                  ? "bg-primary text-on-primary shadow-lg" 
                  : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "stroke-[1.5px]" : "stroke-[1px]")} />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="pt-6 border-t border-outline-variant/30 space-y-2">
        {footerItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className="flex items-center gap-4 text-on-surface-variant hover:text-primary px-6 py-3 transition-all rounded-full font-sans text-xs tracking-widest uppercase"
          >
            <item.icon className="w-5 h-5 stroke-[1px]" />
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
