// ╔═══════════════════════════════════════════════════════════════════════════════════╗
// ║                       حاسبة الكميات - QuantityCalculator                          ║
// ╚═══════════════════════════════════════════════════════════════════════════════════╝

import React, { useState, useEffect, useCallback } from 'react';
import { colors, placeTypeColors, getColor, formatNumber, debounce } from './ColorsAndConstants';
import { defaultItemTypes, defaultPlaces, defaultWorkItems, defaultProgramming } from './States';
import { loadAllData, saveAllData } from './LocalStorage';
import { useUndoRedo, restoreFromSnapshot } from './UndoRedo';
import TabBar from './Tabs';
import CalculatorSection from './CalculatorSection';
import PlacesSection from './PlacesSection';
import WorkItemsSection from './WorkItemsSection';
import AreaTypesSection from './AreaTypesSection';

const QuantityCalculator = () => {
  const [itemTypes, setItemTypes] = useState(defaultItemTypes);
  const [places, setPlaces] = useState(defaultPlaces);
  const [workItems, setWorkItems] = useState(defaultWorkItems);
  const [programming, setProgramming] = useState(defaultProgramming);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('calculator');
  const [isLoading, setIsLoading] = useState(true);

  const { saveToHistory, undo, redo, canUndo, canRedo, initHistory, isRestoring } = useUndoRedo();

  useEffect(() => {
    try {
      const data = loadAllData();
      setItemTypes(data.itemTypes);
      setPlaces(data.places);
      setWorkItems(data.workItems);
      setProgramming(data.programming);
      setCategories(data.categories);
      initHistory(data);
    } catch (e) { console.error('خطأ:', e); }
    finally { setIsLoading(false); }
  }, [initHistory]);

  const debouncedSave = useCallback(debounce((data) => {
    saveAllData(data);
    if (!isRestoring()) saveToHistory(data);
  }, 300), [saveToHistory, isRestoring]);

  useEffect(() => {
    if (!isLoading) debouncedSave({ itemTypes, places, workItems, programming, categories });
  }, [itemTypes, places, workItems, programming, categories, isLoading, debouncedSave]);

  const handleUndo = useCallback(() => {
    const state = undo();
    if (state) restoreFromSnapshot(state, { setItemTypes, setPlaces, setWorkItems, setProgramming, setCategories });
  }, [undo]);

  const handleRedo = useCallback(() => {
    const state = redo();
    if (state) restoreFromSnapshot(state, { setItemTypes, setPlaces, setWorkItems, setProgramming, setCategories });
  }, [redo]);

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

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'rtl' }}>
        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 50, marginBottom: 20 }}>🧮</div><div style={{ color: colors.text, fontSize: 18 }}>جاري التحميل...</div></div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, padding: 20, fontFamily: 'system-ui, -apple-system, sans-serif', direction: 'rtl' }}>
      <style>{`
        input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
        input:focus, select:focus, textarea:focus { outline: none; }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 50, height: 50, background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🧮</div>
            <div><div style={{ fontSize: 22, fontWeight: 700, color: colors.text }}>حاسبة الكميات</div><div style={{ fontSize: 13, color: colors.muted }}>حساب تكاليف أعمال البناء</div></div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleUndo} disabled={!canUndo()} style={{ width: 44, height: 44, borderRadius: 12, border: `1px solid ${colors.border}`, background: canUndo() ? colors.card : colors.bg, color: canUndo() ? colors.text : colors.muted, fontSize: 20, cursor: canUndo() ? 'pointer' : 'not-allowed', opacity: canUndo() ? 1 : 0.5 }} title="تراجع">↩️</button>
            <button onClick={handleRedo} disabled={!canRedo()} style={{ width: 44, height: 44, borderRadius: 12, border: `1px solid ${colors.border}`, background: canRedo() ? colors.card : colors.bg, color: canRedo() ? colors.text : colors.muted, fontSize: 20, cursor: canRedo() ? 'pointer' : 'not-allowed', opacity: canRedo() ? 1 : 0.5 }} title="إعادة">↪️</button>
          </div>
        </div>

        <TabBar activeTab={activeTab} onTabChange={setActiveTab} colors={colors} />

        {activeTab === 'calculator' && <CalculatorSection colors={colors} places={places} workItems={workItems} programming={programming} itemTypes={itemTypes} categories={categories} setCategories={setCategories} formatNumber={formatNumber} getColor={getColor} placeTypeColors={placeTypeColors} />}
        {activeTab === 'places' && <PlacesSection colors={colors} places={places} setPlaces={setPlaces} placeTypeColors={placeTypeColors} />}
        {activeTab === 'workItems' && <WorkItemsSection colors={colors} places={places} workItems={workItems} programming={programming} itemTypes={itemTypes} setWorkItems={setWorkItems} setProgramming={setProgramming} formatNumber={formatNumber} getColor={getColor} placeTypeColors={placeTypeColors} />}
        {activeTab === 'areaTypes' && <AreaTypesSection colors={colors} itemTypes={itemTypes} workItems={workItems} setItemTypes={setItemTypes} formatNumber={formatNumber} />}

        <div style={{ marginTop: 40, paddingTop: 20, borderTop: `1px solid ${colors.border}`, textAlign: 'center', color: colors.muted, fontSize: 12 }}>
          <div>حاسبة الكميات v2.0</div>
        </div>
      </div>
    </div>
  );
};

export default QuantityCalculator;
