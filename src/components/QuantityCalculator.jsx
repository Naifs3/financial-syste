import React, { useState } from 'react';
import { Calculator, ChevronDown, ChevronUp, Plus, Trash2, Layers, FileText, X, MapPin } from 'lucide-react';

export default function QuantityCalculator() {
  const [mainTab, setMainTab] = useState('calculator');
  const [showReport, setShowReport] = useState(false);
  const [placeMode, setPlaceMode] = useState('single');
  const [multiPlaces, setMultiPlaces] = useState([]);
  
  const c = { bg: '#0a0a0f', card: '#101018', cardAlt: '#1a1a28', border: '#252538', text: '#f0f0f8', muted: '#707088', accent: '#00d4ff', accentGradient: 'linear-gradient(135deg, #0099bb, #00d4ff)', accentGlow: '0 0 20px #00d4ff40', success: '#4ade80', warning: '#fbbf24', danger: '#f87171', info: '#22d3ee' };

  const [workItems, setWorkItems] = useState({
    tiles: { name: 'البلاط', icon: '🔲', items: [{ id: 't1', name: 'إزالة بلاط', desc: 'إزالة البلاط القديم', exec: 15, cont: 10, type: 'floor' }, { id: 't2', name: 'صبة أرضية', desc: 'صب الخرسانة مع المواد', exec: 47, cont: 35, type: 'floor' }, { id: 't3', name: 'تبليط', desc: 'تركيب البلاط الجديد', exec: 30, cont: 20, type: 'floor' }] },
    paint: { name: 'الدهانات', icon: '🎨', items: [{ id: 'p1', name: 'دهان داخلي', desc: 'دهان جوتن فاخر', exec: 21, cont: 14, type: 'wall' }, { id: 'p2', name: 'معجون', desc: 'تجهيز وتسوية الجدران', exec: 15, cont: 10, type: 'wall' }] },
    gypsum: { name: 'الجبس', icon: '🏛️', items: [{ id: 'g1', name: 'جبسمبورد', desc: 'تركيب ألواح الجبس', exec: 60, cont: 40, type: 'ceiling' }] },
    electrical: { name: 'الكهرباء', icon: '⚡', items: [{ id: 'e1', name: 'تأسيس كهرباء', desc: 'تمديدات شاملة', exec: 45, cont: 30, type: 'floor' }] },
    plumbing: { name: 'السباكة', icon: '🔧', items: [{ id: 'pb1', name: 'تأسيس سباكة', desc: 'تمديدات شاملة', exec: 80, cont: 55, type: 'floor' }] },
  });

  // دوال تحرير البنود
  const deleteWorkItem = (catKey, itemId) => {
    setWorkItems(prev => ({
      ...prev,
      [catKey]: {
        ...prev[catKey],
        items: prev[catKey].items.filter(item => item.id !== itemId)
      }
    }));
  };

  const addNewWorkItem = (catKey) => {
    const newId = catKey.charAt(0) + Date.now();
    const newItem = { id: newId, name: 'بند جديد', desc: 'وصف البند', exec: 0, cont: 0, type: 'floor' };
    setWorkItems(prev => ({
      ...prev,
      [catKey]: {
        ...prev[catKey],
        items: [...prev[catKey].items, newItem]
      }
    }));
    // فتح نافذة التحرير للبند الجديد
    setEditingItem({ catKey, item: newItem });
  };

  const [places] = useState({ dry: { name: 'جاف', icon: '🏠', color: '#00d4ff', enabled: true, places: ['صالة', 'مجلس', 'غرفة نوم', 'ممر'] }, wet: { name: 'رطب', icon: '🚿', color: '#22d3ee', enabled: true, places: ['مطبخ', 'دورة مياه', 'غسيل'] }, outdoor: { name: 'خارجي', icon: '🌳', color: '#4ade80', enabled: true, places: ['حوش', 'سطح', 'موقف'] } });
  const [programming] = useState({ dry: { tiles: ['t1','t2','t3'], paint: ['p1','p2'], gypsum: ['g1'], electrical: ['e1'] }, wet: { tiles: ['t1','t2','t3'], paint: ['p1','p2'], gypsum: ['g1'], electrical: ['e1'], plumbing: ['pb1'] }, outdoor: { tiles: ['t1','t2','t3'], paint: ['p1'], electrical: ['e1'], plumbing: ['pb1'] } });

  const [selectedPlaceType, setSelectedPlaceType] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [addedItems, setAddedItems] = useState({});
  const [length, setLength] = useState(4);
  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState(4);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingItem, setEditingItem] = useState(null); // للبند المفتوح للتحرير
  const [reportData, setReportData] = useState({ companyName: 'ركائز الأولى', headerTitle: 'تقدير تكلفة', projectTitle: 'مشروع ترميم', vatRate: 15, footerEmail: 'info@company.com' });

  const formatNum = (n) => Number(n).toLocaleString('en-US');
  const calcFloorArea = () => length * width;
  const calcWallArea = () => 2 * (length + width) * height;
  const getArea = () => calcFloorArea();
  const getWallArea = () => calcWallArea();
  const handleInputFocus = (e) => e.target.select();
  const adjust = (setter, value, delta) => setter(Math.max(0, +(value + delta).toFixed(1)));
  const toggleItem = (id) => setSelectedItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleCategory = (catKey) => setSelectedCategory(selectedCategory === catKey ? '' : catKey);
  
  const addMultiPlace = () => { 
    if (!selectedPlace || getArea() <= 0) return; 
    setMultiPlaces([...multiPlaces, { place: selectedPlace, area: getArea(), wallArea: getWallArea(), length, width, height }]); 
    setLength(4); setWidth(4); 
  };
  
  const removeMultiPlace = (idx) => setMultiPlaces(multiPlaces.filter((_, i) => i !== idx));
  
  const addItems = () => { 
    if (placeMode === 'single') { 
      const fa = getArea(), wa = getWallArea(); 
      if (!selectedPlace || fa <= 0 || selectedItems.length === 0) return; 
      const nai = { ...addedItems }; 
      selectedItems.forEach(id => { 
        let item = null, catKey = null, catName = null;
        Object.entries(workItems).forEach(([ck, cat]) => {
          const found = cat.items.find(i => i.id === id);
          if (found) { item = found; catKey = ck; catName = cat.name; }
        });
        if (!item) return; 
        const isWall = item.type === 'wall' || item.type === 'ceiling'; 
        const finalArea = isWall ? wa : fa;
        const key = item.id + '-' + selectedPlace + '-' + Date.now() + '-' + Math.random();
        nai[key] = { ...item, place: selectedPlace, placeType: selectedPlaceType, area: finalArea, catKey, category: catName, length, width, height,
          formula: isWall ? `2 × (${formatNum(length)} + ${formatNum(width)}) × ${formatNum(height)} = ${formatNum(wa)} م²` : `${formatNum(length)} × ${formatNum(width)} = ${formatNum(fa)} م²`
        }; 
      }); 
      setAddedItems(nai); setSelectedItems([]); setSelectedCategory(''); setLength(4); setWidth(4);
    } else { 
      if (multiPlaces.length === 0 || selectedItems.length === 0) return; 
      const nai = { ...addedItems }; 
      selectedItems.forEach(id => { 
        let item = null, catKey = null, catName = null;
        Object.entries(workItems).forEach(([ck, cat]) => {
          const found = cat.items.find(i => i.id === id);
          if (found) { item = found; catKey = ck; catName = cat.name; }
        });
        if (!item) return; 
        const isWall = item.type === 'wall' || item.type === 'ceiling';
        let totalArea = 0; const placeNames = []; const formulas = [];
        multiPlaces.forEach(mp => {
          const mpArea = isWall ? mp.wallArea : mp.area;
          totalArea += mpArea; placeNames.push(mp.place);
          formulas.push(isWall ? `${mp.place}: 2×(${formatNum(mp.length)}+${formatNum(mp.width)})×${formatNum(mp.height)}=${formatNum(mp.wallArea)}` : `${mp.place}: ${formatNum(mp.length)}×${formatNum(mp.width)}=${formatNum(mp.area)}`);
        });
        const key = item.id + '-multi-' + Date.now();
        nai[key] = { ...item, place: placeNames.join(' + '), placeType: selectedPlaceType, area: totalArea, catKey, category: catName, isMulti: true, placesCount: multiPlaces.length, formula: formulas.join(' | '), totalFormula: `المجموع: ${formatNum(totalArea)} م²` }; 
      }); 
      setAddedItems(nai); setSelectedItems([]); setSelectedCategory(''); setMultiPlaces([]); 
    } 
  };
  
  const removeAddedItem = (key) => { const n = { ...addedItems }; delete n[key]; setAddedItems(n); };
  const updateAddedItemArea = (key, val) => setAddedItems(p => ({ ...p, [key]: { ...p[key], area: parseFloat(val) || 0 } }));
  
  const calcTotals = () => { 
    let totalExec = 0, totalCont = 0, totalArea = 0, itemCount = 0; 
    const placesList = new Set();
    Object.values(addedItems).forEach(i => { 
      totalExec += i.area * i.exec; totalCont += i.area * i.cont; totalArea += i.area; itemCount++;
      if (i.isMulti) { i.place.split(' + ').forEach(p => placesList.add(p)); } else { placesList.add(i.place); }
    }); 
    const profit = totalExec - totalCont; 
    const profitPercent = totalCont > 0 ? ((profit / totalCont) * 100) : 0; 
    const vatAmount = totalExec * (reportData.vatRate / 100); 
    const grandTotal = totalExec + vatAmount; 
    const avgPricePerMeter = totalArea > 0 ? totalExec / totalArea : 0;
    return { totalExec, totalCont, profit, profitPercent, vatAmount, grandTotal, totalArea, itemCount, avgPricePerMeter, placesCount: placesList.size }; 
  };
  
  const { totalExec, totalCont, profit, profitPercent, vatAmount, grandTotal, totalArea, itemCount, avgPricePerMeter, placesCount } = calcTotals();
  const canAdd = placeMode === 'single' ? (selectedPlace && getArea() > 0 && selectedItems.length > 0) : (multiPlaces.length > 0 && selectedItems.length > 0);
  
  const getItemsByCategory = () => { 
    const result = {}; 
    Object.entries(addedItems).forEach(([key, item]) => { 
      if (!result[item.catKey]) result[item.catKey] = { name: item.category, items: [], total: 0 }; 
      const itemTotal = item.area * item.exec; 
      result[item.catKey].items.push({ ...item, key, total: itemTotal }); 
      result[item.catKey].total += itemTotal; 
    }); 
    return result; 
  };

  const noSpinner = { MozAppearance: 'textfield', WebkitAppearance: 'none', appearance: 'none' };
  const cardStyle = { background: c.card, borderRadius: 16, border: '1px solid ' + c.border, padding: 20, marginBottom: 16 };
  const btnStyle = (active) => ({ padding: '12px 20px', borderRadius: 12, border: 'none', background: active ? c.accentGradient : c.cardAlt, color: active ? '#fff' : c.muted, fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: active ? c.accentGlow : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 });
  const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid ' + c.border, background: c.card, color: c.text, fontSize: 14, outline: 'none', boxSizing: 'border-box', ...noSpinner };

  const DimensionInput = ({ label, value, onChange }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: c.card, borderRadius: 12 }}>
      <div style={{ fontSize: 15, color: c.text, fontWeight: 600 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => adjust(onChange, value, -0.5)} style={{ width: 50, height: 50, borderRadius: 12, border: '1px solid ' + c.border, background: c.cardAlt, color: c.text, fontSize: 24, cursor: 'pointer' }}>−</button>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <input type="number" value={value} onFocus={handleInputFocus} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} style={{ width: 50, background: 'transparent', border: 'none', color: c.text, fontSize: 36, fontWeight: 700, textAlign: 'center', outline: 'none', ...noSpinner }} /><span style={{ fontSize: 14, color: c.muted }}>م</span>
        </div>
        <button onClick={() => adjust(onChange, value, 0.5)} style={{ width: 50, height: 50, borderRadius: 12, border: '1px solid ' + c.border, background: c.cardAlt, color: c.text, fontSize: 24, cursor: 'pointer' }}>+</button>
      </div>
    </div>
  );

  const EditableText = ({ value, onChange, style = {} }) => { 
    const [focused, setFocused] = useState(false); 
    return <input type="text" value={value} onChange={(e) => onChange(e.target.value)} onFocus={(e) => { setFocused(true); e.target.select(); }} onBlur={() => setFocused(false)} style={{ ...style, border: 'none', borderBottom: focused ? '2px solid #0099bb' : '1px solid transparent', background: focused ? '#fffef0' : 'transparent', outline: 'none', fontFamily: 'inherit', padding: '2px 4px', borderRadius: 2, minWidth: 50 }} />; 
  };

  return (
    <div dir="rtl" style={{ color: c.text, padding: 16 }}>
      <style>{`
        input, textarea, select { font-family: inherit; } 
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; } 
        input[type=number] { -moz-appearance: textfield; appearance: none; }
        .work-items-scroll::-webkit-scrollbar { width: 8px; }
        .work-items-scroll::-webkit-scrollbar-track { background: #1a1a28; border-radius: 10px; }
        .work-items-scroll::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #00d4ff, #0088aa); border-radius: 10px; }
        .work-items-scroll::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #00e5ff, #00d4ff); }
        .work-items-scroll { scrollbar-width: thin; scrollbar-color: #00d4ff #1a1a28; }
        .report-section::-webkit-scrollbar-track { background: #f0f0f0; }
        .report-section::-webkit-scrollbar-thumb { background: #fff; border: 2px solid #e0e0e0; }
        .report-section { scrollbar-color: #fff #f0f0f0; }
        button:active { transform: scale(0.95); }
      `}</style>
      
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: c.accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: c.accentGlow }}>
            <Calculator size={26} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>حاسبة الكميات</h1>
            <p style={{ fontSize: 14, color: c.muted, margin: 0 }}>احسب تكاليف المشاريع</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setMainTab('calculator')} style={{ ...btnStyle(mainTab === 'calculator'), flex: 1 }}>
              <Calculator size={18} /> الحاسبة
            </button>
            <button onClick={() => setMainTab('items')} style={{ ...btnStyle(mainTab === 'items'), flex: 1 }}>
              <Layers size={18} /> البنود والبرمجة
            </button>
          </div>
        </div>

        {mainTab === 'calculator' && (
          <div>
            <div style={cardStyle}>
              {/* نوع المكان */}
              <div style={{ fontSize: 14, marginBottom: 12, fontWeight: 600 }}>📍 نوع المكان</div>
              <div style={{ background: c.cardAlt, borderRadius: 14, border: '1px solid ' + c.border, padding: 12, marginBottom: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {Object.entries(places).filter(([_, p]) => p.enabled).map(([key, place]) => (
                    <div key={key} onClick={() => { setSelectedPlaceType(key); setSelectedPlace(''); setSelectedItems([]); setSelectedCategory(''); }} 
                      style={{ padding: '14px 10px', borderRadius: 12, border: selectedPlaceType === key ? '2px solid ' + c.accent : '1px solid ' + c.border, background: selectedPlaceType === key ? c.accent + '15' : c.card, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                      <div style={{ fontSize: 28, marginBottom: 6 }}>{place.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: selectedPlaceType === key ? c.accent : c.text }}>{place.name}</div>
                      <div style={{ fontSize: 11, color: c.muted, marginTop: 4 }}>{place.places.length} مكان</div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedPlaceType && (
                <>
                  {/* وضع الإضافة */}
                  <div style={{ fontSize: 14, marginBottom: 12, fontWeight: 600 }}>🏷️ وضع الإضافة</div>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                    <button onClick={() => { setPlaceMode('single'); setMultiPlaces([]); }} style={{ ...btnStyle(placeMode === 'single'), flex: 1 }}>مكان منفرد</button>
                    <button onClick={() => { setPlaceMode('multi'); setSelectedPlace(''); }} style={{ ...btnStyle(placeMode === 'multi'), flex: 1 }}>أماكن متعددة</button>
                  </div>

                  {placeMode === 'single' ? (
                    <>
                      {/* المكان */}
                      <div style={{ fontSize: 14, marginBottom: 12, fontWeight: 600 }}>🏠 المكان</div>
                      <div style={{ background: c.cardAlt, borderRadius: 14, padding: 16, marginBottom: 20, border: '1px solid ' + c.border }}>
                        <select value={selectedPlace} onChange={(e) => setSelectedPlace(e.target.value)} style={{ ...inputStyle, marginBottom: selectedPlace ? 16 : 0 }}>
                          <option value="">اختر المكان</option>
                          {places[selectedPlaceType]?.places.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        
                        {selectedPlace && (
                          <>
                            {/* الأبعاد */}
                            <div style={{ fontSize: 13, marginBottom: 12, fontWeight: 600, color: c.muted }}>📐 الأبعاد</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                              <DimensionInput label="الطول" value={length} onChange={setLength} />
                              <DimensionInput label="العرض" value={width} onChange={setWidth} />
                              <DimensionInput label="الارتفاع" value={height} onChange={setHeight} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: 12, background: c.card, borderRadius: 10 }}>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 11, color: c.muted, marginBottom: 4 }}>مساحة الأرضية</div>
                                <div style={{ fontSize: 11, color: c.muted, marginBottom: 4 }}>{formatNum(length)} × {formatNum(width)}</div>
                                <div style={{ fontSize: 22, fontWeight: 700, color: c.success }}>{formatNum(calcFloorArea())} م²</div>
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 11, color: c.muted, marginBottom: 4 }}>مساحة الجدران</div>
                                <div style={{ fontSize: 11, color: c.muted, marginBottom: 4 }}>2×({formatNum(length)}+{formatNum(width)})×{formatNum(height)}</div>
                                <div style={{ fontSize: 22, fontWeight: 700, color: c.info }}>{formatNum(calcWallArea())} م²</div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* أماكن متعددة */}
                      <div style={{ fontSize: 14, marginBottom: 12, fontWeight: 600 }}>🏠 المكان</div>
                      <div style={{ background: c.cardAlt, borderRadius: 14, padding: 16, marginBottom: 20, border: '1px solid ' + c.border }}>
                        <select value={selectedPlace} onChange={(e) => setSelectedPlace(e.target.value)} style={{ ...inputStyle, marginBottom: selectedPlace ? 16 : 0 }}>
                          <option value="">اختر المكان</option>
                          {places[selectedPlaceType]?.places.map(p => (<option key={p} value={p}>{p}</option>))}
                        </select>
                        
                        {selectedPlace && (
                          <>
                            {/* الأبعاد */}
                            <div style={{ fontSize: 13, marginBottom: 12, fontWeight: 600, color: c.muted }}>📐 الأبعاد</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                              <DimensionInput label="الطول" value={length} onChange={setLength} />
                              <DimensionInput label="العرض" value={width} onChange={setWidth} />
                              <DimensionInput label="الارتفاع" value={height} onChange={setHeight} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: 12, background: c.card, borderRadius: 10, marginBottom: 16 }}>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 11, color: c.muted, marginBottom: 4 }}>مساحة الأرضية</div>
                                <div style={{ fontSize: 11, color: c.muted, marginBottom: 4 }}>{formatNum(length)} × {formatNum(width)}</div>
                                <div style={{ fontSize: 22, fontWeight: 700, color: c.success }}>{formatNum(calcFloorArea())} م²</div>
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 11, color: c.muted, marginBottom: 4 }}>مساحة الجدران</div>
                                <div style={{ fontSize: 11, color: c.muted, marginBottom: 4 }}>2×({formatNum(length)}+{formatNum(width)})×{formatNum(height)}</div>
                                <div style={{ fontSize: 22, fontWeight: 700, color: c.info }}>{formatNum(calcWallArea())} م²</div>
                              </div>
                            </div>
                            <button onClick={addMultiPlace} disabled={!selectedPlace || getArea() <= 0} style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', background: selectedPlace && getArea() > 0 ? c.success : c.cardAlt, color: selectedPlace && getArea() > 0 ? '#fff' : c.muted, fontWeight: 600, fontSize: 15, cursor: selectedPlace && getArea() > 0 ? 'pointer' : 'not-allowed' }}>➕ إضافة للقائمة</button>
                          </>
                        )}
                      </div>
                      
                      {multiPlaces.length > 0 && (
                        <div style={{ marginBottom: 20 }}>
                          <div style={{ fontSize: 14, marginBottom: 12, fontWeight: 600 }}>📍 الأماكن المختارة ({multiPlaces.length})</div>
                          {multiPlaces.map((mp, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: c.cardAlt, borderRadius: 10, marginBottom: 8 }}>
                              <MapPin size={18} color={c.accent} />
                              <div style={{ flex: 1 }}>
                                <span style={{ fontWeight: 600 }}>{mp.place}</span>
                                <div style={{ fontSize: 11, color: c.muted }}>{formatNum(mp.length)}×{formatNum(mp.width)} = {formatNum(mp.area)} م²</div>
                              </div>
                              <button onClick={() => removeMultiPlace(idx)} style={{ background: '#fee2e2', border: 'none', color: '#dc2626', padding: '6px', borderRadius: 6, cursor: 'pointer' }}><X size={14} /></button>
                            </div>
                          ))}
                          <div style={{ padding: 10, background: c.accent + '15', borderRadius: 8, textAlign: 'center', marginTop: 8 }}>
                            <span style={{ color: c.accent, fontWeight: 600 }}>المجموع: {formatNum(multiPlaces.reduce((sum, mp) => sum + mp.area, 0))} م²</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* بنود العمل */}
                  {((placeMode === 'single' && selectedPlace && getArea() > 0) || (placeMode === 'multi' && multiPlaces.length > 0)) && (
                    <>
                      <div style={{ fontSize: 14, marginBottom: 12, fontWeight: 600 }}>🔧 بنود العمل</div>
                      <div style={{ background: c.cardAlt, borderRadius: 14, border: '1px solid ' + c.border, padding: 12, marginBottom: 16 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                          {Object.entries(workItems).filter(([ck]) => programming[selectedPlaceType]?.[ck]?.length > 0).map(([key, cat]) => (
                            <div key={key} onClick={() => toggleCategory(key)}
                              style={{ padding: '14px 10px', borderRadius: 12, border: selectedCategory === key ? '2px solid ' + c.accent : '1px solid ' + c.border, background: selectedCategory === key ? c.accent + '15' : c.card, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                              <div style={{ fontSize: 28, marginBottom: 6 }}>{cat.icon}</div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: selectedCategory === key ? c.accent : c.text }}>{cat.name}</div>
                              <div style={{ fontSize: 11, color: c.muted, marginTop: 4 }}>{cat.items.filter(i => programming[selectedPlaceType]?.[key]?.includes(i.id)).length} بند</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* تفاصيل البند */}
                      {selectedCategory && workItems[selectedCategory] && (
                        <>
                          <div style={{ fontSize: 14, marginBottom: 12, fontWeight: 600 }}>📋 تفاصيل {workItems[selectedCategory].name}</div>
                          <div style={{ background: c.cardAlt, borderRadius: 14, border: '1px solid ' + c.border, padding: 12, marginBottom: 16 }}>
                            <div className="work-items-scroll" style={{ display: 'grid', gap: 8, maxHeight: 220, overflowY: 'auto', paddingLeft: 8 }}>
                              {workItems[selectedCategory].items.filter(i => programming[selectedPlaceType]?.[selectedCategory]?.includes(i.id)).map(item => (
                                <div key={item.id} onClick={() => toggleItem(item.id)} 
                                  style={{ padding: '14px 16px', borderRadius: 12, border: selectedItems.includes(item.id) ? '2px solid ' + c.accent : '1px solid ' + c.border, background: selectedItems.includes(item.id) ? c.accent + '15' : c.card, cursor: 'pointer' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      <span style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</span>
                                      <span style={{ fontSize: 11, color: item.type === 'wall' ? c.info : item.type === 'ceiling' ? c.warning : c.success, background: (item.type === 'wall' ? c.info : item.type === 'ceiling' ? c.warning : c.success) + '20', padding: '3px 8px', borderRadius: 6, fontWeight: 600 }}>
                                        {item.type === 'wall' ? 'جدران' : item.type === 'ceiling' ? 'أسقف' : 'أرضية'}
                                      </span>
                                    </div>
                                    <span style={{ fontSize: 13, color: c.muted, background: c.cardAlt, padding: '4px 10px', borderRadius: 8, fontWeight: 600 }}>{formatNum(item.exec)} ر.س</span>
                                  </div>
                                  <div style={{ fontSize: 11, color: c.muted }}>{item.desc}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      <button onClick={addItems} disabled={!canAdd} style={{ width: '100%', padding: 16, borderRadius: 14, border: 'none', background: canAdd ? c.accentGradient : c.cardAlt, color: canAdd ? '#fff' : c.muted, fontSize: 15, fontWeight: 700, cursor: canAdd ? 'pointer' : 'not-allowed', boxShadow: canAdd ? c.accentGlow : 'none' }}>
                        {selectedItems.length > 0 ? `➕ إضافة ${selectedItems.length} بند` : 'اختر بنود'}
                      </button>
                    </>
                  )}
                </>
              )}
            </div>

            {/* البنود المضافة */}
            {Object.keys(addedItems).length > 0 && (
              <div style={cardStyle}>
                <div style={{ fontSize: 14, marginBottom: 16, fontWeight: 600 }}>📋 البنود المضافة ({itemCount})</div>
                {Object.entries(getItemsByCategory()).map(([catKey, cat]) => (
                  <div key={catKey} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <span style={{ fontWeight: 600 }}>{cat.name}</span>
                      <span style={{ marginRight: 'auto', fontWeight: 700, color: c.accent }}>{formatNum(cat.total)} ر.س</span>
                    </div>
                    {cat.items.map(item => (
                      <div key={item.key} style={{ background: c.cardAlt, borderRadius: 12, padding: 14, marginBottom: 10, border: '1px solid ' + c.border }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{item.name}</div>
                            <div style={{ fontSize: 12, color: c.muted }}>{item.desc}</div>
                          </div>
                          <button onClick={() => removeAddedItem(item.key)} style={{ background: '#fee2e2', border: 'none', color: '#dc2626', padding: '6px', borderRadius: 6, cursor: 'pointer' }}><Trash2 size={14} /></button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                          <MapPin size={14} color={c.accent} />
                          <span style={{ fontSize: 13, color: c.accent, fontWeight: 600 }}>{item.place}</span>
                          {item.isMulti && <span style={{ fontSize: 11, background: c.success + '20', color: c.success, padding: '2px 8px', borderRadius: 6 }}>{item.placesCount} أماكن</span>}
                        </div>
                        <div style={{ background: c.card, borderRadius: 8, padding: 10, marginBottom: 10 }}>
                          <div style={{ fontSize: 11, color: c.muted, marginBottom: 4 }}>📐 المعادلة:</div>
                          <div style={{ fontSize: 12, color: c.info, fontFamily: 'monospace' }}>{item.formula}</div>
                          {item.isMulti && <div style={{ fontSize: 12, color: c.success, fontWeight: 600, marginTop: 6 }}>{item.totalFormula}</div>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <input type="number" value={item.area} onFocus={handleInputFocus} onChange={(e) => updateAddedItemArea(item.key, e.target.value)} style={{ width: 70, padding: '6px 8px', borderRadius: 6, border: '1px solid ' + c.border, background: c.card, color: c.text, fontSize: 14, textAlign: 'center', ...noSpinner }} />
                            <span style={{ fontSize: 12, color: c.muted }}>م²</span>
                          </div>
                          <span style={{ fontSize: 14, color: c.muted }}>×</span>
                          <span style={{ fontSize: 14, color: c.warning }}>{formatNum(item.exec)} ر.س</span>
                          <span style={{ fontSize: 14, color: c.muted }}>=</span>
                          <span style={{ fontSize: 16, fontWeight: 700, color: c.accent }}>{formatNum(item.total)} ر.س</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* الملخص */}
            {Object.keys(addedItems).length > 0 && (
              <div style={cardStyle}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>💰 الملخص التفصيلي</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 12 }}>
                  <div style={{ padding: 12, borderRadius: 12, background: c.cardAlt, textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: c.accent }}>{formatNum(itemCount)}</div>
                    <div style={{ fontSize: 10, color: c.muted }}>عدد البنود</div>
                  </div>
                  <div style={{ padding: 12, borderRadius: 12, background: c.cardAlt, textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: c.info }}>{formatNum(placesCount)}</div>
                    <div style={{ fontSize: 10, color: c.muted }}>عدد الأماكن</div>
                  </div>
                  <div style={{ padding: 12, borderRadius: 12, background: c.cardAlt, textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: c.warning }}>{formatNum(totalArea)}</div>
                    <div style={{ fontSize: 10, color: c.muted }}>م² إجمالي</div>
                  </div>
                  <div style={{ padding: 12, borderRadius: 12, background: c.success + '15', textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: c.success }}>{formatNum(profitPercent.toFixed(1))}%</div>
                    <div style={{ fontSize: 10, color: c.muted }}>نسبة الربح</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 12 }}>
                  <div style={{ padding: 14, borderRadius: 12, background: c.warning + '12', textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: c.warning }}>{formatNum(totalExec)}</div>
                    <div style={{ fontSize: 11, color: c.muted }}>سعر التنفيذ</div>
                  </div>
                  <div style={{ padding: 14, borderRadius: 12, background: c.info + '12', textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: c.info }}>{formatNum(totalCont)}</div>
                    <div style={{ fontSize: 11, color: c.muted }}>تكلفة المقاول</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 }}>
                  <div style={{ padding: 12, borderRadius: 12, background: c.success + '12', textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: c.success }}>{formatNum(profit)}</div>
                    <div style={{ fontSize: 10, color: c.muted }}>صافي الربح</div>
                  </div>
                  <div style={{ padding: 12, borderRadius: 12, background: c.danger + '12', textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: c.danger }}>{formatNum(vatAmount)}</div>
                    <div style={{ fontSize: 10, color: c.muted }}>الضريبة</div>
                  </div>
                  <div style={{ padding: 12, borderRadius: 12, background: '#8b5cf6' + '15', textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#8b5cf6' }}>{formatNum(avgPricePerMeter.toFixed(0))}</div>
                    <div style={{ fontSize: 10, color: c.muted }}>سعر المتر</div>
                  </div>
                </div>
                <div style={{ padding: 16, borderRadius: 12, background: 'linear-gradient(135deg, ' + c.accent + '20, ' + c.success + '20)', textAlign: 'center', border: '2px solid ' + c.accent }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: c.accent }}>{formatNum(grandTotal)} ر.س</div>
                  <div style={{ fontSize: 12, color: c.muted }}>الإجمالي شامل الضريبة</div>
                </div>
              </div>
            )}

            {/* زر التقرير */}
            {Object.keys(addedItems).length > 0 && !showReport && (
              <button onClick={() => setShowReport(true)} style={{ width: '100%', padding: 18, borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)' }}>
                <FileText size={22} /> عرض التقرير وطباعته
              </button>
            )}

            {/* التقرير */}
            {showReport && Object.keys(addedItems).length > 0 && (
              <>
                <div style={{ ...cardStyle, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button onClick={() => setShowReport(false)} style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: c.danger + '15', color: c.danger, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><X size={16} /> إغلاق</button>
                </div>
                
                <div className="report-section" style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e0e0e0', color: '#333' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e0e0e0' }}>
                    <EditableText value={reportData.companyName} onChange={(v) => setReportData({...reportData, companyName: v})} style={{ fontSize: 20, fontWeight: 700, color: '#2d5a3d' }} />
                    <div style={{ background: '#6b7b3d', color: '#fff', padding: '12px 30px', borderRadius: 25 }}>
                      <span style={{ fontSize: 18, fontWeight: 700 }}>{reportData.headerTitle}</span>
                    </div>
                  </div>
                  <div style={{ background: '#5a6a3a', padding: '14px 24px' }}>
                    <EditableText value={reportData.projectTitle} onChange={(v) => setReportData({...reportData, projectTitle: v})} style={{ fontSize: 18, fontWeight: 700, color: '#fff', background: 'transparent' }} />
                  </div>
                  <div>
                    {Object.entries(getItemsByCategory()).map(([catKey, cat]) => (
                      <React.Fragment key={catKey}>
                        {cat.items.map((item, idx) => (
                          <div key={item.key} style={{ display: 'flex', borderBottom: '1px solid #eee', background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                            <div style={{ flex: 1, padding: '14px' }}>
                              <div style={{ fontSize: 14, fontWeight: 700, color: '#333', marginBottom: 4 }}>{item.name}</div>
                              <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>{item.desc}</div>
                              <div style={{ fontSize: 10, color: '#888' }}>📍 {item.place} | {formatNum(item.area)} م²</div>
                            </div>
                            <div style={{ width: 110, padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                              <div style={{ fontSize: 15, fontWeight: 700, color: '#333' }}>{formatNum(item.total)} ريال</div>
                            </div>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                  <div style={{ padding: '20px 24px', borderTop: '3px solid #5a6a3a', background: '#f8f8f8' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 15 }}>
                      <span style={{ fontWeight: 600, color: '#333' }}>{formatNum(totalExec)} ريال</span>
                      <span style={{ color: '#666' }}>المبلغ</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 15 }}>
                      <span style={{ fontWeight: 600, color: '#333' }}>{formatNum(vatAmount)} ريال</span>
                      <span style={{ color: '#666' }}>الضريبة 15%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '2px solid #5a6a3a', fontSize: 20 }}>
                      <span style={{ fontWeight: 700, color: '#5a6a3a' }}>{formatNum(grandTotal)} ريال</span>
                      <span style={{ fontWeight: 700, color: '#333' }}>الإجمالي</span>
                    </div>
                  </div>
                  <div style={{ background: '#5a6a3a', padding: '12px 24px', textAlign: 'center' }}>
                    <span style={{ fontSize: 12, color: '#fff' }}>{reportData.footerEmail}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {mainTab === 'items' && (
          <div style={cardStyle}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>⚙️ إدارة البنود</div>
            <div style={{ display: 'grid', gap: 12 }}>
              {Object.entries(workItems).map(([catKey, cat]) => (
                <div key={catKey} style={{ background: c.cardAlt, borderRadius: 14, overflow: 'hidden', border: '1px solid ' + c.border }}>
                  <div onClick={() => toggleCategory(catKey)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', cursor: 'pointer' }}>
                    <span style={{ fontSize: 24 }}>{cat.icon}</span>
                    <span style={{ fontSize: 16, fontWeight: 600, flex: 1 }}>{cat.name}</span>
                    <span style={{ fontSize: 12, color: c.muted, background: c.card, padding: '4px 10px', borderRadius: 8 }}>{cat.items.length} بند</span>
                    {selectedCategory === catKey ? <ChevronUp size={20} color={c.muted} /> : <ChevronDown size={20} color={c.muted} />}
                  </div>
                  {selectedCategory === catKey && (
                    <div style={{ padding: '0 20px 20px' }}>
                      {/* قائمة البنود المختصرة */}
                      {cat.items.map(item => (
                        <div 
                          key={item.id} 
                          onClick={() => setEditingItem({ catKey, item: { ...item } })}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 12, 
                            padding: '12px 14px', 
                            background: c.card, 
                            borderRadius: 10, 
                            marginBottom: 8, 
                            border: '1px solid ' + c.border,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{item.name}</div>
                            <div style={{ fontSize: 11, color: c.muted }}>{item.desc}</div>
                          </div>
                          <span style={{ 
                            fontSize: 10, 
                            color: item.type === 'floor' ? c.success : item.type === 'wall' ? c.info : c.warning, 
                            background: (item.type === 'floor' ? c.success : item.type === 'wall' ? c.info : c.warning) + '15', 
                            padding: '3px 8px', 
                            borderRadius: 6 
                          }}>
                            {item.type === 'floor' ? 'أرضية' : item.type === 'wall' ? 'جدران' : 'أسقف'}
                          </span>
                          <div style={{ textAlign: 'left', minWidth: 60 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: c.warning }}>{formatNum(item.exec)}</div>
                            <div style={{ fontSize: 10, color: c.muted }}>ر.س</div>
                          </div>
                          <ChevronDown size={16} color={c.muted} style={{ transform: 'rotate(-90deg)' }} />
                        </div>
                      ))}
                      
                      {/* زر إضافة بند جديد */}
                      <button 
                        onClick={() => addNewWorkItem(catKey)}
                        style={{ 
                          width: '100%', 
                          padding: 12, 
                          borderRadius: 10, 
                          border: '2px dashed ' + c.border, 
                          background: 'transparent', 
                          color: c.muted, 
                          fontSize: 13, 
                          fontWeight: 600, 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8
                        }}
                      >
                        <Plus size={16} /> إضافة بند جديد
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* نافذة تحرير البند */}
        {editingItem && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16
          }}>
            <div style={{
              background: c.card,
              borderRadius: 16,
              padding: 24,
              width: '100%',
              maxWidth: 450,
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '1px solid ' + c.border
            }}>
              {/* رأس النافذة */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>✏️ تحرير البند</div>
                <button 
                  onClick={() => setEditingItem(null)}
                  style={{ padding: 8, borderRadius: 8, border: 'none', background: c.cardAlt, color: c.muted, cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* اسم البند */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: c.muted, marginBottom: 6 }}>اسم البند</div>
                <input 
                  type="text" 
                  value={editingItem.item.name} 
                  onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, name: e.target.value } })}
                  onFocus={handleInputFocus}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid ' + c.border, background: c.cardAlt, color: c.text, fontSize: 15, fontWeight: 600, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* وصف البند */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: c.muted, marginBottom: 6 }}>وصف البند</div>
                <input 
                  type="text" 
                  value={editingItem.item.desc} 
                  onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, desc: e.target.value } })}
                  onFocus={handleInputFocus}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid ' + c.border, background: c.cardAlt, color: c.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* نوع البند */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: c.muted, marginBottom: 8 }}>نوع البند</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {[
                    { value: 'floor', label: 'أرضية', color: c.success },
                    { value: 'wall', label: 'جدران', color: c.info },
                    { value: 'ceiling', label: 'أسقف', color: c.warning }
                  ].map(type => (
                    <button
                      key={type.value}
                      onClick={() => setEditingItem({ ...editingItem, item: { ...editingItem.item, type: type.value } })}
                      style={{
                        padding: '12px',
                        borderRadius: 10,
                        border: editingItem.item.type === type.value ? '2px solid ' + type.color : '1px solid ' + c.border,
                        background: editingItem.item.type === type.value ? type.color + '20' : c.cardAlt,
                        color: editingItem.item.type === type.value ? type.color : c.muted,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* الأسعار */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: c.muted, marginBottom: 6 }}>سعر التنفيذ</div>
                  <input 
                    type="number" 
                    value={editingItem.item.exec} 
                    onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, exec: parseFloat(e.target.value) || 0 } })}
                    onFocus={handleInputFocus}
                    style={{ width: '100%', padding: '12px', borderRadius: 10, border: '1px solid ' + c.warning + '50', background: c.warning + '10', color: c.warning, fontSize: 18, fontWeight: 700, textAlign: 'center', outline: 'none', boxSizing: 'border-box', ...noSpinner }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: c.muted, marginBottom: 6 }}>سعر المقاول</div>
                  <input 
                    type="number" 
                    value={editingItem.item.cont} 
                    onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, cont: parseFloat(e.target.value) || 0 } })}
                    onFocus={handleInputFocus}
                    style={{ width: '100%', padding: '12px', borderRadius: 10, border: '1px solid ' + c.info + '50', background: c.info + '10', color: c.info, fontSize: 18, fontWeight: 700, textAlign: 'center', outline: 'none', boxSizing: 'border-box', ...noSpinner }}
                  />
                </div>
              </div>

              {/* الربح */}
              <div style={{ padding: 14, borderRadius: 10, background: c.success + '15', textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: c.muted, marginBottom: 4 }}>صافي الربح</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: c.success }}>{formatNum(editingItem.item.exec - editingItem.item.cont)} ر.س</div>
              </div>

              {/* أزرار الإجراءات */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button 
                  onClick={() => {
                    deleteWorkItem(editingItem.catKey, editingItem.item.id);
                    setEditingItem(null);
                  }}
                  style={{ padding: '12px 16px', borderRadius: 10, border: 'none', background: c.danger + '20', color: c.danger, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Trash2 size={16} /> حذف
                </button>
                <button 
                  onClick={() => {
                    // حفظ التعديلات
                    setWorkItems(prev => ({
                      ...prev,
                      [editingItem.catKey]: {
                        ...prev[editingItem.catKey],
                        items: prev[editingItem.catKey].items.map(item => 
                          item.id === editingItem.item.id ? editingItem.item : item
                        )
                      }
                    }));
                    setEditingItem(null);
                  }}
                  style={{ flex: 1, padding: '12px 16px', borderRadius: 10, border: 'none', background: c.accentGradient, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: c.accentGlow }}
                >
                  ✓ حفظ التعديلات
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
