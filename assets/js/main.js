'use strict';

/* ── Navbar: scroll + hamburger ── */
const navbar    = document.querySelector('.navbar');
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const scrollHint = document.querySelector('.hero-scroll-hint');

// Paste the deployed Google Apps Script Web App URL here after setup.
const BOOKING_EMAIL_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwFnkElGI8yNTkY1vz30t6-sRZIHLP23Ukh8minEpJvtzzybImlDmPS0siO8Y8PyCXa4w/exec';

function updateNavbar() {
  if (scrollHint) scrollHint.classList.toggle('is-hidden', window.scrollY > 0);
  document.body.classList.toggle('floating-icons-hidden', window.scrollY > 0);
  if (!navbar || navbar.classList.contains('solid')) return;
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target) && !mobileNav.contains(e.target)) {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ── Active nav link ── */
(function setActiveLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ── Scroll Animations (Intersection Observer) ── */
const animateEls = document.querySelectorAll('[data-animate]');
if (animateEls.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  animateEls.forEach(el => observer.observe(el));
}

/* ── Smooth Scroll for anchors ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 82;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    }
  });
});

/* ═══════════════════════════════════════════
   ✦  STARFIELD ENGINE
   ═══════════════════════════════════════════ */

/**
 * Creates twinkling star dots inside a container element.
 */
function createStars(container, count) {
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2.2 + 0.4;
    const duration = (Math.random() * 3 + 2).toFixed(2);
    const delay    = (Math.random() * 6).toFixed(2);
    const opacity  = (Math.random() * 0.6 + 0.25).toFixed(2);

    // Colour: mostly white, some have a teal/gold tint
    const r = Math.random();
    let color = '#ffffff';
    if (r < 0.08)      color = '#00d4ff'; // aurora teal
    else if (r < 0.14) color = '#ffd700'; // star gold
    else if (r < 0.18) color = '#c8d8f0'; // moonlight blue

    star.style.cssText = `
      left:${(Math.random() * 100).toFixed(2)}%;
      top:${(Math.random() * 100).toFixed(2)}%;
      width:${size}px;
      height:${size}px;
      background:${color};
      opacity:${opacity};
      animation: twinkle ${duration}s ease-in-out infinite ${delay}s;
      ${size > 1.8 ? `box-shadow: 0 0 ${size * 2}px ${color};` : ''}
    `;
    container.appendChild(star);
  }
}

/**
 * Launches a shooting-star element across a container.
 */
function launchShootingStar(container) {
  const s = document.createElement('div');
  s.className = 'shooting-star';
  const length = Math.random() * 100 + 60;
  s.style.cssText = `
    left:${(Math.random() * 70 + 10).toFixed(1)}%;
    top:${(Math.random() * 45).toFixed(1)}%;
    width:${length}px;
    animation: shootingStar ${(Math.random() * 0.4 + 0.8).toFixed(2)}s linear forwards;
  `;
  container.appendChild(s);
  setTimeout(() => s.remove(), 1500);
}

/**
 * Adds nebula glow orbs to a container.
 */
function addNebulaOrbs(container) {
  const orbs = [
    { size: 350, left: '10%', top: '20%', color: 'rgba(45,27,105,0.18)', delay: '0s' },
    { size: 280, left: '70%', top: '60%', color: 'rgba(0,180,216,0.1)',  delay: '3s' },
    { size: 200, left: '55%', top: '10%', color: 'rgba(123,200,122,0.1)', delay: '6s' },
  ];
  orbs.forEach(o => {
    const orb = document.createElement('div');
    orb.className = 'nebula-orb';
    orb.style.cssText = `
      width:${o.size}px; height:${o.size}px;
      left:${o.left}; top:${o.top};
      background: radial-gradient(circle, ${o.color}, transparent 70%);
      animation-delay: ${o.delay};
      z-index: 0;
    `;
    container.appendChild(orb);
  });
}

/* Keep animated stars only in the signature night-sky experience. */
function initStarfields() {
  const canvas = document.querySelector('.experience-strip .star-canvas');
  if (!canvas) return;

  createStars(canvas, 120);
  addNebulaOrbs(canvas);
  const shoot = () => {
    launchShootingStar(canvas);
    setTimeout(shoot, Math.random() * 5000 + 3000);
  };
  setTimeout(shoot, Math.random() * 4000 + 2000);
}

/* ── Hero background parallax ── */
function initParallax() {
  const heroBg     = document.querySelector('.hero-bg');
  if (!heroBg) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBg.style.transform = `scale(1.08) translateY(${y * 0.18}px)`;
  }, { passive: true });
}

