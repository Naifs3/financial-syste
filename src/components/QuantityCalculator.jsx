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

  // ============ البيانات الافتراضية ============
  const defaultPlaces = {
    dry: ['صالة', 'مجلس', 'مكتب', 'غرفة طعام', 'ممر', 'غرفة نوم رئيسية', 'غرفة نوم 1', 'غرفة نوم 2'],
    wet: ['مطبخ', 'دورة مياه رئيسية', 'دورة مياه 1', 'دورة مياه 2', 'غرفة غسيل'],
    outdoor: ['حوش', 'سطح', 'موقف', 'حديقة']
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
    construction: { name: 'الإنشائيات', icon: '🏗️', items: [
      { id: 'c1', name: 'عظم + مواد', exec: 998, cont: 750, type: 'floor' },
      { id: 'c2', name: 'عظم فقط', exec: 665, cont: 500, type: 'floor' },
    ]},
    electrical: { name: 'الكهرباء', icon: '⚡', items: [
      { id: 'e1', name: 'تأسيس شامل', exec: 45, cont: 30, type: 'floor' },
      { id: 'e2', name: 'تشطيب', exec: 25, cont: 18, type: 'floor' },
      { id: 'e3', name: 'صيانة', exec: 15, cont: 10, type: 'floor' },
    ]},
    plumbing: { name: 'السباكة', icon: '🔧', items: [
      { id: 'pb1', name: 'تأسيس شامل', exec: 80, cont: 55, type: 'floor' },
      { id: 'pb2', name: 'تشطيب', exec: 40, cont: 28, type: 'floor' },
      { id: 'pb3', name: 'صيانة', exec: 20, cont: 12, type: 'floor' },
    ]},
    insulation: { name: 'العزل', icon: '🛡️', items: [
      { id: 'i1', name: 'عزل مائي', exec: 35, cont: 25, type: 'floor' },
      { id: 'i2', name: 'عزل حراري', exec: 30, cont: 20, type: 'floor' },
      { id: 'i3', name: 'عزل صوتي', exec: 40, cont: 28, type: 'wall' },
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
  };

  const defaultPlaceTypes = {
    dry: { name: 'جاف', icon: '🏠', color: '#818cf8', enabled: true, isCore: true },
    wet: { name: 'رطب', icon: '🚿', color: '#22d3ee', enabled: true, isCore: true },
    outdoor: { name: 'خارجي', icon: '🌳', color: '#4ade80', enabled: true, isCore: true }
  };

  const defaultProgramming = {
    dry: { tiles: ['t1','t2','t3','t4','t5','t6','t7'], paint: ['p1','p2','p3','p4'], paintRenew: ['pr1','pr2','pr3'], gypsum: ['g1','g2','g3'], plaster: ['pl1','pl2'], electrical: ['e1','e2','e3'], insulation: ['i3'], doors: ['d1','d2','d3'], ac: ['ac1','ac2','ac3'] },
    wet: { tiles: ['t1','t2','t3','t4','t5','t6'], paint: ['p5'], gypsum: ['g1','g3'], plaster: ['pl1','pl2'], plumbing: ['pb1','pb2','pb3'], electrical: ['e1','e2'], insulation: ['i1'], doors: ['d1','d3'] },
    outdoor: { tiles: ['t5','t8','t9'], paint: ['p5','p6','p7'], plaster: ['pl1','pl2'], construction: ['c1','c2'], insulation: ['i1','i2'], doors: ['d2'], windows: ['w1','w2','w3'] }
  };

  // ============ الحالات ============
  const [workItems, setWorkItems] = useState(defaultWorkItems);
  const [placeTypes, setPlaceTypes] = useState(defaultPlaceTypes);
  const [programming, setProgramming] = useState(defaultProgramming);
  const [locationType, setLocationType] = useState('');
  const [location, setLocation] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [addedItems, setAddedItems] = useState({});
  const [inputMethod, setInputMethod] = useState('direct');
  const [area, setArea] = useState(0);
  const [length, setLength] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(4);
  
  // حالات النوافذ
  const [showProfitModal, setShowProfitModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('tiles');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', exec: 0, cont: 0, type: 'floor' });
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [addItemForm, setAddItemForm] = useState({ name: '', exec: 0, cont: 0, type: 'floor', category: 'tiles' });
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [placeForm, setPlaceForm] = useState({ name: '', icon: '📍', color: '#818cf8' });
  const [showPlaceItemsModal, setShowPlaceItemsModal] = useState(false);
  const [editingPlaceItems, setEditingPlaceItems] = useState(null);
  const [showAddedItemModal, setShowAddedItemModal] = useState(false);
  const [editingAddedItem, setEditingAddedItem] = useState(null);

  // ============ Firebase ============
  useEffect(() => {
    const unsubs = [];
    unsubs.push(onSnapshot(doc(db, 'calculator', 'workItems'), (snap) => { 
      if (snap.exists()) setWorkItems(snap.data()); 
      setLoading(false); 
    }, () => setLoading(false)));
    unsubs.push(onSnapshot(doc(db, 'calculator', 'placeTypes'), (snap) => { 
      if (snap.exists()) setPlaceTypes(snap.data()); 
    }));
    unsubs.push(onSnapshot(doc(db, 'calculator', 'programming'), (snap) => { 
      if (snap.exists()) setProgramming(snap.data()); 
    }));
    return () => unsubs.forEach(u => u());
  }, []);

  const saveWorkItems = async (d) => { try { await setDoc(doc(db, 'calculator', 'workItems'), d); } catch (e) { console.error(e); } };
  const savePlaceTypes = async (d) => { try { await setDoc(doc(db, 'calculator', 'placeTypes'), d); } catch (e) { console.error(e); } };
  const saveProgramming = async (d) => { try { await setDoc(doc(db, 'calculator', 'programming'), d); } catch (e) { console.error(e); } };

  // ============ دوال مساعدة ============
  const quickAreas = [5, 10, 15, 20, 25, 30];
  const calcFloorArea = () => length * width;
  const calcWallArea = () => 2 * (length + width) * height;
  const getArea = () => inputMethod === 'direct' ? area : calcFloorArea();
  const getWallArea = () => inputMethod === 'dimensions' ? calcWallArea() : 0;
  const getFloorFormula = () => inputMethod === 'dimensions' && length > 0 && width > 0 ? `${length}×${width}=${calcFloorArea()}` : '';
  const getWallFormula = () => inputMethod === 'dimensions' && length > 0 && width > 0 ? `2(${length}+${width})×${height}=${calcWallArea()}` : '';
  const adjustValue = (setter, value, delta, min = 0) => { const nv = Math.max(min, value + delta); setter(Number.isInteger(nv) ? nv : parseFloat(nv.toFixed(1))); };
  const fmt = (n) => n.toLocaleString('ar-SA');

  // ============ دوال البرمجة ============
  const toggleProgramming = (pt, ck, iid) => {
    const np = JSON.parse(JSON.stringify(programming));
    if (!np[pt]) np[pt] = {};
    if (!np[pt][ck]) np[pt][ck] = [];
    np[pt][ck] = np[pt][ck].includes(iid) ? np[pt][ck].filter(id => id !== iid) : [...np[pt][ck], iid];
    setProgramming(np);
    saveProgramming(np);
  };

  const toggleAllCategory = (pt, ck, en) => {
    const np = JSON.parse(JSON.stringify(programming));
    if (!np[pt]) np[pt] = {};
    np[pt][ck] = en ? workItems[ck].items.map(i => i.id) : [];
    setProgramming(np);
    saveProgramming(np);
  };

  const isItemEnabled = (pt, ck, iid) => programming[pt]?.[ck]?.includes(iid) || false;
  const isCategoryFullyEnabled = (pt, ck) => (programming[pt]?.[ck] || []).length === (workItems[ck]?.items?.length || 0);
  const isCategoryPartiallyEnabled = (pt, ck) => { const e = programming[pt]?.[ck] || []; return e.length > 0 && e.length < (workItems[ck]?.items?.length || 0); };

  // ============ دوال تحرير البنود ============
  const openEditModal = (ck, item) => {
    setEditingItem({ catKey: ck, itemId: item.id });
    setEditForm({ name: item.name, exec: item.exec, cont: item.cont, type: item.type });
    setShowEditModal(true);
  };

  const saveEdit = () => {
    if (!editingItem) return;
    const nw = JSON.parse(JSON.stringify(workItems));
    nw[editingItem.catKey].items = nw[editingItem.catKey].items.map(i => 
      i.id === editingItem.itemId ? { ...i, ...editForm } : i
    );
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
    Object.keys(np).forEach(pk => {
      if (np[pk]?.[ck]) np[pk][ck] = np[pk][ck].filter(id => id !== iid);
    });
    setProgramming(np);
    saveProgramming(np);
  };

  const openAddItemModal = (ck = null) => {
    setAddItemForm({ name: '', exec: 0, cont: 0, type: 'floor', category: ck || selectedCategory });
    setShowAddItemModal(true);
  };

  const saveNewItem = () => {
    if (!addItemForm.name.trim()) return;
    const nid = `item_${Date.now()}`;
    const nw = JSON.parse(JSON.stringify(workItems));
    nw[addItemForm.category].items.push({
      id: nid,
      name: addItemForm.name,
      exec: Number(addItemForm.exec),
      cont: Number(addItemForm.cont),
      type: addItemForm.type
    });
    setWorkItems(nw);
    saveWorkItems(nw);
    setShowAddItemModal(false);
  };

  // ============ دوال الأماكن ============
  const openPlaceModal = () => {
    setPlaceForm({ name: '', icon: '📍', color: '#818cf8' });
    setShowPlaceModal(true);
  };

  const savePlace = () => {
    if (!placeForm.name.trim()) return;
    const nk = `place_${Date.now()}`;
    const npt = JSON.parse(JSON.stringify(placeTypes));
    npt[nk] = { ...placeForm, enabled: true, isCore: false };
    setPlaceTypes(npt);
    savePlaceTypes(npt);
    
    const np = JSON.parse(JSON.stringify(programming));
    np[nk] = {};
    setProgramming(np);
    saveProgramming(np);
    setShowPlaceModal(false);
  };

  const togglePlaceEnabled = (pk) => {
    const npt = JSON.parse(JSON.stringify(placeTypes));
    npt[pk].enabled = !npt[pk].enabled;
    setPlaceTypes(npt);
    savePlaceTypes(npt);
  };

  const deletePlace = (pk) => {
    if (placeTypes[pk]?.isCore) return;
    const npt = JSON.parse(JSON.stringify(placeTypes));
    delete npt[pk];
    setPlaceTypes(npt);
    savePlaceTypes(npt);
    
    const np = JSON.parse(JSON.stringify(programming));
    delete np[pk];
    setProgramming(np);
    saveProgramming(np);
  };

  const updatePlaceSettings = (pk, updates) => {
    const npt = JSON.parse(JSON.stringify(placeTypes));
    npt[pk] = { ...npt[pk], ...updates };
    setPlaceTypes(npt);
    savePlaceTypes(npt);
  };

  const openPlaceItemsModal = (pk) => {
    setEditingPlaceItems(pk);
    setShowPlaceItemsModal(true);
  };

  // ============ دوال الحاسبة ============
  const toggleItem = (id) => setSelectedItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  
  const getAvailableItems = () => {
    if (!locationType) return [];
    const items = [];
    Object.entries(workItems).forEach(([ck, cat]) => {
      const eids = programming[locationType]?.[ck] || [];
      cat.items.forEach(i => {
        if (eids.includes(i.id)) items.push({ ...i, cat: cat.name, catKey: ck });
      });
    });
    return items;
  };

  const addItems = () => {
    const fa = getArea(), wa = getWallArea();
    if (!location || fa <= 0 || selectedItems.length === 0) return;
    const ff = getFloorFormula(), wf = getWallFormula();
    const nai = JSON.parse(JSON.stringify(addedItems));
    const avail = getAvailableItems();
    
    selectedItems.forEach(id => {
      const item = avail.find(w => w.id === id);
      if (!item) return;
      const isWall = item.type === 'wall' || item.type === 'ceiling';
      const finalArea = isWall && wa > 0 ? wa : fa;
      const formula = isWall && wf ? wf : ff;
      const key = `${item.id}`;
      
      if (!nai[key]) nai[key] = { ...item, places: [] };
      const ep = nai[key].places.find(p => p.name === location);
      if (ep) {
        ep.area += finalArea;
        if (formula && !ep.formula?.includes(formula)) ep.formula = ep.formula ? `${ep.formula} + ${formula}` : formula;
      } else {
        nai[key].places.push({ name: location, area: finalArea, formula, areaType: isWall ? 'wall' : 'floor' });
      }
    });
    setAddedItems(nai);
    setSelectedItems([]);
  };

  const removeItem = (key) => {
    const ni = JSON.parse(JSON.stringify(addedItems));
    delete ni[key];
    setAddedItems(ni);
  };

  const removePlace = (key, pn) => {
    const ni = JSON.parse(JSON.stringify(addedItems));
    ni[key].places = ni[key].places.filter(p => p.name !== pn);
    if (ni[key].places.length === 0) delete ni[key];
    setAddedItems(ni);
  };

  const clearAll = () => setAddedItems({});

  // فتح نافذة تحرير البند المضاف
  const openAddedItemModal = (key, item) => {
    setEditingAddedItem({ key, item: JSON.parse(JSON.stringify(item)) });
    setShowAddedItemModal(true);
  };

  // حفظ تعديلات البند المضاف
  const saveAddedItemEdit = () => {
    if (!editingAddedItem) return;
    const nai = JSON.parse(JSON.stringify(addedItems));
    nai[editingAddedItem.key] = editingAddedItem.item;
    setAddedItems(nai);
    setShowAddedItemModal(false);
    setEditingAddedItem(null);
  };

  // تحديث مساحة مكان في البند المضاف
  const updateAddedItemPlace = (placeIdx, newArea) => {
    if (!editingAddedItem) return;
    const updated = { ...editingAddedItem };
    updated.item.places[placeIdx].area = Number(newArea) || 0;
    setEditingAddedItem(updated);
  };

  const getTotals = () => {
    let e = 0, c = 0, totalArea = 0;
    Object.values(addedItems).forEach(i => {
      const ta = i.places.reduce((s, p) => s + p.area, 0);
      totalArea += ta;
      e += ta * i.exec;
      c += ta * i.cont;
    });
    return { exec: e, cont: c, profit: e - c, totalArea };
  };

  const totals = getTotals();
  const itemCount = Object.keys(addedItems).length;
  const canAdd = location && getArea() > 0 && selectedItems.length > 0;
  const totalItemsCount = Object.values(workItems).reduce((s, c) => s + c.items.length, 0);

  // ============ التحميل ============
  if (loading) return (
    <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'rtl' }}>
      <div style={{ textAlign: 'center', color: t.text }}>
        <div style={{ width: 40, height: 40, border: `3px solid ${t.accent}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
        <p>جاري التحميل...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const labelStyle = { fontSize: 14, color: t.text, marginBottom: 12, fontWeight: 500 };
  const modalOverlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 };
  const modalBox = { background: t.bg, borderRadius: 20, padding: 24, maxWidth: 500, width: '100%', border: `1px solid ${t.border}`, maxHeight: '90vh', overflowY: 'auto' };

  // ============ الواجهة ============
  return (
    <div style={{ minHeight: '100vh', background: t.bg, color: t.text, fontFamily: 'system-ui', padding: 20, direction: 'rtl' }}>
      <style>{`
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: ${t.cardAlt}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 3px; }
      `}</style>
      
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>حاسبة الكميات</h1>
            <p style={{ fontSize: 13, color: t.muted, margin: '6px 0 0' }}>إجمالي {totalItemsCount} بند في {Object.keys(workItems).length} تصنيف</p>
          </div>
          <button onClick={() => setShowProfitModal(true)} style={{ padding: '10px 16px', borderRadius: 12, border: `1px solid ${t.border}`, background: t.card, cursor: 'pointer', fontSize: 14, color: t.text }}>📊 الأرباح</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: t.card, padding: 6, borderRadius: 14, border: `1px solid ${t.border}` }}>
          {[{ key: 'calculator', label: '🧮 الحاسبة' }, { key: 'items', label: '📋 البنود' }, { key: 'programming', label: '⚙️ البرمجة' }].map(tab => (
            <button key={tab.key} onClick={() => setMainTab(tab.key)} style={{ flex: 1, padding: '14px 20px', borderRadius: 10, border: 'none', background: mainTab === tab.key ? t.accent : 'transparent', color: mainTab === tab.key ? '#fff' : t.muted, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{tab.label}</button>
          ))}
        </div>

        {/* ==================== تاب الحاسبة ==================== */}
        {mainTab === 'calculator' && (
          <>
            <div style={{ background: t.card, borderRadius: 16, border: `1px solid ${t.border}`, padding: 20, marginBottom: 16 }}>
              <div style={labelStyle}>📍 نوع المكان</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                {Object.entries(placeTypes).filter(([_, p]) => p.enabled).map(([key, place]) => (
                  <div key={key} onClick={() => { setLocationType(key); setLocation(''); setSelectedItems([]); }} style={{ padding: '16px 12px', borderRadius: 14, border: locationType === key ? `2px solid ${place.color}` : `1px solid ${t.border}`, background: locationType === key ? `${place.color}18` : t.cardAlt, cursor: 'pointer', textAlign: 'center' }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{place.icon}</div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{place.name}</div>
                  </div>
                ))}
              </div>

              <div style={labelStyle}>🏷️ المكان</div>
              <select value={location} onChange={(e) => setLocation(e.target.value)} disabled={!locationType} style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `1px solid ${t.border}`, background: t.cardAlt, color: t.text, fontSize: 14, outline: 'none', marginBottom: 16, cursor: 'pointer' }}>
                <option value="">اختر المكان</option>
                {locationType && defaultPlaces[locationType]?.map(p => <option key={p} value={p}>{p}</option>)}
              </select>

              <div style={labelStyle}>📐 المساحة</div>
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
                        <input type="number" value={area} onChange={(e) => setArea(parseFloat(e.target.value) || 0)} style={{ width: 100, background: 'transparent', border: 'none', color: t.text, fontSize: 42, fontWeight: 600, textAlign: 'center', outline: 'none' }} />
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
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 12 }}>
                      {[{ l: 'الطول', v: length, s: setLength, c: t.text }, { l: 'العرض', v: width, s: setWidth, c: t.text }, { l: 'الارتفاع', v: height, s: setHeight, c: t.warning }].map(({ l, v, s, c }) => (
                        <div key={l} style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 14, color: c, marginBottom: 10, fontWeight: 500 }}>{l}</div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            <button onClick={() => adjustValue(s, v, -0.5)} style={{ width: 44, height: 44, borderRadius: 12, border: `1px solid ${c === t.warning ? `${t.warning}50` : t.border}`, background: c === t.warning ? `${t.warning}20` : t.card, color: c, fontSize: 22, cursor: 'pointer', fontWeight: 600 }}>−</button>
                            <input type="number" value={v} onChange={(e) => s(parseFloat(e.target.value) || 0)} style={{ width: 55, background: 'transparent', border: 'none', color: c, fontSize: 22, fontWeight: 600, textAlign: 'center', outline: 'none' }} />
                            <button onClick={() => adjustValue(s, v, 0.5)} style={{ width: 44, height: 44, borderRadius: 12, border: `1px solid ${c === t.warning ? `${t.warning}50` : t.border}`, background: c === t.warning ? `${t.warning}20` : t.card, color: c, fontSize: 22, cursor: 'pointer', fontWeight: 600 }}>+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                      <div style={{ flex: 1, padding: '12px', borderRadius: 12, background: `${t.success}15`, border: `1px solid ${t.success}30`, textAlign: 'center' }}>
                        <div style={{ fontSize: 20, fontWeight: 600, color: t.success }}>{calcFloorArea()}</div>
                        <div style={{ fontSize: 12, color: t.success, opacity: 0.8, marginTop: 4 }}>م² أرضية</div>
                        {length > 0 && width > 0 && <div style={{ fontSize: 10, color: t.muted, marginTop: 2 }}>{length}×{width}</div>}
                      </div>
                      <div style={{ flex: 1, padding: '12px', borderRadius: 12, background: `${t.info}15`, border: `1px solid ${t.info}30`, textAlign: 'center' }}>
                        <div style={{ fontSize: 20, fontWeight: 600, color: t.info }}>{calcWallArea()}</div>
                        <div style={{ fontSize: 12, color: t.info, opacity: 0.8, marginTop: 4 }}>م² جدران</div>
                        {length > 0 && width > 0 && <div style={{ fontSize: 10, color: t.muted, marginTop: 2 }}>2({length}+{width})×{height}</div>}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div style={labelStyle}>🔧 بنود العمل</div>
              <div style={{ display: 'grid', gap: 8, marginBottom: 16, maxHeight: 300, overflowY: 'auto' }}>
                {getAvailableItems().map(item => (
                  <div key={item.id} onClick={() => toggleItem(item.id)} style={{ padding: '14px 16px', borderRadius: 12, border: selectedItems.includes(item.id) ? `2px solid ${t.accent}` : `1px solid ${t.border}`, background: selectedItems.includes(item.id) ? `${t.accent}15` : t.cardAlt, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{item.cat} - {item.name}</span>
                      <span style={{ fontSize: 11, color: item.type === 'wall' ? t.info : item.type === 'ceiling' ? t.warning : t.success, background: item.type === 'wall' ? `${t.info}20` : item.type === 'ceiling' ? `${t.warning}20` : `${t.success}20`, padding: '2px 8px', borderRadius: 6 }}>{item.type === 'wall' ? 'جدران' : item.type === 'ceiling' ? 'أسقف' : 'أرضية'}</span>
                    </div>
                    <span style={{ fontSize: 13, color: t.muted, background: t.card, padding: '4px 10px', borderRadius: 8 }}>{item.exec} ر.س</span>
                  </div>
                ))}
                {locationType && getAvailableItems().length === 0 && <div style={{ textAlign: 'center', padding: 20, color: t.muted }}>لا توجد بنود مبرمجة لهذا المكان</div>}
              </div>

              <button onClick={addItems} disabled={!canAdd} style={{ width: '100%', padding: 16, borderRadius: 14, border: 'none', background: canAdd ? `linear-gradient(135deg, ${t.accentDark}, ${t.accent})` : t.cardAlt, color: canAdd ? '#fff' : t.muted, fontSize: 15, fontWeight: 600, cursor: canAdd ? 'pointer' : 'not-allowed' }}>
                {selectedItems.length > 0 ? `➕ إضافة ${selectedItems.length} بند` : 'اختر بنود للإضافة'}
              </button>
            </div>

            {/* البنود المضافة */}
            <div style={{ background: t.card, borderRadius: 16, border: `1px solid ${t.border}`, padding: 20, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>📋 البنود المضافة <span style={{ color: t.muted }}>({itemCount})</span></div>
                {itemCount > 0 && <button onClick={clearAll} style={{ padding: '8px 14px', borderRadius: 10, border: 'none', background: `${t.danger}15`, color: t.danger, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>مسح الكل</button>}
              </div>

              {itemCount === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 20px', color: t.muted }}><div style={{ fontSize: 48, marginBottom: 12, opacity: 0.4 }}>📭</div><div style={{ fontSize: 14 }}>لا توجد بنود مضافة</div></div>
              ) : (
                Object.entries(addedItems).map(([key, item]) => {
                  const totalArea = item.places.reduce((sum, p) => sum + p.area, 0);
                  const exec = totalArea * item.exec, cont = totalArea * item.cont, profit = exec - cont;
                  return (
                    <div key={key} style={{ padding: 16, borderRadius: 14, border: `1px solid ${t.border}`, marginBottom: 10, background: t.cardAlt }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{item.cat} - {item.name}</div>
                          <div style={{ fontSize: 12, color: t.muted }}>إجمالي: {totalArea} م² × {item.exec} ر.س = {fmt(exec)} ر.س</div>
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => openAddedItemModal(key, item)} style={{ width: 32, height: 32, borderRadius: 10, border: 'none', background: `${t.accent}20`, color: t.accent, cursor: 'pointer', fontSize: 14 }}>✎</button>
                          <button onClick={() => removeItem(key)} style={{ width: 32, height: 32, borderRadius: 10, border: 'none', background: `${t.danger}15`, color: t.danger, cursor: 'pointer', fontSize: 14 }}>✕</button>
                        </div>
                      </div>
                      
                      {/* الأماكن مع المعادلات */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                        {item.places.map((place, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, background: place.areaType === 'wall' ? `${t.info}15` : `${t.success}15`, padding: '8px 12px', borderRadius: 10, border: `1px solid ${place.areaType === 'wall' ? t.info : t.success}30` }}>
                            <span style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{place.name}</span>
                            <span style={{ fontSize: 12, color: place.areaType === 'wall' ? t.info : t.success, fontWeight: 600 }}>{place.area}م²</span>
                            {place.formula && <span style={{ fontSize: 10, color: t.muted, background: t.card, padding: '2px 6px', borderRadius: 4 }}>{place.formula}</span>}
                            <button onClick={(e) => { e.stopPropagation(); removePlace(key, place.name); }} style={{ background: 'none', border: 'none', color: t.danger, cursor: 'pointer', fontSize: 12, padding: 0, marginRight: 4 }}>✕</button>
                          </div>
                        ))}
                      </div>
                      
                      {/* الحسابات */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                        <div style={{ padding: 10, borderRadius: 10, background: `${t.warning}12`, textAlign: 'center' }}><div style={{ fontSize: 15, fontWeight: 600, color: t.warning }}>{fmt(exec)}</div><div style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>تنفيذ</div></div>
                        <div style={{ padding: 10, borderRadius: 10, background: `${t.info}12`, textAlign: 'center' }}><div style={{ fontSize: 15, fontWeight: 600, color: t.info }}>{fmt(cont)}</div><div style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>مقاول</div></div>
                        <div style={{ padding: 10, borderRadius: 10, background: `${t.success}12`, textAlign: 'center' }}><div style={{ fontSize: 15, fontWeight: 600, color: t.success }}>{fmt(profit)}</div><div style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>ربح</div></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* الملخص المالي الكامل */}
            {itemCount > 0 && (
              <div style={{ background: t.card, borderRadius: 16, border: `1px solid ${t.border}`, padding: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 14 }}>💰 الملخص المالي</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16 }}>
                  <div style={{ padding: 16, borderRadius: 14, background: `${t.accent}10`, textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: t.accent }}>{totals.totalArea}</div>
                    <div style={{ fontSize: 12, color: t.muted, marginTop: 4 }}>إجمالي المساحة (م²)</div>
                  </div>
                  <div style={{ padding: 16, borderRadius: 14, background: `${t.muted}10`, textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: t.text }}>{itemCount}</div>
                    <div style={{ fontSize: 12, color: t.muted, marginTop: 4 }}>عدد البنود</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  <div style={{ padding: 18, borderRadius: 14, background: `${t.warning}12`, textAlign: 'center' }}><div style={{ fontSize: 22, fontWeight: 700, color: t.warning }}>{fmt(totals.exec)}</div><div style={{ fontSize: 12, color: t.muted, marginTop: 6 }}>تنفيذ</div></div>
                  <div style={{ padding: 18, borderRadius: 14, background: `${t.info}12`, textAlign: 'center' }}><div style={{ fontSize: 22, fontWeight: 700, color: t.info }}>{fmt(totals.cont)}</div><div style={{ fontSize: 12, color: t.muted, marginTop: 6 }}>مقاول</div></div>
                  <div style={{ padding: 18, borderRadius: 14, background: `${t.success}12`, textAlign: 'center' }}><div style={{ fontSize: 22, fontWeight: 700, color: t.success }}>{fmt(totals.profit)}</div><div style={{ fontSize: 12, color: t.muted, marginTop: 6 }}>ربح ({totals.cont > 0 ? ((totals.profit / totals.cont) * 100).toFixed(0) : 0}%)</div></div>
                  <div style={{ padding: 18, borderRadius: 14, background: `${t.accent}15`, textAlign: 'center' }}><div style={{ fontSize: 22, fontWeight: 700, color: t.accent }}>{fmt(Math.round(totals.exec * 1.15))}</div><div style={{ fontSize: 12, color: t.muted, marginTop: 6 }}>+ ضريبة 15%</div></div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ==================== تاب البنود ==================== */}
        {mainTab === 'items' && (
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16 }}>
            <div style={{ background: t.card, borderRadius: 16, border: `1px solid ${t.border}`, padding: 12, height: 'fit-content', position: 'sticky', top: 20 }}>
              <div style={{ fontSize: 12, color: t.muted, marginBottom: 10, padding: '0 8px' }}>التصنيفات</div>
              {Object.entries(workItems).map(([key, cat]) => (
                <div key={key} onClick={() => setSelectedCategory(key)} style={{ padding: '12px 14px', borderRadius: 10, marginBottom: 6, cursor: 'pointer', background: selectedCategory === key ? `${t.accent}20` : 'transparent', border: selectedCategory === key ? `1px solid ${t.accent}50` : '1px solid transparent', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{cat.icon}</span>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 500 }}>{cat.name}</div><div style={{ fontSize: 11, color: t.muted }}>{cat.items.length} بند</div></div>
                </div>
              ))}
            </div>

            <div style={{ background: t.card, borderRadius: 16, border: `1px solid ${t.border}`, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontSize: 24 }}>{workItems[selectedCategory]?.icon}</span><h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{workItems[selectedCategory]?.name}</h2></div>
                <button onClick={() => openAddItemModal(selectedCategory)} style={{ padding: '10px 18px', borderRadius: 10, border: 'none', background: t.accent, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ إضافة بند</button>
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                {workItems[selectedCategory]?.items.map(item => {
                  const enabledPlaces = Object.entries(placeTypes).filter(([k, p]) => p.enabled && programming[k]?.[selectedCategory]?.includes(item.id)).map(([_, p]) => p.name);
                  const typeColor = item.type === 'floor' ? '#4ade80' : item.type === 'wall' ? '#22d3ee' : '#fbbf24';
                  return (
                    <div key={item.id} style={{ padding: 14, borderRadius: 12, background: t.cardAlt, border: `1px solid ${t.border}` }}>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: t.text }}>{item.name}</div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, flexWrap: 'wrap' }}>
                        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 8, color: t.muted, marginBottom: 3 }}>تخصص</div><span style={{ display: 'block', fontSize: 10, fontWeight: 600, color: typeColor, background: `${typeColor}15`, padding: '6px 10px', borderRadius: 6, border: `1px solid ${typeColor}40` }}>{item.type === 'wall' ? 'جدران' : item.type === 'ceiling' ? 'أسقف' : 'أرضية'}</span></div>
                        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 8, color: t.muted, marginBottom: 3 }}>مكان</div><span style={{ display: 'block', fontSize: 10, fontWeight: 600, color: enabledPlaces.length > 0 ? '#a78bfa' : t.muted, background: enabledPlaces.length > 0 ? '#a78bfa15' : `${t.muted}15`, padding: '6px 10px', borderRadius: 6, border: `1px solid ${enabledPlaces.length > 0 ? '#a78bfa40' : t.border}` }}>{enabledPlaces.length === 0 ? '—' : enabledPlaces.length === Object.keys(placeTypes).filter(k => placeTypes[k].enabled).length ? 'الكل' : enabledPlaces.join(' • ')}</span></div>
                        <div style={{ flex: 1 }}></div>
                        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 8, color: t.muted, marginBottom: 3 }}>تنفيذ</div><div style={{ padding: '6px 10px', borderRadius: 6, border: `1px solid ${t.warning}40`, background: `${t.warning}10`, color: t.warning, fontSize: 11, fontWeight: 600 }}>{item.exec}</div></div>
                        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 8, color: t.muted, marginBottom: 3 }}>مقاول</div><div style={{ padding: '6px 10px', borderRadius: 6, border: `1px solid ${t.info}40`, background: `${t.info}10`, color: t.info, fontSize: 11, fontWeight: 600 }}>{item.cont}</div></div>
                        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 8, color: t.muted, marginBottom: 3 }}>ربح</div><div style={{ padding: '6px 10px', borderRadius: 6, background: `${t.success}10`, border: `1px solid ${t.success}40`, color: t.success, fontSize: 11, fontWeight: 600 }}>{item.exec - item.cont}</div></div>
                        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 8, color: t.muted, marginBottom: 3 }}>تحرير</div><button onClick={() => openEditModal(selectedCategory, item)} style={{ width: 32, height: 32, borderRadius: 6, border: 'none', background: `${t.accent}20`, color: t.accent, cursor: 'pointer', fontSize: 12 }}>✎</button></div>
                        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 8, color: t.muted, marginBottom: 3 }}>حذف</div><button onClick={() => deleteItem(selectedCategory, item.id)} style={{ width: 32, height: 32, borderRadius: 6, border: 'none', background: `${t.danger}15`, color: t.danger, cursor: 'pointer', fontSize: 14 }}>×</button></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================== تاب البرمجة ==================== */}
        {mainTab === 'programming' && (
          <div style={{ background: t.card, borderRadius: 16, border: `1px solid ${t.border}`, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>إدارة الأماكن والبرمجة</h2>
              <button onClick={openPlaceModal} style={{ padding: '10px 16px', borderRadius: 10, border: 'none', background: t.accent, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>+ إضافة مكان</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(Object.keys(placeTypes).length, 3)}, 1fr)`, gap: 16 }}>
              {Object.entries(placeTypes).map(([pk, place]) => (
                <div key={pk} style={{ background: t.cardAlt, borderRadius: 14, border: `1px solid ${t.border}`, overflow: 'hidden', opacity: place.enabled ? 1 : 0.5 }}>
                  <div style={{ padding: '12px 16px', background: `${place.color}15`, borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{place.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>{place.name}</span>
                    <button onClick={() => togglePlaceEnabled(pk)} style={{ width: 40, height: 22, borderRadius: 11, border: 'none', background: place.enabled ? place.color : t.border, cursor: 'pointer', position: 'relative' }}><div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, right: place.enabled ? 2 : 20, transition: 'right 0.2s' }} /></button>
                    <button onClick={() => openPlaceItemsModal(pk)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: `${t.accent}20`, color: t.accent, cursor: 'pointer', fontSize: 12 }}>✎</button>
                    {!place.isCore && <button onClick={() => deletePlace(pk)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: `${t.danger}15`, color: t.danger, cursor: 'pointer', fontSize: 14 }}>×</button>}
                  </div>
                  <div style={{ padding: 12, maxHeight: 400, overflowY: 'auto' }}>
                    {Object.entries(workItems).map(([ck, cat]) => {
                      const isFullyEnabled = isCategoryFullyEnabled(pk, ck);
                      const isPartiallyEnabled = isCategoryPartiallyEnabled(pk, ck);
                      return (
                        <div key={ck} style={{ marginBottom: 12 }}>
                          <div onClick={() => place.enabled && toggleAllCategory(pk, ck, !isFullyEnabled)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, background: t.card, cursor: place.enabled ? 'pointer' : 'default', border: `1px solid ${isFullyEnabled ? place.color : isPartiallyEnabled ? `${place.color}50` : t.border}` }}>
                            <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${isFullyEnabled ? place.color : t.border}`, background: isFullyEnabled ? place.color : isPartiallyEnabled ? `${place.color}50` : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff' }}>{isFullyEnabled && '✓'}{isPartiallyEnabled && '−'}</div>
                            <span style={{ fontSize: 14 }}>{cat.icon}</span>
                            <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{cat.name}</span>
                            <span style={{ fontSize: 11, color: t.muted }}>{(programming[pk]?.[ck] || []).length}/{cat.items.length}</span>
                          </div>
                          <div style={{ paddingRight: 20, marginTop: 6 }}>
                            {cat.items.map(item => {
                              const isEnabled = isItemEnabled(pk, ck, item.id);
                              return (
                                <div key={item.id} onClick={() => place.enabled && toggleProgramming(pk, ck, item.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, cursor: place.enabled ? 'pointer' : 'default', marginBottom: 4, background: isEnabled ? `${place.color}10` : 'transparent' }}>
                                  <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${isEnabled ? place.color : t.border}`, background: isEnabled ? place.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff' }}>{isEnabled && '✓'}</div>
                                  <span style={{ fontSize: 12, color: isEnabled ? t.text : t.muted }}>{item.name}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== النوافذ المنبثقة ==================== */}
        
        {/* نافذة الأرباح */}
        {showProfitModal && (
          <div style={modalOverlay}>
            <div style={modalBox}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>📊 تقرير الأرباح</h2>
                <button onClick={() => setShowProfitModal(false)} style={{ background: 'none', border: 'none', fontSize: 24, color: t.muted, cursor: 'pointer' }}>×</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
                <div style={{ padding: 20, borderRadius: 14, background: `${t.warning}12`, textAlign: 'center' }}><div style={{ fontSize: 28, fontWeight: 700, color: t.warning }}>{fmt(totals.exec)}</div><div style={{ fontSize: 13, color: t.muted, marginTop: 6 }}>إجمالي التنفيذ</div></div>
                <div style={{ padding: 20, borderRadius: 14, background: `${t.info}12`, textAlign: 'center' }}><div style={{ fontSize: 28, fontWeight: 700, color: t.info }}>{fmt(totals.cont)}</div><div style={{ fontSize: 13, color: t.muted, marginTop: 6 }}>إجمالي المقاول</div></div>
                <div style={{ padding: 20, borderRadius: 14, background: `${t.success}12`, textAlign: 'center' }}><div style={{ fontSize: 28, fontWeight: 700, color: t.success }}>{fmt(totals.profit)}</div><div style={{ fontSize: 13, color: t.muted, marginTop: 6 }}>صافي الربح</div></div>
                <div style={{ padding: 20, borderRadius: 14, background: `${t.accent}15`, textAlign: 'center' }}><div style={{ fontSize: 28, fontWeight: 700, color: t.accent }}>{totals.cont > 0 ? ((totals.profit / totals.cont) * 100).toFixed(1) : 0}%</div><div style={{ fontSize: 13, color: t.muted, marginTop: 6 }}>نسبة الربح</div></div>
              </div>
              <div style={{ padding: 16, borderRadius: 12, background: t.card, border: `1px solid ${t.border}`, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}><span style={{ color: t.muted }}>إجمالي المساحة</span><span style={{ fontWeight: 600 }}>{totals.totalArea} م²</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}><span style={{ color: t.muted }}>عدد البنود</span><span style={{ fontWeight: 600 }}>{itemCount} بند</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ color: t.muted }}>الإجمالي + ضريبة 15%</span><span style={{ fontSize: 18, fontWeight: 700, color: t.accent }}>{fmt(Math.round(totals.exec * 1.15))} ر.س</span></div>
              </div>
              <button onClick={() => setShowProfitModal(false)} style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', background: t.accent, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>إغلاق</button>
            </div>
          </div>
        )}

        {/* نافذة تحرير البند */}
        {showEditModal && editingItem && (
          <div style={modalOverlay}>
            <div style={modalBox}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}><h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>✏️ تحرير البند</h2><button onClick={() => { setShowEditModal(false); setEditingItem(null); }} style={{ background: 'none', border: 'none', fontSize: 24, color: t.muted, cursor: 'pointer' }}>×</button></div>
              <div style={{ display: 'grid', gap: 16 }}>
                <div><label style={{ fontSize: 13, color: t.muted, marginBottom: 8, display: 'block' }}>اسم البند</label><input type="text" value={editForm.name} onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))} style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `1px solid ${t.border}`, background: t.card, color: t.text, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} /></div>
                <div><label style={{ fontSize: 13, color: t.muted, marginBottom: 8, display: 'block' }}>تخصص البند</label><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>{[{ key: 'floor', label: 'أرضية', color: t.success }, { key: 'wall', label: 'جدران', color: t.info }, { key: 'ceiling', label: 'أسقف', color: t.warning }].map(type => (<button key={type.key} onClick={() => setEditForm(p => ({ ...p, type: type.key }))} style={{ padding: '12px', borderRadius: 10, border: editForm.type === type.key ? `2px solid ${type.color}` : `1px solid ${t.border}`, background: editForm.type === type.key ? `${type.color}15` : t.card, color: editForm.type === type.key ? type.color : t.text, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>{type.label}</button>))}</div></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}><div><label style={{ fontSize: 13, color: t.muted, marginBottom: 8, display: 'block' }}>💰 سعر التنفيذ</label><input type="number" value={editForm.exec} onChange={(e) => setEditForm(p => ({ ...p, exec: parseFloat(e.target.value) || 0 }))} style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `1px solid ${t.warning}40`, background: `${t.warning}10`, color: t.warning, fontSize: 16, fontWeight: 600, outline: 'none', boxSizing: 'border-box' }} /></div><div><label style={{ fontSize: 13, color: t.muted, marginBottom: 8, display: 'block' }}>💵 سعر المقاول</label><input type="number" value={editForm.cont} onChange={(e) => setEditForm(p => ({ ...p, cont: parseFloat(e.target.value) || 0 }))} style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `1px solid ${t.info}40`, background: `${t.info}10`, color: t.info, fontSize: 16, fontWeight: 600, outline: 'none', boxSizing: 'border-box' }} /></div></div>
                <div style={{ padding: 16, borderRadius: 12, background: `${t.success}10`, border: `1px solid ${t.success}30`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ color: t.muted, fontSize: 13 }}>الربح المتوقع</span><span style={{ color: t.success, fontSize: 20, fontWeight: 700 }}>{editForm.exec - editForm.cont} ر.س</span></div>
                <div><label style={{ fontSize: 13, color: t.muted, marginBottom: 8, display: 'block' }}>مكان البند</label><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{Object.entries(placeTypes).filter(([_, p]) => p.enabled).map(([pk, place]) => { const isEnabled = programming[pk]?.[editingItem.catKey]?.includes(editingItem.itemId); return (<button key={pk} onClick={() => toggleProgramming(pk, editingItem.catKey, editingItem.itemId)} style={{ padding: '10px 14px', borderRadius: 10, border: isEnabled ? `2px solid ${place.color}` : `1px solid ${t.border}`, background: isEnabled ? `${place.color}15` : t.card, color: isEnabled ? place.color : t.muted, fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><span>{place.icon}</span><span>{place.name}</span>{isEnabled && <span>✓</span>}</button>); })}</div></div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}><button onClick={() => { deleteItem(editingItem.catKey, editingItem.itemId); setShowEditModal(false); setEditingItem(null); }} style={{ padding: '14px 20px', borderRadius: 12, border: 'none', background: `${t.danger}15`, color: t.danger, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>🗑️ حذف</button><div style={{ flex: 1 }}></div><button onClick={() => { setShowEditModal(false); setEditingItem(null); }} style={{ padding: '14px 20px', borderRadius: 12, border: `1px solid ${t.border}`, background: 'transparent', color: t.text, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>إلغاء</button><button onClick={saveEdit} style={{ padding: '14px 20px', borderRadius: 12, border: 'none', background: t.accent, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>💾 حفظ</button></div>
            </div>
          </div>
        )}

        {/* نافذة إضافة بند */}
        {showAddItemModal && (
          <div style={modalOverlay}>
            <div style={modalBox}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}><h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>+ إضافة بند جديد</h2><button onClick={() => setShowAddItemModal(false)} style={{ background: 'none', border: 'none', fontSize: 24, color: t.muted, cursor: 'pointer' }}>×</button></div>
              <div style={{ display: 'grid', gap: 16 }}>
                <div><label style={{ fontSize: 13, color: t.muted, marginBottom: 8, display: 'block' }}>التصنيف</label><div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>{Object.entries(workItems).map(([ck, cat]) => (<button key={ck} onClick={() => setAddItemForm(p => ({ ...p, category: ck }))} style={{ padding: '10px 8px', borderRadius: 8, border: addItemForm.category === ck ? `2px solid ${t.accent}` : `1px solid ${t.border}`, background: addItemForm.category === ck ? `${t.accent}15` : t.card, color: addItemForm.category === ck ? t.accent : t.text, fontSize: 10, fontWeight: 500, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}><span style={{ fontSize: 16 }}>{cat.icon}</span><span>{cat.name}</span></button>))}</div></div>
                <div><label style={{ fontSize: 13, color: t.muted, marginBottom: 8, display: 'block' }}>اسم البند</label><input type="text" value={addItemForm.name} onChange={(e) => setAddItemForm(p => ({ ...p, name: e.target.value }))} placeholder="مثال: تركيب سيراميك..." style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `1px solid ${t.border}`, background: t.card, color: t.text, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} /></div>
                <div><label style={{ fontSize: 13, color: t.muted, marginBottom: 8, display: 'block' }}>تخصص البند</label><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>{[{ key: 'floor', label: 'أرضية', color: t.success }, { key: 'wall', label: 'جدران', color: t.info }, { key: 'ceiling', label: 'أسقف', color: t.warning }].map(type => (<button key={type.key} onClick={() => setAddItemForm(p => ({ ...p, type: type.key }))} style={{ padding: '12px', borderRadius: 10, border: addItemForm.type === type.key ? `2px solid ${type.color}` : `1px solid ${t.border}`, background: addItemForm.type === type.key ? `${type.color}15` : t.card, color: addItemForm.type === type.key ? type.color : t.text, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>{type.label}</button>))}</div></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}><div><label style={{ fontSize: 13, color: t.muted, marginBottom: 8, display: 'block' }}>💰 سعر التنفيذ</label><input type="number" value={addItemForm.exec} onChange={(e) => setAddItemForm(p => ({ ...p, exec: parseFloat(e.target.value) || 0 }))} style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `1px solid ${t.warning}40`, background: `${t.warning}10`, color: t.warning, fontSize: 16, fontWeight: 600, outline: 'none', boxSizing: 'border-box' }} /></div><div><label style={{ fontSize: 13, color: t.muted, marginBottom: 8, display: 'block' }}>💵 سعر المقاول</label><input type="number" value={addItemForm.cont} onChange={(e) => setAddItemForm(p => ({ ...p, cont: parseFloat(e.target.value) || 0 }))} style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `1px solid ${t.info}40`, background: `${t.info}10`, color: t.info, fontSize: 16, fontWeight: 600, outline: 'none', boxSizing: 'border-box' }} /></div></div>
                <div style={{ padding: 16, borderRadius: 12, background: `${t.success}10`, border: `1px solid ${t.success}30`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ color: t.muted, fontSize: 13 }}>الربح المتوقع</span><span style={{ color: t.success, fontSize: 20, fontWeight: 700 }}>{addItemForm.exec - addItemForm.cont} ر.س</span></div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}><button onClick={() => setShowAddItemModal(false)} style={{ flex: 1, padding: '14px', borderRadius: 12, border: `1px solid ${t.border}`, background: 'transparent', color: t.text, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>إلغاء</button><button onClick={saveNewItem} style={{ flex: 1, padding: '14px', borderRadius: 12, border: 'none', background: t.accent, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ إضافة البند</button></div>
            </div>
          </div>
        )}

        {/* نافذة إضافة مكان */}
        {showPlaceModal && (
          <div style={modalOverlay}>
            <div style={{ ...modalBox, maxWidth: 450 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}><h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>+ إضافة مكان جديد</h2><button onClick={() => setShowPlaceModal(false)} style={{ background: 'none', border: 'none', fontSize: 24, color: t.muted, cursor: 'pointer' }}>×</button></div>
              <div style={{ display: 'grid', gap: 16 }}>
                <div><label style={{ fontSize: 13, color: t.muted, marginBottom: 8, display: 'block' }}>اسم المكان</label><input type="text" value={placeForm.name} onChange={(e) => setPlaceForm(p => ({ ...p, name: e.target.value }))} placeholder="مثال: ملحق، استراحة..." style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `1px solid ${t.border}`, background: t.card, color: t.text, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} /></div>
                <div><label style={{ fontSize: 13, color: t.muted, marginBottom: 8, display: 'block' }}>الأيقونة</label><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{['🏠', '🚿', '🌳', '🏢', '🏬', '🏭', '⛺', '📍', '🏪', '🏨'].map(icon => (<button key={icon} onClick={() => setPlaceForm(p => ({ ...p, icon }))} style={{ width: 40, height: 40, borderRadius: 8, border: placeForm.icon === icon ? `2px solid ${placeForm.color}` : `1px solid ${t.border}`, background: placeForm.icon === icon ? `${placeForm.color}20` : t.card, fontSize: 18, cursor: 'pointer' }}>{icon}</button>))}</div></div>
                <div><label style={{ fontSize: 13, color: t.muted, marginBottom: 8, display: 'block' }}>اللون</label><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{['#818cf8', '#22d3ee', '#4ade80', '#fbbf24', '#f87171', '#a78bfa'].map(color => (<button key={color} onClick={() => setPlaceForm(p => ({ ...p, color }))} style={{ width: 36, height: 36, borderRadius: 8, border: placeForm.color === color ? `3px solid ${t.text}` : `1px solid ${t.border}`, background: color, cursor: 'pointer' }} />))}</div></div>
                <div style={{ padding: 14, borderRadius: 10, background: `${placeForm.color}10`, border: `1px solid ${placeForm.color}30`, display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontSize: 22 }}>{placeForm.icon}</span><span style={{ fontSize: 15, fontWeight: 600, color: placeForm.color }}>{placeForm.name || 'اسم المكان'}</span></div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}><button onClick={() => setShowPlaceModal(false)} style={{ flex: 1, padding: '14px', borderRadius: 12, border: `1px solid ${t.border}`, background: 'transparent', color: t.text, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>إلغاء</button><button onClick={savePlace} style={{ flex: 1, padding: '14px', borderRadius: 12, border: 'none', background: placeForm.color, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ إضافة المكان</button></div>
            </div>
          </div>
        )}

        {/* نافذة تحرير البند المضاف */}
        {showAddedItemModal && editingAddedItem && (
          <div style={modalOverlay}>
            <div style={modalBox}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>✏️ تحرير البند المضاف</h2>
                <button onClick={() => { setShowAddedItemModal(false); setEditingAddedItem(null); }} style={{ background: 'none', border: 'none', fontSize: 24, color: t.muted, cursor: 'pointer' }}>×</button>
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{editingAddedItem.item.cat} - {editingAddedItem.item.name}</div>
                <div style={{ fontSize: 13, color: t.muted }}>سعر التنفيذ: {editingAddedItem.item.exec} ر.س/م² | سعر المقاول: {editingAddedItem.item.cont} ر.س/م²</div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, color: t.muted, marginBottom: 8, display: 'block' }}>الأماكن والمساحات</label>
                {editingAddedItem.item.places.map((place, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, padding: 12, borderRadius: 10, background: t.cardAlt, border: `1px solid ${t.border}` }}>
                    <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>{place.name}</span>
                    {place.formula && <span style={{ fontSize: 10, color: t.muted, background: t.card, padding: '4px 8px', borderRadius: 4 }}>{place.formula}</span>}
                    <input type="number" value={place.area} onChange={(e) => updateAddedItemPlace(idx, e.target.value)} style={{ width: 80, padding: '8px 10px', borderRadius: 8, border: `1px solid ${t.accent}40`, background: `${t.accent}10`, color: t.accent, fontSize: 14, fontWeight: 600, textAlign: 'center', outline: 'none' }} />
                    <span style={{ fontSize: 12, color: t.muted }}>م²</span>
                    <button onClick={() => {
                      const updated = { ...editingAddedItem };
                      updated.item.places = updated.item.places.filter((_, i) => i !== idx);
                      if (updated.item.places.length === 0) {
                        removeItem(editingAddedItem.key);
                        setShowAddedItemModal(false);
                        setEditingAddedItem(null);
                      } else {
                        setEditingAddedItem(updated);
                      }
                    }} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: `${t.danger}15`, color: t.danger, cursor: 'pointer', fontSize: 12 }}>×</button>
                  </div>
                ))}
              </div>

              <div style={{ padding: 14, borderRadius: 10, background: t.cardAlt, marginBottom: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {(() => {
                    const totalArea = editingAddedItem.item.places.reduce((s, p) => s + p.area, 0);
                    const exec = totalArea * editingAddedItem.item.exec;
                    const cont = totalArea * editingAddedItem.item.cont;
                    return (
                      <>
                        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12, color: t.muted, marginBottom: 4 }}>المساحة</div><div style={{ fontSize: 18, fontWeight: 600, color: t.text }}>{totalArea} م²</div></div>
                        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12, color: t.muted, marginBottom: 4 }}>التنفيذ</div><div style={{ fontSize: 18, fontWeight: 600, color: t.warning }}>{fmt(exec)}</div></div>
                        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12, color: t.muted, marginBottom: 4 }}>الربح</div><div style={{ fontSize: 18, fontWeight: 600, color: t.success }}>{fmt(exec - cont)}</div></div>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => { removeItem(editingAddedItem.key); setShowAddedItemModal(false); setEditingAddedItem(null); }} style={{ padding: '14px 20px', borderRadius: 12, border: 'none', background: `${t.danger}15`, color: t.danger, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>🗑️ حذف الكل</button>
                <div style={{ flex: 1 }}></div>
                <button onClick={() => { setShowAddedItemModal(false); setEditingAddedItem(null); }} style={{ padding: '14px 20px', borderRadius: 12, border: `1px solid ${t.border}`, background: 'transparent', color: t.text, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>إلغاء</button>
                <button onClick={saveAddedItemEdit} style={{ padding: '14px 20px', borderRadius: 12, border: 'none', background: t.accent, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>💾 حفظ</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default QuantityCalculator;
