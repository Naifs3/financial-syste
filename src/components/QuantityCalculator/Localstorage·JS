// ╔═══════════════════════════════════════════════════════════════════════════════════╗
// ║                           التخزين المحلي - LocalStorage                           ║
// ╚═══════════════════════════════════════════════════════════════════════════════════╝

import { STORAGE_KEYS } from './ColorsAndConstants';
import { defaultItemTypes, defaultPlaces, defaultWorkItems, defaultProgramming } from './States';

// ═══════════════════════════════════════════════════════════════════════════════════
// دوال الحفظ
// ═══════════════════════════════════════════════════════════════════════════════════
export const saveItemTypes = (data) => {
  try { localStorage.setItem(STORAGE_KEYS.ITEM_TYPES, JSON.stringify(data)); return true; }
  catch (e) { console.error('خطأ في حفظ أنواع المساحات:', e); return false; }
};

export const savePlaces = (data) => {
  try { localStorage.setItem(STORAGE_KEYS.PLACES, JSON.stringify(data)); return true; }
  catch (e) { console.error('خطأ في حفظ الأماكن:', e); return false; }
};

export const saveWorkItems = (data) => {
  try { localStorage.setItem(STORAGE_KEYS.WORK_ITEMS, JSON.stringify(data)); return true; }
  catch (e) { console.error('خطأ في حفظ بنود العمل:', e); return false; }
};

export const saveProgramming = (data) => {
  try { localStorage.setItem(STORAGE_KEYS.PROGRAMMING, JSON.stringify(data)); return true; }
  catch (e) { console.error('خطأ في حفظ البرمجة:', e); return false; }
};

export const saveCategories = (data) => {
  try { localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(data)); return true; }
  catch (e) { console.error('خطأ في حفظ الفئات:', e); return false; }
};

export const saveAllData = (data) => {
  try {
    if (data.itemTypes) saveItemTypes(data.itemTypes);
    if (data.places) savePlaces(data.places);
    if (data.workItems) saveWorkItems(data.workItems);
    if (data.programming) saveProgramming(data.programming);
    if (data.categories) saveCategories(data.categories);
    return true;
  } catch (e) { console.error('خطأ في حفظ البيانات:', e); return false; }
};

// ═══════════════════════════════════════════════════════════════════════════════════
// دوال التحميل
// ═══════════════════════════════════════════════════════════════════════════════════
export const loadItemTypes = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ITEM_TYPES);
    return data ? JSON.parse(data) : defaultItemTypes;
  } catch (e) { console.error('خطأ في تحميل أنواع المساحات:', e); return defaultItemTypes; }
};

export const loadPlaces = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PLACES);
    return data ? JSON.parse(data) : defaultPlaces;
  } catch (e) { console.error('خطأ في تحميل الأماكن:', e); return defaultPlaces; }
};

export const loadWorkItems = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WORK_ITEMS);
    return data ? JSON.parse(data) : defaultWorkItems;
  } catch (e) { console.error('خطأ في تحميل بنود العمل:', e); return defaultWorkItems; }
};

export const loadProgramming = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRAMMING);
    return data ? JSON.parse(data) : defaultProgramming;
  } catch (e) { console.error('خطأ في تحميل البرمجة:', e); return defaultProgramming; }
};

export const loadCategories = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
  } catch (e) { console.error('خطأ في تحميل الفئات:', e); return []; }
};

export const loadAllData = () => {
  return {
    itemTypes: loadItemTypes(),
    places: loadPlaces(),
    workItems: loadWorkItems(),
    programming: loadProgramming(),
    categories: loadCategories()
  };
};

// ═══════════════════════════════════════════════════════════════════════════════════
// دوال المسح
// ═══════════════════════════════════════════════════════════════════════════════════
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    return true;
  } catch (e) { console.error('خطأ في مسح البيانات:', e); return false; }
};

export const resetToDefaults = () => {
  clearAllData();
  saveAllData({
    itemTypes: defaultItemTypes,
    places: defaultPlaces,
    workItems: defaultWorkItems,
    programming: defaultProgramming,
    categories: []
  });
};
