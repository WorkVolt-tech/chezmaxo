/**
 * A self-contained, in-browser fake backend for the demo build.
 * It mimics the small slice of the Supabase JS client this project
 * uses (`sb.from(...)`, `sb.rpc(...)`, `sb.storage`, `sb.auth`,
 * `sb.channel`) closely enough that every page's existing code runs
 * unmodified — the only swap is this file in place of the real
 * Supabase client. Data lives in the browser's localStorage, seeded
 * with demo content on first load, so it feels like a working booking
 * system (you can really book a slot, look it up, and manage it in
 * the admin dashboard) with zero server anywhere.
 *
 * DEMO_ADMIN_EMAIL / DEMO_ADMIN_PASSWORD below are shown on the admin
 * login page for portfolio visitors to try.
 */

const DEMO_ADMIN_EMAIL = "demo@luxenailstudio.example";
const DEMO_ADMIN_PASSWORD = "demo1234";
const STORAGE_KEY = "luxe_demo_db_v3";

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function placeholderPhoto(seedText, colorA, colorB) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${colorA}"/><stop offset="100%" stop-color="${colorB}"/>
    </linearGradient></defs>
    <rect width="400" height="400" fill="url(#g)"/>
    <circle cx="320" cy="80" r="26" fill="rgba(255,255,255,0.35)"/>
    <circle cx="70" cy="330" r="40" fill="rgba(255,255,255,0.25)"/>
    <text x="200" y="210" font-family="Georgia, serif" font-size="26" fill="rgba(255,255,255,0.9)" text-anchor="middle">${seedText}</text>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

function generateSlots() {
  const slots = [];
  const start = new Date();
  for (let i = 1; i <= 21; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    if (d.getDay() === 0 || d.getDay() === 1) continue; // closed Sun/Mon, matches posted hours
    const dateStr = d.toISOString().slice(0, 10);
    for (const hour of [10, 11, 13, 14, 15, 16]) {
      slots.push({
        id: uuid(), slot_date: dateStr,
        start_time: `${String(hour).padStart(2, "0")}:00:00`,
        end_time: `${String(hour + 1).padStart(2, "0")}:00:00`,
        max_appointments: 1, is_active: true, internal_note: null,
      });
    }
  }
  return slots;
}

