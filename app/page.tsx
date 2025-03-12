"use client"

import { useState, useEffect } from "react"
import { SearchDialog } from "@/components/search-dialog"
import { ThemeToggle } from "@/components/theme-toggle"
import { Search } from "lucide-react"

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Handle keyboard shortcut (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">Stock App</h1>
          <div className="flex items-center gap-4">
            <button
              className="hidden sm:flex items-center gap-2 text-gray-500 dark:text-gray-400 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
              <kbd className="ml-2 inline-flex h-5 items-center gap-1 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-1.5 font-mono text-[10px] font-medium text-gray-500 dark:text-gray-400">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
            <button
              className="sm:hidden p-2 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <h2 className="text-4xl font-bold tracking-tight">Market Analysis Platform</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-[600px]">
            Access real-time market data, advanced charting tools, and trading ideas.
          </p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => setIsSearchOpen(true)}
          >
            Search Symbols
          </button>
        </div>
      </main>

      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </div>
  )
}

