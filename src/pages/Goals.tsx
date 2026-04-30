import { useState } from "react";
import { Plus, X, Check, Trash2, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { useApp, formatDate, getGoalProgress, getGoalCurrent, Goal } from "@/src/context/AppContext";

// ─── Emoji Picker ──────────────────────────────────────────────────────────────
const EMOJIS = ["✈️", "🏠", "🌿", "🚗", "💻", "🎓", "🏖️", "💍", "🎸", "📱", "🐶", "💎", "🌍", "🤝", "🏋️", "🍕"];

// ─── Add Goal Modal ────────────────────────────────────────────────────────────
function AddGoalModal({ onClose }: { onClose: () => void }) {
  const { addGoal } = useApp();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("✈️");
  const [target, setTarget] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Goal name is required";
    const t = parseFloat(target);
    if (!target || isNaN(t) || t <= 0) errs.target = "Enter a valid target amount";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    addGoal({ name: name.trim(), emoji, target: t });
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 700);
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 bg-surface-variant/40 backdrop-blur-sm z-[60]" />
      <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center pointer-events-none p-0 md:p-6">
        <motion.div
          initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="w-full max-w-md bg-surface/95 backdrop-blur-[32px] rounded-t-[32px] md:rounded-[32px] border-t md:border border-white/40 shadow-2xl pointer-events-auto p-8 md:p-10"
        >
          <header className="flex justify-between items-center mb-8">
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
              <X className="w-6 h-6 stroke-[1.5px]" />
            </button>
            <h2 className="font-sans text-sm font-medium text-on-surface uppercase tracking-[0.2em]">New Goal</h2>
            <div className="w-10 h-10" />
          </header>

          <div className="space-y-8">
            {/* Emoji Picker */}
            <div>
              <label className="font-sans text-[10px] font-semibold text-on-surface-variant uppercase tracking-[0.2em] block mb-3">Choose an Icon</label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEmoji(e)}
                    className={cn(
                      "w-12 h-12 rounded-[14px] text-2xl flex items-center justify-center transition-all",
                      emoji === e ? "bg-secondary-container shadow-inner scale-110" : "bg-surface-container hover:bg-surface-container-high"
                    )}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="relative group">
              <label className="font-sans text-[10px] font-semibold text-on-surface-variant uppercase tracking-[0.1em] block mb-2 group-focus-within:text-on-surface transition-colors">
                Goal Name
              </label>
              <input
                className={cn(
                  "w-full bg-transparent border-b pb-3 font-sans text-lg text-on-surface focus:outline-none transition-colors placeholder:text-outline-variant/60",
                  errors.name ? "border-error" : "border-outline-variant/40 focus:border-on-surface"
                )}
                placeholder="e.g. Euro Summer 2025"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
              />
              {errors.name && <p className="font-sans text-[10px] text-error mt-1 uppercase tracking-widest">{errors.name}</p>}
            </div>

            {/* Target */}
            <div className="relative group">
              <label className="font-sans text-[10px] font-semibold text-on-surface-variant uppercase tracking-[0.1em] block mb-2 group-focus-within:text-on-surface transition-colors">
                Target Amount
              </label>
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 font-serif text-2xl text-on-surface-variant/30">$</span>
                <input
                  className={cn(
                    "w-full bg-transparent border-b pb-3 pl-7 font-sans text-lg text-on-surface focus:outline-none transition-colors placeholder:text-outline-variant/60",
                    errors.target ? "border-error" : "border-outline-variant/40 focus:border-on-surface"
                  )}
                  placeholder="5,000"
                  type="text"
                  inputMode="decimal"
                  value={target}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9.]/g, "");
                    setTarget(v);
                    setErrors((p) => ({ ...p, target: "" }));
                  }}
                />
              </div>
              {errors.target && <p className="font-sans text-[10px] text-error mt-1 uppercase tracking-widest">{errors.target}</p>}
            </div>
          </div>

          <motion.button
            onClick={handleSave}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full py-4 px-8 rounded-full font-sans text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 mt-10",
              saved ? "bg-tertiary text-on-tertiary" : "bg-primary text-on-primary hover:opacity-90"
            )}
          >
            {saved ? <><Check className="w-4 h-4 stroke-[2px]" /> Created!</> : "Create Goal"}
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}

