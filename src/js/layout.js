// ==========================================================================
// Общий макет сайта: шапка (с выпадающим меню «Услуги»), мобильное меню,
// подвал с SVG-иконками соцсетей и модальные окна авторизации / гостя
// ==========================================================================

import {applyStaticTranslations, t} from './i18n.js';
import {showToast} from './toast.js';
import {
  continueAsGuest,
  getState,
  loginUser,
  registerUser,
  subscribe,
  toggleCurrency,
  toggleLang,
  toggleTheme,
} from './state.js';
import {getBrandLogoSvg, getIconSvg, getSocialLinksHtml} from './svg-art.js';
import {
  clearFormErrors,
  setFieldError,
  validateBelarusPhone,
  validateEmail,
  validateName,
  validatePassword,
  attachPhoneMask,
} from './validation.js';

let layoutGlobalListenersBound = false;
let currentActivePage = 'home';

export function initLayout(activePage = 'home') {
  currentActivePage = activePage;
  renderHeader(activePage);
  renderFooter();
  ensureModals();
  ensureScrollEnhancements();
  applyStaticTranslations(getState().lang);

  if (!layoutGlobalListenersBound) {
    layoutGlobalListenersBound = true;
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('services-dropdown');
      const trigger = dropdown?.querySelector('.site-header__dropdown-trigger');
      if (dropdown && !dropdown.contains(e.target)) {
        dropdown.classList.remove('is-open');
        trigger?.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const dropdown = document.getElementById('services-dropdown');
        const trigger = dropdown?.querySelector('.site-header__dropdown-trigger');
        if (dropdown?.classList.contains('is-open')) {
          dropdown.classList.remove('is-open');
          trigger?.setAttribute('aria-expanded', 'false');
        }
      }
    });
    window.addEventListener('hashchange', () => {
      renderHeader(currentActivePage);
      applyStaticTranslations(getState().lang);
    });
  }

  subscribe(() => {
    renderHeader(currentActivePage);
    renderFooter();
    applyStaticTranslations(getState().lang);
  });
}

function getServiceLinks(lang) {
  return [
    {href: './services.html', label: lang === 'ru' ? 'Все услуги и продажа' : 'All Agency Services'},
    {href: './services.html?service=sell-apartment#calculator', label: t('srvSellApt', lang)},
    {href: './services.html?service=sell-house#calculator', label: t('srvSellHouse', lang)},
    {href: './services.html?service=sell-land#calculator', label: t('srvSellLand', lang)},
    {href: './services.html#calculator', label: t('srvValuation', lang)},
    {href: './services.html?service=exchange#consultation', label: t('srvExchange', lang)},
    {href: './catalog.html', label: t('srvBuy', lang)},
    {href: './catalog.html?category=commercial', label: t('srvCommercial', lang)},
  ];
}

