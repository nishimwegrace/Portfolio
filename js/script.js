/**
 * Grace NISHIMWE — Portfolio interactions
 * Vanilla JavaScript modules (IIFE pattern)
 */

(function () {
  "use strict";

  const header = document.getElementById("site-header");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const themeToggle = document.getElementById("theme-toggle");
  const backToTop = document.getElementById("back-to-top");
  const contactForm = document.getElementById("contact-form");
  const yearEl = document.getElementById("current-year");
  const navLinks = document.querySelectorAll(".nav-link");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  /* ---------------------------------
     Theme (dark / light)
  --------------------------------- */
  function getPreferredTheme() {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    // Default to dark to match the portfolio design direction
    return "dark";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    if (themeToggle) {
      const next = theme === "dark" ? "light" : "dark";
      themeToggle.setAttribute("aria-label", `Switch to ${next} mode`);
    }
  }

  function initTheme() {
    applyTheme(getPreferredTheme());

    if (!themeToggle) return;

    themeToggle.addEventListener("click", function () {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  /* ---------------------------------
     Mobile navigation
  --------------------------------- */
  function setMenuOpen(isOpen) {
    if (!navToggle || !navMenu) return;

    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    navMenu.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
  }

  function initMobileMenu() {
    if (!navToggle || !navMenu) return;

    navToggle.addEventListener("click", function () {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      setMenuOpen(!isOpen);
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenuOpen(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenuOpen(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) setMenuOpen(false);
    });
  }

  /* ---------------------------------
     Navbar scroll effect
  --------------------------------- */
  function initNavbarScroll() {
    if (!header) return;

    function update() {
      header.classList.toggle("scrolled", window.scrollY > 24);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ---------------------------------
     Smooth scrolling (native + offset)
  --------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (event) {
        const id = anchor.getAttribute("href");
        if (!id || id === "#") return;

        const target = document.querySelector(id);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, "", id);
      });
    });
  }

  /* ---------------------------------
     Active navigation indicator
  --------------------------------- */
  function initActiveNavigation() {
    const sections = document.querySelectorAll("main section[id]");
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          const id = entry.target.id;
          navLinks.forEach(function (link) {
            const isActive = link.getAttribute("data-section") === id;
            link.classList.toggle("active", isActive);
          });
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0,
      }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ---------------------------------
     Scroll reveal animations
  --------------------------------- */
  function initScrollReveal() {
    const reveals = document.querySelectorAll(".reveal");
    if (!reveals.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveals.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          const delay = Number(entry.target.getAttribute("data-delay") || 0);
          window.setTimeout(function () {
            entry.target.classList.add("is-visible");
          }, delay);

          obs.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------------------------------
     Project filtering
  --------------------------------- */
  function initProjectFilters() {
    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const filter = button.getAttribute("data-filter") || "all";

        filterButtons.forEach(function (btn) {
          const active = btn === button;
          btn.classList.toggle("active", active);
          btn.setAttribute("aria-selected", String(active));
        });

        projectCards.forEach(function (card) {
          const categories = (card.getAttribute("data-categories") || "").split(/\s+/);
          const show = filter === "all" || categories.includes(filter);
          card.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

 /* --------------------------------- Contact form validation + EmailJS --------------------------------- */ function setFieldError(fieldId, message) { const field = document.getElementById(fieldId); const error = document.getElementById(fieldId + "-error"); const group = field ? field.closest(".form-group") : null; if (group) { group.classList.toggle("is-invalid", Boolean(message)); } if (error) { error.textContent = message || ""; } if (field) { field.setAttribute( "aria-invalid", message ? "true" : "false" ); } } function isValidEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); } function showFormStatus(type, message) { const status = document.getElementById("form-status"); if (!status) return; status.className = "form-note is-visible " + type; status.textContent = message; } function validateContactForm() { const name = document.getElementById("name"); const email = document.getElementById("email"); const subject = document.getElementById("subject"); const message = document.getElementById("message"); let valid = true; /* Name */ if ( !name || !name.value.trim() || name.value.trim().length < 2 ) { setFieldError( "name", "Please enter your name (at least 2 characters)." ); valid = false; } else { setFieldError("name", ""); } /* Email */ if ( !email || !email.value.trim() || !isValidEmail(email.value.trim()) ) { setFieldError( "email", "Please enter a valid email address." ); valid = false; } else { setFieldError("email", ""); } /* Subject */ if ( !subject || !subject.value.trim() || subject.value.trim().length < 3 ) { setFieldError( "subject", "Please enter a subject (at least 3 characters)." ); valid = false; } else { setFieldError("subject", ""); } /* Message */ if ( !message || !message.value.trim() || message.value.trim().length < 10 ) { setFieldError( "message", "Please write a message (at least 10 characters)." ); valid = false; } else { setFieldError("message", ""); } return valid; } function initContactForm() { if (!contactForm) return; /* Clear field errors while typing */ ["name", "email", "subject", "message"].forEach(function (id) { const field = document.getElementById(id); if (!field) return; field.addEventListener("input", function () { setFieldError(id, ""); }); }); /* Submit form */ contactForm.addEventListener("submit", function (event) { event.preventDefault(); /* Validate form */ if (!validateContactForm()) { showFormStatus( "error", "Please fix the highlighted fields and try again." ); return; } /* Disable button while sending */ const submitButton = contactForm.querySelector( 'button[type="submit"]' ); if (submitButton) { submitButton.disabled = true; submitButton.textContent = "Sending..."; } /* Send with EmailJS */ emailjs .sendForm( "service_h3pz4m9", "template_frph61c", contactForm ) .then(function () { showFormStatus( "success", "Your message has been sent successfully!" ); contactForm.reset(); ["name", "email", "subject", "message"].forEach(function (id) { setFieldError(id, ""); }); }) .catch(function (error) { console.error("EmailJS error:", error); showFormStatus( "error", "Unable to send your message. Please try again later." ); }) .finally(function () { /* Re-enable button */ if (submitButton) { submitButton.disabled = false; submitButton.textContent = "Send Message"; } }); }); }

  /* ---------------------------------
     Back to top
  --------------------------------- */
  function initBackToTop() {
    if (!backToTop) return;

    function update() {
      backToTop.classList.toggle("is-visible", window.scrollY > 480);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });

    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------------------------
     Footer year
  --------------------------------- */
  function initCurrentYear() {
    if (!yearEl) return;
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------------------------------
     Init
  --------------------------------- */
  function init() {
    initTheme();
    initMobileMenu();
    initNavbarScroll();
    initSmoothScroll();
    initActiveNavigation();
    initScrollReveal();
    initProjectFilters();
    initContactForm();
    initBackToTop();
    initCurrentYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
