
/* =========================================================
    BOSH QOTIRMA
   8 REJIM × 100 SAVOL = 800 SAVOL

   Savollar avtomatik generator orqali yaratiladi.
   Har bir rejimning savol turi va vaqt tizimi alohida.
========================================================= */

const modes = [
  {
    id: "logic",
    icon: "🧠",
    name: "Mantiqiy savollar",
    description: "Aql va mantiqni sinaydi",
    baseTime: 30
  },
  {
    id: "numbers",
    icon: "🔢",
    name: "Sonli boshqotirmalar",
    description: "Sonlar bilan ishlang",
    baseTime: 27
  },
  {
    id: "riddles",
    icon: "🕵️",
    name: "Topishmoqlar",
    description: "Javobni topa olasizmi?",
    baseTime: 25
  },
  {
    id: "speed",
    icon: "⏱️",
    name: "Tezkor savollar",
    description: "Tez o‘yla, tez javob ber",
    baseTime: 20
  },
  {
    id: "sequence",
    icon: "🧩",
    name: "Ketma-ketlik",
    description: "Keyingi raqamni toping",
    baseTime: 25
  },
  {
    id: "trick",
    icon: "💡",
    name: "Aldamchi savollar",
    description: "Savol sizni chalg‘itishi mumkin",
    baseTime: 22
  },
  {
    id: "general",
    icon: "🌍",
    name: "Umumiy bilim",
    description: "Bilimingizni tekshiring",
    baseTime: 25
  },
  {
    id: "challenge",
    icon: "👑",
    name: "Challenge",
    description: "Barcha rejimlar aralash",
    baseTime: 18
  }
];


/* =========================
   O‘YIN HOLATI
========================= */

let playerName = "";
let currentMode = null;
let questions = [];
let currentQuestion = 0;

let score = 0;
let correct = 0;
let wrong = 0;

let timer = null;
let timeLeft = 0;

let questionAnswered = false;


/* =========================
   DOM
========================= */

const $ = id => document.getElementById(id);

const screens = {
  start: $("startScreen"),
  modes: $("modeScreen"),
  game: $("gameScreen"),
  result: $("resultScreen"),
  rating: $("leaderboardScreen")
};


/* =========================
   EKRAN ALMASHTIRISH
========================= */

function showScreen(screen) {
  Object.values(screens).forEach(s => {
    s.classList.remove("active");
  });

  screen.classList.add("active");
}


/* =========================
   START
========================= */

$("startBtn").addEventListener("click", () => {

  const name = $("playerName").value.trim();

  if (!name) {
    $("playerName").focus();
    $("playerName").placeholder = "Avval ismingizni yozing!";
    return;
  }

  playerName = name;

  localStorage.setItem("korojiPlayer", playerName);

  $("displayName").textContent = playerName;
  updateRating();

  renderModes();
  showScreen(screens.modes);
});


/* Saqlangan ism */

const savedName = localStorage.getItem("korojiPlayer");

if (savedName) {
  $("playerName").value = savedName;
}


/* =========================
   REJIMLAR
========================= */

function renderModes() {

  $("modeGrid").innerHTML = "";

  modes.forEach(mode => {

    const card = document.createElement("button");

    card.className = "mode-card";

    card.innerHTML = `
      <span class="mode-icon">${mode.icon}</span>
      <span class="mode-title">${mode.name}</span>
      <span class="mode-info">${mode.description}</span>
      <span class="mode-time">
        ⏱️ ${mode.baseTime}s — 100 savol
      </span>
    `;

    card.addEventListener("click", () => {
      startGame(mode.id);
    });

    $("modeGrid").appendChild(card);
  });
}


/* =========================
   800 TA SAVOL GENERATORI
========================= */

function generateQuestions(modeId) {

  let list = [];

  for (let i = 0; i < 100; i++) {

    let question;

    switch (modeId) {

      case "logic":
        question = generateLogic(i);
        break;

      case "numbers":
        question = generateNumbers(i);
        break;

      case "riddles":
        question = generateRiddle(i);
        break;

      case "speed":
        question = generateSpeed(i);
        break;

      case "sequence":
        question = generateSequence(i);
        break;

      case "trick":
        question = generateTrick(i);
        break;

      case "general":
        question = generateGeneral(i);
        break;

      case "challenge":
        question = generateChallenge(i);
        break;

      default:
        question = generateLogic(i);
    }

    list.push(question);
  }

  return list;
}


/* =========================
   RANDOM
========================= */

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function makeQuestion(text, answer, options) {

  const finalOptions = shuffle([
    answer,
    ...options.filter(x => x !== answer)
  ]).slice(0, 4);

  return {
    text,
    answer,
    options: finalOptions
  };
}


