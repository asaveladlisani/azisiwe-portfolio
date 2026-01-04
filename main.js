// Navigation and UI functionality
function initNavigation() {
  const hamburgerIcon = document.querySelector(".hamburger-icon");
  const menuLinks = document.querySelector(".menu-links");
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-links a, .menu-links a");

  // Toggle hamburger menu
  function toggleMenu() {
  const isOpen = menuLinks.classList.toggle("open");
  hamburgerIcon.classList.toggle("open");

  // Accessibility
  hamburgerIcon.setAttribute("aria-expanded", isOpen);
  menuLinks.setAttribute("aria-hidden", !isOpen);

  // Lock body scroll
  if (isOpen) {
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
  } else {
    document.body.style.position = "";
    document.body.style.width = "";
  }
}

// Click + keyboard
hamburgerIcon.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleMenu();
});

hamburgerIcon.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggleMenu();
  }
});

// Close when clicking a menu link
menuLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuLinks.classList.remove("open");
    hamburgerIcon.classList.remove("open");
    hamburgerIcon.setAttribute("aria-expanded", "false");
    menuLinks.setAttribute("aria-hidden", "true");
    document.body.style.position = "";
    document.body.style.width = "";
  });
});

// Close when clicking outside
document.addEventListener("click", (e) => {
  if (!hamburgerIcon.contains(e.target) && !menuLinks.contains(e.target)) {
    menuLinks.classList.remove("open");
    hamburgerIcon.classList.remove("open");
    hamburgerIcon.setAttribute("aria-expanded", "false");
    menuLinks.setAttribute("aria-hidden", "true");
    document.body.style.position = "";
    document.body.style.width = "";
  }
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

// Scroll animations using Intersection Observer
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
      }
    });
  }, observerOptions);

  // Observe all sections except home
  document.querySelectorAll('section:not(#home)').forEach(section => {
    observer.observe(section);
  });

  // Observe skill items
  document.querySelectorAll('.skill-item').forEach(item => {
    observer.observe(item);
  });

  // Observe blog cards
  document.querySelectorAll('.blog-card').forEach(card => {
    observer.observe(card);
  });

  // Observe contact items
  document.querySelectorAll('.contact-item').forEach(item => {
    observer.observe(item);
  });
}

// Contact form handling
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const submitBtn = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);

    // ✅ Add access key ONLY here
    formData.append("access_key", "f2e8c0f0-0754-4905-b96d-4a1c746ed822");
    formData.append("subject", "New Portfolio Contact Message");

    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // ✅ Validation
    if (!name || !email || !message) {
      showNotification("Please fill in all fields", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showNotification("Please enter a valid email address", "error");
      return;
    }

    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        showNotification("Message sent successfully! Thank you.", "success");
        contactForm.reset();
      } else {
        showNotification(data.message || "Failed to send message.", "error");
      }

    } catch (error) {
      showNotification("Network error. Please try again.", "error");
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
  // Remove existing notification
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
      <span>${message}</span>
    </div>
  `;

  // Add to page
  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => notification.classList.add('show'), 100);

  // Hide notification after 5 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80; // Account for fixed navigation
        const targetPosition = target.offsetTop - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Typing animation for the subtitle
function initTypingAnimation() {
  const subtitle = document.querySelector('.subtitle');
  if (subtitle) {
    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.borderRight = '2px solid #6366f1';

    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        subtitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        subtitle.style.borderRight = 'none';
      }
    };

    // Start typing animation after a delay
    setTimeout(typeWriter, 1000);
  }
}

// Parallax effect for background
function initParallaxEffect() {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const homeSection = document.getElementById('home');

    if (homeSection) {
      const rate = scrolled * -0.5;
      homeSection.style.backgroundPosition = `center ${rate}px`;
    }
  });
}

// Initialize all functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  initNavigation();
  initScrollAnimations();
  initContactForm();
  initSmoothScrolling();
  initTypingAnimation();
  initParallaxEffect();
  initFooter();

  // Add loading animation
  document.body.classList.add('loaded');
});

// Footer functionality
function initFooter() {
  // Update current year
  const currentYearElement = document.getElementById('currentYear');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }
}

// Add CSS for notifications
const notificationStyles = `
  .notification {
    position: fixed;
    top: 100px;
    right: 20px;
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 400px;
  }

  .notification.show {
    transform: translateX(0);
  }

  .notification-content {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
  }

  .notification.success {
    background: rgba(16, 185, 129, 0.9);
    color: white;
  }

  .notification.error {
    background: rgba(239, 68, 68, 0.9);
    color: white;
  }

  .notification.info {
    background: rgba(99, 102, 241, 0.9);
    color: white;
  }

  .notification i {
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    .notification {
      left: 20px;
      right: 20px;
      max-width: none;
    }
  }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Add loading animation styles
const loadingStyles = `
  body {
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  body.loaded {
    opacity: 1;
  }
`;

const loadingStyleSheet = document.createElement('style');
loadingStyleSheet.textContent = loadingStyles;
document.head.appendChild(loadingStyleSheet);
