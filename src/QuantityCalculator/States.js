// ╔═══════════════════════════════════════════════════════════════════════════════════╗
// ║                            الحالات الافتراضية - States                            ║
// ╚═══════════════════════════════════════════════════════════════════════════════════╝

// ═══════════════════════════════════════════════════════════════════════════════════
// 📐 أنواع المساحة الافتراضية
// ═══════════════════════════════════════════════════════════════════════════════════
export const defaultItemTypes = {
  floor: { 
    id: 'floor', 
    name: 'أرضية', 
    icon: '⬇️', 
    color: '#10b981', 
    formula: 'length * width', 
    formulaDisplay: 'ط × ع', 
    unit: 'م²', 
    description: 'حساب مساحة الأرضية', 
    enabled: true 
  },
  ceiling: { 
    id: 'ceiling', 
    name: 'سقف', 
    icon: '⬆️', 
    color: '#3b82f6', 
    formula: 'length * width', 
    formulaDisplay: 'ط × ع', 
    unit: 'م²', 
    description: 'حساب مساحة السقف', 
    enabled: true 
  },
  walls4: { 
    id: 'walls4', 
    name: '4 جدران', 
    icon: '🧱', 
    color: '#8b5cf6', 
    formula: '(length + width) * 2 * height', 
    formulaDisplay: '(ط+ع)×2×ر', 
    unit: 'م²', 
    description: 'حساب مساحة 4 جدران', 
    enabled: true 
  },
  wallSingle: { 
    id: 'wallSingle', 
    name: 'جدار واحد', 
    icon: '▬', 
    color: '#06b6d4', 
    formula: 'length * height', 
    formulaDisplay: 'ط × ر', 
    unit: 'م²', 
    description: 'حساب مساحة جدار واحد', 
    enabled: true 
  },
  wazra: { 
    id: 'wazra', 
    name: 'وزرة', 
    icon: '📏', 
    color: '#ec4899', 
    formula: '(length + width) * 2', 
    formulaDisplay: '(ط+ع)×2', 
    unit: 'م.ط', 
    description: 'حساب محيط الوزرة', 
    enabled: true 
  },
  unit: { 
    id: 'unit', 
    name: 'وحدة', 
    icon: '🔢', 
    color: '#f97316', 
    formula: 'quantity', 
    formulaDisplay: 'العدد', 
    unit: 'وحدة', 
    description: 'حساب بالوحدة/العدد', 
    enabled: true 
  }
};

// ═══════════════════════════════════════════════════════════════════════════════════
// 🏠 الأماكن الافتراضية
// ═══════════════════════════════════════════════════════════════════════════════════
export const defaultPlaces = {
  dry: { 
    name: 'جاف', 
    icon: '🏠', 
    enabled: true, 
    places: [
      'صالة', 
      'غرفة نوم رئيسية', 
      'غرفة نوم 1', 
      'غرفة نوم 2', 
      'مجلس', 
      'مقلط'
    ] 
  },
  wet: { 
    name: 'رطب', 
    icon: '🚿', 
    enabled: true, 
    places: [
      'مطبخ', 
      'دورة مياه رئيسية', 
      'دورة مياه 1', 
      'دورة مياه 2'
    ] 
  },
  outdoor: { 
    name: 'خارجي', 
    icon: '🌳', 
    enabled: true, 
    places: [
      'حوش', 
      'مدخل', 
      'موقف سيارات', 
      'سطح'
    ] 
  }
};

// ═══════════════════════════════════════════════════════════════════════════════════
// 📦 بنود العمل الافتراضية
// ═══════════════════════════════════════════════════════════════════════════════════
export const defaultWorkItems = {
  tiles: { 
    name: 'بلاط', 
    icon: '🔲', 
    code: 'BL', 
    items: [
      { id: 't1', num: '01', name: 'بلاط أرضيات', desc: 'توريد وتركيب', exec: 150, cont: 100, typeId: 'floor' },
      { id: 't2', num: '02', name: 'بلاط جدران', desc: 'توريد وتركيب', exec: 180, cont: 120, typeId: 'walls4' },
      { id: 't3', num: '03', name: 'وزرة سيراميك', desc: 'توريد وتركيب', exec: 45, cont: 30, typeId: 'wazra' },
      { id: 't4', num: '04', name: 'رخام أرضيات', desc: 'توريد وتركيب', exec: 350, cont: 250, typeId: 'floor' }
    ] 
  },
  paint: { 
    name: 'دهان', 
    icon: '🎨', 
    code: 'DH', 
    items: [
      { id: 'p1', num: '01', name: 'دهان جدران', desc: 'وجهين', exec: 35, cont: 22, typeId: 'walls4' },
      { id: 'p2', num: '02', name: 'دهان سقف', desc: 'وجهين', exec: 30, cont: 18, typeId: 'ceiling' },
      { id: 'p3', num: '03', name: 'معجون وتجهيز', desc: 'سكينتين', exec: 25, cont: 15, typeId: 'walls4' }
    ] 
  },
  gypsum: { 
    name: 'جبس', 
    icon: '📐', 
    code: 'JB', 
    items: [
      { id: 'g1', num: '01', name: 'جبس بورد عادي', desc: 'توريد وتركيب', exec: 85, cont: 55, typeId: 'ceiling' },
      { id: 'g2', num: '02', name: 'جبس بورد مقاوم', desc: 'توريد وتركيب', exec: 110, cont: 75, typeId: 'ceiling' }
    ] 
  },
  plumbing: { 
    name: 'سباكة', 
    icon: '🔧', 
    code: 'SB', 
    items: [
      { id: 's1', num: '01', name: 'نقطة صرف', desc: 'تأسيس', exec: 250, cont: 150, typeId: 'unit' },
      { id: 's2', num: '02', name: 'نقطة ماء', desc: 'تأسيس', exec: 200, cont: 120, typeId: 'unit' },
      { id: 's3', num: '03', name: 'تركيب مغسلة', desc: 'مع الخلاط', exec: 350, cont: 200, typeId: 'unit' },
      { id: 's4', num: '04', name: 'تركيب مرحاض', desc: 'كامل', exec: 400, cont: 250, typeId: 'unit' }
    ] 
  },
  electricity: { 
    name: 'كهرباء', 
    icon: '⚡', 
    code: 'KH', 
    items: [
      { id: 'e1', num: '01', name: 'نقطة إضاءة', desc: 'تأسيس', exec: 180, cont: 100, typeId: 'unit' },
      { id: 'e2', num: '02', name: 'نقطة بلاك', desc: 'تأسيس', exec: 150, cont: 80, typeId: 'unit' }
    ] 
  }
};