/* =========================
   1. MANTIQ
========================= */

function generateLogic(i) {

  const patterns = [

    () => {
      const n = 10 + i;
      return makeQuestion(
        `${n} ta olmaning 3 tasini yeb qo‘ysangiz, nechta olma qoladi?`,
        `${n - 3}`,
        [`${n}`, `${n - 2}`, `${n - 4}`]
      );
    },

    () => makeQuestion(
      "Bir xonada 4 ta burchak bor. Har burchakda bittadan mushuk o‘tiribdi. Jami nechta mushuk bor?",
      "4",
      ["8", "3", "12"]
    ),

    () => makeQuestion(
      "Agar bugun dushanba bo‘lsa, 3 kundan keyin qaysi kun?",
      "Payshanba",
      ["Chorshanba", "Juma", "Yakshanba"]
    ),

    () => makeQuestion(
      "Bir odam 10-qavatda yashaydi. Har kuni lift bilan pastga tushadi, lekin uyiga qaytganda 7-qavatgacha liftga chiqib, qolganini piyoda yuradi. Nega?",
      "Bo‘yi lift tugmalariga yetmaydi",
      "Lift ishlamaydi",
      "U sport qiladi",
      "7-qavatda do‘sti bor"
    )
  ];

  return patterns[i % patterns.length]();
}


/* =========================
   2. SONLAR
========================= */

function generateNumbers(i) {

  const a = (i % 15) + 2;

  switch (i % 5) {

    case 0:
      return makeQuestion(
        `${a} + ${a + 3} = ?`,
        String(a + a + 3),
        [
          String(a + a + 2),
          String(a + a + 4),
          String(a + 3)
        ]
      );

    case 1:
      return makeQuestion(
        `${a + 10} - ${a} = ?`,
        "10",
        ["9", "11", "12"]
      );

    case 2:
      return makeQuestion(
        `${a} × 2 = ?`,
        String(a * 2),
        [
          String(a * 3),
          String(a + 2),
          String(a * 4)
        ]
      );

    case 3:
      return makeQuestion(
        `${a * 2} ÷ 2 = ?`,
        String(a),
        [
          String(a + 1),
          String(a - 1),
          String(a * 2)
        ]
      );

    default:
      return makeQuestion(
        `${a} ning kvadrati nechaga teng?`,
        String(a * a),
        [
          String(a * 2),
          String(a + a),
          String(a * a + 1)
        ]
      );
  }
}


/* =========================
   3. TOPISHMOQ
========================= */

function generateRiddle(i) {

  const riddles = [

    ["O‘zi yurmaydi, lekin dunyoni aylanadi. Bu nima?", "Soat", ["Stol", "Kitob", "Qalam"]],

    ["Qanoti bor, lekin uchmaydi. Bu nima?", "Eshik", ["Qush", "Samolyot", "Baliq"]],

    ["Tili bor, lekin gapirmaydi. Bu nima?", "Qo‘ng‘iroq", ["Odam", "Qush", "Radio"]],

    ["Ko‘zi bor, lekin ko‘rmaydi. Bu nima?", "Igna", ["Mushuk", "Kamera", "Odam"]],

    ["Qishda ham, yozda ham bir xil rangda turadi. Bu nima?", "Archa", ["Olma", "Atirgul", "Bug‘doy"]],

    ["O‘zi kichkina, ovozi juda baland. Bu nima?", "Hushtak", ["Kitob", "Qalam", "Stul"]],

    ["Uyga kiradi, lekin eshikdan emas. Bu nima?", "Quyosh nuri", ["Mushuk", "Stol", "Gilam"]],

    ["Suv ichadi, lekin chanqamaydi. Bu nima?", "Daraxt", ["Tosh", "Kitob", "Qalam"]]
  ];

  const r = riddles[i % riddles.length];

  return makeQuestion(r[0], r[1], r[2]);
}


/* =========================
   4. TEZKOR
========================= */

function generateSpeed(i) {

  const questions = [

    ["O‘zbekiston poytaxti qaysi shahar?", "Toshkent", ["Samarqand", "Buxoro", "Andijon"]],

    ["Bir sutkada necha soat bor?", "24", ["12", "36", "48"]],

    ["Bir haftada necha kun bor?", "7", ["5", "6", "8"]],

    ["Bir metrda necha santimetr bor?", "100", ["10", "50", "1000"]],

    ["Alifboda A harfidan keyin qaysi harf keladi?", "B", ["C", "D", "E"]],

    ["Quyosh qaysi tomondan chiqadi?", "Sharq", ["G‘arb", "Shimol", "Janub"]],

    ["Qaysi oyda 28 kun bor?", "Barcha oylarda", ["Faqat fevralda", ["Yanvar", "Mart"]].flat()]
  ];

  const q = questions[i % questions.length];

  return makeQuestion(q[0], q[1], q[2]);
}


