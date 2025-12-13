import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, addDoc, updateDoc, deleteDoc, setDoc, onSnapshot, query, orderBy, runTransaction } from 'firebase/firestore';
import { Calendar, CheckSquare, Users, Moon, Sun, Monitor, Plus, Archive, Clock, Activity, History, Loader, Power, Pencil, Trash2, RotateCcw, UserCog, ChevronLeft, ChevronDown, ChevronUp, FolderOpen, FileText, MapPin, User, X, Phone, Settings, Layers, CreditCard, DollarSign, Wallet, FolderPlus, AlertTriangle, Image, Map, Type, Search, RefreshCw, Shield, CheckCircle, XCircle, Copy, ExternalLink, Eye, EyeOff, Folder, BookOpen } from 'lucide-react';

const firebaseConfig = {
  apiKey: "AIzaSyDpzPCma5c4Tuxd5htRHOvm4aYLRbj8Qkg",
  authDomain: "financial-system-8f4b3.firebaseapp.com",
  projectId: "financial-system-8f4b3",
  storageBucket: "financial-system-8f4b3.firebasestorage.app",
  messagingSenderId: "243232571212",
  appId: "1:243232571212:web:d3c5bd06b09ef825d959e9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const APP_VERSION = "5.2.0-MultiUser";
  // Helper to increment counters
  const incrementCounter = async (key) => {
    await runTransaction(db, async (t) => {
      const ref = doc(db, 'system', 'counters');
      const docVal = await t.get(ref);
      t.set(ref, { ...docVal.data(), [key]: (docVal.data()?.[key] || 0) + 1 }, { merge: true });
    });
  };
  
  // Helper to add log
  const addLog = async (action, type, name, itemId) => {
    await addDoc(collection(db, 'audit'), {
      user: currentUser?.username || 'النظام', action, itemType: type, itemName: name, itemId,
      description: `${currentUser?.username} قام ${action === 'add' ? 'بإضافة' : action === 'edit' ? 'بتعديل' : 'بحذف'} ${type}: ${name}`,
      timestamp: new Date().toISOString()
    });
  };


// نظام الأرقام التسلسلية
const generateRefNumber = (prefix, counter) => {
  return `${prefix}-${String(counter).padStart(4, '0')}`;
};

// ألوان موحدة للحالات
const getStatusColor = (status, days = null) => {
  // متأخر / منتهي / عالي الأهمية
  if (status === 'overdue' || status === 'expired' || status === 'عالي الأهمية' || status === 'delete' || (days !== null && days < 0)) {
    return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', badge: 'bg-red-500/30 text-red-300' };
  }
  // عاجل / مستعجل / ينتهي قريباً
  if (status === 'urgent' || status === 'مستعجل' || (days !== null && days <= 7)) {
    return { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', badge: 'bg-orange-500/30 text-orange-300' };
  }
  // قريب / متوسط
  if (status === 'soon' || status === 'متوسط الأهمية' || (days !== null && days <= 14)) {
    return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', badge: 'bg-yellow-500/30 text-yellow-300' };
  }
  // آمن / مكتمل / منخفض / نشط / إضافة
  if (status === 'safe' || status === 'مكتمل' || status === 'منخفض الأهمية' || status === 'active' || status === 'add') {
    return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', badge: 'bg-green-500/30 text-green-300' };
  }
  // جاري العمل / مرة واحدة / تعديل
  if (status === 'جاري العمل' || status === 'مرة واحدة' || status === 'edit') {
    return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', badge: 'bg-blue-500/30 text-blue-300' };
  }
  // متوقف / سنوي / دفع
  if (status === 'متوقف' || status === 'سنوي' || status === 'refresh') {
    return { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', badge: 'bg-purple-500/30 text-purple-300' };
  }
  // افتراضي
  return { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30', badge: 'bg-gray-500/30 text-gray-300' };
};

// تحديد لون المصروف حسب الأيام والنوع
const getExpenseColor = (days, type) => {
  if (type === 'مرة واحدة') return getStatusColor('مرة واحدة');
  if (days === null) return getStatusColor('safe');
  if (days < 0) return getStatusColor('overdue');
  if (days <= 7) return getStatusColor('urgent');
  if (days <= 14) return getStatusColor('soon');
  return getStatusColor('safe');
};

// تحديد لون المهمة حسب الأولوية
const getTaskColor = (priority) => {
  return getStatusColor(priority);
};

// تحديد لون المشروع حسب الحالة
const getProjectColor = (status) => {
  return getStatusColor(status);
};

// تحديد لون الحساب حسب الأيام المتبقية
const getAccountColor = (days) => {
  if (days === null || days > 30) return getStatusColor('active');
  if (days <= 0) return getStatusColor('expired');
  if (days <= 7) return getStatusColor('urgent');
  if (days <= 30) return getStatusColor('soon');
  return getStatusColor('active');
};

const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString('en-US');
};

// حساب تاريخ الاستحقاق التالي
const calcNextDueDate = (startDate, type) => {
  if (!startDate) return null;
  const start = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (type === 'مرة واحدة') {
    return start;
  }
  
  let nextDue = new Date(start);
  const daysToAdd = type === 'شهري' ? 30 : 365;
  
  while (nextDue <= today) {
    nextDue.setDate(nextDue.getDate() + daysToAdd);
  }
  
  return nextDue;
};

// حساب الأيام المتبقية
const calcDaysRemaining = (startDate, type) => {
  const nextDue = calcNextDueDate(startDate, type);
  if (!nextDue) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((nextDue - today) / (1000 * 60 * 60 * 24));
  return diff;
};

// تحديد حالة المصروف
const getExpenseStatus = (expense) => {
  if (expense.status === 'مدفوع') return 'مدفوع';
  const days = calcDaysRemaining(expense.dueDate, expense.type);
  if (days === null) return 'لم يتم الدفع';
  if (expense.type === 'شهري' && days <= 7) return 'قريباً الدفع';
  if (expense.type === 'سنوي' && days <= 15) return 'قريباً الدفع';
  if (days < 0) return 'متأخر';
  return 'لم يتم الدفع';
};

const fonts = [
  { id: 'cairo', name: 'Cairo', value: "'Cairo', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap' },
  { id: 'tajawal', name: 'Tajawal', value: "'Tajawal', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap' },
  { id: 'almarai', name: 'Almarai', value: "'Almarai', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Almarai:wght@400;700&display=swap' },
  { id: 'noto', name: 'Noto Kufi', value: "'Noto Kufi Arabic', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;600;700&display=swap' },
  { id: 'rubik', name: 'Rubik', value: "'Rubik', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap' },
];

const versionHistory = [
  { version: "4.6.0", date: "2024-12-14", changes: ["تصميم زجاجي", "فقاعات ملونة", "20 تحية", "تحديث المصروفات"] },
  { version: "4.5.0", date: "2024-12-14", changes: ["نظام استحقاق ذكي", "تتبع المنفق", "حالات جديدة"] },
  { version: "4.4.0", date: "2024-12-14", changes: ["بيانات متجاورة بأيقونات", "خيارات الخطوط"] },
];

const quotes = [
  "النجاح يبدأ بخطوة 🚀", "استثمر وقتك بحكمة ⏰", "التخطيط المالي مفتاح النجاح 💰", "كل يوم فرصة جديدة 🌟",
  "الإصرار يصنع المستحيل 💪", "فكر كبيراً وابدأ صغيراً 🎯", "المثابرة طريق التميز ⭐", "النظام أساس النجاح 📊",
];

const greetings = [
  (name) => `أهلاً ${name} 👋`,
  (name) => `مرحباً ${name} 🌟`,
  (name) => `هلا ${name} ✨`,
  (name) => `أهلين ${name} 💫`,
  (name) => `يا هلا ${name} 🎯`,
  (name) => `حياك الله ${name} 🌙`,
  (name) => `نورت ${name} ☀️`,
  (name) => `هلا والله ${name} 🔥`,
  (name) => `أهلاً وسهلاً ${name} 🌺`,
  (name) => `تشرفنا ${name} ⭐`,
  (name) => `منور ${name} 💡`,
  (name) => `الله يحييك ${name} 🤝`,
  (name) => `هلا وغلا ${name} 💎`,
  (name) => `يا مرحبا ${name} 🎉`,
  (name) => `حيّاك ${name} 🌷`,
  (name) => `أسعد الله أوقاتك ${name} 🕐`,
  (name) => `طال عمرك ${name} 🌿`,
  (name) => `عساك بخير ${name} 💪`,
  (name) => `هلا بالغالي ${name} ❤️`,
  (name) => `مرحبتين ${name} 🙌`,
  (name) => `يومك سعيد ${name} 🌈`,
  (name) => `عساك طيب ${name} 🍀`,
  (name) => `الله يسعدك ${name} 😊`,
  (name) => `هلا بالنشيط ${name} 🚀`,
  (name) => `يا هلا بالبطل ${name} 🏆`,
];

// عبارات تشجيعية للصفحات المختلفة
const encouragements = {
  expenses: [
    'إدارة المصروفات بذكاء = نجاح مضمون! 💰',
    'التخطيط المالي الجيد بداية النجاح 📊',
    'راقب مصروفاتك، تحكم بمستقبلك! 🎯',
    'كل ريال مُدار بذكاء يصنع الفرق 💎',
    'المتابعة الدقيقة سر التوفير 🔍',
    'أنت على الطريق الصحيح! 🌟',
  ],
  tasks: [
    'كل مهمة منجزة خطوة نحو القمة! 🏔️',
    'النجاح يبدأ بمهمة واحدة 🚀',
    'أنت قادر على إنجاز المزيد! 💪',
    'التنظيم مفتاح الإنتاجية 🔑',
    'خطوة بخطوة نحو الهدف 👣',
    'استمر، أنت تبلي بلاءً حسناً! ⭐',
  ],
  projects: [
    'كل مشروع ناجح يبدأ بخطة! 📋',
    'الإنجازات الكبيرة تبدأ هنا 🎯',
    'مشاريعك تعكس طموحك! 🌟',
    'النجاح يحتاج صبراً ومتابعة 🏆',
    'كل مشروع فرصة جديدة للتميز 💫',
    'أنت مبدع في إدارة مشاريعك! 🚀',
  ],
  accounts: [
    'حساباتك منظمة، أمورك ميسّرة! ✨',
    'التنظيم سر النجاح 📁',
    'إدارة ذكية = نتائج مبهرة 🎯',
    'كل حساب في مكانه الصحيح 👌',
    'المتابعة الدقيقة تصنع الفرق 🔍',
  ],
  empty: [
    'ابدأ الآن وأضف أول عنصر! 🌱',
    'الخطوة الأولى هي الأهم 👣',
    'لا تتردد، ابدأ رحلتك! 🚀',
    'كل إنجاز عظيم بدأ من هنا ⭐',
  ]
};

const getRandomEncouragement = (type) => {
  const msgs = encouragements[type] || encouragements.empty;
  return msgs[Math.floor(Math.random() * msgs.length)];
};

const getRandomGreeting = (username) => {
  const randomIndex = Math.floor(Math.random() * greetings.length);
  return greetings[randomIndex](username);
};


const backgrounds = [
  { id: 0, name: 'أسود', dark: 'from-gray-950 via-black to-gray-950', light: 'from-gray-100 via-gray-50 to-gray-100' },
  { id: 1, name: 'كلاسيكي', dark: 'from-gray-900 via-purple-900 to-gray-900', light: 'from-blue-50 via-indigo-50 to-purple-50' },
  { id: 2, name: 'أزرق ملكي', dark: 'from-blue-950 via-blue-900 to-indigo-950', light: 'from-blue-100 via-sky-50 to-indigo-100' },
  { id: 3, name: 'ذهبي فاخر', dark: 'from-yellow-950 via-amber-900 to-orange-950', light: 'from-yellow-50 via-amber-50 to-orange-50' },
  { id: 4, name: 'أخضر النجاح', dark: 'from-emerald-950 via-green-900 to-teal-950', light: 'from-emerald-50 via-green-50 to-teal-50' },
  { id: 5, name: 'بنفسجي راقي', dark: 'from-purple-950 via-violet-900 to-indigo-950', light: 'from-purple-50 via-violet-50 to-indigo-50' },
];

const accentColors = [
  { id: 0, name: 'أزرق', color: 'bg-blue-500', gradient: 'from-blue-600 to-blue-700', text: 'text-blue-500' },
  { id: 1, name: 'بنفسجي', color: 'bg-purple-500', gradient: 'from-purple-600 to-purple-700', text: 'text-purple-500' },
  { id: 2, name: 'أخضر', color: 'bg-emerald-500', gradient: 'from-emerald-600 to-emerald-700', text: 'text-emerald-500' },
  { id: 3, name: 'برتقالي', color: 'bg-orange-500', gradient: 'from-orange-600 to-orange-700', text: 'text-orange-500' },
  { id: 4, name: 'وردي', color: 'bg-pink-500', gradient: 'from-pink-600 to-pink-700', text: 'text-pink-500' },
];

const headerColors = [
  { id: 0, name: 'شفاف', sample: 'bg-gray-500/30', dark: 'bg-gray-800/80 backdrop-blur-sm border-gray-700/50', light: 'bg-white/90 backdrop-blur-sm border-gray-200' },
  { id: 1, name: 'أسود', sample: 'bg-black', dark: 'bg-black/90 backdrop-blur-sm border-gray-800', light: 'bg-gray-900/90 backdrop-blur-sm border-gray-700' },
  { id: 2, name: 'أزرق', sample: 'bg-blue-900', dark: 'bg-blue-950/90 backdrop-blur-sm border-blue-900', light: 'bg-blue-900/90 backdrop-blur-sm border-blue-800' },
  { id: 3, name: 'بنفسجي', sample: 'bg-purple-900', dark: 'bg-purple-950/90 backdrop-blur-sm border-purple-900', light: 'bg-purple-900/90 backdrop-blur-sm border-purple-800' },
  { id: 4, name: 'رمادي', sample: 'bg-gray-800', dark: 'bg-gray-900/95 backdrop-blur-sm border-gray-800', light: 'bg-gray-800/95 backdrop-blur-sm border-gray-700' },
  { id: 5, name: 'أخضر', sample: 'bg-emerald-900', dark: 'bg-emerald-950/90 backdrop-blur-sm border-emerald-900', light: 'bg-emerald-900/90 backdrop-blur-sm border-emerald-800' },
];

const FinancialPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="fin-pattern" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse">
        <text x="20" y="40" fontSize="48" fill="currentColor" transform="rotate(-15 20 40)">$</text>
        <text x="320" y="60" fontSize="52" fill="currentColor" transform="rotate(25 320 60)">€</text>
        <text x="150" y="100" fontSize="44" fill="currentColor" transform="rotate(-8 150 100)">£</text>
        <text x="250" y="150" fontSize="40" fill="currentColor" transform="rotate(18 250 150)">¥</text>
        <text x="60" y="200" fontSize="38" fill="currentColor" transform="rotate(30 60 200)">ر.س</text>
        <text x="350" y="220" fontSize="50" fill="currentColor" transform="rotate(-20 350 220)">$</text>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#fin-pattern)" />
  </svg>
);

const MapPicker = ({ onSelect, onClose, darkMode }) => {
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [position, setPosition] = useState({ lat: 24.7136, lng: 46.6753 });
  const [locationName, setLocationName] = useState('الرياض');
  const mapRef = useRef(null);
  const searchTimeout = useRef(null);

  const searchSuggestions = async (query) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`);
      const data = await response.json();
      setSuggestions(data || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleSearchInput = (value) => {
    setSearch(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => searchSuggestions(value), 300);
  };

  const selectSuggestion = (item) => {
    setPosition({ lat: parseFloat(item.lat), lng: parseFloat(item.lon) });
    setLocationName(item.display_name.split(',').slice(0, 2).join('، '));
    setSearch(item.display_name.split(',')[0]);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleConfirm = () => {
    const mapUrl = `https://www.google.com/maps?q=${position.lat},${position.lng}`;
    onSelect(mapUrl, locationName, `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
      <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl`}>
        <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
          <h3 className={`font-bold text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>تحديد الموقع</h3>
          <button onClick={onClose} className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}><X className="w-5 h-5" /></button>
        </div>
        
        <div className="p-4">
          <div className="relative mb-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder="ابحث عن موقع (مثال: برج المملكة، الرياض)" 
                  value={search} 
                  onChange={e => handleSearchInput(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  className={`w-full p-3 rounded-xl border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'}`}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className={`absolute top-full left-0 right-0 mt-1 rounded-xl border shadow-lg z-50 max-h-48 overflow-y-auto ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    {suggestions.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => selectSuggestion(item)}
                        className={`w-full text-right p-3 flex items-center gap-2 ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-700'} ${idx !== suggestions.length - 1 ? (darkMode ? 'border-b border-gray-700' : 'border-b border-gray-100') : ''}`}
                      >
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm truncate">{item.display_name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button 
                onClick={() => searchSuggestions(search)} 
                disabled={searching}
                className={`px-4 rounded-xl ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white flex items-center gap-2`}
              >
                {searching ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="relative rounded-xl overflow-hidden border-2 border-gray-300" style={{ height: '300px' }}>
            <iframe
              ref={mapRef}
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${position.lat},${position.lng}&zoom=15&maptype=roadmap&language=ar`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex flex-col items-center">
                <MapPin className="w-10 h-10 text-red-500 drop-shadow-lg" style={{ marginBottom: '-8px' }} />
                <div className="w-2 h-2 bg-red-500 rounded-full shadow-lg" />
              </div>
            </div>
          </div>
          
          <div className={`mt-3 p-3 rounded-xl text-sm ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
            <p><strong>الموقع:</strong> {locationName}</p>
            <p><strong>الإحداثيات:</strong> {position.lat.toFixed(6)}, {position.lng.toFixed(6)}</p>
          </div>
        </div>

        <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex gap-3 justify-end`}>
          <button onClick={onClose} className={`px-5 py-2.5 rounded-xl text-sm ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}>إلغاء</button>
          <button onClick={handleConfirm} className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm">تأكيد الموقع</button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [currentUser, setCurrentUser] = useState(() => { const s = localStorage.getItem('currentUser'); return s ? JSON.parse(s) : null; });
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('themeMode') || 'auto');
  const [darkMode, setDarkMode] = useState(() => {
    const mode = localStorage.getItem('themeMode') || 'auto';
    if (mode === 'auto') return getSystemTheme();
    return mode === 'dark';
  });
  const [fontSize, setFontSize] = useState(() => parseInt(localStorage.getItem('fontSize')) || 16);
  const [fontIndex, setFontIndex] = useState(() => parseInt(localStorage.getItem('fontIndex')) || 0);
  const [bgIndex, setBgIndex] = useState(() => parseInt(localStorage.getItem('bgIndex')) || 0);
  const [accentIndex, setAccentIndex] = useState(() => parseInt(localStorage.getItem('accentIndex')) || 0);
  const [headerColorIndex, setHeaderColorIndex] = useState(() => parseInt(localStorage.getItem('headerColorIndex')) || 0);
  const [currentView, setCurrentView] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectFilter, setProjectFilter] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState(quotes[0]);
  const [greeting, setGreeting] = useState('');
  const [newNotifications, setNewNotifications] = useState(0);
  const [archiveNotifications, setArchiveNotifications] = useState(0);
  const [showAuditPanel, setShowAuditPanel] = useState(false);
  const [showArchivePanel, setShowArchivePanel] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [auditFilter, setAuditFilter] = useState('all');
  const [sessionStart, setSessionStart] = useState(null);
  const [expandedExpense, setExpandedExpense] = useState(null);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [mapPickerTarget, setMapPickerTarget] = useState(null);

  const auditRef = useRef(null);
  const archiveRef = useRef(null);
  const settingsRef = useRef(null);

  const defaultUsers = [
    { id: 1, username: 'نايف', password: '@Lion12345', role: 'owner', active: true, createdAt: new Date().toISOString() },
    { id: 2, username: 'منوّر', password: '@Lion12345', role: 'manager', active: true, createdAt: new Date().toISOString() }
  ];

  const [users, setUsers] = useState(defaultUsers);
  const [expenses, setExpenses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [taskSections, setTaskSections] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [archivedExpenses, setArchivedExpenses] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [archivedAccounts, setArchivedAccounts] = useState([]);
  const [archivedProjects, setArchivedProjects] = useState([]);
  const [loginLog, setLoginLog] = useState([]);
  const [showPasswordId, setShowPasswordId] = useState(null);
  const [showExpenseHistory, setShowExpenseHistory] = useState(null);
  const [openFolder, setOpenFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [taskFilter, setTaskFilter] = useState('all');
  
  // عدادات الأرقام التسلسلية
  const [counters, setCounters] = useState({ E: 0, T: 0, P: 0, A: 0 });

  const emptyExpense = { name: '', amount: '', currency: 'ر.س', dueDate: '', type: 'شهري', reason: '', status: 'لم يتم الدفع', location: '', mapUrl: '', coordinates: '', totalSpent: 0 };
  const emptyTask = { title: '', description: '', dueDate: '', assignedTo: '', priority: 'متوسط الأهمية', status: 'قيد الانتظار', projectId: '', sectionId: '', location: '', mapUrl: '', coordinates: '' };
  const emptyProject = { name: '', description: '', client: '', location: '', phone: '', startDate: '', endDate: '', budget: '', status: 'جاري العمل', mapUrl: '', coordinates: '', folders: [] };
  const emptyAccount = { name: '', description: '', loginUrl: '', username: '', password: '', subscriptionDate: '', daysRemaining: 365 };
  const emptyUser = { username: '', password: '', role: 'member', active: true };
  const emptySection = { name: '', color: 'blue' };

  const [newExpense, setNewExpense] = useState(emptyExpense);
  const [newTask, setNewTask] = useState(emptyTask);
  const [newProject, setNewProject] = useState(emptyProject);
  const [newAccount, setNewAccount] = useState(emptyAccount);
  const [newUser, setNewUser] = useState(emptyUser);

  const handleDeleteNew = async (coll, id, name, type) => {
    if(confirm('هل أنت متأكد من الحذف؟')) {
       await deleteDoc(doc(db, coll, id));
       await addLog('delete', type, name, id);
       setShowModal(false);
    }
  };


  const handleAddExpenseNew = async () => {
    if (!newExpense.name || !newExpense.amount) return alert('أكمل البيانات');
    const refNum = generateRefNumber('E', counters.E + 1);
    await addDoc(collection(db, 'expenses'), { ...newExpense, refNumber: refNum, createdAt: new Date().toISOString(), createdBy: currentUser.username });
    await incrementCounter('E'); await addLog('add', 'مصروف', newExpense.name, refNum);
    setNewExpense(emptyExpense); setShowModal(false);
  };

  const handleAddTaskNew = async () => {
    if (!newTask.title) return alert('أكمل البيانات');
    const refNum = generateRefNumber('T', counters.T + 1);
    await addDoc(collection(db, 'tasks'), { ...newTask, refNumber: refNum, createdAt: new Date().toISOString(), createdBy: currentUser.username });
    await incrementCounter('T'); await addLog('add', 'مهمة', newTask.title, refNum);
    setNewTask(emptyTask); setShowModal(false);
  };

   const handleAddProjectNew = async () => {
    if (!newProject.name) return alert('أكمل البيانات');
    const refNum = generateRefNumber('P', counters.P + 1);
    await addDoc(collection(db, 'projects'), { ...newProject, refNumber: refNum, createdAt: new Date().toISOString(), createdBy: currentUser.username });
    await incrementCounter('P'); await addLog('add', 'مشروع', newProject.name, refNum);
    setNewProject(emptyProject); setShowModal(false);
  };

  const handleAddAccountNew = async () => {
    if (!newAccount.name) return alert('أكمل البيانات');
    const refNum = generateRefNumber('A', counters.A + 1);
    await addDoc(collection(db, 'accounts'), { ...newAccount, refNumber: refNum, createdAt: new Date().toISOString(), createdBy: currentUser.username });
    await incrementCounter('A'); await addLog('add', 'حساب', newAccount.name, refNum);
    setNewAccount(emptyAccount); setShowModal(false);
  };

  const [newSection, setNewSection] = useState(emptySection);

  // دالة النسخ
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => { if (themeMode === 'auto') setDarkMode(mediaQuery.matches); };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  useEffect(() => {
    if (themeMode === 'auto') setDarkMode(getSystemTheme());
    else setDarkMode(themeMode === 'dark');
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (auditRef.current && !auditRef.current.contains(e.target)) setShowAuditPanel(false);
      if (archiveRef.current && !archiveRef.current.contains(e.target)) setShowArchivePanel(false);
      if (settingsRef.current && !settingsRef.current.contains(e.target)) setShowSettingsPanel(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => { localStorage.setItem('isLoggedIn', isLoggedIn); if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser)); }, [isLoggedIn, currentUser]);
  useEffect(() => { localStorage.setItem('bgIndex', bgIndex); }, [bgIndex]);
  useEffect(() => { localStorage.setItem('accentIndex', accentIndex); }, [accentIndex]);
  useEffect(() => { localStorage.setItem('headerColorIndex', headerColorIndex); }, [headerColorIndex]);
  useEffect(() => { localStorage.setItem('fontSize', fontSize); }, [fontSize]);
  useEffect(() => { localStorage.setItem('fontIndex', fontIndex); }, [fontIndex]);
  useEffect(() => { if (currentUser) setGreeting(getRandomGreeting(currentUser.username)); }, [currentUser]);

  useEffect(() => {
    setLoading(true);
    const unsubs = [
      onSnapshot(query(collection(db, 'expenses'), orderBy('createdAt', 'desc')), s => setExpenses(s.docs.map(d => ({id:d.id, ...d.data()})))),
      onSnapshot(query(collection(db, 'tasks'), orderBy('createdAt', 'desc')), s => setTasks(s.docs.map(d => ({id:d.id, ...d.data()})))),
      onSnapshot(query(collection(db, 'projects'), orderBy('createdAt', 'desc')), s => setProjects(s.docs.map(d => ({id:d.id, ...d.data()})))),
      onSnapshot(query(collection(db, 'accounts'), orderBy('createdAt', 'desc')), s => setAccounts(s.docs.map(d => ({id:d.id, ...d.data()})))),
      onSnapshot(collection(db, 'users'), s => { const u = s.docs.map(d => ({id:d.id, ...d.data()})); setUsers(u.length ? u : [{username:'نايف', password:'@Lion12345', role:'owner', active:true}]); }),
      onSnapshot(doc(db, 'system', 'counters'), s => setCounters(s.exists() ? s.data() : { E:0, T:0, P:0, A:0 })),
      onSnapshot(query(collection(db, 'audit'), orderBy('timestamp', 'desc')), s => setAuditLog(s.docs.map(d => ({id:d.id, ...d.data()})).slice(0, 50)))
    ];
    setLoading(false);
    return () => unsubs.forEach(u => u());
  }, []);

  useEffect(() => { const t = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { if (isLoggedIn && !sessionStart) setSessionStart(Date.now()); }, [isLoggedIn]);
  useEffect(() => { setQuote(quotes[Math.floor(Math.random() * quotes.length)]); }, [currentView]);

  const save = async (d) => { 
    try { 
      await setDoc(doc(db, 'data', 'main'), { 
        users: d.users || users, expenses: d.expenses || expenses, tasks: d.tasks || tasks, 
        projects: d.projects || projects, taskSections: d.taskSections || taskSections,
        accounts: d.accounts || accounts, auditLog: d.auditLog || auditLog, 
        archivedExpenses: d.archivedExpenses || archivedExpenses, archivedTasks: d.archivedTasks || archivedTasks, 
        archivedAccounts: d.archivedAccounts || archivedAccounts, archivedProjects: d.archivedProjects || archivedProjects,
        loginLog: d.loginLog || loginLog,
        counters: d.counters || counters
      }); 
    } catch (e) { console.error(e); } 
  };

  const addLog = (action, itemType, itemName, itemId) => { 
    const actionText = action === 'add' ? 'بإضافة' : action === 'edit' ? 'بتعديل' : action === 'delete' ? 'بحذف' : action === 'restore' ? 'بإستعادة' : action === 'pay' ? 'بدفع' : action;
    const desc = `${currentUser?.username || 'النظام'} قام ${actionText} ${itemType}: ${itemName}`;
    const l = { id: `LOG${Date.now()}`, user: currentUser?.username || 'النظام', action, itemType, itemName, itemId, description: desc, timestamp: new Date().toISOString() }; 
    const nl = [l, ...auditLog]; 
    setAuditLog(nl); 
    setNewNotifications(p => p + 1); 
    if (action === 'delete') setArchiveNotifications(p => p + 1);
    return nl; 
  };

  const calcDays = (d) => d ? Math.ceil((new Date(d) - new Date()) / 86400000) : null;
  const getSessionMinutes = () => sessionStart ? Math.floor((Date.now() - sessionStart) / 60000) : 0;

  const navigateToItem = (log) => {
    if (log.action === 'delete') {
      setCurrentView('archive');
    } else {
      if (log.itemType === 'مصروف') setCurrentView('expenses');
      else if (log.itemType === 'مهمة') setCurrentView('tasks');
      else if (log.itemType === 'مشروع') setCurrentView('projects');
      else if (log.itemType === 'حساب') setCurrentView('accounts');
      else if (log.itemType === 'مستخدم') setCurrentView('users');
    }
    setShowAuditPanel(false);
  };


  const handleLogin = (e) => {
    e.preventDefault();
    const u = e.target.username.value.trim(), p = e.target.password.value.trim();
    const user = users.find(x => x.username === u && x.password === p && x.active !== false);
    if (user) {
      setCurrentUser(user); setIsLoggedIn(true); setSessionStart(Date.now());
      const ll = [{ id: `L${Date.now()}`, user: u, timestamp: new Date().toISOString(), action: 'دخول', duration: 0 }, ...loginLog];
      setLoginLog(ll); save({ loginLog: ll });
    } else alert('خطأ في البيانات');
  };

  const logout = () => {
    const duration = getSessionMinutes();
    const ll = [{ id: `L${Date.now()}`, user: currentUser.username, timestamp: new Date().toISOString(), action: 'خروج', duration }, ...loginLog];
    setLoginLog(ll); save({ loginLog: ll }); setIsLoggedIn(false); setCurrentUser(null); setSessionStart(null);
    localStorage.removeItem('isLoggedIn'); localStorage.removeItem('currentUser');
  };

  const addExpense = () => {
    if (!newExpense.name || !newExpense.amount) { alert('املأ الحقول المطلوبة'); return; }
    if (newExpense.type !== 'مرة واحدة' && !newExpense.dueDate) { alert('حدد تاريخ الاستحقاق'); return; }
    const amount = parseFloat(newExpense.amount);
    const exp = { 
      ...newExpense, 
      id: `E${Date.now()}`, 
      amount, 
      totalSpent: amount,
      createdAt: new Date().toISOString(), 
      createdBy: currentUser.username, 
      paymentHistory: [{ date: new Date().toISOString(), amount, note: 'إنشاء المصروف', by: currentUser.username }]
    };
    const ne = [...expenses, exp]; const al = addLog('add', 'مصروف', exp.name, exp.id);
    setExpenses(ne); save({ expenses: ne, auditLog: al });
    setNewExpense(emptyExpense); setShowModal(false);
  };

  const editExpense = () => {
    if (!editingItem.name || !editingItem.amount) { alert('املأ الحقول'); return; }
    const oldExp = expenses.find(e => e.id === editingItem.id);
    const newAmount = parseFloat(editingItem.amount);
    const amountDiff = newAmount - (oldExp?.amount || 0);
    
    const updatedItem = { 
      ...editingItem, 
      amount: newAmount,
      totalSpent: (editingItem.totalSpent || 0) + (amountDiff > 0 ? amountDiff : 0),
      updatedAt: new Date().toISOString() 
    };
    
    if (amountDiff !== 0) {
      updatedItem.paymentHistory = [...(editingItem.paymentHistory || []), { 
        date: new Date().toISOString(), 
        amount: amountDiff, 
        note: amountDiff > 0 ? 'تعديل المبلغ (زيادة)' : 'تعديل المبلغ (نقص)', 
        by: currentUser.username 
      }];
    }
    
    const ne = expenses.map(e => e.id === editingItem.id ? updatedItem : e);
    const al = addLog('edit', 'مصروف', editingItem.name, editingItem.id);
    setExpenses(ne); save({ expenses: ne, auditLog: al }); setEditingItem(null); setShowModal(false);
  };

  const delExpense = (exp) => {
    const ne = expenses.filter(e => e.id !== exp.id);
    const na = [{ ...exp, archivedAt: new Date().toISOString(), archivedBy: currentUser.username }, ...archivedExpenses];
    const al = addLog('delete', 'مصروف', exp.name, exp.id);
    setExpenses(ne); setArchivedExpenses(na); save({ expenses: ne, archivedExpenses: na, auditLog: al }); setShowModal(false);
  };

  const restoreExpense = (exp) => {
    const na = archivedExpenses.filter(e => e.id !== exp.id);
    const { archivedAt, archivedBy, ...rest } = exp; const ne = [...expenses, rest];
    const al = addLog('restore', 'مصروف', exp.name, exp.id);
    setExpenses(ne); setArchivedExpenses(na); save({ expenses: ne, archivedExpenses: na, auditLog: al });
  };

  const markPaid = (id) => {
    const exp = expenses.find(e => e.id === id);
    const payment = { date: new Date().toISOString(), amount: exp.amount, paidBy: currentUser.username };
    const ne = expenses.map(e => e.id === id ? { 
      ...e, 
      status: 'مدفوع', 
      paidAt: new Date().toISOString(), 
      totalSpent: (e.totalSpent || 0) + e.amount,
      paymentHistory: [...(e.paymentHistory || []), { ...payment, note: 'تم الدفع' }]
    } : e);
    const al = addLog('pay', 'مصروف', exp.name, exp.id); 
    setExpenses(ne); save({ expenses: ne, auditLog: al });
  };

  // تحديث المصروفات المتكررة
  const refreshExpenses = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let updated = false;
    
    const ne = expenses.map(e => {
      if (e.type === 'مرة واحدة' || e.status === 'مدفوع') return e;
      
      const days = calcDaysRemaining(e.dueDate, e.type);
      if (days !== null && days <= 0) {
        updated = true;
        const newDueDate = new Date(e.dueDate);
        newDueDate.setDate(newDueDate.getDate() + (e.type === 'شهري' ? 30 : 365));
        return {
          ...e,
          dueDate: newDueDate.toISOString().split('T')[0],
          status: 'لم يتم الدفع',
          totalSpent: (e.totalSpent || 0) + e.amount,
          paymentHistory: [...(e.paymentHistory || []), { 
            date: new Date().toISOString(), 
            amount: e.amount, 
            note: 'تحديث تلقائي', 
            by: 'النظام' 
          }]
        };
      }
      return e;
    });
    
    if (updated) {
      setExpenses(ne);
      save({ expenses: ne });
    } else {
    }
  };

  const addTask = () => {
    if (!newTask.title) { alert('أدخل عنوان المهمة'); return; }
    const t = { ...newTask, id: `T${Date.now()}`, createdAt: new Date().toISOString(), createdBy: currentUser.username };
    const nt = [...tasks, t]; const al = addLog('add', 'مهمة', t.title, t.id);
    setTasks(nt); save({ tasks: nt, auditLog: al });
    setNewTask(emptyTask); setShowModal(false);
  };

  const editTask = () => {
    if (!editingItem.title) { alert('أدخل عنوان المهمة'); return; }
    const nt = tasks.map(t => t.id === editingItem.id ? { ...editingItem, updatedAt: new Date().toISOString() } : t);
    const al = addLog('edit', 'مهمة', editingItem.title, editingItem.id);
    setTasks(nt); save({ tasks: nt, auditLog: al }); setEditingItem(null); setShowModal(false);
  };

  const delTask = (t) => {
    const nt = tasks.filter(x => x.id !== t.id);
    const na = [{ ...t, archivedAt: new Date().toISOString(), archivedBy: currentUser.username }, ...archivedTasks];
    const al = addLog('delete', 'مهمة', t.title, t.id);
    setTasks(nt); setArchivedTasks(na); save({ tasks: nt, archivedTasks: na, auditLog: al }); setShowModal(false);
  };

  const restoreTask = (t) => {
    const na = archivedTasks.filter(x => x.id !== t.id);
    const { archivedAt, archivedBy, ...rest } = t; const nt = [...tasks, rest];
    const al = addLog('restore', 'مهمة', t.title, t.id);
    setTasks(nt); setArchivedTasks(na); save({ tasks: nt, archivedTasks: na, auditLog: al });
  };

  const addSection = () => {
    if (!newSection.name) { alert('أدخل اسم القسم'); return; }
    const s = { id: `S${Date.now()}`, name: newSection.name, color: newSection.color, createdAt: new Date().toISOString(), createdBy: currentUser.username };
    const ns = [...taskSections, s]; const al = addLog('add', 'قسم', s.name, s.id);
    setTaskSections(ns); save({ taskSections: ns, auditLog: al });
    setNewSection(emptySection); setShowModal(false);
  };

  const addProject = () => {
    if (!newProject.name) { alert('أدخل اسم المشروع'); return; }
    const p = { ...newProject, id: `P${Date.now()}`, createdAt: new Date().toISOString(), createdBy: currentUser.username };
    const np = [...projects, p]; const al = addLog('add', 'مشروع', p.name, p.id);
    setProjects(np); save({ projects: np, auditLog: al });
    setNewProject(emptyProject); setShowModal(false);
  };

  const editProject = () => {
    if (!editingItem.name) { alert('أدخل اسم المشروع'); return; }
    const np = projects.map(p => p.id === editingItem.id ? { ...editingItem, updatedAt: new Date().toISOString() } : p);
    const al = addLog('edit', 'مشروع', editingItem.name, editingItem.id);
    setProjects(np); save({ projects: np, auditLog: al }); setEditingItem(null); setShowModal(false);
  };

  const delProject = (p) => {
    const np = projects.filter(x => x.id !== p.id);
    const na = [{ ...p, archivedAt: new Date().toISOString(), archivedBy: currentUser.username }, ...archivedProjects];
    const al = addLog('delete', 'مشروع', p.name, p.id);
    setProjects(np); setArchivedProjects(na); save({ projects: np, archivedProjects: na, auditLog: al }); setShowModal(false); setSelectedProject(null);
  };

  const restoreProject = (p) => {
    const na = archivedProjects.filter(x => x.id !== p.id);
    const { archivedAt, archivedBy, ...rest } = p; const np = [...projects, rest];
    const al = addLog('restore', 'مشروع', p.name, p.id);
    setProjects(np); setArchivedProjects(na); save({ projects: np, archivedProjects: na, auditLog: al });
  };

  const addAccount = () => {
    if (!newAccount.name || !newAccount.username) { alert('املأ الحقول'); return; }
    const a = { ...newAccount, id: `A${Date.now()}`, createdAt: new Date().toISOString(), createdBy: currentUser.username };
    const na = [...accounts, a]; const al = addLog('add', 'حساب', a.name, a.id);
    setAccounts(na); save({ accounts: na, auditLog: al });
    setNewAccount(emptyAccount); setShowModal(false);
  };

  const editAccount = () => {
    if (!editingItem.name) { alert('املأ الحقول'); return; }
    const na = accounts.map(a => a.id === editingItem.id ? { ...editingItem, updatedAt: new Date().toISOString() } : a);
    const al = addLog('edit', 'حساب', editingItem.name, editingItem.id);
    setAccounts(na); save({ accounts: na, auditLog: al }); setEditingItem(null); setShowModal(false);
  };

  const delAccount = (a) => {
    const na = accounts.filter(x => x.id !== a.id);
    const nar = [{ ...a, archivedAt: new Date().toISOString(), archivedBy: currentUser.username }, ...archivedAccounts];
    const al = addLog('delete', 'حساب', a.name, a.id);
    setAccounts(na); setArchivedAccounts(nar); save({ accounts: na, archivedAccounts: nar, auditLog: al }); setShowModal(false);
  };

  const restoreAccount = (a) => {
    const nar = archivedAccounts.filter(x => x.id !== a.id);
    const { archivedAt, archivedBy, ...rest } = a; const na = [...accounts, rest];
    const al = addLog('restore', 'حساب', a.name, a.id);
    setAccounts(na); setArchivedAccounts(nar); save({ accounts: na, archivedAccounts: nar, auditLog: al });
  };

  const addUser = () => {
    if (!newUser.username || !newUser.password) { alert('املأ الحقول'); return; }
    if (users.find(u => u.username === newUser.username)) { alert('المستخدم موجود'); return; }
    const u = { ...newUser, id: Date.now(), createdAt: new Date().toISOString(), createdBy: currentUser.username };
    const nu = [...users, u]; const al = addLog('add', 'مستخدم', u.username, u.id);
    setUsers(nu); save({ users: nu, auditLog: al });
    setNewUser(emptyUser); setShowModal(false);
  };

  const editUser = () => {
    if (!editingItem.username) { alert('املأ الحقول'); return; }
    const nu = users.map(u => u.id === editingItem.id ? { ...editingItem, updatedAt: new Date().toISOString() } : u);
    const al = addLog('edit', 'مستخدم', editingItem.username, editingItem.id);
    setUsers(nu); save({ users: nu, auditLog: al }); setEditingItem(null); setShowModal(false);
  };

  const delUser = (u) => {
    if (u.role === 'owner') { alert('لا يمكن حذف المالك'); return; }
    if (u.username === currentUser.username) { alert('لا يمكن حذف نفسك'); return; }
    const nu = users.filter(x => x.id !== u.id); const al = addLog('delete', 'مستخدم', u.username, u.id);
    setUsers(nu); save({ users: nu, auditLog: al }); setShowModal(false);
  };

  const openMapPicker = (target) => {
    setMapPickerTarget(target);
    setShowMapPicker(true);
  };

  const handleMapSelect = (url, location, coordinates) => {
    if (mapPickerTarget === 'newExpense') setNewExpense({ ...newExpense, mapUrl: url, location, coordinates });
    else if (mapPickerTarget === 'editExpense') setEditingItem({ ...editingItem, mapUrl: url, location, coordinates });
    else if (mapPickerTarget === 'newTask') setNewTask({ ...newTask, mapUrl: url, location, coordinates });
    else if (mapPickerTarget === 'editTask') setEditingItem({ ...editingItem, mapUrl: url, location, coordinates });
    else if (mapPickerTarget === 'newProject') setNewProject({ ...newProject, mapUrl: url, location, coordinates });
    else if (mapPickerTarget === 'editProject') setEditingItem({ ...editingItem, mapUrl: url, location, coordinates });
    setShowMapPicker(false);
  };

  const accent = accentColors[accentIndex];
  const currentBg = backgrounds[bgIndex];
  const currentFont = fonts[fontIndex];
  const currentHeaderColor = headerColors[headerColorIndex];
  const bg = `bg-gradient-to-br ${darkMode ? currentBg.dark : currentBg.light}`;
  // التصميم الزجاجي - شفافية أقل
  const card = darkMode ? 'bg-gray-800/80 backdrop-blur-sm border-gray-700/50' : 'bg-white/90 backdrop-blur-sm border-gray-200';
  const headerCard = darkMode ? currentHeaderColor.dark : currentHeaderColor.light;
  const headerTxt = headerColorIndex > 0 ? 'text-white' : (darkMode ? 'text-white' : 'text-gray-900');
  const headerTxtSm = headerColorIndex > 0 ? 'text-gray-300' : (darkMode ? 'text-gray-400' : 'text-gray-500');
  const cardPopup = darkMode ? 'bg-gray-800/95 backdrop-blur-md border-gray-700' : 'bg-white/95 backdrop-blur-md border-gray-200';
  const inp = darkMode ? 'bg-gray-700/80 border-gray-600 text-white placeholder-gray-400' : 'bg-white/90 border-gray-300 text-gray-900 placeholder-gray-400';
  const txt = darkMode ? 'text-white' : 'text-gray-900';
  const txtMd = darkMode ? 'text-gray-200' : 'text-gray-700';
  const txtSm = darkMode ? 'text-gray-400' : 'text-gray-500';
  const iconClass = `w-3.5 h-3.5 ${txtSm}`;

  const totalArchived = (archivedExpenses?.length || 0) + (archivedTasks?.length || 0) + (archivedAccounts?.length || 0) + (archivedProjects?.length || 0);
  const urgentExpenses = expenses.filter(e => e.status !== 'مدفوع' && e.type !== 'مرة واحدة' && calcDays(e.dueDate) <= 15 && calcDays(e.dueDate) !== null);
  const urgentTasks = tasks.filter(t => t.priority === 'عالي الأهمية' || (calcDays(t.dueDate) !== null && calcDays(t.dueDate) < 0));
  const totalExpenses = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const monthlyExpenses = expenses.filter(e => e.type === 'شهري').reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const yearlyExpenses = expenses.filter(e => e.type === 'سنوي').reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const onceExpenses = expenses.filter(e => e.type === 'مرة واحدة').reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  const formatTime12 = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // مكون الفقاعة الملونة
  const Badge = ({ type, status }) => {
    const styles = {
      // المهام
      'عالي الأهمية': 'bg-red-500/10 border-red-500/30 text-red-400',
      'مستعجل': 'bg-orange-500/10 border-orange-500/30 text-orange-400',
      'متوسط الأهمية': 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
      'منخفض الأهمية': 'bg-green-500/10 border-green-500/30 text-green-400',
      // المصروفات
      'مدفوع': 'bg-green-500/10 border-green-500/30 text-green-400',
      'لم يتم الدفع': 'bg-red-500/10 border-red-500/30 text-red-400',
      'قريباً الدفع': 'bg-orange-500/10 border-orange-500/30 text-orange-400',
      'متأخر': 'bg-red-500/10 border-red-500/30 text-red-400',
      // المشاريع
      'جاري العمل': 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      'منتهي': 'bg-green-500/10 border-green-500/30 text-green-400',
      'متوقف': 'bg-red-500/10 border-red-500/30 text-red-400',
    };
    const lightStyles = {
      'عالي الأهمية': 'bg-red-500/10 border-red-500/30 text-red-600',
      'مستعجل': 'bg-orange-500/10 border-orange-500/30 text-orange-600',
      'متوسط الأهمية': 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600',
      'منخفض الأهمية': 'bg-green-500/10 border-green-500/30 text-green-600',
      'مدفوع': 'bg-green-500/10 border-green-500/30 text-green-600',
      'لم يتم الدفع': 'bg-red-500/10 border-red-500/30 text-red-600',
      'قريباً الدفع': 'bg-orange-500/10 border-orange-500/30 text-orange-600',
      'متأخر': 'bg-red-500/10 border-red-500/30 text-red-600',
      'جاري العمل': 'bg-blue-500/10 border-blue-500/30 text-blue-600',
      'منتهي': 'bg-green-500/10 border-green-500/30 text-green-600',
      'متوقف': 'bg-red-500/10 border-red-500/30 text-red-600',
    };
    const styleClass = darkMode ? styles[status] : lightStyles[status];
    return <span className={`px-2 py-0.5 rounded-lg text-xs border ${styleClass || 'bg-gray-500/10 border-gray-500/30 text-gray-400'}`}>{status}</span>;
  };

  const InfoItem = ({ icon: Icon, children, href, phone }) => {
    if (href) {
      return (
        <a href={href} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1 ${txtSm} hover:underline`}>
          <Icon className={iconClass} />{children}
        </a>
      );
    }
    if (phone) {
      return (
        <a href={`tel:${phone}`} className={`inline-flex items-center gap-1 ${txtSm} hover:underline`}>
          <Icon className={iconClass} />{children}
        </a>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1 ${txtSm}`}>
        <Icon className={iconClass} />{children}
      </span>
    );
  };

  const Label = ({ children }) => <span className={`text-xs ${txtSm}`}>{children}</span>;

  const IconBtn = ({ onClick, icon: Icon, title, disabled }) => (
    <button onClick={onClick} disabled={disabled} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} ${disabled ? 'opacity-50' : ''}`} title={title}>
      <Icon className="w-4 h-4" />
    </button>
  );

  const hideScrollbar = { scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' };
  const hideScrollbarClass = '[&::-webkit-scrollbar]:hidden';

  if (loading) return <div className={`min-h-screen ${bg} flex items-center justify-center`} dir="rtl"><Loader className="w-12 h-12 text-blue-500 animate-spin" /></div>;


  // --- NEW HANDLERS ---

  const handleAddExpense = async () => {
    if (!newExpense.name || !newExpense.amount) return alert('أكمل البيانات');
    const refNum = generateRefNumber('E', counters.E + 1);
    await addDoc(collection(db, 'expenses'), { ...newExpense, refNumber: refNum, createdAt: new Date().toISOString(), createdBy: currentUser.username });
    await incrementCounter('E'); await addLog('add', 'مصروف', newExpense.name, refNum);
    setNewExpense(emptyExpense); setShowModal(false);
  };

  const handleAddTask = async () => {
    if (!newTask.title) return alert('أكمل البيانات');
    const refNum = generateRefNumber('T', counters.T + 1);
    await addDoc(collection(db, 'tasks'), { ...newTask, refNumber: refNum, createdAt: new Date().toISOString(), createdBy: currentUser.username });
    await incrementCounter('T'); await addLog('add', 'مهمة', newTask.title, refNum);
    setNewTask(emptyTask); setShowModal(false);
  };

   const handleAddProject = async () => {
    if (!newProject.name) return alert('أكمل البيانات');
    const refNum = generateRefNumber('P', counters.P + 1);
    await addDoc(collection(db, 'projects'), { ...newProject, refNumber: refNum, createdAt: new Date().toISOString(), createdBy: currentUser.username });
    await incrementCounter('P'); await addLog('add', 'مشروع', newProject.name, refNum);
    setNewProject(emptyProject); setShowModal(false);
  };

  const handleAddAccount = async () => {
    if (!newAccount.name) return alert('أكمل البيانات');
    const refNum = generateRefNumber('A', counters.A + 1);
    await addDoc(collection(db, 'accounts'), { ...newAccount, refNumber: refNum, createdAt: new Date().toISOString(), createdBy: currentUser.username });
    await incrementCounter('A'); await addLog('add', 'حساب', newAccount.name, refNum);
    setNewAccount(emptyAccount); setShowModal(false);
  };


if (!isLoggedIn) return (
    <div className={`min-h-screen ${bg} flex items-center justify-center p-4 relative overflow-hidden`} style={hideScrollbar} dir="rtl">
      <FinancialPattern />
      <div className={`${card} p-8 rounded-2xl shadow-2xl w-full max-w-md border relative z-10`}>
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center text-gray-700 text-2xl font-bold" style={{ backgroundColor: '#dcdddc' }}>RKZ</div>
          <h1 className={`text-xl font-bold ${txt}`}>نظام الإدارة المالية</h1>
          <p className={`text-sm ${txtSm}`}>ركائز الأولى للتعمير</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="text" name="username" placeholder="اسم المستخدم" className={`w-full p-3 border rounded-xl text-sm ${inp}`} required />
          <input type="password" name="password" placeholder="كلمة المرور" className={`w-full p-3 border rounded-xl text-sm ${inp}`} required />
          <button className={`w-full bg-gradient-to-r ${accent.gradient} text-white p-3 rounded-xl font-bold text-sm`}>دخول</button>
        </form>
        <div className="text-center mt-6"><button onClick={() => setShowVersions(true)} className="text-xs text-gray-400">v{APP_VERSION}</button></div>
      </div>
      {showVersions && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowVersions(false)}>
          <div className={`${card} p-6 rounded-2xl max-w-md w-full border`} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className={`text-lg font-bold ${txt}`}>سجل النسخ</h3><button onClick={() => setShowVersions(false)} className={txtSm}><X className="w-5 h-5" /></button></div>
            <div className={`space-y-3 max-h-80 overflow-y-auto ${hideScrollbarClass}`} style={hideScrollbar}>{versionHistory.map((v, i) => (<div key={v.version} className={`p-3 rounded-xl ${i === 0 ? `${accent.color}/20` : darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}><div className="flex justify-between mb-2"><span className={`font-bold text-sm ${txt}`}>v{v.version}</span><span className={`text-xs ${txtSm}`}>{v.date}</span></div><ul className={`text-xs ${txtSm} space-y-1`}>{v.changes.map((c, j) => <li key={j}>• {c}</li>)}</ul></div>))}</div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen ${bg} relative overflow-x-hidden pb-16`} style={{ fontSize: `${fontSize}px`, fontFamily: currentFont.value, ...hideScrollbar }} dir="rtl">
      <style>{`
        *::-webkit-scrollbar { display: none; } 
        * { scrollbar-width: none; -ms-overflow-style: none; } 
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; } 
        input[type=number] { -moz-appearance: textfield; }
        input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; ${darkMode ? 'filter: invert(1);' : ''} }
        ${darkMode ? `input[type="date"] { color-scheme: dark; }` : ''}
        input[type="date"]:not(:valid):before { content: "أدخل التاريخ"; color: ${darkMode ? '#9ca3af' : '#6b7280'}; }
        input[type="date"]:focus:before { content: none; }
      `}</style>
      <FinancialPattern />
      
      {showMapPicker && <MapPicker darkMode={darkMode} onClose={() => setShowMapPicker(false)} onSelect={handleMapSelect} />}
      
      <link href={currentFont.url} rel="stylesheet" />
      
      <div className={`${headerCard} border-b px-4 py-3 flex flex-wrap items-center justify-between sticky top-0 z-50 gap-3`}>
        <div className="flex items-center gap-3">
          <button onClick={() => { setCurrentView('dashboard'); setSelectedProject(null); }} className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-700 font-bold text-xs" style={{ backgroundColor: '#dcdddc' }}>RKZ</button>
          <div>
            <h1 className={`font-bold ${headerTxt}`}>نظام الإدارة المالية</h1>
            <p className={`${headerTxtSm}`}>ركائز الأولى للتعمير</p>
            <p className={`${headerTxtSm}`}>{currentTime.toLocaleDateString('en-US')} | {formatTime12(currentTime)} | {quote}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`${headerTxt}`}>{greeting}</span>
          <span className={`${headerTxtSm}`}>
            <Shield className="w-3 h-3 inline ml-1" />
            {currentUser.role === 'owner' ? 'المالك' : currentUser.role === 'manager' ? 'مدير' : 'عضو'}
          </span>
          <span className={`${headerTxtSm}`}>({formatNumber(getSessionMinutes())} د)</span>
          
          <div className="relative" ref={auditRef}>
            <button onClick={() => { setShowAuditPanel(!showAuditPanel); setShowArchivePanel(false); setShowSettingsPanel(false); setNewNotifications(0); }} className={`p-2 rounded-lg ${headerColorIndex > 0 ? 'hover:bg-white/10' : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}>
              <Clock className={`w-5 h-5 ${headerTxtSm}`} />
              {newNotifications > 0 && <span className={`absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center`}>{newNotifications}</span>}
            </button>
            {showAuditPanel && (
              <div className={`absolute left-0 top-12 w-80 ${cardPopup} rounded-xl shadow-2xl border z-50 max-h-80 overflow-y-auto ${hideScrollbarClass}`} style={hideScrollbar}>
                <div className={`p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between`}>
                  <span className={`font-bold text-sm ${txt}`}>آخر العمليات</span>
                  <button onClick={() => { setCurrentView('audit'); setShowAuditPanel(false); }} className={`text-xs ${accent.text}`}>عرض الكل</button>
                </div>
                <div className="p-2">{auditLog.slice(0, 8).map(l => (
                  <div key={l.id} onClick={() => navigateToItem(l)} className={`p-2 rounded-lg mb-1 cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <p className={`text-xs ${txt}`}>{l.description}</p>
                    <span className={`text-xs ${txtSm}`}>{new Date(l.timestamp).toLocaleString('en-US')}</span>
                  </div>
                ))}</div>
              </div>
            )}
          </div>

          <div className="relative" ref={archiveRef}>
            <button onClick={() => { setShowArchivePanel(!showArchivePanel); setShowAuditPanel(false); setShowSettingsPanel(false); setArchiveNotifications(0); }} className={`p-2 rounded-lg ${headerColorIndex > 0 ? 'hover:bg-white/10' : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}>
              <Archive className={`w-5 h-5 ${headerTxtSm}`} />
              {archiveNotifications > 0 && <span className={`absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center`}>{archiveNotifications}</span>}
            </button>
            {showArchivePanel && (
              <div className={`absolute left-0 top-12 w-64 ${cardPopup} rounded-xl shadow-2xl border z-50`}>
                <div className={`p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between`}>
                  <span className={`font-bold text-sm ${txt}`}>الأرشيف</span>
                  <button onClick={() => { setCurrentView('archive'); setShowArchivePanel(false); }} className={`text-xs ${accent.text}`}>عرض الكل</button>
                </div>
                <div className="p-2">
                  {[{ label: 'المصروفات', count: archivedExpenses?.length || 0 },{ label: 'المهام', count: archivedTasks?.length || 0 },{ label: 'المشاريع', count: archivedProjects?.length || 0 },{ label: 'الحسابات', count: archivedAccounts?.length || 0 }].map(item => (
                    <div key={item.label} onClick={() => { setCurrentView('archive'); setShowArchivePanel(false); }} className={`p-2 rounded-lg mb-1 flex justify-between cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                      <span className={`text-xs ${txt}`}>{item.label}</span>
                      <span className={`text-xs ${txtSm}`}>{formatNumber(item.count)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={settingsRef}>
            <button onClick={() => { setShowSettingsPanel(!showSettingsPanel); setShowAuditPanel(false); setShowArchivePanel(false); }} className={`p-2 rounded-lg ${headerColorIndex > 0 ? 'hover:bg-white/10' : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}>
              <Settings className={`w-5 h-5 ${headerTxtSm}`} />
            </button>
            {showSettingsPanel && (
              <div className={`absolute left-0 top-12 w-80 ${cardPopup} rounded-xl shadow-2xl border z-50 p-4 max-h-[80vh] overflow-y-auto ${hideScrollbarClass}`} style={hideScrollbar}>
                <h4 className={`font-bold text-sm mb-3 ${txt}`}>الإعدادات</h4>
                
                <div className="mb-4">
                  <p className={`text-xs mb-2 ${txtSm}`}>المظهر</p>
                  <div className="flex gap-2">
                    {[{ mode: 'light', icon: Sun, label: 'نهاري' }, { mode: 'dark', icon: Moon, label: 'ليلي' }, { mode: 'auto', icon: Monitor, label: 'تلقائي' }].map(t => (
                      <button key={t.mode} onClick={() => setThemeMode(t.mode)} className={`flex-1 p-2 rounded-lg flex flex-col items-center gap-1 ${themeMode === t.mode ? accent.color + ' text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                        <t.icon className="w-4 h-4" />
                        <span className="text-xs">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className={`text-xs mb-2 ${txtSm}`}>نوع الخط</p>
                  <div className="grid grid-cols-2 gap-2">
                    {fonts.map((f, i) => (
                      <button key={f.id} onClick={() => setFontIndex(i)} className={`p-2 rounded-lg text-xs ${fontIndex === i ? accent.color + ' text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`} style={{ fontFamily: f.value }}>
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className={`text-xs mb-2 ${txtSm}`}>حجم الخط</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setFontSize(f => Math.max(12, f - 2))} className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}>
                      <Type className="w-3 h-3" />
                    </button>
                    <span className={`text-sm ${txt} flex-1 text-center`}>{formatNumber(fontSize)}px</span>
                    <button onClick={() => setFontSize(f => Math.min(24, f + 2))} className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}>
                      <Type className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className={`text-xs mb-2 ${txtSm}`}>الخلفية</p>
                  <div className="flex gap-2 flex-wrap">{backgrounds.map((b, i) => (<button key={b.id} onClick={() => setBgIndex(i)} className={`w-8 h-8 rounded-lg bg-gradient-to-br ${b.dark} ${bgIndex === i ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`} title={b.name} />))}</div>
                </div>

                <div className="mb-4">
                  <p className={`text-xs mb-2 ${txtSm}`}>لون الشريط العلوي</p>
                  <div className="flex gap-2 flex-wrap">{headerColors.map((c, i) => (<button key={c.id} onClick={() => setHeaderColorIndex(i)} className={`w-8 h-8 rounded-lg ${c.sample} ${headerColorIndex === i ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`} title={c.name} />))}</div>
                </div>

                <div className="mb-4">
                  <p className={`text-xs mb-2 ${txtSm}`}>اللون الرئيسي</p>
                  <div className="flex gap-2">{accentColors.map((c, i) => (<button key={c.id} onClick={() => setAccentIndex(i)} className={`w-8 h-8 rounded-lg ${c.color} ${accentIndex === i ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`} title={c.name} />))}</div>
                </div>
              </div>
            )}
          </div>

          <button onClick={logout} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"><Power className="w-5 h-5" /></button>
        </div>
      </div>


      <div className="flex flex-col md:flex-row">
        <div className={`w-full md:w-48 ${headerCard} border-b md:border-l p-2`}>
          <nav className="flex md:flex-col gap-1 flex-wrap">
            {[{ id: 'dashboard', icon: Activity, label: 'الرئيسية' },{ id: 'expenses', icon: Wallet, label: 'المصروفات' },{ id: 'tasks', icon: CheckSquare, label: 'المهام' },{ id: 'projects', icon: FolderOpen, label: 'المشاريع' },{ id: 'accounts', icon: Users, label: 'الحسابات' },{ id: 'users', icon: UserCog, label: 'المستخدمين' },{ id: 'archive', icon: Archive, label: 'الأرشيف' },{ id: 'audit', icon: History, label: 'السجل' }].map(item => (
              <button key={item.id} onClick={() => { setCurrentView(item.id); setSelectedProject(null); setProjectFilter(null); }} className={`flex items-center gap-2 p-2 rounded-xl transition-all ${currentView === item.id ? `bg-gradient-to-r ${accent.gradient} text-white` : headerColorIndex > 0 ? 'hover:bg-white/10 text-gray-300' : (darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600')}`}>
                <item.icon className="w-4 h-4" /><span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className={`flex-1 p-4 relative z-10 overflow-y-auto ${hideScrollbarClass}`} style={hideScrollbar}>
          
          {currentView === 'dashboard' && (
            <div>
              <h2 className={`text-lg font-bold mb-4 ${txt}`}>لوحة التحكم</h2>
              
              {/* بطاقات الإحصائيات - تصميم موحد */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {/* بطاقة المصروفات */}
                <button onClick={() => setCurrentView('expenses')} className={`${card} p-4 rounded-xl border text-right hover:border-rose-500/50 transition-all`}>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className={`font-bold text-sm ${txt}`}>المصروفات</h3>
                    <span className={`text-2xl font-bold ${txt}`}>{formatNumber(expenses.length)}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 rounded-lg bg-blue-500/20"><div className="flex justify-between"><span className={`text-xs ${txt}`}>شهري</span><span className={`text-xs font-bold ${txt}`}>{formatNumber(expenses.filter(e => e.type === 'شهري').length)}</span></div></div>
                    <div className="p-2 rounded-lg bg-purple-500/20"><div className="flex justify-between"><span className={`text-xs ${txt}`}>سنوي</span><span className={`text-xs font-bold ${txt}`}>{formatNumber(expenses.filter(e => e.type === 'سنوي').length)}</span></div></div>
                    <div className="p-2 rounded-lg bg-orange-500/20"><div className="flex justify-between"><span className={`text-xs ${txt}`}>مرة واحدة</span><span className={`text-xs font-bold ${txt}`}>{formatNumber(expenses.filter(e => e.type === 'مرة واحدة').length)}</span></div></div>
                  </div>
                  <div className={`mt-3 pt-2 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <div className="flex justify-between text-xs"><span className={txtSm}>الإجمالي</span><span className={`font-bold ${txt}`}>{formatNumber(expenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0))} ر.س</span></div>
                  </div>
                </button>

                {/* بطاقة المهام */}
                <button onClick={() => setCurrentView('tasks')} className={`${card} p-4 rounded-xl border text-right hover:border-violet-500/50 transition-all`}>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className={`font-bold text-sm ${txt}`}>المهام</h3>
                    <span className={`text-2xl font-bold ${txt}`}>{formatNumber(tasks.length)}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 rounded-lg bg-red-500/20"><div className="flex justify-between"><span className={`text-xs ${txt}`}>عالي الأهمية</span><span className={`text-xs font-bold ${txt}`}>{formatNumber(tasks.filter(t => t.priority === 'عالي الأهمية').length)}</span></div></div>
                    <div className="p-2 rounded-lg bg-orange-500/20"><div className="flex justify-between"><span className={`text-xs ${txt}`}>مستعجل</span><span className={`text-xs font-bold ${txt}`}>{formatNumber(tasks.filter(t => t.priority === 'مستعجل').length)}</span></div></div>
                    <div className="p-2 rounded-lg bg-yellow-500/20"><div className="flex justify-between"><span className={`text-xs ${txt}`}>متوسط</span><span className={`text-xs font-bold ${txt}`}>{formatNumber(tasks.filter(t => t.priority === 'متوسط الأهمية').length)}</span></div></div>
                    <div className="p-2 rounded-lg bg-green-500/20"><div className="flex justify-between"><span className={`text-xs ${txt}`}>منخفض</span><span className={`text-xs font-bold ${txt}`}>{formatNumber(tasks.filter(t => t.priority === 'منخفض الأهمية').length)}</span></div></div>
                  </div>
                </button>

                {/* بطاقة المشاريع */}
                <button onClick={() => setCurrentView('projects')} className={`${card} p-4 rounded-xl border text-right hover:border-emerald-500/50 transition-all`}>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className={`font-bold text-sm ${txt}`}>المشاريع</h3>
                    <span className={`text-2xl font-bold ${txt}`}>{formatNumber(projects.length)}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 rounded-lg bg-blue-500/20"><div className="flex justify-between"><span className={`text-xs ${txt}`}>جاري العمل</span><span className={`text-xs font-bold ${txt}`}>{formatNumber(projects.filter(p => p.status === 'جاري العمل').length)}</span></div></div>
                    <div className="p-2 rounded-lg bg-green-500/20"><div className="flex justify-between"><span className={`text-xs ${txt}`}>مكتمل</span><span className={`text-xs font-bold ${txt}`}>{formatNumber(projects.filter(p => p.status === 'مكتمل').length)}</span></div></div>
                    <div className="p-2 rounded-lg bg-gray-500/20"><div className="flex justify-between"><span className={`text-xs ${txt}`}>متوقف</span><span className={`text-xs font-bold ${txt}`}>{formatNumber(projects.filter(p => p.status === 'متوقف').length)}</span></div></div>
                  </div>
                  <div className={`mt-3 pt-2 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <div className="flex justify-between text-xs"><span className={txtSm}>القيمة</span><span className={`font-bold ${txt}`}>{formatNumber(projects.reduce((s, p) => s + (parseFloat(p.budget) || 0), 0))} ر.س</span></div>
                  </div>
                </button>

                {/* بطاقة الحسابات */}
                <button onClick={() => setCurrentView('accounts')} className={`${card} p-4 rounded-xl border text-right hover:border-amber-500/50 transition-all`}>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className={`font-bold text-sm ${txt}`}>الحسابات</h3>
                    <span className={`text-2xl font-bold ${txt}`}>{formatNumber(accounts.length)}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 rounded-lg bg-green-500/20"><div className="flex justify-between"><span className={`text-xs ${txt}`}>نشط</span><span className={`text-xs font-bold ${txt}`}>{formatNumber(accounts.filter(a => { const d = calcDays(a.subscriptionDate); return d === null || d > 30; }).length)}</span></div></div>
                    <div className="p-2 rounded-lg bg-yellow-500/20"><div className="flex justify-between"><span className={`text-xs ${txt}`}>ينتهي قريباً</span><span className={`text-xs font-bold ${txt}`}>{formatNumber(accounts.filter(a => { const d = calcDays(a.subscriptionDate); return d !== null && d <= 30 && d > 0; }).length)}</span></div></div>
                    <div className="p-2 rounded-lg bg-red-500/20"><div className="flex justify-between"><span className={`text-xs ${txt}`}>منتهي</span><span className={`text-xs font-bold ${txt}`}>{formatNumber(accounts.filter(a => { const d = calcDays(a.subscriptionDate); return d !== null && d <= 0; }).length)}</span></div></div>
                  </div>
                </button>
              </div>

              {/* بنود تحتاج اهتمام - تصميم موحد */}
              {(urgentExpenses.length > 0 || urgentTasks.length > 0 || accounts.filter(a => { const d = calcDays(a.subscriptionDate); return d !== null && d <= 30 && d > 0; }).length > 0) && (
                <div className={`${card} p-4 rounded-xl border mb-4`}>
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <h3 className={`font-bold ${txt}`}>بنود تحتاج اهتمام</h3>
                  </div>
                  
                  {/* مصروفات قريبة */}
                  {urgentExpenses.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-sm font-bold ${txt}`}>مصروفات قريبة</span>
                        <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full text-xs">{urgentExpenses.length}</span>
                      </div>
                      <div className="grid md:grid-cols-3 gap-2">
                        {urgentExpenses.slice(0, 3).map(e => {
                          const d = calcDays(e.dueDate);
                          const isOverdue = d !== null && d < 0;
                          const isUrgent = d !== null && d <= 7;
                          const bgColor = isOverdue ? 'bg-red-500/20' : isUrgent ? 'bg-orange-500/20' : 'bg-yellow-500/20';
                          const textColor = isOverdue ? 'text-red-400' : isUrgent ? 'text-orange-400' : 'text-yellow-400';
                          return (
                            <div key={e.id} className={`p-2 rounded-lg ${bgColor}`}>
                              <div className="flex justify-between"><span className={`text-xs ${txt}`}>{e.name}</span><span className={`text-xs font-bold ${textColor}`}>{isOverdue ? `متأخر ${formatNumber(Math.abs(d))} يوم` : `${formatNumber(d)} يوم`}</span></div>
                              <div className="flex justify-between mt-1"><span className={`text-xs ${txtSm}`}>{formatNumber(e.amount)} ريال</span><span className={`text-xs ${txtSm}`}>استحقاق: {e.dueDate}</span></div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* مهام عالية الأهمية */}
                  {urgentTasks.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-sm font-bold ${txt}`}>مهام عالية الأهمية</span>
                        <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full text-xs">{urgentTasks.length}</span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-2">
                        {urgentTasks.slice(0, 4).map(t => {
                          const d = calcDays(t.dueDate);
                          const isHigh = t.priority === 'عالي الأهمية';
                          const bgColor = isHigh ? 'bg-red-500/20' : 'bg-orange-500/20';
                          const textColor = isHigh ? 'text-red-400' : 'text-orange-400';
                          return (
                            <div key={t.id} className={`p-2 rounded-lg ${bgColor}`}>
                              <div className="flex justify-between"><span className={`text-xs ${txt}`}>{t.title}</span><span className={`text-xs font-bold ${textColor}`}>{t.priority}</span></div>
                              <div className="flex justify-between mt-1"><span className={`text-xs ${txtSm}`}>المنفذ: {t.assignedTo || 'غير محدد'}</span>{d !== null && <span className={`text-xs ${txtSm}`}>{d < 0 ? `مضى ${formatNumber(Math.abs(d))} يوم` : `متبقي ${formatNumber(d)} يوم`}</span>}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* اشتراكات تنتهي قريباً */}
                  {accounts.filter(a => { const d = calcDays(a.subscriptionDate); return d !== null && d <= 30 && d > 0; }).length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-sm font-bold ${txt}`}>اشتراكات تنتهي قريباً</span>
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-xs">{accounts.filter(a => { const d = calcDays(a.subscriptionDate); return d !== null && d <= 30 && d > 0; }).length}</span>
                      </div>
                      <div className="grid md:grid-cols-3 gap-2">
                        {accounts.filter(a => { const d = calcDays(a.subscriptionDate); return d !== null && d <= 30 && d > 0; }).slice(0, 3).map(a => {
                          const d = calcDays(a.subscriptionDate);
                          const bgColor = d <= 7 ? 'bg-orange-500/20' : d <= 15 ? 'bg-yellow-500/20' : 'bg-green-500/20';
                          const textColor = d <= 7 ? 'text-orange-400' : d <= 15 ? 'text-yellow-400' : 'text-green-400';
                          return (
                            <div key={a.id} className={`p-2 rounded-lg ${bgColor}`}>
                              <div className="flex justify-between"><span className={`text-xs ${txt}`}>{a.name}</span><span className={`text-xs font-bold ${textColor}`}>{formatNumber(d)} يوم</span></div>
                              <div className="flex justify-between mt-1"><span className={`text-xs ${txtSm}`}>انتهاء: {a.subscriptionDate}</span></div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* الأقسام السفلية */}
              <div className="grid md:grid-cols-3 gap-4">
                {/* المصروفات القادمة */}
                <div className={`${card} p-4 rounded-xl border`}>
                  <div className="flex justify-between mb-3"><h3 className={`font-bold text-sm ${txt}`}>المصروفات القادمة</h3><button onClick={() => setCurrentView('expenses')} className={`text-xs ${accent.text}`}>الكل</button></div>
                  {expenses.filter(e => e.status !== 'مدفوع').length === 0 ? <p className={`text-center py-6 text-xs ${txtSm}`}>لا توجد مصروفات</p> : 
                    <div className="space-y-2">{expenses.filter(e => e.status !== 'مدفوع').slice(0, 4).map(e => {
                      const d = calcDays(e.dueDate);
                      return (
                        <div key={e.id} className={`p-2 rounded-lg ${d !== null && d < 0 ? 'bg-red-500/20' : d !== null && d < 7 ? 'bg-orange-500/20' : 'bg-green-500/20'}`}>
                          <div className="flex justify-between"><span className={`text-xs ${txt}`}>{e.name}</span><span className={`text-xs font-bold ${txt}`}>{formatNumber(e.amount)} ريال</span></div>
                          {d !== null && <span className={`text-xs ${txtSm}`}>{d < 0 ? `متأخر ${formatNumber(Math.abs(d))} يوم` : `${formatNumber(d)} يوم`}</span>}
                        </div>
                      );
                    })}</div>}
                </div>

                {/* المشاريع النشطة */}
                <div className={`${card} p-4 rounded-xl border`}>
                  <div className="flex justify-between mb-3"><h3 className={`font-bold text-sm ${txt}`}>المشاريع النشطة</h3><button onClick={() => setCurrentView('projects')} className={`text-xs ${accent.text}`}>الكل</button></div>
                  {projects.filter(p => p.status === 'جاري العمل').length === 0 ? <p className={`text-center py-6 text-xs ${txtSm}`}>لا توجد مشاريع</p> : 
                    <div className="space-y-2">{projects.filter(p => p.status === 'جاري العمل').slice(0, 4).map(p => (
                      <div key={p.id} className="p-2 rounded-lg bg-blue-500/20">
                        <div className="flex justify-between"><span className={`text-xs ${txt}`}>{p.name}</span><span className={`text-xs font-bold ${txt}`}>جاري العمل</span></div>
                        <span className={`text-xs ${txtSm}`}>العميل: {p.client || 'غير محدد'}</span>
                      </div>
                    ))}</div>}
                </div>

                {/* آخر العمليات */}
                <div className={`${card} p-4 rounded-xl border`}>
                  <div className="flex justify-between mb-3"><h3 className={`font-bold text-sm ${txt}`}>آخر العمليات</h3><button onClick={() => setCurrentView('audit')} className={`text-xs ${accent.text}`}>السجل</button></div>
                  {auditLog.length === 0 ? <p className={`text-center py-6 text-xs ${txtSm}`}>لا توجد عمليات</p> : 
                    <div className="space-y-2">{auditLog.slice(0, 4).map(l => (
                      <div key={l.id} className={`p-2 rounded-lg ${l.action === 'add' ? 'bg-green-500/20' : l.action === 'edit' ? 'bg-blue-500/20' : l.action === 'delete' ? 'bg-red-500/20' : 'bg-purple-500/20'}`}>
                        <div className="flex justify-between"><span className={`text-xs ${txt}`}>{l.description?.substring(0, 25) || 'عملية'}...</span><span className={`text-xs ${txtSm}`}>{l.user}</span></div>
                        <span className={`text-xs ${txtSm}`}>{new Date(l.timestamp).toLocaleDateString('en-GB')} {formatTime12(new Date(l.timestamp))}</span>
                      </div>
                    ))}</div>}
                </div>
              </div>
            </div>
          )}

          {currentView === 'expenses' && (
            <div>
              <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                <h2 className={`text-lg font-bold ${txt}`}>المصروفات</h2>
                <button onClick={() => { setNewExpense(emptyExpense); setModalType('addExp'); setShowModal(true); }} className={`flex items-center gap-1 bg-gradient-to-r ${accent.gradient} text-white px-3 py-2 rounded-xl text-xs`}><Plus className="w-4 h-4" />إضافة</button>
              </div>              {/* بطاقات الإحصائيات - تصميم موحد */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className={`${card} p-4 rounded-xl border`}>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className={`font-bold text-sm ${txt}`}>الإجمالي</h3>
                    <span className={`text-2xl font-bold ${txt}`}>{formatNumber(expenses.length)}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <div className="flex justify-between"><span className={`text-xs ${txt}`}>المبلغ</span><span className={`text-xs font-bold ${txt}`}>{formatNumber(totalExpenses)} ر.س</span></div>
                    </div>
                  </div>
                </div>
                <div className={`${card} p-4 rounded-xl border`}>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className={`font-bold text-sm ${txt}`}>الشهري</h3>
                    <span className={`text-2xl font-bold ${txt}`}>{formatNumber(expenses.filter(e => e.type === 'شهري').length)}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <div className="flex justify-between"><span className={`text-xs ${txt}`}>المبلغ</span><span className={`text-xs font-bold ${txt}`}>{formatNumber(monthlyExpenses)} ر.س</span></div>
                    </div>
                  </div>
                </div>
                <div className={`${card} p-4 rounded-xl border`}>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className={`font-bold text-sm ${txt}`}>السنوي</h3>
                    <span className={`text-2xl font-bold ${txt}`}>{formatNumber(expenses.filter(e => e.type === 'سنوي').length)}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <div className="flex justify-between"><span className={`text-xs ${txt}`}>المبلغ</span><span className={`text-xs font-bold ${txt}`}>{formatNumber(yearlyExpenses)} ر.س</span></div>
                    </div>
                  </div>
                </div>
                <div className={`${card} p-4 rounded-xl border`}>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className={`font-bold text-sm ${txt}`}>مرة واحدة</h3>
                    <span className={`text-2xl font-bold ${txt}`}>{formatNumber(expenses.filter(e => e.type === 'مرة واحدة').length)}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 rounded-lg bg-orange-500/20">
                      <div className="flex justify-between"><span className={`text-xs ${txt}`}>المبلغ</span><span className={`text-xs font-bold ${txt}`}>{formatNumber(onceExpenses)} ر.س</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {expenses.length === 0 ? (
                <div className={`${card} p-8 rounded-xl border text-center`}>
                  <Wallet className={`w-12 h-12 mx-auto mb-3 ${txtSm}`} />
                  <p className={txtSm}>لا توجد مصروفات</p>
                  <p className={`text-xs ${txtSm} mt-2`}>{getRandomEncouragement('empty')}</p>
                </div>
              ) : (
                <div className={`${card} p-4 rounded-xl border`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`font-bold ${txt}`}>قائمة المصروفات</h3>
                    <span className={`text-xs ${txtSm}`}>{formatNumber(expenses.length)} مصروف</span>
                  </div>
                  <div className="space-y-2">
                    {[...expenses].sort((a, b) => {
                      const dA = a.type !== 'مرة واحدة' ? calcDaysRemaining(a.dueDate, a.type) : 999;
                      const dB = b.type !== 'مرة واحدة' ? calcDaysRemaining(b.dueDate, b.type) : 999;
                      return (dA || 999) - (dB || 999);
                    }).map(e => {
                      const d = e.type !== 'مرة واحدة' ? calcDaysRemaining(e.dueDate, e.type) : null;
                      const color = getExpenseColor(d, e.type);
                      const daysText = d !== null ? (d < 0 ? `متأخر ${formatNumber(Math.abs(d))} يوم` : `${formatNumber(d)} يوم`) : null;
                      return (
                        <div key={e.id} className={`p-3 rounded-lg ${color.bg}`}>
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className={`text-xs font-mono px-2 py-0.5 rounded ${color.badge}`}>{e.refNumber || 'E-0000'}</span>
                                <h3 className={`font-bold ${txt}`}>{e.name}</h3>
                                {daysText && e.type !== 'مرة واحدة' && <span className={`text-xs font-bold ${color.text}`}>{daysText}</span>}
                                {e.type === 'مرة واحدة' && <span className={`text-xs font-bold ${color.text}`}>مرة واحدة</span>}
                              </div>
                              <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs ${txtSm}`}>
                                <span className={txt}>{e.type === 'شهري' ? 'شهرياً' : e.type === 'سنوي' ? 'سنوياً' : 'المبلغ'}: <span className="font-bold">{formatNumber(e.amount)}</span></span>
                                {e.type !== 'مرة واحدة' && <span className={txt}>الإجمالي: <span className="font-bold">{formatNumber(e.totalSpent || 0)}</span></span>}
                                {e.dueDate && <span>استحقاق: {e.dueDate}</span>}
                                <span>{e.createdBy}</span>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <button onClick={() => setShowExpenseHistory(showExpenseHistory === e.id ? null : e.id)} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20"><BookOpen className="w-4 h-4 text-gray-300" /></button>
                              {e.type !== 'مرة واحدة' && (
                                <button onClick={() => {
                                  const newDueDate = new Date(e.dueDate);
                                  newDueDate.setDate(newDueDate.getDate() + (e.type === 'شهري' ? 30 : 365));
                                  const payment = { date: new Date().toISOString(), amount: e.amount, note: 'تحديث يدوي', by: currentUser.username };
                                  const ne = expenses.map(ex => ex.id === e.id ? { ...ex, dueDate: newDueDate.toISOString().split('T')[0], totalSpent: (ex.totalSpent || 0) + parseFloat(ex.amount), paymentHistory: [...(ex.paymentHistory || []), payment] } : ex);
                                  const al = addLog('refresh', 'مصروف', e.name, e.id);
                                  setExpenses(ne); save({ expenses: ne, auditLog: al });
                                }} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20"><RefreshCw className="w-4 h-4 text-gray-300" /></button>
                              )}
                              <button onClick={() => { setEditingItem({ ...e }); setModalType('editExp'); setShowModal(true); }} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20"><Pencil className="w-4 h-4 text-gray-300" /></button>
                              <button onClick={() => { setSelectedItem(e); setModalType('delExp'); setShowModal(true); }} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20"><Trash2 className="w-4 h-4 text-gray-300" /></button>
                            </div>
                          </div>
                          {showExpenseHistory === e.id && (
                            <div className={`mt-3 pt-3 border-t border-white/10`}>
                              <p className={`font-bold mb-2 text-xs ${txt}`}>سجل العمليات:</p>
                              {e.paymentHistory?.length > 0 ? (
                                <div className="space-y-1">
                                  {e.paymentHistory.map((p, i) => (
                                    <div key={i} className="p-2 rounded-lg bg-white/5 flex flex-wrap gap-3 text-xs">
                                      <span className={txt}>{formatNumber(p.amount)} ريال</span>
                                      <span className={txtSm}>{new Date(p.date).toLocaleDateString('en-GB')}</span>
                                      <span className={txtSm}>{formatTime12(new Date(p.date))}</span>
                                      {p.note && <span className={txtSm}>{p.note}</span>}
                                      <span className={txtSm}>{p.by || p.paidBy}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : <p className={`text-xs ${txtSm}`}>لا توجد عمليات سابقة</p>}
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


          {currentView === 'tasks' && (
            <div>
              <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                <h2 className={`text-lg font-bold ${txt}`}>المهام</h2>
                <div className="flex gap-2">
                  <button onClick={() => { setNewSection(emptySection); setModalType('addSection'); setShowModal(true); }} className={`flex items-center gap-1 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} px-3 py-2 rounded-xl text-xs`}>
                    <Layers className="w-4 h-4" />إضافة قسم
                  </button>
                  <button onClick={() => { setNewTask(emptyTask); setModalType('addTask'); setShowModal(true); }} className={`flex items-center gap-1 bg-gradient-to-r ${accent.gradient} text-white px-3 py-2 rounded-xl text-xs`}>
                    <Plus className="w-4 h-4" />إضافة مهمة
                  </button>
                </div>
              </div>              {/* بطاقات إحصائيات المهام - تصميم موحد */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className={`${card} p-3 rounded-xl border`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs ${txtSm}`}>الإجمالي</span>
                    <CheckSquare className={`w-4 h-4 ${txtSm}`} />
                  </div>
                  <p className={`text-lg font-bold ${txt}`}>{formatNumber(tasks.length)}</p>
                  <div className="mt-2 p-1.5 rounded-lg bg-blue-500/20"><span className="text-xs text-blue-400">مهمة</span></div>
                </div>
                <div className={`${card} p-3 rounded-xl border`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs ${txtSm}`}>عالي الأهمية</span>
                    <AlertTriangle className={`w-4 h-4 text-red-400`} />
                  </div>
                  <p className={`text-lg font-bold ${txt}`}>{formatNumber(tasks.filter(t => t.priority === 'عالي الأهمية').length)}</p>
                  <div className="mt-2 p-1.5 rounded-lg bg-red-500/20"><span className="text-xs text-red-400">مهمة</span></div>
                </div>
                <div className={`${card} p-3 rounded-xl border`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs ${txtSm}`}>مستعجل</span>
                    <Clock className={`w-4 h-4 text-orange-400`} />
                  </div>
                  <p className={`text-lg font-bold ${txt}`}>{formatNumber(tasks.filter(t => t.priority === 'مستعجل').length)}</p>
                  <div className="mt-2 p-1.5 rounded-lg bg-orange-500/20"><span className="text-xs text-orange-400">مهمة</span></div>
                </div>
                <div className={`${card} p-3 rounded-xl border`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs ${txtSm}`}>متوسط + منخفض</span>
                    <Activity className={`w-4 h-4 text-green-400`} />
                  </div>
                  <p className={`text-lg font-bold ${txt}`}>{formatNumber(tasks.filter(t => t.priority === 'متوسط الأهمية' || t.priority === 'منخفض الأهمية').length)}</p>
                  <div className="mt-2 p-1.5 rounded-lg bg-green-500/20"><span className="text-xs text-green-400">مهمة</span></div>
                </div>
              </div>

              <div className="flex gap-2 mb-4 flex-wrap">
                <button onClick={() => setTaskFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs ${taskFilter === 'all' ? accent.color + ' text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>الكل</button>
                <button onClick={() => setTaskFilter('priority')} className={`px-3 py-1.5 rounded-lg text-xs ${taskFilter === 'priority' ? accent.color + ' text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>حسب الأولوية</button>
              </div>

              {projects.length > 0 && (
                <div className="flex gap-2 mb-4 flex-wrap">
                  <button onClick={() => setProjectFilter(null)} className={`px-3 py-1.5 rounded-lg text-xs ${!projectFilter ? accent.color + ' text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>كل المشاريع</button>
                  {projects.map(p => (
                    <button key={p.id} onClick={() => setProjectFilter(projectFilter === p.id ? null : p.id)} className={`px-3 py-1.5 rounded-lg text-xs ${projectFilter === p.id ? accent.color + ' text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                      {p.name} ({formatNumber(tasks.filter(t => t.projectId === p.id).length)})
                    </button>
                  ))}
                </div>
              )}

              {(projectFilter ? tasks.filter(t => t.projectId === projectFilter) : tasks).length === 0 ? (
                <div className={`${card} p-8 rounded-xl border text-center`}>
                  <CheckSquare className={`w-12 h-12 mx-auto mb-3 ${txtSm}`} />
                  <p className={txtSm}>لا توجد مهام</p>
                  <p className={`text-xs ${txtSm} mt-2`}>{getRandomEncouragement('empty')}</p>
                </div>
              ) : (
                <div className={`${card} p-4 rounded-xl border`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`font-bold ${txt}`}>قائمة المهام</h3>
                    <span className={`text-xs ${txtSm}`}>{formatNumber((projectFilter ? tasks.filter(t => t.projectId === projectFilter) : tasks).length)} مهمة</span>
                  </div>
                  <div className="space-y-2">
                    {[...(projectFilter ? tasks.filter(t => t.projectId === projectFilter) : tasks)]
                      .sort((a, b) => {
                        if (taskFilter === 'priority') {
                          const priorityOrder = { 'عالي الأهمية': 0, 'مستعجل': 1, 'متوسط الأهمية': 2, 'منخفض الأهمية': 3 };
                          return (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3);
                        }
                        return 0;
                      })
                      .map(t => {
                      const d = calcDays(t.dueDate);
                      const project = projects.find(p => p.id === t.projectId);
                      const color = getTaskColor(t.priority);
                      const daysText = d !== null ? (d < 0 ? `مضى ${formatNumber(Math.abs(d))} يوم` : `متبقي ${formatNumber(d)} يوم`) : null;
                      return (
                        <div key={t.id} className={`p-3 rounded-lg ${color.bg}`}>
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className={`text-xs font-mono px-2 py-0.5 rounded ${color.badge}`}>{t.refNumber || 'T-0000'}</span>
                                <h3 className={`font-bold ${txt}`}>{t.title}</h3>
                                <span className={`text-xs font-bold ${color.text}`}>{t.priority}</span>
                              </div>
                              {t.description && <p className={`text-xs ${txtSm} mb-1`}>{t.description}</p>}
                              <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs ${txtSm}`}>
                                {project && <span className={accent.text}>{project.name}</span>}
                                <span>أنشئ: {t.createdBy}</span>
                                {t.assignedTo && <span>المنفذ: {t.assignedTo}</span>}
                                {daysText && <span>{daysText}</span>}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <button onClick={() => { setEditingItem({ ...t }); setModalType('editTask'); setShowModal(true); }} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20"><Pencil className="w-4 h-4 text-gray-300" /></button>
                              <button onClick={() => { setSelectedItem(t); setModalType('delTask'); setShowModal(true); }} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20"><Trash2 className="w-4 h-4 text-gray-300" /></button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentView === 'projects' && !selectedProject && (
            <div>
              <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                <h2 className={`text-lg font-bold ${txt}`}>المشاريع</h2>
                <button onClick={() => { setNewProject(emptyProject); setModalType('addProject'); setShowModal(true); }} className={`flex items-center gap-1 bg-gradient-to-r ${accent.gradient} text-white px-3 py-2 rounded-xl text-xs`}><Plus className="w-4 h-4" />إضافة مشروع</button>
              </div>              {/* بطاقات إحصائيات المشاريع - تصميم موحد */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className={`${card} p-3 rounded-xl border`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs ${txtSm}`}>الإجمالي</span>
                    <FolderOpen className={`w-4 h-4 ${txtSm}`} />
                  </div>
                  <p className={`text-lg font-bold ${txt}`}>{formatNumber(projects.length)}</p>
                  <div className="mt-2 p-1.5 rounded-lg bg-blue-500/20"><span className="text-xs text-blue-400">مشروع</span></div>
                </div>
                <div className={`${card} p-3 rounded-xl border`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs ${txtSm}`}>جاري العمل</span>
                    <Activity className={`w-4 h-4 text-blue-400`} />
                  </div>
                  <p className={`text-lg font-bold ${txt}`}>{formatNumber(projects.filter(p => p.status === 'جاري العمل').length)}</p>
                  <div className="mt-2 p-1.5 rounded-lg bg-blue-500/20"><span className="text-xs text-blue-400">مشروع</span></div>
                </div>
                <div className={`${card} p-3 rounded-xl border`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs ${txtSm}`}>مكتمل</span>
                    <CheckSquare className={`w-4 h-4 text-green-400`} />
                  </div>
                  <p className={`text-lg font-bold ${txt}`}>{formatNumber(projects.filter(p => p.status === 'مكتمل').length)}</p>
                  <div className="mt-2 p-1.5 rounded-lg bg-green-500/20"><span className="text-xs text-green-400">مشروع</span></div>
                </div>
                <div className={`${card} p-3 rounded-xl border`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs ${txtSm}`}>القيمة الإجمالية</span>
                    <DollarSign className={`w-4 h-4 text-purple-400`} />
                  </div>
                  <p className={`text-lg font-bold ${txt}`}>{formatNumber(projects.reduce((s, p) => s + (parseFloat(p.budget) || 0), 0))}</p>
                  <div className="mt-2 p-1.5 rounded-lg bg-purple-500/20"><span className="text-xs text-purple-400">ريال</span></div>
                </div>
              </div>

              {projects.length === 0 ? (
                <div className={`${card} p-8 rounded-xl border text-center`}>
                  <FolderOpen className={`w-12 h-12 mx-auto mb-3 ${txtSm}`} />
                  <p className={txtSm}>لا توجد مشاريع</p>
                  <p className={`text-xs ${txtSm} mt-2`}>{getRandomEncouragement('empty')}</p>
                </div>
              ) : (
                <div className={`${card} p-4 rounded-xl border`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`font-bold ${txt}`}>قائمة المشاريع</h3>
                    <span className={`text-xs ${txtSm}`}>{formatNumber(projects.length)} مشروع</span>
                  </div>
                  <div className="space-y-2">
                    {projects.map(p => {
                      const projectTasks = tasks.filter(t => t.projectId === p.id);
                      const color = getProjectColor(p.status);
                      return (
                        <div key={p.id} onClick={() => setSelectedProject(p)} className={`p-3 rounded-lg ${color.bg} cursor-pointer hover:opacity-80 transition-all`}>
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className={`text-xs font-mono px-2 py-0.5 rounded ${color.badge}`}>{p.refNumber || 'P-0000'}</span>
                                <h3 className={`font-bold ${txt}`}>{p.name}</h3>
                                <span className={`text-xs font-bold ${color.text}`}>{p.status}</span>
                              </div>
                              {p.description && <p className={`text-xs ${txtSm} mb-1`}>{p.description.substring(0, 60)}...</p>}
                              <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs ${txtSm}`}>
                                {p.client && <span>العميل: {p.client}</span>}
                                {p.budget && <span>الميزانية: {formatNumber(p.budget)} ر.س</span>}
                                <span>{formatNumber(projectTasks.length)} مهمة</span>
                                <span>{p.createdBy}</span>
                              </div>
                            </div>
                            <ChevronLeft className={`w-5 h-5 ${txtSm}`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentView === 'projects' && selectedProject && (
            <div>
              <button onClick={() => setSelectedProject(null)} className={`flex items-center gap-1 mb-4 ${accent.text}`}><ChevronLeft className="w-4 h-4" />العودة</button>
              
              <div className={`${card} p-4 rounded-xl border mb-4`}>
                <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className={`text-lg font-bold ${txt}`}>{selectedProject.name}</h2>
                    <Badge status={selectedProject.status} />
                  </div>
                  <div className="flex gap-1">
                    <IconBtn onClick={() => { setEditingItem({ ...selectedProject }); setModalType('editProject'); setShowModal(true); }} icon={Pencil} title="تعديل" />
                    <IconBtn onClick={() => { setSelectedItem(selectedProject); setModalType('delProject'); setShowModal(true); }} icon={Trash2} title="حذف" />
                  </div>
                </div>

                {selectedProject.description && <p className={`text-xs ${txtSm} mb-4`}>{selectedProject.description}</p>}

                <div className={`text-xs ${txtSm} flex flex-wrap items-center gap-x-3 gap-y-1 mb-4`}>
                  {selectedProject.client && <InfoItem icon={User}>{selectedProject.client}</InfoItem>}
                  {selectedProject.phone && <InfoItem icon={Phone} phone={selectedProject.phone}>{selectedProject.phone}</InfoItem>}
                  {selectedProject.location && <InfoItem icon={MapPin} href={selectedProject.mapUrl}>{selectedProject.location}</InfoItem>}
                  {selectedProject.budget && <InfoItem icon={DollarSign}>{formatNumber(selectedProject.budget)} ريال</InfoItem>}
                  {selectedProject.startDate && <InfoItem icon={Calendar}>من: {selectedProject.startDate}</InfoItem>}
                  {selectedProject.endDate && <InfoItem icon={Calendar}>إلى: {selectedProject.endDate}</InfoItem>}
                  <InfoItem icon={User}>{selectedProject.createdBy}</InfoItem>
                </div>
              </div>

              <div className={`${card} p-4 rounded-xl border mb-4`}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className={`font-bold text-sm ${txt}`}>ملفات المشروع ({formatNumber(selectedProject.folders?.reduce((sum, f) => sum + (f.files?.length || 0), 0) || 0)})</h3>
                  <button onClick={() => setShowNewFolderModal(true)} className={`flex items-center gap-1 ${accent.text}`}>
                    <FolderPlus className="w-4 h-4" />إضافة مجلد
                  </button>
                </div>
                
                {(!selectedProject.folders || selectedProject.folders.length === 0) ? (
                  <p className={`text-center py-4 ${txtSm}`}>لا توجد مجلدات</p>
                ) : (
                  <div className="space-y-3">
                    {selectedProject.folders.map((folder, fi) => (
                      <div key={fi} className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <button onClick={() => setOpenFolder(openFolder === fi ? null : fi)} className={`flex items-center gap-2 ${txt} font-bold`}>
                            {openFolder === fi ? <FolderOpen className="w-5 h-5" /> : <Folder className="w-5 h-5" />}
                            {folder.name} ({folder.files?.length || 0})
                          </button>
                          <div className="flex gap-1">
                            <label className={`cursor-pointer p-1.5 rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}>
                              <Plus className="w-4 h-4" />
                              <input type="file" className="hidden" multiple onChange={(e) => {
                                const files = Array.from(e.target.files);
                                const newFolders = [...selectedProject.folders];
                                files.forEach(file => {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    const fileData = { name: file.name, url: ev.target.result, type: file.type, size: file.size, uploadedAt: new Date().toISOString(), uploadedBy: currentUser.username };
                                    newFolders[fi].files = [...(newFolders[fi].files || []), fileData];
                                    const np = projects.map(p => p.id === selectedProject.id ? { ...p, folders: newFolders } : p);
                                    setProjects(np); setSelectedProject({ ...selectedProject, folders: newFolders }); save({ projects: np });
                                  };
                                  reader.readAsDataURL(file);
                                });
                              }} />
                            </label>
                            <button onClick={() => {
                              if (window.confirm('هل تريد حذف هذا المجلد؟')) {
                                const newFolders = selectedProject.folders.filter((_, i) => i !== fi);
                                const np = projects.map(p => p.id === selectedProject.id ? { ...p, folders: newFolders } : p);
                                setProjects(np); setSelectedProject({ ...selectedProject, folders: newFolders }); save({ projects: np });
                              }
                            }} className={`p-1.5 rounded ${darkMode ? 'hover:bg-gray-600 text-red-400' : 'hover:bg-gray-200 text-red-500'}`}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {openFolder === fi && folder.files?.length > 0 && (
                          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-3">
                            {folder.files.map((f, ffi) => (
                              <div key={ffi} className="relative group">
                                {f.type?.startsWith('image/') ? (
                                  <img src={f.url} alt={f.name} onClick={() => setPreviewImage(f.url)} className="w-full h-20 object-cover rounded-lg cursor-pointer" />
                                ) : (
                                  <div className={`w-full h-20 rounded-lg flex flex-col items-center justify-center ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                                    <FileText className="w-6 h-6 mb-1" />
                                    <span className={`text-xs ${txtSm} truncate px-1 w-full text-center`}>{f.name}</span>
                                  </div>
                                )}
                                <div className={`absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all rounded-lg flex items-center justify-center gap-2`}>
                                  {f.type?.startsWith('image/') && <button onClick={() => setPreviewImage(f.url)} className="text-white text-xs">عرض</button>}
                                  <a href={f.url} download={f.name} className="text-white text-xs">تحميل</a>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={`${card} p-4 rounded-xl border`}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className={`font-bold text-sm ${txt}`}>مهام المشروع ({formatNumber(tasks.filter(t => t.projectId === selectedProject.id).length)})</h3>
                  <button onClick={() => { setNewTask({ ...emptyTask, projectId: selectedProject.id }); setModalType('addTask'); setShowModal(true); }} className={`${accent.text}`}><Plus className="w-4 h-4 inline" />إضافة مهمة</button>
                </div>
                {tasks.filter(t => t.projectId === selectedProject.id).length === 0 ? (
                  <p className={`text-center py-4 ${txtSm}`}>لا توجد مهام</p>
                ) : (
                  <div className="space-y-2">
                    {tasks.filter(t => t.projectId === selectedProject.id).map(t => (
                      <div key={t.id} className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'} flex justify-between items-center`}>
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge status={t.priority} />
                            <span className={`text-xs ${txt}`}>{t.title}</span>
                          </div>
                        </div>
                        <span className={`text-xs ${txtSm}`}>{t.dueDate}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}


          {currentView === 'accounts' && (
            <div>
              <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                <h2 className={`text-lg font-bold ${txt}`}>الحسابات</h2>
                <button onClick={() => { setNewAccount(emptyAccount); setModalType('addAcc'); setShowModal(true); }} className={`flex items-center gap-1 bg-gradient-to-r ${accent.gradient} text-white px-3 py-2 rounded-xl text-xs`}><Plus className="w-4 h-4" />إضافة</button>
              </div>              {/* بطاقات إحصائيات الحسابات - تصميم موحد */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className={`${card} p-3 rounded-xl border`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs ${txtSm}`}>الإجمالي</span>
                    <Users className={`w-4 h-4 ${txtSm}`} />
                  </div>
                  <p className={`text-lg font-bold ${txt}`}>{formatNumber(accounts.length)}</p>
                  <div className="mt-2 p-1.5 rounded-lg bg-blue-500/20"><span className="text-xs text-blue-400">حساب</span></div>
                </div>
                <div className={`${card} p-3 rounded-xl border`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs ${txtSm}`}>نشط</span>
                    <CheckCircle className={`w-4 h-4 text-green-400`} />
                  </div>
                  <p className={`text-lg font-bold ${txt}`}>{formatNumber(accounts.filter(a => { const d = calcDays(a.subscriptionDate); return d === null || d > 30; }).length)}</p>
                  <div className="mt-2 p-1.5 rounded-lg bg-green-500/20"><span className="text-xs text-green-400">حساب</span></div>
                </div>
                <div className={`${card} p-3 rounded-xl border`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs ${txtSm}`}>ينتهي قريباً</span>
                    <AlertTriangle className={`w-4 h-4 text-yellow-400`} />
                  </div>
                  <p className={`text-lg font-bold ${txt}`}>{formatNumber(accounts.filter(a => { const d = calcDays(a.subscriptionDate); return d !== null && d <= 30 && d > 0; }).length)}</p>
                  <div className="mt-2 p-1.5 rounded-lg bg-yellow-500/20"><span className="text-xs text-yellow-400">حساب</span></div>
                </div>
                <div className={`${card} p-3 rounded-xl border`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs ${txtSm}`}>منتهي</span>
                    <XCircle className={`w-4 h-4 text-red-400`} />
                  </div>
                  <p className={`text-lg font-bold ${txt}`}>{formatNumber(accounts.filter(a => { const d = calcDays(a.subscriptionDate); return d !== null && d <= 0; }).length)}</p>
                  <div className="mt-2 p-1.5 rounded-lg bg-red-500/20"><span className="text-xs text-red-400">حساب</span></div>
                </div>
              </div>

              {accounts.length === 0 ? (
                <div className={`${card} p-8 rounded-xl border text-center`}>
                  <Users className={`w-12 h-12 mx-auto mb-3 ${txtSm}`} />
                  <p className={txtSm}>لا توجد حسابات</p>
                  <p className={`text-xs ${txtSm} mt-2`}>{getRandomEncouragement('empty')}</p>
                </div>
              ) : (
                <div className={`${card} p-4 rounded-xl border`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`font-bold ${txt}`}>قائمة الحسابات</h3>
                    <span className={`text-xs ${txtSm}`}>{formatNumber(accounts.length)} حساب</span>
                  </div>
                  <div className="space-y-2">
                    {accounts.map(a => {
                      const d = calcDays(a.subscriptionDate);
                      const color = getAccountColor(d);
                      return (
                        <div key={a.id} className={`p-3 rounded-lg ${color.bg}`}>
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className={`text-xs font-mono px-2 py-0.5 rounded ${color.badge}`}>{a.refNumber || 'A-0000'}</span>
                                <h3 className={`font-bold ${txt}`}>{a.name}</h3>
                                {d !== null && <span className={`text-xs font-bold ${color.text}`}>{d <= 0 ? 'منتهي' : `${formatNumber(d)} يوم`}</span>}
                              </div>
                              <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs ${txtSm}`}>
                                <span>{a.username}</span>
                                {a.subscriptionDate && <span>انتهاء: {a.subscriptionDate}</span>}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <button onClick={() => copyToClipboard(a.username, 'اسم المستخدم')} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20"><Copy className="w-4 h-4 text-gray-300" /></button>
                              <button onClick={() => setShowPasswordId(showPasswordId === a.id ? null : a.id)} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20">{showPasswordId === a.id ? <EyeOff className="w-4 h-4 text-gray-300" /> : <Eye className="w-4 h-4 text-gray-300" />}</button>
                              {a.loginUrl && <a href={a.loginUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20"><ExternalLink className="w-4 h-4 text-gray-300" /></a>}
                              <button onClick={() => { setEditingItem({ ...a }); setModalType('editAcc'); setShowModal(true); }} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20"><Pencil className="w-4 h-4 text-gray-300" /></button>
                              <button onClick={() => { setSelectedItem(a); setModalType('delAcc'); setShowModal(true); }} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20"><Trash2 className="w-4 h-4 text-gray-300" /></button>
                            </div>
                          </div>
                          {showPasswordId === a.id && (
                            <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2">
                              <span className={`text-xs ${txt}`}>كلمة المرور: <span className="font-mono">{a.password}</span></span>
                              <button onClick={() => copyToClipboard(a.password, 'كلمة المرور')} className="p-1 rounded bg-white/10 hover:bg-white/20"><Copy className="w-3 h-3 text-gray-300" /></button>
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

          {currentView === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <h2 className={`text-lg font-bold ${txt}`}>المستخدمين</h2>
                <button onClick={() => { setNewUser(emptyUser); setModalType('addUser'); setShowModal(true); }} className={`flex items-center gap-1 bg-gradient-to-r ${accent.gradient} text-white px-3 py-2 rounded-xl text-xs`}><Plus className="w-4 h-4" />إضافة</button>
              </div>
              <div className="space-y-3">{users.map(u => (
                <div key={u.id} className={`${card} p-4 rounded-xl border`}>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className={`font-bold ${txt}`}>{u.username}</h3>
                      <p className={`${txtSm} mb-2`}>{u.role === 'owner' ? 'المالك' : u.role === 'manager' ? 'مدير' : 'عضو'}</p>
                      <div className={`${txtSm} flex flex-wrap items-center gap-x-3 gap-y-1`}>
                        <InfoItem icon={u.active !== false ? CheckCircle : XCircle}>{u.active !== false ? 'نشط' : 'معطل'}</InfoItem>
                        {u.createdBy && <InfoItem icon={User}>{u.createdBy}</InfoItem>}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <IconBtn onClick={() => { setEditingItem({ ...u }); setModalType('editUser'); setShowModal(true); }} icon={Pencil} title="تعديل" />
                      {u.role !== 'owner' && <IconBtn onClick={() => { setSelectedItem(u); setModalType('delUser'); setShowModal(true); }} icon={Trash2} title="حذف" />}
                    </div>
                  </div>
                </div>
              ))}</div>
            </div>
          )}

          {currentView === 'archive' && (
            <div>
              <h2 className={`text-lg font-bold mb-4 ${txt}`}>الأرشيف</h2>
              {totalArchived === 0 ? (
                <div className={`${card} p-8 rounded-xl border text-center`}><Archive className={`w-12 h-12 mx-auto mb-3 ${txtSm}`} /><p className={txtSm}>الأرشيف فارغ</p></div>
              ) : (
                <div className="space-y-4">
                  {archivedExpenses?.length > 0 && (
                    <div>
                      <h3 className={`font-bold text-sm mb-2 ${txt}`}>المصروفات ({formatNumber(archivedExpenses.length)})</h3>
                      {archivedExpenses.map(e => (
                        <div key={e.id} className={`${card} p-3 rounded-xl border mb-2 flex justify-between items-center`}>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`font-bold text-sm ${txt}`}>{e.name}</span>
                              <span className={`${txt}`}>{formatNumber(e.amount)} ريال</span>
                            </div>
                            <div className={`text-xs ${txtSm} flex flex-wrap items-center gap-x-3 gap-y-1 mt-1`}>
                              <span className="inline-flex items-center gap-1"><User className="w-3 h-3" />حذف بواسطة: {e.archivedBy}</span>
                              {e.archivedAt && <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(e.archivedAt).toLocaleDateString('en-GB')}</span>}
                              {e.archivedAt && <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime12(new Date(e.archivedAt))}</span>}
                            </div>
                          </div>
                          <IconBtn onClick={() => restoreExpense(e)} icon={RotateCcw} title="إستعادة" />
                        </div>
                      ))}
                    </div>
                  )}
                  {archivedTasks?.length > 0 && (
                    <div>
                      <h3 className={`font-bold text-sm mb-2 ${txt}`}>المهام ({formatNumber(archivedTasks.length)})</h3>
                      {archivedTasks.map(t => (
                        <div key={t.id} className={`${card} p-3 rounded-xl border mb-2 flex justify-between items-center`}>
                          <div className="flex-1">
                            <span className={`font-bold text-sm ${txt}`}>{t.title}</span>
                            <div className={`text-xs ${txtSm} flex flex-wrap items-center gap-x-3 gap-y-1 mt-1`}>
                              <span className="inline-flex items-center gap-1"><User className="w-3 h-3" />حذف بواسطة: {t.archivedBy}</span>
                              {t.archivedAt && <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(t.archivedAt).toLocaleDateString('en-GB')}</span>}
                              {t.archivedAt && <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime12(new Date(t.archivedAt))}</span>}
                            </div>
                          </div>
                          <IconBtn onClick={() => restoreTask(t)} icon={RotateCcw} title="إستعادة" />
                        </div>
                      ))}
                    </div>
                  )}
                  {archivedProjects?.length > 0 && (
                    <div>
                      <h3 className={`font-bold text-sm mb-2 ${txt}`}>المشاريع ({formatNumber(archivedProjects.length)})</h3>
                      {archivedProjects.map(p => (
                        <div key={p.id} className={`${card} p-3 rounded-xl border mb-2 flex justify-between items-center`}>
                          <div className="flex-1">
                            <span className={`font-bold text-sm ${txt}`}>{p.name}</span>
                            <div className={`text-xs ${txtSm} flex flex-wrap items-center gap-x-3 gap-y-1 mt-1`}>
                              <span className="inline-flex items-center gap-1"><User className="w-3 h-3" />حذف بواسطة: {p.archivedBy}</span>
                              {p.archivedAt && <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(p.archivedAt).toLocaleDateString('en-GB')}</span>}
                              {p.archivedAt && <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime12(new Date(p.archivedAt))}</span>}
                            </div>
                          </div>
                          <IconBtn onClick={() => restoreProject(p)} icon={RotateCcw} title="إستعادة" />
                        </div>
                      ))}
                    </div>
                  )}
                  {archivedAccounts?.length > 0 && (
                    <div>
                      <h3 className={`font-bold text-sm mb-2 ${txt}`}>الحسابات ({formatNumber(archivedAccounts.length)})</h3>
                      {archivedAccounts.map(a => (
                        <div key={a.id} className={`${card} p-3 rounded-xl border mb-2 flex justify-between items-center`}>
                          <div className="flex-1">
                            <span className={`font-bold text-sm ${txt}`}>{a.name}</span>
                            <div className={`text-xs ${txtSm} flex flex-wrap items-center gap-x-3 gap-y-1 mt-1`}>
                              <span className="inline-flex items-center gap-1"><User className="w-3 h-3" />حذف بواسطة: {a.archivedBy}</span>
                              {a.archivedAt && <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(a.archivedAt).toLocaleDateString('en-GB')}</span>}
                              {a.archivedAt && <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime12(new Date(a.archivedAt))}</span>}
                            </div>
                          </div>
                          <IconBtn onClick={() => restoreAccount(a)} icon={RotateCcw} title="إستعادة" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {currentView === 'audit' && (
            <div>
              <h2 className={`text-lg font-bold mb-4 ${txt}`}>السجل</h2>
              <div className="flex gap-2 mb-4">
                <button onClick={() => setAuditFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs ${auditFilter === 'all' ? accent.color + ' text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>الكل</button>
                <button onClick={() => setAuditFilter('login')} className={`px-3 py-1.5 rounded-lg text-xs ${auditFilter === 'login' ? accent.color + ' text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>تسجيل الدخول</button>
                <button onClick={() => setAuditFilter('operations')} className={`px-3 py-1.5 rounded-lg text-xs ${auditFilter === 'operations' ? accent.color + ' text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>العمليات</button>
              </div>
              <div className={`${card} rounded-xl border overflow-x-auto ${hideScrollbarClass}`} style={hideScrollbar}>
                <table className="w-full text-xs">
                  <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
                    <tr><th className={`p-3 text-right ${txt}`}>الوقت</th><th className={`p-3 text-right ${txt}`}>المستخدم</th><th className={`p-3 text-right ${txt}`}>النوع</th><th className={`p-3 text-right ${txt}`}>الوصف</th></tr>
                  </thead>
                  <tbody>
                    {(auditFilter === 'login' ? loginLog : auditFilter === 'operations' ? auditLog : [...auditLog, ...loginLog.map(l => ({ ...l, isLogin: true }))].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))).slice(0, 50).map((l, i) => (
                      <tr key={l.id} onClick={() => !l.isLogin && navigateToItem(l)} className={`${i % 2 === 0 ? (darkMode ? 'bg-gray-800/50' : 'bg-gray-50') : ''} ${!l.isLogin ? 'cursor-pointer' : ''} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                        <td className={`p-3 ${txtSm}`}>{new Date(l.timestamp).toLocaleString('en-US')}</td>
                        <td className={`p-3 ${txt}`}>{l.user}</td>
                        <td className="p-3"><span className={`px-2 py-0.5 rounded text-xs ${l.isLogin ? (l.action === 'دخول' ? 'bg-green-500' : 'bg-red-500') : accent.color} text-white`}>{l.isLogin ? l.action : l.action === 'add' ? 'إضافة' : l.action === 'edit' ? 'تعديل' : l.action === 'delete' ? 'حذف' : l.action === 'restore' ? 'إستعادة' : 'دفع'}</span></td>
                        <td className={`p-3 ${txtSm}`}>{l.description || `${l.user} قام بـ${l.action}`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="text-center py-4 text-xs text-gray-400" style={{ fontSize: '12px' }}>
            <span>ركائز الأولى للتعمير | </span>
            <button onClick={() => setShowVersions(true)} className="hover:text-gray-300">v{APP_VERSION}</button>
          </div>
        </div>
      </div>


      {showVersions && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowVersions(false)}>
          <div className={`${card} p-6 rounded-2xl max-w-md w-full border`} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className={`text-lg font-bold ${txt}`}>سجل النسخ</h3><button onClick={() => setShowVersions(false)} className={txtSm}><X className="w-5 h-5" /></button></div>
            <div className={`space-y-3 max-h-80 overflow-y-auto ${hideScrollbarClass}`} style={hideScrollbar}>{versionHistory.map((v, i) => (<div key={v.version} className={`p-3 rounded-xl ${i === 0 ? `${accent.color}/20` : darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}><div className="flex justify-between mb-2"><span className={`font-bold text-sm ${txt}`}>v{v.version}</span><span className={`text-xs ${txtSm}`}>{v.date}</span></div><ul className={`text-xs ${txtSm} space-y-1`}>{v.changes.map((c, j) => <li key={j}>• {c}</li>)}</ul></div>))}</div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className={`${card} p-6 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border ${hideScrollbarClass}`} style={hideScrollbar}>
            
            {modalType === 'delExp' && <><h3 className={`text-lg font-bold mb-4 ${txt}`}>حذف مصروف</h3><p className={`mb-6 text-sm ${txtSm}`}>هل تريد حذف "{selectedItem?.name}"؟</p><div className="flex gap-3 justify-end"><button onClick={() => setShowModal(false)} className={`px-4 py-2 rounded-xl text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>إلغاء</button><button onClick={() => delExpense(selectedItem)} className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm">حذف</button></div></>}
            {modalType === 'delTask' && <><h3 className={`text-lg font-bold mb-4 ${txt}`}>حذف مهمة</h3><p className={`mb-6 text-sm ${txtSm}`}>هل تريد حذف "{selectedItem?.title}"؟</p><div className="flex gap-3 justify-end"><button onClick={() => setShowModal(false)} className={`px-4 py-2 rounded-xl text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>إلغاء</button><button onClick={() => delTask(selectedItem)} className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm">حذف</button></div></>}
            {modalType === 'delProject' && <><h3 className={`text-lg font-bold mb-4 ${txt}`}>حذف مشروع</h3><p className={`mb-6 text-sm ${txtSm}`}>هل تريد حذف "{selectedItem?.name}"؟</p><div className="flex gap-3 justify-end"><button onClick={() => setShowModal(false)} className={`px-4 py-2 rounded-xl text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>إلغاء</button><button onClick={() => delProject(selectedItem)} className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm">حذف</button></div></>}
            {modalType === 'delAcc' && <><h3 className={`text-lg font-bold mb-4 ${txt}`}>حذف حساب</h3><p className={`mb-6 text-sm ${txtSm}`}>هل تريد حذف "{selectedItem?.name}"؟</p><div className="flex gap-3 justify-end"><button onClick={() => setShowModal(false)} className={`px-4 py-2 rounded-xl text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>إلغاء</button><button onClick={() => delAccount(selectedItem)} className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm">حذف</button></div></>}
            {modalType === 'delUser' && <><h3 className={`text-lg font-bold mb-4 ${txt}`}>حذف مستخدم</h3><p className={`mb-6 text-sm ${txtSm}`}>هل تريد حذف "{selectedItem?.username}"؟</p><div className="flex gap-3 justify-end"><button onClick={() => setShowModal(false)} className={`px-4 py-2 rounded-xl text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>إلغاء</button><button onClick={() => delUser(selectedItem)} className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm">حذف</button></div></>}

            {modalType === 'addSection' && (
              <>
                <h3 className={`text-lg font-bold mb-4 ${txt}`}>إضافة قسم</h3>
                <div className="space-y-4">
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>اسم القسم *</label><input placeholder="مثال: مهام عاجلة" value={newSection.name} onChange={e => setNewSection({ ...newSection, name: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`} /></div>
                </div>
                <div className="flex gap-3 justify-end mt-6"><button onClick={() => setShowModal(false)} className={`px-4 py-2 rounded-xl text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>إلغاء</button><button onClick={addSection} className={`px-4 py-2 bg-gradient-to-r ${accent.gradient} text-white rounded-xl text-sm`}>إضافة</button></div>
              </>
            )}

            {(modalType === 'addExp' || modalType === 'editExp') && (
              <>
                <h3 className={`text-lg font-bold mb-4 ${txt}`}>{modalType === 'addExp' ? 'إضافة مصروف' : 'تعديل مصروف'}</h3>
                <div className="space-y-4">
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>اسم المصروف *</label><input value={modalType === 'addExp' ? newExpense.name : editingItem?.name || ''} onChange={e => modalType === 'addExp' ? setNewExpense({ ...newExpense, name: e.target.value }) : setEditingItem({ ...editingItem, name: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`} /></div>
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>المبلغ *</label><input type="number" inputMode="decimal" value={modalType === 'addExp' ? newExpense.amount : editingItem?.amount || ''} onChange={e => modalType === 'addExp' ? setNewExpense({ ...newExpense, amount: e.target.value }) : setEditingItem({ ...editingItem, amount: parseFloat(e.target.value) })} className={`w-full p-3 border rounded-xl text-sm ${inp}`} /></div>
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>النوع</label><select value={modalType === 'addExp' ? newExpense.type : editingItem?.type || 'شهري'} onChange={e => modalType === 'addExp' ? setNewExpense({ ...newExpense, type: e.target.value }) : setEditingItem({ ...editingItem, type: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`}><option value="شهري">شهري</option><option value="سنوي">سنوي</option><option value="مرة واحدة">مرة واحدة</option></select></div>
                  {(modalType === 'addExp' ? newExpense.type : editingItem?.type) !== 'مرة واحدة' && <div><label className={`block text-xs mb-1 ${txtSm}`}>تاريخ الاستحقاق *</label><input type="date" value={modalType === 'addExp' ? newExpense.dueDate : editingItem?.dueDate || ''} onChange={e => modalType === 'addExp' ? setNewExpense({ ...newExpense, dueDate: e.target.value }) : setEditingItem({ ...editingItem, dueDate: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`} /></div>}
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>الوصف</label><textarea value={modalType === 'addExp' ? newExpense.reason : editingItem?.reason || ''} onChange={e => modalType === 'addExp' ? setNewExpense({ ...newExpense, reason: e.target.value }) : setEditingItem({ ...editingItem, reason: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`} rows="2" /></div>
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>الموقع</label>
                    <div className="flex gap-2">
                      <input placeholder="مثال: جدة - حي النزهة" value={modalType === 'addExp' ? newExpense.location : editingItem?.location || ''} onChange={e => modalType === 'addExp' ? setNewExpense({ ...newExpense, location: e.target.value }) : setEditingItem({ ...editingItem, location: e.target.value })} className={`flex-1 p-3 border rounded-xl text-sm ${inp}`} />
                      <button onClick={() => openMapPicker(modalType === 'addExp' ? 'newExpense' : 'editExpense')} className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}><Map className="w-5 h-5" /></button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 justify-end mt-6"><button onClick={() => { setShowModal(false); setEditingItem(null); }} className={`px-4 py-2 rounded-xl text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>إلغاء</button><button onClick={modalType === 'addExp' ? addExpense : editExpense} className={`px-4 py-2 bg-gradient-to-r ${accent.gradient} text-white rounded-xl text-sm`}>{modalType === 'addExp' ? 'إضافة' : 'حفظ'}</button></div>
              </>
            )}

            {(modalType === 'addTask' || modalType === 'editTask') && (
              <>
                <h3 className={`text-lg font-bold mb-4 ${txt}`}>{modalType === 'addTask' ? 'إضافة مهمة' : 'تعديل مهمة'}</h3>
                <div className="space-y-4">
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>عنوان المهمة *</label><input value={modalType === 'addTask' ? newTask.title : editingItem?.title || ''} onChange={e => modalType === 'addTask' ? setNewTask({ ...newTask, title: e.target.value }) : setEditingItem({ ...editingItem, title: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`} /></div>
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>الأولوية</label><select value={modalType === 'addTask' ? newTask.priority : editingItem?.priority || 'متوسط الأهمية'} onChange={e => modalType === 'addTask' ? setNewTask({ ...newTask, priority: e.target.value }) : setEditingItem({ ...editingItem, priority: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`}><option value="عالي الأهمية">عالي الأهمية</option><option value="مستعجل">مستعجل</option><option value="متوسط الأهمية">متوسط الأهمية</option><option value="منخفض الأهمية">منخفض الأهمية</option></select></div>
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>المشروع</label><select value={modalType === 'addTask' ? newTask.projectId : editingItem?.projectId || ''} onChange={e => modalType === 'addTask' ? setNewTask({ ...newTask, projectId: e.target.value }) : setEditingItem({ ...editingItem, projectId: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`}><option value="">بدون مشروع</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
                  {taskSections.length > 0 && <div><label className={`block text-xs mb-1 ${txtSm}`}>القسم</label><select value={modalType === 'addTask' ? newTask.sectionId : editingItem?.sectionId || ''} onChange={e => modalType === 'addTask' ? setNewTask({ ...newTask, sectionId: e.target.value }) : setEditingItem({ ...editingItem, sectionId: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`}><option value="">بدون قسم</option>{taskSections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>}
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>الوصف</label><textarea value={modalType === 'addTask' ? newTask.description : editingItem?.description || ''} onChange={e => modalType === 'addTask' ? setNewTask({ ...newTask, description: e.target.value }) : setEditingItem({ ...editingItem, description: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`} rows="2" /></div>
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>تاريخ التسليم</label><input type="date" value={modalType === 'addTask' ? newTask.dueDate : editingItem?.dueDate || ''} onChange={e => modalType === 'addTask' ? setNewTask({ ...newTask, dueDate: e.target.value }) : setEditingItem({ ...editingItem, dueDate: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`} /></div>
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>المسؤول</label><select value={modalType === 'addTask' ? newTask.assignedTo : editingItem?.assignedTo || ''} onChange={e => modalType === 'addTask' ? setNewTask({ ...newTask, assignedTo: e.target.value }) : setEditingItem({ ...editingItem, assignedTo: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`}><option value="">اختر</option>{users.map(u => <option key={u.id} value={u.username}>{u.username}</option>)}</select></div>
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>الموقع</label>
                    <div className="flex gap-2">
                      <input placeholder="مثال: جدة" value={modalType === 'addTask' ? newTask.location : editingItem?.location || ''} onChange={e => modalType === 'addTask' ? setNewTask({ ...newTask, location: e.target.value }) : setEditingItem({ ...editingItem, location: e.target.value })} className={`flex-1 p-3 border rounded-xl text-sm ${inp}`} />
                      <button onClick={() => openMapPicker(modalType === 'addTask' ? 'newTask' : 'editTask')} className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}><Map className="w-5 h-5" /></button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 justify-end mt-6"><button onClick={() => { setShowModal(false); setEditingItem(null); }} className={`px-4 py-2 rounded-xl text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>إلغاء</button><button onClick={modalType === 'addTask' ? addTask : editTask} className={`px-4 py-2 bg-gradient-to-r ${accent.gradient} text-white rounded-xl text-sm`}>{modalType === 'addTask' ? 'إضافة' : 'حفظ'}</button></div>
              </>
            )}

            {(modalType === 'addProject' || modalType === 'editProject') && (
              <>
                <h3 className={`text-lg font-bold mb-4 ${txt}`}>{modalType === 'addProject' ? 'إضافة مشروع' : 'تعديل مشروع'}</h3>
                <div className="space-y-4">
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>اسم المشروع *</label><input value={modalType === 'addProject' ? newProject.name : editingItem?.name || ''} onChange={e => modalType === 'addProject' ? setNewProject({ ...newProject, name: e.target.value }) : setEditingItem({ ...editingItem, name: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`} /></div>
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>الوصف</label><textarea value={modalType === 'addProject' ? newProject.description : editingItem?.description || ''} onChange={e => modalType === 'addProject' ? setNewProject({ ...newProject, description: e.target.value }) : setEditingItem({ ...editingItem, description: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`} rows="2" /></div>
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>العميل</label><input value={modalType === 'addProject' ? newProject.client : editingItem?.client || ''} onChange={e => modalType === 'addProject' ? setNewProject({ ...newProject, client: e.target.value }) : setEditingItem({ ...editingItem, client: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`} /></div>
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>رقم الهاتف</label><input value={modalType === 'addProject' ? newProject.phone : editingItem?.phone || ''} onChange={e => modalType === 'addProject' ? setNewProject({ ...newProject, phone: e.target.value }) : setEditingItem({ ...editingItem, phone: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`} /></div>
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>الموقع</label>
                    <div className="flex gap-2">
                      <input value={modalType === 'addProject' ? newProject.location : editingItem?.location || ''} onChange={e => modalType === 'addProject' ? setNewProject({ ...newProject, location: e.target.value }) : setEditingItem({ ...editingItem, location: e.target.value })} className={`flex-1 p-3 border rounded-xl text-sm ${inp}`} />
                      <button onClick={() => openMapPicker(modalType === 'addProject' ? 'newProject' : 'editProject')} className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}><Map className="w-5 h-5" /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><input type="date" placeholder="تاريخ البدء" value={modalType === 'addProject' ? newProject.startDate : editingItem?.startDate || ''} onChange={e => modalType === 'addProject' ? setNewProject({ ...newProject, startDate: e.target.value }) : setEditingItem({ ...editingItem, startDate: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`} /></div>
                    <div><input type="date" placeholder="تاريخ الانتهاء" value={modalType === 'addProject' ? newProject.endDate : editingItem?.endDate || ''} onChange={e => modalType === 'addProject' ? setNewProject({ ...newProject, endDate: e.target.value }) : setEditingItem({ ...editingItem, endDate: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`} /></div>
                  </div>
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>الميزانية</label><input type="number" inputMode="decimal" value={modalType === 'addProject' ? newProject.budget : editingItem?.budget || ''} onChange={e => modalType === 'addProject' ? setNewProject({ ...newProject, budget: e.target.value }) : setEditingItem({ ...editingItem, budget: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`} /></div>
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>الحالة</label><select value={modalType === 'addProject' ? newProject.status : editingItem?.status || 'جاري'} onChange={e => modalType === 'addProject' ? setNewProject({ ...newProject, status: e.target.value }) : setEditingItem({ ...editingItem, status: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`}><option value="جاري العمل">جاري العمل</option><option value="متوقف">متوقف</option><option value="منتهي">منتهي</option></select></div>
                </div>
                <div className="flex gap-3 justify-end mt-6"><button onClick={() => { setShowModal(false); setEditingItem(null); }} className={`px-4 py-2 rounded-xl text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>إلغاء</button><button onClick={modalType === 'addProject' ? addProject : editProject} className={`px-4 py-2 bg-gradient-to-r ${accent.gradient} text-white rounded-xl text-sm`}>{modalType === 'addProject' ? 'إضافة' : 'حفظ'}</button></div>
              </>
            )}

            {(modalType === 'addAcc' || modalType === 'editAcc') && (
              <>
                <h3 className={`text-lg font-bold mb-4 ${txt}`}>{modalType === 'addAcc' ? 'إضافة حساب' : 'تعديل حساب'}</h3>
                <div className="space-y-4">
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>اسم الحساب *</label><input value={modalType === 'addAcc' ? newAccount.name : editingItem?.name || ''} onChange={e => modalType === 'addAcc' ? setNewAccount({ ...newAccount, name: e.target.value }) : setEditingItem({ ...editingItem, name: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`} /></div>
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>الوصف</label><input value={modalType === 'addAcc' ? newAccount.description : editingItem?.description || ''} onChange={e => modalType === 'addAcc' ? setNewAccount({ ...newAccount, description: e.target.value }) : setEditingItem({ ...editingItem, description: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`} /></div>
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>رابط الدخول</label><input value={modalType === 'addAcc' ? newAccount.loginUrl : editingItem?.loginUrl || ''} onChange={e => modalType === 'addAcc' ? setNewAccount({ ...newAccount, loginUrl: e.target.value }) : setEditingItem({ ...editingItem, loginUrl: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`} /></div>
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>اسم المستخدم *</label><input value={modalType === 'addAcc' ? newAccount.username : editingItem?.username || ''} onChange={e => modalType === 'addAcc' ? setNewAccount({ ...newAccount, username: e.target.value }) : setEditingItem({ ...editingItem, username: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`} /></div>
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>كلمة المرور</label><input value={modalType === 'addAcc' ? newAccount.password : editingItem?.password || ''} onChange={e => modalType === 'addAcc' ? setNewAccount({ ...newAccount, password: e.target.value }) : setEditingItem({ ...editingItem, password: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`} /></div>
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>تاريخ الاشتراك</label><input type="date" value={modalType === 'addAcc' ? newAccount.subscriptionDate : editingItem?.subscriptionDate || ''} onChange={e => modalType === 'addAcc' ? setNewAccount({ ...newAccount, subscriptionDate: e.target.value }) : setEditingItem({ ...editingItem, subscriptionDate: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`} /></div>
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>الأيام المتبقية</label><input type="number" inputMode="numeric" value={modalType === 'addAcc' ? newAccount.daysRemaining : editingItem?.daysRemaining || ''} onChange={e => modalType === 'addAcc' ? setNewAccount({ ...newAccount, daysRemaining: parseInt(e.target.value) }) : setEditingItem({ ...editingItem, daysRemaining: parseInt(e.target.value) })} className={`w-full p-3 border rounded-xl text-sm ${inp}`} /></div>
                </div>
                <div className="flex gap-3 justify-end mt-6"><button onClick={() => { setShowModal(false); setEditingItem(null); }} className={`px-4 py-2 rounded-xl text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>إلغاء</button><button onClick={modalType === 'addAcc' ? addAccount : editAccount} className={`px-4 py-2 bg-gradient-to-r ${accent.gradient} text-white rounded-xl text-sm`}>{modalType === 'addAcc' ? 'إضافة' : 'حفظ'}</button></div>
              </>
            )}

            {(modalType === 'addUser' || modalType === 'editUser') && (
              <>
                <h3 className={`text-lg font-bold mb-4 ${txt}`}>{modalType === 'addUser' ? 'إضافة مستخدم' : 'تعديل مستخدم'}</h3>
                <div className="space-y-4">
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>اسم المستخدم *</label><input value={modalType === 'addUser' ? newUser.username : editingItem?.username || ''} onChange={e => modalType === 'addUser' ? setNewUser({ ...newUser, username: e.target.value }) : setEditingItem({ ...editingItem, username: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`} /></div>
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>كلمة المرور *</label><input type="password" value={modalType === 'addUser' ? newUser.password : editingItem?.password || ''} onChange={e => modalType === 'addUser' ? setNewUser({ ...newUser, password: e.target.value }) : setEditingItem({ ...editingItem, password: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`} /></div>
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>الصلاحية</label><select value={modalType === 'addUser' ? newUser.role : editingItem?.role || 'member'} onChange={e => modalType === 'addUser' ? setNewUser({ ...newUser, role: e.target.value }) : setEditingItem({ ...editingItem, role: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`} disabled={editingItem?.role === 'owner'}><option value="owner">المالك</option><option value="manager">مدير</option><option value="member">عضو</option></select></div>
                  <label className={`flex items-center gap-2 ${txt}`}><input type="checkbox" checked={modalType === 'addUser' ? newUser.active : editingItem?.active !== false} onChange={e => modalType === 'addUser' ? setNewUser({ ...newUser, active: e.target.checked }) : setEditingItem({ ...editingItem, active: e.target.checked })} className="w-4 h-4 rounded" /><span className="text-sm">نشط</span></label>
                </div>
                <div className="flex gap-3 justify-end mt-6"><button onClick={() => { setShowModal(false); setEditingItem(null); }} className={`px-4 py-2 rounded-xl text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>إلغاء</button><button onClick={modalType === 'addUser' ? addUser : editUser} className={`px-4 py-2 bg-gradient-to-r ${accent.gradient} text-white rounded-xl text-sm`}>{modalType === 'addUser' ? 'إضافة' : 'حفظ'}</button></div>
              </>
            )}

          </div>
        </div>
      )}

      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowNewFolderModal(false)}>
          <div className={`${cardPopup} p-6 rounded-2xl max-w-sm w-full border`} onClick={e => e.stopPropagation()}>
            <h3 className={`text-lg font-bold mb-4 ${txt}`}>إضافة مجلد جديد</h3>
            <input placeholder="اسم المجلد" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} className={`w-full p-3 border rounded-xl mb-4 ${inp}`} />
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setShowNewFolderModal(false); setNewFolderName(''); }} className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>إلغاء</button>
              <button onClick={() => {
                if (!newFolderName.trim()) { alert('أدخل اسم المجلد'); return; }
                const newFolder = { name: newFolderName, files: [], createdAt: new Date().toISOString(), createdBy: currentUser.username };
                const newFolders = [...(selectedProject.folders || []), newFolder];
                const np = projects.map(p => p.id === selectedProject.id ? { ...p, folders: newFolders } : p);
                setProjects(np); setSelectedProject({ ...selectedProject, folders: newFolders }); save({ projects: np });
                setShowNewFolderModal(false); setNewFolderName('');
              }} className={`px-4 py-2 bg-gradient-to-r ${accent.gradient} text-white rounded-xl`}>إضافة</button>
            </div>
          </div>
        </div>
      )}

      {previewImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={() => setPreviewImage(null)}>
          <button onClick={() => setPreviewImage(null)} className="absolute top-4 left-4 text-white p-2 hover:bg-white/10 rounded-lg"><X className="w-8 h-8" /></button>
          <img src={previewImage} alt="preview" className="max-w-full max-h-full object-contain rounded-lg" />
        </div>
      )}
    </div>
  );
}
