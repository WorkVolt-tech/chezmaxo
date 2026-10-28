/* Hair by Lynna — privacy-safe, standalone interactive portfolio showcase.
   No imports, fetch, API keys, personal-data storage, emails or bank payments.
   All appointments and notifications below are simulated in this browser tab. */
(() => {
  'use strict';
  const words={
   en:{
    ribbon:'INTERACTIVE PORTFOLIO DEMO',fictional:'Fictional customers & sample payments · No live services connected',back:'Back to Chezmaxo portfolio',back2:'Chezmaxo portfolio',
    navBooking:'Customer booking',navStatus:'Booking status',navAdmin:'Owner dashboard',
    safetyNote:'Demo only: appointments, deposits, emails and notifications are simulated. Please do not enter real personal information.',
    heroEyebrow:'YOUR NEXT LOOK STARTS HERE',heroTitle:'Beautiful braids.',heroScript:'Thoughtful care.',
    heroLede:'A little luxury, just for you. Choose your style, pick a date and try our interactive booking experience.',
    heroCta:'EXPLORE BOOKING',bilingual:'Bilingual booking',clientPortal:'Private client portal',demoArt:'THE STUDIO EDIT',
    signature:'OUR SIGNATURE',styles:'BRAIDING STYLES',stylesNote:'Two example services with illustrative demo prices and appointment lengths.',
    bookingLabel:'YOUR BEAUTY, YOUR TIME',bookingTitle:'BOOK WITH LYNNA',bookingNote:'Select a sample service, date and time. No real appointment will be created.',
    pickService:'Choose a service',pickDate:'Choose a date',pickTime:'Choose a time',summary:'YOUR SELECTION',depositTitle:'$20 CAD deposit · Interac',
    depositInfo:'Requests are pending until the owner verifies the deposit and approves the appointment. This demo does not collect or transfer money.',
    sampleName:'Sample customer name',sampleEmail:'Example email (never sent)',fakeAgreement:'I understand this is an interactive demonstration, not a real booking.',tryBooking:'CREATE DEMO BOOKING',
    portalEyebrow:'CUSTOMER PORTAL',statusHeadline:'Track your appointment',
    statusIntro:"Review a fictional booking, mark a deposit as sent, and see how the owner's dashboard responds.",
    emailPreview:'Notification preview',emailExplainer:'Emails and Telegram notifications are simulated here. Nothing is actually sent.',
    adminEyebrow:'OWNER DASHBOARD · DEMO ACCESS',adminHeadline:'Salon management',adminIntro:'Approve requests, verify reported deposits, preview availability and view illustrative statistics.',
    tabAppointments:'Appointments',tabAvailability:'Availability',tabReports:'Statistics',footer:'— illustrative demo, developed for portfolio display',reset:'Reset demo',
    serviceKnots:'Miracle Knots',serviceBoho:'Boho Braids',descKnots:'Fine protective braids with a natural, polished finish.',descBoho:'Soft, textured braids with effortless curls.',
    chooseStyle:'Choose style',hour:'hr',dateEmpty:'Choose a date to see sample time slots.',selectDate:'Select a date',unavailable:'Unavailable',invalidSlot:'Please choose an available date and time.',selectedTime:'Time',available:'Available',
    bookingSaved:'Demo booking created!',bookingReference:'Reference',bookingNotice:'This is not a real appointment. No email or payment was sent.',viewStatus:'See booking status',
    pending:'Pending',approved:'Approved',declined:'Declined',cancelled:'Cancelled',completed:'Completed',depositNotSent:'Deposit not reported',depositReported:'Customer reported deposit sent — unverified',depositReceived:'Deposit verified by owner',
    reportSent:"I've sent my deposit",paidAction:'Confirm deposit received',approve:'Approve',decline:'Decline',cancel:'Cancel',complete:'Mark completed',move:'Move +1 day',statusLabel:'Booking status',
    upcoming:'Appointment',noRecords:'No sample appointments yet.',bookAnother:'Book another appointment',ownerOnly:'Owner controls — for demonstration only',
    depositStatus:'Deposit',notificationSubject:'Latest simulated notifications',noNotifications:'Actions in the demo will show example email and Telegram notices here.',
    sampleMessage:'Simulated booking notification',reportedMessage:'Customer says deposit SENT — CHECK INTERAC',approvedMessage:'Booking approved',declinedMessage:'Booking declined',cancelledMessage:'Booking cancelled',paidMessage:'Deposit confirmed',movedMessage:'Appointment rescheduled',
    verifiedInfo:'This changes the sample record only. No bank transaction is checked.',sampleCustomers:'Sample customers',activeRequests:'Active requests',receivedTotal:'Confirmed demo deposits',sampleServices:'Services',
    calendarControl:'Published demo dates',calendarText:'Toggle a sample date to change availability in the booking calendar. No real scheduling is affected.',enabled:'Open',disabled:'Closed',
    reportTitle:'Business overview',reportIntro:'Illustrative figures computed from fictional demo appointments, not a live report.',allBookings:'Total appointments',finished:'Completed',verifiedDeposits:'Deposits verified',
    localOnly:'Everything in this demo resets on refresh and never leaves your browser.',jan:'Jan',pickDayHint:'Available dates appear in pink. Calendar starts Sunday.',noDate:'Choose a service and date to get started.',
    errorComplete:'Only approved past appointments can be completed in the live app. This sample action marks it completed for exploration.',
    hours:'3 hours',resetMessage:'Demo reset to the original fictional sample records.',
    namePrompt:'Please use fictional information; this is a public demo.'
   },
   fr:{
    ribbon:'DÉMO INTERACTIVE DE PORTFOLIO',fictional:'Clients fictifs et paiements simulés · Aucun service réel connecté',back:'Retour au portfolio Chezmaxo',back2:'Portfolio Chezmaxo',
    navBooking:'Réservation',navStatus:'Suivi du rendez-vous',navAdmin:'Tableau de bord',
    safetyNote:'Démo seulement : les rendez-vous, dépôts, courriels et alertes sont simulés. N’entrez pas de vrais renseignements personnels.',
    heroEyebrow:'VOTRE PROCHAINE COIFFURE COMMENCE ICI',heroTitle:'De magnifiques tresses.',heroScript:'Des soins attentionnés.',
    heroLede:'Une touche de luxe, juste pour vous. Choisissez votre style, votre date et essayez le parcours de réservation interactif.',
    heroCta:'DÉCOUVRIR LA RÉSERVATION',bilingual:'Réservation bilingue',clientPortal:'Portail client privé',demoArt:'L’ÉDITION STUDIO',
    signature:'NOS CRÉATIONS',styles:'STYLES DE TRESSES',stylesNote:'Deux services fictifs avec des tarifs et durées donnés à titre d’exemple.',
    bookingLabel:'VOTRE BEAUTÉ, VOTRE MOMENT',bookingTitle:'RÉSERVER AVEC LYNNA',bookingNote:'Choisissez un service, une date et une heure fictifs. Aucun vrai rendez-vous ne sera créé.',
    pickService:'Choisissez une coiffure',pickDate:'Choisissez une date',pickTime:'Choisissez une heure',summary:'VOTRE SÉLECTION',depositTitle:'Dépôt de 20 $ CAD · Interac',
    depositInfo:'Une demande reste en attente jusqu’à la vérification du dépôt et à l’approbation de la propriétaire. Cette démo n’accepte aucun paiement.',
    sampleName:'Nom fictif du client',sampleEmail:'Courriel fictif (aucun envoi)',fakeAgreement:'Je comprends qu’il s’agit d’une démonstration, non d’une vraie réservation.',tryBooking:'CRÉER UN RENDEZ-VOUS FICTIF',
    portalEyebrow:'PORTAIL CLIENT',statusHeadline:'Suivre mon rendez-vous',
    statusIntro:'Consultez une réservation fictive, signalez un dépôt envoyé et observez la mise à jour dans le tableau de bord.',
    emailPreview:'Aperçu des notifications',emailExplainer:'Les courriels et alertes Telegram sont simulés. Aucun message n’est envoyé.',
    adminEyebrow:'TABLEAU DE BORD · ACCÈS DÉMO',adminHeadline:'Gestion du salon',adminIntro:'Approuvez des demandes, vérifiez des dépôts déclarés et consultez les disponibilités et statistiques fictives.',
    tabAppointments:'Rendez-vous',tabAvailability:'Disponibilités',tabReports:'Statistiques',footer:'— démonstration illustrative créée pour le portfolio',reset:'Réinitialiser',
    serviceKnots:'Nœuds Miracle',serviceBoho:'Tresses bohèmes',descKnots:'De fines tresses protectrices, naturelles et soignées.',descBoho:'Des tresses souples et texturées aux boucles légères.',
    chooseStyle:'Choisir',hour:'h',dateEmpty:'Choisissez une date pour voir les heures possibles.',selectDate:'Choisissez une date',unavailable:'Indisponible',invalidSlot:'Choisissez une date et une heure disponibles.',selectedTime:'Heure',available:'Disponible',
    bookingSaved:'Demande fictive enregistrée !',bookingReference:'Référence',bookingNotice:'Ce n’est pas un vrai rendez-vous. Aucun courriel ni paiement n’a été envoyé.',viewStatus:'Consulter le statut',
    pending:'En attente',approved:'Approuvé',declined:'Refusé',cancelled:'Annulé',completed:'Terminé',depositNotSent:'Aucun dépôt déclaré',depositReported:'Dépôt déclaré envoyé — non vérifié',depositReceived:'Dépôt vérifié par la propriétaire',
    reportSent:'J’ai envoyé mon dépôt',paidAction:'Confirmer la réception du dépôt',approve:'Approuver',decline:'Refuser',cancel:'Annuler',complete:'Marquer terminé',move:'Déplacer de +1 jour',statusLabel:'Statut',
    upcoming:'Rendez-vous',noRecords:'Aucun rendez-vous fictif pour le moment.',bookAnother:'Faire une autre réservation',ownerOnly:'Commandes de la propriétaire — démo seulement',
    depositStatus:'Dépôt',notificationSubject:'Dernières notifications simulées',noNotifications:'Les actions dans la démo afficheront ici des exemples de courriel et d’alerte Telegram.',
    sampleMessage:'Notification fictive de réservation',reportedMessage:'Le client déclare avoir envoyé le dépôt — VÉRIFIEZ INTERAC',approvedMessage:'Rendez-vous approuvé',declinedMessage:'Rendez-vous refusé',cancelledMessage:'Rendez-vous annulé',paidMessage:'Dépôt confirmé',movedMessage:'Rendez-vous déplacé',
    verifiedInfo:'Seul le dossier fictif est modifié. Aucun virement bancaire n’est vérifié.',sampleCustomers:'Clients fictifs',activeRequests:'Demandes actives',receivedTotal:'Dépôts fictifs confirmés',sampleServices:'Services',
    calendarControl:'Dates fictives publiées',calendarText:'Activez ou désactivez une date pour modifier les disponibilités affichées. Aucun vrai horaire n’est modifié.',enabled:'Ouvert',disabled:'Fermé',
    reportTitle:'Aperçu de l’entreprise',reportIntro:'Données illustratives provenant des rendez-vous fictifs, et non de véritables rapports.',allBookings:'Rendez-vous au total',finished:'Terminés',verifiedDeposits:'Dépôts confirmés',
    localOnly:'Tout est réinitialisé au rafraîchissement; aucune donnée ne quitte votre navigateur.',pickDayHint:'Les dates disponibles sont roses. La semaine commence dimanche.',noDate:'Choisissez un service et une date pour commencer.',
    errorComplete:'Sur le vrai site, seuls les rendez-vous approuvés et passés peuvent être terminés. Ici, l’action est illustrative.',resetMessage:'La démo a été réinitialisée avec les dossiers fictifs de départ.',
    namePrompt:'Utilisez des renseignements fictifs : cette démonstration est publique.'
   }
  };
  const $=id=>document.getElementById(id);
  const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const tr=k=>words[state.lang][k]||words.en[k]||k;
  const sampleServices=[
   {id:'knots',label:'serviceKnots',desc:'descKnots',price:160,duration:180},
   {id:'boho',label:'serviceBoho',desc:'descBoho',price:190,duration:210}
  ];
  const monToday=()=>{
   const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
   const n=k=>parts.find(p=>p.type===k)?.value||'01';
   return n('year')+'-'+n('month')+'-'+n('day');
  };
  const today=monToday();
  const addDays=(iso,n)=>{const d=new Date(iso+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)};
  const dateObj=iso=>new Date(iso+'T12:00:00Z');
  const prettyDate=iso=>new Intl.DateTimeFormat(state.lang==='fr'?'fr-CA':'en-CA',{dateStyle:'full',timeZone:'UTC'}).format(dateObj(iso));
  const money=n=>new Intl.NumberFormat(state.lang==='fr'?'fr-CA':'en-CA',{style:'currency',currency:'CAD',maximumFractionDigits:0}).format(n);
  const service=id=>sampleServices.find(s=>s.id===id)||sampleServices[0];
  const seed=()=>[
   {id:'LYN-DEMO-001',name:'Alex Demo',email:'alex@example.test',service:'knots',day:addDays(today,3),time:'10:00',status:'pending',reported:false,paid:false},
   {id:'LYN-DEMO-002',name:'Jamie Sample',email:'jamie@example.test',service:'boho',day:addDays(today,8),time:'13:30',status:'approved',reported:true,paid:false},
   {id:'LYN-DEMO-003',name:'Casey Example',email:'casey@example.test',service:'knots',day:addDays(today,-5),time:'11:00',status:'completed',reported:true,paid:true}
  ];
  const state={
   lang:'en',view:'customer',month:today.slice(0,7),service:'knots',
   day:null,time:null,appointments:seed(),notices:[],adminTab:'appointments',selectedRef:'LYN-DEMO-001',
   blocked:new Set(),nextId:4
  };
  const isOpen=iso=>{
   const d=dateObj(iso),dow=d.getUTCDay();
   return iso>=addDays(today,2)&&iso<=addDays(today,75)&&dow!==1&&!state.blocked.has(iso);
  };
  const times=iso=>{
   if(!iso||!isOpen(iso))return[];
   const dow=dateObj(iso).getUTCDay();
   const base=dow===0||dow===6?['09:00','12:30','15:30']:['09:00','10:00','13:30','16:00'];
   return base.filter(time=>!state.appointments.some(a=>a.day===iso&&a.time===time&&['pending','approved'].includes(a.status)));
  };
  const navigate=view=>{
    state.view=view;
    render();
    if(view==='customer') window.scrollTo({top:0,behavior:'smooth'});
    else window.scrollTo({top:0,behavior:'smooth'});
  };
  const tag=status=>'<span class="badge '+safe(status)+'">'+safe(tr(status))+'</span>';
  function renderStatic(){
   document.documentElement.lang=state.lang;
   document.title=(state.lang==='fr'?'Démo de réservation':'Booking demo')+' | Hair by Lynna · Chezmaxo';
   document.querySelectorAll('[data-t]').forEach(el=>{el.textContent=tr(el.dataset.t)});
   document.querySelectorAll('[data-action="lang"]').forEach(el=>{let sel=el.dataset.value===state.lang;el.classList.toggle('selected',sel);el.setAttribute('aria-pressed',sel?'true':'false')});
   document.querySelectorAll('[data-action="nav"]').forEach(el=>el.classList.toggle('selected',el.dataset.value===state.view));
   for(const v of ['customer','status','admin'])$(v+'-view').hidden=state.view!==v;
  }
  function renderServices(){
   $('service-cards').innerHTML=sampleServices.map((s,i)=>
    '<article class="service-card"><div class="service-art '+(i?'boho':'')+'">'+(i?'✧':'❧')+'</div>'+
    '<div class="service-card-body"><h3>'+safe(tr(s.label))+'</h3><p>'+safe(tr(s.desc))+'</p>'+
    '<div class="service-card-foot"><span>'+safe(money(s.price))+' · '+(s.duration/60)+' '+safe(tr('hour'))+'</span>'+
    '<button type="button" data-action="service" data-value="'+s.id+'" data-scroll="yes">'+safe(tr('chooseStyle'))+'</button></div></div></article>').join('');
   $('service-options').innerHTML=sampleServices.map(s=>
    '<button type="button" class="service-choice '+(state.service===s.id?'selected':'')+'" data-action="service" data-value="'+s.id+'">'+
    '<strong>'+safe(tr(s.label))+'</strong><small>'+safe(money(s.price))+' · '+(s.duration/60)+' '+safe(tr('hour'))+'</small></button>').join('');
  }
  function renderCalendar(){
   const [yy,mm]=state.month.split('-').map(Number);
   const monthDate=new Date(Date.UTC(yy,mm-1,1));
   $('calendar-month').textContent=new Intl.DateTimeFormat(state.lang==='fr'?'fr-CA':'en-CA',{month:'long',year:'numeric',timeZone:'UTC'}).format(monthDate);
   const labels=state.lang==='fr'?['D','L','M','M','J','V','S']:['S','M','T','W','T','F','S'];
   const offset=monthDate.getUTCDay(),length=new Date(Date.UTC(yy,mm,0)).getUTCDate();
   let html=labels.map((n,i)=>'<span class="weekday" key="'+i+'">'+n+'</span>').join('');
   html+='<span class="day-spacer"></span>'.repeat(offset);
   for(let i=1;i<=length;i++){
    const day=state.month+'-'+String(i).padStart(2,'0'),open=isOpen(day);
    html+='<button type="button" class="day '+(state.day===day?'selected':'')+'" data-action="day" data-value="'+day+'"'+(open?'':' disabled')+' aria-label="'+safe(day)+'">'+i+'</button>';
   }
   $('calendar-grid').innerHTML=html;
   const list=times(state.day);
   $('time-slots').innerHTML=list.length?list.map(time=>
    '<button type="button" class="slot '+(state.time===time?'selected':'')+'" data-action="time" data-value="'+time+'">'+time+'</button>').join(''):
    '<p class="muted">'+safe(tr(state.day?'unavailable':'dateEmpty'))+'</p>';
   $('summary-service').textContent=tr(service(state.service).label);
   $('summary-day').textContent=state.day?prettyDate(state.day)+(state.time?' · '+state.time:''):tr('noDate');
   $('booking-submit').disabled=!(state.day&&state.time);
  }
  function renderStatus(){
   $('status-card').innerHTML='<h2>'+safe(tr('upcoming'))+'</h2>'+
    state.appointments.map(a=>'<article class="status-item">'+
      '<div class="status-item-head"><strong>'+safe(a.id)+'</strong>'+tag(a.status)+'</div>'+
      '<p class="muted">'+safe(a.name)+' · '+safe(tr(service(a.service).label))+'</p>'+
      '<p>'+safe(prettyDate(a.day))+' · '+safe(a.time)+'</p>'+
      '<p><strong>'+safe(tr('depositStatus'))+':</strong> '+safe(tr(a.paid?'depositReceived':a.reported?'depositReported':'depositNotSent'))+'</p>'+
      (!a.paid&&['pending','approved'].includes(a.status)?
       '<div class="status-action"><button type="button" class="btn btn-primary" data-action="report" data-value="'+safe(a.id)+'"'+(a.reported?' disabled':'')+'>'+
         safe(tr(a.reported?'depositReported':'reportSent'))+'</button></div>':'')+
      '</article>').join('')+
    '<p class="muted">'+safe(tr('localOnly'))+'</p><div class="status-action"><button type="button" class="btn btn-secondary" data-action="nav" data-value="customer">'+safe(tr('bookAnother'))+'</button></div>';
   $('preview-feed').innerHTML=state.notices.length?state.notices.slice(0,6).map(n=>
    '<div class="preview-item"><strong>'+safe(n.channel)+': '+safe(tr(n.type))+'</strong>'+
      '<small>'+safe(n.ref)+' · '+safe(n.name)+'</small></div>').join(''):
      '<p class="muted">'+safe(tr('noNotifications'))+'</p>';
  }
  function renderAdmin(){
   document.querySelectorAll('[data-action="admin-tab"]').forEach(el=>el.classList.toggle('selected',el.dataset.value===state.adminTab));
   const total=state.appointments.length,active=state.appointments.filter(a=>['pending','approved'].includes(a.status)).length;
   const paid=state.appointments.filter(a=>a.paid).length;
   const kpis='<div class="kpi-grid">'+[
    [tr('allBookings'),total],[tr('activeRequests'),active],[tr('receivedTotal'),money(paid*20)],[tr('sampleServices'),sampleServices.length]
   ].map(([label,value])=>'<div class="kpi"><span>'+safe(label)+'</span><strong>'+safe(value)+'</strong></div>').join('')+'</div>';
   if(state.adminTab==='appointments'){
    $('admin-content').innerHTML=kpis+'<div class="admin-list">'+state.appointments.map(a=>{
      const active=['pending','approved'].includes(a.status);
      let acts=active?'<div class="admin-controls">'+
       (a.status==='pending'?'<button class="btn btn-primary" data-action="approve" data-value="'+a.id+'">'+safe(tr('approve'))+'</button><button class="btn btn-danger" data-action="decline" data-value="'+a.id+'">'+safe(tr('decline'))+'</button>':'')+
       (!a.paid?'<button class="btn btn-secondary" data-action="paid" data-value="'+a.id+'">'+safe(tr('paidAction'))+'</button>':'')+
       '<button class="btn btn-ghost" data-action="move" data-value="'+a.id+'">'+safe(tr('move'))+'</button>'+
       '<button class="btn btn-danger" data-action="cancel" data-value="'+a.id+'">'+safe(tr('cancel'))+'</button>'+
       (a.status==='approved'?'<button class="btn btn-ghost" data-action="complete" data-value="'+a.id+'">'+safe(tr('complete'))+'</button>':'')+
       '</div>':'';
      return '<article class="admin-card"><div class="admin-card-head"><div><h3>'+safe(a.name)+'</h3><p>'+safe(tr(service(a.service).label))+' · '+safe(prettyDate(a.day))+' · '+safe(a.time)+'</p>'+
       '<p>'+safe(a.id)+'</p></div>'+tag(a.status)+'</div>'+
       '<p><strong>'+safe(tr('depositStatus'))+':</strong> '+safe(tr(a.paid?'depositReceived':a.reported?'depositReported':'depositNotSent'))+'</p>'+acts+'</article>';
    }).join('')+'</div>';
   }else if(state.adminTab==='availability'){
    let list=Array.from({length:14},(_,i)=>addDays(today,i+2));
    $('admin-content').innerHTML='<div class="report-card"><h3>'+safe(tr('calendarControl'))+'</h3>'+
     '<p>'+safe(tr('calendarText'))+'</p><div class="admin-list">'+list.map(day=>
     '<div class="status-item-head"><span>'+safe(prettyDate(day))+'</span><button class="btn '+(isOpen(day)?'btn-secondary':'btn-ghost')+'" data-action="toggle-day" data-value="'+day+'">'+
     safe(tr(isOpen(day)?'enabled':'disabled'))+'</button></div>').join('')+'</div></div>';
   }else{
    const done=state.appointments.filter(a=>a.status==='completed');
    $('admin-content').innerHTML=kpis+'<article class="report-card"><h3>'+safe(tr('reportTitle'))+'</h3>'+
     '<p>'+safe(tr('reportIntro'))+'</p>'+
     '<div class="table-scroll"><table class="fake-table"><thead><tr><th>'+safe(tr('bookingReference'))+'</th><th>'+safe(tr('styles'))+'</th><th>'+safe(tr('statusLabel'))+'</th><th>'+safe(tr('depositStatus'))+'</th></tr></thead>'+
     '<tbody>'+state.appointments.map(a=>'<tr><td>'+safe(a.id)+'</td><td>'+safe(tr(service(a.service).label))+'</td><td>'+safe(tr(a.status))+'</td><td>'+safe(a.paid?money(20):'—')+'</td></tr>').join('')+'</tbody></table></div>'+
     '<p>'+safe(tr('finished'))+': '+done.length+' · '+safe(tr('verifiedDeposits'))+': '+safe(money(paid*20))+'</p><p>'+safe(tr('localOnly'))+'</p></article>';
   }
  }
  function render(){
   renderStatic();renderServices();renderCalendar();renderStatus();renderAdmin();
  }
  function notify(type,a,channel){
   state.notices.unshift({type,ref:a.id,name:a.name,channel});
  }
  function pick(id){return state.appointments.find(a=>a.id===id)}
  document.addEventListener('click',event=>{
   const button=event.target.closest('[data-action]');
   if(!button||button.disabled)return;
   const action=button.dataset.action,value=button.dataset.value;
   if(action==='nav'){event.preventDefault();navigate(value);return}
   if(action==='lang'){state.lang=value;render();return}
   if(action==='service'){
    state.service=value;
    state.time=null;
    render();
    if(button.dataset.scroll==='yes')$('book-demo').scrollIntoView({behavior:'smooth',block:'start'});
    return;
   }
   if(action==='month'){
    const [y,m]=state.month.split('-').map(Number);
    const next=new Date(Date.UTC(y,m-1+Number(value),1)).toISOString().slice(0,7);
    const max=new Date(Date.UTC(Number(today.slice(0,4)),Number(today.slice(5,7))-1+2,1)).toISOString().slice(0,7);
    if(next>=today.slice(0,7)&&next<=max){state.month=next;state.day=null;state.time=null;render()}return;
   }
   if(action==='day'){if(isOpen(value)){state.day=value;state.time=null;render()}return}
   if(action==='time'){if(times(state.day).includes(value)){state.time=value;render()}return}
   if(action==='admin-tab'){state.adminTab=value;render();return}
   if(action==='reset'){
    state.appointments=seed();state.notices=[];state.blocked.clear();
    state.service='knots';state.day=null;state.time=null;state.nextId=4;state.adminTab='appointments';
    $('booking-feedback').innerHTML='';$('booking-form').reset();
    $('customer-name').value='Alex Demo';$('customer-email').value='alex@example.test';
    navigate('customer');return;
   }
   if(action==='toggle-day'){state.blocked.has(value)?state.blocked.delete(value):state.blocked.add(value);if(state.day===value&&!isOpen(value)){state.day=null;state.time=null}render();return}
   const a=pick(value);
   if(!a)return;
   if(action==='report'&&!a.reported&&!a.paid&&['pending','approved'].includes(a.status)){
    a.reported=true;notify('reportedMessage',a,'Telegram (demo)');render();return;
   }
   if(action==='approve'&&a.status==='pending'){a.status='approved';notify('approvedMessage',a,'Email (demo)')}
   else if(action==='decline'&&a.status==='pending'){a.status='declined';notify('declinedMessage',a,'Email (demo)')}
   else if(action==='cancel'&&['pending','approved'].includes(a.status)){a.status='cancelled';notify('cancelledMessage',a,'Email (demo)')}
   else if(action==='paid'&&!a.paid&&['pending','approved'].includes(a.status)){a.paid=true;notify('paidMessage',a,'Email (demo)')}
   else if(action==='move'&&['pending','approved'].includes(a.status)){a.day=addDays(a.day,1);notify('movedMessage',a,'Email (demo)')}
   else if(action==='complete'&&a.status==='approved'){a.status='completed'}
   else return;
   render();
  });
  $('booking-form').addEventListener('submit',event=>{
    event.preventDefault();
    const feedback=$('booking-feedback');
    if(!state.day||!state.time||!times(state.day).includes(state.time)){
      feedback.textContent=tr('invalidSlot');return;
    }
    if(!$('booking-form').reportValidity())return;
    const name=$('customer-name').value.trim(),email=$('customer-email').value.trim();
    if(!name||!email)return;
    const id='LYN-DEMO-'+String(state.nextId++).padStart(3,'0');
    const a={id,name,email,service:state.service,day:state.day,time:state.time,status:'pending',reported:false,paid:false};
    state.appointments.unshift(a);
    notify('sampleMessage',a,'Email (demo)');
    feedback.innerHTML='<div class="result-success"><strong>'+safe(tr('bookingSaved'))+'</strong><p>'+
      safe(tr('bookingReference'))+': <strong>'+safe(id)+'</strong></p><p>'+safe(tr('bookingNotice'))+'</p>'+
      '<button class="btn btn-secondary" type="button" data-action="nav" data-value="status">'+safe(tr('viewStatus'))+'</button></div>';
    state.day=null;state.time=null;
    render();
   });
  render();
})();
