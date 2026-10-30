"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { useTheme } from "@/lib/theme-context";
import {
  BookOpen,
  Sun,
  Moon,
  Menu,
  X,
  User,
  LogOut,
  PlusCircle,
  Library,
  BookMarked,
  Home,
  Compass,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { theme, toggleTheme } = useTheme();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Successfully logged out. See you soon!");
      router.push("/");
    } catch {
      toast.error("Failed to log out. Please try again.");
    }
  };

  const navLinks = [
    { name: "Home", href: "/", icon: Home, isPrivate: false },
    { name: "All Books", href: "/books", icon: Compass, isPrivate: false },
    { name: "Add Book", href: "/add-book", icon: PlusCircle, isPrivate: true },
    { name: "My Books", href: "/my-books", icon: Library, isPrivate: true },
    { name: "My Borrows", href: "/my-borrows", icon: BookMarked, isPrivate: true },
  ];

  const visibleLinks = navLinks.filter((link) => !link.isPrivate || Boolean(session?.user));

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Website Name */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-serif">
              Book<span className="text-indigo-600 dark:text-indigo-400">Nook</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-3">
            {visibleLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40"
                      : "text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark and Light Mode"
              className="p-2 sm:p-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-amber-400 hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600 hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Auth State */}
            {isPending ? (
              <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            ) : session?.user ? (
              /* User Avatar & Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full border-2 border-indigo-500/30 hover:border-indigo-600 transition-colors focus:outline-none"
                  aria-expanded={dropdownOpen}
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User Avatar"}
                      width={34}
                      height={34}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
                      {session.user.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700/60">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {session.user.name || "Library Reader"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {session.user.email}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700/60 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>

                    <Link
                      href="/my-books"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700/60 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <Library className="w-4 h-4" />
                      My Books
                    </Link>

                    <Link
                      href="/my-borrows"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700/60 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <BookMarked className="w-4 h-4" />
                      My Borrows
                    </Link>

                    <div className="border-t border-slate-100 dark:border-slate-700/60 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Non-authenticated login and register buttons */
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/30 transition-all hover:shadow"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-5 space-y-1.5">
          {visibleLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
