/* =========================================================================
   Chemin Serein — DEMO MOCK BACKEND
   -------------------------------------------------------------------------
   This file completely replaces Supabase for the portfolio demo. There is
   no real database, no real network calls, no real credentials anywhere.
   Everything lives in this file and in the browser's sessionStorage, which
   means: it behaves like a real, working backend while you click around,
   but resets to a clean state the moment you open a new tab/visit.

   Two things get intercepted:
     1. window.supabase.createClient(...) — used by most pages via the
        supabase-js library pattern (sb.from(), sb.rpc(), sb.auth, etc.)
     2. window.fetch(...) — a few pages (booking.html, livechat.js, the
        contact/application forms) talk to Supabase's REST API directly
        with fetch() instead of going through the library. Both paths
        share the exact same fake data, so everything stays consistent
        with itself no matter which page you're on.
   ========================================================================= */
(function () {
  "use strict";

  // ======================================================================
  // 0. Small utilities
  // ======================================================================
  function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0, v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  function nowISO() { return new Date().toISOString(); }
  function daysFromNow(n) {
    var d = new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  }
  function clone(x) { return JSON.parse(JSON.stringify(x)); }

  // ======================================================================
  // 1. Seed data — realistic fake content for every table in the app
  // ======================================================================
  function buildSeed() {
    var staff1 = uuid(), staff2 = uuid(), admin1 = uuid(), family1 = uuid();
    var coord1 = uuid(), coord2 = uuid();
    var slot1 = uuid(), slot2 = uuid(), slot3 = uuid();
    var conv1 = uuid();
    var inv1 = uuid();

    return {
      profiles: [
        { id: admin1, full_name: "Sophie Tremblay", role: "admin", email: "sophie@demo.local", created_at: daysFromNow(-200), can_manage_intake: true, can_manage_finances: true, can_manage_reviews: true, can_manage_staff: true, _demo_password: "demo123" },
        { id: staff1, full_name: "Marc-André Roy", role: "staff", email: "marc@demo.local", created_at: daysFromNow(-150), can_manage_intake: true, can_manage_finances: false, can_manage_reviews: false, can_manage_staff: false, _demo_password: "demo123" },
        { id: staff2, full_name: "Isabelle Côté", role: "photographer", email: "isabelle@demo.local", created_at: daysFromNow(-90), can_manage_intake: false, can_manage_finances: false, can_manage_reviews: false, can_manage_staff: false, _demo_password: "demo123" },
        { id: family1, full_name: "Julie Bernard", role: "family", email: "julie.bernard@example.com", created_at: daysFromNow(-3), can_manage_intake: false, can_manage_finances: false, can_manage_reviews: false, can_manage_staff: false, _demo_password: "demo1234" }
      ],
      contact_submissions: [
        { id: uuid(), created_at: daysFromNow(-2), name: "Julie Bernard", phone: "514-555-0142", email: "julie.bernard@example.com", preferred: "Téléphone", consultation_date: daysFromNow(5), message: "Bonjour, mon père est décédé hier soir. Nous aimerions parler à quelqu'un dès que possible.", lang: "fr", status: "new", assigned_to: null, staff_notes: null, updated_at: daysFromNow(-2) },
        { id: uuid(), created_at: daysFromNow(-5), name: "Robert Chen", phone: "514-555-0198", email: "robert.chen@example.com", preferred: "Email", consultation_date: null, message: "Looking for information about pre-arrangement options for myself.", lang: "en", status: "contacted", assigned_to: staff1, staff_notes: "Called back, booking consultation for next week.", updated_at: daysFromNow(-1) },
        { id: uuid(), created_at: daysFromNow(-8), name: "Nathalie Gagnon", phone: "514-555-0117", email: "nathalie.g@example.com", preferred: "Téléphone", consultation_date: daysFromNow(-3), message: "Merci pour votre accompagnement, tout s'est bien déroulé.", lang: "fr", status: "closed", assigned_to: staff1, staff_notes: "Dossier complété avec succès.", updated_at: daysFromNow(-3) }
      ],
      coordination_files: [
        { id: coord1, created_at: daysFromNow(-4), updated_at: daysFromNow(-1), family_name: "Famille Bernard", primary_contact: "Julie Bernard", phone: "514-555-0142", email: "julie.bernard@example.com", package_key: "serenite", status: "active", source_submission: null, intake: { contact_name: "Julie Bernard", contact_email: "julie.bernard@example.com", contact_phone: "514-555-0142", contact_language: "fr", relationship: "Fille", deceased_name: "Henri Bernard", burial_or_cremation: "inhumation", religion: "chretienne" }, intake_notes: {}, intake_progress: { contact: true, deceased: true }, portal_user_id: family1, portal_email: "julie.bernard@example.com", portal_created_at: daysFromNow(-3), assigned_to: staff1 },
        { id: coord2, created_at: daysFromNow(-20), updated_at: daysFromNow(-15), family_name: "Famille Gagnon", primary_contact: "Nathalie Gagnon", phone: "514-555-0117", email: "nathalie.g@example.com", package_key: "heritage", status: "active", source_submission: null, intake: { contact_name: "Nathalie Gagnon", contact_email: "nathalie.g@example.com", contact_phone: "514-555-0117", contact_language: "fr" }, intake_notes: {}, intake_progress: { contact: true }, portal_user_id: null, portal_email: null, portal_created_at: null, assigned_to: staff1 }
      ],
      package_templates: [
        { id: uuid(), package_key: "essentiel", position: 1, task_fr: "Confirmer les coordonnées de la famille", task_en: "Confirm family contact details", created_at: daysFromNow(-300) },
        { id: uuid(), package_key: "essentiel", position: 2, task_fr: "Envoyer la liste de vérification", task_en: "Send the checklist", created_at: daysFromNow(-300) },
        { id: uuid(), package_key: "serenite", position: 1, task_fr: "Confirmer les coordonnées de la famille", task_en: "Confirm family contact details", created_at: daysFromNow(-300) },
        { id: uuid(), package_key: "serenite", position: 2, task_fr: "Coordonner avec la maison funéraire", task_en: "Coordinate with the funeral home", created_at: daysFromNow(-300) },
        { id: uuid(), package_key: "heritage", position: 1, task_fr: "Confirmer les coordonnées de la famille", task_en: "Confirm family contact details", created_at: daysFromNow(-300) },
        { id: uuid(), package_key: "heritage", position: 2, task_fr: "Planifier le montage vidéo", task_en: "Plan the video montage", created_at: daysFromNow(-300) }
      ],
      jobs: [
        { id: uuid(), created_at: daysFromNow(-3), updated_at: daysFromNow(-3), job_type: "photographer", title: "Cérémonie — Famille Bernard", family_name: "Famille Bernard", job_date: daysFromNow(6), job_time: "14:00", location: "Complexe funéraire St-Laurent", details: "Cérémonie familiale privée, discrétion demandée.", pay_amount: 250, cook_list: null, food_budget: null, status: "open", assigned_to: null, assigned_name: null, source_submission: null, package_key: "serenite", coordination_id: coord1 },
        { id: uuid(), created_at: daysFromNow(-18), updated_at: daysFromNow(-16), job_type: "caterer", title: "Réception — Famille Gagnon", family_name: "Famille Gagnon", job_date: daysFromNow(-14), job_time: "16:00", location: "Salle communautaire Rosemont", details: "Réception pour environ 40 personnes.", pay_amount: 600, cook_list: "Sandwichs, café, desserts", food_budget: 400, status: "done", assigned_to: staff2, assigned_name: "Isabelle Côté", source_submission: null, package_key: "heritage", coordination_id: coord2 }
      ],
      job_checklist_items: [],
      applications: [
        { id: uuid(), created_at: daysFromNow(-6), full_name: "Marc Dubois", email: "marc.dubois@example.com", phone: "514-555-0177", role_wanted: "photographer", experience: "5 ans de photographie événementielle, incluant des cérémonies commémoratives.", portfolio: null, status: "pending", notes: null, ig_handle: "marcdubois_photo", fb_handle: null, tt_handle: null },
        { id: uuid(), created_at: daysFromNow(-12), full_name: "Christine Wong", email: "christine.w@example.com", phone: "514-555-0133", role_wanted: "driver", experience: "10 ans d'expérience comme chauffeur professionnel.", portfolio: null, status: "pending", notes: null, ig_handle: null, fb_handle: null, tt_handle: null }
      ],
      archive: [],
      board_cards: [
        { id: uuid(), created_at: daysFromNow(-10), updated_at: daysFromNow(-10), column_key: "todo", position: 1, body: "Renouveler l'entente avec le fleuriste partenaire", color: "#f2e6c9", created_by: "Sophie Tremblay" },
        { id: uuid(), created_at: daysFromNow(-5), updated_at: daysFromNow(-5), column_key: "doing", position: 1, body: "Mettre à jour la liste des maisons funéraires partenaires", color: "#d9e8d8", created_by: "Marc-André Roy" }
      ],
      notes: [],
      invoices: [
        { id: inv1, created_at: daysFromNow(-3), updated_at: daysFromNow(-3), invoice_number: "CS-2026-0001", coordination_id: coord1, client_name: "Julie Bernard", client_email: "julie.bernard@example.com", issue_date: daysFromNow(-3), due_date: daysFromNow(11), status: "sent", apply_gst: true, apply_qst: true, gst_rate: 5.0, qst_rate: 9.975, notes: null, created_by: "Sophie Tremblay" }
      ],
      invoice_items: [
        { id: uuid(), invoice_id: inv1, position: 1, description: "Forfait Sérénité — coordination complète", quantity: 1, unit_price: 1350 },
        { id: uuid(), invoice_id: inv1, position: 2, description: "Coordination florale additionnelle", quantity: 1, unit_price: 120 }
      ],
      payments: [],
      family_documents: [
        { id: uuid(), created_at: daysFromNow(-2), coordination_id: coord1, doc_type: "certificate", label: "Certificat de décès", drive_url: "#", added_by: "Marc-André Roy" }
      ],
      reviews: [
        { id: uuid(), created_at: daysFromNow(-25), author_name: null, rating: 5, body: "Une équipe d'une gentillesse remarquable dans un moment très difficile. Tout a été pris en charge avec soin.", status: "approved", lang: "fr", reviewer_name: "Famille Leclerc", email: null, known_contact: true, reply: "Merci beaucoup pour votre confiance, ce fut un honneur de vous accompagner." },
        { id: uuid(), created_at: daysFromNow(-40), author_name: null, rating: 5, body: "Professional, warm, and incredibly organized. They handled everything so we could focus on grieving as a family.", status: "approved", lang: "en", reviewer_name: "The Andersons", email: null, known_contact: true, reply: null },
        { id: uuid(), created_at: daysFromNow(-1), author_name: null, rating: 4, body: "Très bon service, quelques délais de communication mais dans l'ensemble une belle expérience.", status: "pending", lang: "fr", reviewer_name: "M. Simard", email: "simard@example.com", known_contact: false, reply: null }
      ],
      booking_slots: [
        { id: slot1, slot_date: daysFromNow(2), start_time: "09:00", end_time: "09:30", status: "open", created_by: admin1, created_at: daysFromNow(-10), staff_id: staff1 },
        { id: slot2, slot_date: daysFromNow(2), start_time: "10:00", end_time: "10:30", status: "open", created_by: admin1, created_at: daysFromNow(-10), staff_id: staff1 },
        { id: slot3, slot_date: daysFromNow(3), start_time: "13:00", end_time: "13:30", status: "open", created_by: admin1, created_at: daysFromNow(-10), staff_id: staff1 }
      ],
      booking_requests: [],
      family_timeline_events: [
        { id: uuid(), coordination_id: coord1, label: "Consultation initiale complétée", status: "done", event_date: daysFromNow(-3), position: 1, created_at: daysFromNow(-3), updated_at: daysFromNow(-3) },
        { id: uuid(), coordination_id: coord1, label: "Coordination avec la maison funéraire", status: "in_progress", event_date: null, position: 2, created_at: daysFromNow(-2), updated_at: daysFromNow(-1) },
        { id: uuid(), coordination_id: coord1, label: "Cérémonie", status: "pending", event_date: daysFromNow(6), position: 3, created_at: daysFromNow(-2), updated_at: daysFromNow(-2) }
      ],
      family_messages: [
        { id: uuid(), coordination_id: coord1, sender_role: "staff", sender_name: "Marc-André Roy", body: "Bonjour Julie, je vous confirme que la cérémonie est prévue pour le " + daysFromNow(6) + " à 14h.", created_at: daysFromNow(-1), read_by_staff: true, read_by_family: true },
        { id: uuid(), coordination_id: coord1, sender_role: "family", sender_name: null, body: "Merci beaucoup, est-ce que le fleuriste est confirmé aussi ?", created_at: daysFromNow(0), read_by_staff: false, read_by_family: true }
      ],
      family_uploads: [],
      chat_conversations: [
        { id: conv1, visitor_name: "Visiteur", page_url: "index.html", status: "closed", created_at: daysFromNow(-1), last_message_at: daysFromNow(-1) }
      ],
      chat_messages: [
        { id: uuid(), conversation_id: conv1, sender_type: "visitor", sender_name: "Visiteur", body: "Combien ça coûte ?", created_at: daysFromNow(-1), read_by_staff: true },
        { id: uuid(), conversation_id: conv1, sender_type: "auto", sender_name: null, body: "Les coûts varient selon le type de service et les options choisies. Réservez un moment gratuit ici : booking.html", created_at: daysFromNow(-1), read_by_staff: true }
      ],
      chat_keyword_responses: [
        { id: uuid(), keywords: "combien de temps dure,durée de la consultation,how long does,how long is,consultation length,consultation take", response_fr: "Une consultation dure généralement de 30 à 45 minutes, mais nous prenons le temps nécessaire selon votre situation — rien n'est précipité.", response_en: "A consultation typically lasts 30 to 45 minutes, but we take whatever time is needed based on your situation — nothing is rushed.", active: true, position: -1, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "urgent,urgence,vient de mourir,just passed,just died,emergency,décès,died", response_fr: "Nous sommes vraiment désolés pour votre perte. Nous sommes là pour vous aider dès maintenant — appelez-nous au +1 (514) 000-0000, ou laissez-nous un message ici et un membre de notre équipe vous répondra rapidement.", response_en: "We're so sorry for your loss. We're here to help right now — call us at +1 (514) 000-0000, or leave a message here and a member of our team will respond quickly.", active: true, position: 0, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "bonjour,allo,salut,hello,hi,hey,bonsoir", response_fr: "Bonjour, merci de nous écrire. Comment pouvons-nous vous aider aujourd'hui ?", response_en: "Hello, thank you for reaching out. How can we help you today?", active: true, position: 1, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "heures,horaire,ouvert,disponible,hours,when open,availability", response_fr: "Nous sommes disponibles pour les urgences en tout temps. Pour une question générale, notre équipe vous répond habituellement dans la journée.", response_en: "We're available for urgent situations at any time. For general questions, our team usually responds within the day.", active: true, position: 2, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "prix,coût,combien ça coûte,combien coûte,combien coûtent,tarif,cher,price,cost,how much,fees", response_fr: "Les coûts varient selon le type de service et les options choisies. Nous établissons une estimation claire dès la première consultation, sans surprise. Réservez un moment gratuit ici : booking.html", response_en: "Costs vary depending on the service and the options chosen. We put together a clear estimate at your very first consultation, no surprises. Book a free time here: booking.html", active: true, position: 3, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "rendez-vous,consultation,réserver,booking,appointment,book,schedule a,meet with", response_fr: "Vous pouvez réserver une consultation gratuite directement ici : booking.html — choisissez simplement un moment qui vous convient.", response_en: "You can book a free consultation directly here: booking.html — just pick a time that works for you.", active: true, position: 4, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "crémation,cremation,incinér", response_fr: "Le choix entre crémation et inhumation dépend des volontés de votre proche, de vos convictions et de votre budget. Nous pouvons vous expliquer ce qu'implique chaque option.", response_en: "Choosing cremation depends on the wishes of your loved one, your beliefs, and your budget. We can walk you through what it involves.", active: true, position: 5, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "inhumation,enterrement,burial,cemetery,cimetière", response_fr: "L'inhumation reste un choix courant et significatif pour bien des familles. Nous pouvons vous accompagner dans le choix d'un cimetière et d'une concession.", response_en: "Burial remains a meaningful choice for many families. We can help you choose a cemetery and a plot.", active: true, position: 6, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "documents,papiers,certificat,paperwork,what do i need,id", response_fr: "Généralement : une pièce d'identité, le numéro d'assurance sociale, la carte d'assurance maladie et le certificat de naissance du défunt. Nous vous fournissons une liste complète et personnalisée dès le début.", response_en: "Generally: ID, social insurance number, health card, and birth certificate for the person who passed. We give you a complete, personalized checklist once we begin.", active: true, position: 7, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "hors québec,outside quebec,autre province,another province,rapatriement,repatriation,died abroad,étranger", response_fr: "Oui, nous pouvons coordonner le rapatriement et les démarches nécessaires, peu importe où le décès est survenu.", response_en: "Yes, we can coordinate repatriation and the necessary paperwork no matter where the death occurred.", active: true, position: 8, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "où,localisation,région,montréal,secteur,where are you,area,location,service area", response_fr: "Nous desservons les familles du Grand Montréal et de ses environs.", response_en: "We serve families across Greater Montréal and the surrounding area.", active: true, position: 9, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "téléphone,numéro,appeler,phone,call you,call us", response_fr: "Vous pouvez nous appeler directement au +1 (514) 000-0000.", response_en: "You can call us directly at +1 (514) 000-0000.", active: true, position: 10, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "courriel,email,e-mail", response_fr: "Vous pouvez nous écrire à info@cheminserein.ca", response_en: "You can reach us by email at info@cheminserein.ca", active: true, position: 11, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "deuil,soutien,grief,support,triste,difficile,sad,struggling,j'ai perdu,je pleure,je suis dévasté,je suis dévastée,dévastée,dévasté,brisé,brisée,coeur brisé,cœur brisé,i lost my,i'm devastated,i'm crying,heartbroken,broken hearted,grieving,my heart is broken,this is so hard,ça fait mal,j'ai mal", response_fr: "Je suis vraiment désolé pour ce que vous traversez. Prenez tout le temps dont vous avez besoin — nous sommes là pour vous accompagner, à votre rythme. Des ressources de soutien au deuil, gratuites et confidentielles, sont aussi disponibles sur notre page Ressources, notamment Info-Social 811, accessible 24 h/24.", response_en: "I'm truly sorry for what you're going through. Take all the time you need — we're here to support you, at your own pace. Free, confidential grief support resources are also available on our Resources page, including Info-Social 811, available 24/7.", active: true, position: 12, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "pré-arrangement,prearrangement,préplanifier,plan ahead,advance,planifier à l'avance,plan my own", response_fr: "Oui, il est tout à fait possible de planifier — et même de payer — vos arrangements funéraires à l'avance. Contactez-nous pour en discuter sans engagement.", response_en: "Yes, you can absolutely plan — and even pay for — your own funeral arrangements in advance. Contact us to talk it through, no obligation.", active: true, position: 13, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "paiement,facture,payer,solde,payment,invoice,pay,balance", response_fr: "Les familles avec un dossier actif peuvent consulter leur facture et le solde dû directement dans leur Portail famille.", response_en: "Families with an active file can view their invoice and balance due directly in their Family Portal.", active: true, position: 14, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "emploi,carrière,travailler avec vous,postuler,job,career,work with you,apply,hiring", response_fr: "Nous recrutons des coordonnateurs, photographes, traiteurs, chauffeurs et musiciens. Visitez notre page Carrières pour postuler.", response_en: "We're recruiting coordinators, photographers, caterers, drivers, and musicians. Visit our Careers page to apply.", active: true, position: 15, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "maison funéraire,partenaire,funeral home,partner,already have a funeral home", response_fr: "Nous travaillons avec un réseau de maisons funéraires partenaires soigneusement sélectionnées. Si vous en avez déjà une en tête, nous pouvons aussi coordonner directement avec elle.", response_en: "We work with a network of carefully selected partner funeral homes. If you already have one in mind, we're also happy to coordinate directly with them.", active: true, position: 16, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "assurance,insurance,life insurance,claim", response_fr: "Nous pouvons vous aider à repérer les polices d'assurance vie et à entamer une réclamation. Notre page Ressources contient une liste de vérification complète pour les assurances.", response_en: "We can help you locate life insurance policies and start a claim. Our Resources page has a full insurance checklist.", active: true, position: 17, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "rrq,rente,pension,retraite québec,cpp,pension plan", response_fr: "Une prestation de décès du Régime de rentes du Québec (jusqu'à 2 500 $) pourrait être disponible, ainsi que d'autres rentes selon votre situation. Plus de détails sur notre page Ressources.", response_en: "A Québec Pension Plan death benefit (up to $2,500) may be available, along with other pensions depending on your situation. More details on our Resources page.", active: true, position: 18, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "services,qu'est-ce que vous offrez,what do you offer,what services", response_fr: "Nous offrons un accompagnement complet, de la première consultation jusqu'au suivi après les funérailles. Voir notre page Services pour tous les détails.", response_en: "We offer full support from the first consultation through post-funeral follow-up. See our Services page for all the details.", active: true, position: 19, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "forfait,formule,package,packages,bundle", response_fr: "Nous proposons plusieurs forfaits selon vos besoins et votre budget. Consultez notre page Forfaits pour les comparer.", response_en: "We offer several packages depending on your needs and budget. Check out our Packages page to compare them.", active: true, position: 20, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "avis,témoignage,review,reviews,testimonial,recommend", response_fr: "Vous pouvez consulter les avis d'autres familles que nous avons accompagnées sur notre page Avis.", response_en: "You can read what other families we've supported have said on our Reviews page.", active: true, position: 21, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "merci,thank you,thanks,merci beaucoup", response_fr: "Avec plaisir. N'hésitez pas à nous écrire si vous avez d'autres questions.", response_en: "You're very welcome. Feel free to reach out anytime with more questions.", active: true, position: 22, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "parler à quelqu'un,parler avec quelqu'un,parler à une personne,personne réelle,vraie personne,humain,speak to someone,speak with someone,talk to someone,talk with someone,talk to a human,talk with a human,real person,human agent,can i speak,can i talk,puis-je parler", response_fr: "Bien sûr — un membre de notre équipe peut vous répondre directement ici, ou vous pouvez nous appeler au +1 (514) 000-0000.", response_en: "Of course — a member of our team can respond to you directly right here, or you can call us at +1 (514) 000-0000.", active: true, position: 23, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "faq,questions fréquentes,frequently asked,common questions", response_fr: "Consultez notre page FAQ pour les réponses aux questions les plus courantes.", response_en: "Check out our FAQ page for answers to the most common questions.", active: true, position: 24, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "que faire,quoi faire,what to do,first steps,where do i start,où commencer", response_fr: "Prenez le temps qu'il vous faut — au Québec, il n'y a pas de délai légal strict pour organiser des funérailles. Notre page Ressources explique clairement les premières étapes.", response_en: "Take the time you need — in Quebec, there's no strict legal deadline to hold a funeral. Our Resources page walks through the first steps clearly.", active: true, position: 25, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "coordonnateur,coordinator,who will help me,mon dossier,my file", response_fr: "Chaque famille est accompagnée par un coordonnateur dédié tout au long du processus. Vous pouvez suivre l'échéancier et communiquer avec votre coordonnateur directement dans votre Portail famille.", response_en: "Each family is supported by a dedicated coordinator throughout the process. You can follow your timeline and message your coordinator directly in your Family Portal.", active: true, position: 26, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "photographe,photographer,photos", response_fr: "Sur demande, nous pouvons organiser un(e) photographe pour capturer la cérémonie avec discrétion et respect.", response_en: "On request, we can arrange a photographer to capture the ceremony with discretion and respect.", active: true, position: 27, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "traiteur,réception,caterer,catering,reception", response_fr: "Nous pouvons coordonner un traiteur pour la réception suivant la cérémonie, adapté à vos préférences et traditions.", response_en: "We can coordinate a caterer for the reception following the ceremony, tailored to your preferences and traditions.", active: true, position: 28, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "portail,mon compte,login,portal,my account,sign in", response_fr: "Le Portail famille vous permet de suivre l'échéancier, consulter les documents et la facture. Vous pouvez y accéder ici : portal.html", response_en: "The Family Portal lets you follow your timeline and view documents and your invoice. You can access it here: portal.html", active: true, position: 29, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "faire moi-même,le faire seul,pas besoin de vous,gratuit,pourquoi vous payer,do it myself,do this myself,why would i use you,why use you,i can do it myself,for free,on my own", response_fr: "Vous avez tout à fait raison : vous pouvez organiser des funérailles vous-même, ce n'est pas obligatoire de passer par nous. Cela dit, la plupart des familles trouvent ça accablant de tout gérer seules en plein deuil — les papiers, les appels aux maisons funéraires, la coordination des fournisseurs, les délais. Notre rôle, c'est de porter cette charge à votre place, pour que vous puissiez vous concentrer sur votre famille plutôt que sur la logistique. La première consultation est gratuite, sans engagement — ça vaut peut-être la peine de voir ce que ça change concrètement.", response_en: "You're absolutely right — you can arrange a funeral entirely on your own, there's no requirement to use us. That said, most families find it overwhelming to manage everything alone while grieving: the paperwork, the calls to funeral homes, coordinating vendors, the deadlines. Our role is to take that off your plate, so you can focus on your family instead of logistics. The first consultation is free with no obligation — might be worth seeing what it actually changes for you.", active: true, position: 30, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "bilingue,langue,anglais,français,parlez-vous,bilingual,language,do you speak,speak english", response_fr: "Oui, notre équipe vous accompagne en français et en anglais, selon votre préférence.", response_en: "Yes, our team supports you in both French and English, whichever you prefer.", active: true, position: 31, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "paiement,carte de crédit,virement,comptant,mode de paiement,credit card,payment method,e-transfer,interac,how do i pay", response_fr: "Nous acceptons plusieurs modes de paiement — nous en discutons ensemble lors de la consultation selon ce qui vous convient le mieux.", response_en: "We accept several payment methods — we'll go over what works best for you during the consultation.", active: true, position: 32, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "dépôt,acompte,deposit,down payment,upfront", response_fr: "Certains arrangements peuvent nécessiter un dépôt, mais cela dépend du service choisi. Nous vous expliquons tout clairement avant toute décision.", response_en: "Some arrangements may require a deposit, but it depends on the service chosen. We explain everything clearly before you commit to anything.", active: true, position: 33, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "processus,étapes,comment ça marche,déroulement,process,steps,how does it work,what happens next", response_fr: "En bref : vous nous contactez (par ici, par téléphone ou en réservant une consultation), nous discutons de vos besoins, puis nous coordonnons tout avec les fournisseurs et la maison funéraire choisie, en vous tenant informés à chaque étape via votre Portail famille.", response_en: "In short: you reach out (here, by phone, or by booking a consultation), we talk through your needs, then we coordinate everything with vendors and the chosen funeral home, keeping you updated at every step through your Family Portal.", active: true, position: 34, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "pas les moyens,ne peux pas payer,aide financière,financial assistance,can't afford,no money,budget serré,low budget", response_fr: "Nous comprenons que le budget est une préoccupation réelle. Parlons-en ensemble — nous pouvons explorer les options qui respectent vos moyens, incluant des programmes d'aide financière possibles.", response_en: "We understand budget is a real concern. Let's talk it through together — we can explore options that fit your means, including possible financial assistance programs.", active: true, position: 35, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "nécrologie,avis de décès,rédiger,obituary,write an obituary,death notice", response_fr: "Nous pouvons vous aider à rédiger la nécrologie, ou vous mettre en contact avec quelqu'un qui peut le faire avec vous.", response_en: "We can help you write the obituary, or connect you with someone who can help put it together.", active: true, position: 36, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "fleurs,fleuriste,flowers,florist", response_fr: "Nous pouvons coordonner les arrangements floraux pour la cérémonie selon vos préférences.", response_en: "We can coordinate floral arrangements for the ceremony based on your preferences.", active: true, position: 37, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "différence,pourquoi pas directement,maison funéraire directement,how are you different,why not just a funeral home,what's the difference", response_fr: "Une maison funéraire s'occupe des soins et de la cérémonie. Nous, nous sommes votre point de contact unique qui coordonne tout — maison funéraire, fournisseurs, documents, échéancier — pour vous éviter d'avoir à gérer plusieurs intervenants seul(e).", response_en: "A funeral home handles the care and the ceremony itself. We're your single point of contact who coordinates everything around it — the funeral home, vendors, paperwork, timeline — so you're not managing several parties on your own.", active: true, position: 38, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "licence,certifié,fiable,légitime,arnaque,licensed,certified,legit,trustworthy,scam,reputable", response_fr: "C'est une question tout à fait légitime à poser. Nous travaillons avec un réseau de maisons funéraires licenciées et établies au Québec — nous serions heureux de répondre à toute question sur notre fonctionnement lors d'un appel.", response_en: "That's a completely fair question to ask. We work with a network of licensed, established funeral homes across Quebec — happy to answer anything about how we operate on a call.", active: true, position: 39, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "vétéran,militaire,ancien combattant,veteran,military,armed forces", response_fr: "D'anciens combattants peuvent avoir droit à des prestations funéraires spécifiques. Parlons-en pour vérifier votre admissibilité.", response_en: "Veterans may be eligible for specific funeral benefits. Let's talk it through to check your eligibility.", active: true, position: 40, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "écologique,vert,inhumation naturelle,green burial,eco-friendly,natural burial,environmentally friendly", response_fr: "Des options plus écologiques existent, comme l'inhumation naturelle. Nous pouvons vous présenter ce qui est disponible dans la région.", response_en: "More eco-friendly options do exist, like natural/green burial. We can walk you through what's available in the area.", active: true, position: 41, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "annuler,changer mon rendez-vous,reschedule,cancel my appointment,change my booking,modifier", response_fr: "Pas de problème. Contactez-nous directement au +1 (514) 000-0000 ou par courriel, et nous ajusterons votre rendez-vous.", response_en: "No problem. Contact us directly at +1 (514) 000-0000 or by email, and we'll adjust your appointment.", active: true, position: 42, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "don d'organes,don de corps,organ donation,body donation,donate organs", response_fr: "C'est une décision personnelle importante, souvent déjà indiquée sur la carte d'assurance maladie ou dans les volontés du défunt. Nous pouvons vous guider sur les démarches à suivre si c'est le cas.", response_en: "That's an important personal decision, often already indicated on the health card or in the deceased's wishes. We can guide you through the next steps if that applies.", active: true, position: 43, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "hors province,autre province canadienne,outside the province,another province,out of province,do you serve other provinces", response_fr: "Notre service principal couvre le Grand Montréal et ses environs, au Québec. Si votre situation implique une autre province, contactez-nous directement — nous pourrons voir ensemble ce qu'il est possible de coordonner pour vous.", response_en: "Our primary service area is Greater Montréal and the surrounding region in Quebec. If your situation involves another province, reach out to us directly — we can look together at what we're able to coordinate for you.", active: true, position: 45, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "limousine,limo,service de transport,transport pour la famille,limousine service,car service,transportation for family", response_fr: "Nous pouvons coordonner le transport pour la famille, incluant une limousine selon la disponibilité de nos fournisseurs partenaires — ce service est notamment inclus dans notre Forfait Héritage. Contactez-nous pour vérifier les options disponibles pour votre situation.", response_en: "We can coordinate transportation for the family, including a limousine depending on availability from our partner providers — this is included in our Legacy Premium package specifically. Contact us to check what's available for your situation.", active: true, position: 46, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "es-tu un robot,êtes-vous un robot,is this a bot,are you a robot,are you real,is this real,human or bot,ai or human,talking to a bot", response_fr: "Je suis un assistant automatisé qui répond aux questions courantes — mais une vraie personne de notre équipe peut prendre le relais en tout temps si vous préférez.", response_en: "I'm an automated assistant that answers common questions — but a real person from our team can step in anytime you'd prefer.", active: true, position: 47, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "qui es-tu,c'est qui,who are you,what's your name,quel est ton nom", response_fr: "Je suis l'assistant de clavardage d'Chemin Serein. Comment puis-je vous aider aujourd'hui ?", response_en: "I'm Chemin Serein's chat assistant. How can I help you today?", active: true, position: 48, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "raconte une blague,dis une blague,tell me a joke,make me laugh,know any jokes", response_fr: "Je suis surtout ici pour répondre à vos questions sur nos services. Puis-je vous aider avec quelque chose en particulier ?", response_en: "I'm mainly here to help with questions about our services. Is there something specific I can help you with?", active: true, position: 49, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "es-tu vivant,tu dors,tu manges,are you alive,do you sleep,do you eat,are you a person", response_fr: "Je suis un programme automatisé, donc pas tout à fait ! Notre équipe, elle, est bien réelle et disponible pour vous aider.", response_en: "I'm an automated program, so not quite! Our team, though, is very real and available to help.", active: true, position: 50, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "quel âge as-tu,how old are you,your age", response_fr: "Je n'ai pas vraiment d'âge — je suis simplement un outil pour répondre à vos questions. Puis-je vous aider avec autre chose ?", response_en: "I don't really have an age — I'm just a tool to help answer your questions. Can I help you with something else?", active: true, position: 51, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "rabais,négocier,réduction,meilleur prix,discount,negotiate,better deal,best price,can you lower", response_fr: "Les tarifs sont discutés directement avec notre équipe selon vos besoins précis. Réservez une consultation gratuite pour en parler : booking.html", response_en: "Pricing is worked out directly with our team based on your specific needs. Book a free consultation to talk it through: booking.html", active: true, position: 52, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "quel temps fait-il,météo,weather,what's the weather,how's the weather", response_fr: "Je ne peux pas vous aider avec ça, mais je suis là pour vos questions sur nos services. Puis-je vous aider avec quelque chose de précis ?", response_en: "I can't help with that one, but I'm here for questions about our services. Can I help you with something specific?", active: true, position: 53, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "es-tu célibataire,tu m'aimes,are you single,do you like me,marry me,flirt", response_fr: "Je suis ici strictement pour vous aider avec vos questions concernant nos services. Comment puis-je vous être utile ?", response_en: "I'm here strictly to help with questions about our services. How can I assist you?", active: true, position: 54, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "sens de la vie,meaning of life,what is the meaning of life,why are we here", response_fr: "C'est une grande question ! Je peux surtout vous aider avec celles liées à nos services de coordination funéraire.", response_en: "That's a big question! I'm mainly able to help with the ones related to our funeral coordination services.", active: true, position: 55, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "ceci fonctionne,ça marche,just testing,is this working,does this work,test test", response_fr: "👋 Oui, ça fonctionne ! N'hésitez pas à poser une vraie question, ou un membre de notre équipe peut vous répondre directement.", response_en: "👋 Yes, this is working! Feel free to ask a real question, or a member of our team can reply to you directly.", active: true, position: 56, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "fuck,fucking,shit,bullshit,asshole,bitch,goddamn,wtf,stfu,tabarnak,tabarnac,câlisse,calisse,criss,crisse,esti,estie,osti,ostie,ciboire,sacrament,câliss", response_fr: "Je comprends que ce moment puisse être difficile. Un membre de notre équipe peut vous parler directement — appelez-nous au +1 (514) 000-0000, ou je peux les avertir pour qu'ils vous répondent ici.", response_en: "I understand this can be a genuinely hard moment. A member of our team can speak with you directly — call us at +1 (514) 000-0000, or I can let them know to reply to you here.", active: true, position: 57, created_at: daysFromNow(-300) },
        { id: uuid(), keywords: "je t'aime,je vous aime,on vous aime,nous vous aimons,je t'adore,je vous adore,on vous adore,i love you,we love you,i adore you,we adore you,love this,love your service,love your site,love you guys,you're amazing,you guys are amazing,you're the best,vous êtes les meilleurs,vous êtes incroyables,love you,t'aime,vous aime", response_fr: "C'est très gentil, merci ! Nous sommes contents de pouvoir vous aider. Comment puis-je vous être utile aujourd'hui ?", response_en: "That's very kind, thank you! We're glad we can help. How can I assist you today?", active: true, position: 58, created_at: daysFromNow(-300) }
      ]
    };
  }

  // ======================================================================
  // 2. Persistent store — sessionStorage-backed, resets on a fresh visit
  // ======================================================================
  var STORE_KEY = "csDemoDB_v5";
  var DB;
  (function loadOrSeed() {
    try {
      var saved = sessionStorage.getItem(STORE_KEY);
      if (saved) { DB = JSON.parse(saved); return; }
    } catch (e) {}
    DB = buildSeed();
  })();
  function persist() {
    try { sessionStorage.setItem(STORE_KEY, JSON.stringify(DB)); } catch (e) {}
  }
  function table(name) {
    if (!DB[name]) DB[name] = [];
    return DB[name];
  }

  // ======================================================================
  // 3. Generic filter/order/limit engine (mimics PostgREST query params)
  // ======================================================================
  function matchesFilter(row, col, op, val) {
    var rv = row[col];
    switch (op) {
      case "eq": return String(rv) === String(val);
      case "neq": return String(rv) !== String(val);
      case "gte": return rv >= val;
      case "lte": return rv >= val ? rv <= val : false;
      case "gt": return rv > val;
      case "lt": return rv < val;
      case "in": return val.indexOf(rv) !== -1;
      case "like":
      case "ilike":
        var pattern = String(val).replace(/%/g, "").toLowerCase();
        return String(rv || "").toLowerCase().indexOf(pattern) !== -1;
      case "is": return val === "null" ? (rv === null || rv === undefined) : String(rv) === String(val);
      default: return true;
    }
  }
  function runFilters(rows, filters) {
    return rows.filter(function (row) {
      return filters.every(function (f) { return matchesFilter(row, f.col, f.op, f.val); });
    });
  }
  function runOrder(rows, orders) {
    if (!orders.length) return rows;
    var out = rows.slice();
    out.sort(function (a, b) {
      for (var i = 0; i < orders.length; i++) {
        var o = orders[i];
        var av = a[o.col], bv = b[o.col];
        if (av === bv) continue;
        var cmp = av > bv ? 1 : -1;
        return o.ascending ? cmp : -cmp;
      }
      return 0;
    });
    return out;
  }

  // ======================================================================
  // 4. Query builder — mimics the chainable, thenable supabase-js API
  // ======================================================================
  function makeQueryBuilder(tableName) {
    var state = { filters: [], orders: [], limitN: null, mode: "select", payload: null, single: false, maybeSingleFlag: false, selectAfterWrite: false };

    var qb = {
      select: function () { state.selectAfterWrite = true; if (state.mode === "select0") state.mode = "select"; return qb; },
      eq: function (c, v) { state.filters.push({ col: c, op: "eq", val: v }); return qb; },
      neq: function (c, v) { state.filters.push({ col: c, op: "neq", val: v }); return qb; },
      gte: function (c, v) { state.filters.push({ col: c, op: "gte", val: v }); return qb; },
      lte: function (c, v) { state.filters.push({ col: c, op: "lte", val: v }); return qb; },
      gt: function (c, v) { state.filters.push({ col: c, op: "gt", val: v }); return qb; },
      lt: function (c, v) { state.filters.push({ col: c, op: "lt", val: v }); return qb; },
      in: function (c, v) { state.filters.push({ col: c, op: "in", val: v }); return qb; },
      like: function (c, v) { state.filters.push({ col: c, op: "like", val: v }); return qb; },
      ilike: function (c, v) { state.filters.push({ col: c, op: "ilike", val: v }); return qb; },
      is: function (c, v) { state.filters.push({ col: c, op: "is", val: v }); return qb; },
      order: function (c, opts) { state.orders.push({ col: c, ascending: !opts || opts.ascending !== false }); return qb; },
      limit: function (n) { state.limitN = n; return qb; },
      single: function () { state.single = true; return qb; },
      maybeSingle: function () { state.single = true; state.maybeSingleFlag = true; return qb; },
      insert: function (payload) { state.mode = "insert"; state.payload = payload; return qb; },
      update: function (payload) { state.mode = "update"; state.payload = payload; return qb; },
      delete: function () { state.mode = "delete"; return qb; },
      upsert: function (payload) { state.mode = "upsert"; state.payload = payload; return qb; },

      then: function (resolve, reject) {
        var result;
        try { result = execute(); } catch (err) { result = { data: null, error: { message: String(err && err.message || err) } }; }
        return Promise.resolve(result).then(resolve, reject);
      },
      catch: function (fn) { return this.then(undefined, fn); }
    };

    function execute() {
      var rows = table(tableName);

      if (state.mode === "insert" || state.mode === "upsert") {
        var toInsert = Array.isArray(state.payload) ? state.payload : [state.payload];
        var inserted = toInsert.map(function (row) {
          var full = Object.assign({ id: uuid(), created_at: nowISO() }, row);
          rows.push(full);
          return full;
        });
        persist();
        var data = state.selectAfterWrite ? (state.single ? inserted[0] : inserted) : null;
        return { data: data, error: null };
      }

      if (state.mode === "update") {
        var matched = runFilters(rows, state.filters);
        matched.forEach(function (row) { Object.assign(row, state.payload); });
        persist();
        var udata = state.selectAfterWrite ? (state.single ? matched[0] : matched) : null;
        return { data: udata, error: null };
      }

      if (state.mode === "delete") {
        var toDelete = runFilters(rows, state.filters);
        var deleteIds = toDelete.map(function (r) { return r.id; });
        DB[tableName] = rows.filter(function (r) { return deleteIds.indexOf(r.id) === -1; });
        persist();
        return { data: null, error: null };
      }

      // select
      var result = runFilters(rows, state.filters);
      result = runOrder(result, state.orders);
      if (state.limitN != null) result = result.slice(0, state.limitN);
      // never leak the fake password field
      result = result.map(function (r) {
        if (r && r._demo_password !== undefined) {
          var copy = Object.assign({}, r);
          delete copy._demo_password;
          return copy;
        }
        return r;
      });
      if (state.single) {
        if (!result.length) {
          return state.maybeSingleFlag ? { data: null, error: null } : { data: null, error: { message: "No rows found" } };
        }
        return { data: result[0], error: null };
      }
      return { data: result, error: null };
    }

    return qb;
  }

  // ======================================================================
  // 5. RPC implementations — real logic, matching what the actual
  //    Postgres functions do, just written in JS against the fake tables
  // ======================================================================
  function shortRef() {
    var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var s = "";
    for (var i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
  }

  var RPCS = {
    request_booking: function (p) {
      var slots = table("booking_slots");
      var slot = slots.find(function (s) { return s.slot_date === p.p_slot_date && s.start_time === p.p_start_time && s.status === "open"; });
      if (!slot) return { success: false, error: "slot_unavailable" };
      slot.status = "booked";
      var ref = shortRef();
      var reqRow = { id: uuid(), slot_id: slot.id, family_name: p.p_name, phone: p.p_phone, email: p.p_email, reason: p.p_reason, status: "pending", created_at: nowISO(), confirmed_by: null, confirmed_at: null, reference_code: ref };
      table("booking_requests").push(reqRow);
      persist();
      return { success: true, request_id: reqRow.id, reference_code: ref };
    },
    find_booking: function (p) {
      var reqs = table("booking_requests");
      var req = reqs.find(function (r) { return String(r.reference_code).toUpperCase() === String(p.p_reference_code).trim().toUpperCase() && String(r.phone).replace(/\D/g, "") === String(p.p_phone).replace(/\D/g, ""); });
      if (!req) return { success: false, error: "not_found" };
      var slot = table("booking_slots").find(function (s) { return s.id === req.slot_id; });
      return { success: true, status: req.status, slot_date: slot ? slot.slot_date : null, start_time: slot ? slot.start_time : null, end_time: slot ? slot.end_time : null, family_name: req.family_name, reference_code: req.reference_code };
    },
    cancel_booking: function (p) {
      var reqs = table("booking_requests");
      var req = reqs.find(function (r) { return String(r.reference_code).toUpperCase() === String(p.p_reference_code).trim().toUpperCase() && String(r.phone).replace(/\D/g, "") === String(p.p_phone).replace(/\D/g, ""); });
      if (!req) return { success: false, error: "not_found" };
      if (req.status === "cancelled") return { success: false, error: "already_cancelled" };
      if (req.status === "completed") return { success: false, error: "already_completed" };
      req.status = "cancelled";
      var slot = table("booking_slots").find(function (s) { return s.id === req.slot_id; });
      if (slot && slot.status === "booked") slot.status = "open";
      persist();
      return { success: true };
    },
    reschedule_booking: function (p) {
      var reqs = table("booking_requests");
      var oldReq = reqs.find(function (r) { return String(r.reference_code).toUpperCase() === String(p.p_reference_code).trim().toUpperCase() && String(r.phone).replace(/\D/g, "") === String(p.p_phone).replace(/\D/g, ""); });
      if (!oldReq) return { success: false, error: "not_found" };
      if (oldReq.status === "cancelled" || oldReq.status === "completed") return { success: false, error: "cannot_reschedule" };
      var newSlot = table("booking_slots").find(function (s) { return s.slot_date === p.p_new_slot_date && s.start_time === p.p_new_start_time && s.status === "open"; });
      if (!newSlot) return { success: false, error: "slot_unavailable" };
      newSlot.status = "booked";
      var newRef = shortRef();
      var newReq = { id: uuid(), slot_id: newSlot.id, family_name: oldReq.family_name, phone: oldReq.phone, email: oldReq.email, reason: oldReq.reason, status: "pending", created_at: nowISO(), confirmed_by: null, confirmed_at: null, reference_code: newRef };
      reqs.push(newReq);
      oldReq.status = "cancelled";
      var oldSlot = table("booking_slots").find(function (s) { return s.id === oldReq.slot_id; });
      if (oldSlot && oldSlot.status === "booked") oldSlot.status = "open";
      persist();
      return { success: true, reference_code: newRef, slot_date: p.p_new_slot_date, start_time: p.p_new_start_time };
    },

    start_chat_conversation: function (p) {
      var convId = uuid();
      table("chat_conversations").push({ id: convId, visitor_name: p.p_visitor_name || null, page_url: p.p_page_url || null, status: "new", created_at: nowISO(), last_message_at: nowISO() });
      table("chat_messages").push({ id: uuid(), conversation_id: convId, sender_type: "visitor", sender_name: p.p_visitor_name || null, body: p.p_message, created_at: nowISO(), read_by_staff: false });
      var autoReply = findKeywordReply(p.p_message, p.p_lang);
      if (!autoReply) {
        autoReply = p.p_lang === "en"
          ? "I don't have a precise answer to that one yet — let me get a member of our team to help you directly. In the meantime, feel free to book a free consultation: booking.html"
          : "Je n'ai pas encore de réponse précise à cette question — laissez-moi obtenir l'aide d'un membre de notre équipe. Entretemps, n'hésitez pas à réserver une consultation gratuite : booking.html";
      }
      table("chat_messages").push({ id: uuid(), conversation_id: convId, sender_type: "auto", sender_name: null, body: autoReply, created_at: nowISO(), read_by_staff: false });
      persist();
      return { conversation_id: convId, auto_reply: autoReply };
    },
    send_chat_message: function (p) {
      var conv = table("chat_conversations").find(function (c) { return c.id === p.p_conversation_id; });
      if (!conv) return { success: false, error: "conversation_not_found" };
      table("chat_messages").push({ id: uuid(), conversation_id: p.p_conversation_id, sender_type: "visitor", sender_name: null, body: p.p_message, created_at: nowISO(), read_by_staff: false });
      var autoReply = findKeywordReply(p.p_message, p.p_lang);
      if (!autoReply) {
        autoReply = p.p_lang === "en"
          ? "I don't have a precise answer to that one — let me get a member of our team to step in and reply to you directly."
          : "Je n'ai pas de réponse précise à cette question — laissez-moi obtenir l'aide d'un membre de notre équipe.";
      }
      table("chat_messages").push({ id: uuid(), conversation_id: p.p_conversation_id, sender_type: "auto", sender_name: null, body: autoReply, created_at: nowISO(), read_by_staff: false });
      conv.last_message_at = nowISO();
      if (conv.status === "new") conv.status = "active";
      persist();
      return { success: true, auto_reply: autoReply };
    },
    get_chat_messages: function (p) {
      return table("chat_messages")
        .filter(function (m) { return m.conversation_id === p.p_conversation_id; })
        .sort(function (a, b) { return new Date(a.created_at) - new Date(b.created_at); });
    },

    submit_review: function (p) {
      if (!p.p_rating || p.p_rating < 1 || p.p_rating > 5) throw new Error("Rating must be 1..5");
      if (!p.p_body || !p.p_name) throw new Error("Name and comment are required");
      table("reviews").push({ id: uuid(), created_at: nowISO(), author_name: null, rating: p.p_rating, body: p.p_body, status: "pending", lang: p.p_lang, reviewer_name: p.p_name, email: p.p_email || null, known_contact: false, reply: null });
      persist();
      return null;
    },
    archive_and_remove: function (p) {
      var row = table(p.p_table).find(function (r) { return r.id === p.p_id; });
      if (row) {
        table("archive").push({ id: uuid(), archived_at: nowISO(), archived_by: "Demo Admin", source_table: p.p_table, label: p.p_label, data: row });
        DB[p.p_table] = table(p.p_table).filter(function (r) { return r.id !== p.p_id; });
        persist();
      }
      return null;
    },
    apply_package_to_job: function (p) {
      var tpls = table("package_templates").filter(function (t) { return t.package_key === p.p_package_key; }).sort(function (a, b) { return a.position - b.position; });
      DB.job_checklist_items = table("job_checklist_items").filter(function (c) { return c.job_id !== p.p_job_id; });
      tpls.forEach(function (t) {
        table("job_checklist_items").push({ id: uuid(), job_id: p.p_job_id, position: t.position, task_fr: t.task_fr, task_en: t.task_en, done: false, done_by: null, done_at: null, created_at: nowISO() });
      });
      persist();
      return null;
    },
    next_invoice_number: function () {
      var yr = new Date().getFullYear();
      var n = table("invoices").filter(function (i) { return i.invoice_number.indexOf("CS-" + yr + "-") === 0; }).length + 1;
      return "CS-" + yr + "-" + String(n).padStart(4, "0");
    }
  };

  function findKeywordReply(message, lang) {
    var responses = table("chat_keyword_responses").filter(function (r) { return r.active; }).sort(function (a, b) { return a.position - b.position; });
    var lower = String(message).toLowerCase();
    for (var i = 0; i < responses.length; i++) {
      var kws = responses[i].keywords.split(",");
      for (var j = 0; j < kws.length; j++) {
        var kw = kws[j].trim().toLowerCase();
        if (kw && lower.indexOf(kw) !== -1) {
          return lang === "en" ? (responses[i].response_en || responses[i].response_fr) : responses[i].response_fr;
        }
      }
    }
    return null;
  }

  // ======================================================================
  // 6. Fake auth — a handful of demo logins, no real security since
  //    there's nothing real behind it
  // ======================================================================
  var currentSession = null;
  (function restoreSession() {
    try {
      var saved = sessionStorage.getItem("csDemoSession");
      if (saved) currentSession = JSON.parse(saved);
    } catch (e) {}
  })();
  function saveSession() {
    try {
      if (currentSession) sessionStorage.setItem("csDemoSession", JSON.stringify(currentSession));
      else sessionStorage.removeItem("csDemoSession");
    } catch (e) {}
  }

  var authListeners = [];

  var auth = {
    signInWithPassword: function (opts) {
      var user = table("profiles").find(function (p) { return p.email === opts.email && p._demo_password === opts.password; });
      if (!user) return Promise.resolve({ data: null, error: { message: "Invalid login credentials" } });
      currentSession = { user: { id: user.id, email: user.email } };
      saveSession();
      authListeners.forEach(function (cb) { cb("SIGNED_IN", currentSession); });
      return Promise.resolve({ data: currentSession, error: null });
    },
    signOut: function () {
      currentSession = null;
      saveSession();
      authListeners.forEach(function (cb) { cb("SIGNED_OUT", null); });
      return Promise.resolve({ error: null });
    },
    getSession: function () {
      return Promise.resolve({ data: { session: currentSession }, error: null });
    },
    getUser: function () {
      return Promise.resolve({ data: { user: currentSession ? currentSession.user : null }, error: null });
    },
    onAuthStateChange: function (cb) {
      authListeners.push(cb);
      return { data: { subscription: { unsubscribe: function () { authListeners = authListeners.filter(function (x) { return x !== cb; }); } } } };
    },
    admin: {
      updateUserById: function (id, patch) {
        // used by the admin password reset feature - no real password to change here
        return Promise.resolve({ data: { user: { id: id } }, error: null });
      }
    }
  };

  // ======================================================================
  // 7. Fake storage — uploads are just remembered by name, no real files
  // ======================================================================
  function makeStorageBucket() {
    return {
      upload: function (path, file) {
        return Promise.resolve({ data: { path: path }, error: null });
      },
      createSignedUrl: function (path) {
        // A tiny inline placeholder "document" so the View button always works.
        var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23f4f0e6"/><text x="200" y="140" font-family="sans-serif" font-size="16" fill="%232B2A28" text-anchor="middle">Demo file preview</text><text x="200" y="165" font-family="sans-serif" font-size="12" fill="%235B574F" text-anchor="middle">' + encodeURIComponent(path.split("/").pop()) + '</text></svg>';
        return Promise.resolve({ data: { signedUrl: "data:image/svg+xml," + svg }, error: null });
      },
      remove: function () { return Promise.resolve({ data: null, error: null }); },
      list: function () { return Promise.resolve({ data: [], error: null }); }
    };
  }

  // ======================================================================
  // 8. Fake Edge Functions
  // ======================================================================
  function invokeFunction(name, opts) {
    var body = (opts && opts.body) || {};
    if (name === "portal-signup") {
      var file = table("coordination_files").find(function (f) { return f.email && f.email.toLowerCase() === String(body.email).toLowerCase() && !f.portal_user_id; });
      if (!file) return Promise.resolve({ data: { success: false, error: "no_match" }, error: null });
      var uid = uuid();
      table("profiles").push({ id: uid, full_name: file.primary_contact, role: "family", email: body.email, created_at: nowISO(), _demo_password: body.password });
      file.portal_user_id = uid;
      file.portal_email = body.email;
      file.portal_created_at = nowISO();
      persist();
      return Promise.resolve({ data: { success: true }, error: null });
    }
    if (name === "portal-revoke") {
      var f2 = table("coordination_files").find(function (x) { return x.id === body.coordination_id; });
      if (f2) { f2.portal_user_id = null; f2.portal_email = null; f2.portal_created_at = null; persist(); }
      return Promise.resolve({ data: { success: true }, error: null });
    }
    if (name === "admin-reset-password") {
      return Promise.resolve({ data: { success: true }, error: null });
    }
    if (name === "add-staff") {
      var newId = uuid();
      table("profiles").push({ id: newId, full_name: body.full_name, role: body.role, email: body.email, created_at: nowISO(), can_manage_intake: false, can_manage_finances: false, can_manage_reviews: false, can_manage_staff: false, _demo_password: body.temp_password });
      persist();
      return Promise.resolve({ data: { success: true }, error: null });
    }
    if (name === "delete-staff-login") {
      DB.profiles = table("profiles").filter(function (p) { return p.id !== body.user_id; });
      persist();
      return Promise.resolve({ data: { success: true }, error: null });
    }
    if (name === "log-deletion") {
      return Promise.resolve({ data: { success: true }, error: null }); // pretend the Sheet write happened
    }
    return Promise.resolve({ data: null, error: { message: "Unknown demo function: " + name } });
  }

  // ======================================================================
  // 9. Fake realtime — no other visitors exist in a demo, so this is a
  //    harmless no-op rather than a real subscription
  // ======================================================================
  function fakeChannel() {
    var ch = {
      on: function () { return ch; },
      subscribe: function (cb) { if (cb) cb("SUBSCRIBED"); return ch; }
    };
    return ch;
  }

  // ======================================================================
  // 10. The fake supabase-js client itself
  // ======================================================================
  function createClient() {
    return {
      from: function (t) { return makeQueryBuilder(t); },
      rpc: function (name, params) {
        var fn = RPCS[name];
        if (!fn) return Promise.resolve({ data: null, error: { message: "Unknown demo RPC: " + name } });
        try {
          var result = fn(params || {});
          return Promise.resolve({ data: result, error: null });
        } catch (err) {
          return Promise.resolve({ data: null, error: { message: String(err.message || err) } });
        }
      },
      auth: auth,
      storage: { from: function () { return makeStorageBucket(); } },
      functions: { invoke: invokeFunction },
      channel: function () { return fakeChannel(); },
      removeChannel: function () {}
    };
  }
  window.supabase = { createClient: createClient };

  // ======================================================================
  // 11. Fetch interceptor — for pages that call the REST API directly
  //     instead of going through the supabase-js client
  // ======================================================================
  var realFetch = window.fetch.bind(window);
  window.fetch = function (url, opts) {
    if (typeof url !== "string" || url.indexOf("/rest/v1/") === -1) {
      return realFetch(url, opts);
    }
    opts = opts || {};
    var afterRest = url.split("/rest/v1/")[1];
    var method = (opts.method || "GET").toUpperCase();

    // RPC calls: /rest/v1/rpc/<function_name>
    if (afterRest.indexOf("rpc/") === 0) {
      var fnName = afterRest.slice(4).split("?")[0];
      var params = {};
      try { params = opts.body ? JSON.parse(opts.body) : {}; } catch (e) {}
      var fn = RPCS[fnName];
      var resultBody;
      try {
        resultBody = fn ? fn(params) : { success: false, error: "unknown_function" };
      } catch (err) {
        resultBody = { success: false, error: String(err.message || err) };
      }
      return Promise.resolve(new Response(JSON.stringify(resultBody), { status: 200, headers: { "Content-Type": "application/json" } }));
    }

    // Table calls: /rest/v1/<table>?col=eq.val&...
    var parts = afterRest.split("?");
    var tableName = parts[0];
    var qs = new URLSearchParams(parts[1] || "");
    var filters = [];
    var orders = [];
    var selectCols = "*";
    qs.forEach(function (val, key) {
      if (key === "select") { selectCols = val; return; }
      if (key === "order") {
        val.split(",").forEach(function (part) {
          var bits = part.split(".");
          orders.push({ col: bits[0], ascending: bits[1] !== "desc" });
        });
        return;
      }
      if (key === "limit") return;
      var opMatch = val.match(/^([a-z]+)\.(.*)$/);
      if (opMatch) {
        var op = opMatch[1], v = opMatch[2];
        if (op === "in") v = v.replace(/^\(|\)$/g, "").split(",");
        filters.push({ col: key, op: op, val: v });
      }
    });

    if (method === "GET") {
      var rows = runFilters(table(tableName), filters);
      rows = runOrder(rows, orders);
      return Promise.resolve(new Response(JSON.stringify(rows), { status: 200, headers: { "Content-Type": "application/json" } }));
    }

    if (method === "POST") {
      var body;
      try { body = JSON.parse(opts.body); } catch (e) { body = {}; }
      var row = Object.assign({ id: uuid(), created_at: nowISO(), updated_at: nowISO(), status: body.status || "new" }, body);
      table(tableName).push(row);
      persist();
      return Promise.resolve(new Response(null, { status: 201 }));
    }

    if (method === "PATCH") {
      var patchBody;
      try { patchBody = JSON.parse(opts.body); } catch (e) { patchBody = {}; }
      var matched = runFilters(table(tableName), filters);
      matched.forEach(function (r) { Object.assign(r, patchBody); });
      persist();
      return Promise.resolve(new Response(null, { status: 204 }));
    }

    if (method === "DELETE") {
      var toDelete = runFilters(table(tableName), filters).map(function (r) { return r.id; });
      DB[tableName] = table(tableName).filter(function (r) { return toDelete.indexOf(r.id) === -1; });
      persist();
      return Promise.resolve(new Response(null, { status: 204 }));
    }

    return realFetch(url, opts);
  };

  // ======================================================================
  // 12. A little console note so anyone poking at devtools understands
  //     what they're looking at
  // ======================================================================
  console.log("%cChemin Serein — DEMO MODE", "font-weight:bold;color:#927235", "\nThis is a portfolio demo. There is no real database — everything you see and do here is fake, sandboxed to your browser tab, and resets on your next visit.");

  // ======================================================================
  // 13. A small, dismissible on-page banner so visitors know what they're
  //     looking at, without having to touch all 18 pages individually.
  //     A reset control stays available even after the banner itself is
  //     dismissed, since testing usually means resetting more than once.
  // ======================================================================
  function resetDemoData() {
    try {
      sessionStorage.removeItem(STORE_KEY);
      sessionStorage.removeItem("csDemoSession");
      // banner dismissal state intentionally NOT cleared — resetting the
      // data shouldn't force the info banner to reappear every time
    } catch (e) {}
    location.reload();
  }

  function showMiniResetButton() {
    if (document.getElementById("csDemoMiniReset")) return;
    var mini = document.createElement("button");
    mini.id = "csDemoMiniReset";
    mini.textContent = "🔄 Reset Demo";
    mini.style.cssText = "position:fixed;bottom:14px;left:14px;z-index:99999;background:#2B2A28;color:#F7F3EC;border:1px solid #B08D49;padding:8px 14px;border-radius:20px;cursor:pointer;font-family:sans-serif;font-size:.78rem;box-shadow:0 2px 10px rgba(0,0,0,.2)";
    mini.addEventListener("click", function () {
      if (confirm("Reset all demo data back to its original state? This clears anything you've added or changed (bookings, messages, etc.) and reloads the page.")) {
        resetDemoData();
      }
    });
    document.body.appendChild(mini);
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (sessionStorage.getItem("csDemoBannerDismissed")) {
      showMiniResetButton();
      return;
    }
    var bar = document.createElement("div");
    bar.style.cssText = "position:fixed;bottom:0;left:0;right:0;z-index:99999;background:#2B2A28;color:#F7F3EC;font-family:sans-serif;font-size:.82rem;padding:10px 16px;display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;box-shadow:0 -2px 10px rgba(0,0,0,.2)";
    bar.innerHTML = '<span>🎭 Portfolio demo — no real data, nothing you do here is saved beyond this visit.</span>'
      + '<button id="csDemoResetBtn" style="background:transparent;border:1px solid #B08D49;color:#F7F3EC;padding:5px 12px;border-radius:14px;cursor:pointer;font-size:.78rem">🔄 Reset Demo</button>'
      + '<button id="csDemoGotItBtn" style="background:#B08D49;border:0;color:#fff;padding:5px 12px;border-radius:14px;cursor:pointer;font-size:.78rem">Got it</button>';
    bar.querySelector("#csDemoResetBtn").addEventListener("click", function () {
      if (confirm("Reset all demo data back to its original state? This clears anything you've added or changed (bookings, messages, etc.) and reloads the page.")) {
        resetDemoData();
      }
    });
    bar.querySelector("#csDemoGotItBtn").addEventListener("click", function () {
      bar.remove();
      try { sessionStorage.setItem("csDemoBannerDismissed", "1"); } catch (e) {}
      showMiniResetButton();
    });
    document.body.appendChild(bar);
  });
})();
