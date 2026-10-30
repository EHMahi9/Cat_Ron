"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getMyBorrows, returnBook } from "@/lib/api";
import { Borrow } from "@/types";
import ConfirmModal from "@/components/ConfirmModal";
import {
  BookMarked,
  RotateCcw,
  Calendar,
  Compass,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";

export default function MyBorrowsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);

  // Return book confirmation modal
  const [selectedBorrowForReturn, setSelectedBorrowForReturn] = useState<Borrow | null>(null);
  const [returning, setReturning] = useState(false);

  // Private route redirect
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?callbackUrl=/my-borrows");
    }
  }, [session, isPending, router]);

  const loadBorrows = async () => {
    setLoading(true);
    const data = await getMyBorrows();
    setBorrows(data);
    setLoading(false);
  };

  useEffect(() => {
    if (session?.user) {
      loadBorrows();
    }
  }, [session?.user]);

  const handleReturnConfirm = async () => {
    if (!selectedBorrowForReturn) return;

    setReturning(true);
    try {
      const res = await returnBook(selectedBorrowForReturn._id);
      if (res.success) {
        toast.success(
          res.message || `"${selectedBorrowForReturn.bookTitle}" returned successfully!`
        );
        setBorrows((prev) =>
          prev.filter((b) => b._id !== selectedBorrowForReturn._id)
        );
        setSelectedBorrowForReturn(null);
      } else {
        toast.error(res.message || "Failed to return book.");
      }
    } catch {
      toast.error("An error occurred while returning the book.");
    } finally {
      setReturning(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-xl border-3 border-indigo-600 border-t-transparent animate-spin" />
        <p className="text-sm font-medium text-slate-500 font-serif">
          Fetching your borrowed shelf...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1.5">
            <BookMarked className="w-3.5 h-3.5" />
            <span>Active Reading Shelf</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-serif">
            My Borrows
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Keep track of all books currently checked out to your account. Return them when finished reading.
          </p>
        </div>

        <Link
          href="/books"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 transition-all shrink-0"
        >
          <Compass className="w-4 h-4" />
          Borrow More Books
        </Link>
      </div>

      {/* Borrows Table */}
      {borrows.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Book</th>
                  <th className="py-4 px-6">Borrow Date</th>
                  <th className="py-4 px-6">Due Return Date</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {borrows.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {/* Book Cover and Title */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200 dark:border-slate-700">
                          <Image
                            src={item.bookImage}
                            alt={item.bookTitle}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="max-w-xs sm:max-w-sm">
                          <Link
                            href={`/books/${item.bookId}`}
                            className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1 font-serif"
                          >
                            {item.bookTitle}
                          </Link>
                          {item.bookAuthor && (
                            <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">
                              by {item.bookAuthor}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Borrow Date */}
                    <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {item.borrowDate
                            ? new Date(item.borrowDate).toLocaleDateString()
                            : "Recent"}
                        </span>
                      </div>
                    </td>

                    {/* Return Date */}
                    <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        <span>
                          {item.returnDate
                            ? new Date(item.returnDate).toLocaleDateString()
                            : "14 Days"}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    </td>

                    {/* Return Book Button */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedBorrowForReturn(item)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Return Book</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <BookMarked className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
            Your borrowed shelf is empty
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            You currently have no borrowed books. Head to the library catalogue to pick your next great adventure.
          </p>
          <div className="pt-2">
            <Link
              href="/books"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 transition-all"
            >
              <Compass className="w-4 h-4" />
              Explore Books to Borrow
            </Link>
          </div>
        </div>
      )}

      {/* Custom Confirm Modal for Return Book */}
      {selectedBorrowForReturn && (
        <ConfirmModal
          isOpen={Boolean(selectedBorrowForReturn)}
          title="Return Borrowed Book"
          message={`Are you ready to return "${selectedBorrowForReturn.bookTitle}"? This will return the copy to the library so another member can enjoy it.`}
          confirmText="Yes, Return Book"
          cancelText="Keep Reading"
          isDestructive={false}
          isLoading={returning}
          onConfirm={handleReturnConfirm}
          onClose={() => setSelectedBorrowForReturn(null)}
        />
      )}
    </div>
  );
}
