const DICT = {
  en: {
    nav_home: "Home", nav_services: "Services", nav_gallery: "Gallery", nav_about: "About",
    nav_book: "Book", nav_manage: "Manage Appointment", nav_contact: "Contact",
    hero_title: "Luxe Nail Studio",
    hero_subtitle: "Precise, elegant nail care in a calm, welcoming studio.",
    book_cta: "Book an Appointment",
    featured_services: "Featured Services",
    recent_work: "Recent Work",
    hours: "Hours",
    testimonials: "What clients say",
    step_service: "Choose a service",
    step_datetime: "Choose a date & time",
    step_details: "Your details",
    step_review: "Review & confirm",
    name: "Full name",
    phone: "Phone number",
    email_optional: "Email (optional)",
    preferred_language: "Preferred language",
    notes: "Additional notes",
    inspiration_photo: "Inspiration photo (optional)",
    agree_policies: "I agree to the salon policies",
    submit_request: "Request appointment",
    pending_notice: "Your request has been received and is pending approval.",
    reference_label: "Your reference number",
    back: "Back", continue_label: "Continue",
    manage_title: "Manage My Appointment",
    lookup_prompt: "Enter your reference number and phone number",
    reference_number: "Reference number",
    lookup_submit: "Find my appointment",
    verify_prompt: "Enter the verification code we sent you",
    verify_code: "Verification code",
    verify_submit: "Verify",
    cancel_button: "Cancel appointment",
    chat_button: "Message the salon",
    status_pending: "Pending", status_accepted: "Accepted", status_rejected: "Rejected",
    status_confirmed: "Confirmed", status_cancelled_by_client: "Cancelled by you",
    status_cancelled_by_salon: "Cancelled by salon", status_completed: "Completed",
    status_no_show: "No-show", status_reschedule_requested: "Reschedule requested",
    contact_send: "Send message", contact_sent: "Thanks — we'll be in touch soon.",
    contact_error: "Something went wrong. Please try again or call us directly.",
    policies_title: "Salon Policies", about_title: "About Luxe Nail Studio",
    from_price: "From",
    tagline_pill: "By Appointment Only",
    welcome_label: "Welcome", about_label: "About Us", why_label: "Why Choose Us",
    services_label: "Services", gallery_label: "Gallery", testimonials_label: "Testimonials", book_label: "Book a Visit",
    why_title: "Manicure & Pedicure Specialists",
    why_subtitle: "Every service is built around precision, cleanliness, and a calm, unhurried pace.",
    feat_mani_title: "Signature Manicure", feat_mani_body: "Shaping, cuticle care, and a flawless polish finish, hands-on and unhurried.",
    feat_pedi_title: "Spa Pedicure", feat_pedi_body: "A relaxing soak, exfoliation, and massage finished with your choice of polish.",
    feat_clean_title: "Hospital-Grade Sanitation", feat_clean_body: "Every tool sterilized or single-use, every station cleaned between clients.",
    feat_art_title: "Custom Nail Art", feat_art_body: "Hand-painted designs, from minimalist to bold, added to any service.",
    cta_title: "Book Your Visit Now", cta_subtitle: "Your journey to beautiful nails begins here.",
  },
  fr: {
    nav_home: "Accueil", nav_services: "Services", nav_gallery: "Galerie", nav_about: "À propos",
    nav_book: "Réserver", nav_manage: "Gérer mon rendez-vous", nav_contact: "Contact",
    hero_title: "Luxe Nail Studio",
    hero_subtitle: "Un soin des ongles précis et élégant dans un studio calme et accueillant.",
    book_cta: "Réserver un rendez-vous",
    featured_services: "Services vedettes",
    recent_work: "Réalisations récentes",
    hours: "Heures d'ouverture",
    testimonials: "Avis de nos clientes",
    step_service: "Choisir un service",
    step_datetime: "Choisir une date et une heure",
    step_details: "Vos coordonnées",
    step_review: "Vérifier et confirmer",
    name: "Nom complet",
    phone: "Numéro de téléphone",
    email_optional: "Courriel (facultatif)",
    preferred_language: "Langue préférée",
    notes: "Notes supplémentaires",
    inspiration_photo: "Photo d'inspiration (facultatif)",
    agree_policies: "J'accepte les politiques du salon",
    submit_request: "Demander un rendez-vous",
    pending_notice: "Votre demande a été reçue et est en attente d'approbation.",
    reference_label: "Votre numéro de référence",
    back: "Retour", continue_label: "Continuer",
    manage_title: "Gérer mon rendez-vous",
    lookup_prompt: "Entrez votre numéro de référence et votre numéro de téléphone",
    reference_number: "Numéro de référence",
    lookup_submit: "Trouver mon rendez-vous",
    verify_prompt: "Entrez le code de vérification que nous vous avons envoyé",
    verify_code: "Code de vérification",
    verify_submit: "Vérifier",
    cancel_button: "Annuler le rendez-vous",
    chat_button: "Écrire au salon",
    status_pending: "En attente", status_accepted: "Acceptée", status_rejected: "Refusée",
    status_confirmed: "Confirmé", status_cancelled_by_client: "Annulé par vous",
    status_cancelled_by_salon: "Annulé par le salon", status_completed: "Terminé",
    status_no_show: "Absence", status_reschedule_requested: "Changement demandé",
    contact_send: "Envoyer", contact_sent: "Merci — nous vous répondrons bientôt.",
    contact_error: "Une erreur est survenue. Réessayez ou appelez-nous directement.",
    policies_title: "Politiques du salon", about_title: "À propos de Luxe Nail Studio",
    from_price: "À partir de",
    tagline_pill: "Sur rendez-vous uniquement",
    welcome_label: "Bienvenue", about_label: "À propos", why_label: "Pourquoi nous choisir",
    services_label: "Services", gallery_label: "Galerie", testimonials_label: "Témoignages", book_label: "Réserver",
    why_title: "Spécialistes en manucure et pédicure",
    why_subtitle: "Chaque service est pensé pour la précision, la propreté et un rythme calme, sans précipitation.",
    feat_mani_title: "Manucure signature", feat_mani_body: "Mise en forme, soin des cuticules et un fini de vernis impeccable, avec soin et sans hâte.",
    feat_pedi_title: "Pédicure spa", feat_pedi_body: "Un bain relaxant, une exfoliation et un massage, complétés par le vernis de votre choix.",
    feat_clean_title: "Hygiène de niveau hospitalier", feat_clean_body: "Chaque outil est stérilisé ou à usage unique, chaque poste désinfecté entre les clientes.",
    feat_art_title: "Nail art personnalisé", feat_art_body: "Motifs peints à la main, du minimaliste à l'audacieux, ajoutés à tout service.",
    cta_title: "Réservez votre visite maintenant", cta_subtitle: "Votre parcours vers de beaux ongles commence ici.",
  },
};

function getLang() {
  return localStorage.getItem("smn_lang") || "fr";
}

function setLang(lang) {
  localStorage.setItem("smn_lang", lang);
  location.reload();
}

function t(key) {
  const lang = getLang();
  return (DICT[lang] && DICT[lang][key]) || DICT.en[key] || key;
}

// Applies translations to any element with data-i18n="key" in its DOM,
// and updates <html lang="">. Call after the page's own content loads.
function applyTranslations() {
  document.documentElement.lang = getLang();
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
}
