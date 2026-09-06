/**
 * ITe-Bot Landing Page — Script Dinámico y Ligero
 * Carga de configuración JSON local + Formateo de enlaces de WhatsApp
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initLanding();
});

async function initLanding() {
  let cfg = null;

  try {
    const res = await fetch('landing.json', { cache: 'no-store' });
    if (res.ok) {
      cfg = await res.json();
    }
  } catch (err) {
    console.warn('[LANDING] Usando valores estáticos por defecto (fallback local):', err);
  }

  if (cfg) {
    applyConfig(cfg);
  }

  setupSmoothScroll();
  setupYear();
}

function applyConfig(cfg) {
  // 1. Marca y Hero
  if (cfg.brand) {
    const brandNameEls = document.querySelectorAll('.bind-brand-name');
    brandNameEls.forEach(el => el.textContent = cfg.brand.name || 'ITe-Bot');

    if (cfg.brand.badge) {
      const badgeEl = document.getElementById('hero-badge-text');
      if (badgeEl) badgeEl.textContent = cfg.brand.badge;
    }

    if (cfg.brand.headline) {
      const h1El = document.getElementById('hero-headline');
      if (h1El) h1El.textContent = cfg.brand.headline;
    }

    if (cfg.brand.subheadline) {
      const pEl = document.getElementById('hero-subheadline');
      if (pEl) pEl.textContent = cfg.brand.subheadline;
    }
  }

  // 2. WhatsApp CTA
  if (cfg.whatsapp && cfg.whatsapp.phone) {
    const phone = cfg.whatsapp.phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(cfg.whatsapp.default_message || '¡Hola!');
    const waUrl = `https://wa.me/${phone}?text=${msg}`;

    const waLinks = document.querySelectorAll('.bind-wa-link');
    waLinks.forEach(a => {
      a.href = waUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    });

    if (cfg.whatsapp.cta_text) {
      const ctaBtn = document.getElementById('hero-cta-btn');
      if (ctaBtn) {
        ctaBtn.innerHTML = `<span>💬</span> ${cfg.whatsapp.cta_text}`;
      }
    }
  }

  // 3. Contacto en Footer
  if (cfg.contact) {
    const addrEl = document.getElementById('contact-address');
    if (addrEl && cfg.contact.address) addrEl.textContent = cfg.contact.address;

    const hoursEl = document.getElementById('contact-hours');
    if (hoursEl && cfg.contact.hours) hoursEl.textContent = cfg.contact.hours;

    const phoneEl = document.getElementById('contact-phone');
    if (phoneEl && cfg.contact.phone) phoneEl.textContent = cfg.contact.phone;

    const emailEl = document.getElementById('contact-email');
    if (emailEl && cfg.contact.email) {
      emailEl.textContent = cfg.contact.email;
      emailEl.href = `mailto:${cfg.contact.email}`;
    }
  }

  // 4. Navegación al Login
  if (cfg.navigation && cfg.navigation.login_url) {
    const loginLinks = document.querySelectorAll('.bind-login-link');
    loginLinks.forEach(a => {
      a.href = cfg.navigation.login_url;
      if (cfg.navigation.login_text) {
        a.textContent = cfg.navigation.login_text;
      }
    });
  }
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || !href) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function setupYear() {
  const el = document.getElementById('current-year');
  if (el) {
    el.textContent = new Date().getFullYear();
  }
}
