"use client";

import React, { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getBookById } from "@/lib/api";
import { Book } from "@/types";
import BorrowModal from "@/components/BorrowModal";
import {
  ArrowLeft,
  User,
  Calendar,
  Layers,
  BookOpen,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

interface BookDetailsProps {
  params: Promise<{ id: string }>;
}

export default function BookDetailsPage({ params }: BookDetailsProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);

  // Private route redirect if unauthenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push(`/login?callbackUrl=/books/${resolvedParams.id}`);
    }
  }, [session, isPending, router, resolvedParams.id]);

  const loadBook = async () => {
    setLoading(true);
    const data = await getBookById(resolvedParams.id);
    setBook(data);
    setLoading(false);
  };

  useEffect(() => {
    loadBook();
  }, [resolvedParams.id]);

  if (isPending || loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-xl border-3 border-indigo-600 border-t-transparent animate-spin" />
        <p className="text-sm font-medium text-slate-500 font-serif">
          Fetching book details...
        </p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-serif">
          Book Not Found
        </h2>
        <p className="text-sm text-slate-500">
          The requested book could not be found in our records.
        </p>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Books
        </Link>
      </div>
    );
  }

  const isOutOfStock = typeof book.copies === "number" && book.copies <= 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Breadcrumb */}
      <div>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Books
        </Link>
      </div>

      {/* Main Details Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-10">
          {/* Left Column: Book Cover Image */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-sm h-96 sm:h-[480px] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
              <Image
                src={book.image}
                alt={book.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Column: Metadata and Actions */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  {book.category}
                </span>

                <span
                  className={`px-3.5 py-1 rounded-full text-xs font-semibold ${
                    isOutOfStock
                      ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  }`}
                >
                  {isOutOfStock ? "Not Available" : `${book.copies} Copies Available`}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-serif tracking-tight">
                {book.title}
              </h1>

              <div className="flex items-center gap-2 text-base font-semibold text-slate-700 dark:text-slate-300">
                <User className="w-4 h-4 text-indigo-500" />
                <span>By {book.author}</span>
              </div>

              {/* Book Details Info Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Available Copies
                  </span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {book.copies}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Category
                  </span>
                  <span className="text-base font-bold text-slate-900 dark:text-white truncate block">
                    {book.category}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 col-span-2 sm:col-span-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Added Date
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block mt-0.5">
                    {book.createdAt ? new Date(book.createdAt).toLocaleDateString() : "Catalog Item"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="pt-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2 font-serif">
                  Book Overview
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {book.description}
                </p>
              </div>

              {/* Contributor / Added By Card */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/40 border border-indigo-100 dark:border-slate-700/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {book.userName ? book.userName.charAt(0).toUpperCase() : "B"}
                </div>
                <div className="overflow-hidden">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">
                    Contributed to library by:
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white truncate block">
                    {book.userName || "BookNook Member"}
                  </span>
                  <span className="text-xs text-slate-400 truncate block">
                    {book.userEmail}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
              {isOutOfStock ? (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-semibold">
                    All copies of this title are currently borrowed by fellow readers. Please check back soon!
                  </p>
                </div>
              ) : null}

              <button
                onClick={() => setBorrowModalOpen(true)}
                disabled={isOutOfStock}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-indigo-600/50 transition-all focus:outline-none"
              >
                <BookOpen className="w-5 h-5" />
                {isOutOfStock ? "Not Available" : "Borrow This Book"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Borrow Modal */}
      {session?.user && (
        <BorrowModal
          book={book}
          user={{
            name: session.user.name,
            email: session.user.email,
          }}
          isOpen={borrowModalOpen}
          onClose={() => setBorrowModalOpen(false)}
          onSuccess={() => loadBook()}
        />
      )}
    </div>
  );
}