/* =========================
   5. KETMA-KETLIK
========================= */

function generateSequence(i) {

  const n = (i % 12) + 2;

  switch (i % 4) {

    case 0:
      return makeQuestion(
        `${n}, ${n + 2}, ${n + 4}, ${n + 6}, ?`,
        String(n + 8),
        [
          String(n + 7),
          String(n + 9),
          String(n + 10)
        ]
      );

    case 1:
      return makeQuestion(
        `${n}, ${n * 2}, ${n * 3}, ${n * 4}, ?`,
        String(n * 5),
        [
          String(n * 6),
          String(n * 4 + 1),
          String(n * 3)
        ]
      );

    case 2:
      return makeQuestion(
        `${n}, ${n + 5}, ${n + 10}, ${n + 15}, ?`,
        String(n + 20),
        [
          String(n + 18),
          String(n + 19),
          String(n + 25)
        ]
      );

    default:
      return makeQuestion(
        `2, 4, 8, 16, ?`,
        "32",
        ["20", "24", "30"]
      );
  }
}


/* =========================
   6. ALDAMCHI
========================= */

function generateTrick(i) {

  const tricks = [

    [
      "Bir xo‘roz tomga chiqib tuxum qo‘ydi. Tuxum qaysi tomonga dumalaydi?",
      "Xo‘roz tuxum qo‘ymaydi",
      ["O‘ngga", "Chapga", "Pastga"]
    ],

    [
      "Elektr poyezd shimolga qarab ketmoqda. Tutuni qaysi tomonga chiqadi?",
      "Elektr poyezdda tutun bo‘lmaydi",
      ["Shimolga", "Janubga", "Sharqqa"]
    ],

    [
      "Sizda 3 ta olma bor edi. 2 tasini oldingiz. Sizda nechta olma bor?",
      "2 ta",
      ["1 ta", "3 ta", "5 ta"]
    ],

    [
      "Bir odam yomg‘irda soyabonsiz yurdi, lekin sochi ho‘l bo‘lmadi. Nega?",
      "U kal edi",
      ["Yomg‘ir yog‘madi", "Uyda edi", "Soyaboni bor edi"]
    ],

    [
      "Stolda 5 ta sham yonib turibdi. 2 tasi o‘chirildi. Stolda nechta sham bor?",
      "5 ta",
      ["3 ta", "2 ta", "7 ta"]
    ]
  ];

  const q = tricks[i % tricks.length];

  return makeQuestion(q[0], q[1], q[2]);
}


/* =========================
   7. UMUMIY BILIM
========================= */

function generateGeneral(i) {

  const questions = [

    ["Yerning tabiiy yo‘ldoshi nima?", "Oy", ["Quyosh", "Mars", "Yulduz"]],

    ["Odam odatda nechta qo‘lga ega?", "2", ["1", "3", "4"]],

    ["Suvning kimyoviy formulasi?", "H₂O", ["CO₂", "O₂", "NaCl"]],

    ["Eng katta okean qaysi?", "Tinch okeani", ["Atlantika", "Hind", "Shimoliy Muz"]],

    ["O‘zbekistonning milliy valyutasi?", "So‘m", ["Dollar", "Rubl", "Tenge"]],

    ["Haftaning birinchi kuni sifatida ko‘pincha qaysi kun olinadi?", "Dushanba", ["Juma", "Yakshanba", "Chorshanba"]],

    ["Kamalak odatda nechta asosiy rang bilan tasvirlanadi?", "7", ["5", "6", "8"]],

    ["Insonning ko‘rish organi nima?", "Ko‘z", ["Quloq", "Burun", "Til"]]
  ];

  const q = questions[i % questions.length];

  return makeQuestion(q[0], q[1], q[2]);
}


/* =========================
   8. CHALLENGE
========================= */

function generateChallenge(i) {

  const allModes = [
    "logic",
    "numbers",
    "riddles",
    "speed",
    "sequence",
    "trick",
    "general"
  ];

  const randomMode = allModes[i % allModes.length];

  switch (randomMode) {
    case "logic": return generateLogic(i);
    case "numbers": return generateNumbers(i);
    case "riddles": return generateRiddle(i);
    case "speed": return generateSpeed(i);
    case "sequence": return generateSequence(i);
    case "trick": return generateTrick(i);
    default: return generateGeneral(i);
  }
}


