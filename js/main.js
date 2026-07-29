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
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-active');
        navToggle.textContent = '☰';
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('click', e => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('is-active');
        navToggle.textContent = '☰';
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-active')) {
        navMenu.classList.remove('is-active');
        navToggle.textContent = '☰';
        document.body.style.overflow = '';
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ============================================================
     2. ACTIVE NAV LINK
     ============================================================ */
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav a').forEach(link => {
    const linkPath = new URL(link.href, window.location.origin).pathname;
    if (currentPath === linkPath || (currentPath === '/' && linkPath.includes('index.html'))) {
      link.classList.add('nav-active');
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
          const el     = entry.target;
          const target = +el.getAttribute('data-count');
          const suffix = el.getAttribute('data-suffix') || '';
          let start    = 0;
          const step   = target / (1600 / 16);
          const timer  = setInterval(() => {
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
     9. CONTACT FORM VALIDATION
     ============================================================ */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      let valid = true;
      contactForm.querySelectorAll('[required]').forEach(field => {
        const errEl = field.parentElement.querySelector('.form-error');
        if (!field.value.trim()) {
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
  }

  /* ============================================================
     10. APPLICATION FORM VALIDATION
     ============================================================ */
  const applyForm = document.getElementById('apply-form');
  if (applyForm) {
    applyForm.addEventListener('submit', e => {
      let valid = true;
      applyForm.querySelectorAll('[required]').forEach(field => {
        const errEl = field.parentElement.querySelector('.form-error');
        if (!field.value.trim()) {
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
  }

  /* ============================================================
     11. HERO SLIDER (index.html only)
     ✅ Guard: exits immediately if #hero-slider is not on the page.
        Safe to keep in main.js — won't error on other pages.
     ============================================================ */
  const sliderEl = document.getElementById('hero-slider');
  if (!sliderEl) return; // ← not on homepage, stop here

  const TOTAL      = 7;
  const INTERVAL   = 6000;   // ms between auto-advances
  const slides     = sliderEl.querySelectorAll('.slide');
  const dots       = sliderEl.querySelectorAll('.slider-dot');
  const prevBtn    = document.getElementById('slider-prev');
  const nextBtn    = document.getElementById('slider-next');
  const counterEl  = document.getElementById('slider-current');

  let current = 0;
  let timer   = null;
  let paused  = false;

  // Progress bar
  const progress = document.createElement('div');
  progress.className = 'slider-progress';
  sliderEl.appendChild(progress);

  function goTo(n) {
    // Remove active from current
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-selected', 'false');

    // Set new current
    current = (n + TOTAL) % TOTAL;

    // Add active to new
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');
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
  }

  function nextSlide() { goTo(current + 1); }
  function prevSlide() { goTo(current - 1); }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => { if (!paused) nextSlide(); }, INTERVAL);
  }

  // Dot clicks
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.slide));
      startTimer();
    });
  });

  // Arrow clicks
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startTimer(); });

  // Pause on hover
  sliderEl.addEventListener('mouseenter', () => { paused = true; });
  sliderEl.addEventListener('mouseleave', () => { paused = false; });

  // Touch / swipe
  let touchStartX = 0;
  sliderEl.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  sliderEl.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { dx < 0 ? nextSlide() : prevSlide(); startTimer(); }
  }, { passive: true });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { prevSlide(); startTimer(); }
    if (e.key === 'ArrowRight') { nextSlide(); startTimer(); }
  });

  // Init
  goTo(0);
  startTimer();

}); // end DOMContentLoaded — slider


