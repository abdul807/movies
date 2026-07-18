import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { EditEntryForm } from "./EditEntryForm";

interface EditEntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: any;
}

export function EditEntryModal({ open, onOpenChange, entry }: EditEntryModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-xl border-border">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-2xl font-light tracking-tight">
            Edit Entry
          </DialogTitle>
        </DialogHeader>
        <div className="px-6 py-4">
          <EditEntryForm entry={entry} onSuccess={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}