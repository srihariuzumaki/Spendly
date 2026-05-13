import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Mail, Lock, User } from "lucide-react";
import { useApp } from "@/src/context/AppContext";

export default function Signup() {
  const { signup } = useApp();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(name, email, password);
      // Redirect to profile setup first time to grab emoji/currency
      navigate("/setup-profile");
    } catch (err) {
      console.error("Signup failed", err);
      // Optional: show error state here
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-tertiary/20 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 -translate-x-1/3" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none translate-y-1/3 translate-x-1/3" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <h1 className="font-serif italic text-5xl text-primary mb-2">Spendly</h1>
          <p className="font-sans text-on-surface-variant/80 text-sm">Create your personal account</p>
        </div>

        <div className="glass-card rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-tertiary to-primary" />
          
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">Full Name</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-on-surface-variant/60">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/20 rounded-2xl pl-12 pr-4 py-4 font-sans text-sm text-on-surface focus:outline-none focus:border-tertiary transition-all placeholder:text-on-surface-variant/40"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">Email</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-on-surface-variant/60">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/20 rounded-2xl pl-12 pr-4 py-4 font-sans text-sm text-on-surface focus:outline-none focus:border-tertiary transition-all placeholder:text-on-surface-variant/40"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-on-surface-variant/60">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/20 rounded-2xl pl-12 pr-4 py-4 font-sans text-sm text-on-surface focus:outline-none focus:border-tertiary transition-all placeholder:text-on-surface-variant/40"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 rounded-2xl bg-tertiary text-on-tertiary font-sans text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-tertiary/20"
              >
                Create Account <ArrowRight className="w-4 h-4 stroke-[2px]" />
              </motion.button>
            </div>
          </form>

          <p className="font-sans text-xs text-center text-on-surface-variant mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
