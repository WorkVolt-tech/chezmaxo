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
      description: function (v) { return v.trim().length > 9 ? '' : msg('valid.desc', 'Please tell us a little more about your project (10+ characters).'); }
    };

    function validateNeeds() {
      var checked = form.querySelectorAll('input[name="needs"]:checked').length > 0;
      var wrap = document.getElementById('needsField');
      var errEl = document.getElementById('needsError');
      if (wrap) wrap.classList.toggle('has-error', !checked);
      if (errEl) errEl.textContent = checked ? '' : msg('valid.needs', 'Please select at least one option.');
      return checked;
    }

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

    form.querySelectorAll('input[name="needs"]').forEach(function (cb) {
      cb.addEventListener('change', validateNeeds);
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
      if (!validateNeeds()) valid = false;

      if (!valid) {
        var firstError = form.querySelector('.has-error input, .has-error select, .has-error textarea');
        if (firstError) firstError.focus();
        else {
          var errWrap = form.querySelector('.has-error');
          if (errWrap) errWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      var errorBox = document.getElementById('form-error');
      var defaultErrorText = errorBox ? errorBox.textContent : '';

      // CONTACT_SUPABASE_URL / CONTACT_SUPABASE_ANON_KEY are defined inline
      // on contact.html only. If they're still placeholders (not filled
      // in), fall back to the old front-end-only demo behavior instead of
      // silently failing.
      var configured = typeof CONTACT_SUPABASE_URL !== 'undefined' &&
        CONTACT_SUPABASE_URL.indexOf('YOUR_') === -1 &&
        CONTACT_SUPABASE_ANON_KEY.indexOf('YOUR_') === -1;

      if (!configured) {
        if (successBox) {
          successBox.classList.add('show');
          successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        form.reset();
        return;
      }

      // Honeypot: a real visitor never fills this in. A bot that
      // auto-fills every field on the page will — silently drop it,
      // but still show success so the bot doesn't learn anything.
      var hp = document.getElementById('cf-hp');
      if (hp && hp.value) {
        if (successBox) { successBox.classList.add('show'); }
        form.reset();
        return;
      }

      // Timing check: a human takes at least a couple seconds to fill
      // this form. Near-instant submission is almost certainly a bot.
      var elapsed = Date.now() - (window.__contactPageLoadedAt || 0);
      if (elapsed < 2000) {
        if (errorBox) {
          errorBox.textContent = 'Please take a moment to review the form before submitting.';
          errorBox.classList.add('show');
        }
        return;
      }

      var needsChecked = Array.prototype.slice.call(form.querySelectorAll('input[name="needs"]:checked'))
        .map(function (cb) { return cb.value; }).join(', ');

      var payload = {
        full_name: form.elements.fullName.value.trim(),
        business_name: form.elements.businessName.value.trim(),
        email: form.elements.email.value.trim(),
        phone: form.elements.phone.value.trim(),
        website: form.elements.website.value.trim(),
        business_type: form.elements.businessType.value.trim(),
        budget: form.elements.budget.value,
        launch_date: form.elements.launchDate.value.trim(),
        contact_method: form.elements.contactMethod.value,
        needs: needsChecked,
        description: form.elements.description.value.trim()
      };

      if (submitBtn) submitBtn.disabled = true;
      if (errorBox) errorBox.classList.remove('show');

      fetch(CONTACT_SUPABASE_URL + '/rest/v1/contact_submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': CONTACT_SUPABASE_ANON_KEY,
          'Authorization': 'Bearer ' + CONTACT_SUPABASE_ANON_KEY,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(payload)
      }).then(function (res) {
        if (submitBtn) submitBtn.disabled = false;
        if (!res.ok) throw new Error('submit failed');
        if (successBox) {
          successBox.classList.add('show');
          successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        form.reset();
      }).catch(function () {
        if (submitBtn) submitBtn.disabled = false;
        if (errorBox) {
          errorBox.textContent = defaultErrorText;
          errorBox.classList.add('show');
          errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }

  /* ---------------- Footer year ---------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

});
