"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getBooks, getMyBorrows } from "@/lib/api";
import {
  User,
  Mail,
  Library,
  BookMarked,
  PlusCircle,
  Calendar,
  ShieldCheck,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [contributedCount, setContributedCount] = useState(0);
  const [borrowedCount, setBorrowedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?callbackUrl=/profile");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    async function loadStats() {
      if (!session?.user?.email) return;
      setLoading(true);
      try {
        const [myBooks, myBorrows] = await Promise.all([
          getBooks({ email: session.user.email }),
          getMyBorrows(),
        ]);
        setContributedCount(myBooks.length);
        setBorrowedCount(myBorrows.length);
      } catch (err) {
        console.error("Error loading stats:", err);
      } finally {
        setLoading(false);
      }
    }

    if (session?.user) {
      loadStats();
    }
  }, [session?.user]);

  if (isPending || loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-xl border-3 border-indigo-600 border-t-transparent animate-spin" />
        <p className="text-sm font-medium text-slate-500 font-serif">
          Loading reader profile...
        </p>
      </div>
    );
  }

  const user = session?.user;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Cover Banner */}
        <div className="h-36 sm:h-44 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 relative" />

        <div className="px-6 sm:px-10 pb-8 relative">
          {/* Avatar and Basic Details */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-white dark:border-slate-900 shadow-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-3xl">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User Avatar"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span>{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
                )}
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-serif">
                  {user?.name || "BookNook Member"}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{user?.email}</span>
                </p>
              </div>
            </div>

            <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 self-center sm:self-auto">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Library Member</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
            <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wider block">
                  Books Contributed
                </span>
                <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1 block">
                  {contributedCount}
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Library className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-slate-800/60 border border-emerald-100 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wider block">
                  Active Borrowed Books
                </span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
                  {borrowedCount}
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <BookMarked className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-4">
            <Link
              href="/my-books"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 transition-all"
            >
              <Library className="w-4 h-4" />
              View Contributed Books
            </Link>

            <Link
              href="/my-borrows"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <BookMarked className="w-4 h-4 text-emerald-500" />
              Manage Borrowed Books
            </Link>

            <Link
              href="/add-book"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-indigo-500" />
              Add New Book
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
