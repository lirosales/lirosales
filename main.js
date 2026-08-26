/* =========================================================
   LIRO / CETIO — shared behaviour
   ========================================================= */

/* ---------- header scroll state ---------- */
(function(){
  const header = document.querySelector('.site-header');
  if(!header) return;
  function onScroll(){
    if(window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});
})();

/* ---------- mobile nav ---------- */
(function(){
  const burger = document.querySelector('.nav-burger');
  const links = document.querySelector('.nav-links');
  if(!burger || !links) return;
  burger.addEventListener('click', ()=>{
    burger.classList.toggle('open');
    links.classList.toggle('open');
    document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
  });
  links.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', ()=>{
      burger.classList.remove('open');
      links.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ---------- reveal on scroll ---------- */
(function(){
  const items = document.querySelectorAll('.reveal');
  if(!items.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:.15, rootMargin:'0px 0px -60px 0px'});
  items.forEach((el,i)=>{
    if(!el.style.transitionDelay){
      el.style.transitionDelay = (el.dataset.delay || (i%4)*80) + 'ms';
    }
    io.observe(el);
  });
})();

/* ---------- hero parallax ---------- */
(function(){
  const media = document.querySelectorAll('.hero-media img');
  if(!media.length) return;
  window.addEventListener('scroll', ()=>{
    const y = window.scrollY;
    media.forEach(m=> m.style.transform = `scale(1.06) translateY(${y*0.12}px)`);
  }, {passive:true});
})();

/* ---------- accordion (collapsible rows) ---------- */
document.querySelectorAll('.acc-row').forEach(row=>{
  const trigger = row.querySelector('.acc-trigger');
  const panel = row.querySelector('.acc-panel');
  if(!trigger || !panel) return;
  trigger.addEventListener('click', ()=>{
    const isOpen = row.classList.contains('open');
    // close siblings within the same accordion
    const acc = row.closest('.accordion');
    if(acc){
      acc.querySelectorAll('.acc-row.open').forEach(r=>{
        if(r !== row){
          r.classList.remove('open');
          r.querySelector('.acc-panel').style.maxHeight = null;
        }
      });
    }
    if(isOpen){
      row.classList.remove('open');
      panel.style.maxHeight = null;
    } else {
      row.classList.add('open');
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  });
});
// open the first row of each accordion by default
document.querySelectorAll('.accordion').forEach(acc=>{
  const first = acc.querySelector('.acc-row');
  if(first){
    first.classList.add('open');
    const panel = first.querySelector('.acc-panel');
    requestAnimationFrame(()=>{ panel.style.maxHeight = panel.scrollHeight + 'px'; });
  }
});
// recalc open panel heights on resize
window.addEventListener('resize', ()=>{
  document.querySelectorAll('.acc-row.open .acc-panel').forEach(panel=>{
    panel.style.maxHeight = panel.scrollHeight + 'px';
  });
});

/* ---------- back to top ---------- */
(function(){
  const btn = document.querySelector('.back-to-top');
  if(!btn) return;
  window.addEventListener('scroll', ()=>{
    if(window.scrollY > 700) btn.classList.add('show');
    else btn.classList.remove('show');
  }, {passive:true});
  btn.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
})();

/* ---------- contact form ---------- */
const contactForm = document.getElementById('contact-form');
if(contactForm){
  contactForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const status = document.getElementById('form-status');
    const original = btn.innerHTML;
    const endpoint = contactForm.getAttribute('action');

    btn.innerHTML = '<span>Sending…</span>';
    btn.disabled = true;

    try{
      if(!endpoint || endpoint.indexOf('YOUR_FORM_ID') !== -1){
        throw new Error('not-configured');
      }
      const res = await fetch(endpoint, {
        method:'POST',
        headers:{ 'Accept':'application/json' },
        body:new FormData(contactForm)
      });
      if(res.ok){
        status.textContent = 'Thank you — your message has been sent. We will be in touch shortly.';
        status.className = 'form-status show ok';
        contactForm.reset();
      } else {
        throw new Error('send-failed');
      }
    } catch(err){
      status.textContent = 'We could not send this automatically — please email us directly at lirosalellc@gmail.com, or use the link below to open your mail app.';
      status.className = 'form-status show err';
    } finally {
      btn.innerHTML = original;
      btn.disabled = false;
    }
  });
}

/* ---------- year ---------- */
document.querySelectorAll('[data-year]').forEach(el=> el.textContent = new Date().getFullYear());
