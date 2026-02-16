"use client";

import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-lg font-semibold text-black dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">
              Memory & Media Study
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/survey" 
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition-colors"
            >
              Survey
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

