// ==========================================================================
// Общий справочник специалистов агентства Alora Homes
// ==========================================================================

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
