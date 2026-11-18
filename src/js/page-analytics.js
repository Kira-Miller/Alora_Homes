// ==========================================================================
// Контроллер страницы аналитики рынка недвижимости Беларуси (analytics.html)
// ==========================================================================

import {initLayout} from './layout.js';
import {getState, subscribe} from './state.js';
import {getIconSvg} from './svg-art.js';

initLayout('analytics');

const USD_TO_BYN = 3.227;

const MARKET_REGIONS = [
  {
    id: 'minsk-center',
    nameRu: 'Минск (Центр)',
    nameEn: 'Minsk (Center)',
    shortRu: 'Минск Ц.',
    shortEn: 'Minsk Ctr',
    aptUsd: 2180,
    houseUsd: 2450,
    commUsd: 2620,
    yoyPct: 7.4,
    days: 29,
    catalogQuery: '?region=minsk',
    noteRu: 'Независимости, Сторожовская, проспект Победителей — высокий спрос со стороны IT и инвесторов.',
    noteEn: 'Independence & Pobediteley avenues — high demand from IT specialists and investors.',
  },
  {
    id: 'minsk-city',
    nameRu: 'Минск (спальные р-ны)',
    nameEn: 'Minsk (Residential)',
    shortRu: 'Минск',
    shortEn: 'Minsk Res',
    aptUsd: 1640,
    houseUsd: 1890,
    commUsd: 1950,
    yoyPct: 6.1,
    days: 34,
    catalogQuery: '?region=minsk',
    noteRu: 'Серебрянка, Орловская, Фрунзенский район — сбалансированный бюджет и высокая ликвидность.',
    noteEn: 'Serebryanka, Orlovskaya, Frunzensky — balanced entry budget and quick resale liquidity.',
  },
  {
    id: 'minsk-suburbs',
    nameRu: 'Минский р-н (Ратомка / Н. Боровая)',
    nameEn: 'Minsk Dist. (Suburbs)',
    shortRu: 'Минский р-н',
    shortEn: 'Minsk Dist',
    aptUsd: 1710,
    houseUsd: 1760,
    commUsd: 1580,
    yoyPct: 8.2,
    days: 36,
    catalogQuery: '?region=minsk-region',
    noteRu: 'Новая Боровая, Ратомка, Раубичи, Смиловичи — лидер по росту стоимости загородных домов.',
    noteEn: 'Novaya Borovaya, Ratomka, Raubichi, Smilovichi — fastest appreciation in suburban housing.',
  },
  {
    id: 'grodno',
    nameRu: 'Гродно и область',
    nameEn: 'Grodno & Region',
    shortRu: 'Гродно',
    shortEn: 'Grodno',
    aptUsd: 1090,
    houseUsd: 1240,
    commUsd: 1310,
    yoyPct: 5.8,
    days: 39,
    catalogQuery: '?region=grodno',
    noteRu: 'Высокий интерес к историческому центру и индивидуальной застройке у зелёных зон.',
    noteEn: 'Strong interest in historic center apartments and green-belt family homes.',
  },
  {
    id: 'brest',
    nameRu: 'Брест и область',
    nameEn: 'Brest & Region',
    shortRu: 'Брест',
    shortEn: 'Brest',
    aptUsd: 1045,
    houseUsd: 1180,
    commUsd: 1260,
    yoyPct: 5.3,
    days: 41,
    catalogQuery: '?region=brest',
    noteRu: 'Устойчивый спрос на улицы Советскую, Гоголя и жилые кварталы вдоль Набережной.',
    noteEn: 'Steady demand around Sovetskaya St and modern residential quarters near the river.',
  },
  {
    id: 'gomel',
    nameRu: 'Гомель и область',
    nameEn: 'Gomel & Region',
    shortRu: 'Гомель',
    shortEn: 'Gomel',
    aptUsd: 930,
    houseUsd: 1080,
    commUsd: 1140,
    yoyPct: 4.5,
    days: 45,
    catalogQuery: '?region=gomel',
    noteRu: 'Особой популярностью пользуются коттеджи в посёлке Чёнки и новостройки Центрального района.',
    noteEn: 'Cottages in Chyonki and Central district developments drive regional volume.',
  },
  {
    id: 'vitebsk',
    nameRu: 'Витебск и Полоцк',
    nameEn: 'Vitebsk & Polotsk',
    shortRu: 'Витебск',
    shortEn: 'Vitebsk',
    aptUsd: 885,
    houseUsd: 995,
    commUsd: 1090,
    yoyPct: 4.1,
    days: 47,
    catalogQuery: '?region=vitebsk',
    noteRu: 'Проспект Фрунзе и проспект Скорины в Полоцке формируют ядро ликвидных сделок региона.',
    noteEn: 'Frunze Ave in Vitebsk and Skaryna Ave in Polotsk anchor regional transaction volume.',
  },
  {
    id: 'mogilev',
    nameRu: 'Могилёв и область',
    nameEn: 'Mogilev & Region',
    shortRu: 'Могилёв',
    shortEn: 'Mogilev',
    aptUsd: 895,
    houseUsd: 1015,
    commUsd: 1110,
    yoyPct: 4.4,
    days: 46,
    catalogQuery: '?region=mogilev',
    noteRu: 'Повышенный интерес к качественным объектам на Первомайской улице и вблизи Печерского лесопарка.',
    noteEn: 'Growing demand along Pervomayskaya St and near Pechersky forest park.',
  },
  {
    id: 'slutsk-sat',
    nameRu: 'Слуцк и Смиловичи',
    nameEn: 'Slutsk & Smilovichi',
    shortRu: 'Слуцк',
    shortEn: 'Slutsk',
    aptUsd: 785,
    houseUsd: 920,
    commUsd: 940,
    yoyPct: 6.7,
    days: 38,
    catalogQuery: '?query=%D0%A1%D0%BB%D1%83%D1%86%D0%BA',
    noteRu: 'Выгодное соотношение цены м² и транспортной доступности к Минску стимулирует сделки.',
    noteEn: 'Attractive cost per sq.m and highway connectivity to Minsk drive buyer activity.',
  },
  {
    id: 'pinsk-volk',
    nameRu: 'Пинск и Волковыск',
    nameEn: 'Pinsk & Volkovysk',
    shortRu: 'Пинск/Волк.',
    shortEn: 'Pinsk/Volk',
    aptUsd: 760,
    houseUsd: 890,
    commUsd: 910,
    yoyPct: 5.1,
    days: 43,
    catalogQuery: '?query=%D0%9F%D0%B8%D0%BD%D1%81%D0%BA',
    noteRu: 'Стабильный локальный спрос на семейные дома с участком и энергоэффективные квартиры.',
    noteEn: 'Consistent local demand for family homes with land plots and energy-efficient flats.',
  },
];

