(function () {
  const HEADER_OFFSET = 80;

  const nav = document.getElementById('site-nav');
  const navToggle = document.querySelector('.nav-toggle');
  const backdrop = document.querySelector('[data-backdrop]');

  function setExpanded(isOpen) {
    navToggle.setAttribute('aria-expanded', String(isOpen));
    nav.classList.toggle('is-open', isOpen);
    if (backdrop) backdrop.hidden = !isOpen;
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeNav() {
    setExpanded(false);
  }

  if (nav && navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.contains('is-open');
      setExpanded(!isOpen);
    });

    if (backdrop) {
      backdrop.addEventListener('click', closeNav);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      closeNav();

      const y = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    window.addEventListener(
      'scroll',
      () => {
        const value = Math.min(window.scrollY * 0.12, 80);
        heroBg.style.setProperty('--parallax', `${value}px`);
      },
      { passive: true }
    );
  }

  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    revealEls.forEach((el) => io.observe(el));
  }

  const lightboxDialog = document.querySelector('[data-lightbox-dialog]');
  const lightboxImg = document.querySelector('[data-lightbox-img]');
  const lightboxClose = document.querySelector('[data-lightbox-close]');

  function closeLightbox() {
    if (!lightboxDialog) return;
    if (typeof lightboxDialog.close === 'function' && lightboxDialog.open) {
      lightboxDialog.close();
    }
  }

  document.querySelectorAll('[data-lightbox]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const src = btn.getAttribute('data-src');
      if (!src || !lightboxDialog || !lightboxImg) return;

      lightboxImg.src = src;
      if (typeof lightboxDialog.showModal === 'function') {
        lightboxDialog.showModal();
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxDialog) {
    lightboxDialog.addEventListener('click', (e) => {
      const rect = lightboxDialog.getBoundingClientRect();
      const inDialog =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (!inDialog) closeLightbox();
    });
  }

  const form = document.getElementById('contact-form');
  if (form) {
    const fields = ['name', 'email', 'phone', 'message'];

    function setError(name, message) {
      const el = form.querySelector(`[data-error-for="${name}"]`);
      if (el) el.textContent = message || '';
    }

    function validate() {
      let ok = true;

      fields.forEach((name) => {
        setError(name, '');
        const input = form.querySelector(`[name="${name}"]`);
        if (!input) return;

        const value = String(input.value || '').trim();
        if (input.hasAttribute('required') && !value) {
          setError(name, 'Este campo es obligatorio.');
          ok = false;
          return;
        }

        if (name === 'email' && value) {
          const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!re.test(value)) {
            setError(name, 'Ingresa un email válido.');
            ok = false;
          }
        }

        if (name === 'message' && value && value.length < 10) {
          setError(name, 'Escribe al menos 10 caracteres.');
          ok = false;
        }

        if (name === 'phone' && value && value.replace(/\D/g, '').length < 8) {
          setError(name, 'Ingresa un teléfono válido.');
          ok = false;
        }
      });

      return ok;
    }

    form.addEventListener('submit', (e) => {
      if (!validate()) {
        e.preventDefault();
        const firstError = form.querySelector('.error:not(:empty)');
        if (firstError) {
          const fieldName = firstError.getAttribute('data-error-for');
          const input = fieldName ? form.querySelector(`[name="${fieldName}"]`) : null;
          if (input && typeof input.focus === 'function') input.focus();
        }
      }
    });
  }
})();