function renderHeader(activePage) {
  const headerEl = document.getElementById('site-header');
  if (!headerEl) return;

  const {lang, currency, theme, favorites, user} = getState();
  const isRegistered = user.mode === 'registered';
  const userLabel = isRegistered ? user.name.split(' ')[0] : t('guestLabel', lang);
  const serviceLinks = getServiceLinks(lang);
  const isContactsActive = activePage === 'about' && window.location.hash === '#contacts';

  headerEl.className = 'site-header';
  headerEl.innerHTML = `
    <div class="container site-header__inner">
      <a href="./index.html" class="site-header__brand" aria-label="Alora Homes">
        ${getBrandLogoSvg(34)}
        <span>Alora <span class="site-header__brand-accent">Homes</span></span>
      </a>

      <nav class="site-header__nav" aria-label="Main navigation">
        <a href="./catalog.html" class="site-header__link ${activePage === 'catalog' ? 'is-active' : ''}">
          ${t('navCatalog', lang)}
        </a>

        <div class="site-header__dropdown" id="services-dropdown">
          <div style="display:flex;align-items:center;gap:2px;">
            <a href="./services.html" class="site-header__link ${activePage === 'services' ? 'is-active' : ''}" style="padding-right:2px;">
              ${t('navServices', lang)}
            </a>
            <button
              type="button"
              class="site-header__dropdown-trigger ${activePage === 'services' ? 'is-active' : ''}"
              aria-haspopup="true"
              aria-expanded="false"
              aria-label="Toggle services menu"
              style="padding:6px 6px;background:none;border:none;color:var(--text-secondary);cursor:pointer;display:inline-flex;align-items:center;"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" style="transition:transform $transition-fast;">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
          </div>
          <div class="site-header__dropdown-menu" role="menu">
            ${serviceLinks
              .map(
                (srv, i) =>
                  `<a href="${srv.href}" class="site-header__dropdown-item" role="menuitem" ${i === 0 ? 'style="border-bottom:1px solid var(--border-subtle);margin-bottom:4px;padding-bottom:10px;color:var(--text-primary);font-weight:600;"' : ''}>${srv.label}<span>→</span></a>`
              )
              .join('')}
          </div>
        </div>

        <a href="./analytics.html" class="site-header__link ${activePage === 'analytics' ? 'is-active' : ''}">
          ${t('navAnalytics', lang)}
        </a>
        <a href="./about.html" class="site-header__link ${activePage === 'about' && !isContactsActive ? 'is-active' : ''}">
          ${t('navAbout', lang)}
        </a>
        <a href="./about.html#contacts" class="site-header__link js-nav-contacts ${isContactsActive ? 'is-active' : ''}">
          ${t('navContacts', lang)}
        </a>
      </nav>

      <div class="site-header__actions">
        <div class="lang-currency-group" role="group" aria-label="Language and currency">
          <button type="button" class="js-toggle-lang" title="RU / EN">${lang.toUpperCase()}</button>
          <button type="button" class="js-toggle-currency" title="BYN / USD">${currency}</button>
        </div>

        <button type="button" class="control-chip js-toggle-theme" aria-label="Toggle theme">
          ${getIconSvg(theme === 'dark' ? 'moon' : 'sun', 15)}
          <span class="hide-xs">${theme === 'dark' ? t('themeDark', lang) : t('themeLight', lang)}</span>
        </button>

        <a href="./cabinet.html" class="icon-btn" aria-label="${t('navCabinet', lang)}" title="${t('navCabinet', lang)}">
          ${getIconSvg('heart', 18)}
          <span class="icon-btn__count">${favorites.length}</span>
        </a>

        <button type="button" class="control-chip js-open-auth">
          ${getIconSvg('user', 15)}
          <span>${userLabel}</span>
        </button>

        <button type="button" class="site-header__burger js-toggle-drawer" aria-label="Menu" aria-expanded="false" style="display:inline-flex;align-items:center;gap:6px;padding:0 12px;width:auto;">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
          <span style="font-size:0.8125rem;font-weight:600;">Меню</span>
        </button>
      </div>
    </div>

    <div class="mobile-drawer" id="mobile-drawer">
      <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:12px;border-bottom:1px solid var(--border-subtle);">
        <span style="font-weight:700;font-size:1.05rem;color:var(--text-primary);">Навигация Alora Homes</span>
        <button type="button" class="modal-dialog__close js-close-drawer" aria-label="Close" style="background:none;border:none;color:var(--text-primary);font-size:1.25rem;cursor:pointer;">✕</button>
      </div>
      <nav class="mobile-drawer__nav" aria-label="Mobile navigation" style="margin-top:12px;">
        <a href="./catalog.html" class="mobile-drawer__link ${activePage === 'catalog' ? 'is-active' : ''}">
          ${t('navCatalog', lang)}<span>→</span>
        </a>
        <a href="./services.html" class="mobile-drawer__link ${activePage === 'services' ? 'is-active' : ''}">
          ${t('navServices', lang)}<span>→</span>
        </a>
        <a href="./analytics.html" class="mobile-drawer__link ${activePage === 'analytics' ? 'is-active' : ''}">
          ${t('navAnalytics', lang)}<span>→</span>
        </a>
        <a href="./about.html" class="mobile-drawer__link ${activePage === 'about' && !isContactsActive ? 'is-active' : ''}">
          ${t('navAbout', lang)}<span>→</span>
        </a>
        <a href="./about.html#contacts" class="mobile-drawer__link js-nav-contacts ${isContactsActive ? 'is-active' : ''}">
          ${t('navContacts', lang)}<span>→</span>
        </a>
        <a href="./cabinet.html" class="mobile-drawer__link ${activePage === 'cabinet' ? 'is-active' : ''}">
          ${t('navCabinet', lang)} (${favorites.length})<span>→</span>
        </a>
      </nav>
      <div class="mobile-drawer__controls">
        <button type="button" class="control-chip js-toggle-lang">${lang === 'ru' ? 'Язык: RU' : 'Lang: EN'}</button>
        <button type="button" class="control-chip js-toggle-currency">${currency}</button>
        <button type="button" class="control-chip js-toggle-theme">
          ${theme === 'dark' ? t('themeDark', lang) : t('themeLight', lang)}
        </button>
      </div>
    </div>
  `;

  headerEl.querySelectorAll('.js-toggle-lang').forEach((btn) =>
    btn.addEventListener('click', () => toggleLang())
  );
  headerEl.querySelectorAll('.js-toggle-currency').forEach((btn) =>
    btn.addEventListener('click', () => toggleCurrency())
  );
  headerEl.querySelectorAll('.js-toggle-theme').forEach((btn) =>
    btn.addEventListener('click', () => toggleTheme())
  );
  headerEl.querySelector('.js-open-auth')?.addEventListener('click', () => openAuthModal());

  const burger = headerEl.querySelector('.js-toggle-drawer');
  const drawer = headerEl.querySelector('#mobile-drawer');
  burger?.addEventListener('click', () => {
    const opened = drawer?.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(Boolean(opened)));
  });

  headerEl.querySelector('.js-close-drawer')?.addEventListener('click', () => {
    drawer?.classList.remove('is-open');
    burger?.setAttribute('aria-expanded', 'false');
  });

  headerEl.querySelectorAll('.js-nav-contacts').forEach((link) => {
    link.addEventListener('click', () => {
      drawer?.classList.remove('is-open');
      burger?.setAttribute('aria-expanded', 'false');
      if (currentActivePage === 'about') {
        setTimeout(() => renderHeader(currentActivePage), 0);
      }
    });
  });

  // Надёжная работа выпадающего меню «Услуги» (клик + задержка закрытия при наведении)
  const dropdown = headerEl.querySelector('#services-dropdown');
  const dropdownTrigger = dropdown?.querySelector('.site-header__dropdown-trigger');
  let closeTimer = null;

  const setDropdownOpen = (open) => {
    if (!dropdown || !dropdownTrigger) return;
    dropdown.classList.toggle('is-open', open);
    dropdownTrigger.setAttribute('aria-expanded', String(open));
  };

  dropdown?.addEventListener('mouseenter', () => {
    if (closeTimer) clearTimeout(closeTimer);
    setDropdownOpen(true);
  });

  dropdown?.addEventListener('mouseleave', () => {
    closeTimer = setTimeout(() => setDropdownOpen(false), 240);
  });

  dropdownTrigger?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = dropdown?.classList.contains('is-open');
    setDropdownOpen(!isOpen);
  });
}

