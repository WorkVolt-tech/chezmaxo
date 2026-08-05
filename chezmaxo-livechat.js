/* =========================================================================
   Chezmaxo — Live chat widget (self-contained, no backend)
   Same "fake backend" philosophy used elsewhere on this site: everything
   runs client-side. Keyword matching finds the right reply, and an
   illustrated character reacts with a matching expression for each answer.
   ========================================================================= */
(function () {
  "use strict";

  // ---------- Keyword -> response data, each tagged with an emotion ----------
  // Loaded live from Supabase (chat_responses table) so it's fully
  // editable from the admin dashboard without touching this file. A
  // small built-in set covers the gap before that first fetch resolves,
  // or if Supabase is unreachable.
  var RESPONSES = [
    { keywords: ["bonjour","allo","salut","hello","hi","hey"],
      fr: "Bonjour ! Je suis l'assistant de Chezmaxo. Posez-moi vos questions sur les prix, les délais, ou comment ça fonctionne !",
      en: "Hi there! I'm Chezmaxo's assistant. Ask me about pricing, timelines, or how everything works!", emotion: "happy" },
    { keywords: ["combien ça coûte","how much does a website","website cost","pricing"],
      fr: "Un site Starter commence à 199 $, un site Business à 399 $, et les projets plus avancés sont soumis à un devis personnalisé.",
      en: "A Starter website starts at $199, a Business website at $399, and more advanced projects get a custom quote.", emotion: "happy" },
    { keywords: ["forfait d'entretien","care plan","monthly plan"],
      fr: "Nos forfaits d'entretien sont à 25 $/mois (Starter), 50 $/mois (Soutien mensuel) ou 100 $/mois (Affaires).",
      en: "Care plans run $25/month (Starter), $50/month (Monthly Support), or $100/month (Business Care).", emotion: "happy" },
    { keywords: ["comment ça marche","how does it work","how it works"],
      fr: "On discute de votre projet, je vous envoie un devis, vous approuvez, je construis le site, et vous approuvez le résultat avant le lancement.",
      en: "We talk about your project, I send a quote, you approve it, I build the site, and you approve the result before launch.", emotion: "get_help" },
    { keywords: ["parler à quelqu'un","speak to someone","talk to a human","real person"],
      fr: "Bien sûr ! Laissez-moi votre courriel et votre question, et on vous répond rapidement.",
      en: "Of course! Leave your email and your question, and we'll get back to you quickly.", emotion: "get_help" },
    { keywords: ["es tu un robot","are you a robot","are you an ai"],
      fr: "Je suis un assistant automatisé qui répond aux questions courantes — mais une vraie personne peut prendre le relais à tout moment !",
      en: "I'm an automated assistant that answers common questions — but a real person can jump in any time!", emotion: "confused" },
  ];

  // Config: set these inline on the page before this script loads, e.g.
  //   <script>const CHAT_SUPABASE_URL = "https://xxxx.supabase.co"; const CHAT_SUPABASE_ANON_KEY = "...";</script>
  //   <script src="chezmaxo-livechat.js"></script>
  var chatConfigured = typeof CHAT_SUPABASE_URL !== 'undefined' && typeof CHAT_SUPABASE_ANON_KEY !== 'undefined' &&
    CHAT_SUPABASE_URL.indexOf('YOUR_') === -1 && CHAT_SUPABASE_ANON_KEY.indexOf('YOUR_') === -1;

  if (chatConfigured) {
    fetch(CHAT_SUPABASE_URL + '/rest/v1/chat_responses?select=keywords,response_en,response_fr,emotion&active=eq.true&order=sort_order.asc', {
      headers: { apikey: CHAT_SUPABASE_ANON_KEY, Authorization: 'Bearer ' + CHAT_SUPABASE_ANON_KEY }
    }).then(function (r) { return r.json(); })
      .then(function (rows) {
        if (!Array.isArray(rows) || !rows.length) return;
        RESPONSES = rows.map(function (row) {
          return {
            keywords: row.keywords.split(',').map(function (k) { return k.trim(); }),
            fr: row.response_fr,
            en: row.response_en,
            emotion: row.emotion || 'happy'
          };
        });
      })
      .catch(function () { /* keep the built-in fallback set above */ });
  }

  var FALLBACK = {
    fr: "Merci pour votre message ! Je n'ai pas de réponse précise pour ça, mais Maxo peut vous répondre directement — laissez votre courriel, ou écrivez-nous via le formulaire de contact.",
    en: "Thanks for your message! I don't have a specific answer for that, but Maxo can help directly — leave your email, or reach out through the contact form.",
    emotion: "confused"
  };

  var GREETING = {
    fr: "Bonjour ! Je suis l'assistant de Chezmaxo. Posez-moi vos questions sur les prix, les délais, ou comment ça fonctionne — sérieuses ou pas !",
    en: "Hi! I'm Chezmaxo's assistant. Ask me about pricing, timelines, or how everything works — serious questions or silly ones, I don't mind!",
    emotion: "get_help"
  };

  var TYPING_EMOTION = "thinking";

  var HISTORY_KEY = "chezmaxo_chat_history";
  var NAME_KEY = "chezmaxo_chat_visitor_name";

  function getLang() {
    var l = "en";
    try {
      l = localStorage.getItem("chezmaxo-lang") || document.documentElement.getAttribute("lang") || "en";
    } catch (e) {}
    return l === "fr" ? "fr" : "en";
  }

  function matchKeyword(text) {
    var lower = text.toLowerCase();
    for (var i = 0; i < RESPONSES.length; i++) {
      var entry = RESPONSES[i];
      for (var j = 0; j < entry.keywords.length; j++) {
        if (containsKeyword(lower, entry.keywords[j].toLowerCase())) return entry;
      }
    }
    return null;
  }

  // Boundary-aware match: a keyword only counts if it's not embedded inside
  // a larger word (so "hi" matches "hi there" but not "this").
  function containsKeyword(text, keyword) {
    var escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    var re = new RegExp("(^|[^a-zA-Z\u00C0-\u00FF])" + escaped + "([^a-zA-Z\u00C0-\u00FF]|$)", "i");
    return re.test(text);
  }

  function avatarUrl(emotion) {
    return "images/chat/" + emotion + ".webp";
  }

  var visitorName = "";
  try { visitorName = localStorage.getItem(NAME_KEY) || ""; } catch (e) {}

  function loadHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch (e) { return []; }
  }
  function saveHistory(h) {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(h)); } catch (e) {}
  }
  function clearHistory() {
    try { localStorage.removeItem(HISTORY_KEY); } catch (e) {}
  }

  // ---------- Markup ----------
  var wrap = document.createElement("div");
  wrap.id = "cmx-chat-widget";
  wrap.innerHTML =
    '<style>' +
    '#cmx-chat-widget{position:fixed;bottom:22px;right:22px;z-index:9999;font-family:inherit;}' +
    '#cmx-chat-bubble{width:60px;height:60px;border-radius:50%;background:var(--color-primary,#1B3A5C);box-shadow:0 4px 16px rgba(0,0,0,.25);' +
    'display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;border:none;}' +
    '#cmx-chat-bubble svg{width:26px;height:26px;fill:#fff;}' +
    '#cmx-chat-badge{position:absolute;top:-4px;right:-4px;background:var(--color-secondary,#E8871E);color:#fff;border-radius:10px;font-size:11px;padding:1px 6px;font-weight:600;}' +
    '#cmx-chat-panel{position:fixed;bottom:92px;right:22px;width:340px;max-width:92vw;height:460px;max-height:72vh;background:#fff;' +
    'border-radius:14px;box-shadow:0 10px 34px rgba(0,0,0,.28);display:none;flex-direction:column;overflow:hidden;}' +
    '#cmx-chat-panel.open{display:flex;}' +
    '#cmx-chat-head{background:var(--color-primary,#1B3A5C);color:#fff;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;}' +
    '#cmx-chat-head span{font-size:.95rem;font-weight:600;}' +
    '#cmx-chat-close{background:none;border:0;color:#fff;font-size:20px;cursor:pointer;line-height:1;opacity:.85;}' +
    '#cmx-chat-close:hover{opacity:1;}' +
    '#cmx-chat-body{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px;background:#f7f8fa;}' +
    '.cmx-row{display:flex;align-items:flex-end;gap:8px;max-width:92%;}' +
    '.cmx-row.visitor{align-self:flex-end;flex-direction:row-reverse;}' +
    '.cmx-avatar{width:44px;height:44px;flex-shrink:0;object-fit:contain;object-position:bottom;}' +
    '.cmx-msg{padding:8px 12px;border-radius:14px;font-size:.87rem;line-height:1.42;white-space:pre-wrap;}' +
    '.cmx-row.visitor .cmx-msg{background:var(--color-primary,#1B3A5C);color:#fff;border-bottom-right-radius:3px;}' +
    '.cmx-row.bot .cmx-msg,.cmx-row.system .cmx-msg{background:#fff;color:#222;border:1px solid #e3e5e9;border-bottom-left-radius:3px;}' +
    '.cmx-row.typing .cmx-msg{color:#9a9a9a;font-style:italic;}' +
    '#cmx-chat-namebar{padding:8px 10px;border-bottom:1px solid #e3e5e9;}' +
    '#cmx-chat-namebar input{width:100%;border:1px solid #dcdfe3;border-radius:6px;padding:6px 9px;font-size:.82rem;font-family:inherit;box-sizing:border-box;}' +
    '#cmx-chat-inputbar{display:flex;gap:6px;padding:10px;border-top:1px solid #e3e5e9;}' +
    '#cmx-chat-input{flex:1;border:1px solid #dcdfe3;border-radius:18px;padding:8px 13px;font-size:.87rem;font-family:inherit;outline:none;}' +
    '#cmx-chat-send{background:var(--color-secondary,#E8871E);border:0;color:#fff;border-radius:50%;width:36px;height:36px;cursor:pointer;flex-shrink:0;font-size:15px;}' +
    '#cmx-chat-send:disabled{opacity:.6;cursor:default;}' +
    '#cmx-chat-chips{display:flex;flex-wrap:wrap;gap:6px;margin-left:52px;max-width:100%;}' +
    '.cmx-chip{border:1px solid var(--color-secondary,#E8871E);color:var(--color-secondary,#E8871E);background:#fff;border-radius:16px;padding:6px 12px;font-size:.78rem;cursor:pointer;font-family:inherit;}' +
    '.cmx-chip:hover{background:var(--color-secondary,#E8871E);color:#fff;}' +
    '</style>' +
    '<button id="cmx-chat-bubble" aria-label="Chat">' +
      '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>' +
    '</button>' +
    '<div id="cmx-chat-panel">' +
      '<div id="cmx-chat-head"><span data-lang="fr">Discuter avec nous</span><span data-lang="en">Chat with us</span><button id="cmx-chat-close" aria-label="Close">\u00d7</button></div>' +
      '<div id="cmx-chat-namebar"><input type="text" id="cmx-chat-name" placeholder="Votre nom (optionnel) / Your name (optional)"></div>' +
      '<div id="cmx-chat-body"></div>' +
      '<div id="cmx-chat-inputbar">' +
        '<input type="text" id="cmx-chat-input" placeholder="\u00c9crivez un message\u2026 / Write a message\u2026">' +
        '<button id="cmx-chat-send" aria-label="Send">\u27a4</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(wrap);

  var bubble = document.getElementById("cmx-chat-bubble");
  var panel = document.getElementById("cmx-chat-panel");
  var bodyEl = document.getElementById("cmx-chat-body");
  var inputEl = document.getElementById("cmx-chat-input");
  var sendBtn = document.getElementById("cmx-chat-send");
  var nameEl = document.getElementById("cmx-chat-name");
  var nameBar = document.getElementById("cmx-chat-namebar");
  var badge = null, badgeCount = 0;

  nameEl.value = visitorName;
  if (visitorName) nameBar.style.display = "none";

  function appendRow(sender, text, emotion) {
    var row = document.createElement("div");
    row.className = "cmx-row " + sender;
    var html = "";
    if (sender === "bot" || sender === "system") {
      html += '<img class="cmx-avatar" src="' + avatarUrl(emotion || "happy") + '" alt="">';
    }
    html += '<div class="cmx-msg"></div>';
    row.innerHTML = html;
    row.querySelector(".cmx-msg").textContent = text;
    bodyEl.appendChild(row);
    bodyEl.scrollTop = bodyEl.scrollHeight;
    return row;
  }

  function showBadge() {
    if (panel.classList.contains("open")) return;
    badgeCount += 1;
    if (!badge) { badge = document.createElement("div"); badge.id = "cmx-chat-badge"; bubble.appendChild(badge); }
    badge.textContent = String(badgeCount);
  }

  function showQuickReplies() {
    var lang = getLang();
    var chips = lang === "en"
      ? [
          { label: "\ud83d\udcb0 Pricing", value: "How much does a website cost?" },
          { label: "\ud83d\udee0\ufe0f Care plans", value: "Tell me about care plans" },
          { label: "\ud83d\ude80 How it works", value: "How does it work?" },
          { label: "\ud83d\udcac Talk to a person", value: "I'd like to speak to someone." },
        ]
      : [
          { label: "\ud83d\udcb0 Prix", value: "Combien ça coûte ?" },
          { label: "\ud83d\udee0\ufe0f Forfaits d'entretien", value: "Parlez-moi des forfaits d'entretien" },
          { label: "\ud83d\ude80 Comment ça marche", value: "Comment ça marche ?" },
          { label: "\ud83d\udcac Parler \u00e0 quelqu'un", value: "J'aimerais parler \u00e0 quelqu'un." },
        ];
    var row = document.createElement("div");
    row.id = "cmx-chat-chips";
    chips.forEach(function (c) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cmx-chip";
      btn.textContent = c.label;
      btn.addEventListener("click", function () {
        inputEl.value = c.value;
        send();
        row.remove();
      });
      row.appendChild(btn);
    });
    bodyEl.appendChild(row);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function renderHistory() {
    bodyEl.innerHTML = "";
    var history = loadHistory();
    history.forEach(function (m) { appendRow(m.sender, m.text, m.emotion); });
  }

  function resetConversation() {
    clearHistory();
    bodyEl.innerHTML = "";
  }

  function openPanel(open) {
    var wasOpen = panel.classList.contains("open");
    panel.classList.toggle("open", open);
    if (open && badge) { badge.remove(); badge = null; badgeCount = 0; }
    if (!open && wasOpen && loadHistory().length) {
      resetConversation();
      return;
    }
    if (open) {
      var history = loadHistory();
      if (!history.length) {
        var lang = getLang();
        var g = GREETING;
        appendRow("bot", lang === "en" ? g.en : g.fr, g.emotion);
        var h = loadHistory();
        h.push({ sender: "bot", text: lang === "en" ? g.en : g.fr, emotion: g.emotion });
        saveHistory(h);
        showQuickReplies();
      } else {
        renderHistory();
      }
    }
  }
  bubble.addEventListener("click", function () { openPanel(!panel.classList.contains("open")); });
  document.getElementById("cmx-chat-close").addEventListener("click", function () { openPanel(false); });

  function send() {
    var text = inputEl.value.trim();
    if (!text) return;
    var name = nameEl.value.trim();
    if (name) { try { localStorage.setItem(NAME_KEY, name); } catch (e) {} nameBar.style.display = "none"; }
    inputEl.value = "";

    appendRow("visitor", text);
    var history = loadHistory();
    history.push({ sender: "visitor", text: text });
    saveHistory(history);

    sendBtn.disabled = true;
    var typingRow = appendRow("bot typing", "...", TYPING_EMOTION);

    setTimeout(function () {
      typingRow.remove();
      var lang = getLang();
      var match = matchKeyword(text);
      var replyText = match ? match[lang] : FALLBACK[lang];
      var emotion = match ? match.emotion : FALLBACK.emotion;
      appendRow("bot", replyText, emotion);
      var h = loadHistory();
      h.push({ sender: "bot", text: replyText, emotion: emotion });
      saveHistory(h);
      sendBtn.disabled = false;
      if (!panel.classList.contains("open")) showBadge();
    }, 700);
  }
  sendBtn.addEventListener("click", send);
  inputEl.addEventListener("keydown", function (e) { if (e.key === "Enter") send(); });
})();
