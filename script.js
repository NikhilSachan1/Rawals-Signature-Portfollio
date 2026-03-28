/**
 * RitVirsa — Landing Page Scripts
 * Bootstrap 5 + Vanilla JS - Smooth modern animations
 */

function initRitvirsaPage() {
  'use strict';

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Order on WhatsApp — prefill message with product name + image URL (wa.me cannot attach files; link shares the asset)
  var WA_ORDER_PHONE = '9232084970';
  function waOrderAbsoluteUrl(src) {
    if (!src || !String(src).trim()) return '';
    try {
      return new URL(src, window.location.href).href;
    } catch (e) {
      return src;
    }
  }
  function buildWaOrderMessage(productName, imageSrc) {
    var lines = [
      'Hi RitVirsa!',
      '',
      'I want to order: *' + productName + '*'
    ];
    if (imageSrc) {
      lines.push('');
      lines.push('Product image (open link to view):');
      lines.push(imageSrc);
    }
    lines.push('');
    lines.push('Please confirm pack size, price & delivery.');
    return lines.join('\n');
  }
  document.querySelectorAll('a.wa-order-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var product = 'RitVirsa order';
      var imgSrc = '';
      var card = link.closest('.chutney-card');
      if (card) {
        var titleEl = card.querySelector('.chutney-card-title');
        if (titleEl) product = titleEl.textContent.trim();
        var imgEl = card.querySelector('.chutney-card-img-box img');
        if (imgEl) imgSrc = waOrderAbsoluteUrl(imgEl.getAttribute('src') || '');
      } else if (link.classList.contains('btn-hero-sample-primary')) {
        product = 'Order from website (hero)';
        var heroIm = document.querySelector('.hero-img-main');
        if (heroIm) imgSrc = waOrderAbsoluteUrl(heroIm.getAttribute('src') || '');
      }
      var url =
        'https://wa.me/' + WA_ORDER_PHONE + '?text=' + encodeURIComponent(buildWaOrderMessage(product, imgSrc));
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  });

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

  // Nav scroll-spy: highlight section link while scrolling
  var spySectionIds = [
    'hero',
    'about',
    'products',
    'spices',
    'chips-snacks',
    'healthy-fruits',
    'features',
    'contact'
  ];

  function updateNavScrollSpy() {
    var nav = document.getElementById('mainNav');
    var offset = nav ? nav.offsetHeight + 28 : 100;
    var line = window.scrollY + offset;
    var activeId = spySectionIds[0];
    for (var i = 0; i < spySectionIds.length; i++) {
      var sec = document.getElementById(spySectionIds[i]);
      if (!sec) continue;
      var top = sec.getBoundingClientRect().top + window.scrollY;
      if (top <= line) {
        activeId = spySectionIds[i];
      }
    }
    document.querySelectorAll('#mainNav a.nav-link-sample[href^="#"]').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href || href.length < 2) return;
      var id = href.slice(1);
      if (id === activeId) {
        link.classList.add('nav-link-active');
      } else {
        link.classList.remove('nav-link-active');
      }
    });
    document.querySelectorAll('#mainNav .btn-shop-sample[href="#contact"]').forEach(function (btn) {
      if (activeId === 'contact') {
        btn.classList.add('btn-shop-sample--active');
      } else {
        btn.classList.remove('btn-shop-sample--active');
      }
    });
  }

  var spyTicking = false;
  window.addEventListener(
    'scroll',
    function () {
      if (!spyTicking) {
        window.requestAnimationFrame(function () {
          updateNavScrollSpy();
          spyTicking = false;
        });
        spyTicking = true;
      }
    },
    { passive: true }
  );
  window.addEventListener('resize', function () {
    updateNavScrollSpy();
  });
  updateNavScrollSpy();

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
    var phrases = [
      'Marwadi Lahsun chutney',
      'Garlic chutney',
      'Banana chips',
      'Makhana',
      'Potato chips'
    ];
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
  document.addEventListener('DOMContentLoaded', initRitvirsaPage);
} else {
  initRitvirsaPage();
}
