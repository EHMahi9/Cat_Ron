import React from "react";
import { BookOpen } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 dark:bg-indigo-400/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 animate-bounce">
          <BookOpen className="w-8 h-8" />
        </div>
        <div className="absolute inset-0 rounded-2xl border-2 border-indigo-600 border-t-transparent animate-spin" />
      </div>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 tracking-wide font-serif">
        Loading BookNook shelves...
      </p>
    </div>
  );
}
