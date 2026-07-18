import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LibraryItem } from "./LibraryItem";
import { deleteEntry } from "../../lib/api";

interface LibraryProps {
  entries: any[];
}

export function Library({ entries }: LibraryProps) {
  const queryClient = useQueryClient();

  const handleDelete = async (id: number) => {
    try {
      await deleteEntry(id);
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      toast.success('Entry deleted successfully! 🗑️');
    } catch (error) {
      toast.error('Failed to delete entry');
      console.error('Delete error:', error);
    }
  };

  if (!entries?.length) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {entries.map((entry, i) => (
        <LibraryItem 
          key={entry.id} 
          entry={entry} 
          index={i} 
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}