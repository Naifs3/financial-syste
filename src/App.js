import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { Calendar, CheckSquare, Users, Moon, Sun, Monitor, Plus, Archive, Clock, Activity, History, Loader, Power, Pencil, Trash2, RotateCcw, UserCog, ChevronLeft, ChevronDown, ChevronUp, FolderOpen, FileText, MapPin, User, X, Phone, Settings, Layers, CreditCard, TrendingUp, DollarSign, Wallet, FolderPlus, AlertTriangle, Image, Map, Type, Search } from 'lucide-react';

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
const APP_VERSION = "4.3.0";

const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

const SAR = () => <span style={{ fontFamily: 'Arial' }}>&#x0631;&#x002E;&#x0633;</span>;

const versionHistory = [
  { version: "4.3.0", date: "2024-12-14", changes: ["خريطة تفاعلية مع بحث", "تحسين عرض البيانات", "إزالة الفقاعات", "بطاقات المستخدمين"] },
  { version: "4.2.0", date: "2024-12-14", changes: ["إصلاح الوقت والعبارات", "تحكم بأحجام الخط"] },
  { version: "4.1.0", date: "2024-12-14", changes: ["ترحيب ديناميكي", "سجل الدفعات"] },
];

const quotes = [
  "النجاح يبدأ بخطوة 🚀", "استثمر وقتك بحكمة ⏰", "التخطيط المالي مفتاح النجاح 💰", "كل يوم فرصة جديدة 🌟",
  "الإصرار يصنع المستحيل 💪", "فكر كبيراً وابدأ صغيراً 🎯", "المثابرة طريق التميز ⭐", "النظام أساس النجاح 📊",
];

const getGreeting = (username, hour) => {
  if (hour >= 5 && hour < 12) return `صباح الخير ${username} ☀️`;
  if (hour >= 12 && hour < 17) return `مساء النور ${username} 🌤️`;
  if (hour >= 17 && hour < 21) return `مساء الخير ${username} 🌅`;
  return `مساء الأنوار ${username} 🌙`;
};

const backgrounds = [
  { id: 0, name: 'كلاسيكي', dark: 'from-gray-900 via-purple-900 to-gray-900', light: 'from-blue-50 via-indigo-50 to-purple-50' },
  { id: 1, name: 'أزرق ملكي', dark: 'from-blue-950 via-blue-900 to-indigo-950', light: 'from-blue-100 via-sky-50 to-indigo-100' },
  { id: 2, name: 'ذهبي فاخر', dark: 'from-yellow-950 via-amber-900 to-orange-950', light: 'from-yellow-50 via-amber-50 to-orange-50' },
  { id: 3, name: 'أخضر النجاح', dark: 'from-emerald-950 via-green-900 to-teal-950', light: 'from-emerald-50 via-green-50 to-teal-50' },
  { id: 4, name: 'بنفسجي راقي', dark: 'from-purple-950 via-violet-900 to-indigo-950', light: 'from-purple-50 via-violet-50 to-indigo-50' },
];

