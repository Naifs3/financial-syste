import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';

const QuantityCalculator = ({ darkMode, theme }) => {
  const t = theme;
  
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
    'مطبخ 1', 'مطبخ 2', 'مطبخ 3',
    'صالة 1', 'صالة 2', 'صالة 3', 'صالة 4',
    'ممر 1', 'ممر 2', 'ممر 3', 'ممر 4', 'ممر 5', 'ممر 6',
    'مدخل 1', 'مدخل 2', 'مكتب 1', 'مكتب 2',
    'غرفة طعام 1', 'غرفة طعام 2', 'غرفة غسيل 1', 'غرفة غسيل 2',
    'بلكونة 1', 'بلكونة 2', 'سطح 1', 'سطح 2',
    'حوش 1', 'حوش 2', 'ملحق 1', 'ملحق 2',
    'مستودع 1', 'مستودع 2', 'غرفة خادمة 1', 'غرفة خادمة 2',
    'غرفة سائق 1', 'غرفة سائق 2', 'مجلس نساء 1', 'مجلس نساء 2',
    'غرفة ملابس 1', 'غرفة ملابس 2', 'مغسلة 1', 'مغسلة 2'
  ];

  const dimOptions = [1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,12,14,16,18,20,25,30];
  const heightOptions = [2,2.5,3,3.5,4,4.5,5,5.5,6];

  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(true);
  const [checkedPlaces, setCheckedPlaces] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAddNewInput, setShowAddNewInput] = useState(false);
  const [newPlaceInput, setNewPlaceInput] = useState('');

  const [state, setState] = useState({
    quickEntryExpanded: true,
    selectedPlaces: [],
    placeLength: 4, placeWidth: 4, placeHeight: 3,
    length: 4, width: 4, height: 3,
    activeMainItems: {}, selectedSubs: {}, categories: {},
    expandedCat: null, showToast: false
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'calculator_places'), orderBy('createdAt', 'asc')),
      (snapshot) => {
        const places = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
        setAvailablePlaces(places);
        setPlacesLoading(false);
        if (places.length === 0) seedDefaultPlaces();
      },
      (error) => { console.error('Error:', error); setPlacesLoading(false); }
    );
    return () => unsubscribe();
  }, []);

  const seedDefaultPlaces = async () => {
    try {
      for (const name of defaultPlacesData) {
        await addDoc(collection(db, 'calculator_places'), { name, createdAt: new Date() });
      }
    } catch (e) { console.error(e); }
  };

  const addNewPlaceToList = async (name) => {
    if (!name.trim() || availablePlaces.some(p => p.name === name.trim())) return;
    try {
      await addDoc(collection(db, 'calculator_places'), { name: name.trim(), createdAt: new Date() });
      setNewPlaceInput(''); setShowAddNewInput(false);
      setCheckedPlaces(prev => [...prev, name.trim()]);
    } catch (e) { console.error(e); }
  };

  const deletePlaceFromList = async (placeId, placeName) => {
    if (!window.confirm(`هل تريد حذف "${placeName}" نهائياً؟`)) return;
    try {
      await deleteDoc(doc(db, 'calculator_places', placeId));
      setCheckedPlaces(prev => prev.filter(p => p !== placeName));
      setState(s => ({ ...s, selectedPlaces: s.selectedPlaces.filter(p => p.name !== placeName) }));
    } catch (e) { console.error(e); }
  };

  const fmt = n => n.toLocaleString('en-US');
  const genId = () => 'id' + Date.now() + Math.random().toString(36).substr(2,5);
  const placeArea = state.placeLength * state.placeWidth;
  const totalSelectedArea = state.selectedPlaces.reduce((sum, p) => sum + p.area, 0);
  const getSelectedMainItems = () => Object.keys(state.activeMainItems).filter(k => state.activeMainItems[k]);
  const getAllSubItems = () => {
    const subs = [];
    getSelectedMainItems().forEach(code => {
      workItems[code].items.forEach(item => {
        subs.push({ mainCode: code, code: `${code}${item.num}`, name: item.name, price: item.price, color: workItems[code].color });
      });
    });
    return subs;
  };
  const getSelectedSubsCount = () => Object.values(state.selectedSubs).filter(v => v).length;
  const calcCatTotals = cat => {
    const totalPrice = cat.items?.reduce((sum, item) => sum + (item.places?.reduce((s, p) => s + p.area, 0) || 0) * item.price, 0) || 0;
    const taxAmount = totalPrice * (cat.options?.taxPercent || 15) / 100;
    return { totalPrice, finalTotal: totalPrice + taxAmount };
  };
  const calcGrandTotal = () => Object.values(state.categories).reduce((sum, cat) => sum + calcCatTotals(cat).finalTotal, 0);
  const getTotalItems = () => Object.values(state.categories).reduce((sum, cat) => sum + (cat.items?.length || 0), 0);
  const hasCategories = () => Object.values(state.categories).some(cat => cat.items?.length > 0);

  const toggleCheck = (placeName) => {
    if (state.selectedPlaces.some(p => p.name === placeName)) return;
    setCheckedPlaces(prev => prev.includes(placeName) ? prev.filter(p => p !== placeName) : [...prev, placeName]);
  };

  const addCheckedPlacesToBox = () => {
    if (checkedPlaces.length === 0) return;
    const newPlaces = checkedPlaces.filter(name => !state.selectedPlaces.some(p => p.name === name))
      .map(name => ({ name, length: state.placeLength, width: state.placeWidth, height: state.placeHeight, area: state.placeLength * state.placeWidth }));
    setState(s => ({ ...s, selectedPlaces: [...s.selectedPlaces, ...newPlaces] }));
    setCheckedPlaces([]);
  };

  const removeFromBox = (placeName) => setState(s => ({ ...s, selectedPlaces: s.selectedPlaces.filter(p => p.name !== placeName) }));
  const toggleMainItem = code => setState(s => ({ ...s, activeMainItems: { ...s.activeMainItems, [code]: !s.activeMainItems[code] } }));
  const toggleSub = code => setState(s => ({ ...s, selectedSubs: { ...s.selectedSubs, [code]: !s.selectedSubs[code] } }));

  const addItems = () => {
    if (state.selectedPlaces.length === 0 || getSelectedSubsCount() === 0) return;
    const places = state.selectedPlaces.map(p => ({ name: p.name, length: p.length, width: p.width, height: p.height, area: p.area }));
    const newCats = { ...state.categories };
    Object.keys(state.selectedSubs).filter(k => state.selectedSubs[k]).forEach(code => {
      const sub = getAllSubItems().find(s => s.code === code);
      if (!sub) return;
      const catCode = sub.mainCode;
      if (!newCats[catCode]) {
        newCats[catCode] = { code: catCode, name: workItems[catCode].name, icon: workItems[catCode].icon, color: workItems[catCode].color, items: [], options: { taxPercent: 15 } };
      }
      if (!newCats[catCode].items.find(i => i.code === code)) {
        newCats[catCode].items.push({ id: genId(), code, name: sub.name, price: sub.price, places: [...places] });
      }
    });
    setState(s => ({ ...s, categories: newCats, selectedSubs: {}, activeMainItems: {}, selectedPlaces: [], showToast: true }));
    setTimeout(() => setState(s => ({ ...s, showToast: false })), 2000);
  };

  const btnHeight = '36px';
  const s = {
    container: { maxWidth: '900px', margin: '0 auto', padding: '16px', direction: 'rtl' },
    quickEntry: { background: t?.bg?.secondary || '#16213e', borderRadius: '6px', border: `2px solid ${t?.button?.primary || '#3b82f6'}`, marginBottom: '20px' },
    header: { padding: '16px', background: `linear-gradient(135deg, ${t?.button?.primary || '#3b82f6'}15, transparent)`, borderBottom: `1px dashed ${t?.button?.primary || '#3b82f6'}40`, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' },
    stepNum: { width: '26px', height: '26px', borderRadius: '6px', background: t?.button?.primary || '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#fff' },
    badge: { padding: '3px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: '700', background: '#10b981', color: '#fff', marginRight: 'auto' },
    dropdown: { flex: 2, minWidth: '200px', position: 'relative' },
    trigger: { width: '100%', height: btnHeight, padding: '0 30px 0 12px', borderRadius: '6px', border: `1px solid ${t?.border?.primary || '#2a3f5f'}`, background: t?.bg?.tertiary || '#1a1a2e', color: t?.text?.primary || '#e2e8f0', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' },
    menu: { display: isDropdownOpen ? 'block' : 'none', position: 'absolute', top: '100%', right: 0, left: 0, background: t?.bg?.secondary || '#1e293b', border: `1px solid ${t?.button?.primary || '#3b82f6'}`, borderTop: 'none', borderRadius: '0 0 6px 6px', maxHeight: '280px', overflowY: 'auto', zIndex: 100 },
    item: { padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', borderBottom: `1px solid ${t?.border?.primary || '#2a3f5f'}` },
    box: { background: `${t?.button?.primary || '#3b82f6'}10`, border: `1px solid ${t?.button?.primary || '#3b82f6'}30`, borderRadius: '6px', padding: '12px', marginTop: '12px' },
    tag: { display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 10px', borderRadius: '6px', background: t?.button?.primary || '#3b82f6', color: '#fff', fontSize: '11px', fontWeight: '600' },
    chip: { height: btnHeight, padding: '0 12px', borderRadius: '6px', border: `1px solid ${t?.border?.primary || '#2a3f5f'}`, background: 'transparent', color: t?.text?.muted || '#94a3b8', fontSize: '11px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' },
    subGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' },
    subCard: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: t?.bg?.tertiary || '#1a1a2e', border: `1px solid ${t?.border?.primary || '#2a3f5f'}`, borderRadius: '6px', cursor: 'pointer' },
    bigBtn: { width: '100%', height: '46px', borderRadius: '6px', border: 'none', background: t?.button?.gradient || 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
    toast: { position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: '#10b981', color: '#fff', padding: '14px 24px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', zIndex: 1000, opacity: state.showToast ? 1 : 0, transition: 'opacity 0.3s' },
    empty: { textAlign: 'center', padding: '40px', color: t?.text?.muted || '#94a3b8', background: t?.bg?.secondary || '#16213e', borderRadius: '6px', border: `1px solid ${t?.border?.primary || '#2a3f5f'}` },
  };

  if (placesLoading) return <div style={{ ...s.container, textAlign: 'center', padding: '60px' }}><div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div><p style={{ color: t?.text?.muted }}>جاري التحميل...</p></div>;

  return (
    <div style={s.container}>
      <div style={s.quickEntry}>
        <div style={s.header} onClick={() => setState(x => ({ ...x, quickEntryExpanded: !x.quickEntryExpanded }))}>
          <div style={{ background: t?.button?.gradient || 'linear-gradient(135deg, #3b82f6, #06b6d4)', padding: '12px 16px', borderRadius: '6px', fontSize: '24px' }}>📐</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: t?.text?.primary || '#e2e8f0' }}>نموذج إدخال سريع</h2>
            <p style={{ fontSize: '12px', color: t?.text?.muted || '#94a3b8', margin: '4px 0 0 0' }}>🏗️ {getSelectedSubsCount()} بنود • 📍 {state.selectedPlaces.length} أماكن</p>
          </div>
          <span style={{ fontSize: '20px', color: t?.text?.muted, transform: state.quickEntryExpanded ? 'rotate(180deg)' : 'none', transition: '0.2s' }}>▼</span>
        </div>

        {state.quickEntryExpanded && (
          <div style={{ padding: '16px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={s.stepNum}>1</div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: t?.text?.primary || '#e2e8f0' }}>اختر الأماكن</span>
                {state.selectedPlaces.length > 0 && <span style={s.badge}>{state.selectedPlaces.length} مكان • {totalSelectedArea} م²</span>}
              </div>
              
              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={s.dropdown}>
                  <div style={{ ...s.trigger, borderColor: isDropdownOpen ? (t?.button?.primary || '#3b82f6') : (t?.border?.primary || '#2a3f5f'), borderRadius: isDropdownOpen ? '6px 6px 0 0' : '6px' }} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    {checkedPlaces.length === 0 ? <span style={{ color: t?.text?.muted }}>اختر أماكن...</span> : 
                     checkedPlaces.length <= 2 ? checkedPlaces.map(p => <span key={p} style={{ background: t?.button?.primary || '#3b82f6', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '10px' }}>{p}</span>) :
                     <><span style={{ background: t?.button?.primary || '#3b82f6', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '10px' }}>{checkedPlaces[0]}</span><span style={{ background: '#64748b', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>+{checkedPlaces.length - 1}</span></>}
                    <span style={{ position: 'absolute', left: '12px', color: t?.text?.muted, fontSize: '10px', transform: isDropdownOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
                  </div>
                  
                  <div style={s.menu}>
                    <div style={{ padding: '10px 12px', borderBottom: `1px dashed ${t?.button?.primary || '#3b82f6'}`, background: '#10b98110' }}>
                      {!showAddNewInput ? (
                        <button onClick={(e) => { e.stopPropagation(); setShowAddNewInput(true); }} style={{ width: '100%', height: '32px', borderRadius: '6px', border: '1px dashed #10b981', background: 'transparent', color: '#10b981', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>➕ إضافة مكان جديد</button>
                      ) : (
                        <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                          <input value={newPlaceInput} onChange={e => setNewPlaceInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addNewPlaceToList(newPlaceInput)} placeholder="اسم المكان..." autoFocus style={{ flex: 1, height: '32px', padding: '0 10px', borderRadius: '6px', border: '1px solid #10b981', background: t?.bg?.tertiary || '#1a1a2e', color: t?.text?.primary || '#e2e8f0', fontSize: '11px' }} />
                          <button onClick={() => addNewPlaceToList(newPlaceInput)} style={{ height: '32px', padding: '0 12px', borderRadius: '6px', border: 'none', background: '#10b981', color: '#fff', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>إضافة</button>
                          <button onClick={() => { setShowAddNewInput(false); setNewPlaceInput(''); }} style={{ height: '32px', padding: '0 10px', borderRadius: '6px', border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', fontSize: '11px', cursor: 'pointer' }}>✕</button>
                        </div>
                      )}
                    </div>
                    <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
                      {availablePlaces.map(place => {
                        const isChecked = checkedPlaces.includes(place.name);
                        const isInBox = state.selectedPlaces.some(p => p.name === place.name);
                        return (
                          <div key={place.id} onClick={e => { e.stopPropagation(); toggleCheck(place.name); }} style={{ ...s.item, background: isInBox ? '#10b98115' : isChecked ? `${t?.button?.primary || '#3b82f6'}15` : 'transparent', cursor: isInBox ? 'default' : 'pointer' }}>
                            <div style={{ width: '18px', height: '18px', borderRadius: '4px', border: `2px solid ${isInBox ? '#10b981' : isChecked ? (t?.button?.primary || '#3b82f6') : (t?.border?.primary || '#2a3f5f')}`, background: isInBox ? '#10b981' : isChecked ? (t?.button?.primary || '#3b82f6') : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#fff' }}>{(isChecked || isInBox) && '✓'}</div>
                            <span style={{ flex: 1, fontSize: '12px', color: isInBox ? '#10b981' : isChecked ? (t?.button?.primary || '#3b82f6') : (t?.text?.primary || '#e2e8f0'), fontWeight: (isChecked || isInBox) ? '600' : '400' }}>{place.name}</span>
                            {isInBox && <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: '#10b98120', color: '#10b981' }}>في الصندوق</span>}
                            <button onClick={e => { e.stopPropagation(); deletePlaceFromList(place.id, place.name); }} style={{ width: '22px', height: '22px', borderRadius: '4px', border: '1px solid #ef444430', background: '#ef444410', color: '#ef4444', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.6 }}>✕</button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: t?.bg?.tertiary || '#1a1a2e', padding: '0 8px', borderRadius: '6px', border: `1px solid ${t?.border?.primary || '#2a3f5f'}`, height: btnHeight }}><span style={{ fontSize: '10px', color: t?.text?.muted }}>ط:</span><select style={{ border: 'none', background: 'transparent', color: t?.text?.primary || '#e2e8f0', fontSize: '12px', fontWeight: '600', width: '40px' }} value={state.placeLength} onChange={e => setState(x => ({ ...x, placeLength: parseFloat(e.target.value) || 1 }))}>{dimOptions.map(n => <option key={n} value={n}>{n}</option>)}</select></div>
                <span style={{ color: t?.text?.muted, fontSize: '12px' }}>×</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: t?.bg?.tertiary || '#1a1a2e', padding: '0 8px', borderRadius: '6px', border: `1px solid ${t?.border?.primary || '#2a3f5f'}`, height: btnHeight }}><span style={{ fontSize: '10px', color: t?.text?.muted }}>ع:</span><select style={{ border: 'none', background: 'transparent', color: t?.text?.primary || '#e2e8f0', fontSize: '12px', fontWeight: '600', width: '40px' }} value={state.placeWidth} onChange={e => setState(x => ({ ...x, placeWidth: parseFloat(e.target.value) || 1 }))}>{dimOptions.map(n => <option key={n} value={n}>{n}</option>)}</select></div>
                <span style={{ color: t?.text?.muted, fontSize: '12px' }}>×</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: t?.bg?.tertiary || '#1a1a2e', padding: '0 8px', borderRadius: '6px', border: '1px solid #8b5cf6', height: btnHeight }}><span style={{ fontSize: '10px', color: '#8b5cf6' }}>ر:</span><select style={{ border: 'none', background: 'transparent', color: '#8b5cf6', fontSize: '12px', fontWeight: '600', width: '40px' }} value={state.placeHeight} onChange={e => setState(x => ({ ...x, placeHeight: parseFloat(e.target.value) || 1 }))}>{heightOptions.map(n => <option key={n} value={n}>{n}</option>)}</select></div>
                <span style={{ color: t?.text?.muted, fontSize: '12px' }}>=</span>
                <div style={{ background: '#10b98115', padding: '0 10px', borderRadius: '6px', height: btnHeight, display: 'flex', alignItems: 'center', border: '1px solid #10b98130' }}><span style={{ fontSize: '13px', fontWeight: '700', color: '#10b981' }}>{placeArea} م²</span></div>
                <button onClick={addCheckedPlacesToBox} disabled={checkedPlaces.length === 0} style={{ height: btnHeight, padding: '0 16px', borderRadius: '6px', border: 'none', background: checkedPlaces.length > 0 ? (t?.button?.gradient || 'linear-gradient(135deg, #10b981, #059669)') : (t?.bg?.tertiary || '#1a1a2e'), color: checkedPlaces.length > 0 ? '#fff' : t?.text?.muted, fontSize: '12px', fontWeight: '600', cursor: checkedPlaces.length > 0 ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '6px' }}><span>+ إضافة</span>{checkedPlaces.length > 0 && <span style={{ background: 'rgba(255,255,255,0.25)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>{checkedPlaces.length}</span>}</button>
              </div>

              {state.selectedPlaces.length > 0 && (
                <div style={s.box}>
                  <div style={{ fontSize: '11px', color: t?.button?.primary || '#3b82f6', fontWeight: '600', marginBottom: '10px' }}>📍 صندوق الأماكن</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {state.selectedPlaces.map((p, i) => <span key={i} style={s.tag}><span>{p.name}</span><span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 5px', borderRadius: '4px', fontSize: '9px' }}>{p.area} م²</span><span style={{ cursor: 'pointer', fontWeight: '700', color: '#ef4444' }} onClick={() => removeFromBox(p.name)}>✕</span></span>)}
                  </div>
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: `1px dashed ${t?.button?.primary || '#3b82f6'}30`, display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '11px', color: t?.text?.muted }}>إجمالي المساحة:</span><span style={{ fontSize: '15px', fontWeight: '700', color: '#10b981' }}>{totalSelectedArea} م²</span></div>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={s.stepNum}>2</div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: t?.text?.primary || '#e2e8f0' }}>اختر بنود الأعمال</span>
                {getSelectedSubsCount() > 0 && <span style={s.badge}>{getSelectedSubsCount()} بند</span>}
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {Object.values(workItems).map(item => (
                  <button key={item.code} onClick={() => toggleMainItem(item.code)} style={{ ...s.chip, background: state.activeMainItems[item.code] ? `${item.color}20` : 'transparent', borderColor: state.activeMainItems[item.code] ? item.color : (t?.border?.primary || '#2a3f5f'), color: state.activeMainItems[item.code] ? item.color : t?.text?.muted }}><span>{item.icon}</span><span>{item.name}</span>{state.activeMainItems[item.code] && <span>✓</span>}</button>
                ))}
              </div>
              {getSelectedMainItems().length > 0 && (
                <div style={s.subGrid}>
                  {getAllSubItems().map(sub => (
                    <div key={sub.code} onClick={() => toggleSub(sub.code)} style={{ ...s.subCard, borderColor: state.selectedSubs[sub.code] ? sub.color : (t?.border?.primary || '#2a3f5f'), background: state.selectedSubs[sub.code] ? `${sub.color}10` : (t?.bg?.tertiary || '#1a1a2e') }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: `2px solid ${state.selectedSubs[sub.code] ? sub.color : (t?.border?.primary || '#2a3f5f')}`, background: state.selectedSubs[sub.code] ? sub.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px' }}>{state.selectedSubs[sub.code] && '✓'}</div>
                      <div style={{ flex: 1 }}><div style={{ fontSize: '12px', fontWeight: '600', color: t?.text?.primary || '#e2e8f0' }}>{sub.name}</div><div style={{ fontSize: '10px', color: t?.text?.muted }}>{sub.code}</div></div>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: sub.color }}>{sub.price} ر.س</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: `1px solid ${t?.border?.primary || '#2a3f5f'}` }}>
              <button onClick={addItems} style={s.bigBtn} disabled={state.selectedPlaces.length === 0 || getSelectedSubsCount() === 0}><span style={{ fontSize: '20px' }}>➕</span><span>إضافة البنود المحددة</span></button>
            </div>
          </div>
        )}
      </div>

      {!hasCategories() && <div style={s.empty}><div style={{ fontSize: '50px', marginBottom: '16px' }}>📋</div><h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: t?.text?.primary || '#e2e8f0' }}>لا توجد بنود</h3><p style={{ fontSize: '13px' }}>استخدم نموذج الإدخال السريع</p></div>}

      {hasCategories() && (
        <div style={{ background: `linear-gradient(135deg, #10b98120, ${t?.button?.primary || '#3b82f6'}20)`, borderRadius: '6px', padding: '24px', border: '2px solid #10b98150', textAlign: 'center', marginTop: '20px' }}>
          <p style={{ fontSize: '12px', color: t?.text?.muted, marginBottom: '8px' }}>الإجمالي النهائي</p>
          <p style={{ fontSize: '32px', fontWeight: '800', color: '#10b981', margin: 0 }}>{fmt(calcGrandTotal())} ر.س</p>
          <p style={{ fontSize: '11px', color: t?.text?.muted, marginTop: '8px' }}>{getTotalItems()} بند</p>
        </div>
      )}

      <div style={s.toast}>✅ تمت الإضافة بنجاح!</div>
      {isDropdownOpen && <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 }} onClick={() => { setIsDropdownOpen(false); setShowAddNewInput(false); setNewPlaceInput(''); }} />}
    </div>
  );
};

export default QuantityCalculator;
