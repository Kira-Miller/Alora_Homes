// ==========================================================================
// Контроллер страницы о компании и контактах (about.html)
// Без филиалов: команда риэлторов, контакты со значками соцсетей и обратная связь
// ==========================================================================

import {showToast} from './components.js';
import {initLayout} from './layout.js';
import {REALTORS} from './realtors-data.js';
import {getState, subscribe} from './state.js';
import {getIconSvg, getRealtorPortraitSvg, getSocialLinksHtml} from './svg-art.js';
import {attachPhoneMask, clearFormErrors, setFieldError, validateBelarusPhone, validateName} from './validation.js';

initLayout('about');

function renderAboutWidgets() {
  const {lang} = getState();
  const realtorsEl = document.getElementById('about-realtors');
  if (realtorsEl) {
    realtorsEl.innerHTML = REALTORS.map(
      (r, idx) => `
      <article class="realtor-card">
        <div class="realtor-card__portrait">
          <img
            src="${r.image}"
            alt="${lang === 'ru' ? r.nameRu : r.nameEn}"
            loading="lazy"
            decoding="async"
            referrerpolicy="no-referrer"
            onerror="this.style.display='none';this.nextElementSibling.style.display='block';"
          />
          <div style="display:none;width:100%;height:100%;">${getRealtorPortraitSvg(idx)}</div>
        </div>
        <div class="realtor-card__body">
          <h3 class="realtor-card__name">${lang === 'ru' ? r.nameRu : r.nameEn}</h3>
          <p class="realtor-card__role">${lang === 'ru' ? r.roleRu : r.roleEn}</p>
          <a href="tel:${r.phone.replace(/[^+\d]/g, '')}" class="realtor-card__phone">${getIconSvg('phone', 15)} <span>${r.phone}</span></a>
        </div>
      </article>
    `
    ).join('');
  }

  const socialsEl = document.getElementById('about-socials');
  if (socialsEl) {
    socialsEl.innerHTML = getSocialLinksHtml(true);
  }
}

const contactForm = document.getElementById('about-contact-form');
const contactPhoneEl = document.getElementById('contact-phone');
attachPhoneMask(contactPhoneEl, true);
contactForm?.querySelectorAll('input, textarea').forEach((inp) => {
  inp.addEventListener('input', () => setFieldError(inp, ''));
});
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  clearFormErrors(contactForm);
  const {lang} = getState();
  const nameEl = document.getElementById('contact-name');
  const phoneEl = document.getElementById('contact-phone');
  const msgEl = document.getElementById('contact-msg');

  const nameRes = validateName(nameEl?.value, lang);
  const phoneRes = validateBelarusPhone(phoneEl?.value, lang, true);
  const msgVal = (msgEl?.value || '').trim();
  let firstInvalid = null;

  if (!nameRes.ok) {
    setFieldError(nameEl, nameRes.error);
    firstInvalid ||= nameEl;
  }
  if (!phoneRes.ok) {
    setFieldError(phoneEl, phoneRes.error);
    firstInvalid ||= phoneEl;
  }
  if (msgVal.length < 5) {
    setFieldError(
      msgEl,
      lang === 'ru' ? 'Напишите короткое сообщение (от 5 символов)' : 'Please enter a short message (min 5 chars)'
    );
    firstInvalid ||= msgEl;
  }

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  contactForm.reset();
  if (contactPhoneEl) contactPhoneEl.value = '+375 ';
  showToast(
    lang === 'ru'
      ? 'Сообщение отправлено. Специалист Alora Homes свяжется с вами!'
      : 'Message sent. An Alora Homes specialist will contact you!',
    'success'
  );
});

renderAboutWidgets();
subscribe(() => renderAboutWidgets());