function seedData() {
  const categories = [
    { id: uuid(), name_en: "Manicure", name_fr: "Manucure", display_order: 1 },
    { id: uuid(), name_en: "Pedicure", name_fr: "Pédicure", display_order: 2 },
    { id: uuid(), name_en: "Enhancements", name_fr: "Prothèses ongulaires", display_order: 3 },
    { id: uuid(), name_en: "Nail Art", name_fr: "Nail Art", display_order: 4 },
  ];
  const catId = (n) => categories.find((c) => c.name_en === n).id;

  const services = [
    { id: uuid(), category_id: catId("Manicure"), name_en: "Classic Manicure", name_fr: "Manucure classique", description_en: "Shape, cuticle care, hand massage, and polish of your choice.", description_fr: "Mise en forme, soin des cuticules, massage des mains et vernis au choix.", duration_minutes: 45, price_cents: 3500, price_is_starting_at: false, is_active: true, display_order: 1 },
    { id: uuid(), category_id: catId("Manicure"), name_en: "Gel Manicure", name_fr: "Manucure gel", description_en: "Long-lasting gel polish with a glossy, chip-resistant finish.", description_fr: "Vernis gel longue tenue avec un fini brillant et résistant.", duration_minutes: 60, price_cents: 4500, price_is_starting_at: false, is_active: true, display_order: 2 },
    { id: uuid(), category_id: catId("Enhancements"), name_en: "Acrylic Full Set", name_fr: "Pose complète acrylique", description_en: "Full acrylic extensions, shaped and finished with polish or gel.", description_fr: "Extensions acryliques complètes, mise en forme et finition vernis ou gel.", duration_minutes: 90, price_cents: 7000, price_is_starting_at: true, is_active: true, display_order: 1 },
    { id: uuid(), category_id: catId("Pedicure"), name_en: "Spa Pedicure", name_fr: "Pédicure spa", description_en: "Soak, exfoliation, callus care, massage, and polish.", description_fr: "Bain, exfoliation, soin des callosités, massage et vernis.", duration_minutes: 60, price_cents: 5000, price_is_starting_at: false, is_active: true, display_order: 1 },
    { id: uuid(), category_id: catId("Nail Art"), name_en: "Custom Nail Art", name_fr: "Nail art personnalisé", description_en: "Hand-painted designs, add to any manicure or enhancement.", description_fr: "Motifs peints à la main, à ajouter à toute manucure ou prothèse.", duration_minutes: 30, price_cents: 1500, price_is_starting_at: true, is_active: true, display_order: 1 },
    { id: uuid(), category_id: catId("Manicure"), name_en: "Gel Removal", name_fr: "Retrait de gel", description_en: "Safe soak-off removal of gel polish.", description_fr: "Retrait sécuritaire du vernis gel par trempage.", duration_minutes: 20, price_cents: 1000, price_is_starting_at: false, is_active: true, display_order: 3 },
  ];

  const gallery_images = [
    { id: uuid(), image_url: "assets/images/gallery/nail-art.webp", style_name_en: "Lavender Ombré", style_name_fr: "Ombré lavande", category: "Nail Art", is_active: true, display_order: 1 },
    { id: uuid(), image_url: "assets/images/gallery/gel-set.webp", style_name_en: "Blush Gel Set", style_name_fr: "Gel rosé", category: "Gel", is_active: true, display_order: 2 },
    { id: uuid(), image_url: "assets/images/gallery/chrome.webp", style_name_en: "Gold Chrome", style_name_fr: "Chrome doré", category: "Acrylic", is_active: true, display_order: 3 },
    { id: uuid(), image_url: "assets/images/gallery/floral.webp", style_name_en: "Hand-Painted Florals", style_name_fr: "Fleurs peintes à la main", category: "Nail Art", is_active: true, display_order: 4 },
  ];

  const testimonials = [
    { id: uuid(), client_name: "Amélie R.", quote_en: "The most relaxing manicure I've ever had — and my nails lasted three weeks!", quote_fr: "La manucure la plus relaxante que j'aie eue — et mes ongles ont tenu trois semaines !", rating: 5, is_active: true, display_order: 1 },
    { id: uuid(), client_name: "Sophie L.", quote_en: "So precise and clean. I recommend it to everyone I know.", quote_fr: "Si précis et propre. Je le recommande à tout le monde.", rating: 5, is_active: true, display_order: 2 },
    { id: uuid(), client_name: "Camille T.", quote_en: "Booking online was effortless and the studio is beautiful.", quote_fr: "La réservation en ligne était simple et le studio est magnifique.", rating: 5, is_active: true, display_order: 3 },
  ];

  const salon_policies = [
    { id: uuid(), policy_key: "deposits", title_en: "Deposits", title_fr: "Dépôts", body_en: "A deposit may be required to confirm certain appointments. Details are provided at booking.", body_fr: "Un dépôt peut être requis pour confirmer certains rendez-vous. Les détails sont fournis lors de la réservation.", display_order: 1 },
    { id: uuid(), policy_key: "late_arrival", title_en: "Late Arrivals", title_fr: "Retards", body_en: "Arrivals more than 15 minutes late may need to be rescheduled.", body_fr: "Les arrivées avec plus de 15 minutes de retard pourraient devoir être reportées.", display_order: 2 },
    { id: uuid(), policy_key: "cancellation", title_en: "Cancellations", title_fr: "Annulations", body_en: "Please cancel at least 24 hours in advance whenever possible.", body_fr: "Veuillez annuler au moins 24 heures à l'avance dans la mesure du possible.", display_order: 3 },
    { id: uuid(), policy_key: "guests", title_en: "Guests", title_fr: "Accompagnateurs", body_en: "To keep the studio comfortable for everyone, please avoid bringing additional guests.", body_fr: "Afin de garantir le confort de toutes les clientes, merci d'éviter de venir accompagnée.", display_order: 4 },
  ];

  const website_settings = [
    { key: "salon_name", value_en: "Luxe Nail Studio", value_fr: "Luxe Nail Studio" },
    { key: "phone", value_en: "(514) 555-0100", value_fr: "(514) 555-0100" },
    { key: "email", value_en: "hello@luxenailstudio.example", value_fr: "hello@luxenailstudio.example" },
    { key: "address", value_en: "123 Demo Street, Montréal, QC", value_fr: "123 Rue Démo, Montréal, QC" },
    { key: "hours", value_en: "Tue–Sat: 10am–6pm, Sun–Mon: Closed", value_fr: "Mar–Sam : 10h–18h, Dim–Lun : Fermé" },
  ];

  return {
    service_categories: categories,
    services,
    gallery_images,
    testimonials,
    salon_policies,
    website_settings,
    availability_slots: generateSlots(),
    blocked_dates: [],
    appointments: [],
    clients: [],
    administrators: [{ id: "demo-admin-id", full_name: "Demo Admin", role: "owner" }],
    conversations: [],
    messages: [],
    reminder_settings: [
      { id: uuid(), hours_before: 48, is_active: true },
      { id: uuid(), hours_before: 24, is_active: true },
      { id: uuid(), hours_before: 2, is_active: true },
    ],
    appointment_verifications: [],
  };
}

