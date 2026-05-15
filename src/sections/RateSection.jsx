import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAnimalImages } from "../lib/animalApi.js";

const RATINGS = [
  "1/10 - Barely Round",
  "2/10 - Slightly Chubby",
  "3/10 - Getting There",
  "4/10 - Moderately Round",
  "5/10 - Moderately Chubby",
  "6/10 - Pretty Round",
  "7/10 - Very Chubby",
  "8/10 - Extremely Round",
  "9/10 - chubba chubba",
  "10/10 - chubba chubba chubba chub!",
];

export function RateSection({ onOpenLightbox }) {
  const [slider, setSlider] = useState(5);
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const imgs = await fetchAnimalImages("random", 1);
      setAnimal(imgs[0] || null);
    } catch {
      setError(true);
      setAnimal(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <motion.h2 className="page-title" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
        Rate the Chub
      </motion.h2>
      <p className="page-lede">How round is this chubba? Click the photo for a full-size view.</p>
      <div className="rate-container">
        <div className="rate-animal">
          {loading && <p className="loading">Loading a chubba...</p>}
          {!loading && error && <p className="loading">Oops! Couldn&apos;t load a chubba.</p>}
          {!loading && !error && animal && (
            <motion.div className="rate-frame" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <button type="button" className="image-open-btn rate-open-btn" onClick={() => onOpenLightbox(animal.url, "Rate this chubba")} aria-label="View full image">
                <img src={animal.url} alt="Rate this chubba" />
              </button>
            </motion.div>
          )}
          {!loading && !error && !animal && (
            <p className="loading">
              No images yet! Add pics to images/ folders and run <code>node add-images.js</code>
            </p>
          )}
        </div>
        <div className="rate-controls">
          <label htmlFor="chub-slider">Chub Level:</label>
          <div className="slider-container">
            <span className="slider-label">A little round</span>
            <input id="chub-slider" type="range" min={1} max={10} value={slider} className="chub-slider" onChange={(e) => setSlider(Number(e.target.value))} />
            <span className="slider-label">chubba chubba chub</span>
          </div>
          <div className="chub-rating">Rating: {RATINGS[slider - 1]}</div>
          <motion.button
            type="button"
            className="btn-primary rate-new"
            whileTap={{ scale: 0.99 }}
            whileHover={{ rotate: [0, -1, 1, 0] }}
            onClick={() => {
              setShowToast(true);
              window.setTimeout(() => setShowToast(false), 1500);
            }}
          >
            Submit Rating
          </motion.button>
          <motion.button
            type="button"
            className="btn-primary rate-new rate-new-secondary"
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              setSlider(5);
              load();
            }}
          >
            Get Another Chubba
          </motion.button>
          <AnimatePresence>
            {showToast && (
              <>
                <motion.div className="rate-toast" initial={{ opacity: 0, y: 8, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: "spring", stiffness: 340, damping: 20 }}>
                  So Chubby! 🎉
                </motion.div>
                <div className="rate-confetti" aria-hidden>
                  {[
                    { e: "✨", x: -50, y: -55 },
                    { e: "🎉", x: 50, y: -50 },
                    { e: "🐾", x: 0, y: -65 },
                    { e: "🌸", x: -30, y: -42 },
                    { e: "💕", x: 30, y: -48 },
                    { e: "⭐", x: -60, y: -30 },
                    { e: "✨", x: 60, y: -35 },
                  ].map((p, ci) => (
                    <motion.span
                      key={ci}
                      className="confetti-particle"
                      style={{ position: "absolute", left: "50%", top: "0" }}
                      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                      animate={{ x: p.x, y: p.y, opacity: [0, 1, 1, 0], scale: [0, 1.3, 1, 0.4] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.0, delay: ci * 0.05, ease: "easeOut" }}
                    >
                      {p.e}
                    </motion.span>
                  ))}
                </div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
