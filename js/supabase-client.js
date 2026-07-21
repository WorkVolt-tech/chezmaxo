// =========================================================================
// Shared Supabase client + helpers. Loaded after config.js and the
// Supabase JS SDK <script> tag on every page.
// =========================================================================

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---------------- Auth ----------------

async function signUp(email, password, fullName, businessName) {
  const { data, error } = await sb.auth.signUp({ email, password });
  if (error) throw error;
  if (data.user) {
    await ensureProfile(data.user.id, fullName, businessName);
  }
  return data;
}

async function signIn(email, password) {
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  await ensureProfile(data.user.id);
  return data;
}

async function signOut() {
  await sb.auth.signOut();
  window.location.href = "login.html";
}

async function getSession() {
  const { data } = await sb.auth.getSession();
  return data.session;
}

async function requireSession() {
  const session = await getSession();
  if (!session) {
    window.location.href = "login.html";
    return null;
  }
  return session;
}

async function ensureProfile(userId, fullName, businessName) {
  const { data: existing } = await sb.from("profiles").select("id").eq("id", userId).maybeSingle();
  if (!existing) {
    await sb.from("profiles").insert({
      id: userId,
      full_name: fullName || "",
      business_name: businessName || ""
    });
  }
}

async function isCurrentUserAdmin() {
  const { data, error } = await sb.from("admins").select("user_id").maybeSingle();
  return !error && !!data;
}

async function getMyProfile() {
  const session = await getSession();
  if (!session) return null;
  const { data, error } = await sb.from("profiles").select("*").eq("id", session.user.id).single();
  if (error) throw error;
  return data;
}

// ---------------- Profiles (admin: list all clients) ----------------

async function listClients() {
  const { data, error } = await sb.from("profiles").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

async function updateClientStage(clientId, stage) {
  const { error } = await sb.from("profiles").update({ stage }).eq("id", clientId);
  if (error) throw error;
}

async function updateClientPlan(clientId, plan) {
  const { error } = await sb.from("profiles").update({ plan }).eq("id", clientId);
  if (error) throw error;
}

// ---------------- Requests ----------------

async function listMyRequests(clientId) {
  const { data, error } = await sb.from("requests").select("*").eq("client_id", clientId).order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

async function listAllRequests() {
  const { data, error } = await sb.from("requests").select("*, profiles(business_name)").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

async function submitRequest(clientId, text) {
  const { error } = await sb.from("requests").insert({ client_id: clientId, text });
  if (error) throw error;
}

async function markRequestDone(requestId) {
  const { error } = await sb.from("requests").update({ status: "done" }).eq("id", requestId);
  if (error) throw error;
}

// ---------------- Payments ----------------

async function listMyPayments(clientId) {
  const { data, error } = await sb.from("payments").select("*").eq("client_id", clientId).order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

async function listAllPayments() {
  const { data, error } = await sb.from("payments").select("*, profiles(business_name)").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

async function logManualPayment(clientId, method, amount, reference) {
  const { error } = await sb.from("payments").insert({ client_id: clientId, method, amount, reference, status: "pending" });
  if (error) throw error;
}

async function logPayPalPayment(clientId, amount, reference) {
  const { error } = await sb.from("payments").insert({ client_id: clientId, method: "PayPal", amount, reference, status: "confirmed" });
  if (error) throw error;
}

async function confirmPayment(paymentId) {
  const { error } = await sb.from("payments").update({ status: "confirmed" }).eq("id", paymentId);
  if (error) throw error;
}

// ---------------- Messages ----------------

async function listMessages(clientId) {
  const { data, error } = await sb.from("messages").select("*").eq("client_id", clientId).order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

async function sendMessage(clientId, senderId, senderRole, text) {
  const { error } = await sb.from("messages").insert({ client_id: clientId, sender_id: senderId, sender_role: senderRole, text });
  if (error) throw error;
}

function subscribeToMessages(clientId, onInsert) {
  return sb.channel("messages-" + clientId)
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `client_id=eq.${clientId}` }, onInsert)
    .subscribe();
}

function subscribeToTable(table, onChange) {
  return sb.channel(table + "-changes")
    .on("postgres_changes", { event: "*", schema: "public", table }, onChange)
    .subscribe();
}
