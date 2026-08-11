document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var openButton = document.getElementById("openInvitation");
  var musicButton = document.getElementById("musicButton");
  var music = document.getElementById("weddingMusic");
  var nav = document.getElementById("nav");
  var invitationOpened = false;

  // Guest name from ?to=Nama
  var params = new URLSearchParams(window.location.search);
  var guest = params.get("to");
  if (guest) {
    var guestName = document.getElementById("guestName");
    if (guestName) guestName.textContent = guest.replace(/\+/g, " ");
  }

  // OPEN BUTTON — intentionally simple for GitHub Pages.
  function openInvitation() {
    if (invitationOpened) return;
    invitationOpened = true;

    openButton.disabled = true;
    openButton.querySelector("span").textContent = "Membuka...";

    document.body.classList.add("opened");
    nav.classList.add("show");
    musicButton.classList.add("show");

    // Try music only after the user's tap.
    if (music) {
      var playPromise = music.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {
          // Browser may block autoplay. The invitation still opens.
        });
      }
    }

    window.scrollTo(0, 0);

    setTimeout(function () {
      var couple = document.getElementById("couple");
      if (couple) couple.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 250);
  }

  openButton.addEventListener("click", openInvitation);
  openButton.addEventListener("touchend", function (event) {
    event.preventDefault();
    openInvitation();
  }, { passive: false });

  // Music button
  function updateMusicButton() {
    if (!music) return;
    musicButton.classList.toggle("playing", !music.paused);
    musicButton.textContent = music.paused ? "♫" : "Ⅱ";
  }

  musicButton.addEventListener("click", function () {
    if (!music) return;
    if (music.paused) {
      music.play().catch(function () {});
    } else {
      music.pause();
    }
  });

  if (music) {
    music.addEventListener("play", updateMusicButton);
    music.addEventListener("pause", updateMusicButton);
  }

  // Countdown
  var targetDate = new Date("2026-12-20T08:00:00+07:00").getTime();

  function updateCountdown() {
    var distance = targetDate - Date.now();

    if (distance < 0) distance = 0;

    var days = Math.floor(distance / 86400000);
    var hours = Math.floor((distance % 86400000) / 3600000);
    var minutes = Math.floor((distance % 3600000) / 60000);
    var seconds = Math.floor((distance % 60000) / 1000);

    document.getElementById("days").textContent = String(days).padStart(2, "0");
    document.getElementById("hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Memory slider
  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var dotsContainer = document.getElementById("dots");
  var current = document.getElementById("current");
  var index = 0;
  var timer;

  slides.forEach(function (_, i) {
    var dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", "Foto " + (i + 1));
    dot.addEventListener("click", function () {
      showSlide(i);
      restartSlider();
    });
    dotsContainer.appendChild(dot);
  });

  function showSlide(newIndex) {
    index = (newIndex + slides.length) % slides.length;

    slides.forEach(function (slide, i) {
      slide.classList.toggle("active", i === index);
    });

    Array.prototype.slice.call(dotsContainer.children).forEach(function (dot, i) {
      dot.classList.toggle("active", i === index);
    });

    current.textContent = String(index + 1).padStart(2, "0");
  }

  function restartSlider() {
    clearInterval(timer);
    timer = setInterval(function () {
      showSlide(index + 1);
    }, 5000);
  }

  document.getElementById("prev").addEventListener("click", function () {
    showSlide(index - 1);
    restartSlider();
  });

  document.getElementById("next").addEventListener("click", function () {
    showSlide(index + 1);
    restartSlider();
  });

  var slider = document.getElementById("slider");
  var touchStart = 0;

  slider.addEventListener("touchstart", function (e) {
    touchStart = e.changedTouches[0].screenX;
  }, { passive: true });

  slider.addEventListener("touchend", function (e) {
    var delta = e.changedTouches[0].screenX - touchStart;
    if (Math.abs(delta) > 45) {
      showSlide(delta < 0 ? index + 1 : index - 1);
      restartSlider();
    }
  }, { passive: true });

  showSlide(0);
  restartSlider();

  // RSVP -> WhatsApp
  document.getElementById("rsvpForm").addEventListener("submit", function (e) {
    e.preventDefault();

    var name = document.getElementById("rsvpName").value.trim();
    var attendance = document.getElementById("rsvpAttendance").value;
    var message = document.getElementById("rsvpMessage").value.trim();

    if (!name || !attendance) return;

    var text =
      "Halo Aulia & Raka,%0A%0A" +
      "Nama: " + encodeURIComponent(name) + "%0A" +
      "Kehadiran: " + encodeURIComponent(attendance) + "%0A" +
      "Ucapan: " + encodeURIComponent(message || "-");

    window.open("https://wa.me/6282262522346?text=" + text, "_blank");
  });
});