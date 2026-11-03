/**
 * ITe Inteligencia Tecnológica — Portal Institucional v2.0
 * Hidratación Disk-First desde landing.json + Navegación por 3 Eslabones Productivos + Relevamiento WhatsApp
 * 100% Estático • Zero-Cookies • Compatible con Failover GitHub Pages (ite.ar)
 */

'use strict';

const DEFAULT_WA_PHONE = '5493743454291';

const DEFAULT_STAGE_DESCRIPTIONS = {
  agro: 'Eslabón 1 — Producción Primaria, Crianza & Biotecnología: protección climática y biológica autónoma 24/7 para evitar siniestros y mejorar la conversión.',
  industria: 'Eslabón 2 — Transformación Industrial, Madera, Faena & Robótica: precisión mecánica gobernada por cómputo, control de mermas y captura de datos sin papel.',
  logistica: 'Eslabón 3 — Logística B2B/B2C, Comercio & Sistemas ERP/CRM: trazabilidad comercial exacta desde la planta o depósito hasta la entrega y cobranza.',
  all: 'Cadena Productiva Completa (11 áreas): desde el campo y la crianza, pasando por el aserradero o frigorífico, hasta el reparto B2B/B2C y el balance.'
};

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
    console.warn('[ITE-LANDING] Modo estático autónomo activo (fallback local):', err);
  }

  const activePhone = getNormalizedPhone(cfg);
  const stageDescriptions = (cfg && cfg.stage_descriptions) ? cfg.stage_descriptions : DEFAULT_STAGE_DESCRIPTIONS;

  if (cfg) {
    applyConfig(cfg, activePhone);
  }

  initSectorFilter(stageDescriptions);
  initDiagnosticBuilder(activePhone);
  setupSmoothScroll();
  setupYear();
}

function getNormalizedPhone(cfg) {
  if (cfg && cfg.whatsapp && cfg.whatsapp.phone) {
    const cleaned = String(cfg.whatsapp.phone).replace(/[^0-9]/g, '');
    if (cleaned.length >= 10) return cleaned;
  }
  return DEFAULT_WA_PHONE;
}