function renderFooter() {
  const footerEl = document.getElementById('site-footer');
  if (!footerEl) return;

  const {lang} = getState();
  footerEl.className = 'site-footer';
  footerEl.innerHTML = `
    <div class="container">
      <div class="site-footer__grid">
        <div>
          <a href="./index.html" class="site-header__brand">
            ${getBrandLogoSvg(32)}
            <span>Alora <span class="site-header__brand-accent">Homes</span></span>
          </a>
          <p class="site-footer__tagline">${t('footerTagline', lang)}</p>
          <div style="margin-top:18px;">
            ${getSocialLinksHtml(false)}
          </div>
        </div>

        <div>
          <div class="site-footer__col-title">${t('footerNav', lang)}</div>
          <ul class="site-footer__list">
            <li><a href="./catalog.html">${t('navCatalog', lang)}</a></li>
            <li><a href="./services.html">${t('navServices', lang)}</a></li>
            <li><a href="./analytics.html">${t('navAnalytics', lang)}</a></li>
            <li><a href="./cabinet.html">${t('navCabinet', lang)}</a></li>
            <li><a href="./about.html">${t('navAbout', lang)}</a></li>
          </ul>
        </div>

        <div>
          <div class="site-footer__col-title">${t('footerServices', lang)}</div>
          <ul class="site-footer__list">
            <li><a href="./services.html?service=sell-apartment#calculator">${t('srvSellApt', lang)}</a></li>
            <li><a href="./services.html?service=sell-house#calculator">${t('srvSellHouse', lang)}</a></li>
            <li><a href="./services.html#calculator">${t('srvValuation', lang)}</a></li>
            <li><a href="./services.html?service=exchange#consultation">${t('srvExchange', lang)}</a></li>
          </ul>
        </div>

        <div>
          <div class="site-footer__col-title">${t('footerContacts', lang)}</div>
          <ul class="site-footer__list">
            <li class="site-footer__contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <a href="tel:+375172401890">+375 (17) 240-18-90</a>
            </li>
            <li class="site-footer__contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <a href="tel:+375297745210">+375 (29) 774-52-10</a>
            </li>
            <li class="site-footer__contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <a href="mailto:info@alorahomes.by">info@alorahomes.by</a>
            </li>
            <li class="site-footer__contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${t('footerAddress', lang)}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="site-footer__bottom">
        <span>${t('footerCopy', lang)}</span>
        <div class="site-footer__legal">
          <a href="./about.html#legal">${t('footerPrivacy', lang)}</a>
          <a href="./about.html#legal">${t('footerTerms', lang)}</a>
        </div>
      </div>
    </div>
  `;
}

