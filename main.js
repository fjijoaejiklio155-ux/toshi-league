const TOTAL_QUESTIONS = 5;
const TIME_LIMIT = 20;
const BONUS_RATE = 0.35;

const questions = [
  {
    text: "長期投資で一般的に重要とされる考え方を5つ選べ！",
    choices: [
      "分散投資",
      "手数料を確認する",
      "短期の値動きだけで売買する",
      "複利を意識する",
      "余裕資金で投資する",
      "借金して全力投資する",
      "リスク許容度を考える",
      "SNSの噂だけで買う",
      "毎日必ず利益を出す",
      "一銘柄だけに集中する"
    ],
    answers: [0, 1, 3, 4, 6],
    explanation: "長期投資では分散、コスト、複利、余裕資金、リスク許容度が基本です。"
  },
  {
    text: "投資信託を選ぶときに確認したい項目を5つ選べ！",
    choices: [
      "信託報酬",
      "運用方針",
      "純資産総額",
      "過去の成績だけで未来を断定する",
      "投資対象",
      "販売ランキングだけ",
      "リスクの種類",
      "商品名のかっこよさ",
      "絶対に損しない表示",
      "友人の勘"
    ],
    answers: [0, 1, 2, 4, 6],
    explanation: "費用、方針、規模、投資対象、リスクを見て、自分に合うか確認します。"
  },
  {
    text: "株式投資のリスク管理として妥当な行動を5つ選べ！",
    choices: [
      "業績を確認する",
      "投資額を管理する",
      "損失の可能性を受け入れる",
      "値動きの理由を調べる",
      "全部を一度に買う",
      "分散を考える",
      "必ず勝てる銘柄を探す",
      "決算を無視する",
      "生活費を投入する",
      "値下がり時に必ず倍買う"
    ],
    answers: [0, 1, 2, 3, 5],
    explanation: "株式は価格変動があるため、情報確認、投資額、損失可能性、理由確認、分散が大切です。"
  },
  {
    text: "NISAについて正しい説明を5つ選べ！",
    choices: [
      "投資で得た利益が一定条件で非課税になる",
      "対象商品には条件がある",
      "元本保証ではない",
      "制度のルール確認が必要",
      "投資額には枠がある",
      "どんな損失も国が補填する",
      "毎月必ず利益が出る",
      "借金が自動で消える",
      "税金が永久に全てゼロになる",
      "投資知識が不要になる"
    ],
    answers: [0, 1, 2, 3, 4],
    explanation: "NISAは非課税制度ですが、元本保証ではなく制度の条件があります。"
  },
  {
    text: "投資詐欺を避けるために警戒したい言葉や状況を5つ選べ！",
    choices: [
      "絶対に儲かる",
      "元本保証で高利回り",
      "今日だけ申し込み可能",
      "金融庁登録の有無を確認する",
      "紹介すれば報酬が増える",
      "仕組みが説明されない",
      "リスク説明がある",
      "少額から試せる",
      "契約書を読める",
      "手数料が明示される"
    ],
    answers: [0, 1, 2, 4, 5],
    explanation: "絶対、高利回り保証、急かし、紹介報酬、不透明な仕組みは強い警戒サインです。"
  }
];

const titleScreen = document.getElementById("title-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const nextButton = document.getElementById("next-button");
const questionCounter = document.getElementById("question-counter");
const timerDisplay = document.getElementById("timer");
const playerScoreDisplay = document.getElementById("player-score");
const opponentScoreDisplay = document.getElementById("opponent-score");
const questionText = document.getElementById("question-text");
const choicesArea = document.getElementById("choices");
const resultPanel = document.getElementById("result-panel");
const resultTitle = document.getElementById("result-title");
const correctCount = document.getElementById("correct-count");
const earnedScore = document.getElementById("earned-score");
const explanation = document.getElementById("explanation");
const cutin = document.getElementById("cutin");
const cutinBackdrop = document.getElementById("cutin-backdrop");
const bonusBanner = document.getElementById("bonus-banner");
const multiplierStatus = document.getElementById("multiplier-status");
const finalResult = document.getElementById("final-result");
const finalScoreLine = document.getElementById("final-score-line");
const finalMessage = document.getElementById("final-message");
const bgm = document.getElementById("bgm");

let currentQuestionIndex = 0;
let selectedChoices = new Set();
let playerScore = 0;
let opponentScore = 0;
let timerId = null;
let timeLeft = TIME_LIMIT;
let inputLocked = false;
let nextScoreMultiplier = 1;

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
nextButton.addEventListener("click", handleNext);

function startGame() {
  playerScore = 0;
  opponentScore = 0;
  currentQuestionIndex = 0;
  nextScoreMultiplier = 1;
  inputLocked = false;

  showScreen(gameScreen);
  updateScores(true);
  playBgm();
  loadQuestion();
}

function playBgm() {
  if (!bgm) return;
  bgm.volume = 0.5;
  bgm.play().catch(() => {});
}

function showScreen(target) {
  [titleScreen, gameScreen, endScreen].forEach((screen) => {
    screen.classList.toggle("active", screen === target);
  });
}

function loadQuestion() {
  stopTimer();
  selectedChoices = new Set();
  inputLocked = false;
  timeLeft = TIME_LIMIT;

  const question = questions[currentQuestionIndex];
  questionCounter.textContent = `${currentQuestionIndex + 1}/${TOTAL_QUESTIONS}`;
  timerDisplay.textContent = timeLeft;
  questionText.textContent = question.text;
  multiplierStatus.textContent = nextScoreMultiplier === 2 ? "得点2倍中！！" : "通常得点";
  bonusBanner.classList.toggle("hidden", nextScoreMultiplier !== 2);
  resultPanel.classList.add("hidden");
  nextButton.disabled = true;

  choicesArea.innerHTML = "";
  question.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.className = "choice-button";
    button.type = "button";
    button.textContent = `${index + 1}. ${choice}`;
    button.addEventListener("click", () => toggleChoice(index, button));
    choicesArea.appendChild(button);
  });

  startTimer();
}

