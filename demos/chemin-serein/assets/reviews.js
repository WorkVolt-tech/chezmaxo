// Chemin Serein — public reviews (About preview + full reviews page)
(function(){
  var cfg = window.HDV_CONFIG || {};
  var sb = (window.supabase && cfg.SUPABASE_URL) ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;

  function lang(){ return document.documentElement.getAttribute("lang") || localStorage.getItem("hdv-lang") || "fr"; }
  function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function stars(n){ n=Math.max(0,Math.min(5,n|0)); var s=""; for(var i=0;i<5;i++){ s+= i<n ? "★" : "☆"; } return s; }
  function fmtDate(d){ try{ return new Date(d).toLocaleDateString(lang()==="fr"?"fr-CA":"en-CA",{year:"numeric",month:"short",day:"numeric"}); }catch(e){ return ""; } }

  function reviewCard(r, compact){
    var reply = r.reply ? ('<div style="margin-top:10px;padding:10px 12px;background:#faf6ee;border-left:3px solid var(--gold,#b8942f);border-radius:6px"><b style="font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:#8a6d1f">'+(lang()==="fr"?"Réponse d'Chemin Serein":"Reply from Chemin Serein")+'</b><div style="margin-top:4px">'+esc(r.reply)+'</div></div>') : "";
    return '<div style="background:#fff;border:1px solid #e8e2d6;border-radius:10px;padding:18px 20px">'
      +'<div style="color:#c9a227;font-size:1.05rem;letter-spacing:2px">'+stars(r.rating)+'</div>'
      +'<div style="font-family:var(--serif,\'Cormorant Garamond\',serif);font-size:1.15rem;margin:6px 0 4px">'+esc(r.reviewer_name)+'</div>'
      +'<div style="font-size:.78rem;color:#9a9385;margin-bottom:8px">'+fmtDate(r.created_at)+'</div>'
      +'<div style="font-size:.95rem;color:#4a463f;line-height:1.55">'+esc(r.body)+'</div>'
      + reply
      +'</div>';
  }

  function loadPreview(){
    var host=document.getElementById("reviewsPreview"); if(!host||!sb) return;
    sb.from("reviews_public").select("*").limit(3).then(function(res){
      if(res.error||!res.data||!res.data.length){
        host.innerHTML='<p style="text-align:center;color:#9a9385;grid-column:1/-1">'+(lang()==="fr"?"Soyez la première famille à laisser un avis.":"Be the first family to leave a review.")+'</p>';
        return;
      }
      host.innerHTML=res.data.map(function(r){return reviewCard(r,true);}).join("");
    });
  }

  function loadAll(){
    var host=document.getElementById("allReviews"); if(!host||!sb) return;
    sb.from("reviews_public").select("*").then(function(res){
      if(res.error||!res.data||!res.data.length){
        host.innerHTML='<p style="text-align:center;color:#9a9385">'+(lang()==="fr"?"Aucun avis pour le moment.":"No reviews yet.")+'</p>';
        return;
      }
      // average
      var avg=res.data.reduce(function(a,r){return a+r.rating;},0)/res.data.length;
      var head=document.getElementById("reviewsSummary");
      if(head) head.innerHTML='<div style="color:#c9a227;font-size:1.6rem;letter-spacing:3px">'+stars(Math.round(avg))+'</div><div style="color:#6a6459">'+avg.toFixed(1)+' / 5 · '+res.data.length+' '+(lang()==="fr"?"avis":"reviews")+'</div>';
      host.innerHTML=res.data.map(function(r){return reviewCard(r,false);}).join("");
    });
  }

  function wireForm(){
    var form=document.getElementById("reviewForm"); if(!form||!sb) return;
    var msg=document.getElementById("reviewMsg");
    var picked=0;
    // star picker
    var starWrap=document.getElementById("starPick");
    if(starWrap){
      function paint(n){ starWrap.querySelectorAll("span").forEach(function(s,i){ s.textContent = i<n?"★":"☆"; }); }
      starWrap.querySelectorAll("span").forEach(function(s,i){
        s.style.cursor="pointer";
        s.addEventListener("click",function(){ picked=i+1; paint(picked); });
        s.addEventListener("mouseenter",function(){ paint(i+1); });
      });
      starWrap.addEventListener("mouseleave",function(){ paint(picked); });
    }
    document.getElementById("reviewSubmit").addEventListener("click",function(){
      // Honeypot: real people never fill this hidden field; bots do. Silently drop.
      var hp=form.querySelector('[name=rwebsite]');
      if(hp && hp.value.trim()!==""){
        // Pretend success so bots don't learn they were caught.
        var L0=lang(); msg.style.display="block"; msg.style.color="#4a7a48";
        msg.textContent=L0==="fr"?"Merci ! Votre avis sera publié après vérification.":"Thank you! Your review will appear after verification.";
        return;
      }
      var name=(form.querySelector('[name=rname]')&&form.querySelector('[name=rname]').value||"").trim();
      var email=(form.querySelector('[name=remail]')&&form.querySelector('[name=remail]').value||"").trim();
      var body=(form.querySelector('[name=rbody]')&&form.querySelector('[name=rbody]').value||"").trim();
      var L=lang();
      if(!name||!body||picked<1){ msg.style.display="block"; msg.style.color="#a8402d"; msg.textContent=L==="fr"?"Nom, note et commentaire sont requis.":"Name, rating, and comment are required."; return; }
      document.getElementById("reviewSubmit").disabled=true;
      sb.rpc("submit_review",{ p_name:name, p_email:email||null, p_rating:picked, p_body:body, p_lang:L }).then(function(res){
        document.getElementById("reviewSubmit").disabled=false;
        if(res.error){ msg.style.display="block"; msg.style.color="#a8402d"; msg.textContent=(L==="fr"?"Erreur : ":"Error: ")+res.error.message; return; }
        form.querySelectorAll("input,textarea").forEach(function(el){ el.value=""; }); picked=0; if(starWrap) starWrap.querySelectorAll("span").forEach(function(s){s.textContent="☆";});
        msg.style.display="block"; msg.style.color="#4a7a48";
        msg.textContent=L==="fr"?"Merci ! Votre avis sera publié après vérification.":"Thank you! Your review will appear after verification.";
      });
    });
  }

  document.addEventListener("DOMContentLoaded",function(){
    loadPreview();  // about page
    loadAll();      // reviews page
    wireForm();     // reviews page
  });
})();