let DB = load();
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  const fresh = seedData();
  persist(fresh);
  return fresh;
}
function persist(db) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); } catch (e) {}
}
function save() { persist(DB); }
function table(name) { return DB[name] || (DB[name] = []); }

function isHoldActive(a) {
  if (a.status !== "pending") return true;
  if (!a.hold_expires_at) return true;
  return new Date(a.hold_expires_at) > new Date();
}

const RELATIONS = {
  services: { service_categories: { fk: "category_id", tbl: "service_categories" } },
  appointments: {
    clients: { fk: "client_id", tbl: "clients" },
    services: { fk: "service_id", tbl: "services" },
  },
  conversations: {
    appointments: { fk: "appointment_id", tbl: "appointments" },
    clients: { fk: "client_id", tbl: "clients" },
  },
};

function cmp(a, b) {
  const av = a === null || a === undefined ? "" : a;
  const bv = b === null || b === undefined ? "" : b;
  if (av < bv) return -1;
  if (av > bv) return 1;
  return 0;
}

class QueryBuilder {
  constructor(tbl) {
    this.table = tbl; this.filters = []; this.orders = [];
    this._limit = null; this._op = "select"; this._payload = null;
    this._maybeSingle = false; this._selectStr = "*"; this._countOnly = false;
  }
  select(cols, opts) { this._selectStr = cols || "*"; if (opts && opts.head) this._countOnly = true; return this; }
  insert(obj) { this._op = "insert"; this._payload = obj; return this; }
  update(obj) { this._op = "update"; this._payload = obj; return this; }
  delete() { this._op = "delete"; return this; }
  eq(c, v) { this.filters.push((r) => r[c] === v); return this; }
  neq(c, v) { this.filters.push((r) => r[c] !== v); return this; }
  gt(c, v) { this.filters.push((r) => r[c] > v); return this; }
  gte(c, v) { this.filters.push((r) => r[c] >= v); return this; }
  lt(c, v) { this.filters.push((r) => r[c] < v); return this; }
  lte(c, v) { this.filters.push((r) => r[c] <= v); return this; }
  in(c, vals) { this.filters.push((r) => vals.includes(r[c])); return this; }
  is(c, v) { this.filters.push((r) => (v === null ? r[c] === null || r[c] === undefined : r[c] === v)); return this; }
  order(c, opts) { this.orders.push({ c, asc: !opts || opts.ascending !== false }); return this; }
  limit(n) { this._limit = n; return this; }
  maybeSingle() { this._maybeSingle = true; return this; }

  _rows() {
    let rows;
    if (this.table === "public_available_slots") {
      const blockedWholeDays = new Set(table("blocked_dates").filter((b) => !b.start_time).map((b) => b.blocked_date));
      const today = new Date().toISOString().slice(0, 10);
      rows = table("availability_slots")
        .filter((s) => s.is_active && s.slot_date >= today && !blockedWholeDays.has(s.slot_date))
        .map((s) => {
          const activeCount = table("appointments").filter((a) => a.slot_id === s.id && ["pending", "accepted", "confirmed"].includes(a.status) && isHoldActive(a)).length;
          return { ...s, spots_remaining: s.max_appointments - activeCount };
        });
    } else {
      rows = table(this.table).slice();
    }
    for (const f of this.filters) rows = rows.filter(f);
    return rows;
  }

