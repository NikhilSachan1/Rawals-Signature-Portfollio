(function () {
  'use strict';

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const siteHeader = document.getElementById('siteHeader');
  const menuBtn = document.getElementById('menuBtn');
  const mainNav = document.getElementById('mainNav');

  if (!siteHeader || !menuBtn || !mainNav) return;

  const closeMenu = () => {
    mainNav.classList.remove('open');
    menuBtn.classList.remove('open');
    siteHeader.classList.remove('menu-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const onScroll = () => {
    siteHeader.classList.toggle('scrolled', window.scrollY > 40);
    if (mainNav.classList.contains('open')) closeMenu();
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  menuBtn.addEventListener('click', () => {
    const open = !mainNav.classList.contains('open');
    if (open) {
      mainNav.classList.add('open');
      menuBtn.classList.add('open');
      siteHeader.classList.add('menu-open');
      menuBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      closeMenu();
    }
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  const applyProductFilter = (filter) => {
    productCards.forEach((card) => {
      const cat = card.dataset.category;
      const isSoon = card.classList.contains('product-card--soon');
      const hide = filter === 'all' ? isSoon : cat !== filter;
      card.classList.toggle('is-hidden', hide);
    });
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      applyProductFilter(btn.dataset.filter);
    });
  });

  const activeFilter = document.querySelector('.filter-btn.active');
  if (activeFilter) applyProductFilter(activeFilter.dataset.filter);
})();

(function initCustomScrollbar() {
  const root = document.documentElement;
  const bar = document.createElement('div');
  bar.className = 'scroll-thumb';
  bar.setAttribute('aria-hidden', 'true');

  const thumb = document.createElement('div');
  thumb.className = 'scroll-thumb__bar';
  bar.appendChild(thumb);
  document.body.appendChild(bar);

  let hideTimer;

  const update = () => {
    const scrollTop = root.scrollTop;
    const viewHeight = root.clientHeight;
    const scrollHeight = root.scrollHeight;
    const maxScroll = scrollHeight - viewHeight;

    if (maxScroll <= 1) {
      bar.classList.remove('is-visible');
      return;
    }

    const thumbHeight = Math.max(40, (viewHeight / scrollHeight) * viewHeight);
    const maxThumbTop = viewHeight - thumbHeight;
    const thumbTop = (scrollTop / maxScroll) * maxThumbTop;

    thumb.style.height = `${thumbHeight}px`;
    thumb.style.transform = `translate3d(0, ${thumbTop}px, 0)`;
  };

  const onScrollThumb = () => {
    update();
    bar.classList.add('is-visible');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => bar.classList.remove('is-visible'), 900);
  };

  window.addEventListener('scroll', onScrollThumb, { passive: true });
  window.addEventListener('resize', update);
  update();
  onScrollThumb();
})();
