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
  const mobileView = window.matchMedia('(max-width: 768px)');
  const updateHeroPosition = () => {
    if (mobileView.matches) {
      heroBg.style.transform = 'none';
      return;
    }
    heroBg.style.transform = `scale(1.08) translateY(${window.scrollY * 0.18}px)`;
  };
  window.addEventListener('scroll', updateHeroPosition, { passive: true });
  window.addEventListener('resize', updateHeroPosition);
  updateHeroPosition();
}

/* ── Gallery Lightbox ── */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  const lightImg = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn  = lightbox.querySelector('.lightbox-prev');
  const nextBtn  = lightbox.querySelector('.lightbox-next');
  const items = [
    ...Array.from(document.querySelectorAll('.gallery-item[data-src]')).map(item => ({
      element: item,
      src: item.dataset.src,
      alt: item.querySelector('img')?.alt || 'Gallery image'
    })),
    ...Array.from(document.querySelectorAll('[data-room-gallery-track] .room-gallery-slide img')).map(img => ({
      element: img,
      src: img.getAttribute('src'),
      alt: img.alt || 'Room photo'
    }))
  ];
  let current = 0;

  function openLightbox(idx) {
    current = idx;
    lightImg.src = items[current].src;
    lightImg.alt = items[current].alt;
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
    lightImg.src = items[current].src;
    lightImg.alt = items[current].alt;
  }

  items.forEach((item, idx) => {
    item.element.addEventListener('click', () => openLightbox(idx));
    if (item.element.matches('.room-gallery-slide img')) {
      item.element.tabIndex = 0;
      item.element.setAttribute('role', 'button');
      item.element.setAttribute('aria-label', 'Open larger view: ' + item.alt);
      item.element.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox(idx);
        }
      });
    }
  });
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