// ─── Goal Detail Sheet ─────────────────────────────────────────────────────────
function GoalDetailSheet({ goal, onClose }: { goal: Goal; onClose: () => void }) {
  const { addGoalContribution, deleteGoal, formatCurrency } = useApp();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [contributed, setContributed] = useState(false);
  const [error, setError] = useState("");

  const current = getGoalCurrent(goal);
  const progress = getGoalProgress(goal);
  const remaining = goal.target - current;

  const handleContribute = () => {
    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0) { setError("Enter a valid amount"); return; }
    addGoalContribution(goal.id, {
      amount: amt,
      date: new Date().toISOString(),
      note: note.trim() || "Contribution",
    });
    setContributed(true);
    setAmount("");
    setNote("");
    setError("");
    setTimeout(() => setContributed(false), 1500);
  };

  const handleDelete = () => {
    deleteGoal(goal.id);
    onClose();
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 bg-surface-variant/40 backdrop-blur-sm z-[60]" />
      <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center pointer-events-none p-0 md:p-6">
        <motion.div
          initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="w-full max-w-md bg-surface/95 backdrop-blur-[32px] rounded-t-[32px] md:rounded-[32px] border-t md:border border-white/40 shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto no-scrollbar"
        >
          <div className="p-8 md:p-10">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{goal.emoji}</span>
                <div>
                  <h2 className="font-sans text-xl font-bold text-on-surface">{goal.name}</h2>
                  <p className="font-sans text-[10px] text-on-surface-variant/60 uppercase tracking-widest mt-0.5">
                    {progress}% complete
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress */}
            <div className="glass-card rounded-[20px] p-6 mb-8 space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="font-serif text-4xl text-primary">{formatCurrency(current)}</span>
                <span className="font-sans text-[10px] text-on-surface-variant/60 uppercase tracking-widest">of {formatCurrency(goal.target)}</span>
              </div>
              <div className="w-full bg-surface-container-highest/30 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="bg-primary h-full rounded-full"
                />
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-[10px] text-on-surface-variant/60 uppercase tracking-widest">
                  {remaining > 0 ? `${formatCurrency(remaining)} to go` : "🎉 Goal reached!"}
                </span>
                <span className="font-sans text-[10px] font-bold text-on-surface uppercase tracking-widest">{progress}%</span>
              </div>
            </div>

            {/* Add Contribution */}
            <div className="space-y-4 mb-8">
              <p className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">Add Funds</p>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-serif text-xl text-on-surface-variant/40">$</span>
                  <input
                    className={cn(
                      "w-full bg-surface-container-low border rounded-xl pl-9 pr-4 py-3 font-sans text-base text-on-surface focus:outline-none transition-all placeholder:text-outline-variant/60",
                      error ? "border-error" : "border-outline-variant/30 focus:border-on-surface"
                    )}
                    placeholder="Amount"
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => { setAmount(e.target.value.replace(/[^0-9.]/g, "")); setError(""); }}
                  />
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleContribute}
                  className={cn(
                    "px-6 rounded-xl font-sans text-xs font-bold uppercase tracking-widest transition-all",
                    contributed ? "bg-tertiary text-on-tertiary" : "bg-primary text-on-primary hover:opacity-90"
                  )}
                >
                  {contributed ? <Check className="w-4 h-4" /> : <PlusCircle className="w-5 h-5" />}
                </motion.button>
              </div>
              <input
                className="w-full bg-transparent border-b border-outline-variant/30 pb-2 font-sans text-sm text-on-surface focus:outline-none focus:border-on-surface transition-colors placeholder:text-outline-variant/60"
                placeholder="Note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              {error && <p className="font-sans text-[10px] text-error uppercase tracking-widest">{error}</p>}
            </div>

            {/* History */}
            {goal.contributions.length > 0 && (
              <div className="space-y-3">
                <p className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">History</p>
                <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                  {[...goal.contributions].reverse().map((c) => (
                    <div key={c.id} className="flex justify-between items-center py-3 border-b border-outline-variant/10 last:border-0">
                      <div>
                        <p className="font-sans text-sm text-on-surface font-medium">{c.note}</p>
                        <p className="font-sans text-[9px] text-on-surface-variant/60 uppercase tracking-widest mt-0.5">{formatDate(c.date)}</p>
                      </div>
                      <span className="font-serif text-xl text-primary">+{formatCurrency(c.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delete */}
            <button
              onClick={handleDelete}
              className="w-full mt-8 py-3 rounded-full bg-error-container/50 text-on-error-container font-sans text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-error-container transition-all"
            >
              <Trash2 className="w-4 h-4" /> Delete Goal
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}

// ─── Goals Page ───────────────────────────────────────────────────────────────
export default function Goals() {
  const { goals, formatCurrency } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="font-serif text-5xl text-primary">Your Goals</h1>
          <p className="font-sans text-sm text-on-surface-variant/80 mt-2 max-w-md">
            Intentional milestones for a well-lived life. Cultivate your savings with purpose.
          </p>
        </motion.div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-[20px] border border-outline-variant bg-surface-container-lowest text-on-background font-sans text-xs font-bold uppercase tracking-[0.2em] hover:bg-surface-container transition-all active:scale-95 shadow-sm overflow-hidden group"
        >
          <div className="bg-primary text-on-primary p-1 rounded-full group-hover:rotate-90 transition-transform">
            <Plus className="w-3 h-3 stroke-[3px]" />
          </div>
          New Goal
        </button>
      </header>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
        <AnimatePresence>
          {goals.map((goal) => {
            const progress = getGoalProgress(goal);
            const current = getGoalCurrent(goal);
            return (
              <motion.article 
                key={goal.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedGoal(goal)}
                className="group glass-card rounded-[32px] p-10 flex flex-col justify-between min-h-[300px] cursor-pointer transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-10">
                  <span className="text-4xl bg-surface-container-lowest w-16 h-16 rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    {goal.emoji}
                  </span>
                  <div className={cn(
                    "font-sans text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm",
                    progress >= 100 ? "bg-tertiary text-on-tertiary" : "bg-tertiary-fixed text-on-tertiary-fixed"
                  )}>
                    {progress >= 100 ? "Complete!" : `${progress}%`}
                  </div>
                </div>

                <div className="mt-auto">
                  <h3 className="font-sans text-lg font-bold text-primary mb-2">{goal.name}</h3>
                  <div className="flex justify-between items-baseline mb-6">
                    <span className="font-serif text-3xl tracking-tight text-on-background">
                      {formatCurrency(current)}
                    </span>
                    <span className="font-sans text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.1em]">
                      of {formatCurrency(goal.target)}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-surface-container-highest/30 rounded-full h-1.5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className={cn("h-full rounded-full", progress >= 100 ? "bg-tertiary" : "bg-primary")}
                    />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>

        {/* Add New Goal Card */}
        <motion.button
          whileHover={{ y: -4 }}
          onClick={() => setShowAddModal(true)}
          className="rounded-[32px] p-10 flex flex-col items-center justify-center min-h-[300px] border border-dashed border-outline-variant/50 bg-transparent hover:bg-surface-container-lowest/50 transition-all duration-500 group cursor-pointer active:scale-95"
        >
          <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-on-primary transition-all duration-500 shadow-sm">
            <Plus className="w-8 h-8 stroke-[1px]" />
          </div>
          <span className="font-sans text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-[0.3em] group-hover:text-primary transition-colors">
            Create New Goal
          </span>
        </motion.button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && <AddGoalModal onClose={() => setShowAddModal(false)} />}
        {selectedGoal && (
          <GoalDetailSheet
            goal={selectedGoal}
            onClose={() => setSelectedGoal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