/* ============================================================
   12. ADMISSIONS APPLICATION FORM (admissions.html only)
   Guard: exits if #apply-form is not on the page.
   Replace YOUR_API_BASE_URL and YOUR_API_KEY once the other
   dev team provides the live endpoint details.
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const applyForm = document.getElementById('apply-form');
  if (!applyForm) return; // not on admissions page

  const API     = 'YOUR_API_BASE_URL'; // e.g. https://api.sttheresamedcollege.co.ke
  const API_KEY = 'YOUR_API_KEY';

  applyForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const btn   = document.getElementById('apply-btn');
    const errEl = document.getElementById('apply-error');
    errEl.style.display = 'none';

    // ── Validate required fields ───────────────────────────
    const requiredFields = [
      'a-name','a-id','a-dob','a-gender','a-phone',
      'a-county','a-guardian','a-address','a-kcse',
      'a-year','a-grade','a-bio','a-school'
    ];

    let ok = true;
    requiredFields.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (!el.value.trim()) {
        el.classList.add('error');
        ok = false;
      } else {
        el.classList.remove('error');
      }
    });

    const declCheckbox = document.getElementById('a-decl');
    if (declCheckbox && !declCheckbox.checked) {
      errEl.textContent = 'Please accept the declaration to proceed.';
      errEl.style.display = 'block';
      return;
    }

    if (!ok) {
      errEl.textContent = 'Please fill in all required fields marked *.';
      errEl.style.display = 'block';
      return;
    }

    // ── Disable button while submitting ───────────────────
    btn.textContent = 'Submitting…';
    btn.disabled    = true;

    // ── Build payload ──────────────────────────────────────
    const val = id => (document.getElementById(id)?.value || '').trim();

    const payload = {
      full_name:       val('a-name'),
      id_number:       val('a-id'),
      date_of_birth:   val('a-dob'),
      gender:          val('a-gender'),
      phone:           val('a-phone'),
      email:           val('a-email'),      // optional
      county:          val('a-county'),
      guardian_name:   val('a-guardian'),
      address:         val('a-address'),
      kcse_index:      val('a-kcse'),
      kcse_year:       val('a-year'),
      kcse_grade:      val('a-grade'),
      bio_grade:       val('a-bio'),
      previous_school: val('a-school'),
      course:          val('a-prog'),
      intake:          val('a-intake'),
    };

    // ── Submit to API ──────────────────────────────────────
    try {
      const res  = await fetch(`${API}/api/website/applications`, {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key':    API_KEY,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Show success state
        const refEl     = document.getElementById('apply-ref');
        const successEl = document.getElementById('apply-success');

        if (refEl)     refEl.textContent    = data.reference || 'APP-2026';
        if (successEl) successEl.style.display = 'block';

        applyForm.style.display = 'none';

        // Scroll to success message
        if (successEl) {
          window.scrollTo({
            top:      successEl.getBoundingClientRect().top + window.scrollY - 80,
            behavior: 'smooth',
          });
        }

        // Also store reference for success.html redirect
        if (data.reference) {
          sessionStorage.setItem('app_reference', data.reference);
        }

      } else {
        throw new Error(data.error || 'Submission failed. Please try again.');
      }

    } catch (err) {
      // Show friendly error and re-enable button
      errEl.textContent   = err.message || 'Could not submit. Please call +254 700 626 189 directly.';
      errEl.style.display = 'block';
      btn.textContent     = 'Try Again';
      btn.disabled        = false;
    }
  });
}); // end DOMContentLoaded — apply form
/* ============================================================
   13. APPLY NOW & STUDENT PORTAL — ALWAYS OPEN IN NEW TAB
   Runs on every page. Finds every link pointing to the
   CloudSchool apply URL or student portal URL and ensures
   target="_blank" + rel="noopener noreferrer" is set,
   regardless of how or where the link appears on the page.
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  const APPLY_URL  = 'cloudschool.co.ke/admissionv2';
  const PORTAL_URL = 'cloudschool.co.ke/student/login';

  // Also catch any plain text like "Apply Now" or "Student Portal"
  // pointing to the old login.html or admissions.html#apply
  const APPLY_TEXT   = /apply\s*now/i;
  const PORTAL_TEXT  = /student\s*portal/i;

  function enforceNewTab(link) {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  }

  function processLinks() {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href') || '';
      const text = link.textContent.trim();

      // Match by URL
      if (href.includes(APPLY_URL) || href.includes(PORTAL_URL)) {
        enforceNewTab(link);
        return;
      }

      // Match by link text — "Apply Now" or "Student Portal"
      if (APPLY_TEXT.test(text) || PORTAL_TEXT.test(text)) {
        enforceNewTab(link);
      }
    });
  }

  // Run on page load
  processLinks();

  // Re-run if new links are injected dynamically (dropdowns, SPAs etc.)
  const observer = new MutationObserver(processLinks);
  observer.observe(document.body, { childList: true, subtree: true });

}); // end DOMContentLoaded — new tab enforcer