function startTimer() {
  timerId = setInterval(() => {
    timeLeft -= 1;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 5) {
      timerDisplay.parentElement.classList.add("blink");
    } else {
      timerDisplay.parentElement.classList.remove("blink");
    }

    if (timeLeft <= 0) {
      submitAnswer();
    }
  }, 1000);
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  timerDisplay.parentElement.classList.remove("blink");
}

function toggleChoice(index, button) {
  if (inputLocked) return;

  if (selectedChoices.has(index)) {
    selectedChoices.delete(index);
    button.classList.remove("selected");
    return;
  }

  if (selectedChoices.size >= 5) return;

  selectedChoices.add(index);
  button.classList.add("selected");

  if (selectedChoices.size === 5) {
    submitAnswer();
  }
}

function submitAnswer() {
  if (inputLocked) return;
  inputLocked = true;
  stopTimer();

  const question = questions[currentQuestionIndex];
  const answerSet = new Set(question.answers);
  let correct = 0;

  selectedChoices.forEach((choiceIndex) => {
    if (answerSet.has(choiceIndex)) correct += 1;
  });

  const baseScore = scoreFromCorrectCount(correct);
  const roundScore = baseScore * nextScoreMultiplier;
  playerScore += roundScore;
  opponentScore += opponentGain();
  updateScores();
  revealAnswers(answerSet);

  resultTitle.textContent = correct === 5 ? "全問的中！！" : correct >= 3 ? "まあまあ強い！" : "危険ゾーン！";
  correctCount.textContent = `正解数: ${correct}/5`;
  earnedScore.textContent = `獲得点: ${roundScore}点`;
  explanation.textContent = question.explanation;
  resultPanel.classList.remove("hidden");
  nextButton.disabled = false;
}

function scoreFromCorrectCount(correct) {
  if (correct === 5) return 100;
  if (correct === 4) return 70;
  if (correct === 3) return 40;
  if (correct === 2) return 10;
  return 0;
}

function opponentGain() {
  const progress = currentQuestionIndex + 1;
  return 18 + progress * 12 + Math.floor(Math.random() * 31);
}

function revealAnswers(answerSet) {
  const buttons = choicesArea.querySelectorAll(".choice-button");
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (answerSet.has(index)) button.classList.add("correct");
    if (selectedChoices.has(index) && !answerSet.has(index)) button.classList.add("wrong");
  });
}

function updateScores(skipAnimation = false) {
  playerScoreDisplay.textContent = playerScore;
  opponentScoreDisplay.textContent = opponentScore;

  if (!skipAnimation) {
    popScore(playerScoreDisplay);
    popScore(opponentScoreDisplay);
  }
}

function popScore(element) {
  element.classList.remove("score-pop");
  void element.offsetWidth;
  element.classList.add("score-pop");
}

function handleNext() {
  if (nextButton.disabled) return;
  nextButton.disabled = true;
  currentQuestionIndex += 1;

  if (currentQuestionIndex >= TOTAL_QUESTIONS) {
    finishGame();
    return;
  }

  nextScoreMultiplier = Math.random() < BONUS_RATE ? 2 : 1;
  if (nextScoreMultiplier === 2) {
    showCutinThenNext();
  } else {
    loadQuestion();
  }
}

function showCutinThenNext() {
  cutin.textContent = "得点2倍！！";
  cutinBackdrop.classList.remove("hidden");
  cutin.classList.remove("hidden");

  setTimeout(() => {
    cutin.classList.add("hidden");
    cutinBackdrop.classList.add("hidden");
    loadQuestion();
  }, 1500);
}

function finishGame() {
  stopTimer();
  showScreen(endScreen);
  finalScoreLine.textContent = `TOSHI ${playerScore} - ${opponentScore} ライバル`;

  if (playerScore > opponentScore) {
    finalResult.textContent = "勝利！！";
    finalMessage.textContent = "知識で勝った。なのに番組側はまだ納得していない。";
  } else if (playerScore < opponentScore) {
    finalResult.textContent = "敗北！！";
    finalMessage.textContent = "相手チームの伸びが妙に強い。これは炎上案件。";
  } else {
    finalResult.textContent = "引き分け！！";
    finalMessage.textContent = "投資判断は冷静に。勝敗判定はなぜか保留。";
  }
}