  _finish(rows) {
    if (this.orders.length) {
      rows = rows.slice().sort((a, b) => {
        for (const o of this.orders) {
          const r = cmp(a[o.c], b[o.c]);
          if (r !== 0) return o.asc ? r : -r;
        }
        return 0;
      });
    }
    if (this._limit != null) rows = rows.slice(0, this._limit);
    const rel = RELATIONS[this.table];
    if (rel) {
      rows = rows.map((row) => {
        const copy = { ...row };
        for (const key in rel) {
          if (this._selectStr.includes(key + "(")) {
            const { fk, tbl } = rel[key];
            copy[key] = table(tbl).find((t) => t.id === row[fk]) || null;
          }
        }
        return copy;
      });
    }
    return rows;
  }

  then(resolve) {
    try {
      let result;
      if (this._op === "select") {
        let rows = this._rows();
        if (this._countOnly) {
          result = { data: null, error: null, count: rows.length };
        } else {
          rows = this._finish(rows);
          result = this._maybeSingle ? { data: rows[0] || null, error: null } : { data: rows, error: null };
        }
      } else if (this._op === "insert") {
        const items = Array.isArray(this._payload) ? this._payload : [this._payload];
        const inserted = items.map((item) => {
          const row = { id: uuid(), created_at: new Date().toISOString(), ...item };
          table(this.table).push(row);
          return row;
        });
        save();
        result = { data: inserted.length === 1 ? inserted[0] : inserted, error: null };
      } else if (this._op === "update") {
        const rows = this._rows();
        rows.forEach((r) => Object.assign(r, this._payload, { updated_at: new Date().toISOString() }));
        save();
        result = { data: rows, error: null };
      } else if (this._op === "delete") {
        const rows = this._rows();
        const ids = new Set(rows.map((r) => r.id));
        DB[this.table] = table(this.table).filter((r) => !ids.has(r.id));
        save();
        result = { data: rows, error: null };
      }
      resolve(result);
    } catch (err) {
      resolve({ data: null, error: { message: String((err && err.message) || err) } });
    }
  }
}

// ---------- RPC functions (mirror the real Postgres functions) ----------

function findClientByPhone(phone) { return table("clients").find((c) => c.phone_normalized === phone); }

function rpcCreateAppointment(p) {
  const slot = table("availability_slots").find((s) => s.id === p.p_slot_id);
  if (!slot || !slot.is_active) return { data: null, error: { message: "SLOT_UNAVAILABLE" } };
  const activeCount = table("appointments").filter((a) => a.slot_id === slot.id && ["pending", "accepted", "confirmed"].includes(a.status) && isHoldActive(a)).length;
  if (activeCount >= slot.max_appointments) return { data: null, error: { message: "SLOT_FULL" } };

  let client = findClientByPhone(p.p_client_phone);
  if (!client) {
    client = { id: uuid(), full_name: p.p_client_name, phone_normalized: p.p_client_phone, email: p.p_client_email, preferred_language: p.p_preferred_language, created_at: new Date().toISOString() };
    table("clients").push(client);
  } else {
    Object.assign(client, { full_name: p.p_client_name, email: p.p_client_email || client.email, preferred_language: p.p_preferred_language });
  }

  const service = table("services").find((s) => s.id === p.p_service_id);
  const durationMin = (service ? service.duration_minutes : 60);
  const [h, m] = slot.start_time.split(":").map(Number);
  const endDate = new Date(2000, 0, 1, h, m + durationMin);
  const endTime = `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}:00`;

  const ref = "LNS-" + Array.from({ length: 6 }, () => "ABCDEFGHJKMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");
  const appointment = {
    id: uuid(), reference_number: ref, client_id: client.id, service_id: p.p_service_id,
    addon_ids: p.p_addon_ids || [], slot_id: slot.id,
    appointment_date: slot.slot_date, start_time: slot.start_time, end_time: endTime < slot.end_time ? endTime : slot.end_time,
    status: "pending", preferred_language: p.p_preferred_language,
    client_notes: p.p_client_notes || null, admin_notes: null, client_visible_notes: null,
    inspiration_image_url: p.p_inspiration_image_url || null,
    price_estimate_cents: service ? service.price_cents : null,
    hold_expires_at: new Date(Date.now() + 30 * 60000).toISOString(),
    agreed_to_policies: true, verification_status: "unverified",
    cancellation_reason: null, cancelled_at: null, cancelled_by: null,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  };
  table("appointments").push(appointment);
  table("conversations").push({ id: uuid(), appointment_id: appointment.id, client_id: client.id, is_open: true, last_message_at: null, created_at: new Date().toISOString() });
  save();
  return { data: appointment, error: null };
}

