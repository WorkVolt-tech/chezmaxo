function renderSiteHeader() {
  const el = document.getElementById("site-header");
  if (!el) return;
  const lang = getLang();
  const navItems = [
    ["index.html", t("nav_home")],
    ["services.html", t("nav_services")],
    ["gallery.html", t("nav_gallery")],
    ["about.html", t("nav_about")],
    ["manage-appointment.html", t("nav_manage")],
    ["contact.html", t("nav_contact")],
  ];
  const navLinksHtml = navItems.map(([href, label]) => `<a href="${href}">${label}</a>`).join("");
  const langToggleHtml = `
    <div class="lang-toggle">
      <button class="${lang === "en" ? "active" : ""}" onclick="setLang('en')">EN</button>
      <button class="${lang === "fr" ? "active" : ""}" onclick="setLang('fr')">FR</button>
    </div>`;

  el.innerHTML = `
    <header class="site-header">
      <div class="container bar">
        <div class="bar-left">
          <button class="menu-toggle" id="mobile-menu-toggle" aria-label="Menu" aria-expanded="false">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </button>
          <a href="index.html" class="logo">Luxe <span>Nail Studio</span></a>
        </div>
        <nav class="nav-links">${navLinksHtml}</nav>
        <div class="header-actions">
          <div class="desktop-only-actions">
            ${langToggleHtml}
          </div>
          <a href="book.html" class="btn btn-primary">${t("nav_book")}</a>
        </div>
      </div>
      <div class="mobile-nav-panel" id="mobile-nav-panel">
        ${navLinksHtml}
        <div class="mobile-extras">
          ${langToggleHtml}
        </div>
      </div>
    </header>`;

  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const panel = document.getElementById("mobile-nav-panel");
  toggleBtn.addEventListener("click", () => {
    const isOpen = panel.classList.toggle("open");
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
  });
}

function renderSiteFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  const lang = getLang();
  el.innerHTML = `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <div class="logo" style="font-size:1.4rem">Luxe Nail Studio</div>
          <p class="text-muted" style="max-width:280px;margin-top:0.75rem">${t("hero_subtitle")}</p>
        </div>
        <div>
          <p style="font-weight:600;color:var(--royal)">${t("nav_contact")}</p>
          <p class="text-muted" id="footer-phone"></p>
          <p class="text-muted" id="footer-email"></p>
          <p class="text-muted" id="footer-address"></p>
        </div>
        <div>
          <p style="font-weight:600;color:var(--royal)">${t("hours")}</p>
          <p class="text-muted" id="footer-hours" style="white-space:pre-line"></p>
          <a href="https://instagram.com/luxenailstudio" class="text-muted">Instagram</a>
        </div>
      </div>
      <div class="footer-bottom">
        © ${new Date().getFullYear()} Luxe Nail Studio ·
        <a href="policies.html" style="text-decoration:underline">${lang === "fr" ? "Politiques" : "Policies"}</a>
      </div>
    </footer>`;

  sb.from("website_settings").select("*").then(({ data }) => {
    const map = {};
    (data || []).forEach((row) => { map[row.key] = lang === "fr" ? row.value_fr : row.value_en; });
    document.getElementById("footer-phone").textContent = map.phone || "";
    document.getElementById("footer-email").textContent = map.email || "";
    document.getElementById("footer-address").textContent = map.address || "";
    document.getElementById("footer-hours").textContent = map.hours || "";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderSiteHeader();
  renderSiteFooter();
  applyTranslations();
});
