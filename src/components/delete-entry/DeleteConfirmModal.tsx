import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: any;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteConfirmModal({
  open,
  onOpenChange,
  entry,
  onConfirm,
  isDeleting = false,
}: DeleteConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-xl border-border">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-light tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Delete Entry
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Warning message */}
            <div className="space-y-2">
              <p className="text-sm text-foreground">
                Are you sure you want to delete
              </p>
              <p className="text-base font-medium text-foreground">
                "{entry?.title || 'this entry'}"?
              </p>
              <p className="text-xs text-muted-foreground">
                This action cannot be undone. All data including the poster image will be permanently removed.
              </p>
            </div>

            {/* Entry preview */}
            {entry?.poster_url && (
              <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg border border-border/50">
                <img
                  src={entry.poster_url}
                  alt={entry.title}
                  className="w-12 h-16 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{entry.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.type === "MOVIE" ? "Movie" : "Series"} • {entry.genre || "No genre"}
                  </p>
                  {entry.rating && (
                    <p className="text-xs text-muted-foreground">
                      ⭐ {entry.rating}/10
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={onConfirm}
                disabled={isDeleting}
                className="gap-2"
              >
                {isDeleting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}