import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { quizData } from "../data/quizData.js";

export function QuizSection() {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [resultType, setResultType] = useState(null);

  const restart = useCallback(() => {
    setAnswers({});
    setShowResult(false);
    setResultType(null);
  }, []);

  const select = (qi, value) => {
    const next = { ...answers, [qi]: value };
    setAnswers(next);
    const done = quizData.questions.every((_, i) => next[i] != null);
    if (done) {
      const counts = {};
      quizData.questions.forEach((_, i) => {
        const a = next[i];
        counts[a] = (counts[a] || 0) + 1;
      });
      const winner = Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
      setResultType(winner);
      setShowResult(true);
    }
  };

  const result = resultType ? quizData.results[resultType] : null;

  return (
    <>
      <motion.h2 className="page-title" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
        Chub-o-Meter Quiz
      </motion.h2>
      <p className="page-lede">Answer a few silly questions to find your spirit chubby animal!</p>
      <div className="quiz-wrap">
        {quizData.questions.map((q, index) => (
          <motion.div
            key={index}
            className="question"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <h3>
              Question {index + 1}: {q.question}
            </h3>
            <div className="question-options">
              {q.options.map((opt) => (
                <button
                  key={opt.value + opt.text}
                  type="button"
                  className={`option-btn${answers[index] === opt.value ? " selected" : ""}`}
                  onClick={() => select(index, opt.value)}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {showResult && result && (
          <motion.div
            className="quiz-result"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <h3>Your Spirit Chubby Animal is...</h3>
            <div className="animal-emoji">{result.emoji}</div>
            <h3>{result.name}!</h3>
            <p className="result-text">{result.description}</p>
            <button type="button" className="restart-btn" onClick={restart}>
              Take Quiz Again! 🔄
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
