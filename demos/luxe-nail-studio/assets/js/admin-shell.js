const ADMIN_NAV = [
  { href: "dashboard.html", en: "Dashboard", fr: "Tableau de bord" },
  { href: "calendar.html", en: "Calendar", fr: "Calendrier" },
  { href: "appointments.html", en: "Appointments", fr: "Rendez-vous" },
  { href: "availability.html", en: "Availability", fr: "Disponibilités" },
  { href: "messages.html", en: "Messages", fr: "Messages" },
  { href: "clients.html", en: "Clients", fr: "Clientes" },
  { href: "services.html", en: "Services", fr: "Services" },
  { href: "gallery.html", en: "Gallery", fr: "Galerie" },
  { href: "content.html", en: "Website Content", fr: "Contenu du site" },
  { href: "settings.html", en: "Settings", fr: "Paramètres" },
];

async function requireAdmin() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) {
    location.href = "login.html";
    return null;
  }
  const { data: admin } = await sb.from("administrators").select("full_name, role").eq("id", session.user.id).maybeSingle();
  if (!admin) {
    await sb.auth.signOut();
    location.href = "login.html";
    return null;
  }
  return admin;
}

function renderAdminShell(admin) {
  const lang = getLang();
  const current = location.pathname.split("/").pop();
  document.getElementById("admin-sidebar").innerHTML = `
    <div style="padding:0 0.75rem 1.5rem">
      <div class="logo" style="font-size:1.1rem">Luxe Nail Studio</div>
      <p class="text-muted" style="font-size:0.75rem;margin-top:0.25rem">${admin.full_name}</p>
    </div>
    <nav>
      ${ADMIN_NAV.map((item) => `<a href="${item.href}" class="${current === item.href ? "active" : ""}">${lang === "fr" ? item.fr : item.en}</a>`).join("")}
    </nav>
    <div style="margin-top:1.5rem">
      <a href="../index.html" style="display:block;padding:0.5rem 0.75rem;font-size:0.9rem;color:rgba(45,27,54,0.6);text-decoration:none">
        ${lang === "fr" ? "&larr; Voir le site" : "&larr; View Site"}
      </a>
      <a href="#" id="admin-logout" style="display:block;padding:0.5rem 0.75rem;font-size:0.9rem;color:rgba(45,27,54,0.6);text-decoration:none">
        ${lang === "fr" ? "Déconnexion" : "Log Out"}
      </a>
    </div>`;
  document.getElementById("admin-logout").addEventListener("click", async (e) => {
    e.preventDefault();
    await sb.auth.signOut();
    location.href = "login.html";
  });
}

async function initAdminPage(renderContent) {
  const admin = await requireAdmin();
  if (!admin) return;
  renderAdminShell(admin);
  await renderContent(admin);
}
