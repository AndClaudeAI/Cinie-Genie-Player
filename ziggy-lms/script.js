// Year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const primaryNav = document.getElementById("primaryNav");
navToggle.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});
primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    primaryNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Question bank filter
const qbGrid = document.getElementById("qbGrid");
const qbChips = document.querySelectorAll('[data-filter-group="qb"] .chip');
qbChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    qbChips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    const filter = chip.dataset.filter;
    qbGrid.querySelectorAll(".resource-card").forEach((card) => {
      const match = filter === "all" || card.dataset.category === filter;
      card.style.display = match ? "" : "none";
    });
  });
});

// Join form (front-end only demo)
const joinForm = document.getElementById("joinForm");
const joinNote = document.getElementById("joinNote");
joinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  joinNote.textContent = "You're in! Check your inbox for a welcome note from Ziggy LMS.";
  joinForm.reset();
});

// ---------- Mathematics Formula Quiz ----------
const QUESTION_BANK = [
  {
    cat: "algebra",
    q: "What is the quadratic formula for ax² + bx + c = 0?",
    options: [
      "x = (-b ± √(b² - 4ac)) / 2a",
      "x = (-b ± √(b² + 4ac)) / 2a",
      "x = (b ± √(b² - 4ac)) / 2a",
      "x = (-b² ± √(4ac)) / 2a",
    ],
    answer: 0,
  },
  {
    cat: "algebra",
    q: "Which expresses the difference of two squares, a² − b²?",
    options: ["(a + b)²", "(a − b)(a + b)", "(a − b)²", "a² + b²"],
    answer: 1,
  },
  {
    cat: "algebra",
    q: "What is the formula for the sum of the first n terms of an arithmetic series?",
    options: ["Sₙ = n/2 (2a + (n−1)d)", "Sₙ = n(a + d)", "Sₙ = a·rⁿ⁻¹", "Sₙ = n/2 (a − d)"],
    answer: 0,
  },
  {
    cat: "algebra",
    q: "The nth term of a geometric progression is given by:",
    options: ["aₙ = a + (n−1)d", "aₙ = a · r^(n−1)", "aₙ = a · n", "aₙ = a / rⁿ"],
    answer: 1,
  },
  {
    cat: "algebra",
    q: "What is the expansion of (a + b)²?",
    options: ["a² + b²", "a² − 2ab + b²", "a² + 2ab + b²", "2a + 2b"],
    answer: 2,
  },
  {
    cat: "geometry",
    q: "What is the formula for the area of a circle of radius r?",
    options: ["2πr", "πr²", "πd", "2πr²"],
    answer: 1,
  },
  {
    cat: "geometry",
    q: "What is the formula for the volume of a sphere of radius r?",
    options: ["(4/3)πr³", "4πr²", "(1/3)πr²h", "πr²h"],
    answer: 0,
  },
  {
    cat: "geometry",
    q: "Pythagoras' theorem for a right triangle with legs a, b and hypotenuse c states:",
    options: ["a + b = c", "a² + b² = c²", "a² − b² = c²", "a·b = c²"],
    answer: 1,
  },
  {
    cat: "geometry",
    q: "What is the formula for the circumference of a circle of radius r?",
    options: ["πr²", "2πr", "πr", "4πr"],
    answer: 1,
  },
  {
    cat: "geometry",
    q: "The volume of a cylinder with radius r and height h is:",
    options: ["πr²h", "2πrh", "(1/3)πr²h", "πrh²"],
    answer: 0,
  },
  {
    cat: "trig",
    q: "According to the Pythagorean identity, sin²θ + cos²θ equals:",
    options: ["0", "1", "tan²θ", "2"],
    answer: 1,
  },
  {
    cat: "trig",
    q: "What is tan θ in terms of sine and cosine?",
    options: ["sin θ + cos θ", "cos θ / sin θ", "sin θ / cos θ", "1 / sin θ"],
    answer: 2,
  },
  {
    cat: "trig",
    q: "The Law of Cosines states c² equals:",
    options: [
      "a² + b² − 2ab·cos C",
      "a² + b² + 2ab·cos C",
      "a² − b² + 2ab·sin C",
      "a² + b² − ab·sin C",
    ],
    answer: 0,
  },
  {
    cat: "trig",
    q: "The Law of Sines relates sides and angles as:",
    options: [
      "a/sin A = b/sin B = c/sin C",
      "a·sin A = b·sin B = c·sin C",
      "a/cos A = b/cos B = c/cos C",
      "a + sin A = b + sin B",
    ],
    answer: 0,
  },
  {
    cat: "trig",
    q: "sin(2θ) is equivalent to:",
    options: ["2 sin θ", "2 sin θ cos θ", "sin²θ − cos²θ", "cos²θ − sin²θ"],
    answer: 1,
  },
  {
    cat: "calculus",
    q: "What is the derivative of xⁿ with respect to x?",
    options: ["nxⁿ", "xⁿ⁻¹", "n·xⁿ⁻¹", "(n+1)xⁿ⁺¹"],
    answer: 2,
  },
  {
    cat: "calculus",
    q: "What is ∫xⁿ dx (for n ≠ −1)?",
    options: ["xⁿ⁺¹/(n+1) + C", "nxⁿ⁻¹ + C", "xⁿ⁻¹/(n−1) + C", "xⁿ + C"],
    answer: 0,
  },
  {
    cat: "calculus",
    q: "The derivative of sin(x) with respect to x is:",
    options: ["−cos(x)", "cos(x)", "−sin(x)", "tan(x)"],
    answer: 1,
  },
  {
    cat: "calculus",
    q: "The product rule for derivatives of u(x)v(x) is:",
    options: ["u'v + uv'", "u'v'", "u'v − uv'", "uv' − u'v"],
    answer: 0,
  },
  {
    cat: "calculus",
    q: "The derivative of eˣ with respect to x is:",
    options: ["xeˣ⁻¹", "eˣ", "eˣ ln x", "e"],
    answer: 1,
  },
];

