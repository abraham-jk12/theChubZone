import { useState, useEffect, useRef, useCallback } from "react";
import { fetchAnimalImages, loadAnimalDatabase } from "../lib/animalApi.js";

function useReveal() {
  useEffect(() => {
    const check = () => {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
        const { top, bottom } = el.getBoundingClientRect();
        if (top < window.innerHeight && bottom > 0) el.classList.add("is-visible");
      });
    };
    const t1 = setTimeout(check, 50);
    const t2 = setTimeout(check, 300);
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);
}

const CAROUSEL = [
  { id: "cat-a",    label: "fat cat",       tag: "unit",   tint: "#ffd6c2", type: "cat"    },
  { id: "guinea-a", label: "capybara",      tag: "blob",   tint: "#f6dcc4", type: "guinea" },
  { id: "dog-a",    label: "fat pug",       tag: "tank",   tint: "#ffe0e7", type: "dog"    },
  { id: "sheep-a",  label: "plump sheep",   tag: "loaf",   tint: "#e3d4f5", type: "sheep"  },
  { id: "guinea-b", label: "round hamster", tag: "muffin", tint: "#fde2c0", type: "guinea" },
  { id: "cat-b",    label: "baby chubster", tag: "peach",  tint: "#dbe8f7", type: "cat"    },
];

const RATINGS = [9.1, 9.2, 9.3, 9.4, 9.5, 9.6];

