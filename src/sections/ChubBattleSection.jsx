import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAnimalImages } from "../lib/animalApi.js";

export function ChubBattleSection({ onOpenLightbox }) {
  const [pair, setPair] = useState([]);
  const [winner, setWinner] = useState(null);
  const [votes, setVotes] = useState([0, 0]);
  const [loading, setLoading] = useState(true);

  const loadBattle = useCallback(async () => {
    setLoading(true);
    const picks = await fetchAnimalImages("random", 2);
    setPair(picks);
    setWinner(null);
    setVotes([0, 0]);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadBattle();
  }, [loadBattle]);

  const vote = (index) => {
    if (winner != null) return;
    const total = 60 + Math.floor(Math.random() * 40);
    const winPct = 55 + Math.floor(Math.random() * 35);
    const losePct = 100 - winPct;
    const next = index === 0 ? [winPct, losePct] : [losePct, winPct];
    setVotes(next.map((v) => Math.round((v * total) / 100)));
    setWinner(index);
  };

  const totalVotes = votes[0] + votes[1];
  const pct = totalVotes ? votes.map((v) => Math.round((v / totalVotes) * 100)) : [0, 0];

  return (
    <>
      <motion.h2 className="page-title" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 150 }}>
        Chub Battle
      </motion.h2>
      <p className="page-lede">Pick the supreme round legend. Tap a side to cast your vote.</p>
      {loading && <p className="loading">Loading battle...</p>}
      {!loading && pair.length < 2 && <p className="loading">Not enough chubbas yet. Add more photos.</p>}
      {!loading && pair.length === 2 && (
        <div className="battle-wrap">
          <div className="battle-grid">
            {[0, 1].map((i) => (
              <motion.button
                key={pair[i].url}
                type="button"
                className={`battle-card${winner === i ? " battle-card--winner" : ""}${winner != null && winner !== i ? " battle-card--loser" : ""}`}
                onClick={() => vote(i)}
                initial={{ opacity: 0, x: i === 0 ? -28 : 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                animate={winner === i ? { scale: 1.03 } : winner != null ? { scale: 0.96, opacity: 0.7 } : {}}
              >
                <img src={pair[i].url} alt={`Battle ${pair[i].type}`} />
                <span className="battle-label">{pair[i].type.toUpperCase()}</span>
                {winner === i && (
                  <div className="battle-confetti" aria-hidden>
                    {[
                      { e: "✨", angle: -80, d: 62 },
                      { e: "🎉", angle: -100, d: 70 },
                      { e: "🐾", angle: -55, d: 58 },
                      { e: "🌸", angle: -125, d: 65 },
                      { e: "💕", angle: -90, d: 80 },
                      { e: "⭐", angle: -68, d: 72 },
                    ].map((p, ci) => (
                      <motion.span
                        key={ci}
                        className="confetti-particle"
                        initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                        animate={{
                          x: Math.cos((p.angle * Math.PI) / 180) * p.d,
                          y: Math.sin((p.angle * Math.PI) / 180) * p.d,
                          opacity: [0, 1, 1, 0],
                          scale: [0, 1.4, 1, 0.4],
                        }}
                        transition={{ duration: 1.1, delay: ci * 0.05, ease: "easeOut" }}
                      >
                        {p.e}
                      </motion.span>
                    ))}
                  </div>
                )}
              </motion.button>
            ))}
            <motion.div className="battle-vs" animate={{ scale: [1, 1.08, 1], boxShadow: ["0 0 0 rgba(201,77,122,0.2)", "0 0 18px rgba(201,77,122,0.45)", "0 0 0 rgba(201,77,122,0.2)"] }} transition={{ duration: 1.8, repeat: Infinity }}>
              VS
            </motion.div>
          </div>

          <AnimatePresence>
            {winner != null && (
              <motion.div className="battle-results" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {[0, 1].map((i) => (
                  <div className="battle-bar-row" key={`bar-${i}`}>
                    <div className="battle-bar-head">
                      <span>{i === winner ? "Winner" : "Runner-up"}</span>
                      <span>{pct[i]}%</span>
                    </div>
                    <div className="battle-bar-track">
                      <motion.div className="battle-bar-fill" initial={{ width: 0 }} animate={{ width: `${pct[i]}%` }} transition={{ duration: 0.6, delay: i * 0.08 }} />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="battle-actions">
            <motion.button type="button" className="btn-primary" whileTap={{ scale: 0.96 }} onClick={loadBattle}>
              Next Battle
            </motion.button>
            <motion.button type="button" className="restart-btn" whileTap={{ scale: 0.96 }} onClick={() => onOpenLightbox(pair[winner ?? 0].url, "Chub battle")}>
              View full image
            </motion.button>
          </div>
        </div>
      )}
    </>
  );
}