/* =========================
   O‘YINNI BOSHLASH
========================= */

function startGame(modeId) {

  currentMode = modes.find(m => m.id === modeId);

  questions = generateQuestions(modeId);

  currentQuestion = 0;
  score = 0;
  correct = 0;
  wrong = 0;
  questionAnswered = false;

  $("gameModeName").textContent =
    `${currentMode.icon} $ {currentMode.name}`;

  $("score").textContent = "0";
  $("gameRating").textContent = "0";

  showScreen(screens.game);

  showQuestion();
}


/* =========================
   SAVOLNI KO‘RSATISH
========================= */

function showQuestion() {

  clearInterval(timer);

  questionAnswered = false;

  const q = questions[currentQuestion];

  $("questionNumber").textContent =
    `${currentQuestion + 1} / 100`;

  $("progressBar").style.width =
    `${((currentQuestion + 1) / 100) * 100}%`;

  $("questionText").textContent = q.text;

  $("questionType").textContent =
    `${currentMode.icon} ${currentMode.name.toUpperCase()}`;

  $("answers").innerHTML = "";

  $("feedback").textContent = "";
  $("feedback").className = "feedback";

  $("nextBtn").classList.add("hidden");

  q.options.forEach(option => {

    const button = document.createElement("button");

    button.className = "answer";
    button.textContent = option;

    button.addEventListener("click", () => {
      answerQuestion(button, option);
    });

    $("answers").appendChild(button);
  });

  startTimer();
}


/* =========================
   VAQT
========================= */

function startTimer() {

  timeLeft = Math.max(
    8,
    currentMode.baseTime - Math.floor(currentQuestion / 10)
  );

  updateTimer();

  timer = setInterval(() => {

    timeLeft--;

    updateTimer();

    if (timeLeft <= 0) {

      clearInterval(timer);

      if (!questionAnswered) {
        timeExpired();
      }
    }

  }, 1000);
}


function updateTimer() {

  $("timer").textContent = timeLeft;

  $("timer").classList.remove(
    "warning",
    "danger"
  );

  if (timeLeft <= 5) {
    $("timer").classList.add("danger");
  } else if (timeLeft <= 10) {
    $("timer").classList.add("warning");
  }
}


/* =========================
   VAQT TUGADI
========================= */

function timeExpired() {

  questionAnswered = true;
  wrong++;

  const buttons =
    document.querySelectorAll(".answer");

  buttons.forEach(btn => {

    btn.disabled = true;

    if (btn.textContent === questions[currentQuestion].answer) {
      btn.classList.add("correct");
    }
  });

  $("feedback").textContent =
    "⏰ Vaqt tugadi!";

  $("feedback").classList.add("bad");

  updateStats();

  $("nextBtn").classList.remove("hidden");
}


/* =========================
   JAVOB
========================= */

function answerQuestion(button, selected) {

  if (questionAnswered) return;

  questionAnswered = true;

  clearInterval(timer);

  const q = questions[currentQuestion];

  const buttons =
    document.querySelectorAll(".answer");

  buttons.forEach(btn => {
    btn.disabled = true;

    if (btn.textContent === q.answer) {
      btn.classList.add("correct");
    }
  });

  if (selected === q.answer) {

    button.classList.add("correct");

    correct++;

    /*
      Tez javob = ko‘proq ochko.
      Maksimal: 100 + vaqt bonus.
    */

    const points =
      100 + (timeLeft * 5);

    score += points;

    $("feedback").textContent =
      `✅ To‘g‘ri! +${points} ochko`;

    $("feedback").classList.add("good");

  } else {

    button.classList.add("wrong");

    wrong++;

    $("feedback").textContent =
      `❌ Noto‘g‘ri! To‘g‘ri javob: ${q.answer}`;

    $("feedback").classList.add("bad");
  }

  updateStats();

  $("nextBtn").classList.remove("hidden");
}


/* =========================
   KEYINGI SAVOL
========================= */

$("nextBtn").addEventListener("click", () => {

  currentQuestion++;

  if (currentQuestion >= 100) {
    finishGame();
  } else {
    showQuestion();
  }
});


/* =========================
   STATISTIKA
========================= */

function updateStats() {

  $("score").textContent = score;

  $("correctCount").textContent = correct;
  $("wrongCount").textContent = wrong;

  const total = correct + wrong;

  const accuracy =
    total === 0
      ? 0
      : Math.round((correct / total) * 100);

  $("accuracy").textContent =
    `${accuracy}%`;

  const rating =
    Math.max(
      0,
      Math.round(
        correct * 10 +
        score / 100
      )
    );

  $("gameRating").textContent = rating;
}


