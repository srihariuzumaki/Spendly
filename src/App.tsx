/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Goals from "./pages/Goals";
import Analytics from "./pages/Analytics";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/transactions" element={<Layout><Transactions /></Layout>} />
        <Route path="/goals" element={<Layout><Goals /></Layout>} />
        <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
        
        {/* Fallback routes */}
        <Route path="/settings" element={<Layout><div className="flex flex-col items-center justify-center min-h-[60vh] text-center"><h2 className="font-serif text-4xl mb-4">Settings</h2><p className="font-sans text-on-surface-variant">Coming soon in the next update.</p></div></Layout>} />
        <Route path="/help" element={<Layout><div className="flex flex-col items-center justify-center min-h-[60vh] text-center"><h2 className="font-serif text-4xl mb-4">Help Center</h2><p className="font-sans text-on-surface-variant">We're here to assist you.</p></div></Layout>} />
        <Route path="/sign-out" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