function rpcRequestOtp(p) {
  const client = findClientByPhone(p.p_phone);
  const appt = client && table("appointments").find((a) => a.reference_number === p.p_reference_number.trim().toUpperCase() && a.client_id === client.id);
  if (!appt) return { data: { demoCode: null }, error: null }; // matches real behavior: no existence leak
  const code = String(Math.floor(100000 + Math.random() * 900000));
  table("appointment_verifications").push({ id: uuid(), appointment_id: appt.id, code, expires_at: new Date(Date.now() + 10 * 60000).toISOString(), consumed_at: null, attempt_count: 0, created_at: new Date().toISOString() });
  save();
  // No email server exists in this demo, so the code is handed back
  // directly instead of "sent" — the calling page displays it inline
  // with a clear "demo mode" label.
  return { data: { demoCode: code }, error: null };
}

function rpcVerifyOtp(p) {
  const client = findClientByPhone(p.p_phone);
  const appt = client && table("appointments").find((a) => a.reference_number === p.p_reference_number.trim().toUpperCase() && a.client_id === client.id);
  if (!appt) return { data: null, error: { message: "INVALID_CODE" } };
  const verification = table("appointment_verifications")
    .filter((v) => v.appointment_id === appt.id && !v.consumed_at && new Date(v.expires_at) > new Date())
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))[0];
  if (!verification || verification.attempt_count >= 5) return { data: null, error: { message: "INVALID_CODE" } };
  if (verification.code !== p.p_code) { verification.attempt_count++; save(); return { data: null, error: { message: "INVALID_CODE" } }; }
  verification.consumed_at = new Date().toISOString();
  appt.verification_status = "verified";
  save();
  const token = `${appt.id}.${Date.now() + 30 * 60000}`;
  return {
    data: {
      accessToken: token,
      appointment: {
        id: appt.id, referenceNumber: appt.reference_number, date: appt.appointment_date,
        startTime: appt.start_time, status: appt.status, priceEstimateCents: appt.price_estimate_cents,
        clientVisibleNotes: appt.client_visible_notes, serviceId: appt.service_id,
      },
    },
    error: null,
  };
}

function tokenAppointmentId(token) { return (token || "").split(".")[0]; }

function rpcCancelAppointment(p) {
  const appt = table("appointments").find((a) => a.id === tokenAppointmentId(p.p_access_token) && a.id === p.p_appointment_id);
  if (!appt) return { data: null, error: { message: "NOT_FOUND" } };
  if (["cancelled_by_client", "cancelled_by_salon", "completed", "no_show"].includes(appt.status)) return { data: null, error: { message: "ALREADY_CLOSED" } };
  const hoursUntil = (new Date(`${appt.appointment_date}T${appt.start_time}`) - new Date()) / 3600000;
  if (hoursUntil < 24) return { data: null, error: { message: "CUTOFF_PASSED" } };
  appt.status = "cancelled_by_client"; appt.cancellation_reason = p.p_reason || null;
  appt.cancelled_at = new Date().toISOString(); appt.cancelled_by = "client";
  save();
  return { data: { ok: true }, error: null };
}

function rpcGetConversation(p) {
  const conv = table("conversations").find((c) => c.appointment_id === p.p_appointment_id);
  if (!conv) return { data: null, error: { message: "NOT_FOUND" } };
  const msgs = table("messages").filter((m) => m.conversation_id === conv.id).sort((a, b) => (a.created_at > b.created_at ? 1 : -1));
  return { data: { conversationId: conv.id, messages: msgs }, error: null };
}

