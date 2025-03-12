"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import useDebounce from "@/hooks/use-debounce"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Symbol {
  id: string
  symbol: string
  name: string
  type: string
  exchange: string
  category: string
  icon?: React.ReactNode
  country?: string
}

// Sample data for demonstration
const sampleSymbols: Symbol[] = [
  { id: "1", symbol: "AAPL", name: "APPLE INC.", type: "stock", exchange: "NASDAQ", category: "Stocks", country: "US" },
  {
    id: "2",
    symbol: "MSFT",
    name: "MICROSOFT CORPORATION",
    type: "stock",
    exchange: "NASDAQ",
    category: "Stocks",
    country: "US",
  },
  {
    id: "3",
    symbol: "BTCUSD",
    name: "BITCOIN / U.S. DOLLAR",
    type: "crypto",
    exchange: "Coinbase",
    category: "Crypto",
    country: "US",
  },
  { id: "4", symbol: "EURUSD", name: "EURO/US DOLLAR", type: "forex", exchange: "FXCM", category: "Forex" },
  { id: "5", symbol: "XAUUSD", name: "GOLD", type: "commodity", exchange: "OANDA", category: "Commodities" },
  {
    id: "6",
    symbol: "SPY",
    name: "SPDR S&P 500 ETF TRUST",
    type: "etf",
    exchange: "NYSE Arca",
    category: "Funds",
    country: "US",
  },
  {
    id: "7",
    symbol: "TSLA",
    name: "TESLA, INC.",
    type: "stock",
    exchange: "NASDAQ",
    category: "Stocks",
    country: "US",
  },
  {
    id: "8",
    symbol: "ETHUSD",
    name: "ETHEREUM / U.S. DOLLAR",
    type: "crypto",
    exchange: "Binance",
    category: "Crypto",
  },
  { id: "9", symbol: "SPX", name: "S&P 500", type: "index", exchange: "SP", category: "Indices", country: "US" },
  {
    id: "10",
    symbol: "NQ",
    name: "E-MINI NASDAQ-100 FUTURES",
    type: "futures",
    exchange: "CME",
    category: "Futures",
    country: "US",
  },
]

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [results, setResults] = useState<Symbol[]>(sampleSymbols)
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const debouncedQuery = useDebounce(query, 300)

  // Handle click outside to close dialog
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, onOpenChange])

  // Handle ESC key to close dialog
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [open, onOpenChange])

  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [open])

  // Filter results based on search query
  useEffect(() => {
    if (!debouncedQuery) {
      setResults(sampleSymbols)
      return
    }

    const filtered = sampleSymbols.filter((item) => {
      const matchesQuery =
        item.symbol.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(debouncedQuery.toLowerCase())

      const matchesCategory = activeCategory === "all" || item.category.toLowerCase() === activeCategory.toLowerCase()

      return matchesQuery && matchesCategory
    })

    setResults(filtered)
  }, [debouncedQuery, activeCategory])

  const handleSymbolClick = (item: Symbol) => {
    // Show alert with company information
    alert(
      `Selected: ${item.symbol}\nName: ${item.name}\nExchange: ${item.exchange}\nType: ${item.type}${item.country ? `\nCountry: ${item.country}` : ""}`,
    )

    // Close the dialog
    onOpenChange(false)
  }

  const categories = [
    { id: "all", label: "All" },
    { id: "stocks", label: "Stocks" },
    { id: "funds", label: "Funds" },
    { id: "futures", label: "Futures" },
    { id: "forex", label: "Forex" },
    { id: "crypto", label: "Crypto" },
  ]

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-16 overflow-y-auto">
      <div
        ref={dialogRef}
        className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-[800px] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center border-b border-gray-200 dark:border-gray-800 p-4">
          <Search className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Symbol, eg. AAPL"
            className="flex-1 bg-transparent border-0 outline-none text-base text-gray-900 dark:text-gray-100"
          />
          <button
            onClick={() => onOpenChange(false)}
            className="ml-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-800">
          <div className="h-12 px-4 flex items-center">
            <span className="font-medium text-gray-900 dark:text-gray-100">Symbols</span>
          </div>
        </div>

        <div>
          <div className="flex overflow-x-auto py-2 px-4 border-b border-gray-200 dark:border-gray-800">
            {categories.map((category) => (
              <button
                key={category.id}
                className={cn(
                  "mr-2 px-3 py-1 rounded-full text-sm font-medium focus:outline-none",
                  activeCategory === category.id
                    ? "bg-blue-500 text-white"
                    : "bg-transparent border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                )}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {results.length > 0 ? (
              <ul className="py-2">
                {results.map((item) => (
                  <li
                    key={item.id}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-center justify-between"
                    onClick={() => handleSymbolClick(item)}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                        <span className="text-xs font-medium text-blue-800 dark:text-blue-200">
                          {item.symbol.substring(0, 2)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{item.symbol}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{item.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">{item.type}</span>
                      <span className="font-medium text-sm text-gray-700 dark:text-gray-300">{item.exchange}</span>
                      {item.country && (
                        <div className="ml-2 w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-[10px] text-gray-700 dark:text-gray-300">{item.country}</span>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">No results found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

