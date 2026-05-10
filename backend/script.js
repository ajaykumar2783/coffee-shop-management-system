const typingText = document.getElementById("typingText");
const words = [
  "Web Development",
  "Automation Tools",
  "ML Projects",
  "Full-Stack Projects",
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const current = words[wordIndex];

  if (!isDeleting && charIndex < current.length) {
    charIndex++;
    typingText.textContent = current.substring(0, charIndex);
    setTimeout(typeEffect, 90);
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
    typingText.textContent = current.substring(0, charIndex);
    setTimeout(typeEffect, 45);
  } else {
    isDeleting = !isDeleting;
    if (!isDeleting) wordIndex = (wordIndex + 1) % words.length;
    setTimeout(typeEffect, 900);
  }
}
typeEffect();

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

const themeBtn = document.getElementById("themeBtn");
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const icon = themeBtn.querySelector("i");
  icon.className = document.body.classList.contains("dark-mode")
    ? "fa-solid fa-sun"
    : "fa-solid fa-moon";
});

const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    projectCards.forEach((card) => {
      const show = filter === "all" || card.dataset.category === filter;
      card.style.display = show ? "block" : "none";
    });
  });
});

const reveals = document.querySelectorAll(".reveal");
const backTop = document.getElementById("backTop");
let counted = false;

function revealOnScroll() {
  reveals.forEach((item) => {
    const top = item.getBoundingClientRect().top;
    if (top < window.innerHeight - 90) item.classList.add("active");
  });

  if (window.scrollY > 350) backTop.classList.add("show");
  else backTop.classList.remove("show");

  const metrics = document.querySelector(".metrics");
  if (
    !counted &&
    metrics.getBoundingClientRect().top < window.innerHeight - 80
  ) {
    counted = true;
    document.querySelectorAll("[data-count]").forEach((counter) => {
      const target = +counter.dataset.count;
      let count = 0;
      const speed = Math.max(1, Math.floor(target / 60));
      const timer = setInterval(() => {
        count += speed;
        if (count >= target) {
          counter.textContent = target + (target === 100 ? "%" : "+");
          clearInterval(timer);
        } else {
          counter.textContent = count;
        }
      }, 25);
    });
  }
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

backTop.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" }),
);

function sendMessage(e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const text = `Hello, I am ${name}. Email: ${email}. Project details: ${message}`;
  window.location.href = `mailto:devduo.in@gmail.com?subject=New Project Enquiry&body=${encodeURIComponent(text)}`;
}
