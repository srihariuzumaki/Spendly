import React, { useState } from "react";
import { motion } from "motion/react";
import { User, DollarSign, Image as ImageIcon, Check, Trash2, Moon, Sun, Bell, Camera } from "lucide-react";
import { useApp, CURRENCIES } from "@/src/context/AppContext";
import { cn } from "@/src/lib/utils";

const EMOJIS = ["😎", "😊", "🤩", "🚀", "🦄", "🐶", "🐱", "☕", "🍔", "🍕", "🎸", "🎮", "✈️", "🏖️", "💎", "🌟"];

export default function Settings() {
  const { profile, updateProfile } = useApp();
  
  const [name, setName] = useState(profile.name || "");
  const [avatar, setAvatar] = useState(profile.avatar || "😎");
  const [currency, setCurrency] = useState(profile.currency || "$");
  const [saved, setSaved] = useState(false);

  // Settings Toggles (Mock state for pure UI functionality)
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

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
    updateProfile({ name, avatar, currency });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto pb-12">
      <header>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-serif text-5xl text-primary">Settings</h1>
          <p className="font-sans text-sm text-on-surface-variant/80 mt-2">
            Manage your profile, preferences, and application data.
          </p>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Profile & Appearance */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Section */}
          <motion.section 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-card rounded-[32px] p-8 md:p-10 space-y-8"
          >
            <h2 className="font-sans text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] border-b border-outline-variant/10 pb-4">
              Profile
            </h2>
            
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar Selection */}
              <div className="space-y-4">
                <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                  <ImageIcon className="w-3 h-3" /> Avatar
                </label>
                
                {/* Current Avatar Display */}
                <div className="flex items-center gap-4 mb-2">
                  {avatar.startsWith("data:") || avatar.startsWith("http") ? (
                    <img src={avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-outline-variant/30" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-4xl">{avatar}</div>
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container text-on-primary-container text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-primary/20 transition-all">
                    <Camera className="w-4 h-4" /> Upload
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>

                <div className="grid grid-cols-4 gap-2 w-max mt-4">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setAvatar(emoji)}
                      className={cn(
                        "w-12 h-12 text-2xl flex items-center justify-center rounded-2xl transition-all hover:scale-110",
                        avatar === emoji 
                          ? "bg-primary-container text-on-primary-container ring-2 ring-primary ring-offset-2 ring-offset-background" 
                          : "bg-surface-container hover:bg-surface-container-high"
                      )}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Currency */}
              <div className="flex-1 space-y-6 w-full">
                <div className="space-y-3">
                  <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <User className="w-3 h-3" /> Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/20 rounded-2xl px-5 py-4 font-sans text-base text-on-surface focus:outline-none focus:border-primary transition-all"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="space-y-3">
                  <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <DollarSign className="w-3 h-3" /> Base Currency
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {CURRENCIES.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => setCurrency(c.symbol)}
                        className={cn(
                          "py-3 px-4 rounded-xl font-sans text-sm font-medium transition-all flex flex-col items-center gap-1",
                          currency === c.symbol
                            ? "bg-tertiary-container text-on-tertiary-container ring-1 ring-tertiary"
                            : "bg-surface-container border border-outline-variant/10 hover:border-outline-variant/30 text-on-surface"
                        )}
                      >
                        <span className="text-lg">{c.symbol}</span>
                        <span className="text-[9px] uppercase tracking-wider text-on-surface-variant">{c.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/10 flex justify-end">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className={cn(
                  "px-8 py-3 rounded-full font-sans text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2",
                  saved ? "bg-tertiary text-on-tertiary" : "bg-primary text-on-primary hover:opacity-90"
                )}
              >
                {saved ? <><Check className="w-4 h-4" /> Saved</> : "Save Profile"}
              </motion.button>
            </div>
          </motion.section>
        </div>

        {/* Right Col: App Settings & Danger Zone */}
        <div className="space-y-8">
          
          <motion.section 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-card rounded-[32px] p-8 space-y-6"
          >
            <h2 className="font-sans text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] border-b border-outline-variant/10 pb-4">
              Preferences
            </h2>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-on-surface">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                    {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-sans font-medium text-sm">Theme</p>
                    <p className="font-sans text-xs text-on-surface-variant/80">Toggle visual appearance</p>
                  </div>
                </div>
                {/* Toggle switch */}
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-colors duration-300",
                    darkMode ? "bg-primary" : "bg-surface-variant"
                  )}
                >
                  <motion.div 
                    layout
                    className="w-5 h-5 bg-white rounded-full absolute top-[2px]"
                    initial={false}
                    animate={{ left: darkMode ? "26px" : "2px" }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-on-surface">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-sans font-medium text-sm">Notifications</p>
                    <p className="font-sans text-xs text-on-surface-variant/80">Daily reminders & alerts</p>
                  </div>
                </div>
                <button 
                  onClick={() => setNotifications(!notifications)}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-colors duration-300",
                    notifications ? "bg-primary" : "bg-surface-variant"
                  )}
                >
                  <motion.div 
                    layout
                    className="w-5 h-5 bg-white rounded-full absolute top-[2px]"
                    initial={false}
                    animate={{ left: notifications ? "26px" : "2px" }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </div>
          </motion.section>

          {/* Danger Zone */}
          <motion.section 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="p-8 rounded-[32px] border border-error/20 bg-error-container/20 space-y-6"
          >
            <div className="flex gap-3">
              <Trash2 className="w-6 h-6 text-error" />
              <div>
                <h2 className="font-sans font-bold text-on-surface">Data Management</h2>
                <p className="font-sans text-xs text-on-surface-variant/80 mt-1">
                  Permanently delete all tracking data including transactions, goals, and history. This cannot be undone.
                </p>
              </div>
            </div>
            <button 
              onClick={handleClearData}
              className="w-full py-3 rounded-xl bg-error text-on-error font-sans text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Clear All Data
            </button>
          </motion.section>

        </div>
      </div>
    </div>
  );
}
