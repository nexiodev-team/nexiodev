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
