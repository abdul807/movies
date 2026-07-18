import { motion } from "framer-motion";
import { useState } from "react";
import { Eye, Star, Calendar, ChevronRight, Edit2, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { EditEntryModal } from "../edit-entry/EditEntryModal";
import { DeleteConfirmModal } from "../delete-entry/DeleteConfirmModal";

interface LibraryItemProps {
  entry: any;
  index: number;
  onDelete?: (id: number) => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20,
    },
  },
  tap: { scale: 0.96 },
};

export function LibraryItem({ entry, index, onDelete }: LibraryItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const posterUrl = entry.poster_url || null;
  const hasImage = !!posterUrl;

  const formattedDate = entry.created_at 
    ? new Date(entry.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete?.(entry.id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileTap="tap"
        className="group relative aspect-[2/3] rounded-2xl overflow-hidden bg-secondary/30 border border-border/50 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Display */}
        <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-secondary/30 to-secondary/60">
          {hasImage ? (
            <motion.img
              src={posterUrl}
              alt={entry.title}
              className="w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onError={(e) => {
                console.error('Image failed to load:', posterUrl);
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl opacity-30">
                {entry.type === "MOVIE" ? "🎬" : "📺"}
              </span>
            </div>
          )}

          {/* Gradient overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Title - always visible at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <motion.div className="space-y-1">
              <h3 className="text-white font-medium text-sm line-clamp-1 drop-shadow-lg">
                {entry.title}
              </h3>
              <div className="flex items-center gap-2 text-white/70 text-xs">
                <span>{entry.type === "MOVIE" ? "Movie" : "Series"}</span>
                {entry.genre && (
                  <>
                    <span>•</span>
                    <span>{entry.genre}</span>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Status Badge */}
        <motion.div
          className="absolute top-3 left-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Badge variant="secondary" className="text-[10px] bg-black/50 backdrop-blur-sm text-white border-white/10">
            {entry.status?.toLowerCase().replace("_", " ") || "completed"}
          </Badge>
        </motion.div>

        {/* Rating Badge */}
        {entry.rating && (
          <motion.div
            className="absolute top-3 right-3"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Badge variant="secondary" className="text-[10px] bg-black/50 backdrop-blur-sm text-white border-white/10">
              <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
              {entry.rating}/10
            </Badge>
          </motion.div>
        )}

        {/* Hover Overlay - shows on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center p-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ delay: 0.05, duration: 0.3 }}
            className="text-center w-full"
          >
            <h3 className="text-white font-medium text-lg mb-1 line-clamp-2">
              {entry.title}
            </h3>
            
            <div className="flex items-center justify-center gap-3 text-white/70 text-xs mb-3">
              <span>{entry.type === "MOVIE" ? "Movie" : "Series"}</span>
              {entry.genre && (
                <>
                  <span>•</span>
                  <span>{entry.genre}</span>
                </>
              )}
            </div>

            {entry.rating && (
              <div className="flex items-center justify-center gap-1 text-white/80 text-sm mb-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{entry.rating}/10</span>
              </div>
            )}

            {formattedDate && (
              <div className="flex items-center justify-center gap-1 text-white/50 text-xs mb-3">
                <Calendar className="w-3 h-3" />
                <span>Added {formattedDate}</span>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 mt-2">
              <motion.button
                className="text-sm text-white/80 hover:text-white flex items-center gap-1 bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditModal(true);
                }}
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </motion.button>

              <motion.button
                className="text-sm text-red-400/80 hover:text-red-400 flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 px-4 py-1.5 rounded-full transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteModal(true);
                }}
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Edit Modal */}
      <EditEntryModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        entry={entry}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        entry={entry}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}