import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { AddEntryModal } from "./add-entry/AddEntryModal";

export function QuickAddButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17,
        }}
      >
        <Button
          onClick={() => setOpen(true)}
          className="gap-2 rounded-full px-6 shadow-lg shadow-primary/20 relative overflow-hidden group"
          size="lg"
        >
          <motion.span
            className="absolute inset-0 bg-primary/10"
            initial={{ scale: 0, x: "-100%" }}
            whileHover={{ scale: 1, x: "0%" }}
            transition={{ duration: 0.4 }}
          />
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.3 }}
          >
            <Plus className="w-4 h-4 relative z-10" />
          </motion.div>
          <span className="relative z-10">Add Entry</span>
          <kbd className="hidden sm:inline-block ml-2 px-2 py-0.5 text-xs bg-primary-foreground/10 rounded-md font-mono relative z-10">
            ⌘K
          </kbd>
        </Button>
      </motion.div>

      <AnimatePresence>
        <AddEntryModal open={open} onOpenChange={setOpen} />
      </AnimatePresence>
    </>
  );
}