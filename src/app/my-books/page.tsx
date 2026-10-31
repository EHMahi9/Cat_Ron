"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getBooks, deleteBook } from "@/lib/api";
import { Book } from "@/types";
import EditBookModal from "@/components/EditBookModal";
import ConfirmModal from "@/components/ConfirmModal";
import {
  Library,
  PlusCircle,
  Edit2,
  Trash2,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import toast from "react-hot-toast";

export default function MyBooksPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit modal state
  const [selectedBookForEdit, setSelectedBookForEdit] = useState<Book | null>(null);

  // Delete modal state
  const [selectedBookForDelete, setSelectedBookForDelete] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Private route check
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?callbackUrl=/my-books");
    }
  }, [session, isPending, router]);

  const loadUserBooks = async () => {
    if (!session?.user?.email) return;
    setLoading(true);
    const data = await getBooks({ email: session.user.email });
    setBooks(data);
    setLoading(false);
  };

  useEffect(() => {
    if (session?.user?.email) {
      loadUserBooks();
    }
  }, [session?.user?.email]);

  const handleDeleteConfirm = async () => {
    if (!selectedBookForDelete) return;

    setDeleting(true);
    try {
      const res = await deleteBook(selectedBookForDelete._id);
      if (res.success) {
        toast.success(`"${selectedBookForDelete.title}" was removed from the library.`);
        setBooks((prev) => prev.filter((b) => b._id !== selectedBookForDelete._id));
        setSelectedBookForDelete(null);
      } else {
        toast.error(res.message || "Failed to delete book.");
      }
    } catch {
      toast.error("Error occurred while deleting the book.");
    } finally {
      setDeleting(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-xl border-3 border-indigo-600 border-t-transparent animate-spin" />
        <p className="text-sm font-medium text-slate-500 font-serif">
          Loading your contributed books...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1.5">
            <Library className="w-3.5 h-3.5" />
            <span>My Contribution Shelf</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-serif">
            My Books
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage the titles you have added to BookNook. Edit details or remove listings.
          </p>
        </div>

        <Link
          href="/add-book"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Add Another Book
        </Link>
      </div>

      {/* Books Table / Grid */}
      {books.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/40 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  <th className="py-4 px-6">Book</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6 text-center">Available Copies</th>
                  <th className="py-4 px-6">Date Added</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {books.map((book) => (
                  <tr
                    key={book._id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {/* Book Thumbnail & Title */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200 dark:border-slate-700">
                          <Image
                            src={book.image}
                            alt={book.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="max-w-xs sm:max-w-sm">
                          <Link
                            href={`/books/${book._id}`}
                            className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1 font-serif"
                          >
                            {book.title}
                          </Link>
                          <span className="text-xs text-slate-600 dark:text-slate-400 block truncate">
                            by {book.author}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                        {book.category}
                      </span>
                    </td>

                    {/* Copies */}
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          book.copies > 0
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                        }`}
                      >
                        {book.copies}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {book.createdAt ? new Date(book.createdAt).toLocaleDateString() : "Catalog Item"}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/books/${book._id}`}
                          aria-label="View Details"
                          className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => setSelectedBookForEdit(book)}
                          aria-label="Edit Book"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => setSelectedBookForDelete(book)}
                          aria-label="Delete Book"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
            You haven't contributed any books yet
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Share your favorite stories and titles with the BookNook community so fellow readers can borrow them.
          </p>
          <div className="pt-2">
            <Link
              href="/add-book"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Add Your First Book
            </Link>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {selectedBookForEdit && (
        <EditBookModal
          book={selectedBookForEdit}
          isOpen={Boolean(selectedBookForEdit)}
          onClose={() => setSelectedBookForEdit(null)}
          onSuccess={(updatedBook) => {
            setBooks((prev) =>
              prev.map((b) => (b._id === updatedBook._id ? updatedBook : b))
            );
          }}
        />
      )}

      {/* Custom Confirm Modal for Deletion (No default browser confirm!) */}
      {selectedBookForDelete && (
        <ConfirmModal
          isOpen={Boolean(selectedBookForDelete)}
          title="Delete Book from Library"
          message={`Are you sure you want to permanently delete "${selectedBookForDelete.title}"? This action will remove it from the library catalogue.`}
          confirmText="Yes, Delete Book"
          cancelText="Cancel"
          isDestructive={true}
          isLoading={deleting}
          onConfirm={handleDeleteConfirm}
          onClose={() => setSelectedBookForDelete(null)}
        />
      )}
    </div>
  );
}
