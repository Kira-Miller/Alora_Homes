// ==========================================================================
// Общий макет сайта: шапка (Header), мобильное меню, подвал (Footer)
// и модальное окно входа/регистрации (Гость / Пользователь)
// ==========================================================================

import {showToast} from './components.js';
import {applyStaticTranslations, t} from './i18n.js';
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
import {getBrandLogoSvg} from './svg-art.js';

/**
 * Инициализирует общую шапку, подвал и модальное окно авторизации на текущей странице
 */
export function initLayout(activePage = 'home') {
  renderHeader(activePage);
  renderFooter();
  ensureAuthModal();
  applyStaticTranslations(getState().lang);

  subscribe(() => {
    renderHeader(activePage);
    renderFooter();
    applyStaticTranslations(getState().lang);
  });
}

function renderHeader(activePage) {
  const headerEl = document.getElementById('site-header');
  if (!headerEl) return;

  const {lang, currency, theme, favorites, user} = getState();
  const isRegistered = user.mode === 'registered';
  const userLabel = isRegistered ? user.name.split(' ')[0] : t('guestLabel', lang);

  const navItems = [
    {id: 'catalog', href: '/catalog.html', label: t('navCatalog', lang)},
    {id: 'sell', href: '/sell.html', label: t('navSell', lang)},
    {id: 'about', href: '/about.html', label: t('navAbout', lang)},
    {id: 'contacts', href: '/about.html#contacts', label: t('navContacts', lang)},
  ];

  headerEl.className = 'site-header';
  headerEl.innerHTML = `
    <div class="container site-header__inner">
      <a href="/index.html" class="site-header__brand" aria-label="Alora Homes">
        ${getBrandLogoSvg(34)}
        <span>Alora <span class="site-header__brand-accent">Homes</span></span>
      </a>

      <nav class="site-header__nav" aria-label="Main navigation">
        ${navItems
          .map(
            (item) =>
              `<a href="${item.href}" class="site-header__link ${activePage === item.id ? 'is-active' : ''}">${item.label}</a>`
          )
          .join('')}
      </nav>

      <div class="site-header__actions">
        <div class="lang-currency-group" role="group" aria-label="Language and currency">
          <button type="button" class="js-toggle-lang" title="RU / EN">${lang.toUpperCase()}</button>
          <button type="button" class="js-toggle-currency" title="BYN / USD">${currency}</button>
        </div>

        <button type="button" class="control-chip js-toggle-theme" aria-label="Toggle theme">
          <span>${theme === 'dark' ? '🌙' : '☀'}</span>
          <span class="hide-xs">${theme === 'dark' ? t('themeDark', lang) : t('themeLight', lang)}</span>
        </button>

        <a href="/cabinet.html" class="icon-btn" aria-label="${t('navCabinet', lang)}" title="${t('navCabinet', lang)}">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span class="icon-btn__count">${favorites.length}</span>
        </a>

        <button type="button" class="control-chip js-open-auth">
          <span>${userLabel}</span>
        </button>

        <button type="button" class="site-header__burger js-toggle-drawer" aria-label="Menu" aria-expanded="false">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="mobile-drawer" id="mobile-drawer">
      <nav class="mobile-drawer__nav" aria-label="Mobile navigation">
        ${navItems
          .map(
            (item) =>
              `<a href="${item.href}" class="mobile-drawer__link ${activePage === item.id ? 'is-active' : ''}">${item.label}<span>→</span></a>`
          )
          .join('')}
        <a href="/cabinet.html" class="mobile-drawer__link ${activePage === 'cabinet' ? 'is-active' : ''}">
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
          <a href="/index.html" class="site-header__brand">
            ${getBrandLogoSvg(32)}
            <span>Alora <span class="site-header__brand-accent">Homes</span></span>
          </a>
          <p class="site-footer__tagline">${t('footerTagline', lang)}</p>
          <div class="site-footer__socials">
            <a href="/about.html#contacts" class="icon-btn" aria-label="Telegram">TG</a>
            <a href="/about.html#contacts" class="icon-btn" aria-label="Instagram">IG</a>
            <a href="/about.html#contacts" class="icon-btn" aria-label="LinkedIn">IN</a>
          </div>
        </div>

        <div>
          <div class="site-footer__col-title">${t('footerNav', lang)}</div>
          <ul class="site-footer__list">
            <li><a href="/catalog.html">${t('navCatalog', lang)}</a></li>
            <li><a href="/sell.html">${t('navSell', lang)}</a></li>
            <li><a href="/cabinet.html">${t('navCabinet', lang)}</a></li>
            <li><a href="/about.html">${t('navAbout', lang)}</a></li>
          </ul>
        </div>

        <div>
          <div class="site-footer__col-title">${t('footerServices', lang)}</div>
          <ul class="site-footer__list">
            <li><a href="/catalog.html?category=apartments">${t('catApartments', lang)}</a></li>
            <li><a href="/catalog.html?category=houses">${t('catHouses', lang)}</a></li>
            <li><a href="/catalog.html?category=commercial">${t('catCommercial', lang)}</a></li>
            <li><a href="/sell.html#calculator">${t('calcTitle', lang)}</a></li>
          </ul>
        </div>

        <div>
          <div class="site-footer__col-title">${t('footerContacts', lang)}</div>
          <ul class="site-footer__list">
            <li class="site-footer__contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span>+375 (17) 240-18-90</span>
            </li>
            <li class="site-footer__contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span>+375 (29) 774-52-10</span>
            </li>
            <li class="site-footer__contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <span>info@alorahomes.by</span>
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
          <a href="/about.html#legal">${t('footerPrivacy', lang)}</a>
          <a href="/about.html#legal">${t('footerTerms', lang)}</a>
        </div>
      </div>
    </div>
  `;
}

function ensureAuthModal() {
  if (document.getElementById('auth-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'auth-modal';
  modal.className = 'modal-backdrop';
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('is-open');
  });
  document.body.appendChild(modal);
}

/**
 * Открывает модальное окно авторизации / регистрации / переключения в режим гостя
 */
export function openAuthModal(defaultTab = 'register') {
  ensureAuthModal();
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
            <a href="/cabinet.html" class="btn btn--primary btn--full">${t('navCabinet', lang)}</a>
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

        <form id="auth-form" style="display:flex;flex-direction:column;gap:14px;">
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
            <input id="auth-pass" class="field__control" type="password" required minlength="4" placeholder="••••••" />
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
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = modal.querySelector('#auth-email').value;
      const password = modal.querySelector('#auth-pass').value;
      const errEl = modal.querySelector('#auth-error');

      if (activeTab === 'register') {
        const name = modal.querySelector('#auth-name').value;
        const phone = modal.querySelector('#auth-phone').value;
        const res = registerUser({name, email, phone, password});
        if (!res.ok) {
          errEl.textContent = lang === 'ru' ? 'Пользователь с таким email уже зарегистрирован' : 'Email already registered';
          return;
        }
        modal.classList.remove('is-open');
        showToast(lang === 'ru' ? `Добро пожаловать, ${name}!` : `Welcome, ${name}!`, 'success');
      } else {
        const res = loginUser({email, password});
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
