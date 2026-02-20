// Navigation functionality
document.addEventListener("DOMContentLoaded", function () {
  const navButtons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".section");

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetSection = button.getAttribute("data-section");

      // Update active button
      navButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Show target section
      sections.forEach((section) => section.classList.remove("active"));
      document.getElementById(targetSection).classList.add("active");

      // Special handling for gallery - load images when shown
      if (targetSection === "gallery") {
        loadGallery();
      }
      // Special handling for rate section - load new animal when shown
      if (targetSection === "rate") {
        loadRateAnimal();
      }
    });
  });

  // Initialize quiz
  initQuiz();

  // Initialize birthday gate
  initBirthdayGate();

  // Initialize rate slider
  initRateSlider();
});

// Quiz Data and Logic
const quizData = {
  questions: [
    {
      question: "What's your ideal day?",
      options: [
        { text: "plopping all day 😴", value: "cat" },
        { text: "Tum filling 🍕", value: "guinea" },
        { text: "Both! Napping AND tum filling 🐱", value: "corgi" },
        { text: "Playing and being active 🎾", value: "dog" },
        { text: "sit 🐑", value: "sheep" },
      ],
    },
    {
      question: "How do you feel about being round?",
      options: [
        { text: "Round is nice! 💕", value: "guinea" },
        { text: "I'm perfectly shaped 🎯", value: "cat" },
        { text: "Round = more to love! 🐾", value: "corgi" },
        { text: "I'm athletic, not round 💪", value: "dog" },
        { text: "Fluffy and round! 🐑", value: "sheep" },
      ],
    },
    {
      question: "What's your favorite snack?",
      options: [
        { text: "Tuna 🐟", value: "cat" },
        { text: "lettuce 🥕", value: "guinea" },
        { text: "Everything! 🍰", value: "corgi" },
        { text: "sweets 🦴", value: "dog" },
        { text: "Fresh grass 🍃", value: "sheep" },
      ],
    },
    {
      question: "How do you like to relax?",
      options: [
        { text: "Curled up in a ball 🐱", value: "cat" },
        { text: "Sitting like a potato 🥔", value: "guinea" },
        { text: "Lying flat like a pancake 🥞", value: "corgi" },
        { text: "Running around! 🏃", value: "dog" },
        { text: "tum filling peacefully 🐑", value: "sheep" },
      ],
    },
  ],
  results: {
    cat: {
      emoji: "🐱",
      name: "Fat Cat",
      description:
        "You're a classic chubby cat! You love napping, being round, and looking absolutely adorable while doing absolutely nothing!",
    },
    guinea: {
      emoji: "🐹",
      name: "Potato Guinea Pig",
      description:
        "You're a round little potato guinea pig! Small, chubby, and absolutely precious. You're the perfect combination of cute and chubby!",
    },
    sheep: {
      emoji: "🐑",
      name: "Chubby Sheep",
      description:
        "You're a chubby sheep! Fluffy, round, and absolutely adorable. You're like a walking cloud of chubby perfection!",
    },
    corgi: {
      emoji: "🐶",
      name: "Fluffy Corgi",
      description:
        "You're a fluffy corgi! Short legs, big personality, and maximum chub potential. You're the perfect round friend who brings joy wherever you go!",
    },
    dog: {
      emoji: "🐕",
      name: "Fat Doggo",
      description:
        "You're a fat doggo! Even though you're active, you've got that perfect roundness that makes everyone smile. You're the best kind of chub!",
    },
  },
};

let quizAnswers = [];

function initQuiz() {
  const quizContainer = document.getElementById("quiz-questions");
  quizContainer.innerHTML = "";
  quizAnswers = [];

  quizData.questions.forEach((q, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.className = "question";
    questionDiv.innerHTML = `
            <h3>Question ${index + 1}: ${q.question}</h3>
            <div class="question-options">
                ${q.options
                  .map(
                    (opt, optIndex) => `
                    <button class="option-btn" data-question="${index}" data-value="${opt.value}">
                        ${opt.text}
                    </button>
                `,
                  )
                  .join("")}
            </div>
        `;
    quizContainer.appendChild(questionDiv);
  });

  // Add event listeners to options
  document.querySelectorAll(".option-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const questionIndex = parseInt(this.getAttribute("data-question"));
      const value = this.getAttribute("data-value");

      // Remove selected class from other options in same question
      const questionDiv = this.closest(".question");
      questionDiv.querySelectorAll(".option-btn").forEach((opt) => {
        opt.classList.remove("selected");
      });

      // Add selected class to clicked option
      this.classList.add("selected");

      // Store answer
      quizAnswers[questionIndex] = value;

      // Check if all questions answered
      if (
        quizAnswers.length === quizData.questions.length &&
        quizAnswers.every((a) => a !== undefined)
      ) {
        showQuizResult();
      }
    });
  });
}

