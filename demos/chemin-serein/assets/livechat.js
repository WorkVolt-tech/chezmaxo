/* =========================================================================
   Chemin Serein — Live chat widget
   Talks directly to Supabase via the narrow RPC functions in
   livechat-schema.sql. No AI, no external API keys, no server of our own —
   just this site's existing Supabase project, same as the booking system.
   ========================================================================= */
(function () {
  "use strict";

  var cfg = window.HDV_CONFIG || {};
  var configured =
    cfg.SUPABASE_URL && cfg.SUPABASE_URL.indexOf("YOUR-") === -1 &&
    cfg.SUPABASE_ANON_KEY && cfg.SUPABASE_ANON_KEY.indexOf("YOUR-") === -1;
  if (!configured) return;

  var base = cfg.SUPABASE_URL.replace(/\/+$/, "");
  var CONV_KEY = "hdv_chat_conversation_id";
  var NAME_KEY = "hdv_chat_visitor_name";

  function getLang() {
    var l = "fr";
    try { l = localStorage.getItem("hdv-lang") || document.documentElement.getAttribute("lang") || "fr"; } catch (e) {}
    return l === "en" ? "en" : "fr";
  }

  var conversationId = null;
  try { conversationId = localStorage.getItem(CONV_KEY); } catch (e) {}
  var visitorName = "";
  try { visitorName = localStorage.getItem(NAME_KEY) || ""; } catch (e) {}

  var seenIds = {};
  var historyLoaded = false;
  var pollTimer = null;

  // ---------- Markup ----------
  var wrap = document.createElement("div");
  wrap.id = "hdv-chat-widget";
  wrap.innerHTML =
    '<style>' +
    '#hdv-chat-widget{position:fixed;bottom:22px;right:22px;z-index:9999;font-family:"Jost",sans-serif;}' +
    '#hdv-chat-bubble{width:58px;height:58px;border-radius:50%;background:var(--ink,#2B2A28);box-shadow:0 4px 16px rgba(0,0,0,.25);' +
    'display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;}' +
    '#hdv-chat-bubble svg{width:26px;height:26px;fill:var(--gold,#B08D49);}' +
    '#hdv-chat-badge{position:absolute;top:-4px;right:-4px;background:#a8402d;color:#fff;border-radius:10px;font-size:11px;padding:1px 6px;}' +
    '#hdv-chat-panel{position:fixed;bottom:90px;right:22px;width:330px;max-width:90vw;height:440px;max-height:70vh;background:#fff;' +
    'border-radius:12px;box-shadow:0 10px 34px rgba(0,0,0,.25);display:none;flex-direction:column;overflow:hidden;}' +
    '#hdv-chat-panel.open{display:flex;}' +
    '#hdv-chat-head{background:var(--ink,#2B2A28);color:#fff;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;}' +
    '#hdv-chat-head span{font-size:.95rem;font-weight:500;}' +
    '#hdv-chat-close{background:none;border:0;color:#fff;font-size:18px;cursor:pointer;line-height:1;}' +
    '#hdv-chat-body{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;background:#faf8f4;}' +
    '.hdv-msg{max-width:80%;padding:8px 12px;border-radius:12px;font-size:.88rem;line-height:1.4;white-space:pre-wrap;}' +
    '.hdv-msg.visitor{align-self:flex-end;background:var(--gold,#B08D49);color:#fff;border-bottom-right-radius:3px;}' +
    '.hdv-msg.staff,.hdv-msg.auto,.hdv-msg.system{align-self:flex-start;background:#fff;border:1px solid var(--line,#ddd4c5);border-bottom-left-radius:3px;}' +
    '#hdv-chat-namebar{padding:8px 10px;border-bottom:1px solid var(--line,#ddd4c5);}' +
    '#hdv-chat-namebar input{width:100%;border:1px solid var(--line,#ddd4c5);border-radius:6px;padding:6px 9px;font-size:.82rem;font-family:inherit;}' +
    '#hdv-chat-inputbar{display:flex;gap:6px;padding:10px;border-top:1px solid var(--line,#ddd4c5);}' +
    '#hdv-chat-input{flex:1;border:1px solid var(--line,#ddd4c5);border-radius:18px;padding:8px 13px;font-size:.88rem;font-family:inherit;outline:none;}' +
    '#hdv-chat-send{background:var(--gold,#B08D49);border:0;color:#fff;border-radius:50%;width:34px;height:34px;cursor:pointer;flex-shrink:0;}' +
    '#hdv-chat-chips{display:flex;flex-wrap:wrap;gap:6px;align-self:flex-start;max-width:100%;}' +
    '.hdv-chip{border:1px solid var(--gold,#B08D49);color:var(--gold-deep,#927235);background:#fff;border-radius:16px;padding:6px 12px;font-size:.8rem;cursor:pointer;font-family:inherit;}' +
    '.hdv-chip:hover{background:var(--gold,#B08D49);color:#fff;}' +
    '</style>' +
    '<div id="hdv-chat-bubble">' +
      '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>' +
    '</div>' +
    '<div id="hdv-chat-panel">' +
      '<div id="hdv-chat-head"><span data-lang="fr">Discuter avec nous</span><span data-lang="en">Chat with us</span><button id="hdv-chat-close" aria-label="Close">×</button></div>' +
      '<div id="hdv-chat-namebar"><input type="text" id="hdv-chat-name" placeholder="Votre nom (optionnel) / Your name (optional)"></div>' +
      '<div id="hdv-chat-body"></div>' +
      '<div id="hdv-chat-inputbar">' +
        '<input type="text" id="hdv-chat-input" placeholder="Écrivez un message… / Write a message…">' +
        '<button id="hdv-chat-send" aria-label="Send">➤</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(wrap);

  var bubble = document.getElementById("hdv-chat-bubble");
  var panel = document.getElementById("hdv-chat-panel");
  var bodyEl = document.getElementById("hdv-chat-body");
  var inputEl = document.getElementById("hdv-chat-input");
  var sendBtn = document.getElementById("hdv-chat-send");
  var nameEl = document.getElementById("hdv-chat-name");
  var nameBar = document.getElementById("hdv-chat-namebar");
  var badge = null, badgeCount = 0;

  nameEl.value = visitorName;
  if (visitorName) nameBar.style.display = "none"; // once we know their name, stop asking

  function appendMsg(sender, text) {
    var el = document.createElement("div");
    el.className = "hdv-msg " + sender;
    el.textContent = text;
    bodyEl.appendChild(el);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function showBadge() {
    if (panel.classList.contains("open")) return;
    badgeCount += 1;
    if (!badge) { badge = document.createElement("div"); badge.id = "hdv-chat-badge"; bubble.appendChild(badge); }
    badge.textContent = String(badgeCount);
  }

  function showQuickReplies() {
    var lang = getLang();
    var chips = lang === "en"
      ? [
          { label: "💰 Pricing", action: "text", value: "How much does this cost?" },
          { label: "📅 Book a consultation", action: "link", value: "booking.html" },
          { label: "📋 Documents needed", action: "text", value: "What documents do I need?" },
          { label: "💬 Talk to a person", action: "text", value: "I'd like to speak to someone." },
        ]
      : [
          { label: "💰 Prix", action: "text", value: "Combien ça coûte ?" },
          { label: "📅 Réserver une consultation", action: "link", value: "booking.html" },
          { label: "📋 Documents requis", action: "text", value: "Quels documents dois-je préparer ?" },
          { label: "💬 Parler à quelqu'un", action: "text", value: "J'aimerais parler à quelqu'un." },
        ];
    var row = document.createElement("div");
    row.id = "hdv-chat-chips";
    chips.forEach(function (c) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "hdv-chip";
      btn.textContent = c.label;
      btn.addEventListener("click", function () {
        if (c.action === "link") { window.open(c.value, "_blank"); return; }
        inputEl.value = c.value;
        send();
        row.remove(); // chips are a one-time starting point, not a persistent menu
      });
      row.appendChild(btn);
    });
    bodyEl.appendChild(row);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function resetConversation() {
    stopPolling();
    conversationId = null;
    seenIds = {};
    historyLoaded = false;
    try { localStorage.removeItem(CONV_KEY); } catch (e) {}
    bodyEl.innerHTML = "";
  }

  function openPanel(open) {
    var wasOpen = panel.classList.contains("open");
    panel.classList.toggle("open", open);
    if (open && badge) { badge.remove(); badge = null; badgeCount = 0; }
    if (!open && wasOpen && conversationId) {
      // Closing is treated as ending the chat — the conversation itself
      // is still saved for staff, but the visitor gets a clean start next
      // time rather than picking back up mid-thread days later.
      resetConversation();
    }
    if (open && !conversationId) {
      appendMsg("system", getLang() === "en"
        ? "Hi! Ask us anything — a real person can jump in anytime."
        : "Bonjour ! Posez-nous vos questions — une vraie personne peut intervenir en tout temps.");
      showQuickReplies();
    }
  }
  bubble.addEventListener("click", function () { openPanel(!panel.classList.contains("open")); });
  document.getElementById("hdv-chat-close").addEventListener("click", function () { openPanel(false); });

  function rpc(fn, payload) {
    return fetch(base + "/rest/v1/rpc/" + fn, {
      method: "POST",
      headers: {
        apikey: cfg.SUPABASE_ANON_KEY,
        Authorization: "Bearer " + cfg.SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then(function (r) { return r.json(); });
  }

  function pollMessages() {
    if (!conversationId) return;
    rpc("get_chat_messages", { p_conversation_id: conversationId })
      .then(function (rows) {
        if (!Array.isArray(rows)) return;
        rows.forEach(function (m) {
          if (seenIds[m.id]) return;
          seenIds[m.id] = true;
          if (!historyLoaded) { appendMsg(m.sender_type, m.body); return; }
          if (m.sender_type !== "visitor") { appendMsg(m.sender_type, m.body); showBadge(); }
        });
        historyLoaded = true;
      })
      .catch(function () {});
  }
  function startPolling() { if (!pollTimer && conversationId) pollTimer = setInterval(pollMessages, 4000); }
  function stopPolling() { if (pollTimer) { clearInterval(pollTimer); pollTimer = null; } }
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stopPolling(); else startPolling();
  });

  function send() {
    var text = inputEl.value.trim();
    if (!text) return;
    var name = nameEl.value.trim();
    if (name) { try { localStorage.setItem(NAME_KEY, name); } catch (e) {} nameBar.style.display = "none"; }
    inputEl.value = "";
    appendMsg("visitor", text);
    sendBtn.disabled = true;

    var lang = getLang();
    var afterResponse = function (res) {
      sendBtn.disabled = false;
      // Don't render res.auto_reply directly here — it has no message id
      // yet, so polling can't recognize it as "already shown" and would
      // render it a second time once it sees the real database row.
      // Polling picks it up properly a moment later instead.
      pollMessages();
      startPolling();
    };

    if (!conversationId) {
      rpc("start_chat_conversation", {
        p_visitor_name: name || null,
        p_message: text,
        p_lang: lang,
        p_page_url: window.location.href,
      }).then(function (res) {
        if (res && res.conversation_id) {
          conversationId = res.conversation_id;
          try { localStorage.setItem(CONV_KEY, conversationId); } catch (e) {}
          historyLoaded = true; // nothing to restore for a brand-new conversation
        }
        afterResponse(res);
      }).catch(function () {
        sendBtn.disabled = false;
        appendMsg("system", lang === "en" ? "Something went wrong. Please try again." : "Une erreur est survenue. Veuillez réessayer.");
      });
    } else {
      rpc("send_chat_message", { p_conversation_id: conversationId, p_message: text, p_lang: lang })
        .then(afterResponse)
        .catch(function () {
          sendBtn.disabled = false;
          appendMsg("system", lang === "en" ? "Something went wrong. Please try again." : "Une erreur est survenue. Veuillez réessayer.");
        });
    }
  }
  sendBtn.addEventListener("click", send);
  inputEl.addEventListener("keydown", function (e) { if (e.key === "Enter") send(); });

  // Returning visitor mid-conversation: restore history and resume polling.
  if (conversationId) {
    pollMessages();
    startPolling();
  }
})();
