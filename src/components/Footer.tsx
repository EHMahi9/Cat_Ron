import React from "react";
import Link from "next/link";
import { BookOpen, Mail, Phone, MapPin, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-100 text-slate-700 border-t border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-serif">
                Book<span className="text-indigo-600 dark:text-indigo-400">Nook</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              BookNook is a cozy online community library. Explore timeless literature, share your favorite books, and borrow stories that ignite imagination.
            </p>
            <div className="pt-2 flex items-center gap-3">
              {/* New 𝕏 Logo as strictly required */}
              <a
                href="https://x.com/EHMahi9"
                target="_blank"
                rel="noreferrer"
                aria-label="X (formerly Twitter)"
                className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 dark:bg-slate-800 dark:border-slate-700/60 dark:text-slate-300 dark:hover:bg-indigo-600 dark:hover:text-white transition-colors flex items-center justify-center shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/EHMahi9"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub profile"
                className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 dark:bg-slate-800 dark:border-slate-700/60 dark:text-slate-300 dark:hover:bg-indigo-600 dark:hover:text-white transition-colors flex items-center justify-center shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/ebnul-hasan-mahi/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn profile"
                className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 dark:bg-slate-800 dark:border-slate-700/60 dark:text-slate-300 dark:hover:bg-indigo-600 dark:hover:text-white transition-colors flex items-center justify-center shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>

              {/* Personal Portfolio */}
              <a
                href="https://www.ebnulhasanmahi.me/"
                target="_blank"
                rel="noreferrer"
                aria-label="Personal Portfolio Website"
                className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 dark:bg-slate-800 dark:border-slate-700/60 dark:text-slate-300 dark:hover:bg-indigo-600 dark:hover:text-white transition-colors flex items-center justify-center shadow-xs"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold text-base mb-4 tracking-wide uppercase font-serif">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/books" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Browse All Books
                </Link>
              </li>
              <li>
                <Link href="/add-book" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Contribute a Book
                </Link>
              </li>
              <li>
                <Link href="/my-borrows" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Borrowed Shelf
                </Link>
              </li>
            </ul>
          </div>

          {/* Library Categories */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold text-base mb-4 tracking-wide uppercase font-serif">
              Genres & Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/books?category=Fiction" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Classic & Contemporary Fiction
                </Link>
              </li>
              <li>
                <Link href="/books?category=Science" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Science & Technology
                </Link>
              </li>
              <li>
                <Link href="/books?category=History" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  History & Human Culture
                </Link>
              </li>
              <li>
                <Link href="/books?category=Kids" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Children & Young Adults
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold text-base mb-4 tracking-wide uppercase font-serif">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <span>Daffodil Smart City, Dhaka 1216</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Phone className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <a href="tel:01879450876" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  01879450876
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <a href="mailto:ebnulhasanmahi001@gmail.com" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  ebnulhasanmahi001@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} BookNook. All rights reserved. Made with passion for readers.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer">
              Terms of Borrowing
            </span>
            <span className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer">
              Code of Conduct
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
