/* ============================================================
   AROK INDIA — EPK SCRIPT
   Vanilla JS only. No dependencies.
============================================================= */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initPreloader();
    initStickyNav();
    initMobileMenu();
    initSmoothScroll();
    initScrollReveal();
    initCounters();
    initBackToTop();
    initPrintButton();
    initFooterYear();
  });

  /* ------------------------------------------------------------
     Preloader — hide once page has finished loading
  --------------------------------------------------------------*/
  function initPreloader() {
    var preloader = document.getElementById('preloader');
    if (!preloader) return;

    function hide() {
      preloader.classList.add('is-hidden');
    }

    if (document.readyState === 'complete') {
      setTimeout(hide, 300);
    } else {
      window.addEventListener('load', function () {
        setTimeout(hide, 300);
      });
      // Safety net in case load event is delayed
      setTimeout(hide, 2500);
    }
  }

  /* ------------------------------------------------------------
     Sticky Navigation — background/blur on scroll
  --------------------------------------------------------------*/
  function initStickyNav() {
    var header = document.getElementById('siteHeader');
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 40) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------------------------
     Mobile Menu Toggle
  --------------------------------------------------------------*/
  function initMobileMenu() {
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    menu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ------------------------------------------------------------
     Smooth Scroll for in-page anchors (with header offset)
  --------------------------------------------------------------*/
  function initSmoothScroll() {
    var header = document.getElementById('siteHeader');
    var links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;
        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        var headerHeight = header ? header.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight + 1;

        window.scrollTo({ top: top, behavior: 'smooth' });
        history.pushState(null, '', targetId);
      });
    });
  }

  /* ------------------------------------------------------------
     Scroll Reveal Animations — IntersectionObserver
  --------------------------------------------------------------*/
  function initScrollReveal() {
    var revealEls = document.querySelectorAll('.reveal, .reveal-item');
    if (!revealEls.length) return;

    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------------------------------------------
     Animated Counters
  --------------------------------------------------------------*/
  function initCounters() {
    var counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    function animateCounter(el) {
      var target = parseInt(el.getAttribute('data-target'), 10) || 0;
      var duration = 1600;
      var startTime = null;

      function step(timestamp) {
        if (startTime === null) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        var value = Math.floor(eased * target);
        el.textContent = value;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCounter);
      return;
    }

    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ------------------------------------------------------------
     Back to Top Button
  --------------------------------------------------------------*/
  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;

    function onScroll() {
      if (window.scrollY > 600) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------
     Print / Export Technical Rider as PDF
  --------------------------------------------------------------*/
  function initPrintButton() {
    var printBtn = document.getElementById('printRiderBtn');
    if (!printBtn) return;

    printBtn.addEventListener('click', function () {
      window.print();
    });
  }

  /* ------------------------------------------------------------
     Footer Year
  --------------------------------------------------------------*/
  function initFooterYear() {
    var yearEl = document.getElementById('footerYear');
    if (!yearEl) return;
    yearEl.textContent = new Date().getFullYear();
  }

})();