function rpcSendClientMessage(p) {
  const conv = table("conversations").find((c) => c.appointment_id === p.p_appointment_id);
  if (!conv) return { data: null, error: { message: "NOT_FOUND" } };
  table("messages").push({ id: uuid(), conversation_id: conv.id, sender_type: "client", body: p.p_body, image_url: null, is_read_by_admin: false, is_read_by_client: true, created_at: new Date().toISOString() });
  conv.last_message_at = new Date().toISOString();
  save();
  // A canned auto-reply so the chat demo feels alive without a real person on the other end.
  setTimeout(() => {
    table("messages").push({ id: uuid(), conversation_id: conv.id, sender_type: "admin", body: "Thanks for your message! (This is an automated demo reply — in the real system, salon staff would answer here.)", image_url: null, is_read_by_admin: true, is_read_by_client: false, created_at: new Date().toISOString() });
    conv.last_message_at = new Date().toISOString();
    save();
  }, 1400);
  return { data: { ok: true }, error: null };
}

function rpcSubmitContactForm(p) {
  return { data: { ok: true }, error: null };
}

const RPCS = {
  create_appointment: rpcCreateAppointment,
  request_appointment_otp: rpcRequestOtp,
  verify_appointment_otp: rpcVerifyOtp,
  cancel_appointment: rpcCancelAppointment,
  get_appointment_conversation: rpcGetConversation,
  send_client_message: rpcSendClientMessage,
  submit_contact_form: rpcSubmitContactForm,
};

// ---------- storage (fake upload using blob URLs, session-only) ----------

const STORAGE_BLOBS = {};
const storage = {
  from(bucket) {
    return {
      async upload(path, file) {
        try { STORAGE_BLOBS[bucket + "/" + path] = URL.createObjectURL(file); return { data: { path }, error: null }; }
        catch (e) { return { data: null, error: { message: String(e) } }; }
      },
      getPublicUrl(path) { return { data: { publicUrl: STORAGE_BLOBS[bucket + "/" + path] || "" } }; },
      async remove(paths) { paths.forEach((p) => delete STORAGE_BLOBS[bucket + "/" + p]); return { data: null, error: null }; },
    };
  },
};

// ---------- auth (single hardcoded demo admin) ----------

const auth = {
  async signInWithPassword({ email, password }) {
    if (email === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD) {
      sessionStorage.setItem("luxe_demo_session", "1");
      return { data: { session: { user: { id: "demo-admin-id", email } } }, error: null };
    }
    return { data: null, error: { message: "Invalid login credentials" } };
  },
  async getSession() {
    const has = sessionStorage.getItem("luxe_demo_session");
    return { data: { session: has ? { user: { id: "demo-admin-id", email: DEMO_ADMIN_EMAIL } } : null } };
  },
  async getUser() {
    const s = await this.getSession();
    return { data: { user: (s.data.session && s.data.session.user) || null } };
  },
  async signOut() { sessionStorage.removeItem("luxe_demo_session"); return { error: null }; },
};

// ---------- fake realtime (polling under the hood) ----------

function channelMock() {
  let handlers = [];
  let seen = new Set(table("messages").map((m) => m.id));
  let interval = null;
  const api = {
    on(_event, opts, cb) { handlers.push({ opts, cb }); return api; },
    subscribe() {
      interval = setInterval(() => {
        for (const row of table("messages")) {
          if (seen.has(row.id)) continue;
          seen.add(row.id);
          for (const h of handlers) {
            if (h.opts.table !== "messages") continue;
            if (h.opts.filter) {
              const [col, rest] = h.opts.filter.split("=eq.");
              if (String(row[col]) !== rest) continue;
            }
            h.cb({ new: row });
          }
        }
      }, 1200);
      return api;
    },
    _stop() { if (interval) clearInterval(interval); },
  };
  return api;
}

// ---------- assembled client ----------

const sb = {
  from(t) { return new QueryBuilder(t); },
  async rpc(name, params) {
    const fn = RPCS[name];
    if (!fn) return { data: null, error: { message: "Unknown demo RPC: " + name } };
    return fn(params || {});
  },
  storage,
  auth,
  channel: channelMock,
  removeChannel(ch) { if (ch && ch._stop) ch._stop(); },
};

// ---------- demo-mode banner, injected on every page ----------

document.addEventListener("DOMContentLoaded", () => {
  const banner = document.createElement("div");
  banner.textContent = "Demo — sample data only, no real bookings or emails are sent";
  banner.style.cssText = "background:#2D1B36;color:#fff;text-align:center;font-size:0.75rem;padding:0.4rem;letter-spacing:0.02em;position:relative;z-index:100";
  document.body.prepend(banner);
});