// ═══════════════════════════════════════════════════════════════════════════════════
// ⚙️ البرمجة الافتراضية (البنود المفعلة لكل نوع مكان)
// ═══════════════════════════════════════════════════════════════════════════════════
export const defaultProgramming = {
  dry: {
    tiles: { enabled: true, items: ['t1', 't3', 't4'] },
    paint: { enabled: true, items: ['p1', 'p2', 'p3'] },
    gypsum: { enabled: true, items: ['g1', 'g2'] },
    plumbing: { enabled: false, items: [] },
    electricity: { enabled: true, items: ['e1', 'e2'] }
  },
  wet: {
    tiles: { enabled: true, items: ['t1', 't2', 't3'] },
    paint: { enabled: true, items: ['p2'] },
    gypsum: { enabled: true, items: ['g2'] },
    plumbing: { enabled: true, items: ['s1', 's2', 's3', 's4'] },
    electricity: { enabled: true, items: ['e1', 'e2'] }
  },
  outdoor: {
    tiles: { enabled: true, items: ['t1', 't4'] },
    paint: { enabled: true, items: ['p1'] },
    gypsum: { enabled: false, items: [] },
    plumbing: { enabled: true, items: ['s1', 's2'] },
    electricity: { enabled: true, items: ['e1'] }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════════
// 🧮 هيكل الفئة في الحاسبة (للمرجع)
// ═══════════════════════════════════════════════════════════════════════════════════
export const defaultCategoryOptions = {
  containerState: 'none',      // none, included, excluded
  containerAmount: 0,
  totalsContainerAmount: 0,
  materialsState: 'none',      // none, included, excluded
  materialsAmount: 0,
  showMeters: true,
  sumMeters: true,
  showPrice: true,
  customAmount: 0,
  profitPercent: 0,
  discountPercent: 0,
  discountAmount: 0,
  taxPercent: 0
};

// إنشاء فئة جديدة
export const createCategory = (code, name, color, subItems = []) => ({
  id: `cat_${Date.now()}`,
  code,
  name,
  color,
  subItems,
  items: [],
  pendingPlaces: [],
  needsSubItemSelection: false,
  categoryConditions: [],
  options: { ...defaultCategoryOptions }
});

// إنشاء بند جديد في الفئة
export const createCategoryItem = (code, name, price, group, typeId) => ({
  id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  code,
  name,
  price,
  group,
  typeId,
  places: [],
  conditions: []
});

// إنشاء مكان جديد
export const createPlace = (name, length, width, height, area) => ({
  id: `place_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  name,
  length,
  width,
  height,
  area
});

// ═══════════════════════════════════════════════════════════════════════════════════
// 📊 الحالة الأولية للتطبيق
// ═══════════════════════════════════════════════════════════════════════════════════
export const initialState = {
  // البيانات الأساسية
  itemTypes: defaultItemTypes,
  places: defaultPlaces,
  workItems: defaultWorkItems,
  programming: defaultProgramming,
  
  // بيانات الحاسبة
  categories: [],
  
  // حالة الإدخال
  selectedPlaceType: 'dry',
  selectedPlace: '',
  dimensions: { length: 4, width: 3, height: 3 },
  activeMainItems: {
    tiles: true,
    paint: true,
    plumbing: false,
    electricity: false,
    gypsum: false
  },
  
  // حالة الواجهة
  mainTab: 'calculator',  // calculator, places, workItems, areaTypes
  expandedCategories: {},
  expandedItems: {}
};
