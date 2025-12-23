import React, { useState, useEffect } from 'react';

const QuantityCalculator = () => {
  // ==================== البيانات الثابتة ====================
  const places = {
    dry: ['صالة','مجلس','مكتب','غرفة طعام','ممر','موزع','مخزن','غرفة ملابس','غرفة نوم 1','غرفة نوم 2','غرفة نوم 3'],
    wet: ['دورة مياه 1','دورة مياه 2','دورة مياه 3','مطبخ','غرفة غسيل'],
    outdoor: ['حوش','سطح','حديقة','ممر خارجي','موقف']
  };

  const initialMains = [
    {k:'tiles',n:'البلاط',c:1},
    {k:'paint',n:'الدهانات',c:1},
    {k:'paint-renew',n:'تجديد دهانات',c:0},
    {k:'gypsum',n:'الجبس',c:1},
    {k:'plaster',n:'اللياسة',c:0},
    {k:'construction',n:'الإنشائيات',c:0}
  ];

  const initialData = {
    tiles: {
      remove: {n:'إزالة', o:[{n:'متوسطة',e:13,c:8},{n:'كبيرة',e:20,c:12}]},
      screed: {n:'صبة', o:[{n:'شامل مواد',e:47,c:35},{n:'بدون مواد',e:20,c:14}]},
      install: {n:'تبليط', o:[{n:'كبير',e:33,c:22},{n:'صغير',e:25,c:17}]},
      baseboards: {n:'نعلات', o:[{n:'تركيب',e:13,c:8}]},
      pavement: {n:'رصيف', o:[{n:'بلدورات',e:33,c:22},{n:'بلاط',e:33,c:22}]}
    },
    paint: {
      indoor: {n:'داخلية', o:[{n:'جوتن',e:21,c:14},{n:'الجزيرة',e:20,c:13},{n:'عسيب',e:19,c:12},{n:'بدون مواد',e:12,c:8}]},
      outdoor: {n:'خارجية', o:[{n:'رشة',e:19,c:12},{n:'بروفايل جوتن',e:33,c:22},{n:'بروفايل الجزيرة',e:33,c:22}]}
    },
    'paint-renew': {
      all: {n:'تجديد', o:[{n:'إزالة',e:5,c:3},{n:'جوتن',e:16,c:10},{n:'الجزيرة',e:15,c:9}]}
    },
    gypsum: {
      install: {n:'تركيب', o:[{n:'جبسمبورد',e:60,c:40},{n:'بلدي',e:53,c:35}]},
      remove: {n:'إزالة', o:[{n:'إزالة',e:5,c:3}]}
    },
    plaster: {
      all: {n:'لياسة', o:[{n:'قدة وزاوية',e:13,c:8},{n:'ودع وقدة',e:20,c:13}]}
    },
    construction: {
      all: {n:'إنشائيات', o:[{n:'عظم+مواد',e:998,c:750},{n:'عظم فقط',e:665,c:500}]}
    }
  };

  const initialProg = {
    dry: {tiles:['remove','screed','install','baseboards'],paint:['indoor','outdoor'],'paint-renew':['all'],gypsum:['install','remove'],plaster:['all']},
    wet: {tiles:['remove','screed','install'],paint:['outdoor'],gypsum:['install'],plaster:['all']},
    outdoor: {tiles:['install','pavement'],paint:['outdoor'],plaster:['all'],construction:['all']}
  };

  // ==================== الحالة (State) ====================
  const [mains, setMains] = useState(initialMains);
  const [data, setData] = useState(initialData);
  const [prog, setProg] = useState(initialProg);
  const [currentType, setCurrentType] = useState('');
  const [selectedOpts, setSelectedOpts] = useState({});
  const [groupedItems, setGroupedItems] = useState({});
  const [currentEditKey, setCurrentEditKey] = useState(null);
  
  // حقول الإدخال
  const [selectedPlace, setSelectedPlace] = useState('');
  const [area, setArea] = useState('');
  const [dL, setDL] = useState('');
  const [dW, setDW] = useState('');
  const [dH, setDH] = useState('4');
  
  // النوافذ المنبثقة
  const [showEditModal, setShowEditModal] = useState(false);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [showProfitModal, setShowProfitModal] = useState(false);
  const [showProgModal, setShowProgModal] = useState(false);
  
  // بيانات التحرير
  const [editExec, setEditExec] = useState(0);
  const [editCont, setEditCont] = useState(0);
  const [editPlaces, setEditPlaces] = useState([]);

  // ==================== الدوال المساعدة ====================
  const fmt = (n) => n.toLocaleString('en', {minimumFractionDigits:2, maximumFractionDigits:2});

  const calcArea = () => {
    const l = parseFloat(dL) || 0;
    const w = parseFloat(dW) || 0;
    if (l > 0 && w > 0) {
      setArea((l * w).toFixed(2));
    }
  };

  useEffect(() => {
    calcArea();
  }, [dL, dW]);

  // ==================== اختيار نوع المكان ====================
  const pickType = (t) => {
    setCurrentType(t);
    setSelectedOpts({});
    setSelectedPlace('');
  };

  // ==================== تحديد/إلغاء تحديد بند ====================
  const toggleOpt = (key) => {
    setSelectedOpts(prev => {
      const newOpts = {...prev};
      if (newOpts[key]) {
        delete newOpts[key];
      } else {
        newOpts[key] = true;
      }
      return newOpts;
    });
  };

  // ==================== إضافة البنود المحددة ====================
  const addSelectedItems = () => {
    if (!currentType) { alert('اختر نوع المكان'); return; }
    if (!selectedPlace) { alert('اختر المكان'); return; }
    const areaNum = parseFloat(area);
    if (!areaNum || areaNum <= 0) { alert('أدخل المساحة'); return; }
    const keys = Object.keys(selectedOpts);
    if (!keys.length) { alert('اختر بنود'); return; }

    const l = parseFloat(dL) || 0;
    const w = parseFloat(dW) || 0;
    const h = parseFloat(dH) || 4;

    let floorFormula = '';
    let wallFormula = '';
    let wallArea = 0;

    if (l > 0 && w > 0) {
      floorFormula = `${l}×${w}=${areaNum}`;
      wallArea = 2 * (l + w) * h;
      wallFormula = `2(${l}+${w})×${h}=${wallArea.toFixed(0)}`;
    }

    const newGroupedItems = {...groupedItems};

    keys.forEach(key => {
      const [mk, ck, oi] = key.split('|');
      const m = mains.find(x => x.k === mk);
      const cat = data[mk][ck];
      const opt = cat.o[parseInt(oi)];

      const isWall = ['indoor', 'outdoor'].includes(ck) || ['paint', 'paint-renew', 'plaster', 'gypsum'].includes(mk);
      const useArea = isWall && wallArea > 0 ? wallArea : areaNum;
      const formula = isWall && wallFormula ? wallFormula : floorFormula;
      const fType = isWall ? 'wall' : 'floor';

      if (!newGroupedItems[key]) {
        newGroupedItems[key] = {
          mainName: m.n,
          catName: cat.n,
          optName: opt.n,
          execPrice: opt.e,
          contPrice: opt.c,
          places: []
        };
      }

      newGroupedItems[key].places.push({
        name: selectedPlace,
        area: useArea,
        formula: formula,
        fType: fType
      });
    });

    setGroupedItems(newGroupedItems);
    setSelectedOpts({});
    alert('✅ تمت الإضافة');
  };

  // ==================== حساب الإجماليات ====================
  const calculateTotals = () => {
    let totalCont = 0;
    let totalExec = 0;

    Object.values(groupedItems).forEach(g => {
      const totalArea = g.places.reduce((sum, p) => sum + p.area, 0);
      totalCont += totalArea * g.contPrice;
      totalExec += totalArea * g.execPrice;
    });

    const totalProfit = totalExec - totalCont;
    const pct = totalCont > 0 ? ((totalProfit / totalCont) * 100).toFixed(1) : 0;

    return { totalCont, totalExec, totalProfit, pct };
  };

  const totals = calculateTotals();

  // ==================== مسح الكل ====================
  const handleClearAll = () => {
    if (Object.keys(groupedItems).length === 0) {
      alert('لا توجد بنود للمسح');
      return;
    }
    if (window.confirm('هل تريد مسح جميع البنود؟')) {
      setGroupedItems({});
      alert('تم المسح');
    }
  };

  // ==================== فتح نافذة التحرير ====================
  const openEditModal = (key) => {
    const g = groupedItems[key];
    if (!g) return;
    
    setCurrentEditKey(key);
    setEditExec(g.execPrice);
    setEditCont(g.contPrice);
    setEditPlaces([...g.places]);
    setShowEditModal(true);
  };

  // ==================== حفظ التحرير ====================
  const saveGroupEdit = () => {
    if (!currentEditKey) return;
    
    setGroupedItems(prev => ({
      ...prev,
      [currentEditKey]: {
        ...prev[currentEditKey],
        execPrice: editExec,
        contPrice: editCont,
        places: editPlaces
      }
    }));
    
    setShowEditModal(false);
    setCurrentEditKey(null);
  };

  // ==================== حذف البند ====================
  const handleDeleteGroup = () => {
    if (!currentEditKey) return;
    if (window.confirm('هل تريد حذف هذا البند؟')) {
      setGroupedItems(prev => {
        const newItems = {...prev};
        delete newItems[currentEditKey];
        return newItems;
      });
      setShowEditModal(false);
      setCurrentEditKey(null);
      alert('تم الحذف');
    }
  };

  // ==================== إضافة مكان جديد ====================
  const addNewPlace = () => {
    setEditPlaces(prev => [...prev, {name: places.dry[0], area: 0, formula: '', fType: 'floor'}]);
  };

  // ==================== حذف مكان ====================
  const removePlace = (index) => {
    if (editPlaces.length <= 1) return;
    setEditPlaces(prev => prev.filter((_, i) => i !== index));
  };

  // ==================== تحديث مكان ====================
  const updatePlace = (index, field, value) => {
    setEditPlaces(prev => prev.map((p, i) => i === index ? {...p, [field]: field === 'area' ? parseFloat(value) || 0 : value} : p));
  };

  // ==================== الحصول على خيارات الأماكن ====================
  const getAllPlaceOptions = () => {
    const options = [];
    const labels = {dry: 'جاف', wet: 'رطب', outdoor: 'خارجي'};
    Object.entries(labels).forEach(([t, label]) => {
      options.push({label, places: places[t]});
    });
    return options;
  };

  // ==================== حساب الأرباح حسب البند ====================
  const calculateProfitByMain = () => {
    const byMain = {};
    Object.values(groupedItems).forEach(g => {
      const area = g.places.reduce((s, p) => s + p.area, 0);
      if (!byMain[g.mainName]) byMain[g.mainName] = {e: 0, c: 0};
      byMain[g.mainName].e += area * g.execPrice;
      byMain[g.mainName].c += area * g.contPrice;
    });
    return byMain;
  };

  // ==================== إضافة بند رئيسي ====================
  const addNewMainItem = () => {
    const name = window.prompt('اسم البند الرئيسي:');
    if (!name || !name.trim()) return;
    
    const key = 'main_' + Date.now();
    setMains(prev => [...prev, {k: key, n: name.trim(), c: 1}]);
    setData(prev => ({
      ...prev,
      [key]: {default: {n: 'فرعي', o: [{n: 'خيار', e: 0, c: 0}]}}
    }));
  };

  // ==================== حذف بند رئيسي ====================
  const deleteMainItem = (key) => {
    if (!window.confirm('حذف هذا البند الرئيسي؟')) return;
    
    setMains(prev => prev.filter(m => m.k !== key));
    setData(prev => {
      const newData = {...prev};
      delete newData[key];
      return newData;
    });
    setProg(prev => {
      const newProg = {...prev};
      ['dry', 'wet', 'outdoor'].forEach(t => {
        if (newProg[t] && newProg[t][key]) delete newProg[t][key];
      });
      return newProg;
    });
  };

  // ==================== إضافة تصنيف فرعي ====================
  const addNewSubItem = (mainKey) => {
    const key = 'sub_' + Date.now();
    setData(prev => ({
      ...prev,
      [mainKey]: {
        ...prev[mainKey],
        [key]: {n: 'جديد', o: [{n: 'خيار', e: 0, c: 0}]}
      }
    }));
  };

  // ==================== إضافة خيار ====================
  const addNewOption = (mainKey, catKey) => {
    setData(prev => ({
      ...prev,
      [mainKey]: {
        ...prev[mainKey],
        [catKey]: {
          ...prev[mainKey][catKey],
          o: [...prev[mainKey][catKey].o, {n: 'خيار جديد', e: 0, c: 0}]
        }
      }
    }));
  };

  // ==================== حذف خيار ====================
  const deleteOption = (mainKey, catKey, optIndex) => {
    setData(prev => ({
      ...prev,
      [mainKey]: {
        ...prev[mainKey],
        [catKey]: {
          ...prev[mainKey][catKey],
          o: prev[mainKey][catKey].o.filter((_, i) => i !== optIndex)
        }
      }
    }));
  };

  // ==================== تحديث بيانات البند ====================
  const updateItemData = (mainKey, catKey, optIndex, field, value) => {
    setData(prev => {
      const newData = {...prev};
      if (optIndex === undefined) {
        newData[mainKey][catKey].n = value;
      } else {
        if (field === 'n') newData[mainKey][catKey].o[optIndex].n = value;
        else if (field === 'e') newData[mainKey][catKey].o[optIndex].e = parseFloat(value) || 0;
        else if (field === 'c') newData[mainKey][catKey].o[optIndex].c = parseFloat(value) || 0;
      }
      return newData;
    });
  };

  // ==================== حفظ البرمجة ====================
  const saveProgData = () => {
    // يتم حفظ البرمجة من خلال الـ state مباشرة
    setShowProgModal(false);
    alert('✅ تم الحفظ');
  };

  // ==================== تحديث البرمجة ====================
  const updateProg = (type, mainKey, catKey, checked) => {
    setProg(prev => {
      const newProg = {...prev};
      
      if (catKey === null) {
        // تحديث البند الرئيسي
        if (checked) {
          if (!newProg[type][mainKey]) {
            newProg[type][mainKey] = [];
          }
        } else {
          delete newProg[type][mainKey];
        }
      } else {
        // تحديث التصنيف الفرعي
        if (!newProg[type][mainKey]) newProg[type][mainKey] = [];
        if (checked) {
          if (!newProg[type][mainKey].includes(catKey)) {
            newProg[type][mainKey] = [...newProg[type][mainKey], catKey];
          }
        } else {
          newProg[type][mainKey] = newProg[type][mainKey].filter(k => k !== catKey);
        }
      }
      
      return newProg;
    });
  };

  // ==================== عرض البنود المتاحة ====================
  const renderOptions = () => {
    const items = prog[currentType] || {};
    if (!Object.keys(items).length) {
      return <p className="text-center py-4 text-sm text-slate-400">لا توجد بنود</p>;
    }

    let num = 0;
    const options = [];

    Object.entries(items).forEach(([mk, cats]) => {
      const m = mains.find(x => x.k === mk);
      if (!m || !data[mk]) return;

      cats.forEach(ck => {
        const cat = data[mk][ck];
        if (!cat) return;

        cat.o.forEach((o, oi) => {
          num++;
          const key = `${mk}|${ck}|${oi}`;
          const isSel = selectedOpts[key];

          options.push(
            <div
              key={key}
              onClick={() => toggleOpt(key)}
              className={`opt flex justify-between items-center p-2 rounded-lg text-sm cursor-pointer transition-all ${isSel ? 'bg-green-500/20 border-green-400' : 'bg-white/5 border-white/10'}`}
              style={{border: `1px solid ${isSel ? '#4ade80' : 'rgba(255,255,255,0.1)'}`}}
            >
              <span className="text-slate-100">
                <span className="bg-blue-400 text-white px-2 py-0.5 rounded text-xs font-bold ml-2">{num}</span>
                {m.n} - {o.n}
              </span>
              <span className="text-slate-400">{o.e} ريال/م²</span>
            </div>
          );
        });
      });
    });

    return options;
  };

  // ==================== CSS Variables ====================
  const cssVars = {
    '--glass': 'rgba(255,255,255,0.05)',
    '--border': 'rgba(255,255,255,0.1)',
    '--text': '#f1f5f9',
    '--text2': '#94a3b8',
    '--blue': '#60a5fa',
    '--green': '#4ade80',
    '--cyan': '#22d3ee',
    '--amber': '#fbbf24',
    '--red': '#f87171',
    '--purple': '#c084fc'
  };

  // ==================== العرض ====================
  return (
    <div className="min-h-screen p-3" style={{background: 'linear-gradient(135deg, #0f172a, #1e1b4b, #0f172a)'}}>
      <div className="max-w-6xl mx-auto">
        {/* الشريط العلوي */}
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold mb-2 text-slate-100">حساب الكميات</h1>
          <div className="flex justify-center gap-2">
            <button onClick={() => setShowItemsModal(true)} className="px-3 py-1.5 bg-white/5 border border-white/10 backdrop-blur rounded-lg text-sm font-bold text-slate-100 hover:bg-white/10">
              📋 البنود والأسعار
            </button>
            <button onClick={() => setShowProfitModal(true)} className="px-3 py-1.5 bg-white/5 border border-white/10 backdrop-blur rounded-lg text-sm font-bold text-slate-100 hover:bg-white/10">
              📊 الأرباح
            </button>
            <button onClick={() => setShowProgModal(true)} className="px-3 py-1.5 bg-white/5 border border-white/10 backdrop-blur rounded-lg text-sm font-bold text-slate-100 hover:bg-white/10">
              ⚙️ البرمجة
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-4">
          {/* قسم الإضافة */}
          <div className="lg:col-span-4 bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-4">
            <h2 className="font-bold mb-3 text-slate-100">➕ إضافة</h2>

            {/* أزرار نوع المكان */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                {t: 'dry', icon: '🏠', label: 'جاف', color: '#60a5fa'},
                {t: 'wet', icon: '🚿', label: 'رطب', color: '#22d3ee'},
                {t: 'outdoor', icon: '🌳', label: 'خارجي', color: '#4ade80'}
              ].map(({t, icon, label, color}) => (
                <button
                  key={t}
                  onClick={() => pickType(t)}
                  className="p-2 bg-white/5 border-2 rounded-xl text-center text-slate-100 hover:bg-white/10 transition-all"
                  style={{
                    borderColor: currentType === t ? color : 'transparent',
                    background: currentType === t ? `${color}22` : 'rgba(255,255,255,0.05)'
                  }}
                >
                  <div className="text-xl">{icon}</div>
                  <div className="text-xs">{label}</div>
                </button>
              ))}
            </div>

            {/* حقول الإدخال */}
            <div className="flex gap-2 mb-3 items-center flex-wrap">
              <select
                value={selectedPlace}
                onChange={(e) => setSelectedPlace(e.target.value)}
                className="flex-1 min-w-[80px] rounded-lg p-2 text-sm bg-slate-800 text-slate-100 border border-white/10"
              >
                <option value="">المكان</option>
                {currentType && places[currentType]?.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="م²"
                className="w-14 bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-center text-slate-100"
              />
              <span className="text-slate-400">أو</span>
              <input
                type="number"
                value={dL}
                onChange={(e) => setDL(e.target.value)}
                placeholder="ط"
                className="w-11 bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-center text-slate-100"
              />
              <span className="text-slate-400">×</span>
              <input
                type="number"
                value={dW}
                onChange={(e) => setDW(e.target.value)}
                placeholder="ع"
                className="w-11 bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-center text-slate-100"
              />
              <span className="text-slate-400">×</span>
              <input
                type="number"
                value={dH}
                onChange={(e) => setDH(e.target.value)}
                className="w-11 bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-center text-slate-100"
              />
            </div>

            {/* قائمة البنود */}
            <div className="space-y-1 max-h-60 overflow-y-auto mb-3">
              {renderOptions()}
            </div>

            {/* زر الإضافة */}
            <button
              onClick={addSelectedItems}
              className="w-full py-2 rounded-xl text-white font-bold text-sm bg-blue-400 hover:bg-blue-500 transition-colors"
            >
              إضافة المحدد
            </button>
          </div>

          {/* قسم المضاف */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold text-slate-100">📝 المضاف</h2>
                <button
                  onClick={handleClearAll}
                  className="bg-red-400/20 text-red-400 px-3 py-1 rounded-lg text-sm hover:bg-red-400/30"
                >
                  🗑️ مسح الكل
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {Object.keys(groupedItems).length === 0 ? (
                  <div className="text-center py-6 bg-white/5 rounded-xl text-sm text-slate-400">
                    لا توجد بنود
                  </div>
                ) : (
                  Object.entries(groupedItems).map(([key, g]) => {
                    const totalArea = g.places.reduce((sum, p) => sum + p.area, 0);
                    const execTotal = totalArea * g.execPrice;
                    const contTotal = totalArea * g.contPrice;
                    const profit = execTotal - contTotal;

                    return (
                      <div
                        key={key}
                        onClick={() => openEditModal(key)}
                        className="bg-white/5 border border-white/10 rounded-xl p-3 cursor-pointer hover:bg-white/10 transition-all hover:-translate-y-0.5"
                      >
                        <div className="flex gap-2 mb-2 text-sm">
                          <span className="font-bold text-slate-100">{g.mainName}</span>
                          <span className="text-slate-400">›</span>
                          <span className="text-blue-400">{g.optName}</span>
                        </div>
                        <div className="flex flex-wrap mb-2">
                          {g.places.map((p, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 bg-blue-400/10 px-2 py-0.5 rounded-full text-xs text-slate-100 m-0.5"
                            >
                              {p.name}
                              {p.formula && (
                                <span
                                  className={`text-[10px] px-1 rounded ${p.fType === 'wall' ? 'bg-green-400/20 text-green-400' : 'bg-purple-400/20 text-purple-400'}`}
                                >
                                  {p.fType === 'wall' ? '🧱' : '🏠'} {p.formula}
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="bg-white/5 rounded p-1.5 text-center">
                            <div className="text-slate-400">منفذ</div>
                            <div className="font-bold text-amber-400">{fmt(execTotal)}</div>
                          </div>
                          <div className="bg-white/5 rounded p-1.5 text-center">
                            <div className="text-slate-400">مقاول</div>
                            <div className="font-bold text-cyan-400">{fmt(contTotal)}</div>
                          </div>
                          <div className="bg-white/5 rounded p-1.5 text-center">
                            <div className="text-slate-400">ربح</div>
                            <div className={`font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {fmt(profit)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* الملخص */}
            <div className="bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-4">
              <div className="grid grid-cols-4 gap-2 mb-2">
                <div className="p-2 bg-white/5 rounded-xl text-center border-2 border-cyan-400">
                  <div className="text-xs text-cyan-400">مقاول</div>
                  <div className="font-bold text-sm text-slate-100">{fmt(totals.totalCont)}</div>
                </div>
                <div className="p-2 bg-white/5 rounded-xl text-center border-2 border-amber-400">
                  <div className="text-xs text-amber-400">منفذ</div>
                  <div className="font-bold text-sm text-slate-100">{fmt(totals.totalExec)}</div>
                </div>
                <div className="p-2 bg-white/5 rounded-xl text-center border-2 border-green-400">
                  <div className="text-xs text-green-400">ربح</div>
                  <div className={`font-bold text-sm ${totals.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {fmt(totals.totalProfit)}
                  </div>
                </div>
                <div className="p-2 bg-white/5 rounded-xl text-center border-2 border-purple-400">
                  <div className="text-xs text-purple-400">نسبة</div>
                  <div className="font-bold text-sm text-purple-400">{totals.pct}%</div>
                </div>
              </div>
              <div className="flex justify-between p-3 bg-white/5 rounded-xl border-2 border-blue-400">
                <span className="font-bold text-slate-100">الإجمالي + 15%:</span>
                <span className="font-bold text-slate-100">{fmt(totals.totalExec * 1.15)} ريال</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== نافذة التحرير ==================== */}
      {showEditModal && currentEditKey && groupedItems[currentEditKey] && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900/98 border-2 border-blue-400 rounded-2xl p-5 max-w-md w-full backdrop-blur">
            <div className="flex justify-between mb-4">
              <h2 className="font-bold text-slate-100">✏️ تحرير</h2>
              <button onClick={() => setShowEditModal(false)} className="text-xl text-slate-100 hover:text-slate-300">×</button>
            </div>

            <div className="bg-white/5 rounded-lg p-2 mb-3 text-sm font-bold text-slate-100">
              {groupedItems[currentEditKey].mainName} › {groupedItems[currentEditKey].optName}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="text-xs text-amber-400">منفذ</label>
                <input
                  type="number"
                  value={editExec}
                  onChange={(e) => setEditExec(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white/5 rounded p-2 text-sm text-slate-100 border border-amber-400"
                />
              </div>
              <div>
                <label className="text-xs text-cyan-400">مقاول</label>
                <input
                  type="number"
                  value={editCont}
                  onChange={(e) => setEditCont(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white/5 rounded p-2 text-sm text-slate-100 border border-cyan-400"
                />
              </div>
            </div>

            <div className="space-y-1 mb-2">
              {editPlaces.map((p, i) => (
                <div key={i} className="flex gap-1 items-center">
                  <select
                    value={p.name}
                    onChange={(e) => updatePlace(i, 'name', e.target.value)}
                    className="flex-1 rounded p-1.5 text-sm bg-slate-800 text-slate-100 border border-white/10"
                  >
                    {getAllPlaceOptions().map(group => (
                      <optgroup key={group.label} label={group.label}>
                        {group.places.map(place => (
                          <option key={place} value={place}>{place}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={p.area}
                    onChange={(e) => updatePlace(i, 'area', e.target.value)}
                    className="w-16 bg-white/5 rounded p-1.5 text-center text-sm text-slate-100 border border-white/10"
                  />
                  {editPlaces.length > 1 && (
                    <button
                      onClick={() => removePlace(i)}
                      className="text-red-400 text-lg hover:text-red-300"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={addNewPlace}
              className="w-full py-1.5 bg-white/5 rounded text-sm text-blue-400 hover:bg-white/10 mb-4"
            >
              + مكان
            </button>

            <div className="flex justify-between">
              <button
                onClick={handleDeleteGroup}
                className="bg-red-400/20 text-red-400 px-4 py-2 rounded-lg text-sm hover:bg-red-400/30"
              >
                🗑️ حذف البند
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-white/5 rounded-lg text-sm text-slate-100 hover:bg-white/10"
                >
                  إلغاء
                </button>
                <button
                  onClick={saveGroupEdit}
                  className="px-4 py-2 bg-blue-400 rounded-lg text-sm text-white hover:bg-blue-500"
                >
                  حفظ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== نافذة البنود والأسعار ==================== */}
      {showItemsModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900/98 border-2 border-blue-400 rounded-2xl p-5 max-w-3xl w-full max-h-[85vh] overflow-y-auto backdrop-blur">
            <div className="flex justify-between mb-4">
              <h2 className="font-bold text-slate-100">📋 البنود والأسعار</h2>
              <button onClick={() => setShowItemsModal(false)} className="text-xl text-slate-100 hover:text-slate-300">×</button>
            </div>

            <button
              onClick={addNewMainItem}
              className="px-3 py-1.5 bg-blue-400 rounded-lg text-sm text-white mb-3 hover:bg-blue-500"
            >
              + بند رئيسي
            </button>

            <div className="space-y-3">
              {mains.map(m => {
                const d = data[m.k] || {};
                let num = 0;

                return (
                  <div key={m.k} className="bg-white/5 rounded-xl p-3">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-slate-100">{m.n}</span>
                      <button
                        onClick={() => deleteMainItem(m.k)}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        حذف
                      </button>
                    </div>

                    {Object.entries(d).map(([ck, cat]) => (
                      <div key={ck} className="bg-white/5 rounded-lg p-2 mb-2">
                        <input
                          type="text"
                          value={cat.n}
                          onChange={(e) => updateItemData(m.k, ck, undefined, 'n', e.target.value)}
                          className="w-full bg-white/5 rounded p-1 text-sm font-bold text-blue-400 mb-1 border border-white/10"
                        />

                        {cat.o.map((o, oi) => {
                          num++;
                          return (
                            <div key={oi} className="flex gap-1 items-center mb-1">
                              <span className="bg-blue-400 text-white px-2 py-0.5 rounded text-xs font-bold">{num}</span>
                              <input
                                type="text"
                                value={o.n}
                                onChange={(e) => updateItemData(m.k, ck, oi, 'n', e.target.value)}
                                className="flex-1 bg-white/5 rounded p-1 text-xs text-slate-100 border border-white/10"
                              />
                              <input
                                type="number"
                                value={o.e}
                                onChange={(e) => updateItemData(m.k, ck, oi, 'e', e.target.value)}
                                className="w-12 bg-white/5 rounded p-1 text-center text-xs text-amber-400 border border-amber-400"
                              />
                              <input
                                type="number"
                                value={o.c}
                                onChange={(e) => updateItemData(m.k, ck, oi, 'c', e.target.value)}
                                className="w-12 bg-white/5 rounded p-1 text-center text-xs text-cyan-400 border border-cyan-400"
                              />
                              <button
                                onClick={() => deleteOption(m.k, ck, oi)}
                                className="text-red-400 hover:text-red-300"
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}

                        <button
                          onClick={() => addNewOption(m.k, ck)}
                          className="text-xs text-blue-400 hover:text-blue-300"
                        >
                          + خيار
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={() => addNewSubItem(m.k)}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      + فرعي
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowItemsModal(false)}
                className="px-4 py-2 bg-white/5 rounded-lg text-sm text-slate-100 hover:bg-white/10"
              >
                إغلاق
              </button>
              <button
                onClick={() => { setShowItemsModal(false); alert('✅ تم الحفظ'); }}
                className="px-4 py-2 bg-blue-400 rounded-lg text-sm text-white hover:bg-blue-500"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== نافذة الأرباح ==================== */}
      {showProfitModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900/98 border-2 border-blue-400 rounded-2xl p-5 max-w-md w-full backdrop-blur">
            <div className="flex justify-between mb-4">
              <h2 className="font-bold text-slate-100">📊 الأرباح</h2>
              <button onClick={() => setShowProfitModal(false)} className="text-xl text-slate-100 hover:text-slate-300">×</button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-2 bg-white/5 rounded text-center">
                <div className="text-xs text-cyan-400">مقاول</div>
                <div className="font-bold text-cyan-400">{fmt(totals.totalCont)}</div>
              </div>
              <div className="p-2 bg-white/5 rounded text-center">
                <div className="text-xs text-amber-400">منفذ</div>
                <div className="font-bold text-amber-400">{fmt(totals.totalExec)}</div>
              </div>
              <div className="p-2 bg-white/5 rounded text-center">
                <div className="text-xs text-green-400">ربح</div>
                <div className={`font-bold ${totals.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {fmt(totals.totalProfit)}
                </div>
              </div>
              <div className="p-2 bg-white/5 rounded text-center">
                <div className="text-xs text-purple-400">نسبة</div>
                <div className="font-bold text-purple-400">{totals.pct}%</div>
              </div>
            </div>

            <div className="space-y-1 mb-3">
              {Object.entries(calculateProfitByMain()).map(([name, d]) => {
                const p = d.e - d.c;
                return (
                  <div key={name} className="flex justify-between p-2 bg-white/5 rounded text-sm">
                    <span className="text-slate-100">{name}</span>
                    <span className={p >= 0 ? 'text-green-400' : 'text-red-400'}>{fmt(p)}</span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowProfitModal(false)}
              className="w-full py-2 bg-white/5 rounded text-sm text-slate-100 hover:bg-white/10"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* ==================== نافذة البرمجة ==================== */}
      {showProgModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900/98 border-2 border-blue-400 rounded-2xl p-5 max-w-3xl w-full max-h-[85vh] overflow-y-auto backdrop-blur">
            <div className="flex justify-between mb-4">
              <h2 className="font-bold text-slate-100">⚙️ البرمجة</h2>
              <button onClick={() => setShowProgModal(false)} className="text-xl text-slate-100 hover:text-slate-300">×</button>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              {[
                {t: 'dry', label: '🏠 جاف'},
                {t: 'wet', label: '🚿 رطب'},
                {t: 'outdoor', label: '🌳 خارجي'}
              ].map(({t, label}) => (
                <div key={t} className="bg-white/5 rounded-xl p-3">
                  <h3 className="font-bold mb-2 text-sm text-slate-100">{label}</h3>

                  {mains.map(m => {
                    const d = data[m.k];
                    if (!d) return null;

                    const isOn = prog[t] && prog[t][m.k];

                    return (
                      <div key={m.k} className="mb-2">
                        <label className="flex items-center gap-2 p-1.5 bg-white/5 rounded cursor-pointer text-sm">
                          <input
                            type="checkbox"
                            checked={!!isOn}
                            onChange={(e) => updateProg(t, m.k, null, e.target.checked)}
                          />
                          <span className="font-bold text-slate-100">{m.n}</span>
                        </label>

                        {m.c === 1 && isOn && (
                          <div className="mr-4 mt-1 space-y-1">
                            {Object.keys(d).map(ck => {
                              const isChecked = prog[t][m.k] && prog[t][m.k].includes(ck);
                              return (
                                <label key={ck} className="flex items-center gap-2 text-xs cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={!!isChecked}
                                    onChange={(e) => updateProg(t, m.k, ck, e.target.checked)}
                                  />
                                  <span className="text-slate-400">{d[ck].n}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowProgModal(false)}
                className="px-4 py-2 bg-white/5 rounded-lg text-sm text-slate-100 hover:bg-white/10"
              >
                إلغاء
              </button>
              <button
                onClick={saveProgData}
                className="px-4 py-2 bg-blue-400 rounded-lg text-sm text-white hover:bg-blue-500"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuantityCalculator;
