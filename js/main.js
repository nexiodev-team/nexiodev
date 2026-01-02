document.addEventListener('DOMContentLoaded', function () {
  // year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // THEME: persistent light/dark with system preference
  const THEME_KEY = 'theme';
  const themeToggle = document.querySelector('.theme-toggle');

  function applyTheme(t) {
    if (t === 'light') {
      document.documentElement.classList.add('theme-light');
      if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', 'true');
        const icon = themeToggle.querySelector('.theme-icon'); if (icon) icon.textContent = '☀️';
      }
    } else {
      document.documentElement.classList.remove('theme-light');
      if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', 'false');
        const icon = themeToggle.querySelector('.theme-icon'); if (icon) icon.textContent = '🌙';
      }
    }
  }

  // initialize theme
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) { applyTheme(stored); }
    else {
      const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
      applyTheme(prefersLight ? 'light' : 'dark');
    }
  } catch (e) { /* localStorage unavailable */ }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const isLight = document.documentElement.classList.contains('theme-light');
      const next = isLight ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { }
    });
  }

  // mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.getElementById('site-nav');
  const mobileBackdrop = document.getElementById('mobile-backdrop');

  function closeMobileMenu() {
    if (siteNav) siteNav.classList.remove('open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    if (mobileBackdrop) mobileBackdrop.classList.remove('active');
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      const open = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');

      // Toggle backdrop
      if (mobileBackdrop) {
        if (open) {
          mobileBackdrop.classList.add('active');
        } else {
          mobileBackdrop.classList.remove('active');
        }
      }
    });

    // close on link click
    siteNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileMenu));
  }

  // Close menu when clicking backdrop
  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMobileMenu);
  }


  // Shrinking navbar on scroll
  const header = document.querySelector('.site-header');
  let lastScrollTop = 0;

  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 50) {
      header.classList.add('scrolled');
      document.body.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
      document.body.classList.remove('scrolled');
    }

    lastScrollTop = scrollTop;
  }

  // Add scroll event listener with throttling for better performance
  let ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
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

  // newsletter handler with Formspree integration
  const newsletter = document.querySelector('.newsletter-form');
  if (newsletter) {
    newsletter.addEventListener('submit', async function (e) {
      e.preventDefault();

      const btn = newsletter.querySelector('button[type="submit"]');
      const emailInput = newsletter.querySelector('input[type="email"]');
      const formData = new FormData(newsletter);

      // Disable button and show loading state
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Subscribing...';
      }

      try {
        const response = await fetch(newsletter.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // Success
          if (btn) {
            btn.textContent = '✓ Subscribed!';
            btn.style.background = '#10b981';
          }
          newsletter.reset();

          // Reset button after 3 seconds
          setTimeout(() => {
            if (btn) {
              btn.disabled = false;
              btn.textContent = 'Subscribe';
              btn.style.background = '';
            }
          }, 3000);
        } else {
          // Error from Formspree
          throw new Error('Subscription failed');
        }
      } catch (error) {
        // Handle error
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Try again';
          btn.style.background = '#ef4444';
        }

        // Reset button after 3 seconds
        setTimeout(() => {
          if (btn) {
            btn.textContent = 'Subscribe';
            btn.style.background = '';
          }
        }, 3000);

        console.error('Newsletter subscription error:', error);
      }
    });
  }
});