/* =========================
   O‘YINNI YAKUNLASH
========================= */

function finishGame() {

  clearInterval(timer);

  const total = correct + wrong;

  const accuracy =
    total === 0
      ? 0
      : Math.round((correct / total) * 100);

  const rating =
    Math.max(
      0,
      Math.round(
        correct * 10 +
        score / 100
      )
    );

  $("resultName").textContent =
    `${playerName} — ${currentMode.name}`;

  $("finalScore").textContent = score;
  $("finalCorrect").textContent = correct;
  $("finalWrong").textContent = wrong;
  $("finalAccuracy").textContent = `${accuracy}%`;
  $("finalRating").textContent = rating;

  saveResult();

  showScreen(screens.result);
}


/* =========================
   QAYTA O‘YNASH
========================= */

$("againBtn").addEventListener("click", () => {

  if (currentMode) {
    startGame(currentMode.id);
  }
});


/* =========================
   REJIMLAR
========================= */

$("modesBtn").addEventListener("click", () => {

  updateRating();

  renderModes();

  showScreen(screens.modes);
});


/* =========================
   ORQAGA
========================= */

$("quitBtn").addEventListener("click", () => {

  clearInterval(timer);

  renderModes();

  showScreen(screens.modes);
});


/* =========================
   REYTING
========================= */

$("leaderboardBtn").addEventListener("click", () => {

  renderLeaderboard();

  showScreen(screens.rating);
});


$("backFromRating").addEventListener("click", () => {

  showScreen(screens.modes);
});


/* =========================
   LOCAL STORAGE REYTING
========================= */

function getLeaderboard() {

  return JSON.parse(
    localStorage.getItem("korojiLeaderboard") || "[]"
  );
}


function saveResult() {

  const rating =
    Math.max(
      0,
      Math.round(
        correct * 10 +
        score / 100
      )
    );

  const board = getLeaderboard();

  board.push({
    name: playerName,
    score: score,
    rating: rating,
    mode: currentMode.name,
    date: new Date().toLocaleDateString("uz-UZ")
  });

  board.sort((a, b) => {

    if (b.score !== a.score) {
      return b.score - a.score;
    }

    return b.rating - a.rating;
  });

  /*
    Reytingda 50 ta eng yaxshi natija saqlanadi.
  */

  localStorage.setItem(
    "korojiLeaderboard",
    JSON.stringify(board.slice(0, 50))
  );
}


/* =========================
   REYTINGNI CHIQARISH
========================= */

function renderLeaderboard() {

  const board = getLeaderboard();

  const container = $("leaderboard");

  container.innerHTML = "";

  if (!board.length) {

    container.innerHTML = `
      <div class="rank-item">
        <span class="rank-name">
          Hali natijalar yo‘q.
        </span>
      </div>
    `;

    return;
  }

  board.slice(0, 20).forEach((item, index) => {

    const row = document.createElement("div");

    row.className = "rank-item";

    let medal = "";

    if (index === 0) medal = "🥇";
    else if (index === 1) medal = "🥈";
    else if (index === 2) medal = "🥉";
    else medal = `${index + 1}`;

    row.innerHTML = `
      <span class="rank-position">${medal}</span>

      <span class="rank-name">
        ${escapeHTML(item.name)}
        <small style="display:block;color:#737b9c">
          ${escapeHTML(item.mode)}
        </small>
      </span>

      <span class="rank-score">
        ${item.score}
      </span>
    `;

    container.appendChild(row);
  });
}


/* =========================
   REYTINGNI O‘CHIRISH
========================= */

$("clearRating").addEventListener("click", () => {

  if (
    confirm("Barcha reyting natijalarini o‘chirishni xohlaysizmi?")
  ) {

    localStorage.removeItem("korojiLeaderboard");

    renderLeaderboard();

    updateRating();
  }
});


/* =========================
   SHAXSIY REYTING
========================= */

function updateRating() {

  const board = getLeaderboard();

  const personal = board
    .filter(x => x.name === playerName)
    .sort((a,b) => b.rating - a.rating);

  const rating =
    personal.length
      ? personal[0].rating
      : 0;

  $("rating").textContent = rating;
}


/* =========================
   XAVFSIZ MATN
========================= */

function escapeHTML(str) {

  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* =========================
   SAHIFA YUKLANGANDA
========================= */

renderModes();

if (savedName) {
  playerName = savedName;
  $("displayName").textContent = savedName;
}

 