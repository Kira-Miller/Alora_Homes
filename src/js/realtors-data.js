// ==========================================================================
// Общий справочник специалистов агентства Alora Homes
// ==========================================================================

import {getIconSvg, getRealtorPortraitSvg} from './svg-art.js';

export const REALTORS = [
  {
    id: 'shestak',
    nameRu: 'Шестак Алиса Дмитриевна',
    nameEn: 'Alisa Shestak',
    roleRu: 'Ведущий риэлтор · Жилая недвижимость',
    roleEn: 'Lead Realtor · Residential',
    phone: '+375 (29) 774-52-10',
    image: './assets/images/realtor-shestak.jpg',
  },
  {
    id: 'botvich',
    nameRu: 'Ботвич Ксения Сергеевна',
    nameEn: 'Kseniya Botvich',
    roleRu: 'Эксперт по загородным домам',
    roleEn: 'Country Estate Specialist',
    phone: '+375 (29) 618-33-40',
    image: './assets/images/realtor-botvich.jpg',
  },
  {
    id: 'svirko',
    nameRu: 'Свирко Юлия Александровна',
    nameEn: 'Yulia Svirko',
    roleRu: 'Риэлтор · Коммерческие и элитные объекты',
    roleEn: 'Commercial & Luxury Advisor',
    phone: '+375 (44) 551-88-55',
    image: './assets/images/realtor-svirko.jpg',
  },
];

export function getRealtorById(id) {
  return REALTORS.find((r) => r.id === id) || null;
}

export function getRealtorLabel(id, lang = 'ru') {
  if (!id || id === 'any') {
    return lang === 'ru' ? 'Любой свободный специалист' : 'Any available specialist';
  }
  const found = getRealtorById(id);
  if (!found) {
    return lang === 'ru' ? 'Любой свободный специалист' : 'Any available specialist';
  }
  return lang === 'ru' ? found.nameRu : found.nameEn;
}

export function getRealtorSelectOptionsHtml(selectedId = 'any', lang = 'ru') {
  const anyLabel = lang === 'ru' ? 'Любой свободный специалист' : 'Any available specialist';
  const options = [
    `<option value="any" ${selectedId === 'any' ? 'selected' : ''}>${anyLabel}</option>`,
    ...REALTORS.map((r) => {
      const name = lang === 'ru' ? r.nameRu : r.nameEn;
      const role = lang === 'ru' ? r.roleRu : r.roleEn;
      return `<option value="${r.id}" ${selectedId === r.id ? 'selected' : ''}>${name} (${role})</option>`;
    }),
  ];
  return options.join('');
}

export function renderRealtorMiniCardHtml(selectedId = 'any', lang = 'ru') {
  const realtor = getRealtorById(selectedId);
  if (!realtor) {
    return `
      <div class="consultant-mini-card__avatar-stack" aria-hidden="true">
        ${REALTORS.map(
          (r, idx) => `
          <img
            src="${r.image}"
            alt=""
            class="consultant-mini-card__stack-img"
            onerror="this.style.display='none';"
            data-idx="${idx}"
          />
        `
        ).join('')}
      </div>
      <div class="consultant-mini-card__body">
        <div class="consultant-mini-card__name">
          ${lang === 'ru' ? 'Дежурный эксперт Alora Homes' : 'On-Duty Alora Homes Advisor'}
        </div>
        <div class="consultant-mini-card__role">
          ${lang === 'ru' ? 'Назначим свободного специалиста в течение 15 минут' : 'Fastest available specialist assigned within 15 min'}
        </div>
        <a href="tel:+375297745210" class="consultant-mini-card__phone">
          ${getIconSvg('phone', 13)}
          <span>+375 (29) 774-52-10</span>
        </a>
      </div>
    `;
  }

  const idx = REALTORS.findIndex((r) => r.id === realtor.id);
  const name = lang === 'ru' ? realtor.nameRu : realtor.nameEn;
  const role = lang === 'ru' ? realtor.roleRu : realtor.roleEn;

  return `
    <div class="consultant-mini-card__avatar">
      <img
        src="${realtor.image}"
        alt="${name}"
        loading="lazy"
        decoding="async"
        onerror="this.style.display='none';this.nextElementSibling.style.display='block';"
      />
      <div style="display:none;width:100%;height:100%;">${getRealtorPortraitSvg(Math.max(0, idx))}</div>
    </div>
    <div class="consultant-mini-card__body">
      <div class="consultant-mini-card__name">${name}</div>
      <div class="consultant-mini-card__role">${role}</div>
      <a href="tel:${realtor.phone.replace(/[^+\d]/g, '')}" class="consultant-mini-card__phone">
        ${getIconSvg('phone', 13)}
        <span>${realtor.phone}</span>
      </a>
    </div>
  `;
}
