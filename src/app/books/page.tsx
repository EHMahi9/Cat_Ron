import React from "react";
import type { Metadata } from "next";
import { getBooks } from "@/lib/api";
import BookCard from "@/components/BookCard";
import Link from "next/link";
import { Search, Compass, BookOpen, SlidersHorizontal } from "lucide-react";

export const metadata: Metadata = {
  title: "BookNook | All Books",
  description: "Browse our comprehensive library collection across fiction, science, history, kids, and more.",
};

export const revalidate = 0;

interface AllBooksPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
  }>;
}

const categories = ["All", "Fiction", "Science", "History", "Kids", "Others"];

export default async function AllBooksPage({ searchParams }: AllBooksPageProps) {
  const { category = "All", search = "", sort = "newest" } = await searchParams;

  const books = await getBooks({
    category: category === "All" ? undefined : category,
    search: search || undefined,
    sort,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <Compass className="w-3.5 h-3.5" />
          <span>Library Catalogue</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-serif">
          All Books
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Discover hand-picked literature across diverse genres. Click on any title to view details and borrow for your shelf.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
        {/* Search and Sort row */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
          {/* Search Input Form */}
          <form method="GET" className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search books by title or author..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-500 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            />
            {category && category !== "All" && (
              <input type="hidden" name="category" value={category} />
            )}
            {sort && <input type="hidden" name="sort" value={sort} />}
          </form>

          {/* Sort Dropdown */}
          <form method="GET" className="w-full sm:w-auto flex items-center gap-2">
            {search && <input type="hidden" name="search" value={search} />}
            {category && category !== "All" && (
              <input type="hidden" name="category" value={category} />
            )}
            <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              name="sort"
              defaultValue={sort}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="title-asc">Sort: Title (A - Z)</option>
              <option value="title-desc">Sort: Title (Z - A)</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Apply
            </button>
          </form>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = category === cat;
            return (
              <Link
                key={cat}
                href={`/books?category=${encodeURIComponent(cat)}${
                  search ? `&search=${encodeURIComponent(search)}` : ""
                }${sort ? `&sort=${encodeURIComponent(sort)}` : ""}`}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3 cards per row on desktop (Grid layout with equal image sizes and equal height cards) */}
      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center rounded-3xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
            No Books Found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            We could not find any books matching your current search or category filter. Try resetting filters.
          </p>
          <div className="pt-2">
            <Link
              href="/books"
              className="inline-block px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Reset All Filters
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
