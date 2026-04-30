import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

const goals = [
  { id: 1, name: "Euro Summer 2025", emoji: "✈️", current: 3250, target: 5000, percentage: 65 },
  { id: 2, name: "Down Payment", emoji: "🏠", current: 11000, target: 50000, percentage: 22 },
  { id: 3, name: "Emergency Fund", emoji: "🌿", current: 8500, target: 10000, percentage: 85 },
];

export default function Goals() {
  return (
    <div className="space-y-12">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="font-serif text-5xl text-primary">Your Goals</h1>
          <p className="font-sans text-sm text-on-surface-variant/80 mt-2 max-w-md">Intentional milestones for a well-lived life. Cultivate your savings with purpose.</p>
        </motion.div>
        
        <button className="inline-flex items-center gap-3 px-8 py-4 rounded-[20px] border border-outline-variant bg-surface-container-lowest text-on-background font-sans text-xs font-bold uppercase tracking-[0.2em] hover:bg-surface-container transition-all active:scale-95 shadow-sm overflow-hidden group">
          <div className="bg-primary text-on-primary p-1 rounded-full group-hover:rotate-90 transition-transform">
            <Plus className="w-3 h-3 stroke-[3px]" />
          </div>
          New Goal
        </button>
      </header>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
        {goals.map((goal) => (
          <motion.article 
            key={goal.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            className="group glass-card rounded-[32px] p-10 flex flex-col justify-between min-h-[300px] cursor-pointer transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-10">
              <span className="text-4xl bg-surface-container-lowest w-16 h-16 rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                {goal.emoji}
              </span>
              <div className="bg-tertiary-fixed text-on-tertiary-fixed font-sans text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                {goal.percentage}%
              </div>
            </div>

            <div className="mt-auto">
              <h3 className="font-sans text-lg font-bold text-primary mb-2">{goal.name}</h3>
              <div className="flex justify-between items-baseline mb-6">
                <span className="font-serif text-3xl tracking-tight text-on-background">
                  ${goal.current.toLocaleString()}
                </span>
                <span className="font-sans text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.1em]">
                  of ${goal.target.toLocaleString()}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-surface-container-highest/30 rounded-full h-1.5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${goal.percentage}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="bg-primary h-full rounded-full" 
                />
              </div>
            </div>
          </motion.article>
        ))}

        {/* Add New Goal Card */}
        <button className="rounded-[32px] p-10 flex flex-col items-center justify-center min-h-[300px] border border-dashed border-outline-variant/50 bg-transparent hover:bg-surface-container-lowest/50 transition-all duration-500 group cursor-pointer active:scale-95">
          <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-on-primary transition-all duration-500 shadow-sm">
            <Plus className="w-8 h-8 stroke-[1px]" />
          </div>
          <span className="font-sans text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-[0.3em] group-hover:text-primary transition-colors">
            Create New Goal
          </span>
        </button>
      </div>
    </div>
  );
}
