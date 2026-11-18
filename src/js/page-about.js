// ==========================================================================
// Контроллер страницы о компании и контактах (about.html)
// Без филиалов: команда риэлторов, контакты со значками соцсетей и обратная связь
// ==========================================================================

import {showToast} from './components.js';
import {initLayout} from './layout.js';
import {getState, subscribe} from './state.js';
import {getIconSvg, getRealtorPortraitSvg, getSocialLinksHtml} from './svg-art.js';

initLayout('about');

const REALTORS = [
  {
    nameRu: 'Шестак Алиса Дмитриевна',
    nameEn: 'Alisa Shestak',
    roleRu: 'Ведущий риэлтор · Жилая недвижимость',
    roleEn: 'Lead Realtor · Residential',
    phone: '+375 (29) 774-52-10',
    image: './assets/images/realtor-shestak.jpg',
  },
  {
    nameRu: 'Ботвич Ксения Сергеевна',
    nameEn: 'Kseniya Botvich',
    roleRu: 'Эксперт по загородным домам',
    roleEn: 'Country Estate Specialist',
    phone: '+375 (29) 618-33-40',
    image: './assets/images/realtor-botvich.jpg',
  },
  {
    nameRu: 'Свирко Юлия Александровна',
    nameEn: 'Yulia Svirko',
    roleRu: 'Риэлтор · Коммерческие и элитные объекты',
    roleEn: 'Commercial & Luxury Advisor',
    phone: '+375 (44) 551-88-55',
    image: './assets/images/realtor-svirko.jpg',
  },
];

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
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const {lang} = getState();
  const name = document.getElementById('contact-name').value.trim();
  const phone = document.getElementById('contact-phone').value.trim();
  if (name.length < 2 || phone.length < 7) {
    showToast(lang === 'ru' ? 'Укажите имя и телефон' : 'Please enter name and phone');
    return;
  }
  contactForm.reset();
  showToast(
    lang === 'ru'
      ? 'Сообщение отправлено. Специалист Alora Homes свяжется с вами!'
      : 'Message sent. An Alora Homes specialist will contact you!',
    'success'
  );
});

renderAboutWidgets();
subscribe(() => renderAboutWidgets());
