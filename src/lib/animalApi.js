let cache = null;

export async function loadAnimalDatabase() {
  if (cache) return cache;
  try {
    const response = await fetch("/data/animals.json");
    if (response.ok) cache = await response.json();
    else cache = { cat: [], dog: [], sheep: [], guinea: [] };
  } catch {
    cache = { cat: [], dog: [], sheep: [], guinea: [] };
  }
  return cache;
}

export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function fetchAnimalImages(type, count = 12) {
  const db = await loadAnimalDatabase();
  const images = [];
  if (type === "random") {
    ["cat", "dog", "sheep", "guinea"].forEach((t) => {
      (db[t] || []).forEach((url) => images.push({ url, type: t }));
    });
  } else if (db[type]) {
    db[type].forEach((url) => images.push({ url, type }));
  }
  return shuffleArray(images).slice(0, count);
}

export const chubLabels = [
  "Ultra Chub 🐱",
  "Perfectly Round ⭕",
  "Maximum Chub 🐾",
  "Spherical Friend 🎯",
  "Chub Master 🏆",
  "Round Legend 🌟",
  "Absolute Unit 💪",
  "Chub Champion 🥇",
];

export function randomChubLabel() {
  return chubLabels[Math.floor(Math.random() * chubLabels.length)];
}
