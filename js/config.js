// =========================================================================
// Fill these in from your Supabase project:
// Dashboard -> Project Settings -> API -> "Project URL" and "anon public" key
// The anon key is safe to expose in client-side code — it only works
// within the permissions granted by your Row Level Security policies.
// =========================================================================
const SUPABASE_URL = "https://bnafywfqbpibagqnbtwm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuYWZ5d2ZxYnBpYmFncW5idHdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyOTYxODcsImV4cCI6MjA4OTg3MjE4N30.TeabzauWueLvCinVWcG0_UP5lUx1V5gBo9Av7fJhPLI";

// PayPal client ID (from developer.paypal.com -> My Apps & Credentials)
// Use a Sandbox client ID while testing, then swap to your Live one at launch.
const PAYPAL_CLIENT_ID = "YOUR_PAYPAL_CLIENT_ID";

// Prices must match what's described in supabase-schema.sql / your pricing page
const PLAN_PRICES = {
  "Starter Care": 10.00,
  "Monthly Support": 30.00,
  "Business Care": 80.00
};
