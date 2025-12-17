import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, setDoc, onSnapshot, query, orderBy, runTransaction } from 'firebase/firestore';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
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
const auth = getAuth(app);
const APP_VERSION = "5.4.0-SecureAuth";

const generateRefNumber = (prefix, counter) => `${prefix}-${String(counter).padStart(4, '0')}`;

const getStatusColor = (status, days = null) => {
  if (status === 'overdue' || status === 'expired' || status === 'عالي الأهمية' || status === 'delete' || (days !== null && days < 0)) return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', badge: 'bg-red-500/30 text-red-300' };
  if (status === 'urgent' || status === 'مستعجل' || (days !== null && days <= 7)) return { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', badge: 'bg-orange-500/30 text-orange-300' };
  if (status === 'soon' || status === 'متوسط الأهمية' || (days !== null && days <= 14)) return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', badge: 'bg-yellow-500/30 text-yellow-300' };
  if (status === 'safe' || status === 'مكتمل' || status === 'منخفض الأهمية' || status === 'active' || status === 'add') return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', badge: 'bg-green-500/30 text-green-300' };
  if (status === 'جاري العمل' || status === 'مرة واحدة' || status === 'edit') return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', badge: 'bg-blue-500/30 text-blue-300' };
  if (status === 'متوقف' || status === 'سنوي' || status === 'refresh') return { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', badge: 'bg-purple-500/30 text-purple-300' };
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

const formatNumber = (num) => (num === null || num === undefined) ? '0' : Number(num).toLocaleString('en-US');

const calcNextDueDate = (startDate, type) => {
  if (!startDate) return null;
  const start = new Date(startDate);
  const today = new Date(); today.setHours(0,0,0,0);
  if (type === 'مرة واحدة') return start;
  let nextDue = new Date(start);
  const daysToAdd = type === 'شهري' ? 30 : 365;
  while (nextDue <= today) nextDue.setDate(nextDue.getDate() + daysToAdd);
  return nextDue;
};

const calcDaysRemaining = (startDate, type) => {
  const nextDue = calcNextDueDate(startDate, type);
  if (!nextDue) return null;
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.ceil((nextDue - today) / (1000*60*60*24));
};

const fonts = [
  { id: 'cairo', name: 'Cairo', value: "'Cairo', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap' },
  { id: 'tajawal', name: 'Tajawal', value: "'Tajawal', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap' },
  { id: 'almarai', name: 'Almarai', value: "'Almarai', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Almarai:wght@400;700&display=swap' },
  { id: 'noto', name: 'Noto Kufi', value: "'Noto Kufi Arabic', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;600;700&display=swap' },
  { id: 'rubik', name: 'Rubik', value: "'Rubik', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap' },
];

const quotes = ["النجاح يبدأ بخطوة 🚀", "استثمر وقتك بحكمة ⏰", "التخطيط المالي مفتاح النجاح 💰", "كل يوم فرصة جديدة 🌟", "الإصرار يصنع المستحيل 💪", "فكر كبيراً وابدأ صغيراً 🎯", "المثابرة طريق التميز ⭐", "النظام أساس النجاح 📊"];

const greetings = [(n)=>`أهلاً ${n} 👋`,(n)=>`مرحباً ${n} 🌟`,(n)=>`هلا ${n} ✨`,(n)=>`أهلين ${n} 💫`,(n)=>`يا هلا ${n} 🎯`,(n)=>`حياك الله ${n} 🌙`,(n)=>`نورت ${n} ☀️`,(n)=>`هلا والله ${n} 🔥`,(n)=>`أهلاً وسهلاً ${n} 🌺`,(n)=>`تشرفنا ${n} ⭐`,(n)=>`منور ${n} 💡`,(n)=>`الله يحييك ${n} 🤝`];

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
    <defs><pattern id="fin-pattern" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse">
      <text x="20" y="40" fontSize="48" fill="currentColor" transform="rotate(-15 20 40)">$</text>
      <text x="320" y="60" fontSize="52" fill="currentColor" transform="rotate(25 320 60)">€</text>
      <text x="150" y="100" fontSize="44" fill="currentColor" transform="rotate(-8 150 100)">£</text>
      <text x="250" y="150" fontSize="40" fill="currentColor" transform="rotate(18 250 150)">¥</text>
      <text x="60" y="200" fontSize="38" fill="currentColor" transform="rotate(30 60 200)">ر.س</text>
    </pattern></defs>
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
                      <MapPin className="w-4 h-4 text-gray-400" /><span className="text-sm truncate">{item.display_name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => searchSuggestions(search)} className={`px-4 rounded-xl ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}><Search className="w-4 h-4" /></button>
          </div>
          <div className="relative rounded-xl overflow-hidden border-2 border-gray-300" style={{ height: '300px' }}>
            <iframe src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${position.lat},${position.lng}&zoom=15`} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="map" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><MapPin className="w-10 h-10 text-red-500 drop-shadow-lg" /></div>
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
      style.textContent = `@keyframes twinkle{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.8)}}@keyframes shoot{0%{transform:translateX(0) translateY(0);opacity:1}100%{transform:translateX(-300px) translateY(300px);opacity:0}}@keyframes aurora{0%,100%{transform:translate(0,0) rotate(0deg)}33%{transform:translate(5%,5%) rotate(10deg)}66%{transform:translate(-5%,5%) rotate(-10deg)}}`;
      document.head.appendChild(style);
    }
  }, []);
  const stars1 = "742px 1123px #7aa2f7,1803px 608px #bb9af7,1582px 1726px #7dcfff,1676px 994px #7aa2f7,615px 537px #9ece6a";
  const stars2 = "1433px 1850px #7aa2f7,671px 1791px #bb9af7,1865px 1019px #7dcfff";
  return (
    <>
      <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}><div style={{position:"absolute",background:"transparent",boxShadow:stars1,width:"1px",height:"1px",animation:"twinkle 3s ease-in-out infinite"}}/></div>
      <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}><div style={{position:"absolute",background:"transparent",boxShadow:stars2,width:"2px",height:"2px",animation:"twinkle 5s ease-in-out infinite 1s"}}/></div>
      {[{top:'10%',left:'85%',delay:'0s'},{top:'25%',left:'70%',delay:'2s'},{top:'40%',left:'90%',delay:'4s'}].map((s,i)=>(<div key={i} style={{position:"fixed",top:s.top,left:s.left,width:"2px",height:"2px",background:"#7aa2f7",borderRadius:"50%",boxShadow:"0 0 10px 2px #7aa2f7",animation:"shoot 3s ease-out infinite",animationDelay:s.delay,pointerEvents:"none",zIndex:0}}/>))}
      <div style={{position:"fixed",top:"-50%",left:"-50%",width:"200%",height:"200%",pointerEvents:"none",zIndex:0,opacity:0.15,background:"radial-gradient(ellipse at 20% 30%, rgba(122, 162, 247, 0.3) 0%, transparent 50%)",animation:"aurora 20s ease-in-out infinite"}}/>
    </>
  );
};

export default function App() {
  const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('themeMode') || 'auto');
  const [darkMode, setDarkMode] = useState(() => { const m = localStorage.getItem('themeMode') || 'auto'; return m === 'auto' ? getSystemTheme() : m === 'dark'; });
  const [fontSize, setFontSize] = useState(() => parseInt(localStorage.getItem('fontSize')) || 16);
  const [fontIndex, setFontIndex] = useState(() => parseInt(localStorage.getItem('fontIndex')) || 0);
  const [bgIndex, setBgIndex] = useState(() => parseInt(localStorage.getItem('bgIndex')) || 0);
  const [accentIndex, setAccentIndex] = useState(() => parseInt(localStorage.getItem('accentIndex')) || 0);
  const [headerColorIndex, setHeaderColorIndex] = useState(() => parseInt(localStorage.getItem('headerColorIndex')) || 0);
  const [tokyoNightEnabled, setTokyoNightEnabled] = useState(() => localStorage.getItem('tokyoNightEnabled') === 'true');
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
  const [sessionStart, setSessionStart] = useState(null);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [mapPickerTarget, setMapPickerTarget] = useState(null);
  const [showExpenseHistory, setShowExpenseHistory] = useState(null);
  const [taskFilter, setTaskFilter] = useState('all');
  const [showPasswordId, setShowPasswordId] = useState(null);

  const auditRef = useRef(null);
  const archiveRef = useRef(null);
  const settingsRef = useRef(null);

  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [archivedExpenses, setArchivedExpenses] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [archivedAccounts, setArchivedAccounts] = useState([]);
  const [archivedProjects, setArchivedProjects] = useState([]);
  const [counters, setCounters] = useState({ E: 0, T: 0, P: 0, A: 0 });

  const emptyExpense = { name: '', amount: '', currency: 'ر.س', dueDate: '', type: 'شهري', reason: '', status: 'لم يتم الدفع', location: '', mapUrl: '', coordinates: '', totalSpent: 0 };
  const emptyTask = { title: '', description: '', dueDate: '', assignedTo: '', priority: 'متوسط الأهمية', status: 'قيد الانتظار', projectId: '', sectionId: '', location: '', mapUrl: '', coordinates: '' };
  const emptyProject = { name: '', description: '', client: '', location: '', phone: '', startDate: '', endDate: '', budget: '', status: 'جاري العمل', mapUrl: '', coordinates: '', folders: [] };
  const emptyAccount = { name: '', description: '', loginUrl: '', username: '', password: '', subscriptionDate: '', daysRemaining: 365 };

  const [newExpense, setNewExpense] = useState(emptyExpense);
  const [newTask, setNewTask] = useState(emptyTask);
  const [newProject, setNewProject] = useState(emptyProject);
  const [newAccount, setNewAccount] = useState(emptyAccount);

  const copyToClipboard = (text) => navigator.clipboard.writeText(text);
  const calcDays = (d) => d ? Math.ceil((new Date(d) - new Date()) / 86400000) : null;
  const getSessionMinutes = () => sessionStart ? Math.floor((Date.now() - sessionStart) / 60000) : 0;
  const formatTime12 = (date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const getRandomGreeting = (n) => greetings[Math.floor(Math.random() * greetings.length)](n);

  const incrementCounter = async (key) => {
    await runTransaction(db, async (t) => {
      const ref = doc(db, 'system', 'counters');
      const docVal = await t.get(ref);
      t.set(ref, { ...docVal.data(), [key]: (docVal.data()?.[key] || 0) + 1 }, { merge: true });
    });
  };

  const addLog = async (action, type, name, itemId) => {
    const actionText = action === 'add' ? 'بإضافة' : action === 'edit' ? 'بتعديل' : action === 'delete' ? 'بحذف' : action === 'restore' ? 'بإستعادة' : action;
    const desc = `${currentUser?.name || 'النظام'} قام ${actionText} ${type}: ${name}`;
    try {
      await addDoc(collection(db, 'audit'), { user: currentUser?.name || 'النظام', action, itemType: type, itemName: name, itemId, description: desc, timestamp: new Date().toISOString() });
      setNewNotifications(p => p + 1);
      if (action === 'delete') setArchiveNotifications(p => p + 1);
    } catch (e) { console.error(e); }
  };

  // نظام المصادقة الآمن
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
            } else { await signOut(auth); setIsLoggedIn(false); setCurrentUser(null); }
          } else { await signOut(auth); setIsLoggedIn(false); setCurrentUser(null); }
        } catch (error) { console.error('Auth error:', error); await signOut(auth); setIsLoggedIn(false); setCurrentUser(null); }
      } else { setIsLoggedIn(false); setCurrentUser(null); }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => { if (themeMode === 'auto') setDarkMode(mq.matches); };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, [themeMode]);

  useEffect(() => { setDarkMode(themeMode === 'auto' ? getSystemTheme() : themeMode === 'dark'); localStorage.setItem('themeMode', themeMode); }, [themeMode]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (auditRef.current && !auditRef.current.contains(e.target)) setShowAuditPanel(false);
      if (archiveRef.current && !archiveRef.current.contains(e.target)) setShowArchivePanel(false);
      if (settingsRef.current && !settingsRef.current.contains(e.target)) setShowSettingsPanel(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => { localStorage.setItem('bgIndex', bgIndex); }, [bgIndex]);
  useEffect(() => { localStorage.setItem('accentIndex', accentIndex); }, [accentIndex]);
  useEffect(() => { localStorage.setItem('headerColorIndex', headerColorIndex); }, [headerColorIndex]);
  useEffect(() => { localStorage.setItem('fontSize', fontSize); }, [fontSize]);
  useEffect(() => { localStorage.setItem('fontIndex', fontIndex); }, [fontIndex]);
  useEffect(() => { if (currentUser) setGreeting(getRandomGreeting(currentUser.name || currentUser.email)); }, [currentUser]);

  useEffect(() => {
    if (!isLoggedIn) return;
    setLoading(true);
    const unsubs = [
      onSnapshot(query(collection(db, 'expenses'), orderBy('createdAt', 'desc')), s => setExpenses(s.docs.map(d => ({id:d.id, ...d.data()})))),
      onSnapshot(query(collection(db, 'tasks'), orderBy('createdAt', 'desc')), s => setTasks(s.docs.map(d => ({id:d.id, ...d.data()})))),
      onSnapshot(query(collection(db, 'projects'), orderBy('createdAt', 'desc')), s => setProjects(s.docs.map(d => ({id:d.id, ...d.data()})))),
      onSnapshot(query(collection(db, 'accounts'), orderBy('createdAt', 'desc')), s => setAccounts(s.docs.map(d => ({id:d.id, ...d.data()})))),
      onSnapshot(collection(db, 'users'), s => { const all = s.docs.map(d => ({id:d.id, ...d.data()})); setUsers(all.filter(u => u.status === 'approved')); setPendingUsers(all.filter(u => u.status === 'pending')); }),
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

  const logout = async () => { await signOut(auth); setIsLoggedIn(false); setCurrentUser(null); setSessionStart(null); };
  const toggleTokyoNight = () => { const nv = !tokyoNightEnabled; setTokyoNightEnabled(nv); localStorage.setItem('tokyoNightEnabled', nv); };

  const addExpense = async () => {
    if (!newExpense.name || !newExpense.amount) { alert('املأ الحقول المطلوبة'); return; }
    const refNum = generateRefNumber('E', counters.E + 1);
    const exp = { ...newExpense, refNumber: refNum, amount: parseFloat(newExpense.amount), totalSpent: parseFloat(newExpense.amount), createdAt: new Date().toISOString(), createdBy: currentUser.name, paymentHistory: [{ date: new Date().toISOString(), amount: parseFloat(newExpense.amount), note: 'إنشاء المصروف', by: currentUser.name }] };
    await addDoc(collection(db, 'expenses'), exp);
    await incrementCounter('E');
    await addLog('add', 'مصروف', exp.name, refNum);
    setNewExpense(emptyExpense); setShowModal(false);
  };

  const editExpense = async () => {
    if (!editingItem.name || !editingItem.amount) { alert('املأ الحقول'); return; }
    await updateDoc(doc(db, 'expenses', editingItem.id), { ...editingItem, amount: parseFloat(editingItem.amount), updatedAt: new Date().toISOString() });
    await addLog('edit', 'مصروف', editingItem.name, editingItem.id);
    setEditingItem(null); setShowModal(false);
  };

  const delExpense = async (exp) => {
    await deleteDoc(doc(db, 'expenses', exp.id));
    await addDoc(collection(db, 'archivedExpenses'), { ...exp, archivedAt: new Date().toISOString(), archivedBy: currentUser.name });
    await addLog('delete', 'مصروف', exp.name, exp.id); setShowModal(false);
  };

  const restoreExpense = async (exp) => {
    const { archivedAt, archivedBy, id, ...rest } = exp;
    await addDoc(collection(db, 'expenses'), rest);
    await deleteDoc(doc(db, 'archivedExpenses', exp.id));
    await addLog('restore', 'مصروف', exp.name, exp.id);
  };

  const addTask = async () => {
    if (!newTask.title) { alert('أدخل عنوان المهمة'); return; }
    const refNum = generateRefNumber('T', counters.T + 1);
    const t = { ...newTask, refNumber: refNum, createdAt: new Date().toISOString(), createdBy: currentUser.name };
    await addDoc(collection(db, 'tasks'), t);
    await incrementCounter('T');
    await addLog('add', 'مهمة', t.title, refNum);
    setNewTask(emptyTask); setShowModal(false);
  };

  const editTask = async () => {
    if (!editingItem.title) { alert('أدخل عنوان المهمة'); return; }
    await updateDoc(doc(db, 'tasks', editingItem.id), { ...editingItem, updatedAt: new Date().toISOString() });
    await addLog('edit', 'مهمة', editingItem.title, editingItem.id);
    setEditingItem(null); setShowModal(false);
  };

  const delTask = async (t) => {
    await deleteDoc(doc(db, 'tasks', t.id));
    await addDoc(collection(db, 'archivedTasks'), { ...t, archivedAt: new Date().toISOString(), archivedBy: currentUser.name });
    await addLog('delete', 'مهمة', t.title, t.id); setShowModal(false);
  };

  const restoreTask = async (t) => {
    const { archivedAt, archivedBy, id, ...rest } = t;
    await addDoc(collection(db, 'tasks'), rest);
    await deleteDoc(doc(db, 'archivedTasks', t.id));
    await addLog('restore', 'مهمة', t.title, t.id);
  };

  const addProject = async () => {
    if (!newProject.name) { alert('أدخل اسم المشروع'); return; }
    const refNum = generateRefNumber('P', counters.P + 1);
    const p = { ...newProject, refNumber: refNum, createdAt: new Date().toISOString(), createdBy: currentUser.name };
    await addDoc(collection(db, 'projects'), p);
    await incrementCounter('P');
    await addLog('add', 'مشروع', p.name, refNum);
    setNewProject(emptyProject); setShowModal(false);
  };

  const editProject = async () => {
    if (!editingItem.name) { alert('أدخل اسم المشروع'); return; }
    await updateDoc(doc(db, 'projects', editingItem.id), { ...editingItem, updatedAt: new Date().toISOString() });
    await addLog('edit', 'مشروع', editingItem.name, editingItem.id);
    setEditingItem(null); setShowModal(false);
  };

  const delProject = async (p) => {
    await deleteDoc(doc(db, 'projects', p.id));
    await addDoc(collection(db, 'archivedProjects'), { ...p, archivedAt: new Date().toISOString(), archivedBy: currentUser.name });
    await addLog('delete', 'مشروع', p.name, p.id); setShowModal(false); setSelectedProject(null);
  };

  const restoreProject = async (p) => {
    const { archivedAt, archivedBy, id, ...rest } = p;
    await addDoc(collection(db, 'projects'), rest);
    await deleteDoc(doc(db, 'archivedProjects', p.id));
    await addLog('restore', 'مشروع', p.name, p.id);
  };

  const addAccount = async () => {
    if (!newAccount.name || !newAccount.username) { alert('املأ الحقول'); return; }
    const refNum = generateRefNumber('A', counters.A + 1);
    const a = { ...newAccount, refNumber: refNum, createdAt: new Date().toISOString(), createdBy: currentUser.name };
    await addDoc(collection(db, 'accounts'), a);
    await incrementCounter('A');
    await addLog('add', 'حساب', a.name, refNum);
    setNewAccount(emptyAccount); setShowModal(false);
  };

  const editAccount = async () => {
    if (!editingItem.name) { alert('املأ الحقول'); return; }
    await updateDoc(doc(db, 'accounts', editingItem.id), { ...editingItem, updatedAt: new Date().toISOString() });
    await addLog('edit', 'حساب', editingItem.name, editingItem.id);
    setEditingItem(null); setShowModal(false);
  };

  const delAccount = async (a) => {
    await deleteDoc(doc(db, 'accounts', a.id));
    await addDoc(collection(db, 'archivedAccounts'), { ...a, archivedAt: new Date().toISOString(), archivedBy: currentUser.name });
    await addLog('delete', 'حساب', a.name, a.id); setShowModal(false);
  };

  const restoreAccount = async (a) => {
    const { archivedAt, archivedBy, id, ...rest } = a;
    await addDoc(collection(db, 'accounts'), rest);
    await deleteDoc(doc(db, 'archivedAccounts', a.id));
    await addLog('restore', 'حساب', a.name, a.id);
  };

  const approveUser = async (user) => {
    try {
      await updateDoc(doc(db, 'users', user.id), { status: 'approved', approvedDate: new Date().toISOString(), approvedBy: currentUser.uid });
      alert(`✅ تمت الموافقة على ${user.name}`);
    } catch (e) { console.error(e); alert('حدث خطأ'); }
  };

  const rejectUser = async (user) => {
    if (!window.confirm(`هل تريد رفض طلب ${user.name}؟`)) return;
    try {
      await updateDoc(doc(db, 'users', user.id), { status: 'rejected', rejectedDate: new Date().toISOString(), rejectedBy: currentUser.uid });
      alert(`❌ تم رفض ${user.name}`);
    } catch (e) { console.error(e); alert('حدث خطأ'); }
  };

  const openMapPicker = (target) => { setMapPickerTarget(target); setShowMapPicker(true); };
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
  const bg = tokyoNightEnabled ? 'bg-gradient-to-br from-gray-900 to-gray-800' : `bg-gradient-to-br ${darkMode ? currentBg.dark : currentBg.light}`;
  const card = tokyoNightEnabled ? 'bg-gray-800/80 backdrop-blur-md border-gray-700/50' : (darkMode ? 'bg-gray-800/80 backdrop-blur-sm border-gray-700/50' : 'bg-white/90 backdrop-blur-sm border-gray-200');
  const headerCard = darkMode ? currentHeaderColor.dark : currentHeaderColor.light;
  const headerTxt = headerColorIndex > 0 ? 'text-white' : (darkMode ? 'text-white' : 'text-gray-900');
  const headerTxtSm = headerColorIndex > 0 ? 'text-gray-300' : (darkMode ? 'text-gray-400' : 'text-gray-500');
  const cardPopup = tokyoNightEnabled ? 'bg-gray-800/95 backdrop-blur-md border-gray-700' : (darkMode ? 'bg-gray-800/95 backdrop-blur-md border-gray-700' : 'bg-white/95 backdrop-blur-md border-gray-200');
  const inp = tokyoNightEnabled ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-500' : (darkMode ? 'bg-gray-700/80 border-gray-600 text-white placeholder-gray-400' : 'bg-white/90 border-gray-300 text-gray-900 placeholder-gray-400');
  const txt = tokyoNightEnabled ? 'text-gray-100' : (darkMode ? 'text-white' : 'text-gray-900');
  const txtSm = tokyoNightEnabled ? 'text-gray-400' : (darkMode ? 'text-gray-400' : 'text-gray-500');

  const totalExpenses = expenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);

  const Badge = ({ status }) => {
    const styles = { 'عالي الأهمية': 'bg-red-500/10 border-red-500/30 text-red-400', 'مستعجل': 'bg-orange-500/10 border-orange-500/30 text-orange-400', 'متوسط الأهمية': 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400', 'منخفض الأهمية': 'bg-green-500/10 border-green-500/30 text-green-400', 'مدفوع': 'bg-green-500/10 border-green-500/30 text-green-400', 'لم يتم الدفع': 'bg-red-500/10 border-red-500/30 text-red-400', 'جاري العمل': 'bg-blue-500/10 border-blue-500/30 text-blue-400', 'مكتمل': 'bg-green-500/10 border-green-500/30 text-green-400', 'متوقف': 'bg-red-500/10 border-red-500/30 text-red-400' };
    return <span className={`px-2 py-0.5 rounded-lg text-xs border ${styles[status] || 'bg-gray-500/10 border-gray-500/30 text-gray-400'}`}>{status}</span>;
  };

  const IconBtn = ({ onClick, icon: Icon, title, disabled }) => (<button onClick={onClick} disabled={disabled} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} ${disabled ? 'opacity-50' : ''}`} title={title}><Icon className="w-4 h-4" /></button>);

  if (authLoading) return (<div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center" dir="rtl"><Loader className="w-12 h-12 text-blue-500 animate-spin" /></div>);

  if (!isLoggedIn) return (
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
          <p className={`text-sm ${txtSm} mb-4`}>يرجى استخدام صفحة تسجيل الدخول الآمنة</p>
          <a href="/auth-pages.html" className={`inline-block w-full bg-gradient-to-r ${accent.gradient} text-white p-3 rounded-xl font-bold text-sm`}>الذهاب لصفحة الدخول</a>
        </div>
        <div className="text-center mt-6"><span className="text-xs text-gray-400">v{APP_VERSION}</span></div>
      </div>
    </div>
  );

  if (loading) return <div className={`min-h-screen ${bg} flex items-center justify-center`} dir="rtl"><Loader className="w-12 h-12 text-blue-500 animate-spin" /></div>;

  return (
    <>
      {tokyoNightEnabled && <TokyoNightBg />}
      <div style={{position:"relative",zIndex:1}}>
        <div className="min-h-screen relative overflow-x-hidden pb-16" style={{ fontSize: `${fontSize}px`, fontFamily: currentFont.value }} dir="rtl">
          <style>{`*::-webkit-scrollbar{display:none}*{scrollbar-width:none}input[type="date"]::-webkit-calendar-picker-indicator{cursor:pointer;${darkMode?'filter:invert(1);':''}}`}</style>
          <FinancialPattern />
          <link href={currentFont.url} rel="stylesheet" />
          {showMapPicker && <MapPicker darkMode={darkMode} onClose={() => setShowMapPicker(false)} onSelect={handleMapSelect} />}

          {/* Header */}
          <div className={`${headerCard} border-b px-4 py-3 flex flex-wrap items-center justify-between sticky top-0 z-50 gap-3`}>
            <div className="flex items-center gap-3">
              <button onClick={() => { setCurrentView('dashboard'); setSelectedProject(null); }} className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-700 font-bold text-xs" style={{ backgroundColor: '#dcdddc' }}>RKZ</button>
              <div>
                <h1 className={`font-bold ${headerTxt}`}>نظام الإدارة المالية</h1>
                <p className={`text-xs ${headerTxtSm}`}>ركائز الأولى للتعمير</p>
                <p className={`text-xs ${headerTxtSm}`}>{currentTime.toLocaleDateString('en-US')} | {formatTime12(currentTime)} | {quote}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-sm ${headerTxt}`}>{greeting}</span>
              <span className={`text-xs ${headerTxtSm}`}><Shield className="w-3 h-3 inline ml-1" />{currentUser?.role === 'owner' ? 'المالك' : currentUser?.role === 'manager' ? 'مدير' : 'عضو'}</span>
              <span className={`text-xs ${headerTxtSm}`}>({formatNumber(getSessionMinutes())} د)</span>
              
              <div className="relative" ref={auditRef}>
                <button onClick={() => { setShowAuditPanel(!showAuditPanel); setShowArchivePanel(false); setShowSettingsPanel(false); setNewNotifications(0); }} className={`p-2 rounded-lg ${headerColorIndex > 0 ? 'hover:bg-white/10' : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}>
                  <Clock className={`w-5 h-5 ${headerTxtSm}`} />
                  {newNotifications > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{newNotifications}</span>}
                </button>
                {showAuditPanel && (
                  <div className={`absolute left-0 top-12 w-80 ${cardPopup} rounded-xl shadow-2xl border z-50 max-h-80 overflow-y-auto`}>
                    <div className={`p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between`}><span className={`font-bold text-sm ${txt}`}>آخر العمليات</span><button onClick={() => { setCurrentView('audit'); setShowAuditPanel(false); }} className={`text-xs ${accent.text}`}>عرض الكل</button></div>
                    <div className="p-2">{auditLog.slice(0, 8).map(l => (<div key={l.id} className={`p-2 rounded-lg mb-1 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}><p className={`text-xs ${txt}`}>{l.description}</p><span className={`text-xs ${txtSm}`}>{new Date(l.timestamp).toLocaleString('en-US')}</span></div>))}</div>
                  </div>
                )}
              </div>

              <div className="relative" ref={archiveRef}>
                <button onClick={() => { setShowArchivePanel(!showArchivePanel); setShowAuditPanel(false); setShowSettingsPanel(false); setArchiveNotifications(0); }} className={`p-2 rounded-lg ${headerColorIndex > 0 ? 'hover:bg-white/10' : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}>
                  <Archive className={`w-5 h-5 ${headerTxtSm}`} />
                </button>
                {showArchivePanel && (
                  <div className={`absolute left-0 top-12 w-64 ${cardPopup} rounded-xl shadow-2xl border z-50`}>
                    <div className={`p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between`}><span className={`font-bold text-sm ${txt}`}>الأرشيف</span><button onClick={() => { setCurrentView('archive'); setShowArchivePanel(false); }} className={`text-xs ${accent.text}`}>عرض الكل</button></div>
                    <div className="p-2">{[{ label: 'المصروفات', count: archivedExpenses.length },{ label: 'المهام', count: archivedTasks.length },{ label: 'المشاريع', count: archivedProjects.length },{ label: 'الحسابات', count: archivedAccounts.length }].map(item => (<div key={item.label} onClick={() => { setCurrentView('archive'); setShowArchivePanel(false); }} className={`p-2 rounded-lg mb-1 flex justify-between cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}><span className={`text-xs ${txt}`}>{item.label}</span><span className={`text-xs ${txtSm}`}>{formatNumber(item.count)}</span></div>))}</div>
                  </div>
                )}
              </div>

              <div className="relative" ref={settingsRef}>
                <button onClick={() => { setShowSettingsPanel(!showSettingsPanel); setShowAuditPanel(false); setShowArchivePanel(false); }} className={`p-2 rounded-lg ${headerColorIndex > 0 ? 'hover:bg-white/10' : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}><Settings className={`w-5 h-5 ${headerTxtSm}`} /></button>
                {showSettingsPanel && (
                  <div className={`absolute left-0 top-12 w-80 ${cardPopup} rounded-xl shadow-2xl border z-50 p-4 max-h-[80vh] overflow-y-auto`}>
                    <h4 className={`font-bold text-sm mb-3 ${txt}`}>الإعدادات</h4>
                    <div className="mb-4"><p className={`text-xs mb-2 ${txtSm}`}>نمط الواجهة</p><div className="grid grid-cols-2 gap-2"><button onClick={toggleTokyoNight} className={`p-3 rounded-xl border-2 ${tokyoNightEnabled ? 'border-blue-500 bg-blue-500/20' : 'border-gray-600 bg-gray-700/50'}`}><div className="text-2xl mb-1">🌃</div><div className={`text-xs font-bold ${txt}`}>Tokyo Night</div></button><button onClick={toggleTokyoNight} className={`p-3 rounded-xl border-2 ${!tokyoNightEnabled ? 'border-blue-500 bg-blue-500/20' : 'border-gray-600 bg-gray-700/50'}`}><div className="text-2xl mb-1">🎨</div><div className={`text-xs font-bold ${txt}`}>كلاسيكي</div></button></div></div>
                    <div className="mb-4"><p className={`text-xs mb-2 ${txtSm}`}>المظهر</p><div className="flex gap-2">{[{ mode: 'light', icon: Sun, label: 'نهاري' }, { mode: 'dark', icon: Moon, label: 'ليلي' }, { mode: 'auto', icon: Monitor, label: 'تلقائي' }].map(t => (<button key={t.mode} onClick={() => setThemeMode(t.mode)} className={`flex-1 p-2 rounded-lg flex flex-col items-center gap-1 ${themeMode === t.mode ? accent.color + ' text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}><t.icon className="w-4 h-4" /><span className="text-xs">{t.label}</span></button>))}</div></div>
                    <div className="mb-4"><p className={`text-xs mb-2 ${txtSm}`}>نوع الخط</p><div className="grid grid-cols-2 gap-2">{fonts.map((f, i) => (<button key={f.id} onClick={() => setFontIndex(i)} className={`p-2 rounded-lg text-xs ${fontIndex === i ? accent.color + ' text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`} style={{ fontFamily: f.value }}>{f.name}</button>))}</div></div>
                    <div className="mb-4"><p className={`text-xs mb-2 ${txtSm}`}>حجم الخط</p><div className="flex items-center gap-2"><button onClick={() => setFontSize(f => Math.max(12, f - 2))} className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}><Type className="w-3 h-3" /></button><span className={`text-sm ${txt} flex-1 text-center`}>{fontSize}px</span><button onClick={() => setFontSize(f => Math.min(24, f + 2))} className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}><Type className="w-5 h-5" /></button></div></div>
                    <div className="mb-4"><p className={`text-xs mb-2 ${txtSm}`}>الخلفية</p><div className="flex gap-2 flex-wrap">{backgrounds.map((b, i) => (<button key={b.id} onClick={() => setBgIndex(i)} className={`w-8 h-8 rounded-lg bg-gradient-to-br ${b.dark} ${bgIndex === i ? 'ring-2 ring-blue-500' : ''}`} />))}</div></div>
                    <div className="mb-4"><p className={`text-xs mb-2 ${txtSm}`}>لون الشريط</p><div className="flex gap-2 flex-wrap">{headerColors.map((c, i) => (<button key={c.id} onClick={() => setHeaderColorIndex(i)} className={`w-8 h-8 rounded-lg ${c.sample} ${headerColorIndex === i ? 'ring-2 ring-blue-500' : ''}`} />))}</div></div>
                    <div className="mb-4"><p className={`text-xs mb-2 ${txtSm}`}>اللون الرئيسي</p><div className="flex gap-2">{accentColors.map((c, i) => (<button key={c.id} onClick={() => setAccentIndex(i)} className={`w-8 h-8 rounded-lg ${c.color} ${accentIndex === i ? 'ring-2 ring-gray-400' : ''}`} />))}</div></div>
                  </div>
                )}
              </div>

              <button onClick={logout} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"><Power className="w-5 h-5" /></button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className={`w-full md:w-48 ${headerCard} border-b md:border-l p-2`}>
              <nav className="flex md:flex-col gap-1 flex-wrap">
                {[
                  { id: 'dashboard', icon: Activity, label: 'الرئيسية' },
                  { id: 'expenses', icon: Wallet, label: 'المصروفات' },
                  { id: 'tasks', icon: CheckSquare, label: 'المهام' },
                  { id: 'projects', icon: FolderOpen, label: 'المشاريع' },
                  { id: 'accounts', icon: Users, label: 'الحسابات' },
                  { id: 'users', icon: UserCog, label: 'المستخدمين' },
                  ...(currentUser?.role === 'owner' ? [{ id: 'pending', icon: Shield, label: 'طلبات الانضمام', badge: pendingUsers.length }] : []),
                  { id: 'archive', icon: Archive, label: 'الأرشيف' },
                  { id: 'audit', icon: History, label: 'السجل' }
                ].map(item => (
                  <button key={item.id} onClick={() => { setCurrentView(item.id); setSelectedProject(null); setProjectFilter(null); }} className={`flex items-center gap-2 p-2 rounded-xl relative ${currentView === item.id ? `bg-gradient-to-r ${accent.gradient} text-white` : headerColorIndex > 0 ? 'hover:bg-white/10 text-gray-300' : (darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600')}`}>
                    <item.icon className="w-4 h-4" /><span className="text-sm">{item.label}</span>
                    {item.badge > 0 && <span className="absolute left-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">{item.badge}</span>}
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 relative z-10 overflow-y-auto">
              
              {/* Dashboard */}
              {currentView === 'dashboard' && (
                <div>
                  <h2 className={`text-lg font-bold mb-4 ${txt}`}>لوحة التحكم</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {[
                      { label: 'المصروفات', count: expenses.length, view: 'expenses', color: 'rose' },
                      { label: 'المهام', count: tasks.length, view: 'tasks', color: 'violet' },
                      { label: 'المشاريع', count: projects.length, view: 'projects', color: 'emerald' },
                      { label: 'الحسابات', count: accounts.length, view: 'accounts', color: 'amber' },
                    ].map(item => (
                      <button key={item.label} onClick={() => setCurrentView(item.view)} className={`${card} p-4 rounded-xl border text-right hover:border-${item.color}-500/50 transition-all`}>
                        <h3 className={`font-bold text-sm ${txt}`}>{item.label}</h3>
                        <span className={`text-2xl font-bold ${txt}`}>{formatNumber(item.count)}</span>
                      </button>
                    ))}
                  </div>
                  <div className={`${card} p-4 rounded-xl border`}>
                    <h3 className={`font-bold text-sm mb-2 ${txt}`}>إجمالي المصروفات</h3>
                    <span className={`text-xl font-bold ${txt}`}>{formatNumber(totalExpenses)} ر.س</span>
                  </div>
                </div>
              )}

              {/* Expenses */}
              {currentView === 'expenses' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className={`text-lg font-bold ${txt}`}>المصروفات</h2>
                    <button onClick={() => { setModalType('expense'); setShowModal(true); }} className={`px-4 py-2 bg-gradient-to-r ${accent.gradient} text-white rounded-xl text-sm flex items-center gap-2`}><Plus className="w-4 h-4" />إضافة</button>
                  </div>
                  <div className="space-y-3">
                    {expenses.map(exp => {
                      const days = calcDaysRemaining(exp.dueDate, exp.type);
                      const color = getExpenseColor(days, exp.type);
                      return (
                        <div key={exp.id} className={`${card} p-4 rounded-xl border ${color.border}`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className={`font-bold ${txt}`}>{exp.name}</h3>
                              <p className={`text-sm ${txtSm}`}>{exp.refNumber} | {exp.type}</p>
                              <p className={`text-lg font-bold ${txt}`}>{formatNumber(exp.amount)} {exp.currency}</p>
                              {days !== null && <p className={`text-sm ${color.text}`}>{days < 0 ? `متأخر ${Math.abs(days)} يوم` : `متبقي ${days} يوم`}</p>}
                            </div>
                            <div className="flex gap-1">
                              <IconBtn icon={Pencil} onClick={() => { setEditingItem(exp); setModalType('editExpense'); setShowModal(true); }} title="تعديل" />
                              <IconBtn icon={Trash2} onClick={() => delExpense(exp)} title="حذف" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {expenses.length === 0 && <div className={`${card} p-8 rounded-xl border text-center`}><Wallet className={`w-12 h-12 mx-auto mb-3 ${txtSm}`} /><p className={txtSm}>لا توجد مصروفات</p></div>}
                  </div>
                </div>
              )}

              {/* Tasks */}
              {currentView === 'tasks' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className={`text-lg font-bold ${txt}`}>المهام</h2>
                    <button onClick={() => { setModalType('task'); setShowModal(true); }} className={`px-4 py-2 bg-gradient-to-r ${accent.gradient} text-white rounded-xl text-sm flex items-center gap-2`}><Plus className="w-4 h-4" />إضافة</button>
                  </div>
                  <div className="space-y-3">
                    {tasks.map(task => {
                      const color = getTaskColor(task.priority);
                      return (
                        <div key={task.id} className={`${card} p-4 rounded-xl border ${color.border}`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className={`font-bold ${txt}`}>{task.title}</h3>
                              <p className={`text-sm ${txtSm}`}>{task.refNumber}</p>
                              <Badge status={task.priority} />
                              {task.dueDate && <p className={`text-sm ${txtSm} mt-1`}>التسليم: {task.dueDate}</p>}
                            </div>
                            <div className="flex gap-1">
                              <IconBtn icon={Pencil} onClick={() => { setEditingItem(task); setModalType('editTask'); setShowModal(true); }} title="تعديل" />
                              <IconBtn icon={Trash2} onClick={() => delTask(task)} title="حذف" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {tasks.length === 0 && <div className={`${card} p-8 rounded-xl border text-center`}><CheckSquare className={`w-12 h-12 mx-auto mb-3 ${txtSm}`} /><p className={txtSm}>لا توجد مهام</p></div>}
                  </div>
                </div>
              )}

              {/* Projects */}
              {currentView === 'projects' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className={`text-lg font-bold ${txt}`}>المشاريع</h2>
                    <button onClick={() => { setModalType('project'); setShowModal(true); }} className={`px-4 py-2 bg-gradient-to-r ${accent.gradient} text-white rounded-xl text-sm flex items-center gap-2`}><Plus className="w-4 h-4" />إضافة</button>
                  </div>
                  <div className="space-y-3">
                    {projects.map(proj => {
                      const color = getProjectColor(proj.status);
                      return (
                        <div key={proj.id} className={`${card} p-4 rounded-xl border ${color.border}`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className={`font-bold ${txt}`}>{proj.name}</h3>
                              <p className={`text-sm ${txtSm}`}>{proj.refNumber} | {proj.client}</p>
                              <Badge status={proj.status} />
                              {proj.budget && <p className={`text-sm ${txt} mt-1`}>الميزانية: {formatNumber(proj.budget)} ر.س</p>}
                            </div>
                            <div className="flex gap-1">
                              <IconBtn icon={Pencil} onClick={() => { setEditingItem(proj); setModalType('editProject'); setShowModal(true); }} title="تعديل" />
                              <IconBtn icon={Trash2} onClick={() => delProject(proj)} title="حذف" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {projects.length === 0 && <div className={`${card} p-8 rounded-xl border text-center`}><FolderOpen className={`w-12 h-12 mx-auto mb-3 ${txtSm}`} /><p className={txtSm}>لا توجد مشاريع</p></div>}
                  </div>
                </div>
              )}

              {/* Accounts */}
              {currentView === 'accounts' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className={`text-lg font-bold ${txt}`}>الحسابات</h2>
                    <button onClick={() => { setModalType('account'); setShowModal(true); }} className={`px-4 py-2 bg-gradient-to-r ${accent.gradient} text-white rounded-xl text-sm flex items-center gap-2`}><Plus className="w-4 h-4" />إضافة</button>
                  </div>
                  <div className="space-y-3">
                    {accounts.map(acc => (
                      <div key={acc.id} className={`${card} p-4 rounded-xl border`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className={`font-bold ${txt}`}>{acc.name}</h3>
                            <p className={`text-sm ${txtSm}`}>{acc.refNumber}</p>
                            <p className={`text-sm ${txtSm}`}>المستخدم: {acc.username}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-sm ${txtSm}`}>كلمة المرور: {showPasswordId === acc.id ? acc.password : '••••••••'}</span>
                              <button onClick={() => setShowPasswordId(showPasswordId === acc.id ? null : acc.id)} className={txtSm}>{showPasswordId === acc.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                              <button onClick={() => copyToClipboard(acc.password)} className={txtSm}><Copy className="w-4 h-4" /></button>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <IconBtn icon={Pencil} onClick={() => { setEditingItem(acc); setModalType('editAccount'); setShowModal(true); }} title="تعديل" />
                            <IconBtn icon={Trash2} onClick={() => delAccount(acc)} title="حذف" />
                          </div>
                        </div>
                      </div>
                    ))}
                    {accounts.length === 0 && <div className={`${card} p-8 rounded-xl border text-center`}><Users className={`w-12 h-12 mx-auto mb-3 ${txtSm}`} /><p className={txtSm}>لا توجد حسابات</p></div>}
                  </div>
                </div>
              )}

              {/* Users */}
              {currentView === 'users' && (
                <div>
                  <h2 className={`text-lg font-bold mb-4 ${txt}`}>المستخدمين ({users.length})</h2>
                  <div className="space-y-3">
                    {users.map(user => (
                      <div key={user.id} className={`${card} p-4 rounded-xl border`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${accent.color} text-white font-bold`}>{user.name?.charAt(0) || 'U'}</div>
                          <div>
                            <h3 className={`font-bold ${txt}`}>{user.name}</h3>
                            <p className={`text-sm ${txtSm}`}>{user.email}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-lg ${user.role === 'owner' ? 'bg-yellow-500/20 text-yellow-400' : user.role === 'manager' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>{user.role === 'owner' ? 'المالك' : user.role === 'manager' ? 'مدير' : 'عضو'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending Users */}
              {currentView === 'pending' && currentUser?.role === 'owner' && (
                <div>
                  <h2 className={`text-lg font-bold mb-4 ${txt}`}>طلبات الانضمام ({pendingUsers.length})</h2>
                  {pendingUsers.length === 0 ? (
                    <div className={`${card} p-8 rounded-xl border text-center`}><Shield className={`w-12 h-12 mx-auto mb-3 ${txtSm}`} /><p className={txtSm}>لا توجد طلبات انضمام</p></div>
                  ) : (
                    <div className="space-y-3">
                      {pendingUsers.map(user => (
                        <div key={user.id} className={`${card} p-4 rounded-xl border`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className={`font-bold ${txt}`}>{user.name}</h3>
                              <p className={`text-sm ${txtSm}`}>{user.email}</p>
                              <p className={`text-xs ${txtSm}`}>تاريخ الطلب: {new Date(user.requestDate || user.createdAt).toLocaleDateString('ar-SA')}</p>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => approveUser(user)} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm flex items-center gap-1"><CheckCircle className="w-4 h-4" />قبول</button>
                              <button onClick={() => rejectUser(user)} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm flex items-center gap-1"><XCircle className="w-4 h-4" />رفض</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Archive */}
              {currentView === 'archive' && (
                <div>
                  <h2 className={`text-lg font-bold mb-4 ${txt}`}>الأرشيف</h2>
                  {archivedExpenses.length > 0 && (<><h3 className={`font-bold mb-2 ${txt}`}>المصروفات المحذوفة</h3><div className="space-y-2 mb-4">{archivedExpenses.map(exp => (<div key={exp.id} className={`${card} p-3 rounded-xl border flex justify-between items-center`}><div><span className={`font-bold ${txt}`}>{exp.name}</span><span className={`text-sm ${txtSm} mr-2`}>{formatNumber(exp.amount)} ر.س</span></div><button onClick={() => restoreExpense(exp)} className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm flex items-center gap-1"><RotateCcw className="w-3 h-3" />استعادة</button></div>))}</div></>)}
                  {archivedTasks.length > 0 && (<><h3 className={`font-bold mb-2 ${txt}`}>المهام المحذوفة</h3><div className="space-y-2 mb-4">{archivedTasks.map(t => (<div key={t.id} className={`${card} p-3 rounded-xl border flex justify-between items-center`}><span className={`font-bold ${txt}`}>{t.title}</span><button onClick={() => restoreTask(t)} className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm flex items-center gap-1"><RotateCcw className="w-3 h-3" />استعادة</button></div>))}</div></>)}
                  {archivedProjects.length > 0 && (<><h3 className={`font-bold mb-2 ${txt}`}>المشاريع المحذوفة</h3><div className="space-y-2 mb-4">{archivedProjects.map(p => (<div key={p.id} className={`${card} p-3 rounded-xl border flex justify-between items-center`}><span className={`font-bold ${txt}`}>{p.name}</span><button onClick={() => restoreProject(p)} className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm flex items-center gap-1"><RotateCcw className="w-3 h-3" />استعادة</button></div>))}</div></>)}
                  {archivedAccounts.length > 0 && (<><h3 className={`font-bold mb-2 ${txt}`}>الحسابات المحذوفة</h3><div className="space-y-2 mb-4">{archivedAccounts.map(a => (<div key={a.id} className={`${card} p-3 rounded-xl border flex justify-between items-center`}><span className={`font-bold ${txt}`}>{a.name}</span><button onClick={() => restoreAccount(a)} className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm flex items-center gap-1"><RotateCcw className="w-3 h-3" />استعادة</button></div>))}</div></>)}
                  {archivedExpenses.length === 0 && archivedTasks.length === 0 && archivedProjects.length === 0 && archivedAccounts.length === 0 && (<div className={`${card} p-8 rounded-xl border text-center`}><Archive className={`w-12 h-12 mx-auto mb-3 ${txtSm}`} /><p className={txtSm}>الأرشيف فارغ</p></div>)}
                </div>
              )}

              {/* Audit */}
              {currentView === 'audit' && (
                <div>
                  <h2 className={`text-lg font-bold mb-4 ${txt}`}>سجل العمليات</h2>
                  <div className="space-y-2">
                    {auditLog.map(log => (<div key={log.id} className={`${card} p-3 rounded-xl border`}><p className={`text-sm ${txt}`}>{log.description}</p><p className={`text-xs ${txtSm}`}>{new Date(log.timestamp).toLocaleString('ar-SA')}</p></div>))}
                    {auditLog.length === 0 && (<div className={`${card} p-8 rounded-xl border text-center`}><History className={`w-12 h-12 mx-auto mb-3 ${txtSm}`} /><p className={txtSm}>لا توجد عمليات</p></div>)}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => { setShowModal(false); setEditingItem(null); }}>
              <div className={`${cardPopup} p-6 rounded-2xl w-full max-w-md border max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-lg font-bold ${txt}`}>{modalType.includes('edit') ? 'تعديل' : 'إضافة'} {modalType.includes('xpense') ? 'مصروف' : modalType.includes('ask') ? 'مهمة' : modalType.includes('roject') ? 'مشروع' : 'حساب'}</h3>
                  <button onClick={() => { setShowModal(false); setEditingItem(null); }} className={txtSm}><X className="w-5 h-5" /></button>
                </div>

                {(modalType === 'expense' || modalType === 'editExpense') && (
                  <div className="space-y-3">
                    <input placeholder="اسم المصروف *" value={editingItem?.name || newExpense.name} onChange={e => editingItem ? setEditingItem({...editingItem, name: e.target.value}) : setNewExpense({...newExpense, name: e.target.value})} className={`w-full p-3 rounded-xl border ${inp}`} />
                    <input type="number" placeholder="المبلغ *" value={editingItem?.amount || newExpense.amount} onChange={e => editingItem ? setEditingItem({...editingItem, amount: e.target.value}) : setNewExpense({...newExpense, amount: e.target.value})} className={`w-full p-3 rounded-xl border ${inp}`} />
                    <select value={editingItem?.type || newExpense.type} onChange={e => editingItem ? setEditingItem({...editingItem, type: e.target.value}) : setNewExpense({...newExpense, type: e.target.value})} className={`w-full p-3 rounded-xl border ${inp}`}><option>شهري</option><option>سنوي</option><option>مرة واحدة</option></select>
                    <input type="date" value={editingItem?.dueDate || newExpense.dueDate} onChange={e => editingItem ? setEditingItem({...editingItem, dueDate: e.target.value}) : setNewExpense({...newExpense, dueDate: e.target.value})} className={`w-full p-3 rounded-xl border ${inp}`} />
                    <textarea placeholder="السبب/الملاحظات" value={editingItem?.reason || newExpense.reason} onChange={e => editingItem ? setEditingItem({...editingItem, reason: e.target.value}) : setNewExpense({...newExpense, reason: e.target.value})} className={`w-full p-3 rounded-xl border ${inp}`} rows={2} />
                    <button onClick={() => openMapPicker(editingItem ? 'editExpense' : 'newExpense')} className={`w-full p-3 rounded-xl border ${inp} flex items-center justify-center gap-2`}><MapPin className="w-4 h-4" />تحديد الموقع</button>
                    <button onClick={editingItem ? editExpense : addExpense} className={`w-full p-3 bg-gradient-to-r ${accent.gradient} text-white rounded-xl font-bold`}>{editingItem ? 'حفظ التعديلات' : 'إضافة المصروف'}</button>
                  </div>
                )}

                {(modalType === 'task' || modalType === 'editTask') && (
                  <div className="space-y-3">
                    <input placeholder="عنوان المهمة *" value={editingItem?.title || newTask.title} onChange={e => editingItem ? setEditingItem({...editingItem, title: e.target.value}) : setNewTask({...newTask, title: e.target.value})} className={`w-full p-3 rounded-xl border ${inp}`} />
                    <textarea placeholder="الوصف" value={editingItem?.description || newTask.description} onChange={e => editingItem ? setEditingItem({...editingItem, description: e.target.value}) : setNewTask({...newTask, description: e.target.value})} className={`w-full p-3 rounded-xl border ${inp}`} rows={2} />
                    <select value={editingItem?.priority || newTask.priority} onChange={e => editingItem ? setEditingItem({...editingItem, priority: e.target.value}) : setNewTask({...newTask, priority: e.target.value})} className={`w-full p-3 rounded-xl border ${inp}`}><option>عالي الأهمية</option><option>مستعجل</option><option>متوسط الأهمية</option><option>منخفض الأهمية</option></select>
                    <input type="date" value={editingItem?.dueDate || newTask.dueDate} onChange={e => editingItem ? setEditingItem({...editingItem, dueDate: e.target.value}) : setNewTask({...newTask, dueDate: e.target.value})} className={`w-full p-3 rounded-xl border ${inp}`} />
                    <button onClick={editingItem ? editTask : addTask} className={`w-full p-3 bg-gradient-to-r ${accent.gradient} text-white rounded-xl font-bold`}>{editingItem ? 'حفظ التعديلات' : 'إضافة المهمة'}</button>
                  </div>
                )}

                {(modalType === 'project' || modalType === 'editProject') && (
                  <div className="space-y-3">
                    <input placeholder="اسم المشروع *" value={editingItem?.name || newProject.name} onChange={e => editingItem ? setEditingItem({...editingItem, name: e.target.value}) : setNewProject({...newProject, name: e.target.value})} className={`w-full p-3 rounded-xl border ${inp}`} />
                    <input placeholder="العميل" value={editingItem?.client || newProject.client} onChange={e => editingItem ? setEditingItem({...editingItem, client: e.target.value}) : setNewProject({...newProject, client: e.target.value})} className={`w-full p-3 rounded-xl border ${inp}`} />
                    <textarea placeholder="الوصف" value={editingItem?.description || newProject.description} onChange={e => editingItem ? setEditingItem({...editingItem, description: e.target.value}) : setNewProject({...newProject, description: e.target.value})} className={`w-full p-3 rounded-xl border ${inp}`} rows={2} />
                    <input type="number" placeholder="الميزانية" value={editingItem?.budget || newProject.budget} onChange={e => editingItem ? setEditingItem({...editingItem, budget: e.target.value}) : setNewProject({...newProject, budget: e.target.value})} className={`w-full p-3 rounded-xl border ${inp}`} />
                    <select value={editingItem?.status || newProject.status} onChange={e => editingItem ? setEditingItem({...editingItem, status: e.target.value}) : setNewProject({...newProject, status: e.target.value})} className={`w-full p-3 rounded-xl border ${inp}`}><option>جاري العمل</option><option>مكتمل</option><option>متوقف</option></select>
                    <button onClick={editingItem ? editProject : addProject} className={`w-full p-3 bg-gradient-to-r ${accent.gradient} text-white rounded-xl font-bold`}>{editingItem ? 'حفظ التعديلات' : 'إضافة المشروع'}</button>
                  </div>
                )}

                {(modalType === 'account' || modalType === 'editAccount') && (
                  <div className="space-y-3">
                    <input placeholder="اسم الحساب *" value={editingItem?.name || newAccount.name} onChange={e => editingItem ? setEditingItem({...editingItem, name: e.target.value}) : setNewAccount({...newAccount, name: e.target.value})} className={`w-full p-3 rounded-xl border ${inp}`} />
                    <input placeholder="اسم المستخدم *" value={editingItem?.username || newAccount.username} onChange={e => editingItem ? setEditingItem({...editingItem, username: e.target.value}) : setNewAccount({...newAccount, username: e.target.value})} className={`w-full p-3 rounded-xl border ${inp}`} />
                    <input type="password" placeholder="كلمة المرور" value={editingItem?.password || newAccount.password} onChange={e => editingItem ? setEditingItem({...editingItem, password: e.target.value}) : setNewAccount({...newAccount, password: e.target.value})} className={`w-full p-3 rounded-xl border ${inp}`} />
                    <input placeholder="رابط تسجيل الدخول" value={editingItem?.loginUrl || newAccount.loginUrl} onChange={e => editingItem ? setEditingItem({...editingItem, loginUrl: e.target.value}) : setNewAccount({...newAccount, loginUrl: e.target.value})} className={`w-full p-3 rounded-xl border ${inp}`} />
                    <textarea placeholder="الوصف" value={editingItem?.description || newAccount.description} onChange={e => editingItem ? setEditingItem({...editingItem, description: e.target.value}) : setNewAccount({...newAccount, description: e.target.value})} className={`w-full p-3 rounded-xl border ${inp}`} rows={2} />
                    <button onClick={editingItem ? editAccount : addAccount} className={`w-full p-3 bg-gradient-to-r ${accent.gradient} text-white rounded-xl font-bold`}>{editingItem ? 'حفظ التعديلات' : 'إضافة الحساب'}</button>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
