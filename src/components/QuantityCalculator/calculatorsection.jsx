import React, { useState } from 'react';
import { dimensionOptions } from './colorsandconstants';

const CalculatorSection = ({ colors, places, workItems, programming, itemTypes, categories, setCategories, formatNumber, getColor, placeTypeColors }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [phase1Expanded, setPhase1Expanded] = useState(true);
  const [selectedPlaceType, setSelectedPlaceType] = useState('dry');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [dimensions, setDimensions] = useState({ length: 4, width: 4, height: 3 });
  const [activeMainItems, setActiveMainItems] = useState({});

  const heightOptions = [2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6];
  const placesList = places[selectedPlaceType]?.places || [];

  const getItemArea = (item) => item.places?.reduce((sum, p) => sum + (p.area || 0), 0) || 0;
  const getCategoryItemsTotal = (cat) => cat.items?.reduce((sum, item) => sum + getItemArea(item) * item.price, 0) || 0;

  const calculateCategoryTotals = (cat) => {
    const totalPrice = getCategoryItemsTotal(cat);
    const profitAmount = totalPrice * (cat.options?.profitPercent || 0) / 100;
    const withProfit = totalPrice + profitAmount;
    const taxAmount = withProfit * (cat.options?.taxPercent || 0) / 100;
    const finalTotal = withProfit + taxAmount;
    return { totalPrice, profitAmount, taxAmount, finalTotal };
  };

  const getGrandTotal = () => (categories || []).reduce((sum, cat) => sum + calculateCategoryTotals(cat).finalTotal, 0);

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
            items: [], pendingPlaces: [{ ...newPlace, id: 'p' + Date.now() + catKey }], needsSubItemSelection: true,
            options: { profitPercent: 0, taxPercent: 15 }
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
      const newItem = { id: Date.now(), code: subItem.code, name: subItem.name, price: subItem.price, group: subItem.group, places: [{ ...place }], conditions: [] };
      const newPendingPlaces = cat.pendingPlaces.filter(p => p.id !== placeId);
      return { ...cat, items: [...cat.items, newItem], pendingPlaces: newPendingPlaces, needsSubItemSelection: newPendingPlaces.length > 0 };
    }));
  };

  const addItem = (catId) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      const sub = cat.subItems?.[0] || { code: 'XX01', name: 'بند جديد', price: 0 };
      return { ...cat, items: [...cat.items, { id: Date.now(), code: sub.code, name: sub.name, price: sub.price, places: [{ id: 'p' + Date.now(), name: placesList[0] || 'مكان', length: 4, width: 4, height: 3, area: 16 }], conditions: [] }] };
    }));
  };

  const deleteItem = (catId, itemId) => {
    setCategories(prev => prev.map(cat => cat.id !== catId ? cat : { ...cat, items: cat.items.filter(item => item.id !== itemId) }));
    setEditingItemId(null);
  };

  const changeSubItem = (catId, itemId, newCode) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      const sub = cat.subItems?.find(s => s.code === newCode);
      if (!sub) return cat;
      return { ...cat, items: cat.items.map(item => item.id === itemId ? { ...item, code: sub.code, name: sub.name, price: sub.price } : item) };
    }));
  };

  const updatePlace = (catId, itemId, placeId, field, value) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return { ...cat, items: cat.items.map(item => {
        if (item.id !== itemId) return item;
        return { ...item, places: item.places.map(place => {
          if (place.id !== placeId) return place;
          const updated = { ...place, [field]: field === 'name' ? value : parseFloat(value) || 0 };
          if (field === 'length' || field === 'width') updated.area = updated.length * updated.width;
          return updated;
        })};
      })};
    }));
  };

  const addPlace = (catId, itemId) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return { ...cat, items: cat.items.map(item => item.id !== itemId ? item : { ...item, places: [...item.places, { id: 'p' + Date.now(), name: placesList[0] || 'مكان', length: 4, width: 4, height: 3, area: 16 }] }) };
    }));
  };

  const deletePlace = (catId, itemId, placeId) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return { ...cat, items: cat.items.map(item => item.id !== itemId ? item : { ...item, places: item.places.filter(p => p.id !== placeId) }) };
    }));
  };

  const hasCategories = (categories || []).filter(cat => cat.items?.length > 0 || cat.pendingPlaces?.length > 0).length > 0;

  return (
    <>
      <div style={{ background: colors.card, borderRadius: 16, border: phase1Expanded ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`, overflow: 'hidden', marginBottom: 20 }}>
        <div onClick={() => setPhase1Expanded(!phase1Expanded)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 16, background: phase1Expanded ? `${colors.primary}10` : 'transparent' }}>
          <div style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.cyan})`, padding: '12px 16px', borderRadius: 10, marginLeft: 12 }}><span style={{ fontSize: 24 }}>📐</span></div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>إدخال البيانات</div><div style={{ fontSize: 11, color: colors.muted }}>🏗️ {Object.values(activeMainItems).filter(v => v).length} بنود</div></div>
          <span style={{ fontSize: 16, color: colors.primary, transform: phase1Expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
        </div>

        {phase1Expanded && (
          <div style={{ padding: 16, borderTop: `1px dashed ${colors.primary}40` }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <select value={selectedPlaceType} onChange={(e) => { setSelectedPlaceType(e.target.value); setSelectedPlace(''); }} style={{ flex: 1, height: 40, borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 14, padding: '0 12px' }}>
                {Object.entries(places).filter(([_, pt]) => pt.enabled).map(([key, pt]) => (<option key={key} value={key}>{pt.icon} {pt.name}</option>))}
              </select>
              <select value={selectedPlace} onChange={(e) => setSelectedPlace(e.target.value)} style={{ flex: 2, height: 40, borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 14, padding: '0 12px' }}>
                <option value="">-- اختر المكان --</option>
                {placesList.map(place => (<option key={place} value={place}>{place}</option>))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
              {Object.entries(workItems).map(([catKey, cat], idx) => {
                if (!programming[selectedPlaceType]?.[catKey]?.enabled) return null;
                const catColor = getColor(idx);
                return (<button key={catKey} onClick={() => setActiveMainItems(prev => ({ ...prev, [catKey]: !prev[catKey] }))} style={{ height: 32, padding: '0 10px', borderRadius: 6, border: `1px solid ${activeMainItems[catKey] ? catColor : colors.border}`, background: activeMainItems[catKey] ? `${catColor}20` : 'transparent', color: activeMainItems[catKey] ? catColor : colors.muted, fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><span>{cat.icon}</span><span>{cat.name}</span></button>);
              })}
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {[{ key: 'length', label: 'الطول' }, { key: 'width', label: 'العرض' }, { key: 'height', label: 'الارتفاع' }].map(dim => (
                <div key={dim.key} style={{ flex: 1 }}><div style={{ fontSize: 10, color: colors.muted, marginBottom: 4, textAlign: 'center' }}>{dim.label}</div>
                  <select value={dimensions[dim.key]} onChange={(e) => setDimensions({ ...dimensions, [dim.key]: parseFloat(e.target.value) })} style={{ width: '100%', height: 36, borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: '#fff', fontSize: 14, textAlign: 'center' }}>
                    {(dim.key === 'height' ? heightOptions : (dimensionOptions || [1,2,3,4,5,6,7,8,9,10]).slice(0, 20)).map(n => (<option key={n} value={n}>{n} م</option>))}
                  </select>
                </div>
              ))}
              <div style={{ flex: 1 }}><div style={{ fontSize: 10, color: colors.success, marginBottom: 4, textAlign: 'center' }}>المساحة</div><div style={{ height: 36, borderRadius: 8, border: `1px solid ${colors.success}`, background: `${colors.success}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700 }}>{dimensions.length * dimensions.width} م²</div></div>
            </div>

            <button onClick={addPlaceToActiveCategories} disabled={!selectedPlace || !Object.values(activeMainItems).some(v => v)} style={{ width: '100%', height: 56, borderRadius: 10, border: `1px solid ${colors.success}`, background: `${colors.success}15`, color: colors.success, fontSize: 14, fontWeight: 700, cursor: (selectedPlace && Object.values(activeMainItems).some(v => v)) ? 'pointer' : 'not-allowed', opacity: (selectedPlace && Object.values(activeMainItems).some(v => v)) ? 1 : 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><span style={{ fontSize: 20, fontWeight: 900 }}>+</span>إضافة مكان</button>
          </div>
        )}
      </div>

      {!hasCategories && (<div style={{ textAlign: 'center', padding: 40, color: colors.muted, fontSize: 14, background: colors.card, borderRadius: 16, border: `1px solid ${colors.border}`, marginBottom: 16 }}><div style={{ fontSize: 50, marginBottom: 16, opacity: 0.3 }}>📦</div><div style={{ fontWeight: 600, marginBottom: 8 }}>لا توجد فئات</div><div style={{ fontSize: 12 }}>اختر مكان ثم اضغط إضافة</div></div>)}

      {(categories || []).filter(cat => cat.items?.length > 0 || cat.pendingPlaces?.length > 0).map((cat) => {
        const isExpanded = expandedCategory === cat.id;
        const catTotals = calculateCategoryTotals(cat);
        const pendingPlaces = cat.pendingPlaces || [];

        return (
          <div key={cat.id} style={{ background: colors.card, borderRadius: 16, overflow: 'hidden', marginBottom: 12, border: isExpanded ? `2px solid ${cat.color}` : `1px solid ${colors.border}` }}>
            <div onClick={() => { setExpandedCategory(isExpanded ? null : cat.id); setEditingItemId(null); }} style={{ display: 'flex', alignItems: 'stretch', cursor: 'pointer', background: isExpanded ? `${cat.color}08` : 'transparent' }}>
              <div style={{ width: 4, background: cat.color }} />
              <div style={{ padding: '16px 20px' }}><div style={{ width: 50, height: 50, borderRadius: 12, background: `${cat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: cat.color }}>{cat.code}</div></div>
              <div style={{ flex: 1, padding: '16px 18px' }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: colors.text, marginBottom: 6 }}>{cat.name}</div>
                <div style={{ fontSize: 11, color: colors.muted }}>📦 {cat.items?.length || 0} بنود {pendingPlaces.length > 0 && <span style={{ color: colors.warning }}>• ⏳ {pendingPlaces.length} معلق</span>}</div>
              </div>
              <div style={{ background: `${colors.success}12`, padding: '16px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${colors.border}` }}><div style={{ fontSize: 9, color: colors.muted }}>الإجمالي</div><div style={{ fontSize: 20, fontWeight: 700, color: colors.success }}>{formatNumber(catTotals.finalTotal)}</div></div>
              <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', background: colors.bg }}><span style={{ fontSize: 16, color: isExpanded ? cat.color : colors.muted, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span></div>
            </div>

            {isExpanded && (
              <div style={{ padding: 16, background: `${cat.color}05`, borderTop: `1px dashed ${cat.color}40` }}>
                {pendingPlaces.length > 0 && (
                  <div style={{ marginBottom: 16, background: `${colors.warning}10`, borderRadius: 12, padding: 14, border: `1px solid ${colors.warning}30` }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: colors.warning, marginBottom: 10 }}>⚠️ أماكن معلقة ({pendingPlaces.length})</div>
                    {pendingPlaces.map(place => (
                      <div key={place.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, padding: 10, background: colors.card, borderRadius: 8 }}>
                        <span style={{ fontSize: 12, color: colors.text }}>{place.name} ({place.area}م²)</span>
                        <select defaultValue="" onChange={(e) => { if (e.target.value) selectPendingSubItem(cat.id, place.id, e.target.value); }} style={{ flex: 1, height: 34, borderRadius: 6, border: `1px solid ${cat.color}50`, background: colors.bg, color: colors.text, fontSize: 12, padding: '0 10px' }}>
                          <option value="">-- اختر البند --</option>
                          {(cat.subItems || []).map(s => (<option key={s.code} value={s.code}>{s.name} ({s.price}﷼)</option>))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}

                {(cat.items || []).map(item => {
                  const isEditing = editingItemId === item.id;
                  const itemArea = getItemArea(item);
                  return (
                    <div key={item.id} style={{ background: colors.card, borderRadius: 12, overflow: 'hidden', marginBottom: 8, border: isEditing ? `2px solid ${colors.primary}` : `1px solid ${colors.border}` }}>
                      <div onClick={() => setEditingItemId(isEditing ? null : item.id)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '12px 14px', background: isEditing ? `${colors.primary}10` : 'transparent' }}>
                        <div style={{ background: cat.color, padding: '8px 12px', borderRadius: 6, marginLeft: 12 }}><span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{item.code}</span></div>
                        <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{item.name}</div><div style={{ fontSize: 11, color: colors.muted }}>{itemArea} م² × {item.price}﷼</div></div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: colors.success }}>{formatNumber(itemArea * item.price)}﷼</div>
                      </div>

                      {isEditing && (
                        <div style={{ padding: 14, background: `${colors.primary}08`, borderTop: `1px dashed ${colors.primary}30` }}>
                          <select value={item.code} onChange={(e) => changeSubItem(cat.id, item.id, e.target.value)} style={{ width: '100%', height: 36, marginBottom: 12, borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 12, padding: '0 12px' }}>
                            {(cat.subItems || []).map(s => (<option key={s.code} value={s.code}>[{s.code}] {s.name}</option>))}
                          </select>

                          {(item.places || []).map((place, pIdx) => (
                            <div key={place.id} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8, padding: 8, background: pIdx % 2 === 0 ? `${colors.primary}08` : 'transparent', borderRadius: 8, flexWrap: 'wrap' }}>
                              <select value={place.name} onChange={(e) => updatePlace(cat.id, item.id, place.id, 'name', e.target.value)} style={{ width: 100, height: 32, borderRadius: 6, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 12 }}>
                                {placesList.map(p => (<option key={p} value={p}>{p}</option>))}
                              </select>
                              {['length', 'width'].map(dim => (
                                <select key={dim} value={place[dim]} onChange={(e) => updatePlace(cat.id, item.id, place.id, dim, e.target.value)} style={{ width: 55, height: 32, borderRadius: 6, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 12 }}>
                                  {[1,2,3,4,5,6,7,8,9,10,12,14,16,18,20].map(n => (<option key={n} value={n}>{n}م</option>))}
                                </select>
                              ))}
                              <span style={{ padding: '6px 10px', borderRadius: 6, background: `${colors.success}15`, color: colors.success, fontSize: 12, fontWeight: 700 }}>{place.area}م²</span>
                              {item.places.length > 1 && <button onClick={() => deletePlace(cat.id, item.id, place.id)} style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${colors.danger}`, background: `${colors.danger}10`, color: colors.danger, cursor: 'pointer' }}>✕</button>}
                            </div>
                          ))}

                          <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => addPlace(cat.id, item.id)} style={{ flex: 1, height: 32, borderRadius: 6, border: `1px solid ${colors.success}`, background: `${colors.success}15`, color: colors.success, fontSize: 12, cursor: 'pointer' }}>+ مكان</button>
                            <button onClick={() => deleteItem(cat.id, item.id)} style={{ height: 32, padding: '0 12px', borderRadius: 6, border: `1px solid ${colors.danger}`, background: `${colors.danger}10`, color: colors.danger, fontSize: 12, cursor: 'pointer' }}>حذف</button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                <button onClick={() => addItem(cat.id)} style={{ width: '100%', height: 44, borderRadius: 10, border: `1px solid ${colors.success}`, background: `${colors.success}15`, color: colors.success, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}>+ إضافة بند</button>

                <div style={{ padding: 14, background: `${colors.primary}10`, borderRadius: 10, marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span style={{ color: colors.text, fontSize: 12 }}>البنود</span><span style={{ color: colors.text, fontSize: 12, fontWeight: 600 }}>{formatNumber(catTotals.totalPrice)}﷼</span></div>
                  {cat.options?.taxPercent > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span style={{ color: colors.primary, fontSize: 12 }}>+ ضريبة {cat.options.taxPercent}%</span><span style={{ color: colors.primary, fontSize: 12 }}>{formatNumber(catTotals.taxAmount)}﷼</span></div>}
                  <div style={{ borderTop: `1px solid ${colors.primary}30`, paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>الإجمالي</span><span style={{ fontSize: 18, fontWeight: 800, color: colors.success }}>{formatNumber(catTotals.finalTotal)}﷼</span></div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {hasCategories && (
        <div style={{ background: `linear-gradient(135deg, ${colors.success}20, ${colors.primary}20)`, borderRadius: 16, padding: 24, border: `2px solid ${colors.success}50`, textAlign: 'center', marginTop: 20 }}>
          <div style={{ fontSize: 14, color: colors.muted, marginBottom: 8 }}>💰 الإجمالي الكلي</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#fff' }}>{formatNumber(getGrandTotal())}</div>
          <div style={{ fontSize: 14, color: colors.success, fontWeight: 600 }}>ريال سعودي</div>
        </div>
      )}
    </>
  );
};

export default CalculatorSection;
