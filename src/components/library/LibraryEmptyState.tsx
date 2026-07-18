import { motion } from "framer-motion";
import { Film, Plus } from "lucide-react";
import { Button } from "../ui/button";

export function LibraryEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-secondary/30 flex items-center justify-center mb-6">
        <Film className="w-10 h-10 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-light tracking-tight mb-2">Your watch log is empty</h2>
      <p className="text-muted-foreground text-sm max-w-sm mb-6">
        Start building your personal entertainment archive. Add your first movie or series now.
      </p>
      <Button
        onClick={() => {
          const btn = document.querySelector('[data-add-entry]');
          if (btn instanceof HTMLElement) btn.click();
        }}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Your First Entry
      </Button>
    </motion.div>
  );
}