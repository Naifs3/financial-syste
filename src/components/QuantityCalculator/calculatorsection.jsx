// ═══════════════════════════════════════════════════════════════════════════════════
// CalculatorSection.jsx - النسخة النهائية المحدثة
// ═══════════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { dimensionOptions } from './colorsandconstants';

const CalculatorSection = ({ colors, places, workItems, programming, itemTypes, categories, setCategories, formatNumber, getColor, placeTypeColors }) => {

  // أيقونات
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

  // قائمة الشروط
  const predefinedConditions = [
    'غير شامل الفك أو الإزالة', 'غير شامل نقل الركام', 'غير شامل المواد', 'غير شامل الحاوية',
    'غير شامل التنظيف', 'غير شامل التمديدات', 'السعر لا يشمل ضريبة القيمة المضافة',
    'المدة المتوقعة للتنفيذ 7 أيام', 'يتطلب معاينة قبل البدء', 'العميل مسؤول عن توفير المواد',
  ];

  // الحالات
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [newCategoryConditionText, setNewCategoryConditionText] = useState('');
  const [addingCategoryCondition, setAddingCategoryCondition] = useState(null);
  const [newItemConditionText, setNewItemConditionText] = useState('');
  const [addingItemCondition, setAddingItemCondition] = useState(null);
  const [editingSummary, setEditingSummary] = useState(null);
  const [customSummary, setCustomSummary] = useState({});
  const [phase1Expanded, setPhase1Expanded] = useState(true);
  const [selectedPlaceType, setSelectedPlaceType] = useState('dry');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [dimensions, setDimensions] = useState({ length: 4, width: 4, height: 3 });
  const [activeMainItems, setActiveMainItems] = useState({});

  const heightOptions = [2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6];
  const placesList = places[selectedPlaceType]?.places || [];

  // الدوال المساعدة
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

  const getGrandTotal = () => (categories || []).reduce((sum, cat) => sum + calculateCategoryTotals(cat).finalTotal, 0);

  const generateDefaultSummary = (cat, catTotals) => {
    let summary = `تشمل الخدمة: ${cat.items?.map(i => {
      let itemText = cat.options?.showMeters ? `${i.name} (${getItemArea(i)} م²)` : i.name;
      if (cat.options?.showPlaces) itemText += ` [${i.places?.map(p => p.name).join('، ')}]`;
      if (i.conditions?.length > 0) itemText += ` (${i.conditions.join('، ')})`;
      return itemText;
    }).join('، ')}.`;
    if (cat.categoryConditions?.length > 0) summary += ` | ملاحظات: ${cat.categoryConditions.join('، ')}.`;
    if (cat.options?.containerState === 'with') summary += ` شامل الحاوية (${cat.options?.containerAmount || 0} ﷼).`;
    if (cat.options?.containerState === 'without') summary += ` غير شامل الحاوية.`;
    if (cat.options?.materialsState === 'with') summary += ` شامل المواد (${cat.options?.materialsAmount || 0} ﷼).`;
    if (cat.options?.materialsState === 'without') summary += ` غير شامل المواد.`;
    if (cat.options?.showPrice) summary += ` | الإجمالي: ${formatNumber(catTotals.finalTotal)} ر.س`;
    return summary;
  };

  // دوال التحديث
  const updateCategoryOptions = (catId, field, value) => {
    setCategories(prev => prev.map(cat => cat.id === catId ? { ...cat, options: { ...cat.options, [field]: value } } : cat));
  };

  const saveCategorySummary = (catId, summaryText) => {
    setCategories(prev => prev.map(cat => cat.id === catId ? { ...cat, customSummary: summaryText } : cat));
  };

  const addPlaceToActiveCategories = () => {
    if (!selectedPlace) return;
    const newPlace = { id: 'p' + Date.now(), name: selectedPlace, length: dimensions.length, width: dimensions.width, height: dimensions.height, area: dimensions.length * dimensions.width };
    const activeCatKeys = Object.keys(activeMainItems).filter(k => activeMainItems[k]);

    setCategories(prev => {
      let updated = [...(prev || [])];
      activeCatKeys.forEach(catKey => {
        const catConfig = workItems[catKey];
        if (!catConfig) return;
        const existingCat = updated.find(c => c.code === catConfig.code);

        if (existingCat) {
          updated = updated.map(cat => {
            if (cat.code !== catConfig.code) return cat;
            if (cat.items.length === 0) return { ...cat, pendingPlaces: [...(cat.pendingPlaces || []), { ...newPlace, id: 'p' + Date.now() + catKey }], needsSubItemSelection: true };
            return { ...cat, items: cat.items.map((item, idx) => idx === 0 ? { ...item, places: [...item.places, { ...newPlace, id: 'p' + Date.now() + idx }] } : item) };
          });
        } else {
          updated.push({
            id: 'cat' + Date.now() + catKey, code: catConfig.code, name: catConfig.name, color: getColor(Object.keys(workItems).indexOf(catKey)),
            subItems: catConfig.items.map(item => ({ code: `${catConfig.code}${item.num}`, name: item.name, price: item.exec, group: catConfig.name, type: item.typeId })),
            items: [], pendingPlaces: [{ ...newPlace, id: 'p' + Date.now() + catKey }], needsSubItemSelection: true, categoryConditions: [], customSummary: '',
            options: { containerState: 'notMentioned', containerAmount: 0, materialsState: 'notMentioned', materialsAmount: 0, showMeters: true, sumMeters: true, showPrice: false, showPlaces: false, customAmount: 0, profitPercent: 0, discountPercent: 0, discountAmount: 0, taxPercent: 15, totalsContainerAmount: 0 }
          });
        }
      });
      return updated;
    });
    setSelectedPlace('');
  };

  const selectPendingSubItem = (catId, placeId, subItemCode) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      const subItem = cat.subItems?.find(s => s.code === subItemCode);
      const place = cat.pendingPlaces?.find(p => p.id === placeId);
      if (!subItem || !place) return cat;
      const newItem = { id: Date.now(), code: subItem.code, name: subItem.name, price: subItem.price, group: subItem.group, type: subItem.type, places: [{ ...place }], conditions: [] };
      const newPendingPlaces = cat.pendingPlaces.filter(p => p.id !== placeId);
      return { ...cat, items: [...cat.items, newItem], pendingPlaces: newPendingPlaces, needsSubItemSelection: newPendingPlaces.length > 0 };
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
          
          // حساب المساحة حسب نوع القياس
          const calcArea = (p) => {
            const type = p.measureType || 'floor';
            const l = p.length || 4;
            const w = p.width || 4;
            const h = p.height || 3;
            switch(type) {
              case 'floor': return l * w; // أرضي
              case 'ceiling': return l * w; // سقف
              case 'walls': return (l + w) * 2 * h; // جدران
              case 'linear': return l; // طولي
              case 'manual': return p.manualArea || p.area || 0; // يدوي
              default: return l * w;
            }
          };
          
          if (field === 'manualArea') { 
            updated.area = parseFloat(value) || 0; 
            updated.manualArea = parseFloat(value) || 0; 
          } else if (field === 'measureType') {
            if (value !== 'manual') {
              delete updated.manualArea;
            }
            updated.area = calcArea(updated);
          } else if (field === 'length' || field === 'width' || field === 'height') { 
            updated.area = calcArea(updated);
            if (updated.measureType !== 'manual') {
              delete updated.manualArea;
            }
          }
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
      return { ...cat, items: [...cat.items, { id: Date.now(), code: sub.code, name: sub.name, price: sub.price, group: sub.group, places: [{ id: 'p' + Date.now(), name: placesList[0] || 'مكان', length: 4, width: 4, height: 3, area: 16 }], conditions: [] }] };
    }));
  };

  const deleteItem = (catId, itemId) => {
    setCategories(prev => prev.map(cat => cat.id !== catId ? cat : { ...cat, items: cat.items.filter(item => item.id !== itemId) }));
    setEditingItemId(null);
  };

  const addCondition = (catId, itemId, conditionText) => {
    if (!conditionText.trim()) return;
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return { ...cat, items: cat.items.map(item => {
        if (item.id !== itemId || item.conditions?.includes(conditionText.trim())) return item;
        return { ...item, conditions: [...(item.conditions || []), conditionText.trim()] };
      })};
    }));
    setNewItemConditionText('');
    setAddingItemCondition(null);
  };

  const deleteCondition = (catId, itemId, conditionIndex) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return { ...cat, items: cat.items.map(item => item.id !== itemId ? item : { ...item, conditions: item.conditions.filter((_, idx) => idx !== conditionIndex) }) };
    }));
  };

  const addCategoryCondition = (catId, conditionText) => {
    if (!conditionText.trim()) return;
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId || cat.categoryConditions?.includes(conditionText.trim())) return cat;
      return { ...cat, categoryConditions: [...(cat.categoryConditions || []), conditionText.trim()] };
    }));
    setNewCategoryConditionText(''); setAddingCategoryCondition(null);
  };

  const deleteCategoryCondition = (catId, conditionIndex) => {
    setCategories(prev => prev.map(cat => cat.id !== catId ? cat : { ...cat, categoryConditions: cat.categoryConditions.filter((_, idx) => idx !== conditionIndex) }));
  };

  const hasCategories = (categories || []).filter(cat => cat.items?.length > 0 || cat.pendingPlaces?.length > 0).length > 0;

  // ستايل الأزرار الموحد
  const optionButtonStyle = (isActive, activeColor) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    height: 34, minWidth: 100, padding: '0 14px', borderRadius: 8,
    border: `1.5px solid ${isActive ? activeColor : colors.border}`,
    background: isActive ? `${activeColor}18` : colors.bg,
    cursor: 'pointer', fontSize: 12, fontWeight: 600,
    color: isActive ? activeColor : colors.muted, transition: 'all 0.2s'
  });

  // ستايل القائمة المنسدلة مع سهم خط (Chevron) مقاس 16
  const selectStyle = {
    appearance: 'none', 
    paddingLeft: 28, 
    paddingRight: 12,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', 
    backgroundPosition: 'left 8px center',
    backgroundColor: 'transparent',
  };

  // العرض
  return (
    <>
      {/* المرحلة الأولى */}
      <div style={{ background: colors.card, borderRadius: 16, border: phase1Expanded ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`, overflow: 'hidden', marginBottom: 20 }}>
        <div onClick={() => setPhase1Expanded(!phase1Expanded)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 16, background: phase1Expanded ? `${colors.primary}10` : 'transparent' }}>
          <div style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.cyan})`, padding: '12px 16px', borderRadius: 10, marginLeft: 12 }}><span style={{ fontSize: 24 }}>📐</span></div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>المرحلة الأولى - إدخال البيانات</div><div style={{ fontSize: 11, color: colors.muted }}>🏗️ {Object.values(activeMainItems).filter(v => v).length} بنود مفعّلة</div></div>
          <span style={{ fontSize: 16, color: colors.primary, transform: phase1Expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
        </div>

        {phase1Expanded && (
          <div style={{ padding: 16, borderTop: `1px dashed ${colors.primary}40` }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <select value={selectedPlaceType} onChange={(e) => { setSelectedPlaceType(e.target.value); setSelectedPlace(''); }} style={{ ...selectStyle, flex: 1, height: 30, borderRadius: 8, border: `1px solid ${colors.border}`, backgroundColor: colors.bg, color: colors.text, fontSize: 12, fontWeight: 500 }}>
                {Object.entries(places).filter(([_, pt]) => pt.enabled).map(([key, pt]) => (<option key={key} value={key}>{pt.icon} {pt.name}</option>))}
              </select>
              <select value={selectedPlace} onChange={(e) => setSelectedPlace(e.target.value)} style={{ ...selectStyle, flex: 2, height: 30, borderRadius: 8, border: `1px solid ${colors.border}`, backgroundColor: colors.bg, color: colors.text, fontSize: 12, fontWeight: 500 }}>
                <option value="">-- اختر المكان --</option>
                {placesList.map(place => (<option key={place} value={place}>{place}</option>))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
              {Object.entries(workItems).map(([catKey, cat], idx) => {
                if (!programming[selectedPlaceType]?.[catKey]?.enabled) return null;
                const catColor = getColor(idx);
                return (<button key={catKey} onClick={() => setActiveMainItems(prev => ({ ...prev, [catKey]: !prev[catKey] }))} style={{ height: 30, padding: '0 10px', borderRadius: 6, border: `1px solid ${activeMainItems[catKey] ? catColor : colors.border}`, background: activeMainItems[catKey] ? `${catColor}20` : 'transparent', color: activeMainItems[catKey] ? catColor : colors.muted, fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><span>{cat.icon}</span><span>{cat.name}</span></button>);
              })}
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {[{ key: 'length', label: 'الطول' }, { key: 'width', label: 'العرض' }, { key: 'height', label: 'الارتفاع' }].map(dim => (
                <div key={dim.key} style={{ flex: 1 }}><div style={{ fontSize: 10, color: colors.muted, marginBottom: 4, textAlign: 'center' }}>{dim.label}</div>
                  <select value={dimensions[dim.key]} onChange={(e) => setDimensions({ ...dimensions, [dim.key]: parseFloat(e.target.value) })} style={{ ...selectStyle, width: '100%', height: 30, borderRadius: 8, border: `1px solid ${colors.border}`, backgroundColor: colors.bg, color: '#fff', fontSize: 12, textAlign: 'center', fontWeight: 500 }}>
                    {(dim.key === 'height' ? heightOptions : (dimensionOptions || [1,2,3,4,5,6,7,8,9,10]).slice(0, 20)).map(n => (<option key={n} value={n}>{n}</option>))}
                  </select>
                </div>
              ))}
              <div style={{ flex: 1 }}><div style={{ fontSize: 10, color: colors.success, marginBottom: 4, textAlign: 'center' }}>المساحة</div><div style={{ height: 30, borderRadius: 8, border: `1px solid ${colors.success}`, background: `${colors.success}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 500 }}>{dimensions.length * dimensions.width} م²</div></div>
            </div>

            <button onClick={addPlaceToActiveCategories} disabled={!selectedPlace || !Object.values(activeMainItems).some(v => v)} style={{ width: '100%', height: 50, borderRadius: 8, border: `1px solid ${colors.success}`, background: `${colors.success}15`, color: colors.success, fontSize: 14, fontWeight: 500, cursor: (selectedPlace && Object.values(activeMainItems).some(v => v)) ? 'pointer' : 'not-allowed', opacity: (selectedPlace && Object.values(activeMainItems).some(v => v)) ? 1 : 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              إضافة مكان
            </button>
          </div>
        )}
      </div>

      {!hasCategories && (<div style={{ textAlign: 'center', padding: 40, color: colors.muted, fontSize: 14, background: colors.card, borderRadius: 16, border: `1px solid ${colors.border}`, marginBottom: 16 }}><div style={{ fontSize: 50, marginBottom: 16, opacity: 0.3 }}>📦</div><div style={{ fontWeight: 600, marginBottom: 8 }}>لا توجد فئات مضافة</div></div>)}

      {/* الفئات */}
      {(categories || []).filter(cat => cat.items?.length > 0 || cat.pendingPlaces?.length > 0).map((cat) => {
        const isExpanded = expandedCategory === cat.id;
        const catTotals = calculateCategoryTotals(cat);
        const catTotalArea = getCategoryTotalArea(cat);
        const pendingPlaces = cat.pendingPlaces || [];
        const allPlaces = [];
        cat.items?.forEach(item => { item.places?.forEach(place => { allPlaces.push({ name: place.name, area: place.area }); }); });

        return (
          <div key={cat.id} style={{ background: colors.card, borderRadius: 16, overflow: 'hidden', marginBottom: 12, border: isExpanded ? `2px solid ${cat.color}` : `1px solid ${colors.border}` }}>
            {/* رأس الفئة */}
            <div onClick={() => { setExpandedCategory(isExpanded ? null : cat.id); setEditingItemId(null); }} style={{ display: 'flex', alignItems: 'stretch', cursor: 'pointer', background: isExpanded ? `${cat.color}08` : 'transparent' }}>
              <div style={{ display: 'flex', alignItems: 'stretch', borderLeft: `1px solid ${colors.border}` }}>
                <div style={{ width: 4, background: cat.color }}/>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px 20px', gap: 6 }}>
                  {getIcon(cat.code, cat.color, 30)}
                  <span style={{ fontSize: 10, fontWeight: 700, color: cat.color }}>{cat.code}</span>
                </div>
              </div>
              <div style={{ flex: 1, padding: '16px 18px' }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: colors.text, marginBottom: 6 }}>{cat.name}</div>
                {pendingPlaces.length > 0 && (<div style={{ background: `${colors.warning}15`, border: `1px solid ${colors.warning}40`, borderRadius: 6, padding: '6px 10px', marginBottom: 8, fontSize: 11, color: colors.warning }}><span>▲</span> تحتاج اختيار البنود ({pendingPlaces.length} معلق)</div>)}
                <div style={{ display: 'flex', gap: 12, fontSize: 11, color: colors.muted, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span>📦 {cat.items?.length || 0} بنود</span>
                  {cat.options?.containerState === 'with' && <span style={{ color: colors.warning }}>🚛 حاوية</span>}
                  {cat.options?.materialsState === 'with' && <span style={{ color: colors.success }}>🧱 مواد</span>}
                </div>
                {allPlaces.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', fontSize: 10 }}>
                    {allPlaces.map((place, idx) => (<span key={idx} style={{ background: `${cat.color}15`, padding: '3px 8px', borderRadius: 4 }}>{place.name} ({place.area}م²)</span>))}
                    <span style={{ background: `${colors.success}20`, padding: '3px 10px', borderRadius: 4, fontWeight: 700, color: colors.success }}>= {catTotalArea} م²</span>
                  </div>
                )}
              </div>
              <div style={{ background: `${colors.success}12`, padding: '16px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${colors.border}` }}><div style={{ fontSize: 9, color: colors.muted }}>الإجمالي</div><div style={{ fontSize: 20, fontWeight: 700, color: colors.success }}>{formatNumber(catTotals.finalTotal)}</div></div>
              <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', background: colors.bg }}><span style={{ fontSize: 16, color: isExpanded ? cat.color : colors.muted, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span></div>
            </div>

            {/* محتوى الفئة */}
            {isExpanded && (
              <div style={{ background: `${cat.color}05`, borderTop: `1px dashed ${cat.color}40`, padding: 16 }}>
                
                {/* الأماكن المعلقة */}
                {pendingPlaces.length > 0 && (
                  <div style={{ marginBottom: 16, background: `${colors.warning}10`, borderRadius: 12, padding: 14, border: `1px solid ${colors.warning}30` }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: colors.warning, marginBottom: 10 }}>⚠️ أماكن معلقة ({pendingPlaces.length})</div>
                    {pendingPlaces.map(place => (
                      <div key={place.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, padding: 10, background: colors.card, borderRadius: 8 }}>
                        <span style={{ fontSize: 12, color: colors.text, fontWeight: 500 }}>{place.name} ({place.area} م²)</span>
                        <select defaultValue="" onChange={(e) => { if (e.target.value) selectPendingSubItem(cat.id, place.id, e.target.value); }} style={{ ...selectStyle, flex: 1, height: 30, borderRadius: 6, border: `1px solid ${cat.color}50`, backgroundColor: colors.bg, color: colors.text, fontSize: 12, fontWeight: 500 }}>
                          <option value="">-- اختر البند --</option>
                          {(cat.subItems || []).map(s => (<option key={s.code} value={s.code}>{s.name} ({s.price} ﷼)</option>))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}

                {/* البنود */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: colors.text, marginBottom: 10 }}>📦 البنود ({cat.items?.length || 0}) • {catTotalArea} م² • {formatNumber(catTotals.totalPrice)} ﷼</div>

                  {(cat.items || []).map((item) => {
                    const isEditing = editingItemId === item.id;
                    const itemArea = getItemArea(item);
                    return (
                      <div key={item.id} style={{ background: colors.card, borderRadius: 12, overflow: 'hidden', marginBottom: 8, border: isEditing ? `2px solid ${colors.primary}` : `1px solid ${colors.border}` }}>
                        <div onClick={() => setEditingItemId(isEditing ? null : item.id)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '12px 14px', background: isEditing ? `${colors.primary}10` : 'transparent' }}>
                          <div style={{ background: cat.color, padding: '8px 12px', borderRadius: 6, marginLeft: 12 }}><span style={{ fontSize: 11, fontWeight: 500, color: '#fff' }}>{item.code}</span></div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 500, color: colors.text, display: 'flex', alignItems: 'center', gap: 6 }}>
                              {item.name}
                              {isEditing && <span style={{ fontSize: 14, color: colors.primary }}>⚙️</span>}
                            </div>
                            <div style={{ fontSize: 11, color: colors.muted, fontWeight: 500 }}>📍 {item.places?.map(p => p.name).join('، ')} | {itemArea} م² | {item.price} ﷼/م²</div>
                          </div>
                          <div style={{ fontSize: 16, fontWeight: 500, color: colors.success }}>{formatNumber(itemArea * item.price)} ﷼</div>
                        </div>

                        {isEditing && (
                          <div style={{ padding: 14, background: `${colors.primary}08`, borderTop: `1px dashed ${colors.primary}30` }}>
                            <select value={item.code} onChange={(e) => changeSubItem(cat.id, item.id, e.target.value)} style={{ ...selectStyle, width: '100%', height: 30, marginBottom: 12, borderRadius: 8, border: `1px solid ${colors.border}`, backgroundColor: colors.bg, color: colors.text, fontSize: 12, fontWeight: 500 }}>
                              {(cat.subItems || []).map(s => (<option key={s.code} value={s.code}>[{s.code}] {s.name}</option>))}
                            </select>

                            {/* الأماكن - تحت بعضها */}
                            <div style={{ fontSize: 10, color: colors.muted, marginBottom: 6 }}>📍 الأماكن</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
                              {(item.places || []).map((place) => {
                                const measureType = place.measureType || 'floor';
                                return (
                                <div key={place.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px', background: `${colors.primary}08`, borderRadius: 6, border: `1px solid ${colors.primary}20`, flexWrap: 'wrap' }}>
                                  <select value={place.name} onChange={(e) => updatePlace(cat.id, item.id, place.id, 'name', e.target.value)} style={{ ...selectStyle, flex: 1, minWidth: 70, height: 30, borderRadius: 4, border: `1px solid ${colors.border}`, backgroundColor: colors.bg, color: colors.text, fontSize: 12, fontWeight: 500 }}>
                                    {placesList.map(p => (<option key={p} value={p}>{p}</option>))}
                                  </select>
                                  
                                  {/* نوع المساحة */}
                                  <select value={measureType} onChange={(e) => updatePlace(cat.id, item.id, place.id, 'measureType', e.target.value)} style={{ ...selectStyle, width: 70, height: 30, borderRadius: 4, border: `1px solid ${colors.cyan}`, backgroundColor: `${colors.cyan}15`, color: colors.cyan, fontSize: 12, fontWeight: 500 }}>
                                    <option value="floor">أرضي</option>
                                    <option value="ceiling">سقف</option>
                                    <option value="walls">جدران</option>
                                    <option value="linear">طولي</option>
                                    <option value="manual">يدوي</option>
                                  </select>
                                  
                                  {/* حقول القياس حسب النوع */}
                                  {measureType === 'manual' ? (
                                    <input type="number" value={place.manualArea || place.area || ''} onChange={(e) => updatePlace(cat.id, item.id, place.id, 'manualArea', e.target.value)} onFocus={(e) => e.target.select()} placeholder="المساحة" style={{ width: 60, height: 30, padding: '0 4px', borderRadius: 4, border: `1px solid ${colors.success}`, background: colors.bg, color: colors.success, fontSize: 12, textAlign: 'center', fontWeight: 500 }} />
                                  ) : measureType === 'linear' ? (
                                    <select value={place.length} onChange={(e) => updatePlace(cat.id, item.id, place.id, 'length', e.target.value)} style={{ ...selectStyle, width: 55, height: 30, borderRadius: 4, border: `1px solid ${colors.border}`, backgroundColor: colors.bg, color: colors.text, fontSize: 12, textAlign: 'center', fontWeight: 500 }}>
                                      {[1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,12,14,16,18,20,25,30,40,50].map(n => (<option key={n} value={n}>{n}</option>))}
                                    </select>
                                  ) : (
                                    <>
                                      <select value={place.length} onChange={(e) => updatePlace(cat.id, item.id, place.id, 'length', e.target.value)} style={{ ...selectStyle, width: 55, height: 30, borderRadius: 4, border: `1px solid ${colors.border}`, backgroundColor: colors.bg, color: colors.text, fontSize: 12, textAlign: 'center', fontWeight: 500 }}>
                                        {[1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,12,14,16,18,20].map(n => (<option key={n} value={n}>{n}</option>))}
                                      </select>
                                      <span style={{ color: colors.muted, fontSize: 12, fontWeight: 500 }}>×</span>
                                      <select value={place.width} onChange={(e) => updatePlace(cat.id, item.id, place.id, 'width', e.target.value)} style={{ ...selectStyle, width: 55, height: 30, borderRadius: 4, border: `1px solid ${colors.border}`, backgroundColor: colors.bg, color: colors.text, fontSize: 12, textAlign: 'center', fontWeight: 500 }}>
                                        {[1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,12,14,16,18,20].map(n => (<option key={n} value={n}>{n}</option>))}
                                      </select>
                                    </>
                                  )}
                                  
                                  {/* الارتفاع - يظهر للجدران والأرضي والسقف */}
                                  {(measureType === 'walls' || measureType === 'floor' || measureType === 'ceiling') && (
                                    <select value={place.height || 3} onChange={(e) => updatePlace(cat.id, item.id, place.id, 'height', e.target.value)} style={{ ...selectStyle, width: 55, height: 30, borderRadius: 4, border: `1px solid ${colors.purple}`, backgroundColor: colors.bg, color: colors.purple, fontSize: 12, textAlign: 'center', fontWeight: 500 }}>
                                      {[2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6].map(n => (<option key={n} value={n}>{n}</option>))}
                                    </select>
                                  )}
                                  
                                  {/* المساحة المحسوبة */}
                                  <span style={{ padding: '4px 8px', borderRadius: 4, background: `${colors.success}20`, color: colors.success, fontSize: 12, fontWeight: 500, minWidth: 55, textAlign: 'center' }}>
                                    {place.area} {measureType === 'linear' ? 'م.ط' : 'م²'}
                                  </span>
                                  
                                  <button onClick={() => deletePlace(cat.id, item.id, place.id)} style={{ width: 26, height: 26, borderRadius: 4, border: `1px solid ${colors.danger}50`, background: `${colors.danger}10`, color: colors.danger, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                                </div>
                              )})}
                            </div>
                            <button onClick={() => addPlace(cat.id, item.id)} style={{ width: '100%', height: 30, marginBottom: 12, borderRadius: 6, border: `1px solid ${colors.success}`, background: `${colors.success}15`, color: colors.success, fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                              إضافة مكان
                            </button>

                            {/* الشروط والملاحظات - تحت بعضها */}
                            <div style={{ fontSize: 10, color: colors.warning, marginBottom: 6 }}>📋 الشروط والملاحظات</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
                              {item.conditions?.map((c, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: `${colors.warning}10`, borderRadius: 6, border: `1px solid ${colors.warning}20` }}>
                                  <span style={{ flex: 1, fontSize: 11, color: colors.text, fontWeight: 500 }}>{c}</span>
                                  <button onClick={() => deleteCondition(cat.id, item.id, i)} style={{ width: 22, height: 22, borderRadius: 4, border: `1px solid ${colors.danger}50`, background: `${colors.danger}10`, color: colors.danger, cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                                </div>
                              ))}
                            </div>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                              <select onChange={(e) => { if (e.target.value) { addCondition(cat.id, item.id, e.target.value); e.target.value = ''; } }} style={{ ...selectStyle, flex: 1, height: 30, borderRadius: 6, border: `1px solid ${colors.warning}`, backgroundColor: colors.bg, color: colors.text, fontSize: 12, textAlign: 'center', fontWeight: 500 }}>
                                <option value="">إضافة شرط</option>
                                {predefinedConditions.filter(c => !item.conditions?.includes(c)).map((c, i) => (<option key={i} value={c}>{c}</option>))}
                              </select>
                              <button onClick={() => setAddingItemCondition(addingItemCondition === item.id ? null : item.id)} style={{ height: 30, padding: '0 12px', borderRadius: 6, border: `1px solid ${colors.warning}`, background: `${colors.warning}15`, color: colors.warning, fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                              </button>
                            </div>
                            {addingItemCondition === item.id && (
                              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                                <input type="text" value={newItemConditionText} onChange={(e) => setNewItemConditionText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') addCondition(cat.id, item.id, newItemConditionText); }} placeholder="اكتب الشرط..." style={{ flex: 1, height: 30, padding: '0 12px', borderRadius: 6, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 12, fontWeight: 500 }} />
                                <button onClick={() => addCondition(cat.id, item.id, newItemConditionText)} style={{ height: 30, padding: '0 12px', borderRadius: 6, background: colors.success, color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none' }}>إضافة</button>
                              </div>
                            )}

                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                              <button onClick={() => deleteItem(cat.id, item.id)} style={{ height: 30, padding: '0 12px', borderRadius: 6, border: `1px solid ${colors.danger}`, background: `${colors.danger}10`, color: colors.danger, fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>حذف</button>
                              <button onClick={() => setEditingItemId(null)} style={{ height: 30, padding: '0 12px', borderRadius: 6, border: `1px solid ${colors.success}`, background: `${colors.success}10`, color: colors.success, fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>تم</button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <button onClick={() => addItem(cat.id)} style={{ width: '100%', height: 40, borderRadius: 10, border: `1px solid ${colors.success}`, background: `${colors.success}15`, color: colors.success, fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                    إضافة بند جديد
                  </button>
                </div>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* الشروط والملاحظات - ظاهرة دائماً بدون زر */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <div style={{ padding: 14, background: `${colors.warning}08`, borderRadius: 10, marginBottom: 12, border: `1px solid ${colors.warning}30` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: colors.warning, marginBottom: 12 }}>📋 الشروط والملاحظات</div>
                  
                  {/* أزرار الخيارات */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8, marginBottom: 12 }}>
                    
                    {/* الحاوية */}
                    <div onClick={() => {
                      const states = ['with', 'notMentioned', 'without'];
                      const currentIndex = states.indexOf(cat.options?.containerState || 'notMentioned');
                      updateCategoryOptions(cat.id, 'containerState', states[(currentIndex + 1) % states.length]);
                    }} style={optionButtonStyle(cat.options?.containerState !== 'notMentioned', cat.options?.containerState === 'with' ? colors.warning : colors.danger)}>
                      <span>{cat.options?.containerState === 'with' ? '🚛' : cat.options?.containerState === 'without' ? '🚫' : '➖'}</span>
                      <span>{cat.options?.containerState === 'with' ? 'الحاوية' : cat.options?.containerState === 'without' ? 'بدون' : 'الحاوية'}</span>
                    </div>

                    {/* المواد */}
                    <div onClick={() => {
                      const states = ['with', 'notMentioned', 'without'];
                      const currentIndex = states.indexOf(cat.options?.materialsState || 'notMentioned');
                      updateCategoryOptions(cat.id, 'materialsState', states[(currentIndex + 1) % states.length]);
                    }} style={optionButtonStyle(cat.options?.materialsState !== 'notMentioned', cat.options?.materialsState === 'with' ? colors.success : colors.danger)}>
                      <span>{cat.options?.materialsState === 'with' ? '🧱' : cat.options?.materialsState === 'without' ? '🚫' : '➖'}</span>
                      <span>{cat.options?.materialsState === 'with' ? 'المواد' : cat.options?.materialsState === 'without' ? 'بدون' : 'المواد'}</span>
                    </div>

                    {/* الأمتار */}
                    <div onClick={() => updateCategoryOptions(cat.id, 'showMeters', !cat.options?.showMeters)} style={optionButtonStyle(cat.options?.showMeters, colors.cyan)}>
                      <span>📏</span><span>الأمتار</span>
                    </div>

                    {/* الأماكن */}
                    <div onClick={() => updateCategoryOptions(cat.id, 'showPlaces', !cat.options?.showPlaces)} style={optionButtonStyle(cat.options?.showPlaces, colors.purple)}>
                      <span>📍</span><span>الأماكن</span>
                    </div>

                    {/* السعر */}
                    <div onClick={() => updateCategoryOptions(cat.id, 'showPrice', !cat.options?.showPrice)} style={optionButtonStyle(cat.options?.showPrice, colors.primary)}>
                      <span>💰</span><span>السعر</span>
                    </div>

                    {/* تحرير */}
                    <div onClick={() => {
                      if (editingSummary !== cat.id) {
                        if (!customSummary[cat.id] && !cat.customSummary) {
                          setCustomSummary({ ...customSummary, [cat.id]: generateDefaultSummary(cat, catTotals) });
                        } else if (cat.customSummary && !customSummary[cat.id]) {
                          setCustomSummary({ ...customSummary, [cat.id]: cat.customSummary });
                        }
                      } else {
                        saveCategorySummary(cat.id, customSummary[cat.id] || '');
                      }
                      setEditingSummary(editingSummary === cat.id ? null : cat.id);
                    }} style={optionButtonStyle(editingSummary === cat.id, colors.warning)}>
                      <span>✏️</span><span>{editingSummary === cat.id ? 'حفظ' : 'تحرير'}</span>
                    </div>

                    {/* نسخ */}
                    <div onClick={() => {
                      const summary = customSummary[cat.id] || cat.customSummary || generateDefaultSummary(cat, catTotals);
                      navigator.clipboard?.writeText(summary);
                      alert('تم النسخ!');
                    }} style={optionButtonStyle(false, colors.muted)}>
                      <span>📋</span><span>نسخ</span>
                    </div>

                    {/* إعادة الضبط */}
                    <div onClick={() => {
                      const defaultText = generateDefaultSummary(cat, catTotals);
                      setCustomSummary({ ...customSummary, [cat.id]: defaultText });
                      saveCategorySummary(cat.id, '');
                    }} style={optionButtonStyle(false, colors.danger)}>
                      <span>↩️</span><span>إعادة ضبط</span>
                    </div>
                  </div>

                  {/* ملخص الخدمة */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: colors.warning, marginBottom: 8 }}>📝 ملخص الخدمة</div>
                    {editingSummary === cat.id ? (
                      <textarea 
                        value={customSummary[cat.id] || ''} 
                        onChange={(e) => setCustomSummary({ ...customSummary, [cat.id]: e.target.value })} 
                        style={{ width: '100%', minHeight: 120, padding: 12, borderRadius: 8, border: `1px solid ${colors.warning}50`, background: colors.bg, color: colors.text, fontSize: 12, lineHeight: 1.8, resize: 'vertical', fontFamily: 'inherit' }} 
                      />
                    ) : (
                      <div style={{ fontSize: 12, color: colors.text, lineHeight: 1.8, background: colors.bg, padding: 12, borderRadius: 8, minHeight: 60 }}>
                        {customSummary[cat.id] || cat.customSummary || (
                          <>
                            تشمل الخدمة: {cat.items?.map((i, idx) => (
                              <span key={i.id}>
                                {cat.options?.showMeters ? `${i.name} (${getItemArea(i)} م²)` : i.name}
                                {cat.options?.showPlaces && <span style={{ color: colors.purple }}> [{i.places?.map(p => p.name).join('، ')}]</span>}
                                {i.conditions?.length > 0 && <span style={{ color: colors.warning }}> ({i.conditions.join('، ')})</span>}
                                {idx < cat.items.length - 1 ? '، ' : '.'}
                              </span>
                            ))}
                            {cat.categoryConditions?.length > 0 && <strong style={{ color: colors.warning }}> | ملاحظات: {cat.categoryConditions.join('، ')}.</strong>}
                            {cat.options?.containerState === 'with' && <span style={{ color: colors.warning }}> شامل الحاوية ({cat.options?.containerAmount || 0} ﷼).</span>}
                            {cat.options?.containerState === 'without' && <span style={{ color: colors.danger }}> غير شامل الحاوية.</span>}
                            {cat.options?.materialsState === 'with' && <span style={{ color: colors.success }}> شامل المواد ({cat.options?.materialsAmount || 0} ﷼).</span>}
                            {cat.options?.materialsState === 'without' && <span style={{ color: colors.danger }}> غير شامل المواد.</span>}
                            {cat.options?.showPrice && <strong style={{ color: colors.success }}> | الإجمالي: {formatNumber(catTotals.finalTotal)} ر.س</strong>}
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* شروط الفئة - تحت بعضها */}
                  <div style={{ paddingTop: 12, borderTop: `1px dashed ${colors.warning}30` }}>
                    <div style={{ fontSize: 10, color: colors.warning, marginBottom: 8 }}>📋 شروط عامة للفئة</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
                      {cat.categoryConditions?.map((c, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: `${colors.warning}10`, borderRadius: 6, border: `1px solid ${colors.warning}20` }}>
                          <span style={{ flex: 1, fontSize: 11, color: colors.text, fontWeight: 500 }}>{c}</span>
                          <button onClick={() => deleteCategoryCondition(cat.id, i)} style={{ width: 22, height: 22, borderRadius: 4, border: `1px solid ${colors.danger}50`, background: `${colors.danger}10`, color: colors.danger, cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <select onChange={(e) => { if (e.target.value) { addCategoryCondition(cat.id, e.target.value); e.target.value = ''; } }} style={{ ...selectStyle, flex: 1, height: 30, borderRadius: 6, border: `1px solid ${colors.warning}`, backgroundColor: colors.bg, color: colors.text, fontSize: 12, textAlign: 'center', fontWeight: 500 }}>
                        <option value="">إضافة شرط</option>
                        {predefinedConditions.filter(c => !cat.categoryConditions?.includes(c)).map((c, i) => (<option key={i} value={c}>{c}</option>))}
                      </select>
                      <button onClick={() => setAddingCategoryCondition(addingCategoryCondition === cat.id ? null : cat.id)} style={{ height: 30, padding: '0 12px', borderRadius: 6, border: `1px solid ${colors.warning}`, background: `${colors.warning}15`, color: colors.warning, fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                      </button>
                    </div>
                    {addingCategoryCondition === cat.id && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <input type="text" value={newCategoryConditionText} onChange={(e) => setNewCategoryConditionText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') addCategoryCondition(cat.id, newCategoryConditionText); }} placeholder="اكتب الشرط..." style={{ flex: 1, height: 30, padding: '0 12px', borderRadius: 6, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 12, fontWeight: 500 }} />
                        <button onClick={() => addCategoryCondition(cat.id, newCategoryConditionText)} style={{ height: 30, padding: '0 12px', borderRadius: 6, background: colors.success, color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none' }}>إضافة</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* ملخص السعر - ظاهر دائماً بدون زر */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <div style={{ padding: 16, background: `${colors.primary}10`, borderRadius: 12, border: `1px solid ${colors.primary}30` }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: colors.primary, marginBottom: 16 }}>💰 ملخص السعر</div>
                  
                  {/* جدول الأسعار */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    
                    {/* الأسعار الأساسية */}
                    <div style={{ display: 'flex', alignItems: 'center', height: 44, padding: '0 14px', borderRadius: 8, background: `${colors.text}08` }}>
                      <div style={{ width: 140, color: colors.text, fontSize: 13, fontWeight: 600 }}>الأسعار الأساسية</div>
                      <div style={{ flex: 1 }}></div>
                      <div style={{ width: 130, textAlign: 'left', fontSize: 13, fontWeight: 700, color: colors.text }}>{formatNumber(catTotals.totalPrice)} ر.س</div>
                    </div>

                    {/* الحاوية */}
                    <div style={{ display: 'flex', alignItems: 'center', height: 44, padding: '0 14px', borderRadius: 8 }}>
                      <div style={{ width: 140, color: colors.warning, fontSize: 13, fontWeight: 600 }}>🚛 الحاوية</div>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {cat.options?.containerState === 'with' ? (
                          <>
                            <input type="number" value={cat.options?.totalsContainerAmount || ''} onChange={(e) => updateCategoryOptions(cat.id, 'totalsContainerAmount', parseFloat(e.target.value) || 0)} onFocus={(e) => e.target.select()} placeholder="0" style={{ width: 80, height: 30, padding: '0 10px', borderRadius: 6, border: `1px solid ${colors.warning}50`, background: colors.bg, color: '#fff', fontSize: 13, fontWeight: 700, textAlign: 'center' }} />
                            <span style={{ color: colors.warning, fontSize: 12 }}>﷼</span>
                          </>
                        ) : (
                          <span style={{ color: colors.muted, fontSize: 12 }}>{cat.options?.containerState === 'without' ? 'غير شامل' : 'لا يوجد'}</span>
                        )}
                      </div>
                      <div style={{ width: 130, textAlign: 'left', fontSize: 13, fontWeight: 700, color: cat.options?.containerState === 'with' ? colors.warning : colors.muted }}>
                        {cat.options?.containerState === 'with' ? `+${formatNumber(cat.options?.totalsContainerAmount || 0)} ر.س` : '—'}
                      </div>
                    </div>

                    {/* المواد */}
                    <div style={{ display: 'flex', alignItems: 'center', height: 44, padding: '0 14px', borderRadius: 8, background: `${colors.text}08` }}>
                      <div style={{ width: 140, color: colors.success, fontSize: 13, fontWeight: 600 }}>🧱 المواد</div>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {cat.options?.materialsState === 'with' ? (
                          <>
                            <input type="number" value={cat.options?.materialsAmount || ''} onChange={(e) => updateCategoryOptions(cat.id, 'materialsAmount', parseFloat(e.target.value) || 0)} onFocus={(e) => e.target.select()} placeholder="0" style={{ width: 80, height: 30, padding: '0 10px', borderRadius: 6, border: `1px solid ${colors.success}50`, background: colors.bg, color: '#fff', fontSize: 13, fontWeight: 700, textAlign: 'center' }} />
                            <span style={{ color: colors.success, fontSize: 12 }}>﷼</span>
                          </>
                        ) : (
                          <span style={{ color: colors.muted, fontSize: 12 }}>{cat.options?.materialsState === 'without' ? 'غير شامل' : 'لا يوجد'}</span>
                        )}
                      </div>
                      <div style={{ width: 130, textAlign: 'left', fontSize: 13, fontWeight: 700, color: cat.options?.materialsState === 'with' ? colors.success : colors.muted }}>
                        {cat.options?.materialsState === 'with' ? `+${formatNumber(cat.options?.materialsAmount || 0)} ر.س` : '—'}
                      </div>
                    </div>

                    {/* مبلغ إضافي */}
                    <div style={{ display: 'flex', alignItems: 'center', height: 44, padding: '0 14px', borderRadius: 8 }}>
                      <div style={{ width: 140, color: colors.success, fontSize: 13, fontWeight: 600 }}>➕ مبلغ إضافي</div>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input type="number" value={cat.options?.customAmount || ''} onChange={(e) => updateCategoryOptions(cat.id, 'customAmount', parseFloat(e.target.value) || 0)} onFocus={(e) => e.target.select()} placeholder="0" style={{ width: 80, height: 30, padding: '0 10px', borderRadius: 6, border: `1px solid ${colors.success}50`, background: colors.bg, color: '#fff', fontSize: 13, fontWeight: 700, textAlign: 'center' }} />
                        <span style={{ color: colors.success, fontSize: 12 }}>﷼</span>
                      </div>
                      <div style={{ width: 130, textAlign: 'left', fontSize: 13, fontWeight: 700, color: (cat.options?.customAmount || 0) > 0 ? colors.success : colors.muted }}>
                        {(cat.options?.customAmount || 0) > 0 ? `+${formatNumber(cat.options?.customAmount)} ر.س` : '—'}
                      </div>
                    </div>

                    {/* إضافة نسبة */}
                    <div style={{ display: 'flex', alignItems: 'center', height: 44, padding: '0 14px', borderRadius: 8, background: `${colors.text}08` }}>
                      <div style={{ width: 140, color: colors.success, fontSize: 13, fontWeight: 600 }}>📈 إضافة نسبة</div>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input type="number" value={cat.options?.profitPercent || ''} onChange={(e) => updateCategoryOptions(cat.id, 'profitPercent', parseFloat(e.target.value) || 0)} onFocus={(e) => e.target.select()} placeholder="0" style={{ width: 60, height: 30, padding: '0 10px', borderRadius: 6, border: `1px solid ${colors.success}50`, background: colors.bg, color: '#fff', fontSize: 13, fontWeight: 700, textAlign: 'center' }} />
                        <span style={{ color: colors.success, fontSize: 12 }}>%</span>
                      </div>
                      <div style={{ width: 130, textAlign: 'left', fontSize: 13, fontWeight: 700, color: (cat.options?.profitPercent || 0) > 0 ? colors.success : colors.muted }}>
                        {(cat.options?.profitPercent || 0) > 0 ? `+${formatNumber(catTotals.profitAmount)} ر.س` : '—'}
                      </div>
                    </div>

                    {/* خصم مبلغ */}
                    <div style={{ display: 'flex', alignItems: 'center', height: 44, padding: '0 14px', borderRadius: 8 }}>
                      <div style={{ width: 140, color: colors.danger, fontSize: 13, fontWeight: 600 }}>➖ خصم مبلغ</div>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input type="number" value={cat.options?.discountAmount || ''} onChange={(e) => updateCategoryOptions(cat.id, 'discountAmount', parseFloat(e.target.value) || 0)} onFocus={(e) => e.target.select()} placeholder="0" style={{ width: 80, height: 30, padding: '0 10px', borderRadius: 6, border: `1px solid ${colors.danger}50`, background: colors.bg, color: '#fff', fontSize: 13, fontWeight: 700, textAlign: 'center' }} />
                        <span style={{ color: colors.danger, fontSize: 12 }}>﷼</span>
                      </div>
                      <div style={{ width: 130, textAlign: 'left', fontSize: 13, fontWeight: 700, color: (cat.options?.discountAmount || 0) > 0 ? colors.danger : colors.muted }}>
                        {(cat.options?.discountAmount || 0) > 0 ? `-${formatNumber(cat.options?.discountAmount)} ر.س` : '—'}
                      </div>
                    </div>

                    {/* خصم نسبة */}
                    <div style={{ display: 'flex', alignItems: 'center', height: 44, padding: '0 14px', borderRadius: 8, background: `${colors.text}08` }}>
                      <div style={{ width: 140, color: colors.danger, fontSize: 13, fontWeight: 600 }}>📉 خصم نسبة</div>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input type="number" value={cat.options?.discountPercent || ''} onChange={(e) => updateCategoryOptions(cat.id, 'discountPercent', parseFloat(e.target.value) || 0)} onFocus={(e) => e.target.select()} placeholder="0" style={{ width: 60, height: 30, padding: '0 10px', borderRadius: 6, border: `1px solid ${colors.danger}50`, background: colors.bg, color: '#fff', fontSize: 13, fontWeight: 700, textAlign: 'center' }} />
                        <span style={{ color: colors.danger, fontSize: 12 }}>%</span>
                      </div>
                      <div style={{ width: 130, textAlign: 'left', fontSize: 13, fontWeight: 700, color: (cat.options?.discountPercent || 0) > 0 ? colors.danger : colors.muted }}>
                        {(cat.options?.discountPercent || 0) > 0 ? `-${formatNumber(catTotals.discountByPercent)} ر.س` : '—'}
                      </div>
                    </div>

                    {/* الضريبة */}
                    <div style={{ display: 'flex', alignItems: 'center', height: 44, padding: '0 14px', borderRadius: 8 }}>
                      <div style={{ width: 140, color: colors.primary, fontSize: 13, fontWeight: 600 }}>🏛️ الضريبة</div>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input type="number" value={cat.options?.taxPercent || ''} onChange={(e) => updateCategoryOptions(cat.id, 'taxPercent', parseFloat(e.target.value) || 0)} onFocus={(e) => e.target.select()} placeholder="0" style={{ width: 60, height: 30, padding: '0 10px', borderRadius: 6, border: `1px solid ${colors.primary}50`, background: colors.bg, color: '#fff', fontSize: 13, fontWeight: 700, textAlign: 'center' }} />
                        <span style={{ color: colors.primary, fontSize: 12 }}>%</span>
                      </div>
                      <div style={{ width: 130, textAlign: 'left', fontSize: 13, fontWeight: 700, color: (cat.options?.taxPercent || 0) > 0 ? colors.primary : colors.muted }}>
                        {(cat.options?.taxPercent || 0) > 0 ? `+${formatNumber(catTotals.taxAmount)} ر.س` : '—'}
                      </div>
                    </div>
                  </div>

                  {/* الإجمالي النهائي */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: `2px solid ${colors.primary}50` }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: colors.primary }}>الإجمالي النهائي</span>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>{formatNumber(catTotals.finalTotal)} <span style={{ fontSize: 14, fontWeight: 400, color: colors.muted }}>ريال</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* الإجمالي الكلي */}
      {hasCategories && (
        <div style={{ background: `linear-gradient(135deg, ${colors.success}20, ${colors.primary}20)`, borderRadius: 16, padding: 24, border: `2px solid ${colors.success}50`, textAlign: 'center', marginTop: 20 }}>
          <div style={{ fontSize: 14, color: colors.muted, marginBottom: 8 }}>💰 الإجمالي الكلي للعرض</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{formatNumber(getGrandTotal())}</div>
          <div style={{ fontSize: 14, color: colors.success, fontWeight: 600 }}>ريال سعودي</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16, paddingTop: 16, borderTop: `1px dashed ${colors.border}` }}>
            <div style={{ fontSize: 12, color: colors.muted }}>الفئات: <span style={{ color: colors.text, fontWeight: 600 }}>{(categories || []).filter(cat => cat.items?.length > 0).length}</span></div>
            <div style={{ fontSize: 12, color: colors.muted }}>البنود: <span style={{ color: colors.text, fontWeight: 600 }}>{(categories || []).reduce((sum, cat) => sum + (cat.items?.length || 0), 0)}</span></div>
            <div style={{ fontSize: 12, color: colors.muted }}>المساحة: <span style={{ color: colors.text, fontWeight: 600 }}>{(categories || []).reduce((sum, cat) => sum + getCategoryTotalArea(cat), 0)} م²</span></div>
          </div>
        </div>
      )}
    </>
  );
};

export default CalculatorSection;
