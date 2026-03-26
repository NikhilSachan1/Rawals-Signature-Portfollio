function initRawalsPage() {
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var mainNav = document.getElementById("mainNav");
  function handleHeaderState() {
    if (!mainNav) return;
    if (window.scrollY > 16) mainNav.classList.add("scrolled");
    else mainNav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", handleHeaderState);
  handleHeaderState();

  var backToTop = document.getElementById("backToTop");
  function toggleBackToTop() {
    if (!backToTop) return;
    if (window.scrollY > 350) backToTop.classList.add("visible");
    else backToTop.classList.remove("visible");
  }
  window.addEventListener("scroll", toggleBackToTop);
  toggleBackToTop();

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    var href = link.getAttribute("href");
    if (!href || href === "#") return;
    link.addEventListener("click", function (event) {
      var target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      var mobileNav = document.getElementById("mobileNav");
      if (mobileNav && mobileNav.classList.contains("show") && typeof bootstrap !== "undefined") {
        bootstrap.Collapse.getOrCreateInstance(mobileNav).hide();
      }
    });
  });

  var revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var delay = entry.target.getAttribute("data-reveal-delay");
        if (delay) {
          setTimeout(function () {
            entry.target.classList.add("in-view");
          }, parseInt(delay, 10));
        } else {
          entry.target.classList.add("in-view");
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealElements.forEach(function (el) { observer.observe(el); });
  } else {
    revealElements.forEach(function (el) { el.classList.add("in-view"); });
  }

  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = document.getElementById("name").value.trim();
      var phone = document.getElementById("phone").value.trim();
      var message = document.getElementById("message").value.trim();

      if (!name || !phone || !message) {
        showToast("Please fill all required fields.", "warning");
        return;
      }
      if (!/^\d{10}$/.test(phone)) {
        showToast("Please enter a valid 10-digit phone number.", "warning");
        return;
      }

      var btn = contactForm.querySelector('button[type="submit"]');
      var previous = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Sending...";

      setTimeout(function () {
        contactForm.reset();
        btn.disabled = false;
        btn.textContent = previous;
        showToast("Thanks! We will contact you soon.", "success");
      }, 1000);
    });
  }

  function showToast(message, type) {
    var oldToast = document.querySelector(".rawals-toast");
    if (oldToast) oldToast.remove();

    var toast = document.createElement("div");
    toast.className = "rawals-toast";
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.right = "16px";
    toast.style.bottom = "16px";
    toast.style.zIndex = "9999";
    toast.style.padding = "10px 14px";
    toast.style.borderRadius = "8px";
    toast.style.fontSize = "14px";
    toast.style.boxShadow = "0 10px 20px rgba(0,0,0,0.16)";
    if (type === "success") {
      toast.style.background = "#264d2d";
      toast.style.color = "#fff";
    } else {
      toast.style.background = "#fff";
      toast.style.color = "#2c241f";
      toast.style.border = "1px solid #d5c7b4";
    }
    document.body.appendChild(toast);

    setTimeout(function () {
      toast.remove();
    }, 2500);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initRawalsPage);
} else {
  initRawalsPage();
}
