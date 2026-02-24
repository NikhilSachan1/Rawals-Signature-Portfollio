/**
 * Rawals Signature Chutney - Landing Page Scripts
 * Bootstrap 5 + Vanilla JS - Smooth modern animations
 */

function initRawalsPage() {
  'use strict';

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Navbar: slide-in on load, then scroll state
  var mainNav = document.getElementById('mainNav');
  if (mainNav) {
    mainNav.classList.add('nav-visible');
    function updateNavbar() {
      if (window.scrollY > 50) {
        mainNav.classList.add('scrolled');
      } else {
        mainNav.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', updateNavbar);
    updateNavbar();
  }

  // Back to top button - show after scrolling down
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    function toggleBackToTop() {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
    window.addEventListener('scroll', toggleBackToTop);
    toggleBackToTop();
  }

  // Hero staggered reveal - run after paint so initial state is visible first
  function runHeroReveal() {
    var heroReveals = document.querySelectorAll('.hero-reveal, .hero-reveal-right');
    heroReveals.forEach(function (el) {
      var delay = parseInt(el.getAttribute('data-delay') || 0, 10);
      setTimeout(function () {
        el.classList.add('revealed');
      }, 150 + delay);
    });
    var scrollReveal = document.querySelector('.hero-scroll-reveal');
    if (scrollReveal) {
      setTimeout(function () {
        scrollReveal.classList.add('revealed');
      }, 700);
    }
  }
  requestAnimationFrame(function () {
    setTimeout(runHeroReveal, 50);
  });

  // Typewriter effect in hero
  (function runTypewriter() {
    var el = document.getElementById('heroTypewriter');
    if (!el) return;
    var phrases = ['Mirchi Chutney', 'Aam Chutney', 'Tomato Chutney', 'Marwadi Lahsun'];
    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var typeSpeed = 90;
    var deleteSpeed = 50;
    var pauseEnd = 1800;
    var pauseStart = 600;

    function tick() {
      var current = phrases[phraseIndex];
      if (isDeleting) {
        el.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(tick, pauseStart);
          return;
        }
        setTimeout(tick, deleteSpeed);
        return;
      }
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(tick, pauseEnd);
        return;
      }
      setTimeout(tick, typeSpeed);
    }
    setTimeout(tick, 800);
  })();

  // Nav links: smooth scroll + close mobile menu (Bootstrap 5)
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === '#') return;
    link.addEventListener('click', function (e) {
      var targetId = href.slice(1);
      var target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      if (history.replaceState) history.replaceState(null, '', href);
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      var collapse = document.getElementById('navbarNav');
      if (collapse && collapse.classList.contains('show') && typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
        var bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapse);
        bsCollapse.hide();
      }
    });
  });

  // Contact form submit
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !phone || !message) {
        showToast('Please fill all required fields.', 'warning');
        return;
      }

      if (phone.length !== 10 || !/^\d+$/.test(phone)) {
        showToast('Please enter a valid 10-digit phone number.', 'warning');
        return;
      }

      // Simulate submit (replace with actual API/backend later)
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'भेज रहे हैं...';

      setTimeout(function () {
        showToast('Thank you! Your message has been received. We will get in touch soon.', 'success');
        contactForm.reset();
        btn.disabled = false;
        btn.textContent = originalText;
      }, 1200);
    });
  }

  // Simple toast notification (no extra dependency)
  function showToast(message, type) {
    const existing = document.querySelector('.rawals-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'rawals-toast position-fixed bottom-0 end-0 m-4 p-3 rounded-3 shadow-lg border-0';
    toast.style.zIndex = '9999';
    toast.style.minWidth = '280px';
    toast.style.animation = 'slideIn 0.3s ease';

    if (type === 'success') {
      toast.style.background = 'linear-gradient(135deg, #2d5a27, #1e3d1a)';
      toast.style.color = '#fff';
    } else {
      toast.style.background = '#fff';
      toast.style.color = '#1e3d1a';
      toast.style.border = '2px solid #c9a227';
    }

    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(function () {
        toast.remove();
      }, 300);
    }, 4000);
  }

  // Add keyframe for toast animation
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = '@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }';
    document.head.appendChild(style);
  }

  // Stagger delay for scroll animations (from data-stagger on parent)
  var STAGGER_MS = 100;

  function triggerStaggerInView(entry) {
    var col = entry.target;
    var stagger = parseInt(col.getAttribute('data-stagger'), 10);
    if (isNaN(stagger)) stagger = 0;
    var card = col.querySelector('.product-card, .feature-box, .about-card, .testimonial-card');
    var el = card || col;
    if (!el.classList.contains('animate-on-scroll')) el.classList.add('animate-on-scroll');
    setTimeout(function () {
      el.classList.add('in-view');
    }, stagger * STAGGER_MS);
  }

  var staggerCols = document.querySelectorAll('[data-stagger]');
  var sectionHeads = document.querySelectorAll('.section-head-reveal, .section-sample-head, .cta-reveal');
  var observerOptions = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        if (entry.target.hasAttribute('data-stagger')) {
          triggerStaggerInView(entry);
        } else {
          entry.target.classList.add('in-view');
        }
      });
    },
    observerOptions
  );

  staggerCols.forEach(function (col) {
    var card = col.querySelector('.product-card, .feature-box, .about-card, .testimonial-card');
    (card || col).classList.add('animate-on-scroll');
    observer.observe(col);
  });

  sectionHeads.forEach(function (el) {
    observer.observe(el);
  });

  // Deterrent: reduce casual right-click inspect / view source (capture phase so it runs before browser)
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  }, true);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U') ||
        (e.metaKey && e.key === 'u') ||
        (e.metaKey && e.altKey && e.key === 'I')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);
}

// Run when DOM is ready; Bootstrap script runs before this
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRawalsPage);
} else {
  initRawalsPage();
}
