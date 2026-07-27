/**
 * STTMTC — St Theresa Medical Training College
 * Main Interactive Script v3.1
 * Crafted by Infranova Systems
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. MOBILE NAVIGATION
     ============================================================ */
  const navToggle = document.getElementById('mobile-toggle') || document.querySelector('.nav-toggle');
  const navMenu   = document.getElementById('primary-nav')  || document.querySelector('.nav');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-active');
      navToggle.textContent = isOpen ? '✕' : '☰';
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close when a link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-active');
        navToggle.textContent = '☰';
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('is-active');
        navToggle.textContent = '☰';
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-active')) {
        navMenu.classList.remove('is-active');
        navToggle.textContent = '☰';
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ============================================================
     2. ACTIVE NAV LINK
     ============================================================ */
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav a').forEach(link => {
    try {
      const linkPath = new URL(link.href, window.location.origin).pathname;
      if (currentPath === linkPath || (currentPath === '/' && linkPath.includes('index.html'))) {
        link.classList.add('nav-active');
      }
    } catch (e) {
      /* Safe catch for hash links or invalid hrefs */
    }
  });

  /* ============================================================
     3. FOOTER YEAR
     ============================================================ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================================
     4. STICKY HEADER
     ============================================================ */
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => header.classList.toggle('header--scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ============================================================
     5. BACK TO TOP
     ============================================================ */
  const backTop = document.getElementById('back-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('is-visible', window.scrollY > 400);
    }, { passive: true });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ============================================================
     6. SCROLL REVEAL
     ============================================================ */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  /* ============================================================
     7. COUNTER ANIMATION
     ============================================================ */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el       = entry.target;
          const target   = +el.getAttribute('data-count');
          const suffix   = el.getAttribute('data-suffix') || '';
          let start      = 0;
          const duration = 1600;
          const step     = target / (duration / 16);
          const timer    = setInterval(() => {
            start = Math.min(start + step, target);
            el.textContent = Math.floor(start) + suffix;
            if (start >= target) clearInterval(timer);
          }, 16);
          counterObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObs.observe(el));
  }

  /* ============================================================
     8. LIGHTBOX
     ============================================================ */
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightbox-img');
  const lbClose  = document.getElementById('lightbox-close');

  if (lightbox && lbImg) {
    document.querySelectorAll('.gallery-item img, [data-lightbox]').forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        lbImg.src = img.src;
        lbImg.alt = img.alt || '';
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLb = () => {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    if (lbClose) lbClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
  }

  /* ============================================================
     9 & 10. FORM VALIDATION (Contact & Apply)
     ============================================================ */
  const setupFormValidation = (formId) => {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', e => {
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        const errEl = field.parentElement.querySelector('.form-error');
        const isValid = field.value.trim() !== '' && field.checkValidity();

        if (!isValid) {
          field.classList.add('error');
          if (errEl) errEl.classList.add('visible');
          valid = false;
        } else {
          field.classList.remove('error');
          if (errEl) errEl.classList.remove('visible');
        }
      });
      if (!valid) e.preventDefault();
    });
  };

  setupFormValidation('contact-form');
  setupFormValidation('apply-form');

  /* ============================================================
     11. HERO SLIDER logic
     ============================================================ */
  const sliderEl = document.getElementById('hero-slider');
  
  if (sliderEl) {
    const slides    = sliderEl.querySelectorAll('.slide');
    const dots      = sliderEl.querySelectorAll('.slider-dot');
    const prevBtn   = document.getElementById('slider-prev');
    const nextBtn   = document.getElementById('slider-next');
    const counterEl = document.getElementById('slider-current');

    if (slides.length) {
      const TOTAL    = slides.length;
      const INTERVAL = 6000;
      let current    = 0;
      let timer      = null;
      let paused     = false;

      // Progress bar element
      const progress = document.createElement('div');
      progress.className = 'slider-progress';
      sliderEl.appendChild(progress);

      const goTo = (n) => {
        if (slides[current]) slides[current].classList.remove('active');
        if (dots[current]) {
          dots[current].classList.remove('active');
          dots[current].setAttribute('aria-selected', 'false');
        }

        current = (n + TOTAL) % TOTAL;

        if (slides[current]) slides[current].classList.add('active');
        if (dots[current]) {
          dots[current].classList.add('active');
          dots[current].setAttribute('aria-selected', 'true');
        }
        if (counterEl) counterEl.textContent = current + 1;

        // Reset progress bar animation
        progress.style.transition = 'none';
        progress.style.width = '0%';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            progress.style.transition = `width ${INTERVAL}ms linear`;
            progress.style.width = '100%';
          });
        });
      };

      const nextSlide = () => goTo(current + 1);
      const prevSlide = () => goTo(current - 1);

      const startTimer = () => {
        clearInterval(timer);
        timer = setInterval(() => { if (!paused) nextSlide(); }, INTERVAL);
      };

      // Dot clicks
      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          const slideIdx = parseInt(dot.dataset.slide, 10);
          if (!isNaN(slideIdx)) {
            goTo(slideIdx);
            startTimer();
          }
        });
      });

      // Arrow clicks
      if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startTimer(); });
      if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startTimer(); });

      // Pause on hover
      sliderEl.addEventListener('mouseenter', () => { paused = true; });
      sliderEl.addEventListener('mouseleave', () => { paused = false; });

      // Touch / swipe support
      let touchStartX = 0;
      sliderEl.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].clientX;
      }, { passive: true });

      sliderEl.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) { 
          dx < 0 ? nextSlide() : prevSlide(); 
          startTimer(); 
        }
      }, { passive: true });

      // Keyboard navigation
      document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft')  { prevSlide(); startTimer(); }
        if (e.key === 'ArrowRight') { nextSlide(); startTimer(); }
      });

      // Init
      goTo(0);
      startTimer();
    }
  }

}); // end DOMContentLoaded