import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// ─── Api Setup ────────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("spendly_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem("spendly_token");
      localStorage.removeItem("spendly_profile");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const CURRENCIES = [
  { symbol: "$", code: "USD", name: "US Dollar" },
  { symbol: "€", code: "EUR", name: "Euro" },
  { symbol: "£", code: "GBP", name: "British Pound" },
  { symbol: "¥", code: "JPY", name: "Japanese Yen" },
  { symbol: "₹", code: "INR", name: "Indian Rupee" },
  { symbol: "A$", code: "AUD", name: "Australian Dollar" },
  { symbol: "C$", code: "CAD", name: "Canadian Dollar" },
  { symbol: "Fr", code: "CHF", name: "Swiss Franc" },
];

export function getCurrencySymbol(codeOrSymbol: string) {
  const currency = CURRENCIES.find(c => c.code === codeOrSymbol || c.symbol === codeOrSymbol);
  return currency ? currency.symbol : "$";
}

export function getCurrencyCode(codeOrSymbol: string) {
  const currency = CURRENCIES.find(c => c.code === codeOrSymbol || c.symbol === codeOrSymbol);
  return currency ? currency.code : "USD";
}

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
  id: string;      // mapped from _id
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  merchant: string;
  note: string;
  date: string;    // ISO string
}

export interface GoalContribution {
  id: string;      // mapped from _id
  amount: number;
  date: string;
  note: string;
}

