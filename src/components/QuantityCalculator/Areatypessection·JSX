// ╔═══════════════════════════════════════════════════════════════════════════════════╗
// ║                       قسم أنواع المساحة - AreaTypesSection                        ║
// ╚═══════════════════════════════════════════════════════════════════════════════════╝

import React, { useState } from 'react';
import { formulaTemplates } from './ColorsAndConstants';

const AreaTypesSection = ({ colors, itemTypes, workItems, setItemTypes, formatNumber }) => {
  const [editingType, setEditingType] = useState(null);

  const addItemType = () => {
    const newId = `type_${Date.now()}`;
    setItemTypes(prev => ({
      ...prev,
      [newId]: { id: newId, name: 'نوع جديد', icon: '📐', color: colors.primary, formula: 'length * width', formulaDisplay: 'ط × ع', unit: 'م²', description: 'وصف النوع', enabled: true }
    }));
  };

  const updateItemType = (typeId, updates) => {
    setItemTypes(prev => ({ ...prev, [typeId]: { ...prev[typeId], ...updates } }));
  };

  const deleteItemType = (typeId) => {
    const isUsed = Object.values(workItems).some(cat => cat.items.some(item => item.typeId === typeId));
    if (isUsed) { alert('لا يمكن حذف هذا النوع لأنه مستخدم!'); return; }
    setItemTypes(prev => { const { [typeId]: _, ...rest } = prev; return rest; });
    setEditingType(null);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <div style={{ width: 42, height: 42, background: `linear-gradient(135deg, ${colors.purple}, ${colors.pink})`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📐</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: colors.text }}>برمجة القياس</div>
          <div style={{ fontSize: 13, color: colors.muted }}>معادلات حساب الكميات</div>
        </div>
      </div>

      <div style={{ background: `${colors.purple}15`, padding: 18, borderRadius: 14, border: `1px solid ${colors.purple}30`, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: colors.purple, marginBottom: 10 }}>💡 أنواع القياس</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
          {[
            { icon: '⬇️', name: 'أرضية', formula: 'ط × ع', color: colors.success },
            { icon: '🧱', name: '4 جدران', formula: '(ط+ع)×2×ر', color: colors.primary },
            { icon: '📏', name: 'محيط', formula: '(ط+ع)×2', color: colors.pink },
            { icon: '🔢', name: 'وحدة', formula: 'العدد', color: colors.orange },
          ].map(t => (
            <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 8, background: `${t.color}15`, padding: '8px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 18 }}>{t.icon}</span>
              <span style={{ color: colors.text, fontWeight: 600, fontSize: 12 }}>{t.name}</span>
              <span style={{ color: t.color, fontWeight: 700, fontSize: 11, marginRight: 'auto' }}>{t.formula}</span>
            </div>
          ))}
        </div>
      </div>

      {Object.values(itemTypes).map(type => (
        <div key={type.id} style={{ background: colors.card, borderRadius: 14, overflow: 'hidden', border: `1px solid ${colors.border}`, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'stretch' }}>
            <div style={{ width: 4, background: type.color }} />
            <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', borderLeft: `1px solid ${colors.border}` }}>
              <div style={{ width: 50, height: 50, borderRadius: 12, background: `${type.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{type.icon}</div>
            </div>
            <div style={{ flex: 1, padding: '14px 16px' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: colors.text, marginBottom: 6 }}>{type.name}</div>
              <div style={{ fontSize: 12, color: colors.muted, marginBottom: 8 }}>{type.description}</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ background: `${type.color}15`, padding: '6px 12px', borderRadius: 8 }}>
                  <span style={{ fontSize: 11, color: colors.muted }}>المعادلة: </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: type.color }}>{type.formulaDisplay}</span>
                </div>
                <div style={{ background: colors.bg, padding: '6px 12px', borderRadius: 8 }}>
                  <span style={{ fontSize: 11, color: colors.muted }}>الوحدة: </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: colors.text }}>{type.unit}</span>
                </div>
              </div>
            </div>
            <div onClick={() => setEditingType({ ...type })} style={{ background: colors.bg, padding: '16px 20px', display: 'flex', alignItems: 'center', borderRight: `1px solid ${colors.border}`, cursor: 'pointer' }}>
              <span style={{ fontSize: 20, color: colors.muted }}>⚙️</span>
            </div>
          </div>
        </div>
      ))}

      <button onClick={addItemType} style={{ width: '100%', height: 56, borderRadius: 14, border: `2px dashed ${colors.purple}`, background: 'transparent', color: colors.purple, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 16 }}>+ إضافة نوع جديد</button>

      <div style={{ background: `linear-gradient(135deg, ${colors.purple}20, ${colors.pink}20)`, borderRadius: 16, padding: 20, border: `1px solid ${colors.purple}40`, textAlign: 'center', marginTop: 20 }}>
        <div style={{ fontSize: 14, color: colors.muted, marginBottom: 8 }}>📊 إجمالي الأنواع</div>
        <div style={{ fontSize: 40, fontWeight: 800, color: colors.purple }}>{Object.keys(itemTypes).length}</div>
      </div>

      {editingType && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }} onClick={() => setEditingType(null)}>
          <div style={{ background: colors.card, borderRadius: 20, padding: 28, width: '100%', maxWidth: 500, border: `2px solid ${colors.purple}40` }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 20, fontWeight: 700, color: colors.text, marginBottom: 24 }}>✏️ تحرير النوع</div>
            
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: colors.muted, marginBottom: 6 }}>الاسم</div>
              <input type="text" value={editingType.name} onChange={e => setEditingType({ ...editingType, name: e.target.value })} style={{ width: '100%', height: 44, padding: '0 14px', borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 15 }} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: colors.muted, marginBottom: 6 }}>الأيقونة</div>
              <input type="text" value={editingType.icon} onChange={e => setEditingType({ ...editingType, icon: e.target.value })} style={{ width: '100%', height: 44, padding: '0 14px', borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 24, textAlign: 'center' }} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: colors.muted, marginBottom: 6 }}>قالب المعادلة</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {formulaTemplates.map(t => (
                  <button key={t.id} onClick={() => setEditingType({ ...editingType, formula: t.formula, formulaDisplay: t.display, unit: t.unit })} style={{ height: 50, borderRadius: 10, border: editingType.formula === t.formula ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`, background: editingType.formula === t.formula ? `${colors.primary}15` : 'transparent', color: colors.text, fontSize: 12, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <span style={{ fontWeight: 600 }}>{t.name}</span>
                    <span style={{ fontSize: 10, color: colors.muted }}>{t.display}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button onClick={() => { deleteItemType(editingType.id); }} style={{ height: 48, padding: '0 20px', borderRadius: 10, border: `1px solid ${colors.danger}`, background: 'transparent', color: colors.danger, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>🗑️ حذف</button>
              <div style={{ flex: 1 }} />
              <button onClick={() => setEditingType(null)} style={{ height: 48, padding: '0 24px', borderRadius: 10, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.muted, fontSize: 14, cursor: 'pointer' }}>إلغاء</button>
              <button onClick={() => { updateItemType(editingType.id, editingType); setEditingType(null); }} style={{ height: 48, padding: '0 28px', borderRadius: 10, border: 'none', background: colors.success, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>✓ حفظ</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AreaTypesSection;
