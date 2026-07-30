
const CONFIG = {
  firstQuestion: "Sana çıkma teklifi ettiğim tarih? (Sırayla boşluksuz şekilde sayıları yaz. Örn; 15012015)",
  acceptedAnswers: ["19052026"],
  noteOne: `Beni affetmen için sana ufak bir sürpriz hazırladım sevgilim. Umarım başarılı olurum. Seni çok seviyorum...`,
  noteTwo: `Özür dilerim ömrüm, sana sonsuz aşığım ve bana sonsuz güvenmelisin. Benim gözlerim senden başkasına bakmaz, kalbim senden başkasını istemez. Eğer affettiysen son sürprize hazır ol :) <3`,
  photos: [
    "images/photo1.jpg",
    "images/photo2.jpg",
    "images/photo3.jpg",
    "images/photo4.jpg",
    "images/photo5.jpg",
    "images/photo6.jpg",
    "images/photo7.jpg",
    "images/photo8.jpg",
    "images/photo9.jpg"
  ],
  proposalAnswers: ["evet", "evet!", "evet ❤️", "evet aşkım"]
};

const screens = [...document.querySelectorAll(".screen")];
const $ = (selector) => document.querySelector(selector);

function showScreen(id) {
  screens.forEach(screen => screen.classList.toggle("active", screen.id === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function normalize(text) {
  return text
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replace(/[.!?,;:]/g, "")
    .replace(/\s+/g, " ");
}

$("#firstQuestion").textContent = CONFIG.firstQuestion;
$("#noteOneText").textContent = CONFIG.noteOne;
$("#noteTwoText").textContent = CONFIG.noteTwo;

$("#startButton").addEventListener("click", () => showScreen("questionScreen"));
$("#boxButton").addEventListener("click", () => showScreen("questionScreen"));

function checkFirstAnswer() {
  const value = normalize($("#firstAnswer").value);
  const accepted = CONFIG.acceptedAnswers.map(normalize);

  if (accepted.includes(value)) {
    $("#answerFeedback").textContent = "Kilit açıldı! 💖";
    setTimeout(() => showScreen("noteOneScreen"), 650);
  } else {
    $("#answerFeedback").textContent = "Bu cevap kutunun kalbine uymadı, bir daha dene ♡";
    $(".pixel-card").classList.remove("shake");
    void $(".pixel-card").offsetWidth;
    $(".pixel-card").classList.add("shake");
  }
}

$("#answerButton").addEventListener("click", checkFirstAnswer);
$("#firstAnswer").addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkFirstAnswer();
});

$("#noteOneScreen .note").addEventListener("click", () => showScreen("galleryScreen"));

let photoIndex = 0;
const galleryImage = $("#galleryImage");

function renderPhoto() {
  galleryImage.style.opacity = "0";
  setTimeout(() => {
    galleryImage.src = CONFIG.photos[photoIndex];
    $("#photoCounter").textContent = `${photoIndex + 1} / ${CONFIG.photos.length}`;
    galleryImage.style.opacity = "1";
  }, 160);
}

$("#photoFrame").addEventListener("click", () => {
  if (photoIndex < CONFIG.photos.length - 1) {
    photoIndex += 1;
    renderPhoto();
  } else {
    showScreen("noteTwoScreen");
  }
});

galleryImage.style.transition = "opacity .18s ease";

$("#noteTwoScreen .note").addEventListener("click", () => showScreen("clueScreen"));
$("#openRingQuestion").addEventListener("click", () => showScreen("proposalScreen"));
$("#ringBoxButton").addEventListener("click", () => showScreen("proposalScreen"));

function checkProposalAnswer() {
  const value = normalize($("#proposalAnswer").value);
  const accepted = CONFIG.proposalAnswers.map(normalize);

  if (accepted.includes(value) || value === "evet") {
    $("#proposalFeedback").textContent = "Kalbimin kilidi açıldı...";
    setTimeout(() => {
      showScreen("finalScreen");
      launchConfetti();
    }, 650);
  } else {
    $("#proposalFeedback").textContent = "Bu küçük kutu yalnızca tek bir kelimeyi bekliyor 💍";
  }
}

$("#proposalButton").addEventListener("click", checkProposalAnswer);
$("#proposalAnswer").addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkProposalAnswer();
});

$("#restartButton").addEventListener("click", () => {
  photoIndex = 0;
  renderPhoto();
  $("#firstAnswer").value = "";
  $("#proposalAnswer").value = "";
  $("#answerFeedback").textContent = "";
  $("#proposalFeedback").textContent = "";
  showScreen("welcomeScreen");
});

