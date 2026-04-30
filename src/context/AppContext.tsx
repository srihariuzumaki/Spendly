import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TransactionType = "expense" | "income";

export type TransactionCategory =
  | "Food"
  | "Transit"
  | "Shopping"
  | "Housing"
  | "Bills"
  | "Salary"
  | "Freelance"
  | "Groceries"
  | "Entertainment"
  | "Healthcare"
  | "Travel"
  | "Other";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  merchant: string;
  note: string;
  date: string; // ISO string
}

export interface GoalContribution {
  id: string;
  amount: number;
  date: string;
  note: string;
}

export interface Goal {
  id: string;
  name: string;
  emoji: string;
  target: number;
  contributions: GoalContribution[];
}

export interface UserProfile {
  name: string;
  currency: string;
  avatar?: string;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const today = new Date();
const d = (daysAgo: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

const SEED_TRANSACTIONS: Transaction[] = [
  { id: "t1", type: "expense", amount: 142.5,  category: "Groceries",     merchant: "Whole Foods Market", note: "Weekly groceries",          date: d(0) },
  { id: "t2", type: "expense", amount: 4.5,    category: "Transit",        merchant: "Metro Transit",       note: "Morning commute",           date: d(0) },
  { id: "t3", type: "income",  amount: 4200,   category: "Salary",         merchant: "Acme Corp Inc.",      note: "Monthly salary",            date: d(1) },
  { id: "t4", type: "expense", amount: 85,     category: "Shopping",       merchant: "Everlane",            note: "Winter jacket",             date: d(1) },
  { id: "t5", type: "expense", amount: 24,     category: "Transit",        merchant: "Uber",                note: "Ride to airport",           date: d(3) },
  { id: "t6", type: "expense", amount: 6.5,    category: "Food",           merchant: "Kinfolk Coffee",      note: "Morning latte",             date: d(3) },
  { id: "t7", type: "income",  amount: 1250,   category: "Freelance",      merchant: "Kinfolk Magazine",    note: "Article — Oct issue",       date: d(5) },
  { id: "t8", type: "expense", amount: 1200,   category: "Housing",        merchant: "Riverside Apts",      note: "Rent",                      date: d(7) },
  { id: "t9", type: "expense", amount: 62,     category: "Bills",          merchant: "PG&E",                note: "Electricity bill",          date: d(8) },
  { id: "t10",type: "expense", amount: 38,     category: "Entertainment",  merchant: "Netflix + Spotify",   note: "Monthly subscriptions",     date: d(10) },
  { id: "t11",type: "expense", amount: 95,     category: "Food",           merchant: "Ippudo Ramen",        note: "Dinner with friends",       date: d(12) },
  { id: "t12",type: "expense", amount: 210,    category: "Healthcare",     merchant: "Dr. Chen's Clinic",   note: "Annual checkup",            date: d(14) },
  { id: "t13",type: "income",  amount: 320,    category: "Freelance",      merchant: "Freelance Client",    note: "Logo design project",       date: d(16) },
  { id: "t14",type: "expense", amount: 420,    category: "Travel",         merchant: "Delta Airlines",      note: "Flight — Thanksgiving",     date: d(18) },
  { id: "t15",type: "expense", amount: 42,     category: "Groceries",      merchant: "Trader Joe's",        note: "Produce run",               date: d(20) },
];

const SEED_GOALS: Goal[] = [
  {
    id: "g1", name: "Euro Summer 2025", emoji: "✈️", target: 5000,
    contributions: [
      { id: "gc1", amount: 500, date: d(30), note: "Initial deposit" },
      { id: "gc2", amount: 750, date: d(20), note: "Sold old gear" },
      { id: "gc3", amount: 1000, date: d(10), note: "Freelance bonus" },
      { id: "gc4", amount: 1000, date: d(2), note: "Monthly savings" },
    ],
  },
  {
    id: "g2", name: "Down Payment", emoji: "🏠", target: 50000,
    contributions: [
      { id: "gc5", amount: 5000, date: d(60), note: "Q3 savings" },
      { id: "gc6", amount: 3000, date: d(30), note: "Q4 savings" },
      { id: "gc7", amount: 3000, date: d(5),  note: "Year-end bonus" },
    ],
  },
  {
    id: "g3", name: "Emergency Fund", emoji: "🌿", target: 10000,
    contributions: [
      { id: "gc8", amount: 3000, date: d(90),  note: "Initial" },
      { id: "gc9", amount: 2500, date: d(60), note: "Accumulation" },
      { id: "gc10",amount: 3000, date: d(30), note: "Accumulation" },
    ],
  },
];

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  transactions: Transaction[];
  goals: Goal[];
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  addGoal: (goal: Omit<Goal, "id" | "contributions">) => void;
  updateGoal: (id: string, updates: Partial<Omit<Goal, "id">>) => void;
  deleteGoal: (id: string) => void;
  addGoalContribution: (goalId: string, contribution: Omit<GoalContribution, "id">) => void;
  // Computed
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  thisMonthTransactions: Transaction[];
  thisMonthIncome: number;
  thisMonthExpenses: number;
  formatCurrency: (amount: number) => string;
}

const AppContext = createContext<AppContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadFromStorage("spendly_transactions", SEED_TRANSACTIONS)
  );
  const [goals, setGoals] = useState<Goal[]>(() =>
    loadFromStorage("spendly_goals", SEED_GOALS)
  );

  const [profile, setProfile] = useState<UserProfile>(() =>
    loadFromStorage("spendly_profile", { name: "Guest", currency: "$", avatar: "👤" })
  );

  // Persist on change
  useEffect(() => {
    localStorage.setItem("spendly_profile", JSON.stringify(profile));
  }, [profile]);
  useEffect(() => {
    localStorage.setItem("spendly_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("spendly_goals", JSON.stringify(goals));
  }, [goals]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  // ── Transactions ──
  const addTransaction = useCallback((tx: Omit<Transaction, "id">) => {
    const newTx: Transaction = { ...tx, id: `t${Date.now()}` };
    setTransactions((prev) => [newTx, ...prev]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Goals ──
  const addGoal = useCallback((goal: Omit<Goal, "id" | "contributions">) => {
    const newGoal: Goal = { ...goal, id: `g${Date.now()}`, contributions: [] };
    setGoals((prev) => [...prev, newGoal]);
  }, []);

  const updateGoal = useCallback((id: string, updates: Partial<Omit<Goal, "id">>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const addGoalContribution = useCallback(
    (goalId: string, contribution: Omit<GoalContribution, "id">) => {
      const newContrib: GoalContribution = { ...contribution, id: `gc${Date.now()}` };
      setGoals((prev) =>
        prev.map((g) =>
          g.id === goalId
            ? { ...g, contributions: [...g.contributions, newContrib] }
            : g
        )
      );
    },
    []
  );

  // ── Computed ──
  const totalIncome = useMemo(
    () => transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
  const totalExpenses = useMemo(
    () => transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
  const totalBalance = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);

  const startOfThisMonth = useMemo(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const thisMonthTransactions = useMemo(
    () => transactions.filter((t) => new Date(t.date) >= startOfThisMonth),
    [transactions, startOfThisMonth]
  );

  const thisMonthIncome = useMemo(
    () => thisMonthTransactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
    [thisMonthTransactions]
  );
  const thisMonthExpenses = useMemo(
    () => thisMonthTransactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    [thisMonthTransactions]
  );

  return (
    <AppContext.Provider
      value={{
        profile,
        updateProfile,
        transactions,
        goals,
        addTransaction,
        deleteTransaction,
        addGoal,
        updateGoal,
        deleteGoal,
        addGoalContribution,
        totalBalance,
        totalIncome,
        totalExpenses,
        thisMonthTransactions,
        thisMonthIncome,
        thisMonthExpenses,
        formatCurrency: (amount: number) => `${profile.currency}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function getGoalProgress(goal: Goal): number {
  const current = goal.contributions.reduce((s, c) => s + c.amount, 0);
  return Math.min(100, Math.round((current / goal.target) * 100));
}

export function getGoalCurrent(goal: Goal): number {
  return goal.contributions.reduce((s, c) => s + c.amount, 0);
}
