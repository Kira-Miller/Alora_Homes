// ==========================================================================
// Модуль загрузки и разбора XML-базы объектов недвижимости (DOMParser + Full Data Fallback)
// ==========================================================================

import {PROPERTIES_DATA} from './properties-data.js';
import {getState} from './state.js';

let cachedCatalog = null;

export function mergeWithUserListings(baseList = PROPERTIES_DATA) {
  const custom = getState()?.userListings || [];
  return [...custom, ...baseList];
}

export const FALLBACK_PROPERTIES = PROPERTIES_DATA;

/**
 * Загружает XML-документ /data/properties.xml и преобразует узлы в объекты JS (с гарантированным Fallback на PROPERTIES_DATA)
 */
export async function loadPropertiesFromXml() {
  if (cachedCatalog) {
    return mergeWithUserListings(cachedCatalog);
  }

  const candidateUrls = ['./data/properties.xml', '/data/properties.xml', 'data/properties.xml'];
  let xmlText = null;

  for (const url of candidateUrls) {
    try {
      const response = await fetch(url, {cache: 'no-cache'});
      if (response.ok) {
        xmlText = await response.text();
        if (xmlText && xmlText.includes('<catalog')) {
          break;
        }
      }
    } catch {
      // Continue to next candidate URL
    }
  }

  if (xmlText) {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
      const parseError = xmlDoc.querySelector('parsererror');

      if (!parseError) {
        const propertyNodes = Array.from(xmlDoc.getElementsByTagName('property')).filter(
          (n) => n.parentNode && n.parentNode.tagName === 'catalog'
        );

        const getChild = (parent, tagName) => {
          if (!parent) return null;
          const target = tagName.toLowerCase();
          return Array.from(parent.children || []).find(
            (el) => (el.tagName || '').toLowerCase() === target
          ) || null;
        };

        const getByPath = (root, path) => {
          const parts = path.split('>').map((p) => p.trim());
          let cur = root;
          for (const part of parts) {
            cur = getChild(cur, part);
            if (!cur) return null;
          }
          return cur;
        };

        if (propertyNodes.length >= 20) {
          cachedCatalog = propertyNodes.map((node) => {
            const propId = node.getAttribute('id') || '';
            const fallbackProp = PROPERTIES_DATA.find((item) => String(item.id) === String(propId));
            const getText = (path) => getByPath(node, path)?.textContent?.trim() || '';
            const getAttr = (path, attr) => getByPath(node, path)?.getAttribute(attr) || '';

            const featuresParent = getChild(node, 'features');
            const features = Array.from(featuresParent?.children || []).map((f) => ({
              ru: f.getAttribute('ru') || '',
              en: f.getAttribute('en') || '',
            }));

            const parsedX = Number(getAttr('mapCoords', 'x'));
            const parsedY = Number(getAttr('mapCoords', 'y'));
            const mapX = Number.isFinite(parsedX) && parsedX > 0 ? parsedX : fallbackProp?.mapCoords?.x || 258;
            const mapY = Number.isFinite(parsedY) && parsedY > 0 ? parsedY : fallbackProp?.mapCoords?.y || 184;

            return {
              id: propId,
              featured: node.getAttribute('featured') === 'true',
              dealGroup: node.getAttribute('dealGroup') || 'residential',
              dealType: node.getAttribute('dealType') || 'sale',
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
              visualTheme: getText('visualTheme') || fallbackProp?.visualTheme || 'villa-pine',
              image: getText('image') || fallbackProp?.image || '',
              interiorImage: getText('interiorImage') || fallbackProp?.interiorImage || '',
              terraceImage: getText('terraceImage') || fallbackProp?.terraceImage || '',
              mapCoords: {
                x: mapX,
                y: mapY,
              },
              description: {
                ru: getAttr('description', 'ru'),
                en: getAttr('description', 'en'),
              },
              features,
            };
          });
          return mergeWithUserListings(cachedCatalog);
        }
      }
    } catch {
      // Fall through to PROPERTIES_DATA
    }
  }

  cachedCatalog = PROPERTIES_DATA;
  return mergeWithUserListings(cachedCatalog);
}

/**
 * Фильтрует массив объектов недвижимости по параметрам формы поиска
 */
export function filterProperties(properties, filters = {}) {
  return properties.filter((item) => {
    if (filters.dealType && filters.dealType !== 'all' && (item.dealType || 'sale') !== filters.dealType) {
      return false;
    }

    if (filters.dealGroup && filters.dealGroup !== 'all' && item.dealGroup !== filters.dealGroup) {
      return false;
    }

    if (filters.newbuildOnly && !item.specs.newbuild) {
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
