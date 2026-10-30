"use client";

import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/lib/theme-context";
import { useSession } from "@/lib/auth-client";
import { syncJwtToken, removeToken } from "@/lib/api";

function AuthSync() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      syncJwtToken({
        email: session.user.email,
        name: session.user.name,
        id: session.user.id,
      });
    } else {
      removeToken();
    }
  }, [session]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthSync />
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#1e293b",
            color: "#f8fafc",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "12px 18px",
            fontSize: "14px",
            fontWeight: 500,
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </ThemeProvider>
  );
}
