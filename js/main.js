/* =========================================================================
   [BUSINESS NAME] — shared site behavior
   Covers: mobile nav, FAQ accordion, portfolio filtering, contact form
   validation (front-end only — see README for backend wiring).
   ========================================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------- Mobile hamburger nav ---------------- */
  var hamburger = document.querySelector('.hamburger');
  var navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------- FAQ accordion ---------------- */
  document.querySelectorAll('.accordion-item').forEach(function (item) {
    var btn = item.querySelector('.accordion-btn');
    var panel = item.querySelector('.accordion-panel');
    if (!btn || !panel) return;
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      // close siblings within the same accordion for a tidier reading experience
      var parentAccordion = item.closest('.accordion');
      if (parentAccordion) {
        parentAccordion.querySelectorAll('.accordion-item.open').forEach(function (openItem) {
          if (openItem !== item) {
            openItem.classList.remove('open');
            openItem.querySelector('.accordion-panel').style.maxHeight = null;
            openItem.querySelector('.accordion-btn').setAttribute('aria-expanded', 'false');
          }
        });
      }
      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
      panel.style.maxHeight = !isOpen ? panel.scrollHeight + 'px' : null;
    });
  });

  /* ---------------- Portfolio filtering ---------------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var pfCards = document.querySelectorAll('.pf-card');
  if (filterBtns.length && pfCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var category = btn.getAttribute('data-filter');
        pfCards.forEach(function (card) {
          var match = category === 'all' || card.getAttribute('data-category') === category;
          card.style.display = match ? '' : 'none';
        });
      });
    });
  }

  /* ---------------- Contact form validation (front-end only) ---------------- */
  var form = document.getElementById('contact-form');
  if (form) {
    var successBox = document.getElementById('form-success');

    function msg(key, fallback) {
      var lang = window.__currentLang || 'en';
      if (typeof I18N !== 'undefined' && I18N[key] && I18N[key][lang]) return I18N[key][lang];
      return fallback;
    }

    var validators = {
      fullName: function (v) { return v.trim().length > 1 ? '' : msg('valid.name', 'Please enter your full name.'); },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : msg('valid.email', 'Please enter a valid email address.'); },
      phone: function (v) { return v.trim().length >= 7 ? '' : msg('valid.phone', 'Please enter a valid phone number.'); },
      businessName: function (v) { return v.trim().length > 1 ? '' : msg('valid.biz', 'Please enter your business name.'); },
      serviceNeeded: function (v) { return v ? '' : msg('valid.service', 'Please select what you need help with.'); },
      description: function (v) { return v.trim().length > 9 ? '' : msg('valid.desc', 'Please tell us a little more about your project (10+ characters).'); }
    };

    function showError(field, message) {
      var wrap = field.closest('.field');
      if (!wrap) return;
      wrap.classList.toggle('has-error', !!message);
      var msgEl = wrap.querySelector('.error-msg');
      if (msgEl) msgEl.textContent = message;
    }

    Object.keys(validators).forEach(function (name) {
      var field = form.elements[name];
      if (!field) return;
      field.addEventListener('blur', function () {
        showError(field, validators[name](field.value));
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      Object.keys(validators).forEach(function (name) {
        var field = form.elements[name];
        if (!field) return;
        var msg = validators[name](field.value);
        showError(field, msg);
        if (msg) valid = false;
      });

      if (!valid) {
        var firstError = form.querySelector('.has-error input, .has-error select, .has-error textarea');
        if (firstError) firstError.focus();
        return;
      }

      /* Front-end only demo: no backend is connected yet.
         See README.md → "Connecting the contact form" for real setup
         (Formspree, Netlify Forms, a serverless function, etc). */
      if (successBox) {
        successBox.classList.add('show');
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
    });
  }

  /* ---------------- Footer year ---------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

});
