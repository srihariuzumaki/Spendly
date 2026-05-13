import React from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "@/src/context/AppContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp();

  // If the user isn't authenticated, send them to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
