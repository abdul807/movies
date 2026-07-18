import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { X } from "lucide-react";

interface FiltersProps {
  filters: { type?: string; genre?: string; status?: string };
  onFiltersChange: (filters: any) => void;
}

const genres = [
  "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary",
  "Drama", "Family", "Fantasy", "Horror", "Musical", "Mystery",
  "Romance", "Sci-Fi", "Thriller", "War", "Western"
];
const statuses = ["COMPLETED", "WATCHING", "PLAN_TO_WATCH", "DROPPED"];

export function Filters({ filters, onFiltersChange }: FiltersProps) {
  const hasFilters = filters.type || filters.genre || filters.status;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-2"
    >
      <Select
        value={filters.type}
        onValueChange={(v) => onFiltersChange({ ...filters, type: v })}
      >
        <SelectTrigger className="w-[130px] h-10 rounded-xl bg-secondary/30 border-border/50">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="MOVIE">Movies</SelectItem>
          <SelectItem value="SERIES">Series</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.genre}
        onValueChange={(v) => onFiltersChange({ ...filters, genre: v })}
      >
        <SelectTrigger className="w-[130px] h-10 rounded-xl bg-secondary/30 border-border/50">
          <SelectValue placeholder="Genre" />
        </SelectTrigger>
        <SelectContent>
          {genres.map((g) => (
            <SelectItem key={g} value={g}>{g}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status}
        onValueChange={(v) => onFiltersChange({ ...filters, status: v })}
      >
        <SelectTrigger className="w-[130px] h-10 rounded-xl bg-secondary/30 border-border/50">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((s) => (
            <SelectItem key={s} value={s}>{s.toLowerCase().replace("_", " ")}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <button
          onClick={() => onFiltersChange({ type: undefined, genre: undefined, status: undefined })}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <X className="w-3 h-3" /> Clear
        </button>
      )}
    </motion.div>
  );
}