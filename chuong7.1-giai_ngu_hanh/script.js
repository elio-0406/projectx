// script.js
// Logic có thứ tự đúng + 3 lần thử

// ===== Cấu hình =====
const REQUIRED_ORDER = ["Hỏa", "Kim", "Mộc", "Thủy", "Thổ"];
const MAX_ATTEMPTS = 3;
const TOTAL_BUTTONS = 5;

// ===== Trạng thái =====
let userOrder = [];
let attemptsLeft = MAX_ATTEMPTS;

// ===== Timer =====
let timerInterval = null;
let timeLeft = 5; 
let gameStarted = false;

// ===== Khởi tạo =====
document.addEventListener("DOMContentLoaded", init);

const startBtn = document.getElementById("startBtn");

function init() {
  const buttons = getButtons();
  attachEvents(buttons);
  setupStartButton();
}

// ===== Lấy danh sách nút =====
function getButtons() {
  return document.querySelectorAll(".circle-btn");
}

// ===== Gán sự kiện click =====
function attachEvents(buttons) {
  buttons.forEach((button) => {
    button.addEventListener("click", () => handleButtonClick(button));
  });
}

// ===== Xử lý khi nhấn nút =====
function handleButtonClick(button) {
  const elementName = button.textContent.trim();

  if (!gameStarted) return;

  // Nếu nút chưa được bấm trong lượt này
  if (!button.classList.contains("active")) {
    markButtonActive(button);
    addToUserOrder(elementName);

    if (isRoundComplete()) {
      setTimeout(() => {
        checkResult();
      }, 250);
    }
  }

  playClickEffect(button);
}

// ===== Thêm vào thứ tự người chơi =====
function addToUserOrder(name) {
  userOrder.push(name);
}

// ===== Kiểm tra đã nhấn đủ 5 nút =====
function isRoundComplete() {
  return userOrder.length === TOTAL_BUTTONS;
}

// ===== Kiểm tra kết quả =====
function checkResult() {
  if (isCorrectOrder()) {
    handleWin();
  } else {
    handleFail();
  }
}

// ===== So sánh thứ tự =====
function isCorrectOrder() {
  for (let i = 0; i < REQUIRED_ORDER.length; i++) {
    if (userOrder[i] !== REQUIRED_ORDER[i]) {
      return false;
    }
  }
  return true;
}

// ===== Khi thắng =====
function handleWin() {
  alert("Bạn đã giải đúng trận ngũ hành!");
  resetGame();
}

// ===== Khi sai =====
function handleFail() {
  attemptsLeft--;

  if (attemptsLeft > 0) {
    alert(`Sai rồi! Bạn còn ${attemptsLeft} lần thử.`);
    resetRound();
  } else {
    alert("Bạn đã thua! Hết lượt thử.");
    resetGame();
  }
}

// ===== Reset chỉ lượt hiện tại =====
function resetRound() {
  userOrder = [];

  const buttons = getButtons();

  buttons.forEach((button) => {
    button.classList.remove("active");
    button.classList.remove("clicked");
  });
}

// ===== Reset toàn bộ game =====
function resetGame() {
  attemptsLeft = MAX_ATTEMPTS;

  // Reset timer
  clearInterval(timerInterval);
  timeLeft = 15 * 60;
  gameStarted = false;

  // Trả nút về hình bát quái
  const startBtn = document.getElementById("startBtn");

  if (startBtn) {
    startBtn.innerHTML = `
      <img
        src="assets/img/logo-am-duong-bat-quai-vector-57.jpg"
        alt="Bát quái"
        class="w-full h-full object-cover"
      >
    `;
  }

  resetRound();

  console.log("Game reset hoàn toàn");
}

// ===== Đánh dấu nút đã bấm =====
function markButtonActive(button) {
  button.classList.add("active");
}

// ===== Hiệu ứng khi click =====
function playClickEffect(button) {
  button.classList.add("clicked");
}

// ===== Nút bắt đầu phát nhạc =====
// ===== Xử lý khi nhấn nút bắt đầu =====
function handleStartButton() {
  if (gameStarted) return;

  gameStarted = true;

  playBackgroundMusic();
  startTimer();
}

function startTimer() {
  const startBtn = document.getElementById("startBtn");

  updateTimerDisplay(startBtn);

  timerInterval = setInterval(() => {
    timeLeft--;

    updateTimerDisplay(startBtn);

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert("Hết thời gian!");
      resetGame();
    }
  }, 1000);
}

function updateTimerDisplay(button) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  button.textContent = `${formatTime(minutes)}:${formatTime(seconds)}`;
}

function formatTime(num) {
  return num < 10 ? `0${num}` : num;
}

function setupStartButton() {
  startBtn.addEventListener("click", handleStartButton);
}

function playBackgroundMusic() {
  const bgm = document.getElementById("bgm");

  bgm.muted = false;
  bgm.volume = 0.15;

  bgm.play();

  bgm.play().catch((error) => {
    console.error("Lỗi khi phát nhạc nền:", error);
  });
}