// ================================================================
// الجزء الأول - الإعدادات والاستيراد والدوال المساعدة
// ================================================================

import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, setDoc, onSnapshot, query, orderBy, runTransaction } from 'firebase/firestore';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { Calendar, CheckSquare, Users, Moon, Sun, Monitor, Plus, Archive, Clock, Activity, History, Loader, Power, Pencil, Trash2, RotateCcw, UserCog, ChevronLeft, FolderOpen, FileText, MapPin, User, X, Phone, Settings, Layers, DollarSign, Wallet, FolderPlus, AlertTriangle, Type, Search, RefreshCw, Shield, CheckCircle, XCircle, Copy, ExternalLink, Eye, EyeOff, Folder, BookOpen } from 'lucide-react';

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
const auth = getAuth(app);
const APP_VERSION = "5.4.0-SecureAuth";

const generateRefNumber = (prefix, counter) => `${prefix}-${String(counter).padStart(4, '0')}`;

const getStatusColor = (status, days = null) => {
  if (status === 'overdue' || status === 'expired' || status === 'عالي الأهمية' || status === 'delete' || (days !== null && days < 0)) {
    return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', badge: 'bg-red-500/30 text-red-300' };
  }
  if (status === 'urgent' || status === 'مستعجل' || (days !== null && days <= 7)) {
    return { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', badge: 'bg-orange-500/30 text-orange-300' };
  }
  if (status === 'soon' || status === 'متوسط الأهمية' || (days !== null && days <= 14)) {
    return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', badge: 'bg-yellow-500/30 text-yellow-300' };
  }
  if (status === 'safe' || status === 'مكتمل' || status === 'منخفض الأهمية' || status === 'active' || status === 'add') {
    return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', badge: 'bg-green-500/30 text-green-300' };
  }
  if (status === 'جاري العمل' || status === 'مرة واحدة' || status === 'edit') {
    return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', badge: 'bg-blue-500/30 text-blue-300' };
  }
  if (status === 'متوقف' || status === 'سنوي' || status === 'refresh') {
    return { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', badge: 'bg-purple-500/30 text-purple-300' };
  }
  return { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30', badge: 'bg-gray-500/30 text-gray-300' };
};

const getExpenseColor = (days, type) => {
  if (type === 'مرة واحدة') return getStatusColor('مرة واحدة');
  if (days === null) return getStatusColor('safe');
  if (days < 0) return getStatusColor('overdue');
  if (days <= 7) return getStatusColor('urgent');
  if (days <= 14) return getStatusColor('soon');
  return getStatusColor('safe');
};

const getTaskColor = (priority) => getStatusColor(priority);
const getProjectColor = (status) => getStatusColor(status);
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

const calcNextDueDate = (startDate, type) => {
  if (!startDate) return null;
  const start = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (type === 'مرة واحدة') return start;
  let nextDue = new Date(start);
  const daysToAdd = type === 'شهري' ? 30 : 365;
  while (nextDue <= today) {
    nextDue.setDate(nextDue.getDate() + daysToAdd);
  }
  return nextDue;
};

const calcDaysRemaining = (startDate, type) => {
  const nextDue = calcNextDueDate(startDate, type);
  if (!nextDue) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((nextDue - today) / (1000 * 60 * 60 * 24));
};

const fonts = [
  { id: 'cairo', name: 'Cairo', value: "'Cairo', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap' },
  { id: 'tajawal', name: 'Tajawal', value: "'Tajawal', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap' },
  { id: 'almarai', name: 'Almarai', value: "'Almarai', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Almarai:wght@400;700&display=swap' },
  { id: 'noto', name: 'Noto Kufi', value: "'Noto Kufi Arabic', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;600;700&display=swap' },
  { id: 'rubik', name: 'Rubik', value: "'Rubik', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap' },
];

const quotes = [
  "النجاح يبدأ بخطوة 🚀", "استثمر وقتك بحكمة ⏰", "التخطيط المالي مفتاح النجاح 💰", "كل يوم فرصة جديدة 🌟",
  "الإصرار يصنع المستحيل 💪", "فكر كبيراً وابدأ صغيراً 🎯", "المثابرة طريق التميز ⭐", "النظام أساس النجاح 📊",
];

const greetings = [
  (name) => `أهلاً ${name} 👋`, (name) => `مرحباً ${name} 🌟`, (name) => `هلا ${name} ✨`,
  (name) => `أهلين ${name} 💫`, (name) => `يا هلا ${name} 🎯`, (name) => `حياك الله ${name} 🌙`,
  (name) => `نورت ${name} ☀️`, (name) => `هلا والله ${name} 🔥`, (name) => `أهلاً وسهلاً ${name} 🌺`,
  (name) => `تشرفنا ${name} ⭐`, (name) => `منور ${name} 💡`, (name) => `الله يحييك ${name} 🤝`,
];

const encouragements = {
  expenses: ['إدارة المصروفات بذكاء = نجاح مضمون! 💰', 'التخطيط المالي الجيد بداية النجاح 📊'],
  tasks: ['كل مهمة منجزة خطوة نحو القمة! 🏔️', 'النجاح يبدأ بمهمة واحدة 🚀'],
  projects: ['كل مشروع ناجح يبدأ بخطة! 📋', 'الإنجازات الكبيرة تبدأ هنا 🎯'],
  accounts: ['حساباتك منظمة، أمورك ميسّرة! ✨', 'التنظيم سر النجاح 📁'],
  empty: ['ابدأ الآن وأضف أول عنصر! 🌱', 'الخطوة الأولى هي الأهم 👣']
};

const getRandomEncouragement = (type) => {
  const msgs = encouragements[type] || encouragements.empty;
  return msgs[Math.floor(Math.random() * msgs.length)];
};

const getRandomGreeting = (username) => greetings[Math.floor(Math.random() * greetings.length)](username);

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

// ================================// ================================
// الجزء الثاني - المكونات المساعدة (Components)
// ================================

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
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [position, setPosition] = useState({ lat: 24.7136, lng: 46.6753 });
  const [locationName, setLocationName] = useState('الرياض');
  const searchTimeout = useRef(null);

  const searchSuggestions = async (q) => {
    if (!q.trim() || q.length < 2) { setSuggestions([]); return; }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5`);
      setSuggestions(await res.json() || []);
      setShowSuggestions(true);
    } catch (e) { console.error(e); }
  };

  const handleSearchInput = (v) => {
    setSearch(v);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => searchSuggestions(v), 300);
  };

  const selectSuggestion = (item) => {
    setPosition({ lat: parseFloat(item.lat), lng: parseFloat(item.lon) });
    setLocationName(item.display_name.split(',').slice(0, 2).join('، '));
    setSearch(item.display_name.split(',')[0]);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
      <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl`}>
        <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
          <h3 className={`font-bold text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>تحديد الموقع</h3>
          <button onClick={onClose} className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4">
          <div className="relative mb-4 flex gap-2">
            <div className="flex-1 relative">
              <input type="text" placeholder="ابحث عن موقع" value={search} onChange={e => handleSearchInput(e.target.value)} onFocus={() => suggestions.length > 0 && setShowSuggestions(true)} className={`w-full p-3 rounded-xl border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`} />
              {showSuggestions && suggestions.length > 0 && (
                <div className={`absolute top-full left-0 right-0 mt-1 rounded-xl border shadow-lg z-50 max-h-48 overflow-y-auto ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  {suggestions.map((item, idx) => (
                    <button key={idx} onClick={() => selectSuggestion(item)} className={`w-full text-right p-3 flex items-center gap-2 ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-700'}`}>
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm truncate">{item.display_name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => searchSuggestions(search)} className={`px-4 rounded-xl ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}><Search className="w-4 h-4" /></button>
          </div>
          <div className="relative rounded-xl overflow-hidden border-2 border-gray-300" style={{ height: '300px' }}>
            <iframe src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${position.lat},${position.lng}&zoom=15`} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="map" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <MapPin className="w-10 h-10 text-red-500 drop-shadow-lg" />
            </div>
          </div>
          <div className={`mt-3 p-3 rounded-xl text-sm ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
            <p><strong>الموقع:</strong> {locationName}</p>
            <p><strong>الإحداثيات:</strong> {position.lat.toFixed(6)}, {position.lng.toFixed(6)}</p>
          </div>
        </div>
        <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex gap-3 justify-end`}>
          <button onClick={onClose} className={`px-5 py-2.5 rounded-xl text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}>إلغاء</button>
          <button onClick={() => onSelect(`https://www.google.com/maps?q=${position.lat},${position.lng}`, locationName, `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`)} className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm">تأكيد</button>
        </div>
      </div>
    </div>
  );
};

const TokyoNightBg = () => {
  useEffect(() => {
    const styleId = 'tokyo-night-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes twinkle { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(0.8); } }
        @keyframes shoot { 0% { transform: translateX(0) translateY(0); opacity: 1; } 100% { transform: translateX(-300px) translateY(300px); opacity: 0; } }
        @keyframes aurora { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 33% { transform: translate(5%, 5%) rotate(10deg); } 66% { transform: translate(-5%, 5%) rotate(-10deg); } }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const stars1Shadow = "742px 1123px #7aa2f7,1803px 608px #bb9af7,1582px 1726px #7dcfff,1676px 994px #7aa2f7,615px 537px #9ece6a,1311px 1363px #7aa2f7,1137px 1085px #bb9af7,1995px 1975px #7dcfff";
  const stars2Shadow = "1433px 1850px #7aa2f7,671px 1791px #bb9af7,1865px 1019px #7dcfff,1383px 1811px #7aa2f7,1542px 1575px #9ece6a";

  return (
    <>
      <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",background:"transparent",boxShadow:stars1Shadow,width:"1px",height:"1px",animation:"twinkle 3s ease-in-out infinite"}}/>
      </div>
      <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",background:"transparent",boxShadow:stars2Shadow,width:"2px",height:"2px",animation:"twinkle 5s ease-in-out infinite 1s"}}/>
      </div>
      {[{top:'10%',left:'85%',delay:'0s'},{top:'25%',left:'70%',delay:'2s'},{top:'40%',left:'90%',delay:'4s'}].map((star,i) => (
        <div key={`shoot-${i}`} style={{position:"fixed",top:star.top,left:star.left,width:"2px",height:"2px",background:"#7aa2f7",borderRadius:"50%",boxShadow:"0 0 10px 2px #7aa2f7",animation:"shoot 3s ease-out infinite",animationDelay:star.delay,pointerEvents:"none",zIndex:0}}/>
      ))}
      <div style={{position:"fixed",top:"-50%",left:"-50%",width:"200%",height:"200%",pointerEvents:"none",zIndex:0,opacity:0.15,background:"radial-gradient(ellipse at 20% 30%, rgba(122, 162, 247, 0.3) 0%, transparent 50%)",animation:"aurora 20s ease-in-out infinite"}}/>
    </>
  );
};

// ================================// ================================
// الجزء الثالث - المكون الرئيسي والحالات (States)
// ================================

export default function App() {
  const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Auth States
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Theme States
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('themeMode') || 'auto');
  const [darkMode, setDarkMode] = useState(() => {
    const mode = localStorage.getItem('themeMode') || 'auto';
    return mode === 'auto' ? getSystemTheme() : mode === 'dark';
  });
  const [fontSize, setFontSize] = useState(() => parseInt(localStorage.getItem('fontSize')) || 16);
  const [fontIndex, setFontIndex] = useState(() => parseInt(localStorage.getItem('fontIndex')) || 0);
  const [bgIndex, setBgIndex] = useState(() => parseInt(localStorage.getItem('bgIndex')) || 0);
  const [accentIndex, setAccentIndex] = useState(() => parseInt(localStorage.getItem('accentIndex')) || 0);
  const [headerColorIndex, setHeaderColorIndex] = useState(() => parseInt(localStorage.getItem('headerColorIndex')) || 0);
  const [tokyoNightEnabled, setTokyoNightEnabled] = useState(() => localStorage.getItem('tokyoNightEnabled') === 'true');
  
  // App States
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
  const [editingItem, setEditingItem] = useState(null);
  const [auditFilter, setAuditFilter] = useState('all');
  const [sessionStart, setSessionStart] = useState(null);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [mapPickerTarget, setMapPickerTarget] = useState(null);
  const [showExpenseHistory, setShowExpenseHistory] = useState(null);
  const [openFolder, setOpenFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [taskFilter, setTaskFilter] = useState('all');
  const [showPasswordId, setShowPasswordId] = useState(null);

  // Refs
  const auditRef = useRef(null);
  const archiveRef = useRef(null);
  const settingsRef = useRef(null);

  // Data States
  const [users, setUsers] = useState([]);
  // نظام المصادقة الآمن - Firebase Auth State Listener useEffect(() => {   const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {     if (firebaseUser) {       try {         const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));         if (userDoc.exists()) {           const userData = userDoc.data();           if (userData.status === 'approved') {             setCurrentUser({ ...userData, uid: firebaseUser.uid });             setIsLoggedIn(true);             setSessionStart(Date.now());           } else {             await signOut(auth);             setIsLoggedIn(false);             setCurrentUser(null);           }         } else {           await signOut(auth);           setIsLoggedIn(false);           setCurrentUser(null);         }       } catch (error) {         console.error('Auth check error:', error);         await signOut(auth);         setIsLoggedIn(false);         setCurrentUser(null);       }     } else {       setIsLoggedIn(false);       setCurrentUser(null);     }     setAuthLoading(false);   });   return () => unsubscribe(); }, []);
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
  const [counters, setCounters] = useState({ E: 0, T: 0, P: 0, A: 0 });

  // Empty States for Forms
  const emptyExpense = { name: '', amount: '', currency: 'ر.س', dueDate: '', type: 'شهري', reason: '', status: 'لم يتم الدفع', location: '', mapUrl: '', coordinates: '', totalSpent: 0 };
  const emptyTask = { title: '', description: '', dueDate: '', assignedTo: '', priority: 'متوسط الأهمية', status: 'قيد الانتظار', projectId: '', sectionId: '', location: '', mapUrl: '', coordinates: '' };
  const emptyProject = { name: '', description: '', client: '', location: '', phone: '', startDate: '', endDate: '', budget: '', status: 'جاري العمل', mapUrl: '', coordinates: '', folders: [] };
  const emptyAccount = { name: '', description: '', loginUrl: '', username: '', password: '', subscriptionDate: '', daysRemaining: 365 };
  const emptySection = { name: '', color: 'blue' };

  // Form States
  const [newExpense, setNewExpense] = useState(emptyExpense);
  const [newTask, setNewTask] = useState(emptyTask);
  const [newProject, setNewProject] = useState(emptyProject);
  const [newAccount, setNewAccount] = useState(emptyAccount);
  const [newSection, setNewSection] = useState(emptySection);

  // Helper Functions
  const copyToClipboard = (text) => navigator.clipboard.writeText(text);
  const calcDays = (d) => d ? Math.ceil((new Date(d) - new Date()) / 86400000) : null;
  const getSessionMinutes = () => sessionStart ? Math.floor((Date.now() - sessionStart) / 60000) : 0;
  const formatTime12 = (date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const incrementCounter = async (key) => {
    await runTransaction(db, async (t) => {
      const ref = doc(db, 'system', 'counters');
      const docVal = await t.get(ref);
      t.set(ref, { ...docVal.data(), [key]: (docVal.data()?.[key] || 0) + 1 }, { merge: true });
    });
  };

  const addLog = async (action, type, name, itemId) => {
    const actionText = action === 'add' ? 'بإضافة' : action === 'edit' ? 'بتعديل' : action === 'delete' ? 'بحذف' : action === 'restore' ? 'بإستعادة' : action === 'pay' ? 'بدفع' : action;
    const desc = `${currentUser?.name || 'النظام'} قام ${actionText} ${type}: ${name}`;
    try {
      await addDoc(collection(db, 'audit'), { user: currentUser?.name || 'النظام', action, itemType: type, itemName: name, itemId, description: desc, timestamp: new Date().toISOString() });
      setNewNotifications(p => p + 1);
      if (action === 'delete') setArchiveNotifications(p => p + 1);
    } catch (e) { console.error(e); }
  };

// ================================// ================================
// الجزء الرابع - useEffect والمصادقة
// ================================

  // Firebase Auth State Listener - المصادقة الآمنة
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.status === 'approved') {
              setCurrentUser({ ...userData, uid: firebaseUser.uid });
              setIsLoggedIn(true);
              setSessionStart(Date.now());
            } else {
              await signOut(auth);
              setIsLoggedIn(false);
              setCurrentUser(null);
            }
          } else {
            await signOut(auth);
            setIsLoggedIn(false);
            setCurrentUser(null);
          }
        } catch (error) {
          console.error('Auth check error:', error);
          await signOut(auth);
          setIsLoggedIn(false);
          setCurrentUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Theme Effects
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

  // Storage Effects
  useEffect(() => { localStorage.setItem('bgIndex', bgIndex); }, [bgIndex]);
  useEffect(() => { localStorage.setItem('accentIndex', accentIndex); }, [accentIndex]);
  useEffect(() => { localStorage.setItem('headerColorIndex', headerColorIndex); }, [headerColorIndex]);
  useEffect(() => { localStorage.setItem('fontSize', fontSize); }, [fontSize]);
  useEffect(() => { localStorage.setItem('fontIndex', fontIndex); }, [fontIndex]);
  useEffect(() => { if (currentUser) setGreeting(getRandomGreeting(currentUser.name || currentUser.email)); }, [currentUser]);

  // Data Loading from Firebase
  useEffect(() => {
    if (!isLoggedIn) return;
    setLoading(true);
    const unsubs = [
      onSnapshot(query(collection(db, 'expenses'), orderBy('createdAt', 'desc')), s => setExpenses(s.docs.map(d => ({id:d.id, ...d.data()})))),
      onSnapshot(query(collection(db, 'tasks'), orderBy('createdAt', 'desc')), s => setTasks(s.docs.map(d => ({id:d.id, ...d.data()})))),
      onSnapshot(query(collection(db, 'projects'), orderBy('createdAt', 'desc')), s => setProjects(s.docs.map(d => ({id:d.id, ...d.data()})))),
      onSnapshot(query(collection(db, 'accounts'), orderBy('createdAt', 'desc')), s => setAccounts(s.docs.map(d => ({id:d.id, ...d.data()})))),
      onSnapshot(collection(db, 'users'), s => { 
        const allUsers = s.docs.map(d => ({id:d.id, ...d.data()})); 
        setUsers(allUsers.filter(u => u.status === 'approved'));
        setPendingUsers(allUsers.filter(u => u.status === 'pending'));
      }),
      onSnapshot(doc(db, 'system', 'counters'), s => setCounters(s.exists() ? s.data() : { E:0, T:0, P:0, A:0 })),
      onSnapshot(query(collection(db, 'audit'), orderBy('timestamp', 'desc')), s => setAuditLog(s.docs.map(d => ({id:d.id, ...d.data()})).slice(0, 50))),
      onSnapshot(query(collection(db, 'archivedExpenses'), orderBy('archivedAt', 'desc')), s => setArchivedExpenses(s.docs.map(d => ({id:d.id, ...d.data()})))),
      onSnapshot(query(collection(db, 'archivedTasks'), orderBy('archivedAt', 'desc')), s => setArchivedTasks(s.docs.map(d => ({id:d.id, ...d.data()})))),
      onSnapshot(query(collection(db, 'archivedProjects'), orderBy('archivedAt', 'desc')), s => setArchivedProjects(s.docs.map(d => ({id:d.id, ...d.data()})))),
      onSnapshot(query(collection(db, 'archivedAccounts'), orderBy('archivedAt', 'desc')), s => setArchivedAccounts(s.docs.map(d => ({id:d.id, ...d.data()})))),
    ];
    setLoading(false);
    return () => unsubs.forEach(u => u());
  }, [isLoggedIn]);

  useEffect(() => { const t = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { setQuote(quotes[Math.floor(Math.random() * quotes.length)]); }, [currentView]);

  // Auth Functions
  // موافقة/رفض المستخدمين الجدد const approveUser = async (user) => {   try {     await updateDoc(doc(db, 'users', user.id), {       status: 'approved',       approvedDate: new Date().toISOString(),       approvedBy: currentUser.uid     });     alert('✅ تمت الموافقة على ' + user.name);   } catch (error) {     console.error(error);     alert('حدث خطأ');   } };  const rejectUser = async (user) => {   if (!window.confirm('هل تريد رفض طلب ' + user.name + '؟')) return;   try {     await updateDoc(doc(db, 'users', user.id), {       status: 'rejected',       rejectedDate: new Date().toISOString(),       rejectedBy: currentUser.uid     });     alert('❌ تم رفض ' + user.name);   } catch (error) {     console.error(error);     alert('حدث خطأ');   } };
    await signOut(auth);
    setIsLoggedIn(false);
    setCurrentUser(null);
    setSessionStart(null);
  };

  const toggleTokyoNight = () => {
    const newValue = !tokyoNightEnabled;
    setTokyoNightEnabled(newValue);
    localStorage.setItem('tokyoNightEnabled', newValue);
  };

// ================================// ================================
// الجزء الخامس - دوال CRUD (إضافة/تعديل/حذف)
// ================================

  // CRUD Operations - Expenses
  const addExpense = async () => {
    if (!newExpense.name || !newExpense.amount) { alert('املأ الحقول المطلوبة'); return; }
    const refNum = generateRefNumber('E', counters.E + 1);
    const exp = { ...newExpense, refNumber: refNum, amount: parseFloat(newExpense.amount), totalSpent: parseFloat(newExpense.amount), createdAt: new Date().toISOString(), createdBy: currentUser.name, paymentHistory: [{ date: new Date().toISOString(), amount: parseFloat(newExpense.amount), note: 'إنشاء المصروف', by: currentUser.name }] };
    await addDoc(collection(db, 'expenses'), exp);
    await incrementCounter('E');
    await addLog('add', 'مصروف', exp.name, refNum);
    setNewExpense(emptyExpense);
    setShowModal(false);
  };

  const editExpense = async () => {
    if (!editingItem.name || !editingItem.amount) { alert('املأ الحقول'); return; }
    await updateDoc(doc(db, 'expenses', editingItem.id), { ...editingItem, amount: parseFloat(editingItem.amount), updatedAt: new Date().toISOString() });
    await addLog('edit', 'مصروف', editingItem.name, editingItem.id);
    setEditingItem(null);
    setShowModal(false);
  };

  const delExpense = async (exp) => {
    await deleteDoc(doc(db, 'expenses', exp.id));
    await addDoc(collection(db, 'archivedExpenses'), { ...exp, archivedAt: new Date().toISOString(), archivedBy: currentUser.name });
    await addLog('delete', 'مصروف', exp.name, exp.id);
    setShowModal(false);
  };

  const restoreExpense = async (exp) => {
    const { archivedAt, archivedBy, id, ...rest } = exp;
    await addDoc(collection(db, 'expenses'), rest);
    await deleteDoc(doc(db, 'archivedExpenses', exp.id));
    await addLog('restore', 'مصروف', exp.name, exp.id);
  };

  // CRUD Operations - Tasks
  const addTask = async () => {
    if (!newTask.title) { alert('أدخل عنوان المهمة'); return; }
    const refNum = generateRefNumber('T', counters.T + 1);
    const t = { ...newTask, refNumber: refNum, createdAt: new Date().toISOString(), createdBy: currentUser.name };
    await addDoc(collection(db, 'tasks'), t);
    await incrementCounter('T');
    await addLog('add', 'مهمة', t.title, refNum);
    setNewTask(emptyTask);
    setShowModal(false);
  };

  const editTask = async () => {
    if (!editingItem.title) { alert('أدخل عنوان المهمة'); return; }
    await updateDoc(doc(db, 'tasks', editingItem.id), { ...editingItem, updatedAt: new Date().toISOString() });
    await addLog('edit', 'مهمة', editingItem.title, editingItem.id);
    setEditingItem(null);
    setShowModal(false);
  };

  const delTask = async (t) => {
    await deleteDoc(doc(db, 'tasks', t.id));
    await addDoc(collection(db, 'archivedTasks'), { ...t, archivedAt: new Date().toISOString(), archivedBy: currentUser.name });
    await addLog('delete', 'مهمة', t.title, t.id);
    setShowModal(false);
  };

  const restoreTask = async (t) => {
    const { archivedAt, archivedBy, id, ...rest } = t;
    await addDoc(collection(db, 'tasks'), rest);
    await deleteDoc(doc(db, 'archivedTasks', t.id));
    await addLog('restore', 'مهمة', t.title, t.id);
  };

  // CRUD Operations - Projects
  const addProject = async () => {
    if (!newProject.name) { alert('أدخل اسم المشروع'); return; }
    const refNum = generateRefNumber('P', counters.P + 1);
    const p = { ...newProject, refNumber: refNum, createdAt: new Date().toISOString(), createdBy: currentUser.name };
    await addDoc(collection(db, 'projects'), p);
    await incrementCounter('P');
    await addLog('add', 'مشروع', p.name, refNum);
    setNewProject(emptyProject);
    setShowModal(false);
  };

  const editProject = async () => {
    if (!editingItem.name) { alert('أدخل اسم المشروع'); return; }
    await updateDoc(doc(db, 'projects', editingItem.id), { ...editingItem, updatedAt: new Date().toISOString() });
    await addLog('edit', 'مشروع', editingItem.name, editingItem.id);
    setEditingItem(null);
    setShowModal(false);
  };

  const delProject = async (p) => {
    await deleteDoc(doc(db, 'projects', p.id));
    await addDoc(collection(db, 'archivedProjects'), { ...p, archivedAt: new Date().toISOString(), archivedBy: currentUser.name });
    await addLog('delete', 'مشروع', p.name, p.id);
    setShowModal(false);
    setSelectedProject(null);
  };

  const restoreProject = async (p) => {
    const { archivedAt, archivedBy, id, ...rest } = p;
    await addDoc(collection(db, 'projects'), rest);
    await deleteDoc(doc(db, 'archivedProjects', p.id));
    await addLog('restore', 'مشروع', p.name, p.id);
  };

  // CRUD Operations - Accounts
  const addAccount = async () => {
    if (!newAccount.name || !newAccount.username) { alert('املأ الحقول'); return; }
    const refNum = generateRefNumber('A', counters.A + 1);
    const a = { ...newAccount, refNumber: refNum, createdAt: new Date().toISOString(), createdBy: currentUser.name };
    await addDoc(collection(db, 'accounts'), a);
    await incrementCounter('A');
    await addLog('add', 'حساب', a.name, refNum);
    setNewAccount(emptyAccount);
    setShowModal(false);
  };

  const editAccount = async () => {
    if (!editingItem.name) { alert('املأ الحقول'); return; }
    await updateDoc(doc(db, 'accounts', editingItem.id), { ...editingItem, updatedAt: new Date().toISOString() });
    await addLog('edit', 'حساب', editingItem.name, editingItem.id);
    setEditingItem(null);
    setShowModal(false);
  };

  const delAccount = async (a) => {
    await deleteDoc(doc(db, 'accounts', a.id));
    await addDoc(collection(db, 'archivedAccounts'), { ...a, archivedAt: new Date().toISOString(), archivedBy: currentUser.name });
    await addLog('delete', 'حساب', a.name, a.id);
    setShowModal(false);
  };

  const restoreAccount = async (a) => {
    const { archivedAt, archivedBy, id, ...rest } = a;
    await addDoc(collection(db, 'accounts'), rest);
    await deleteDoc(doc(db, 'archivedAccounts', a.id));
    await addLog('restore', 'حساب', a.name, a.id);
  };

  // CRUD Operations - Sections
  const addSection = async () => {
    if (!newSection.name) { alert('أدخل اسم القسم'); return; }
    const s = { ...newSection, createdAt: new Date().toISOString(), createdBy: currentUser.name };
    await addDoc(collection(db, 'taskSections'), s);
    await addLog('add', 'قسم', s.name, 'section');
    setNewSection(emptySection);
    setShowModal(false);
  };

  // User Management - موافقة/رفض المستخدمين الجدد
  const approveUser = async (user) => {
    try {
      await updateDoc(doc(db, 'users', user.id), {
        status: 'approved',
        approvedDate: new Date().toISOString(),
        approvedBy: currentUser.uid
      });
      alert(`✅ تمت الموافقة على ${user.name}`);
    } catch (error) {
      console.error(error);
      alert('حدث خطأ');
    }
  };

  const rejectUser = async (user) => {
    if (!window.confirm(`هل تريد رفض طلب ${user.name}؟`)) return;
    try {
      await updateDoc(doc(db, 'users', user.id), {
        status: 'rejected',
        rejectedDate: new Date().toISOString(),
        rejectedBy: currentUser.uid
      });
      alert(`❌ تم رفض ${user.name}`);
    } catch (error) {
      console.error(error);
      alert('حدث خطأ');
    }
  };

  // Map Picker Functions
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

// ================================// ================================
// الجزء السادس - التنسيق والمكونات الداخلية
// ================================

  // Styling Variables
  const accent = accentColors[accentIndex];
  const currentBg = backgrounds[bgIndex];
  const currentFont = fonts[fontIndex];
  const currentHeaderColor = headerColors[headerColorIndex];
  const bg = tokyoNightEnabled ? 'bg-gradient-to-br from-gray-900 to-gray-800' : `bg-gradient-to-br ${darkMode ? currentBg.dark : currentBg.light}`;
  const card = tokyoNightEnabled ? 'bg-gray-800/80 backdrop-blur-md border-gray-700/50' : (darkMode ? 'bg-gray-800/80 backdrop-blur-sm border-gray-700/50' : 'bg-white/90 backdrop-blur-sm border-gray-200');
  const headerCard = darkMode ? currentHeaderColor.dark : currentHeaderColor.light;
  const headerTxt = headerColorIndex > 0 ? 'text-white' : (darkMode ? 'text-white' : 'text-gray-900');
  const headerTxtSm = headerColorIndex > 0 ? 'text-gray-300' : (darkMode ? 'text-gray-400' : 'text-gray-500');
  const cardPopup = tokyoNightEnabled ? 'bg-gray-800/95 backdrop-blur-md border-gray-700' : (darkMode ? 'bg-gray-800/95 backdrop-blur-md border-gray-700' : 'bg-white/95 backdrop-blur-md border-gray-200');
  const inp = tokyoNightEnabled ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-500' : (darkMode ? 'bg-gray-700/80 border-gray-600 text-white placeholder-gray-400' : 'bg-white/90 border-gray-300 text-gray-900 placeholder-gray-400');
  const txt = tokyoNightEnabled ? 'text-gray-100' : (darkMode ? 'text-white' : 'text-gray-900');
  const txtSm = tokyoNightEnabled ? 'text-gray-400' : (darkMode ? 'text-gray-400' : 'text-gray-500');
  const iconClass = `w-3.5 h-3.5 ${txtSm}`;

  // Computed Values
  const totalArchived = (archivedExpenses?.length || 0) + (archivedTasks?.length || 0) + (archivedAccounts?.length || 0) + (archivedProjects?.length || 0);
  const urgentExpenses = expenses.filter(e => e.status !== 'مدفوع' && e.type !== 'مرة واحدة' && calcDays(e.dueDate) <= 15 && calcDays(e.dueDate) !== null);
  const urgentTasks = tasks.filter(t => t.priority === 'عالي الأهمية' || (calcDays(t.dueDate) !== null && calcDays(t.dueDate) < 0));
  const totalExpenses = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const monthlyExpenses = expenses.filter(e => e.type === 'شهري').reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const yearlyExpenses = expenses.filter(e => e.type === 'سنوي').reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const onceExpenses = expenses.filter(e => e.type === 'مرة واحدة').reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  // Internal Components
  const Badge = ({ status }) => {
    const styles = {
      'عالي الأهمية': 'bg-red-500/10 border-red-500/30 text-red-400',
      'مستعجل': 'bg-orange-500/10 border-orange-500/30 text-orange-400',
      'متوسط الأهمية': 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
      'منخفض الأهمية': 'bg-green-500/10 border-green-500/30 text-green-400',
      'مدفوع': 'bg-green-500/10 border-green-500/30 text-green-400',
      'لم يتم الدفع': 'bg-red-500/10 border-red-500/30 text-red-400',
      'جاري العمل': 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      'مكتمل': 'bg-green-500/10 border-green-500/30 text-green-400',
      'متوقف': 'bg-red-500/10 border-red-500/30 text-red-400',
    };
    return <span className={`px-2 py-0.5 rounded-lg text-xs border ${styles[status] || 'bg-gray-500/10 border-gray-500/30 text-gray-400'}`}>{status}</span>;
  };

  const InfoItem = ({ icon: Icon, children, href, phone }) => {
    if (href) return <a href={href} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1 ${txtSm} hover:underline`}><Icon className={iconClass} />{children}</a>;
    if (phone) return <a href={`tel:${phone}`} className={`inline-flex items-center gap-1 ${txtSm} hover:underline`}><Icon className={iconClass} />{children}</a>;
    return <span className={`inline-flex items-center gap-1 ${txtSm}`}><Icon className={iconClass} />{children}</span>;
  };

  const IconBtn = ({ onClick, icon: Icon, title, disabled }) => (
    <button onClick={onClick} disabled={disabled} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} ${disabled ? 'opacity-50' : ''}`} title={title}>
      <Icon className="w-4 h-4" />
    </button>
  );

  const hideScrollbar = { scrollbarWidth: 'none', msOverflowStyle: 'none' };
  const hideScrollbarClass = '[&::-webkit-scrollbar]:hidden';

  // Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center" dir="rtl">
        <Loader className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  // Login Redirect - التوجيه لصفحة المصادقة الآمنة
  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen ${bg} flex items-center justify-center p-4 relative overflow-hidden`} dir="rtl">
        <FinancialPattern />
        <div className={`${card} p-8 rounded-2xl shadow-2xl w-full max-w-md border relative z-10`}>
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center text-gray-700 text-2xl font-bold" style={{ backgroundColor: '#dcdddc' }}>RKZ</div>
            <h1 className={`text-xl font-bold ${txt}`}>ركائز الأولى للتعمير</h1>
            <p className={`text-sm ${txtSm}`}>منصة الإدارة والمشاريع</p>
          </div>
          
          <div className={`p-6 rounded-xl text-center ${darkMode ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
            <Shield className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            <h2 className={`font-bold mb-2 ${txt}`}>نظام المصادقة الآمن</h2>
            <p className={`text-sm ${txtSm} mb-4`}>
              يرجى استخدام صفحة تسجيل الدخول الآمنة للوصول إلى النظام
            </p>
            <a 
              href="/auth-pages.html" 
              className={`inline-block w-full bg-gradient-to-r ${accent.gradient} text-white p-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all`}
            >
              الذهاب لصفحة الدخول
            </a>
          </div>
          
          <div className="text-center mt-6">
            <span className="text-xs text-gray-400">v{APP_VERSION}</span>
          </div>
        </div>
      </div>
    );
  }

  // Main App Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center" dir="rtl">
        <Loader className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

// ================================// ================================
// الجزء السادس - التنسيق والمكونات الداخلية
// ================================

  // Styling Variables
  const accent = accentColors[accentIndex];
  const currentBg = backgrounds[bgIndex];
  const currentFont = fonts[fontIndex];
  const currentHeaderColor = headerColors[headerColorIndex];
  const bg = tokyoNightEnabled ? 'bg-gradient-to-br from-gray-900 to-gray-800' : `bg-gradient-to-br ${darkMode ? currentBg.dark : currentBg.light}`;
  const card = tokyoNightEnabled ? 'bg-gray-800/80 backdrop-blur-md border-gray-700/50' : (darkMode ? 'bg-gray-800/80 backdrop-blur-sm border-gray-700/50' : 'bg-white/90 backdrop-blur-sm border-gray-200');
  const headerCard = darkMode ? currentHeaderColor.dark : currentHeaderColor.light;
  const headerTxt = headerColorIndex > 0 ? 'text-white' : (darkMode ? 'text-white' : 'text-gray-900');
  const headerTxtSm = headerColorIndex > 0 ? 'text-gray-300' : (darkMode ? 'text-gray-400' : 'text-gray-500');
  const cardPopup = tokyoNightEnabled ? 'bg-gray-800/95 backdrop-blur-md border-gray-700' : (darkMode ? 'bg-gray-800/95 backdrop-blur-md border-gray-700' : 'bg-white/95 backdrop-blur-md border-gray-200');
  const inp = tokyoNightEnabled ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-500' : (darkMode ? 'bg-gray-700/80 border-gray-600 text-white placeholder-gray-400' : 'bg-white/90 border-gray-300 text-gray-900 placeholder-gray-400');
  const txt = tokyoNightEnabled ? 'text-gray-100' : (darkMode ? 'text-white' : 'text-gray-900');
  const txtSm = tokyoNightEnabled ? 'text-gray-400' : (darkMode ? 'text-gray-400' : 'text-gray-500');
  const iconClass = `w-3.5 h-3.5 ${txtSm}`;

  // Computed Values
  const totalArchived = (archivedExpenses?.length || 0) + (archivedTasks?.length || 0) + (archivedAccounts?.length || 0) + (archivedProjects?.length || 0);
  const urgentExpenses = expenses.filter(e => e.status !== 'مدفوع' && e.type !== 'مرة واحدة' && calcDays(e.dueDate) <= 15 && calcDays(e.dueDate) !== null);
  const urgentTasks = tasks.filter(t => t.priority === 'عالي الأهمية' || (calcDays(t.dueDate) !== null && calcDays(t.dueDate) < 0));
  const totalExpenses = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const monthlyExpenses = expenses.filter(e => e.type === 'شهري').reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const yearlyExpenses = expenses.filter(e => e.type === 'سنوي').reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const onceExpenses = expenses.filter(e => e.type === 'مرة واحدة').reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  // Internal Components
  const Badge = ({ status }) => {
    const styles = {
      'عالي الأهمية': 'bg-red-500/10 border-red-500/30 text-red-400',
      'مستعجل': 'bg-orange-500/10 border-orange-500/30 text-orange-400',
      'متوسط الأهمية': 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
      'منخفض الأهمية': 'bg-green-500/10 border-green-500/30 text-green-400',
      'مدفوع': 'bg-green-500/10 border-green-500/30 text-green-400',
      'لم يتم الدفع': 'bg-red-500/10 border-red-500/30 text-red-400',
      'جاري العمل': 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      'مكتمل': 'bg-green-500/10 border-green-500/30 text-green-400',
      'متوقف': 'bg-red-500/10 border-red-500/30 text-red-400',
    };
    return <span className={`px-2 py-0.5 rounded-lg text-xs border ${styles[status] || 'bg-gray-500/10 border-gray-500/30 text-gray-400'}`}>{status}</span>;
  };

  const InfoItem = ({ icon: Icon, children, href, phone }) => {
    if (href) return <a href={href} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1 ${txtSm} hover:underline`}><Icon className={iconClass} />{children}</a>;
    if (phone) return <a href={`tel:${phone}`} className={`inline-flex items-center gap-1 ${txtSm} hover:underline`}><Icon className={iconClass} />{children}</a>;
    return <span className={`inline-flex items-center gap-1 ${txtSm}`}><Icon className={iconClass} />{children}</span>;
  };

  const IconBtn = ({ onClick, icon: Icon, title, disabled }) => (
    <button onClick={onClick} disabled={disabled} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} ${disabled ? 'opacity-50' : ''}`} title={title}>
      <Icon className="w-4 h-4" />
    </button>
  );

  const hideScrollbar = { scrollbarWidth: 'none', msOverflowStyle: 'none' };
  const hideScrollbarClass = '[&::-webkit-scrollbar]:hidden';

  // Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center" dir="rtl">
        <Loader className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  // Login Redirect - التوجيه لصفحة المصادقة الآمنة
  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen ${bg} flex items-center justify-center p-4 relative overflow-hidden`} dir="rtl">
        <FinancialPattern />
        <div className={`${card} p-8 rounded-2xl shadow-2xl w-full max-w-md border relative z-10`}>
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center text-gray-700 text-2xl font-bold" style={{ backgroundColor: '#dcdddc' }}>RKZ</div>
            <h1 className={`text-xl font-bold ${txt}`}>ركائز الأولى للتعمير</h1>
            <p className={`text-sm ${txtSm}`}>منصة الإدارة والمشاريع</p>
          </div>
          
          <div className={`p-6 rounded-xl text-center ${darkMode ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
            <Shield className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            <h2 className={`font-bold mb-2 ${txt}`}>نظام المصادقة الآمن</h2>
            <p className={`text-sm ${txtSm} mb-4`}>
              يرجى استخدام صفحة تسجيل الدخول الآمنة للوصول إلى النظام
            </p>
            <a 
              href="/auth-pages.html" 
              className={`inline-block w-full bg-gradient-to-r ${accent.gradient} text-white p-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all`}
            >
              الذهاب لصفحة الدخول
            </a>
          </div>
          
          <div className="text-center mt-6">
            <span className="text-xs text-gray-400">v{APP_VERSION}</span>
          </div>
        </div>
      </div>
    );
  }

  // Main App Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center" dir="rtl">
        <Loader className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

// ================================
