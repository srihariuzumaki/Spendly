import React, { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, User, Camera } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useApp } from "@/src/context/AppContext";

const AVATARS = ["👤", "👨‍💻", "👩‍💻", "🦁", "🦊", "🐶", "🐱", "🐻", "🦄", "🐼", "🐸", "🚀"];
const CURRENCIES = [
  { symbol: "$", label: "USD" },
  { symbol: "€", label: "EUR" },
  { symbol: "£", label: "GBP" },
  { symbol: "¥", label: "JPY" },
  { symbol: "₹", label: "INR" },
];

export default function ProfileSetup() {
  const { profile, updateProfile } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState(profile.name === "Guest" ? "" : profile.name);
  const [currency, setCurrency] = useState(profile.currency || "$");
  const [avatar, setAvatar] = useState(profile.avatar || "👤");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      setErrors({ name: "Please enter your name." });
      return;
    }
    
    updateProfile({ name, currency, avatar });
    navigate("/dashboard");
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-container/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary-container/20 rounded-full blur-[120px] pointer-events-none" />
      
      <main className="flex-grow flex flex-col items-center justify-center z-10 w-full max-w-lg mx-auto py-12 px-6">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-container text-on-primary-container mb-6">
            <User className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-4xl mb-4 text-primary">
            Welcome to Spendly
          </h2>
          <p className="font-sans text-on-surface-variant leading-relaxed">
            Let's personalize your experience. How should we call you?
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full glass-card p-6 md:p-8 rounded-3xl flex flex-col gap-6"
        >
          {/* Avatar Selection */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative mb-2">
              {avatar.startsWith("data:") || avatar.startsWith("http") ? (
                <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-primary/20 shadow-xl" />
              ) : (
                <div className="text-6xl select-none">{avatar}</div>
              )}
            </div>
            <div className="flex flex-wrap justify-center items-center gap-2 max-w-[280px]">
              {/* Upload Button */}
              <label className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 transition-all ring-1 ring-primary/30">
                <Camera className="w-5 h-5" />
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              
              {AVATARS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setAvatar(emoji)}
                  className={cn(
                    "text-xl p-2 rounded-full transition-all hover:bg-surface-variant/50",
                    avatar === emoji ? "bg-surface-variant border border-outline-variant scale-110" : "scale-100 opacity-70 hover:opacity-100"
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium text-on-surface-variant ml-1">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              placeholder="e.g. Alex"
              className={cn(
                "w-full px-4 py-3 rounded-xl border bg-surface/50 text-on-surface outline-none transition-colors",
                errors.name ? "border-error focus:border-error" : "border-outline-variant/50 focus:border-primary"
              )}
            />
            {errors.name && <p className="text-xs text-error ml-1">{errors.name}</p>}
          </div>

          {/* Currency Output */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant ml-1">Preferred Currency</label>
            <div className="grid grid-cols-5 gap-2">
              {CURRENCIES.map((c) => (
                <button
                  key={c.symbol}
                  type="button"
                  onClick={() => setCurrency(c.symbol)}
                  className={cn(
                    "py-3 rounded-xl border font-medium transition-all",
                    currency === c.symbol 
                      ? "bg-primary text-on-primary border-primary" 
                      : "bg-surface/50 border-outline-variant/30 text-on-surface-variant hover:border-outline-variant"
                  )}
                >
                  {c.symbol}
                </button>
              ))}
            </div>
          </div>

        </motion.div>

        {/* Controls */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full flex items-center justify-end mt-8 pt-8 border-t border-outline-variant/20"
        >
          <button 
            onClick={handleSave}
            className="bg-primary text-on-primary rounded-full px-8 py-3.5 font-sans text-sm font-medium tracking-wide flex items-center gap-2 hover:bg-inverse-surface transition-colors active:scale-95"
          >
            Complete Setup
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

      </main>
    </div>
  );
}
