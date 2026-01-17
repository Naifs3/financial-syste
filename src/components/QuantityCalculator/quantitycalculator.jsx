// QuantityCalculator.jsx - نسخة مصححة
import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

const QuantityCalculator = ({ darkMode, theme }) => {
  // ألوان
  const colors = {
    bg: '#0f172a',
    card: '#1e293b',
    border: '#334155',
    text: '#f1f5f9',
    muted: '#94a3b8',
    primary: '#3b82f6',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
  };

  // بنود العمل
  const workItemsConfig = {
    BL: { name: 'البلاط', icon: '🏠', color: '#3b82f6', subItems: [
      { code: 'BL01', name: 'سيراميك 60×60', price: 50 },
      { code: 'BL02', name: 'بورسلان', price: 80 },
    ]},
    DH: { name: 'الدهان', icon: '🎨', color: '#8b5cf6', subItems: [
      { code: 'DH01', name: 'دهان جدران', price: 25 },
      { code: 'DH02', name: 'دهان سقف', price: 20 },
    ]},
    KH: { name: 'الكهرباء', icon: '⚡', color: '#f59e0b', subItems: [
      { code: 'KH01', name: 'نقطة إضاءة', price: 150 },
      { code: 'KH02', name: 'نقطة بلك', price: 100 },
    ]},
  };

  // الأماكن الافتراضية
  const defaultPlaces = ['دورة مياه 1', 'دورة مياه 2', 'غرفة نوم 1', 'غرفة نوم 2', 'صالة', 'مطبخ', 'مجلس'];

  // === States ===
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [selectedWorkItems, setSelectedWorkItems] = useState({});
  const [categories, setCategories] = useState([]);
  const [expandedCat, setExpandedCat] = useState(null);
  const [dimensions, setDimensions] = useState({ length: 4, width: 4 });

  // === Firebase: تحميل الأماكن ===
  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'calculator_places'), orderBy('createdAt', 'asc')),
      (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, name: d.data().name }));
        setPlaces(data);
        setLoading(false);
        if (data.length === 0) {
          defaultPlaces.forEach(name => {
            addDoc(collection(db, 'calculator_places'), { name, createdAt: serverTimestamp() });
          });
        }
      },
      (err) => { console.error(err); setLoading(false); }
    );
    return () => unsub();
  }, []);

  // === الدوال ===
  const togglePlace = (name) => {
    setSelectedPlaces(prev => 
      prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
    );
  };

  const toggleWorkItem = (key) => {
    setSelectedWorkItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // === إضافة للفئات ===
  const addToCategories = () => {
    console.log('--- بدء الإضافة ---');
    console.log('الأماكن المختارة:', selectedPlaces);
    console.log('البنود المختارة:', selectedWorkItems);
    
    if (selectedPlaces.length === 0) {
      alert('اختر أماكن أولاً');
      return;
    }
    
    const activeKeys = Object.keys(selectedWorkItems).filter(k => selectedWorkItems[k]);
    console.log('البنود الفعالة:', activeKeys);
    
    if (activeKeys.length === 0) {
      alert('اختر بنود أولاً');
      return;
    }

    const area = dimensions.length * dimensions.width;
    
    const newPlaces = selectedPlaces.map((name, i) => ({
      id: `place_${Date.now()}_${i}`,
      name,
      area,
      length: dimensions.length,
      width: dimensions.width,
    }));

    console.log('الأماكن الجديدة:', newPlaces);

    const newCategories = [];
    
    activeKeys.forEach(key => {
      const config = workItemsConfig[key];
      const catId = `cat_${Date.now()}_${key}`;
      
      newCategories.push({
        id: catId,
        code: key,
        name: config.name,
        icon: config.icon,
        color: config.color,
        subItems: config.subItems,
        items: [],
        pendingPlaces: newPlaces.map((p, i) => ({ ...p, id: `${p.id}_${key}_${i}` })),
      });
    });

    console.log('الفئات الجديدة:', newCategories);

    setCategories(prev => {
      const updated = [...prev, ...newCategories];
      console.log('الفئات بعد التحديث:', updated);
      return updated;
    });

    // فتح أول فئة جديدة
    if (newCategories.length > 0) {
      setExpandedCat(newCategories[0].id);
    }

    setSelectedPlaces([]);
    setSelectedWorkItems({});
  };

  // === اختيار البند الفرعي ===
  const assignSubItem = (catId, placeId, subItemCode) => {
    console.log('--- اختيار بند فرعي ---');
    console.log('catId:', catId, 'placeId:', placeId, 'subItemCode:', subItemCode);
    
    if (!subItemCode) return;
    
    setCategories(prev => {
      const updated = prev.map(cat => {
        if (cat.id !== catId) return cat;
        
        const subItem = cat.subItems.find(s => s.code === subItemCode);
        const place = cat.pendingPlaces.find(p => p.id === placeId);
        
        console.log('subItem:', subItem, 'place:', place);
        
        if (!subItem || !place) return cat;
        
        const newItem = {
          id: `item_${Date.now()}`,
          code: subItem.code,
          name: subItem.name,
          price: subItem.price,
          places: [{ ...place }],
        };
        
        console.log('البند الجديد:', newItem);
        
        return {
          ...cat,
          items: [...cat.items, newItem],
          pendingPlaces: cat.pendingPlaces.filter(p => p.id !== placeId),
        };
      });
      
      console.log('الفئات بعد التحديث:', updated);
      return updated;
    });
  };

  // === حذف فئة ===
  const deleteCategory = (catId) => {
    setCategories(prev => prev.filter(c => c.id !== catId));
    setExpandedCat(null);
  };

  // === حساب الإجمالي ===
  const getCatTotal = (cat) => {
    return (cat.items || []).reduce((sum, item) => {
      const itemArea = (item.places || []).reduce((s, p) => s + (p.area || 0), 0);
      return sum + (itemArea * (item.price || 0));
    }, 0);
  };

  const getGrandTotal = () => categories.reduce((sum, cat) => sum + getCatTotal(cat), 0);

  // === التحميل ===
  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: colors.muted, direction: 'rtl' }}>
        <div style={{ fontSize: 40 }}>⏳</div>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  // === Debug Info ===
  console.log('=== RENDER ===');
  console.log('categories:', categories);
  console.log('categories.length:', categories.length);

  // === العرض ===
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16, direction: 'rtl', fontFamily: 'system-ui' }}>
      
      {/* ===== نموذج الإدخال ===== */}
      <div style={{ background: colors.card, borderRadius: 12, padding: 20, marginBottom: 20, border: `2px solid ${colors.primary}` }}>
        <h2 style={{ color: colors.text, marginBottom: 16, fontSize: 18, margin: 0, marginBottom: 16 }}>📐 نموذج إدخال سريع</h2>
        
        {/* الخطوة 1: الأماكن */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ color: colors.text, marginBottom: 10, fontWeight: 600 }}>
            1️⃣ اختر الأماكن ({selectedPlaces.length} مختار)
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {places.map(p => (
              <button
                key={p.id}
                onClick={() => togglePlace(p.name)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: `2px solid ${selectedPlaces.includes(p.name) ? colors.success : colors.border}`,
                  background: selectedPlaces.includes(p.name) ? `${colors.success}30` : 'transparent',
                  color: selectedPlaces.includes(p.name) ? colors.success : colors.text,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: selectedPlaces.includes(p.name) ? 700 : 400,
                }}
              >
                {selectedPlaces.includes(p.name) && '✓ '}{p.name}
              </button>
            ))}
          </div>
        </div>

        {/* الأبعاد */}
        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: colors.muted }}>الأبعاد:</span>
          <input
            type="number"
            value={dimensions.length}
            onChange={e => setDimensions(d => ({ ...d, length: +e.target.value || 1 }))}
            style={{ width: 60, padding: 8, borderRadius: 6, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, textAlign: 'center' }}
          />
          <span style={{ color: colors.muted }}>×</span>
          <input
            type="number"
            value={dimensions.width}
            onChange={e => setDimensions(d => ({ ...d, width: +e.target.value || 1 }))}
            style={{ width: 60, padding: 8, borderRadius: 6, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, textAlign: 'center' }}
          />
          <span style={{ color: colors.success, fontWeight: 700 }}>= {dimensions.length * dimensions.width} م²</span>
        </div>

        {/* الخطوة 2: البنود */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ color: colors.text, marginBottom: 10, fontWeight: 600 }}>
            2️⃣ اختر البنود
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.entries(workItemsConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => toggleWorkItem(key)}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: `2px solid ${selectedWorkItems[key] ? config.color : colors.border}`,
                  background: selectedWorkItems[key] ? `${config.color}30` : 'transparent',
                  color: selectedWorkItems[key] ? config.color : colors.text,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>{config.icon}</span>
                <span>{config.name}</span>
                {selectedWorkItems[key] && <span>✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* زر الإضافة */}
        <button
          onClick={addToCategories}
          disabled={selectedPlaces.length === 0 || !Object.values(selectedWorkItems).some(v => v)}
          style={{
            width: '100%',
            padding: 16,
            borderRadius: 10,
            border: 'none',
            background: (selectedPlaces.length > 0 && Object.values(selectedWorkItems).some(v => v))
              ? colors.success : colors.border,
            color: '#fff',
            fontSize: 16,
            fontWeight: 700,
            cursor: (selectedPlaces.length > 0 && Object.values(selectedWorkItems).some(v => v))
              ? 'pointer' : 'not-allowed',
          }}
        >
          ➕ إضافة الأماكن للبنود
        </button>
      </div>

      {/* ===== عداد الفئات للتأكد ===== */}
      <div style={{ background: colors.warning, color: '#000', padding: 10, borderRadius: 8, marginBottom: 10, fontWeight: 700, textAlign: 'center' }}>
        عدد الفئات: {categories.length}
      </div>

      {/* ===== الفئات ===== */}
      {categories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: colors.muted, background: colors.card, borderRadius: 12, border: `1px solid ${colors.border}` }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>📦</div>
          <p>لا توجد فئات - أضف من النموذج أعلاه</p>
        </div>
      ) : (
        <div>
          {categories.map(cat => {
            const isExpanded = expandedCat === cat.id;
            const total = getCatTotal(cat);
            const pendingCount = (cat.pendingPlaces || []).length;
            const itemsCount = (cat.items || []).length;
            
            return (
              <div key={cat.id} style={{ background: colors.card, borderRadius: 12, marginBottom: 12, border: `2px solid ${isExpanded ? cat.color : colors.border}`, overflow: 'hidden' }}>
                
                {/* رأس الفئة */}
                <div
                  onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
                  style={{ padding: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, background: isExpanded ? `${cat.color}15` : 'transparent' }}
                >
                  <span style={{ fontSize: 28 }}>{cat.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>{cat.name}</div>
                    <div style={{ fontSize: 12, color: colors.muted }}>
                      {itemsCount} بنود • {pendingCount} معلق
                    </div>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: colors.success }}>{total.toLocaleString()} ﷼</div>
                  <span style={{ color: cat.color, transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.2s' }}>▼</span>
                </div>

                {/* محتوى الفئة */}
                {isExpanded && (
                  <div style={{ padding: 16, borderTop: `1px dashed ${cat.color}50` }}>
                    
                    {/* الأماكن المعلقة */}
                    {pendingCount > 0 && (
                      <div style={{ background: `${colors.warning}15`, borderRadius: 10, padding: 14, marginBottom: 16, border: `2px solid ${colors.warning}` }}>
                        <div style={{ color: colors.warning, fontWeight: 700, marginBottom: 12, fontSize: 14 }}>
                          ⚠️ أماكن تحتاج اختيار البند الفرعي ({pendingCount})
                        </div>
                        {(cat.pendingPlaces || []).map(place => (
                          <div key={place.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, padding: 12, background: colors.card, borderRadius: 8, border: `1px solid ${colors.border}` }}>
                            <div style={{ minWidth: 120 }}>
                              <div style={{ fontWeight: 600, color: colors.text, fontSize: 14 }}>{place.name}</div>
                              <div style={{ fontSize: 12, color: colors.muted }}>{place.area} م²</div>
                            </div>
                            <select
                              defaultValue=""
                              onChange={(e) => assignSubItem(cat.id, place.id, e.target.value)}
                              style={{
                                flex: 1,
                                padding: 12,
                                borderRadius: 8,
                                border: `2px solid ${cat.color}`,
                                background: colors.bg,
                                color: colors.text,
                                fontSize: 14,
                                cursor: 'pointer',
                              }}
                            >
                              <option value="">-- اختر البند الفرعي --</option>
                              {(cat.subItems || []).map(s => (
                                <option key={s.code} value={s.code}>
                                  [{s.code}] {s.name} - {s.price} ﷼/م²
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* البنود المضافة */}
                    {itemsCount > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ color: colors.text, fontWeight: 700, marginBottom: 10, fontSize: 14 }}>📦 البنود ({itemsCount})</div>
                        {(cat.items || []).map(item => {
                          const itemArea = (item.places || []).reduce((s, p) => s + (p.area || 0), 0);
                          const itemTotal = itemArea * (item.price || 0);
                          return (
                            <div key={item.id} style={{ background: colors.bg, borderRadius: 8, padding: 14, marginBottom: 8, border: `1px solid ${colors.border}` }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                  <div style={{ fontWeight: 600, color: colors.text, fontSize: 14 }}>[{item.code}] {item.name}</div>
                                  <div style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
                                    📍 {(item.places || []).map(p => p.name).join('، ')} | {itemArea} م² × {item.price} ﷼
                                  </div>
                                </div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: colors.success }}>{itemTotal.toLocaleString()} ﷼</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* لا توجد بنود */}
                    {itemsCount === 0 && pendingCount === 0 && (
                      <div style={{ textAlign: 'center', padding: 20, color: colors.muted }}>
                        لا توجد بنود
                      </div>
                    )}

                    {/* زر الحذف */}
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      style={{ padding: '10px 20px', borderRadius: 8, border: `1px solid ${colors.danger}`, background: `${colors.danger}20`, color: colors.danger, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
                    >
                      🗑️ حذف الفئة
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ===== الإجمالي ===== */}
      {categories.length > 0 && (
        <div style={{ background: `linear-gradient(135deg, ${colors.success}20, ${colors.primary}20)`, borderRadius: 12, padding: 24, textAlign: 'center', marginTop: 20, border: `2px solid ${colors.success}` }}>
          <div style={{ color: colors.muted, marginBottom: 8 }}>💰 الإجمالي الكلي</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#fff' }}>{getGrandTotal().toLocaleString()}</div>
          <div style={{ color: colors.success, fontWeight: 600 }}>ريال سعودي</div>
        </div>
      )}
    </div>
  );
};

export default QuantityCalculator;
