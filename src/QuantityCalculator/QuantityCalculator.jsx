// ╔═══════════════════════════════════════════════════════════════════════════════════╗
// ║                       حاسبة الكميات - QuantityCalculator                          ║
// ║                            الملف الرئيسي (المكون الأب)                            ║
// ╚═══════════════════════════════════════════════════════════════════════════════════╝

import React, { useState, useEffect, useCallback } from 'react';

// استيراد الثوابت والدوال المساعدة
import { colors, placeTypeColors, getColor, formatNumber, formulaTemplates, debounce } from './ColorsAndConstants';

// استيراد البيانات الافتراضية
import { defaultItemTypes, defaultPlaces, defaultWorkItems, defaultProgramming } from './States';

// استيراد دوال التخزين
import { loadAllData, saveAllData } from './LocalStorage';

// استيراد نظام Undo/Redo
import { useUndoRedo, restoreFromSnapshot } from './UndoRedo';

// استيراد مكونات التبويبات
import TabBar from './Tabs';

// استيراد الأقسام
import CalculatorSection from './CalculatorSection';
import PlacesSection from './PlacesSection';
import WorkItemsSection from './WorkItemsSection';
import AreaTypesSection from './AreaTypesSection';

// ═══════════════════════════════════════════════════════════════════════════════════
// المكون الرئيسي
// ═══════════════════════════════════════════════════════════════════════════════════
const QuantityCalculator = () => {
  // الحالات الرئيسية
  const [itemTypes, setItemTypes] = useState(defaultItemTypes);
  const [places, setPlaces] = useState(defaultPlaces);
  const [workItems, setWorkItems] = useState(defaultWorkItems);
  const [programming, setProgramming] = useState(defaultProgramming);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('calculator');
  const [isLoading, setIsLoading] = useState(true);

  // نظام Undo/Redo
  const { saveToHistory, undo, redo, canUndo, canRedo, initHistory, isRestoring } = useUndoRedo();

  // تحميل البيانات عند البدء
  useEffect(() => {
    try {
      const data = loadAllData();
      setItemTypes(data.itemTypes);
      setPlaces(data.places);
      setWorkItems(data.workItems);
      setProgramming(data.programming);
      setCategories(data.categories);
      initHistory(data);
    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
    } finally {
      setIsLoading(false);
    }
  }, [initHistory]);

  // حفظ البيانات تلقائياً
  const debouncedSave = useCallback(
    debounce((data) => {
      saveAllData(data);
      if (!isRestoring()) saveToHistory(data);
    }, 300),
    [saveToHistory, isRestoring]
  );

  useEffect(() => {
    if (!isLoading) {
      debouncedSave({ itemTypes, places, workItems, programming, categories });
    }
  }, [itemTypes, places, workItems, programming, categories, isLoading, debouncedSave]);

  // دوال Undo/Redo
  const handleUndo = useCallback(() => {
    const state = undo();
    if (state) restoreFromSnapshot(state, { setItemTypes, setPlaces, setWorkItems, setProgramming, setCategories });
  }, [undo]);

  const handleRedo = useCallback(() => {
    const state = redo();
    if (state) restoreFromSnapshot(state, { setItemTypes, setPlaces, setWorkItems, setProgramming, setCategories });
  }, [redo]);

  // اختصارات لوحة المفاتيح
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        e.shiftKey ? handleRedo() : handleUndo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // شاشة التحميل
  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'rtl' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 50, marginBottom: 20 }}>🧮</div>
          <div style={{ color: colors.text, fontSize: 18 }}>جاري التحميل...</div>
        </div>
      </div>
    );
  }

  // العرض الرئيسي
  return (
    <div style={{ minHeight: '100vh', background: colors.bg, padding: 20, fontFamily: 'system-ui, -apple-system, sans-serif', direction: 'rtl' }}>
      <style>{`
        input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
        input:focus, select:focus, textarea:focus { outline: none; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: ${colors.bg}; }
        ::-webkit-scrollbar-thumb { background: ${colors.border}; border-radius: 4px; }
      `}</style>

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* العنوان */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 50, height: 50, background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🧮</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: colors.text }}>حاسبة الكميات</div>
              <div style={{ fontSize: 13, color: colors.muted }}>حساب تكاليف أعمال البناء والتشطيبات</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleUndo} disabled={!canUndo()} style={{ width: 44, height: 44, borderRadius: 12, border: `1px solid ${colors.border}`, background: canUndo() ? colors.card : colors.bg, color: canUndo() ? colors.text : colors.muted, fontSize: 20, cursor: canUndo() ? 'pointer' : 'not-allowed', opacity: canUndo() ? 1 : 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="تراجع (Ctrl+Z)">↩️</button>
            <button onClick={handleRedo} disabled={!canRedo()} style={{ width: 44, height: 44, borderRadius: 12, border: `1px solid ${colors.border}`, background: canRedo() ? colors.card : colors.bg, color: canRedo() ? colors.text : colors.muted, fontSize: 20, cursor: canRedo() ? 'pointer' : 'not-allowed', opacity: canRedo() ? 1 : 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="إعادة (Ctrl+Shift+Z)">↪️</button>
          </div>
        </div>

        {/* التبويبات */}
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} colors={colors} />

        {/* المحتوى */}
        {activeTab === 'calculator' && (
          <CalculatorSection colors={colors} places={places} workItems={workItems} programming={programming} itemTypes={itemTypes} categories={categories} setCategories={setCategories} formatNumber={formatNumber} getColor={getColor} placeTypeColors={placeTypeColors} />
        )}
        {activeTab === 'places' && (
          <PlacesSection colors={colors} places={places} setPlaces={setPlaces} placeTypeColors={placeTypeColors} formatNumber={formatNumber} />
        )}
        {activeTab === 'workItems' && (
          <WorkItemsSection colors={colors} places={places} workItems={workItems} programming={programming} itemTypes={itemTypes} setWorkItems={setWorkItems} setProgramming={setProgramming} setPlaces={setPlaces} formatNumber={formatNumber} getColor={getColor} placeTypeColors={placeTypeColors} />
        )}
        {activeTab === 'areaTypes' && (
          <AreaTypesSection colors={colors} itemTypes={itemTypes} workItems={workItems} formulaTemplates={formulaTemplates} setItemTypes={setItemTypes} formatNumber={formatNumber} />
        )}

        {/* تذييل */}
        <div style={{ marginTop: 40, paddingTop: 20, borderTop: `1px solid ${colors.border}`, textAlign: 'center', color: colors.muted, fontSize: 12 }}>
          <div style={{ marginBottom: 8 }}>حاسبة الكميات v2.0</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
            <span>📦 {Object.keys(workItems).length} أقسام</span>
            <span>🏠 {Object.values(places).reduce((sum, pt) => sum + (pt.places?.length || 0), 0)} مكان</span>
            <span>📐 {Object.keys(itemTypes).length} أنواع قياس</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantityCalculator;