const QUIZ_LENGTH = 10;

const quizSetup = document.getElementById("quizSetup");
const quizPlay = document.getElementById("quizPlay");
const quizResult = document.getElementById("quizResult");
const quizCatChips = document.querySelectorAll(".quiz-cat");
const startQuizBtn = document.getElementById("startQuiz");
const nextQuestionBtn = document.getElementById("nextQuestion");
const retryQuizBtn = document.getElementById("retryQuiz");

const quizQuestionEl = document.getElementById("quizQuestion");
const quizOptionsEl = document.getElementById("quizOptions");
const quizProgressEl = document.getElementById("quizProgress");
const quizScoreEl = document.getElementById("quizScore");
const quizFeedbackEl = document.getElementById("quizFeedback");
const quizFinalScoreEl = document.getElementById("quizFinalScore");
const quizVerdictEl = document.getElementById("quizVerdict");

let selectedCategory = "all";
let quizQuestions = [];
let currentIndex = 0;
let score = 0;

quizCatChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    quizCatChips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    selectedCategory = chip.dataset.cat;
  });
});

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQuiz() {
  const pool =
    selectedCategory === "all"
      ? QUESTION_BANK
      : QUESTION_BANK.filter((q) => q.cat === selectedCategory);
  const shuffled = shuffle(pool);
  quizQuestions = shuffled.slice(0, Math.min(QUIZ_LENGTH, shuffled.length));
  currentIndex = 0;
  score = 0;
}

function renderQuestion() {
  const question = quizQuestions[currentIndex];
  quizProgressEl.textContent = `Question ${currentIndex + 1} of ${quizQuestions.length}`;
  quizScoreEl.textContent = `Score: ${score}`;
  quizQuestionEl.textContent = question.q;
  quizFeedbackEl.textContent = "";
  nextQuestionBtn.classList.add("hidden");
  quizOptionsEl.innerHTML = "";

  question.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "quiz-option";
    btn.textContent = option;
    btn.addEventListener("click", () => handleAnswer(index, btn));
    quizOptionsEl.appendChild(btn);
  });
}

function handleAnswer(selectedIndex, btnEl) {
  const question = quizQuestions[currentIndex];
  const allOptionBtns = quizOptionsEl.querySelectorAll(".quiz-option");
  allOptionBtns.forEach((btn) => (btn.disabled = true));

  if (selectedIndex === question.answer) {
    btnEl.classList.add("correct");
    quizFeedbackEl.textContent = "Correct! Nicely solved.";
    score += 1;
  } else {
    btnEl.classList.add("incorrect");
    allOptionBtns[question.answer].classList.add("correct");
    quizFeedbackEl.textContent = "Not quite — the correct formula is highlighted above.";
  }
  quizScoreEl.textContent = `Score: ${score}`;
  nextQuestionBtn.classList.remove("hidden");
}

function showResult() {
  quizPlay.classList.add("hidden");
  quizResult.classList.remove("hidden");
  quizFinalScoreEl.textContent = `You scored ${score} / ${quizQuestions.length}`;

  const ratio = score / quizQuestions.length;
  let verdict;
  if (ratio === 1) verdict = "Perfect score. The formulas bow to you.";
  else if (ratio >= 0.7) verdict = "Strong work — a few formulas still owe you a rematch.";
  else if (ratio >= 0.4) verdict = "Decent start. Back to the E-Notes for round two.";
  else verdict = "Rough round — good thing the Question Bank is right upstairs.";
  quizVerdictEl.textContent = verdict;
}

startQuizBtn.addEventListener("click", () => {
  buildQuiz();
  if (quizQuestions.length === 0) return;
  quizSetup.classList.add("hidden");
  quizResult.classList.add("hidden");
  quizPlay.classList.remove("hidden");
  renderQuestion();
});

nextQuestionBtn.addEventListener("click", () => {
  currentIndex += 1;
  if (currentIndex >= quizQuestions.length) {
    showResult();
  } else {
    renderQuestion();
  }
});

retryQuizBtn.addEventListener("click", () => {
  quizResult.classList.add("hidden");
  quizSetup.classList.remove("hidden");
});
