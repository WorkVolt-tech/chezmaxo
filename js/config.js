// =========================================================================
// Fill these in from your Supabase project:
// Dashboard -> Project Settings -> API -> "Project URL" and "anon public" key
// The anon key is safe to expose in client-side code — it only works
// within the permissions granted by your Row Level Security policies.
// =========================================================================
const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

// PayPal client ID (from developer.paypal.com -> My Apps & Credentials)
// Use a Sandbox client ID while testing, then swap to your Live one at launch.
const PAYPAL_CLIENT_ID = "YOUR_PAYPAL_CLIENT_ID";

// Prices must match what's described in supabase-schema.sql / your pricing page
const PLAN_PRICES = {
  "Starter Care":    { monthly: 15.00, yearly: 150.00 },
  "Monthly Support": { monthly: 30.00, yearly: 300.00 },
  "Business Care":   { monthly: 80.00, yearly: 800.00 }
};
