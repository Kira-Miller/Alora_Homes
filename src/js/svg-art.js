// ==========================================================================
// Генератор векторной SVG-графики: логотип Alora Homes, архитектурные иллюстрации
// объектов (экстерьер, интерьер, терраса) и интерактивная карта Беларуси
// ==========================================================================

export function getBrandLogoSvg(size = 34) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="${size}" height="${size}" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="aloraShieldBgInline" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#171230" />
          <stop offset="100%" stop-color="#0d1829" />
        </linearGradient>
        <linearGradient id="aloraEdgeGradInline" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#a78bfa" />
          <stop offset="50%" stop-color="#8b5cf6" />
          <stop offset="100%" stop-color="#22d3ee" />
        </linearGradient>
        <linearGradient id="aloraRoofGradInline" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="65%" stop-color="#e0e7ff" />
          <stop offset="100%" stop-color="#67e8f9" />
        </linearGradient>
      </defs>
      <rect x="3.5" y="3.5" width="41" height="41" rx="13" fill="url(#aloraShieldBgInline)" stroke="url(#aloraEdgeGradInline)" stroke-width="2" />
      <path d="M13 33.5 L24 12.5 L35 33.5" stroke="url(#aloraRoofGradInline)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M17.5 33.5 V26.5 C17.5 22.91 20.41 20 24 20 C27.59 20 30.5 22.91 30.5 26.5 V33.5" stroke="#22d3ee" stroke-width="2.2" stroke-linecap="round" />
      <path d="M16.5 28 H31.5" stroke="url(#aloraRoofGradInline)" stroke-width="2" stroke-linecap="round" />
      <polygon points="24,14.5 26.2,17 24,19.5 21.8,17" fill="#22d3ee" />
    </svg>
  `;
}

/**
 * Единая коллекция эстетичных минималистичных SVG-иконок (1.75px stroke)
 */
export function getIconSvg(name, size = 18) {
  const s = `width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"`;
  switch (name) {
    case 'moon':
      return `<svg ${s}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    case 'sun':
      return `<svg ${s}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
    case 'heart':
      return `<svg ${s}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
    case 'heart-filled':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
    case 'scale':
      return `<svg ${s}><path d="M12 3v18M5 7h14M3 14l2-7 2 7a2 2 0 0 1-4 0zM17 14l2-7 2 7a2 2 0 0 1-4 0zM8 21h8"/></svg>`;
    case 'calendar':
      return `<svg ${s}><rect x="3" y="4" width="18" height="18" rx="3"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
    case 'phone':
      return `<svg ${s}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
    case 'building':
      return `<svg ${s}><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h2M14 6h2M8 10h2M14 10h2M8 14h2M14 14h2"/></svg>`;
    case 'home':
      return `<svg ${s}><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5"/><path d="M9 21v-6h6v6"/></svg>`;
    case 'trees':
      return `<svg ${s}><path d="M12 3 6 12h4l-3 6h10l-3-6h4L12 3z"/><line x1="12" y1="18" x2="12" y2="22"/></svg>`;
    case 'briefcase':
      return `<svg ${s}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M2 12h20"/></svg>`;
    case 'check':
      return `<svg ${s}><polyline points="20 6 9 17 4 12"/></svg>`;
    case 'star':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    case 'user':
      return `<svg ${s}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    case 'chevron-left':
      return `<svg ${s}><polyline points="15 18 9 12 15 6"/></svg>`;
    case 'chevron-right':
      return `<svg ${s}><polyline points="9 18 15 12 9 6"/></svg>`;
    default:
      return `<svg ${s}><circle cx="12" cy="12" r="9"/></svg>`;
  }
}

const PALETTES = {
  'villa-pine': {skyTop: '#241b4b', skyBot: '#102437', glow: '#8b5cf6', accent: '#f59e0b', roof: '#1e293b', wall: '#cbd5e1'},
  'minsk-tower': {skyTop: '#162544', skyBot: '#0e172a', glow: '#22d3ee', accent: '#38bdf8', roof: '#334155', wall: '#94a3b8'},
  'townhouse-dusk': {skyTop: '#3b174f', skyBot: '#151329', glow: '#c084fc', accent: '#fbbf24', roof: '#1e1b4b', wall: '#e2e8f0'},
  'forest-cottage': {skyTop: '#1a2e2b', skyBot: '#111a1e', glow: '#34d399', accent: '#fb923c', roof: '#27272a', wall: '#d6d3d1'},
  'glass-office': {skyTop: '#0f2b3c', skyBot: '#091522', glow: '#22d3ee', accent: '#60a5fa', roof: '#1e293b', wall: '#bae6fd'},
  'waterfront-loft': {skyTop: '#311b3f', skyBot: '#171329', glow: '#ec4899', accent: '#22d3ee', roof: '#27272a', wall: '#e4e4e7'},
};

/**
 * Генерирует детализированную архитектурную SVG-визуализацию объекта
 */
export function getPropertySvg(theme = 'villa-pine', viewType = 'exterior', uid = '1') {
  const p = PALETTES[theme] || PALETTES['villa-pine'];
  const gId = `sky-${theme}-${viewType}-${uid}`;

  if (viewType === 'interior') {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Interior visualization">
        <defs>
          <linearGradient id="${gId}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${p.skyTop}" />
            <stop offset="100%" stop-color="#0b0c14" />
          </linearGradient>
        </defs>
        <rect width="640" height="400" fill="url(#${gId})" />
        <!-- Панорамное окно с видом -->
        <rect x="70" y="45" width="500" height="225" rx="6" fill="#0f172a" stroke="#475569" stroke-width="5" />
        <line x1="235" y1="45" x2="235" y2="270" stroke="#334155" stroke-width="4" />
        <line x1="405" y1="45" x2="405" y2="270" stroke="#334155" stroke-width="4" />
        <!-- Горизонт и закатный свет за окном -->
        <circle cx="490" cy="120" r="42" fill="${p.glow}" opacity="0.35" />
        <path d="M74 220 L180 165 L290 210 L420 155 L566 215 L566 266 L74 266 Z" fill="#1e293b" opacity="0.85" />
        <!-- Пол и ковер -->
        <polygon points="0,280 640,280 640,400 0,400" fill="#161622" />
        <polygon points="145,305 495,305 540,382 100,382" fill="#232336" stroke="${p.glow}" stroke-opacity="0.35" />
        <!-- Дизайнерский диван -->
        <rect x="175" y="242" width="290" height="58" rx="14" fill="#31334a" />
        <rect x="188" y="220" width="264" height="32" rx="10" fill="#3f425e" />
        <rect x="165" y="252" width="28" height="48" rx="8" fill="#26283b" />
        <rect x="447" y="252" width="28" height="48" rx="8" fill="#26283b" />
        <!-- Журнальный столик и тёплое освещение -->
        <rect x="260" y="318" width="120" height="14" rx="5" fill="#d4a373" opacity="0.88" />
        <line x1="320" y1="0" x2="320" y2="72" stroke="#94a3b8" stroke-width="2" />
        <ellipse cx="320" cy="82" rx="34" ry="12" fill="${p.accent}" opacity="0.92" />
        <ellipse cx="320" cy="145" rx="120" ry="70" fill="${p.accent}" opacity="0.08" />
      </svg>
    `;
  }

  if (viewType === 'terrace') {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Terrace visualization">
        <defs>
          <linearGradient id="${gId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${p.skyTop}" />
            <stop offset="100%" stop-color="${p.skyBot}" />
          </linearGradient>
        </defs>
        <rect width="640" height="400" fill="url(#${gId})" />
        <circle cx="515" cy="95" r="76" fill="${p.glow}" opacity="0.24" />
        <!-- Сосновый лес на фоне -->
        <path d="M0 245 L55 150 L110 245 L165 140 L220 245 L285 160 L345 245 L420 145 L485 245 L560 155 L640 245 L640 290 L0 290 Z" fill="#0d1b24" />
        <!-- Деревянный настил террасы -->
        <polygon points="0,275 640,275 640,400 0,400" fill="#1e1b26" />
        <line x1="0" y1="305" x2="640" y2="305" stroke="#2d2838" stroke-width="2" />
        <line x1="0" y1="340" x2="640" y2="340" stroke="#2d2838" stroke-width="2" />
        <line x1="0" y1="375" x2="640" y2="375" stroke="#2d2838" stroke-width="2" />
        <!-- Навес и панорамный фасад слева -->
        <rect x="40" y="95" width="270" height="190" fill="#111827" stroke="#475569" stroke-width="3" />
        <rect x="56" y="115" width="110" height="165" fill="${p.accent}" fill-opacity="0.28" />
        <rect x="180" y="115" width="110" height="165" fill="${p.accent}" fill-opacity="0.18" />
        <!-- Лаунж-зона и бассейн / водоём -->
        <rect x="355" y="295" width="230" height="64" rx="10" fill="#0ea5e9" fill-opacity="0.34" stroke="#38bdf8" stroke-opacity="0.45" />
        <rect x="365" y="242" width="130" height="34" rx="8" fill="#334155" />
        <circle cx="545" cy="252" r="14" fill="${p.accent}" opacity="0.85" />
      </svg>
    `;
  }

  // Экстерьер (уникальный силуэт для каждого типа объекта)
  if (theme === 'minsk-tower' || theme === 'glass-office') {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Architectural tower exterior">
        <defs>
          <linearGradient id="${gId}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${p.skyTop}" />
            <stop offset="100%" stop-color="${p.skyBot}" />
          </linearGradient>
        </defs>
        <rect width="640" height="400" fill="url(#${gId})" />
        <circle cx="500" cy="95" r="95" fill="${p.glow}" opacity="0.25" />
        <!-- Фоновый силуэт Минска -->
        <rect x="40" y="160" width="90" height="180" fill="#0f172a" opacity="0.7" />
        <rect x="495" y="140" width="105" height="200" fill="#0f172a" opacity="0.7" />
        <!-- Главный стеклянный небоскрёб -->
        <rect x="190" y="55" width="250" height="285" rx="6" fill="#172036" stroke="${p.accent}" stroke-opacity="0.45" stroke-width="2" />
        <rect x="210" y="75" width="210" height="245" fill="#0e1628" />
        <!-- Световые этажи -->
        <g fill="${p.accent}" opacity="0.42">
          <rect x="224" y="92" width="54" height="18" rx="2" />
          <rect x="292" y="92" width="114" height="18" rx="2" opacity="0.65" />
          <rect x="224" y="126" width="114" height="18" rx="2" opacity="0.85" />
          <rect x="352" y="126" width="54" height="18" rx="2" />
          <rect x="224" y="160" width="84" height="18" rx="2" />
          <rect x="322" y="160" width="84" height="18" rx="2" opacity="0.7" />
          <rect x="224" y="194" width="182" height="18" rx="2" opacity="0.55" />
          <rect x="224" y="228" width="95" height="18" rx="2" />
          <rect x="334" y="228" width="72" height="18" rx="2" opacity="0.8" />
        </g>
        <!-- Благоустроенный стилобат -->
        <rect x="0" y="330" width="640" height="70" fill="#090d16" />
        <rect x="165" y="308" width="300" height="28" rx="4" fill="#1e293b" />
      </svg>
    `;
  }

  // Современная вилла / загородный дом / таунхаус
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Modern residence exterior">
      <defs>
        <linearGradient id="${gId}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${p.skyTop}" />
          <stop offset="100%" stop-color="${p.skyBot}" />
        </linearGradient>
      </defs>
      <rect width="640" height="400" fill="url(#${gId})" />
      <circle cx="130" cy="95" r="88" fill="${p.glow}" opacity="0.25" />
      <!-- Силуэт хвойного леса -->
      <path d="M0 295 L42 185 L84 295 L125 170 L170 295 L500 295 L540 165 L585 295 L615 190 L640 295 Z" fill="#0b151e" opacity="0.88" />
      <!-- Земля и подъездная дорожка -->
      <rect x="0" y="295" width="640" height="105" fill="#0d111a" />
      <polygon points="150,315 490,315 560,400 80,400" fill="#1a1f2e" />
      <!-- Основной объём здания -->
      <rect x="135" y="160" width="370" height="145" rx="4" fill="${p.roof}" stroke="rgba(255,255,255,0.12)" />
      <!-- Верхняя консоль второго этажа -->
      <rect x="115" y="112" width="280" height="82" rx="4" fill="#273147" stroke="rgba(255,255,255,0.16)" />
      <rect x="110" y="106" width="292" height="10" rx="3" fill="${p.wall}" opacity="0.9" />
      <!-- Панорамные окна с тёплым интерьерным свечением -->
      <rect x="142" y="128" width="110" height="52" rx="3" fill="${p.accent}" fill-opacity="0.72" />
      <rect x="266" y="128" width="104" height="52" rx="3" fill="${p.accent}" fill-opacity="0.52" />
      <rect x="155" y="212" width="160" height="84" rx="3" fill="${p.accent}" fill-opacity="0.78" />
      <rect x="336" y="212" width="142" height="84" rx="3" fill="#111827" stroke="#475569" stroke-width="2" />
      <!-- Отражение света на террасе -->
      <ellipse cx="235" cy="316" rx="115" ry="12" fill="${p.accent}" opacity="0.22" />
    </svg>
  `;
}

/**
 * Генерирует интерактивную SVG-карту Республики Беларусь с поддержкой масштабирования (zoom/pan)
 */
export function getBelarusMapSvg(
  properties,
  lang = 'ru',
  activeId = null,
  viewBox = {x: 0, y: 0, w: 520, h: 400}
) {
  const zoomScale = viewBox.w / 520;
  const isMinskZoom = viewBox.w <= 280;

  const cities = [
    {id: '2', name: lang === 'ru' ? 'Минск' : 'Minsk', x: 258, y: 184},
    {id: '9', name: lang === 'ru' ? 'Брест' : 'Brest', x: 90, y: 305},
    {id: '8', name: lang === 'ru' ? 'Гродно' : 'Grodno', x: 96, y: 202},
    {id: '10', name: lang === 'ru' ? 'Витебск' : 'Vitebsk', x: 365, y: 104},
    {id: '12', name: lang === 'ru' ? 'Гомель' : 'Gomel', x: 398, y: 285},
    {id: '16', name: lang === 'ru' ? 'Могилёв' : 'Mogilev', x: 371, y: 188},
  ];

  const towns = [
    {id: '13', name: lang === 'ru' ? 'Слуцк' : 'Slutsk', x: 253, y: 244},
    {id: '14', name: lang === 'ru' ? 'Волковыск' : 'Volkovysk', x: 122, y: 236},
    {id: '15', name: lang === 'ru' ? 'Смиловичи' : 'Smilovichi', x: 278, y: 198},
    {id: '19', name: lang === 'ru' ? 'Барановичи' : 'Baranavichy', x: 188, y: 238},
    {id: '22', name: lang === 'ru' ? 'Лида' : 'Lida', x: 158, y: 188},
    {id: '17', name: lang === 'ru' ? 'Пинск' : 'Pinsk', x: 192, y: 304},
    {id: '18', name: lang === 'ru' ? 'Полоцк' : 'Polotsk', x: 305, y: 85},
    {id: '20', name: lang === 'ru' ? 'Борисов' : 'Barysau', x: 293, y: 166},
    {id: '21', name: lang === 'ru' ? 'Бобруйск' : 'Babruysk', x: 324, y: 237},
    {id: '23', name: lang === 'ru' ? 'Новополоцк' : 'Novopolotsk', x: 300, y: 80},
    {id: '24', name: lang === 'ru' ? 'Жлобин' : 'Zhlobin', x: 358, y: 253},
  ];

  const minskDistricts = isMinskZoom
    ? `
      <g class="belarus-map__minsk-layer">
        <!-- Кольцо МКАД -->
        <ellipse
          cx="258" cy="184" rx="20" ry="16"
          fill="rgba(34, 211, 238, 0.07)"
          stroke="rgba(34, 211, 238, 0.55)"
          stroke-width="${1.2 * zoomScale}"
          stroke-dasharray="${3 * zoomScale} ${2.5 * zoomScale}"
        />
        <!-- Река Свислочь -->
        <path
          d="M230 162 Q250 178 258 184 T280 212"
          fill="none"
          stroke="rgba(56, 189, 248, 0.45)"
          stroke-width="${1.8 * zoomScale}"
          stroke-linecap="round"
        />
        <text x="258" y="180" text-anchor="middle" fill="#cbd5e1" font-size="${7.2 * zoomScale}" font-weight="700">МКАД / Центр</text>
        <text x="238" y="174" text-anchor="middle" fill="#94a3b8" font-size="${6.2 * zoomScale}">${lang === 'ru' ? 'Ратомка' : 'Ratomka'}</text>
        <text x="272" y="162" text-anchor="middle" fill="#94a3b8" font-size="${6.2 * zoomScale}">${lang === 'ru' ? 'Раубичи' : 'Raubichi'}</text>
        <text x="278" y="176" text-anchor="middle" fill="#94a3b8" font-size="${6.2 * zoomScale}">${lang === 'ru' ? 'Новая Боровая' : 'Novaya Borovaya'}</text>
        <text x="268" y="208" text-anchor="middle" fill="#94a3b8" font-size="${6.2 * zoomScale}">${lang === 'ru' ? 'Серебрянка' : 'Serebryanka'}</text>
      </g>
    `
    : '';

  const pins = properties
    .map((p) => {
      const isSelected = String(p.id) === String(activeId);
      const r = (isSelected ? 9.5 : 6.5) * zoomScale;
      const strokeW = (isSelected ? 2.5 : 1.8) * zoomScale;
      const pulse = isSelected
        ? `<circle r="${18 * zoomScale}" fill="rgba(34, 211, 238, 0.28)" stroke="rgba(34, 211, 238, 0.75)" stroke-width="${1.2 * zoomScale}" />`
        : '';
      return `
        <g class="belarus-map__pin ${isSelected ? 'is-selected' : ''}" data-map-id="${p.id}" transform="translate(${p.mapCoords.x}, ${p.mapCoords.y})" role="button" tabindex="0" style="cursor:pointer;" aria-label="${p.city[lang] || ''}">
          <!-- Увеличенная невидимая зона касания (hit area) -->
          <circle r="${18 * zoomScale}" fill="transparent" />
          ${pulse}
          <circle r="${r}" fill="${isSelected ? '#22d3ee' : '#8b5cf6'}" stroke="#ffffff" stroke-width="${strokeW}" />
        </g>
      `;
    })
    .join('');

  const cityLabels = cities
    .map(
      (c) => `
      <g class="belarus-map__text-label" data-map-id="${c.id}" role="button" tabindex="0" style="cursor:pointer;">
        <rect x="${c.x - 30 * zoomScale}" y="${c.y - 24 * zoomScale}" width="${60 * zoomScale}" height="${16 * zoomScale}" rx="${4 * zoomScale}" fill="rgba(15, 23, 42, 0.8)" stroke="rgba(148, 163, 184, 0.4)" stroke-width="${1 * zoomScale}" />
        <text x="${c.x}" y="${c.y - 12.5 * zoomScale}" text-anchor="middle" fill="#f1f5f9" font-size="${10.5 * zoomScale}" font-weight="700">${c.name}</text>
      </g>
    `
    )
    .join('');

  const townLabels = towns
    .map(
      (tItem) => `
      <g class="belarus-map__text-label" data-map-id="${tItem.id}" role="button" tabindex="0" style="cursor:pointer;">
        <rect x="${tItem.x - 32 * zoomScale}" y="${tItem.y + 6 * zoomScale}" width="${64 * zoomScale}" height="${15 * zoomScale}" rx="${3.5 * zoomScale}" fill="rgba(15, 23, 42, 0.75)" stroke="rgba(139, 92, 246, 0.35)" stroke-width="${0.8 * zoomScale}" />
        <text x="${tItem.x}" y="${tItem.y + 17 * zoomScale}" text-anchor="middle" fill="#cbd5e1" font-size="${7.8 * zoomScale}" font-weight="600">${tItem.name}</text>
      </g>
    `
    )
    .join('');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}" role="img" aria-label="Map of Belarus">
      <!-- Сглаженный географически точный контур Республики Беларусь -->
      <path
        d="M 280 40 C 296 40, 319 51, 336 56 C 353 61, 371 64, 382 70 C 394 76, 402 82, 405 92 C 408 102, 395 119, 398 132 C 401 145, 415 159, 425 172 C 435 185, 448 200, 456 210 C 465 220, 476 223, 476 232 C 476 241, 462 253, 455 262 C 448 271, 446 274, 436 288 C 426 302, 410 338, 395 346 C 380 354, 365 337, 348 334 C 331 331, 311 326, 293 326 C 275 326, 256 334, 238 334 C 221 334, 207 323, 188 324 C 169 325, 143 342, 124 340 C 105 338, 83 324, 74 314 C 65 304, 66 290, 68 278 C 70 266, 86 256, 88 244 C 90 232, 72 215, 78 204 C 84 193, 107 187, 122 178 C 137 169, 155 162, 168 152 C 181 142, 193 132, 202 120 C 211 108, 214 93, 220 82 C 226 71, 228 63, 238 56 C 248 49, 264 40, 280 40 Z"
        fill="rgba(139, 92, 246, 0.12)"
        stroke="rgba(139, 92, 246, 0.65)"
        stroke-width="${2.4 * zoomScale}"
        stroke-linejoin="round"
      />
      <!-- Административные связи к столице -->
      <g stroke="rgba(148, 163, 184, 0.22)" stroke-dasharray="${4 * zoomScale} ${4 * zoomScale}" stroke-width="${1.2 * zoomScale}">
        <line x1="258" y1="184" x2="90" y2="305" />
        <line x1="258" y1="184" x2="96" y2="202" />
        <line x1="258" y1="184" x2="365" y2="104" />
        <line x1="258" y1="184" x2="398" y2="285" />
        <line x1="258" y1="184" x2="371" y2="188" />
      </g>
      ${minskDistricts}
      ${cityLabels}
      ${townLabels}
      ${pins}
    </svg>
  `;
}

