import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { fetchAnimalImages, randomChubLabel } from "../lib/animalApi.js";

export function GallerySection({ onOpenLightbox }) {
  const [type, setType] = useState("cat");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hovered, setHovered] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const imgs = await fetchAnimalImages(type, 12);
      setItems(imgs);
    } catch {
      setError(true);
      setItems([]);
    }
    setLoading(false);
  }, [type]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <motion.h2 className="page-title" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
        Round Animal Gallery
      </motion.h2>
      <p className="page-lede">Scroll through the roundest animals! Click a photo to see the full image.</p>
      <div className="gallery-controls">
        <motion.button type="button" className="btn-primary" onClick={load} whileTap={{ scale: 0.98 }}>
          🎡 Spin the Wheel - Get a New Chubba!
        </motion.button>
        <select className="animal-select" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="cat">Fat Cats</option>
          <option value="dog">Fat Dogs</option>
          <option value="sheep">Fat farm animals</option>
          <option value="guinea">Fat Guinea Pigs</option>
          <option value="random">Random</option>
        </select>
      </div>
      <div className="gallery-grid">
        {loading && <p className="loading">Loading chubbas...</p>}
        {!loading && error && <p className="loading">Oops! Couldn&apos;t load chubbas. Try again!</p>}
        {!loading && !error && items.length === 0 && (
          <div className="gallery-empty">
            No images yet! Add your own chubby animal pics:
            <br />
            <br />
            <small>
              1. Drop images into images/cat, images/dog, images/sheep, or images/guinea
              <br />
              2. Run: <code>node add-images.js</code>
            </small>
          </div>
        )}
        {!loading &&
          !error &&
          items.map((img, i) => (
            <motion.div
              key={`${img.url}-${i}`}
              className="gallery-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.42 }}
              whileHover={{ rotate: [0, -0.8, 0.8, 0], y: -3 }}
              onHoverStart={() => setHovered(i)}
              onHoverEnd={() => setHovered(null)}
            >
              <button type="button" className="image-open-btn" onClick={() => onOpenLightbox(img.url, `Chubby ${img.type}`)} aria-label="View full image">
                <img src={img.url} alt={`Chubby ${img.type}`} loading="lazy" />
              </button>
              <div className="chub-label">{randomChubLabel()}</div>
              {hovered === i && (
                <motion.div className="battle-confetti" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-hidden>
                  <span>🐾</span>
                  <span>✨</span>
                  <span>🌸</span>
                </motion.div>
              )}
            </motion.div>
          ))}
      </div>
    </>
  );
}
