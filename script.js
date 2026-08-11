const loader = document.getElementById("loader");
const invitation = document.getElementById("invitation");
const openButton = document.getElementById("openInvitation");
const music = document.getElementById("weddingMusic");
const musicToggle = document.getElementById("musicToggle");

window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("hide"), 500);
});

async function openInvitation() {
  if (!openButton || openButton.dataset.opened === "true") return;

  openButton.dataset.opened = "true";
  openButton.classList.add("is-opening");
  openButton.disabled = true;

  // Unlock the page immediately, so the invitation can scroll on every browser.
  invitation.classList.remove("locked");
  document.documentElement.classList.add("invitation-open");
  document.body.classList.add("invitation-open");
  document.body.style.overflow = "auto";
  document.documentElement.style.overflow = "auto";

  // Start music after the user's tap. If the browser blocks it, the invitation
  // still opens normally.
  try {
    await music.play();
  } catch (error) {
    console.log("Autoplay musik diblokir browser; undangan tetap dibuka.");
  }

  setMusicState?.(!music.paused);

  openButton.classList.remove("is-opening");

  // Move to the beginning of the invitation reliably.
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });

  setTimeout(() => {
    openButton.disabled = false;
  }, 500);
}

openButton?.addEventListener("click", openInvitation);
openButton?.addEventListener("touchend", (event) => {
  event.preventDefault();
  openInvitation();
}, { passive: false });

musicToggle.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      musicToggle.classList.add("playing");
    } catch (error) {}
  } else {
    music.pause();
    musicToggle.classList.remove("playing");
  }
});

// Countdown
const weddingDate = new Date("December 20, 2026 09:00:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  if (distance <= 0) {
    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Nama tamu dari URL:
// contoh: ?to=Dhani
const params = new URLSearchParams(window.location.search);
const guest = params.get("to");

if (guest) {
  document.getElementById("guestName").textContent =
    decodeURIComponent(guest.replace(/\+/g, " "));
}

// RSVP WhatsApp
const rsvpForm = document.getElementById("rsvpForm");

rsvpForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("rsvpName").value.trim();
  const attendance = document.getElementById("attendance").value;
  const guestCount = document.getElementById("guestCount").value;
  const message = document.getElementById("message").value.trim();

  // Ganti nomor ini dengan nomor WhatsApp Anda.
  const whatsappNumber = "6282262522346";

  const text =
`Halo Aulia & Raka 👋

Saya *${name}* ingin memberikan konfirmasi untuk undangan pernikahan:

Kehadiran: ${attendance}
Jumlah tamu: ${guestCount} orang
Ucapan: ${message || "-"}

Terima kasih.`;

  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
});


/* V1.2 — Cinematic memory slider */
const memorySlides = [...document.querySelectorAll(".memory-slide")];
const memoryDots = [...document.querySelectorAll(".memory-dot")];
const memoryCurrent = document.getElementById("memoryCurrent");
const memoryPrev = document.getElementById("memoryPrev");
const memoryNext = document.getElementById("memoryNext");
const memorySlider = document.getElementById("memorySlider");

let memoryIndex = 0;
let memoryTimer;

function showMemory(index) {
  if (!memorySlides.length) return;
  memoryIndex = (index + memorySlides.length) % memorySlides.length;

  memorySlides.forEach((slide, i) => slide.classList.toggle("is-active", i === memoryIndex));
  memoryDots.forEach((dot, i) => dot.classList.toggle("is-active", i === memoryIndex));

  if (memoryCurrent) {
    memoryCurrent.textContent = String(memoryIndex + 1).padStart(2, "0");
  }
}

function startMemoryAutoplay() {
  clearInterval(memoryTimer);
  memoryTimer = setInterval(() => showMemory(memoryIndex + 1), 5000);
}

memoryPrev?.addEventListener("click", () => {
  showMemory(memoryIndex - 1);
  startMemoryAutoplay();
});

memoryNext?.addEventListener("click", () => {
  showMemory(memoryIndex + 1);
  startMemoryAutoplay();
});

memoryDots.forEach(dot => {
  dot.addEventListener("click", () => {
    showMemory(Number(dot.dataset.index));
    startMemoryAutoplay();
  });
});

let touchStartX = 0;
memorySlider?.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].screenX;
}, {passive: true});

memorySlider?.addEventListener("touchend", e => {
  const delta = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(delta) > 45) {
    showMemory(delta < 0 ? memoryIndex + 1 : memoryIndex - 1);
    startMemoryAutoplay();
  }
}, {passive: true});

startMemoryAutoplay();

/* Tap photo to open full-screen */
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

memorySlides.forEach(slide => {
  slide.addEventListener("click", () => {
    const img = slide.querySelector("img");
    if (!img || !lightbox || !lightboxImage) return;
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
});

function closeLightbox() {
  lightbox?.classList.remove("open");
  lightbox?.setAttribute("aria-hidden", "true");
  document.body.style.overflow = invitation.classList.contains("locked") ? "hidden" : "auto";
}

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", e => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeLightbox();
});

/* Reveal sections while scrolling */
const revealTargets = document.querySelectorAll(
  ".intro, .couple, .story, .countdown-section, .event, .gallery, .quote, .rsvp, .closing"
);

revealTargets.forEach(el => el.classList.add("reveal-on-scroll"));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold: 0.12});

revealTargets.forEach(el => revealObserver.observe(el));


/* V2 — navigation, active section and premium audio state */
const topNavLinks = [...document.querySelectorAll(".top-nav a")];
const navSections = topNavLinks
  .map(link => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      topNavLinks.forEach(link => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === "#" + entry.target.id
        );
      });
    }
  });
}, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });

navSections.forEach(section => navObserver.observe(section));

const musicLabel = document.getElementById("musicLabel");

function setMusicState(isPlaying) {
  musicToggle.classList.toggle("playing", isPlaying);
  musicToggle.textContent = isPlaying ? "Ⅱ" : "♫";
  musicToggle.setAttribute("aria-label", isPlaying ? "Jeda musik" : "Putar musik");
  if (musicLabel) musicLabel.textContent = isPlaying ? "PLAYING • OUR SONG" : "OUR SONG";
}

const originalOpen = openButton;
originalOpen.addEventListener("click", () => {
  setTimeout(() => setMusicState(!music.paused), 300);
});

music.addEventListener("play", () => setMusicState(true));
music.addEventListener("pause", () => setMusicState(false));

/* Smooth nav with invitation lock protection */
topNavLinks.forEach(link => {
  link.addEventListener("click", e => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
