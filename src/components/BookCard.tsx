import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Book } from "@/types";
import { BookOpen, User, Layers } from "lucide-react";

interface BookCardProps {
  book: Book;
}

const categoryColors: Record<string, string> = {
  Fiction: "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  Science: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  History: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  Kids: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  Others: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
};

export default function BookCard({ book }: BookCardProps) {
  const categoryClass =
    categoryColors[book.category] ||
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";

  const isOutOfStock = typeof book.copies === "number" && book.copies <= 0;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      {/* Book Cover Image container with fixed aspect ratio */}
      <div className="relative w-full h-64 sm:h-72 bg-slate-100 dark:bg-slate-900 overflow-hidden">
        <Image
          src={book.image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800"}
          alt={book.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Category Badge */}
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md ${categoryClass}`}
        >
          {book.category}
        </span>

        {/* Copies Availability Badge */}
        <span
          className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-md ${
            isOutOfStock
              ? "bg-rose-500/90 text-white"
              : "bg-emerald-600/90 text-white"
          }`}
        >
          {isOutOfStock ? "Out of Stock" : `${book.copies} Copies Available`}
        </span>
      </div>

      {/* Book Metadata & Action */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors font-serif">
            {book.title}
          </h3>

          <p className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 mt-1.5 font-medium">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{book.author}</span>
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">
            {book.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-700/60">
          <Link
            href={`/books/${book._id}`}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all focus:outline-none"
          >
            <BookOpen className="w-4 h-4" />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