const MONTHLY_TREND = {
  monthsRu: ['Дек', 'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя'],
  monthsEn: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
  series: {
    minsk: {
      labelRu: 'Минск (средняя)',
      labelEn: 'Minsk (avg)',
      valuesUsd: [1585, 1595, 1608, 1618, 1630, 1642, 1649, 1656, 1664, 1672, 1680, 1692],
    },
    regional: {
      labelRu: 'Областные центры',
      labelEn: 'Regional Capitals',
      valuesUsd: [940, 945, 952, 958, 966, 974, 980, 986, 992, 998, 1004, 1012],
    },
    towns: {
      labelRu: 'Слуцк, Пинск, Волковыск',
      labelEn: 'Satellite Towns',
      valuesUsd: [735, 740, 745, 750, 756, 762, 766, 771, 776, 780, 784, 790],
    },
  },
};

const ADVICE_CARDS = [
  {
    icon: 'scale',
    titleRu: 'Проверка истории объекта и БТИ перед задатком',
    titleEn: 'Title & Registry Audit Before Deposit',
    bodyRu:
      'Запросите выписку из ЕГРНИ о правах и обременениях, проверьте согласование перепланировок по техпаспорту БТИ и отсутствие зарегистрированных третьих лиц.',
    bodyEn:
      'Always request a fresh state registry extract verifying title and encumbrances, match floor layouts against the technical passport, and confirm vacant registration status.',
  },
  {
    icon: 'building',
    titleRu: 'Расчёт реального бюджета в BYN и USD',
    titleEn: 'Dual-Currency Budgeting (BYN & USD)',
    bodyRu:
      'Согласно законодательству РБ расчёты производятся в белорусских рублях. Закладывайте 2–3% от цены на нотариальное оформление, госпошлины и банковскую комиссию.',
    bodyEn:
      'Settlements in Belarus are legally executed in BYN. Reserve 2–3% above the purchase price for notary fees, state registration duties, and bank transfers.',
  },
  {
    icon: 'trees',
    titleRu: 'Чек-лист при покупке загородного дома',
    titleEn: 'Country Estate Engineering Checklist',
    bodyRu:
      'Оцените мощность выделенного электричества (от 15 кВт), глубину скважины, наличие магистрального газа, правовой статус участка (ПНВ или частная собственность) и подъезд зимой.',
    bodyEn:
      'Verify electrical capacity (15+ kW), well water yield, gas connection status, land ownership tenure, and all-season road clearance before closing.',
  },
  {
    icon: 'briefcase',
    titleRu: 'Как оценить ликвидность через 3–5 лет',
    titleEn: 'Assessing 3–5 Year Resale Liquidity',
    bodyRu:
      'Объекты в пешей доступности от метро, в кварталах с готовой школьной инфраструктурой или у крупных магистралей (М1, Р23) сохраняют цену и продаются на 30% быстрее.',
    bodyEn:
      'Properties within walking distance of metro lines, completed schools, or major highways retain capital value better and resell 30% faster.',
  },
];

