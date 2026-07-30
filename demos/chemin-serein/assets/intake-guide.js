// Family Intake Guide structure — embedded into dashboard.html
// Each section: key, title (fr/en), script (fr/en, "what to say"), and fields.
// Field types: text, textarea, date, select (with options), radio, checkbox.
window.HDV_INTAKE = [
  {
    key: "intro",
    title: { fr: "Introduction", en: "Introduction" },
    script: {
      fr: "D'abord et avant tout, au nom de toute l'équipe d'Chemin Serein, je tiens à vous offrir nos plus sincères condoléances, à vous et à votre famille. Nous comprenons à quel point ce moment est difficile, et nous sommes profondément désolés pour votre perte.\n\n(Faites une pause. Laissez la personne parler. Ne précipitez rien.)\n\n« Avant de commencer, sachez que mon rôle est de rendre ce processus aussi simple que possible pour vous. Je vous guiderai à chaque étape, répondrai à vos questions et coordonnerai les arrangements en votre nom, afin que vous n'ayez pas à tout gérer seul(e). »",
      en: "First and foremost, on behalf of everyone at Chemin Serein, I would like to offer our deepest condolences to you and your family. We understand this is an incredibly difficult time, and we're truly sorry for your loss.\n\n(Pause. Let them speak. Don't rush.)\n\n\"Before we begin, I want you to know that my role is to make this process as easy as possible for you. I'll guide you through each step, answer your questions, and coordinate the arrangements on your behalf so you don't have to manage everything alone.\""
    },
    fields: []
  },
  {
    key: "contact",
    title: { fr: "1. Contact initial", en: "1. Initial Contact" },
    script: {
      fr: "« La conversation d'aujourd'hui sert simplement à comprendre les souhaits de votre famille et à recueillir les informations nécessaires pour commencer la planification. Si vous ne connaissez pas certaines réponses aujourd'hui, ce n'est pas grave — nous pourrons y revenir plus tard. »\n\n« J'aimerais commencer par comprendre où en sont les choses actuellement. »",
      en: "\"Today's conversation is simply to understand your family's wishes and gather the information we'll need to begin planning. If there are any questions you don't know today, that's completely okay — we can always come back to them later.\"\n\n\"I'd like to start by understanding where things currently stand.\""
    },
    fields: [
      { key:"contact_name", type:"text", label:{fr:"Nom du contact principal",en:"Primary contact full name"} },
      { key:"contact_relationship", type:"text", label:{fr:"Lien avec la personne décédée",en:"Relationship to the deceased"} },
      { key:"contact_phone", type:"text", label:{fr:"Téléphone",en:"Phone number"} },
      { key:"contact_email", type:"text", label:{fr:"Courriel",en:"Email address"} },
      { key:"contact_method", type:"select", label:{fr:"Méthode de contact préférée",en:"Preferred contact method"}, options:[{v:"phone",fr:"Téléphone",en:"Phone"},{v:"email",fr:"Courriel",en:"Email"},{v:"text",fr:"Texto",en:"Text"}] },
      { key:"contact_language", type:"select", label:{fr:"Langue préférée",en:"Preferred language"}, options:[{v:"fr",fr:"Français",en:"French"},{v:"en",fr:"Anglais",en:"English"},{v:"other",fr:"Autre",en:"Other"}] },
      { key:"passing_date", type:"date", label:{fr:"Date du décès",en:"Date of passing"} },
      { key:"passing_time", type:"text", label:{fr:"Heure du décès (optionnel)",en:"Time of passing (optional)"} },
      { key:"passing_place", type:"select", label:{fr:"Lieu du décès",en:"Place of passing"}, options:[{v:"hospital",fr:"Hôpital",en:"Hospital"},{v:"home",fr:"Domicile",en:"Home"},{v:"chsld",fr:"CHSLD",en:"CHSLD"},{v:"hospice",fr:"Maison de soins",en:"Hospice"},{v:"other",fr:"Autre",en:"Other"}] },
      { key:"fh_contacted", type:"radio", label:{fr:"Un salon funéraire a-t-il déjà été contacté ?",en:"Has a funeral home already been contacted?"}, options:[{v:"yes",fr:"Oui",en:"Yes"},{v:"no",fr:"Non",en:"No"}] },
      { key:"fh_name", type:"text", label:{fr:"Si oui, nom du salon funéraire",en:"If yes, funeral home name"} }
    ]
  },
  {
    key: "deceased",
    title: { fr: "2. Renseignements sur la personne décédée", en: "2. About the Deceased" },
    script: {
      fr: "Plutôt que de demander immédiatement des documents :\n\n« Pourriez-vous me parler un peu de votre proche ? »\n\n(Laissez la personne parler. Écoutez.)\n\nEnsuite : « Merci de partager cela avec moi. »",
      en: "Instead of immediately asking for paperwork:\n\n\"Could you tell me a little bit about your loved one?\"\n\n(Let them talk. Listen.)\n\nAfterwards: \"Thank you for sharing that with me.\""
    },
    fields: [
      { key:"legal_name", type:"text", label:{fr:"Nom légal complet",en:"Full legal name"} },
      { key:"maiden_name", type:"text", label:{fr:"Nom de jeune fille (si applicable)",en:"Maiden name (if applicable)"} },
      { key:"preferred_name", type:"text", label:{fr:"Nom préféré",en:"Preferred name"} },
      { key:"dob", type:"date", label:{fr:"Date de naissance",en:"Date of birth"} },
      { key:"birthplace", type:"text", label:{fr:"Lieu de naissance",en:"Place of birth"} },
      { key:"dod", type:"date", label:{fr:"Date du décès",en:"Date of death"} },
      { key:"deathplace", type:"text", label:{fr:"Lieu du décès",en:"Place of death"} },
      { key:"gender", type:"text", label:{fr:"Genre",en:"Gender"} },
      { key:"marital", type:"select", label:{fr:"État civil",en:"Marital status"}, options:[{v:"single",fr:"Célibataire",en:"Single"},{v:"married",fr:"Marié(e)",en:"Married"},{v:"widowed",fr:"Veuf/Veuve",en:"Widowed"},{v:"divorced",fr:"Divorcé(e)",en:"Divorced"}] },
      { key:"marriage_date", type:"date", label:{fr:"Date du mariage (si marié(e))",en:"Date of marriage (if married)"} },
      { key:"separation_date", type:"date", label:{fr:"Date de séparation/divorce (si applicable)",en:"Date of separation/divorce (if applicable)"} },
      { key:"mother_name", type:"text", label:{fr:"Nom complet de la mère",en:"Mother's full name"} },
      { key:"father_name", type:"text", label:{fr:"Nom complet du père",en:"Father's full name"} },
      { key:"ramq", type:"text", label:{fr:"Numéro d'assurance maladie (RAMQ) — optionnel",en:"Health insurance number (RAMQ) — optional"} },
      { key:"sin", type:"text", label:{fr:"NAS — optionnel",en:"SIN — optional"} }
    ]
  },
  {
    key: "wishes",
    title: { fr: "3. Souhaits funéraires", en: "3. Funeral Wishes" },
    script: {
      fr: "Transition : « J'aimerais maintenant mieux comprendre ce que votre famille souhaite, afin de vous recommander les meilleures options. »\n\nDemandez : Pensez-vous que votre proche aurait préféré l'inhumation ou la crémation ? Y avait-il une religion ou une foi importante pour lui/elle ? Souhaitez-vous quelque chose de traditionnel, simple, une célébration de vie, ou un rassemblement privé ?",
      en: "Transition: \"Now I'd like to better understand what your family is hoping for so we can recommend the best options.\"\n\nAsk: Do you feel your loved one would have preferred burial or cremation? Was there a religion or faith important to them? Would you like something traditional, simple, a celebration of life, or a private gathering?"
    },
    fields: [
      { key:"disposition", type:"radio", label:{fr:"Inhumation ou crémation",en:"Burial or cremation"}, options:[{v:"burial",fr:"Inhumation",en:"Burial"},{v:"cremation",fr:"Crémation",en:"Cremation"},{v:"undecided",fr:"Indécis",en:"Undecided"}] },
      { key:"religion", type:"select", label:{fr:"Religion",en:"Religion"}, options:[{v:"catholic",fr:"Catholique",en:"Catholic"},{v:"christian",fr:"Chrétienne",en:"Christian"},{v:"jewish",fr:"Juive",en:"Jewish"},{v:"muslim",fr:"Musulmane",en:"Muslim"},{v:"hindu",fr:"Hindoue",en:"Hindu"},{v:"none",fr:"Non religieuse",en:"Non-religious"},{v:"other",fr:"Autre",en:"Other"}] },
      { key:"ceremony", type:"select", label:{fr:"Type de cérémonie",en:"Ceremony"}, options:[{v:"traditional",fr:"Funérailles traditionnelles",en:"Traditional funeral"},{v:"celebration",fr:"Célébration de vie",en:"Celebration of life"},{v:"memorial",fr:"Service commémoratif",en:"Memorial service"},{v:"private",fr:"Service familial privé",en:"Private family service"},{v:"graveside",fr:"Au cimetière seulement",en:"Graveside only"}] },
      { key:"preferred_date", type:"date", label:{fr:"Date de service souhaitée (laisser vide si flexible)",en:"Preferred service date (leave blank if flexible)"} }
    ]
  },
  {
    key: "existing",
    title: { fr: "4. Arrangements existants", en: "4. Existing Arrangements" },
    script: {
      fr: "« Votre proche a-t-il déjà pris des arrangements funéraires à l'avance ? »\n\nSi oui : « Avez-vous le contrat ou savez-vous où il pourrait se trouver ? » « Un testament a-t-il été préparé ? »",
      en: "\"Did your loved one ever make funeral arrangements in advance?\"\n\nIf yes: \"Do you have the contract or know where it might be?\" \"Was there a Will prepared?\""
    },
    fields: [
      { key:"prearranged", type:"radio", label:{fr:"Funérailles préarrangées ?",en:"Funeral pre-arranged?"}, options:[{v:"yes",fr:"Oui",en:"Yes"},{v:"no",fr:"Non",en:"No"}] },
      { key:"prearranged_fh", type:"text", label:{fr:"Si oui, salon funéraire",en:"If yes, funeral home"} },
      { key:"contract_number", type:"text", label:{fr:"Numéro de contrat",en:"Contract number"} },
      { key:"will", type:"select", label:{fr:"Y a-t-il un testament ?",en:"Is there a Will?"}, options:[{v:"yes",fr:"Oui",en:"Yes"},{v:"no",fr:"Non",en:"No"},{v:"unknown",fr:"Ne sais pas",en:"Don't know"}] }
    ]
  },
  {
    key: "obituary",
    title: { fr: "5. Nécrologie", en: "5. Obituary" },
    script: {
      fr: "« Votre famille aimerait-elle que nous vous aidions à préparer la nécrologie ? »\n\nSi oui, expliquez que vous aurez besoin d'une photographie, d'une biographie, des membres de la famille et de souvenirs particuliers.",
      en: "\"Would your family like us to assist with preparing the obituary?\"\n\nIf yes, explain you'll need a photograph, biography, family members, and special memories."
    },
    fields: [
      { key:"obit_biography", type:"textarea", label:{fr:"Courte biographie",en:"Short biography"} },
      { key:"obit_occupation", type:"text", label:{fr:"Profession",en:"Occupation"} },
      { key:"obit_hobbies", type:"text", label:{fr:"Passe-temps",en:"Hobbies"} },
      { key:"obit_achievements", type:"textarea", label:{fr:"Réalisations",en:"Achievements"} },
      { key:"obit_organizations", type:"text", label:{fr:"Organisations",en:"Organizations"} },
      { key:"obit_military", type:"text", label:{fr:"Service militaire",en:"Military service"} },
      { key:"survived_by", type:"textarea", label:{fr:"Laisse dans le deuil (conjoint, enfants, petits-enfants, parents, fratrie…)",en:"Survived by (spouse, children, grandchildren, parents, siblings…)"} },
      { key:"predeceased_by", type:"textarea", label:{fr:"Précédé(e) par",en:"Predeceased by"} },
      { key:"obit_approver", type:"text", label:{fr:"Qui approuvera la nécrologie ?",en:"Who will approve the obituary?"} }
    ]
  },
  {
    key: "clothing",
    title: { fr: "6. Vêtements et effets personnels", en: "6. Clothing & Personal Effects" },
    script: {
      fr: "À aborder délicatement, lorsque la famille est prête : « Le moment venu, le salon funéraire pourrait avoir besoin de vêtements et de certains effets personnels. »",
      en: "Approach gently, when the family is ready: \"When the time comes, the funeral home may need clothing and some personal effects.\""
    },
    fields: [
      { key:"clothing", type:"textarea", label:{fr:"Vêtements et effets (sous-vêtements, chaussures, bijoux, lunettes, montre, chapelet, autres)",en:"Clothing & effects (undergarments, shoes, jewelry, glasses, watch, rosary, other)"} }
    ]
  },
  {
    key: "cemetery",
    title: { fr: "7. Cimetière", en: "7. Cemetery" },
    script: {
      fr: "« Votre famille possède-t-elle déjà un lot au cimetière ? »",
      en: "\"Does your family already have a plot at a cemetery?\""
    },
    fields: [
      { key:"has_plot", type:"radio", label:{fr:"Lot familial existant ?",en:"Existing family plot?"}, options:[{v:"yes",fr:"Oui",en:"Yes"},{v:"no",fr:"Non",en:"No"}] },
      { key:"cemetery_name", type:"text", label:{fr:"Nom du cimetière",en:"Cemetery name"} },
      { key:"plot_info", type:"text", label:{fr:"Renseignements sur le lot",en:"Plot information"} }
    ]
  },
  {
    key: "service",
    title: { fr: "8. Détails du service", en: "8. Service Details" },
    script: {
      fr: "« Pour bien planifier, j'aimerais avoir une idée de l'ampleur du service et de vos préférences. »",
      en: "\"To plan well, I'd like a sense of the size of the service and your preferences.\""
    },
    fields: [
      { key:"attendance", type:"select", label:{fr:"Nombre estimé de personnes",en:"Estimated attendance"}, options:[{v:"u25",fr:"Moins de 25",en:"Under 25"},{v:"25-50",fr:"25–50",en:"25–50"},{v:"50-100",fr:"50–100",en:"50–100"},{v:"100+",fr:"100+",en:"100+"}] },
      { key:"reception", type:"radio", label:{fr:"Réception après le service ?",en:"Reception afterward?"}, options:[{v:"yes",fr:"Oui",en:"Yes"},{v:"no",fr:"Non",en:"No"}] },
      { key:"livestream", type:"radio", label:{fr:"Diffusion en direct ?",en:"Live streaming?"}, options:[{v:"yes",fr:"Oui",en:"Yes"},{v:"no",fr:"Non",en:"No"}] },
      { key:"music", type:"textarea", label:{fr:"Demandes musicales",en:"Music requests"} },
      { key:"readings", type:"textarea", label:{fr:"Lectures particulières",en:"Special readings"} },
      { key:"special_requests", type:"textarea", label:{fr:"Demandes spéciales",en:"Special requests"} }
    ]
  },
  {
    key: "needs",
    title: { fr: "9. Besoins de la famille", en: "9. Family Needs" },
    script: {
      fr: "Posez cette question que beaucoup oublient :\n\n« En ce moment, quelle est votre plus grande préoccupation ? »\n\n(Ces réponses déterminent comment vous les aiderez : « Je ne sais pas quoi faire », « Nous nous inquiétons des coûts », « Nous ne savons pas quel salon funéraire », « Nous attendons la famille », « Nous avons besoin de transport ».)",
      en: "Ask something many people forget:\n\n\"Right now, what is your biggest concern?\"\n\n(These answers determine how you help: \"I don't know what to do,\" \"We're worried about costs,\" \"We don't know which funeral home,\" \"We're waiting for family,\" \"We need transportation.\")"
    },
    fields: [
      { key:"biggest_concern", type:"textarea", label:{fr:"Plus grande préoccupation de la famille",en:"Family's biggest concern"} },
      { key:"help_today", type:"textarea", label:{fr:"« De quoi avez-vous besoin aujourd'hui ? » (salon funéraire, transport, crémation, inhumation, fleurs, église, nécrologie, certificats, réception, programmes, diffusion, produits commémoratifs, ne sait pas par où commencer)",en:"\"What do you need help with today?\" (funeral home, transportation, cremation, burial, flowers, church, obituary, certificates, reception, programs, livestream, memorial products, unsure where to start)"} }
    ]
  },
  {
    key: "loved_one",
    title: { fr: "10. À propos de votre proche", en: "10. About Your Loved One" },
    script: {
      fr: "Ces questions ne sont pas habituelles dans les salons funéraires, mais elles rendent le service beaucoup plus personnel. Posez-les avec douceur — elles inspirent la nécrologie, le diaporama et la cérémonie.",
      en: "These questions aren't usual at funeral homes, but they make the service far more personal. Ask them gently — they inspire the obituary, slideshow, and ceremony."
    },
    fields: [
      { key:"nickname", type:"text", label:{fr:"Quel surnom lui donnait-on ?",en:"What nickname did everyone call them?"} },
      { key:"fav_song", type:"text", label:{fr:"Chanson préférée",en:"Favorite song"} },
      { key:"fav_flower", type:"text", label:{fr:"Fleur préférée",en:"Favorite flower"} },
      { key:"fav_color", type:"text", label:{fr:"Couleur préférée",en:"Favorite color"} },
      { key:"fav_hobby", type:"text", label:{fr:"Passe-temps préféré",en:"Favorite hobby"} },
      { key:"fav_meal", type:"text", label:{fr:"Repas préféré",en:"Favorite meal"} },
      { key:"fav_quote", type:"text", label:{fr:"Citation ou expression favorite",en:"Favorite quote or saying"} },
      { key:"made_smile", type:"textarea", label:{fr:"Qu'est-ce qui les faisait sourire ?",en:"What made them smile?"} },
      { key:"memory", type:"textarea", label:{fr:"Un souvenir que la famille aimerait que tous retiennent",en:"One memory the family would like everyone to remember"} },
      { key:"unique", type:"textarea", label:{fr:"Quelque chose d'unique à leur sujet",en:"Anything unique about them"} }
    ]
  },
  {
    key: "documents",
    title: { fr: "11. Documents à rassembler", en: "11. Documents to Gather" },
    script: {
      fr: "Ne demandez pas les documents de façon abrupte. Dites plutôt :\n\n« Au cours des prochains jours, nous rassemblerons ensemble quelques documents importants. Quand vous serez prêt(e), vous pourrez nous les transmettre. »\n\n(Cochez ce qui a été reçu. La famille n'a pas à tout fournir aujourd'hui.)",
      en: "Don't ask for documents abruptly. Instead say:\n\n\"Over the next few days, we'll work together to gather a few important documents. Whenever you're ready, you can send them to us.\"\n\n(Check off what's been received. The family doesn't have to provide everything today.)"
    },
    fields: [
      { key:"doc_death_cert", type:"radio", label:{fr:"Certificat de décès (si disponible)",en:"Death certificate (if available)"}, options:[{v:"received",fr:"Reçu",en:"Received"},{v:"pending",fr:"À venir",en:"Pending"}] },
      { key:"doc_will", type:"radio", label:{fr:"Testament",en:"Will"}, options:[{v:"received",fr:"Reçu",en:"Received"},{v:"pending",fr:"À venir",en:"Pending"},{v:"na",fr:"S/O",en:"N/A"}] },
      { key:"doc_contract", type:"radio", label:{fr:"Contrat funéraire préarrangé",en:"Pre-arranged funeral contract"}, options:[{v:"received",fr:"Reçu",en:"Received"},{v:"pending",fr:"À venir",en:"Pending"},{v:"na",fr:"S/O",en:"N/A"}] },
      { key:"doc_photo", type:"radio", label:{fr:"Photographie récente",en:"Recent photograph"}, options:[{v:"received",fr:"Reçue",en:"Received"},{v:"pending",fr:"À venir",en:"Pending"}] },
      { key:"doc_id", type:"radio", label:{fr:"Pièce d'identité gouvernementale",en:"Government identification"}, options:[{v:"received",fr:"Reçue",en:"Received"},{v:"pending",fr:"À venir",en:"Pending"}] },
      { key:"doc_marriage", type:"radio", label:{fr:"Certificat de mariage (optionnel)",en:"Marriage certificate (optional)"}, options:[{v:"received",fr:"Reçu",en:"Received"},{v:"pending",fr:"À venir",en:"Pending"},{v:"na",fr:"S/O",en:"N/A"}] },
      { key:"doc_military", type:"radio", label:{fr:"Papiers militaires (optionnel)",en:"Military papers (optional)"}, options:[{v:"received",fr:"Reçus",en:"Received"},{v:"pending",fr:"À venir",en:"Pending"},{v:"na",fr:"S/O",en:"N/A"}] },
      { key:"doc_notes", type:"textarea", label:{fr:"Notes sur les documents",en:"Notes on documents"} }
    ]
  },
  {
    key: "services_needed",
    title: { fr: "12. Services requis", en: "12. Services Needed" },
    script: {
      fr: "Cochez les services à coordonner pour cette famille. Après l'entrevue, vous pourrez générer automatiquement un mandat pour chaque service coché.",
      en: "Check the services to coordinate for this family. After the interview, you can auto-generate a job for each checked service."
    },
    fields: [
      { key:"svc_photographer", type:"radio", label:{fr:"Photographe",en:"Photographer"}, options:[{v:"yes",fr:"Requis",en:"Needed"},{v:"no",fr:"Non",en:"No"}] },
      { key:"svc_caterer", type:"radio", label:{fr:"Traiteur",en:"Caterer"}, options:[{v:"yes",fr:"Requis",en:"Needed"},{v:"no",fr:"Non",en:"No"}] },
      { key:"svc_flowers", type:"radio", label:{fr:"Fleurs",en:"Flowers"}, options:[{v:"yes",fr:"Requis",en:"Needed"},{v:"no",fr:"Non",en:"No"}] },
      { key:"svc_church", type:"radio", label:{fr:"Église / lieu de culte",en:"Church / place of worship"}, options:[{v:"yes",fr:"Requis",en:"Needed"},{v:"no",fr:"Non",en:"No"}] },
      { key:"svc_transport", type:"radio", label:{fr:"Transport",en:"Transportation"}, options:[{v:"yes",fr:"Requis",en:"Needed"},{v:"no",fr:"Non",en:"No"}] },
      { key:"svc_livestream", type:"radio", label:{fr:"Diffusion en direct",en:"Livestream"}, options:[{v:"yes",fr:"Requis",en:"Needed"},{v:"no",fr:"Non",en:"No"}] },
      { key:"svc_programs", type:"radio", label:{fr:"Programmes imprimés",en:"Printed programs"}, options:[{v:"yes",fr:"Requis",en:"Needed"},{v:"no",fr:"Non",en:"No"}] },
      { key:"svc_memorial", type:"radio", label:{fr:"Produits commémoratifs",en:"Memorial products"}, options:[{v:"yes",fr:"Requis",en:"Needed"},{v:"no",fr:"Non",en:"No"}] },
      { key:"svc_reception", type:"radio", label:{fr:"Réception",en:"Reception"}, options:[{v:"yes",fr:"Requis",en:"Needed"},{v:"no",fr:"Non",en:"No"}] },
      { key:"svc_obituary", type:"radio", label:{fr:"Nécrologie",en:"Obituary"}, options:[{v:"yes",fr:"Requis",en:"Needed"},{v:"no",fr:"Non",en:"No"}] }
    ]
  },
  {
    key: "closing",
    title: { fr: "Conclusion", en: "Closing" },
    script: {
      fr: "« Avant de terminer, y a-t-il quelque chose qui vous préoccupe ou des questions que vous aimeriez poser ? »\n\n(Faites une pause. Répondez.)\n\n« Merci de faire confiance à Chemin Serein en ces moments difficiles. À partir de maintenant, nous serons là pour vous guider à chaque étape. Si quelque chose vous vient à l'esprit plus tard, n'hésitez pas à nous contacter. Vous n'avez pas à traverser cette épreuve seul(e). »",
      en: "\"Before we finish, is there anything worrying you or any questions you'd like to ask?\"\n\n(Pause. Answer.)\n\n\"Thank you for trusting Chemin Serein during such a difficult time. From this point forward, we'll be here to guide you through every step. If anything comes to mind later, please don't hesitate to reach out. You don't have to go through this alone.\""
    },
    fields: []
  }
];
