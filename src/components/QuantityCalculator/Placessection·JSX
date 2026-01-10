// ╔═══════════════════════════════════════════════════════════════════════════════════╗
// ║                           قسم الأماكن - PlacesSection                             ║
// ╚═══════════════════════════════════════════════════════════════════════════════════╝

import React, { useState } from 'react';

const PlacesSection = ({ colors, places, setPlaces, placeTypeColors }) => {
  const [expandedType, setExpandedType] = useState(null);
  const [editingPlace, setEditingPlace] = useState(null);
  const [newPlaceName, setNewPlaceName] = useState('');

  const updatePlaceType = (typeKey, updates) => {
    setPlaces(prev => ({ ...prev, [typeKey]: { ...prev[typeKey], ...updates } }));
  };

  const addPlace = (typeKey) => {
    if (!newPlaceName.trim()) return;
    setPlaces(prev => ({
      ...prev,
      [typeKey]: { ...prev[typeKey], places: [...(prev[typeKey].places || []), newPlaceName.trim()] }
    }));
    setNewPlaceName('');
  };

  const deletePlace = (typeKey, index) => {
    setPlaces(prev => ({
      ...prev,
      [typeKey]: { ...prev[typeKey], places: prev[typeKey].places.filter((_, i) => i !== index) }
    }));
  };

  const updatePlace = (typeKey, index, newName) => {
    setPlaces(prev => ({
      ...prev,
      [typeKey]: {
        ...prev[typeKey],
        places: prev[typeKey].places.map((p, i) => i === index ? newName : p)
      }
    }));
    setEditingPlace(null);
  };

  const ToggleSwitch = ({ enabled, onToggle }) => (
    <div onClick={(e) => { e.stopPropagation(); onToggle(); }} style={{ width: 48, height: 26, borderRadius: 13, background: enabled ? colors.success : colors.border, padding: 2, cursor: 'pointer', transition: 'background 0.3s' }}>
      <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', transform: enabled ? 'translateX(22px)' : 'translateX(0)', transition: 'transform 0.3s' }} />
    </div>
  );

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <div style={{ width: 42, height: 42, background: `linear-gradient(135deg, ${colors.success}, ${colors.cyan})`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🏠</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: colors.text }}>إدارة الأماكن</div>
          <div style={{ fontSize: 13, color: colors.muted }}>تحديد أنواع الأماكن وقوائمها</div>
        </div>
      </div>

      {Object.entries(places).map(([typeKey, placeType]) => {
        const isExpanded = expandedType === typeKey;
        const typeColor = placeTypeColors[typeKey] || colors.primary;

        return (
          <div key={typeKey} style={{ background: colors.card, borderRadius: 16, overflow: 'hidden', marginBottom: 12, border: isExpanded ? `2px solid ${typeColor}` : `1px solid ${colors.border}` }}>
            <div onClick={() => setExpandedType(isExpanded ? null : typeKey)} style={{ display: 'flex', alignItems: 'stretch', cursor: 'pointer', background: isExpanded ? `${typeColor}08` : 'transparent' }}>
              <div style={{ width: 4, background: typeColor }} />
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center' }}>
                <div style={{ width: 50, height: 50, borderRadius: 12, background: `${typeColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{placeType.icon}</div>
              </div>
              <div style={{ flex: 1, padding: '16px 18px' }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: colors.text, marginBottom: 6 }}>{placeType.name}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {(placeType.places || []).slice(0, 4).map((p, i) => (
                    <span key={i} style={{ fontSize: 11, background: `${typeColor}15`, color: typeColor, padding: '3px 8px', borderRadius: 6 }}>{p}</span>
                  ))}
                  {(placeType.places?.length || 0) > 4 && <span style={{ fontSize: 11, color: typeColor }}>+{placeType.places.length - 4}</span>}
                </div>
              </div>
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', borderRight: `1px solid ${colors.border}` }}>
                <ToggleSwitch enabled={placeType.enabled} onToggle={() => updatePlaceType(typeKey, { enabled: !placeType.enabled })} />
              </div>
              <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', background: colors.bg }}>
                <span style={{ fontSize: 16, color: isExpanded ? typeColor : colors.muted, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
              </div>
            </div>

            {isExpanded && (
              <div style={{ padding: 16, background: `${typeColor}05`, borderTop: `1px dashed ${typeColor}40` }}>
                {(placeType.places || []).map((place, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, padding: '10px 14px', background: colors.card, borderRadius: 10, border: `1px solid ${colors.border}` }}>
                    {editingPlace === `${typeKey}-${index}` ? (
                      <input autoFocus value={place} onChange={(e) => {
                        const newPlaces = [...placeType.places];
                        newPlaces[index] = e.target.value;
                        updatePlaceType(typeKey, { places: newPlaces });
                      }} onBlur={() => setEditingPlace(null)} onKeyDown={(e) => e.key === 'Enter' && setEditingPlace(null)} style={{ flex: 1, height: 32, padding: '0 10px', borderRadius: 6, border: `1px solid ${typeColor}`, background: colors.bg, color: colors.text, fontSize: 14 }} />
                    ) : (
                      <span onClick={() => setEditingPlace(`${typeKey}-${index}`)} style={{ flex: 1, color: colors.text, fontSize: 14, cursor: 'pointer' }}>{place}</span>
                    )}
                    <button onClick={() => deletePlace(typeKey, index)} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${colors.danger}`, background: `${colors.danger}10`, color: colors.danger, cursor: 'pointer' }}>✕</button>
                  </div>
                ))}

                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <input value={newPlaceName} onChange={(e) => setNewPlaceName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addPlace(typeKey)} placeholder="اسم المكان الجديد..." style={{ flex: 1, height: 40, padding: '0 14px', borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 14 }} />
                  <button onClick={() => addPlace(typeKey)} style={{ height: 40, padding: '0 20px', borderRadius: 10, border: `1px solid ${colors.success}`, background: `${colors.success}15`, color: colors.success, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>+ إضافة</button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div style={{ background: `linear-gradient(135deg, ${colors.success}20, ${colors.cyan}20)`, borderRadius: 16, padding: 20, border: `1px solid ${colors.success}40`, marginTop: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 14, color: colors.muted, marginBottom: 8 }}>📊 إحصائيات</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 30 }}>
          <div><div style={{ fontSize: 28, fontWeight: 800, color: colors.success }}>{Object.keys(places).length}</div><div style={{ fontSize: 12, color: colors.muted }}>أنواع</div></div>
          <div><div style={{ fontSize: 28, fontWeight: 800, color: colors.primary }}>{Object.values(places).reduce((sum, pt) => sum + (pt.places?.length || 0), 0)}</div><div style={{ fontSize: 12, color: colors.muted }}>مكان</div></div>
          <div><div style={{ fontSize: 28, fontWeight: 800, color: colors.cyan }}>{Object.values(places).filter(pt => pt.enabled).length}</div><div style={{ fontSize: 12, color: colors.muted }}>مفعّل</div></div>
        </div>
      </div>
    </>
  );
};

export default PlacesSection;
