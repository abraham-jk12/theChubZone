import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { LandingPage } from "./landing/LandingPage.jsx";
import { Lightbox } from "./components/Lightbox.jsx";
import { QuizSection } from "./sections/QuizSection.jsx";
import { GallerySection } from "./sections/GallerySection.jsx";
import { RateSection } from "./sections/RateSection.jsx";
import { FactsSection } from "./sections/FactsSection.jsx";
import { ChubBattleSection } from "./sections/ChubBattleSection.jsx";

const TABS = [
  { id: "quiz",    label: "chub-o-meter" },
  { id: "gallery", label: "gallery" },
  { id: "rate",    label: "rate the chub" },
  { id: "facts",   label: "facts" },
  { id: "battle",  label: "chub battle" },
];

export default function App() {
  const [tab, setTab] = useState("home");
  const [lightbox, setLightbox] = useState({ src: null, alt: "" });
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.2 });

  const openLightbox  = useCallback((src, alt) => setLightbox({ src, alt: alt ?? "" }), []);
  const closeLightbox = useCallback(() => setLightbox({ src: null, alt: "" }), []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") closeLightbox(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeLightbox]);

  const isHome = tab === "home";

  return (
    <div className="app-root">
      <motion.div className="scroll-progress" style={{ scaleX: smoothProgress }} />

      <header className="app-header">
        <div className="app-header-inner">
          {/* logo */}
          <button
            type="button"
            className="app-brand"
            onClick={() => setTab("home")}
            aria-label="The Chub Zone home"
          >
            <span className="app-brand-blob" aria-hidden />
            <span className="app-brand-text">
              chub<span className="app-brand-dot">·</span>zone
            </span>
          </button>

          {/* nav */}
          <nav className="app-nav" aria-label="Main">
            {TABS.map((t) => (
              <motion.button
                key={t.id}
                type="button"
                className={`nav-pill${tab === t.id ? " nav-pill--active" : ""}`}
                onClick={() => setTab(t.id)}
                aria-current={tab === t.id ? "page" : undefined}
                whileTap={{ scale: 0.94, y: 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 20 }}
              >
                {t.label}
              </motion.button>
            ))}
          </nav>
        </div>
      </header>

      <main className="app-main">
        <AnimatePresence mode="wait">
          {isHome ? (
            <motion.div
              key="home"
              className="app-route"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <LandingPage onNavigateSection={setTab} onOpenLightbox={openLightbox} />
            </motion.div>
          ) : (
            <motion.div
              key={tab}
              className="app-route app-route--page"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="page-shell">
                {tab === "quiz"    && <QuizSection />}
                {tab === "gallery" && <GallerySection onOpenLightbox={openLightbox} />}
                {tab === "rate"    && <RateSection    onOpenLightbox={openLightbox} />}
                {tab === "facts"   && <FactsSection />}
                {tab === "battle"  && <ChubBattleSection onOpenLightbox={openLightbox} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* paws only show on section pages, not the landing */}
      {!isHome && (
        <motion.footer
          className="footer-paws"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {["🐾", "🐾", "🐾", "🐾", "🐾"].map((paw, i) => (
            <motion.span
              key={`paw-${i}`}
              animate={{ x: [0, 6, 0], y: [0, -3, 0] }}
              transition={{ duration: 1.6, delay: i * 0.1, repeat: Infinity }}
            >
              {paw}
            </motion.span>
          ))}
        </motion.footer>
      )}

      <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={closeLightbox} />
    </div>
  );
}
