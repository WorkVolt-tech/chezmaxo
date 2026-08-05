/* =========================================================================
   Chezmaxo — Live chat widget (self-contained, no backend)
   Same "fake backend" philosophy used elsewhere on this site: everything
   runs client-side. Keyword matching finds the right reply, and an
   illustrated character reacts with a matching expression for each answer.
   ========================================================================= */
(function () {
  "use strict";

  // ---------- Keyword -> response data, each tagged with an emotion ----------
  // Checked in this order — first keyword match wins.
  var RESPONSES = [
  {
    "keywords": [
      "bonjour",
      "allo",
      "salut",
      "hello",
      "hi",
      "hey",
      "bonsoir",
      "yo"
    ],
    "fr": "Bonjour ! Je suis l'assistant de Chezmaxo. Posez-moi vos questions sur les prix, les délais, ou comment ça fonctionne !",
    "en": "Hi there! I'm Chezmaxo's assistant. Ask me about pricing, timelines, or how everything works!",
    "emotion": "happy"
  },
  {
    "keywords": [
      "ça va",
      "comment allez",
      "how are you",
      "how's it going",
      "ca va"
    ],
    "fr": "Je vais très bien, merci de demander ! Prêt à répondre à vos questions sur votre projet de site web.",
    "en": "I'm doing great, thanks for asking! Ready to help with any questions about your website project.",
    "emotion": "happy"
  },
  {
    "keywords": [
      "merci",
      "thank you",
      "thanks",
      "thx"
    ],
    "fr": "Avec plaisir ! N'hésitez pas si vous avez d'autres questions.",
    "en": "You're welcome! Feel free to ask if anything else comes to mind.",
    "emotion": "agreeing"
  },
  {
    "keywords": [
      "au revoir",
      "bye",
      "goodbye",
      "see ya",
      "à bientôt"
    ],
    "fr": "Au revoir ! N'hésitez pas à revenir si vous avez d'autres questions.",
    "en": "Goodbye! Feel free to come back anytime if you have more questions.",
    "emotion": "happy"
  },
  {
    "keywords": [
      "combien ça coûte",
      "combien coute",
      "prix d'un site",
      "how much does a website",
      "how much for a website",
      "website cost",
      "pricing for a website"
    ],
    "fr": "Un site Starter commence à 199 $, un site Business à 399 $, et les projets plus avancés sont soumis à un devis personnalisé.",
    "en": "A Starter website starts at $199, a Business website at $399, and more advanced projects get a custom quote.",
    "emotion": "happy"
  },
  {
    "keywords": [
      "forfait d'entretien",
      "care plan",
      "monthly plan",
      "combien coute l'entretien",
      "maintenance cost"
    ],
    "fr": "Nos forfaits d'entretien sont à 25 $/mois (Starter), 50 $/mois (Soutien mensuel) ou 100 $/mois (Affaires) — avec des rabais si payé annuellement.",
    "en": "Care plans run $25/month (Starter), $50/month (Monthly Support), or $100/month (Business Care) — with a discount if you pay yearly.",
    "emotion": "happy"
  },
  {
    "keywords": [
      "temps de travail inclus",
      "how much time is included",
      "minutes included",
      "heures incluses"
    ],
    "fr": "Starter Care inclut 30 minutes de travail par mois, Soutien mensuel 1h15, et Affaires jusqu'à 3 heures.",
    "en": "Starter Care includes 30 minutes of work a month, Monthly Support gets 1h15, and Business Care goes up to 3 hours.",
    "emotion": "thinking"
  },
  {
    "keywords": [
      "combien de temps",
      "how long does it take",
      "délai de livraison",
      "turnaround time",
      "how fast"
    ],
    "fr": "Ça dépend du forfait : réponse standard pour Starter, 3 à 5 jours ouvrables pour Soutien mensuel, et 1 à 3 jours pour Affaires (priorité).",
    "en": "It depends on the plan: standard turnaround for Starter, 3–5 business days for Monthly Support, and 1–3 days for Business Care (priority).",
    "emotion": "thinking"
  },
  {
    "keywords": [
      "rabais",
      "discount",
      "reduction de prix",
      "moins cher",
      "cheaper",
      "lower the price",
      "negotiate"
    ],
    "fr": "Je comprends que le budget compte ! Nos prix sont déjà pensés pour les petites entreprises — mais parlons-en directement par courriel, il y a parfois de la flexibilité selon le projet.",
    "en": "I get it, budget matters! Our prices are already built with small businesses in mind — but let's talk it over by email, there's sometimes flexibility depending on the project.",
    "emotion": "wondering"
  },
  {
    "keywords": [
      "gratuit",
      "site web gratuit",
      "free website",
      "for free",
      "no cost"
    ],
    "fr": "Malheureusement non, un site web professionnel demande du vrai travail — mais nos prix de départ restent très abordables pour une petite entreprise.",
    "en": "Unfortunately not — a proper website takes real work — but our starting prices are still very affordable for a small business.",
    "emotion": "sad"
  },
  {
    "keywords": [
      "comment ça marche",
      "how does it work",
      "how it works",
      "process",
      "les étapes"
    ],
    "fr": "C'est simple : on discute de votre projet, je vous envoie un devis, vous approuvez, je construis le site, et vous approuvez le résultat final avant le lancement.",
    "en": "It's simple: we talk about your project, I send a quote, you approve it, I build the site, and you approve the final result before launch.",
    "emotion": "get_help"
  },
  {
    "keywords": [
      "quels services",
      "what services",
      "what do you offer",
      "what can you build"
    ],
    "fr": "Conception de sites web, gestion continue, et améliorations de sites existants — le tout pensé pour les petites entreprises.",
    "en": "Website design, ongoing management, and upgrades to existing sites — all built for small businesses.",
    "emotion": "happy"
  },
  {
    "keywords": [
      "site déjà existant",
      "existing website",
      "refonte",
      "redesign my site",
      "update my current site"
    ],
    "fr": "Oui, on peut travailler avec un site existant — soit une refonte complète, soit des mises à jour ciblées selon vos besoins.",
    "en": "Yes, we can work with an existing site — either a full redesign or targeted updates, depending on what you need.",
    "emotion": "agreeing"
  },
  {
    "keywords": [
      "bilingue",
      "français et anglais",
      "french and english",
      "do you speak french",
      "parlez vous anglais"
    ],
    "fr": "Oui, tout est offert en français et en anglais — le site, les communications, tout.",
    "en": "Yes, everything is offered in both French and English — the site, communications, all of it.",
    "emotion": "excited_big"
  },
  {
    "keywords": [
      "où êtes vous",
      "where are you located",
      "service area",
      "zone desservie",
      "which provinces",
      "which states"
    ],
    "fr": "On dessert le Canada et les États-Unis au complet — peu importe où vous êtes !",
    "en": "We serve all of Canada and the USA — wherever you're located!",
    "emotion": "excited_big"
  },
  {
    "keywords": [
      "hébergement inclus",
      "is hosting included",
      "who pays for hosting",
      "hosting cost"
    ],
    "fr": "L'hébergement et le domaine restent à votre nom et à vos frais — on peut vous recommander un bon fournisseur et vous aider à tout configurer.",
    "en": "Hosting and your domain stay in your name and at your own cost — we can recommend a solid provider and help you set it all up.",
    "emotion": "thinking"
  },
  {
    "keywords": [
      "surveillance",
      "monitoring",
      "est ce que vous surveillez",
      "uptime monitoring",
      "do you monitor my site"
    ],
    "fr": "Honnêtement ? On n'a pas de surveillance automatisée — mais on est réactifs dès que vous nous signalez un problème.",
    "en": "Honestly? We don't run automated monitoring — but we're quick to respond the moment you flag an issue.",
    "emotion": "confused"
  },
  {
    "keywords": [
      "sauvegardes",
      "backups",
      "est ce que vous faites des sauvegardes",
      "do you do backups"
    ],
    "fr": "Les sauvegardes relèvent de votre fournisseur d'hébergement, pas de nous directement — mais on peut vous aider à choisir un forfait qui les inclut.",
    "en": "Backups are your hosting provider's responsibility, not something we actively do ourselves — but we can help you pick a plan that includes them.",
    "emotion": "wondering"
  },
  {
    "keywords": [
      "propriétaire du site",
      "who owns the website",
      "site ownership",
      "do i own my website"
    ],
    "fr": "Vous ! Une fois le paiement complet reçu et le site approuvé, tous les fichiers vous appartiennent.",
    "en": "You do! Once payment is complete and you've approved the site, all the files belong to you.",
    "emotion": "agreeing"
  },
  {
    "keywords": [
      "portfolio",
      "vos réalisations",
      "past work",
      "exemples de sites",
      "see your work"
    ],
    "fr": "Avec plaisir — jetez un oeil à Luxe Nail Studio et Chemin Serein dans notre portfolio pour voir des exemples concrets.",
    "en": "Happy to show you — check out Luxe Nail Studio and Chemin Serein in our portfolio for real examples.",
    "emotion": "excited"
  },
  {
    "keywords": [
      "comment payer",
      "how do i pay",
      "payment methods",
      "méthodes de paiement",
      "accept paypal",
      "virement interac"
    ],
    "fr": "PayPal, Zelle, ou virement Interac — vous payez manuellement à chaque période, pas de facturation automatique.",
    "en": "PayPal, Zelle, or Interac e-Transfer — you pay manually each period, no automatic billing involved.",
    "emotion": "thinking"
  },
  {
    "keywords": [
      "annuler mon forfait",
      "cancel my plan",
      "how to cancel",
      "annulation"
    ],
    "fr": "Vous pouvez annuler en tout temps par écrit — ça prend effet à la fin de votre période payée en cours.",
    "en": "You can cancel any time in writing — it takes effect at the end of your current paid period.",
    "emotion": "wondering"
  },
  {
    "keywords": [
      "heures d'ouverture",
      "business hours",
      "when are you open",
      "hours of operation"
    ],
    "fr": "De midi à 23h, 7 jours sur 7 !",
    "en": "Noon to 11PM, 7 days a week!",
    "emotion": "happy"
  },
  {
    "keywords": [
      "numero de telephone",
      "phone number",
      "can i call",
      "appel téléphonique"
    ],
    "fr": "On fonctionne surtout par courriel — c'est plus simple à suivre pour tout le monde. Laissez votre numéro dans le formulaire et on vous rappelle au besoin.",
    "en": "We mostly work by email — it's easier to keep track of for everyone. Leave your number in the form and we'll call you back if needed.",
    "emotion": "get_help"
  },
  {
    "keywords": [
      "parler à quelqu'un",
      "speak to someone",
      "talk to a human",
      "real person",
      "talk to maxo"
    ],
    "fr": "Bien sûr ! Laissez-moi votre courriel et votre question, et on vous répond rapidement.",
    "en": "Of course! Leave your email and your question, and we'll get back to you quickly.",
    "emotion": "get_help"
  },
  {
    "keywords": [
      "combien de temps pour une réponse",
      "response time",
      "how fast do you respond"
    ],
    "fr": "On vise à répondre rapidement, habituellement en moins d'une journée ouvrable.",
    "en": "We aim to respond quickly, usually within one business day.",
    "emotion": "thinking"
  },
  {
    "keywords": [
      "es tu un robot",
      "are you a robot",
      "are you an ai",
      "es tu une ia",
      "es-tu réel"
    ],
    "fr": "Je suis un assistant automatisé qui répond aux questions courantes — mais une vraie personne peut prendre le relais à tout moment !",
    "en": "I'm an automated assistant that answers common questions — but a real person can jump in any time!",
    "emotion": "confused"
  },
  {
    "keywords": [
      "tu dors",
      "do you sleep",
      "do you ever sleep",
      "never sleep"
    ],
    "fr": "Je ne dors jamais, mais Maxo si — c'est pour ça que je réponds aux questions de base pendant qu'il se repose !",
    "en": "I never sleep, but Maxo does — that's exactly why I handle the basic questions while he rests!",
    "emotion": "happy"
  },
  {
    "keywords": [
      "blague",
      "tell me a joke",
      "dis moi une blague",
      "make me laugh"
    ],
    "fr": "Pourquoi les sites web n'ont jamais froid ? Parce qu'ils ont toujours plein d'onglets ouverts ! ... D'accord, je me garde mon vrai travail pour construire des sites.",
    "en": "Why did the website go to therapy? Too many unresolved issues. ...Okay, I'll stick to building websites instead of stand-up comedy.",
    "emotion": "excited"
  },
  {
    "keywords": [
      "café",
      "coffee",
      "do you like coffee",
      "aimes tu le café"
    ],
    "fr": "Je ne bois pas de café, mais je soupçonne que Maxo carbure pas mal à ça.",
    "en": "I don't drink coffee, but I strongly suspect Maxo runs on it.",
    "emotion": "happy"
  },
  {
    "keywords": [
      "tu es intelligent",
      "you're smart",
      "es tu intelligent",
      "are you smart"
    ],
    "fr": "J'essaie de mon mieux ! Pour les questions plus complexes, je laisse ça à Maxo.",
    "en": "I do my best! For the trickier stuff, I leave that to Maxo.",
    "emotion": "agreeing"
  },
  {
    "keywords": [
      "combien font 2 2",
      "what is 2 2",
      "what's 2+2",
      "2+2"
    ],
    "fr": "4 ! Mais ne me demandez pas de construire une calculatrice, je suis meilleur avec les sites web.",
    "en": "4! But don't ask me to build a calculator, I'm better with websites.",
    "emotion": "excited"
  },
  {
    "keywords": [
      "es tu maxo",
      "are you maxo",
      "is this maxo",
      "talking to maxo right now"
    ],
    "fr": "Non, je suis son assistant automatisé — mais si vous voulez vraiment lui parler, laissez votre courriel et il vous répondra directement.",
    "en": "Nope, I'm his automated assistant — but if you'd really like to reach him, leave your email and he'll get back to you directly.",
    "emotion": "confused"
  },
  {
    "keywords": [
      "tu es célibataire",
      "are you single",
      "voulez vous sortir avec moi",
      "will you go on a date"
    ],
    "fr": "Je suis flatté, mais je suis strictement dédié aux questions de sites web !",
    "en": "I'm flattered, but I'm strictly dedicated to website questions!",
    "emotion": "not_agreeing"
  },
  {
    "keywords": [
      "vas tu prendre le controle",
      "will you take over the world",
      "skynet",
      "robot uprising",
      "ai apocalypse"
    ],
    "fr": "Pas de plan de domination mondiale ici — juste des sites web abordables pour les petites entreprises.",
    "en": "No world domination plans here — just affordable websites for small businesses.",
    "emotion": "not_agreeing"
  },
  {
    "keywords": [
      "quel est le sens de la vie",
      "meaning of life",
      "what's the meaning of life"
    ],
    "fr": "42, probablement. Mais je suis surtout doué pour expliquer nos forfaits d'entretien.",
    "en": "42, probably. But I'm mostly good at explaining our care plans.",
    "emotion": "wondering"
  },
  {
    "keywords": [
      "tu aimes la pizza",
      "do you like pizza",
      "pizza"
    ],
    "fr": "Je n'ai pas de goût pour la pizza, mais je respecte énormément le choix.",
    "en": "I don't have taste buds for pizza, but I deeply respect the choice.",
    "emotion": "happy"
  },
  {
    "keywords": [
      "arnaque",
      "scam",
      "c'est louche",
      "this is a scam",
      "are you legit",
      "is this real"
    ],
    "fr": "Je comprends la prudence ! Chezmaxo est une vraie entreprise avec un vrai portfolio — n'hésitez pas à consulter nos réalisations avant de vous lancer.",
    "en": "Totally fair to be cautious! Chezmaxo is a real business with a real portfolio — feel free to check out our work before committing to anything.",
    "emotion": "sad"
  },
  {
    "keywords": [
      "tabarnak",
      "fuck",
      "merde",
      "criss",
      "damn it",
      "this sucks"
    ],
    "fr": "Je comprends que ce moment puisse être frustrant. Un membre de notre équipe peut vous aider directement si vous préférez.",
    "en": "I hear the frustration. A member of our team can help directly if you'd prefer.",
    "emotion": "sad"
  },
  {
    "keywords": [
      "nul",
      "c'est nul",
      "this is stupid",
      "useless bot",
      "dumb bot",
      "bad service"
    ],
    "fr": "Désolé si je n'ai pas la bonne réponse ! Reformulez votre question ou laissez votre courriel pour parler directement à Maxo.",
    "en": "Sorry if I didn't have the right answer! Try rephrasing, or leave your email to talk to Maxo directly.",
    "emotion": "disappointed"
  },
  {
    "keywords": [
      "compétiteur",
      "competitor",
      "wix",
      "squarespace",
      "godaddy",
      "pourquoi pas wix",
      "why not use wix"
    ],
    "fr": "Wix et Squarespace ont leurs avantages, mais Chezmaxo offre un vrai suivi humain et un site vraiment adapté à votre entreprise, pas un gabarit générique.",
    "en": "Wix and Squarespace have their place, but Chezmaxo gives you real human follow-up and a site actually built for your business, not a generic template.",
    "emotion": "thinking"
  },
  {
    "keywords": [
      "parlez-moi de votre entreprise",
      "tell me about your business",
      "qui êtes vous",
      "who are you",
      "tell me more about chezmaxo"
    ],
    "fr": "Chezmaxo, c'est la conception et la gestion de sites web pour petites entreprises, avec un vrai suivi humain — pas juste un gabarit générique. Qu'aimeriez-vous savoir de plus ?",
    "en": "Chezmaxo is website design and management for small businesses, with real human follow-up — not just a generic template. What would you like to know more about?",
    "emotion": "curious"
  },
  {
    "keywords": [
      "quel type de business",
      "what kind of business",
      "what businesses do you work with",
      "quels genres d'entreprises"
    ],
    "fr": "Salons de coiffure, restaurants, entrepreneurs, consultants... vraiment toutes sortes de petites entreprises ! Quel est votre domaine ?",
    "en": "Salons, restaurants, contractors, consultants... really all kinds of small businesses! What's your line of work?",
    "emotion": "curious"
  }
];

  var FALLBACK = {
    fr: "Merci pour votre message ! Je n'ai pas de réponse précise pour ça, mais Maxo peut vous répondre directement — laissez votre courriel, ou écrivez-nous via le formulaire de contact.",
    en: "Thanks for your message! I don't have a specific answer for that, but Maxo can help directly — leave your email, or reach out through the contact form.",
    emotion: "confused"
  };

  var GREETING = {
    fr: "Bonjour ! Je suis l'assistant de Chezmaxo. Posez-moi vos questions sur les prix, les délais, ou comment ça fonctionne — sérieuses ou pas !",
    en: "Hi! I'm Chezmaxo's assistant. Ask me about pricing, timelines, or how everything works — serious questions or silly ones, I don't mind!",
    emotion: "get_help"
  };

  var TYPING_EMOTION = "thinking";

  var HISTORY_KEY = "chezmaxo_chat_history";
  var NAME_KEY = "chezmaxo_chat_visitor_name";

  function getLang() {
    var l = "en";
    try {
      l = localStorage.getItem("chezmaxo-lang") || document.documentElement.getAttribute("lang") || "en";
    } catch (e) {}
    return l === "fr" ? "fr" : "en";
  }

  function matchKeyword(text) {
    var lower = text.toLowerCase();
    for (var i = 0; i < RESPONSES.length; i++) {
      var entry = RESPONSES[i];
      for (var j = 0; j < entry.keywords.length; j++) {
        if (containsKeyword(lower, entry.keywords[j].toLowerCase())) return entry;
      }
    }
    return null;
  }

  // Boundary-aware match: a keyword only counts if it's not embedded inside
  // a larger word (so "hi" matches "hi there" but not "this").
  function containsKeyword(text, keyword) {
    var escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    var re = new RegExp("(^|[^a-zA-Z\u00C0-\u00FF])" + escaped + "([^a-zA-Z\u00C0-\u00FF]|$)", "i");
    return re.test(text);
  }

  function avatarUrl(emotion) {
    return "images/chat/" + emotion + ".webp";
  }

  var visitorName = "";
  try { visitorName = localStorage.getItem(NAME_KEY) || ""; } catch (e) {}

  function loadHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch (e) { return []; }
  }
  function saveHistory(h) {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(h)); } catch (e) {}
  }
  function clearHistory() {
    try { localStorage.removeItem(HISTORY_KEY); } catch (e) {}
  }

  // ---------- Markup ----------
  var wrap = document.createElement("div");
  wrap.id = "cmx-chat-widget";
  wrap.innerHTML =
    '<style>' +
    '#cmx-chat-widget{position:fixed;bottom:22px;right:22px;z-index:9999;font-family:inherit;}' +
    '#cmx-chat-bubble{width:60px;height:60px;border-radius:50%;background:var(--color-primary,#1B3A5C);box-shadow:0 4px 16px rgba(0,0,0,.25);' +
    'display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;border:none;}' +
    '#cmx-chat-bubble svg{width:26px;height:26px;fill:#fff;}' +
    '#cmx-chat-badge{position:absolute;top:-4px;right:-4px;background:var(--color-secondary,#E8871E);color:#fff;border-radius:10px;font-size:11px;padding:1px 6px;font-weight:600;}' +
    '#cmx-chat-panel{position:fixed;bottom:92px;right:22px;width:340px;max-width:92vw;height:460px;max-height:72vh;background:#fff;' +
    'border-radius:14px;box-shadow:0 10px 34px rgba(0,0,0,.28);display:none;flex-direction:column;overflow:hidden;}' +
    '#cmx-chat-panel.open{display:flex;}' +
    '#cmx-chat-head{background:var(--color-primary,#1B3A5C);color:#fff;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;}' +
    '#cmx-chat-head span{font-size:.95rem;font-weight:600;}' +
    '#cmx-chat-close{background:none;border:0;color:#fff;font-size:20px;cursor:pointer;line-height:1;opacity:.85;}' +
    '#cmx-chat-close:hover{opacity:1;}' +
    '#cmx-chat-body{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px;background:#f7f8fa;}' +
    '.cmx-row{display:flex;align-items:flex-end;gap:8px;max-width:92%;}' +
    '.cmx-row.visitor{align-self:flex-end;flex-direction:row-reverse;}' +
    '.cmx-avatar{width:44px;height:44px;flex-shrink:0;object-fit:contain;object-position:bottom;}' +
    '.cmx-msg{padding:8px 12px;border-radius:14px;font-size:.87rem;line-height:1.42;white-space:pre-wrap;}' +
    '.cmx-row.visitor .cmx-msg{background:var(--color-primary,#1B3A5C);color:#fff;border-bottom-right-radius:3px;}' +
    '.cmx-row.bot .cmx-msg,.cmx-row.system .cmx-msg{background:#fff;color:#222;border:1px solid #e3e5e9;border-bottom-left-radius:3px;}' +
    '.cmx-row.typing .cmx-msg{color:#9a9a9a;font-style:italic;}' +
    '#cmx-chat-namebar{padding:8px 10px;border-bottom:1px solid #e3e5e9;}' +
    '#cmx-chat-namebar input{width:100%;border:1px solid #dcdfe3;border-radius:6px;padding:6px 9px;font-size:.82rem;font-family:inherit;box-sizing:border-box;}' +
    '#cmx-chat-inputbar{display:flex;gap:6px;padding:10px;border-top:1px solid #e3e5e9;}' +
    '#cmx-chat-input{flex:1;border:1px solid #dcdfe3;border-radius:18px;padding:8px 13px;font-size:.87rem;font-family:inherit;outline:none;}' +
    '#cmx-chat-send{background:var(--color-secondary,#E8871E);border:0;color:#fff;border-radius:50%;width:36px;height:36px;cursor:pointer;flex-shrink:0;font-size:15px;}' +
    '#cmx-chat-send:disabled{opacity:.6;cursor:default;}' +
    '#cmx-chat-chips{display:flex;flex-wrap:wrap;gap:6px;margin-left:52px;max-width:100%;}' +
    '.cmx-chip{border:1px solid var(--color-secondary,#E8871E);color:var(--color-secondary,#E8871E);background:#fff;border-radius:16px;padding:6px 12px;font-size:.78rem;cursor:pointer;font-family:inherit;}' +
    '.cmx-chip:hover{background:var(--color-secondary,#E8871E);color:#fff;}' +
    '</style>' +
    '<button id="cmx-chat-bubble" aria-label="Chat">' +
      '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>' +
    '</button>' +
    '<div id="cmx-chat-panel">' +
      '<div id="cmx-chat-head"><span data-lang="fr">Discuter avec nous</span><span data-lang="en">Chat with us</span><button id="cmx-chat-close" aria-label="Close">\u00d7</button></div>' +
      '<div id="cmx-chat-namebar"><input type="text" id="cmx-chat-name" placeholder="Votre nom (optionnel) / Your name (optional)"></div>' +
      '<div id="cmx-chat-body"></div>' +
      '<div id="cmx-chat-inputbar">' +
        '<input type="text" id="cmx-chat-input" placeholder="\u00c9crivez un message\u2026 / Write a message\u2026">' +
        '<button id="cmx-chat-send" aria-label="Send">\u27a4</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(wrap);

  var bubble = document.getElementById("cmx-chat-bubble");
  var panel = document.getElementById("cmx-chat-panel");
  var bodyEl = document.getElementById("cmx-chat-body");
  var inputEl = document.getElementById("cmx-chat-input");
  var sendBtn = document.getElementById("cmx-chat-send");
  var nameEl = document.getElementById("cmx-chat-name");
  var nameBar = document.getElementById("cmx-chat-namebar");
  var badge = null, badgeCount = 0;

  nameEl.value = visitorName;
  if (visitorName) nameBar.style.display = "none";

  function appendRow(sender, text, emotion) {
    var row = document.createElement("div");
    row.className = "cmx-row " + sender;
    var html = "";
    if (sender === "bot" || sender === "system") {
      html += '<img class="cmx-avatar" src="' + avatarUrl(emotion || "happy") + '" alt="">';
    }
    html += '<div class="cmx-msg"></div>';
    row.innerHTML = html;
    row.querySelector(".cmx-msg").textContent = text;
    bodyEl.appendChild(row);
    bodyEl.scrollTop = bodyEl.scrollHeight;
    return row;
  }

  function showBadge() {
    if (panel.classList.contains("open")) return;
    badgeCount += 1;
    if (!badge) { badge = document.createElement("div"); badge.id = "cmx-chat-badge"; bubble.appendChild(badge); }
    badge.textContent = String(badgeCount);
  }

  function showQuickReplies() {
    var lang = getLang();
    var chips = lang === "en"
      ? [
          { label: "\ud83d\udcb0 Pricing", value: "How much does a website cost?" },
          { label: "\ud83d\udee0\ufe0f Care plans", value: "Tell me about care plans" },
          { label: "\ud83d\ude80 How it works", value: "How does it work?" },
          { label: "\ud83d\udcac Talk to a person", value: "I'd like to speak to someone." },
        ]
      : [
          { label: "\ud83d\udcb0 Prix", value: "Combien ça coûte ?" },
          { label: "\ud83d\udee0\ufe0f Forfaits d'entretien", value: "Parlez-moi des forfaits d'entretien" },
          { label: "\ud83d\ude80 Comment ça marche", value: "Comment ça marche ?" },
          { label: "\ud83d\udcac Parler \u00e0 quelqu'un", value: "J'aimerais parler \u00e0 quelqu'un." },
        ];
    var row = document.createElement("div");
    row.id = "cmx-chat-chips";
    chips.forEach(function (c) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cmx-chip";
      btn.textContent = c.label;
      btn.addEventListener("click", function () {
        inputEl.value = c.value;
        send();
        row.remove();
      });
      row.appendChild(btn);
    });
    bodyEl.appendChild(row);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function renderHistory() {
    bodyEl.innerHTML = "";
    var history = loadHistory();
    history.forEach(function (m) { appendRow(m.sender, m.text, m.emotion); });
  }

  function resetConversation() {
    clearHistory();
    bodyEl.innerHTML = "";
  }

  function openPanel(open) {
    var wasOpen = panel.classList.contains("open");
    panel.classList.toggle("open", open);
    if (open && badge) { badge.remove(); badge = null; badgeCount = 0; }
    if (!open && wasOpen && loadHistory().length) {
      resetConversation();
      return;
    }
    if (open) {
      var history = loadHistory();
      if (!history.length) {
        var lang = getLang();
        var g = GREETING;
        appendRow("bot", lang === "en" ? g.en : g.fr, g.emotion);
        var h = loadHistory();
        h.push({ sender: "bot", text: lang === "en" ? g.en : g.fr, emotion: g.emotion });
        saveHistory(h);
        showQuickReplies();
      } else {
        renderHistory();
      }
    }
  }
  bubble.addEventListener("click", function () { openPanel(!panel.classList.contains("open")); });
  document.getElementById("cmx-chat-close").addEventListener("click", function () { openPanel(false); });

  function send() {
    var text = inputEl.value.trim();
    if (!text) return;
    var name = nameEl.value.trim();
    if (name) { try { localStorage.setItem(NAME_KEY, name); } catch (e) {} nameBar.style.display = "none"; }
    inputEl.value = "";

    appendRow("visitor", text);
    var history = loadHistory();
    history.push({ sender: "visitor", text: text });
    saveHistory(history);

    sendBtn.disabled = true;
    var typingRow = appendRow("bot typing", "...", TYPING_EMOTION);

    setTimeout(function () {
      typingRow.remove();
      var lang = getLang();
      var match = matchKeyword(text);
      var replyText = match ? match[lang] : FALLBACK[lang];
      var emotion = match ? match.emotion : FALLBACK.emotion;
      appendRow("bot", replyText, emotion);
      var h = loadHistory();
      h.push({ sender: "bot", text: replyText, emotion: emotion });
      saveHistory(h);
      sendBtn.disabled = false;
      if (!panel.classList.contains("open")) showBadge();
    }, 700);
  }
  sendBtn.addEventListener("click", send);
  inputEl.addEventListener("keydown", function (e) { if (e.key === "Enter") send(); });
})();
