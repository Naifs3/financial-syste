// ═══════════════════════════════════════════════════════════════════════════════════
// QuantityCalculator.jsx - النسخة الكاملة مع Firebase
// ═══════════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

const QuantityCalculator = ({ darkMode, theme }) => {
  const t = theme;
  
  const colors = {
    bg: t?.bg?.primary || '#0f172a',
    card: t?.bg?.secondary || '#1e293b',
    border: t?.border?.primary || '#334155',
    text: t?.text?.primary || '#f1f5f9',
    muted: t?.text?.muted || '#94a3b8',
    primary: t?.button?.primary || '#3b82f6',
    success: t?.status?.success?.text || '#22c55e',
    warning: t?.status?.warning?.text || '#f59e0b',
    danger: t?.status?.danger?.text || '#ef4444',
    cyan: '#06b6d4',
    purple: '#a855f7',
  };

  const getColor = (index) => {
    const palette = [colors.primary, colors.purple, colors.warning, colors.cyan, colors.success, colors.danger];
    return palette[index % palette.length];
  };

  const workItems = {
    BL: { code: 'BL', name: 'البلاط', icon: '🏠', color: '#3b82f6', items: [
      { num: '01', name: 'بلاط سيراميك 60×60', price: 50 },
      { num: '02', name: 'بلاط بورسلان 120×120', price: 80 },
      { num: '03', name: 'إزالة بلاط قديم', price: 15 },
      { num: '04', name: 'صبة نظافة', price: 20 },
      { num: '05', name: 'تسوية أرضية', price: 25 }
    ]},
    DH: { code: 'DH', name: 'الدهان', icon: '🎨', color: '#8b5cf6', items: [
      { num: '01', name: 'دهان جدران', price: 25 },
      { num: '02', name: 'دهان سقف', price: 20 },
      { num: '03', name: 'معجون', price: 15 },
      { num: '04', name: 'دهان زيتي', price: 35 }
    ]},
    KH: { code: 'KH', name: 'الكهرباء', icon: '⚡', color: '#f59e0b', items: [
      { num: '01', name: 'نقطة إضاءة', price: 150 },
      { num: '02', name: 'نقطة بلك', price: 100 },
      { num: '03', name: 'نقطة تكييف', price: 200 }
    ]},
    SB: { code: 'SB', name: 'السباكة', icon: '🚿', color: '#06b6d4', items: [
      { num: '01', name: 'نقطة ماء', price: 200 },
      { num: '02', name: 'نقطة صرف', price: 180 },
      { num: '03', name: 'تمديد خط', price: 120 }
    ]},
    JB: { code: 'JB', name: 'الجبس', icon: '🏗️', color: '#10b981', items: [
      { num: '01', name: 'جبس بورد عادي', price: 45 },
      { num: '02', name: 'جبس بورد مقاوم', price: 55 },
      { num: '03', name: 'كرانيش', price: 30 }
    ]}
  };

  const defaultPlacesData = [
    'دورة مياه 1', 'دورة مياه 2', 'دورة مياه 3', 'دورة مياه 4', 'دورة مياه 5', 'دورة مياه 6', 'دورة مياه 7', 'دورة مياه 8',
    'مجلس 1', 'مجلس 2', 'مجلس 3', 'مجلس 4',
    'غرفة نوم 1', 'غرفة نوم 2', 'غرفة نوم 3', 'غرفة نوم 4', 'غرفة نوم 5', 'غرفة نوم 6', 'غرفة نوم 7', 'غرفة نوم 8',
    'مطبخ 1', 'مطبخ 2', 'مطبخ 3', 'صالة 1', 'صالة 2', 'صالة 3', 'صالة 4',
    'ممر 1', 'ممر 2', 'ممر 3', 'ممر 4', 'ممر 5', 'ممر 6', 'مدخل 1', 'مدخل 2', 'مكتب 1', 'مكتب 2',
    'غرفة طعام 1', 'غرفة طعام 2', 'غرفة غسيل 1', 'غرفة غسيل 2', 'بلكونة 1', 'بلكونة 2', 'سطح 1', 'سطح 2',
    'حوش 1', 'حوش 2', 'ملحق 1', 'ملحق 2', 'مستودع 1', 'مستودع 2', 'غرفة خادمة 1', 'غرفة خادمة 2',
    'غرفة سائق 1', 'غرفة سائق 2', 'مجلس نساء 1', 'مجلس نساء 2', 'غرفة ملابس 1', 'غرفة ملابس 2', 'مغسلة 1', 'مغسلة 2'
  ];

  const predefinedConditions = [
    'غير شامل الفك أو الإزالة', 'غير شامل نقل الركام', 'غير شامل المواد', 'غير شامل الحاوية',
    'غير شامل التنظيف', 'غير شامل التمديدات', 'السعر لا يشمل ضريبة القيمة المضافة',
    'المدة المتوقعة للتنفيذ 7 أيام', 'يتطلب معاينة قبل البدء', 'العميل مسؤول عن توفير المواد',
  ];

  const dimOptions = [1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,12,14,16,18,20,25,30];
  const heightOptions = [2,2.5,3,3.5,4,4.5,5,5.5,6];

  // States
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(true);
  const [currentQuoteId, setCurrentQuoteId] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [quotesLoading, setQuotesLoading] = useState(true);
  const [checkedPlaces, setCheckedPlaces] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAddNewInput, setShowAddNewInput] = useState(false);
  const [newPlaceInput, setNewPlaceInput] = useState('');
  const [categories, setCategories] = useState([]);
  const [phase1Expanded, setPhase1Expanded] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [activeTab, setActiveTab] = useState({});
  const [dimensions, setDimensions] = useState({ length: 4, width: 4, height: 3 });
  const [activeMainItems, setActiveMainItems] = useState({});
  const [addingCategoryCondition, setAddingCategoryCondition] = useState(null);
  const [newCategoryConditionText, setNewCategoryConditionText] = useState('');
  const [addingItemCondition, setAddingItemCondition] = useState(null);
  const [newItemConditionText, setNewItemConditionText] = useState('');
  const [editingSummary, setEditingSummary] = useState(null);
  const [customSummary, setCustomSummary] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Firebase: Places
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'calculator_places'), orderBy('createdAt', 'asc')),
      (snapshot) => {
        const places = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
        setAvailablePlaces(places);
        setPlacesLoading(false);
        if (places.length === 0) seedDefaultPlaces();
      },
      (error) => { console.error('Error loading places:', error); setPlacesLoading(false); }
    );
    return () => unsubscribe();
  }, []);

  const seedDefaultPlaces = async () => {
    try {
      for (const name of defaultPlacesData) {
        await addDoc(collection(db, 'calculator_places'), { name, createdAt: serverTimestamp() });
      }
    } catch (e) { console.error('Error seeding places:', e); }
  };

  const addNewPlaceToList = async (name) => {
    if (!name.trim() || availablePlaces.some(p => p.name === name.trim())) return;
    try {
      await addDoc(collection(db, 'calculator_places'), { name: name.trim(), createdAt: serverTimestamp() });
      setNewPlaceInput(''); setShowAddNewInput(false);
      setCheckedPlaces(prev => [...prev, name.trim()]);
      showToastMessage('تمت إضافة المكان بنجاح');
    } catch (e) { console.error('Error adding place:', e); }
  };

  const deletePlaceFromList = async (placeId, placeName) => {
    if (!window.confirm(`هل تريد حذف "${placeName}" نهائياً من القائمة؟`)) return;
    try {
      await deleteDoc(doc(db, 'calculator_places', placeId));
      setCheckedPlaces(prev => prev.filter(p => p !== placeName));
      showToastMessage('تم حذف المكان');
    } catch (e) { console.error('Error deleting place:', e); }
  };

  // Firebase: Quotes
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'calculator_quotes'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const quotesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuotes(quotesData); setQuotesLoading(false);
      },
      (error) => { console.error('Error loading quotes:', error); setQuotesLoading(false); }
    );
    return () => unsubscribe();
  }, []);

  const saveQuote = async () => {
    try {
      const quoteData = { categories, grandTotal: getGrandTotal(), updatedAt: serverTimestamp() };
      if (currentQuoteId) {
        await updateDoc(doc(db, 'calculator_quotes', currentQuoteId), quoteData);
        showToastMessage('تم حفظ التغييرات');
      } else {
        const docRef = await addDoc(collection(db, 'calculator_quotes'), { ...quoteData, title: 'عرض سعر جديد', status: 'draft', createdAt: serverTimestamp() });
        setCurrentQuoteId(docRef.id);
        showToastMessage('تم إنشاء عرض سعر جديد');
      }
    } catch (e) { console.error('Error saving quote:', e); showToastMessage('حدث خطأ أثناء الحفظ'); }
  };

  const autoSaveQuote = useCallback(async () => {
    if (!currentQuoteId || categories.length === 0) return;
    try {
      await updateDoc(doc(db, 'calculator_quotes', currentQuoteId), { categories, grandTotal: getGrandTotal(), updatedAt: serverTimestamp() });
    } catch (e) { console.error('Auto-save error:', e); }
  }, [currentQuoteId, categories]);

  useEffect(() => {
    const timer = setTimeout(() => { if (currentQuoteId && categories.length > 0) autoSaveQuote(); }, 2000);
    return () => clearTimeout(timer);
  }, [categories, currentQuoteId, autoSaveQuote]);

  const loadQuote = (quote) => { setCategories(quote.categories || []); setCurrentQuoteId(quote.id); showToastMessage('تم تحميل العرض'); };
  const newQuote = () => { setCategories([]); setCurrentQuoteId(null); setCheckedPlaces([]); setActiveMainItems({}); showToastMessage('عرض سعر جديد'); };

  // Helper Functions
  const formatNumber = (n) => n?.toLocaleString('en-US') || '0';
  const showToastMessage = (message) => { setToastMessage(message); setShowToast(true); setTimeout(() => setShowToast(false), 2000); };
  const placeArea = dimensions.length * dimensions.width;
  const placesList = availablePlaces.map(p => p.name);

  const calcArea = (place) => {
    const type = place.measureType || 'floor';
    const l = place.length || 4, w = place.width || 4, h = place.height || 3;
    switch(type) {
      case 'floor': case 'ceiling': return l * w;
      case 'walls': return (l + w) * 2 * h;
      case 'linear': return l;
      case 'manual': return place.manualArea || place.area || 0;
      default: return l * w;
    }
  };

  const getItemArea = (item) => item.places?.reduce((sum, p) => sum + (p.area || 0), 0) || 0;
  const getCategoryTotalArea = (cat) => cat.items?.reduce((sum, item) => sum + getItemArea(item), 0) || 0;
  const getCategoryItemsTotal = (cat) => cat.items?.reduce((sum, item) => sum + getItemArea(item) * item.price, 0) || 0;

  const calculateCategoryTotals = (cat) => {
    const totalPrice = getCategoryItemsTotal(cat);
    const containerValue = cat.options?.containerState === 'with' ? (cat.options?.totalsContainerAmount || 0) : 0;
    const materialsValue = cat.options?.materialsState === 'with' ? (cat.options?.materialsAmount || 0) : 0;
    const baseTotal = totalPrice + containerValue + materialsValue + (cat.options?.customAmount || 0);
    const profitAmount = baseTotal * (cat.options?.profitPercent || 0) / 100;
    const withProfit = baseTotal + profitAmount;
    const discountByPercent = withProfit * (cat.options?.discountPercent || 0) / 100;
    const discountByAmount = cat.options?.discountAmount || 0;
    const afterDiscount = withProfit - discountByPercent - discountByAmount;
    const taxAmount = afterDiscount * (cat.options?.taxPercent || 0) / 100;
    const finalTotal = afterDiscount + taxAmount;
    return { totalPrice, containerValue, materialsValue, baseTotal, profitAmount, withProfit, discountByPercent, discountByAmount, afterDiscount, taxAmount, finalTotal };
  };

  const getGrandTotal = () => categories.reduce((sum, cat) => sum + calculateCategoryTotals(cat).finalTotal, 0);
  const hasCategories = categories.filter(cat => cat.items?.length > 0 || cat.pendingPlaces?.length > 0).length > 0;
  const toggleCheck = (placeName) => setCheckedPlaces(prev => prev.includes(placeName) ? prev.filter(p => p !== placeName) : [...prev, placeName]);

  // Add places to categories
  const addCheckedPlacesToCategories = () => {
    if (checkedPlaces.length === 0) return;
    const activeCatKeys = Object.keys(activeMainItems).filter(k => activeMainItems[k]);
    if (activeCatKeys.length === 0) { showToastMessage('الرجاء اختيار بند رئيسي أولاً'); return; }
    const newPlaces = checkedPlaces.map(name => ({ id: 'p' + Date.now() + Math.random().toString(36).substr(2, 5), name, length: dimensions.length, width: dimensions.width, height: dimensions.height, area: dimensions.length * dimensions.width, measureType: 'floor' }));
    setCategories(prev => {
      let updated = [...prev];
      let lastAddedCatId = null;
      
      activeCatKeys.forEach(catKey => {
        const catConfig = workItems[catKey];
        if (!catConfig) return;
        const existingCatIndex = updated.findIndex(c => c.code === catConfig.code);
        if (existingCatIndex !== -1) {
          const existingCat = updated[existingCatIndex];
          const placesToAdd = newPlaces.map(p => ({ ...p, id: 'p' + Date.now() + Math.random().toString(36).substr(2, 5) }));
          if (existingCat.items.length === 0) {
            updated[existingCatIndex] = { ...existingCat, pendingPlaces: [...(existingCat.pendingPlaces || []), ...placesToAdd], needsSubItemSelection: true };
          } else {
            updated[existingCatIndex] = { ...existingCat, items: existingCat.items.map((item, idx) => idx === 0 ? { ...item, places: [...item.places, ...placesToAdd] } : item) };
          }
          lastAddedCatId = existingCat.id;
        } else {
          const newCatId = 'cat' + Date.now() + catKey;
          updated.push({
            id: newCatId, code: catConfig.code, name: catConfig.name, color: catConfig.color,
            subItems: catConfig.items.map(item => ({ code: `${catConfig.code}${item.num}`, name: item.name, price: item.price, group: catConfig.name })),
            items: [], pendingPlaces: newPlaces.map(p => ({ ...p, id: 'p' + Date.now() + Math.random().toString(36).substr(2, 5) })), needsSubItemSelection: true, categoryConditions: [], customSummary: '',
            options: { containerState: 'notMentioned', containerAmount: 0, totalsContainerAmount: 0, materialsState: 'notMentioned', materialsAmount: 0, showMeters: true, sumMeters: true, showPrice: false, showPlaces: false, customAmount: 0, profitPercent: 0, discountPercent: 0, discountAmount: 0, taxPercent: 15 }
          });
          lastAddedCatId = newCatId;
        }
      });
      
      // فتح آخر فئة تمت إضافتها
      if (lastAddedCatId) {
        setTimeout(() => setExpandedCategory(lastAddedCatId), 100);
      }
      
      return updated;
    });
    setCheckedPlaces([]); showToastMessage(`تمت إضافة ${newPlaces.length} مكان`);
  };

  const selectPendingSubItem = (catId, placeId, subItemCode) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      const subItem = cat.subItems?.find(s => s.code === subItemCode);
      const place = cat.pendingPlaces?.find(p => p.id === placeId);
      if (!subItem || !place) return cat;
      
      // التحقق من وجود بند بنفس الكود
      const existingItemIndex = cat.items.findIndex(item => item.code === subItem.code);
      
      let newItems;
      if (existingItemIndex !== -1) {
        // إذا البند موجود، أضف المكان له
        newItems = cat.items.map((item, idx) => {
          if (idx === existingItemIndex) {
            return { ...item, places: [...item.places, { ...place, id: 'p' + Date.now() + Math.random().toString(36).substr(2, 5) }] };
          }
          return item;
        });
      } else {
        // إذا البند غير موجود، أنشئ بند جديد
        const newItem = { 
          id: Date.now() + Math.random(), 
          code: subItem.code, 
          name: subItem.name, 
          price: subItem.price, 
          group: subItem.group, 
          places: [{ ...place, id: 'p' + Date.now() + Math.random().toString(36).substr(2, 5) }], 
          conditions: [] 
        };
        newItems = [...cat.items, newItem];
      }
      
      const newPendingPlaces = cat.pendingPlaces.filter(p => p.id !== placeId);
      return { ...cat, items: newItems, pendingPlaces: newPendingPlaces, needsSubItemSelection: newPendingPlaces.length > 0 };
    }));
  };

  const changeSubItem = (catId, itemId, newCode) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      const sub = cat.subItems?.find(s => s.code === newCode);
      if (!sub) return cat;
      return { ...cat, items: cat.items.map(item => item.id === itemId ? { ...item, code: sub.code, name: sub.name, price: sub.price, group: sub.group } : item) };
    }));
  };

  const updatePlace = (catId, itemId, placeId, field, value) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return { ...cat, items: cat.items.map(item => {
        if (item.id !== itemId) return item;
        return { ...item, places: item.places.map(place => {
          if (place.id !== placeId) return place;
          const updated = { ...place, [field]: field === 'name' || field === 'measureType' ? value : parseFloat(value) || 0 };
          if (field === 'manualArea') { updated.area = parseFloat(value) || 0; updated.manualArea = parseFloat(value) || 0; }
          else if (field === 'measureType') { if (value !== 'manual') delete updated.manualArea; updated.area = calcArea(updated); }
          else if (['length', 'width', 'height'].includes(field)) { updated.area = calcArea(updated); if (updated.measureType !== 'manual') delete updated.manualArea; }
          return updated;
        })};
      })};
    }));
  };

  const addPlace = (catId, itemId) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return { ...cat, items: cat.items.map(item => item.id !== itemId ? item : { ...item, places: [...item.places, { id: 'p' + Date.now(), name: placesList[0] || 'مكان', length: 4, width: 4, height: 3, area: 16, measureType: 'floor' }] }) };
    }));
  };

  const deletePlace = (catId, itemId, placeId) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return { ...cat, items: cat.items.map(item => item.id !== itemId ? item : { ...item, places: item.places.filter(p => p.id !== placeId) }) };
    }));
  };

  const addItem = (catId) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      const sub = cat.subItems?.[0] || { code: 'XX01', name: 'بند جديد', price: 0, group: 'عام' };
      return { ...cat, items: [...cat.items, { id: Date.now(), code: sub.code, name: sub.name, price: sub.price, group: sub.group, places: [{ id: 'p' + Date.now(), name: placesList[0] || 'مكان', length: 4, width: 4, height: 3, area: 16, measureType: 'floor' }], conditions: [] }] };
    }));
  };

  const deleteItem = (catId, itemId) => { setCategories(prev => prev.map(cat => cat.id !== catId ? cat : { ...cat, items: cat.items.filter(item => item.id !== itemId) })); setEditingItemId(null); };

  const duplicateItemWithNewSubItem = (catId, itemId) => {
    const newId = Date.now();
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      const originalItem = cat.items.find(item => item.id === itemId);
      if (!originalItem) return cat;
      const firstSub = cat.subItems?.[0] || originalItem;
      const newItem = { id: newId, code: firstSub.code, name: firstSub.name, price: firstSub.price, group: firstSub.group, places: originalItem.places.map(p => ({ ...p, id: 'p' + Date.now() + Math.random().toString(36).substr(2, 9) })), conditions: [] };
      return { ...cat, items: [...cat.items, newItem] };
    }));
    setEditingItemId(newId);
  };

  const addSubItemToPlace = (catId, placeId) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      const place = cat.pendingPlaces?.find(p => p.id === placeId);
      if (!place) return cat;
      const newPlace = { ...place, id: 'p' + Date.now() + Math.random().toString(36).substr(2, 9) };
      return { ...cat, pendingPlaces: [...(cat.pendingPlaces || []), newPlace] };
    }));
  };

  // Conditions
  const addCondition = (catId, itemId, conditionText) => {
    if (!conditionText.trim()) return;
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return { ...cat, items: cat.items.map(item => { if (item.id !== itemId || item.conditions?.includes(conditionText.trim())) return item; return { ...item, conditions: [...(item.conditions || []), conditionText.trim()] }; }) };
    }));
    setNewItemConditionText(''); setAddingItemCondition(null);
  };

  const deleteCondition = (catId, itemId, conditionIndex) => { setCategories(prev => prev.map(cat => { if (cat.id !== catId) return cat; return { ...cat, items: cat.items.map(item => item.id !== itemId ? item : { ...item, conditions: item.conditions.filter((_, idx) => idx !== conditionIndex) }) }; })); };
  const addCategoryCondition = (catId, conditionText) => { if (!conditionText.trim()) return; setCategories(prev => prev.map(cat => { if (cat.id !== catId || cat.categoryConditions?.includes(conditionText.trim())) return cat; return { ...cat, categoryConditions: [...(cat.categoryConditions || []), conditionText.trim()] }; })); setNewCategoryConditionText(''); setAddingCategoryCondition(null); };
  const deleteCategoryCondition = (catId, conditionIndex) => { setCategories(prev => prev.map(cat => cat.id !== catId ? cat : { ...cat, categoryConditions: cat.categoryConditions.filter((_, idx) => idx !== conditionIndex) })); };

  // Options
  const updateCategoryOptions = (catId, field, value) => { setCategories(prev => prev.map(cat => cat.id === catId ? { ...cat, options: { ...cat.options, [field]: value } } : cat)); };
  const saveCategorySummary = (catId, summaryText) => { setCategories(prev => prev.map(cat => cat.id === catId ? { ...cat, customSummary: summaryText } : cat)); };
  const generateDefaultSummary = (cat, catTotals) => {
    let summary = `تشمل الخدمة: ${cat.items?.map(i => { let itemText = cat.options?.showMeters ? `${i.name} (${getItemArea(i)} م²)` : i.name; if (cat.options?.showPlaces) itemText += ` [${i.places?.map(p => p.name).join('، ')}]`; if (i.conditions?.length > 0) itemText += ` (${i.conditions.join('، ')})`; return itemText; }).join('، ')}.`;
    if (cat.categoryConditions?.length > 0) summary += ` | ملاحظات: ${cat.categoryConditions.join('، ')}.`;
    if (cat.options?.containerState === 'with') summary += ` شامل الحاوية (${cat.options?.totalsContainerAmount || 0} ﷼).`;
    if (cat.options?.containerState === 'without') summary += ` غير شامل الحاوية.`;
    if (cat.options?.materialsState === 'with') summary += ` شامل المواد (${cat.options?.materialsAmount || 0} ﷼).`;
    if (cat.options?.materialsState === 'without') summary += ` غير شامل المواد.`;
    if (cat.options?.showPrice) summary += ` | الإجمالي: ${formatNumber(catTotals.finalTotal)} ر.س`;
    return summary;
  };

  // Icons
  const getIcon = (code, color, size = 28) => {
    const icons = {
      BL: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="8" height="8" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.2"/><rect x="13" y="3" width="8" height="8" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.2"/><rect x="3" y="13" width="8" height="8" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.2"/><rect x="13" y="13" width="8" height="8" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.2"/></svg>),
      DH: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="6" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.2"/><path d="M11 9h2v4h-2V9z" fill={color}/><rect x="8" y="13" width="8" height="9" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.2"/></svg>),
      SB: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M12 4c-4 4-5 7-5 9a5 5 0 0010 0c0-2-1-5-5-9z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.2"/><circle cx="12" cy="15" r="2" fill={color} fillOpacity="0.3"/></svg>),
      KH: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M13 3L5 12h5l-1 9 10-10h-5l1-8z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.2"/></svg>),
      JB: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="4" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.2"/><rect x="5" y="8" width="14" height="3" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.2"/><path d="M7 11v6M12 11v8M17 11v6" stroke={color} strokeWidth="1.2"/></svg>),
    };
    return icons[code] || (<div style={{ width: size, height: size, background: `${color}30`, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.5, color }}>{code}</div>);
  };

  const selectStyle = { appearance: 'none', paddingLeft: 28, paddingRight: 12, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'left 8px center', backgroundColor: 'transparent' };
  const btnHeight = '36px';

  if (placesLoading) return (<div style={{ maxWidth: 900, margin: '0 auto', padding: 16, direction: 'rtl', textAlign: 'center', paddingTop: 60 }}><div style={{ fontSize: 50, marginBottom: 16 }}>⏳</div><p style={{ color: colors.muted }}>جاري تحميل البيانات...</p></div>);

  // === RENDER ===
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 16, direction: 'rtl' }}>
      
      {/* Phase 1 - Input */}
      <div style={{ background: colors.card, borderRadius: 16, border: phase1Expanded ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`, overflow: 'hidden', marginBottom: 20 }}>
        <div onClick={() => setPhase1Expanded(!phase1Expanded)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 16, background: phase1Expanded ? `${colors.primary}10` : 'transparent' }}>
          <div style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.cyan})`, padding: '12px 16px', borderRadius: 10, marginLeft: 12 }}><span style={{ fontSize: 24 }}>📐</span></div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>نموذج إدخال سريع</div><div style={{ fontSize: 11, color: colors.muted }}>🏗️ {Object.values(activeMainItems).filter(v => v).length} بنود • 📍 {checkedPlaces.length} أماكن</div></div>
          <span style={{ fontSize: 16, color: colors.primary, transform: phase1Expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
        </div>
        {phase1Expanded && (
          <div style={{ padding: 16, borderTop: `1px dashed ${colors.primary}40` }}>
            {/* Step 1: Places */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 26, height: 26, borderRadius: 6, background: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>1</div>
                <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>اختر الأماكن</span>
                {checkedPlaces.length > 0 && <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700, background: colors.success, color: '#fff', marginRight: 'auto' }}>{checkedPlaces.length} مكان</span>}
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Multi-Select Dropdown */}
                <div style={{ flex: 2, minWidth: 200, position: 'relative' }}>
                  <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} style={{ width: '100%', height: btnHeight, padding: '0 30px 0 12px', borderRadius: isDropdownOpen ? '6px 6px 0 0' : '6px', border: `1px solid ${isDropdownOpen ? colors.primary : colors.border}`, background: colors.card, color: colors.text, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, position: 'relative', userSelect: 'none' }}>
                    {checkedPlaces.length === 0 ? <span style={{ color: colors.muted }}>اختر أماكن...</span> : checkedPlaces.length <= 2 ? <div style={{ display: 'flex', gap: 4, flexWrap: 'nowrap', overflow: 'hidden' }}>{checkedPlaces.map(p => <span key={p} style={{ background: colors.primary, color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 10, whiteSpace: 'nowrap' }}>{p}</span>)}</div> : <div style={{ display: 'flex', gap: 4 }}><span style={{ background: colors.primary, color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 10 }}>{checkedPlaces[0]}</span><span style={{ background: '#64748b', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: 10 }}>+{checkedPlaces.length - 1}</span></div>}
                    <span style={{ position: 'absolute', left: 12, color: colors.muted, fontSize: 10, transition: 'transform 0.2s', transform: isDropdownOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
                  </div>
                  <div style={{ display: isDropdownOpen ? 'block' : 'none', position: 'absolute', top: '100%', right: 0, left: 0, background: colors.card, border: `1px solid ${colors.primary}`, borderTop: 'none', borderRadius: '0 0 6px 6px', maxHeight: 280, overflowY: 'auto', zIndex: 100 }}>
                    <div style={{ padding: '10px 12px', borderBottom: `1px dashed ${colors.primary}`, background: `${colors.success}10` }}>
                      {!showAddNewInput ? <button onClick={(e) => { e.stopPropagation(); setShowAddNewInput(true); }} style={{ width: '100%', height: 32, borderRadius: 6, border: `1px dashed ${colors.success}`, background: 'transparent', color: colors.success, fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><span>➕</span> إضافة مكان جديد للقائمة</button> : <div style={{ display: 'flex', gap: 6, alignItems: 'center' }} onClick={e => e.stopPropagation()}><input type="text" value={newPlaceInput} onChange={e => setNewPlaceInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addNewPlaceToList(newPlaceInput); }} placeholder="اكتب اسم المكان..." autoFocus style={{ flex: 1, height: 32, padding: '0 10px', borderRadius: 6, border: `1px solid ${colors.success}`, background: colors.bg, color: colors.text, fontSize: 11 }} /><button onClick={() => addNewPlaceToList(newPlaceInput)} style={{ height: 32, padding: '0 12px', borderRadius: 6, border: 'none', background: colors.success, color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>إضافة</button><button onClick={() => { setShowAddNewInput(false); setNewPlaceInput(''); }} style={{ height: 32, padding: '0 10px', borderRadius: 6, border: `1px solid ${colors.danger}`, background: 'transparent', color: colors.danger, fontSize: 11, cursor: 'pointer' }}>✕</button></div>}
                    </div>
                    <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                      {availablePlaces.length === 0 ? <div style={{ padding: 20, textAlign: 'center', color: colors.muted, fontSize: 11 }}>لا توجد أماكن</div> : availablePlaces.map(place => {
                        const isChecked = checkedPlaces.includes(place.name);
                        return (<div key={place.id} onClick={(e) => { e.stopPropagation(); toggleCheck(place.name); }} style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', borderBottom: `1px solid ${colors.border}`, background: isChecked ? `${colors.primary}15` : 'transparent', transition: 'background 0.15s' }}><div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${isChecked ? colors.primary : colors.border}`, background: isChecked ? colors.primary : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', flexShrink: 0 }}>{isChecked && '✓'}</div><span style={{ flex: 1, fontSize: 12, color: isChecked ? colors.primary : colors.text, fontWeight: isChecked ? 600 : 400 }}>{place.name}</span><button onClick={(e) => { e.stopPropagation(); deletePlaceFromList(place.id, place.name); }} style={{ width: 22, height: 22, borderRadius: 4, border: `1px solid ${colors.danger}30`, background: `${colors.danger}10`, color: colors.danger, fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.6 }} title="حذف من القائمة">✕</button></div>);
                      })}
                    </div>
                  </div>
                </div>
                {/* Dimensions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: colors.bg, padding: '0 8px', borderRadius: 6, border: `1px solid ${colors.border}`, height: btnHeight }}><span style={{ fontSize: 10, color: colors.muted }}>ط:</span><select style={{ ...selectStyle, border: 'none', background: 'transparent', color: colors.text, fontSize: 12, fontWeight: 600, width: 40 }} value={dimensions.length} onChange={e => setDimensions({ ...dimensions, length: parseFloat(e.target.value) || 1 })}>{dimOptions.map(n => <option key={n} value={n}>{n}</option>)}</select></div>
                <span style={{ color: colors.muted, fontSize: 12 }}>×</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: colors.bg, padding: '0 8px', borderRadius: 6, border: `1px solid ${colors.border}`, height: btnHeight }}><span style={{ fontSize: 10, color: colors.muted }}>ع:</span><select style={{ ...selectStyle, border: 'none', background: 'transparent', color: colors.text, fontSize: 12, fontWeight: 600, width: 40 }} value={dimensions.width} onChange={e => setDimensions({ ...dimensions, width: parseFloat(e.target.value) || 1 })}>{dimOptions.map(n => <option key={n} value={n}>{n}</option>)}</select></div>
                <span style={{ color: colors.muted, fontSize: 12 }}>×</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: colors.bg, padding: '0 8px', borderRadius: 6, border: `1px solid ${colors.purple}`, height: btnHeight }}><span style={{ fontSize: 10, color: colors.purple }}>ر:</span><select style={{ ...selectStyle, border: 'none', background: 'transparent', color: colors.purple, fontSize: 12, fontWeight: 600, width: 40 }} value={dimensions.height} onChange={e => setDimensions({ ...dimensions, height: parseFloat(e.target.value) || 1 })}>{heightOptions.map(n => <option key={n} value={n}>{n}</option>)}</select></div>
                <span style={{ color: colors.muted, fontSize: 12 }}>=</span>
                <div style={{ background: `${colors.success}15`, padding: '0 10px', borderRadius: 6, height: btnHeight, display: 'flex', alignItems: 'center', border: `1px solid ${colors.success}30` }}><span style={{ fontSize: 13, fontWeight: 700, color: colors.success }}>{placeArea} م²</span></div>
              </div>
              {checkedPlaces.length > 0 && (
                <div style={{ background: `${colors.primary}10`, border: `1px solid ${colors.primary}30`, borderRadius: 6, padding: 12, marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: colors.primary, fontWeight: 600, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}><span>📍</span> الأماكن المحددة ({checkedPlaces.length})</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{checkedPlaces.map((p, idx) => <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 6, background: colors.primary, color: '#fff', fontSize: 11, fontWeight: 600 }}><span>{p}</span><span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 5px', borderRadius: 4, fontSize: 9 }}>{placeArea} م²</span><span style={{ cursor: 'pointer', fontWeight: 700, color: '#fca5a5' }} onClick={() => toggleCheck(p)}>✕</span></span>)}</div>
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px dashed ${colors.primary}30`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 11, color: colors.muted }}>إجمالي المساحة:</span><span style={{ fontSize: 15, fontWeight: 700, color: colors.success }}>{checkedPlaces.length * placeArea} م²</span></div>
                </div>
              )}
            </div>
            {/* Step 2: Work Items */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 26, height: 26, borderRadius: 6, background: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>2</div>
                <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>اختر بنود الأعمال</span>
                {Object.values(activeMainItems).filter(v => v).length > 0 && <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700, background: colors.success, color: '#fff', marginRight: 'auto' }}>{Object.values(activeMainItems).filter(v => v).length} بند</span>}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {Object.entries(workItems).map(([catKey, cat], idx) => {
                  const isActive = activeMainItems[catKey];
                  return <button key={catKey} onClick={() => setActiveMainItems(prev => ({ ...prev, [catKey]: !prev[catKey] }))} style={{ height: btnHeight, padding: '0 12px', borderRadius: 6, border: `1px solid ${isActive ? cat.color : colors.border}`, background: isActive ? `${cat.color}20` : 'transparent', color: isActive ? cat.color : colors.muted, fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}><span>{cat.icon}</span><span>{cat.name}</span>{isActive && <span style={{ color: cat.color }}>✓</span>}</button>;
                })}
              </div>
            </div>
            {/* Add Button */}
            <button onClick={addCheckedPlacesToCategories} disabled={checkedPlaces.length === 0 || !Object.values(activeMainItems).some(v => v)} style={{ width: '100%', height: 50, borderRadius: 8, border: 'none', background: (checkedPlaces.length > 0 && Object.values(activeMainItems).some(v => v)) ? `linear-gradient(135deg, ${colors.success}, #059669)` : colors.bg, color: (checkedPlaces.length > 0 && Object.values(activeMainItems).some(v => v)) ? '#fff' : colors.muted, fontSize: 14, fontWeight: 700, cursor: (checkedPlaces.length > 0 && Object.values(activeMainItems).some(v => v)) ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}><span style={{ fontSize: 20 }}>➕</span><span>إضافة الأماكن للبنود المحددة</span>{checkedPlaces.length > 0 && Object.values(activeMainItems).some(v => v) && <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: 4, fontSize: 11 }}>{checkedPlaces.length} مكان × {Object.values(activeMainItems).filter(v => v).length} بند</span>}</button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {!hasCategories && <div style={{ textAlign: 'center', padding: 40, color: colors.muted, fontSize: 14, background: colors.card, borderRadius: 16, border: `1px solid ${colors.border}`, marginBottom: 16 }}><div style={{ fontSize: 50, marginBottom: 16, opacity: 0.3 }}>📦</div><div style={{ fontWeight: 600, marginBottom: 8 }}>لا توجد فئات مضافة</div><p style={{ fontSize: 12 }}>استخدم نموذج الإدخال السريع أعلاه</p></div>}

      {/* Categories */}
      {categories.filter(cat => cat.items?.length > 0 || cat.pendingPlaces?.length > 0).map((cat) => {
        const isExpanded = expandedCategory === cat.id;
        const catTotals = calculateCategoryTotals(cat);
        const catTotalArea = getCategoryTotalArea(cat);
        const pendingPlaces = cat.pendingPlaces || [];
        const allPlaces = []; cat.items?.forEach(item => { item.places?.forEach(place => { allPlaces.push({ name: place.name, area: place.area }); }); });
        return (
          <div key={cat.id} style={{ background: colors.card, borderRadius: 16, overflow: 'hidden', marginBottom: 12, border: isExpanded ? `2px solid ${cat.color}` : `1px solid ${colors.border}` }}>
            {/* Category Header */}
            <div onClick={() => { setExpandedCategory(isExpanded ? null : cat.id); setEditingItemId(null); }} style={{ display: 'flex', alignItems: 'stretch', cursor: 'pointer', background: isExpanded ? `${cat.color}08` : 'transparent' }}>
              <div style={{ display: 'flex', alignItems: 'stretch', borderLeft: `1px solid ${colors.border}` }}><div style={{ width: 4, background: cat.color }} /><div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px 20px', gap: 6 }}>{getIcon(cat.code, cat.color, 30)}<span style={{ fontSize: 10, fontWeight: 700, color: cat.color }}>{cat.code}</span></div></div>
              <div style={{ flex: 1, padding: '16px 18px' }}><div style={{ fontSize: 17, fontWeight: 700, color: colors.text, marginBottom: 6 }}>{cat.name}</div>{pendingPlaces.length > 0 && <div style={{ background: `${colors.warning}15`, border: `1px solid ${colors.warning}40`, borderRadius: 6, padding: '6px 10px', marginBottom: 8, fontSize: 11, color: colors.warning }}><span>▲</span> تحتاج اختيار البنود ({pendingPlaces.length} معلق)</div>}<div style={{ display: 'flex', gap: 12, fontSize: 11, color: colors.muted, marginBottom: 8, flexWrap: 'wrap' }}><span>📦 {cat.items?.length || 0} بنود</span>{cat.options?.containerState === 'with' && <span style={{ color: colors.warning }}>🚛 حاوية</span>}{cat.options?.materialsState === 'with' && <span style={{ color: colors.success }}>🧱 مواد</span>}</div>{allPlaces.length > 0 && <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', fontSize: 10 }}>{allPlaces.slice(0, 5).map((place, idx) => <span key={idx} style={{ background: `${cat.color}15`, padding: '3px 8px', borderRadius: 4 }}>{place.name} ({place.area}م²)</span>)}{allPlaces.length > 5 && <span style={{ background: `${cat.color}15`, padding: '3px 8px', borderRadius: 4 }}>+{allPlaces.length - 5}</span>}<span style={{ background: `${colors.success}20`, padding: '3px 10px', borderRadius: 4, fontWeight: 700, color: colors.success }}>= {catTotalArea} م²</span></div>}</div>
              <div style={{ background: `${colors.success}12`, padding: '16px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${colors.border}` }}><div style={{ fontSize: 9, color: colors.muted }}>الإجمالي</div><div style={{ fontSize: 20, fontWeight: 700, color: colors.success }}>{formatNumber(catTotals.finalTotal)}</div></div>
              <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', background: colors.bg }}><span style={{ fontSize: 16, color: isExpanded ? cat.color : colors.muted, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span></div>
            </div>
            {/* Category Content */}
            {isExpanded && (
              <div style={{ background: `${cat.color}05`, borderTop: `1px dashed ${cat.color}40`, padding: 16 }}>
                {/* Pending Places */}
                {pendingPlaces.length > 0 && <div style={{ marginBottom: 16, background: `${colors.warning}10`, borderRadius: 12, padding: 14, border: `1px solid ${colors.warning}30` }}><div style={{ fontSize: 12, fontWeight: 700, color: colors.warning, marginBottom: 10 }}>⚠️ أماكن معلقة ({pendingPlaces.length})</div>{pendingPlaces.map(place => <div key={place.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, padding: 10, background: colors.card, borderRadius: 8 }}><span style={{ fontSize: 12, color: colors.text, fontWeight: 500, minWidth: 'fit-content' }}>{place.name} ({place.area} م²)</span><select defaultValue="" onChange={(e) => { if (e.target.value) selectPendingSubItem(cat.id, place.id, e.target.value); }} style={{ ...selectStyle, flex: 1, height: 30, borderRadius: 6, border: `1px solid ${cat.color}50`, backgroundColor: colors.bg, color: colors.text, fontSize: 12, fontWeight: 500 }}><option value="">-- اختر البند --</option>{(cat.subItems || []).map(s => <option key={s.code} value={s.code}>{s.name} ({s.price} ﷼)</option>)}</select><button onClick={() => addSubItemToPlace(cat.id, place.id)} style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid ${colors.success}`, background: `${colors.success}20`, color: colors.success, fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="إضافة بند فرعي إضافي">+</button></div>)}</div>}
                {/* Items */}
                <div style={{ marginBottom: 16 }}><div style={{ fontSize: 12, fontWeight: 500, color: colors.text, marginBottom: 10 }}>📦 البنود ({cat.items?.length || 0}) • {catTotalArea} م² • {formatNumber(catTotals.totalPrice)} ﷼</div>
                  {(cat.items || []).map((item) => {
                    const isEditing = editingItemId === item.id;
                    const itemArea = getItemArea(item);
                    return (
                      <div key={item.id} style={{ background: colors.card, borderRadius: 12, overflow: 'hidden', marginBottom: 8, border: isEditing ? `2px solid ${colors.primary}` : `1px solid ${colors.border}` }}>
                        <div onClick={() => setEditingItemId(isEditing ? null : item.id)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '12px 14px', background: isEditing ? `${colors.primary}10` : 'transparent' }}><div style={{ background: cat.color, padding: '8px 12px', borderRadius: 6, marginLeft: 12 }}><span style={{ fontSize: 11, fontWeight: 500, color: '#fff' }}>{item.code}</span></div><div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 500, color: colors.text, display: 'flex', alignItems: 'center', gap: 6 }}>{item.name}{isEditing && <span style={{ fontSize: 14, color: colors.primary }}>⚙️</span>}</div><div style={{ fontSize: 11, color: colors.muted, fontWeight: 500 }}>📍 {item.places?.map(p => p.name).join('، ')} | {itemArea} م² | {item.price} ﷼/م²</div></div><div style={{ fontSize: 16, fontWeight: 500, color: colors.success }}>{formatNumber(itemArea * item.price)} ﷼</div></div>
                        {isEditing && (
                          <div style={{ padding: 14, background: `${colors.primary}08`, borderTop: `1px dashed ${colors.primary}30` }}>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}><select value={item.code} onChange={(e) => changeSubItem(cat.id, item.id, e.target.value)} style={{ ...selectStyle, flex: 1, height: 30, borderRadius: 8, border: `1px solid ${colors.border}`, backgroundColor: colors.bg, color: colors.text, fontSize: 12, fontWeight: 500 }}>{(cat.subItems || []).map(s => <option key={s.code} value={s.code}>[{s.code}] {s.name}</option>)}</select><button onClick={() => duplicateItemWithNewSubItem(cat.id, item.id)} style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid ${colors.success}`, background: `${colors.success}20`, color: colors.success, fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="إضافة بند فرعي إضافي">+</button></div>
                            <div style={{ fontSize: 10, color: colors.muted, marginBottom: 6 }}>📍 الأماكن</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
                              {(item.places || []).map((place) => {
                                const measureType = place.measureType || 'floor';
                                return (<div key={place.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px', background: `${colors.primary}08`, borderRadius: 6, border: `1px solid ${colors.primary}20`, flexWrap: 'wrap' }}><select value={place.name} onChange={(e) => updatePlace(cat.id, item.id, place.id, 'name', e.target.value)} style={{ ...selectStyle, flex: 1, minWidth: 70, height: 30, borderRadius: 4, border: `1px solid ${colors.border}`, backgroundColor: colors.bg, color: colors.text, fontSize: 12, fontWeight: 500 }}>{placesList.map(p => <option key={p} value={p}>{p}</option>)}</select><select value={measureType} onChange={(e) => updatePlace(cat.id, item.id, place.id, 'measureType', e.target.value)} style={{ ...selectStyle, width: 70, height: 30, borderRadius: 4, border: `1px solid ${colors.cyan}`, backgroundColor: '#0c4a6e', color: '#7dd3fc', fontSize: 12, fontWeight: 500 }}><option value="floor">أرضي</option><option value="ceiling">سقف</option><option value="walls">جدران</option><option value="linear">طولي</option><option value="manual">يدوي</option></select>{measureType === 'manual' ? <input type="number" value={place.manualArea || place.area || ''} onChange={(e) => updatePlace(cat.id, item.id, place.id, 'manualArea', e.target.value)} onFocus={(e) => e.target.select()} placeholder="المساحة" style={{ width: 60, height: 30, padding: '0 4px', borderRadius: 4, border: `1px solid ${colors.success}`, background: colors.bg, color: colors.success, fontSize: 12, textAlign: 'center', fontWeight: 500 }} /> : measureType === 'linear' ? <select value={place.length} onChange={(e) => updatePlace(cat.id, item.id, place.id, 'length', e.target.value)} style={{ ...selectStyle, width: 55, height: 30, borderRadius: 4, border: `1px solid ${colors.border}`, backgroundColor: colors.bg, color: colors.text, fontSize: 12, textAlign: 'center', fontWeight: 500 }}>{[1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,12,14,16,18,20,25,30,40,50].map(n => <option key={n} value={n}>{n}</option>)}</select> : <><select value={place.length} onChange={(e) => updatePlace(cat.id, item.id, place.id, 'length', e.target.value)} style={{ ...selectStyle, width: 55, height: 30, borderRadius: 4, border: `1px solid ${colors.border}`, backgroundColor: colors.bg, color: colors.text, fontSize: 12, textAlign: 'center', fontWeight: 500 }}>{dimOptions.map(n => <option key={n} value={n}>{n}</option>)}</select><span style={{ color: colors.muted, fontSize: 12, fontWeight: 500 }}>×</span><select value={place.width} onChange={(e) => updatePlace(cat.id, item.id, place.id, 'width', e.target.value)} style={{ ...selectStyle, width: 55, height: 30, borderRadius: 4, border: `1px solid ${colors.border}`, backgroundColor: colors.bg, color: colors.text, fontSize: 12, textAlign: 'center', fontWeight: 500 }}>{dimOptions.map(n => <option key={n} value={n}>{n}</option>)}</select></>}{(measureType === 'walls' || measureType === 'floor' || measureType === 'ceiling') && <select value={place.height || 3} onChange={(e) => updatePlace(cat.id, item.id, place.id, 'height', e.target.value)} style={{ ...selectStyle, width: 55, height: 30, borderRadius: 4, border: `1px solid ${colors.purple}`, backgroundColor: colors.bg, color: colors.purple, fontSize: 12, textAlign: 'center', fontWeight: 500 }}>{heightOptions.map(n => <option key={n} value={n}>{n}</option>)}</select>}<span style={{ padding: '4px 8px', borderRadius: 4, background: `${colors.success}20`, color: colors.success, fontSize: 12, fontWeight: 500, minWidth: 55, textAlign: 'center' }}>{place.area} {measureType === 'linear' ? 'م.ط' : 'م²'}</span><button onClick={() => deletePlace(cat.id, item.id, place.id)} style={{ width: 26, height: 26, borderRadius: 4, border: `1px solid ${colors.danger}50`, background: `${colors.danger}10`, color: colors.danger, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button></div>);
                              })}
                            </div>
                            <button onClick={() => addPlace(cat.id, item.id)} style={{ width: '100%', height: 30, marginBottom: 12, borderRadius: 6, border: `1px solid ${colors.success}`, background: `${colors.success}15`, color: colors.success, fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>إضافة مكان</button>
                            <div style={{ fontSize: 10, color: colors.warning, marginBottom: 6 }}>📋 الشروط والملاحظات</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>{item.conditions?.map((c, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: `${colors.warning}10`, borderRadius: 6, border: `1px solid ${colors.warning}20` }}><span style={{ flex: 1, fontSize: 11, color: colors.text, fontWeight: 500 }}>{c}</span><button onClick={() => deleteCondition(cat.id, item.id, i)} style={{ width: 22, height: 22, borderRadius: 4, border: `1px solid ${colors.danger}50`, background: `${colors.danger}10`, color: colors.danger, cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button></div>)}</div>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}><select onChange={(e) => { if (e.target.value) { addCondition(cat.id, item.id, e.target.value); e.target.value = ''; } }} style={{ ...selectStyle, flex: 1, height: 30, borderRadius: 6, border: `1px solid ${colors.warning}`, backgroundColor: colors.bg, color: colors.text, fontSize: 12, textAlign: 'center', fontWeight: 500 }}><option value="">اختر شرط</option>{predefinedConditions.filter(c => !item.conditions?.includes(c)).map((c, i) => <option key={i} value={c}>{c}</option>)}</select><button onClick={() => setAddingItemCondition(addingItemCondition === item.id ? null : item.id)} style={{ height: 30, padding: '0 12px', borderRadius: 6, border: `1px solid ${colors.warning}`, background: `${colors.warning}15`, color: colors.warning, fontSize: 11, fontWeight: 500, cursor: 'pointer' }}>يدوي</button></div>
                            {addingItemCondition === item.id && <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}><input type="text" value={newItemConditionText} onChange={(e) => setNewItemConditionText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') addCondition(cat.id, item.id, newItemConditionText); }} placeholder="اكتب الشرط..." style={{ flex: 1, height: 30, padding: '0 12px', borderRadius: 6, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 12, fontWeight: 500 }} /><button onClick={() => addCondition(cat.id, item.id, newItemConditionText)} style={{ height: 30, padding: '0 12px', borderRadius: 6, background: colors.success, color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none' }}>إضافة</button></div>}
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}><button onClick={() => deleteItem(cat.id, item.id)} style={{ height: 30, padding: '0 12px', borderRadius: 6, border: `1px solid ${colors.danger}`, background: `${colors.danger}10`, color: colors.danger, fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>حذف</button><button onClick={() => setEditingItemId(null)} style={{ height: 30, padding: '0 12px', borderRadius: 6, border: `1px solid ${colors.success}`, background: `${colors.success}10`, color: colors.success, fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>تم</button></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
Condition(cat.id, newCategoryConditionText)} style={{ height: 30, padding: '0 12px', borderRadius: 6, background: colors.success, color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none' }}>إضافة</button></div>}</div>
                    </div>
                  )}
                  {/* Price Tab */}
                  {activeTab[cat.id] === 'price' && (
                    <div style={{ padding: 14 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', height: 38, padding: '0 8px', borderRadius: 6, background: 'rgba(100, 116, 139, 0.1)' }}><div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', height: 30, borderRadius: 6, background: 'rgba(71, 85, 105, 0.3)', border: '1px solid #475569', minWidth: 155 }}><span style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>الأسعار الأساسية</span></div><span style={{ flex: 1, textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>{formatNumber(catTotals.totalPrice)} ريال</span></div>
                        {cat.options?.containerState === 'with' && <div style={{ display: 'flex', alignItems: 'center', height: 38, padding: '0 8px', borderRadius: 6, background: 'rgba(245, 158, 11, 0.08)' }}><div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', height: 30, borderRadius: 6, background: 'rgba(245, 158, 11, 0.2)', border: `1px solid ${colors.warning}`, minWidth: 155 }}><span style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>🚛 الحاوية</span></div><span style={{ flex: 1, textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.warning }}>+{formatNumber(cat.options?.totalsContainerAmount || 0)} ريال</span></div>}
                        {cat.options?.materialsState === 'with' && <div style={{ display: 'flex', alignItems: 'center', height: 38, padding: '0 8px', borderRadius: 6, background: 'rgba(34, 197, 94, 0.08)' }}><div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', height: 30, borderRadius: 6, background: 'rgba(34, 197, 94, 0.2)', border: `1px solid ${colors.success}`, minWidth: 155 }}><span style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>🧱 المواد</span></div><span style={{ flex: 1, textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.success }}>+{formatNumber(cat.options?.materialsAmount || 0)} ريال</span></div>}
                        <div style={{ display: 'flex', alignItems: 'center', height: 38, padding: '0 8px', borderRadius: 6, background: 'rgba(34, 197, 94, 0.08)' }}><div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', height: 30, borderRadius: 6, background: 'rgba(34, 197, 94, 0.2)', border: `1px solid ${colors.success}`, minWidth: 155 }}><span style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>مبلغ إضافي</span><input type="number" value={cat.options?.customAmount || ''} onChange={(e) => updateCategoryOptions(cat.id, 'customAmount', parseFloat(e.target.value) || 0)} onFocus={(e) => e.target.select()} placeholder="0" style={{ width: 42, height: 22, borderRadius: 4, border: 'none', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 10, fontWeight: 600, textAlign: 'center', marginRight: 'auto' }} /><span style={{ fontSize: 9, opacity: 0.8, color: '#fff' }}>﷼</span></div><span style={{ flex: 1, textAlign: 'left', fontSize: 12, fontWeight: 600, color: (cat.options?.customAmount || 0) > 0 ? colors.success : '#64748b' }}>{(cat.options?.customAmount || 0) > 0 ? `+${formatNumber(cat.options?.customAmount)} ريال` : '—'}</span></div>
                        <div style={{ display: 'flex', alignItems: 'center', height: 38, padding: '0 8px', borderRadius: 6, background: 'rgba(34, 197, 94, 0.08)' }}><div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', height: 30, borderRadius: 6, background: 'rgba(34, 197, 94, 0.2)', border: `1px solid ${colors.success}`, minWidth: 155 }}><span style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>إضافة نسبة</span><input type="number" value={cat.options?.profitPercent || ''} onChange={(e) => updateCategoryOptions(cat.id, 'profitPercent', parseFloat(e.target.value) || 0)} onFocus={(e) => e.target.select()} placeholder="0" style={{ width: 42, height: 22, borderRadius: 4, border: 'none', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 10, fontWeight: 600, textAlign: 'center', marginRight: 'auto' }} /><span style={{ fontSize: 9, opacity: 0.8, color: '#fff' }}>%</span></div><span style={{ flex: 1, textAlign: 'left', fontSize: 12, fontWeight: 600, color: (cat.options?.profitPercent || 0) > 0 ? colors.success : '#64748b' }}>{(cat.options?.profitPercent || 0) > 0 ? `+${formatNumber(catTotals.profitAmount)} ريال` : '—'}</span></div>
                        <div style={{ display: 'flex', alignItems: 'center', height: 38, padding: '0 8px', borderRadius: 6, background: 'rgba(239, 68, 68, 0.08)' }}><div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', height: 30, borderRadius: 6, background: 'rgba(239, 68, 68, 0.2)', border: `1px solid ${colors.danger}`, minWidth: 155 }}><span style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>خصم مبلغ</span><input type="number" value={cat.options?.discountAmount || ''} onChange={(e) => updateCategoryOptions(cat.id, 'discountAmount', parseFloat(e.target.value) || 0)} onFocus={(e) => e.target.select()} placeholder="0" style={{ width: 42, height: 22, borderRadius: 4, border: 'none', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 10, fontWeight: 600, textAlign: 'center', marginRight: 'auto' }} /><span style={{ fontSize: 9, opacity: 0.8, color: '#fff' }}>﷼</span></div><span style={{ flex: 1, textAlign: 'left', fontSize: 12, fontWeight: 600, color: (cat.options?.discountAmount || 0) > 0 ? colors.danger : '#64748b' }}>{(cat.options?.discountAmount || 0) > 0 ? `-${formatNumber(cat.options?.discountAmount)} ريال` : '—'}</span></div>
                        <div style={{ display: 'flex', alignItems: 'center', height: 38, padding: '0 8px', borderRadius: 6, background: 'rgba(239, 68, 68, 0.08)' }}><div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', height: 30, borderRadius: 6, background: 'rgba(239, 68, 68, 0.2)', border: `1px solid ${colors.danger}`, minWidth: 155 }}><span style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>خصم نسبة</span><input type="number" value={cat.options?.discountPercent || ''} onChange={(e) => updateCategoryOptions(cat.id, 'discountPercent', parseFloat(e.target.value) || 0)} onFocus={(e) => e.target.select()} placeholder="0" style={{ width: 42, height: 22, borderRadius: 4, border: 'none', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 10, fontWeight: 600, textAlign: 'center', marginRight: 'auto' }} /><span style={{ fontSize: 9, opacity: 0.8, color: '#fff' }}>%</span></div><span style={{ flex: 1, textAlign: 'left', fontSize: 12, fontWeight: 600, color: (cat.options?.discountPercent || 0) > 0 ? colors.danger : '#64748b' }}>{(cat.options?.discountPercent || 0) > 0 ? `-${formatNumber(catTotals.discountByPercent)} ريال` : '—'}</span></div>
                        <div style={{ display: 'flex', alignItems: 'center', height: 38, padding: '0 8px', borderRadius: 6, background: 'rgba(59, 130, 246, 0.1)' }}><div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', height: 30, borderRadius: 6, background: 'rgba(59, 130, 246, 0.2)', border: `1px solid ${colors.primary}`, minWidth: 155 }}><span style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>الضريبة</span><input type="number" value={cat.options?.taxPercent || ''} onChange={(e) => updateCategoryOptions(cat.id, 'taxPercent', parseFloat(e.target.value) || 0)} onFocus={(e) => e.target.select()} placeholder="0" style={{ width: 42, height: 22, borderRadius: 4, border: 'none', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 10, fontWeight: 600, textAlign: 'center', marginRight: 'auto' }} /><span style={{ fontSize: 9, opacity: 0.8, color: '#fff' }}>%</span></div><span style={{ flex: 1, textAlign: 'left', fontSize: 12, fontWeight: 600, color: (cat.options?.taxPercent || 0) > 0 ? colors.primary : '#64748b' }}>{(cat.options?.taxPercent || 0) > 0 ? `+${formatNumber(catTotals.taxAmount)} ريال` : '—'}</span></div>
                      </div>
                      <div style={{ borderTop: '1px dashed #334155', margin: '14px 0' }}></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 13, color: '#94a3b8' }}>الإجمالي النهائي</span><span style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>{formatNumber(catTotals.finalTotal)}<span style={{ fontSize: 12, color: '#64748b', marginRight: 4 }}>ریال</span></span></div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Grand Total */}
      {hasCategories && (
        <div style={{ background: `linear-gradient(135deg, ${colors.success}20, ${colors.primary}20)`, borderRadius: 16, padding: 24, border: `2px solid ${colors.success}50`, textAlign: 'center', marginTop: 20 }}>
          <div style={{ fontSize: 14, color: colors.muted, marginBottom: 8 }}>💰 الإجمالي الكلي للعرض</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{formatNumber(getGrandTotal())}</div>
          <div style={{ fontSize: 14, color: colors.success, fontWeight: 600 }}>ريال سعودي</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16, paddingTop: 16, borderTop: `1px dashed ${colors.border}` }}>
            <div style={{ fontSize: 12, color: colors.muted }}>الفئات: <span style={{ color: colors.text, fontWeight: 600 }}>{categories.filter(cat => cat.items?.length > 0).length}</span></div>
            <div style={{ fontSize: 12, color: colors.muted }}>البنود: <span style={{ color: colors.text, fontWeight: 600 }}>{categories.reduce((sum, cat) => sum + (cat.items?.length || 0), 0)}</span></div>
            <div style={{ fontSize: 12, color: colors.muted }}>المساحة: <span style={{ color: colors.text, fontWeight: 600 }}>{categories.reduce((sum, cat) => sum + getCategoryTotalArea(cat), 0)} م²</span></div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16 }}>
            <button onClick={saveQuote} style={{ padding: '12px 24px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg, ${colors.primary}, ${colors.cyan})`, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}><span>💾</span> حفظ العرض</button>
            <button onClick={newQuote} style={{ padding: '12px 24px', borderRadius: 8, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.text, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}><span>📄</span> عرض جديد</button>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && <div style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', background: colors.success, color: '#fff', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, zIndex: 1000, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>{toastMessage}</div>}
    </div>
  );
};

export default QuantityCalculator;
