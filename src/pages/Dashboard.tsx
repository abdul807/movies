import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { DashboardStats } from "../components/dashboard/DashboardStats";
import { Library } from "../components/library/Library";
import { LibraryEmptyState } from "../components/library/LibraryEmptyState";
import { QuickAddButton } from "../components/QuickAddButton";
import { SearchBar } from "../components/search/SearchBar";
import { Filters } from "../components/filters/Filters";
import { Skeleton } from "../components/ui/skeleton";
import { ThemeToggle } from "../components/ThemeToggle";
import { getEntries, getStats } from "../lib/api";

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ 
    type: undefined as string | undefined, 
    genre: undefined as string | undefined, 
    status: undefined as string | undefined 
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });

  const { data: entries, isLoading: entriesLoading } = useQuery({
    queryKey: ["entries", filters, searchQuery],
    queryFn: getEntries,
  });

  const filtered = entries?.filter((e: any) => {
    if (searchQuery && !e.title.toLowerCase().includes(searchQuery.toLowerCase()) && !e.genre?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filters.type && e.type !== filters.type) return false;
    if (filters.genre && e.genre !== filters.genre) return false;
    if (filters.status && e.status !== filters.status) return false;
    return true;
  }) || [];

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-1 ">Alabama's Watch</h1>
            <p className="text-muted-foreground text-sm">My personal entertainment archive</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <QuickAddButton />
          </div>
        </motion.div>

        {/* Stats */}
        {statsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : (
          <DashboardStats stats={stats} />
        )}

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <Filters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Library */}
        {entriesLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3] rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <LibraryEmptyState />
        ) : (
          <Library entries={filtered} />
        )}
      </div>
    </main>
  );
}