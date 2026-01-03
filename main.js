function initNavigation() {
  const hamburgerIcon = document.querySelector(".hamburger-icon");
  const menuLinks = document.querySelector(".menu-links");
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-links a, .menu-links a");

  // Toggle hamburger menu
  function toggleMenu() {
    const isOpen = menuLinks.classList.toggle('open');
    hamburgerIcon.classList.toggle('open');
    hamburgerIcon.setAttribute('aria-expanded', isOpen);
    menuLinks.setAttribute('aria-hidden', !isOpen);
  }

  hamburgerIcon.addEventListener('click', toggleMenu);
  hamburgerIcon.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  });

  // Close menu on link click
  document.querySelectorAll('.menu-links a').forEach(link => {
    link.addEventListener('click', () => {
      menuLinks.classList.remove('open');
      hamburgerIcon.classList.remove('open');
      hamburgerIcon.setAttribute('aria-expanded', 'false');
      menuLinks.setAttribute('aria-hidden', 'true');
    });
  });

  // Active link highlighting on scroll
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  });

  function updateActiveLink() {
    let currentSection = "";
    const offset = window.innerWidth <= 768 ? 100 : 150;
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - offset) {
        currentSection = section.getAttribute("id");
      }
    });
    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", initNavigation);
