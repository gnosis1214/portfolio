/* Blog interactions. Runs after pages/runtime.js, which handles the menu, theme, tabs, reveals and tilt. */
(function () {
  "use strict";
  var root = document.getElementById("zeno-portfolio");
  if (!root || root.dataset.zgBlog === "true") return;
  root.dataset.zgBlog = "true";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var all = function (selector, within) {
    return Array.prototype.slice.call((within || root).querySelectorAll(selector));
  };
  function track(name, label) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "zg_event", zg_event: name, zg_label: label || "" });
  }
  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (err) {}
    return null;
  }

  /* ---------- toast ---------- */
  var toast = root.querySelector(".zg-bl-toast");
  var toastTimer = 0;
  function say(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("on");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toast.classList.remove("on"); }, 2200);
  }
  function copy(text, done) {
    var ok = function () { say(done); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(ok, function () { window.prompt("Copy this link:", text); });
    } else {
      window.prompt("Copy this link:", text);
    }
  }

  var post = root.querySelector("[data-zg-post]");
  var slug = post ? post.dataset.zgPost : "";
  var pageUrl = window.location.href.split("#")[0];

  /* ---------- heading links and share buttons ---------- */
  all("[data-zg-copy-anchor]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var id = a.getAttribute("href");
      history.replaceState(null, "", id);
      copy(pageUrl + id, "Link to this section copied");
      track("blog_copy_section", slug + id);
    });
  });
  all("[data-zg-copy-page]").forEach(function (b) {
    b.addEventListener("click", function () { copy(pageUrl, "Link copied"); });
  });
  if (navigator.share) {
    all("[data-zg-native-share]").forEach(function (b) {
      b.hidden = false;
      b.addEventListener("click", function () {
        navigator.share({ title: document.title, url: pageUrl }).catch(function () {});
      });
    });
  }

  /* ---------- table of contents: highlight the section in view, count down the minutes ---------- */
  var tocLinks = all("[data-zg-toc]");
  var heads = [];
  tocLinks.forEach(function (a) {
    var h = document.getElementById(a.getAttribute("href").slice(1));
    if (h && heads.indexOf(h) < 0) heads.push(h);
  });
  var leftEl = root.querySelector("[data-zg-left]");
  var body = root.querySelector(".zg-bl-body");
  var mins = post ? Number(post.dataset.zgMins) || 1 : 0;
  var mobileToc = root.querySelector(".zg-bl-toc-m");
  var current = "";
  var finished = false;
  function spy() {
    if (!body) return;
    var line = window.innerHeight * 0.3;
    var active = heads.length ? heads[0].id : "";
    heads.forEach(function (h) { if (h.getBoundingClientRect().top <= line) active = h.id; });
    if (active !== current) {
      current = active;
      tocLinks.forEach(function (a) {
        var on = a.getAttribute("href") === "#" + active;
        a.classList.toggle("on", on);
        if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
    }
    var r = body.getBoundingClientRect();
    var p = Math.min(1, Math.max(0, (window.innerHeight * 0.5 - r.top) / Math.max(1, r.height)));
    if (leftEl) leftEl.textContent = String(Math.max(0, Math.ceil(mins * (1 - p))));
    if (p > 0.92 && !finished) {
      finished = true;
      track("blog_read_complete", slug);
    }
  }
  if (body) {
    var spyTick = false;
    window.addEventListener("scroll", function () {
      if (!spyTick) { spyTick = true; window.requestAnimationFrame(function () { spyTick = false; spy(); }); }
    }, { passive: true });
    window.addEventListener("resize", spy, { passive: true });
    spy();
  }
  tocLinks.forEach(function (a) {
    a.addEventListener("click", function () {
      if (mobileToc && mobileToc.contains(a)) mobileToc.open = false;
      track("blog_toc", slug + a.getAttribute("href"));
    });
  });

  /* ---------- hero image drifts a little as you scroll ---------- */
  var hero = root.querySelector("[data-zg-parallax]");
  if (hero && !reduce) {
    var img = hero.querySelector("img");
    var heroTick = false;
    var drift = function () {
      heroTick = false;
      var r = hero.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      var p = (window.innerHeight - r.top) / (window.innerHeight + r.height);
      img.style.transform = "translateY(" + ((p - 0.5) * 8).toFixed(2) + "%) scale(1.12)";
    };
    window.addEventListener("scroll", function () {
      if (!heroTick) { heroTick = true; window.requestAnimationFrame(drift); }
    }, { passive: true });
    drift();
  }

  /* ---------- checklists: tick items, watch the score ---------- */
  all("[data-zg-check]").forEach(function (box) {
    var key = "zg-bl-" + box.dataset.zgCheck;
    var inputs = all('input[type="checkbox"]', box);
    var fg = box.querySelector(".zg-bl-ring-fg");
    var num = box.querySelector(".zg-bl-ring-n strong");
    var prompt = box.querySelector(".zg-bl-res-prompt");
    var results = all(".zg-bl-res:not(.zg-bl-res-prompt)", box);
    var sendTimer = 0;
    var before = store(key);
    /* Until the visitor ticks something (now or on an earlier visit), show the prompt, not a score. */
    var touched = before !== null;
    var saved = (before || "").split(",");
    inputs.forEach(function (input) { input.checked = saved.indexOf(input.value) > -1; });
    function update(fromUser) {
      if (fromUser) touched = true;
      var ticked = inputs.filter(function (i) { return i.checked; });
      var score = ticked.length;
      num.textContent = String(score);
      fg.style.strokeDashoffset = String(100 - (score / inputs.length) * 100);
      var shown = false;
      results.forEach(function (r) {
        var on = touched && !shown && score <= Number(r.dataset.upto);
        if (on) shown = true;
        r.classList.toggle("on", on);
      });
      prompt.classList.toggle("on", !touched);
      box.classList.toggle("is-started", touched);
      if (touched) store(key, ticked.map(function (i) { return i.value; }).join(","));
      if (fromUser) {
        window.clearTimeout(sendTimer);
        sendTimer = window.setTimeout(function () { track("blog_checklist", box.dataset.zgCheck + ":" + score + "/" + inputs.length); }, 1500);
      }
    }
    inputs.forEach(function (input) { input.addEventListener("change", function () { update(true); }); });
    update(false);
  });

  /* ---------- myth / fact cards ---------- */
  all(".zg-bl-flip").forEach(function (card) {
    card.addEventListener("click", function () {
      var on = card.getAttribute("aria-pressed") !== "true";
      card.setAttribute("aria-pressed", String(on));
      if (on) track("blog_flip", card.dataset.zgLabel);
    });
  });

  /* ---------- was this useful? ---------- */
  all("[data-zg-feedback]").forEach(function (box) {
    var key = "zg-bl-fb-" + box.dataset.zgFeedback;
    var thanks = box.querySelector(".zg-bl-fb-thanks");
    var buttons = all("[data-zg-vote]", box);
    function done(vote, fromUser) {
      buttons.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.dataset.zgVote === vote));
        b.disabled = true;
      });
      thanks.textContent = vote === "yes"
        ? "Thanks! Glad it helped. New posts go up every week."
        : "Thanks for saying so. Tell me what was missing and I'll cover it.";
      thanks.hidden = false;
      if (fromUser) {
        store(key, vote);
        track("blog_feedback", box.dataset.zgFeedback + ":" + vote);
      }
    }
    buttons.forEach(function (b) {
      b.addEventListener("click", function () { done(b.dataset.zgVote, true); });
    });
    var before = store(key);
    if (before) done(before, false);
  });

  /* ---------- archive: search, topic chips and sort, kept in the URL ---------- */
  var grid = root.querySelector(".zg-bl-archive");
  if (grid) {
    var cards = all(".zg-bl-card", grid);
    var chips = all(".zg-bl-chip");
    var q = root.querySelector("[data-zg-q]");
    var sort = root.querySelector("[data-zg-sort]");
    var count = root.querySelector(".zg-bl-count");
    var empty = root.querySelector(".zg-bl-empty");
    var params = new URLSearchParams(window.location.search);
    var topic = params.get("topic") || "";
    if (!chips.some(function (c) { return c.dataset.topic === topic; })) topic = "";
    q.value = params.get("q") || "";
    var searchTimer = 0;

    function apply(fromUser) {
      var words = q.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      var order = cards.slice().sort(function (a, b) {
        return sort.value === "old" ? a.dataset.date.localeCompare(b.dataset.date) : b.dataset.date.localeCompare(a.dataset.date);
      });
      var shown = 0;
      order.forEach(function (card) {
        grid.appendChild(card);
        var ok = (!topic || card.dataset.topic === topic) && words.every(function (w) { return card.dataset.text.indexOf(w) > -1; });
        card.hidden = !ok;
        card.classList.remove("zg-bl-lead");
        if (ok) {
          card.classList.add("zg-in");
          if (!shown && !words.length && !topic && sort.value === "new") card.classList.add("zg-bl-lead");
          shown += 1;
        }
      });
      chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c.dataset.topic === topic)); });
      var total = cards.length;
      count.textContent = shown === total ? "Showing all " + total + " posts" : "Showing " + shown + " of " + total + " posts";
      empty.hidden = shown > 0;
      var next = new URLSearchParams();
      if (topic) next.set("topic", topic);
      if (words.length) next.set("q", q.value.trim());
      var qs = next.toString();
      history.replaceState(null, "", window.location.pathname + (qs ? "?" + qs : ""));
      if (fromUser === "search") {
        window.clearTimeout(searchTimer);
        searchTimer = window.setTimeout(function () { track("blog_search", String(shown)); }, 1200);
      }
    }
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        topic = c.dataset.topic;
        apply("topic");
        track("blog_filter", topic || "all");
      });
    });
    q.addEventListener("input", function () { apply("search"); });
    sort.addEventListener("change", function () { apply("sort"); track("blog_sort", sort.value); });
    root.querySelector("[data-zg-reset]").addEventListener("click", function () {
      topic = "";
      q.value = "";
      apply("reset");
      q.focus();
    });
    apply(false);
  }
})();
