import React from "react";
import Link from "next/link";
import { getBooks } from "@/lib/api";
import BannerSlider from "@/components/BannerSlider";
import BookCard from "@/components/BookCard";
import {
  Sparkles,
  ArrowRight,
  BookOpenCheck,
  Search,
  BookMarked,
  RotateCcw,
  Star,
  Quote,
  TrendingUp,
} from "lucide-react";

export const revalidate = 0; // Fresh dynamic data on every request

export default async function HomePage() {
  // Fetch latest 6 books from backend
  const newArrivals = await getBooks({ sort: "newest", limit: 6 });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-16 sm:space-y-24">
      {/* 1. Banner / Slider (Swiper.js) */}
      <BannerSlider />

      {/* 2. New Arrivals (Dynamic 6 Books) */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Fresh Off The Shelves</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-serif tracking-tight">
              New Arrivals
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Explore the newest titles added by our community of book lovers.
            </p>
          </div>

          <Link
            href="/books"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 group"
          >
            <span>See All Books</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 6 Cards Grid (3 cards per row on desktop) */}
        {newArrivals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {newArrivals.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <BookOpenCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
              No books found in the catalogue yet.
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Be the first reader to add a book to BookNook!
            </p>
            <Link
              href="/add-book"
              className="inline-block mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Add First Book
            </Link>
          </div>
        )}

        {/* See All Books Center Button */}
        <div className="text-center pt-4">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm text-white bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-700 shadow-md hover:shadow-xl transition-all"
          >
            <span>Explore Entire Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 3. Extra Section 1: How Borrowing Works */}
      <section className="rounded-3xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 lg:p-16">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Simple & Transparent
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white font-serif">
            How Borrowing Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Borrowing a book on BookNook takes less than a minute. Here is our three-step seamless process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm relative group hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Search className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 mb-2">
              Step 01
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-serif">
              Discover & Select
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Browse our diverse community catalogue by category, author, or title. Pick the next story that catches your eye.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm relative group hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <BookMarked className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 mb-2">
              Step 02
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-serif">
              Instant Borrowing
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Click “Borrow”, confirm your return date, and the book is automatically added to your personal borrowing shelf.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm relative group hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <RotateCcw className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 mb-2">
              Step 03
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-serif">
              Read & Return
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Enjoy your reading journey. When you are done, return it with one click from “My Borrows” so another reader can enjoy it.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Extra Section 2: Reader Reviews & Testimonials */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            <TrendingUp className="w-4 h-4" />
            <span>Community Voices</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-serif">
            What Our Readers Say
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real feedback from book enthusiasts who use BookNook every single day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Review 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <Quote className="w-6 h-6 text-indigo-400/40 mb-2" />
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                “BookNook brought the charm of a neighborhood library to my screen. Borrowing books and keeping track of my reading deadlines has never been this satisfying!”
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/60">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                TS
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Tasmia Sultana
                </h4>
                <p className="text-xs text-slate-400">Literature Enthusiast</p>
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <Quote className="w-6 h-6 text-indigo-400/40 mb-2" />
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                “Adding my personal book collection was so effortless. I love seeing other passionate members borrow my favorite science and history books.”
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/60">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center">
                MR
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Mahir Rahman
                </h4>
                <p className="text-xs text-slate-400">Science Researcher</p>
              </div>
            </div>
          </div>

          {/* Review 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <Quote className="w-6 h-6 text-indigo-400/40 mb-2" />
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                “The real-time copy tracking and return system is brilliant. No duplicate borrows, no confusion—just pure, uninterrupted reading joy.”
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/60">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-sm flex items-center justify-center">
                AF
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Anika Farzana
                </h4>
                <p className="text-xs text-slate-400">Fiction Writer</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
