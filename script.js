"use strict";

/* =========================================
   1. SELECT HTML ELEMENTS
========================================= */

const header = document.querySelector(".header");
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const navItems = document.querySelectorAll(".nav-link");
const currentYear = document.getElementById("current-year");
const profilePhoto = document.querySelector(".profile-photo");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

const CONTACT_EMAIL = "muzammilpakistanim@gmail.com";


/* =========================================
   2. MOBILE NAVIGATION
========================================= */

function isMenuOpen() {
  return Boolean(navLinks && navLinks.classList.contains("open"));
}

function setMenu(open) {
  if (!menuToggle || !navLinks) return;

  navLinks.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute(
    "aria-label",
    open ? "Close navigation menu" : "Open navigation menu"
  );

  const icon = menuToggle.querySelector("i");
  if (icon) {
    icon.classList.toggle("fa-bars", !open);
    icon.classList.toggle("fa-xmark", open);
  }
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => setMenu(!isMenuOpen()));

  // Menu ke kisi bhi link par click karne se menu band
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  // Menu ke bahar click par band
  document.addEventListener("click", (event) => {
    if (
      isMenuOpen() &&
      !navLinks.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      setMenu(false);
    }
  });

  // Escape se band (focus sirf tab wapas jab menu khula tha)
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isMenuOpen()) {
      setMenu(false);
      menuToggle.focus();
    }
  });

  // Desktop size par menu band (purane Safari ke liye fallback ke sath)
  const desktopQuery = window.matchMedia("(min-width: 761px)");
  const handleResize = (event) => {
    if (event.matches) setMenu(false);
  };

  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener("change", handleResize);
  } else if (desktopQuery.addListener) {
    desktopQuery.addListener(handleResize);
  }
}


/* =========================================
   3. AUTOMATIC COPYRIGHT YEAR
========================================= */

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}


/* =========================================
   4. HEADER SHADOW ON SCROLL
========================================= */

function handleHeaderShadow() {
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 10);
  }
}

handleHeaderShadow();
window.addEventListener("scroll", handleHeaderShadow, { passive: true });


/* =========================================
   5. ACTIVE NAVIGATION LINK
========================================= */

const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window && sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const sectionId = entry.target.id;

        navItems.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${sectionId}`;
          link.classList.toggle("active", isActive);

          if (isActive) {
            link.setAttribute("aria-current", "page");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    { root: null, rootMargin: "-25% 0px -60% 0px", threshold: 0 }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}


/* =========================================
   6. REVEAL ON SCROLL
   (<html> par "js" class head wali script lagati hai)
========================================= */

if (document.documentElement.classList.contains("js")) {
  const revealTargets = document.querySelectorAll(
    ".section-heading, .about-main, .fact-card, .skill-card, .project-card, .education-card, .contact-card"
  );

  revealTargets.forEach((el, index) => {
    el.classList.add("reveal");

    // Grid ke cards thori thori der baad aayen (stagger effect)
    const siblings = el.parentElement ? el.parentElement.children : [];
    const position = Array.prototype.indexOf.call(siblings, el);
    el.style.setProperty("--delay", `${(position % 3) * 0.08}s`);
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));
}


/* =========================================
   7. PROFILE PHOTO FALLBACK
   Photo na mile to placeholder nazar aata hai
========================================= */

if (profilePhoto) {
  const hidePhoto = () => {
    profilePhoto.style.display = "none";
  };

  profilePhoto.addEventListener("error", hidePhoto);

  // Agar error pehle hi ho chuka ho
  if (profilePhoto.complete && profilePhoto.naturalWidth === 0) {
    hidePhoto();
  }
}


/* =========================================
   8. CONTACT FORM
   Ye form user ka email app kholta hai aur message pehle se likh deta hai.
========================================= */

function setFormStatus(message, type) {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.className = `form-status ${type || ""}`.trim();
}

if (contactForm) {
  const fields = contactForm.querySelectorAll("input, textarea");

  // Likhte hi error nishan hat jaye
  fields.forEach((field) => {
    field.addEventListener("input", () => {
      field.closest(".form-group").classList.remove("invalid");
      setFormStatus("", "");
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let firstInvalid = null;

    fields.forEach((field) => {
      const valid = field.value.trim() !== "" && field.checkValidity();
      field.closest(".form-group").classList.toggle("invalid", !valid);
      if (!valid && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      setFormStatus("Please fill in all fields correctly.", "error");
      firstInvalid.focus();
      return;
    }

    const name = contactForm.elements.name.value.trim();
    const email = contactForm.elements.email.value.trim();
    const message = contactForm.elements.message.value.trim();

    const subject = `Portfolio message from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;

    window.location.href =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    setFormStatus("Opening your email app. Please press Send there.", "success");
    contactForm.reset();
  });
}