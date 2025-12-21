document.addEventListener('DOMContentLoaded', function(){
  // year
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // THEME: persistent light/dark with system preference
  const THEME_KEY = 'theme';
  const themeToggle = document.querySelector('.theme-toggle');

  function applyTheme(t){
    if(t === 'light'){
      document.documentElement.classList.add('theme-light');
      if(themeToggle){
        themeToggle.setAttribute('aria-pressed','true');
        const icon = themeToggle.querySelector('.theme-icon'); if(icon) icon.textContent = '☀️';
      }
    } else {
      document.documentElement.classList.remove('theme-light');
      if(themeToggle){
        themeToggle.setAttribute('aria-pressed','false');
        const icon = themeToggle.querySelector('.theme-icon'); if(icon) icon.textContent = '🌙';
      }
    }
  }

  // initialize theme
  try{
    const stored = localStorage.getItem(THEME_KEY);
    if(stored){ applyTheme(stored); }
    else {
      const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
      applyTheme(prefersLight ? 'light' : 'dark');
    }
  }catch(e){ /* localStorage unavailable */ }

  if(themeToggle){
    themeToggle.addEventListener('click', function(){
      const isLight = document.documentElement.classList.contains('theme-light');
      const next = isLight ? 'dark' : 'light';
      applyTheme(next);
      try{ localStorage.setItem(THEME_KEY, next); }catch(e){}
    });
  }

  // mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.getElementById('site-nav');
  if(navToggle && siteNav){
    navToggle.addEventListener('click', function(){
      const open = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // close on link click
    siteNav.querySelectorAll('a').forEach(a => a.addEventListener('click', ()=>{
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded','false');
    }));
  }

  // smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href.length>1){
        const target = document.querySelector(href);
        if(target){
          e.preventDefault();
          target.scrollIntoView({behavior:'smooth',block:'start'});
        }
      }
    });
  });

  // simple contact form handler (placeholder)
  const form = document.querySelector('.contact-form');
  if (form) {
  if (form.dataset.demo === 'true') {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const submit = form.querySelector('button[type="submit"]');
      if (submit) { submit.disabled = true; submit.textContent = 'Sending...'; }
      setTimeout(() => {
        if (submit) { submit.disabled = false; submit.textContent = 'Send message'; }
        alert('Form Submitted successfully! Thank you for contacting....');
        form.reset();
      }, 900);
    });
  }
}

  // Team card click handler
  const teamCards = document.querySelectorAll('.team-card');
  teamCards.forEach(card => {
    card.addEventListener('click', () => {
      const link = card.querySelector('.team-link.linkedin');
      if (link && link.href) {
        window.open(link.href, '_blank', 'noopener,noreferrer');
      }
    });
  });

  // Prevent email link click from triggering card click
  document.querySelectorAll('.team-link.email').forEach(link => {
      link.addEventListener('click', (e) => {
          e.stopPropagation();
      });
  });

  // Prevent linkedin link from navigating in current tab
  document.querySelectorAll('.team-link.linkedin').forEach(link => {
      link.addEventListener('click', (e) => {
          e.preventDefault();
      });
  });

  // newsletter handler
  const newsletter = document.querySelector('.newsletter-form');
  if(newsletter){
    newsletter.addEventListener('submit', function(e){
      e.preventDefault();
      const btn = newsletter.querySelector('button[type="submit"]');
      if(btn){ btn.disabled = true; btn.textContent = 'Subscribing...'; }
      setTimeout(()=>{
        if(btn){ btn.disabled = false; btn.textContent = 'Subscribe'; }
        alert('Thanks for subscribing — demo placeholder.');
        newsletter.reset();
      },900);
    });
  }
});
// Scroll effect (initialize after DOM ready)
(function(){
  if(!(window.gsap && gsap.utils && window.ScrollTrigger)){
    console.warn('GSAP or ScrollTrigger not found — scroll snap disabled.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  let snapTrigger = null;
  let resizeTimer = null;

  function setupSnap(){
    const panels = gsap.utils.toArray('.panel');
    if(!panels.length) return;

    if(snapTrigger && typeof snapTrigger.kill === 'function'){
      snapTrigger.kill();
      snapTrigger = null;
    }

    let isSnapping = false;
    const headerOffset = document.querySelector('.site-header')?.offsetHeight || 0;

    function snapHandler(){
      if(isSnapping) return;
      const panels = gsap.utils.toArray('.panel');
      if(!panels.length) return;

      const ratios = panels.map(p => {
        const r = p.getBoundingClientRect();
        const visible = Math.max(0, Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0));
        return visible / (r.height || 1);
      });

      // find the most visible panel
      let bestIndex = 0; let bestRatio = ratios[0] || 0;
      for(let i=1;i<ratios.length;i++){ if(ratios[i] > bestRatio){ bestRatio = ratios[i]; bestIndex = i; } }

      // check immediate neighbors: only auto-snap if a neighbor exceeds 10% visibility
      const threshold = 0.25;
      const prevIndex = bestIndex - 1;
      const nextIndex = bestIndex + 1;
      let targetIndex = null;
      if(prevIndex >= 0 && ratios[prevIndex] >= threshold) targetIndex = prevIndex;
      else if(nextIndex < panels.length && ratios[nextIndex] >= threshold) targetIndex = nextIndex;

      if(targetIndex !== null){
        const target = panels[targetIndex];
        const targetTop = Math.max(0, target.offsetTop - headerOffset);
        if(Math.abs(window.scrollY - targetTop) > 4){
          isSnapping = true;
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
          setTimeout(()=>{ isSnapping = false; }, 700);
        }
      }
    }

    // run snapHandler on scroll end
    ScrollTrigger.addEventListener('scrollEnd', snapHandler);
    // lightweight trigger so ScrollTrigger tracks scroll (can be killed on setup)
    snapTrigger = ScrollTrigger.create({ trigger: panels[0], start: 'top top', end: 'bottom bottom' });
  }

  // initialize and refresh on resize with debounce
  setupSnap();
  window.addEventListener('resize', ()=>{
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(()=>{
      setupSnap();
      if(window.ScrollTrigger && typeof ScrollTrigger.refresh === 'function') ScrollTrigger.refresh();
    },150);
  });
})();
