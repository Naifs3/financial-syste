import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const QuantityCalculator = ({ darkMode = true }) => {
  const [mainTab, setMainTab] = useState('calculator');
  const [loading, setLoading] = useState(true);
  
  const t = {
    bg: darkMode ? '#12121a' : '#f8fafc',
    card: darkMode ? '#1e1e2a' : '#ffffff',
    cardAlt: darkMode ? '#252535' : '#f1f5f9',
    border: darkMode ? '#3a3a4a' : '#e2e8f0',
    text: darkMode ? '#f1f1f1' : '#1e293b',
    muted: darkMode ? '#9ca3af' : '#64748b',
    accent: '#818cf8',
    accentDark: '#6366f1',
    success: '#4ade80',
    warning: '#fbbf24',
    danger: '#f87171',
    info: '#22d3ee',
  };

  const defaultWorkItems = {
    tiles: { name: 'البلاط', icon: '🔲', items: [
      { id: 't1', name: 'إزالة متوسطة', exec: 13, cont: 8, type: 'floor' },
      { id: 't2', name: 'إزالة كبيرة', exec: 20, cont: 12, type: 'floor' },
      { id: 't3', name: 'صبة شامل مواد', exec: 47, cont: 35, type: 'floor' },
      { id: 't4', name: 'صبة بدون مواد', exec: 20, cont: 14, type: 'floor' },
      { id: 't5', name: 'تبليط كبير', exec: 33, cont: 22, type: 'floor' },
      { id: 't6', name: 'تبليط صغير', exec: 25, cont: 17, type: 'floor' },
      { id: 't7', name: 'نعلات', exec: 13, cont: 8, type: 'floor' },
      { id: 't8', name: 'رصيف بلدورات', exec: 33, cont: 22, type: 'floor' },
      { id: 't9', name: 'رصيف بلاط', exec: 33, cont: 22, type: 'floor' },
    ]},
    paint: { name: 'الدهانات', icon: '🎨', items: [
      { id: 'p1', name: 'داخلي جوتن', exec: 21, cont: 14, type: 'wall' },
      { id: 'p2', name: 'داخلي الجزيرة', exec: 20, cont: 13, type: 'wall' },
      { id: 'p3', name: 'داخلي عسيب', exec: 19, cont: 12, type: 'wall' },
      { id: 'p4', name: 'داخلي بدون مواد', exec: 12, cont: 8, type: 'wall' },
      { id: 'p5', name: 'خارجي رشة', exec: 19, cont: 12, type: 'wall' },
      { id: 'p6', name: 'بروفايل جوتن', exec: 33, cont: 22, type: 'wall' },
      { id: 'p7', name: 'بروفايل الجزيرة', exec: 33, cont: 22, type: 'wall' },
    ]},
    paintRenew: { name: 'تجديد دهانات', icon: '🔄', items: [
      { id: 'pr1', name: 'إزالة دهان', exec: 5, cont: 3, type: 'wall' },
      { id: 'pr2', name: 'تجديد جوتن', exec: 16, cont: 10, type: 'wall' },
      { id: 'pr3', name: 'تجديد الجزيرة', exec: 15, cont: 9, type: 'wall' },
    ]},
    gypsum: { name: 'الجبس', icon: '🏛️', items: [
      { id: 'g1', name: 'جبسمبورد', exec: 60, cont: 40, type: 'ceiling' },
      { id: 'g2', name: 'جبس بلدي', exec: 53, cont: 35, type: 'ceiling' },
      { id: 'g3', name: 'إزالة جبس', exec: 5, cont: 3, type: 'ceiling' },
    ]},
    plaster: { name: 'اللياسة', icon: '🧱', items: [
      { id: 'pl1', name: 'قدة وزاوية', exec: 13, cont: 8, type: 'wall' },
      { id: 'pl2', name: 'ودع وقدة', exec: 20, cont: 13, type: 'wall' },
    ]},
    electrical: { name: 'الكهرباء', icon: '⚡', items: [
      { id: 'e1', name: 'تأسيس شامل', exec: 45, cont: 30, type: 'floor' },
      { id: 'e2', name: 'تشطيب', exec: 25, cont: 18, type: 'floor' },
      { id: 'e3', name: 'صيانة', exec: 15, cont: 10, type: 'floor' },
    ]},
    plumbing: { name: 'السباكة', icon: '🔧', items: [
      { id: 'pb1', name: 'تأسيس شامل', exec: 80, cont: 55, type: 'floor' },
      { id: 'pb2', name: 'تشطيب', exec: 40, cont: 28, type: 'floor' },
      { id: 'pb3', name: 'صيانة', exec: 25, cont: 18, type: 'floor' },
    ]},
    insulation: { name: 'العزل', icon: '🛡️', items: [
      { id: 'i1', name: 'عزل مائي', exec: 20, cont: 13, type: 'floor' },
      { id: 'i2', name: 'عزل حراري', exec: 25, cont: 17, type: 'floor' },
      { id: 'i3', name: 'عزل صوتي', exec: 30, cont: 20, type: 'wall' },
    ]},
    doors: { name: 'الأبواب', icon: '🚪', items: [
      { id: 'd1', name: 'باب خشب', exec: 800, cont: 600, type: 'unit' },
      { id: 'd2', name: 'باب حديد', exec: 1200, cont: 900, type: 'unit' },
      { id: 'd3', name: 'باب ألمنيوم', exec: 600, cont: 450, type: 'unit' },
    ]},
    windows: { name: 'النوافذ', icon: '🪟', items: [
      { id: 'w1', name: 'ألمنيوم عادي', exec: 350, cont: 250, type: 'floor' },
      { id: 'w2', name: 'ألمنيوم دبل', exec: 500, cont: 380, type: 'floor' },
      { id: 'w3', name: 'UPVC', exec: 450, cont: 320, type: 'floor' },
    ]},
    ac: { name: 'التكييف', icon: '❄️', items: [
      { id: 'ac1', name: 'تأسيس سبليت', exec: 300, cont: 200, type: 'unit' },
      { id: 'ac2', name: 'تأسيس مركزي', exec: 150, cont: 100, type: 'floor' },
      { id: 'ac3', name: 'تركيب وحدة', exec: 250, cont: 180, type: 'unit' },
    ]},
    construction: { name: 'الإنشائيات', icon: '🏗️', items: [
      { id: 'c1', name: 'عظم + مواد', exec: 998, cont: 750, type: 'floor' },
      { id: 'c2', name: 'عظم فقط', exec: 665, cont: 500, type: 'floor' },
    ]}
  };

  const defaultPlaces = {
    dry: { name: 'جاف', icon: '🏠', color: '#818cf8', enabled: true, isCore: true },
    wet: { name: 'رطب', icon: '🚿', color: '#22d3ee', enabled: true, isCore: true },
    outdoor: { name: 'خارجي', icon: '🌳', color: '#4ade80', enabled: true, isCore: true }
  };

  const defaultProgramming = {
    dry: { tiles: ['t1','t2','t3','t4','t5','t6','t7'], paint: ['p1','p2','p3','p4','p6','p7'], paintRenew: ['pr1','pr2','pr3'], gypsum: ['g1','g2','g3'], plaster: ['pl1','pl2'], electrical: ['e1','e2','e3'], insulation: ['i3'], doors: ['d1','d2','d3'], ac: ['ac1','ac2','ac3'] },
    wet: { tiles: ['t1','t2','t3','t4','t5','t6','t7'], paint: ['p1','p2','p3','p4'], paintRenew: ['pr1','pr2','pr3'], gypsum: ['g1','g2','g3'], plaster: ['pl1','pl2'], electrical: ['e1','e2','e3'], plumbing: ['pb1','pb2','pb3'], insulation: ['i1','i2'], doors: ['d1','d3'] },
    outdoor: { tiles: ['t1','t2','t3','t4','t8','t9'], paint: ['p5'], plaster: ['pl1','pl2'], electrical: ['e1','e2'], plumbing: ['pb1','pb2'], insulation: ['i1','i2'], doors: ['d2'], windows: ['w1','w2','w3'], construction: ['c1','c2'] }
  };

  const calcPlaces = {
    dry: ['صالة', 'مجلس', 'مكتب', 'غرفة طعام', 'ممر', 'غرفة نوم رئيسية', 'غرفة نوم 1', 'غرفة نوم 2'],
    wet: ['مطبخ', 'دورة مياه رئيسية', 'دورة مياه 1', 'دورة مياه 2', 'غرفة غسيل'],
    outdoor: ['حوش', 'سطح', 'موقف', 'حديقة']
  };

  const [workItems, setWorkItems] = useState(defaultWorkItems);
  const [places, setPlaces] = useState(defaultPlaces);
  const [programming, setProgramming] = useState(defaultProgramming);
  const [selectedPlaceType, setSelectedPlaceType] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [addedItems, setAddedItems] = useState({});
  const [inputMethod, setInputMethod] = useState('direct');
  const [area, setArea] = useState(0);
  const [length, setLength] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(4);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showPlaceItemsModal, setShowPlaceItemsModal] = useState(false);
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('tiles');
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', exec: 0, cont: 0, type: 'floor' });
  const [addItemForm, setAddItemForm] = useState({ name: '', exec: 0, cont: 0, type: 'floor', category: 'tiles' });
  const [editingPlaceItems, setEditingPlaceItems] = useState(null);
  const [placeForm, setPlaceForm] = useState({ name: '', icon: '📍', color: '#818cf8' });

  useEffect(() => {
    const unsubs = [];
    unsubs.push(onSnapshot(doc(db, 'calculator', 'workItems'), (snap) => { if (snap.exists()) setWorkItems(snap.data()); setLoading(false); }, () => setLoading(false)));
    unsubs.push(onSnapshot(doc(db, 'calculator', 'placeTypes'), (snap) => { if (snap.exists()) setPlaces(snap.data()); }));
    unsubs.push(onSnapshot(doc(db, 'calculator', 'programming'), (snap) => { if (snap.exists()) setProgramming(snap.data()); }));
    return () => unsubs.forEach(u => u());
  }, []);

  const saveWorkItems = async (d) => { try { await setDoc(doc(db, 'calculator', 'workItems'), d); } catch (e) { console.error(e); } };
  const savePlaceTypes = async (d) => { try { await setDoc(doc(db, 'calculator', 'placeTypes'), d); } catch (e) { console.error(e); } };
  const saveProgramming = async (d) => { try { await setDoc(doc(db, 'calculator', 'programming'), d); } catch (e) { console.error(e); } };

  const quickAreas = [5, 10, 15, 20, 25, 30];
  const calcFloorArea = () => length * width;
  const calcWallArea = () => 2 * (length + width) * height;
  const getArea = () => inputMethod === 'direct' ? area : calcFloorArea();
  const getWallArea = () => inputMethod === 'dimensions' ? calcWallArea() : 0;
  const adjustValue = (setter, value, delta, min = 0) => { const nv = Math.max(min, value + delta); setter(Number.isInteger(nv) ? nv : parseFloat(nv.toFixed(1))); };

  const toggleProgramming = (pk, ck, iid) => {
    const np = JSON.parse(JSON.stringify(programming));
    if (!np[pk]) np[pk] = {};
    if (!np[pk][ck]) np[pk][ck] = [];
    np[pk][ck] = np[pk][ck].includes(iid) ? np[pk][ck].filter(id => id !== iid) : [...np[pk][ck], iid];
    setProgramming(np);
    saveProgramming(np);
  };

  const isItemEnabled = (pk, ck, iid) => programming[pk]?.[ck]?.includes(iid) || false;
  const isCategoryFullyEnabled = (pk, ck) => { const items = workItems[ck]?.items || []; const en = programming[pk]?.[ck] || []; return items.length > 0 && items.every(i => en.includes(i.id)); };

  const toggleAllCategory = (pk, ck, en) => {
    const np = JSON.parse(JSON.stringify(programming));
    if (!np[pk]) np[pk] = {};
    np[pk][ck] = en ? workItems[ck].items.map(i => i.id) : [];
    setProgramming(np);
    saveProgramming(np);
  };

  const openEditModal = (ck, item) => { setEditingItem({ catKey: ck, itemId: item.id }); setEditForm({ name: item.name, exec: item.exec, cont: item.cont, type: item.type }); setShowEditModal(true); };

  const saveEdit = () => {
    if (!editingItem) return;
    const nw = JSON.parse(JSON.stringify(workItems));
    nw[editingItem.catKey].items = nw[editingItem.catKey].items.map(i => i.id === editingItem.itemId ? { ...i, ...editForm } : i);
    setWorkItems(nw);
    saveWorkItems(nw);
    setShowEditModal(false);
    setEditingItem(null);
  };

  const deleteItem = (ck, iid) => {
    const nw = JSON.parse(JSON.stringify(workItems));
    nw[ck].items = nw[ck].items.filter(i => i.id !== iid);
    setWorkItems(nw);
    saveWorkItems(nw);
    const np = JSON.parse(JSON.stringify(programming));
    Object.keys(np).forEach(pk => { if (np[pk][ck]) np[pk][ck] = np[pk][ck].filter(id => id !== iid); });
    setProgramming(np);
    saveProgramming(np);
  };

  const openAddItemModal = (ck = null) => { setAddItemForm({ name: '', exec: 0, cont: 0, type: 'floor', category: ck || selectedCategory }); setShowAddItemModal(true); };

  const saveNewItem = () => {
    if (!addItemForm.name.trim()) return;
    const nw = JSON.parse(JSON.stringify(workItems));
    nw[addItemForm.category].items.push({ id: `item_${Date.now()}`, name: addItemForm.name, exec: addItemForm.exec, cont: addItemForm.cont, type: addItemForm.type });
    setWorkItems(nw);
    saveWorkItems(nw);
    setShowAddItemModal(false);
  };

  const openPlaceModal = () => { setPlaceForm({ name: '', icon: '📍', color: '#818cf8' }); setShowPlaceModal(true); };

  const savePlace = () => {
    if (!placeForm.name.trim()) return;
    const nk = `place_${Date.now()}`;
    const np = JSON.parse(JSON.stringify(places));
    np[nk] = { ...placeForm, enabled: true, isCore: false };
    setPlaces(np);
    savePlaceTypes(np);
    const npr = JSON.parse(JSON.stringify(programming));
    npr[nk] = {};
    setProgramming(npr);
    saveProgramming(npr);
    setShowPlaceModal(false);
  };

  const togglePlaceEnabled = (pk) => { const np = JSON.parse(JSON.stringify(places)); np[pk].enabled = !np[pk].enabled; setPlaces(np); savePlaceTypes(np); };

  const deletePlace = (pk) => {
    if (places[pk]?.isCore) return;
    const np = JSON.parse(JSON.stringify(places)); delete np[pk]; setPlaces(np); savePlaceTypes(np);
    const npr = JSON.parse(JSON.stringify(programming)); delete npr[pk]; setProgramming(npr); saveProgramming(npr);
  };

  const openPlaceItemsModal = (pk) => { setEditingPlaceItems(pk); setShowPlaceItemsModal(true); };
  const toggleItem = (id) => setSelectedItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const getAvailableItems = () => {
    if (!selectedPlaceType) return [];
    const items = [];
    Object.entries(workItems).forEach(([ck, cat]) => {
      const eids = programming[selectedPlaceType]?.[ck] || [];
      cat.items.forEach(i => { if (eids.includes(i.id)) items.push({ ...i, category: cat.name, catKey: ck }); });
    });
    return items;
  };

  const addItems = () => {
    const fa = getArea(), wa = getWallArea();
    if (!selectedPlace || fa <= 0 || selectedItems.length === 0) return;
    const avail = getAvailableItems();
    const nai = { ...addedItems };
    selectedItems.forEach(id => {
      const item = avail.find(w => w.id === id);
      if (!item) return;
      const isWall = item.type === 'wall' || item.type === 'ceiling';
      const finalArea = isWall && wa > 0 ? wa : fa;
      const key = `${item.id}`;
      if (!nai[key]) nai[key] = { ...item, places: [] };
      const ep = nai[key].places.find(p => p.name === selectedPlace);
      if (ep) ep.area += finalArea;
      else nai[key].places.push({ name: selectedPlace, area: finalArea, type: selectedPlaceType });
    });
    setAddedItems(nai);
    setSelectedItems([]);
    setArea(0); setLength(0); setWidth(0);
  };

  const removePlace = (ik, pn) => {
    const ni = { ...addedItems };
    if (ni[ik]) { ni[ik].places = ni[ik].places.filter(p => p.name !== pn); if (ni[ik].places.length === 0) delete ni[ik]; }
    setAddedItems(ni);
  };

  const calcTotals = () => {
    let te = 0, tc = 0;
    Object.values(addedItems).forEach(i => { const ta = i.places.reduce((s, p) => s + p.area, 0); te += ta * i.exec; tc += ta * i.cont; });
    return { totalExec: te, totalCont: tc, profit: te - tc };
  };

  const { totalExec, totalCont, profit } = calcTotals();
  const canAdd = selectedPlace && getArea() > 0 && selectedItems.length > 0;

  if (loading) return (
    <div dir="rtl" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.text }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: `3px solid ${t.accent}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
        <p>جاري التحميل...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div dir="rtl" style={{ color: t.text, fontFamily: 'system-ui' }}>
      <style>{`
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: ${t.cardAlt}; border-radius: 4px; }
        ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 4px; }
      `}</style>
      
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 16 }}>
        {/* العنوان بنفس تصميم الأقسام */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${t.accentDark}, ${t.accent})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🧮</div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>حاسبة الكميات</h1>
            <p style={{ fontSize: 13, color: t.muted, margin: 0 }}>احسب تكاليف المشاريع والأرباح</p>
          </div>
        </div>

        {/* التابات داخل كارد */}
        <div style={{ background: t.card, borderRadius: 16, border: `1px solid ${t.border}`, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ id: 'calculator', label: 'الحاسبة', icon: '🧮' }, { id: 'items', label: 'البنود', icon: '📋' }, { id: 'programming', label: 'البرمجة', icon: '⚙️' }].map(tab => (
              <button key={tab.id} onClick={() => setMainTab(tab.id)} style={{ flex: 1, padding: '12px 16px', borderRadius: 12, border: 'none', background: mainTab === tab.id ? `linear-gradient(135deg, ${t.accentDark}, ${t.accent})` : t.cardAlt, color: mainTab === tab.id ? '#fff' : t.muted, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span>{tab.icon}</span>{tab.label}
              </button>
            ))}
          </div>
        </div>
        {mainTab === 'calculator' && (
          <div>
            <div style={{ background: t.card, borderRadius: 16, border: `1px solid ${t.border}`, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 14, color: t.text, marginBottom: 12, fontWeight: 500 }}>📍 نوع المكان</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                {Object.entries(places).filter(([_, p]) => p.enabled).map(([key, place]) => (
                  <div key={key} onClick={() => { setSelectedPlaceType(key); setSelectedPlace(''); setSelectedItems([]); }} style={{ padding: '16px 12px', borderRadius: 14, border: selectedPlaceType === key ? `2px solid ${place.color}` : `1px solid ${t.border}`, background: selectedPlaceType === key ? `${place.color}18` : t.cardAlt, cursor: 'pointer', textAlign: 'center' }}>
                    <div style={{ fontSize: 24, marginBottom: 6, filter: 'grayscale(100%)', opacity: 0.7 }}>{place.icon}</div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{place.name}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 14, color: t.text, marginBottom: 12, fontWeight: 500 }}>🏷️ المكان</div>
              <select value={selectedPlace} onChange={(e) => setSelectedPlace(e.target.value)} disabled={!selectedPlaceType} style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `1px solid ${t.border}`, background: t.cardAlt, color: t.text, fontSize: 14, outline: 'none', marginBottom: 16, cursor: 'pointer' }}>
                <option value="">اختر المكان</option>
                {selectedPlaceType && calcPlaces[selectedPlaceType]?.map(p => <option key={p} value={p}>{p}</option>)}
              </select>

              <div style={{ fontSize: 14, color: t.text, marginBottom: 12, fontWeight: 500 }}>📐 المساحة</div>
              <div style={{ background: t.cardAlt, borderRadius: 14, padding: 16, marginBottom: 16, border: `1px solid ${t.border}` }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  <button onClick={() => setInputMethod('direct')} style={{ flex: 1, padding: '12px 16px', borderRadius: 10, border: 'none', background: inputMethod === 'direct' ? t.accent : 'transparent', color: inputMethod === 'direct' ? '#fff' : t.muted, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>مساحة مباشرة</button>
                  <button onClick={() => setInputMethod('dimensions')} style={{ flex: 1, padding: '12px 16px', borderRadius: 10, border: 'none', background: inputMethod === 'dimensions' ? t.accent : 'transparent', color: inputMethod === 'dimensions' ? '#fff' : t.muted, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>أبعاد الغرفة</button>
                </div>

                {inputMethod === 'direct' ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
                      <button onClick={() => adjustValue(setArea, area, -1)} style={{ width: 56, height: 56, borderRadius: 14, border: `1px solid ${t.border}`, background: t.card, color: t.text, fontSize: 28, cursor: 'pointer', fontWeight: 600 }}>−</button>
                      <div style={{ textAlign: 'center' }}>
                        <input type="number" value={area || ''} onChange={(e) => setArea(parseFloat(e.target.value) || 0)} style={{ width: 100, background: 'transparent', border: 'none', color: t.text, fontSize: 42, fontWeight: 600, textAlign: 'center', outline: 'none' }} />
                        <div style={{ fontSize: 14, color: t.accent }}>م²</div>
                      </div>
                      <button onClick={() => adjustValue(setArea, area, 1)} style={{ width: 56, height: 56, borderRadius: 14, border: `1px solid ${t.border}`, background: t.card, color: t.text, fontSize: 28, cursor: 'pointer', fontWeight: 600 }}>+</button>
                    </div>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                      {quickAreas.map(val => (<button key={val} onClick={() => setArea(val)} style={{ padding: '10px 18px', borderRadius: 10, border: area === val ? `2px solid ${t.accent}` : `1px solid ${t.border}`, background: area === val ? `${t.accent}20` : t.card, color: area === val ? t.accent : t.text, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{val}</button>))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 12 }}>
                      {[{ l: 'الطول', v: length, s: setLength, c: t.text }, { l: 'العرض', v: width, s: setWidth, c: t.text }].map(({ l, v, s, c }) => (
                        <div key={l} style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 14, color: c, marginBottom: 10, fontWeight: 500 }}>{l}</div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            <button onClick={() => adjustValue(s, v, -0.5)} style={{ width: 44, height: 44, borderRadius: 12, border: `1px solid ${t.border}`, background: t.card, color: c, fontSize: 22, cursor: 'pointer', fontWeight: 600 }}>−</button>
                            <input type="number" value={v || ''} onChange={(e) => s(parseFloat(e.target.value) || 0)} style={{ width: 55, background: 'transparent', border: 'none', color: c, fontSize: 22, fontWeight: 600, textAlign: 'center', outline: 'none' }} />
                            <button onClick={() => adjustValue(s, v, 0.5)} style={{ width: 44, height: 44, borderRadius: 12, border: `1px solid ${t.border}`, background: t.card, color: c, fontSize: 22, cursor: 'pointer', fontWeight: 600 }}>+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* الارتفاع في صف منفصل */}
                    <div style={{ textAlign: 'center', marginBottom: 12 }}>
                      <div style={{ fontSize: 14, color: t.warning, marginBottom: 10, fontWeight: 500 }}>الارتفاع</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <button onClick={() => adjustValue(setHeight, height, -0.5)} style={{ width: 44, height: 44, borderRadius: 12, border: `1px solid ${t.warning}50`, background: `${t.warning}20`, color: t.warning, fontSize: 22, cursor: 'pointer', fontWeight: 600 }}>−</button>
                        <input type="number" value={height || ''} onChange={(e) => setHeight(parseFloat(e.target.value) || 0)} style={{ width: 55, background: 'transparent', border: 'none', color: t.warning, fontSize: 22, fontWeight: 600, textAlign: 'center', outline: 'none' }} />
                        <button onClick={() => adjustValue(setHeight, height, 0.5)} style={{ width: 44, height: 44, borderRadius: 12, border: `1px solid ${t.warning}50`, background: `${t.warning}20`, color: t.warning, fontSize: 22, cursor: 'pointer', fontWeight: 600 }}>+</button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                      <div style={{ flex: 1, padding: 12, borderRadius: 12, background: `${t.success}15`, border: `1px solid ${t.success}30`, textAlign: 'center' }}>
                        <div style={{ fontSize: 20, fontWeight: 600, color: t.success }}>{calcFloorArea()}</div>
                        <div style={{ fontSize: 12, color: t.success, opacity: 0.8, marginTop: 4 }}>م² أرضية</div>
                      </div>
                      <div style={{ flex: 1, padding: 12, borderRadius: 12, background: `${t.info}15`, border: `1px solid ${t.info}30`, textAlign: 'center' }}>
                        <div style={{ fontSize: 20, fontWeight: 600, color: t.info }}>{calcWallArea()}</div>
                        <div style={{ fontSize: 12, color: t.info, opacity: 0.8, marginTop: 4 }}>م² جدران</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ fontSize: 14, color: t.text, marginBottom: 12, fontWeight: 500 }}>🔧 بنود العمل</div>
              <div style={{ display: 'grid', gap: 8, marginBottom: 16, maxHeight: 300, overflowY: 'auto' }}>
                {getAvailableItems().map(item => (
                  <div key={item.id} onClick={() => toggleItem(item.id)} style={{ padding: '14px 16px', borderRadius: 12, border: selectedItems.includes(item.id) ? `2px solid ${t.accent}` : `1px solid ${t.border}`, background: selectedItems.includes(item.id) ? `${t.accent}15` : t.cardAlt, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{item.category} - {item.name}</span>
                      <span style={{ fontSize: 11, color: item.type === 'wall' ? t.info : item.type === 'ceiling' ? t.warning : t.success, background: item.type === 'wall' ? `${t.info}20` : item.type === 'ceiling' ? `${t.warning}20` : `${t.success}20`, padding: '2px 8px', borderRadius: 6 }}>{item.type === 'wall' ? 'جدران' : item.type === 'ceiling' ? 'أسقف' : 'أرضية'}</span>
                    </div>
                    <span style={{ fontSize: 13, color: t.muted, background: t.card, padding: '4px 10px', borderRadius: 8 }}>{item.exec} ر.س</span>
                  </div>
                ))}
                {getAvailableItems().length === 0 && <div style={{ textAlign: 'center', padding: '30px 20px', color: t.muted }}><div style={{ fontSize: 32, marginBottom: 8, opacity: 0.4 }}>📋</div><div style={{ fontSize: 13 }}>اختر نوع المكان لعرض البنود</div></div>}
              </div>

              <button onClick={addItems} disabled={!canAdd} style={{ width: '100%', padding: 16, borderRadius: 14, border: 'none', background: canAdd ? `linear-gradient(135deg, ${t.accentDark}, ${t.accent})` : t.cardAlt, color: canAdd ? '#fff' : t.muted, fontSize: 15, fontWeight: 600, cursor: canAdd ? 'pointer' : 'not-allowed' }}>
                {selectedItems.length > 0 ? `➕ إضافة ${selectedItems.length} بند` : 'اختر بنود للإضافة'}
              </button>
            </div>

            <div style={{ background: t.card, borderRadius: 16, border: `1px solid ${t.border}`, padding: 20, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>📋 البنود المضافة <span style={{ color: t.muted }}>({Object.keys(addedItems).length})</span></div>
                {Object.keys(addedItems).length > 0 && <button onClick={() => setAddedItems({})} style={{ padding: '8px 14px', borderRadius: 10, border: 'none', background: `${t.danger}15`, color: t.danger, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>مسح الكل</button>}
              </div>
              {Object.keys(addedItems).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 20px', color: t.muted }}><div style={{ fontSize: 48, marginBottom: 12, opacity: 0.4 }}>📭</div><div style={{ fontSize: 14 }}>لا توجد بنود</div></div>
              ) : (
                Object.entries(addedItems).map(([key, item]) => {
                  const ta = item.places.reduce((s, p) => s + p.area, 0);
                  const ex = ta * item.exec, co = ta * item.cont;
                  return (
                    <div key={key} style={{ padding: 16, borderRadius: 14, border: `1px solid ${t.border}`, marginBottom: 10, background: t.cardAlt }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{item.category} - {item.name}</div>
                          <div style={{ fontSize: 12, color: t.muted }}>إجمالي: {ta} م² • {item.exec} ر.س/م²</div>
                        </div>
                        <button onClick={() => { const ni = { ...addedItems }; delete ni[key]; setAddedItems(ni); }} style={{ width: 32, height: 32, borderRadius: 10, border: 'none', background: `${t.danger}15`, color: t.danger, cursor: 'pointer', fontSize: 14 }}>✕</button>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                        {item.places.map((place, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, background: place.type === 'wet' ? `${t.info}15` : place.type === 'outdoor' ? `${t.success}15` : `${t.accent}15`, padding: '6px 12px', borderRadius: 10, border: `1px solid ${place.type === 'wet' ? t.info : place.type === 'outdoor' ? t.success : t.accent}30` }}>
                            <span style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{place.name}</span>
                            <span style={{ fontSize: 12, color: place.type === 'wet' ? t.info : place.type === 'outdoor' ? t.success : t.accent }}>{place.area}م²</span>
                            <button onClick={(e) => { e.stopPropagation(); removePlace(key, place.name); }} style={{ background: 'none', border: 'none', color: t.danger, cursor: 'pointer', fontSize: 12, padding: 0 }}>✕</button>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                        <div style={{ padding: 10, borderRadius: 10, background: `${t.warning}12`, textAlign: 'center' }}><div style={{ fontSize: 15, fontWeight: 600, color: t.warning }}>{ex.toLocaleString()}</div><div style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>تنفيذ</div></div>
                        <div style={{ padding: 10, borderRadius: 10, background: `${t.info}12`, textAlign: 'center' }}><div style={{ fontSize: 15, fontWeight: 600, color: t.info }}>{co.toLocaleString()}</div><div style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>مقاول</div></div>
                        <div style={{ padding: 10, borderRadius: 10, background: `${t.success}12`, textAlign: 'center' }}><div style={{ fontSize: 15, fontWeight: 600, color: t.success }}>{(ex - co).toLocaleString()}</div><div style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>ربح</div></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {Object.keys(addedItems).length > 0 && (
              <div style={{ background: t.card, borderRadius: 16, border: `1px solid ${t.border}`, padding: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 14 }}>💰 الملخص</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  <div style={{ padding: 18, borderRadius: 14, background: `${t.warning}12`, textAlign: 'center' }}><div style={{ fontSize: 22, fontWeight: 700, color: t.warning }}>{totalExec.toLocaleString()}</div><div style={{ fontSize: 12, color: t.muted, marginTop: 6 }}>تنفيذ</div></div>
                  <div style={{ padding: 18, borderRadius: 14, background: `${t.info}12`, textAlign: 'center' }}><div style={{ fontSize: 22, fontWeight: 700, color: t.info }}>{totalCont.toLocaleString()}</div><div style={{ fontSize: 12, color: t.muted, marginTop: 6 }}>مقاول</div></div>
                  <div style={{ padding: 18, borderRadius: 14, background: `${t.success}12`, textAlign: 'center' }}><div style={{ fontSize: 22, fontWeight: 700, color: t.success }}>{profit.toLocaleString()}</div><div style={{ fontSize: 12, color: t.muted, marginTop: 6 }}>ربح</div></div>
                  <div style={{ padding: 18, borderRadius: 14, background: `${t.accent}15`, textAlign: 'center' }}><div style={{ fontSize: 22, fontWeight: 700, color: t.accent }}>{Math.round(totalExec * 1.15).toLocaleString()}</div><div style={{ fontSize: 12, color: t.muted, marginTop: 6 }}>+ ضريبة</div></div>
                </div>
              </div>
            )}
          </div>
        )}
        {mainTab === 'items' && (
          <div style={{ background: t.card, borderRadius: 16, border: `1px solid ${t.border}`, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>📋 إدارة البنود</h3>
              <button onClick={() => openAddItemModal(selectedCategory)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg, ${t.accentDark}, ${t.accent})`, color: '#fff', fontSize: 13, cursor: 'pointer' }}>+ إضافة بند</button>
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {Object.entries(workItems).map(([key, cat]) => (
                <div key={key} style={{ background: t.cardAlt, borderRadius: 12, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
                  <button onClick={() => setSelectedCategory(selectedCategory === key ? '' : key)} style={{ width: '100%', padding: '14px 16px', border: 'none', background: 'transparent', color: t.text, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'right' }}>
                    <span style={{ fontSize: 20 }}>{cat.icon}</span>
                    <span style={{ flex: 1, fontWeight: 600 }}>{cat.name}</span>
                    <span style={{ fontSize: 12, color: t.muted, background: t.card, padding: '4px 10px', borderRadius: 6 }}>{cat.items.length} بند</span>
                    <span style={{ fontSize: 18, color: t.muted, transition: 'transform 0.2s', transform: selectedCategory === key ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                  </button>
                  {selectedCategory === key && (
                    <div style={{ padding: '0 12px 12px', display: 'grid', gap: 6 }}>
                      {cat.items.map(item => {
                        const enabledPlaces = Object.entries(places).filter(([k, p]) => p.enabled && programming[k]?.[key]?.includes(item.id)).map(([_, p]) => p.name);
                        const typeColor = item.type === 'floor' ? t.success : item.type === 'wall' ? t.info : t.warning;
                        return (
                          <div key={item.id} style={{ padding: '12px 14px', background: t.card, borderRadius: 10, border: `1px solid ${t.border}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                              <span style={{ fontWeight: 600, fontSize: 14, flex: 1 }}>{item.name}</span>
                              <button onClick={() => openEditModal(key, item)} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: `${t.accent}15`, color: t.text, cursor: 'pointer', fontSize: 14 }}>✎</button>
                              <button onClick={() => deleteItem(key, item.id)} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: `${t.danger}15`, color: t.danger, cursor: 'pointer', fontSize: 16 }}>×</button>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 11, color: typeColor, background: `${typeColor}15`, padding: '4px 10px', borderRadius: 6 }}>{item.type === 'floor' ? 'أرضية' : item.type === 'wall' ? 'جدران' : 'أسقف'}</span>
                              <span style={{ fontSize: 11, color: t.warning, background: `${t.warning}15`, padding: '4px 10px', borderRadius: 6 }}>تنفيذ: {item.exec}</span>
                              <span style={{ fontSize: 11, color: t.info, background: `${t.info}15`, padding: '4px 10px', borderRadius: 6 }}>مقاول: {item.cont}</span>
                              <span style={{ fontSize: 11, color: t.success, background: `${t.success}15`, padding: '4px 10px', borderRadius: 6 }}>ربح: {item.exec - item.cont}</span>
                              {enabledPlaces.length > 0 && <span style={{ fontSize: 11, color: t.muted, background: t.cardAlt, padding: '4px 10px', borderRadius: 6 }}>{enabledPlaces.join(' • ')}</span>}
                            </div>
                          </div>
                        );
                      })}
                      {cat.items.length === 0 && <div style={{ textAlign: 'center', padding: 20, color: t.muted }}>لا توجد بنود</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {mainTab === 'programming' && (
          <div style={{ background: t.card, borderRadius: 16, border: `1px solid ${t.border}`, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>إدارة الأماكن والبرمجة</h2>
              <button onClick={openPlaceModal} style={{ padding: '10px 16px', borderRadius: 10, border: 'none', background: t.accent, color: '#fff', fontSize: 13, cursor: 'pointer' }}>+ إضافة مكان</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Object.keys(places).length}, 1fr)`, gap: 16 }}>
              {Object.entries(places).map(([pk, place]) => (
                <div key={pk} style={{ background: t.cardAlt, borderRadius: 14, border: `1px solid ${t.border}`, overflow: 'hidden', opacity: place.enabled ? 1 : 0.5 }}>
                  <div style={{ padding: '12px 16px', background: `${place.color}15`, borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20, filter: 'grayscale(100%)', opacity: 0.7 }}>{place.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>{place.name}</span>
                    <button onClick={() => togglePlaceEnabled(pk)} style={{ width: 40, height: 22, borderRadius: 11, border: 'none', background: place.enabled ? place.color : t.border, cursor: 'pointer', position: 'relative' }}><div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, right: place.enabled ? 2 : 20, transition: 'right 0.2s' }} /></button>
                    <button onClick={() => openPlaceItemsModal(pk)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: `${t.accent}20`, color: t.text, cursor: 'pointer', fontSize: 12 }}>✎</button>
                    {!place.isCore && <button onClick={() => deletePlace(pk)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: `${t.danger}15`, color: t.danger, cursor: 'pointer', fontSize: 14 }}>×</button>}
                  </div>
                  <div style={{ padding: 12, maxHeight: 450, overflowY: 'auto' }}>
                    {Object.entries(workItems).map(([ck, cat]) => {
                      const ec = (programming[pk]?.[ck] || []).length;
                      return (
                        <div key={ck} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, marginBottom: 4, background: ec > 0 ? `${place.color}08` : 'transparent' }}>
                          <span style={{ fontSize: 14, filter: 'grayscale(100%)', opacity: 0.7 }}>{cat.icon}</span>
                          <span style={{ fontSize: 12, flex: 1 }}>{cat.name}</span>
                          <span style={{ fontSize: 10, color: place.color, fontWeight: 600 }}>{ec}/{cat.items.length}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showEditModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: t.bg, borderRadius: 20, padding: 24, maxWidth: 500, width: '100%', border: `1px solid ${t.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>✏️ تحرير البند</h2>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', fontSize: 24, color: t.muted, cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ display: 'grid', gap: 16 }}>
              <div><label style={{ fontSize: 13, color: t.muted, marginBottom: 8, display: 'block' }}>اسم البند</label><input type="text" value={editForm.name} onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))} style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `1px solid ${t.border}`, background: t.card, color: t.text, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} /></div>
              <div><label style={{ fontSize: 13, color: t.muted, marginBottom: 8, display: 'block' }}>تخصص البند</label><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>{[{ k: 'floor', l: 'أرضية', c: t.success }, { k: 'wall', l: 'جدران', c: t.info }, { k: 'ceiling', l: 'أسقف', c: t.warning }].map(ty => (<button key={ty.k} onClick={() => setEditForm(p => ({ ...p, type: ty.k }))} style={{ padding: 12, borderRadius: 10, border: editForm.type === ty.k ? `2px solid ${ty.c}` : `1px solid ${t.border}`, background: editForm.type === ty.k ? `${ty.c}15` : t.card, color: editForm.type === ty.k ? ty.c : t.text, fontSize: 13, cursor: 'pointer' }}>{ty.l}</button>))}</div></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={{ fontSize: 13, color: t.muted, marginBottom: 8, display: 'block' }}>سعر التنفيذ</label><input type="number" value={editForm.exec} onChange={(e) => setEditForm(p => ({ ...p, exec: parseFloat(e.target.value) || 0 }))} style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `1px solid ${t.warning}40`, background: `${t.warning}10`, color: t.warning, fontSize: 16, fontWeight: 600, outline: 'none', boxSizing: 'border-box' }} /></div>
                <div><label style={{ fontSize: 13, color: t.muted, marginBottom: 8, display: 'block' }}>سعر المقاول</label><input type="number" value={editForm.cont} onChange={(e) => setEditForm(p => ({ ...p, cont: parseFloat(e.target.value) || 0 }))} style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `1px solid ${t.info}40`, background: `${t.info}10`, color: t.info, fontSize: 16, fontWeight: 600, outline: 'none', boxSizing: 'border-box' }} /></div>
              </div>
              <div style={{ padding: 16, borderRadius: 12, background: `${t.success}10`, border: `1px solid ${t.success}30`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ color: t.muted, fontSize: 13 }}>الربح المتوقع</span><span style={{ color: t.success, fontSize: 20, fontWeight: 700 }}>{editForm.exec - editForm.cont} ر.س</span></div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => { if (editingItem) { deleteItem(editingItem.catKey, editingItem.itemId); setShowEditModal(false); } }} style={{ padding: '14px 20px', borderRadius: 12, border: 'none', background: `${t.danger}15`, color: t.danger, fontSize: 14, cursor: 'pointer' }}>🗑️ حذف</button>
              <div style={{ flex: 1 }} />
              <button onClick={() => setShowEditModal(false)} style={{ padding: '14px 20px', borderRadius: 12, border: `1px solid ${t.border}`, background: 'transparent', color: t.text, fontSize: 14, cursor: 'pointer' }}>إلغاء</button>
              <button onClick={saveEdit} style={{ padding: '14px 20px', borderRadius: 12, border: 'none', background: t.accent, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>💾 حفظ</button>
            </div>
          </div>
        </div>
      )}

      {showAddItemModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: t.bg, borderRadius: 20, padding: 24, maxWidth: 500, width: '100%', border: `1px solid ${t.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>+ إضافة بند جديد</h2>
              <button onClick={() => setShowAddItemModal(false)} style={{ background: 'none', border: 'none', fontSize: 24, color: t.muted, cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ display: 'grid', gap: 16 }}>
              <div><label style={{ fontSize: 13, color: t.muted, marginBottom: 8, display: 'block' }}>التصنيف</label><div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>{Object.entries(workItems).map(([ck, cat]) => (<button key={ck} onClick={() => setAddItemForm(p => ({ ...p, category: ck }))} style={{ padding: 8, borderRadius: 8, border: addItemForm.category === ck ? `2px solid ${t.accent}` : `1px solid ${t.border}`, background: addItemForm.category === ck ? `${t.accent}15` : t.card, color: addItemForm.category === ck ? t.accent : t.text, fontSize: 10, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}><span style={{ fontSize: 14 }}>{cat.icon}</span><span>{cat.name}</span></button>))}</div></div>
              <div><label style={{ fontSize: 13, color: t.muted, marginBottom: 8, display: 'block' }}>اسم البند</label><input type="text" value={addItemForm.name} onChange={(e) => setAddItemForm(p => ({ ...p, name: e.target.value }))} placeholder="مثال: تركيب سيراميك..." style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `1px solid ${t.border}`, background: t.card, color: t.text, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} /></div>
              <div><label style={{ fontSize: 13, color: t.muted, marginBottom: 8, display: 'block' }}>تخصص البند</label><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>{[{ k: 'floor', l: 'أرضية', c: t.success }, { k: 'wall', l: 'جدران', c: t.info }, { k: 'ceiling', l: 'أسقف', c: t.warning }].map(ty => (<button key={ty.k} onClick={() => setAddItemForm(p => ({ ...p, type: ty.k }))} style={{ padding: 12, borderRadius: 10, border: addItemForm.type === ty.k ? `2px solid ${ty.c}` : `1px solid ${t.border}`, background: addItemForm.type === ty.k ? `${ty.c}15` : t.card, color: addItemForm.type === ty.k ? ty.c : t.text, fontSize: 13, cursor: 'pointer' }}>{ty.l}</button>))}</div></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={{ fontSize: 13, color: t.muted, marginBottom: 8, display: 'block' }}>سعر التنفيذ</label><input type="number" value={addItemForm.exec} onChange={(e) => setAddItemForm(p => ({ ...p, exec: parseFloat(e.target.value) || 0 }))} style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `1px solid ${t.warning}40`, background: `${t.warning}10`, color: t.warning, fontSize: 16, fontWeight: 600, outline: 'none', boxSizing: 'border-box' }} /></div>
                <div><label style={{ fontSize: 13, color: t.muted, marginBottom: 8, display: 'block' }}>سعر المقاول</label><input type="number" value={addItemForm.cont} onChange={(e) => setAddItemForm(p => ({ ...p, cont: parseFloat(e.target.value) || 0 }))} style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `1px solid ${t.info}40`, background: `${t.info}10`, color: t.info, fontSize: 16, fontWeight: 600, outline: 'none', boxSizing: 'border-box' }} /></div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => setShowAddItemModal(false)} style={{ flex: 1, padding: 14, borderRadius: 12, border: `1px solid ${t.border}`, background: 'transparent', color: t.text, fontSize: 14, cursor: 'pointer' }}>إلغاء</button>
              <button onClick={saveNewItem} style={{ flex: 1, padding: 14, borderRadius: 12, border: 'none', background: t.accent, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ إضافة</button>
            </div>
          </div>
        </div>
      )}

      {showPlaceModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: t.bg, borderRadius: 20, padding: 24, maxWidth: 450, width: '100%', border: `1px solid ${t.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>+ إضافة مكان جديد</h2>
              <button onClick={() => setShowPlaceModal(false)} style={{ background: 'none', border: 'none', fontSize: 24, color: t.muted, cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ display: 'grid', gap: 16 }}>
              <div><label style={{ fontSize: 13, color: t.muted, marginBottom: 8, display: 'block' }}>اسم المكان</label><input type="text" value={placeForm.name} onChange={(e) => setPlaceForm(p => ({ ...p, name: e.target.value }))} placeholder="مثال: ملحق، استراحة..." style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `1px solid ${t.border}`, background: t.card, color: t.text, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} /></div>
              <div><label style={{ fontSize: 13, color: t.muted, marginBottom: 8, display: 'block' }}>الأيقونة</label><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{['🏠', '🚿', '🌳', '🏢', '🏬', '🏭', '⛺', '📍', '🏪', '🏨'].map(icon => (<button key={icon} onClick={() => setPlaceForm(p => ({ ...p, icon }))} style={{ width: 40, height: 40, borderRadius: 8, border: placeForm.icon === icon ? `2px solid ${placeForm.color}` : `1px solid ${t.border}`, background: placeForm.icon === icon ? `${placeForm.color}20` : t.card, fontSize: 18, cursor: 'pointer' }}>{icon}</button>))}</div></div>
              <div><label style={{ fontSize: 13, color: t.muted, marginBottom: 8, display: 'block' }}>اللون</label><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{['#818cf8', '#22d3ee', '#4ade80', '#fbbf24', '#f87171', '#a78bfa'].map(color => (<button key={color} onClick={() => setPlaceForm(p => ({ ...p, color }))} style={{ width: 36, height: 36, borderRadius: 8, border: placeForm.color === color ? `3px solid ${t.text}` : `1px solid ${t.border}`, background: color, cursor: 'pointer' }} />))}</div></div>
              <div style={{ padding: 14, borderRadius: 10, background: `${placeForm.color}10`, border: `1px solid ${placeForm.color}30`, display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontSize: 22 }}>{placeForm.icon}</span><span style={{ fontSize: 15, fontWeight: 600, color: placeForm.color }}>{placeForm.name || 'اسم المكان'}</span></div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => setShowPlaceModal(false)} style={{ flex: 1, padding: 14, borderRadius: 12, border: `1px solid ${t.border}`, background: 'transparent', color: t.text, fontSize: 14, cursor: 'pointer' }}>إلغاء</button>
              <button onClick={savePlace} style={{ flex: 1, padding: 14, borderRadius: 12, border: 'none', background: placeForm.color, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ إضافة</button>
            </div>
          </div>
        </div>
      )}

      {showPlaceItemsModal && editingPlaceItems && places[editingPlaceItems] && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: t.bg, borderRadius: 20, padding: 24, maxWidth: 750, width: '100%', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: `1px solid ${t.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28, filter: 'grayscale(100%)', opacity: 0.7 }}>{places[editingPlaceItems].icon}</span>
                <div><h2 style={{ fontSize: 18, fontWeight: 600, margin: 0, color: places[editingPlaceItems].color }}>تحرير {places[editingPlaceItems].name}</h2><p style={{ fontSize: 12, color: t.muted, margin: '4px 0 0' }}>إعدادات المكان وإدارة البنود</p></div>
              </div>
              <button onClick={() => setShowPlaceItemsModal(false)} style={{ background: 'none', border: 'none', fontSize: 24, color: t.muted, cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ background: t.cardAlt, borderRadius: 12, padding: 16, marginBottom: 16, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>⚙️ إعدادات المكان</span>
                <div style={{ marginRight: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: places[editingPlaceItems].enabled ? places[editingPlaceItems].color : t.muted }}>{places[editingPlaceItems].enabled ? 'مفعّل' : 'معطّل'}</span>
                  <button onClick={() => togglePlaceEnabled(editingPlaceItems)} style={{ width: 48, height: 26, borderRadius: 13, border: 'none', background: places[editingPlaceItems].enabled ? places[editingPlaceItems].color : t.border, cursor: 'pointer', position: 'relative' }}><div style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, right: places[editingPlaceItems].enabled ? 2 : 24, transition: 'right 0.2s' }} /></button>
                </div>
                {!places[editingPlaceItems].isCore && <button onClick={() => { deletePlace(editingPlaceItems); setShowPlaceItemsModal(false); }} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: `${t.danger}15`, color: t.danger, fontSize: 12, cursor: 'pointer' }}>🗑️ حذف المكان</button>}
              </div>
              <div style={{ marginBottom: 14 }}><label style={{ fontSize: 11, color: t.muted, marginBottom: 6, display: 'block' }}>اسم المكان</label><input type="text" value={places[editingPlaceItems].name} onChange={(e) => { const np = JSON.parse(JSON.stringify(places)); np[editingPlaceItems].name = e.target.value; setPlaces(np); savePlaceTypes(np); }} style={{ width: '100%', padding: '14px 16px', borderRadius: 10, border: `2px solid ${places[editingPlaceItems].color}40`, background: t.card, color: t.text, fontSize: 16, fontWeight: 600, outline: 'none', boxSizing: 'border-box' }} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={{ fontSize: 11, color: t.muted, marginBottom: 6, display: 'block' }}>الأيقونة</label><div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{['🏠', '🚿', '🌳', '🏢', '🏬', '🏭', '⛺', '📍'].map(icon => (<button key={icon} onClick={() => { const np = JSON.parse(JSON.stringify(places)); np[editingPlaceItems].icon = icon; setPlaces(np); savePlaceTypes(np); }} style={{ width: 40, height: 40, borderRadius: 8, border: places[editingPlaceItems].icon === icon ? `2px solid ${places[editingPlaceItems].color}` : `1px solid ${t.border}`, background: places[editingPlaceItems].icon === icon ? `${places[editingPlaceItems].color}20` : t.card, fontSize: 18, cursor: 'pointer' }}>{icon}</button>))}</div></div>
                <div><label style={{ fontSize: 11, color: t.muted, marginBottom: 6, display: 'block' }}>اللون</label><div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{['#818cf8', '#22d3ee', '#4ade80', '#fbbf24', '#f87171', '#a78bfa'].map(color => (<button key={color} onClick={() => { const np = JSON.parse(JSON.stringify(places)); np[editingPlaceItems].color = color; setPlaces(np); savePlaceTypes(np); }} style={{ width: 32, height: 32, borderRadius: 8, border: places[editingPlaceItems].color === color ? `3px solid ${t.text}` : `1px solid ${t.border}`, background: color, cursor: 'pointer' }} />))}</div></div>
              </div>
            </div>
            <div style={{ marginBottom: 12, flexShrink: 0 }}><button onClick={() => { setShowPlaceItemsModal(false); openAddItemModal(); }} style={{ width: '100%', padding: 12, borderRadius: 10, border: `2px dashed ${places[editingPlaceItems].color}40`, background: `${places[editingPlaceItems].color}05`, color: places[editingPlaceItems].color, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>+ إضافة بند جديد</button></div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {Object.entries(workItems).map(([ck, cat]) => {
                const ei = programming[editingPlaceItems]?.[ck] || [];
                if (cat.items.length === 0) return null;
                return (
                  <div key={ck} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, background: t.cardAlt, marginBottom: 6 }}>
                      <span style={{ fontSize: 14, filter: 'grayscale(100%)', opacity: 0.7 }}>{cat.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{cat.name}</span>
                      <span style={{ fontSize: 10, color: places[editingPlaceItems].color, background: `${places[editingPlaceItems].color}15`, padding: '3px 8px', borderRadius: 4, fontWeight: 600 }}>{ei.length}/{cat.items.length}</span>
                      <button onClick={() => toggleAllCategory(editingPlaceItems, ck, ei.length !== cat.items.length)} style={{ padding: '5px 10px', borderRadius: 6, border: 'none', background: ei.length === cat.items.length ? `${t.danger}15` : `${places[editingPlaceItems].color}15`, color: ei.length === cat.items.length ? t.danger : places[editingPlaceItems].color, fontSize: 10, cursor: 'pointer' }}>{ei.length === cat.items.length ? 'إلغاء الكل' : 'تفعيل الكل'}</button>
                    </div>
                    <div style={{ display: 'grid', gap: 4 }}>
                      {cat.items.map(item => {
                        const isEn = ei.includes(item.id);
                        const tc = item.type === 'floor' ? t.success : item.type === 'wall' ? t.info : t.warning;
                        return (
                          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, background: isEn ? `${places[editingPlaceItems].color}08` : t.card, border: `1px solid ${isEn ? places[editingPlaceItems].color + '30' : t.border}` }}>
                            <button onClick={() => toggleProgramming(editingPlaceItems, ck, item.id)} style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${isEn ? places[editingPlaceItems].color : t.border}`, background: isEn ? places[editingPlaceItems].color : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10 }}>{isEn && '✓'}</button>
                            <span style={{ fontSize: 12, fontWeight: 500, color: isEn ? t.text : t.muted, flex: 1 }}>{item.name}</span>
                            <span style={{ fontSize: 9, color: tc, background: `${tc}15`, padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{item.type === 'floor' ? 'أرضية' : item.type === 'wall' ? 'جدران' : 'أسقف'}</span>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <span style={{ fontSize: 10, color: t.warning, background: `${t.warning}10`, padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{item.exec}</span>
                              <span style={{ fontSize: 10, color: t.info, background: `${t.info}10`, padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{item.cont}</span>
                              <span style={{ fontSize: 10, color: t.success, background: `${t.success}10`, padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{item.exec - item.cont}</span>
                            </div>
                            <button onClick={() => { setShowPlaceItemsModal(false); openEditModal(ck, item); }} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: `${t.accent}20`, color: t.text, cursor: 'pointer', fontSize: 13 }}>✎</button>
                            <button onClick={() => deleteItem(ck, item.id)} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: `${t.danger}20`, color: t.danger, cursor: 'pointer', fontSize: 16 }}>×</button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${t.border}`, flexShrink: 0 }}>
              <button onClick={() => setShowPlaceItemsModal(false)} style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', background: places[editingPlaceItems].color, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>✓ حفظ وإغلاق</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuantityCalculator;
