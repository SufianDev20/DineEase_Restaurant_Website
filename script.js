document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.querySelector('.menu-toggle');
  const mobileMenu = createMobileMenuFromNav();
  if (toggleBtn) {
    // 1. Mobile Menu Toggle on click
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
    });
    // Close mobile menu when clicking outside
    document.addEventListener('click', (ev) => {
      if (!mobileMenu.contains(ev.target) && ev.target !== toggleBtn) mobileMenu.style.display = 'none';
    });
  }

  // Helper function to create the mobile menu
  function createMobileMenuFromNav() {
    let mm = document.querySelector('.mobile-menu');
    if (mm) return mm;
    mm = document.createElement('div');
    mm.className = 'mobile-menu';
    // Use the navigation links from the header to populate the mobile menu
    const navLinks = document.querySelectorAll('.main-header nav ul.nav-links li a');
    navLinks.forEach(a => {
      const na = a.cloneNode(true);
      // Close menu on link click
      na.addEventListener('click', () => mm.style.display = 'none');
      mm.appendChild(na);
    });
    document.body.appendChild(mm);
    return mm;
  }

  // Helper function to calculate header height for offset in smooth scroll
  function headerOffset() {
    const header = document.querySelector('.main-header');
    return header ? header.offsetHeight + 8 : 8;
  }

  // 2. Smooth scrolling for anchor links (e.g., #appetizers in menu.html)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      const target = document.querySelector(href);
      if (target && window.location.pathname.split('/').pop() === a.closest('header') ? '' : a.closest('header').querySelector('a[href="index.html"]')) {
        // Only smooth scroll if on the same page (or index.html)
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset();
        window.scrollTo({ top, behavior: 'smooth' });
        // Optionally update the URL hash
        history.pushState(null, '', href);
      }
    });
  });


  // 3. Category Tabs (Menu Page) - Click handler
  const tabLinks = document.querySelectorAll('.category-tabs a[href^="#"]');
  tabLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      // Remove active class from all, add to clicked link
      tabLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');

      const id = this.getAttribute('href');
      const target = document.querySelector(id);
      if (target) {
        // Smooth scroll to the section
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset() - 8;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // 4. Category Tabs (Menu Page) - Intersection Observer for scroll tracking
  const sections = Array.from(document.querySelectorAll('.dish-list'));
  if ('IntersectionObserver' in window && sections.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const id = '#' + en.target.id;
          const link = document.querySelector(`.category-tabs a[href="${id}"]`);
          if (link) {
            tabLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        }
      });
    }, {
      rootMargin: `-40% 0px -40% 0px`, // Detect when section is near the center
      threshold: 0.01
    });
    sections.forEach(s => io.observe(s));
  }

  // 5. Fade-in Animation (Intersection Observer)
  const fads = Array.from(document.querySelectorAll('.fade-in'));
  if ('IntersectionObserver' in window && fads.length) {
    const fadIO = new IntersectionObserver((entries, obs) => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          ent.target.classList.add('show');
          obs.unobserve(ent.target);
        }
      });
    }, { threshold: 0.08 });
    fads.forEach(f => fadIO.observe(f));
  } else {
    // Fallback for non-supporting browsers
    fads.forEach(f => f.classList.add('show'));
  }

  // 6. Form Validation (Simple Required Field Check)
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function (e) {
      const required = Array.from(form.querySelectorAll('[required]'));
      let ok = true;
      required.forEach(el => {
        if (!el.value || el.value.trim() === '') {
          ok = false;
          el.classList.add('invalid');
          showTempMessage(el, 'Please fill this field');
        }
      });
      if (!ok) {
        e.preventDefault(); // Stop form submission if invalid
        const first = form.querySelector('.invalid');
        if (first) first.focus();
      }
    });
  });

  // Helper function for showing validation messages
  function showTempMessage(el, text) {
    if (el.nextElementSibling && el.nextElementSibling.classList && el.nextElementSibling.classList.contains('invalid-msg')) return;
    const div = document.createElement('div');
    div.className = 'invalid-msg';
    div.style.color = '#ffb3a3';
    div.style.fontSize = '0.9rem';
    div.style.marginTop = '6px';
    div.textContent = text;
    el.parentNode.insertBefore(div, el.nextSibling);
    setTimeout(() => { if (div && div.parentNode) div.parentNode.removeChild(div); }, 3000);
  }

  // Remove invalid class on input
  document.addEventListener('input', (e) => {
    if (!e.target) return;
    if (e.target.classList && e.target.classList.contains('invalid')) {
      e.target.classList.remove('invalid');
    }
  });

  // 7. Header Scroll Effect (Adding 'scrolled' class)
  const header = document.querySelector('.main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 8) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }, { passive: true });
  }

  // 8. Active Navigation Link Highlighting
  // From script.js: Active Navigation Link Highlighting
  const page = window.location.pathname.split('/').pop().toLowerCase();
  document.querySelectorAll('.main-header nav ul.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    // Check if the current page filename matches the link's href
    if (href.toLowerCase().includes(page) || (href === 'index.html' && page === '')) {
      a.classList.add('active');
    }
  });

});