function ensureModals() {
  if (!document.getElementById('auth-modal')) {
    const authModal = document.createElement('div');
    authModal.id = 'auth-modal';
    authModal.className = 'modal-backdrop';
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) authModal.classList.remove('is-open');
    });
    document.body.appendChild(authModal);
  }

  if (!document.getElementById('guest-gate-modal')) {
    const gateModal = document.createElement('div');
    gateModal.id = 'guest-gate-modal';
    gateModal.className = 'modal-backdrop';
    gateModal.addEventListener('click', (e) => {
      if (e.target === gateModal) gateModal.classList.remove('is-open');
    });
    document.body.appendChild(gateModal);
  }
}

/**
 * Показывает гостю окно с предложением зарегистрироваться или позвонить в контакт-центр
 */
export function openGuestGateModal(actionType = 'favorite') {
  ensureModals();
  const modal = document.getElementById('guest-gate-modal');
  if (!modal) return;
  const {lang} = getState();
  const desc = actionType === 'booking' ? t('guestGateBookDesc', lang) : t('guestGateFavDesc', lang);

  modal.innerHTML = `
    <div class="modal-dialog" role="dialog" aria-modal="true">
      <div class="modal-dialog__header">
        <h2 class="modal-dialog__title">${t('guestGateTitle', lang)}</h2>
        <button type="button" class="modal-dialog__close js-close-gate" aria-label="Close">✕</button>
      </div>
      <div class="guest-gate">
        <div class="guest-gate__notice">${desc}</div>
        <button type="button" class="btn btn--primary btn--full js-gate-register">
          ${t('registerBtn', lang)}
        </button>

        <div class="guest-gate__call-box">
          <strong style="font-size:0.95rem;">${t('guestGateCallTitle', lang)}</strong>
          <span style="font-size:0.82rem;color:var(--text-secondary);">${t('guestGateHours', lang)}</span>
          <div class="guest-gate__phones">
            <a href="tel:+375297745210" class="btn btn--secondary btn--sm">+375 (29) 774-52-10</a>
            <a href="tel:+375172401890" class="btn btn--secondary btn--sm">+375 (17) 240-18-90</a>
          </div>
          <div style="margin-top:6px;">
            ${getSocialLinksHtml(false)}
          </div>
        </div>
      </div>
    </div>
  `;

  modal.querySelector('.js-close-gate')?.addEventListener('click', () => {
    modal.classList.remove('is-open');
  });
  modal.querySelector('.js-gate-register')?.addEventListener('click', () => {
    modal.classList.remove('is-open');
    openAuthModal('register');
  });

  modal.classList.add('is-open');
}

