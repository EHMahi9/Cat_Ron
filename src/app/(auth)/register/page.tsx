"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import { BookOpen, User, Mail, Image as ImageIcon, Lock, UserPlus, Check, X } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Validation criteria
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;
  const isPasswordValid = hasUpperCase && hasLowerCase && hasMinLength;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validate password strictly
    if (!hasUpperCase) {
      setErrorMessage("Password must contain at least one uppercase letter (A-Z).");
      toast.error("Password must contain at least one uppercase letter.");
      return;
    }
    if (!hasLowerCase) {
      setErrorMessage("Password must contain at least one lowercase letter (a-z).");
      toast.error("Password must contain at least one lowercase letter.");
      return;
    }
    if (!hasMinLength) {
      setErrorMessage("Password must be at least 6 characters long.");
      toast.error("Password length must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        image: photoUrl.trim() || undefined,
      });

      if (res.error) {
        const errorText = res.error.message || "Registration failed. Please check your inputs.";
        setErrorMessage(errorText);
        toast.error(errorText);
      } else {
        toast.success("Account created successfully! Welcome to BookNook.");
        router.push("/");
        router.refresh();
      }
    } catch {
      const errorText = "Unable to complete registration. Please try again.";
      setErrorMessage(errorText);
      toast.error(errorText);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      toast.error("Failed to connect with Google.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-600/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-serif">
            Join BookNook
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Create an account to borrow, explore, and share books with readers.
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-600 dark:text-rose-400">
            {errorMessage}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Jane Reader"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="jane@reader.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Photo URL (Optional)
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Password Validation Checklist */}
            <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5 text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Password Criteria:
              </span>
              <div className="flex items-center gap-2">
                {hasUpperCase ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span className={hasUpperCase ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-slate-500"}>
                  At least one uppercase letter (A-Z)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasLowerCase ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span className={hasLowerCase ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-slate-500"}>
                  At least one lowercase letter (a-z)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasMinLength ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span className={hasMinLength ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-slate-500"}>
                  Minimum length of 6 characters
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !isPasswordValid}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition-all focus:outline-none"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          <span className="bg-white dark:bg-slate-900 px-3 text-xs text-slate-400 uppercase tracking-wider shrink-0">
            or register with
          </span>
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
        </div>

        {/* Social Login Button (Google only) */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 text-sm font-semibold shadow-sm transition-all focus:outline-none"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{googleLoading ? "Connecting..." : "Register with Google"}</span>
        </button>

        {/* Link to Login */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
}
