/* Chemin Serein — language switch + mobile nav */
(function () {
  var KEY = "hdv-lang";

  function setLang(lang) {
    document.documentElement.setAttribute("lang", lang);
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    document.querySelectorAll(".lang-toggle button").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-set-lang") === lang);
    });
    // <select> options can't be hidden via CSS reliably — toggle in JS
    document.querySelectorAll("select option[data-lang]").forEach(function (o) {
      var match = o.getAttribute("data-lang") === lang;
      o.hidden = !match;
      o.disabled = !match;
      if (match && o.parentElement.selectedIndex < 0) o.selected = true;
    });
    document.querySelectorAll("select").forEach(function (sel) {
      var cur = sel.options[sel.selectedIndex];
      if (!cur || cur.hidden) {
        for (var i = 0; i < sel.options.length; i++) {
          if (!sel.options[i].hidden) { sel.selectedIndex = i; break; }
        }
      }
    });
  }

  function initLang() {
    var saved = "fr";
    try { saved = localStorage.getItem(KEY) || "fr"; } catch (e) {}
    setLang(saved);
    document.querySelectorAll(".lang-toggle button").forEach(function (b) {
      b.addEventListener("click", function () {
        setLang(b.getAttribute("data-set-lang"));
      });
    });
  }

  function initNav() {
    var t = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".nav");
    if (!t || !nav) return;
    t.addEventListener("click", function () { nav.classList.toggle("open"); });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }

  function initForm() {
    var f = document.querySelector("form[data-contact]");
    if (!f) return;
    var okMsg = f.querySelector(".form-msg");
    var errMsg = f.querySelector(".form-err");
    var btn = f.querySelector('button[type="submit"]');

    function emailValid(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
    function setFieldError(input, on) {
      var field = input.closest(".field");
      if (field) field.classList.toggle("invalid", on);
    }
    ["name", "email"].forEach(function (n) {
      var input = f.querySelector('[name="' + n + '"]');
      if (input) input.addEventListener("input", function () { setFieldError(input, false); });
    });
    function validate() {
      var ok = true;
      var nameI = f.querySelector('[name="name"]');
      var emailI = f.querySelector('[name="email"]');
      if (nameI && !nameI.value.trim()) { setFieldError(nameI, true); ok = false; }
      if (emailI && !emailValid(emailI.value.trim())) { setFieldError(emailI, true); ok = false; }
      return ok;
    }

    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (okMsg) okMsg.style.display = "none";
      if (errMsg) errMsg.style.display = "none";

      // Honeypot: if filled, silently drop (show success to the bot).
      var hp = f.querySelector('[name="website"]');
      if (hp && hp.value.trim() !== "") {
        if (okMsg) okMsg.style.display = "block";
        f.reset();
        return;
      }

      if (!validate()) return;

      var cfg = window.HDV_CONFIG || {};
      var configured =
        cfg.SUPABASE_URL &&
        cfg.SUPABASE_URL.indexOf("YOUR-") === -1 &&
        cfg.SUPABASE_ANON_KEY &&
        cfg.SUPABASE_ANON_KEY.indexOf("YOUR-") === -1;

      var data = {
        name: (f.name && f.name.value || "").trim(),
        phone: (f.phone && f.phone.value || "").trim(),
        email: (f.email && f.email.value || "").trim(),
        preferred: (f.preferred && f.preferred.value || "").trim(),
        consultation_date: (f.date && f.date.value || "") || null,
        message: (f.message && f.message.value || "").trim(),
        lang: document.documentElement.getAttribute("lang") || "fr"
      };

      // If Supabase isn't configured yet, fail gracefully (no silent data loss).
      if (!configured) {
        if (errMsg) errMsg.style.display = "block";
        console.warn("HDV: Supabase not configured — edit assets/config.js");
        return;
      }

      if (btn) { btn.disabled = true; btn.style.opacity = "0.6"; }

      fetch(cfg.SUPABASE_URL.replace(/\/+$/, "") + "/rest/v1/contact_submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": cfg.SUPABASE_ANON_KEY,
          "Authorization": "Bearer " + cfg.SUPABASE_ANON_KEY,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          if (okMsg) okMsg.style.display = "block";
          f.reset();
          setLang(document.documentElement.getAttribute("lang") || "fr");
        })
        .catch(function (err) {
          console.error("HDV submit error:", err);
          if (errMsg) errMsg.style.display = "block";
        })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.style.opacity = ""; }
        });
    });
  }

  function initApplyForm() {
    var f = document.querySelector("form[data-apply]");
    if (!f) return;
    var okMsg = f.querySelector(".form-msg");
    var errMsg = f.querySelector(".form-err");
    var btn = f.querySelector('button[type="submit"]');

    function emailValid(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
    function setFieldError(input, on){ var fl=input.closest(".field"); if(fl) fl.classList.toggle("invalid", on); }
    ["full_name","email"].forEach(function(n){
      var i=f.querySelector('[name="'+n+'"]'); if(i) i.addEventListener("input", function(){ setFieldError(i,false); });
    });

    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (okMsg) okMsg.style.display = "none";
      if (errMsg) errMsg.style.display = "none";

      var hp = f.querySelector('[name="website"]');
      if (hp && hp.value.trim() !== "") { if (okMsg) okMsg.style.display="block"; f.reset(); return; }

      var nameI=f.querySelector('[name="full_name"]'), emailI=f.querySelector('[name="email"]');
      var ok=true;
      if (nameI && !nameI.value.trim()){ setFieldError(nameI,true); ok=false; }
      if (emailI && !emailValid(emailI.value.trim())){ setFieldError(emailI,true); ok=false; }

      // Sanitize social handles: usernames only, no URLs. Returns clean handle or "".
      function cleanHandle(v){
        if(!v) return "";
        var s=String(v).trim();
        if(s==="") return "";
        // reject anything that looks like a URL or has illegal chars
        if(/https?:|\/|\s|\\|@.*@/i.test(s.replace(/^@/,""))) return null; // null = invalid
        s=s.replace(/^@/,"");                       // drop a leading @
        if(!/^[A-Za-z0-9._-]{1,40}$/.test(s)) return null; // valid username chars only
        return s;
      }
      var igRaw=f.ig&&f.ig.value, fbRaw=f.fb&&f.fb.value, ttRaw=f.tt&&f.tt.value;
      var ig=cleanHandle(igRaw), fb=cleanHandle(fbRaw), tt=cleanHandle(ttRaw);
      var socialErr=f.querySelector('.field-error[data-for="social"]');
      if (ig===null||fb===null||tt===null){
        if(socialErr){ var fld=socialErr.closest(".field"); if(fld) fld.classList.add("invalid"); }
        ok=false;
      } else if(socialErr){ var fld2=socialErr.closest(".field"); if(fld2) fld2.classList.remove("invalid"); }
      if (!ok) return;

      var cfg = window.HDV_CONFIG || {};
      var configured = cfg.SUPABASE_URL && cfg.SUPABASE_URL.indexOf("YOUR-")===-1 && cfg.SUPABASE_ANON_KEY && cfg.SUPABASE_ANON_KEY.indexOf("YOUR-")===-1;

      var data = {
        full_name: (f.full_name && f.full_name.value || "").trim(),
        email: (f.email && f.email.value || "").trim(),
        phone: (f.phone && f.phone.value || "").trim(),
        role_wanted: (f.role_wanted && f.role_wanted.value || "").trim(),
        experience: (f.experience && f.experience.value || "").trim(),
        ig_handle: ig || null,
        fb_handle: fb || null,
        tt_handle: tt || null
      };

      if (!configured) { if (errMsg) errMsg.style.display="block"; console.warn("HDV: Supabase not configured"); return; }
      if (btn){ btn.disabled=true; btn.style.opacity="0.6"; }

      fetch(cfg.SUPABASE_URL.replace(/\/+$/, "") + "/rest/v1/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": cfg.SUPABASE_ANON_KEY,
          "Authorization": "Bearer " + cfg.SUPABASE_ANON_KEY,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(data)
      })
        .then(function(res){ if(!res.ok) throw new Error("HTTP "+res.status); if(okMsg) okMsg.style.display="block"; f.reset(); setLang(document.documentElement.getAttribute("lang")||"fr"); })
        .catch(function(err){ console.error("HDV apply error:", err); if(errMsg) errMsg.style.display="block"; })
        .finally(function(){ if(btn){ btn.disabled=false; btn.style.opacity=""; } });
    });
  }

  function prefillPackage() {
    var ta = document.querySelector('form[data-contact] [name="message"]');
    if (!ta) return;
    var params = new URLSearchParams(window.location.search);
    var pkg = params.get("package");
    if (!pkg) return;
    var names = {
      essentiel: { fr: "Forfait Essentiel", en: "Essential Guidance" },
      serenite:  { fr: "Forfait Sérénité",  en: "Family Support" },
      heritage:  { fr: "Forfait Héritage",  en: "Legacy Premium" }
    };
    var n = names[pkg];
    if (!n) return;
    var lang = document.documentElement.getAttribute("lang") || "fr";
    var msg = lang === "en"
      ? "Hello, I am interested in the " + n.en + " package. "
      : "Bonjour, je suis intéressé(e) par le " + n.fr + ". ";
    // only prefill if empty, so we don't overwrite anything the user typed
    if (!ta.value.trim()) ta.value = msg;
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLang(); initNav(); initForm(); initApplyForm(); prefillPackage();
  });
})();