const accentColors = [
  { id: 0, name: 'أزرق', color: 'bg-blue-500', gradient: 'from-blue-600 to-blue-700', text: 'text-blue-500' },
  { id: 1, name: 'بنفسجي', color: 'bg-purple-500', gradient: 'from-purple-600 to-purple-700', text: 'text-purple-500' },
  { id: 2, name: 'أخضر', color: 'bg-emerald-500', gradient: 'from-emerald-600 to-emerald-700', text: 'text-emerald-500' },
  { id: 3, name: 'برتقالي', color: 'bg-orange-500', gradient: 'from-orange-600 to-orange-700', text: 'text-orange-500' },
  { id: 4, name: 'وردي', color: 'bg-pink-500', gradient: 'from-pink-600 to-pink-700', text: 'text-pink-500' },
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
  const [position, setPosition] = useState({ lat: 24.7136, lng: 46.6753 });
  const [locationName, setLocationName] = useState('الرياض');
  const mapRef = useRef(null);

  const searchLocation = async () => {
    if (!search.trim()) return;
    setSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        const result = data[0];
        setPosition({ lat: parseFloat(result.lat), lng: parseFloat(result.lon) });
        setLocationName(result.display_name.split(',')[0]);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
    setSearching(false);
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
          <div className="flex gap-2 mb-4">
            <input 
              type="text" 
              placeholder="ابحث عن موقع (مثال: برج المملكة، الرياض)" 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && searchLocation()}
              className={`flex-1 p-3 rounded-xl border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'}`}
            />
            <button 
              onClick={searchLocation} 
              disabled={searching}
              className={`px-4 rounded-xl ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white flex items-center gap-2`}
            >
              {searching ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </button>
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
  const [bgIndex, setBgIndex] = useState(() => parseInt(localStorage.getItem('bgIndex')) || 0);
  const [accentIndex, setAccentIndex] = useState(() => parseInt(localStorage.getItem('accentIndex')) || 0);
  const [currentView, setCurrentView] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectFilter, setProjectFilter] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState(quotes[0]);
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

  const emptyExpense = { name: '', amount: '', currency: 'ر.س', dueDate: '', type: 'شهري', reason: '', status: 'قيد الانتظار', location: '', mapUrl: '', coordinates: '' };
  const emptyTask = { title: '', description: '', dueDate: '', assignedTo: '', priority: 'متوسطة', status: 'قيد الانتظار', projectId: '', sectionId: '', location: '', mapUrl: '', coordinates: '' };
  const emptyProject = { name: '', description: '', client: '', location: '', phone: '', startDate: '', endDate: '', budget: '', status: 'جاري', mapUrl: '', coordinates: '', files: { images: [], documents: [], others: [] } };
  const emptyAccount = { name: '', description: '', loginUrl: '', username: '', password: '', subscriptionDate: '', daysRemaining: 365 };
  const emptyUser = { username: '', password: '', role: 'member', active: true };
  const emptySection = { name: '', color: 'blue' };

  const [newExpense, setNewExpense] = useState(emptyExpense);
  const [newTask, setNewTask] = useState(emptyTask);
  const [newProject, setNewProject] = useState(emptyProject);
  const [newAccount, setNewAccount] = useState(emptyAccount);
  const [newUser, setNewUser] = useState(emptyUser);
  const [newSection, setNewSection] = useState(emptySection);

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
  useEffect(() => { localStorage.setItem('fontSize', fontSize); }, [fontSize]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'data', 'main'), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setUsers(d.users || defaultUsers);
        setExpenses(d.expenses || []);
        setTasks(d.tasks || []);
        setProjects(d.projects || []);
        setTaskSections(d.taskSections || []);
        setAccounts(d.accounts || []);
        setAuditLog(d.auditLog || []);
        setArchivedExpenses(d.archivedExpenses || []);
        setArchivedTasks(d.archivedTasks || []);
        setArchivedAccounts(d.archivedAccounts || []);
        setArchivedProjects(d.archivedProjects || []);
        setLoginLog(d.loginLog || []);
      }
      setLoading(false);
    });
    return () => unsub();
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
        loginLog: d.loginLog || loginLog 
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
    if (!newExpense.name || !newExpense.amount) return alert('املأ الحقول المطلوبة');
    if (newExpense.type !== 'مرة واحدة' && !newExpense.dueDate) return alert('حدد تاريخ الاستحقاق');
    const exp = { ...newExpense, id: `E${Date.now()}`, amount: parseFloat(newExpense.amount), createdAt: new Date().toISOString(), createdBy: currentUser.username, paymentHistory: [] };
    const ne = [...expenses, exp]; const al = addLog('add', 'مصروف', exp.name, exp.id);
    setExpenses(ne); save({ expenses: ne, auditLog: al });
    setNewExpense(emptyExpense); setShowModal(false);
  };

  const editExpense = () => {
    if (!editingItem.name || !editingItem.amount) return alert('املأ الحقول');
    const ne = expenses.map(e => e.id === editingItem.id ? { ...editingItem, updatedAt: new Date().toISOString() } : e);
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
    const ne = expenses.map(e => e.id === id ? { ...e, status: 'مدفوع', paidAt: new Date().toISOString(), paymentHistory: [...(e.paymentHistory || []), payment] } : e);
    const al = addLog('pay', 'مصروف', exp.name, exp.id); 
    setExpenses(ne); save({ expenses: ne, auditLog: al });
  };

  const addTask = () => {
    if (!newTask.title) return alert('أدخل عنوان المهمة');
    const t = { ...newTask, id: `T${Date.now()}`, createdAt: new Date().toISOString(), createdBy: currentUser.username };
    const nt = [...tasks, t]; const al = addLog('add', 'مهمة', t.title, t.id);
    setTasks(nt); save({ tasks: nt, auditLog: al });
    setNewTask(emptyTask); setShowModal(false);
  };

  const editTask = () => {
    if (!editingItem.title) return alert('أدخل عنوان المهمة');
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
    if (!newSection.name) return alert('أدخل اسم القسم');
    const s = { id: `S${Date.now()}`, name: newSection.name, color: newSection.color, createdAt: new Date().toISOString(), createdBy: currentUser.username };
    const ns = [...taskSections, s]; const al = addLog('add', 'قسم', s.name, s.id);
    setTaskSections(ns); save({ taskSections: ns, auditLog: al });
    setNewSection(emptySection); setShowModal(false);
  };

  const addProject = () => {
    if (!newProject.name) return alert('أدخل اسم المشروع');
    const p = { ...newProject, id: `P${Date.now()}`, createdAt: new Date().toISOString(), createdBy: currentUser.username };
    const np = [...projects, p]; const al = addLog('add', 'مشروع', p.name, p.id);
    setProjects(np); save({ projects: np, auditLog: al });
    setNewProject(emptyProject); setShowModal(false);
  };

  const editProject = () => {
    if (!editingItem.name) return alert('أدخل اسم المشروع');
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
    if (!newAccount.name || !newAccount.username) return alert('املأ الحقول');
    const a = { ...newAccount, id: `A${Date.now()}`, createdAt: new Date().toISOString(), createdBy: currentUser.username };
    const na = [...accounts, a]; const al = addLog('add', 'حساب', a.name, a.id);
    setAccounts(na); save({ accounts: na, auditLog: al });
    setNewAccount(emptyAccount); setShowModal(false);
  };

  const editAccount = () => {
    if (!editingItem.name) return alert('املأ الحقول');
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
    if (!newUser.username || !newUser.password) return alert('املأ الحقول');
    if (users.find(u => u.username === newUser.username)) return alert('المستخدم موجود');
    const u = { ...newUser, id: Date.now(), createdAt: new Date().toISOString(), createdBy: currentUser.username };
    const nu = [...users, u]; const al = addLog('add', 'مستخدم', u.username, u.id);
    setUsers(nu); save({ users: nu, auditLog: al });
    setNewUser(emptyUser); setShowModal(false);
  };

  const editUser = () => {
    if (!editingItem.username) return alert('املأ الحقول');
    const nu = users.map(u => u.id === editingItem.id ? { ...editingItem, updatedAt: new Date().toISOString() } : u);
    const al = addLog('edit', 'مستخدم', editingItem.username, editingItem.id);
    setUsers(nu); save({ users: nu, auditLog: al }); setEditingItem(null); setShowModal(false);
  };

  const delUser = (u) => {
    if (u.role === 'owner') return alert('لا يمكن حذف المالك');
    if (u.username === currentUser.username) return alert('لا يمكن حذف نفسك');
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
  const bg = `bg-gradient-to-br ${darkMode ? currentBg.dark : currentBg.light}`;
  const card = darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200';
  const inp = darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400';
  const txt = darkMode ? 'text-white' : 'text-gray-900';
  const txtMd = darkMode ? 'text-gray-200' : 'text-gray-700';
  const txtSm = darkMode ? 'text-gray-400' : 'text-gray-500';

  const totalArchived = (archivedExpenses?.length || 0) + (archivedTasks?.length || 0) + (archivedAccounts?.length || 0) + (archivedProjects?.length || 0);
  const urgentExpenses = expenses.filter(e => e.status !== 'مدفوع' && e.type !== 'مرة واحدة' && calcDays(e.dueDate) <= 15 && calcDays(e.dueDate) !== null);
  const urgentTasks = tasks.filter(t => t.priority === 'عالية' || (calcDays(t.dueDate) !== null && calcDays(t.dueDate) < 0));
  const totalExpenses = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const monthlyExpenses = expenses.filter(e => e.type === 'شهري').reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const yearlyExpenses = expenses.filter(e => e.type === 'سنوي').reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const onceExpenses = expenses.filter(e => e.type === 'مرة واحدة').reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  const Label = ({ children }) => <span className={`text-xs ${txtSm}`}>{children}</span>;
  const Priority = ({ level }) => (
    <span className={`text-xs px-2 py-0.5 rounded ${level === 'عالية' ? 'bg-red-500 text-white' : level === 'متوسطة' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'}`}>{level}</span>
  );

  const IconBtn = ({ onClick, icon: Icon, title, disabled }) => (
    <button onClick={onClick} disabled={disabled} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} ${disabled ? 'opacity-50' : ''}`} title={title}>
      <Icon className="w-4 h-4" />
    </button>
  );

  const hideScrollbar = { scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' };
  const hideScrollbarClass = '[&::-webkit-scrollbar]:hidden';

  if (loading) return <div className={`min-h-screen ${bg} flex items-center justify-center`} dir="rtl"><Loader className="w-12 h-12 text-blue-500 animate-spin" /></div>;


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

  const greeting = getGreeting(currentUser.username, currentTime.getHours());

  return (
    <div className={`min-h-screen ${bg} relative overflow-x-hidden`} style={{ fontSize: `${fontSize}px`, ...hideScrollbar }} dir="rtl">
      <style>{`*::-webkit-scrollbar { display: none; } * { scrollbar-width: none; -ms-overflow-style: none; } input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; } input[type=number] { -moz-appearance: textfield; }`}</style>
      <FinancialPattern />
      
      {showMapPicker && <MapPicker darkMode={darkMode} onClose={() => setShowMapPicker(false)} onSelect={handleMapSelect} />}
      
      <div className={`${card} border-b px-4 py-3 flex flex-wrap items-center justify-between sticky top-0 z-50 gap-3`}>
        <div className="flex items-center gap-3">
          <button onClick={() => { setCurrentView('dashboard'); setSelectedProject(null); }} className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-700 font-bold text-xs" style={{ backgroundColor: '#dcdddc' }}>RKZ</button>
          <div>
            <h1 className={`font-bold ${txt}`}>نظام الإدارة المالية</h1>
            <p className={`text-xs ${txtSm}`}>ركائز الأولى للتعمير</p>
            <p className={`text-xs ${txtSm}`}>{currentTime.toLocaleDateString('en-US')} | {currentTime.toLocaleTimeString('en-US', { hour12: false })} | {quote}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs ${txt}`}>{greeting}</span>
          <span className={`text-xs px-2 py-0.5 rounded ${currentUser.role === 'owner' ? 'bg-amber-500' : currentUser.role === 'manager' ? 'bg-blue-500' : 'bg-gray-500'} text-white`}>
            {currentUser.role === 'owner' ? 'صلاحية: المالك' : currentUser.role === 'manager' ? 'صلاحية: مدير' : 'صلاحية: عضو'}
          </span>
          <span className={`text-xs ${txtSm}`}>({formatNumber(getSessionMinutes())} د)</span>
          
          <div className="relative" ref={auditRef}>
            <button onClick={() => { setShowAuditPanel(!showAuditPanel); setShowArchivePanel(false); setShowSettingsPanel(false); setNewNotifications(0); }} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <Clock className={`w-5 h-5 ${txtMd}`} />
              {newNotifications > 0 && <span className={`absolute -top-1 -right-1 w-4 h-4 ${accent.color} text-white text-xs rounded-full flex items-center justify-center`}>{newNotifications}</span>}
            </button>
            {showAuditPanel && (
              <div className={`absolute left-0 top-12 w-80 ${card} rounded-xl shadow-2xl border z-50 max-h-80 overflow-y-auto ${hideScrollbarClass}`} style={hideScrollbar}>
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
            <button onClick={() => { setShowArchivePanel(!showArchivePanel); setShowAuditPanel(false); setShowSettingsPanel(false); setArchiveNotifications(0); }} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <Archive className={`w-5 h-5 ${txtMd}`} />
              {archiveNotifications > 0 && <span className={`absolute -top-1 -right-1 w-4 h-4 ${accent.color} text-white text-xs rounded-full flex items-center justify-center`}>{archiveNotifications}</span>}
            </button>
            {showArchivePanel && (
              <div className={`absolute left-0 top-12 w-64 ${card} rounded-xl shadow-2xl border z-50`}>
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
            <button onClick={() => { setShowSettingsPanel(!showSettingsPanel); setShowAuditPanel(false); setShowArchivePanel(false); }} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <Settings className={`w-5 h-5 ${txtMd}`} />
            </button>
            {showSettingsPanel && (
              <div className={`absolute left-0 top-12 w-72 ${card} rounded-xl shadow-2xl border z-50 p-4 max-h-96 overflow-y-auto ${hideScrollbarClass}`} style={hideScrollbar}>
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
                  <div className="flex gap-2">{backgrounds.map((b, i) => (<button key={b.id} onClick={() => setBgIndex(i)} className={`w-8 h-8 rounded-lg bg-gradient-to-br ${b.dark} ${bgIndex === i ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`} title={b.name} />))}</div>
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
        <div className={`w-full md:w-44 ${card} border-b md:border-l p-2`}>
          <nav className="flex md:flex-col gap-1 flex-wrap">
            {[{ id: 'dashboard', icon: Activity, label: 'الرئيسية' },{ id: 'expenses', icon: Wallet, label: 'المصروفات' },{ id: 'tasks', icon: CheckSquare, label: 'المهام' },{ id: 'projects', icon: FolderOpen, label: 'المشاريع' },{ id: 'accounts', icon: Users, label: 'الحسابات' },{ id: 'users', icon: UserCog, label: 'المستخدمين' },{ id: 'archive', icon: Archive, label: 'الأرشيف' },{ id: 'audit', icon: History, label: 'السجل' }].map(item => (
              <button key={item.id} onClick={() => { setCurrentView(item.id); setSelectedProject(null); setProjectFilter(null); }} className={`flex items-center gap-2 p-2 rounded-xl transition-all ${currentView === item.id ? `bg-gradient-to-r ${accent.gradient} text-white` : darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>
                <item.icon className="w-4 h-4" /><span className="text-xs">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className={`flex-1 p-4 relative z-10 overflow-y-auto ${hideScrollbarClass}`} style={hideScrollbar}>
          
          {currentView === 'dashboard' && (
            <div>
              <h2 className={`text-lg font-bold mb-4 ${txt}`}>لوحة التحكم</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[{ label: 'المصروفات', value: expenses.length, sub: `${expenses.filter(e => e.status !== 'مدفوع').length} قيد الانتظار`, gradient: 'from-blue-500 to-blue-600', view: 'expenses' },
                  { label: 'المهام', value: tasks.length, sub: `${tasks.filter(t => t.priority === 'عالية').length} عالية`, gradient: 'from-green-500 to-green-600', view: 'tasks' },
                  { label: 'المشاريع', value: projects.length, sub: `${projects.filter(p => p.status === 'جاري').length} جاري`, gradient: 'from-purple-500 to-purple-600', view: 'projects' },
                  { label: 'الحسابات', value: accounts.length, sub: 'حساب', gradient: 'from-orange-500 to-orange-600', view: 'accounts' }].map((k, i) => (
                  <button key={i} onClick={() => setCurrentView(k.view)} className={`bg-gradient-to-br ${k.gradient} p-3 rounded-xl text-white text-right`}>
                    <p className="text-xs opacity-80">{k.label}</p>
                    <p className="text-2xl font-bold">{formatNumber(k.value)}</p>
                    <p className="text-xs opacity-70">{k.sub}</p>
                  </button>
                ))}
              </div>

              {(urgentExpenses.length > 0 || urgentTasks.length > 0) && (
                <div className={`${card} p-4 rounded-xl border mb-4`}>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <h3 className={`font-bold ${txt}`}>عالية الأهمية</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {urgentExpenses.slice(0, 3).map(e => {
                      const d = calcDays(e.dueDate);
                      return (
                        <div key={e.id} className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className={`text-sm font-bold ${txt}`}>{e.name}</span>
                            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded">{d < 0 ? `متأخر ${formatNumber(Math.abs(d))} يوم` : `${formatNumber(d)} يوم`}</span>
                          </div>
                          <p className={`text-lg font-bold ${txt}`}>{formatNumber(e.amount)} <SAR /></p>
                        </div>
                      );
                    })}
                    {urgentTasks.slice(0, 3).map(t => (
                      <div key={t.id} className="bg-orange-500/10 border border-orange-500/30 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-bold ${txt}`}>{t.title}</span>
                          <Priority level={t.priority} />
                        </div>
                        <p className={`text-xs ${txtSm}`}>المسؤول: {t.assignedTo || 'غير محدد'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className={`${card} p-4 rounded-xl border`}>
                  <div className="flex justify-between mb-3"><h3 className={`font-bold text-sm ${txt}`}>المصروفات القادمة</h3><button onClick={() => setCurrentView('expenses')} className={`text-xs ${accent.text}`}>الكل</button></div>
                  {expenses.filter(e => e.status !== 'مدفوع').length === 0 ? <p className={`text-center py-6 text-xs ${txtSm}`}>لا توجد مصروفات</p> : 
                    expenses.filter(e => e.status !== 'مدفوع').slice(0, 4).map(e => {
                      const d = calcDays(e.dueDate);
                      return (
                        <div key={e.id} className={`p-2 rounded-lg mb-2 ${d !== null && d < 0 ? 'bg-red-500/20' : d !== null && d < 7 ? 'bg-orange-500/20' : 'bg-green-500/20'}`}>
                          <div className="flex justify-between"><span className={`text-xs ${txt}`}>{e.name}</span><span className={`text-xs font-bold ${txt}`}>{formatNumber(e.amount)} <SAR /></span></div>
                          {d !== null && <span className={`text-xs ${txtSm}`}>{d < 0 ? `متأخر ${formatNumber(Math.abs(d))} يوم` : `${formatNumber(d)} يوم`}</span>}
                        </div>
                      );
                    })}
                </div>
                <div className={`${card} p-4 rounded-xl border`}>
                  <div className="flex justify-between mb-3"><h3 className={`font-bold text-sm ${txt}`}>المشاريع النشطة</h3><button onClick={() => setCurrentView('projects')} className={`text-xs ${accent.text}`}>الكل</button></div>
                  {projects.filter(p => p.status === 'جاري').length === 0 ? <p className={`text-center py-6 text-xs ${txtSm}`}>لا توجد مشاريع</p> : 
                    projects.filter(p => p.status === 'جاري').slice(0, 4).map(p => (
                      <div key={p.id} className={`p-2 rounded-lg mb-2 border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex justify-between"><span className={`text-xs ${txt}`}>{p.name}</span><span className={`text-xs ${accent.color} text-white px-2 rounded`}>{p.status}</span></div>
                        <span className={`text-xs ${txtSm}`}>العميل: {p.client || 'غير محدد'}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {currentView === 'expenses' && (
            <div>
              <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <h2 className={`text-lg font-bold ${txt}`}>المصروفات</h2>
                <button onClick={() => { setNewExpense(emptyExpense); setModalType('addExp'); setShowModal(true); }} className={`flex items-center gap-1 bg-gradient-to-r ${accent.gradient} text-white px-3 py-2 rounded-xl text-xs`}><Plus className="w-4 h-4" />إضافة</button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[{ label: 'الإجمالي', value: totalExpenses, icon: DollarSign, color: 'from-blue-500 to-blue-600' },
                  { label: 'الشهري', value: monthlyExpenses, icon: Calendar, color: 'from-green-500 to-green-600' },
                  { label: 'السنوي', value: yearlyExpenses, icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
                  { label: 'مرة واحدة', value: onceExpenses, icon: CreditCard, color: 'from-orange-500 to-orange-600' }].map((s, i) => (
                  <div key={i} className={`bg-gradient-to-br ${s.color} p-3 rounded-xl text-white`}>
                    <div className="flex items-center gap-2 mb-1"><s.icon className="w-4 h-4 opacity-80" /><span className="text-xs opacity-80">{s.label}</span></div>
                    <p className="text-lg font-bold">{formatNumber(s.value)} <SAR /></p>
                  </div>
                ))}
              </div>

              {expenses.length === 0 ? (
                <div className={`${card} p-8 rounded-xl border text-center`}>
                  <Wallet className={`w-12 h-12 mx-auto mb-3 ${txtSm}`} />
                  <p className={txtSm}>لا توجد مصروفات</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {expenses.map(e => {
                    const d = e.type !== 'مرة واحدة' ? calcDays(e.dueDate) : null;
                    const isExpanded = expandedExpense === e.id;
                    return (
                      <div key={e.id} className={`${card} p-4 rounded-xl border`}>
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className={`font-bold ${txt}`}>{e.name}</h3>
                              {e.status === 'مدفوع' && <span className="text-xs px-2 py-0.5 rounded bg-green-500 text-white">مدفوع</span>}
                            </div>
                            <p className={`text-xl font-bold ${txt} mb-2`}>{formatNumber(e.amount)} <SAR /></p>
                            {e.reason && <p className={`text-xs ${txtSm} mb-2`}>{e.reason}</p>}
                            
                            <div className={`text-xs ${txtSm} space-y-1`}>
                              <p>النوع: {e.type} {e.dueDate && `| الاستحقاق: ${e.dueDate}`} {d !== null && `| ${d < 0 ? `متأخر ${formatNumber(Math.abs(d))} يوم` : `${formatNumber(d)} يوم متبقي`}`}</p>
                              <p>أنشئ بواسطة: {e.createdBy} | {new Date(e.createdAt).toLocaleDateString('en-US')}</p>
                              {e.location && <p>الموقع: {e.location}</p>}
                            </div>

                            {e.mapUrl && (
                              <a href={e.mapUrl} target="_blank" rel="noreferrer" className={`text-xs ${accent.text} mt-2 inline-flex items-center gap-1`}>
                                <Map className="w-3 h-3" />فتح في الخريطة
                              </a>
                            )}
                          </div>
                          
                          <div className="flex gap-1">
                            {e.status !== 'مدفوع' && <IconBtn onClick={() => markPaid(e.id)} icon={CheckSquare} title="تعليم كمدفوع" />}
                            {e.paymentHistory?.length > 0 && (
                              <IconBtn onClick={() => setExpandedExpense(isExpanded ? null : e.id)} icon={isExpanded ? ChevronUp : ChevronDown} title="سجل الدفعات" />
                            )}
                            <IconBtn onClick={() => { setEditingItem({ ...e }); setModalType('editExp'); setShowModal(true); }} icon={Pencil} title="تعديل" />
                            <IconBtn onClick={() => { setSelectedItem(e); setModalType('delExp'); setShowModal(true); }} icon={Trash2} title="حذف" />
                          </div>
                        </div>

                        {isExpanded && e.paymentHistory?.length > 0 && (
                          <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <p className={`text-xs font-bold mb-2 ${txt}`}>سجل الدفعات:</p>
                            <div className="space-y-2">
                              {e.paymentHistory.map((p, i) => (
                                <div key={i} className={`text-xs p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                  <span className={txt}>{formatNumber(p.amount)} <SAR /></span>
                                  <span className={`mr-2 ${txtSm}`}>- {new Date(p.date).toLocaleString('en-US')}</span>
                                  <span className={`mr-2 ${txtSm}`}>بواسطة: {p.paidBy}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}


          {currentView === 'tasks' && (
            <div>
              <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <h2 className={`text-lg font-bold ${txt}`}>المهام</h2>
                <div className="flex gap-2">
                  <button onClick={() => { setNewSection(emptySection); setModalType('addSection'); setShowModal(true); }} className={`flex items-center gap-1 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} px-3 py-2 rounded-xl text-xs`}>
                    <Layers className="w-4 h-4" />إضافة قسم
                  </button>
                  <button onClick={() => { setNewTask(emptyTask); setModalType('addTask'); setShowModal(true); }} className={`flex items-center gap-1 bg-gradient-to-r ${accent.gradient} text-white px-3 py-2 rounded-xl text-xs`}>
                    <Plus className="w-4 h-4" />إضافة مهمة
                  </button>
                </div>
              </div>

              {projects.length > 0 && (
                <div className="flex gap-2 mb-4 flex-wrap">
                  <button onClick={() => setProjectFilter(null)} className={`px-3 py-1.5 rounded-lg text-xs ${!projectFilter ? accent.color + ' text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>الكل</button>
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
                </div>
              ) : (
                <div className="space-y-3">
                  {(projectFilter ? tasks.filter(t => t.projectId === projectFilter) : tasks).map(t => {
                    const d = calcDays(t.dueDate);
                    const project = projects.find(p => p.id === t.projectId);
                    const section = taskSections.find(s => s.id === t.sectionId);
                    return (
                      <div key={t.id} className={`${card} p-4 rounded-xl border`}>
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <Priority level={t.priority} />
                              <h3 className={`font-bold ${txt}`}>{t.title}</h3>
                            </div>
                            {t.description && <p className={`text-xs ${txtSm} mb-2`}>{t.description}</p>}
                            
                            <div className={`text-xs ${txtSm} space-y-1`}>
                              {project && <p>المشروع: {project.name}</p>}
                              {section && <p>القسم: {section.name}</p>}
                              {t.assignedTo && <p>المسؤول: {t.assignedTo}</p>}
                              {t.dueDate && <p>التسليم: {t.dueDate} {d !== null && `| ${d < 0 ? `متأخر ${formatNumber(Math.abs(d))} يوم` : `${formatNumber(d)} يوم`}`}</p>}
                              <p>أنشئ بواسطة: {t.createdBy}</p>
                              {t.location && <p>الموقع: {t.location}</p>}
                            </div>

                            {t.mapUrl && (
                              <a href={t.mapUrl} target="_blank" rel="noreferrer" className={`text-xs ${accent.text} mt-2 inline-flex items-center gap-1`}>
                                <Map className="w-3 h-3" />فتح في الخريطة
                              </a>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <IconBtn onClick={() => { setEditingItem({ ...t }); setModalType('editTask'); setShowModal(true); }} icon={Pencil} title="تعديل" />
                            <IconBtn onClick={() => { setSelectedItem(t); setModalType('delTask'); setShowModal(true); }} icon={Trash2} title="حذف" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {currentView === 'projects' && !selectedProject && (
            <div>
              <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <h2 className={`text-lg font-bold ${txt}`}>المشاريع</h2>
                <button onClick={() => { setNewProject(emptyProject); setModalType('addProject'); setShowModal(true); }} className={`flex items-center gap-1 bg-gradient-to-r ${accent.gradient} text-white px-3 py-2 rounded-xl text-xs`}><Plus className="w-4 h-4" />إضافة مشروع</button>
              </div>

              {projects.length === 0 ? (
                <div className={`${card} p-8 rounded-xl border text-center`}>
                  <FolderOpen className={`w-12 h-12 mx-auto mb-3 ${txtSm}`} />
                  <p className={txtSm}>لا توجد مشاريع</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {projects.map(p => {
                    const projectTasks = tasks.filter(t => t.projectId === p.id);
                    return (
                      <div key={p.id} onClick={() => setSelectedProject(p)} className={`${card} p-4 rounded-xl border cursor-pointer hover:shadow-lg transition-all`}>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className={`font-bold ${txt}`}>{p.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded ${p.status === 'جاري' ? `${accent.color} text-white` : p.status === 'مكتمل' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>{p.status}</span>
                        </div>
                        {p.description && <p className={`text-xs ${txtSm} mb-3 line-clamp-2`}>{p.description}</p>}
                        
                        <div className={`text-xs ${txtSm} space-y-1`}>
                          {p.client && <p>العميل: {p.client}</p>}
                          {p.phone && <p>الهاتف: {p.phone}</p>}
                          {p.budget && <p>الميزانية: {formatNumber(p.budget)} <SAR /></p>}
                          <p>المهام: {formatNumber(projectTasks.length)}</p>
                          <p>من: {p.startDate || '-'} | إلى: {p.endDate || '-'}</p>
                          <p>أنشئ بواسطة: {p.createdBy}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {currentView === 'projects' && selectedProject && (
            <div>
              <button onClick={() => setSelectedProject(null)} className={`flex items-center gap-1 mb-4 text-xs ${accent.text}`}><ChevronLeft className="w-4 h-4" />العودة</button>
              
              <div className={`${card} p-4 rounded-xl border mb-4`}>
                <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                  <div>
                    <h2 className={`text-lg font-bold ${txt}`}>{selectedProject.name}</h2>
                    <span className={`text-xs px-2 py-0.5 rounded ${selectedProject.status === 'جاري' ? `${accent.color} text-white` : 'bg-green-500 text-white'}`}>{selectedProject.status}</span>
                  </div>
                  <div className="flex gap-1">
                    <IconBtn onClick={() => { setEditingItem({ ...selectedProject }); setModalType('editProject'); setShowModal(true); }} icon={Pencil} title="تعديل" />
                    <IconBtn onClick={() => { setSelectedItem(selectedProject); setModalType('delProject'); setShowModal(true); }} icon={Trash2} title="حذف" />
                  </div>
                </div>

                {selectedProject.description && <p className={`text-xs ${txtSm} mb-4`}>{selectedProject.description}</p>}

                <div className={`text-xs ${txtSm} space-y-1 mb-4`}>
                  {selectedProject.client && <p>العميل: {selectedProject.client}</p>}
                  {selectedProject.phone && <p>الهاتف: {selectedProject.phone}</p>}
                  {selectedProject.location && <p>الموقع: {selectedProject.location}</p>}
                  {selectedProject.budget && <p>الميزانية: {formatNumber(selectedProject.budget)} <SAR /></p>}
                  <p>من: {selectedProject.startDate || '-'} | إلى: {selectedProject.endDate || '-'}</p>
                  <p>أنشئ بواسطة: {selectedProject.createdBy}</p>
                </div>

                {selectedProject.mapUrl && (
                  <a href={selectedProject.mapUrl} target="_blank" rel="noreferrer" className={`text-xs ${accent.text} inline-flex items-center gap-1`}>
                    <Map className="w-3 h-3" />فتح في خرائط قوقل
                  </a>
                )}
              </div>

              <div className={`${card} p-4 rounded-xl border mb-4`}>
                <h3 className={`font-bold text-sm ${txt} mb-3`}>ملفات المشروع</h3>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="flex items-center gap-2 mb-2"><Image className="w-4 h-4" /><span className={`text-xs font-bold ${txt}`}>الصور</span></div>
                    <p className={`text-xs ${txtSm}`}>{formatNumber(selectedProject.files?.images?.length || 0)} ملف</p>
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="flex items-center gap-2 mb-2"><FileText className="w-4 h-4" /><span className={`text-xs font-bold ${txt}`}>المستندات</span></div>
                    <p className={`text-xs ${txtSm}`}>{formatNumber(selectedProject.files?.documents?.length || 0)} ملف</p>
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="flex items-center gap-2 mb-2"><FolderPlus className="w-4 h-4" /><span className={`text-xs font-bold ${txt}`}>ملفات أخرى</span></div>
                    <p className={`text-xs ${txtSm}`}>{formatNumber(selectedProject.files?.others?.length || 0)} ملف</p>
                  </div>
                </div>
              </div>

              <div className={`${card} p-4 rounded-xl border`}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className={`font-bold text-sm ${txt}`}>مهام المشروع ({formatNumber(tasks.filter(t => t.projectId === selectedProject.id).length)})</h3>
                  <button onClick={() => { setNewTask({ ...emptyTask, projectId: selectedProject.id }); setModalType('addTask'); setShowModal(true); }} className={`text-xs ${accent.text}`}><Plus className="w-4 h-4 inline" />إضافة مهمة</button>
                </div>
                {tasks.filter(t => t.projectId === selectedProject.id).length === 0 ? (
                  <p className={`text-center py-4 text-xs ${txtSm}`}>لا توجد مهام</p>
                ) : (
                  <div className="space-y-2">
                    {tasks.filter(t => t.projectId === selectedProject.id).map(t => (
                      <div key={t.id} className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'} flex justify-between items-center`}>
                        <div>
                          <div className="flex items-center gap-2">
                            <Priority level={t.priority} />
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
              <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <h2 className={`text-lg font-bold ${txt}`}>الحسابات</h2>
                <button onClick={() => { setNewAccount(emptyAccount); setModalType('addAcc'); setShowModal(true); }} className={`flex items-center gap-1 bg-gradient-to-r ${accent.gradient} text-white px-3 py-2 rounded-xl text-xs`}><Plus className="w-4 h-4" />إضافة</button>
              </div>
              {accounts.length === 0 ? (
                <div className={`${card} p-8 rounded-xl border text-center`}><Users className={`w-12 h-12 mx-auto mb-3 ${txtSm}`} /><p className={txtSm}>لا توجد حسابات</p></div>
              ) : (
                <div className="space-y-3">{accounts.map(a => (
                  <div key={a.id} className={`${card} p-4 rounded-xl border`}>
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className={`font-bold ${txt} mb-2`}>{a.name}</h3>
                        {a.description && <p className={`text-xs ${txtSm} mb-2`}>{a.description}</p>}
                        <div className={`text-xs ${txtSm} space-y-1`}>
                          {a.loginUrl && <p>الرابط: <a href={a.loginUrl} target="_blank" rel="noreferrer" className={accent.text}>{a.loginUrl}</a></p>}
                          <p>المستخدم: {a.username}</p>
                          <p>كلمة المرور: {a.password}</p>
                          {a.subscriptionDate && <p>الاشتراك: {a.subscriptionDate}</p>}
                          <p>الأيام المتبقية: {formatNumber(a.daysRemaining)} يوم</p>
                          <p>أنشئ بواسطة: {a.createdBy}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <IconBtn onClick={() => { setEditingItem({ ...a }); setModalType('editAcc'); setShowModal(true); }} icon={Pencil} title="تعديل" />
                        <IconBtn onClick={() => { setSelectedItem(a); setModalType('delAcc'); setShowModal(true); }} icon={Trash2} title="حذف" />
                      </div>
                    </div>
                  </div>
                ))}</div>
              )}
            </div>
          )}

          {currentView === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <h2 className={`text-lg font-bold ${txt}`}>المستخدمين</h2>
                <button onClick={() => { setNewUser(emptyUser); setModalType('addUser'); setShowModal(true); }} className={`flex items-center gap-1 bg-gradient-to-r ${accent.gradient} text-white px-3 py-2 rounded-xl text-xs`}><Plus className="w-4 h-4" />إضافة</button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{users.map(u => (
                <div key={u.id} className={`${card} p-4 rounded-xl border`}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={`font-bold ${txt}`}>{u.username}</h3>
                    <div className="flex gap-1">
                      <IconBtn onClick={() => { setEditingItem({ ...u }); setModalType('editUser'); setShowModal(true); }} icon={Pencil} title="تعديل" />
                      {u.role !== 'owner' && <IconBtn onClick={() => { setSelectedItem(u); setModalType('delUser'); setShowModal(true); }} icon={Trash2} title="حذف" />}
                    </div>
                  </div>
                  <div className={`text-xs ${txtSm} space-y-2`}>
                    <p>الصلاحية: <span className={`px-2 py-0.5 rounded ${u.role === 'owner' ? 'bg-amber-500 text-white' : u.role === 'manager' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}`}>{u.role === 'owner' ? 'المالك' : u.role === 'manager' ? 'مدير' : 'عضو'}</span></p>
                    <p>الحالة: <span className={`px-2 py-0.5 rounded ${u.active !== false ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>{u.active !== false ? 'نشط' : 'معطل'}</span></p>
                    {u.createdBy && <p>أنشئ بواسطة: {u.createdBy}</p>}
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
                  {archivedExpenses?.length > 0 && <div><h3 className={`font-bold text-sm mb-2 ${txt}`}>المصروفات ({formatNumber(archivedExpenses.length)})</h3>{archivedExpenses.map(e => (<div key={e.id} className={`${card} p-3 rounded-xl border mb-2 flex justify-between items-center`}><div><span className={`font-bold text-sm ${txt}`}>{e.name}</span><span className={`mr-2 ${txt}`}>{formatNumber(e.amount)} <SAR /></span><p className={`text-xs ${txtSm}`}>حذف بواسطة: {e.archivedBy}</p></div><IconBtn onClick={() => restoreExpense(e)} icon={RotateCcw} title="إستعادة" /></div>))}</div>}
                  {archivedTasks?.length > 0 && <div><h3 className={`font-bold text-sm mb-2 ${txt}`}>المهام ({formatNumber(archivedTasks.length)})</h3>{archivedTasks.map(t => (<div key={t.id} className={`${card} p-3 rounded-xl border mb-2 flex justify-between items-center`}><div><span className={`font-bold text-sm ${txt}`}>{t.title}</span><p className={`text-xs ${txtSm}`}>حذف بواسطة: {t.archivedBy}</p></div><IconBtn onClick={() => restoreTask(t)} icon={RotateCcw} title="إستعادة" /></div>))}</div>}
                  {archivedProjects?.length > 0 && <div><h3 className={`font-bold text-sm mb-2 ${txt}`}>المشاريع ({formatNumber(archivedProjects.length)})</h3>{archivedProjects.map(p => (<div key={p.id} className={`${card} p-3 rounded-xl border mb-2 flex justify-between items-center`}><div><span className={`font-bold text-sm ${txt}`}>{p.name}</span><p className={`text-xs ${txtSm}`}>حذف بواسطة: {p.archivedBy}</p></div><IconBtn onClick={() => restoreProject(p)} icon={RotateCcw} title="إستعادة" /></div>))}</div>}
                  {archivedAccounts?.length > 0 && <div><h3 className={`font-bold text-sm mb-2 ${txt}`}>الحسابات ({formatNumber(archivedAccounts.length)})</h3>{archivedAccounts.map(a => (<div key={a.id} className={`${card} p-3 rounded-xl border mb-2 flex justify-between items-center`}><div><span className={`font-bold text-sm ${txt}`}>{a.name}</span><p className={`text-xs ${txtSm}`}>حذف بواسطة: {a.archivedBy}</p></div><IconBtn onClick={() => restoreAccount(a)} icon={RotateCcw} title="إستعادة" /></div>))}</div>}
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
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>الأولوية</label><select value={modalType === 'addTask' ? newTask.priority : editingItem?.priority || 'متوسطة'} onChange={e => modalType === 'addTask' ? setNewTask({ ...newTask, priority: e.target.value }) : setEditingItem({ ...editingItem, priority: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`}><option value="عالية">عالية</option><option value="متوسطة">متوسطة</option><option value="منخفضة">منخفضة</option></select></div>
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
                    <div><label className={`block text-xs mb-1 ${txtSm}`}>تاريخ البدء</label><input type="date" value={modalType === 'addProject' ? newProject.startDate : editingItem?.startDate || ''} onChange={e => modalType === 'addProject' ? setNewProject({ ...newProject, startDate: e.target.value }) : setEditingItem({ ...editingItem, startDate: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`} /></div>
                    <div><label className={`block text-xs mb-1 ${txtSm}`}>تاريخ الانتهاء</label><input type="date" value={modalType === 'addProject' ? newProject.endDate : editingItem?.endDate || ''} onChange={e => modalType === 'addProject' ? setNewProject({ ...newProject, endDate: e.target.value }) : setEditingItem({ ...editingItem, endDate: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`} /></div>
                  </div>
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>الميزانية</label><input type="number" inputMode="decimal" value={modalType === 'addProject' ? newProject.budget : editingItem?.budget || ''} onChange={e => modalType === 'addProject' ? setNewProject({ ...newProject, budget: e.target.value }) : setEditingItem({ ...editingItem, budget: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`} /></div>
                  <div><label className={`block text-xs mb-1 ${txtSm}`}>الحالة</label><select value={modalType === 'addProject' ? newProject.status : editingItem?.status || 'جاري'} onChange={e => modalType === 'addProject' ? setNewProject({ ...newProject, status: e.target.value }) : setEditingItem({ ...editingItem, status: e.target.value })} className={`w-full p-3 border rounded-xl text-sm ${inp}`}><option value="جاري">جاري</option><option value="متوقف">متوقف</option><option value="مكتمل">مكتمل</option></select></div>
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
    </div>
  );
}