function buildWhatsAppUrl(phone, message) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function applyConfig(cfg, phone) {
  // 1. Identidad y Hero
  if (cfg.brand) {
    document.querySelectorAll('.bind-brand-name').forEach(el => {
      el.textContent = cfg.brand.name || 'ITe Inteligencia Tecnológica';
    });

    const badgeEl = document.getElementById('hero-badge-text');
    if (badgeEl && cfg.brand.badge) badgeEl.textContent = cfg.brand.badge;

    const subEl = document.getElementById('hero-subheadline');
    if (subEl && cfg.brand.subheadline) subEl.textContent = cfg.brand.subheadline;

    const scopeEl = document.getElementById('hero-scope-note');
    if (scopeEl && cfg.brand.scope_note) {
      scopeEl.textContent = `✓ ${cfg.brand.scope_note}`;
    }
  }

  // 2. Enlaces Generales de WhatsApp
  if (cfg.whatsapp) {
    const defaultMsg = cfg.whatsapp.default_message || '¡Hola! Quisiera solicitar un relevamiento técnico inicial sin compromiso.';
    const waUrl = buildWhatsAppUrl(phone, defaultMsg);

    document.querySelectorAll('.bind-wa-link').forEach(a => {
      a.href = waUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    });

    const ctaBtn = document.getElementById('hero-cta-btn');
    if (ctaBtn && cfg.whatsapp.cta_text) {
      ctaBtn.textContent = '';
      const iconSpan = document.createElement('span');
      iconSpan.textContent = '💬';
      ctaBtn.appendChild(iconSpan);
      ctaBtn.appendChild(document.createTextNode(` ${cfg.whatsapp.cta_text}`));
    }
  }

  // 3. Hidratar enlaces contextuales de Casos Sectoriales por ID o posición
  if (Array.isArray(cfg.sector_cases)) {
    const byId = new Map();
    cfg.sector_cases.forEach(item => {
      if (item && item.id) byId.set(item.id, item);
    });

    const cards = document.querySelectorAll('#sector-cases-grid .case-card');
    cards.forEach((card, idx) => {
      const cardId = card.getAttribute('data-id');
      const item = (cardId && byId.get(cardId)) || cfg.sector_cases[idx];
      if (!item || !item.wa_message) return;

      const link = card.querySelector('.case-wa-link');
      if (link) {
        link.href = buildWhatsAppUrl(phone, item.wa_message);
      }
    });
  }

  // 4. Datos de Contacto en Footer
  if (cfg.contact) {
    const addrEl = document.getElementById('contact-address');
    if (addrEl && cfg.contact.address) addrEl.textContent = cfg.contact.address;

    const covEl = document.getElementById('contact-coverage');
    if (covEl && cfg.contact.coverage) covEl.textContent = cfg.contact.coverage;

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

  // 5. Enlaces de Acceso al Panel
  if (cfg.navigation && cfg.navigation.login_url) {
    document.querySelectorAll('.bind-login-link').forEach(a => {
      a.href = cfg.navigation.login_url;
      if (cfg.navigation.login_text && a.id === 'nav-login-btn') {
        a.textContent = '';
        const lockSpan = document.createElement('span');
        lockSpan.textContent = '🔐';
        a.appendChild(lockSpan);
        a.appendChild(document.createTextNode(` ${cfg.navigation.login_text}`));
      }
    });
  }
}

function initSectorFilter(stageDescriptions) {
  const chips = document.querySelectorAll('.filter-chip');
  const cards = document.querySelectorAll('#sector-cases-grid .case-card');
  const captionEl = document.getElementById('stage-caption');
  if (!chips.length || !cards.length) return;

  const applyFilter = (filterKey) => {
    chips.forEach(c => {
      const active = c.getAttribute('data-filter') === filterKey;
      c.classList.toggle('is-active', active);
      c.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    cards.forEach(card => {
      const cat = card.getAttribute('data-category');
      const show = filterKey === 'all' || cat === filterKey;
      card.classList.toggle('is-hidden', !show);
    });

    if (captionEl && stageDescriptions) {
      const text = stageDescriptions[filterKey] || DEFAULT_STAGE_DESCRIPTIONS[filterKey];
      if (text) captionEl.textContent = text;
    }
  };

  const initialActive = document.querySelector('.filter-chip.is-active');
  const initialFilter = initialActive ? (initialActive.getAttribute('data-filter') || 'agro') : 'agro';
  applyFilter(initialFilter);

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const filter = chip.getAttribute('data-filter') || 'all';
      applyFilter(filter);
    });
  });
}

function initDiagnosticBuilder(phone) {
  const sectorGroup = document.getElementById('diag-sectors');
  const goalGroup = document.getElementById('diag-goals');
  const previewEl = document.getElementById('diag-preview-text');
  const submitBtn = document.getElementById('diag-submit-btn');

  if (!sectorGroup || !goalGroup || !previewEl || !submitBtn) return;

  const updateDiagnosticLink = () => {
    const selectedSectorBtn = sectorGroup.querySelector('.diag-chip.is-selected');
    const selectedGoalBtn = goalGroup.querySelector('.diag-chip.is-selected');

    const sector = selectedSectorBtn ? selectedSectorBtn.getAttribute('data-value') : 'Procesos Productivos';
    const goal = selectedGoalBtn ? selectedGoalBtn.getAttribute('data-value') : 'aumentar la eficiencia productiva';

    const message = `¡Hola! Quisiera solicitar un relevamiento / diagnóstico técnico inicial para el rubro ${sector}, con foco en ${goal}.`;
    previewEl.textContent = message;
    submitBtn.href = buildWhatsAppUrl(phone, message);
  };

  const bindSingleSelect = (container) => {
    container.querySelectorAll('.diag-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.diag-chip').forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        updateDiagnosticLink();
      });
    });
  };

  bindSingleSelect(sectorGroup);
  bindSingleSelect(goalGroup);
  updateDiagnosticLink();
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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
    el.textContent = String(new Date().getFullYear());
  }
}
