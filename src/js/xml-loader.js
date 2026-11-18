// ==========================================================================
// Модуль загрузки и разбора XML-базы объектов недвижимости (DOMParser)
// ==========================================================================

let cachedCatalog = null;

/**
 * Загружает XML-документ /data/properties.xml и преобразует узлы в объекты JS
 */
export async function loadPropertiesFromXml() {
  if (cachedCatalog) {
    return cachedCatalog;
  }

  const response = await fetch('./data/properties.xml', {cache: 'no-cache'});
  if (!response.ok) {
    throw new Error(`XML load failed: ${response.status}`);
  }

  const xmlText = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

  const parseError = xmlDoc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Ошибка синтаксического анализа XML');
  }

  const propertyNodes = Array.from(xmlDoc.querySelectorAll('catalog > property'));

  cachedCatalog = propertyNodes.map((node) => {
    const getText = (selector) => node.querySelector(selector)?.textContent?.trim() || '';
    const getAttr = (selector, attr) => node.querySelector(selector)?.getAttribute(attr) || '';

    const features = Array.from(node.querySelectorAll('features > feature')).map((f) => ({
      ru: f.getAttribute('ru') || '',
      en: f.getAttribute('en') || '',
    }));

    return {
      id: node.getAttribute('id') || '',
      featured: node.getAttribute('featured') === 'true',
      dealGroup: node.getAttribute('dealGroup') || 'residential',
      category: getText('category'),
      subcategory: {
        ru: getAttr('subcategory', 'ru'),
        en: getAttr('subcategory', 'en'),
      },
      region: getText('region'),
      city: {
        ru: getAttr('city', 'ru'),
        en: getAttr('city', 'en'),
      },
      title: {
        ru: getAttr('title', 'ru'),
        en: getAttr('title', 'en'),
      },
      badge: {
        type: getAttr('badge', 'type') || 'top',
        ru: getAttr('badge', 'ru'),
        en: getAttr('badge', 'en'),
      },
      priceByn: Number(getAttr('price', 'byn')) || 0,
      priceUsd: Number(getAttr('price', 'usd')) || 0,
      specs: {
        area: Number(getText('specs > area')) || 0,
        livingArea: Number(getText('specs > livingArea')) || 0,
        plotArea: Number(getText('specs > plotArea')) || 0,
        rooms: Number(getText('specs > rooms')) || 0,
        floors: Number(getText('specs > floors')) || 1,
        floor: Number(getText('specs > floor')) || 1,
        mkadDistance: Number(getText('specs > mkadDistance')) || 0,
        year: Number(getText('specs > year')) || 2024,
        newbuild: getText('specs > newbuild') === 'true',
      },
      visualTheme: getText('visualTheme') || 'villa-pine',
      image: getText('image'),
      interiorImage: getText('interiorImage'),
      terraceImage: getText('terraceImage'),
      mapCoords: {
        x: Number(getAttr('mapCoords', 'x')) || 270,
        y: Number(getAttr('mapCoords', 'y')) || 190,
      },
      description: {
        ru: getAttr('description', 'ru'),
        en: getAttr('description', 'en'),
      },
      features,
    };
  });

  return cachedCatalog;
}

/**
 * Фильтрует массив объектов недвижимости по параметрам формы поиска
 */
export function filterProperties(properties, filters = {}) {
  return properties.filter((item) => {
    if (filters.dealGroup && filters.dealGroup !== 'all' && item.dealGroup !== filters.dealGroup) {
      return false;
    }

    if (filters.category && filters.category !== 'all') {
      if (filters.category === 'newbuild') {
        if (!item.specs.newbuild) return false;
      } else if (item.category !== filters.category) {
        return false;
      }
    }

    if (filters.region && filters.region !== 'all' && item.region !== filters.region) {
      return false;
    }

    if (filters.query) {
      const q = filters.query.toLowerCase().trim();
      const haystack = `${item.title.ru} ${item.title.en} ${item.city.ru} ${item.city.en} ${item.subcategory.ru}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    const curr = filters.priceCurrency || 'BYN';
    const priceVal = curr === 'USD' ? item.priceUsd : item.priceByn;
    if (filters.priceMin && priceVal < Number(filters.priceMin)) return false;
    if (filters.priceMax && priceVal > Number(filters.priceMax)) return false;

    if (filters.rooms && filters.rooms !== 'any') {
      const r = Number(filters.rooms);
      if (r >= 4 ? item.specs.rooms < 4 : item.specs.rooms !== r) return false;
    }

    if (filters.areaMin && item.specs.area < Number(filters.areaMin)) return false;
    if (filters.areaMax && item.specs.area > Number(filters.areaMax)) return false;

    if (filters.livingMin && item.specs.livingArea < Number(filters.livingMin)) return false;
    if (filters.livingMax && item.specs.livingArea > Number(filters.livingMax)) return false;

    if (filters.plotMin && item.specs.plotArea < Number(filters.plotMin)) return false;
    if (filters.plotMax && item.specs.plotArea > Number(filters.plotMax)) return false;

    if (filters.mkadMax && item.specs.mkadDistance > Number(filters.mkadMax)) return false;

    return true;
  });
}

/**
 * Сортирует объекты недвижимости
 */
export function sortProperties(properties, sortBy = 'default') {
  const list = [...properties];
  switch (sortBy) {
    case 'price-asc':
      return list.sort((a, b) => a.priceByn - b.priceByn);
    case 'price-desc':
      return list.sort((a, b) => b.priceByn - a.priceByn);
    case 'area-desc':
      return list.sort((a, b) => b.specs.area - a.specs.area);
    default:
      return list;
  }
}