/* ── Gallery Lightbox ── */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  const lightImg = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn  = lightbox.querySelector('.lightbox-prev');
  const nextBtn  = lightbox.querySelector('.lightbox-next');
  const items    = Array.from(document.querySelectorAll('.gallery-item[data-src]'));
  let current = 0;

  function openLightbox(idx) {
    current = idx;
    lightImg.src = items[current].dataset.src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lightImg.src = ''; }, 300);
  }
  function navigate(dir) {
    current = (current + dir + items.length) % items.length;
    lightImg.src = items[current].dataset.src;
  }

  items.forEach((item, idx) => item.addEventListener('click', () => openLightbox(idx)));
  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click',  () => navigate(-1));
  nextBtn?.addEventListener('click',  () => navigate(1));
  lightbox.addEventListener('click',  e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
}

/* ── Gallery Filter ── */
function initGalleryFilter() {
  const tabs  = document.querySelectorAll('.filter-tab');
  const items = document.querySelectorAll('.gallery-item[data-category]');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      items.forEach(item => {
        item.style.display = (filter === 'all' || item.dataset.category === filter) ? 'block' : 'none';
      });
    });
  });
}

/* ── Forms ── */
function initForms() {
  document.querySelectorAll('.ajax-form').forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const orig = btn.textContent;
      if (form.id === 'bookingInquiryForm') {
        const status = document.getElementById('bookingFormStatus');
        if (!BOOKING_EMAIL_ENDPOINT) {
          status.textContent = 'Online booking email is not connected yet. Please call or WhatsApp us to inquire.';
          status.style.color = 'var(--text-dim)';
          return;
        }
        btn.textContent = 'Sending ✦';
        btn.disabled = true;
        status.textContent = '';
        const body = new URLSearchParams(new FormData(form));
        fetch(BOOKING_EMAIL_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          body
        }).then(() => {
          status.textContent = 'Your inquiry has been submitted. We’ll contact you by phone or WhatsApp.';
          status.style.color = 'var(--aurora-teal)';
          form.reset();
        }).catch(() => {
          status.textContent = 'We couldn’t submit your inquiry. Please call or WhatsApp us instead.';
          status.style.color = '#ff8c8c';
        }).finally(() => {
          btn.textContent = orig;
          btn.disabled = false;
        });
        return;
      }
      btn.textContent = 'Sending ✦';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = '✓ Sent Successfully!';
        btn.style.background = 'linear-gradient(135deg, #2d6e48, #4a9e6b)';
        setTimeout(() => {
          btn.textContent = orig;
          btn.style.background = '';
          btn.disabled = false;
          form.reset();
        }, 3000);
      }, 1400);
    });
  });
}

function initDatePickers() {
  const today = new Date();
  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0')
  ].join('-');

  document.querySelectorAll('#bookingInquiryForm input[type="date"]').forEach(input => {
    input.min = localToday;
    input.addEventListener('click', () => {
      if (typeof input.showPicker !== 'function') return;
      try {
        input.showPicker();
      } catch (_) {
        // Keep the browser's built-in date input as a fallback.
      }
    });
  });
}

/* ── FAQ Accordion ── */
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = btn.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-q.open').forEach(b => {
        b.classList.remove('open');
        b.nextElementSibling.classList.remove('open');
      });
      if (!isOpen) {
        btn.classList.add('open');
        answer.classList.add('open');
      }
    });
  });
}

/* ── Stagger children ── */
document.querySelectorAll('.stagger-children > *').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.1}s`;
});

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', () => {
  initStarfields();
  initParallax();
  initLightbox();
  initGalleryFilter();
  initForms();
  initDatePickers();
  initFAQ();
});
