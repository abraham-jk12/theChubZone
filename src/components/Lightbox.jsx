import { motion, AnimatePresence } from "framer-motion";

export function Lightbox({ src, alt, onClose }) {
  const open = Boolean(src);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="lb-backdrop"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.button type="button" className="lb-close" aria-label="Close" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            ×
          </motion.button>
          <motion.img
            className="lb-img"
            src={src}
            alt={alt || ""}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