/* ── Local image gallery ── */
function initLocalImageGallery() {
  const mount = document.getElementById('local-image-gallery');
  if (!mount) return;
  const groups = [
    { key: 'rooms', title: 'Rooms & Terraces', images: [
      'Images/Room/Mezza1.jpg', 'Images/Room/Mezza2.jpg', 'Images/Room/Side room1.jpg',
      'Images/Room/side room3.jpg', 'Images/Room/side room4.jpg', 'Images/Room/Side terrace outside view.jpg',
      'Images/Room/Side terrace1.jpg', 'Images/Room/Side terrace2.jpg', 'Images/side room2.jpg',
      'Images/middle terrace inside view.jpg', 'Images/Midle terrace inside view 1.jpg',
      'Images/IMG-20261104-WA0009.jpg', 'Images/IMG-20261104-WA0010.jpg',
      'Images/IMG-20261104-WA0013.jpg', 'Images/IMG-20261104-WA0014.jpg',
      'Images/IMG-20261104-WA0015.jpg', 'Images/IMG-20261104-WA0016.jpg',
      'Images/IMG-20261104-WA0017.jpg',
      'Images/IMG-20261104-WA0026.jpg',
      'Images/IMG-20261104-WA0029.jpg'
    ] },
    { key: 'tents', title: 'Tent Stay', images: [
      'Images/Tent/Screenshot 2026-11-04 101359.jpg', 'Images/Tent/WhatsApp Image 2026-10-08 at 3.04.18 PM (1).jpeg',
      'Images/IMG-20261104-WA0008.jpg', 'Images/IMG-20261105-WA0015.jpg'
    ] },
    { key: 'pool', title: 'Infinity Pool', images: [
      'Images/infinity pool1.jpg', 'Images/infinity pool2.jpg', 'Images/infinity pool3.jpg',
      'Images/infinity pool4.jpg', 'Images/infiniy pool5.jpg', 'Images/infinity pool6.jpg', 'Images/infinity pool8.jpg',
      'Images/Space.jpeg', 'Images/IMG-20261104-WA0004.jpg', 'Images/IMG-20261104-WA0006.jpg',
      'Images/IMG-20261104-WA0019.jpg', 'Images/IMG-20261104-WA0032.jpg',
      'Images/IMG-20261104-WA0042.jpg', 'Images/IMG-20261104-WA0044.jpg',
      'Images/IMG-20261105-WA0017.jpg'
    ] },
    { key: 'landscape', title: 'Property Views', images: [
      'Images/Drone pic 1.jpg', 'Images/Drone pic 2.jpg', 'Images/drone pic 3.jpg', 'Images/drone pic 4.jpg',
      'Images/full building view1.jpg', 'Images/home page 4 way with center.jpg', 'Images/pdium view 1.jpg',
      'Images/IMG-20261104-WA0021.jpg', 'Images/IMG-20261104-WA0023.jpg',
      'Images/IMG-20261104-WA0011.jpg', 'Images/IMG-20261104-WA0035.jpg', 'Images/IMG-20261104-WA0040.jpg',
      'Images/IMG-20261104-WA0041.jpg', 'Images/IMG-20261104-WA0045.jpg',
      'Images/IMG-20261104-WA0046.jpg', 'Images/IMG-20261104-WA0049.jpg',
      'Images/IMG-20261105-WA0006.jpg', 'Images/IMG-20261105-WA0013.jpg'
    ] },
    { key: 'halls', title: 'Halls & Event Spaces', images: [
      'Images/Hall1.jpg', 'Images/Hall3.jpg',
      'Images/IMG-20261104-WA0024.jpg', 'Images/IMG-20261104-WA0030.jpg',
      'Images/IMG-20261104-WA0034.jpg'
    ] },
    { key: 'stargazing', title: 'Stargazing', images: [
      'Images/IMG-20261104-WA0005.jpg', 'Images/IMG-20261104-WA0031.jpg',
      'Images/IMG-20261105-WA0007.jpg', 'Images/IMG-20261105-WA0008.jpg', 'Images/IMG-20261105-WA0009.jpg',
      'Images/IMG-20261105-WA0012.jpg', 'Images/IMG-20261105-WA0021.jpg', 'Images/IMG-20261105-WA0022.jpg'
    ] },
    { key: 'activities', title: 'Games & Activities', images: [
      'Images/badminton tennis.jpg', 'Images/Table Tennis.jpg',
      'Images/IMG-20261105-WA0018.jpg'
    ] },
    { key: 'photos', title: 'Guest Moments & Resort Life', images: [
      'Images/IMG-20261104-WA0033.jpg', 'Images/IMG-20261104-WA0037.jpg',
      'Images/IMG-20261104-WA0038.jpg', 'Images/IMG-20261104-WA0043.jpg',
      'Images/IMG-20261104-WA0047.jpg', 'Images/IMG-20261105-WA0010.jpg',
      'Images/IMG-20261105-WA0019.jpg'
    ] }
  ];

  groups.forEach(group => {
    const section = document.createElement('section');
    section.className = 'gallery-local-section';
    section.dataset.gallerySection = group.key;
    const heading = document.createElement('h2');
    heading.className = 'section-title gallery-local-heading';
    heading.textContent = group.title;
    section.appendChild(heading);
    const grid = document.createElement('div');
    grid.className = 'gallery-grid';
    group.images.forEach((path, index) => {
      const src = encodeURI(path);
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.dataset.src = src;
      item.dataset.category = group.key;
      const img = document.createElement('img');
      img.src = src;
      img.alt = `${group.title} photo ${index + 1}`;
      img.loading = 'lazy';
      const overlay = document.createElement('div');
      overlay.className = 'gallery-overlay';
      overlay.innerHTML = '<span>View Gallery ✦</span>';
      item.append(img, overlay);
      grid.appendChild(item);
    });
    section.appendChild(grid);
    mount.appendChild(section);
  });
}