export function openAuthModal(defaultTab = 'register') {
  ensureModals();
  const modal = document.getElementById('auth-modal');
  if (!modal) return;

  let activeTab = defaultTab;

  const renderModal = () => {
    const {lang, user} = getState();
    const isReg = user.mode === 'registered';

    if (isReg) {
      modal.innerHTML = `
        <div class="modal-dialog" role="dialog" aria-modal="true">
          <div class="modal-dialog__header">
            <h2 class="modal-dialog__title">${user.name}</h2>
            <button type="button" class="modal-dialog__close js-close-auth" aria-label="Close">✕</button>
          </div>
          <p style="color:var(--text-secondary);margin-bottom:18px;">
            ${user.email}${user.phone ? ` · ${user.phone}` : ''}
          </p>
          <div style="display:flex;flex-direction:column;gap:10px;">
            <a href="./cabinet.html" class="btn btn--primary btn--full">${t('navCabinet', lang)}</a>
            <button type="button" class="btn btn--secondary btn--full js-logout">${t('signOut', lang)}</button>
          </div>
        </div>
      `;
      modal.querySelector('.js-close-auth')?.addEventListener('click', () => modal.classList.remove('is-open'));
      modal.querySelector('.js-logout')?.addEventListener('click', () => {
        continueAsGuest();
        modal.classList.remove('is-open');
        showToast(lang === 'ru' ? 'Вы перешли в режим гостя' : 'Switched to guest mode');
      });
      return;
    }

    modal.innerHTML = `
      <div class="modal-dialog" role="dialog" aria-modal="true">
        <div class="modal-dialog__header">
          <h2 class="modal-dialog__title">Alora Homes</h2>
          <button type="button" class="modal-dialog__close js-close-auth" aria-label="Close">✕</button>
        </div>

        <div class="tabs-row" style="margin-bottom:20px;">
          <button type="button" class="tab-btn ${activeTab === 'login' ? 'is-active' : ''}" data-auth-tab="login">
            ${t('authTabLogin', lang)}
          </button>
          <button type="button" class="tab-btn ${activeTab === 'register' ? 'is-active' : ''}" data-auth-tab="register">
            ${t('authTabRegister', lang)}
          </button>
        </div>

        <form id="auth-form" novalidate style="display:flex;flex-direction:column;gap:14px;">
          ${
            activeTab === 'register'
              ? `
            <div class="field">
              <label class="field__label" for="auth-name">${t('inputName', lang)}</label>
              <input id="auth-name" class="field__control" type="text" required placeholder="${t('inputNamePlaceholder', lang)}" />
            </div>
            <div class="field">
              <label class="field__label" for="auth-phone">${t('inputPhone', lang)}</label>
              <input id="auth-phone" class="field__control" type="tel" required placeholder="+375 (29) 123-45-67" />
            </div>
          `
              : ''
          }
          <div class="field">
            <label class="field__label" for="auth-email">${t('authEmailLabel', lang)}</label>
            <input id="auth-email" class="field__control" type="email" required placeholder="name@example.by" />
          </div>
          <div class="field">
            <label class="field__label" for="auth-pass">${t('authPassLabel', lang)}</label>
            <input id="auth-pass" class="field__control" type="password" required minlength="${activeTab === 'register' ? 6 : 4}" placeholder="••••••" />
            ${
              activeTab === 'register'
                ? `<span style="font-size:0.74rem;color:var(--text-muted);">${
                    lang === 'ru' ? 'Минимум 6 символов, включая букву и цифру' : 'Min 6 characters, including a letter and a digit'
                  }</span>`
                : ''
            }
          </div>
          <div id="auth-error" class="field__error"></div>
          <button type="submit" class="btn btn--primary btn--full">
            ${activeTab === 'login' ? t('authTabLogin', lang) : t('authTabRegister', lang)}
          </button>
          <button type="button" class="btn btn--ghost btn--full js-guest-btn">
            ${t('authGuestContinue', lang)}
          </button>
        </form>
      </div>
    `;

    modal.querySelector('.js-close-auth')?.addEventListener('click', () => modal.classList.remove('is-open'));
    modal.querySelector('.js-guest-btn')?.addEventListener('click', () => {
      continueAsGuest();
      modal.classList.remove('is-open');
    });
    modal.querySelectorAll('[data-auth-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeTab = btn.getAttribute('data-auth-tab');
        renderModal();
      });
    });

    const form = modal.querySelector('#auth-form');
    attachPhoneMask(modal.querySelector('#auth-phone'));
    form?.querySelectorAll('input').forEach((input) => {
      input.addEventListener('input', () => {
        setFieldError(input, '');
        const formErr = modal.querySelector('#auth-error');
        if (formErr) formErr.textContent = '';
      });
    });

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      clearFormErrors(form);

      const emailEl = modal.querySelector('#auth-email');
      const passEl = modal.querySelector('#auth-pass');
      const errEl = modal.querySelector('#auth-error');
      let firstInvalid = null;

      if (activeTab === 'register') {
        const nameEl = modal.querySelector('#auth-name');
        const phoneEl = modal.querySelector('#auth-phone');
        const nameRes = validateName(nameEl?.value, lang);
        const phoneRes = validateBelarusPhone(phoneEl?.value, lang, true);
        const emailRes = validateEmail(emailEl?.value, lang);
        const passRes = validatePassword(passEl?.value, lang, false);

        if (!nameRes.ok) {
          setFieldError(nameEl, nameRes.error);
          firstInvalid ||= nameEl;
        }
        if (!phoneRes.ok) {
          setFieldError(phoneEl, phoneRes.error);
          firstInvalid ||= phoneEl;
        }
        if (!emailRes.ok) {
          setFieldError(emailEl, emailRes.error);
          firstInvalid ||= emailEl;
        }
        if (!passRes.ok) {
          setFieldError(passEl, passRes.error);
          firstInvalid ||= passEl;
        }

        if (firstInvalid) {
          firstInvalid.focus();
          return;
        }

        const res = registerUser({
          name: nameRes.value,
          email: emailRes.value,
          phone: phoneRes.value,
          password: passRes.value,
        });
        if (!res.ok) {
          setFieldError(emailEl, lang === 'ru' ? 'Пользователь с таким email уже зарегистрирован' : 'Email already registered');
          emailEl?.focus();
          return;
        }
        modal.classList.remove('is-open');
        showToast(lang === 'ru' ? `Добро пожаловать, ${nameRes.value}!` : `Welcome, ${nameRes.value}!`, 'success');
      } else {
        const emailRes = validateEmail(emailEl?.value, lang);
        const passRes = validatePassword(passEl?.value, lang, true);

        if (!emailRes.ok) {
          setFieldError(emailEl, emailRes.error);
          firstInvalid ||= emailEl;
        }
        if (!passRes.ok) {
          setFieldError(passEl, passRes.error);
          firstInvalid ||= passEl;
        }

        if (firstInvalid) {
          firstInvalid.focus();
          return;
        }

        const res = loginUser({email: emailRes.value, password: passRes.value});
        if (!res.ok) {
          errEl.textContent = lang === 'ru' ? 'Неверный email или пароль' : 'Invalid email or password';
          return;
        }
        modal.classList.remove('is-open');
        showToast(lang === 'ru' ? 'Вы успешно вошли в кабинет' : 'Signed in successfully', 'success');
      }
    });
  };

  renderModal();
  modal.classList.add('is-open');
}

