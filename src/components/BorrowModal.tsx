"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Book } from "@/types";
import { borrowBook } from "@/lib/api";
import { X, Calendar, User, Mail, BookOpen, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

interface BorrowModalProps {
  book: Book;
  user: {
    name?: string | null;
    email: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BorrowModal({
  book,
  user,
  isOpen,
  onClose,
  onSuccess,
}: BorrowModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Default return date: 14 days in future
  const defaultReturnDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const [returnDate, setReturnDate] = useState(defaultReturnDate);

  if (!isOpen) return null;

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnDate) {
      toast.error("Please pick a return date.");
      return;
    }

    setLoading(true);
    try {
      const res = await borrowBook({
        bookId: book._id,
        bookTitle: book.title,
        bookImage: book.image,
        userEmail: user.email,
        userName: user.name || "BookNook Member",
        returnDate: new Date(returnDate).toISOString(),
      });

      if (res.success) {
        toast.success(res.message || `Successfully borrowed "${book.title}"!`);
        onSuccess();
        onClose();
        router.push("/my-borrows");
      } else {
        toast.error(res.message || "Failed to borrow book. Please try again.");
      }
    } catch {
      toast.error("An unexpected error occurred while borrowing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
              Borrow Book
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleBorrow} className="p-6 space-y-4">
          {/* Selected Book Summary */}
          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <div className="relative w-14 h-18 rounded-lg overflow-hidden shrink-0 bg-slate-200">
              <Image
                src={book.image}
                alt={book.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="overflow-hidden">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm truncate font-serif">
                {book.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                by {book.author}
              </p>
              <span className="inline-block mt-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                {book.copies} copies currently available
              </span>
            </div>
          </div>

          {/* User Name (Read-Only) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Borrower Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={user.name || "BookNook Member"}
                readOnly
                disabled
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 text-sm cursor-not-allowed font-medium"
              />
            </div>
          </div>

          {/* User Email (Read-Only) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Borrower Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={user.email}
                readOnly
                disabled
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 text-sm cursor-not-allowed font-medium"
              />
            </div>
          </div>

          {/* Return Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Expected Return Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Standard borrowing period is 14 days. You can return anytime before this date.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (typeof book.copies === "number" && book.copies <= 0)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 disabled:opacity-50 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              {loading ? "Processing..." : "Confirm Borrow"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
