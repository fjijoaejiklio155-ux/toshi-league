const questions = [
  {
    question: "次のうち、実在する株価指数を5つ選んでください",
    choices: [
      "日経平均株価",
      "TOPIX",
      "NASDAQ総合指数",
      "S&P500",
      "ダウ平均",
      "定期預金指数",
      "家計平均指数",
      "貯蓄インデックス",
      "日本生活指数",
      "企業安定指数"
    ],
    answers: [0, 1, 2, 3, 4],
    explanation: "日経平均、TOPIX、NASDAQ総合指数、S&P500、ダウ平均はいずれも代表的な株価指数です。"
  },
  {
    question: "次のうち、実在する投資用語を5つ選んでください",
    choices: [
      "PER",
      "PBR",
      "ROE",
      "配当利回り",
      "ボラティリティ",
      "信用スコア指数",
      "家計回転率",
      "資産耐久指数",
      "資金循環率Z",
      "生活安定倍率"
    ],
    answers: [0, 1, 2, 3, 4],
    explanation: "PER、PBR、ROE、配当利回り、ボラティリティはいずれもよく使われる投資用語です。"
  },
  {
    question: "次のうち、新NISA制度の特徴として正しいものを5つ選んでください",
    choices: [
      "運用益が非課税",
      "つみたて投資枠がある",
      "成長投資枠がある",
      "年間投資枠がある",
      "非課税保有限度額がある",
      "必ず元本保証される",
      "途中解約ができない",
      "税率が固定で20%になる",
      "銀行のみでしか利用できない",
      "損失が出た場合補填される"
    ],
    answers: [0, 1, 2, 3, 4],
    explanation: "新NISAは運用益非課税で、つみたて投資枠・成長投資枠・年間投資枠・非課税保有限度額があります。"
  },
  {
    question: "次のうち、金融商品として正しいものを5つ選んでください",
    choices: [
      "株式",
      "投資信託",
      "ETF",
      "債券",
      "REIT",
      "給与明細",
      "公共料金",
      "生活費",
      "家電製品",
      "電子マネー残高"
    ],
    answers: [0, 1, 2, 3, 4],
    explanation: "株式、投資信託、ETF、債券、REITは代表的な金融商品です。"
  },
  {
    question: "次のうち、投資リスクの種類として正しいものを5つ選んでください",
    choices: [
      "価格変動リスク",
      "信用リスク",
      "為替リスク",
      "流動性リスク",
      "金利変動リスク",
      "気分リスク",
      "休日リスク",
      "生活疲労リスク",
      "感情ブレリスク",
      "時間不足リスク"
    ],
    answers: [0, 1, 2, 3, 4],
    explanation: "価格変動・信用・為替・流動性・金利変動は代表的な投資リスクです。"
  }
];

const scoreTable = { 0: 0, 1: 0, 2: 10, 3: 40, 4: 70, 5: 100 };

const state = {
  currentQuestionIndex: 0,
  selected: [],
  playerScore: 0,
  opponentScore: 0,
  timer: 20,
  intervalId: null,
  lock: false,
  nextQuestionDouble: false
};

const el = {
  questionCounter: document.getElementById("questionCounter"),
  roundLabel: document.getElementById("roundLabel"),
  timer: document.getElementById("timer"),
  playerScore: document.getElementById("playerScore"),
  opponentScore: document.getElementById("opponentScore"),
  questionText: document.getElementById("questionText"),
  choices: document.getElementById("choices"),
  submitButton: document.getElementById("submitButton"),
  message: document.getElementById("message"),
  resultBox: document.getElementById("resultBox"),
  resultTitle: document.getElementById("resultTitle"),
  explanation: document.getElementById("explanation"),
  overlay: document.getElementById("overlay"),
  cutinTitle: document.getElementById("cutinTitle"),
  cutinText: document.getElementById("cutinText"),
  gameArea: document.getElementById("gameArea"),
  endScreen: document.getElementById("endScreen"),
  endSummary: document.getElementById("endSummary"),
  restartButtonEnd: document.getElementById("restartButtonEnd")
};

function startGame() {
  state.currentQuestionIndex = 0;
  state.selected = [];
  state.playerScore = 0;
  state.opponentScore = 0;
  state.timer = 20;
  state.lock = false;
  state.nextQuestionDouble = false;
  clearInterval(state.intervalId);

  el.gameArea.style.display = "block";
  el.endScreen.classList.remove("show");
  el.resultBox.classList.remove("show");
  el.message.textContent = "";

  updateHeader();
  renderQuestion();
  startTimer();
}

function updateHeader() {
  el.questionCounter.textContent = `${state.currentQuestionIndex + 1} / ${questions.length}`;
  el.roundLabel.textContent = `第${state.currentQuestionIndex + 1}問`;
  el.timer.textContent = state.timer;
  el.playerScore.textContent = state.playerScore;
  el.opponentScore.textContent = state.opponentScore;
}

