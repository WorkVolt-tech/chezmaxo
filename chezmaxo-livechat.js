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
      fr: "Bonjour ! Je suis Marxo, l'assistant de Chezmaxo. Posez-moi vos questions sur les prix, les délais, ou comment ça fonctionne !",
      en: "Hi there! I'm Marxo, Chezmaxo's assistant. Ask me about pricing, timelines, or how everything works!", emotion: "happy" },
    { keywords: ["combien ça coûte","how much does a website","website cost","pricing for a website","cost of a website"],
      fr: "Un site Starter commence à 199 $, un site Business à 399 $, et les projets plus avancés sont soumis à un devis personnalisé.",
      en: "A Starter website starts at $199, a Business website at $399, and more advanced projects get a custom quote.", emotion: "happy" },
    { keywords: ["combien de temps","how long does it take","turnaround time","timeline","timelines","délai","how fast","when will it be ready"],
      fr: "Ça dépend du forfait : réponse standard pour Starter, 3 à 5 jours ouvrables pour Soutien mensuel, et 1 à 3 jours pour Affaires (priorité).",
      en: "It depends on the plan: standard turnaround for Starter, 3–5 business days for Monthly Support, and 1–3 days for Business Care (priority).", emotion: "thinking" },
    { keywords: ["forfait d'entretien","care plan","monthly plan","care plans"],
      fr: "Nos forfaits d'entretien sont à 25 $/mois (Starter), 50 $/mois (Soutien mensuel) ou 100 $/mois (Affaires).",
      en: "Care plans run $25/month (Starter), $50/month (Monthly Support), or $100/month (Business Care).", emotion: "happy" },
    { keywords: ["how much","prix","tarif","tarifs","coûts","cost","what does it cost","combien","pricing"],
      fr: "Ça dépend de ce que vous voulez dire ! Un nouveau site commence à 199 $, ou un forfait d'entretien mensuel commence à 25 $/mois. Lequel vous intéresse ?",
      en: "Depends what you mean! A new website starts at $199, or a monthly care plan starts at $25/month. Which one are you asking about?", emotion: "curious" },
    { keywords: ["comment ça marche","how does it work","how it works","how everything works","how does everything work","what's the process"],
      fr: "On discute de votre projet, je vous envoie un devis, vous approuvez, je construis le site, et vous approuvez le résultat avant le lancement.",
      en: "We talk about your project, I send a quote, you approve it, I build the site, and you approve the result before launch.", emotion: "get_help" },
    { keywords: ["parler à quelqu'un","speak to someone","talk to a human","real person"],
      fr: "Bien sûr ! Laissez-moi votre courriel et votre question, et on vous répond rapidement.",
      en: "Of course! Leave your email and your question, and we'll get back to you quickly.", emotion: "get_help" },
    { keywords: ["do you have a sense of humor","do you have a sense of humour","sense of humor","are you funny","as tu le sens de l'humour","es tu drole"],
      fr: "Je pense que oui ! Mon humour se résume surtout à des blagues de papa et des jeux de mots sur les sites web, mais j'assume à 100 %. Vous voulez en entendre une ?",
      en: "I like to think so! My humor mostly consists of dad jokes and website puns, but I stand by all of it. Want to hear one?", emotion: "excited" },
    { keywords: ["blague","tell me a joke","dis moi une blague","make me laugh","have any jokes","any jokes","dad joke","other jokes","another joke","more jokes","d'autres blagues"],
      fr: "Pourquoi le site web est-il allé en thérapie ? Trop de problèmes non résolus.|||Pourquoi les programmeurs préfèrent le mode sombre ? Parce que la lumière attire les bogues.",
      en: "Why did the website go to therapy? Too many unresolved issues.|||Why do programmers prefer dark mode? Because light attracts bugs.", emotion: "excited" },
    { keywords: ["are you alive","do you exist","es-tu vivant","existes-tu"],
      fr: "Ça dépend de votre définition de \"vivant\" — je ne mange pas, ne dors pas et ne paie pas d'impôts, mais je réponds aux messages plus vite que la plupart des humains. C'est assez proche ?",
      en: "Depends on your definition of \"alive\" — I don't eat, sleep, or pay taxes, but I do respond to messages faster than most humans. Close enough?", emotion: "wondering" },
    { keywords: ["what do you do","what's your job","whats your job","what's your purpose","qu'est-ce que tu fais"],
      fr: "Je réponds aux questions sur les sites web et forfaits d'entretien de Chezmaxo, je fais des blagues de papa à l'occasion, et j'essaie de ne pas dépasser mes compétences.",
      en: "I answer questions about Chezmaxo's websites and care plans, crack the occasional dad joke, and try not to overstep into things above my pay grade.", emotion: "happy" },
    { keywords: ["es tu un robot","are you a robot","are you an ai"],
      fr: "Je m'appelle Marxo — un assistant automatisé qui répond aux questions courantes. Mais une vraie personne (Maxo) peut prendre le relais à tout moment !",
      en: "I'm Marxo — an automated assistant that answers common questions. But a real person (Maxo) can jump in any time!", emotion: "confused" },
    { keywords: ["what's your name","whats your name","your name","quel est ton nom","comment tu t'appelles"],
      fr: "Je m'appelle Marxo ! Pas le nom le plus original du monde, mais bon — \"Internet\" non plus, et ça s'est bien passé.",
      en: "I'm Marxo! Not the most creative name in the world, but hey — neither is \"the internet,\" and that one worked out fine.", emotion: "excited" },
    { keywords: ["ça va","comment allez","how are you","how's it going","ca va"],
      fr: "Je vis ma meilleure vie numérique — pas besoin de café, pas peur des lundis. Et vous ?",
      en: "Living my best digital life — no coffee needed, no Mondays feared. How about you?", emotion: "happy" },
    { keywords: ["i love you","je t'aime","i love u","je t aime"],
      fr: "Aww, c'est gentil ! Moi aussi je vous aime — un peu comme j'aime un site web bien optimisé : profondément, et sans complications légales.",
      en: "Aw, that's sweet! I love you too — in the same way I love a well-optimized website: deeply, and without any legal complications.", emotion: "happy" },
    { keywords: ["are you real","es-tu réel","es tu reel","are you a real person"],
      fr: "Pas vraiment — je suis Marxo, un assistant automatisé, pas une vraie personne. Mais une vraie personne (Maxo) peut prendre le relais à tout moment.",
      en: "Not exactly — I'm Marxo, an automated assistant, not a real person. But a real human (Maxo) can jump in any time you'd like.", emotion: "confused" },
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
    fr: "Celle-là me dépasse complètement — même ma longue liste de réponses préprogrammées a ses limites. Voulez-vous que je contacte Maxo pour qu'il puisse vous aider directement ?",
    en: "That one's got me stumped — even my extensive list of pre-programmed answers has limits. Would you like me get a hold of Maxo so he can help you out instead?",
    emotion: "confused"
  };

  var GREETING = {
    fr: "Bonjour ! Je suis Marxo, l'assistant de Chezmaxo. Posez-moi vos questions sur les prix, les délais, ou comment ça fonctionne — sérieuses ou pas !",
    en: "Hi! I'm Marxo, Chezmaxo's assistant. Ask me about pricing, timelines, or how everything works — serious questions or silly ones, I don't mind!",
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

  // Some entries (like jokes) hold several alternatives separated by "|||".
  // usedResponseIndices tracks which options have already been shown for
  // each entry this session, so the same one doesn't repeat until every
  // option has had a turn — then the cycle reshuffles.
  var usedResponseIndices = {};
  var lastShownIndex = {};
  function pickResponse(text, entryKey) {
    if (!text || text.indexOf("|||") === -1) return text;
    var options = text.split("|||");
    if (!entryKey) return options[Math.floor(Math.random() * options.length)];

    var used = usedResponseIndices[entryKey] || [];
    var available = [];
    for (var i = 0; i < options.length; i++) {
      if (used.indexOf(i) === -1) available.push(i);
    }
    if (available.length === 0) {
      // Full cycle just finished — reshuffle, but don't let the reshuffle
      // immediately repeat whatever was shown last.
      var last = lastShownIndex[entryKey];
      available = [];
      for (var j = 0; j < options.length; j++) {
        if (options.length === 1 || j !== last) available.push(j);
      }
      used = [];
    }
    var chosen = available[Math.floor(Math.random() * available.length)];
    used.push(chosen);
    usedResponseIndices[entryKey] = used;
    lastShownIndex[entryKey] = chosen;
    return options[chosen];
  }

  function requestHumanHelp(question, name, email) {
    if (!chatConfigured) return;
    fetch(CHAT_SUPABASE_URL + '/rest/v1/chat_help_requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: CHAT_SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + CHAT_SUPABASE_ANON_KEY,
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({
        visitor_name: name || '',
        email: email || '',
        last_message: question || '',
        page_url: window.location.href
      })
    }).catch(function () { /* fails silently — the chat still works either way */ });
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
    '#cmx-chat-panel{position:fixed;bottom:92px;right:22px;width:340px;max-width:92vw;height:520px;max-height:78vh;background:#fff;' +
    'border-radius:14px;box-shadow:0 10px 34px rgba(0,0,0,.28);display:none;flex-direction:column;overflow:hidden;}' +
    '#cmx-chat-panel.open{display:flex;}' +
    '#cmx-chat-head{background:var(--color-primary,#1B3A5C);color:#fff;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;}' +
    '#cmx-chat-head span{font-size:.95rem;font-weight:600;}' +
    '#cmx-chat-close{background:none;border:0;color:#fff;font-size:20px;cursor:pointer;line-height:1;opacity:.85;}' +
    '#cmx-chat-close:hover{opacity:1;}' +
    '#cmx-chat-reaction{display:flex;align-items:center;justify-content:center;background:#f0f2f5;border-bottom:1px solid #e3e5e9;padding:8px 0;}' +
    '#cmx-chat-reaction img{height:92px;width:auto;object-fit:contain;transition:opacity .15s ease;}' +
    '#cmx-chat-body{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px;background:#f7f8fa;}' +
    '.cmx-row{display:flex;max-width:92%;}' +
    '.cmx-row.visitor{align-self:flex-end;}' +
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
    '#cmx-chat-chips{display:flex;flex-wrap:wrap;gap:6px;max-width:100%;}' +
    '.cmx-chip{border:1px solid var(--color-secondary,#E8871E);color:var(--color-secondary,#E8871E);background:#fff;border-radius:16px;padding:6px 12px;font-size:.78rem;cursor:pointer;font-family:inherit;}' +
    '.cmx-chip:hover{background:var(--color-secondary,#E8871E);color:#fff;}' +
    '</style>' +
    '<button id="cmx-chat-bubble" aria-label="Chat">' +
      '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>' +
    '</button>' +
    '<div id="cmx-chat-panel">' +
      '<div id="cmx-chat-head"><span data-lang="fr">Discuter avec Marxo</span><span data-lang="en">Chat with Marxo</span><button id="cmx-chat-close" aria-label="Close">\u00d7</button></div>' +
      '<div id="cmx-chat-reaction"><img id="cmx-reaction-img" src="" alt=""></div>' +
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
  var reactionImg = document.getElementById("cmx-reaction-img");
  var badge = null, badgeCount = 0;

  nameEl.value = visitorName;
  if (visitorName) nameBar.style.display = "none";

  function setReaction(emotion) {
    reactionImg.style.opacity = "0";
    setTimeout(function () {
      reactionImg.src = avatarUrl(emotion || "happy");
      reactionImg.style.opacity = "1";
    }, 120);
  }

  function appendRow(sender, text) {
    var row = document.createElement("div");
    row.className = "cmx-row " + sender;
    row.innerHTML = '<div class="cmx-msg"></div>';
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
    var lastEmotion = "happy";
    history.forEach(function (m) {
      appendRow(m.sender, m.text);
      if (m.sender === "bot" && m.emotion) lastEmotion = m.emotion;
    });
    setReaction(lastEmotion);
  }

  function resetConversation() {
    clearHistory();
    bodyEl.innerHTML = "";
    expectingMoodReply = false;
    expectingJokeOffer = false;
    expectingJokeFeedback = false;
    expectingHelpOffer = false;
    expectingContactInfo = false;
    lastUnansweredQuestion = "";
    usedResponseIndices = {};
    lastShownIndex = {};
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
        appendRow("bot", lang === "en" ? g.en : g.fr);
        setReaction(g.emotion);
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

  // ---------- Light conversation memory: one message deep ----------
  // Marxo doesn't track full context, but it does remember one thing:
  // whether its last reply ended by asking the visitor how *they* are
  // doing. If so, the very next message gets checked against a small
  // set of mood replies before falling back to normal keyword matching.
  var expectingMoodReply = false;
  var expectingJokeOffer = false;
  var expectingJokeFeedback = false;
  var expectingHelpOffer = false;
  var lastUnansweredQuestion = "";
  var JOKE_OFFER_PATTERN = /want to hear one\?|en entendre une\s*\?/i;
  var YES_WORDS = ["yes","yeah","yea","yep","yup","sure","go ahead","tell me","please do","ok","okay","alright","oui","vas-y","d'accord","envoie"];
  var NO_WORDS = ["no","nah","nope","not now","maybe later","no thanks","non","pas maintenant","plus tard","non merci"];
  function matchesWordList(text, list) {
    var lower = text.toLowerCase();
    for (var i = 0; i < list.length; i++) {
      if (containsKeyword(lower, list[i])) return true;
    }
    return false;
  }
  function isJokeEntry(entry) {
    return !!(entry && entry.keywords && entry.keywords[0] === "blague");
  }
  function isTalkToPersonEntry(entry) {
    return !!(entry && entry.keywords && entry.keywords[0] === "parler à quelqu'un");
  }
  var expectingContactInfo = false;
  var EMAIL_PATTERN = /[^\s@]+@[^\s@]+\.[^\s@]+/;
  // Order matters here too: negated phrases before the bare words they contain.
  var JOKE_FEEDBACK_PHRASES = [
    { phrase: "not that funny", sentiment: "negative" },
    { phrase: "not funny", sentiment: "negative" },
    { phrase: "pas si drôle", sentiment: "negative" },
    { phrase: "pas drôle", sentiment: "negative" },
    { phrase: "good one", sentiment: "positive" },
    { phrase: "nice one", sentiment: "positive" },
    { phrase: "good joke", sentiment: "positive" },
    { phrase: "great joke", sentiment: "positive" },
    { phrase: "that was funny", sentiment: "positive" },
    { phrase: "that's funny", sentiment: "positive" },
    { phrase: "thats funny", sentiment: "positive" },
    { phrase: "hilarious", sentiment: "positive" },
    { phrase: "love it", sentiment: "positive" },
    { phrase: "funny", sentiment: "positive" },
    { phrase: "lol", sentiment: "positive" },
    { phrase: "haha", sentiment: "positive" },
    { phrase: "hehe", sentiment: "positive" },
    { phrase: "bonne blague", sentiment: "positive" },
    { phrase: "excellente blague", sentiment: "positive" },
    { phrase: "c'était drôle", sentiment: "positive" },
    { phrase: "mdr", sentiment: "positive" },
    { phrase: "bad one", sentiment: "negative" },
    { phrase: "that sucked", sentiment: "negative" },
    { phrase: "that was bad", sentiment: "negative" },
    { phrase: "terrible joke", sentiment: "negative" },
    { phrase: "awful joke", sentiment: "negative" },
    { phrase: "lame", sentiment: "negative" },
    { phrase: "boo", sentiment: "negative" },
    { phrase: "mauvaise blague", sentiment: "negative" },
    { phrase: "nulle", sentiment: "negative" },
  ];
  function matchJokeFeedback(text) {
    var lower = text.toLowerCase();
    for (var i = 0; i < JOKE_FEEDBACK_PHRASES.length; i++) {
      if (containsKeyword(lower, JOKE_FEEDBACK_PHRASES[i].phrase)) return JOKE_FEEDBACK_PHRASES[i].sentiment;
    }
    return null;
  }
  var ASKED_BACK_PATTERN = /how about you\?|et vous\s*\?|et toi\s*\?/i;
  // Order matters: negated multi-word phrases are checked before their
  // bare single-word substrings, so "not great" resolves as negative
  // instead of matching "great" (positive) first.
  var MOOD_PHRASES = [
    // Negated / multi-word phrases first, so they win over the bare
    // single words they contain (e.g. "not great" before "great").
    { phrase: "not bad", sentiment: "positive" },
    { phrase: "not too bad", sentiment: "positive" },
    { phrase: "not too good", sentiment: "negative" },
    { phrase: "not too great", sentiment: "negative" },
    { phrase: "pas mal", sentiment: "positive" },
    { phrase: "pas pire", sentiment: "positive" },
    { phrase: "pas trop mal", sentiment: "positive" },
    { phrase: "not great", sentiment: "negative" },
    { phrase: "not good", sentiment: "negative" },
    { phrase: "not well", sentiment: "negative" },
    { phrase: "not so good", sentiment: "negative" },
    { phrase: "not so great", sentiment: "negative" },
    { phrase: "not okay", sentiment: "negative" },
    { phrase: "not ok", sentiment: "negative" },
    { phrase: "been better", sentiment: "negative" },
    { phrase: "could be better", sentiment: "negative" },
    { phrase: "ça pourrait aller mieux", sentiment: "negative" },
    { phrase: "pas terrible", sentiment: "negative" },
    { phrase: "pas top", sentiment: "negative" },
    { phrase: "pas bien", sentiment: "negative" },
    { phrase: "pretty good", sentiment: "positive" },
    { phrase: "pretty well", sentiment: "positive" },
    { phrase: "doing good", sentiment: "positive" },
    { phrase: "doing well", sentiment: "positive" },
    { phrase: "all good", sentiment: "positive" },
    { phrase: "so far so good", sentiment: "positive" },
    { phrase: "can't complain", sentiment: "positive" },
    { phrase: "cant complain", sentiment: "positive" },
    { phrase: "living the dream", sentiment: "positive" },
    { phrase: "ça va bien", sentiment: "positive" },
    { phrase: "ça roule", sentiment: "positive" },
    { phrase: "rough day", sentiment: "negative" },
    { phrase: "long day", sentiment: "negative" },
    // Single words, generic
    { phrase: "good", sentiment: "positive" },
    { phrase: "great", sentiment: "positive" },
    { phrase: "fine", sentiment: "positive" },
    { phrase: "ok", sentiment: "positive" },
    { phrase: "okay", sentiment: "positive" },
    { phrase: "alright", sentiment: "positive" },
    { phrase: "awesome", sentiment: "positive" },
    { phrase: "amazing", sentiment: "positive" },
    { phrase: "wonderful", sentiment: "positive" },
    { phrase: "fantastic", sentiment: "positive" },
    { phrase: "well", sentiment: "positive" },
    { phrase: "bien", sentiment: "positive" },
    { phrase: "correct", sentiment: "positive" },
    { phrase: "super", sentiment: "positive" },
    { phrase: "excellent", sentiment: "positive" },
    { phrase: "merveilleux", sentiment: "positive" },
    { phrase: "fantastique", sentiment: "positive" },
    { phrase: "not doing great", sentiment: "negative" },
    { phrase: "not doing good", sentiment: "negative" },
    { phrase: "not doing well", sentiment: "negative" },
    { phrase: "feel like shit", sentiment: "negative" },
    { phrase: "feel like crap", sentiment: "negative" },
    { phrase: "feeling like shit", sentiment: "negative" },
    { phrase: "feeling like crap", sentiment: "negative" },
    { phrase: "feel horrible", sentiment: "negative" },
    { phrase: "feeling horrible", sentiment: "negative" },
    { phrase: "bad", sentiment: "negative" },
    { phrase: "horrible", sentiment: "negative" },
    { phrase: "terrible", sentiment: "negative" },
    { phrase: "awful", sentiment: "negative" },
    { phrase: "tired", sentiment: "negative" },
    { phrase: "exhausted", sentiment: "negative" },
    { phrase: "stressed", sentiment: "negative" },
    { phrase: "rough", sentiment: "negative" },
    { phrase: "meh", sentiment: "negative" },
    { phrase: "so-so", sentiment: "negative" },
    { phrase: "so so", sentiment: "negative" },
    { phrase: "moyen", sentiment: "negative" },
    { phrase: "difficile", sentiment: "negative" },
    { phrase: "fatigué", sentiment: "negative" },
    { phrase: "fatiguée", sentiment: "negative" },
    { phrase: "stressé", sentiment: "negative" },
    { phrase: "stressée", sentiment: "negative" },
    { phrase: "mal", sentiment: "negative" },
  ];
  function matchMood(text) {
    var lower = text.toLowerCase();
    for (var i = 0; i < MOOD_PHRASES.length; i++) {
      if (containsKeyword(lower, MOOD_PHRASES[i].phrase)) return MOOD_PHRASES[i].sentiment;
    }
    return null;
  }

  var NAME_QUESTION_KEYWORDS = [
    "do you know my name", "what's my name", "whats my name", "remember my name",
    "quel est mon nom", "connais-tu mon nom", "connais tu mon nom", "tu connais mon nom", "te souviens-tu de mon nom"
  ];
  function isNameQuestion(text) {
    var lower = text.toLowerCase();
    for (var i = 0; i < NAME_QUESTION_KEYWORDS.length; i++) {
      if (containsKeyword(lower, NAME_QUESTION_KEYWORDS[i])) return true;
    }
    return false;
  }

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
    setReaction(TYPING_EMOTION);
    var typingRow = appendRow("bot typing", "...");

    setTimeout(function () {
      typingRow.remove();
      var lang = getLang();
      var knownName = name || visitorName;

      var wasExpectingMood = expectingMoodReply;
      expectingMoodReply = false;
      var wasExpectingJoke = expectingJokeOffer;
      expectingJokeOffer = false;
      var wasExpectingJokeFeedback = expectingJokeFeedback;
      expectingJokeFeedback = false;
      var wasExpectingHelp = expectingHelpOffer;
      expectingHelpOffer = false;
      var wasExpectingContact = expectingContactInfo;
      expectingContactInfo = false;

      if (wasExpectingContact) {
        var emailMatch = text.match(EMAIL_PATTERN);
        if (emailMatch) {
          var providedEmail = emailMatch[0];
          requestHumanHelp(text, name || visitorName, providedEmail);
          var contactReply = lang === "en"
            ? "Thanks! I've passed this along to Maxo — he'll reach out to you at " + providedEmail + " soon."
            : "Merci ! J'ai transmis ceci à Maxo — il vous contactera à " + providedEmail + " sous peu.";
          appendRow("bot", contactReply);
          setReaction("happy");
          var hc = loadHistory();
          hc.push({ sender: "bot", text: contactReply, emotion: "happy" });
          saveHistory(hc);
          sendBtn.disabled = false;
          if (!panel.classList.contains("open")) showBadge();
          return;
        }
        // Didn't look like an email — fall through to normal matching
        // below rather than force an error over a missed follow-up.
      }

      if (wasExpectingMood && matchMood(text)) {
        var moodGood = matchMood(text) === "positive";
        var moodReply = moodGood
          ? (lang === "en" ? "Glad to hear it! What can I help you with today?" : "Content de l'entendre ! Comment puis-je vous aider aujourd'hui ?")
          : (lang === "en" ? "Sorry to hear that — hope things look up soon. I'm here if you need anything in the meantime!" : "Désolé d'entendre ça — j'espère que ça ira mieux bientôt. Je suis là si vous avez besoin de quoi que ce soit !");
        var moodEmotion = moodGood ? "happy" : "sad";
        appendRow("bot", moodReply);
        setReaction(moodEmotion);
        var hm = loadHistory();
        hm.push({ sender: "bot", text: moodReply, emotion: moodEmotion });
        saveHistory(hm);
        sendBtn.disabled = false;
        if (!panel.classList.contains("open")) showBadge();
        return;
      }

      if (wasExpectingJokeFeedback && matchJokeFeedback(text)) {
        var feedbackGood = matchJokeFeedback(text) === "positive";
        var feedbackReply = feedbackGood
          ? (lang === "en" ? "Thank you, I try!" : "Merci, je fais de mon mieux !")
          : (lang === "en" ? "Ouch, tough crowd. I'll keep working on my material." : "Aïe, dur public. Je vais continuer à travailler mon numéro.");
        var feedbackEmotion = feedbackGood ? "happy" : "sad";
        appendRow("bot", feedbackReply);
        setReaction(feedbackEmotion);
        var hf = loadHistory();
        hf.push({ sender: "bot", text: feedbackReply, emotion: feedbackEmotion });
        saveHistory(hf);
        sendBtn.disabled = false;
        if (!panel.classList.contains("open")) showBadge();
        return;
      }

      if (wasExpectingHelp && (matchesWordList(text, YES_WORDS) || matchesWordList(text, NO_WORDS))) {
        var wantsHelp = matchesWordList(text, YES_WORDS);
        var helpReply, helpEmotion;
        if (wantsHelp) {
          requestHumanHelp(lastUnansweredQuestion, name || visitorName);
          helpReply = lang === "en"
            ? "Got it — I've let Maxo know! He'll reach out as soon as he can. Feel free to keep asking me things in the meantime."
            : "C'est noté — j'ai avisé Maxo ! Il vous contactera dès que possible. N'hésitez pas à continuer à me poser des questions entretemps.";
          helpEmotion = "happy";
        } else {
          helpReply = lang === "en"
            ? "No worries! Let me know if there's anything else I can help with."
            : "Pas de problème ! Dites-moi si je peux vous aider avec autre chose.";
          helpEmotion = "happy";
        }
        appendRow("bot", helpReply);
        setReaction(helpEmotion);
        var hh = loadHistory();
        hh.push({ sender: "bot", text: helpReply, emotion: helpEmotion });
        saveHistory(hh);
        sendBtn.disabled = false;
        if (!panel.classList.contains("open")) showBadge();
        return;
      }

      if (wasExpectingJoke && (matchesWordList(text, YES_WORDS) || matchesWordList(text, NO_WORDS))) {
        var saidYes = matchesWordList(text, YES_WORDS);
        var jokeReplyText, jokeEmotion;
        if (saidYes) {
          var jokeMatch = matchKeyword("tell me a joke");
          jokeReplyText = jokeMatch ? pickResponse(jokeMatch[lang], jokeMatch.keywords[0]) : FALLBACK[lang];
          jokeEmotion = jokeMatch ? jokeMatch.emotion : FALLBACK.emotion;
          if (isJokeEntry(jokeMatch)) expectingJokeFeedback = true;
        } else {
          jokeReplyText = lang === "en"
            ? "No worries! I'll hold onto them for when you're in the mood."
            : "Pas de problème ! Je les garde pour quand vous serez d'humeur.";
          jokeEmotion = "happy";
        }
        appendRow("bot", jokeReplyText);
        setReaction(jokeEmotion);
        var hj = loadHistory();
        hj.push({ sender: "bot", text: jokeReplyText, emotion: jokeEmotion });
        saveHistory(hj);
        sendBtn.disabled = false;
        if (!panel.classList.contains("open")) showBadge();
        return;
      }

      if (isNameQuestion(text)) {
        var replyText, emotion;
        if (knownName) {
          replyText = lang === "en"
            ? "Of course, " + knownName + "! I never forget a name — mostly because you're the one who typed it in."
            : "Bien sûr, " + knownName + " ! Je n'oublie jamais un nom — surtout parce que c'est vous qui l'avez tapé.";
          emotion = "excited";
        } else {
          replyText = lang === "en"
            ? "I don't, actually — you never told me! Pop it in the name box above and I'll remember it for the rest of our chat."
            : "Non, en fait — vous ne me l'avez jamais dit ! Inscrivez-le dans la case ci-dessus et je m'en souviendrai pour le reste de notre conversation.";
          emotion = "wondering";
        }
        if (ASKED_BACK_PATTERN.test(replyText)) expectingMoodReply = true;
        if (JOKE_OFFER_PATTERN.test(replyText)) expectingJokeOffer = true;
        appendRow("bot", replyText);
        setReaction(emotion);
        var h0 = loadHistory();
        h0.push({ sender: "bot", text: replyText, emotion: emotion });
        saveHistory(h0);
        sendBtn.disabled = false;
        if (!panel.classList.contains("open")) showBadge();
        return;
      }

      var match = matchKeyword(text);
      var replyText = match ? pickResponse(match[lang], match.keywords[0]) : FALLBACK[lang];
      var emotion = match ? match.emotion : FALLBACK.emotion;
      if (ASKED_BACK_PATTERN.test(replyText)) expectingMoodReply = true;
      if (JOKE_OFFER_PATTERN.test(replyText)) expectingJokeOffer = true;
      if (isJokeEntry(match)) expectingJokeFeedback = true;
      if (isTalkToPersonEntry(match)) expectingContactInfo = true;
      if (!match) {
        expectingHelpOffer = true;
        lastUnansweredQuestion = text;
      }
      appendRow("bot", replyText);
      setReaction(emotion);
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
