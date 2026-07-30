/* =========================================================================
   Chemin Serein — Live chat widget (DEMO VERSION)
   Fully self-contained: no backend, no Supabase, no config needed. All
   keyword matching happens right here in the browser, and conversation
   history is kept in localStorage — same "fake backend" philosophy as
   mock-supabase.js elsewhere in this demo. Drop this one file into any
   page and it just works.
   ========================================================================= */
(function () {
  "use strict";

  // ---------- Keyword -> response data (from chat_keyword_responses.csv) ----------
  // Checked in this order — first keyword match wins.
  var RESPONSES = [
  {
    "keywords": [
      "combien de temps dure",
      "durée de la consultation",
      "how long does",
      "how long is",
      "consultation length",
      "consultation take"
    ],
    "fr": "Une consultation dure généralement de 30 à 45 minutes, mais nous prenons le temps nécessaire selon votre situation — rien n'est précipité.",
    "en": "A consultation typically lasts 30 to 45 minutes, but we take whatever time is needed based on your situation — nothing is rushed."
  },
  {
    "keywords": [
      "urgent",
      "urgence",
      "vient de mourir",
      "just passed",
      "just died",
      "emergency",
      "décès",
      "died"
    ],
    "fr": "Nous sommes vraiment désolés pour votre perte. Nous sommes là pour vous aider dès maintenant — appelez-nous au +1 (514) 000-0000, ou laissez-nous un message ici et un membre de notre équipe vous répondra rapidement.",
    "en": "We're so sorry for your loss. We're here to help right now — call us at +1 (514) 000-0000, or leave a message here and a member of our team will respond quickly."
  },
  {
    "keywords": [
      "bonjour",
      "allo",
      "salut",
      "hello",
      "hi",
      "hey",
      "bonsoir"
    ],
    "fr": "Bonjour, merci de nous écrire. Comment pouvons-nous vous aider aujourd'hui ?",
    "en": "Hello, thank you for reaching out. How can we help you today?"
  },
  {
    "keywords": [
      "heures",
      "horaire",
      "ouvert",
      "disponible",
      "hours",
      "when open",
      "availability"
    ],
    "fr": "Nous sommes disponibles pour les urgences en tout temps. Pour une question générale, notre équipe vous répond habituellement dans la journée.",
    "en": "We're available for urgent situations at any time. For general questions, our team usually responds within the day."
  },
  {
    "keywords": [
      "prix",
      "coût",
      "combien ça coûte",
      "combien coûte",
      "combien coûtent",
      "tarif",
      "cher",
      "price",
      "cost",
      "how much",
      "fees"
    ],
    "fr": "Les coûts varient selon le type de service et les options choisies. Nous établissons une estimation claire dès la première consultation, sans surprise. Réservez un moment gratuit ici : booking.html",
    "en": "Costs vary depending on the service and the options chosen. We put together a clear estimate at your very first consultation, no surprises. Book a free time here: booking.html"
  },
  {
    "keywords": [
      "rendez-vous",
      "consultation",
      "réserver",
      "booking",
      "appointment",
      "book",
      "schedule a",
      "meet with"
    ],
    "fr": "Vous pouvez réserver une consultation gratuite directement ici : booking.html — choisissez simplement un moment qui vous convient.",
    "en": "You can book a free consultation directly here: booking.html — just pick a time that works for you."
  },
  {
    "keywords": [
      "crémation",
      "cremation",
      "incinér"
    ],
    "fr": "Le choix entre crémation et inhumation dépend des volontés de votre proche, de vos convictions et de votre budget. Nous pouvons vous expliquer ce qu'implique chaque option.",
    "en": "Choosing cremation depends on the wishes of your loved one, your beliefs, and your budget. We can walk you through what it involves."
  },
  {
    "keywords": [
      "inhumation",
      "enterrement",
      "burial",
      "cemetery",
      "cimetière"
    ],
    "fr": "L'inhumation reste un choix courant et significatif pour bien des familles. Nous pouvons vous accompagner dans le choix d'un cimetière et d'une concession.",
    "en": "Burial remains a meaningful choice for many families. We can help you choose a cemetery and a plot."
  },
  {
    "keywords": [
      "documents",
      "papiers",
      "certificat",
      "paperwork",
      "what do i need",
      "id"
    ],
    "fr": "Généralement : une pièce d'identité, le numéro d'assurance sociale, la carte d'assurance maladie et le certificat de naissance du défunt. Nous vous fournissons une liste complète et personnalisée dès le début.",
    "en": "Generally: ID, social insurance number, health card, and birth certificate for the person who passed. We give you a complete, personalized checklist once we begin."
  },
  {
    "keywords": [
      "hors québec",
      "outside quebec",
      "autre province",
      "another province",
      "rapatriement",
      "repatriation",
      "died abroad",
      "étranger"
    ],
    "fr": "Oui, nous pouvons coordonner le rapatriement et les démarches nécessaires, peu importe où le décès est survenu.",
    "en": "Yes, we can coordinate repatriation and the necessary paperwork no matter where the death occurred."
  },
  {
    "keywords": [
      "où",
      "localisation",
      "région",
      "montréal",
      "secteur",
      "where are you",
      "area",
      "location",
      "service area"
    ],
    "fr": "Nous desservons les familles du Grand Montréal et de ses environs.",
    "en": "We serve families across Greater Montréal and the surrounding area."
  },
  {
    "keywords": [
      "téléphone",
      "numéro",
      "appeler",
      "phone",
      "call you",
      "call us"
    ],
    "fr": "Vous pouvez nous appeler directement au +1 (514) 000-0000.",
    "en": "You can call us directly at +1 (514) 000-0000."
  },
  {
    "keywords": [
      "courriel",
      "email",
      "e-mail"
    ],
    "fr": "Vous pouvez nous écrire à info@heritagedevie.ca",
    "en": "You can reach us by email at info@heritagedevie.ca"
  },
  {
    "keywords": [
      "deuil",
      "soutien",
      "grief",
      "support",
      "triste",
      "difficile",
      "sad",
      "struggling",
      "j'ai perdu",
      "je pleure",
      "je suis dévasté",
      "je suis dévastée",
      "dévastée",
      "dévasté",
      "brisé",
      "brisée",
      "coeur brisé",
      "cœur brisé",
      "i lost my",
      "i'm devastated",
      "i'm crying",
      "heartbroken",
      "broken hearted",
      "grieving",
      "my heart is broken",
      "this is so hard",
      "ça fait mal",
      "j'ai mal"
    ],
    "fr": "Je suis vraiment désolé pour ce que vous traversez. Prenez tout le temps dont vous avez besoin — nous sommes là pour vous accompagner, à votre rythme. Des ressources de soutien au deuil, gratuites et confidentielles, sont aussi disponibles sur notre page Ressources, notamment Info-Social 811, accessible 24 h/24.",
    "en": "I'm truly sorry for what you're going through. Take all the time you need — we're here to support you, at your own pace. Free, confidential grief support resources are also available on our Resources page, including Info-Social 811, available 24/7."
  },
  {
    "keywords": [
      "pré-arrangement",
      "prearrangement",
      "préplanifier",
      "plan ahead",
      "advance",
      "planifier à l'avance",
      "plan my own"
    ],
    "fr": "Oui, il est tout à fait possible de planifier — et même de payer — vos arrangements funéraires à l'avance. Contactez-nous pour en discuter sans engagement.",
    "en": "Yes, you can absolutely plan — and even pay for — your own funeral arrangements in advance. Contact us to talk it through, no obligation."
  },
  {
    "keywords": [
      "paiement",
      "facture",
      "payer",
      "solde",
      "payment",
      "invoice",
      "pay",
      "balance"
    ],
    "fr": "Les familles avec un dossier actif peuvent consulter leur facture et le solde dû directement dans leur Portail famille.",
    "en": "Families with an active file can view their invoice and balance due directly in their Family Portal."
  },
  {
    "keywords": [
      "emploi",
      "carrière",
      "travailler avec vous",
      "postuler",
      "job",
      "career",
      "work with you",
      "apply",
      "hiring"
    ],
    "fr": "Nous recrutons des coordonnateurs, photographes, traiteurs, chauffeurs et musiciens. Visitez notre page Carrières pour postuler.",
    "en": "We're recruiting coordinators, photographers, caterers, drivers, and musicians. Visit our Careers page to apply."
  },
  {
    "keywords": [
      "maison funéraire",
      "partenaire",
      "funeral home",
      "partner",
      "already have a funeral home"
    ],
    "fr": "Nous travaillons avec un réseau de maisons funéraires partenaires soigneusement sélectionnées. Si vous en avez déjà une en tête, nous pouvons aussi coordonner directement avec elle.",
    "en": "We work with a network of carefully selected partner funeral homes. If you already have one in mind, we're also happy to coordinate directly with them."
  },
  {
    "keywords": [
      "assurance",
      "insurance",
      "life insurance",
      "claim"
    ],
    "fr": "Nous pouvons vous aider à repérer les polices d'assurance vie et à entamer une réclamation. Notre page Ressources contient une liste de vérification complète pour les assurances.",
    "en": "We can help you locate life insurance policies and start a claim. Our Resources page has a full insurance checklist."
  },
  {
    "keywords": [
      "rrq",
      "rente",
      "pension",
      "retraite québec",
      "cpp",
      "pension plan"
    ],
    "fr": "Une prestation de décès du Régime de rentes du Québec (jusqu'à 2 500 $) pourrait être disponible, ainsi que d'autres rentes selon votre situation. Plus de détails sur notre page Ressources.",
    "en": "A Québec Pension Plan death benefit (up to $2,500) may be available, along with other pensions depending on your situation. More details on our Resources page."
  },
  {
    "keywords": [
      "services",
      "qu'est-ce que vous offrez",
      "what do you offer",
      "what services"
    ],
    "fr": "Nous offrons un accompagnement complet, de la première consultation jusqu'au suivi après les funérailles. Voir notre page Services pour tous les détails.",
    "en": "We offer full support from the first consultation through post-funeral follow-up. See our Services page for all the details."
  },
  {
    "keywords": [
      "forfait",
      "formule",
      "package",
      "packages",
      "bundle"
    ],
    "fr": "Nous proposons plusieurs forfaits selon vos besoins et votre budget. Consultez notre page Forfaits pour les comparer.",
    "en": "We offer several packages depending on your needs and budget. Check out our Packages page to compare them."
  },
  {
    "keywords": [
      "avis",
      "témoignage",
      "review",
      "reviews",
      "testimonial",
      "recommend"
    ],
    "fr": "Vous pouvez consulter les avis d'autres familles que nous avons accompagnées sur notre page Avis.",
    "en": "You can read what other families we've supported have said on our Reviews page."
  },
  {
    "keywords": [
      "merci",
      "thank you",
      "thanks",
      "merci beaucoup"
    ],
    "fr": "Avec plaisir. N'hésitez pas à nous écrire si vous avez d'autres questions.",
    "en": "You're very welcome. Feel free to reach out anytime with more questions."
  },
  {
    "keywords": [
      "parler à quelqu'un",
      "parler avec quelqu'un",
      "parler à une personne",
      "personne réelle",
      "vraie personne",
      "humain",
      "speak to someone",
      "speak with someone",
      "talk to someone",
      "talk with someone",
      "talk to a human",
      "talk with a human",
      "real person",
      "human agent",
      "can i speak",
      "can i talk",
      "puis-je parler"
    ],
    "fr": "Bien sûr — un membre de notre équipe peut vous répondre directement ici, ou vous pouvez nous appeler au +1 (514) 000-0000.",
    "en": "Of course — a member of our team can respond to you directly right here, or you can call us at +1 (514) 000-0000."
  },
  {
    "keywords": [
      "faq",
      "questions fréquentes",
      "frequently asked",
      "common questions"
    ],
    "fr": "Consultez notre page FAQ pour les réponses aux questions les plus courantes.",
    "en": "Check out our FAQ page for answers to the most common questions."
  },
  {
    "keywords": [
      "que faire",
      "quoi faire",
      "what to do",
      "first steps",
      "where do i start",
      "où commencer"
    ],
    "fr": "Prenez le temps qu'il vous faut — au Québec, il n'y a pas de délai légal strict pour organiser des funérailles. Notre page Ressources explique clairement les premières étapes.",
    "en": "Take the time you need — in Quebec, there's no strict legal deadline to hold a funeral. Our Resources page walks through the first steps clearly."
  },
  {
    "keywords": [
      "coordonnateur",
      "coordinator",
      "who will help me",
      "mon dossier",
      "my file"
    ],
    "fr": "Chaque famille est accompagnée par un coordonnateur dédié tout au long du processus. Vous pouvez suivre l'échéancier et communiquer avec votre coordonnateur directement dans votre Portail famille.",
    "en": "Each family is supported by a dedicated coordinator throughout the process. You can follow your timeline and message your coordinator directly in your Family Portal."
  },
  {
    "keywords": [
      "photographe",
      "photographer",
      "photos"
    ],
    "fr": "Sur demande, nous pouvons organiser un(e) photographe pour capturer la cérémonie avec discrétion et respect.",
    "en": "On request, we can arrange a photographer to capture the ceremony with discretion and respect."
  },
  {
    "keywords": [
      "traiteur",
      "réception",
      "caterer",
      "catering",
      "reception"
    ],
    "fr": "Nous pouvons coordonner un traiteur pour la réception suivant la cérémonie, adapté à vos préférences et traditions.",
    "en": "We can coordinate a caterer for the reception following the ceremony, tailored to your preferences and traditions."
  },
  {
    "keywords": [
      "portail",
      "mon compte",
      "login",
      "portal",
      "my account",
      "sign in"
    ],
    "fr": "Le Portail famille vous permet de suivre l'échéancier, consulter les documents et la facture. Vous pouvez y accéder ici : portal.html",
    "en": "The Family Portal lets you follow your timeline and view documents and your invoice. You can access it here: portal.html"
  },
  {
    "keywords": [
      "faire moi-même",
      "le faire seul",
      "pas besoin de vous",
      "gratuit",
      "pourquoi vous payer",
      "do it myself",
      "do this myself",
      "why would i use you",
      "why use you",
      "i can do it myself",
      "for free",
      "on my own"
    ],
    "fr": "Vous avez tout à fait raison : vous pouvez organiser des funérailles vous-même, ce n'est pas obligatoire de passer par nous. Cela dit, la plupart des familles trouvent ça accablant de tout gérer seules en plein deuil — les papiers, les appels aux maisons funéraires, la coordination des fournisseurs, les délais. Notre rôle, c'est de porter cette charge à votre place, pour que vous puissiez vous concentrer sur votre famille plutôt que sur la logistique. La première consultation est gratuite, sans engagement — ça vaut peut-être la peine de voir ce que ça change concrètement.",
    "en": "You're absolutely right — you can arrange a funeral entirely on your own, there's no requirement to use us. That said, most families find it overwhelming to manage everything alone while grieving: the paperwork, the calls to funeral homes, coordinating vendors, the deadlines. Our role is to take that off your plate, so you can focus on your family instead of logistics. The first consultation is free with no obligation — might be worth seeing what it actually changes for you."
  },
  {
    "keywords": [
      "bilingue",
      "langue",
      "anglais",
      "français",
      "parlez-vous",
      "bilingual",
      "language",
      "do you speak",
      "speak english"
    ],
    "fr": "Oui, notre équipe vous accompagne en français et en anglais, selon votre préférence.",
    "en": "Yes, our team supports you in both French and English, whichever you prefer."
  },
  {
    "keywords": [
      "paiement",
      "carte de crédit",
      "virement",
      "comptant",
      "mode de paiement",
      "credit card",
      "payment method",
      "e-transfer",
      "interac",
      "how do i pay"
    ],
    "fr": "Nous acceptons plusieurs modes de paiement — nous en discutons ensemble lors de la consultation selon ce qui vous convient le mieux.",
    "en": "We accept several payment methods — we'll go over what works best for you during the consultation."
  },
  {
    "keywords": [
      "dépôt",
      "acompte",
      "deposit",
      "down payment",
      "upfront"
    ],
    "fr": "Certains arrangements peuvent nécessiter un dépôt, mais cela dépend du service choisi. Nous vous expliquons tout clairement avant toute décision.",
    "en": "Some arrangements may require a deposit, but it depends on the service chosen. We explain everything clearly before you commit to anything."
  },
  {
    "keywords": [
      "processus",
      "étapes",
      "comment ça marche",
      "déroulement",
      "process",
      "steps",
      "how does it work",
      "what happens next"
    ],
    "fr": "En bref : vous nous contactez (par ici, par téléphone ou en réservant une consultation), nous discutons de vos besoins, puis nous coordonnons tout avec les fournisseurs et la maison funéraire choisie, en vous tenant informés à chaque étape via votre Portail famille.",
    "en": "In short: you reach out (here, by phone, or by booking a consultation), we talk through your needs, then we coordinate everything with vendors and the chosen funeral home, keeping you updated at every step through your Family Portal."
  },
  {
    "keywords": [
      "pas les moyens",
      "ne peux pas payer",
      "aide financière",
      "financial assistance",
      "can't afford",
      "no money",
      "budget serré",
      "low budget"
    ],
    "fr": "Nous comprenons que le budget est une préoccupation réelle. Parlons-en ensemble — nous pouvons explorer les options qui respectent vos moyens, incluant des programmes d'aide financière possibles.",
    "en": "We understand budget is a real concern. Let's talk it through together — we can explore options that fit your means, including possible financial assistance programs."
  },
  {
    "keywords": [
      "nécrologie",
      "avis de décès",
      "rédiger",
      "obituary",
      "write an obituary",
      "death notice"
    ],
    "fr": "Nous pouvons vous aider à rédiger la nécrologie, ou vous mettre en contact avec quelqu'un qui peut le faire avec vous.",
    "en": "We can help you write the obituary, or connect you with someone who can help put it together."
  },
  {
    "keywords": [
      "fleurs",
      "fleuriste",
      "flowers",
      "florist"
    ],
    "fr": "Nous pouvons coordonner les arrangements floraux pour la cérémonie selon vos préférences.",
    "en": "We can coordinate floral arrangements for the ceremony based on your preferences."
  },
  {
    "keywords": [
      "différence",
      "pourquoi pas directement",
      "maison funéraire directement",
      "how are you different",
      "why not just a funeral home",
      "what's the difference"
    ],
    "fr": "Une maison funéraire s'occupe des soins et de la cérémonie. Nous, nous sommes votre point de contact unique qui coordonne tout — maison funéraire, fournisseurs, documents, échéancier — pour vous éviter d'avoir à gérer plusieurs intervenants seul(e).",
    "en": "A funeral home handles the care and the ceremony itself. We're your single point of contact who coordinates everything around it — the funeral home, vendors, paperwork, timeline — so you're not managing several parties on your own."
  },
  {
    "keywords": [
      "licence",
      "certifié",
      "fiable",
      "légitime",
      "arnaque",
      "licensed",
      "certified",
      "legit",
      "trustworthy",
      "scam",
      "reputable"
    ],
    "fr": "C'est une question tout à fait légitime à poser. Nous travaillons avec un réseau de maisons funéraires licenciées et établies au Québec — nous serions heureux de répondre à toute question sur notre fonctionnement lors d'un appel.",
    "en": "That's a completely fair question to ask. We work with a network of licensed, established funeral homes across Quebec — happy to answer anything about how we operate on a call."
  },
  {
    "keywords": [
      "vétéran",
      "militaire",
      "ancien combattant",
      "veteran",
      "military",
      "armed forces"
    ],
    "fr": "D'anciens combattants peuvent avoir droit à des prestations funéraires spécifiques. Parlons-en pour vérifier votre admissibilité.",
    "en": "Veterans may be eligible for specific funeral benefits. Let's talk it through to check your eligibility."
  },
  {
    "keywords": [
      "écologique",
      "vert",
      "inhumation naturelle",
      "green burial",
      "eco-friendly",
      "natural burial",
      "environmentally friendly"
    ],
    "fr": "Des options plus écologiques existent, comme l'inhumation naturelle. Nous pouvons vous présenter ce qui est disponible dans la région.",
    "en": "More eco-friendly options do exist, like natural/green burial. We can walk you through what's available in the area."
  },
  {
    "keywords": [
      "annuler",
      "changer mon rendez-vous",
      "reschedule",
      "cancel my appointment",
      "change my booking",
      "modifier"
    ],
    "fr": "Pas de problème. Contactez-nous directement au +1 (514) 000-0000 ou par courriel, et nous ajusterons votre rendez-vous.",
    "en": "No problem. Contact us directly at +1 (514) 000-0000 or by email, and we'll adjust your appointment."
  },
  {
    "keywords": [
      "don d'organes",
      "don de corps",
      "organ donation",
      "body donation",
      "donate organs"
    ],
    "fr": "C'est une décision personnelle importante, souvent déjà indiquée sur la carte d'assurance maladie ou dans les volontés du défunt. Nous pouvons vous guider sur les démarches à suivre si c'est le cas.",
    "en": "That's an important personal decision, often already indicated on the health card or in the deceased's wishes. We can guide you through the next steps if that applies."
  },
  {
    "keywords": [
      "hors province",
      "autre province canadienne",
      "outside the province",
      "another province",
      "out of province",
      "do you serve other provinces"
    ],
    "fr": "Notre service principal couvre le Grand Montréal et ses environs, au Québec. Si votre situation implique une autre province, contactez-nous directement — nous pourrons voir ensemble ce qu'il est possible de coordonner pour vous.",
    "en": "Our primary service area is Greater Montréal and the surrounding region in Quebec. If your situation involves another province, reach out to us directly — we can look together at what we're able to coordinate for you."
  },
  {
    "keywords": [
      "limousine",
      "limo",
      "service de transport",
      "transport pour la famille",
      "limousine service",
      "car service",
      "transportation for family"
    ],
    "fr": "Nous pouvons coordonner le transport pour la famille, incluant une limousine selon la disponibilité de nos fournisseurs partenaires — ce service est notamment inclus dans notre Forfait Héritage. Contactez-nous pour vérifier les options disponibles pour votre situation.",
    "en": "We can coordinate transportation for the family, including a limousine depending on availability from our partner providers — this is included in our Legacy Premium package specifically. Contact us to check what's available for your situation."
  },
  {
    "keywords": [
      "es-tu un robot",
      "êtes-vous un robot",
      "is this a bot",
      "are you a robot",
      "are you real",
      "is this real",
      "human or bot",
      "ai or human",
      "talking to a bot"
    ],
    "fr": "Je suis un assistant automatisé qui répond aux questions courantes — mais une vraie personne de notre équipe peut prendre le relais en tout temps si vous préférez.",
    "en": "I'm an automated assistant that answers common questions — but a real person from our team can step in anytime you'd prefer."
  },
  {
    "keywords": [
      "qui es-tu",
      "c'est qui",
      "who are you",
      "what's your name",
      "quel est ton nom"
    ],
    "fr": "Je suis l'assistant de clavardage d'Héritage de Vie. Comment puis-je vous aider aujourd'hui ?",
    "en": "I'm Héritage de Vie's chat assistant. How can I help you today?"
  },
  {
    "keywords": [
      "raconte une blague",
      "dis une blague",
      "tell me a joke",
      "make me laugh",
      "know any jokes"
    ],
    "fr": "Je suis surtout ici pour répondre à vos questions sur nos services. Puis-je vous aider avec quelque chose en particulier ?",
    "en": "I'm mainly here to help with questions about our services. Is there something specific I can help you with?"
  },
  {
    "keywords": [
      "es-tu vivant",
      "tu dors",
      "tu manges",
      "are you alive",
      "do you sleep",
      "do you eat",
      "are you a person"
    ],
    "fr": "Je suis un programme automatisé, donc pas tout à fait ! Notre équipe, elle, est bien réelle et disponible pour vous aider.",
    "en": "I'm an automated program, so not quite! Our team, though, is very real and available to help."
  },
  {
    "keywords": [
      "quel âge as-tu",
      "how old are you",
      "your age"
    ],
    "fr": "Je n'ai pas vraiment d'âge — je suis simplement un outil pour répondre à vos questions. Puis-je vous aider avec autre chose ?",
    "en": "I don't really have an age — I'm just a tool to help answer your questions. Can I help you with something else?"
  },
  {
    "keywords": [
      "rabais",
      "négocier",
      "réduction",
      "meilleur prix",
      "discount",
      "negotiate",
      "better deal",
      "best price",
      "can you lower"
    ],
    "fr": "Les tarifs sont discutés directement avec notre équipe selon vos besoins précis. Réservez une consultation gratuite pour en parler : booking.html",
    "en": "Pricing is worked out directly with our team based on your specific needs. Book a free consultation to talk it through: booking.html"
  },
  {
    "keywords": [
      "quel temps fait-il",
      "météo",
      "weather",
      "what's the weather",
      "how's the weather"
    ],
    "fr": "Je ne peux pas vous aider avec ça, mais je suis là pour vos questions sur nos services. Puis-je vous aider avec quelque chose de précis ?",
    "en": "I can't help with that one, but I'm here for questions about our services. Can I help you with something specific?"
  },
  {
    "keywords": [
      "es-tu célibataire",
      "tu m'aimes",
      "are you single",
      "do you like me",
      "marry me",
      "flirt"
    ],
    "fr": "Je suis ici strictement pour vous aider avec vos questions concernant nos services. Comment puis-je vous être utile ?",
    "en": "I'm here strictly to help with questions about our services. How can I assist you?"
  },
  {
    "keywords": [
      "sens de la vie",
      "meaning of life",
      "what is the meaning of life",
      "why are we here"
    ],
    "fr": "C'est une grande question ! Je peux surtout vous aider avec celles liées à nos services de coordination funéraire.",
    "en": "That's a big question! I'm mainly able to help with the ones related to our funeral coordination services."
  },
  {
    "keywords": [
      "ceci fonctionne",
      "ça marche",
      "just testing",
      "is this working",
      "does this work",
      "test test"
    ],
    "fr": "👋 Oui, ça fonctionne ! N'hésitez pas à poser une vraie question, ou un membre de notre équipe peut vous répondre directement.",
    "en": "👋 Yes, this is working! Feel free to ask a real question, or a member of our team can reply to you directly."
  },
  {
    "keywords": [
      "fuck",
      "fucking",
      "shit",
      "bullshit",
      "asshole",
      "bitch",
      "goddamn",
      "wtf",
      "stfu",
      "tabarnak",
      "tabarnac",
      "câlisse",
      "calisse",
      "criss",
      "crisse",
      "esti",
      "estie",
      "osti",
      "ostie",
      "ciboire",
      "sacrament",
      "câliss"
    ],
    "fr": "Je comprends que ce moment puisse être difficile. Un membre de notre équipe peut vous parler directement — appelez-nous au +1 (514) 000-0000, ou je peux les avertir pour qu'ils vous répondent ici.",
    "en": "I understand this can be a genuinely hard moment. A member of our team can speak with you directly — call us at +1 (514) 000-0000, or I can let them know to reply to you here."
  },
  {
    "keywords": [
      "je t'aime",
      "je vous aime",
      "on vous aime",
      "nous vous aimons",
      "i love you",
      "we love you",
      "love this",
      "love your service",
      "love your site",
      "love you guys"
    ],
    "fr": "C'est très gentil, merci ! Nous sommes contents de pouvoir vous aider. Comment puis-je vous être utile aujourd'hui ?",
    "en": "That's very kind, thank you! We're glad we can help. How can I assist you today?"
  }
];

  var FALLBACK = {
    fr: "Merci pour votre message ! Je n'ai pas de réponse précise pour ça, mais un membre de notre équipe peut vous répondre directement — n'hésitez pas à laisser plus de détails, ou appelez-nous au +1 (514) 000-0000.",
    en: "Thanks for your message! I don't have a specific answer for that, but a member of our team can help directly — feel free to add more detail, or call us at +1 (514) 000-0000."
  };

  var HISTORY_KEY = "hdv_chat_history";
  var NAME_KEY = "hdv_chat_visitor_name";

  function getLang() {
    var l = "fr";
    try { l = localStorage.getItem("hdv-lang") || document.documentElement.getAttribute("lang") || "fr"; } catch (e) {}
    return l === "en" ? "en" : "fr";
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
  // a larger word (so "hi" matches "hi there" but not "this"). Works for
  // both single words and multi-word phrases the same way, since the
  // boundary check only applies to the very start/end of the keyword.
  function containsKeyword(text, keyword) {
    var escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    var re = new RegExp("(^|[^a-zA-Z\u00C0-\u00FF])" + escaped + "([^a-zA-Z\u00C0-\u00FF]|$)", "i");
    return re.test(text);
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

  // ---------- Markup (unchanged from the original widget design) ----------
  var wrap = document.createElement("div");
  wrap.id = "hdv-chat-widget";
  wrap.innerHTML =
    '<style>' +
    '#hdv-chat-widget{position:fixed;bottom:22px;right:22px;z-index:9999;font-family:"Jost",sans-serif;}' +
    '#hdv-chat-bubble{width:58px;height:58px;border-radius:50%;background:var(--ink,#2B2A28);box-shadow:0 4px 16px rgba(0,0,0,.25);' +
    'display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;}' +
    '#hdv-chat-bubble svg{width:26px;height:26px;fill:var(--gold,#B08D49);}' +
    '#hdv-chat-badge{position:absolute;top:-4px;right:-4px;background:#a8402d;color:#fff;border-radius:10px;font-size:11px;padding:1px 6px;}' +
    '#hdv-chat-panel{position:fixed;bottom:90px;right:22px;width:330px;max-width:90vw;height:440px;max-height:70vh;background:#fff;' +
    'border-radius:12px;box-shadow:0 10px 34px rgba(0,0,0,.25);display:none;flex-direction:column;overflow:hidden;}' +
    '#hdv-chat-panel.open{display:flex;}' +
    '#hdv-chat-head{background:var(--ink,#2B2A28);color:#fff;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;}' +
    '#hdv-chat-head span{font-size:.95rem;font-weight:500;}' +
    '#hdv-chat-close{background:none;border:0;color:#fff;font-size:18px;cursor:pointer;line-height:1;}' +
    '#hdv-chat-body{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;background:#faf8f4;}' +
    '.hdv-msg{max-width:80%;padding:8px 12px;border-radius:12px;font-size:.88rem;line-height:1.4;white-space:pre-wrap;}' +
    '.hdv-msg.visitor{align-self:flex-end;background:var(--gold,#B08D49);color:#fff;border-bottom-right-radius:3px;}' +
    '.hdv-msg.staff,.hdv-msg.auto,.hdv-msg.system{align-self:flex-start;background:#fff;border:1px solid var(--line,#ddd4c5);border-bottom-left-radius:3px;}' +
    '.hdv-msg.typing{color:#9a9488;font-style:italic;}' +
    '#hdv-chat-namebar{padding:8px 10px;border-bottom:1px solid var(--line,#ddd4c5);}' +
    '#hdv-chat-namebar input{width:100%;border:1px solid var(--line,#ddd4c5);border-radius:6px;padding:6px 9px;font-size:.82rem;font-family:inherit;}' +
    '#hdv-chat-inputbar{display:flex;gap:6px;padding:10px;border-top:1px solid var(--line,#ddd4c5);}' +
    '#hdv-chat-input{flex:1;border:1px solid var(--line,#ddd4c5);border-radius:18px;padding:8px 13px;font-size:.88rem;font-family:inherit;outline:none;}' +
    '#hdv-chat-send{background:var(--gold,#B08D49);border:0;color:#fff;border-radius:50%;width:34px;height:34px;cursor:pointer;flex-shrink:0;}' +
    '#hdv-chat-chips{display:flex;flex-wrap:wrap;gap:6px;align-self:flex-start;max-width:100%;}' +
    '.hdv-chip{border:1px solid var(--gold,#B08D49);color:var(--gold-deep,#927235);background:#fff;border-radius:16px;padding:6px 12px;font-size:.8rem;cursor:pointer;font-family:inherit;}' +
    '.hdv-chip:hover{background:var(--gold,#B08D49);color:#fff;}' +
    '</style>' +
    '<div id="hdv-chat-bubble">' +
      '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>' +
    '</div>' +
    '<div id="hdv-chat-panel">' +
      '<div id="hdv-chat-head"><span data-lang="fr">Discuter avec nous</span><span data-lang="en">Chat with us</span><button id="hdv-chat-close" aria-label="Close">\u00d7</button></div>' +
      '<div id="hdv-chat-namebar"><input type="text" id="hdv-chat-name" placeholder="Votre nom (optionnel) / Your name (optional)"></div>' +
      '<div id="hdv-chat-body"></div>' +
      '<div id="hdv-chat-inputbar">' +
        '<input type="text" id="hdv-chat-input" placeholder="\u00c9crivez un message\u2026 / Write a message\u2026">' +
        '<button id="hdv-chat-send" aria-label="Send">\u27a4</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(wrap);

  var bubble = document.getElementById("hdv-chat-bubble");
  var panel = document.getElementById("hdv-chat-panel");
  var bodyEl = document.getElementById("hdv-chat-body");
  var inputEl = document.getElementById("hdv-chat-input");
  var sendBtn = document.getElementById("hdv-chat-send");
  var nameEl = document.getElementById("hdv-chat-name");
  var nameBar = document.getElementById("hdv-chat-namebar");
  var badge = null, badgeCount = 0;

  nameEl.value = visitorName;
  if (visitorName) nameBar.style.display = "none";

  function appendMsg(sender, text) {
    var el = document.createElement("div");
    el.className = "hdv-msg " + sender;
    el.textContent = text;
    bodyEl.appendChild(el);
    bodyEl.scrollTop = bodyEl.scrollHeight;
    return el;
  }

  function showBadge() {
    if (panel.classList.contains("open")) return;
    badgeCount += 1;
    if (!badge) { badge = document.createElement("div"); badge.id = "hdv-chat-badge"; bubble.appendChild(badge); }
    badge.textContent = String(badgeCount);
  }

  function showQuickReplies() {
    var lang = getLang();
    var chips = lang === "en"
      ? [
          { label: "\ud83d\udcb0 Pricing", action: "text", value: "How much does this cost?" },
          { label: "\ud83d\udcc5 Book a consultation", action: "link", value: "booking.html" },
          { label: "\ud83d\udccb Documents needed", action: "text", value: "What documents do I need?" },
          { label: "\ud83d\udcac Talk to a person", action: "text", value: "I would like to speak to someone." },
        ]
      : [
          { label: "\ud83d\udcb0 Prix", action: "text", value: "Combien \u00e7a co\u00fbte ?" },
          { label: "\ud83d\udcc5 R\u00e9server une consultation", action: "link", value: "booking.html" },
          { label: "\ud83d\udccb Documents requis", action: "text", value: "Quels documents dois-je pr\u00e9parer ?" },
          { label: "\ud83d\udcac Parler \u00e0 quelqu'un", action: "text", value: "J'aimerais parler \u00e0 quelqu'un." },
        ];
    var row = document.createElement("div");
    row.id = "hdv-chat-chips";
    chips.forEach(function (c) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "hdv-chip";
      btn.textContent = c.label;
      btn.addEventListener("click", function () {
        if (c.action === "link") { window.open(c.value, "_blank"); return; }
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
    history.forEach(function (m) { appendMsg(m.sender, m.text); });
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
      // Closing ends the chat, same as the original design intent — next
      // time the visitor opens it, they get a clean start rather than
      // picking back up mid-thread days later.
      resetConversation();
      return;
    }
    if (open) {
      var history = loadHistory();
      if (!history.length) {
        appendMsg("system", getLang() === "en"
          ? "Hi! Ask us anything \u2014 a real person can jump in anytime."
          : "Bonjour ! Posez-nous vos questions \u2014 une vraie personne peut intervenir en tout temps.");
        showQuickReplies();
      } else {
        renderHistory();
      }
    }
  }
  bubble.addEventListener("click", function () { openPanel(!panel.classList.contains("open")); });
  document.getElementById("hdv-chat-close").addEventListener("click", function () { openPanel(false); });

  function send() {
    var text = inputEl.value.trim();
    if (!text) return;
    var name = nameEl.value.trim();
    if (name) { try { localStorage.setItem(NAME_KEY, name); } catch (e) {} nameBar.style.display = "none"; }
    inputEl.value = "";

    appendMsg("visitor", text);
    var history = loadHistory();
    history.push({ sender: "visitor", text: text });
    saveHistory(history);

    sendBtn.disabled = true;
    var typingEl = appendMsg("auto typing", getLang() === "en" ? "..." : "...");

    // Small delay to feel like a real reply arriving, not an instant lookup.
    setTimeout(function () {
      typingEl.remove();
      var lang = getLang();
      var match = matchKeyword(text);
      var replyText = match ? match[lang] : FALLBACK[lang];
      appendMsg("auto", replyText);
      var h = loadHistory();
      h.push({ sender: "auto", text: replyText });
      saveHistory(h);
      sendBtn.disabled = false;
      if (!panel.classList.contains("open")) showBadge();
    }, 650);
  }
  sendBtn.addEventListener("click", send);
  inputEl.addEventListener("keydown", function (e) { if (e.key === "Enter") send(); });
})();