/**
 * Иконки социальных сетей в формате SVG (Telegram, Instagram, Viber, LinkedIn)
 */
export function getSocialLinksHtml(labeled = false) {
  const items = [
    {
      name: 'Telegram',
      href: 'https://t.me/alorahomes_by',
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>`,
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/alorahomes.by',
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
    },
    {
      name: 'Viber',
      href: 'tel:+375297745210',
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z"/><path d="M14.5 5a4.5 4.5 0 0 1 4.5 4.5"/><path d="M14.5 2a7.5 7.5 0 0 1 7.5 7.5"/></svg>`,
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
    },
  ];

  return `
    <div class="social-links">
      ${items
        .map(
          (item) => `
        <a
          href="${item.href}"
          target="${item.href.startsWith('http') ? '_blank' : '_self'}"
          rel="noopener noreferrer"
          class="social-link ${labeled ? 'social-link--labeled' : ''}"
          aria-label="${item.name}"
          title="${item.name}"
        >
          ${item.svg}
          ${labeled ? `<span>${item.name}</span>` : ''}
        </a>
      `
        )
        .join('')}
    </div>
  `;
}

/**
 * Генерирует векторный портрет-иллюстрацию риэлтора для блока команды
 */
export function getRealtorPortraitSvg(index = 0) {
  const palettes = [
    {bg1: '#231845', bg2: '#13243b', suit: '#1e293b', accent: '#8b5cf6', hair: '#27201e'},
    {bg1: '#182b3a', bg2: '#151526', suit: '#334155', accent: '#22d3ee', hair: '#3b2820'},
    {bg1: '#2d193d', bg2: '#162032', suit: '#1f2937', accent: '#a855f7', hair: '#4a3728'},
  ];
  const p = palettes[index % palettes.length];
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 270" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Realtor portrait">
      <defs>
        <linearGradient id="rpBg${index}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${p.bg1}" />
          <stop offset="100%" stop-color="${p.bg2}" />
        </linearGradient>
      </defs>
      <rect width="360" height="270" fill="url(#rpBg${index})" />
      <circle cx="290" cy="55" r="70" fill="${p.accent}" opacity="0.18" />
      <!-- Силуэт офиса на фоне -->
      <rect x="28" y="34" width="90" height="170" rx="4" fill="#ffffff" opacity="0.04" />
      <rect x="242" y="48" width="90" height="156" rx="4" fill="#ffffff" opacity="0.04" />
      <!-- Костюм и плечи -->
      <path d="M88 270 C92 205 130 185 180 185 C230 185 268 205 272 270 Z" fill="${p.suit}" />
      <polygon points="160,185 180,235 200,185" fill="#f8fafc" />
      <polygon points="175,195 180,248 185,195" fill="${p.accent}" />
      <!-- Голова и причёска -->
      <rect x="164" y="152" width="32" height="36" rx="12" fill="#e6b89c" />
      <ellipse cx="180" cy="116" rx="42" ry="48" fill="#f1c7ad" />
      <path d="M138 110 C138 68 222 68 222 110 C215 84 145 84 138 110 Z" fill="${p.hair}" />
      <!-- Черты лица -->
      <circle cx="165" cy="116" r="3" fill="#1e293b" />
      <circle cx="195" cy="116" r="3" fill="#1e293b" />
      <path d="M168 138 Q180 146 192 138" stroke="#9a5b4a" stroke-width="2.5" fill="none" stroke-linecap="round" />
    </svg>
  `;
}

/**
 * Формирует поэтажные архитектурные спецификации комнат для интерактивной SVG-планировки
 */
export function getFloorPlanData(property, lang = 'ru') {
  const s = property.specs || {};
  const totalArea = Number(s.area) || 120;
  const rawFloors = Number(s.floors) || 1;
  const isHouse = property.category === 'houses';
  const isCommercial = property.category === 'commercial';
  const numRooms = Number(s.rooms) || 3;

  let levelCount = 1;
  if (isHouse) {
    levelCount = Math.max(1, Math.min(3, rawFloors));
  } else if (isCommercial) {
    levelCount = rawFloors >= 2 && totalArea >= 180 ? 2 : 1;
  } else {
    levelCount = numRooms >= 4 && totalArea >= 135 ? 2 : 1;
  }

  const buildRooms = (templates, targetArea) => {
    const rawSum = templates.reduce((acc, item) => acc + item.raw, 0) || 1;
    const scale = targetArea / rawSum;
    let accumulated = 0;
    return templates.map((tpl, idx) => {
      const area =
        idx === templates.length - 1
          ? Math.max(3, Math.round((targetArea - accumulated) * 10) / 10)
          : Math.round(tpl.raw * scale * 10) / 10;
      accumulated += area;
      return {...tpl, area};
    });
  };

  if (isHouse) {
    const f1Ratio = levelCount === 1 ? 1 : levelCount === 2 ? 0.56 : 0.44;
    const f2Ratio = levelCount === 2 ? 0.44 : 0.34;
    const f3Ratio = 0.22;

    const floor1Templates = [
      {
        id: 'f1-living',
        nameRu: 'Гостиная со вторым светом',
        nameEn: 'Double-Height Living Room',
        raw: 42,
        x: 34,
        y: 34,
        w: 250,
        h: 215,
        aspectRu: 'Юго-запад · Панорамное остекление',
        aspectEn: 'South-West · Panoramic glazing',
        finishRu: 'Паркет из массива дуба, каминная зона',
        finishEn: 'Solid oak parquet, fireplace zone',
        windows: [{x1: 75, y1: 34, x2: 235, y2: 34}, {x1: 34, y1: 75, x2: 34, y2: 190}],
        door: {x: 284, y: 175, r: 28, dir: 'br'},
      },
      {
        id: 'f1-kitchen',
        nameRu: 'Кухня-столовая',
        nameEn: 'Kitchen & Dining',
        raw: 28,
        x: 284,
        y: 34,
        w: 210,
        h: 150,
        aspectRu: 'Юг · Выход на террасу',
        aspectEn: 'South · Direct terrace access',
        finishRu: 'Кварцевый остров, встроенная техника',
        finishEn: 'Quartz island, integrated appliances',
        windows: [{x1: 325, y1: 34, x2: 455, y2: 34}],
        door: {x: 284, y: 120, r: 24, dir: 'bl'},
      },
      {
        id: 'f1-terrace',
        nameRu: 'Крытая терраса',
        nameEn: 'Covered Terrace',
        raw: 24,
        x: 494,
        y: 34,
        w: 152,
        h: 215,
        aspectRu: 'Восток · Навес и зона отдыха',
        aspectEn: 'East · Pergola & lounge deck',
        finishRu: 'Террасная доска ДПК, уличное освещение',
        finishEn: 'Composite decking, architectural lighting',
        windows: [],
        accent: true,
      },
      {
        id: 'f1-hall',
        nameRu: 'Прихожая и холл',
        nameEn: 'Entrance Foyer & Hall',
        raw: 18,
        x: 284,
        y: 184,
        w: 210,
        h: 112,
        aspectRu: 'Центр · Гардероб и лестница',
        aspectEn: 'Center · Coat room & staircase',
        finishRu: 'Керамогранит с подогревом',
        finishEn: 'Heated porcelain tile',
        door: {x: 375, y: 296, r: 26, dir: 'tl'},
      },
      {
        id: 'f1-guest',
        nameRu: 'Гостевая / Кабинет',
        nameEn: 'Guest Room / Study',
        raw: 16,
        x: 34,
        y: 249,
        w: 165,
        h: 137,
        aspectRu: 'Северо-запад · Тихая зона',
        aspectEn: 'North-West · Quiet wing',
        finishRu: 'Звукоизоляция, встроенный шкаф',
        finishEn: 'Acoustic insulation, built-in storage',
        windows: [{x1: 68, y1: 386, x2: 165, y2: 386}],
      },
      {
        id: 'f1-bath',
        nameRu: 'Санузел / Хозблок',
        nameEn: 'Guest Bath & Utility',
        raw: 11,
        x: 199,
        y: 249,
        w: 85,
        h: 137,
        aspectRu: 'Технический блок',
        aspectEn: 'Utility core',
        finishRu: 'Душевая в строительном исполнении',
        finishEn: 'Walk-in shower, laundry niche',
      },
      {
        id: 'f1-garage',
        nameRu: 'Котельная / Гараж',
        nameEn: 'Boiler Room / Garage',
        raw: 22,
        x: 284,
        y: 296,
        w: 362,
        h: 90,
        aspectRu: 'Север · Автоматические ворота',
        aspectEn: 'North · EV charger & boiler hub',
        finishRu: 'Наливной полимерный пол',
        finishEn: 'Epoxy floor, heating manifold',
      },
    ];

    const floor2Templates = [
      {
        id: 'f2-master',
        nameRu: 'Мастер-спальня',
        nameEn: 'Primary Suite',
        raw: 30,
        x: 34,
        y: 34,
        w: 260,
        h: 186,
        aspectRu: 'Юго-запад · Собственный санузел',
        aspectEn: 'South-West · En-suite & balcony',
        finishRu: 'Тёплый паркет, скрытая подсветка',
        finishEn: 'Engineered oak, cove lighting',
        windows: [{x1: 80, y1: 34, x2: 245, y2: 34}],
        door: {x: 294, y: 170, r: 26, dir: 'bl'},
      },
      {
        id: 'f2-wardrobe',
        nameRu: 'Гардеробная',
        nameEn: 'Walk-In Closet',
        raw: 12,
        x: 294,
        y: 34,
        w: 136,
        h: 110,
        aspectRu: 'Доступ из мастер-спальни',
        aspectEn: 'Private dressing room',
        finishRu: 'Модульная система хранения с подсветкой',
        finishEn: 'Custom illuminated shelving',
      },
      {
        id: 'f2-masterbath',
        nameRu: 'Ванная комната',
        nameEn: 'Master Bathroom',
        raw: 13,
        x: 430,
        y: 34,
        w: 216,
        h: 110,
        aspectRu: 'Восток · Окно в сад',
        aspectEn: 'East · Natural daylight window',
        finishRu: 'Отдельностоящая ванна, двойная раковина',
        finishEn: 'Freestanding tub, double vanity',
        windows: [{x1: 495, y1: 34, x2: 595, y2: 34}],
      },
      {
        id: 'f2-hall',
        nameRu: 'Холл второго этажа',
        nameEn: 'Upper Gallery Hall',
        raw: 16,
        x: 294,
        y: 144,
        w: 185,
        h: 122,
        aspectRu: 'Галерея над гостиной',
        aspectEn: 'Stair landing & gallery',
        finishRu: 'Стеклянное ограждение, паркет',
        finishEn: 'Glass balustrade, oak floor',
      },
      {
        id: 'f2-bed2',
        nameRu: 'Спальня 2',
        nameEn: 'Bedroom 2',
        raw: 20,
        x: 34,
        y: 220,
        w: 260,
        h: 166,
        aspectRu: 'Запад · Окна на зелёную зону',
        aspectEn: 'West · Garden view',
        finishRu: 'Подготовка под детскую или гостевую',
        finishEn: 'Ready for kids or guest suite',
        windows: [{x1: 90, y1: 386, x2: 220, y2: 386}],
      },
      {
        id: 'f2-bed3',
        nameRu: 'Спальня 3 / Детская',
        nameEn: 'Bedroom 3 / Nursery',
        raw: 19,
        x: 479,
        y: 144,
        w: 167,
        h: 242,
        aspectRu: 'Юго-восток · Выход на лоджию',
        aspectEn: 'South-East · Loggia access',
        finishRu: 'Французские окна, место под рабочий стол',
        finishEn: 'Full-height glazing, study corner',
        windows: [{x1: 646, y1: 190, x2: 646, y2: 330}],
      },
      {
        id: 'f2-bath2',
        nameRu: 'Санузел 2-го этажа',
        nameEn: 'Shared Bathroom',
        raw: 9,
        x: 294,
        y: 266,
        w: 185,
        h: 120,
        aspectRu: 'Север · Вентиляция и тёплый пол',
        aspectEn: 'North · Heated floor',
        finishRu: 'Керамогранит под мрамор, инсталляция',
        finishEn: 'Marble-look porcelain, concealed cistern',
      },
    ];

    const floor3Templates = [
      {
        id: 'f3-lounge',
        nameRu: 'Панорамная лаунж-зона / Мансарда',
        nameEn: 'Panoramic Penthouse Lounge',
        raw: 34,
        x: 34,
        y: 34,
        w: 360,
        h: 220,
        aspectRu: 'Юг · Выход на эксплуатируемую кровлю',
        aspectEn: 'South · Rooftop terrace access',
        finishRu: 'Домашний кинотеатр, барная стойка',
        finishEn: 'Home cinema & wet bar',
        windows: [{x1: 85, y1: 34, x2: 340, y2: 34}],
      },
      {
        id: 'f3-rooftop',
        nameRu: 'Эксплуатируемая терраса',
        nameEn: 'Open Rooftop Terrace',
        raw: 28,
        x: 394,
        y: 34,
        w: 252,
        h: 352,
        aspectRu: 'Восток-Юг · Панорамный вид',
        aspectEn: 'East-South · Unobstructed vista',
        finishRu: 'Стеклянные перила, зона барбекю',
        finishEn: 'Tempered glass railing, outdoor lounge',
        accent: true,
      },
      {
        id: 'f3-spa',
        nameRu: 'Фитнес / СПА-комната',
        nameEn: 'Private Gym / Spa',
        raw: 20,
        x: 34,
        y: 254,
        w: 235,
        h: 132,
        aspectRu: 'Северо-запад · Приточная вентиляция',
        aspectEn: 'North-West · Fresh-air HVAC',
        finishRu: 'Амортизирующее покрытие, сауна из кедра',
        finishEn: 'Athletic flooring, cedar sauna',
      },
      {
        id: 'f3-bath',
        nameRu: 'Душевая и холл',
        nameEn: 'Shower & Upper Landing',
        raw: 10,
        x: 269,
        y: 254,
        w: 125,
        h: 132,
        aspectRu: 'Лестничный блок',
        aspectEn: 'Staircase & shower',
        finishRu: 'Тропический душ, панорамный зенитный фонарь',
        finishEn: 'Rain shower, skylight',
      },
    ];

    const floors = [
      {
        floorNum: 1,
        labelRu: '1 этаж · Дневная зона',
        labelEn: 'Floor 1 · Living & Grounds',
        ceiling: '3.2 м',
        totalArea: Math.round(totalArea * f1Ratio * 10) / 10,
        rooms: buildRooms(floor1Templates, totalArea * f1Ratio),
      },
    ];
    if (levelCount >= 2) {
      floors.push({
        floorNum: 2,
        labelRu: '2 этаж · Приватная зона',
        labelEn: 'Floor 2 · Private Suites',
        ceiling: '3.0 м',
        totalArea: Math.round(totalArea * f2Ratio * 10) / 10,
        rooms: buildRooms(floor2Templates, totalArea * f2Ratio),
      });
    }
    if (levelCount >= 3) {
      floors.push({
        floorNum: 3,
        labelRu: '3 этаж · Лаунж и кровля',
        labelEn: 'Floor 3 · Rooftop & Spa',
        ceiling: '3.1 м',
        totalArea: Math.round(totalArea * f3Ratio * 10) / 10,
        rooms: buildRooms(floor3Templates, totalArea * f3Ratio),
      });
    }
    return floors;
  }

  if (isCommercial) {
    const f1Ratio = levelCount === 2 ? 0.58 : 1;
    const floor1Templates = [
      {
        id: 'c1-open',
        nameRu: 'Open Space рабочая зона',
        nameEn: 'Open-Plan Workspace',
        raw: 56,
        x: 34,
        y: 34,
        w: 368,
        h: 230,
        aspectRu: 'Фасад · Панорамное остекление',
        aspectEn: 'Facade · Floor-to-ceiling glazing',
        finishRu: 'Фальшпол, шумопоглощающий потолок',
        finishEn: 'Raised access floor, acoustic ceiling',
        windows: [{x1: 75, y1: 34, x2: 365, y2: 34}, {x1: 34, y1: 70, x2: 34, y2: 225}],
      },
      {
        id: 'c1-meet',
        nameRu: 'Переговорная комната',
        nameEn: 'Executive Boardroom',
        raw: 24,
        x: 402,
        y: 34,
        w: 244,
        h: 156,
        aspectRu: 'Акустическое остекление',
        aspectEn: 'Acoustic glass partition',
        finishRu: 'ВКС-подготовка, климат-контроль',
        finishEn: 'AV-ready, zoned HVAC',
        windows: [{x1: 450, y1: 34, x2: 610, y2: 34}],
      },
      {
        id: 'c1-exec',
        nameRu: 'Кабинет руководителя',
        nameEn: 'Director Office',
        raw: 22,
        x: 402,
        y: 190,
        w: 244,
        h: 196,
        aspectRu: 'Восток · Изолированный блок',
        aspectEn: 'East · Private suite',
        finishRu: 'Шпонированные панели, индивидуальный санузел',
        finishEn: 'Wood wall paneling, private access',
        windows: [{x1: 646, y1: 230, x2: 646, y2: 345}],
      },
      {
        id: 'c1-reception',
        nameRu: 'Ресепшен и входная группа',
        nameEn: 'Reception & Lobby',
        raw: 18,
        x: 34,
        y: 264,
        w: 205,
        h: 122,
        aspectRu: 'Главный вход · СКУД',
        aspectEn: 'Main entrance · Access control',
        finishRu: 'Керамогранит крупного формата, стойка',
        finishEn: 'Large-format stone tile, concierge desk',
        door: {x: 135, y: 386, r: 28, dir: 'tr'},
      },
      {
        id: 'c1-coffee',
        nameRu: 'Кофе-пойнт и санузлы',
        nameEn: 'Coffee Lounge & Restrooms',
        raw: 16,
        x: 239,
        y: 264,
        w: 163,
        h: 122,
        aspectRu: 'Мокрая зона',
        aspectEn: 'Plumbing & kitchen core',
        finishRu: 'Водоподготовка, вытяжка',
        finishEn: 'Plumbing & filtration ready',
      },
    ];

    const floors = [
      {
        floorNum: s.floor || 1,
        labelRu:
          levelCount === 2
            ? 'Уровень 1 · Клиентская и Open Space'
            : `${s.floor || 1} этаж · Основной блок`,
        labelEn:
          levelCount === 2
            ? 'Level 1 · Client & Open Space'
            : `Floor ${s.floor || 1} · Main Suite`,
        ceiling: '3.4 м',
        totalArea: Math.round(totalArea * f1Ratio * 10) / 10,
        rooms: buildRooms(floor1Templates, totalArea * f1Ratio),
      },
    ];

    if (levelCount === 2) {
      const f2Area = Math.round(totalArea * 0.42 * 10) / 10;
      floors.push({
        floorNum: (s.floor || 1) + 1,
        labelRu: 'Уровень 2 · Переговорные и бэк-офис',
        labelEn: 'Level 2 · Boardrooms & Back Office',
        ceiling: '3.2 м',
        totalArea: f2Area,
        rooms: buildRooms(
          floor1Templates.map((r) => ({...r, id: r.id.replace('c1-', 'c2-')})),
          f2Area
        ),
      });
    }
    return floors;
  }

  // Квартира / Апартаменты
  const aptRatio = levelCount === 2 ? 0.62 : 1;
  const aptFloor1Templates = [
    {
      id: 'a1-living',
      nameRu: numRooms <= 2 ? 'Гостиная-студия' : 'Евро-гостиная',
      nameEn: numRooms <= 2 ? 'Studio Living Room' : 'Open Living Room',
      raw: 32,
      x: 34,
      y: 34,
      w: 262,
      h: 210,
      aspectRu: 'Юг · Панорамные окна в пол',
      aspectEn: 'South · Floor-to-ceiling glazing',
      finishRu: 'Высота потолков 3.0 м, подготовка под трековый свет',
      finishEn: '3.0 m ceilings, track lighting layout',
      windows: [{x1: 75, y1: 34, x2: 245, y2: 34}],
      door: {x: 296, y: 176, r: 24, dir: 'bl'},
    },
    {
      id: 'a1-kitchen',
      nameRu: 'Кухонная зона',
      nameEn: 'Kitchen Zone',
      raw: 16,
      x: 296,
      y: 34,
      w: 196,
      h: 145,
      aspectRu: 'Объединена с гостиной',
      aspectEn: 'Integrated with living area',
      finishRu: 'Выводы под остров, приточная вентиляция',
      finishEn: 'Island utility rough-in, fresh-air vent',
      windows: [{x1: 335, y1: 34, x2: 455, y2: 34}],
    },
    {
      id: 'a1-loggia',
      nameRu: 'Утеплённая лоджия',
      nameEn: 'Insulated Loggia',
      raw: 8,
      x: 492,
      y: 34,
      w: 154,
      h: 145,
      aspectRu: 'Панорамный вид на город',
      aspectEn: 'Panoramic city view',
      finishRu: 'Тёплое остекление, розетки для лаунж-зоны',
      finishEn: 'Triple-pane glazing, lounge outlets',
      accent: true,
    },
    {
      id: 'a1-master',
      nameRu: numRooms >= 2 ? 'Мастер-спальня' : 'Спальная зона',
      nameEn: numRooms >= 2 ? 'Primary Bedroom' : 'Sleeping Alcove',
      raw: 21,
      x: 34,
      y: 244,
      w: 224,
      h: 142,
      aspectRu: 'Восток · Тихий двор',
      aspectEn: 'East · Quiet courtyard',
      finishRu: 'Ниша под встроенный шкаф, шумоизоляция',
      finishEn: 'Built-in wardrobe niche, acoustic wall',
      windows: [{x1: 72, y1: 386, x2: 215, y2: 386}],
    },
    ...(numRooms >= 3
      ? [
          {
            id: 'a1-bed2',
            nameRu: 'Детская / Кабинет',
            nameEn: 'Second Bedroom / Study',
            raw: 16,
            x: 446,
            y: 179,
            w: 200,
            h: 207,
            aspectRu: 'Юго-восток',
            aspectEn: 'South-East aspect',
            finishRu: 'Эргономичная геометрия под 2 окна',
            finishEn: 'Corner natural light',
            windows: [{x1: 646, y1: 220, x2: 646, y2: 338}],
          },
        ]
      : [
          {
            id: 'a1-wardrobe',
            nameRu: 'Гардеробная система',
            nameEn: 'Walk-in Closet',
            raw: 7,
            x: 446,
            y: 179,
            w: 200,
            h: 207,
            aspectRu: 'Удобное хранение',
            aspectEn: 'Dedicated storage',
            finishRu: 'Встроенная система с подсветкой',
            finishEn: 'Custom illuminated storage',
          },
        ]),
    {
      id: 'a1-hall',
      nameRu: 'Прихожая',
      nameEn: 'Entry Hallway',
      raw: 11,
      x: 258,
      y: 244,
      w: 188,
      h: 142,
      aspectRu: 'Входная дверь премиум-класса',
      aspectEn: 'Acoustic armored entry',
      finishRu: 'Ниша под шкаф-купе, тёплый пол',
      finishEn: 'Coat alcove, heated floor',
      door: {x: 350, y: 386, r: 24, dir: 'tl'},
    },
    {
      id: 'a1-bath',
      nameRu: 'Ванная комната',
      nameEn: 'Bathroom',
      raw: 8,
      x: 296,
      y: 179,
      w: 150,
      h: 65,
      aspectRu: 'Мокрая зона',
      aspectEn: 'Bath & laundry',
      finishRu: 'Трап в полу, полотенцесушитель',
      finishEn: 'Flush floor drain, heated rail',
    },
  ];

  const floors = [
    {
      floorNum: s.floor || 1,
      labelRu:
        levelCount === 2
          ? `${s.floor || 1} уровень · Гостиная и кухня`
          : `${s.floor || 1} этаж · Основной уровень`,
      labelEn:
        levelCount === 2
          ? `Level 1 (Fl. ${s.floor || 1}) · Living`
          : `Floor ${s.floor || 1} · Apartment Plan`,
      ceiling: '3.0 м',
      totalArea: Math.round(totalArea * aptRatio * 10) / 10,
      rooms: buildRooms(aptFloor1Templates, totalArea * aptRatio),
    },
  ];

  if (levelCount === 2) {
    const f2Area = Math.round(totalArea * 0.38 * 10) / 10;
    floors.push({
      floorNum: (s.floor || 1) + 1,
      labelRu: `${(s.floor || 1) + 1} уровень · Приватные спальни`,
      labelEn: `Level 2 (Fl. ${(s.floor || 1) + 1}) · Suites`,
      ceiling: '3.0 м',
      totalArea: f2Area,
      rooms: buildRooms(
        [
          {
            id: 'a2-master',
            nameRu: 'Мастер-спальня',
            nameEn: 'Primary Suite',
            raw: 24,
            x: 34,
            y: 34,
            w: 295,
            h: 210,
            aspectRu: 'Юг · Вид на панораму',
            aspectEn: 'South · City skyline',
            finishRu: 'Собственная ванная и гардероб',
            finishEn: 'En-suite bath & closet',
            windows: [{x1: 80, y1: 34, x2: 270, y2: 34}],
          },
          {
            id: 'a2-terrace',
            nameRu: 'Верхняя терраса',
            nameEn: 'Upper Private Terrace',
            raw: 16,
            x: 329,
            y: 34,
            w: 317,
            h: 210,
            aspectRu: 'Открытый воздух',
            aspectEn: 'Outdoor deck',
            finishRu: 'Деревянный настил и освещение',
            finishEn: 'Timber decking & lighting',
            accent: true,
          },
          {
            id: 'a2-study',
            nameRu: 'Кабинет / Спальня 4',
            nameEn: 'Study / Bedroom 4',
            raw: 16,
            x: 34,
            y: 244,
            w: 320,
            h: 142,
            aspectRu: 'Восток',
            aspectEn: 'East window',
            finishRu: 'Шумоизоляция, рабочая зона',
            finishEn: 'Quiet studio layout',
            windows: [{x1: 95, y1: 386, x2: 245, y2: 386}],
          },
          {
            id: 'a2-bath',
            nameRu: 'Ванная и лестничный холл',
            nameEn: 'En-suite Bath & Hall',
            raw: 12,
            x: 354,
            y: 244,
            w: 292,
            h: 142,
            aspectRu: 'Приватный блок',
            aspectEn: 'Private core',
            finishRu: 'Дизайнерская сантехника',
            finishEn: 'Architectural fixtures',
          },
        ],
        f2Area
      ),
    });
  }

  return floors;
}

/**
 * Генерирует интерактивный архитектурный SVG-чертёж конкретного этажа
 */
export function getFloorPlanSvg(floorData, activeRoomId, lang = 'ru') {
  if (!floorData) return '';

  const roomShapes = floorData.rooms
    .map((room) => {
      const isSelected = String(room.id) === String(activeRoomId);
      const roomName = lang === 'ru' ? room.nameRu : room.nameEn;
      const shortName = roomName.length > 15 ? `${roomName.slice(0, 13)}…` : roomName;
      const areaLabel = `${room.area} ${lang === 'ru' ? 'м²' : 'm²'}`;

      const windowMarkup = (room.windows || [])
        .map(
          (w) =>
            `<line x1="${w.x1}" y1="${w.y1}" x2="${w.x2}" y2="${w.y2}" class="floorplan-window" />`
        )
        .join('');

      let doorMarkup = '';
      if (room.door) {
        const {x, y, r} = room.door;
        doorMarkup = `
          <g class="floorplan-door" pointer-events="none">
            <path d="M ${x - r} ${y} A ${r} ${r} 0 0 1 ${x} ${y - r}" fill="none" stroke="var(--accent-cyan)" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.7" />
            <line x1="${x}" y1="${y}" x2="${x}" y2="${y - r}" stroke="var(--accent-cyan)" stroke-width="1.5" opacity="0.85" />
          </g>
        `;
      }

      const cx = room.x + room.w / 2;
      const cy = room.y + room.h / 2;

      return `
        <g
          class="floorplan-room ${isSelected ? 'is-active' : ''} ${room.accent ? 'is-terrace' : ''}"
          data-room-id="${room.id}"
          tabindex="0"
          role="button"
          aria-pressed="${isSelected ? 'true' : 'false'}"
          aria-label="${roomName}: ${areaLabel}"
        >
          <rect
            x="${room.x}"
            y="${room.y}"
            width="${room.w}"
            height="${room.h}"
            class="floorplan-room__rect"
          />
          ${windowMarkup}
          ${doorMarkup}
          <text x="${cx}" y="${cy - 6}" text-anchor="middle" class="floorplan-room__title">${shortName}</text>
          <text x="${cx}" y="${cy + 14}" text-anchor="middle" class="floorplan-room__area">${areaLabel}</text>
        </g>
      `;
    })
    .join('');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 420" class="floorplan-svg" role="img" aria-label="Architectural floor plan">
      <defs>
        <pattern id="fp-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--border-subtle)" stroke-width="0.6" opacity="0.65" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="680" height="420" rx="12" fill="url(#fp-grid)" />
      <!-- Внешний архитектурный контур стен -->
      <rect x="34" y="34" width="612" height="352" rx="4" fill="none" stroke="var(--text-muted)" stroke-width="3.2" opacity="0.45" />
      ${roomShapes}
      <!-- Масштаб и ориентация сторон света -->
      <g transform="translate(560, 404)" opacity="0.72" pointer-events="none">
        <line x1="0" y1="0" x2="72" y2="0" stroke="var(--text-muted)" stroke-width="1.5" />
        <line x1="0" y1="-4" x2="0" y2="4" stroke="var(--text-muted)" stroke-width="1.5" />
        <line x1="36" y1="-3" x2="36" y2="3" stroke="var(--text-muted)" stroke-width="1.2" />
        <line x1="72" y1="-4" x2="72" y2="4" stroke="var(--text-muted)" stroke-width="1.5" />
        <text x="80" y="3" font-size="10" fill="var(--text-muted)" font-weight="600">0 — 4 ${lang === 'ru' ? 'м' : 'm'}</text>
      </g>
      <g transform="translate(34, 404)" opacity="0.75" pointer-events="none">
        <circle cx="8" cy="-1" r="7" fill="none" stroke="var(--accent-cyan)" stroke-width="1.2" />
        <path d="M8 -6 L10 0 L8 -1 L6 0 Z" fill="var(--accent-cyan)" />
        <text x="20" y="3" font-size="10" fill="var(--text-muted)" font-weight="700">${lang === 'ru' ? 'С · N' : 'N'}</text>
      </g>
    </svg>
  `;
}