export function LandingPage({ onNavigateSection, onOpenLightbox }) {
  const [idx, setIdx] = useState(0);
  const [orbImgs, setOrbImgs]     = useState({});
  const [galleryImgs, setGalleryImgs] = useState([]);
  const [totalCount, setTotalCount]   = useState("—");
  const heroRef = useRef(null);
  const [par, setPar]       = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useReveal();

  // auto-rotate carousel
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % CAROUSEL.length), 2600);
    return () => clearInterval(t);
  }, []);

  // mouse parallax
  const onMove = useCallback((e) => {
    const r = heroRef.current?.getBoundingClientRect();
    if (!r) return;
    setPar({
      x: ((e.clientX - r.left) / r.width  - 0.5) * 2,
      y: ((e.clientY - r.top)  / r.height - 0.5) * 2,
    });
  }, []);

  // scroll parallax for clouds
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // load real images
  useEffect(() => {
    Promise.all(
      ["cat", "dog", "sheep", "guinea"].map(async (type) => {
        const imgs = await fetchAnimalImages(type, 2);
        return [type, imgs.map((i) => i.url)];
      })
    ).then((entries) => setOrbImgs(Object.fromEntries(entries)));

    fetchAnimalImages("random", 6).then(setGalleryImgs).catch(() => {});

    loadAnimalDatabase().then((db) => {
      const n = ["cat", "dog", "sheep", "guinea"].reduce((s, t) => s + (db[t]?.length ?? 0), 0);
      if (n > 0) setTotalCount(n.toLocaleString());
    });
  }, []);

  // trigger reveal after gallery cards appear
  useEffect(() => {
    if (galleryImgs.length === 0) return;
    const t = setTimeout(() => {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
        const { top, bottom } = el.getBoundingClientRect();
        if (top < window.innerHeight && bottom > 0) el.classList.add("is-visible");
      });
    }, 80);
    return () => clearTimeout(t);
  }, [galleryImgs]);

  return (
    <div className="v1-root" onMouseMove={onMove}>
      {/* — background — */}
      <div className="v1-sky" />
      <div className="v1-cloud v1-cloud--a" style={{ transform: `translate(${par.x * -14}px,${par.y * -8  + scrollY * -0.15}px)` }} />
      <div className="v1-cloud v1-cloud--b" style={{ transform: `translate(${par.x *  18}px,${par.y *  10 + scrollY * -0.25}px)` }} />
      <div className="v1-cloud v1-cloud--c" style={{ transform: `translate(${par.x * -22}px,${par.y *   6 + scrollY * -0.18}px)` }} />
      <div className="v1-cloud v1-cloud--d" style={{ transform: `translate(${par.x *  10}px,${par.y * -14 + scrollY * -0.3 }px)` }} />
      {Array.from({ length: 14 }, (_, i) => (
        <span
          key={i}
          className="v1-sparkle"
          style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`, animationDelay: `${(i * 0.4) % 4}s` }}
        />
      ))}

      {/* — hero — */}
      <section className="v1-hero" ref={heroRef}>
        <div className="v1-eyebrow">
          <span className="v1-eyebrow-dot" />
          <span>The round side of the internet</span>
          <span className="v1-eyebrow-dot" />
        </div>

        <h1 className="v1-h1">
          <span className="v1-h1-word v1-h1-word--1">welcome</span>
          <span className="v1-h1-word v1-h1-word--2">to the</span>
          <span className="v1-h1-word v1-h1-word--3 v1-h1-word--accent">chub&nbsp;zone</span>
        </h1>

        <p className="v1-sub">
          An appreciation society for round animals<br />
        </p>

        {/* orb carousel */}
        <div className="v1-stage" style={{ transform: `translate(${par.x * 6}px,${par.y * 4}px)` }}>
          <div className="v1-stage-ring" />
          <div className="v1-stage-ring v1-stage-ring--2" />
          <div className="v1-stage-ring v1-stage-ring--3" />

          {CAROUSEL.map((a, i) => {
            const active  = i === idx;
            const offset  = i - idx;
            const pool    = orbImgs[a.type] ?? [];
            const imgUrl  = pool[i % Math.max(pool.length, 1)] ?? null;

            return (
              <div
                key={a.id}
                className={`v1-orb${active ? " is-active" : ""}`}
                style={{
                  "--tint": a.tint,
                  transform: `translateX(${offset * 240}px) scale(${active ? 1 : 0.55}) rotate(${offset * 6}deg)`,
                  opacity:   Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.35,
                  zIndex:    10 - Math.abs(offset),
                }}
              >
                <div
                  className="v1-orb-ph"
                  style={imgUrl ? { backgroundImage: `url(${imgUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
                >
                  {!imgUrl && <span className="v1-orb-label">{a.label}</span>}
                </div>
                {/* {active && <div className="v1-orb-tag">{a.label}</div>} */}
              </div>
            );
          })}

          <button className="v1-arrow v1-arrow--l" onClick={() => setIdx((i) => (i - 1 + CAROUSEL.length) % CAROUSEL.length)}>‹</button>
          <button className="v1-arrow v1-arrow--r" onClick={() => setIdx((i) => (i + 1) % CAROUSEL.length)}>›</button>
        </div>

        {/* CTAs */}
        <div className="v1-ctas">
          <button className="v1-cta v1-cta--primary" onClick={() => onNavigateSection("gallery")}>
            <span className="v1-cta-shine" />
            browse the round ones
          </button>
          <button className="v1-cta v1-cta--ghost" onClick={() => onNavigateSection("rate")}>
            i&apos;m here to rate →
          </button>
        </div>

        {/* stats */}
        <div className="v1-stats">
          <div><b>{totalCount}</b><span>animals certified round</span></div>
          <div className="v1-stats-sep" />
          <div><b>9.6/10</b><span>avg. chub rating</span></div>
          <div className="v1-stats-sep" />
          <div><b>0</b><span>fit ones allowed</span></div>
        </div>
      </section>

      {/* — gallery preview — */}
      <section className="v1-section">
        <div className="v1-section-head">
          <div>
            <h2 className="v1-h2 reveal reveal--left">
              round gallery <span className="v1-h2-em"></span>
            </h2>
            <p className="v1-section-sub reveal reveal--left" style={{ "--i": 1 }}>
              six (6) fresh rounds, hand-picked by the council.
            </p>
          </div>
          <button className="v1-pill v1-pill--ghost reveal reveal--right" onClick={() => onNavigateSection("gallery")}>
            view all →
          </button>
        </div>

        <div className="v1-grid">
          {(galleryImgs.length > 0
            ? galleryImgs
            : Array.from({ length: 6 }, (_, i) => ({ url: null, type: ["cat", "guinea pig", "doggo", "sheep"][i % 4] }))
          ).map((img, i) => {
            const meta = CAROUSEL[i % CAROUSEL.length];
            return (
              <article key={i} className="v1-card reveal reveal--rotate" style={{ "--i": i }}>
                <div className="v1-card-ph" style={img.url ? {} : { background: meta.tint }}>
                  {img.url ? (
                    <button
                      type="button"
                      className="v1-card-img-btn"
                      onClick={() => onOpenLightbox(img.url, meta.label)}
                      aria-label="View full image"
                    >
                      <img src={img.url} alt={meta.label} loading="lazy" />
                    </button>
                  ) : (
                    <span className="v1-card-label">{meta.label}</span>
                  )}
                  <span className="v1-card-rating">{RATINGS[i].toFixed(1)}</span>
                </div>
                <div className="v1-card-meta">
                  <span className="v1-card-name">{img.type || meta.label}</span>
                  <span className="v1-card-tag">·{meta.tag}·</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* — testimonials — */}
      <section className="v1-section v1-section--alt">
        <h2 className="v1-h2 v1-h2--center reveal">what the chubs are saying</h2>
        <p className="v1-section-sub v1-section-sub--center reveal" style={{ "--i": 1 }}>
          unsolicited statements from our verified members
        </p>
        <div className="v1-quotes">
          <figure className="v1-quote reveal" style={{ "--i": 0 }}>
            <blockquote>&ldquo;i ate, then i sit, then i plop.&rdquo;</blockquote>
            <figcaption>— mr. biscuit, fat cat, top 1%</figcaption>
          </figure>
          <figure className="v1-quote v1-quote--lift reveal" style={{ "--i": 1 }}>
            <blockquote>&ldquo;i&apos;m not chubby. i&apos;m gravity-enhanced.&rdquo;</blockquote>
            <figcaption>— susan, capybara, council elder</figcaption>
          </figure>
          <figure className="v1-quote reveal" style={{ "--i": 2 }}>
            <blockquote>&ldquo;finally a website that gets it. i am rounf. i am proud.&rdquo;</blockquote>
            <figcaption>— dave, plump pigeon, anonymous</figcaption>
          </figure>
        </div>
      </section>

      {/* — footer — */}
      <footer className="v1-foot">
        <div className="v1-foot-big reveal">be round. stay round.</div>
        <div className="v1-foot-meta reveal" style={{ "--i": 1 }}>
          <span>chubzone © 2026</span>
          <span>·</span>
          <span>no animals were dieted in the making of this site</span>
        </div>
      </footer>
    </div>
  );
}