const MARKET_NEWS = [
  {
    dateRu: '16 ноября 2026',
    dateEn: 'Nov 16, 2026',
    tagRu: 'Минск и пригород',
    tagEn: 'Minsk & Suburbs',
    titleRu: 'Спрос на готовые таунхаусы в радиусе до 15 км от МКАД вырос на 18% за год',
    titleEn: 'Demand for turnkey townhouses within 15 km of the Minsk Ring Road rose 18% YoY',
    summaryRu:
      'Покупатели всё чаще выбирают формат «городской комфорт на своей земле» с готовым отоплением, газом и оптоволокном вместо самостоятельной долгой стройки.',
    summaryEn:
      'Buyers increasingly favor turnkey townhouses with gas heating and fiber internet over multi-year ground-up construction.',
  },
  {
    dateRu: '11 ноября 2026',
    dateEn: 'Nov 11, 2026',
    tagRu: 'Регионы Беларуси',
    tagEn: 'Regional Markets',
    titleRu: 'Гродно, Брест и Слуцк показали рекордную скорость закрытия сделок с трейд-ин',
    titleEn: 'Grodno, Brest, and Slutsk hit record closing speed on trade-in apartment swaps',
    summaryRu:
      'Синхронные цепочки «продажа старой квартиры + покупка большей площади» сократились с 65 до 38 дней благодаря прозрачной оценке и предпроверке документов.',
    summaryEn:
      'Coordinated sell-and-buy chains dropped from 65 to 38 days thanks to pre-audited documentation and transparent 24-hour appraisals.',
  },
  {
    dateRu: '04 ноября 2026',
    dateEn: 'Nov 04, 2026',
    tagRu: 'Коммерческая недвижимость',
    tagEn: 'Commercial Sector',
    titleRu: 'Офисы формата A и стрит-ритейл в областных центрах сохраняют доходность 8–10% годовых',
    titleEn: 'Grade-A offices and street retail in regional capitals sustain 8–10% annual yields',
    summaryRu:
      'Наибольший интерес инвесторов сосредоточен на помещениях с готовым долгосрочным арендатором на первых линиях центральных проспектов.',
    summaryEn:
      'Investor interest centers on prime street-level retail and flexible office blocks with established long-term tenants.',
  },
];

let activeSegment = 'apt'; // 'apt' | 'house' | 'comm'
let selectedRegionId = 'minsk-center';
let activeTrendSeries = 'minsk'; // 'minsk' | 'regional' | 'towns'
let activeMonthIdx = 11; // Ноябрь

function getSegmentPriceUsd(regionObj, segment) {
  if (segment === 'house') return regionObj.houseUsd;
  if (segment === 'comm') return regionObj.commUsd;
  return regionObj.aptUsd;
}

function formatSqmPrice(usdVal, currency, lang) {
  const unit = lang === 'ru' ? 'м²' : 'm²';
  const bynVal = Math.round(usdVal * USD_TO_BYN);
  const strUsd = `$${usdVal.toLocaleString('ru-RU')}/${unit}`;
  const strByn = `${bynVal.toLocaleString('ru-RU')} BYN/${unit}`;
  return currency === 'USD'
    ? {primary: strUsd, secondary: strByn, val: usdVal}
    : {primary: strByn, secondary: strUsd, val: bynVal};
}

function formatBudgetTotal(usdVal, currency) {
  const bynVal = Math.round(usdVal * USD_TO_BYN);
  return currency === 'USD'
    ? `$${Math.round(usdVal).toLocaleString('ru-RU')}`
    : `${bynVal.toLocaleString('ru-RU')} BYN`;
}

