(() => {
  const landing = document.querySelector(".landing");
  const envelopeButton = document.querySelector(".envelope-hit");
  const hint = document.querySelector(".tap-hint");
  const dots = [...document.querySelectorAll(".tap-dots i")];
  const confettiLayer = document.querySelector(".confetti-layer");
  const letterSection = document.querySelector("#letter");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let taps = 0;
  let opened = false;
  let shakeTimer;

  const hintCopy = [
    "A little closer… 💗",
    "You found a secret ✨",
    "One more, my love 💌",
  ];
  const vibration = [30, 40, 50, 70];
  const confettiColors = ["#ffd6e7", "#ffb6d2", "#ff8fba", "#e85d8e", "#ffffff", "#f7d9a6"];

  function sparkleAroundEnvelope() {
    if (reduceMotion.matches) return;
    const envelope = document.querySelector(".envelope");
    const bounds = envelope.getBoundingClientRect();
    const landingBounds = landing.getBoundingClientRect();
    const centerX = bounds.left - landingBounds.left + bounds.width / 2;
    const centerY = bounds.top - landingBounds.top + bounds.height / 2;
    for (let index = 0; index < 5; index += 1) {
      const bit = document.createElement("span");
      const angle = (Math.PI * 2 * index) / 5 + Math.random() * 0.3;
      const distance = 48 + Math.random() * 34;
      bit.className = "tap-spark";
      bit.textContent = index % 2 ? "♡" : "✦";
      bit.style.left = `${centerX}px`;
      bit.style.top = `${centerY}px`;
      bit.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
      bit.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
      bit.style.setProperty("--delay", `${index * 18}ms`);
      landing.append(bit);
      window.setTimeout(() => bit.remove(), 750);
    }
  }

  function burstConfetti() {
    if (reduceMotion.matches) return;
    for (let index = 0; index < 42; index += 1) {
      const piece = document.createElement("i");
      const angle = Math.random() * Math.PI * 2;
      const distance = 95 + Math.random() * Math.min(window.innerWidth * 0.48, 230);
      piece.className = "confetti";
      piece.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
      piece.style.setProperty("--y", `${Math.sin(angle) * distance + 100}px`);
      piece.style.setProperty("--spin", `${Math.random() * 800 - 400}deg`);
      piece.style.setProperty("--duration", `${1100 + Math.random() * 1000}ms`);
      piece.style.setProperty("--size", `${4 + Math.random() * 5}px`);
      piece.style.setProperty("--color", confettiColors[Math.floor(Math.random() * confettiColors.length)]);
      confettiLayer.append(piece);
      window.setTimeout(() => piece.remove(), 2300);
    }
  }

  envelopeButton.addEventListener("click", () => {
    if (opened) return;
    taps += 1;
    if (navigator.vibrate) navigator.vibrate(vibration[Math.min(taps - 1, vibration.length - 1)]);

    envelopeButton.classList.remove("shake");
    // Restart the small shake for quick consecutive taps as well.
    void envelopeButton.offsetWidth;
    if (taps < 4) {
      envelopeButton.classList.add("shake");
      window.clearTimeout(shakeTimer);
      shakeTimer = window.setTimeout(() => envelopeButton.classList.remove("shake"), 320);
      sparkleAroundEnvelope();
      dots[taps - 1]?.classList.add("filled");
      hint.textContent = hintCopy[taps - 1];
      return;
    }

    opened = true;
    envelopeButton.setAttribute("aria-label", "Your letter is open");
    envelopeButton.setAttribute("aria-expanded", "true");
    dots.forEach((dot) => dot.classList.add("filled"));
    hint.textContent = "For you, with all my heart 💗";
    landing.classList.add("opened");
    burstConfetti();

    window.setTimeout(() => {
      letterSection.hidden = false;
      window.setTimeout(() => {
        letterSection.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });
      }, 100);
    }, reduceMotion.matches ? 100 : 1600);
  });
})();