function launchConfetti() {
  const holder = $("#confetti");
  holder.innerHTML = "";
  const colors = ["#ff7eb6", "#ffd76a", "#a98ce6", "#ffffff", "#ff4f9a"];

  for (let i = 0; i < 90; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = `${2.8 + Math.random() * 3}s`;
    piece.style.animationDelay = `${Math.random() * 1.4}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    holder.appendChild(piece);
  }
}

const canvas = $("#stars");
const ctx = canvas.getContext("2d");
let stars = [];

function resizeStars() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  stars = Array.from({ length: Math.floor(innerWidth / 9) }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 1.7 + .3,
    a: Math.random()
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  stars.forEach(star => {
    star.a += (Math.random() - .5) * .06;
    star.a = Math.max(.2, Math.min(1, star.a));
    ctx.globalAlpha = star.a;
    ctx.fillStyle = "#fff7cf";
    ctx.fillRect(star.x, star.y, star.r, star.r);
  });
  requestAnimationFrame(drawStars);
}

window.addEventListener("resize", resizeStars);
resizeStars();
drawStars();


// --- Cinematic experience ---
const music = document.querySelector("#bgMusic");
const soundToggle = document.querySelector("#soundToggle");
const mysteryBox = document.querySelector("#boxButton");
let musicStarted = false;
let musicMuted = false;

async function startMusic() {
  if (musicStarted) return;
  music.volume = 0;
  try {
    await music.play();
    musicStarted = true;
    soundToggle.classList.add("playing");
    let v = 0;
    const fade = setInterval(() => {
      v = Math.min(.42, v + .025);
      music.volume = v;
      if (v >= .42) clearInterval(fade);
    }, 80);
  } catch (err) {
    // Tarayıcı sesi engellerse kullanıcı ses düğmesine dokunarak başlatabilir.
  }
}

function cinematicOpen() {
  startMusic();
  mysteryBox.classList.add("opening");
  setTimeout(() => {
    showScreen("questionScreen");
    mysteryBox.classList.remove("opening");
  }, 760);
}

document.querySelector("#startButton").onclick = cinematicOpen;
mysteryBox.onclick = cinematicOpen;

soundToggle.addEventListener("click", async () => {
  if (!musicStarted) {
    await startMusic();
    return;
  }
  musicMuted = !musicMuted;
  music.muted = musicMuted;
  soundToggle.classList.toggle("muted", musicMuted);
  soundToggle.textContent = musicMuted ? "×" : "♫";
});

function createShootingStar() {
  const holder = document.querySelector("#shootingStars");
  const star = document.createElement("span");
  star.className = "shooting-star";
  star.style.left = `${Math.random() * 35 - 10}vw`;
  star.style.top = `${Math.random() * 35 - 10}vh`;
  holder.appendChild(star);
  setTimeout(() => star.remove(), 1400);
}
setInterval(createShootingStar, 5200);
setTimeout(createShootingStar, 900);

const cinematicFrame = document.querySelector("#photoFrame");
const originalRenderPhoto = renderPhoto;
renderPhoto = function() {
  cinematicFrame.classList.add("slide-out");
  setTimeout(() => {
    galleryImage.src = CONFIG.photos[photoIndex];
    document.querySelector("#photoCounter").textContent = `${photoIndex + 1} / ${CONFIG.photos.length}`;
    cinematicFrame.classList.remove("slide-out");
    cinematicFrame.classList.remove("drop-in");
    void cinematicFrame.offsetWidth;
    cinematicFrame.classList.add("drop-in");
  }, 280);
};

function launchHearts() {
  const holder = document.querySelector("#floatingHearts");
  holder.innerHTML = "";
  for (let i = 0; i < 34; i++) {
    const h = document.createElement("span");
    h.className = "float-heart";
    h.textContent = Math.random() > .45 ? "♥" : "♡";
    h.style.left = `${Math.random() * 100}vw`;
    h.style.fontSize = `${14 + Math.random() * 24}px`;
    h.style.animationDuration = `${4 + Math.random() * 5}s`;
    h.style.animationDelay = `${Math.random() * 4}s`;
    holder.appendChild(h);
  }
}

const oldLaunchConfetti = launchConfetti;
launchConfetti = function() {
  oldLaunchConfetti();
  launchHearts();
  if (musicStarted) {
    const target = .62;
    const rise = setInterval(() => {
      music.volume = Math.min(target, music.volume + .02);
      if (music.volume >= target) clearInterval(rise);
    }, 100);
  }
};
