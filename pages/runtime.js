(function () {
  "use strict";
  var root = document.getElementById("zeno-portfolio");
  if (!root || root.dataset.zgReady === "true") return;
  root.dataset.zgReady = "true";
  root.classList.add("zg-js");

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var all = function (selector, within) {
    return Array.prototype.slice.call((within || root).querySelectorAll(selector));
  };

  var header = root.querySelector(".z-header");
  var menu = root.querySelector(".z-menu");
  var links = root.querySelector(".z-nav-links");
  var themeBtn = root.querySelector(".zg-theme");
  var bar = root.querySelector(".zg-progress");
  var year = root.querySelector(".z-year");

  if (year) year.textContent = new Date().getFullYear();

  /* ---------- tracking ---------- */
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

  /* ---------- mobile menu ---------- */
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

  /* ---------- theme ---------- */
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

  /* ---------- header + progress bar ---------- */
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

  /* ---------- reveal on scroll ---------- */
  var reveal = all(".zg-rv");
  if ("IntersectionObserver" in window && !reduce) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("zg-in");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    reveal.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveal.forEach(function (el) { el.classList.add("zg-in"); });
  }

  /* ---------- 360° demo cube ---------- */
  all("[data-zg-cube]").forEach(function (stage) {
    var cube = stage.querySelector(".zg-pg-cube");
    var rx = -18;
    var ry = 30;
    var drag = null;
    var touched = false;
    var frame = 0;
    function draw() {
      cube.style.setProperty("--zg-cx", rx + "deg");
      cube.style.setProperty("--zg-cy", ry + "deg");
    }
    function spin() {
      if (touched || !stage.offsetParent) { frame = 0; return; }
      ry += 0.35;
      draw();
      frame = window.requestAnimationFrame(spin);
    }
    stage.zgStart = function () {
      if (!frame && !touched && !reduce) frame = window.requestAnimationFrame(spin);
    };
    stage.addEventListener("pointerdown", function (e) {
      touched = true;
      drag = { x: e.clientX, y: e.clientY, rx: rx, ry: ry };
      stage.setPointerCapture(e.pointerId);
      stage.classList.add("dragging");
    });
    stage.addEventListener("pointermove", function (e) {
      if (!drag) return;
      ry = drag.ry + (e.clientX - drag.x) * 0.6;
      rx = Math.max(-70, Math.min(70, drag.rx - (e.clientY - drag.y) * 0.4));
      draw();
    });
    function stop() {
      drag = null;
      stage.classList.remove("dragging");
    }
    stage.addEventListener("pointerup", stop);
    stage.addEventListener("pointercancel", stop);
    cube.addEventListener("keydown", function (e) {
      var step = { ArrowLeft: [0, -15], ArrowRight: [0, 15], ArrowUp: [15, 0], ArrowDown: [-15, 0] }[e.key];
      if (!step) return;
      e.preventDefault();
      touched = true;
      rx = Math.max(-70, Math.min(70, rx + step[0]));
      ry += step[1];
      draw();
    });
    draw();
  });

  /* ---------- tabs: the case study views and the numbered steps ---------- */
  all("[data-zg-tabs]").forEach(function (box) {
    var tabs = all('[role="tab"]', box);
    var panels = all('[role="tabpanel"]', box);
    function show(index, focus) {
      tabs.forEach(function (tab, i) {
        var on = i === index;
        tab.setAttribute("aria-selected", String(on));
        tab.tabIndex = on ? 0 : -1;
        tab.classList.toggle("done", i < index);
        panels[i].classList.toggle("on", on);
      });
      box.style.setProperty("--zg-s", String(tabs.length > 1 ? index / (tabs.length - 1) : 0));
      if (focus) tabs[index].focus();
      var cube = panels[index].querySelector("[data-zg-cube]");
      if (cube) cube.zgStart();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { show(i); });
      tab.addEventListener("keydown", function (e) {
        var last = tabs.length - 1;
        var to = -1;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") to = i === last ? 0 : i + 1;
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") to = i === 0 ? last : i - 1;
        if (e.key === "Home") to = 0;
        if (e.key === "End") to = last;
        if (to < 0) return;
        e.preventDefault();
        show(to, true);
      });
    });
    show(0);
  });

  /* ---------- service cards light up their part of the drawing ---------- */
  all("[data-zg-explore]").forEach(function (box) {
    var cards = all(".zg-pg-item", box);
    var parts = all(".zg-pg-part", box);
    var caption = box.querySelector(".zg-pg-cap span");
    var hovering = false;
    var lockedUntil = 0;
    function light(name) {
      parts.forEach(function (part) {
        part.classList.toggle("on", part.dataset.part === name || part.dataset.with === name);
      });
      cards.forEach(function (card) {
        var on = card.dataset.part === name;
        card.classList.toggle("on", on);
        if (on) caption.textContent = card.querySelector("h3").textContent;
      });
    }
    cards.forEach(function (card) {
      card.addEventListener("mouseenter", function () { if (finePointer) light(card.dataset.part); });
      card.addEventListener("click", function () {
        lockedUntil = Date.now() + 700;
        light(card.dataset.part);
      });
    });
    parts.forEach(function (part) {
      part.addEventListener("click", function () {
        var name = part.dataset.part;
        var card = box.querySelector('.zg-pg-item[data-part="' + name + '"]');
        lockedUntil = Date.now() + 900;
        light(name);
        card.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      });
    });
    box.addEventListener("mouseenter", function () { hovering = finePointer; });
    box.addEventListener("mouseleave", function () { hovering = false; });
    if ("IntersectionObserver" in window) {
      var cardObserver = new IntersectionObserver(function (entries) {
        if (hovering || Date.now() < lockedUntil) return;
        entries.forEach(function (entry) {
          if (entry.isIntersecting) light(entry.target.dataset.part);
        });
      }, { rootMargin: "-55% 0px -35% 0px" });
      cards.forEach(function (card) { cardObserver.observe(card); });
    }
    light(cards[0].dataset.part);
  });

  /* ---------- graphics that lean toward the mouse ---------- */
  if (finePointer && !reduce) {
    all("[data-zg-tilt]").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var rect = el.getBoundingClientRect();
        el.style.setProperty("--zg-ry", ((e.clientX - rect.left) / rect.width - 0.5) * 10 + "deg");
        el.style.setProperty("--zg-rx", (0.5 - (e.clientY - rect.top) / rect.height) * 8 + "deg");
      });
      el.addEventListener("pointerleave", function () {
        el.style.removeProperty("--zg-rx");
        el.style.removeProperty("--zg-ry");
      });
    });
  }
})();