/* ── Gallery Filter ── */
function initGalleryFilter() {
  const tabs  = document.querySelectorAll('.filter-tab');
  const items = document.querySelectorAll('.gallery-item[data-category]');
  if (!tabs.length) return;
  const sections = document.querySelectorAll('.gallery-local-section');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      items.forEach(item => {
        item.style.display = (filter === 'all' || item.dataset.category === filter) ? 'block' : 'none';
      });
      sections.forEach(section => {
        section.hidden = filter !== 'all' && section.dataset.gallerySection !== filter;
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
  const checkinField = document.getElementById('bk-checkin');
  const checkoutField = document.getElementById('bk-checkout');
  if (!checkinField || !checkoutField) return;
  const updateCheckoutValidity = () => {
    checkoutField.min = checkinField.value || localToday;
    checkoutField.setCustomValidity(checkoutField.value && checkinField.value && checkoutField.value <= checkinField.value
      ? 'Check-out must be after check-in.'
      : '');
  };
  checkinField.addEventListener('input', updateCheckoutValidity);
  checkinField.addEventListener('change', updateCheckoutValidity);
  checkoutField.addEventListener('input', updateCheckoutValidity);
  checkoutField.addEventListener('change', updateCheckoutValidity);
  updateCheckoutValidity();
}

function initBookingAddons() {
  const form = document.getElementById('bookingInquiryForm');
  if (!form) return;

  const packageField = document.getElementById('bk-package');
  const addonsGroup = document.getElementById('bk-addons');
  const addonsHidden = document.getElementById('bk-selected-addons');
  const addonOptions = addonsGroup ? Array.from(addonsGroup.querySelectorAll('.booking-addon-option')) : [];

  function updateAddons() {
    const eligibleAddons = addonOptions.filter(option => option.dataset.addonPackages.split(',').includes(packageField.value));
    addonOptions.forEach(option => {
      const eligible = eligibleAddons.includes(option);
      option.hidden = !eligible;
      if (!eligible) option.querySelector('input').checked = false;
    });
    addonsGroup.hidden = eligibleAddons.length === 0;
    const selectedAddons = eligibleAddons.map(option => option.querySelector('input')).filter(input => input.checked);
    addonsHidden.value = selectedAddons.map(input => `${input.dataset.addonName} — ₹${input.dataset.addonRate}/person/day`).join(', ');
  }

  packageField.addEventListener('change', updateAddons);
  addonOptions.forEach(option => option.querySelector('input').addEventListener('change', updateAddons));
  form.addEventListener('reset', () => requestAnimationFrame(updateAddons));
  updateAddons();
}

function initTentSlideshow() {
  const image = document.querySelector('[data-tent-slideshow]');
  if (!image) return;
  const photos = [
    'Images/Tent/Screenshot%202026-11-04%20101359.jpg',
    'Images/Tent/WhatsApp%20Image%202026-10-08%20at%203.04.18%20PM%20(1).jpeg'
  ];
  photos.slice(1).forEach(src => { const preload = new Image(); preload.src = src; });
  let current = 0;
  window.setInterval(() => {
    if (document.hidden) return;
    current = (current + 1) % photos.length;
    image.classList.add('is-fading');
    window.setTimeout(() => {
      image.src = photos[current];
      image.classList.remove('is-fading');
    }, 450);
  }, 10000);
}

function initRoomGallery() {
  document.querySelectorAll('[data-room-gallery]').forEach(gallery => {
    const track = gallery.querySelector('[data-room-gallery-track]');
    const previous = gallery.querySelector('[data-room-gallery-prev]');
    const next = gallery.querySelector('[data-room-gallery-next]');
    if (!track || !previous || !next) return;

    const scrollBySlide = direction => {
      const slide = track.querySelector('.room-gallery-slide');
      if (!slide) return;
      const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
      track.scrollBy({ left: direction * (slide.getBoundingClientRect().width + gap), behavior: 'smooth' });
    };

    previous.addEventListener('click', () => scrollBySlide(-1));
    next.addEventListener('click', () => scrollBySlide(1));
  });
}

function initReviewCarousels() {
  document.querySelectorAll('[data-reviews-carousel]').forEach(carousel => {
    const track = carousel.querySelector('[data-reviews-track]');
    if (!track) return;
    const cards = Array.from(track.querySelectorAll('.testimonial-card'));
    const previous = carousel.querySelector('[data-review-prev]');
    const next = carousel.querySelector('[data-review-next]');
    if (!cards.length || !previous || !next) return;

    function updateControls() {
      previous.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    }

    previous.addEventListener('click', () => {
      track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
    });
    next.addEventListener('click', () => {
      track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
    });
    track.addEventListener('scroll', () => requestAnimationFrame(updateControls), { passive: true });
    window.addEventListener('resize', updateControls);
    updateControls();
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
  initLocalImageGallery();
  initLightbox();
  initGalleryFilter();
  initForms();
  initDatePickers();
  initBookingAddons();
  initReviewCarousels();
  initRoomGallery();
  initTentSlideshow();
  initFAQ();
});
