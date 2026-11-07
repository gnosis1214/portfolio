(function () {
  "use strict";
  var root = document.getElementById("zeno-portfolio");
  if (!root || root.dataset.zgReady === "true") return;
  root.dataset.zgReady = "true";

  var header = root.querySelector(".z-header");
  var menu = root.querySelector(".z-menu");
  var links = root.querySelector(".z-nav-links");
  var themeBtn = root.querySelector(".zg-theme");
  var bar = root.querySelector(".zg-progress");
  var year = root.querySelector(".z-year");

  if (year) year.textContent = new Date().getFullYear();

  function zgTrack(name, label, url) {
    window.dataLayer = window.dataLayer || [];
    var data = { event: "zg_event", zg_event: name, zg_label: label || "" };
    if (url) data.zg_url = url;
    window.dataLayer.push(data);
  }
  root.addEventListener("click", function (e) {
    var el = e.target.closest("[data-zg-event]");
    if (el) zgTrack(el.dataset.zgEvent, el.dataset.zgLabel, el.href);
  });

  function zgMenu(open) {
    links.classList.toggle("open", open);
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.textContent = open ? "✕" : "☰";
  }
  menu.addEventListener("click", function () {
    zgMenu(!links.classList.contains("open"));
  });
  document.addEventListener("click", function (e) {
    if (!links.contains(e.target) && !menu.contains(e.target)) zgMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") zgMenu(false);
  });

  function zgTheme(theme) {
    root.setAttribute("data-zg-theme", theme);
    themeBtn.setAttribute("aria-pressed", String(theme === "light"));
    themeBtn.setAttribute("aria-label", theme === "light" ? "Switch to dark theme" : "Switch to light theme");
  }
  zgTheme(root.getAttribute("data-zg-theme"));
  themeBtn.addEventListener("click", function () {
    var next = root.getAttribute("data-zg-theme") === "light" ? "dark" : "light";
    zgTheme(next);
    try { localStorage.setItem("zg-theme", next); } catch (err) {}
    zgTrack("theme_toggle", next);
  });

  var ticking = false;
  function zgScroll() {
    ticking = false;
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    header.classList.toggle("zg-scrolled", window.scrollY > 40);
    bar.style.setProperty("--zg-p", max > 0 ? String(window.scrollY / max) : "0");
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(zgScroll); }
  }, { passive: true });
  zgScroll();
})();