export interface Goal {
  id: string;      // mapped from _id
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

export type Theme = "light" | "dark";

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextType {
  // Auth
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;

  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  theme: Theme;
  toggleTheme: () => void;
  transactions: Transaction[];
  goals: Goal[];
  addTransaction: (tx: Omit<Transaction, "id">) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addGoal: (goal: Omit<Goal, "id" | "contributions">) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addGoalContribution: (goalId: string, contribution: Omit<GoalContribution, "id">) => Promise<void>;
  
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

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const p = localStorage.getItem("spendly_profile");
      return p ? JSON.parse(p) : { name: "Guest", currency: "$", avatar: "👤" };
    } catch {
      return { name: "Guest", currency: "$", avatar: "👤" };
    }
  });

  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("spendly_theme") as Theme) || "light";
  });

  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then(res => res.json())
      .then(data => {
        if (data && data.rates) {
          setExchangeRates(data.rates);
        }
      })
      .catch(err => console.error("Failed to fetch exchange rates:", err));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("spendly_theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("spendly_token");
  });

  // ── Handlers ──

  const fetchUserData = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const [txRes, goalRes] = await Promise.all([
        api.get("/transactions"),
        api.get("/goals")
      ]);
      
      const mappedTxs = txRes.data.map((t: any) => ({ ...t, id: t._id }));
      const mappedGoals = goalRes.data.map((g: any) => ({
        ...g,
        id: g._id,
        contributions: g.contributions.map((c: any) => ({ ...c, id: c._id }))
      }));

      setTransactions(mappedTxs);
      setGoals(mappedGoals);
    } catch (err) {
      console.error("Failed to load user financial data", err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) fetchUserData();
  }, [isAuthenticated, fetchUserData]);

  // Auth Operations
  const login = useCallback(async (email: string, pass: string) => {
    try {
      const res = await api.post("/auth/login", { email, password: pass });
      localStorage.setItem("spendly_token", res.data.token);
      
      const u = res.data.user;
      setProfile({ name: u.name, avatar: u.avatar || "👤", currency: u.currency || "$" });
      setIsAuthenticated(true);
      toast.success(`Welcome back, ${u.name}!`);
    } catch (err) {
      toast.error("Invalid credentials.");
      throw err;
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, pass: string) => {
    try {
      const res = await api.post("/auth/register", { name, email, password: pass });
      localStorage.setItem("spendly_token", res.data.token);
      
      const u = res.data.user;
      setProfile({ name: u.name, avatar: u.avatar || "👤", currency: u.currency || "$" });
      setIsAuthenticated(true);
      toast.success("Account created successfully!");
    } catch (err) {
      toast.error("Registration failed.");
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem("spendly_token");
    setTransactions([]);
    setGoals([]);
  }, []);

  // Sync profile locally still (to avoid doing a backend put for small pref edits for now)
  useEffect(() => {
    localStorage.setItem("spendly_profile", JSON.stringify(profile));
  }, [profile]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    try {
      await api.put("/auth/profile", updates);
      setProfile((prev) => ({ ...prev, ...updates }));
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile", err);
      toast.error("Failed to update profile.");
    }
  }, []);

  const convertToUSD = useCallback((amount: number) => {
    const code = getCurrencyCode(profile.currency);
    const rate = exchangeRates[code] || 1;
    return amount / rate;
  }, [profile.currency, exchangeRates]);

  // API Mutators
  const addTransaction = useCallback(async (tx: Omit<Transaction, "id">) => {
    try {
      const dbTx = { ...tx, amount: convertToUSD(tx.amount) };
      const res = await api.post("/transactions", dbTx);
      setTransactions((prev) => [{ ...res.data, id: res.data._id }, ...prev]);
      toast.success("Transaction recorded");
    } catch (err) {
      toast.error("Failed to save transaction");
    }
  }, [convertToUSD]);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      toast.success("Transaction removed");
    } catch (err) {
      toast.error("Failed to delete transaction");
    }
  }, []);

  const addGoal = useCallback(async (goal: Omit<Goal, "id" | "contributions">) => {
    try {
      const dbGoal = { ...goal, target: convertToUSD(goal.target) };
      const res = await api.post("/goals", dbGoal);
      setGoals((prev) => [...prev, { ...res.data, id: res.data._id, contributions: [] }]);
      toast.success("Goal created!");
    } catch (err) {
      toast.error("Failed to create goal");
    }
  }, [convertToUSD]);

  const deleteGoal = useCallback(async (id: string) => {
    try {
      await api.delete(`/goals/${id}`);
      setGoals((prev) => prev.filter((g) => g.id !== id));
      toast.success("Goal deleted");
    } catch (err) {
      toast.error("Failed to delete goal");
    }
  }, []);

  const addGoalContribution = useCallback(async (goalId: string, contribution: Omit<GoalContribution, "id">) => {
    try {
      const dbContrib = { ...contribution, amount: convertToUSD(contribution.amount) };
      const res = await api.post(`/goals/${goalId}/contribute`, dbContrib);
      const updatedGoal = res.data;
      setGoals((prev) => prev.map(g => g.id === goalId ? {
        ...updatedGoal, 
        id: updatedGoal._id, 
        contributions: updatedGoal.contributions.map((c: any) => ({ ...c, id: c._id }))
      } : g));
      // Create an expense transaction for the goal deposit
      try {
        const txRes = await api.post("/transactions", {
          merchant: `Goal Deposit: ${updatedGoal.name}`,
          amount: dbContrib.amount,
          type: "expense",
          category: "Other",
          date: contribution.date
        });
        setTransactions((txs) => [{ ...txRes.data, id: txRes.data._id }, ...txs]);
      } catch (err) {
        console.error("Could not sync goal tx", err);
      }

      toast.success("Contribution added!");
    } catch (err) {
      toast.error("Failed to add contribution");
    }
  }, [convertToUSD]);

  // Computed Values
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
        isAuthenticated,
        login,
        signup,
        logout,
        profile,
        updateProfile,
        theme,
        toggleTheme,
        transactions,
        goals,
        addTransaction,
        deleteTransaction,
        addGoal,
        deleteGoal,
        addGoalContribution,
        totalBalance,
        totalIncome,
        totalExpenses,
        thisMonthTransactions,
        thisMonthIncome,
        thisMonthExpenses,
        formatCurrency: (amount: number) => {
          const code = getCurrencyCode(profile.currency);
          const symbol = getCurrencySymbol(profile.currency);
          const rate = exchangeRates[code] || 1;
          const convertedAmount = amount * rate;
          return `${symbol}${convertedAmount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        },
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
  if (!goal.contributions) return 0;
  const current = goal.contributions.reduce((s, c) => s + c.amount, 0);
  return Math.min(100, Math.round((current / goal.target) * 100));
}

export function getGoalCurrent(goal: Goal): number {
  if (!goal.contributions) return 0;
  return goal.contributions.reduce((s, c) => s + c.amount, 0);
}
