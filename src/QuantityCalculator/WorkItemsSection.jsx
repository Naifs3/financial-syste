// ╔═══════════════════════════════════════════════════════════════════════════════════╗
// ║                         قسم بنود العمل - WorkItemsSection                         ║
// ╚═══════════════════════════════════════════════════════════════════════════════════╝

import React, { useState } from 'react';

const WorkItemsSection = ({
  colors,
  places,
  workItems,
  programming,
  itemTypes,
  setWorkItems,
  setProgramming,
  setPlaces,
  formatNumber,
  getColor,
  placeTypeColors
}) => {
  // ═══════════════════════════════════════════════════════════════════════════════════
  // الحالات المحلية
  // ═══════════════════════════════════════════════════════════════════════════════════
  const [expandedPlaceType, setExpandedPlaceType] = useState(null);
  const [expandedCategoryProg, setExpandedCategoryProg] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingPlaceType, setEditingPlaceType] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const DEFAULT_ICON = '📦';

  // ═══════════════════════════════════════════════════════════════════════════════════
  // دوال مساعدة
  // ═══════════════════════════════════════════════════════════════════════════════════
  const getFullCode = (catKey, item) => `${workItems[catKey]?.code || 'XX'}${item.num}`;
  const isCategoryEnabled = (ptKey, catKey) => programming[ptKey]?.[catKey]?.enabled ?? false;
  const isItemEnabled = (ptKey, catKey, itemId) => programming[ptKey]?.[catKey]?.items?.includes(itemId) ?? false;

  // ═══════════════════════════════════════════════════════════════════════════════════
  // دوال التحكم
  // ═══════════════════════════════════════════════════════════════════════════════════
  const toggleCategoryInPlace = (ptKey, catKey) => {
    setProgramming(prev => ({
      ...prev,
      [ptKey]: { ...prev[ptKey], [catKey]: { ...prev[ptKey]?.[catKey], enabled: !prev[ptKey]?.[catKey]?.enabled, items: prev[ptKey]?.[catKey]?.items || [] } }
    }));
  };

  const toggleItemInPlace = (ptKey, catKey, itemId) => {
    setProgramming(prev => {
      const current = prev[ptKey]?.[catKey]?.items || [];
      const newItems = current.includes(itemId) ? current.filter(i => i !== itemId) : [...current, itemId];
      return { ...prev, [ptKey]: { ...prev[ptKey], [catKey]: { ...prev[ptKey]?.[catKey], items: newItems } } };
    });
  };

  const addWorkItem = (catKey) => {
    const cat = workItems[catKey];
    const nextNum = String(cat.items.length + 1).padStart(2, '0');
    const newItem = { id: `${catKey[0]}${Date.now()}`, num: nextNum, name: 'بند جديد', desc: 'وصف البند', exec: 0, cont: 0, typeId: 'floor' };
    setWorkItems(prev => ({ ...prev, [catKey]: { ...prev[catKey], items: [...prev[catKey].items, newItem] } }));
  };

  const updateWorkItem = (catKey, itemId, updates) => {
    setWorkItems(prev => ({
      ...prev,
      [catKey]: { ...prev[catKey], items: prev[catKey].items.map(item => item.id === itemId ? { ...item, ...updates } : item) }
    }));
  };

  const deleteWorkItem = (catKey, itemId) => {
    setWorkItems(prev => ({ ...prev, [catKey]: { ...prev[catKey], items: prev[catKey].items.filter(item => item.id !== itemId) } }));
    setProgramming(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(ptKey => {
        if (updated[ptKey]?.[catKey]?.items) {
          updated[ptKey][catKey].items = updated[ptKey][catKey].items.filter(id => id !== itemId);
        }
      });
      return updated;
    });
    setEditingItem(null);
    setConfirmDelete(null);
  };

  const addCategory = () => {
    const newKey = `cat${Date.now()}`;
    setWorkItems(prev => ({ ...prev, [newKey]: { name: 'قسم جديد', icon: '📦', code: 'XX', items: [] } }));
    setProgramming(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(ptKey => { updated[ptKey][newKey] = { enabled: false, items: [] }; });
      return updated;
    });
  };

  const deleteCategory = (catKey) => {
    setWorkItems(prev => { const { [catKey]: _, ...rest } = prev; return rest; });
    setProgramming(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(ptKey => { delete updated[ptKey][catKey]; });
      return updated;
    });
    setEditingCategory(null);
    setConfirmDelete(null);
  };

  const updatePlaceType = (ptKey, updates) => {
    setPlaces(prev => ({ ...prev, [ptKey]: { ...prev[ptKey], ...updates } }));
  };

  // ═══════════════════════════════════════════════════════════════════════════════════
  // المكونات الفرعية
  // ═══════════════════════════════════════════════════════════════════════════════════
  const ToggleSwitch = ({ enabled, onToggle }) => (
    <div onClick={(e) => { e.stopPropagation(); onToggle(); }} style={{ width: 52, height: 28, borderRadius: 14, background: enabled ? colors.success : colors.border, padding: 3, cursor: 'pointer', transition: 'background 0.3s' }}>
      <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', transform: enabled ? 'translateX(24px)' : 'translateX(0)', transition: 'transform 0.3s' }} />
    </div>
  );

  const EditableIcon = ({ icon, onChange, size = 50, color }) => {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(icon);
    if (editing) {
      return <input autoFocus value={value} onChange={e => setValue(e.target.value)} onBlur={() => { onChange(value || DEFAULT_ICON); setEditing(false); }} onKeyDown={e => { if (e.key === 'Enter') { onChange(value || DEFAULT_ICON); setEditing(false); } }} style={{ width: size, height: size, textAlign: 'center', fontSize: size * 0.5, border: `2px solid ${color}`, borderRadius: 12, background: colors.bg, color: colors.text }} />;
    }
    return <div onClick={() => setEditing(true)} style={{ width: size, height: size, borderRadius: 14, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.5, cursor: 'pointer', border: '2px solid transparent', transition: 'border 0.2s' }} onMouseEnter={e => e.target.style.border = `2px solid ${color}`} onMouseLeave={e => e.target.style.border = '2px solid transparent'}>{icon}</div>;
  };

  const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }} onClick={onCancel}>
      <div style={{ background: colors.card, borderRadius: 20, padding: 32, width: '90%', maxWidth: 400, border: `2px solid ${colors.danger}40` }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 20, fontWeight: 700, color: colors.danger, marginBottom: 16 }}>⚠️ {title}</div>
        <div style={{ fontSize: 16, color: colors.text, marginBottom: 24, lineHeight: 1.6 }}>{message}</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onCancel} style={{ flex: 1, height: 48, borderRadius: 12, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.muted, fontSize: 16, cursor: 'pointer' }}>إلغاء</button>
          <button onClick={onConfirm} style={{ flex: 1, height: 48, borderRadius: 12, border: 'none', background: colors.danger, color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>تأكيد الحذف</button>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════════════
  // العرض
  // ═══════════════════════════════════════════════════════════════════════════════════
  return (
    <>
      {confirmDelete && <ConfirmDialog {...confirmDelete} />}

      {/* عنوان القسم */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <div style={{ width: 42, height: 42, background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📦</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: colors.text }}>بنود العمل</div>
          <div style={{ fontSize: 13, color: colors.muted }}>إدارة الأقسام والبنود لكل نوع مكان</div>
        </div>
      </div>

      {/* أنواع الأماكن */}
      {Object.entries(places).map(([ptKey, place]) => {
        const ptColor = placeTypeColors[ptKey] || colors.primary;
        const isExpanded = expandedPlaceType === ptKey;

        return (
          <div key={ptKey} style={{ background: colors.card, borderRadius: 18, overflow: 'hidden', marginBottom: 16, border: isExpanded ? `2px solid ${ptColor}` : `1px solid ${colors.border}`, transition: 'all 0.3s' }}>
            {/* رأس نوع المكان */}
            <div onClick={() => setExpandedPlaceType(isExpanded ? null : ptKey)} style={{ display: 'flex', alignItems: 'stretch', cursor: 'pointer', background: isExpanded ? `${ptColor}10` : 'transparent' }}>
              <div style={{ width: 6, background: ptColor }} />
              <div style={{ padding: '20px 22px' }} onClick={(e) => e.stopPropagation()}>
                <EditableIcon icon={place.icon} onChange={(icon) => updatePlaceType(ptKey, { icon })} size={56} color={ptColor} />
              </div>
              <div style={{ flex: 1, padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: colors.text }}>{place.name}</span>
                  <span style={{ fontSize: 13, padding: '6px 14px', borderRadius: 10, background: ptColor, color: '#fff', fontWeight: 600 }}>{place.places?.length || 0} أماكن</span>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 13, color: colors.muted }}>
                  {place.places?.slice(0, 5).map((p, i) => <span key={i} style={{ background: `${ptColor}15`, padding: '4px 10px', borderRadius: 8 }}>{p}</span>)}
                  {place.places?.length > 5 && <span style={{ color: ptColor }}>+{place.places.length - 5}</span>}
                </div>
              </div>
              <div style={{ background: place.enabled ? `${colors.success}15` : colors.bg, padding: '20px 24px', display: 'flex', alignItems: 'center', borderRight: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
                <ToggleSwitch enabled={place.enabled} onToggle={() => updatePlaceType(ptKey, { enabled: !place.enabled })} />
              </div>
              <div style={{ background: colors.bg, padding: '20px 22px', display: 'flex', alignItems: 'center', borderRight: `1px solid ${colors.border}` }}>
                <span style={{ fontSize: 20, color: isExpanded ? ptColor : colors.muted, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
              </div>
            </div>

            {/* محتوى نوع المكان */}
            {isExpanded && (
              <div style={{ background: `${ptColor}05`, borderTop: `1px dashed ${ptColor}40`, padding: 20 }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                  <button onClick={() => setEditingPlaceType({ key: ptKey, name: place.name, icon: place.icon, places: [...(place.places || [])] })} style={{ height: 40, padding: '0 20px', borderRadius: 12, border: `2px solid ${colors.warning}`, background: `${colors.warning}15`, color: colors.warning, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>✏️ تحرير الأماكن</button>
                </div>

                {/* الأقسام */}
                {Object.entries(workItems).map(([catKey, cat], catIdx) => {
                  const catColor = getColor(catIdx);
                  const isCatExpanded = expandedCategoryProg === `${ptKey}-${catKey}`;
                  const isEnabled = isCategoryEnabled(ptKey, catKey);
                  const enabledItemsCount = cat.items.filter(i => isItemEnabled(ptKey, catKey, i.id)).length;

                  return (
                    <div key={catKey} style={{ background: colors.card, borderRadius: 16, overflow: 'hidden', marginBottom: 12, border: isCatExpanded ? `2px solid ${catColor}` : `1px solid ${colors.border}`, opacity: isEnabled ? 1 : 0.6, transition: 'opacity 0.3s' }}>
                      <div onClick={() => setExpandedCategoryProg(isCatExpanded ? null : `${ptKey}-${catKey}`)} style={{ display: 'flex', alignItems: 'stretch', cursor: 'pointer', background: isCatExpanded ? `${catColor}10` : 'transparent' }}>
                        <div style={{ padding: '18px 20px' }} onClick={(e) => e.stopPropagation()}>
                          <EditableIcon icon={cat.icon} onChange={(icon) => setWorkItems(p => ({ ...p, [catKey]: { ...p[catKey], icon } }))} size={52} color={catColor} />
                        </div>
                        <div style={{ flex: 1, padding: '16px 18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                            <span style={{ fontSize: 18, fontWeight: 700, color: colors.text }}>{cat.name}</span>
                            <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 8, background: catColor, color: '#fff', fontFamily: 'monospace', fontWeight: 700 }}>{cat.code}</span>
                          </div>
                          <div style={{ fontSize: 13, color: colors.muted }}>{cat.items.length} بند • {enabledItemsCount} مفعّل</div>
                        </div>
                        <div style={{ background: colors.bg, padding: '16px 18px', display: 'flex', alignItems: 'center', borderRight: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => setEditingCategory({ catKey, ...cat })} style={{ width: 40, height: 40, borderRadius: 12, border: `1px solid ${colors.warning}`, background: `${colors.warning}15`, color: colors.warning, fontSize: 16, cursor: 'pointer' }}>✏️</button>
                        </div>
                        <div style={{ background: isEnabled ? `${colors.success}15` : colors.bg, padding: '16px 20px', display: 'flex', alignItems: 'center', borderRight: `1px solid ${colors.border}` }}>
                          <ToggleSwitch enabled={isEnabled} onToggle={() => toggleCategoryInPlace(ptKey, catKey)} />
                        </div>
                        <div style={{ background: colors.bg, padding: '16px 18px', display: 'flex', alignItems: 'center', borderRight: `1px solid ${colors.border}` }}>
                          <span style={{ fontSize: 18, color: isCatExpanded ? catColor : colors.muted, transform: isCatExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
                        </div>
                      </div>

                      {/* البنود */}
                      {isCatExpanded && (
                        <div style={{ padding: 20, background: `${catColor}05`, borderTop: `1px dashed ${catColor}30` }}>
                          {cat.items.map((item) => {
                            const isOn = isItemEnabled(ptKey, catKey, item.id);
                            const typeInfo = itemTypes[item.typeId] || { icon: '📦', name: 'عام', color: colors.muted };
                            const fullCode = getFullCode(catKey, item);
                            const profit = item.exec - item.cont;

                            return (
                              <div key={item.id} style={{ background: colors.card, borderRadius: 14, overflow: 'hidden', marginBottom: 10, border: isOn ? `2px solid ${colors.success}40` : `1px solid ${colors.border}`, opacity: isOn ? 1 : 0.5, transition: 'all 0.3s' }}>
                                <div style={{ display: 'flex', alignItems: 'stretch' }}>
                                  <div style={{ background: catColor, padding: '16px 14px', display: 'flex', alignItems: 'center', minWidth: 65 }}>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>{fullCode}</span>
                                  </div>
                                  <div style={{ flex: 1, padding: '14px 16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                                      <span style={{ fontSize: 16, fontWeight: 600, color: colors.text }}>{item.name}</span>
                                      <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, background: `${typeInfo.color}15`, color: typeInfo.color }}>{typeInfo.icon} {typeInfo.name}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 13, flexWrap: 'wrap' }}>
                                      <span style={{ color: colors.muted }}>{item.desc}</span>
                                      <span style={{ color: colors.warning, fontWeight: 700 }}>💰 {formatNumber(item.exec)}</span>
                                      <span style={{ color: colors.cyan }}>🏗️ {formatNumber(item.cont)}</span>
                                      <span style={{ color: profit > 0 ? colors.success : colors.danger, fontWeight: 700, background: profit > 0 ? `${colors.success}15` : `${colors.danger}15`, padding: '4px 10px', borderRadius: 8 }}>💎 {formatNumber(profit)}</span>
                                    </div>
                                  </div>
                                  <div onClick={() => setEditingItem({ catKey, item: { ...item } })} style={{ background: colors.bg, padding: '14px 16px', display: 'flex', alignItems: 'center', borderRight: `1px solid ${colors.border}`, cursor: 'pointer' }}>
                                    <span style={{ fontSize: 18, color: colors.muted }}>⚙️</span>
                                  </div>
                                  <div style={{ background: isOn ? `${colors.success}15` : colors.bg, padding: '14px 18px', display: 'flex', alignItems: 'center', borderRight: `1px solid ${colors.border}` }}>
                                    <ToggleSwitch enabled={isOn} onToggle={() => toggleItemInPlace(ptKey, catKey, item.id)} />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          <button onClick={() => addWorkItem(catKey)} style={{ width: '100%', height: 48, borderRadius: 12, border: `2px dashed ${catColor}`, background: 'transparent', color: catColor, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 10 }}>+ إضافة بند جديد</button>
                        </div>
                      )}
                    </div>
                  );
                })}

                <button onClick={addCategory} style={{ width: '100%', height: 56, borderRadius: 14, border: `2px dashed ${colors.success}`, background: 'transparent', color: colors.success, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 16 }}>+ إضافة قسم جديد</button>
              </div>
            )}
          </div>
        );
      })}

      {/* نافذة تحرير البند */}
      {editingItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }} onClick={() => setEditingItem(null)}>
          <div style={{ background: colors.card, borderRadius: 20, padding: 32, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', border: `2px solid ${colors.primary}40` }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 22, fontWeight: 700, color: colors.text, marginBottom: 28 }}>✏️ تحرير البند</div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: colors.muted, marginBottom: 8 }}>اسم البند</div>
              <input type="text" value={editingItem.item.name} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, name: e.target.value } })} style={{ width: '100%', height: 48, padding: '0 16px', borderRadius: 12, border: `2px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 16 }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: colors.muted, marginBottom: 8 }}>الوصف</div>
              <input type="text" value={editingItem.item.desc} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, desc: e.target.value } })} style={{ width: '100%', height: 48, padding: '0 16px', borderRadius: 12, border: `2px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 16 }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: colors.muted, marginBottom: 8 }}>نوع المساحة</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {Object.values(itemTypes).map(type => (
                  <button key={type.id} onClick={() => setEditingItem({ ...editingItem, item: { ...editingItem.item, typeId: type.id } })} style={{ height: 60, borderRadius: 12, border: editingItem.item.typeId === type.id ? `2px solid ${type.color}` : `1px solid ${colors.border}`, background: editingItem.item.typeId === type.id ? `${type.color}15` : 'transparent', color: colors.text, fontSize: 14, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <span style={{ fontSize: 20 }}>{type.icon}</span>
                    <span style={{ fontWeight: 600 }}>{type.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: colors.warning, marginBottom: 8 }}>💰 سعر التنفيذ</div>
                <input type="number" value={editingItem.item.exec} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, exec: parseFloat(e.target.value) || 0 } })} style={{ width: '100%', height: 48, padding: '0 16px', borderRadius: 12, border: `2px solid ${colors.warning}`, background: colors.bg, color: colors.text, fontSize: 18, textAlign: 'center', fontWeight: 700 }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: colors.cyan, marginBottom: 8 }}>🏗️ سعر المقاول</div>
                <input type="number" value={editingItem.item.cont} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, cont: parseFloat(e.target.value) || 0 } })} style={{ width: '100%', height: 48, padding: '0 16px', borderRadius: 12, border: `2px solid ${colors.cyan}`, background: colors.bg, color: colors.text, fontSize: 18, textAlign: 'center', fontWeight: 700 }} />
              </div>
            </div>
            <div style={{ background: `${colors.success}15`, padding: 16, borderRadius: 12, marginBottom: 20, textAlign: 'center' }}>
              <span style={{ fontSize: 14, color: colors.muted }}>💎 الربح: </span>
              <span style={{ fontSize: 24, fontWeight: 700, color: colors.success }}>{formatNumber(editingItem.item.exec - editingItem.item.cont)}</span>
              <span style={{ fontSize: 14, color: colors.muted }}> ريال</span>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => { setConfirmDelete({ title: 'حذف البند', message: `هل أنت متأكد من حذف "${editingItem.item.name}"؟`, onConfirm: () => deleteWorkItem(editingItem.catKey, editingItem.item.id), onCancel: () => setConfirmDelete(null) }); }} style={{ height: 52, padding: '0 24px', borderRadius: 12, border: `2px solid ${colors.danger}`, background: 'transparent', color: colors.danger, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>🗑️ حذف</button>
              <div style={{ flex: 1 }} />
              <button onClick={() => setEditingItem(null)} style={{ height: 52, padding: '0 28px', borderRadius: 12, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.muted, fontSize: 16, cursor: 'pointer' }}>إلغاء</button>
              <button onClick={() => { updateWorkItem(editingItem.catKey, editingItem.item.id, editingItem.item); setEditingItem(null); }} style={{ height: 52, padding: '0 32px', borderRadius: 12, border: 'none', background: colors.success, color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>✓ حفظ</button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة تحرير القسم */}
      {editingCategory && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }} onClick={() => setEditingCategory(null)}>
          <div style={{ background: colors.card, borderRadius: 20, padding: 32, width: '100%', maxWidth: 480, border: `2px solid ${colors.warning}40` }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 22, fontWeight: 700, color: colors.text, marginBottom: 28 }}>✏️ تحرير القسم</div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: colors.muted, marginBottom: 8 }}>الكود (حرفين)</div>
              <input type="text" maxLength={2} value={editingCategory.code} onChange={e => setEditingCategory({ ...editingCategory, code: e.target.value.toUpperCase() })} style={{ width: '100%', height: 48, padding: '0 16px', borderRadius: 12, border: `2px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 20, textAlign: 'center', fontWeight: 700, fontFamily: 'monospace' }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: colors.muted, marginBottom: 8 }}>اسم القسم</div>
              <input type="text" value={editingCategory.name} onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })} style={{ width: '100%', height: 48, padding: '0 16px', borderRadius: 12, border: `2px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 16 }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: colors.muted, marginBottom: 8 }}>الأيقونة</div>
              <input type="text" value={editingCategory.icon} onChange={e => setEditingCategory({ ...editingCategory, icon: e.target.value })} style={{ width: '100%', height: 48, padding: '0 16px', borderRadius: 12, border: `2px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 24, textAlign: 'center' }} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => { setConfirmDelete({ title: 'حذف القسم', message: `هل أنت متأكد من حذف "${editingCategory.name}" وجميع بنوده؟`, onConfirm: () => deleteCategory(editingCategory.catKey), onCancel: () => setConfirmDelete(null) }); }} style={{ height: 52, padding: '0 24px', borderRadius: 12, border: `2px solid ${colors.danger}`, background: 'transparent', color: colors.danger, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>🗑️ حذف</button>
              <div style={{ flex: 1 }} />
              <button onClick={() => setEditingCategory(null)} style={{ height: 52, padding: '0 28px', borderRadius: 12, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.muted, fontSize: 16, cursor: 'pointer' }}>إلغاء</button>
              <button onClick={() => { setWorkItems(p => ({ ...p, [editingCategory.catKey]: { ...p[editingCategory.catKey], name: editingCategory.name, code: editingCategory.code, icon: editingCategory.icon } })); setEditingCategory(null); }} style={{ height: 52, padding: '0 32px', borderRadius: 12, border: 'none', background: colors.success, color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>✓ حفظ</button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة تحرير الأماكن */}
      {editingPlaceType && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }} onClick={() => setEditingPlaceType(null)}>
          <div style={{ background: colors.card, borderRadius: 20, padding: 32, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto', border: `2px solid ${placeTypeColors[editingPlaceType.key]}40` }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 22, fontWeight: 700, color: colors.text, marginBottom: 28 }}>✏️ تحرير الأماكن - {editingPlaceType.name}</div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: colors.muted, marginBottom: 12 }}>قائمة الأماكن:</div>
              {editingPlaceType.places.map((place, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                  <input type="text" value={place} onChange={e => { const newPlaces = [...editingPlaceType.places]; newPlaces[idx] = e.target.value; setEditingPlaceType({ ...editingPlaceType, places: newPlaces }); }} style={{ flex: 1, height: 44, padding: '0 14px', borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 15 }} />
                  <button onClick={() => setEditingPlaceType({ ...editingPlaceType, places: editingPlaceType.places.filter((_, i) => i !== idx) })} style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${colors.danger}`, background: `${colors.danger}15`, color: colors.danger, fontSize: 18, cursor: 'pointer' }}>✕</button>
                </div>
              ))}
              <button onClick={() => setEditingPlaceType({ ...editingPlaceType, places: [...editingPlaceType.places, 'مكان جديد'] })} style={{ width: '100%', height: 44, borderRadius: 10, border: `2px dashed ${colors.success}`, background: 'transparent', color: colors.success, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>+ إضافة مكان</button>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setEditingPlaceType(null)} style={{ flex: 1, height: 52, borderRadius: 12, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.muted, fontSize: 16, cursor: 'pointer' }}>إلغاء</button>
              <button onClick={() => { updatePlaceType(editingPlaceType.key, { places: editingPlaceType.places }); setEditingPlaceType(null); }} style={{ flex: 1, height: 52, borderRadius: 12, border: 'none', background: colors.success, color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>✓ حفظ</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkItemsSection;