function renderBarChartSvg(regions, segment, activeId, currency, lang) {
  const w = 720;
  const h = 330;
  const padL = 56;
  const padR = 16;
  const padT = 26;
  const padB = 52;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  const rawMax = Math.max(...regions.map((r) => getSegmentPriceUsd(r, segment)));
  const maxUsd = Math.ceil(rawMax / 500) * 500;
  const gridSteps = 4;

  const gridLines = Array.from({length: gridSteps + 1}, (_, i) => {
    const ratio = i / gridSteps;
    const y = padT + plotH - ratio * plotH;
    const tickUsd = Math.round(maxUsd * ratio);
    const tickDisplay =
      currency === 'USD'
        ? `$${tickUsd}`
        : `${Math.round((tickUsd * USD_TO_BYN) / 100) * 100}`;
    return `
      <line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" stroke="var(--border-subtle)" stroke-dasharray="3 4" />
      <text x="${padL - 8}" y="${y + 4}" text-anchor="end" fill="var(--text-muted)" font-size="10.5" class="svg-tabular">${tickDisplay}</text>
    `;
  }).join('');

  const slotW = plotW / regions.length;
  const barW = Math.min(40, slotW * 0.62);

  const bars = regions
    .map((reg, idx) => {
      const usdVal = getSegmentPriceUsd(reg, segment);
      const barH = Math.max(6, (usdVal / maxUsd) * plotH);
      const x = padL + idx * slotW + (slotW - barW) / 2;
      const y = padT + plotH - barH;
      const isSelected = reg.id === activeId;
      const fill = isSelected ? 'var(--accent-cyan)' : 'var(--accent-primary)';
      const topVal =
        currency === 'USD'
          ? `$${usdVal}`
          : `${Math.round(usdVal * USD_TO_BYN).toLocaleString('ru-RU')}`;
      const label = lang === 'ru' ? reg.shortRu : reg.shortEn;

      return `
        <g
          class="analytics-bar-group ${isSelected ? 'is-active' : ''}"
          data-bar-region="${reg.id}"
          tabindex="0"
          role="button"
          aria-pressed="${isSelected ? 'true' : 'false'}"
          aria-label="${lang === 'ru' ? reg.nameRu : reg.nameEn}: ${topVal}"
        >
          <rect x="${x - 6}" y="${padT}" width="${barW + 12}" height="${plotH + 40}" fill="transparent" />
          <rect
            x="${x}"
            y="${y}"
            width="${barW}"
            height="${barH}"
            rx="6"
            fill="${fill}"
            fill-opacity="${isSelected ? '1' : '0.78'}"
            class="analytics-bar-rect"
          />
          <text
            x="${x + barW / 2}"
            y="${y - 7}"
            text-anchor="middle"
            font-size="10"
            font-weight="${isSelected ? '700' : '600'}"
            fill="${isSelected ? 'var(--accent-cyan)' : 'var(--text-secondary)'}"
            class="svg-tabular"
          >${topVal}</text>
          <text
            x="${x + barW / 2}"
            y="${padT + plotH + 18}"
            text-anchor="middle"
            font-size="10.5"
            font-weight="${isSelected ? '700' : '500'}"
            fill="${isSelected ? 'var(--text-primary)' : 'var(--text-muted)'}"
          >${label}</text>
        </g>
      `;
    })
    .join('');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" class="analytics-chart-svg" role="img" aria-label="Average price per square meter by Belarus region">
      ${gridLines}
      ${bars}
    </svg>
  `;
}

function renderTrendChartSvg(seriesKey, monthIdx, currency, lang) {
  const w = 720;
  const h = 260;
  const padL = 56;
  const padR = 24;
  const padT = 26;
  const padB = 38;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  const seriesObj = MONTHLY_TREND.series[seriesKey] || MONTHLY_TREND.series.minsk;
  const vals = seriesObj.valuesUsd;
  const months = lang === 'ru' ? MONTHLY_TREND.monthsRu : MONTHLY_TREND.monthsEn;

  const minRaw = Math.min(...vals);
  const maxRaw = Math.max(...vals);
  const minBound = Math.floor((minRaw - 45) / 50) * 50;
  const maxBound = Math.ceil((maxRaw + 45) / 50) * 50;
  const span = Math.max(100, maxBound - minBound);

  const coords = vals.map((v, i) => {
    const x = padL + (i / (vals.length - 1)) * plotW;
    const y = padT + plotH - ((v - minBound) / span) * plotH;
    return {x, y, valUsd: v, month: months[i], idx: i};
  });

  const polylinePoints = coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const areaPath = `M ${coords[0].x.toFixed(1)} ${(padT + plotH).toFixed(1)} L ${coords
    .map((c) => `${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(' L ')} L ${coords[coords.length - 1].x.toFixed(1)} ${(padT + plotH).toFixed(1)} Z`;

  const gridSteps = 3;
  const gridLines = Array.from({length: gridSteps + 1}, (_, i) => {
    const ratio = i / gridSteps;
    const y = padT + plotH - ratio * plotH;
    const tickUsd = Math.round(minBound + span * ratio);
    const label = currency === 'USD' ? `$${tickUsd}` : `${Math.round(tickUsd * USD_TO_BYN)}`;
    return `
      <line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" stroke="var(--border-subtle)" stroke-dasharray="3 4" />
      <text x="${padL - 8}" y="${y + 4}" text-anchor="end" fill="var(--text-muted)" font-size="10.5" class="svg-tabular">${label}</text>
    `;
  }).join('');

  const activePoint = coords[monthIdx] || coords[coords.length - 1];

  const nodes = coords
    .map((c) => {
      const isAct = c.idx === monthIdx;
      return `
        <g
          class="trend-node ${isAct ? 'is-active' : ''}"
          data-month-idx="${c.idx}"
          tabindex="0"
          role="button"
          aria-pressed="${isAct ? 'true' : 'false'}"
          aria-label="${c.month}: $${c.valUsd}"
        >
          <rect x="${c.x - 20}" y="${padT}" width="40" height="${plotH + 34}" fill="transparent" />
          <circle
            cx="${c.x}"
            cy="${c.y}"
            r="${isAct ? 6.5 : 4}"
            fill="${isAct ? 'var(--accent-cyan)' : 'var(--bg-surface)'}"
            stroke="${isAct ? '#ffffff' : 'var(--accent-primary)'}"
            stroke-width="${isAct ? 2.5 : 2}"
          />
          <text
            x="${c.x}"
            y="${padT + plotH + 22}"
            text-anchor="middle"
            font-size="10.5"
            font-weight="${isAct ? '700' : '500'}"
            fill="${isAct ? 'var(--text-primary)' : 'var(--text-muted)'}"
          >${c.month}</text>
        </g>
      `;
    })
    .join('');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" class="analytics-chart-svg" role="img" aria-label="12-month price per square meter trend chart">
      <defs>
        <linearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.34" />
          <stop offset="100%" stop-color="#22d3ee" stop-opacity="0.02" />
        </linearGradient>
      </defs>
      ${gridLines}
      <line
        x1="${activePoint.x}"
        y1="${padT}"
        x2="${activePoint.x}"
        y2="${padT + plotH}"
        stroke="var(--accent-cyan)"
        stroke-width="1.4"
        stroke-dasharray="4 3"
        opacity="0.8"
      />
      <path d="${areaPath}" fill="url(#trendAreaGrad)" />
      <polyline fill="none" stroke="var(--accent-primary)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" points="${polylinePoints}" />
      ${nodes}
    </svg>
  `;
}

function renderAnalyticsPage() {
  const root = document.getElementById('analytics-root');
  if (!root) return;

  const {lang, currency} = getState();
  const segmentLabels = {
    apt: lang === 'ru' ? 'Квартиры (за м²)' : 'Apartments (per m²)',
    house: lang === 'ru' ? 'Дома и коттеджи (за м²)' : 'Houses & Villas (per m²)',
    comm: lang === 'ru' ? 'Коммерческая (за м²)' : 'Commercial (per m²)',
  };

  const minskAvgUsd = getSegmentPriceUsd(MARKET_REGIONS[1], activeSegment);
  const regionalList = MARKET_REGIONS.slice(3, 8);
  const regionalAvgUsd = Math.round(
    regionalList.reduce((sum, r) => sum + getSegmentPriceUsd(r, activeSegment), 0) /
      regionalList.length
  );
  const avgDays = Math.round(
    MARKET_REGIONS.reduce((sum, r) => sum + r.days, 0) / MARKET_REGIONS.length
  );
  const minskFormatted = formatSqmPrice(minskAvgUsd, currency, lang);
  const regFormatted = formatSqmPrice(regionalAvgUsd, currency, lang);

  const selectedRegion =
    MARKET_REGIONS.find((r) => r.id === selectedRegionId) || MARKET_REGIONS[0];
  const selPriceUsd = getSegmentPriceUsd(selectedRegion, activeSegment);
  const selFormatted = formatSqmPrice(selPriceUsd, currency, lang);
  const typicalSqm = activeSegment === 'apt' ? 58 : activeSegment === 'house' ? 160 : 95;
  const typicalBudget = formatBudgetTotal(selPriceUsd * typicalSqm, currency);

  const trendSeries = MONTHLY_TREND.series[activeTrendSeries] || MONTHLY_TREND.series.minsk;
  const curMonthUsd = trendSeries.valuesUsd[activeMonthIdx] || trendSeries.valuesUsd[11];
  const prevMonthUsd =
    trendSeries.valuesUsd[Math.max(0, activeMonthIdx - 1)] || trendSeries.valuesUsd[0];
  const momDelta = (((curMonthUsd - prevMonthUsd) / prevMonthUsd) * 100).toFixed(1);
  const curMonthFormatted = formatSqmPrice(curMonthUsd, currency, lang);
  const monthNames = lang === 'ru' ? MONTHLY_TREND.monthsRu : MONTHLY_TREND.monthsEn;
  const activeMonthYear = activeMonthIdx === 0 ? '2025' : '2026';

  root.innerHTML = `
    <div class="section-header-row">
      <div>
        <span class="section-kicker">${lang === 'ru' ? 'Рыночные исследования · Ноябрь 2026' : 'Market Intelligence · Nov 2026'}</span>
        <h1 class="section-title">${lang === 'ru' ? 'Аналитика рынка недвижимости Беларуси' : 'Belarus Real Estate Market Analytics'}</h1>
        <p class="section-subtitle">
          ${
            lang === 'ru'
              ? 'Средняя стоимость 1 м² по Минску и регионам, динамика цен за 12 месяцев, советы покупателям и обзоры сделок.'
              : 'Average price per sq.m across Minsk and regional capitals, 12-month price trends, buyer guides, and transaction briefings.'
          }
        </p>
      </div>
      <div class="tabs-row" role="tablist" aria-label="Property segment">
        ${Object.entries(segmentLabels)
          .map(
            ([key, lbl]) => `
          <button type="button" class="tab-btn ${activeSegment === key ? 'is-active' : ''}" data-segment="${key}">
            ${lbl}
          </button>
        `
          )
          .join('')}
      </div>
    </div>

    <!-- 4 KPI-карточки -->
    <div class="kpi-strip analytics-kpi-strip">
      <div class="kpi-strip__card">
        <strong>${minskFormatted.primary}</strong>
        <span>${lang === 'ru' ? 'Минск (средняя)' : 'Minsk average'} · <em style="color:var(--status-success);font-style:normal;">+6.1%</em></span>
      </div>
      <div class="kpi-strip__card">
        <strong>${regFormatted.primary}</strong>
        <span>${lang === 'ru' ? 'Областные центры' : 'Regional capitals'} · <em style="color:var(--status-success);font-style:normal;">+4.8%</em></span>
      </div>
      <div class="kpi-strip__card">
        <strong>${avgDays} ${lang === 'ru' ? 'дн.' : 'days'}</strong>
        <span>${lang === 'ru' ? 'Средний срок экспозиции' : 'Avg. time to sell'}</span>
      </div>
      <div class="kpi-strip__card">
        <strong>34%</strong>
        <span>${lang === 'ru' ? 'Сделки трейд-ин и рассрочка' : 'Trade-in & financed deals'}</span>
      </div>
    </div>

    <!-- Интерактивный столбчатый SVG-график + инспектор выбранного города -->
    <div class="analytics-main-grid">
      <section class="chart-card" aria-label="Regional price comparison">
        <div class="chart-card__header">
          <div>
            <h2 class="chart-card__title">${lang === 'ru' ? 'Средняя цена 1 м² по городам и регионам' : 'Average Price per m² by City & Region'}</h2>
            <p class="chart-card__sub">
              ${
                lang === 'ru'
                  ? 'Нажмите на любой столбец графика, чтобы изучить регион и перейти к объектам'
                  : 'Click any bar to inspect regional metrics and browse matching listings'
              }
            </p>
          </div>
          <span class="analytics-unit-note">${segmentLabels[activeSegment]}</span>
        </div>
        <div class="chart-svg-wrap" id="bar-chart-wrap">
          ${renderBarChartSvg(MARKET_REGIONS, activeSegment, selectedRegion.id, currency, lang)}
        </div>
      </section>

      <aside class="chart-inspector">
        <span class="section-kicker">${lang === 'ru' ? 'Выбранный рынок' : 'Selected Market'}</span>
        <h3 class="chart-inspector__city">${lang === 'ru' ? selectedRegion.nameRu : selectedRegion.nameEn}</h3>
        <div class="chart-inspector__price">${selFormatted.primary}</div>
        <div class="chart-inspector__subprice">${selFormatted.secondary}</div>

        <div class="chart-inspector__metrics">
          <div>
            <span>${lang === 'ru' ? 'Изменение за год' : '12-Month Change'}</span>
            <strong style="color:var(--status-success);">+${selectedRegion.yoyPct}%</strong>
          </div>
          <div>
            <span>${lang === 'ru' ? 'Срок продажи' : 'Avg. Exposure'}</span>
            <strong>${selectedRegion.days} ${lang === 'ru' ? 'дн.' : 'days'}</strong>
          </div>
          <div>
            <span>${lang === 'ru' ? `Ориентир (${typicalSqm} м²)` : `Est. (${typicalSqm} m²)`}</span>
            <strong>${typicalBudget}</strong>
          </div>
        </div>

        <p class="chart-inspector__note">${lang === 'ru' ? selectedRegion.noteRu : selectedRegion.noteEn}</p>

        <a href="./catalog.html${selectedRegion.catalogQuery}" class="btn btn--primary btn--full">
          ${lang === 'ru' ? 'Смотреть объекты в регионе →' : 'View Regional Listings →'}
        </a>
      </aside>
    </div>

    <!-- Интерактивный линейный SVG-график за 12 месяцев -->
    <section class="chart-card" style="margin-top:24px;" aria-label="12-month price trend">
      <div class="chart-card__header">
        <div>
          <h2 class="chart-card__title">${lang === 'ru' ? 'Динамика стоимости м² за 12 месяцев' : '12-Month Price Trend per m²'}</h2>
          <p class="chart-card__sub">
            ${monthNames[activeMonthIdx]} ${activeMonthYear} · <strong>${curMonthFormatted.primary}</strong> (${curMonthFormatted.secondary}) ·
            <span style="color:var(--status-success);font-weight:700;">${Number(momDelta) >= 0 ? '+' : ''}${momDelta}% ${lang === 'ru' ? 'за месяц' : 'MoM'}</span>
          </p>
        </div>
        <div class="tabs-row">
          ${Object.entries(MONTHLY_TREND.series)
            .map(
              ([k, sObj]) => `
            <button type="button" class="tab-btn ${activeTrendSeries === k ? 'is-active' : ''}" data-trend-series="${k}">
              ${lang === 'ru' ? sObj.labelRu : sObj.labelEn}
            </button>
          `
            )
            .join('')}
        </div>
      </div>
      <div class="chart-svg-wrap" id="trend-chart-wrap">
        ${renderTrendChartSvg(activeTrendSeries, activeMonthIdx, currency, lang)}
      </div>
    </section>

    <!-- Таблица сравнения регионов -->
    <section style="margin-top:44px;">
      <div class="section-header-row">
        <div>
          <span class="section-kicker">${lang === 'ru' ? 'Сводная матрица цен' : 'Regional Price Matrix'}</span>
          <h2 class="section-title" style="font-size:1.75rem;">${lang === 'ru' ? 'Сравнение стоимости по регионам Беларуси' : 'Belarus Regional Comparison Table'}</h2>
        </div>
      </div>
      <div class="compare-table-wrap">
        <table class="compare-table analytics-table">
          <thead>
            <tr>
              <th>${lang === 'ru' ? 'Город / регион' : 'City / Region'}</th>
              <th>${lang === 'ru' ? 'Квартиры (м²)' : 'Apartments'}</th>
              <th>${lang === 'ru' ? 'Дома (м²)' : 'Houses'}</th>
              <th>${lang === 'ru' ? 'Коммерция (м²)' : 'Commercial'}</th>
              <th>${lang === 'ru' ? 'Рост г/г' : 'YoY'}</th>
              <th>${lang === 'ru' ? 'Экспозиция' : 'Days on Market'}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${MARKET_REGIONS.map((r) => {
              const aptF = formatSqmPrice(r.aptUsd, currency, lang);
              const houseF = formatSqmPrice(r.houseUsd, currency, lang);
              const commF = formatSqmPrice(r.commUsd, currency, lang);
              return `
                <tr class="${r.id === selectedRegion.id ? 'is-selected' : ''}" data-row-region="${r.id}">
                  <th style="width:auto;color:var(--text-primary);">${lang === 'ru' ? r.nameRu : r.nameEn}</th>
                  <td>${aptF.primary}</td>
                  <td>${houseF.primary}</td>
                  <td>${commF.primary}</td>
                  <td style="color:var(--status-success);font-weight:700;">+${r.yoyPct}%</td>
                  <td>${r.days} ${lang === 'ru' ? 'дн.' : 'd.'}</td>
                  <td style="text-align:right;">
                    <a href="./catalog.html${r.catalogQuery}" class="btn btn--secondary btn--sm">${lang === 'ru' ? 'Объекты →' : 'Listings →'}</a>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </section>

    <!-- Советы покупателю и продавцу -->
    <section style="margin-top:48px;">
      <span class="section-kicker">${lang === 'ru' ? 'Экспертиза Alora Homes' : 'Alora Homes Advisory'}</span>
      <h2 class="section-title" style="font-size:1.75rem;">${lang === 'ru' ? 'Практические советы покупателю и продавцу' : 'Buyer & Seller Advisory Checklist'}</h2>
      <div class="advice-grid">
        ${ADVICE_CARDS.map(
          (card) => `
          <article class="benefit-card">
            <div class="benefit-card__icon">${getIconSvg(card.icon, 22)}</div>
            <h3 class="benefit-card__title">${lang === 'ru' ? card.titleRu : card.titleEn}</h3>
            <p class="benefit-card__desc">${lang === 'ru' ? card.bodyRu : card.bodyEn}</p>
          </article>
        `
        ).join('')}
      </div>
    </section>

    <!-- Новости рынка -->
    <section style="margin-top:48px;">
      <span class="section-kicker">${lang === 'ru' ? 'Дайджест рынка' : 'Market Briefing'}</span>
      <h2 class="section-title" style="font-size:1.75rem;">${lang === 'ru' ? 'Новости и тренды недвижимости' : 'Market News & Trends'}</h2>
      <div class="news-grid">
        ${MARKET_NEWS.map(
          (item) => `
          <article class="news-card">
            <div class="news-card__meta">
              <span>${lang === 'ru' ? item.dateRu : item.dateEn}</span>
              <span aria-hidden="true">·</span>
              <span>${lang === 'ru' ? item.tagRu : item.tagEn}</span>
            </div>
            <h3 class="news-card__title">${lang === 'ru' ? item.titleRu : item.titleEn}</h3>
            <p class="news-card__summary">${lang === 'ru' ? item.summaryRu : item.summaryEn}</p>
          </article>
        `
        ).join('')}
      </div>
    </section>
  `;

  root.querySelectorAll('[data-segment]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeSegment = btn.getAttribute('data-segment') || 'apt';
      renderAnalyticsPage();
    });
  });

  root.querySelectorAll('[data-bar-region]').forEach((bar) => {
    bar.addEventListener('click', () => {
      selectedRegionId = bar.getAttribute('data-bar-region') || 'minsk-center';
      renderAnalyticsPage();
    });
    bar.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectedRegionId = bar.getAttribute('data-bar-region') || 'minsk-center';
        renderAnalyticsPage();
      }
    });
  });

  root.querySelectorAll('[data-trend-series]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeTrendSeries = btn.getAttribute('data-trend-series') || 'minsk';
      renderAnalyticsPage();
    });
  });

  root.querySelectorAll('[data-month-idx]').forEach((node) => {
    node.addEventListener('click', () => {
      activeMonthIdx = Number(node.getAttribute('data-month-idx')) || 11;
      renderAnalyticsPage();
    });
    node.addEventListener('mouseenter', () => {
      const nextIdx = Number(node.getAttribute('data-month-idx'));
      if (!Number.isNaN(nextIdx) && nextIdx !== activeMonthIdx) {
        activeMonthIdx = nextIdx;
        renderAnalyticsPage();
      }
    });
  });

  root.querySelectorAll('[data-row-region]').forEach((row) => {
    row.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      selectedRegionId = row.getAttribute('data-row-region') || 'minsk-center';
      renderAnalyticsPage();
    });
  });
}

renderAnalyticsPage();
subscribe(() => renderAnalyticsPage());
