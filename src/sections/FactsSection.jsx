import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { animalFacts } from "../data/animalFacts.js";

export function FactsSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(Math.floor(Math.random() * animalFacts.length));
  }, []);

  const next = () => setIndex((i) => (i + 1) % animalFacts.length);

  return (
    <>
      <motion.h2 className="page-title" initial={{ opacity: 0, x: -22 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
        Animal Facts
      </motion.h2>
      <p className="page-lede">
        Real biology and care facts about cats, dogs, guinea pigs, and sheep—sources include universities, zoos, and
        veterinary references.
      </p>
      <motion.div className="fact-card" initial={{ opacity: 0, rotateY: 90 }} whileInView={{ opacity: 1, rotateY: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            className="fact-text"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {animalFacts[index]}
          </motion.p>
        </AnimatePresence>
      </motion.div>
      <div className="fact-actions">
        <motion.button type="button" className="btn-primary" onClick={next} whileTap={{ scale: 0.98 }}>
          Next fact
        </motion.button>
      </div>
    </>
  );
}