function showQuizResult() {
  // Count answers
  const answerCounts = {};
  quizAnswers.forEach((answer) => {
    answerCounts[answer] = (answerCounts[answer] || 0) + 1;
  });

  // Find most common answer
  const resultType = Object.keys(answerCounts).reduce((a, b) =>
    answerCounts[a] > answerCounts[b] ? a : b,
  );

  const result = quizData.results[resultType];

  const resultDiv = document.getElementById("quiz-result");
  resultDiv.innerHTML = `
        <h3>Your Spirit Chubby Animal is...</h3>
        <div class="animal-emoji">${result.emoji}</div>
        <h3>${result.name}!</h3>
        <p class="result-text">${result.description}</p>
        <button class="restart-btn" onclick="initQuiz(); document.getElementById('quiz-result').classList.add('hidden');">
            Take Quiz Again! 🔄
        </button>
    `;
  resultDiv.classList.remove("hidden");

  // Scroll to result
  resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Gallery functionality
let currentGalleryType = "cat";

async function loadGallery() {
  const galleryGrid = document.getElementById("gallery-grid");
  galleryGrid.innerHTML = '<div class="loading">Loading chubbas...</div>';

  try {
    const images = await fetchAnimalImages(currentGalleryType, 12);
    galleryGrid.innerHTML = "";

    images.forEach((img) => {
      const item = document.createElement("div");
      item.className = "gallery-item";
      item.innerHTML = `
                <img src="${img.url}" alt="Chubby ${currentGalleryType}" loading="lazy">
                <div class="chub-label">${getRandomChubLabel()}</div>
            `;
      galleryGrid.appendChild(item);
    });
  } catch (error) {
    galleryGrid.innerHTML =
      '<div class="loading">Oops! Couldn\'t load chubbas. Try again!</div>';
    console.error("Error loading gallery:", error);
  }

  // Show helpful message if no images
  if (galleryGrid.querySelectorAll(".gallery-item").length === 0) {
    galleryGrid.innerHTML = `
      <div class="loading" style="grid-column: 1/-1; text-align: center; padding: 2rem;">
        No images yet! Add your own chubby animal pics:<br><br>
        <small>1. Drop images into images/cat, images/dog, images/sheep, or images/guinea<br>
        2. Run: <code>node add-images.js</code></small>
      </div>
    `;
  }
}

// Local animal image database (loaded from data/animals.json)
let animalDatabase = { cat: [], dog: [], sheep: [], guinea: [] };

async function loadAnimalDatabase() {
  try {
    const response = await fetch("data/animals.json");
    if (response.ok) {
      animalDatabase = await response.json();
    }
  } catch (error) {
    console.error("Error loading animal database:", error);
  }
}

async function fetchAnimalImages(type, count = 12) {
  await loadAnimalDatabase();

  const images = [];

  if (type === "random") {
    ["cat", "dog", "sheep", "guinea"].forEach((t) => {
      (animalDatabase[t] || []).forEach((url) =>
        images.push({ url, type: t }),
      );
    });
  } else if (animalDatabase[type]) {
    animalDatabase[type].forEach((url) => images.push({ url, type }));
  }

  return shuffleArray(images).slice(0, count);
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getRandomChubLabel() {
  const labels = [
    "Ultra Chub 🐱",
    "Perfectly Round ⭕",
    "Maximum Chub 🐾",
    "Spherical Friend 🎯",
    "Chub Master 🏆",
    "Round Legend 🌟",
    "Absolute Unit 💪",
    "Chub Champion 🥇",
  ];
  return labels[Math.floor(Math.random() * labels.length)];
}

// Spin wheel button
document.getElementById("spin-wheel")?.addEventListener("click", () => {
  loadGallery();
});

// Animal type selector
document.getElementById("animal-type")?.addEventListener("change", (e) => {
  currentGalleryType = e.target.value;
  loadGallery();
});

// Rate the Chonk functionality
let currentRateAnimal = null;

async function loadRateAnimal() {
  const rateAnimalDiv = document.getElementById("rate-animal");
  rateAnimalDiv.innerHTML = '<div class="loading">Loading a chubba...</div>';

  try {
    const images = await fetchAnimalImages("random", 1);
    if (images.length > 0) {
      currentRateAnimal = images[0];
      rateAnimalDiv.innerHTML = `<img src="${currentRateAnimal.url}" alt="Rate this chubba">`;
    } else {
      rateAnimalDiv.innerHTML =
        '<div class="loading">No images yet! Add pics to images/ folders and run <code>node add-images.js</code></div>';
    }
  } catch (error) {
    rateAnimalDiv.innerHTML =
      '<div class="loading">Oops! Couldn\'t load a chubba.</div>';
    console.error("Error loading rate animal:", error);
  }
}

function initRateSlider() {
  const slider = document.getElementById("chub-slider");
  const ratingDisplay = document.getElementById("chub-rating");

  slider?.addEventListener("input", (e) => {
    const value = parseInt(e.target.value);
    const ratings = [
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
    ratingDisplay.textContent = `Rating: ${ratings[value - 1]}`;
  });

  document.getElementById("new-chub")?.addEventListener("click", () => {
    loadRateAnimal();
    slider.value = 5;
    ratingDisplay.textContent = "Rating: 5/10 - Moderately Chubby";
  });
}

// Birthday Surprise functionality
function initBirthdayGate() {
  const yesBtn = document.getElementById("yes-btn");
  const noBtn = document.getElementById("no-btn");
  const gate = document.getElementById("birthday-gate");
  const surprise = document.getElementById("birthday-surprise");

  yesBtn?.addEventListener("click", () => {
    gate.classList.add("hidden");
    surprise.classList.remove("hidden");
    createConfetti();
  });

  noBtn?.addEventListener("click", () => {
    // Fun response for clicking "No"
    const messages = [
      "Are you sure? 🤔",
      "Really? Try again! 😊",
      "Hmm... I don't think so! 🐱",
      "Click Yes! You know you want to! 💕",
    ];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    noBtn.textContent = randomMsg;

    // Reset after a moment
    setTimeout(() => {
      noBtn.textContent = "No";
    }, 2000);
  });
}

function createConfetti() {
  const container = document.querySelector(".confetti-container");
  if (!container) return;

  const colors = ["#ff6b9d", "#ffc0cb", "#ffd700", "#ffed4e", "#fecfef"];
  const confettiCount = 50;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.background =
      colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 3 + "s";
    confetti.style.animationDuration = Math.random() * 2 + 2 + "s";
    container.appendChild(confetti);
  }
}