let scrollEnhancementsBound = false;

function ensureScrollEnhancements() {
  let scrollBtn = document.getElementById('scroll-top-btn');
  if (!scrollBtn) {
    scrollBtn = document.createElement('button');
    scrollBtn.id = 'scroll-top-btn';
    scrollBtn.type = 'button';
    scrollBtn.className = 'scroll-top-btn';
    scrollBtn.setAttribute('aria-label', 'Наверх');
    scrollBtn.innerHTML = `
      <span class="scroll-top-btn__ring" aria-hidden="true"></span>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    `;
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({top: 0, behavior: 'smooth'});
    });
    document.body.appendChild(scrollBtn);
  }

  if (!scrollEnhancementsBound) {
    scrollEnhancementsBound = true;
    const syncScrollProgress = () => {
      const btn = document.getElementById('scroll-top-btn');
      if (!btn) return;
      const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const ratio = Math.min(1, Math.max(0, window.scrollY / docHeight));
      btn.style.setProperty('--scroll-pct', `${Math.round(ratio * 100)}%`);
      btn.classList.toggle('is-visible', window.scrollY > 300);
    };

    window.addEventListener('scroll', syncScrollProgress, {passive: true});
    window.addEventListener('resize', syncScrollProgress, {passive: true});
    syncScrollProgress();

    // Плавное появление секций при прокрутке
    if ('IntersectionObserver' in window) {
      const sections = Array.from(document.querySelectorAll('main > .section'));
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        {threshold: 0.08, rootMargin: '0px 0px -32px 0px'}
      );

      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top > window.innerHeight * 0.92) {
          sec.classList.add('reveal-on-scroll');
          observer.observe(sec);
        }
      });
    }
  }
}
