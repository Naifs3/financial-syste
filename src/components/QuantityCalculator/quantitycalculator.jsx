// QuantityCalculator.jsx - مكون حاسبة الكميات
// يمكن استيراده في التطبيق الرئيسي

import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

const QuantityCalculator = ({ db, darkMode, currentUser }) => {
  const colors = {
    bg: darkMode ? '#0f172a' : '#f8fafc',
    card: darkMode ? '#1e293b' : '#ffffff',
    border: darkMode ? '#334155' : '#e2e8f0',
    text: darkMode ? '#f1f5f9' : '#1e293b',
    muted: darkMode ? '#94a3b8' : '#64748b',
    primary: '#3b82f6',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    cyan: '#06b6d4',
    purple: '#a855f7',
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

  const defaultPlacesData = ['دورة مياه 1', 'دورة مياه 2', 'مجلس 1', 'مجلس 2', 'غرفة نوم 1', 'غرفة نوم 2', 'مطبخ 1', 'صالة 1', 'صالة 2', 'ممر 1', 'ممر 2', 'مدخل 1', 'مكتب 1', 'بلكونة 1', 'حوش 1', 'ملحق 1', 'مستودع 1'];
  const predefinedConditions = ['غير شامل الفك أو الإزالة', 'غير شامل نقل الركام', 'غير شامل المواد', 'غير شامل الحاوية', 'غير شامل التنظيف', 'السعر لا يشمل ضريبة القيمة المضافة', 'يتطلب معاينة قبل البدء'];
  const dimOptions = [1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,12,14,16,18,20,25,30];
  const heightOptions = [2,2.5,3,3.5,4,4.5,5,5.5,6];

  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(true);
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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'calculator_places'), orderBy('createdAt', 'asc')), (snapshot) => {
      const places = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
      setAvailablePlaces(places);
      setPlacesLoading(false);
      if (places.length === 0) defaultPlacesData.forEach(name => addDoc(collection(db, 'calculator_places'), { name, createdAt: serverTimestamp() }));
    }, () => setPlacesLoading(false));
    return () => unsubscribe();
  }, [db]);

  const toast = (msg) => { setToastMessage(msg); setShowToast(true); setTimeout(() => setShowToast(false), 2000); };
  const formatNumber = (n) => n?.toLocaleString('en-US') || '0';
  const placeArea = dimensions.length * dimensions.width;
  const placesList = availablePlaces.map(p => p.name);
  const calcArea = (place) => {
    const type = place.measureType || 'floor';
    const l = place.length || 4, w = place.width || 4, h = place.height || 3;
    if (type === 'floor' || type === 'ceiling') return l * w;
    if (type === 'walls') return (l + w) * 2 * h;
    if (type === 'linear') return l;
    if (type === 'manual') return place.manualArea || 0;
    return l * w;
  };
  const getItemArea = (item) => (item.places || []).reduce((sum, p) => sum + (p.area || 0), 0);
  const getCategoryTotalArea = (cat) => (cat.items || []).reduce((sum, item) => sum + getItemArea(item), 0);
  const getCategoryItemsTotal = (cat) => (cat.items || []).reduce((sum, item) => sum + getItemArea(item) * item.price, 0);
  const calculateCategoryTotals = (cat) => {
    const totalPrice = getCategoryItemsTotal(cat);
    const containerValue = cat.options?.containerState === 'with' ? (cat.options?.totalsContainerAmount || 0) : 0;
    const materialsValue = cat.options?.materialsState === 'with' ? (cat.options?.materialsAmount || 0) : 0;
    const baseTotal = totalPrice + containerValue + materialsValue + (cat.options?.customAmount || 0);
    const profitAmount = baseTotal * (cat.options?.profitPercent || 0) / 100;
    const withProfit = baseTotal + profitAmount;
    const discountByPercent = withProfit * (cat.options?.discountPercent || 0) / 100;
    const afterDiscount = withProfit - discountByPercent - (cat.options?.discountAmount || 0);
    const taxAmount = afterDiscount * (cat.options?.taxPercent || 0) / 100;
    return { totalPrice, containerValue, materialsValue, profitAmount, discountByPercent, taxAmount, finalTotal: afterDiscount + taxAmount };
  };
  const getGrandTotal = () => categories.reduce((sum, cat) => sum + calculateCategoryTotals(cat).finalTotal, 0);
  const toggleCheck = (placeName) => setCheckedPlaces(prev => prev.includes(placeName) ? prev.filter(p => p !== placeName) : [...prev, placeName]);
  const addNewPlaceToList = async (name) => { if (!name.trim()) return; await addDoc(collection(db, 'calculator_places'), { name: name.trim(), createdAt: serverTimestamp() }); setNewPlaceInput(''); setShowAddNewInput(false); toast('تمت إضافة المكان'); };
  const deletePlaceFromList = async (placeId, placeName) => { if (!window.confirm(`حذف "${placeName}"؟`)) return; await deleteDoc(doc(db, 'calculator_places', placeId)); setCheckedPlaces(prev => prev.filter(p => p !== placeName)); toast('تم الحذف'); };

  const addCheckedPlacesToCategories = () => {
    if (checkedPlaces.length === 0) { toast('اختر أماكن أولاً'); return; }
    const activeCatKeys = Object.keys(activeMainItems).filter(k => activeMainItems[k]);
    if (activeCatKeys.length === 0) { toast('اختر بند رئيسي أولاً'); return; }
    const newPlaces = checkedPlaces.map((name, i) => ({ id: `place_${Date.now()}_${i}`, name, length: dimensions.length, width: dimensions.width, height: dimensions.height, area: placeArea, measureType: 'floor' }));
    setCategories(prev => {
      let updated = [...prev];
      let lastCatId = null;
      activeCatKeys.forEach(catKey => {
        const catConfig = workItems[catKey];
        if (!catConfig) return;
        const existingIdx = updated.findIndex(c => c.code === catConfig.code);
        if (existingIdx !== -1) {
          updated[existingIdx] = { ...updated[existingIdx], pendingPlaces: [...(updated[existingIdx].pendingPlaces || []), ...newPlaces.map((p, i) => ({ ...p, id: `${p.id}_${catKey}_${i}` }))] };
          lastCatId = updated[existingIdx].id;
        } else {
          const newCatId = `cat_${Date.now()}_${catKey}`;
          updated.push({
            id: newCatId, code: catConfig.code, name: catConfig.name, color: catConfig.color,
            subItems: catConfig.items.map(item => ({ code: `${catConfig.code}${item.num}`, name: item.name, price: item.price, group: catConfig.name })),
            items: [], pendingPlaces: newPlaces.map((p, i) => ({ ...p, id: `${p.id}_${catKey}_new_${i}` })), categoryConditions: [],
            options: { containerState: 'notMentioned', totalsContainerAmount: 0, materialsState: 'notMentioned', materialsAmount: 0, showMeters: true, customAmount: 0, profitPercent: 0, discountPercent: 0, discountAmount: 0, taxPercent: 15 }
          });
          lastCatId = newCatId;
        }
      });
      if (lastCatId) setTimeout(() => setExpandedCategory(lastCatId), 50);
      return updated;
    });
    setCheckedPlaces([]);
    toast(`تمت إضافة ${newPlaces.length} مكان`);
  };

  const selectPendingSubItem = (catId, placeId, subItemCode) => {
    if (!subItemCode) return;
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      const subItem = cat.subItems?.find(s => s.code === subItemCode);
      const place = cat.pendingPlaces?.find(p => p.id === placeId);
      if (!subItem || !place) return cat;
      return { ...cat, items: [...(cat.items || []), { id: `item_${Date.now()}`, code: subItem.code, name: subItem.name, price: subItem.price, places: [{ ...place }], conditions: [] }], pendingPlaces: cat.pendingPlaces.filter(p => p.id !== placeId) };
    }));
    toast('تم إضافة البند');
  };

  const changeSubItem = (catId, itemId, newCode) => setCategories(prev => prev.map(cat => { if (cat.id !== catId) return cat; const sub = cat.subItems?.find(s => s.code === newCode); if (!sub) return cat; return { ...cat, items: cat.items.map(item => item.id === itemId ? { ...item, code: sub.code, name: sub.name, price: sub.price } : item) }; }));
  const updatePlace = (catId, itemId, placeId, field, value) => setCategories(prev => prev.map(cat => { if (cat.id !== catId) return cat; return { ...cat, items: cat.items.map(item => { if (item.id !== itemId) return item; return { ...item, places: item.places.map(place => { if (place.id !== placeId) return place; const updated = { ...place, [field]: field === 'name' || field === 'measureType' ? value : parseFloat(value) || 0 }; if (field === 'manualArea') updated.area = parseFloat(value) || 0; else if (field !== 'area') updated.area = calcArea(updated); return updated; }) }; }) }; }));
  const addPlace = (catId, itemId) => setCategories(prev => prev.map(cat => { if (cat.id !== catId) return cat; return { ...cat, items: cat.items.map(item => item.id !== itemId ? item : { ...item, places: [...item.places, { id: `place_${Date.now()}`, name: placesList[0] || 'مكان', length: 4, width: 4, height: 3, area: 16, measureType: 'floor' }] }) }; }));
  const deletePlace = (catId, itemId, placeId) => setCategories(prev => prev.map(cat => { if (cat.id !== catId) return cat; return { ...cat, items: cat.items.map(item => item.id !== itemId ? item : { ...item, places: item.places.filter(p => p.id !== placeId) }) }; }));
  const deleteItem = (catId, itemId) => { setCategories(prev => prev.map(cat => cat.id !== catId ? cat : { ...cat, items: cat.items.filter(item => item.id !== itemId) })); setEditingItemId(null); };
  const duplicateItem = (catId, itemId) => { const newId = `item_${Date.now()}`; setCategories(prev => prev.map(cat => { if (cat.id !== catId) return cat; const original = cat.items.find(item => item.id === itemId); if (!original) return cat; return { ...cat, items: [...cat.items, { ...original, id: newId, places: original.places.map(p => ({ ...p, id: `place_${Date.now()}_${Math.random()}` })) }] }; })); setEditingItemId(newId); };
  const deleteCategory = (catId) => { setCategories(prev => prev.filter(c => c.id !== catId)); setExpandedCategory(null); };
  const addCondition = (catId, itemId, text) => { if (!text.trim()) return; setCategories(prev => prev.map(cat => { if (cat.id !== catId) return cat; return { ...cat, items: cat.items.map(item => item.id !== itemId ? item : { ...item, conditions: [...(item.conditions || []), text.trim()] }) }; })); };
  const deleteCondition = (catId, itemId, idx) => setCategories(prev => prev.map(cat => { if (cat.id !== catId) return cat; return { ...cat, items: cat.items.map(item => item.id !== itemId ? item : { ...item, conditions: item.conditions.filter((_, i) => i !== idx) }) }; }));
  const addCategoryCondition = (catId, text) => { if (!text.trim()) return; setCategories(prev => prev.map(cat => cat.id !== catId ? cat : { ...cat, categoryConditions: [...(cat.categoryConditions || []), text.trim()] })); };
  const deleteCategoryCondition = (catId, idx) => setCategories(prev => prev.map(cat => cat.id !== catId ? cat : { ...cat, categoryConditions: cat.categoryConditions.filter((_, i) => i !== idx) }));
  const updateCategoryOptions = (catId, field, value) => setCategories(prev => prev.map(cat => cat.id === catId ? { ...cat, options: { ...cat.options, [field]: value } } : cat));
  const newQuote = () => { setCategories([]); setCheckedPlaces([]); setActiveMainItems({}); setExpandedCategory(null); toast('عرض جديد'); };

  const selectStyle = { appearance: 'none', paddingLeft: 28, paddingRight: 12, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='3'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'left 8px center', backgroundColor: 'transparent' };

  if (placesLoading) return <div style={{ textAlign: 'center', padding: 60 }}><div style={{ fontSize: 50, marginBottom: 16 }}>⏳</div><p style={{ color: colors.muted }}>جاري التحميل...</p></div>;

  return (
    <div style={{ fontFamily: 'system-ui' }}>
      {/* نموذج الإدخال السريع */}
      <div style={{ background: colors.card, borderRadius: 16, border: `2px solid ${colors.primary}`, overflow: 'hidden', marginBottom: 20 }}>
        <div onClick={() => setPhase1Expanded(!phase1Expanded)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 16, background: `${colors.primary}10` }}>
          <div style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.cyan})`, padding: '12px 16px', borderRadius: 10, marginLeft: 12 }}><span style={{ fontSize: 24 }}>📐</span></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>نموذج إدخال سريع</div>
            <div style={{ fontSize: 11, color: colors.muted }}>🏗️ {Object.values(activeMainItems).filter(v => v).length} بنود • 📍 {checkedPlaces.length} أماكن</div>
          </div>
          <span style={{ fontSize: 16, color: colors.primary, transform: phase1Expanded ? 'rotate(180deg)' : 'none', transition: '0.3s' }}>▼</span>
        </div>
        {phase1Expanded && (
          <div style={{ padding: 16, borderTop: `1px dashed ${colors.primary}40` }}>
            {/* الخطوة 1 */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 26, height: 26, borderRadius: 6, background: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>1</div>
                <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>اختر الأماكن</span>
                {checkedPlaces.length > 0 && <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700, background: colors.success, color: '#fff', marginRight: 'auto' }}>{checkedPlaces.length} مكان</span>}
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: 2, minWidth: 200, position: 'relative' }}>
                  <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} style={{ width: '100%', height: 36, padding: '0 30px 0 12px', borderRadius: isDropdownOpen ? '6px 6px 0 0' : '6px', border: `1px solid ${isDropdownOpen ? colors.primary : colors.border}`, background: colors.card, color: colors.text, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {checkedPlaces.length === 0 ? <span style={{ color: colors.muted }}>اختر أماكن...</span> : <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', overflow: 'hidden' }}>{checkedPlaces.slice(0, 3).map(p => <span key={p} style={{ background: colors.primary, color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 10 }}>{p}</span>)}{checkedPlaces.length > 3 && <span style={{ background: '#64748b', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: 10 }}>+{checkedPlaces.length - 3}</span>}</div>}
                    <span style={{ position: 'absolute', left: 12, color: colors.muted, fontSize: 10 }}>▼</span>
                  </div>
                  {isDropdownOpen && (
                    <div style={{ position: 'absolute', top: '100%', right: 0, left: 0, background: colors.card, border: `1px solid ${colors.primary}`, borderTop: 'none', borderRadius: '0 0 6px 6px', maxHeight: 280, overflowY: 'auto', zIndex: 100 }}>
                      <div style={{ padding: '10px 12px', borderBottom: `1px dashed ${colors.primary}`, background: `${colors.success}10` }}>
                        {!showAddNewInput ? <button onClick={(e) => { e.stopPropagation(); setShowAddNewInput(true); }} style={{ width: '100%', height: 32, borderRadius: 6, border: `1px dashed ${colors.success}`, background: 'transparent', color: colors.success, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>➕ إضافة مكان جديد</button> : <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}><input type="text" value={newPlaceInput} onChange={e => setNewPlaceInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addNewPlaceToList(newPlaceInput); }} placeholder="اسم المكان..." autoFocus style={{ flex: 1, height: 32, padding: '0 10px', borderRadius: 6, border: `1px solid ${colors.success}`, background: colors.bg, color: colors.text, fontSize: 11 }} /><button onClick={() => addNewPlaceToList(newPlaceInput)} style={{ height: 32, padding: '0 12px', borderRadius: 6, border: 'none', background: colors.success, color: '#fff', fontSize: 11, cursor: 'pointer' }}>إضافة</button><button onClick={() => { setShowAddNewInput(false); setNewPlaceInput(''); }} style={{ height: 32, padding: '0 10px', borderRadius: 6, border: `1px solid ${colors.danger}`, background: 'transparent', color: colors.danger, fontSize: 11, cursor: 'pointer' }}>✕</button></div>}
                      </div>
                      {availablePlaces.map(place => {
                        const isChecked = checkedPlaces.includes(place.name);
                        return <div key={place.id} onClick={(e) => { e.stopPropagation(); toggleCheck(place.name); }} style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', borderBottom: `1px solid ${colors.border}`, background: isChecked ? `${colors.primary}15` : 'transparent' }}><div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${isChecked ? colors.primary : colors.border}`, background: isChecked ? colors.primary : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff' }}>{isChecked && '✓'}</div><span style={{ flex: 1, fontSize: 12, color: isChecked ? colors.primary : colors.text, fontWeight: isChecked ? 600 : 400 }}>{place.name}</span><button onClick={(e) => { e.stopPropagation(); deletePlaceFromList(place.id, place.name); }} style={{ width: 22, height: 22, borderRadius: 4, border: `1px solid ${colors.danger}30`, background: `${colors.danger}10`, color: colors.danger, fontSize: 10, cursor: 'pointer', opacity: 0.6 }}>✕</button></div>;
                      })}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: colors.bg, padding: '0 8px', borderRadius: 6, border: `1px solid ${colors.border}`, height: 36 }}><span style={{ fontSize: 10, color: colors.muted }}>ط:</span><select style={{ ...selectStyle, border: 'none', color: colors.text, fontSize: 12, fontWeight: 600, width: 40 }} value={dimensions.length} onChange={e => setDimensions({ ...dimensions, length: parseFloat(e.target.value) })}>{dimOptions.map(n => <option key={n} value={n}>{n}</option>)}</select></div>
                <span style={{ color: colors.muted }}>×</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: colors.bg, padding: '0 8px', borderRadius: 6, border: `1px solid ${colors.border}`, height: 36 }}><span style={{ fontSize: 10, color: colors.muted }}>ع:</span><select style={{ ...selectStyle, border: 'none', color: colors.text, fontSize: 12, fontWeight: 600, width: 40 }} value={dimensions.width} onChange={e => setDimensions({ ...dimensions, width: parseFloat(e.target.value) })}>{dimOptions.map(n => <option key={n} value={n}>{n}</option>)}</select></div>
                <span style={{ color: colors.muted }}>=</span>
                <div style={{ background: `${colors.success}15`, padding: '0 10px', borderRadius: 6, height: 36, display: 'flex', alignItems: 'center', border: `1px solid ${colors.success}30` }}><span style={{ fontSize: 13, fontWeight: 700, color: colors.success }}>{placeArea} م²</span></div>
              </div>
              {checkedPlaces.length > 0 && (
                <div style={{ background: `${colors.primary}10`, border: `1px solid ${colors.primary}30`, borderRadius: 6, padding: 12 }}>
                  <div style={{ fontSize: 11, color: colors.primary, fontWeight: 600, marginBottom: 10 }}>📍 الأماكن المحددة ({checkedPlaces.length})</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{checkedPlaces.map(p => <span key={p} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 6, background: colors.primary, color: '#fff', fontSize: 11, fontWeight: 600 }}>{p} <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 5px', borderRadius: 4, fontSize: 9 }}>{placeArea} م²</span><span style={{ cursor: 'pointer', color: '#fca5a5' }} onClick={() => toggleCheck(p)}>✕</span></span>)}</div>
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px dashed ${colors.primary}30`, display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 11, color: colors.muted }}>إجمالي المساحة:</span><span style={{ fontSize: 15, fontWeight: 700, color: colors.success }}>{checkedPlaces.length * placeArea} م²</span></div>
                </div>
              )}
            </div>
            {/* الخطوة 2 */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}><div style={{ width: 26, height: 26, borderRadius: 6, background: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>2</div><span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>اختر بنود الأعمال</span></div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{Object.entries(workItems).map(([key, cat]) => { const isActive = activeMainItems[key]; return <button key={key} onClick={() => setActiveMainItems(prev => ({ ...prev, [key]: !prev[key] }))} style={{ height: 36, padding: '0 12px', borderRadius: 6, border: `1px solid ${isActive ? cat.color : colors.border}`, background: isActive ? `${cat.color}20` : 'transparent', color: isActive ? cat.color : colors.muted, fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}><span>{cat.icon}</span><span>{cat.name}</span>{isActive && <span>✓</span>}</button>; })}</div>
            </div>
            <button onClick={addCheckedPlacesToCategories} disabled={checkedPlaces.length === 0 || !Object.values(activeMainItems).some(v => v)} style={{ width: '100%', height: 50, borderRadius: 8, border: 'none', background: (checkedPlaces.length > 0 && Object.values(activeMainItems).some(v => v)) ? `linear-gradient(135deg, ${colors.success}, #059669)` : colors.bg, color: (checkedPlaces.length > 0 && Object.values(activeMainItems).some(v => v)) ? '#fff' : colors.muted, fontSize: 14, fontWeight: 700, cursor: (checkedPlaces.length > 0 && Object.values(activeMainItems).some(v => v)) ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}><span style={{ fontSize: 20 }}>➕</span><span>إضافة الأماكن للبنود المحددة</span></button>
          </div>
        )}
      </div>

      {/* حالة فارغة */}
      {categories.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: colors.muted, background: colors.card, borderRadius: 16, border: `1px solid ${colors.border}` }}><div style={{ fontSize: 50, marginBottom: 16, opacity: 0.3 }}>📦</div><div style={{ fontWeight: 600, marginBottom: 8 }}>لا توجد فئات</div><p style={{ fontSize: 12 }}>استخدم النموذج أعلاه لإضافة بنود</p></div>}

      {/* الفئات */}
      {categories.map(cat => {
        const isExpanded = expandedCategory === cat.id;
        const catTotals = calculateCategoryTotals(cat);
        const catTotalArea = getCategoryTotalArea(cat);
        const pendingPlaces = cat.pendingPlaces || [];
        const items = cat.items || [];
        return (
          <div key={cat.id} style={{ background: colors.card, borderRadius: 16, overflow: 'hidden', marginBottom: 12, border: `2px solid ${isExpanded ? cat.color : colors.border}` }}>
            <div onClick={() => setExpandedCategory(isExpanded ? null : cat.id)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 16, background: isExpanded ? `${cat.color}10` : 'transparent' }}>
              <div style={{ width: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: 12 }}><span style={{ fontSize: 28 }}>{workItems[cat.code]?.icon || '📦'}</span><span style={{ fontSize: 10, fontWeight: 700, color: cat.color }}>{cat.code}</span></div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 17, fontWeight: 700, color: colors.text }}>{cat.name}</div>{pendingPlaces.length > 0 && <div style={{ background: `${colors.warning}20`, border: `1px solid ${colors.warning}`, borderRadius: 6, padding: '4px 8px', marginTop: 6, fontSize: 11, color: colors.warning, display: 'inline-block' }}>⚠️ {pendingPlaces.length} مكان معلق</div>}<div style={{ fontSize: 11, color: colors.muted, marginTop: 4 }}>📦 {items.length} بنود • 📐 {catTotalArea} م²</div></div>
              <div style={{ textAlign: 'center', marginLeft: 12 }}><div style={{ fontSize: 9, color: colors.muted }}>الإجمالي</div><div style={{ fontSize: 20, fontWeight: 700, color: colors.success }}>{formatNumber(catTotals.finalTotal)}</div></div>
              <span style={{ fontSize: 16, color: cat.color, marginRight: 12, transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.3s' }}>▼</span>
            </div>
            {isExpanded && (
              <div style={{ padding: 16, borderTop: `1px dashed ${cat.color}40` }}>
                {pendingPlaces.length > 0 && (
                  <div style={{ marginBottom: 16, background: `${colors.warning}15`, borderRadius: 12, padding: 14, border: `2px solid ${colors.warning}` }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: colors.warning, marginBottom: 12 }}>⚠️ أماكن تحتاج اختيار البند الفرعي ({pendingPlaces.length})</div>
                    {pendingPlaces.map(place => <div key={place.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, padding: 12, background: colors.card, borderRadius: 8, border: `1px solid ${colors.border}` }}><div style={{ minWidth: 120 }}><div style={{ fontWeight: 600, color: colors.text, fontSize: 14 }}>{place.name}</div><div style={{ fontSize: 12, color: colors.muted }}>{place.area} م²</div></div><select defaultValue="" onChange={(e) => selectPendingSubItem(cat.id, place.id, e.target.value)} style={{ ...selectStyle, flex: 1, padding: 12, borderRadius: 8, border: `2px solid ${cat.color}`, background: colors.bg, color: colors.text, fontSize: 14, cursor: 'pointer' }}><option value="">-- اختر البند الفرعي --</option>{(cat.subItems || []).map(s => <option key={s.code} value={s.code}>[{s.code}] {s.name} - {s.price} ﷼/م²</option>)}</select></div>)}
                  </div>
                )}
                {items.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: colors.text, marginBottom: 10 }}>📦 البنود ({items.length})</div>
                    {items.map(item => {
                      const isEditing = editingItemId === item.id;
                      const itemArea = getItemArea(item);
                      const itemTotal = itemArea * item.price;
                      return (
                        <div key={item.id} style={{ background: colors.bg, borderRadius: 10, marginBottom: 8, border: isEditing ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`, overflow: 'hidden' }}>
                          <div onClick={() => setEditingItemId(isEditing ? null : item.id)} style={{ display: 'flex', alignItems: 'center', padding: 12, cursor: 'pointer', background: isEditing ? `${colors.primary}10` : 'transparent' }}>
                            <div style={{ background: cat.color, padding: '6px 10px', borderRadius: 6, marginLeft: 10 }}><span style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>{item.code}</span></div>
                            <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{item.name}</div><div style={{ fontSize: 11, color: colors.muted }}>📍 {item.places?.map(p => p.name).join('، ')} • {itemArea} م² • {item.price} ﷼/م²</div></div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: colors.success }}>{formatNumber(itemTotal)} ﷼</div>
                            <span style={{ marginRight: 10, color: isEditing ? colors.primary : colors.muted }}>⚙️</span>
                          </div>
                          {isEditing && (
                            <div style={{ padding: 12, borderTop: `1px dashed ${colors.primary}30`, background: `${colors.primary}05` }}>
                              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}><select value={item.code} onChange={(e) => changeSubItem(cat.id, item.id, e.target.value)} style={{ ...selectStyle, flex: 1, height: 32, borderRadius: 6, border: `1px solid ${colors.border}`, backgroundColor: colors.bg, color: colors.text, fontSize: 12 }}>{(cat.subItems || []).map(s => <option key={s.code} value={s.code}>[{s.code}] {s.name} - {s.price} ﷼</option>)}</select><button onClick={() => duplicateItem(cat.id, item.id)} style={{ height: 32, padding: '0 10px', borderRadius: 6, border: `1px solid ${colors.success}`, background: `${colors.success}15`, color: colors.success, fontSize: 11, cursor: 'pointer' }}>+ نسخ</button></div>
                              <div style={{ fontSize: 11, color: colors.muted, marginBottom: 6 }}>📍 الأماكن:</div>
                              {(item.places || []).map(place => <div key={place.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: 8, marginBottom: 6, background: `${colors.primary}08`, borderRadius: 6, flexWrap: 'wrap' }}><select value={place.name} onChange={(e) => updatePlace(cat.id, item.id, place.id, 'name', e.target.value)} style={{ ...selectStyle, minWidth: 80, height: 28, borderRadius: 4, border: `1px solid ${colors.border}`, backgroundColor: colors.bg, color: colors.text, fontSize: 11 }}>{placesList.map(p => <option key={p} value={p}>{p}</option>)}</select><select value={place.measureType || 'floor'} onChange={(e) => updatePlace(cat.id, item.id, place.id, 'measureType', e.target.value)} style={{ ...selectStyle, width: 65, height: 28, borderRadius: 4, border: `1px solid ${colors.cyan}`, backgroundColor: '#0c4a6e', color: '#7dd3fc', fontSize: 11 }}><option value="floor">أرضي</option><option value="ceiling">سقف</option><option value="walls">جدران</option><option value="linear">طولي</option><option value="manual">يدوي</option></select>{place.measureType === 'manual' ? <input type="number" value={place.area || ''} onChange={(e) => updatePlace(cat.id, item.id, place.id, 'manualArea', e.target.value)} style={{ width: 50, height: 28, borderRadius: 4, border: `1px solid ${colors.success}`, background: colors.bg, color: colors.success, fontSize: 11, textAlign: 'center' }} /> : <><select value={place.length} onChange={(e) => updatePlace(cat.id, item.id, place.id, 'length', e.target.value)} style={{ ...selectStyle, width: 50, height: 28, borderRadius: 4, border: `1px solid ${colors.border}`, backgroundColor: colors.bg, color: colors.text, fontSize: 11 }}>{dimOptions.map(n => <option key={n} value={n}>{n}</option>)}</select><span style={{ color: colors.muted }}>×</span><select value={place.width} onChange={(e) => updatePlace(cat.id, item.id, place.id, 'width', e.target.value)} style={{ ...selectStyle, width: 50, height: 28, borderRadius: 4, border: `1px solid ${colors.border}`, backgroundColor: colors.bg, color: colors.text, fontSize: 11 }}>{dimOptions.map(n => <option key={n} value={n}>{n}</option>)}</select></>}{place.measureType === 'walls' && <select value={place.height || 3} onChange={(e) => updatePlace(cat.id, item.id, place.id, 'height', e.target.value)} style={{ ...selectStyle, width: 50, height: 28, borderRadius: 4, border: `1px solid ${colors.purple}`, backgroundColor: colors.bg, color: colors.purple, fontSize: 11 }}>{heightOptions.map(n => <option key={n} value={n}>{n}</option>)}</select>}<span style={{ padding: '4px 8px', borderRadius: 4, background: `${colors.success}20`, color: colors.success, fontSize: 11, fontWeight: 600 }}>{place.area} م²</span><button onClick={() => deletePlace(cat.id, item.id, place.id)} style={{ width: 24, height: 24, borderRadius: 4, border: `1px solid ${colors.danger}50`, background: `${colors.danger}10`, color: colors.danger, fontSize: 11, cursor: 'pointer' }}>✕</button></div>)}
                              <button onClick={() => addPlace(cat.id, item.id)} style={{ width: '100%', height: 28, borderRadius: 6, border: `1px solid ${colors.success}`, background: `${colors.success}10`, color: colors.success, fontSize: 11, cursor: 'pointer', marginBottom: 12 }}>+ إضافة مكان</button>
                              <div style={{ fontSize: 11, color: colors.warning, marginBottom: 6 }}>📋 الشروط:</div>
                              {(item.conditions || []).map((c, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', marginBottom: 4, background: `${colors.warning}10`, borderRadius: 4, fontSize: 11, color: colors.text }}><span style={{ flex: 1 }}>{c}</span><button onClick={() => deleteCondition(cat.id, item.id, i)} style={{ width: 20, height: 20, borderRadius: 4, border: 'none', background: `${colors.danger}20`, color: colors.danger, fontSize: 10, cursor: 'pointer' }}>✕</button></div>)}
                              <select onChange={(e) => { if (e.target.value) { addCondition(cat.id, item.id, e.target.value); e.target.value = ''; } }} style={{ ...selectStyle, width: '100%', height: 28, borderRadius: 4, border: `1px solid ${colors.warning}`, backgroundColor: colors.bg, color: colors.text, fontSize: 11, marginBottom: 12 }}><option value="">+ إضافة شرط...</option>{predefinedConditions.filter(c => !(item.conditions || []).includes(c)).map((c, i) => <option key={i} value={c}>{c}</option>)}</select>
                              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}><button onClick={() => deleteItem(cat.id, item.id)} style={{ height: 28, padding: '0 12px', borderRadius: 6, border: `1px solid ${colors.danger}`, background: `${colors.danger}10`, color: colors.danger, fontSize: 11, cursor: 'pointer' }}>🗑️ حذف</button><button onClick={() => setEditingItemId(null)} style={{ height: 28, padding: '0 12px', borderRadius: 6, border: `1px solid ${colors.success}`, background: `${colors.success}10`, color: colors.success, fontSize: 11, cursor: 'pointer' }}>✓ تم</button></div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {/* تبويبات */}
                <div style={{ background: darkMode ? '#1e293b' : '#f1f5f9', borderRadius: 10, overflow: 'hidden', border: `1px solid ${colors.border}` }}>
                  <div style={{ display: 'flex', borderBottom: `1px solid ${colors.border}` }}><button onClick={() => setActiveTab({ ...activeTab, [cat.id]: 'conditions' })} style={{ flex: 1, padding: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: (activeTab[cat.id] || 'conditions') === 'conditions' ? `${colors.warning}15` : 'transparent', color: (activeTab[cat.id] || 'conditions') === 'conditions' ? colors.warning : colors.muted, border: 'none' }}>📋 الشروط</button><button onClick={() => setActiveTab({ ...activeTab, [cat.id]: 'price' })} style={{ flex: 1, padding: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: activeTab[cat.id] === 'price' ? `${colors.primary}15` : 'transparent', color: activeTab[cat.id] === 'price' ? colors.primary : colors.muted, border: 'none' }}>💰 السعر</button></div>
                  {(activeTab[cat.id] || 'conditions') === 'conditions' && (
                    <div style={{ padding: 12 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 12 }}><div onClick={() => { const s = ['with', 'notMentioned', 'without']; const i = s.indexOf(cat.options?.containerState || 'notMentioned'); updateCategoryOptions(cat.id, 'containerState', s[(i + 1) % 3]); }} style={{ height: 32, borderRadius: 6, border: `1px solid ${cat.options?.containerState === 'with' ? colors.warning : colors.border}`, background: cat.options?.containerState === 'with' ? `${colors.warning}20` : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: colors.text, fontSize: 11, fontWeight: 600 }}>🚛 {cat.options?.containerState === 'with' ? 'شامل' : cat.options?.containerState === 'without' ? 'بدون' : 'الحاوية'}</div><div onClick={() => { const s = ['with', 'notMentioned', 'without']; const i = s.indexOf(cat.options?.materialsState || 'notMentioned'); updateCategoryOptions(cat.id, 'materialsState', s[(i + 1) % 3]); }} style={{ height: 32, borderRadius: 6, border: `1px solid ${cat.options?.materialsState === 'with' ? colors.success : colors.border}`, background: cat.options?.materialsState === 'with' ? `${colors.success}20` : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: colors.text, fontSize: 11, fontWeight: 600 }}>🧱 {cat.options?.materialsState === 'with' ? 'شامل' : cat.options?.materialsState === 'without' ? 'بدون' : 'المواد'}</div><div onClick={() => updateCategoryOptions(cat.id, 'showMeters', !cat.options?.showMeters)} style={{ height: 32, borderRadius: 6, border: `1px solid ${cat.options?.showMeters ? colors.cyan : colors.border}`, background: cat.options?.showMeters ? `${colors.cyan}20` : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: colors.text, fontSize: 11, fontWeight: 600 }}>📏 الأمتار</div></div>
                      {cat.options?.containerState === 'with' && <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><span style={{ fontSize: 11, color: colors.warning }}>مبلغ الحاوية:</span><input type="number" value={cat.options?.totalsContainerAmount || ''} onChange={(e) => updateCategoryOptions(cat.id, 'totalsContainerAmount', parseFloat(e.target.value) || 0)} style={{ width: 80, height: 28, borderRadius: 4, border: `1px solid ${colors.warning}`, background: colors.bg, color: colors.text, fontSize: 11, textAlign: 'center' }} /><span style={{ fontSize: 11, color: colors.muted }}>﷼</span></div>}
                      {cat.options?.materialsState === 'with' && <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><span style={{ fontSize: 11, color: colors.success }}>مبلغ المواد:</span><input type="number" value={cat.options?.materialsAmount || ''} onChange={(e) => updateCategoryOptions(cat.id, 'materialsAmount', parseFloat(e.target.value) || 0)} style={{ width: 80, height: 28, borderRadius: 4, border: `1px solid ${colors.success}`, background: colors.bg, color: colors.text, fontSize: 11, textAlign: 'center' }} /><span style={{ fontSize: 11, color: colors.muted }}>﷼</span></div>}
                      {(cat.categoryConditions || []).length > 0 && <div style={{ marginBottom: 8 }}>{cat.categoryConditions.map((c, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', marginBottom: 4, background: `${colors.warning}10`, borderRadius: 4, fontSize: 11, color: colors.text }}><span style={{ flex: 1 }}>{c}</span><button onClick={() => deleteCategoryCondition(cat.id, i)} style={{ width: 20, height: 20, borderRadius: 4, border: 'none', background: `${colors.danger}20`, color: colors.danger, fontSize: 10, cursor: 'pointer' }}>✕</button></div>)}</div>}
                      <select onChange={(e) => { if (e.target.value) { addCategoryCondition(cat.id, e.target.value); e.target.value = ''; } }} style={{ ...selectStyle, width: '100%', height: 28, borderRadius: 4, border: `1px solid ${colors.warning}`, backgroundColor: colors.bg, color: colors.text, fontSize: 11 }}><option value="">+ إضافة شرط للفئة...</option>{predefinedConditions.filter(c => !(cat.categoryConditions || []).includes(c)).map((c, i) => <option key={i} value={c}>{c}</option>)}</select>
                    </div>
                  )}
                  {activeTab[cat.id] === 'price' && (
                    <div style={{ padding: 12 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: colors.muted }}><span>الأسعار الأساسية</span><span>{formatNumber(catTotals.totalPrice)} ﷼</span></div>
                        {cat.options?.containerState === 'with' && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: colors.warning }}><span>🚛 الحاوية</span><span>+{formatNumber(catTotals.containerValue)} ﷼</span></div>}
                        {cat.options?.materialsState === 'with' && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: colors.success }}><span>🧱 المواد</span><span>+{formatNumber(catTotals.materialsValue)} ﷼</span></div>}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}><span style={{ color: colors.success }}>إضافة %</span><input type="number" value={cat.options?.profitPercent || ''} onChange={(e) => updateCategoryOptions(cat.id, 'profitPercent', parseFloat(e.target.value) || 0)} style={{ width: 50, height: 24, borderRadius: 4, border: `1px solid ${colors.success}`, background: colors.bg, color: colors.text, fontSize: 11, textAlign: 'center' }} /><span style={{ marginRight: 'auto', color: catTotals.profitAmount > 0 ? colors.success : colors.muted }}>+{formatNumber(catTotals.profitAmount)} ﷼</span></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}><span style={{ color: colors.danger }}>خصم %</span><input type="number" value={cat.options?.discountPercent || ''} onChange={(e) => updateCategoryOptions(cat.id, 'discountPercent', parseFloat(e.target.value) || 0)} style={{ width: 50, height: 24, borderRadius: 4, border: `1px solid ${colors.danger}`, background: colors.bg, color: colors.text, fontSize: 11, textAlign: 'center' }} /><span style={{ marginRight: 'auto', color: catTotals.discountByPercent > 0 ? colors.danger : colors.muted }}>-{formatNumber(catTotals.discountByPercent)} ﷼</span></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}><span style={{ color: colors.primary }}>الضريبة %</span><input type="number" value={cat.options?.taxPercent || ''} onChange={(e) => updateCategoryOptions(cat.id, 'taxPercent', parseFloat(e.target.value) || 0)} style={{ width: 50, height: 24, borderRadius: 4, border: `1px solid ${colors.primary}`, background: colors.bg, color: colors.text, fontSize: 11, textAlign: 'center' }} /><span style={{ marginRight: 'auto', color: catTotals.taxAmount > 0 ? colors.primary : colors.muted }}>+{formatNumber(catTotals.taxAmount)} ﷼</span></div>
                        <div style={{ borderTop: `1px dashed ${colors.border}`, paddingTop: 8, marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 14, color: colors.muted }}>الإجمالي</span><span style={{ fontSize: 24, fontWeight: 800, color: colors.text }}>{formatNumber(catTotals.finalTotal)} ﷼</span></div>
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={() => deleteCategory(cat.id)} style={{ marginTop: 12, padding: '8px 16px', borderRadius: 6, border: `1px solid ${colors.danger}`, background: `${colors.danger}10`, color: colors.danger, fontSize: 11, cursor: 'pointer' }}>🗑️ حذف الفئة</button>
              </div>
            )}
          </div>
        );
      })}

      {/* الإجمالي */}
      {categories.length > 0 && (
        <div style={{ background: `linear-gradient(135deg, ${colors.success}20, ${colors.primary}20)`, borderRadius: 16, padding: 24, textAlign: 'center', marginTop: 20, border: `2px solid ${colors.success}` }}>
          <div style={{ color: colors.muted, marginBottom: 8 }}>💰 الإجمالي الكلي</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: colors.text }}>{formatNumber(getGrandTotal())}</div>
          <div style={{ color: colors.success, fontWeight: 600 }}>ريال سعودي</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 16, paddingTop: 16, borderTop: `1px dashed ${colors.border}` }}><span style={{ fontSize: 12, color: colors.muted }}>الفئات: <b style={{ color: colors.text }}>{categories.length}</b></span><span style={{ fontSize: 12, color: colors.muted }}>البنود: <b style={{ color: colors.text }}>{categories.reduce((s, c) => s + (c.items?.length || 0), 0)}</b></span><span style={{ fontSize: 12, color: colors.muted }}>المساحة: <b style={{ color: colors.text }}>{categories.reduce((s, c) => s + getCategoryTotalArea(c), 0)} م²</b></span></div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16 }}><button onClick={newQuote} style={{ padding: '12px 24px', borderRadius: 8, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.text, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>📄 عرض جديد</button></div>
        </div>
      )}

      {showToast && <div style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', background: colors.success, color: '#fff', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, zIndex: 1000, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>{toastMessage}</div>}
    </div>
  );
};

export default QuantityCalculator;
