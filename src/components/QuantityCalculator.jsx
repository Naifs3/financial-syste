import React, { useState } from 'react';
import { Calculator, ChevronDown, ChevronUp, Plus, Trash2, Layers, FileText, X, MapPin, RefreshCw, Edit3 } from 'lucide-react';

const QuantityCalculator = ({ theme, darkMode, onRefresh }) => {
  const t = theme;
  const colorKeys = t?.colorKeys || Object.keys(t?.colors || {});
  
  const [mainTab, setMainTab] = useState('calculator');
  const [showReport, setShowReport] = useState(false);
  const [placeMode, setPlaceMode] = useState('single');
  const [multiPlaces, setMultiPlaces] = useState([]);

  const [workItems, setWorkItems] = useState({
    // 1. البلاط (9 بنود)
    tiles: { name: 'البلاط', icon: '🔲', items: [
      { id: 't1', name: 'إزالة بلاط (كمية متوسطة)', desc: 'إزالة البلاط القديم بدون حاوية', exec: 13, cont: 10, type: 'floor' },
      { id: 't2', name: 'إزالة بلاط (كمية كبيرة)', desc: 'إزالة البلاط القديم بدون حاوية', exec: 20, cont: 15, type: 'floor' },
      { id: 't3', name: 'صبة ميزانية (شامل المواد)', desc: 'صبة أرضية بدون سباكة أو كهرباء - شامل المواد', exec: 47, cont: 35, type: 'floor' },
      { id: 't4', name: 'صبة ميزانية (بدون مواد)', desc: 'صبة أرضية بدون سباكة أو كهرباء - بدون مواد', exec: 20, cont: 15, type: 'floor' },
      { id: 't5', name: 'تركيب بلاط (أكبر من 120مم)', desc: 'تركيب بالغراء أو الخلطة الأسمنتية - بدون مواد', exec: 33, cont: 25, type: 'floor' },
      { id: 't6', name: 'تركيب بلاط (أصغر من 120مم)', desc: 'تركيب بالغراء أو الخلطة الأسمنتية - بدون مواد', exec: 25, cont: 19, type: 'floor' },
      { id: 't7', name: 'تركيب نعلات', desc: 'نعلات داخلية أو خارجية بورسلان أو سيراميك - بدون مواد', exec: 13, cont: 10, type: 'wall' },
      { id: 't8', name: 'تركيب بلدورات الرصيف', desc: 'بدون أعمال الري أو السباكة أو الكهرباء - بدون مواد', exec: 33, cont: 25, type: 'floor' },
      { id: 't9', name: 'تركيب بلاط الرصيف', desc: 'بدون أعمال الري أو السباكة أو الكهرباء - بدون مواد', exec: 33, cont: 25, type: 'floor' }
    ]},
    // 2. الرخام (5 بنود)
    marble: { name: 'الرخام', icon: '🪨', items: [
      { id: 'm1', name: 'تركيب نعلات درج', desc: 'رخام نعلات الدرج - بدون مواد', exec: 13, cont: 10, type: 'wall' },
      { id: 'm2', name: 'تركيب بسطات درج', desc: 'رخام بسطات الدرج', exec: 33, cont: 25, type: 'floor' },
      { id: 'm3', name: 'تركيب رخام (مقاسات كبيرة)', desc: 'تركيب رخام مقاسات كبيرة - بدون مواد', exec: 100, cont: 75, type: 'floor' },
      { id: 'm4', name: 'تركيب رخام (مقاسات صغيرة)', desc: 'تركيب رخام مقاسات صغيرة - بدون مواد', exec: 60, cont: 45, type: 'floor' },
      { id: 'm5', name: 'تركيب رخام درج', desc: 'تركيب رخام الدرج - بدون مواد', exec: 67, cont: 50, type: 'floor' }
    ]},
    // 3. الدهانات (12 بند)
    paint: { name: 'الدهانات', icon: '🎨', items: [
      { id: 'p1', name: 'دهان داخلي (جوتن)', desc: 'مع المواد - طبقتين معجون + طبقتين دهان', exec: 21, cont: 16, type: 'wall' },
      { id: 'p2', name: 'دهان داخلي (الجزيرة)', desc: 'مع المواد - طبقتين معجون + طبقتين دهان', exec: 20, cont: 15, type: 'wall' },
      { id: 'p3', name: 'دهان داخلي (عسيب)', desc: 'مع المواد - طبقتين معجون + طبقتين دهان', exec: 19, cont: 14, type: 'wall' },
      { id: 'p4', name: 'دهان داخلي (بدون مواد)', desc: 'بدون مواد - طبقتين معجون + طبقتين دهان', exec: 12, cont: 9, type: 'wall' },
      { id: 'p5', name: 'زيادة طبقة معجون ثالثة', desc: 'طبقة إضافية - بدون مواد', exec: 3, cont: 2, type: 'wall' },
      { id: 'p6', name: 'دهان خارجي رشة (مع مواد)', desc: 'رشة من جميع الشركات - مع المواد', exec: 19, cont: 14, type: 'wall' },
      { id: 'p7', name: 'دهان خارجي بروفايل (جوتن)', desc: 'مع المواد - طبقتين معجون + طبقتين دهان', exec: 33, cont: 25, type: 'wall' },
      { id: 'p8', name: 'دهان خارجي بروفايل (الجزيرة)', desc: 'مع المواد - طبقتين معجون + طبقتين دهان', exec: 33, cont: 25, type: 'wall' },
      { id: 'p9', name: 'دهان خارجي بروفايل (عسيب)', desc: 'مع المواد - طبقتين معجون + طبقتين دهان', exec: 29, cont: 22, type: 'wall' },
      { id: 'p10', name: 'دهان خارجي (بدون مواد)', desc: 'دهان فقط - بدون مواد', exec: 11, cont: 8, type: 'wall' },
      { id: 'p11', name: 'دهان خارجي رشة (بدون مواد)', desc: 'رشة - بدون مواد', exec: 8, cont: 6, type: 'wall' },
      { id: 'p12', name: 'دهان خارجي بروفايل (بدون مواد)', desc: 'بروفايل - بدون مواد', exec: 7, cont: 5, type: 'wall' }
    ]},
    // 4. تجديد الدهانات (5 بنود)
    paintRenew: { name: 'تجديد الدهانات', icon: '🔄', items: [
      { id: 'rp1', name: 'إزالة الدهانات', desc: 'إزالة الدهانات الداخلية والخارجية', exec: 5, cont: 4, type: 'wall' },
      { id: 'rp2', name: 'تجديد دهان (جوتن)', desc: 'تجديد داخلي أو خارجي - مع المواد', exec: 16, cont: 12, type: 'wall' },
      { id: 'rp3', name: 'تجديد دهان (الجزيرة)', desc: 'تجديد داخلي أو خارجي - مع المواد', exec: 15, cont: 11, type: 'wall' },
      { id: 'rp4', name: 'تجديد دهان (عسيب)', desc: 'تجديد داخلي أو خارجي - مع المواد', exec: 13, cont: 10, type: 'wall' },
      { id: 'rp5', name: 'تجديد دهان (بدون مواد)', desc: 'دهان فقط - بدون مواد', exec: 7, cont: 5, type: 'wall' }
    ]},
    // 5. دهانات الجبسمبورد (4 بنود)
    gypsumBoardPaint: { name: 'دهانات الجبسمبورد', icon: '✨', items: [
      { id: 'gb1', name: 'دهان جبسمبورد (جوتن)', desc: 'مع المواد من شركة جوتن', exec: 21, cont: 16, type: 'ceiling' },
      { id: 'gb2', name: 'دهان جبسمبورد (الجزيرة)', desc: 'مع المواد من شركة الجزيرة', exec: 20, cont: 15, type: 'ceiling' },
      { id: 'gb3', name: 'دهان جبسمبورد (عسيب)', desc: 'مع المواد من شركة عسيب', exec: 19, cont: 14, type: 'ceiling' },
      { id: 'gb4', name: 'دهان جبسمبورد (بدون مواد)', desc: 'بدون مواد', exec: 16, cont: 12, type: 'ceiling' }
    ]},
    // 6. دهانات الجبس البلدي (4 بنود)
    localGypsumPaint: { name: 'دهانات الجبس البلدي', icon: '🏺', items: [
      { id: 'gp1', name: 'دهان جبس بلدي (جوتن)', desc: 'مع المواد من شركة جوتن', exec: 17, cont: 13, type: 'ceiling' },
      { id: 'gp2', name: 'دهان جبس بلدي (الجزيرة)', desc: 'مع المواد من شركة الجزيرة', exec: 17, cont: 13, type: 'ceiling' },
      { id: 'gp3', name: 'دهان جبس بلدي (عسيب)', desc: 'مع المواد من شركة عسيب', exec: 15, cont: 11, type: 'ceiling' },
      { id: 'gp4', name: 'دهان جبس بلدي (بدون مواد)', desc: 'بدون مواد', exec: 9, cont: 7, type: 'ceiling' }
    ]},
    // 7. الجبس (5 بنود)
    gypsum: { name: 'الجبس', icon: '🏗️', items: [
      { id: 'g1', name: 'تركيب جبسمبورد', desc: 'تركيب ألواح جبسمبورد', exec: 60, cont: 45, type: 'ceiling' },
      { id: 'g2', name: 'تركيب واجهات جبسمبورد', desc: 'تركيب واجهات وديكورات جبسمبورد', exec: 120, cont: 90, type: 'wall' },
      { id: 'g3', name: 'تركيب جبس بلدي', desc: 'تركيب جبس بلدي للأسقف', exec: 53, cont: 40, type: 'ceiling' },
      { id: 'g4', name: 'تركيب واجهات جبس بلدي', desc: 'تركيب واجهات وديكورات جبس بلدي', exec: 120, cont: 90, type: 'wall' },
      { id: 'g5', name: 'إزالة الجبس القديم', desc: 'إزالة الجبس القديم - بدون حاوية', exec: 5, cont: 4, type: 'ceiling' }
    ]},
    // 8. اللياسة (3 بنود)
    plaster: { name: 'اللياسة', icon: '🧱', items: [
      { id: 'l1', name: 'لياسة قدة وزاوية', desc: 'مع تجهيز السطح وإزالة الأجزاء التالفة - سماكة لا تزيد عن 2 سم - بدون مواد', exec: 13, cont: 10, type: 'wall' },
      { id: 'l2', name: 'لياسة ودع وقدة زاوية', desc: 'مع تجهيز السطح وإزالة الأجزاء التالفة - سماكة لا تزيد عن 2 سم - بدون مواد', exec: 20, cont: 15, type: 'wall' },
      { id: 'l3', name: 'مواد اللياسة', desc: 'مواد اللياسة فقط - بدون عمالة', exec: 19, cont: 14, type: 'wall' }
    ]},
    // 9. العظم (3 بنود)
    structure: { name: 'العظم', icon: '🏛️', items: [
      { id: 'b1', name: 'أعمال عظم (بالمواد)', desc: 'أعمال العظم الإنشائية شاملة المواد', exec: 998, cont: 750, type: 'floor' },
      { id: 'b2', name: 'أعمال عظم (بدون مواد)', desc: 'أعمال العظم الإنشائية بدون مواد', exec: 665, cont: 500, type: 'floor' },
      { id: 'b3', name: 'إنشاءات متفرقة', desc: 'أعمال إنشائية متفرقة', exec: 333, cont: 250, type: 'floor' }
    ]}
  });

  const [places, setPlaces] = useState({ 
    dry: { name: 'جاف', icon: '🏠', enabled: true, places: ['صالة', 'مجلس', 'غرفة نوم', 'ممر'] }, 
    wet: { name: 'رطب', icon: '🚿', enabled: true, places: ['مطبخ', 'دورة مياه', 'غسيل'] }, 
    outdoor: { name: 'خارجي', icon: '🌳', enabled: true, places: ['حوش', 'سطح', 'موقف'] } 
  });
  
  // البرمجة: أي قسم وأي بند يظهر في أي نوع مكان
  const [programming, setProgramming] = useState({ 
    dry: { 
      tiles: { enabled: true, items: ['t1', 't2', 't3', 't4', 't5', 't6', 't7'] },
      marble: { enabled: true, items: ['m1', 'm2', 'm3', 'm4', 'm5'] },
      paint: { enabled: true, items: ['p1', 'p2', 'p3', 'p4', 'p5'] },
      paintRenew: { enabled: true, items: ['rp1', 'rp2', 'rp3', 'rp4', 'rp5'] },
      gypsumBoardPaint: { enabled: true, items: ['gb1', 'gb2', 'gb3', 'gb4'] },
      localGypsumPaint: { enabled: true, items: ['gp1', 'gp2', 'gp3', 'gp4'] },
      gypsum: { enabled: true, items: ['g1', 'g2', 'g3', 'g4', 'g5'] },
      plaster: { enabled: true, items: ['l1', 'l2', 'l3'] },
      structure: { enabled: true, items: ['b1', 'b2', 'b3'] }
    }, 
    wet: { 
      tiles: { enabled: true, items: ['t1', 't2', 't3', 't4', 't5', 't6', 't7'] },
      marble: { enabled: true, items: ['m1', 'm2', 'm3', 'm4', 'm5'] },
      paint: { enabled: true, items: ['p1', 'p2', 'p3', 'p4', 'p5'] },
      paintRenew: { enabled: true, items: ['rp1', 'rp2', 'rp3', 'rp4', 'rp5'] },
      gypsumBoardPaint: { enabled: true, items: ['gb1', 'gb2', 'gb3', 'gb4'] },
      localGypsumPaint: { enabled: true, items: ['gp1', 'gp2', 'gp3', 'gp4'] },
      gypsum: { enabled: true, items: ['g1', 'g2', 'g3', 'g4', 'g5'] },
      plaster: { enabled: true, items: ['l1', 'l2', 'l3'] },
      structure: { enabled: true, items: ['b1', 'b2', 'b3'] }
    }, 
    outdoor: { 
      tiles: { enabled: true, items: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9'] },
      marble: { enabled: true, items: ['m1', 'm2', 'm3', 'm4', 'm5'] },
      paint: { enabled: true, items: ['p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12'] },
      paintRenew: { enabled: true, items: ['rp1', 'rp2', 'rp3', 'rp4', 'rp5'] },
      gypsumBoardPaint: { enabled: false, items: [] },
      localGypsumPaint: { enabled: false, items: [] },
      gypsum: { enabled: false, items: [] },
      plaster: { enabled: true, items: ['l1', 'l2', 'l3'] },
      structure: { enabled: true, items: ['b1', 'b2', 'b3'] }
    } 
  });
  
  const [programmingTab, setProgrammingTab] = useState('dry');
  const [programmingSection, setProgrammingSection] = useState('places'); // places أو items
  const [editingPlaceType, setEditingPlaceType] = useState(null);

  const [selectedPlaceType, setSelectedPlaceType] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [addedItems, setAddedItems] = useState({});
  const [length, setLength] = useState(4);
  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState(4);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [reportData, setReportData] = useState({ companyName: 'ركائز الأولى', headerTitle: 'تقدير تكلفة', projectTitle: 'مشروع ترميم', vatRate: 15, footerEmail: 'info@company.com' });

  // دوال تحرير البنود
  const deleteWorkItem = (catKey, itemId) => {
    setWorkItems(prev => ({ ...prev, [catKey]: { ...prev[catKey], items: prev[catKey].items.filter(item => item.id !== itemId) } }));
    // إزالة البند من البرمجة في جميع أنواع المكان
    setProgramming(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(placeType => {
        if (updated[placeType]?.[catKey]) {
          updated[placeType] = {
            ...updated[placeType],
            [catKey]: {
              ...updated[placeType][catKey],
              items: (updated[placeType][catKey]?.items || []).filter(id => id !== itemId)
            }
          };
        }
      });
      return updated;
    });
  };

  const addNewWorkItem = (catKey) => {
    const newId = catKey.charAt(0) + Date.now();
    const newItem = { id: newId, name: 'بند جديد', desc: 'وصف البند', exec: 0, cont: 0, type: 'floor' };
    setWorkItems(prev => ({ ...prev, [catKey]: { ...prev[catKey], items: [...prev[catKey].items, newItem] } }));
    // إضافة البند للبرمجة في جميع أنواع المكان التي بها القسم مفعل
    setProgramming(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(placeType => {
        if (updated[placeType]?.[catKey]?.enabled) {
          updated[placeType] = {
            ...updated[placeType],
            [catKey]: {
              ...updated[placeType][catKey],
              items: [...(updated[placeType][catKey]?.items || []), newId]
            }
          };
        }
      });
      return updated;
    });
    setEditingItem({ catKey, item: newItem });
  };

  const updateCategoryName = (catKey, newName) => {
    setWorkItems(prev => ({ ...prev, [catKey]: { ...prev[catKey], name: newName } }));
  };

  const updateCategoryIcon = (catKey, newIcon) => {
    setWorkItems(prev => ({ ...prev, [catKey]: { ...prev[catKey], icon: newIcon } }));
  };

  const addNewCategory = () => {
    const newKey = 'cat_' + Date.now();
    setWorkItems(prev => ({
      ...prev,
      [newKey]: { name: 'قسم جديد', icon: '📦', items: [] }
    }));
    // إضافة القسم للبرمجة في جميع أنواع المكان
    setProgramming(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(placeType => {
        updated[placeType] = {
          ...updated[placeType],
          [newKey]: { enabled: false, items: [] }
        };
      });
      return updated;
    });
    // فتح نافذة التحرير للقسم الجديد
    setEditingCategory({ catKey: newKey, name: 'قسم جديد', icon: '📦', isNew: true });
  };

  const deleteCategory = (catKey) => {
    setWorkItems(prev => {
      const newItems = { ...prev };
      delete newItems[catKey];
      return newItems;
    });
    // إزالة القسم من البرمجة في جميع أنواع المكان
    setProgramming(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(placeType => {
        if (updated[placeType]?.[catKey]) {
          const { [catKey]: removed, ...rest } = updated[placeType];
          updated[placeType] = rest;
        }
      });
      return updated;
    });
    setEditingCategory(null);
  };

  // دوال التحكم في البرمجة
  const togglePlaceType = (placeType) => {
    setPlaces(prev => ({
      ...prev,
      [placeType]: { ...prev[placeType], enabled: !prev[placeType].enabled }
    }));
  };

  const toggleCategoryInPlace = (placeType, catKey) => {
    setProgramming(prev => ({
      ...prev,
      [placeType]: {
        ...prev[placeType],
        [catKey]: { 
          ...prev[placeType]?.[catKey],
          enabled: !prev[placeType]?.[catKey]?.enabled 
        }
      }
    }));
  };

  const toggleItemInPlace = (placeType, catKey, itemId) => {
    setProgramming(prev => {
      const currentItems = prev[placeType]?.[catKey]?.items || [];
      const newItems = currentItems.includes(itemId) 
        ? currentItems.filter(id => id !== itemId)
        : [...currentItems, itemId];
      return {
        ...prev,
        [placeType]: {
          ...prev[placeType],
          [catKey]: { 
            ...prev[placeType]?.[catKey],
            items: newItems 
          }
        }
      };
    });
  };

  const isItemEnabledInPlace = (placeType, catKey, itemId) => {
    return programming[placeType]?.[catKey]?.items?.includes(itemId) || false;
  };

  const isCategoryEnabledInPlace = (placeType, catKey) => {
    return programming[placeType]?.[catKey]?.enabled || false;
  };

  // دوال إدارة أنواع المكان
  const addNewPlaceType = () => {
    const newKey = 'place_' + Date.now();
    setPlaces(prev => ({
      ...prev,
      [newKey]: { name: 'نوع جديد', icon: '🏢', enabled: true, places: ['مكان 1'] }
    }));
    // إضافة البرمجة للنوع الجديد
    setProgramming(prev => {
      const newProgramming = { ...prev, [newKey]: {} };
      Object.keys(workItems).forEach(catKey => {
        newProgramming[newKey][catKey] = { enabled: false, items: [] };
      });
      return newProgramming;
    });
    setEditingPlaceType({ key: newKey, name: 'نوع جديد', icon: '🏢', places: ['مكان 1'], isNew: true });
  };

  const updatePlaceType = (key, updates) => {
    setPlaces(prev => ({
      ...prev,
      [key]: { ...prev[key], ...updates }
    }));
  };

  const deletePlaceType = (key) => {
    setPlaces(prev => {
      const newPlaces = { ...prev };
      delete newPlaces[key];
      return newPlaces;
    });
    setProgramming(prev => {
      const newProgramming = { ...prev };
      delete newProgramming[key];
      return newProgramming;
    });
    setEditingPlaceType(null);
    // إذا كان التبويب المحذوف هو المحدد، انتقل لأول تبويب
    if (programmingTab === key) {
      const remainingKeys = Object.keys(places).filter(k => k !== key);
      if (remainingKeys.length > 0) {
        setProgrammingTab(remainingKeys[0]);
      }
    }
  };

  const addPlaceToType = (typeKey, placeName) => {
    setPlaces(prev => ({
      ...prev,
      [typeKey]: { 
        ...prev[typeKey], 
        places: [...prev[typeKey].places, placeName] 
      }
    }));
  };

  const removePlaceFromType = (typeKey, placeIndex) => {
    setPlaces(prev => ({
      ...prev,
      [typeKey]: { 
        ...prev[typeKey], 
        places: prev[typeKey].places.filter((_, i) => i !== placeIndex) 
      }
    }));
  };

  const updatePlaceInType = (typeKey, placeIndex, newName) => {
    setPlaces(prev => ({
      ...prev,
      [typeKey]: { 
        ...prev[typeKey], 
        places: prev[typeKey].places.map((p, i) => i === placeIndex ? newName : p) 
      }
    }));
  };

  const formatNum = (n) => Number(n).toLocaleString('en-US');
  const calcFloorArea = () => length * width;
  const calcWallArea = () => 2 * (length + width) * height;
  const getArea = () => calcFloorArea();
  const getWallArea = () => calcWallArea();
  const handleInputFocus = (e) => e.target.select();
  const adjust = (setter, value, delta) => setter(Math.max(0, +(value + delta).toFixed(1)));
  const toggleItem = (id) => setSelectedItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleCategory = (catKey) => setSelectedCategory(selectedCategory === catKey ? '' : catKey);

  const getCategoryColor = (index) => {
    const color = t?.colors?.[colorKeys[index % colorKeys.length]] || t?.colors?.[colorKeys[0]];
    return color || { main: t?.button?.primary, gradient: t?.button?.gradient };
  };

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

  // الأنماط
  const noSpinner = { MozAppearance: 'textfield', WebkitAppearance: 'none', appearance: 'none' };
  const cardStyle = { background: t?.bg?.secondary, borderRadius: 12, border: `1px solid ${t?.border?.primary}`, padding: 20, marginBottom: 16 };
  const btnStyle = (active) => ({ padding: '10px 20px', borderRadius: 10, border: active ? 'none' : `1px solid ${t?.border?.primary}`, background: active ? t?.button?.gradient : 'transparent', color: active ? '#fff' : t?.text?.muted, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', transition: 'all 0.2s' });
  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${t?.border?.primary}`, background: t?.bg?.tertiary, color: t?.text?.primary, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', ...noSpinner };
  const selectStyle = { ...inputStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'left 12px center', paddingLeft: 40, cursor: 'pointer' };

  const DimensionInput = ({ label, value, onChange }) => (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      padding: '12px 16px', 
      background: t?.bg?.secondary, 
      borderRadius: 10, 
      border: `1px solid ${t?.border?.primary}` 
    }}>
      <div style={{ fontSize: 14, color: t?.text?.primary, fontWeight: 600 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button 
          onClick={() => adjust(onChange, value, -0.5)} 
          style={{ 
            width: 44, 
            height: 44, 
            borderRadius: 10, 
            border: 'none', 
            background: t?.button?.gradient, 
            color: '#fff', 
            fontSize: 22, 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontFamily: 'inherit',
            transition: 'all 0.2s',
            boxShadow: `0 2px 8px ${t?.button?.primary}30`
          }}
        >−</button>
        <div style={{ display: 'flex', alignItems: 'baseline', minWidth: 70, justifyContent: 'center' }}>
          <input 
            type="number" 
            value={value} 
            onFocus={handleInputFocus} 
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)} 
            style={{ 
              width: 50, 
              background: 'transparent', 
              border: 'none', 
              color: t?.text?.primary, 
              fontSize: 28, 
              fontWeight: 700, 
              textAlign: 'center', 
              outline: 'none',
              fontFamily: 'inherit',
              ...noSpinner 
            }} 
          />
          <span style={{ fontSize: 14, color: t?.text?.muted, marginRight: 2 }}>م</span>
        </div>
        <button 
          onClick={() => adjust(onChange, value, 0.5)} 
          style={{ 
            width: 44, 
            height: 44, 
            borderRadius: 10, 
            border: 'none', 
            background: t?.button?.gradient, 
            color: '#fff', 
            fontSize: 22, 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontFamily: 'inherit',
            transition: 'all 0.2s',
            boxShadow: `0 2px 8px ${t?.button?.primary}30`
          }}
        >+</button>
      </div>
    </div>
  );

  const EditableText = ({ value, onChange, style = {} }) => { 
    const [focused, setFocused] = useState(false); 
    return <input type="text" value={value} onChange={(e) => onChange(e.target.value)} onFocus={(e) => { setFocused(true); e.target.select(); }} onBlur={() => setFocused(false)} style={{ ...style, border: 'none', borderBottom: focused ? `2px solid ${t?.button?.primary}` : '1px solid transparent', background: focused ? '#fffef0' : 'transparent', outline: 'none', fontFamily: 'inherit', padding: '2px 4px', borderRadius: 2, minWidth: 50 }} />; 
  };

  return (
    <div style={{ padding: '24px 0', paddingBottom: 100 }}>
      <style>{`
        input, textarea, select { font-family: inherit; } 
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; } 
        input[type=number] { -moz-appearance: textfield; appearance: none; }
        .work-items-scroll::-webkit-scrollbar { width: 6px; }
        .work-items-scroll::-webkit-scrollbar-track { background: ${t?.bg?.tertiary}; border-radius: 10px; }
        .work-items-scroll::-webkit-scrollbar-thumb { background: ${t?.button?.primary}; border-radius: 10px; }
        .work-items-scroll { scrollbar-width: thin; scrollbar-color: ${t?.button?.primary} ${t?.bg?.tertiary}; }
        button { transition: all 0.2s; }
        button:hover { opacity: 0.9; }
        button:active { transform: scale(0.97); }
      `}</style>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: t?.text?.primary, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Calculator size={28} />
            حاسبة الكميات
          </h2>
          <p style={{ fontSize: 14, color: t?.text?.muted, marginTop: 4 }}>حساب تكاليف البنود والمساحات</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {onRefresh && <button onClick={onRefresh} style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${t?.border?.primary}`, background: t?.bg?.secondary, color: t?.text?.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RefreshCw size={18} /></button>}
        </div>
      </div>

      {/* Tabs */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setMainTab('calculator')} style={{ ...btnStyle(mainTab === 'calculator'), flex: 1 }}><Calculator size={18} /> الحاسبة</button>
          <button onClick={() => setMainTab('items')} style={{ ...btnStyle(mainTab === 'items'), flex: 1 }}><Layers size={18} /> البنود والبرمجة</button>
        </div>
      </div>

      {mainTab === 'calculator' && (
        <div>
          <div style={cardStyle}>
            {/* نوع المكان */}
            <div style={{ fontSize: 14, marginBottom: 12, fontWeight: 600, color: t?.text?.secondary }}>📍 نوع المكان</div>
            <div style={{ background: t?.bg?.tertiary, borderRadius: 10, border: `1px solid ${t?.border?.primary}`, padding: 12, marginBottom: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {Object.entries(places).filter(([_, p]) => p.enabled).map(([key, place], idx) => {
                  const color = getCategoryColor(idx);
                  const isSelected = selectedPlaceType === key;
                  return (
                    <div key={key} onClick={() => { setSelectedPlaceType(key); setSelectedPlace(''); setSelectedItems([]); setSelectedCategory(''); }} 
                      style={{ padding: '14px 10px', borderRadius: 10, border: isSelected ? `2px solid ${color.main}` : `1px solid ${t?.border?.primary}`, background: isSelected ? `${color.main}15` : t?.bg?.secondary, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                      <div style={{ fontSize: 26, marginBottom: 6 }}>{place.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: isSelected ? color.main : t?.text?.primary }}>{place.name}</div>
                      <div style={{ fontSize: 11, color: t?.text?.muted, marginTop: 4 }}>{place.places.length} مكان</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedPlaceType && (
              <>
                {/* وضع الإضافة */}
                <div style={{ fontSize: 14, marginBottom: 12, fontWeight: 600, color: t?.text?.secondary }}>🏷️ وضع الإضافة</div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                  <button onClick={() => { setPlaceMode('single'); setMultiPlaces([]); }} style={{ ...btnStyle(placeMode === 'single'), flex: 1 }}>مكان منفرد</button>
                  <button onClick={() => { setPlaceMode('multi'); setSelectedPlace(''); }} style={{ ...btnStyle(placeMode === 'multi'), flex: 1 }}>أماكن متعددة</button>
                </div>

                {/* المكان */}
                <div style={{ fontSize: 14, marginBottom: 12, fontWeight: 600, color: t?.text?.secondary }}>🏠 المكان</div>
                <div style={{ background: t?.bg?.tertiary, borderRadius: 10, padding: 16, marginBottom: 20, border: `1px solid ${t?.border?.primary}` }}>
                  <select value={selectedPlace} onChange={(e) => setSelectedPlace(e.target.value)} style={{ ...selectStyle, marginBottom: selectedPlace ? 16 : 0 }}>
                    <option value="">اختر المكان</option>
                    {places[selectedPlaceType]?.places.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  
                  {selectedPlace && (
                    <>
                      <div style={{ fontSize: 13, marginBottom: 12, fontWeight: 600, color: t?.text?.muted }}>📐 الأبعاد</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                        <DimensionInput label="الطول" value={length} onChange={setLength} />
                        <DimensionInput label="العرض" value={width} onChange={setWidth} />
                        <DimensionInput label="الارتفاع" value={height} onChange={setHeight} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div style={{ textAlign: 'center', padding: 16, background: t?.bg?.tertiary, borderRadius: 10, border: `1px solid ${t?.border?.primary}` }}>
                          <div style={{ fontSize: 12, color: t?.text?.muted, marginBottom: 6 }}>مساحة الأرضية</div>
                          <div style={{ fontSize: 11, color: t?.text?.muted, marginBottom: 8, fontFamily: 'monospace', background: t?.bg?.secondary, padding: '4px 8px', borderRadius: 6, display: 'inline-block' }}>
                            {formatNum(length)} × {formatNum(width)}
                          </div>
                          <div style={{ fontSize: 28, fontWeight: 700, color: t?.status?.success?.text, display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4 }}>
                            {formatNum(calcFloorArea())}
                            <span style={{ fontSize: 14, color: t?.text?.muted }}>م²</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'center', padding: 16, background: t?.bg?.tertiary, borderRadius: 10, border: `1px solid ${t?.border?.primary}` }}>
                          <div style={{ fontSize: 12, color: t?.text?.muted, marginBottom: 6 }}>مساحة الجدران</div>
                          <div style={{ fontSize: 11, color: t?.text?.muted, marginBottom: 8, fontFamily: 'monospace', background: t?.bg?.secondary, padding: '4px 8px', borderRadius: 6, display: 'inline-block' }}>
                            2×({formatNum(length)}+{formatNum(width)})×{formatNum(height)}
                          </div>
                          <div style={{ fontSize: 28, fontWeight: 700, color: t?.status?.info?.text, display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4 }}>
                            {formatNum(calcWallArea())}
                            <span style={{ fontSize: 14, color: t?.text?.muted }}>م²</span>
                          </div>
                        </div>
                      </div>
                      {placeMode === 'multi' && (
                        <button onClick={addMultiPlace} disabled={!selectedPlace || getArea() <= 0} style={{ width: '100%', padding: 12, borderRadius: 10, border: 'none', marginTop: 16, background: selectedPlace && getArea() > 0 ? t?.status?.success?.text : t?.bg?.tertiary, color: selectedPlace && getArea() > 0 ? '#fff' : t?.text?.muted, fontWeight: 600, fontSize: 14, cursor: selectedPlace && getArea() > 0 ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>➕ إضافة للقائمة</button>
                      )}
                    </>
                  )}
                </div>
                
                {placeMode === 'multi' && multiPlaces.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 14, marginBottom: 12, fontWeight: 600, color: t?.text?.secondary }}>📍 الأماكن المختارة ({multiPlaces.length})</div>
                    {multiPlaces.map((mp, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: t?.bg?.tertiary, borderRadius: 10, marginBottom: 8, border: `1px solid ${t?.border?.primary}` }}>
                        <MapPin size={18} color={t?.button?.primary} />
                        <div style={{ flex: 1 }}>
                          <span style={{ fontWeight: 600, color: t?.text?.primary }}>{mp.place}</span>
                          <div style={{ fontSize: 11, color: t?.text?.muted }}>{formatNum(mp.length)}×{formatNum(mp.width)} = {formatNum(mp.area)} م²</div>
                        </div>
                        <button onClick={() => removeMultiPlace(idx)} style={{ background: t?.status?.danger?.bg, border: 'none', color: t?.status?.danger?.text, padding: '6px', borderRadius: 6, cursor: 'pointer' }}><X size={14} /></button>
                      </div>
                    ))}
                    <div style={{ padding: 10, background: `${t?.button?.primary}15`, borderRadius: 8, textAlign: 'center', marginTop: 8 }}>
                      <span style={{ color: t?.button?.primary, fontWeight: 600 }}>المجموع: {formatNum(multiPlaces.reduce((sum, mp) => sum + mp.area, 0))} م²</span>
                    </div>
                  </div>
                )}

                {/* بنود العمل */}
                {((placeMode === 'single' && selectedPlace && getArea() > 0) || (placeMode === 'multi' && multiPlaces.length > 0)) && (
                  <>
                    <div style={{ fontSize: 14, marginBottom: 12, fontWeight: 600, color: t?.text?.secondary }}>🔧 بنود العمل</div>
                    <div style={{ background: t?.bg?.tertiary, borderRadius: 10, border: `1px solid ${t?.border?.primary}`, padding: 12, marginBottom: 16 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                        {Object.entries(workItems).filter(([ck]) => isCategoryEnabledInPlace(selectedPlaceType, ck)).map(([key, cat], idx) => {
                          const color = getCategoryColor(idx);
                          const isSelected = selectedCategory === key;
                          const enabledItemsCount = cat.items.filter(i => isItemEnabledInPlace(selectedPlaceType, key, i.id)).length;
                          return (
                            <div key={key} onClick={() => toggleCategory(key)}
                              style={{ padding: '14px 10px', borderRadius: 10, border: isSelected ? `2px solid ${color.main}` : `1px solid ${t?.border?.primary}`, background: isSelected ? `${color.main}15` : t?.bg?.secondary, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                              <div style={{ fontSize: 26, marginBottom: 6 }}>{cat.icon}</div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: isSelected ? color.main : t?.text?.primary }}>{cat.name}</div>
                              <div style={{ fontSize: 11, color: t?.text?.muted, marginTop: 4 }}>{enabledItemsCount} بند</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* تفاصيل البند */}
                    {selectedCategory && workItems[selectedCategory] && (
                      <>
                        <div style={{ fontSize: 14, marginBottom: 12, fontWeight: 600, color: t?.text?.secondary }}>📋 تفاصيل {workItems[selectedCategory].name}</div>
                        <div style={{ background: t?.bg?.tertiary, borderRadius: 10, border: `1px solid ${t?.border?.primary}`, padding: 12, marginBottom: 16 }}>
                          <div className="work-items-scroll" style={{ display: 'grid', gap: 8, maxHeight: 220, overflowY: 'auto', paddingLeft: 8 }}>
                            {workItems[selectedCategory].items.filter(i => isItemEnabledInPlace(selectedPlaceType, selectedCategory, i.id)).map(item => {
                              const isSelected = selectedItems.includes(item.id);
                              return (
                                <div key={item.id} onClick={() => toggleItem(item.id)} 
                                  style={{ padding: '12px 14px', borderRadius: 10, border: isSelected ? `2px solid ${t?.button?.primary}` : `1px solid ${t?.border?.primary}`, background: isSelected ? `${t?.button?.primary}15` : t?.bg?.secondary, cursor: 'pointer' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      <span style={{ fontSize: 14, fontWeight: 600, color: t?.text?.primary }}>{item.name}</span>
                                      <span style={{ fontSize: 10, color: item.type === 'wall' ? t?.status?.info?.text : item.type === 'ceiling' ? t?.status?.warning?.text : t?.status?.success?.text, background: item.type === 'wall' ? t?.status?.info?.bg : item.type === 'ceiling' ? t?.status?.warning?.bg : t?.status?.success?.bg, padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>
                                        {item.type === 'wall' ? 'جدران' : item.type === 'ceiling' ? 'أسقف' : 'أرضية'}
                                      </span>
                                    </div>
                                    <span style={{ fontSize: 13, color: t?.status?.success?.text, fontWeight: 600 }}>{formatNum(item.exec)} ر.س</span>
                                  </div>
                                  <div style={{ fontSize: 11, color: t?.text?.muted }}>{item.desc}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}

                    <button onClick={addItems} disabled={!canAdd} style={{ width: '100%', padding: 14, borderRadius: 10, border: 'none', background: canAdd ? t?.button?.gradient : t?.bg?.tertiary, color: canAdd ? '#fff' : t?.text?.muted, fontSize: 14, fontWeight: 700, cursor: canAdd ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>
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
              <div style={{ fontSize: 14, marginBottom: 16, fontWeight: 600, color: t?.text?.secondary }}>📋 البنود المضافة ({itemCount})</div>
              {Object.entries(getItemsByCategory()).map(([catKey, cat], catIdx) => {
                const color = getCategoryColor(catIdx);
                return (
                  <div key={catKey} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <span style={{ fontWeight: 600, color: t?.text?.primary }}>{cat.name}</span>
                      <span style={{ marginRight: 'auto', fontWeight: 700, color: color.main }}>{formatNum(cat.total)} ر.س</span>
                    </div>
                    {cat.items.map(item => (
                      <div key={item.key} style={{ background: t?.bg?.tertiary, borderRadius: 10, padding: 14, marginBottom: 10, border: `1px solid ${t?.border?.primary}` }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, color: t?.text?.primary }}>{item.name}</div>
                            <div style={{ fontSize: 12, color: t?.text?.muted }}>{item.desc}</div>
                          </div>
                          <button onClick={() => removeAddedItem(item.key)} style={{ background: t?.status?.danger?.bg, border: 'none', color: t?.status?.danger?.text, padding: '6px', borderRadius: 6, cursor: 'pointer' }}><Trash2 size={14} /></button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                          <MapPin size={14} color={t?.button?.primary} />
                          <span style={{ fontSize: 13, color: t?.button?.primary, fontWeight: 600 }}>{item.place}</span>
                          {item.isMulti && <span style={{ fontSize: 11, background: t?.status?.success?.bg, color: t?.status?.success?.text, padding: '2px 8px', borderRadius: 6 }}>{item.placesCount} أماكن</span>}
                        </div>
                        <div style={{ background: t?.bg?.secondary, borderRadius: 8, padding: 10, marginBottom: 10 }}>
                          <div style={{ fontSize: 11, color: t?.text?.muted, marginBottom: 4 }}>📐 المعادلة:</div>
                          <div style={{ fontSize: 12, color: t?.status?.info?.text, fontFamily: 'monospace' }}>{item.formula}</div>
                          {item.isMulti && <div style={{ fontSize: 12, color: t?.status?.success?.text, fontWeight: 600, marginTop: 6 }}>{item.totalFormula}</div>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <input type="number" value={item.area} onFocus={handleInputFocus} onChange={(e) => updateAddedItemArea(item.key, e.target.value)} style={{ width: 70, padding: '6px 8px', borderRadius: 6, border: `1px solid ${t?.border?.primary}`, background: t?.bg?.secondary, color: t?.text?.primary, fontSize: 14, textAlign: 'center', fontFamily: 'inherit', ...noSpinner }} />
                            <span style={{ fontSize: 12, color: t?.text?.muted }}>م²</span>
                          </div>
                          <span style={{ fontSize: 14, color: t?.text?.muted }}>×</span>
                          <span style={{ fontSize: 14, color: t?.status?.warning?.text }}>{formatNum(item.exec)} ر.س</span>
                          <span style={{ fontSize: 14, color: t?.text?.muted }}>=</span>
                          <span style={{ fontSize: 16, fontWeight: 700, color: color.main }}>{formatNum(item.total)} ر.س</span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* الملخص */}
          {Object.keys(addedItems).length > 0 && (
            <div style={cardStyle}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, color: t?.text?.secondary }}>💰 الملخص التفصيلي</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 10, marginBottom: 12 }}>
                {[{ label: 'عدد البنود', value: formatNum(itemCount), color: t?.button?.primary }, { label: 'عدد الأماكن', value: formatNum(placesCount), color: t?.status?.info?.text }, { label: 'م² إجمالي', value: formatNum(totalArea), color: t?.status?.warning?.text }, { label: 'نسبة الربح', value: `${formatNum(profitPercent.toFixed(1))}%`, color: t?.status?.success?.text }].map((stat, i) => (
                  <div key={i} style={{ padding: 12, borderRadius: 10, background: t?.bg?.tertiary, textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                    <div style={{ fontSize: 10, color: t?.text?.muted }}>{stat.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                <div style={{ padding: 14, borderRadius: 10, background: `${t?.status?.warning?.text}12`, textAlign: 'center' }}><div style={{ fontSize: 18, fontWeight: 700, color: t?.status?.warning?.text }}>{formatNum(totalExec)}</div><div style={{ fontSize: 11, color: t?.text?.muted }}>سعر التنفيذ</div></div>
                <div style={{ padding: 14, borderRadius: 10, background: `${t?.status?.info?.text}12`, textAlign: 'center' }}><div style={{ fontSize: 18, fontWeight: 700, color: t?.status?.info?.text }}>{formatNum(totalCont)}</div><div style={{ fontSize: 11, color: t?.text?.muted }}>تكلفة المقاول</div></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 }}>
                <div style={{ padding: 12, borderRadius: 10, background: t?.status?.success?.bg, textAlign: 'center' }}><div style={{ fontSize: 16, fontWeight: 700, color: t?.status?.success?.text }}>{formatNum(profit)}</div><div style={{ fontSize: 10, color: t?.text?.muted }}>صافي الربح</div></div>
                <div style={{ padding: 12, borderRadius: 10, background: t?.status?.danger?.bg, textAlign: 'center' }}><div style={{ fontSize: 16, fontWeight: 700, color: t?.status?.danger?.text }}>{formatNum(vatAmount)}</div><div style={{ fontSize: 10, color: t?.text?.muted }}>الضريبة</div></div>
                <div style={{ padding: 12, borderRadius: 10, background: `${t?.button?.primary}15`, textAlign: 'center' }}><div style={{ fontSize: 16, fontWeight: 700, color: t?.button?.primary }}>{formatNum(avgPricePerMeter.toFixed(0))}</div><div style={{ fontSize: 10, color: t?.text?.muted }}>سعر المتر</div></div>
              </div>
              <div style={{ padding: 16, borderRadius: 10, background: `${t?.button?.primary}15`, textAlign: 'center', border: `1px solid ${t?.button?.primary}40` }}>
                <div style={{ fontSize: 26, fontWeight: 700, color: t?.button?.primary }}>{formatNum(grandTotal)} ر.س</div>
                <div style={{ fontSize: 12, color: t?.text?.muted }}>الإجمالي شامل الضريبة</div>
              </div>
            </div>
          )}

          {/* زر التقرير */}
          {Object.keys(addedItems).length > 0 && !showReport && (
            <button onClick={() => setShowReport(true)} style={{ width: '100%', padding: 16, borderRadius: 10, border: 'none', background: t?.button?.gradient, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: 'inherit' }}><FileText size={20} /> عرض التقرير وطباعته</button>
          )}

          {/* التقرير */}
          {showReport && Object.keys(addedItems).length > 0 && (
            <>
              <div style={{ ...cardStyle, display: 'flex', gap: 8 }}>
                <button onClick={() => setShowReport(false)} style={{ padding: '10px 16px', borderRadius: 8, border: `1px solid ${t?.status?.danger?.border}`, background: 'transparent', color: t?.status?.danger?.text, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}><X size={16} /> إغلاق</button>
              </div>
              <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e0e0e0', color: '#333' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e0e0e0' }}>
                  <EditableText value={reportData.companyName} onChange={(v) => setReportData({...reportData, companyName: v})} style={{ fontSize: 20, fontWeight: 700, color: '#2d5a3d' }} />
                  <div style={{ background: '#6b7b3d', color: '#fff', padding: '12px 30px', borderRadius: 25 }}><span style={{ fontSize: 18, fontWeight: 700 }}>{reportData.headerTitle}</span></div>
                </div>
                <div style={{ background: '#5a6a3a', padding: '14px 24px' }}><EditableText value={reportData.projectTitle} onChange={(v) => setReportData({...reportData, projectTitle: v})} style={{ fontSize: 18, fontWeight: 700, color: '#fff', background: 'transparent' }} /></div>
                <div>{Object.entries(getItemsByCategory()).map(([catKey, cat]) => (<React.Fragment key={catKey}>{cat.items.map((item, idx) => (<div key={item.key} style={{ display: 'flex', borderBottom: '1px solid #eee', background: idx % 2 === 0 ? '#fff' : '#fafafa' }}><div style={{ flex: 1, padding: '14px' }}><div style={{ fontSize: 14, fontWeight: 700, color: '#333', marginBottom: 4 }}>{item.name}</div><div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>{item.desc}</div><div style={{ fontSize: 10, color: '#888' }}>📍 {item.place} | {formatNum(item.area)} م²</div></div><div style={{ width: 110, padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}><div style={{ fontSize: 15, fontWeight: 700, color: '#333' }}>{formatNum(item.total)} ريال</div></div></div>))}</React.Fragment>))}</div>
                <div style={{ padding: '20px 24px', borderTop: '3px solid #5a6a3a', background: '#f8f8f8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 15 }}><span style={{ fontWeight: 600, color: '#333' }}>{formatNum(totalExec)} ريال</span><span style={{ color: '#666' }}>المبلغ</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 15 }}><span style={{ fontWeight: 600, color: '#333' }}>{formatNum(vatAmount)} ريال</span><span style={{ color: '#666' }}>الضريبة 15%</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '2px solid #5a6a3a', fontSize: 20 }}><span style={{ fontWeight: 700, color: '#5a6a3a' }}>{formatNum(grandTotal)} ريال</span><span style={{ fontWeight: 700, color: '#333' }}>الإجمالي</span></div>
                </div>
                <div style={{ background: '#5a6a3a', padding: '12px 24px', textAlign: 'center' }}><span style={{ fontSize: 12, color: '#fff' }}>{reportData.footerEmail}</span></div>
              </div>
            </>
          )}
        </div>
      )}

      {mainTab === 'items' && (
        <div style={cardStyle}>
          {/* العنوان الرئيسي */}
          <div style={{ fontSize: 18, fontWeight: 700, color: t?.text?.primary, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>⚙️</span>
            <span>البنود والبرمجة</span>
          </div>

          {/* تبويبات القسم الرئيسية */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            <button 
              onClick={() => setProgrammingSection('places')}
              style={{ 
                padding: '16px', 
                borderRadius: 12, 
                border: programmingSection === 'places' ? `2px solid ${t?.button?.primary}` : `1px solid ${t?.border?.primary}`, 
                background: programmingSection === 'places' ? `${t?.button?.primary}15` : t?.bg?.tertiary, 
                cursor: 'pointer', 
                fontFamily: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8
              }}
            >
              <span style={{ fontSize: 28 }}>📍</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: programmingSection === 'places' ? t?.button?.primary : t?.text?.primary }}>أنواع المكان</span>
              <span style={{ fontSize: 11, color: t?.text?.muted }}>{Object.keys(places).length} نوع</span>
            </button>
            <button 
              onClick={() => setProgrammingSection('items')}
              style={{ 
                padding: '16px', 
                borderRadius: 12, 
                border: programmingSection === 'items' ? `2px solid ${t?.button?.primary}` : `1px solid ${t?.border?.primary}`, 
                background: programmingSection === 'items' ? `${t?.button?.primary}15` : t?.bg?.tertiary, 
                cursor: 'pointer', 
                fontFamily: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8
              }}
            >
              <span style={{ fontSize: 28 }}>🔧</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: programmingSection === 'items' ? t?.button?.primary : t?.text?.primary }}>بنود العمل</span>
              <span style={{ fontSize: 11, color: t?.text?.muted }}>{Object.keys(workItems).length} قسم</span>
            </button>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* قسم أنواع المكان */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {programmingSection === 'places' && (
            <div style={{ background: t?.bg?.tertiary, borderRadius: 12, padding: 16, border: `1px solid ${t?.border?.primary}` }}>
              {/* العنوان وزر الإضافة */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${t?.border?.primary}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>📍</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: t?.text?.primary }}>أنواع المكان</span>
                  <span style={{ fontSize: 12, color: t?.text?.muted, background: t?.bg?.secondary, padding: '2px 8px', borderRadius: 6 }}>{Object.keys(places).length}</span>
                </div>
                <button 
                  onClick={addNewPlaceType}
                  style={{ padding: '10px 18px', borderRadius: 10, border: 'none', background: t?.button?.gradient, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit', boxShadow: `0 2px 8px ${t?.button?.primary}30` }}
                >
                  <Plus size={18} />
                  <span>إضافة نوع</span>
                </button>
              </div>
              
              {/* قائمة أنواع المكان */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {Object.entries(places).map(([key, place], idx) => {
                  const color = getCategoryColor(idx);
                  return (
                    <div key={key} style={{ background: t?.bg?.secondary, borderRadius: 10, border: `1px solid ${t?.border?.primary}`, overflow: 'hidden' }}>
                      {/* رأس نوع المكان */}
                      <div style={{ display: 'flex', alignItems: 'center', padding: 16, gap: 16 }}>
                        {/* الأيقونة والاسم */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                          <div style={{ width: 48, height: 48, borderRadius: 10, background: `${color.main}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: 26 }}>{place.icon}</span>
                          </div>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 600, color: t?.text?.primary, marginBottom: 2 }}>{place.name}</div>
                            <div style={{ fontSize: 12, color: t?.text?.muted }}>{place.places.length} مكان</div>
                          </div>
                        </div>
                        
                        {/* الأزرار */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {/* زر تشغيل/إطفاء */}
                          <div 
                            onClick={() => togglePlaceType(key)}
                            style={{ 
                              width: 50, 
                              height: 28, 
                              borderRadius: 14, 
                              background: place.enabled ? t?.status?.success?.text : t?.bg?.tertiary, 
                              position: 'relative',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              border: `1px solid ${place.enabled ? t?.status?.success?.text : t?.border?.primary}`
                            }}
                          >
                            <div style={{ 
                              width: 22, 
                              height: 22, 
                              borderRadius: '50%', 
                              background: '#fff', 
                              position: 'absolute', 
                              top: 2, 
                              right: place.enabled ? 2 : 24,
                              transition: 'all 0.2s',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }} />
                          </div>
                          
                          {/* زر التحرير */}
                          <button 
                            onClick={() => setEditingPlaceType({ key, name: place.name, icon: place.icon, places: [...place.places] })}
                            style={{ width: 40, height: 40, borderRadius: 10, border: 'none', background: t?.button?.gradient, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: `0 2px 8px ${t?.button?.primary}30` }}
                          >
                            <Edit3 size={18} />
                          </button>
                        </div>
                      </div>
                      
                      {/* قائمة الأماكن */}
                      <div style={{ padding: '0 16px 16px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {place.places.map((p, i) => (
                          <span key={i} style={{ padding: '8px 14px', borderRadius: 8, background: `${color.main}12`, color: color.main, fontSize: 13, fontWeight: 500, border: `1px solid ${color.main}30` }}>
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* قسم بنود العمل */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {programmingSection === 'items' && (
            <div style={{ background: t?.bg?.tertiary, borderRadius: 12, padding: 16, border: `1px solid ${t?.border?.primary}` }}>
              {/* تبويبات نوع المكان */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${t?.border?.primary}`, overflowX: 'auto' }}>
                {Object.entries(places).map(([key, place], idx) => {
                  const color = getCategoryColor(idx);
                  const isActive = programmingTab === key;
                  return (
                    <button 
                      key={key}
                      onClick={() => setProgrammingTab(key)}
                      style={{ 
                        padding: '10px 20px', 
                        borderRadius: 10, 
                        border: isActive ? `2px solid ${color.main}` : `1px solid ${t?.border?.primary}`, 
                        background: isActive ? `${color.main}15` : t?.bg?.secondary, 
                        cursor: 'pointer', 
                        fontFamily: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s'
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{place.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: isActive ? color.main : t?.text?.primary }}>{place.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* العنوان وزر الإضافة */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>🔧</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: t?.text?.primary }}>بنود {places[programmingTab]?.name}</span>
                  <span style={{ fontSize: 12, color: t?.text?.muted, background: t?.bg?.secondary, padding: '2px 8px', borderRadius: 6 }}>{Object.keys(workItems).length}</span>
                </div>
                <button 
                  onClick={addNewCategory} 
                  style={{ padding: '10px 18px', borderRadius: 10, border: 'none', background: t?.button?.gradient, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit', boxShadow: `0 2px 8px ${t?.button?.primary}30` }}
                >
                  <Plus size={18} />
                  <span>إضافة قسم</span>
                </button>
              </div>

              {/* قائمة الأقسام */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {Object.entries(workItems).map(([catKey, cat], catIdx) => {
                  const color = getCategoryColor(catIdx);
                  const isCatEnabled = isCategoryEnabledInPlace(programmingTab, catKey);
                  const isExpanded = selectedCategory === catKey;
                  
                  return (
                    <div key={catKey} style={{ background: t?.bg?.secondary, borderRadius: 10, border: isExpanded ? `2px solid ${color.main}` : `1px solid ${t?.border?.primary}`, overflow: 'hidden', transition: 'all 0.2s' }}>
                      {/* رأس القسم */}
                      <div 
                        style={{ display: 'flex', alignItems: 'center', padding: 16, gap: 12, cursor: 'pointer', opacity: isCatEnabled ? 1 : 0.6 }}
                        onClick={() => toggleCategory(catKey)}
                      >
                        {/* الأيقونة والاسم */}
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: `${color.main}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: 24 }}>{cat.icon}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: 600, color: t?.text?.primary, marginBottom: 2 }}>{cat.name}</div>
                          <div style={{ fontSize: 12, color: t?.text?.muted }}>{cat.items.length} بند</div>
                        </div>
                        
                        {/* الأزرار */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} onClick={e => e.stopPropagation()}>
                          {/* زر تشغيل/إطفاء */}
                          <div 
                            onClick={() => toggleCategoryInPlace(programmingTab, catKey)}
                            style={{ 
                              width: 50, 
                              height: 28, 
                              borderRadius: 14, 
                              background: isCatEnabled ? t?.status?.success?.text : t?.bg?.tertiary, 
                              position: 'relative',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              border: `1px solid ${isCatEnabled ? t?.status?.success?.text : t?.border?.primary}`
                            }}
                          >
                            <div style={{ 
                              width: 22, 
                              height: 22, 
                              borderRadius: '50%', 
                              background: '#fff', 
                              position: 'absolute', 
                              top: 2, 
                              right: isCatEnabled ? 2 : 24,
                              transition: 'all 0.2s',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }} />
                          </div>
                          
                          {/* زر التحرير */}
                          <button 
                            onClick={() => setEditingCategory({ catKey, name: cat.name, icon: cat.icon })}
                            style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: `${t?.button?.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                          >
                            <Edit3 size={16} color={t?.button?.primary} />
                          </button>
                          
                          {/* السهم */}
                          <div style={{ width: 36, height: 36, borderRadius: 8, background: isExpanded ? `${color.main}15` : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {isExpanded ? <ChevronUp size={20} color={color.main} /> : <ChevronDown size={20} color={t?.text?.muted} />}
                          </div>
                        </div>
                      </div>
                      
                      {/* البنود الفرعية */}
                      {isExpanded && (
                        <div style={{ padding: '0 16px 16px' }}>
                          {/* زر إضافة بند */}
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                            <button 
                              onClick={() => addNewWorkItem(catKey)}
                              style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: t?.button?.gradient, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', boxShadow: `0 2px 6px ${t?.button?.primary}30` }}
                            >
                              <Plus size={16} />
                              <span>إضافة بند</span>
                            </button>
                          </div>
                          
                          {cat.items.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 24, color: t?.text?.muted, fontSize: 13, background: t?.bg?.tertiary, borderRadius: 8 }}>
                              لا توجد بنود في هذا القسم
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {cat.items.map(item => {
                                const isItemEnabled = isItemEnabledInPlace(programmingTab, catKey, item.id);
                                return (
                                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', padding: 14, background: t?.bg?.tertiary, borderRadius: 10, border: `1px solid ${t?.border?.primary}`, gap: 12, opacity: isItemEnabled ? 1 : 0.5, transition: 'all 0.2s' }}>
                                    {/* زر تشغيل/إطفاء */}
                                    <div 
                                      onClick={() => toggleItemInPlace(programmingTab, catKey, item.id)}
                                      style={{ 
                                        width: 44, 
                                        height: 24, 
                                        borderRadius: 12, 
                                        background: isItemEnabled ? t?.status?.success?.text : t?.bg?.secondary, 
                                        position: 'relative',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        border: `1px solid ${isItemEnabled ? t?.status?.success?.text : t?.border?.primary}`,
                                        flexShrink: 0
                                      }}
                                    >
                                      <div style={{ 
                                        width: 18, 
                                        height: 18, 
                                        borderRadius: '50%', 
                                        background: '#fff', 
                                        position: 'absolute', 
                                        top: 2, 
                                        right: isItemEnabled ? 2 : 22,
                                        transition: 'all 0.2s',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                      }} />
                                    </div>
                                    
                                    {/* معلومات البند */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ fontSize: 14, fontWeight: 600, color: t?.text?.primary, marginBottom: 2 }}>{item.name}</div>
                                      <div style={{ fontSize: 11, color: t?.text?.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.desc}</div>
                                    </div>
                                    
                                    {/* نوع البند */}
                                    <span style={{ 
                                      fontSize: 11, 
                                      padding: '4px 10px', 
                                      borderRadius: 6, 
                                      fontWeight: 600,
                                      flexShrink: 0,
                                      color: item.type === 'floor' ? t?.status?.success?.text : item.type === 'wall' ? t?.status?.info?.text : t?.status?.warning?.text, 
                                      background: item.type === 'floor' ? t?.status?.success?.bg : item.type === 'wall' ? t?.status?.info?.bg : t?.status?.warning?.bg
                                    }}>
                                      {item.type === 'floor' ? 'أرضية' : item.type === 'wall' ? 'جدران' : 'أسقف'}
                                    </span>
                                    
                                    {/* السعر */}
                                    <div style={{ textAlign: 'center', minWidth: 70, flexShrink: 0 }}>
                                      <div style={{ fontSize: 14, fontWeight: 700, color: color.main }}>{formatNum(item.exec)}</div>
                                      <div style={{ fontSize: 10, color: t?.text?.muted }}>ر.س/م²</div>
                                    </div>
                                    
                                    {/* زر التحرير */}
                                    <button 
                                      onClick={() => setEditingItem({ catKey, item: { ...item } })}
                                      style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: `${t?.button?.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                                    >
                                      <Edit3 size={16} color={t?.button?.primary} />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* نافذة تحرير البند */}
      {editingItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: 20 }} onClick={() => setEditingItem(null)}>
          <div style={{ background: t?.bg?.secondary, borderRadius: 16, padding: 24, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto', border: `1px solid ${t?.border?.primary}`, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} onClick={e => e.stopPropagation()}>
            {/* الهيدر مع العنوان ورقم البند والأزرار */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${t?.border?.primary}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>✏️</span>
                <span style={{ fontSize: 17, fontWeight: 700, color: t?.text?.primary }}>تحرير البند</span>
                <span style={{ fontSize: 12, color: t?.text?.muted, background: t?.bg?.tertiary, padding: '4px 10px', borderRadius: 6 }}>#{editingItem.item.id}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => { deleteWorkItem(editingItem.catKey, editingItem.item.id); setEditingItem(null); }} style={{ padding: '8px 14px', borderRadius: 8, border: `1px solid ${t?.status?.danger?.border}`, background: 'transparent', color: t?.status?.danger?.text, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'inherit' }}><Trash2 size={14} /> حذف</button>
                <button onClick={() => setEditingItem(null)} style={{ padding: '8px 14px', borderRadius: 8, border: `1px solid ${t?.border?.primary}`, background: 'transparent', color: t?.text?.muted, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>إلغاء</button>
                <button onClick={() => { setWorkItems(prev => ({ ...prev, [editingItem.catKey]: { ...prev[editingItem.catKey], items: prev[editingItem.catKey].items.map(item => item.id === editingItem.item.id ? editingItem.item : item) } })); setEditingItem(null); }} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: t?.button?.gradient, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>✓ حفظ</button>
              </div>
            </div>
            
            {/* القسم الرئيسي */}
            <div style={{ marginBottom: 16, padding: 12, background: t?.bg?.tertiary, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>{workItems[editingItem.catKey]?.icon}</span>
              <div>
                <div style={{ fontSize: 11, color: t?.text?.muted }}>القسم الرئيسي</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: t?.text?.primary }}>{workItems[editingItem.catKey]?.name}</div>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}><div style={{ fontSize: 13, color: t?.text?.secondary, marginBottom: 6, fontWeight: 600 }}>اسم البند</div><input type="text" value={editingItem.item.name} onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, name: e.target.value } })} onFocus={handleInputFocus} style={inputStyle} /></div>
            <div style={{ marginBottom: 16 }}><div style={{ fontSize: 13, color: t?.text?.secondary, marginBottom: 6, fontWeight: 600 }}>وصف البند</div><input type="text" value={editingItem.item.desc} onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, desc: e.target.value } })} onFocus={handleInputFocus} style={inputStyle} /></div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: t?.text?.secondary, marginBottom: 8, fontWeight: 600 }}>نوع البند</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {[{ value: 'floor', label: 'أرضية', status: 'success' }, { value: 'wall', label: 'جدران', status: 'info' }, { value: 'ceiling', label: 'أسقف', status: 'warning' }].map(type => (
                  <button key={type.value} onClick={() => setEditingItem({ ...editingItem, item: { ...editingItem.item, type: type.value } })} style={{ padding: '12px', borderRadius: 10, border: editingItem.item.type === type.value ? `1px solid ${t?.status?.[type.status]?.text}` : `1px solid ${t?.border?.primary}`, background: editingItem.item.type === type.value ? t?.status?.[type.status]?.bg : 'transparent', color: editingItem.item.type === type.value ? t?.status?.[type.status]?.text : t?.text?.muted, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{type.label}</button>
                ))}
              </div>
            </div>
            
            {/* تفعيل البند في أنواع المكان */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: t?.text?.secondary, marginBottom: 8, fontWeight: 600 }}>تفعيل في أنواع المكان</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {Object.entries(places).map(([key, place]) => {
                  const isEnabled = isItemEnabledInPlace(key, editingItem.catKey, editingItem.item.id);
                  return (
                    <div 
                      key={key}
                      onClick={() => toggleItemInPlace(key, editingItem.catKey, editingItem.item.id)}
                      style={{ 
                        padding: '12px', 
                        borderRadius: 10, 
                        border: isEnabled ? `2px solid ${t?.status?.success?.text}` : `1px solid ${t?.border?.primary}`, 
                        background: isEnabled ? t?.status?.success?.bg : 'transparent', 
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: 18, marginBottom: 4 }}>{place.icon}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: isEnabled ? t?.status?.success?.text : t?.text?.muted }}>{place.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div><div style={{ fontSize: 13, color: t?.text?.secondary, marginBottom: 6, fontWeight: 600 }}>سعر التنفيذ</div><input type="number" value={editingItem.item.exec} onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, exec: parseFloat(e.target.value) || 0 } })} onFocus={handleInputFocus} style={{ ...inputStyle, borderColor: `${t?.status?.warning?.text}50`, background: `${t?.status?.warning?.text}10`, color: t?.status?.warning?.text, fontSize: 18, fontWeight: 700, textAlign: 'center' }} /></div>
              <div><div style={{ fontSize: 13, color: t?.text?.secondary, marginBottom: 6, fontWeight: 600 }}>سعر المقاول</div><input type="number" value={editingItem.item.cont} onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, cont: parseFloat(e.target.value) || 0 } })} onFocus={handleInputFocus} style={{ ...inputStyle, borderColor: `${t?.status?.info?.text}50`, background: `${t?.status?.info?.text}10`, color: t?.status?.info?.text, fontSize: 18, fontWeight: 700, textAlign: 'center' }} /></div>
            </div>
            <div style={{ padding: 14, borderRadius: 10, background: t?.status?.success?.bg, textAlign: 'center' }}><div style={{ fontSize: 11, color: t?.text?.muted, marginBottom: 4 }}>صافي الربح</div><div style={{ fontSize: 24, fontWeight: 700, color: t?.status?.success?.text }}>{formatNum(editingItem.item.exec - editingItem.item.cont)} ر.س</div></div>
          </div>
        </div>
      )}

      {/* نافذة تحرير القسم الرئيسي */}
      {editingCategory && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: 20 }} onClick={() => setEditingCategory(null)}>
          <div style={{ background: t?.bg?.secondary, borderRadius: 16, padding: 24, width: '100%', maxWidth: 450, maxHeight: '90vh', overflowY: 'auto', border: `1px solid ${t?.border?.primary}`, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} onClick={e => e.stopPropagation()}>
            {/* الهيدر مع العنوان والأزرار */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${t?.border?.primary}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>✏️</span>
                <span style={{ fontSize: 17, fontWeight: 700, color: t?.text?.primary }}>تحرير القسم</span>
                <span style={{ fontSize: 12, color: t?.text?.muted, background: t?.bg?.tertiary, padding: '4px 10px', borderRadius: 6 }}>#{editingCategory.catKey}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => deleteCategory(editingCategory.catKey)} style={{ padding: '8px 14px', borderRadius: 8, border: `1px solid ${t?.status?.danger?.border}`, background: 'transparent', color: t?.status?.danger?.text, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'inherit' }}><Trash2 size={14} /> حذف</button>
                <button onClick={() => setEditingCategory(null)} style={{ padding: '8px 14px', borderRadius: 8, border: `1px solid ${t?.border?.primary}`, background: 'transparent', color: t?.text?.muted, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>إلغاء</button>
                <button onClick={() => { updateCategoryName(editingCategory.catKey, editingCategory.name); updateCategoryIcon(editingCategory.catKey, editingCategory.icon); setEditingCategory(null); }} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: t?.button?.gradient, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>✓ حفظ</button>
              </div>
            </div>
            
            {/* أيقونة القسم */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: t?.text?.secondary, marginBottom: 8, fontWeight: 600 }}>أيقونة القسم</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['🔲', '🎨', '🏛️', '⚡', '🔧', '🪵', '🚪', '🪟', '💡', '❄️', '🔥', '🛁', '🪠', '🧱', '🏗️', '📦', '🪨', '🔄', '✨', '🏺'].map(icon => (
                  <button 
                    key={icon} 
                    onClick={() => setEditingCategory({ ...editingCategory, icon })}
                    style={{ 
                      width: 44, 
                      height: 44, 
                      borderRadius: 10, 
                      border: editingCategory.icon === icon ? `2px solid ${t?.button?.primary}` : `1px solid ${t?.border?.primary}`, 
                      background: editingCategory.icon === icon ? `${t?.button?.primary}15` : t?.bg?.tertiary, 
                      fontSize: 22, 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            
            {/* اسم القسم */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: t?.text?.secondary, marginBottom: 6, fontWeight: 600 }}>اسم القسم</div>
              <input 
                type="text" 
                value={editingCategory.name} 
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} 
                onFocus={handleInputFocus} 
                style={inputStyle} 
              />
            </div>

            {/* تفعيل القسم في أنواع المكان */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: t?.text?.secondary, marginBottom: 8, fontWeight: 600 }}>تفعيل في أنواع المكان</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {Object.entries(places).map(([key, place]) => {
                  const isEnabled = isCategoryEnabledInPlace(key, editingCategory.catKey);
                  return (
                    <div 
                      key={key}
                      onClick={() => toggleCategoryInPlace(key, editingCategory.catKey)}
                      style={{ 
                        padding: '12px', 
                        borderRadius: 10, 
                        border: isEnabled ? `2px solid ${t?.status?.success?.text}` : `1px solid ${t?.border?.primary}`, 
                        background: isEnabled ? t?.status?.success?.bg : 'transparent', 
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: 20, marginBottom: 4 }}>{place.icon}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: isEnabled ? t?.status?.success?.text : t?.text?.muted }}>{place.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* معاينة */}
            <div style={{ padding: 16, borderRadius: 10, background: t?.bg?.tertiary, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 28 }}>{editingCategory.icon}</span>
              <span style={{ fontSize: 16, fontWeight: 600, color: t?.text?.primary }}>{editingCategory.name}</span>
            </div>
          </div>
        </div>
      )}

      {/* نافذة تحرير نوع المكان */}
      {editingPlaceType && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: 20 }} onClick={() => setEditingPlaceType(null)}>
          <div style={{ background: t?.bg?.secondary, borderRadius: 16, padding: 24, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto', border: `1px solid ${t?.border?.primary}`, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} onClick={e => e.stopPropagation()}>
            {/* الهيدر مع العنوان والأزرار */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${t?.border?.primary}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>📍</span>
                <span style={{ fontSize: 17, fontWeight: 700, color: t?.text?.primary }}>تحرير نوع المكان</span>
                <span style={{ fontSize: 12, color: t?.text?.muted, background: t?.bg?.tertiary, padding: '4px 10px', borderRadius: 6 }}>#{editingPlaceType.key}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {Object.keys(places).length > 1 && (
                  <button onClick={() => deletePlaceType(editingPlaceType.key)} style={{ padding: '8px 14px', borderRadius: 8, border: `1px solid ${t?.status?.danger?.border}`, background: 'transparent', color: t?.status?.danger?.text, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'inherit' }}><Trash2 size={14} /> حذف</button>
                )}
                <button onClick={() => setEditingPlaceType(null)} style={{ padding: '8px 14px', borderRadius: 8, border: `1px solid ${t?.border?.primary}`, background: 'transparent', color: t?.text?.muted, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>إلغاء</button>
                <button onClick={() => { updatePlaceType(editingPlaceType.key, { name: editingPlaceType.name, icon: editingPlaceType.icon, places: editingPlaceType.places }); setEditingPlaceType(null); }} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: t?.button?.gradient, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>✓ حفظ</button>
              </div>
            </div>
            
            {/* أيقونة نوع المكان */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: t?.text?.secondary, marginBottom: 8, fontWeight: 600 }}>الأيقونة</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['🏠', '🚿', '🌳', '🏢', '🏬', '🏭', '🏗️', '🏛️', '🏥', '🏫', '🏪', '🏨', '🏰', '⛪', '🕌', '🛕'].map(icon => (
                  <button 
                    key={icon} 
                    onClick={() => setEditingPlaceType({ ...editingPlaceType, icon })}
                    style={{ 
                      width: 44, 
                      height: 44, 
                      borderRadius: 10, 
                      border: editingPlaceType.icon === icon ? `2px solid ${t?.button?.primary}` : `1px solid ${t?.border?.primary}`, 
                      background: editingPlaceType.icon === icon ? `${t?.button?.primary}15` : t?.bg?.tertiary, 
                      fontSize: 22, 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            
            {/* اسم نوع المكان */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: t?.text?.secondary, marginBottom: 6, fontWeight: 600 }}>اسم النوع</div>
              <input 
                type="text" 
                value={editingPlaceType.name} 
                onChange={(e) => setEditingPlaceType({ ...editingPlaceType, name: e.target.value })} 
                onFocus={handleInputFocus} 
                style={inputStyle} 
              />
            </div>

            {/* الأماكن */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontSize: 13, color: t?.text?.secondary, fontWeight: 600 }}>الأماكن ({editingPlaceType.places.length})</div>
                <button 
                  onClick={() => setEditingPlaceType({ ...editingPlaceType, places: [...editingPlaceType.places, `مكان ${editingPlaceType.places.length + 1}`] })}
                  style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: t?.button?.gradient, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'inherit' }}
                >
                  <Plus size={14} /> إضافة
                </button>
              </div>
              <div style={{ background: t?.bg?.tertiary, borderRadius: 10, padding: 12, maxHeight: 200, overflowY: 'auto' }}>
                {editingPlaceType.places.map((place, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <input 
                      type="text" 
                      value={place} 
                      onChange={(e) => {
                        const newPlaces = [...editingPlaceType.places];
                        newPlaces[idx] = e.target.value;
                        setEditingPlaceType({ ...editingPlaceType, places: newPlaces });
                      }}
                      onFocus={handleInputFocus}
                      style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
                    />
                    <button 
                      onClick={() => {
                        if (editingPlaceType.places.length > 1) {
                          const newPlaces = editingPlaceType.places.filter((_, i) => i !== idx);
                          setEditingPlaceType({ ...editingPlaceType, places: newPlaces });
                        }
                      }}
                      style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${t?.status?.danger?.border}`, background: 'transparent', color: t?.status?.danger?.text, cursor: editingPlaceType.places.length > 1 ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: editingPlaceType.places.length > 1 ? 1 : 0.5 }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* معاينة */}
            <div style={{ padding: 16, borderRadius: 10, background: t?.bg?.tertiary, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 32 }}>{editingPlaceType.icon}</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: t?.text?.primary }}>{editingPlaceType.name}</div>
                <div style={{ fontSize: 12, color: t?.text?.muted }}>{editingPlaceType.places.length} مكان</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuantityCalculator;