function renderQuestion() {
  const q = questions[state.currentQuestionIndex];
  state.selected = [];
  state.lock = false;
  el.questionText.textContent = q.question;
  el.choices.innerHTML = "";
  el.submitButton.disabled = true;
  el.resultBox.classList.remove("show");
  el.message.textContent = state.nextQuestionDouble
    ? "カットイン発生中：この問題は得点2倍です。"
    : "5つ選んで回答確定してください。";

  q.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice";
    button.textContent = choice;
    button.addEventListener("click", () => toggleChoice(index));
    el.choices.appendChild(button);
  });
}

function toggleChoice(index) {
  if (state.lock) return;

  const existingIndex = state.selected.indexOf(index);
  if (existingIndex >= 0) {
    state.selected.splice(existingIndex, 1);
  } else {
    if (state.selected.length >= 5) return;
    state.selected.push(index);
  }

  [...el.choices.children].forEach((button, idx) => {
    button.classList.toggle("selected", state.selected.includes(idx));
  });

  el.submitButton.disabled = state.selected.length !== 5;
  el.message.textContent = `選択中: ${state.selected.length} / 5`;
}

function startTimer() {
  clearInterval(state.intervalId);
  state.timer = 20;
  updateHeader();

  state.intervalId = setInterval(() => {
    state.timer -= 1;
    updateHeader();

    if (state.timer <= 0) {
      clearInterval(state.intervalId);
      submitAnswer(true);
    }
  }, 1000);
}

function getCorrectCount(selected, answers) {
  return selected.filter((v) => answers.includes(v)).length;
}

function submitAnswer(isTimeout = false) {
  if (state.lock) return;
  state.lock = true;
  clearInterval(state.intervalId);

  const q = questions[state.currentQuestionIndex];
  const correctCount = getCorrectCount(state.selected, q.answers);
  const baseScore = scoreTable[correctCount] || 0;
  const earnedScore = state.nextQuestionDouble ? baseScore * 2 : baseScore;
  state.playerScore += earnedScore;

  const opponentGain = generateOpponentGain();
  state.opponentScore += opponentGain;

  showAnswerState(q.answers);

  const doubleText = state.nextQuestionDouble ? "（2倍適用）" : "";
  el.resultTitle.innerHTML = `正解数: <strong>${correctCount} / 5</strong>　獲得点: <strong>${earnedScore}点</strong> ${doubleText}`;
  el.explanation.textContent = isTimeout ? `時間切れです。${q.explanation}` : q.explanation;
  el.resultBox.classList.add("show");

  state.nextQuestionDouble = false;
  updateHeader();

  if (state.currentQuestionIndex === questions.length - 1) {
    setTimeout(endGame, 1800);
  } else {
    el.message.textContent = `相手チームも ${opponentGain} 点獲得。次の問題へ進みます。`;
    setTimeout(() => {
      maybeShowCutinThenNext();
    }, 1800);
  }
}

function showAnswerState(answerIndexes) {
  [...el.choices.children].forEach((button, idx) => {
    button.disabled = true;
    const isCorrect = answerIndexes.includes(idx);
    const isSelected = state.selected.includes(idx);

    if (isCorrect) button.classList.add("correct");
    if (isSelected && !isCorrect) button.classList.add("wrong");
  });

  el.submitButton.disabled = true;
}

function generateOpponentGain() {
  const baseOptions = [40, 70, 100];
  const bonus = Math.random() < 0.25 ? 40 : 0;
  return baseOptions[Math.floor(Math.random() * baseOptions.length)] + bonus;
}

function maybeShowCutinThenNext() {
  const shouldTrigger = Math.random() < 0.35;

  if (!shouldTrigger) {
    goToNextQuestion();
    return;
  }

  state.nextQuestionDouble = true;
  el.cutinTitle.textContent = "得点2倍チャンス";
  el.cutinText.textContent = "番組名物の謎演出発生。次の問題だけ獲得点が2倍になります。";
  el.overlay.classList.add("show");

  setTimeout(() => {
    el.overlay.classList.remove("show");
    goToNextQuestion();
  }, 1800);
}

function goToNextQuestion() {
  state.currentQuestionIndex += 1;
  renderQuestion();
  startTimer();
  updateHeader();
}

function endGame() {
  el.gameArea.style.display = "none";
  el.endScreen.classList.add("show");

  const winLose =
    state.playerScore > state.opponentScore
      ? "あなたの勝ちです。"
      : state.playerScore < state.opponentScore
        ? "相手チームの勝ちです。"
        : "引き分けです。";

  el.endSummary.innerHTML = `あなた: <strong>${state.playerScore}点</strong><br>相手チーム: <strong>${state.opponentScore}点</strong><br>${winLose}`;
}

el.submitButton.addEventListener("click", () => submitAnswer(false));
el.restartButtonEnd.addEventListener("click", startGame);

startGame();
