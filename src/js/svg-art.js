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
    {name: lang === 'ru' ? 'Минск' : 'Minsk', x: 278, y: 185},
    {name: lang === 'ru' ? 'Брест' : 'Brest', x: 105, y: 325},
    {name: lang === 'ru' ? 'Гродно' : 'Grodno', x: 108, y: 212},
    {name: lang === 'ru' ? 'Витебск' : 'Vitebsk', x: 392, y: 102},
    {name: lang === 'ru' ? 'Гомель' : 'Gomel', x: 405, y: 315},
    {name: lang === 'ru' ? 'Могилёв' : 'Mogilev', x: 395, y: 205},
  ];

  const towns = [
    {name: lang === 'ru' ? 'Слуцк' : 'Slutsk', x: 266, y: 246},
    {name: lang === 'ru' ? 'Волковыск' : 'Volkovysk', x: 128, y: 248},
    {name: lang === 'ru' ? 'Смиловичи' : 'Smilovichi', x: 318, y: 200},
    {name: lang === 'ru' ? 'Пинск' : 'Pinsk', x: 205, y: 330},
    {name: lang === 'ru' ? 'Полоцк' : 'Polotsk', x: 332, y: 88},
  ];

  const minskDistricts = isMinskZoom
    ? `
      <g class="belarus-map__minsk-layer">
        <!-- Кольцо МКАД -->
        <ellipse
          cx="275" cy="186" rx="26" ry="20"
          fill="rgba(34, 211, 238, 0.06)"
          stroke="rgba(34, 211, 238, 0.45)"
          stroke-width="${1.2 * zoomScale}"
          stroke-dasharray="${3 * zoomScale} ${2.5 * zoomScale}"
        />
        <!-- Река Свислочь -->
        <path
          d="M240 162 Q265 178 276 186 T304 218"
          fill="none"
          stroke="rgba(56, 189, 248, 0.42)"
          stroke-width="${1.8 * zoomScale}"
          stroke-linecap="round"
        />
        <text x="275" y="182" text-anchor="middle" fill="#cbd5e1" font-size="${7.5 * zoomScale}" font-weight="700">МКАД / Центр</text>
        <text x="244" y="160" text-anchor="middle" fill="#94a3b8" font-size="${6.5 * zoomScale}">${lang === 'ru' ? 'Ратомка' : 'Ratomka'}</text>
        <text x="316" y="150" text-anchor="middle" fill="#94a3b8" font-size="${6.5 * zoomScale}">${lang === 'ru' ? 'Раубичи' : 'Raubichi'}</text>
        <text x="298" y="163" text-anchor="middle" fill="#94a3b8" font-size="${6.5 * zoomScale}">${lang === 'ru' ? 'Новая Боровая' : 'Novaya Borovaya'}</text>
        <text x="292" y="217" text-anchor="middle" fill="#94a3b8" font-size="${6.5 * zoomScale}">${lang === 'ru' ? 'Серебрянка' : 'Serebryanka'}</text>
      </g>
    `
    : '';

  const pins = properties
    .map((p) => {
      const isSelected = String(p.id) === String(activeId);
      const r = (isSelected ? 9.5 : 6.5) * zoomScale;
      const strokeW = 2 * zoomScale;
      const pulse = isSelected
        ? `<circle r="${15 * zoomScale}" fill="rgba(34, 211, 238, 0.24)" stroke="rgba(34, 211, 238, 0.65)" stroke-width="${1 * zoomScale}" />`
        : '';
      return `
        <g class="belarus-map__pin" data-map-id="${p.id}" transform="translate(${p.mapCoords.x}, ${p.mapCoords.y})">
          ${pulse}
          <circle r="${r}" fill="${isSelected ? '#22d3ee' : '#8b5cf6'}" stroke="#ffffff" stroke-width="${strokeW}" />
        </g>
      `;
    })
    .join('');

  const cityLabels = cities
    .map(
      (c) => `
      <text x="${c.x}" y="${c.y - 13 * zoomScale}" text-anchor="middle" fill="#a1a4b8" font-size="${11 * zoomScale}" font-weight="600">${c.name}</text>
    `
    )
    .join('');

  const townLabels = towns
    .map(
      (tItem) => `
      <text x="${tItem.x}" y="${tItem.y - 11 * zoomScale}" text-anchor="middle" fill="#8b95ab" font-size="${8.5 * zoomScale}" font-weight="500">${tItem.name}</text>
    `
    )
    .join('');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}" role="img" aria-label="Map of Belarus">
      <!-- Стилизованный контур Республики Беларусь -->
      <path
        d="M128 118 L195 92 L265 62 L352 44 L428 78 L468 148 L452 222 L462 292 L416 346 L334 342 L264 358 L178 344 L96 352 L68 292 L84 224 L62 174 Z"
        fill="rgba(139, 92, 246, 0.12)"
        stroke="rgba(139, 92, 246, 0.55)"
        stroke-width="${2.2 * zoomScale}"
        stroke-linejoin="round"
      />
      <!-- Административные связи к столице -->
      <g stroke="rgba(148, 163, 184, 0.22)" stroke-dasharray="${4 * zoomScale} ${4 * zoomScale}" stroke-width="${1.2 * zoomScale}">
        <line x1="278" y1="185" x2="105" y2="325" />
        <line x1="278" y1="185" x2="108" y2="212" />
        <line x1="278" y1="185" x2="392" y2="102" />
        <line x1="278" y1="185" x2="405" y2="315" />
        <line x1="278" y1="185" x2="395" y2="205" />
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

