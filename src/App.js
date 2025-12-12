import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { Calendar, CheckSquare, Users, Moon, Sun, Plus, Archive, Clock, Activity, History, Loader, Power, Pencil, Trash2, RotateCcw, UserCog, ChevronLeft, Palette, ZoomIn, ZoomOut, FolderPlus, FileText, MapPin, User, X } from 'lucide-react';

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
const APP_VERSION = "3.0.0";

const versionHistory = [
  { version: "3.0.0", date: "2024-12-13", changes: ["خلفيات متعددة بنقوش مالية", "نظام المشاريع الكامل", "50 عبارة تحفيزية", "نوافذ منبثقة محسنة", "تحكم متعدد بحجم الخط"] },
  { version: "2.0.0", date: "2024-12-12", changes: ["إدارة المستخدمين", "الأرشيف والاستعادة", "سجل العمليات", "الوضع الليلي"] },
  { version: "1.0.0", date: "2024-12-10", changes: ["الإصدار الأول", "المصروفات والمهام", "الحسابات", "Firebase"] }
];

const quotes = [
  "يوم موفق! 🌟", "استمر في التميز! 💪", "النجاح قريب! 🎯", "أنت رائع! ⭐", "يوم مبارك! 🌸",
  "إلى القمة! 🚀", "ثق بنفسك! 💎", "أنت قادر! 🏆", "استثمر وقتك! ⏰", "فكر بإيجابية! 🌈",
  "خطوة للأمام! 👣", "لا تستسلم! 🔥", "أنت مميز! ✨", "اصنع الفرق! 💡", "كن الأفضل! 🥇",
  "النجاح عادة! 📈", "ابدأ الآن! ⚡", "حقق أحلامك! 🌙", "كن إيجابياً! 😊", "اعمل بذكاء! 🧠",
  "الإصرار مفتاح! 🔑", "تحدى نفسك! 💪", "اغتنم الفرص! 🎪", "كن مبدعاً! 🎨", "وقتك ثمين! 💰",
  "النمو مستمر! 🌱", "فكر كبيراً! 🏔️", "اصنع مستقبلك! 🔮", "كن قائداً! 👑", "تعلم دائماً! 📚",
  "الجودة أولاً! ✅", "خطط للنجاح! 📋", "نفذ بإتقان! 🎯", "راقب تقدمك! 📊", "احتفل بإنجازاتك! 🎉",
  "شارك النجاح! 🤝", "ألهم الآخرين! 💫", "كن مرناً! 🌊", "تكيف وتطور! 🦋", "ابتكر حلولاً! 💡",
  "وازن حياتك! ⚖️", "استثمر بحكمة! 💎", "ادخر للمستقبل! 🏦", "نوع استثماراتك! 📈", "خطط مالياً! 💵",
  "راقب ميزانيتك! 📝", "حقق الاستقلال! 🦅", "ابن ثروتك! 🏗️", "فكر طويل المدى! 🔭", "النجاح رحلة! 🛤️"
];

const backgrounds = [
  { id: 0, name: 'كلاسيكي', dark: 'from-gray-900 via-purple-900 to-gray-900', light: 'from-blue-50 via-indigo-50 to-purple-50' },
  { id: 1, name: 'أزرق ملكي', dark: 'from-blue-950 via-blue-900 to-indigo-950', light: 'from-blue-100 via-sky-50 to-indigo-100' },
  { id: 2, name: 'ذهبي فاخر', dark: 'from-yellow-950 via-amber-900 to-orange-950', light: 'from-yellow-50 via-amber-50 to-orange-50' },
  { id: 3, name: 'أخضر النجاح', dark: 'from-emerald-950 via-green-900 to-teal-950', light: 'from-emerald-50 via-green-50 to-teal-50' },
  { id: 4, name: 'بنفسجي راقي', dark: 'from-purple-950 via-violet-900 to-indigo-950', light: 'from-purple-50 via-violet-50 to-indigo-50' },
  { id: 5, name: 'فيروزي عصري', dark: 'from-cyan-950 via-teal-900 to-blue-950', light: 'from-cyan-50 via-teal-50 to-blue-50' },
  { id: 6, name: 'وردي أنيق', dark: 'from-pink-950 via-rose-900 to-red-950', light: 'from-pink-50 via-rose-50 to-red-50' },
  { id: 7, name: 'رمادي احترافي', dark: 'from-gray-950 via-slate-900 to-zinc-950', light: 'from-gray-100 via-slate-50 to-zinc-100' },
  { id: 8, name: 'برتقالي دافئ', dark: 'from-orange-950 via-red-900 to-rose-950', light: 'from-orange-50 via-red-50 to-rose-50' },
  { id: 9, name: 'زمردي ثمين', dark: 'from-teal-950 via-emerald-900 to-green-950', light: 'from-teal-50 via-emerald-50 to-green-50' }
];

const FinancialPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="fin-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
        <text x="10" y="30" fontSize="24" fill="currentColor">$</text>
        <text x="70" y="30" fontSize="24" fill="currentColor">€</text>
        <text x="40" y="60" fontSize="24" fill="currentColor">¥</text>
        <text x="90" y="90" fontSize="24" fill="currentColor">£</text>
        <text x="15" y="95" fontSize="18" fill="currentColor">ر.س</text>
        <rect x="5" y="105" width="15" height="6" fill="currentColor" opacity="0.5"/>
        <rect x="25" y="100" width="15" height="11" fill="currentColor" opacity="0.5"/>
        <rect x="45" y="93" width="15" height="18" fill="currentColor" opacity="0.5"/>
        <circle cx="100" cy="60" r="12" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#fin-pattern)" />
  </svg>
);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [currentUser, setCurrentUser] = useState(() => { const s = localStorage.getItem('currentUser'); return s ? JSON.parse(s) : null; });
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [fontSize, setFontSize] = useState(() => parseInt(localStorage.getItem('fontSize')) || 16);
  const [bgIndex, setBgIndex] = useState(() => parseInt(localStorage.getItem('bgIndex')) || 0);
  const [currentView, setCurrentView] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState(quotes[0]);
  const [newNotifications, setNewNotifications] = useState(0);
  const [showAuditPanel, setShowAuditPanel] = useState(false);
  const [showArchivePanel, setShowArchivePanel] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const auditRef = useRef(null);
  const archiveRef = useRef(null);
  const bgRef = useRef(null);

  const defaultUsers = [
    { id: 1, username: 'نايف', password: '@Lion12345', role: 'owner', active: true },
    { id: 2, username: 'منوّر', password: '@Lion12345', role: 'owner', active: true }
  ];

  const [users, setUsers] = useState(defaultUsers);
  const [expenses, setExpenses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [archivedExpenses, setArchivedExpenses] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [archivedAccounts, setArchivedAccounts] = useState([]);
  const [archivedProjects, setArchivedProjects] = useState([]);
  const [loginLog, setLoginLog] = useState([]);

  const [newExpense, setNewExpense] = useState({ name: '', amount: '', currency: 'ر.س', dueDate: '', type: 'شهري', reason: '', status: 'قيد الانتظار' });
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', assignedTo: '', priority: 'متوسطة', status: 'قيد الانتظار', projectId: '' });
  const [newProject, setNewProject] = useState({ name: '', description: '', client: '', location: '', startDate: '', endDate: '', budget: '', status: 'جاري' });
  const [newAccount, setNewAccount] = useState({ name: '', description: '', loginUrl: '', username: '', password: '', subscriptionDate: '', daysRemaining: 365 });
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user', active: true });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (auditRef.current && !auditRef.current.contains(e.target)) setShowAuditPanel(false);
      if (archiveRef.current && !archiveRef.current.contains(e.target)) setShowArchivePanel(false);
      if (bgRef.current && !bgRef.current.contains(e.target)) setShowBgPicker(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => { localStorage.setItem('isLoggedIn', isLoggedIn); if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser)); }, [isLoggedIn, currentUser]);
  useEffect(() => { localStorage.setItem('darkMode', darkMode); }, [darkMode]);
  useEffect(() => { localStorage.setItem('fontSize', fontSize); }, [fontSize]);
  useEffect(() => { localStorage.setItem('bgIndex', bgIndex); }, [bgIndex]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'data', 'main'), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setUsers(d.users || defaultUsers);
        setExpenses(d.expenses || []);
        setTasks(d.tasks || []);
        setProjects(d.projects || []);
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

  useEffect(() => { setQuote(quotes[Math.floor(Math.random() * quotes.length)]); }, [currentView]);
  useEffect(() => { const t = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const save = async (d) => { 
    try { 
      await setDoc(doc(db, 'data', 'main'), { 
        users: d.users || users, expenses: d.expenses || expenses, tasks: d.tasks || tasks, 
        projects: d.projects || projects, accounts: d.accounts || accounts, auditLog: d.auditLog || auditLog, 
        archivedExpenses: d.archivedExpenses || archivedExpenses, archivedTasks: d.archivedTasks || archivedTasks, 
        archivedAccounts: d.archivedAccounts || archivedAccounts, archivedProjects: d.archivedProjects || archivedProjects,
        loginLog: d.loginLog || loginLog 
      }); 
    } catch (e) { console.error(e); } 
  };

  const addLog = (action, desc) => { 
    const l = { id: `LOG${Date.now()}`, user: currentUser?.username || 'نظام', action, description: desc, timestamp: new Date().toISOString() }; 
    const nl = [l, ...auditLog]; setAuditLog(nl); setNewNotifications(p => p + 1); return nl; 
  };

  const calcDays = (d) => Math.ceil((new Date(d) - new Date()) / 86400000);
  const getColor = (d) => d < 0 ? 'bg-red-600 text-white' : d < 7 ? 'bg-red-500 text-white' : d < 15 ? 'bg-orange-500 text-white' : 'bg-green-500 text-white';

  const handleLogin = (e) => {
    e.preventDefault();
    const u = e.target.username.value.trim(), p = e.target.password.value.trim();
    const user = users.find(x => x.username === u && x.password === p && x.active !== false);
    if (user) {
      setCurrentUser(user); setIsLoggedIn(true);
      const ll = [{ id: `L${Date.now()}`, user: u, timestamp: new Date().toISOString(), action: 'دخول' }, ...loginLog];
      setLoginLog(ll); const al = addLog('دخول', `${u} سجل دخول`); save({ auditLog: al, loginLog: ll });
    } else alert('خطأ في البيانات');
  };

  const logout = () => {
    const ll = [{ id: `L${Date.now()}`, user: currentUser.username, timestamp: new Date().toISOString(), action: 'خروج' }, ...loginLog];
    setLoginLog(ll); save({ loginLog: ll }); setIsLoggedIn(false); setCurrentUser(null);
    localStorage.removeItem('isLoggedIn'); localStorage.removeItem('currentUser');
  };

  const addExpense = () => {
    if (!newExpense.name || !newExpense.amount || !newExpense.dueDate) return alert('املأ الحقول');
    const exp = { ...newExpense, id: `E${Date.now()}`, amount: parseFloat(newExpense.amount), createdAt: new Date().toISOString(), createdBy: currentUser.username };
    const ne = [...expenses, exp]; const al = addLog('إضافة', `مصروف: ${exp.name}`);
    setExpenses(ne); save({ expenses: ne, auditLog: al });
    setNewExpense({ name: '', amount: '', currency: 'ر.س', dueDate: '', type: 'شهري', reason: '', status: 'قيد الانتظار' }); setShowModal(false);
  };

  const editExpense = () => {
    if (!editingItem.name || !editingItem.amount) return alert('املأ الحقول');
    const ne = expenses.map(e => e.id === editingItem.id ? { ...editingItem, updatedAt: new Date().toISOString() } : e);
    const al = addLog('تعديل', `مصروف: ${editingItem.name}`);
    setExpenses(ne); save({ expenses: ne, auditLog: al }); setEditingItem(null); setShowModal(false);
  };

  const delExpense = (exp) => {
    const ne = expenses.filter(e => e.id !== exp.id);
    const na = [{ ...exp, archivedAt: new Date().toISOString(), archivedBy: currentUser.username }, ...archivedExpenses];
    const al = addLog('حذف', `مصروف: ${exp.name}`);
    setExpenses(ne); setArchivedExpenses(na); save({ expenses: ne, archivedExpenses: na, auditLog: al }); setShowModal(false);
  };

  const restoreExpense = (exp) => {
    const na = archivedExpenses.filter(e => e.id !== exp.id);
    const { archivedAt, archivedBy, ...rest } = exp; const ne = [...expenses, rest];
    const al = addLog('استعادة', `مصروف: ${exp.name}`);
    setExpenses(ne); setArchivedExpenses(na); save({ expenses: ne, archivedExpenses: na, auditLog: al });
  };

  const markPaid = (id) => {
    const exp = expenses.find(e => e.id === id);
    const ne = expenses.map(e => e.id === id ? { ...e, status: 'مدفوع', paidAt: new Date().toISOString() } : e);
    const al = addLog('دفع', `مصروف: ${exp.name}`); setExpenses(ne); save({ expenses: ne, auditLog: al });
  };

  const addTask = () => {
    if (!newTask.title || !newTask.dueDate) return alert('املأ الحقول');
    const t = { ...newTask, id: `T${Date.now()}`, createdAt: new Date().toISOString(), createdBy: currentUser.username };
    const nt = [...tasks, t]; const al = addLog('إضافة', `مهمة: ${t.title}`);
    setTasks(nt); save({ tasks: nt, auditLog: al });
    setNewTask({ title: '', description: '', dueDate: '', assignedTo: '', priority: 'متوسطة', status: 'قيد الانتظار', projectId: '' }); setShowModal(false);
  };

  const editTask = () => {
    if (!editingItem.title) return alert('املأ الحقول');
    const nt = tasks.map(t => t.id === editingItem.id ? { ...editingItem, updatedAt: new Date().toISOString() } : t);
    const al = addLog('تعديل', `مهمة: ${editingItem.title}`);
    setTasks(nt); save({ tasks: nt, auditLog: al }); setEditingItem(null); setShowModal(false);
  };

  const delTask = (t) => {
    const nt = tasks.filter(x => x.id !== t.id);
    const na = [{ ...t, archivedAt: new Date().toISOString(), archivedBy: currentUser.username }, ...archivedTasks];
    const al = addLog('حذف', `مهمة: ${t.title}`);
    setTasks(nt); setArchivedTasks(na); save({ tasks: nt, archivedTasks: na, auditLog: al }); setShowModal(false);
  };

  const restoreTask = (t) => {
    const na = archivedTasks.filter(x => x.id !== t.id);
    const { archivedAt, archivedBy, ...rest } = t; const nt = [...tasks, rest];
    const al = addLog('استعادة', `مهمة: ${t.title}`);
    setTasks(nt); setArchivedTasks(na); save({ tasks: nt, archivedTasks: na, auditLog: al });
  };

  const addProject = () => {
    if (!newProject.name) return alert('أدخل اسم المشروع');
    const p = { ...newProject, id: `P${Date.now()}`, createdAt: new Date().toISOString(), createdBy: currentUser.username };
    const np = [...projects, p]; const al = addLog('إضافة', `مشروع: ${p.name}`);
    setProjects(np); save({ projects: np, auditLog: al });
    setNewProject({ name: '', description: '', client: '', location: '', startDate: '', endDate: '', budget: '', status: 'جاري' }); setShowModal(false);
  };

  const editProject = () => {
    if (!editingItem.name) return alert('أدخل اسم المشروع');
    const np = projects.map(p => p.id === editingItem.id ? { ...editingItem, updatedAt: new Date().toISOString() } : p);
    const al = addLog('تعديل', `مشروع: ${editingItem.name}`);
    setProjects(np); save({ projects: np, auditLog: al }); setEditingItem(null); setShowModal(false);
  };

  const delProject = (p) => {
    const np = projects.filter(x => x.id !== p.id);
    const na = [{ ...p, archivedAt: new Date().toISOString(), archivedBy: currentUser.username }, ...archivedProjects];
    const al = addLog('حذف', `مشروع: ${p.name}`);
    setProjects(np); setArchivedProjects(na); save({ projects: np, archivedProjects: na, auditLog: al }); setShowModal(false);
  };

  const restoreProject = (p) => {
    const na = archivedProjects.filter(x => x.id !== p.id);
    const { archivedAt, archivedBy, ...rest } = p; const np = [...projects, rest];
    const al = addLog('استعادة', `مشروع: ${p.name}`);
    setProjects(np); setArchivedProjects(na); save({ projects: np, archivedProjects: na, auditLog: al });
  };

  const addAccount = () => {
    if (!newAccount.name || !newAccount.username) return alert('املأ الحقول');
    const a = { ...newAccount, id: `A${Date.now()}`, createdAt: new Date().toISOString(), createdBy: currentUser.username };
    const na = [...accounts, a]; const al = addLog('إضافة', `حساب: ${a.name}`);
    setAccounts(na); save({ accounts: na, auditLog: al });
    setNewAccount({ name: '', description: '', loginUrl: '', username: '', password: '', subscriptionDate: '', daysRemaining: 365 }); setShowModal(false);
  };

  const editAccount = () => {
    if (!editingItem.name) return alert('املأ الحقول');
    const na = accounts.map(a => a.id === editingItem.id ? { ...editingItem, updatedAt: new Date().toISOString() } : a);
    const al = addLog('تعديل', `حساب: ${editingItem.name}`);
    setAccounts(na); save({ accounts: na, auditLog: al }); setEditingItem(null); setShowModal(false);
  };

  const delAccount = (a) => {
    const na = accounts.filter(x => x.id !== a.id);
    const nar = [{ ...a, archivedAt: new Date().toISOString(), archivedBy: currentUser.username }, ...archivedAccounts];
    const al = addLog('حذف', `حساب: ${a.name}`);
    setAccounts(na); setArchivedAccounts(nar); save({ accounts: na, archivedAccounts: nar, auditLog: al }); setShowModal(false);
  };

  const restoreAccount = (a) => {
    const nar = archivedAccounts.filter(x => x.id !== a.id);
    const { archivedAt, archivedBy, ...rest } = a; const na = [...accounts, rest];
    const al = addLog('استعادة', `حساب: ${a.name}`);
    setAccounts(na); setArchivedAccounts(nar); save({ accounts: na, archivedAccounts: nar, auditLog: al });
  };

  const addUser = () => {
    if (!newUser.username || !newUser.password) return alert('املأ الحقول');
    if (users.find(u => u.username === newUser.username)) return alert('موجود');
    const u = { ...newUser, id: Date.now(), createdAt: new Date().toISOString() };
    const nu = [...users, u]; const al = addLog('إضافة', `مستخدم: ${u.username}`);
    setUsers(nu); save({ users: nu, auditLog: al });
    setNewUser({ username: '', password: '', role: 'user', active: true }); setShowModal(false);
  };

  const editUser = () => {
    if (!editingItem.username) return alert('املأ الحقول');
    const nu = users.map(u => u.id === editingItem.id ? { ...editingItem, updatedAt: new Date().toISOString() } : u);
    const al = addLog('تعديل', `مستخدم: ${editingItem.username}`);
    setUsers(nu); save({ users: nu, auditLog: al }); setEditingItem(null); setShowModal(false);
  };

  const delUser = (u) => {
    if (u.username === currentUser.username) return alert('لا يمكن حذف نفسك');
    const nu = users.filter(x => x.id !== u.id); const al = addLog('حذف', `مستخدم: ${u.username}`);
    setUsers(nu); save({ users: nu, auditLog: al }); setShowModal(false);
  };

  const totalArchived = (archivedExpenses?.length || 0) + (archivedTasks?.length || 0) + (archivedAccounts?.length || 0) + (archivedProjects?.length || 0);
  const kpis = { totalExp: expenses.length, pendingExp: expenses.filter(e => e.status !== 'مدفوع').length, totalTasks: tasks.length, highTasks: tasks.filter(t => t.priority === 'عالية').length, totalProjects: projects.length, totalAcc: accounts.length };

  const currentBg = backgrounds[bgIndex];
  const bg = `bg-gradient-to-br ${darkMode ? currentBg.dark : currentBg.light}`;
  const card = darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200';
  const inp = darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900';
  const txt = darkMode ? 'text-white' : 'text-gray-900';
  const sub = darkMode ? 'text-gray-300' : 'text-gray-600';

  const Btn = ({ onClick, icon: Icon, color, title }) => <button onClick={onClick} className={`p-2 ${color} text-white rounded-lg hover:opacity-80`} title={title}><Icon className="w-4 h-4" /></button>;

  if (loading) return <div className={`min-h-screen ${bg} flex items-center justify-center`} dir="rtl"><Loader className="w-16 h-16 text-blue-500 animate-spin" /></div>;

  if (!isLoggedIn) return (
    <div className={`min-h-screen ${bg} flex items-center justify-center p-4 relative`} dir="rtl">
      {bgIndex > 0 && <FinancialPattern />}
      <div className={`${card} p-8 rounded-2xl shadow-2xl w-full max-w-md border relative z-10`}>
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">RKZ</div>
          <h1 className={`text-2xl font-bold ${txt}`}>نظام الإدارة المالية</h1>
          <p className={sub}>ركائز الأولى للتعمير</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="text" name="username" placeholder="اسم المستخدم" className={`w-full p-3 border rounded-xl ${inp}`} required />
          <input type="password" name="password" placeholder="كلمة المرور" className={`w-full p-3 border rounded-xl ${inp}`} required />
          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl font-bold">دخول</button>
        </form>
        <div className="text-center mt-6"><button onClick={() => setShowVersions(true)} className={`text-xs ${sub} hover:text-blue-500`}>v{APP_VERSION}</button></div>
      </div>
      {showVersions && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowVersions(false)}>
          <div className={`${card} p-6 rounded-2xl max-w-md w-full border`} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className={`text-xl font-bold ${txt}`}>سجل النسخ</h3><button onClick={() => setShowVersions(false)} className={sub}><X className="w-5 h-5" /></button></div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {versionHistory.map((v, i) => (
                <div key={v.version} className={`p-4 rounded-xl ${i === 0 ? 'bg-blue-500/20 border border-blue-500' : darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                  <div className="flex justify-between items-center mb-2"><span className={`font-bold ${txt}`}>v{v.version}</span><span className={`text-xs ${sub}`}>{v.date}</span></div>
                  <ul className={`text-sm ${sub} space-y-1`}>{v.changes.map((c, j) => <li key={j}>• {c}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen ${bg} relative`} style={{ fontSize: `${fontSize}px` }} dir="rtl">
      {bgIndex > 0 && <FinancialPattern />}
      <div className={`${card} border-b px-4 py-3 flex flex-wrap items-center justify-between sticky top-0 z-50 gap-3 relative`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">RKZ</div>
          <div>
            <h1 className={`text-lg font-bold ${txt}`}>نظام الإدارة المالية</h1>
            <p className={`text-xs ${sub}`}>ركائز الأولى للتعمير</p>
            <p className={`text-xs ${sub}`}>{currentTime.toLocaleDateString('ar-SA')} {currentTime.toLocaleTimeString('ar-SA')} | {quote}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${txt}`}>{currentUser.username}</span>
          <div className="relative" ref={auditRef}>
            <button onClick={() => { setShowAuditPanel(!showAuditPanel); setShowArchivePanel(false); setShowBgPicker(false); setNewNotifications(0); }} className={`p-2 rounded-lg relative ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <Clock className={`w-5 h-5 ${txt}`} />
              {newNotifications > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{newNotifications}</span>}
            </button>
            {showAuditPanel && (
              <div className={`absolute left-0 top-12 w-80 ${card} rounded-xl shadow-2xl border z-50 max-h-96 overflow-y-auto`}>
                <div className={`p-3 border-b flex justify-between ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}><h3 className={`font-bold ${txt}`}>آخر العمليات</h3><button onClick={() => { setCurrentView('audit'); setShowAuditPanel(false); }} className="text-blue-500 text-xs">عرض الكل</button></div>
                <div className="p-2">{auditLog.slice(0, 8).map(l => (<div key={l.id} className={`p-2 rounded-lg mb-1 cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`} onClick={() => { setCurrentView('audit'); setShowAuditPanel(false); }}><div className="flex justify-between text-xs"><span className={txt}>{l.user}</span><span className={sub}>{new Date(l.timestamp).toLocaleTimeString('ar-SA')}</span></div><p className={`text-xs ${sub}`}>{l.description}</p></div>))}</div>
              </div>
            )}
          </div>
          <div className="relative" ref={archiveRef}>
            <button onClick={() => { setShowArchivePanel(!showArchivePanel); setShowAuditPanel(false); setShowBgPicker(false); }} className={`p-2 rounded-lg relative ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <Archive className={`w-5 h-5 ${txt}`} />
              {totalArchived > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">{totalArchived}</span>}
            </button>
            {showArchivePanel && (
              <div className={`absolute left-0 top-12 w-72 ${card} rounded-xl shadow-2xl border z-50`}>
                <div className={`p-3 border-b flex justify-between ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}><h3 className={`font-bold ${txt}`}>الأرشيف</h3><button onClick={() => { setCurrentView('archive'); setShowArchivePanel(false); }} className="text-blue-500 text-xs">عرض الكل</button></div>
                <div className="p-2">
                  {[{ label: 'المصروفات', count: archivedExpenses?.length || 0 },{ label: 'المهام', count: archivedTasks?.length || 0 },{ label: 'المشاريع', count: archivedProjects?.length || 0 },{ label: 'الحسابات', count: archivedAccounts?.length || 0 }].map(item => (
                    <button key={item.label} onClick={() => { setCurrentView('archive'); setShowArchivePanel(false); }} className={`w-full p-2 rounded-lg mb-1 flex justify-between items-center ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                      <span className={txt}>{item.label}</span><span className={`text-xs px-2 py-0.5 rounded-full ${item.count > 0 ? 'bg-orange-500 text-white' : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'}`}>{item.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="relative" ref={bgRef}>
            <button onClick={() => { setShowBgPicker(!showBgPicker); setShowAuditPanel(false); setShowArchivePanel(false); }} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}><Palette className={`w-5 h-5 ${txt}`} /></button>
            {showBgPicker && (
              <div className={`absolute left-0 top-12 w-48 ${card} rounded-xl shadow-2xl border z-50 p-3`}>
                <h4 className={`font-bold mb-2 text-sm ${txt}`}>اختر الخلفية</h4>
                <div className="grid grid-cols-5 gap-2">{backgrounds.map((b, i) => (<button key={b.id} onClick={() => { setBgIndex(i); setShowBgPicker(false); }} className={`w-8 h-8 rounded-lg bg-gradient-to-br ${b.dark} ${bgIndex === i ? 'ring-2 ring-blue-500' : ''}`} title={b.name} />))}</div>
              </div>
            )}
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>{darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}</button>
          <button onClick={() => setFontSize(f => Math.max(12, f - 2))} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100'}`}><ZoomOut className="w-5 h-5" /></button>
          <button onClick={() => setFontSize(f => Math.min(24, f + 2))} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100'}`}><ZoomIn className="w-5 h-5" /></button>
          <button onClick={logout} className="p-2 bg-red-600 text-white rounded-lg"><Power className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className={`w-full md:w-56 ${card} border-b md:border-l p-3`}>
          <nav className="flex md:flex-col gap-1 flex-wrap">
            {[{ id: 'dashboard', icon: Activity, label: 'الرئيسية' },{ id: 'expenses', icon: Calendar, label: 'المصروفات' },{ id: 'tasks', icon: CheckSquare, label: 'المهام' },{ id: 'projects', icon: FolderPlus, label: 'المشاريع', badge: projects.length },{ id: 'accounts', icon: Users, label: 'الحسابات' },{ id: 'users', icon: UserCog, label: 'المستخدمين' },{ id: 'archive', icon: Archive, label: 'الأرشيف', badge: totalArchived },{ id: 'audit', icon: History, label: 'السجل' }].map(item => (
              <button key={item.id} onClick={() => setCurrentView(item.id)} className={`flex items-center gap-2 p-3 rounded-xl ${currentView === item.id ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                <item.icon className="w-5 h-5" /><span className="text-sm">{item.label}</span>
                {item.badge > 0 && <span className="mr-auto bg-orange-500 text-white text-xs px-2 rounded-full">{item.badge}</span>}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex-1 p-4 md:p-6">
          {currentView === 'dashboard' && (
            <div>
              <h2 className={`text-2xl font-bold mb-6 ${txt}`}>لوحة التحكم</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[{ label: 'المصروفات', value: kpis.totalExp, sub: `${kpis.pendingExp} قيد الانتظار`, color: 'from-blue-500 to-blue-600', view: 'expenses' },{ label: 'المهام', value: kpis.totalTasks, sub: `${kpis.highTasks} عالية`, color: 'from-green-500 to-green-600', view: 'tasks' },{ label: 'المشاريع', value: kpis.totalProjects, sub: 'مشروع', color: 'from-purple-500 to-purple-600', view: 'projects' },{ label: 'الحسابات', value: kpis.totalAcc, sub: 'حساب', color: 'from-orange-500 to-orange-600', view: 'accounts' }].map((k, i) => (
                  <button key={i} onClick={() => setCurrentView(k.view)} className={`bg-gradient-to-br ${k.color} p-4 rounded-xl text-white text-right hover:opacity-90`}>
                    <p className="text-sm opacity-90">{k.label}</p><p className="text-3xl font-bold">{k.value}</p><p className="text-xs opacity-75">{k.sub}</p><ChevronLeft className="w-5 h-5 mt-2 opacity-75" />
                  </button>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className={`${card} p-4 rounded-xl border`}>
                  <div className="flex justify-between mb-4"><h3 className={`font-bold ${txt}`}>المصروفات القادمة</h3><button onClick={() => setCurrentView('expenses')} className="text-blue-500 text-sm">الكل</button></div>
                  {expenses.length === 0 ? <p className={`text-center py-8 ${sub}`}>لا توجد مصروفات</p> : expenses.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 3).map(e => { const d = calcDays(e.dueDate); return <div key={e.id} className={`p-3 rounded-lg mb-2 ${getColor(d)}`}><div className="flex justify-between"><span>{e.name}</span><span className="font-bold">{e.amount} ر.س</span></div><div className="text-xs mt-1">{d < 0 ? `متأخر ${Math.abs(d)} يوم` : `${d} يوم`}</div></div>; })}
                </div>
                <div className={`${card} p-4 rounded-xl border`}>
                  <div className="flex justify-between mb-4"><h3 className={`font-bold ${txt}`}>المشاريع النشطة</h3><button onClick={() => setCurrentView('projects')} className="text-blue-500 text-sm">الكل</button></div>
                  {projects.length === 0 ? <p className={`text-center py-8 ${sub}`}>لا توجد مشاريع</p> : projects.filter(p => p.status === 'جاري').slice(0, 3).map(p => (<div key={p.id} className={`p-3 rounded-lg mb-2 ${darkMode ? 'bg-purple-900/50' : 'bg-purple-50'} border border-purple-200`}><div className="flex justify-between"><span className={txt}>{p.name}</span><span className="bg-purple-500 text-white text-xs px-2 rounded">{p.status}</span></div><p className={`text-xs ${sub}`}>{p.client || 'بدون عميل'}</p></div>))}
                </div>
              </div>
            </div>
          )}

          {currentView === 'expenses' && (
            <div>
              <div className="flex justify-between mb-6"><h2 className={`text-2xl font-bold ${txt}`}>المصروفات</h2><button onClick={() => { setModalType('addExp'); setShowModal(true); }} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl"><Plus className="w-5 h-5" />إضافة</button></div>
              {expenses.length === 0 ? <div className={`${card} p-12 rounded-xl border text-center`}><Calendar className={`w-16 h-16 mx-auto mb-4 ${sub}`} /><p className={sub}>لا توجد مصروفات</p></div> : (
                <div className="space-y-3">{expenses.map(e => { const d = calcDays(e.dueDate); return (
                  <div key={e.id} className={`${card} p-4 rounded-xl border`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1"><h3 className={`font-bold ${txt}`}>{e.name}</h3><span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800">{e.type}</span>{e.status === 'مدفوع' && <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-800">مدفوع</span>}</div>
                        <p className="text-2xl font-bold text-black">{e.amount} ر.س</p><p className={`text-sm ${sub}`}>{e.reason}</p>
                        <div className={`flex gap-3 text-xs ${sub} mt-2`}><span>{e.dueDate}</span><span className={d < 0 ? 'text-red-500 font-bold' : 'text-green-500 font-bold'}>{d < 0 ? `متأخر ${Math.abs(d)} يوم` : `${d} يوم`}</span></div>
                      </div>
                      <div className="flex gap-2">{e.status !== 'مدفوع' && <Btn onClick={() => markPaid(e.id)} icon={CheckSquare} color="bg-green-600" title="دفع" />}<Btn onClick={() => { setEditingItem({ ...e }); setModalType('editExp'); setShowModal(true); }} icon={Pencil} color="bg-blue-600" title="تعديل" /><Btn onClick={() => { setSelectedItem(e); setModalType('delExp'); setShowModal(true); }} icon={Trash2} color="bg-red-600" title="حذف" /></div>
                    </div>
                  </div>
                ); })}</div>
              )}
            </div>
          )}

          {currentView === 'tasks' && (
            <div>
              <div className="flex justify-between mb-6 flex-wrap gap-2"><h2 className={`text-2xl font-bold ${txt}`}>المهام</h2>
                <div className="flex gap-2"><button onClick={() => { setModalType('addTask'); setShowModal(true); }} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl"><Plus className="w-5 h-5" />إضافة مهمة</button><button onClick={() => { setModalType('addProject'); setShowModal(true); }} className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-xl"><FolderPlus className="w-5 h-5" />إضافة مشروع</button></div>
              </div>
              {tasks.length === 0 ? <div className={`${card} p-12 rounded-xl border text-center`}><CheckSquare className={`w-16 h-16 mx-auto mb-4 ${sub}`} /><p className={sub}>لا توجد مهام</p></div> : (
                <div className="space-y-3">{tasks.map(t => { const d = calcDays(t.dueDate); const project = projects.find(p => p.id === t.projectId); return (
                  <div key={t.id} className={`${card} p-4 rounded-xl border`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1"><h3 className={`font-bold ${txt}`}>{t.title}</h3><span className={`text-xs px-2 py-0.5 rounded ${t.priority === 'عالية' ? 'bg-red-100 text-red-800' : t.priority === 'متوسطة' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{t.priority}</span>{project && <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-800">{project.name}</span>}</div>
                        <p className={`text-sm ${sub}`}>{t.description}</p>
                        <div className={`flex gap-3 text-xs ${sub} mt-2`}><span>المسؤول: {t.assignedTo || '-'}</span><span>{t.dueDate}</span><span className={d < 0 ? 'text-red-500 font-bold' : 'text-green-500 font-bold'}>{d < 0 ? `متأخر ${Math.abs(d)} يوم` : `${d} يوم`}</span></div>
                      </div>
                      <div className="flex gap-2"><Btn onClick={() => { setEditingItem({ ...t }); setModalType('editTask'); setShowModal(true); }} icon={Pencil} color="bg-blue-600" title="تعديل" /><Btn onClick={() => { setSelectedItem(t); setModalType('delTask'); setShowModal(true); }} icon={Trash2} color="bg-red-600" title="حذف" /></div>
                    </div>
                  </div>
                ); })}</div>
              )}
            </div>
          )}

          {currentView === 'projects' && (
            <div>
              <div className="flex justify-between mb-6"><h2 className={`text-2xl font-bold ${txt}`}>المشاريع</h2><button onClick={() => { setModalType('addProject'); setShowModal(true); }} className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-xl"><FolderPlus className="w-5 h-5" />إضافة مشروع</button></div>
              {projects.length === 0 ? <div className={`${card} p-12 rounded-xl border text-center`}><FolderPlus className={`w-16 h-16 mx-auto mb-4 ${sub}`} /><p className={sub}>لا توجد مشاريع</p></div> : (
                <div className="space-y-4">{projects.map(p => { const projectTasks = tasks.filter(t => t.projectId === p.id); return (
                  <div key={p.id} className={`${card} p-4 rounded-xl border`}>
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2"><h3 className={`font-bold text-lg ${txt}`}>{p.name}</h3><span className={`text-xs px-2 py-0.5 rounded ${p.status === 'جاري' ? 'bg-blue-100 text-blue-800' : p.status === 'مكتمل' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{p.status}</span></div>
                        <p className={`text-sm ${sub} mb-2`}>{p.description}</p>
                        <div className={`grid md:grid-cols-3 gap-2 text-sm ${sub}`}>{p.client && <div className="flex items-center gap-1"><User className="w-4 h-4" />{p.client}</div>}{p.location && <div className="flex items-center gap-1"><MapPin className="w-4 h-4" />{p.location}</div>}{p.budget && <div className="flex items-center gap-1">💰 {p.budget} ر.س</div>}</div>
                        <div className={`flex gap-3 text-xs ${sub} mt-2`}><span>من: {p.startDate || '-'}</span><span>إلى: {p.endDate || '-'}</span><span className="text-purple-500 font-bold">{projectTasks.length} مهمة</span></div>
                      </div>
                      <div className="flex gap-2"><Btn onClick={() => { setNewTask({ ...newTask, projectId: p.id }); setModalType('addTask'); setShowModal(true); }} icon={Plus} color="bg-green-600" title="إضافة مهمة" /><Btn onClick={() => { setEditingItem({ ...p }); setModalType('editProject'); setShowModal(true); }} icon={Pencil} color="bg-blue-600" title="تعديل" /><Btn onClick={() => { setSelectedItem(p); setModalType('delProject'); setShowModal(true); }} icon={Trash2} color="bg-red-600" title="حذف" /></div>
                    </div>
                  </div>
                ); })}</div>
              )}
            </div>
          )}

          {currentView === 'accounts' && (
            <div>
              <div className="flex justify-between mb-6"><h2 className={`text-2xl font-bold ${txt}`}>الحسابات</h2><button onClick={() => { setModalType('addAcc'); setShowModal(true); }} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl"><Plus className="w-5 h-5" />إضافة</button></div>
              {accounts.length === 0 ? <div className={`${card} p-12 rounded-xl border text-center`}><Users className={`w-16 h-16 mx-auto mb-4 ${sub}`} /><p className={sub}>لا توجد حسابات</p></div> : (
                <div className="space-y-3">{accounts.map(a => (
                  <div key={a.id} className={`${card} p-4 rounded-xl border`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex-1">
                        <h3 className={`font-bold ${txt}`}>{a.name}</h3><p className={`text-sm ${sub}`}>{a.description}</p>
                        <div className={`grid md:grid-cols-3 gap-2 text-sm mt-2`}><div><span className={sub}>الرابط: </span><a href={a.loginUrl} target="_blank" rel="noreferrer" className="text-blue-500">{a.loginUrl}</a></div><div><span className={sub}>المستخدم: </span><span className="font-mono text-black">{a.username}</span></div><div><span className={sub}>كلمة المرور: </span><span className="font-mono text-black">{a.password}</span></div></div>
                        <div className={`flex gap-3 text-xs ${sub} mt-2`}><span>الاشتراك: {a.subscriptionDate}</span><span className="text-green-500 font-bold">{a.daysRemaining} يوم</span></div>
                      </div>
                      <div className="flex gap-2"><Btn onClick={() => { setEditingItem({ ...a }); setModalType('editAcc'); setShowModal(true); }} icon={Pencil} color="bg-blue-600" title="تعديل" /><Btn onClick={() => { setSelectedItem(a); setModalType('delAcc'); setShowModal(true); }} icon={Trash2} color="bg-red-600" title="حذف" /></div>
                    </div>
                  </div>
                ))}</div>
              )}
            </div>
          )}

          {currentView === 'users' && (
            <div>
              <div className="flex justify-between mb-6"><h2 className={`text-2xl font-bold ${txt}`}>المستخدمين</h2><button onClick={() => { setModalType('addUser'); setShowModal(true); }} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl"><Plus className="w-5 h-5" />إضافة</button></div>
              <div className="space-y-3">{users.map(u => (
                <div key={u.id} className={`${card} p-4 rounded-xl border`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">{u.username.charAt(0)}</div><div><h3 className={`font-bold ${txt}`}>{u.username}</h3><p className={`text-sm ${sub}`}>{u.role === 'owner' ? 'مالك' : 'مستخدم'}</p></div><span className={`text-xs px-2 py-0.5 rounded ${u.active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{u.active !== false ? 'نشط' : 'معطل'}</span></div>
                    <div className="flex gap-2"><Btn onClick={() => { setEditingItem({ ...u }); setModalType('editUser'); setShowModal(true); }} icon={Pencil} color="bg-blue-600" title="تعديل" /><Btn onClick={() => { setSelectedItem(u); setModalType('delUser'); setShowModal(true); }} icon={Trash2} color="bg-red-600" title="حذف" /></div>
                  </div>
                </div>
              ))}</div>
            </div>
          )}

          {currentView === 'archive' && (
            <div>
              <h2 className={`text-2xl font-bold mb-6 ${txt}`}>الأرشيف</h2>
              {totalArchived === 0 ? <div className={`${card} p-12 rounded-xl border text-center`}><Archive className={`w-16 h-16 mx-auto mb-4 ${sub}`} /><p className={sub}>فارغ</p></div> : (
                <div className="space-y-6">
                  {archivedExpenses?.length > 0 && <div><h3 className={`font-bold mb-3 ${txt}`}>المصروفات ({archivedExpenses.length})</h3>{archivedExpenses.map(e => (<div key={e.id} className={`${card} p-4 rounded-xl border mb-2`}><div className="flex justify-between"><div><h4 className={`font-bold ${txt}`}>{e.name}</h4><p className="text-black">{e.amount} ر.س</p><p className={`text-xs ${sub}`}>حذف: {e.archivedBy} - {new Date(e.archivedAt).toLocaleString('ar-SA')}</p></div><Btn onClick={() => restoreExpense(e)} icon={RotateCcw} color="bg-green-600" title="استعادة" /></div></div>))}</div>}
                  {archivedTasks?.length > 0 && <div><h3 className={`font-bold mb-3 ${txt}`}>المهام ({archivedTasks.length})</h3>{archivedTasks.map(t => (<div key={t.id} className={`${card} p-4 rounded-xl border mb-2`}><div className="flex justify-between"><div><h4 className={`font-bold ${txt}`}>{t.title}</h4><p className={`text-sm ${sub}`}>{t.description}</p><p className={`text-xs ${sub}`}>حذف: {t.archivedBy} - {new Date(t.archivedAt).toLocaleString('ar-SA')}</p></div><Btn onClick={() => restoreTask(t)} icon={RotateCcw} color="bg-green-600" title="استعادة" /></div></div>))}</div>}
                  {archivedProjects?.length > 0 && <div><h3 className={`font-bold mb-3 ${txt}`}>المشاريع ({archivedProjects.length})</h3>{archivedProjects.map(p => (<div key={p.id} className={`${card} p-4 rounded-xl border mb-2`}><div className="flex justify-between"><div><h4 className={`font-bold ${txt}`}>{p.name}</h4><p className={`text-sm ${sub}`}>{p.description}</p><p className={`text-xs ${sub}`}>حذف: {p.archivedBy} - {new Date(p.archivedAt).toLocaleString('ar-SA')}</p></div><Btn onClick={() => restoreProject(p)} icon={RotateCcw} color="bg-green-600" title="استعادة" /></div></div>))}</div>}
                  {archivedAccounts?.length > 0 && <div><h3 className={`font-bold mb-3 ${txt}`}>الحسابات ({archivedAccounts.length})</h3>{archivedAccounts.map(a => (<div key={a.id} className={`${card} p-4 rounded-xl border mb-2`}><div className="flex justify-between"><div><h4 className={`font-bold ${txt}`}>{a.name}</h4><p className={`text-sm ${sub}`}>{a.description}</p><p className={`text-xs ${sub}`}>حذف: {a.archivedBy} - {new Date(a.archivedAt).toLocaleString('ar-SA')}</p></div><Btn onClick={() => restoreAccount(a)} icon={RotateCcw} color="bg-green-600" title="استعادة" /></div></div>))}</div>}
                </div>
              )}
            </div>
          )}

          {currentView === 'audit' && (
            <div>
              <h2 className={`text-2xl font-bold mb-6 ${txt}`}>السجل</h2>
              <div className="mb-6"><h3 className={`font-bold mb-3 ${txt}`}>سجل الدخول</h3><div className={`${card} rounded-xl border overflow-hidden`}><table className="w-full"><thead className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}><tr><th className={`p-3 text-right ${txt}`}>المستخدم</th><th className={`p-3 text-right ${txt}`}>الإجراء</th><th className={`p-3 text-right ${txt}`}>الوقت</th></tr></thead><tbody>{loginLog.slice(0, 10).map((l, i) => <tr key={l.id} className={i % 2 === 0 ? (darkMode ? 'bg-gray-800/50' : 'bg-gray-50') : ''}><td className={`p-3 ${txt}`}>{l.user}</td><td className="p-3"><span className={`px-2 py-1 rounded text-xs ${l.action === 'دخول' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{l.action}</span></td><td className={`p-3 text-sm ${sub}`}>{new Date(l.timestamp).toLocaleString('ar-SA')}</td></tr>)}</tbody></table></div></div>
              <div><h3 className={`font-bold mb-3 ${txt}`}>سجل العمليات</h3><div className={`${card} rounded-xl border overflow-hidden`}><table className="w-full"><thead className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}><tr><th className={`p-3 text-right ${txt}`}>الوقت</th><th className={`p-3 text-right ${txt}`}>المستخدم</th><th className={`p-3 text-right ${txt}`}>الإجراء</th><th className={`p-3 text-right ${txt}`}>الوصف</th></tr></thead><tbody>{auditLog.map((l, i) => <tr key={l.id} className={i % 2 === 0 ? (darkMode ? 'bg-gray-800/50' : 'bg-gray-50') : ''}><td className={`p-3 text-sm ${sub}`}>{new Date(l.timestamp).toLocaleString('ar-SA')}</td><td className={`p-3 ${txt}`}>{l.user}</td><td className="p-3"><span className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>{l.action}</span></td><td className={`p-3 text-sm ${sub}`}>{l.description}</td></tr>)}</tbody></table></div></div>
            </div>
          )}

          <div className={`text-center py-4 ${sub} text-xs`}><span>ركائز الأولى للتعمير | </span><button onClick={() => setShowVersions(true)} className="hover:text-blue-500">v{APP_VERSION}</button></div>
        </div>
      </div>


      {showVersions && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowVersions(false)}>
          <div className={`${card} p-6 rounded-2xl max-w-md w-full border`} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className={`text-xl font-bold ${txt}`}>سجل النسخ</h3><button onClick={() => setShowVersions(false)} className={sub}><X className="w-5 h-5" /></button></div>
            <div className="space-y-4 max-h-96 overflow-y-auto">{versionHistory.map((v, i) => (<div key={v.version} className={`p-4 rounded-xl ${i === 0 ? 'bg-blue-500/20 border border-blue-500' : darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}><div className="flex justify-between items-center mb-2"><span className={`font-bold ${txt}`}>v{v.version}</span><span className={`text-xs ${sub}`}>{v.date}</span></div><ul className={`text-sm ${sub} space-y-1`}>{v.changes.map((c, j) => <li key={j}>• {c}</li>)}</ul></div>))}</div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className={`${card} p-6 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border`}>
            {modalType === 'delExp' && <><h3 className={`text-xl font-bold mb-4 ${txt}`}>حذف مصروف</h3><p className={`mb-6 ${sub}`}>حذف "{selectedItem?.name}"؟</p><div className="flex gap-3 justify-end"><button onClick={() => setShowModal(false)} className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>إلغاء</button><button onClick={() => delExpense(selectedItem)} className="px-4 py-2 bg-red-600 text-white rounded-xl">حذف</button></div></>}
            {modalType === 'delTask' && <><h3 className={`text-xl font-bold mb-4 ${txt}`}>حذف مهمة</h3><p className={`mb-6 ${sub}`}>حذف "{selectedItem?.title}"؟</p><div className="flex gap-3 justify-end"><button onClick={() => setShowModal(false)} className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>إلغاء</button><button onClick={() => delTask(selectedItem)} className="px-4 py-2 bg-red-600 text-white rounded-xl">حذف</button></div></>}
            {modalType === 'delProject' && <><h3 className={`text-xl font-bold mb-4 ${txt}`}>حذف مشروع</h3><p className={`mb-6 ${sub}`}>حذف "{selectedItem?.name}"؟</p><div className="flex gap-3 justify-end"><button onClick={() => setShowModal(false)} className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>إلغاء</button><button onClick={() => delProject(selectedItem)} className="px-4 py-2 bg-red-600 text-white rounded-xl">حذف</button></div></>}
            {modalType === 'delAcc' && <><h3 className={`text-xl font-bold mb-4 ${txt}`}>حذف حساب</h3><p className={`mb-6 ${sub}`}>حذف "{selectedItem?.name}"؟</p><div className="flex gap-3 justify-end"><button onClick={() => setShowModal(false)} className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>إلغاء</button><button onClick={() => delAccount(selectedItem)} className="px-4 py-2 bg-red-600 text-white rounded-xl">حذف</button></div></>}
            {modalType === 'delUser' && <><h3 className={`text-xl font-bold mb-4 ${txt}`}>حذف مستخدم</h3><p className={`mb-6 ${sub}`}>حذف "{selectedItem?.username}"؟</p><div className="flex gap-3 justify-end"><button onClick={() => setShowModal(false)} className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>إلغاء</button><button onClick={() => delUser(selectedItem)} className="px-4 py-2 bg-red-600 text-white rounded-xl">حذف</button></div></>}

            {(modalType === 'addExp' || modalType === 'editExp') && <><h3 className={`text-xl font-bold mb-4 ${txt}`}>{modalType === 'addExp' ? 'إضافة مصروف' : 'تعديل'}</h3><div className="space-y-4"><input placeholder="الاسم *" value={modalType === 'addExp' ? newExpense.name : editingItem?.name || ''} onChange={e => modalType === 'addExp' ? setNewExpense({ ...newExpense, name: e.target.value }) : setEditingItem({ ...editingItem, name: e.target.value })} className={`w-full p-3 border rounded-xl ${inp}`} /><input type="number" placeholder="المبلغ *" value={modalType === 'addExp' ? newExpense.amount : editingItem?.amount || ''} onChange={e => modalType === 'addExp' ? setNewExpense({ ...newExpense, amount: e.target.value }) : setEditingItem({ ...editingItem, amount: parseFloat(e.target.value) })} className={`w-full p-3 border rounded-xl ${inp}`} /><input type="date" value={modalType === 'addExp' ? newExpense.dueDate : editingItem?.dueDate || ''} onChange={e => modalType === 'addExp' ? setNewExpense({ ...newExpense, dueDate: e.target.value }) : setEditingItem({ ...editingItem, dueDate: e.target.value })} className={`w-full p-3 border rounded-xl ${inp}`} /><select value={modalType === 'addExp' ? newExpense.type : editingItem?.type || 'شهري'} onChange={e => modalType === 'addExp' ? setNewExpense({ ...newExpense, type: e.target.value }) : setEditingItem({ ...editingItem, type: e.target.value })} className={`w-full p-3 border rounded-xl ${inp}`}><option value="شهري">شهري</option><option value="سنوي">سنوي</option><option value="مرة واحدة">مرة واحدة</option></select><textarea placeholder="السبب" value={modalType === 'addExp' ? newExpense.reason : editingItem?.reason || ''} onChange={e => modalType === 'addExp' ? setNewExpense({ ...newExpense, reason: e.target.value }) : setEditingItem({ ...editingItem, reason: e.target.value })} className={`w-full p-3 border rounded-xl ${inp}`} rows="2" /></div><div className="flex gap-3 justify-end mt-6"><button onClick={() => { setShowModal(false); setEditingItem(null); }} className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>إلغاء</button><button onClick={modalType === 'addExp' ? addExpense : editExpense} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl">{modalType === 'addExp' ? 'إضافة' : 'حفظ'}</button></div></>}

            {(modalType === 'addTask' || modalType === 'editTask') && <><h3 className={`text-xl font-bold mb-4 ${txt}`}>{modalType === 'addTask' ? 'إضافة مهمة' : 'تعديل'}</h3><div className="space-y-4"><input placeholder="العنوان *" value={modalType === 'addTask' ? newTask.title : editingItem?.title || ''} onChange={e => modalType === 'addTask' ? setNewTask({ ...newTask, title: e.target.value }) : setEditingItem({ ...editingItem, title: e.target.value })} className={`w-full p-3 border rounded-xl ${inp}`} /><select value={modalType === 'addTask' ? newTask.projectId : editingItem?.projectId || ''} onChange={e => modalType === 'addTask' ? setNewTask({ ...newTask, projectId: e.target.value }) : setEditingItem({ ...editingItem, projectId: e.target.value })} className={`w-full p-3 border rounded-xl ${inp}`}><option value="">بدون مشروع</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select><textarea placeholder="الوصف" value={modalType === 'addTask' ? newTask.description : editingItem?.description || ''} onChange={e => modalType === 'addTask' ? setNewTask({ ...newTask, description: e.target.value }) : setEditingItem({ ...editingItem, description: e.target.value })} className={`w-full p-3 border rounded-xl ${inp}`} rows="2" /><input type="date" value={modalType === 'addTask' ? newTask.dueDate : editingItem?.dueDate || ''} onChange={e => modalType === 'addTask' ? setNewTask({ ...newTask, dueDate: e.target.value }) : setEditingItem({ ...editingItem, dueDate: e.target.value })} className={`w-full p-3 border rounded-xl ${inp}`} /><select value={modalType === 'addTask' ? newTask.assignedTo : editingItem?.assignedTo || ''} onChange={e => modalType === 'addTask' ? setNewTask({ ...newTask, assignedTo: e.target.value }) : setEditingItem({ ...editingItem, assignedTo: e.target.value })} className={`w-full p-3 border rounded-xl ${inp}`}><option value="">المسؤول</option>{users.map(u => <option key={u.id} value={u.username}>{u.username}</option>)}</select><select value={modalType === 'addTask' ? newTask.priority : editingItem?.priority || 'متوسطة'} onChange={e => modalType === 'addTask' ? setNewTask({ ...newTask, priority: e.target.value }) : setEditingItem({ ...editingItem, priority: e.target.value })} className={`w-full p-3 border rounded-xl ${inp}`}><option value="عالية">عالية</option><option value="متوسطة">متوسطة</option><option value="منخفضة">منخفضة</option></select></div><div className="flex gap-3 justify-end mt-6"><button onClick={() => { setShowModal(false); setEditingItem(null); }} className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>إلغاء</button><button onClick={modalType === 'addTask' ? addTask : editTask} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl">{modalType === 'addTask' ? 'إضافة' : 'حفظ'}</button></div></>}

            {(modalType === 'addProject' || modalType === 'editProject') && <><h3 className={`text-xl font-bold mb-4 ${txt}`}>{modalType === 'addProject' ? 'إضافة مشروع' : 'تعديل'}</h3><div className="space-y-4"><input placeholder="اسم المشروع *" value={modalType === 'addProject' ? newProject.name : editingItem?.name || ''} onChange={e => modalType === 'addProject' ? setNewProject({ ...newProject, name: e.target.value }) : setEditingItem({ ...editingItem, name: e.target.value })} className={`w-full p-3 border rounded-xl ${inp}`} /><textarea placeholder="الوصف" value={modalType === 'addProject' ? newProject.description : editingItem?.description || ''} onChange={e => modalType === 'addProject' ? setNewProject({ ...newProject, description: e.target.value }) : setEditingItem({ ...editingItem, description: e.target.value })} className={`w-full p-3 border rounded-xl ${inp}`} rows="2" /><input placeholder="العميل" value={modalType === 'addProject' ? newProject.client : editingItem?.client || ''} onChange={e => modalType === 'addProject' ? setNewProject({ ...newProject, client: e.target.value }) : setEditingItem({ ...editingItem, client: e.target.value })} className={`w-full p-3 border rounded-xl ${inp}`} /><input placeholder="الموقع" value={modalType === 'addProject' ? newProject.location : editingItem?.location || ''} onChange={e => modalType === 'addProject' ? setNewProject({ ...newProject, location: e.target.value }) : setEditingItem({ ...editingItem, location: e.target.value })} className={`w-full p-3 border rounded-xl ${inp}`} /><div className="grid grid-cols-2 gap-4"><input type="date" value={modalType === 'addProject' ? newProject.startDate : editingItem?.startDate || ''} onChange={e => modalType === 'addProject' ? setNewProject({ ...newProject, startDate: e.target.value }) : setEditingItem({ ...editingItem, startDate: e.target.value })} className={`w-full p-3 border rounded-xl ${inp}`} /><input type="date" value={modalType === 'addProject' ? newProject.endDate : editingItem?.endDate || ''} onChange={e => modalType === 'addProject' ? setNewProject({ ...newProject, endDate: e.target.value }) : setEditingItem({ ...editingItem, endDate: e.target.value })} className={`w-full p-3 border rounded-xl ${inp}`} /></div><input type="number" placeholder="الميزانية" value={modalType === 'addProject' ? newProject.budget : editingItem?.budget || ''} onChange={e => modalType === 'addProject' ? setNewProject({ ...newProject, budget: e.target.value }) : setEditingItem({ ...editingItem, budget: e.target.value })} className={`w-full p-3 border rounded-xl ${inp}`} /><select value={modalType === 'addProject' ? newProject.status : editingItem?.status || 'جاري'} onChange={e => modalType === 'addProject' ? setNewProject({ ...newProject, status: e.target.value }) : setEditingItem({ ...editingItem, status: e.target.value })} className={`w-full p-3 border rounded-xl ${inp}`}><option value="جاري">جاري</option><option value="متوقف">متوقف</option><option value="مكتمل">مكتمل</option></select></div><div className="flex gap-3 justify-end mt-6"><button onClick={() => { setShowModal(false); setEditingItem(null); }} className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>إلغاء</button><button onClick={modalType === 'addProject' ? addProject : editProject} className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl">{modalType === 'addProject' ? 'إضافة' : 'حفظ'}</button></div></>}

            {(modalType === 'addAcc' || modalType === 'editAcc') && <><h3 className={`text-xl font-bold mb-4 ${txt}`}>{modalType === 'addAcc' ? 'إضافة حساب' : 'تعديل'}</h3><div className="space-y-4"><input placeholder="الاسم *" value={modalType === 'addAcc' ? newAccount.name : editingItem?.name || ''} onChange={e => modalType === 'addAcc' ? setNewAccount({ ...newAccount, name: e.target.value }) : setEditingItem({ ...editingItem, name: e.target.value })} className={`w-full p-3 border rounded-xl ${inp}`} /><input placeholder="الوصف" value={modalType === 'addAcc' ? newAccount.description : editingItem?.description || ''} onChange={e => modalType === 'addAcc' ? setNewAccount({ ...newAccount, description: e.target.value }) : setEditingItem({ ...editingItem, description: e.target.value })} className={`w-full p-3 border rounded-xl ${inp}`} /><input placeholder="رابط الدخول" value={modalType === 'addAcc' ? newAccount.loginUrl : editingItem?.loginUrl || ''} onChange={e => modalType === 'addAcc' ? setNewAccount({ ...newAccount, loginUrl: e.target.value }) : setEditingItem({ ...editingItem, loginUrl: e.target.value })} className={`w-full p-3 border rounded-xl ${inp}`} /><input placeholder="المستخدم *" value={modalType === 'addAcc' ? newAccount.username : editingItem?.username || ''} onChange={e => modalType === 'addAcc' ? setNewAccount({ ...newAccount, username: e.target.value }) : setEditingItem({ ...editingItem, username: e.target.value })} className={`w-full p-3 border rounded-xl ${inp}`} /><input placeholder="كلمة المرور" value={modalType === 'addAcc' ? newAccount.password : editingItem?.password || ''} onChange={e => modalType === 'addAcc' ? setNewAccount({ ...newAccount, password: e.target.value }) : setEditingItem({ ...editingItem, password: e.target.value })} className={`w-full p-3 border rounded-xl ${inp}`} /><input type="date" value={modalType === 'addAcc' ? newAccount.subscriptionDate : editingItem?.subscriptionDate || ''} onChange={e => modalType === 'addAcc' ? setNewAccount({ ...newAccount, subscriptionDate: e.target.value }) : setEditingItem({ ...editingItem, subscriptionDate: e.target.value })} className={`w-full p-3 border rounded-xl ${inp}`} /><input type="number" placeholder="الأيام المتبقية" value={modalType === 'addAcc' ? newAccount.daysRemaining : editingItem?.daysRemaining || ''} onChange={e => modalType === 'addAcc' ? setNewAccount({ ...newAccount, daysRemaining: parseInt(e.target.value) }) : setEditingItem({ ...editingItem, daysRemaining: parseInt(e.target.value) })} className={`w-full p-3 border rounded-xl ${inp}`} /></div><div className="flex gap-3 justify-end mt-6"><button onClick={() => { setShowModal(false); setEditingItem(null); }} className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>إلغاء</button><button onClick={modalType === 'addAcc' ? addAccount : editAccount} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl">{modalType === 'addAcc' ? 'إضافة' : 'حفظ'}</button></div></>}

            {(modalType === 'addUser' || modalType === 'editUser') && <><h3 className={`text-xl font-bold mb-4 ${txt}`}>{modalType === 'addUser' ? 'إضافة مستخدم' : 'تعديل'}</h3><div className="space-y-4"><input placeholder="الاسم *" value={modalType === 'addUser' ? newUser.username : editingItem?.username || ''} onChange={e => modalType === 'addUser' ? setNewUser({ ...newUser, username: e.target.value }) : setEditingItem({ ...editingItem, username: e.target.value })} className={`w-full p-3 border rounded-xl ${inp}`} /><input placeholder="كلمة المرور *" value={modalType === 'addUser' ? newUser.password : editingItem?.password || ''} onChange={e => modalType === 'addUser' ? setNewUser({ ...newUser, password: e.target.value }) : setEditingItem({ ...editingItem, password: e.target.value })} className={`w-full p-3 border rounded-xl ${inp}`} /><select value={modalType === 'addUser' ? newUser.role : editingItem?.role || 'user'} onChange={e => modalType === 'addUser' ? setNewUser({ ...newUser, role: e.target.value }) : setEditingItem({ ...editingItem, role: e.target.value })} className={`w-full p-3 border rounded-xl ${inp}`}><option value="owner">مالك</option><option value="user">مستخدم</option></select><label className={`flex items-center gap-2 ${txt}`}><input type="checkbox" checked={modalType === 'addUser' ? newUser.active : editingItem?.active !== false} onChange={e => modalType === 'addUser' ? setNewUser({ ...newUser, active: e.target.checked }) : setEditingItem({ ...editingItem, active: e.target.checked })} className="w-5 h-5" />نشط</label></div><div className="flex gap-3 justify-end mt-6"><button onClick={() => { setShowModal(false); setEditingItem(null); }} className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>إلغاء</button><button onClick={modalType === 'addUser' ? addUser : editUser} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl">{modalType === 'addUser' ? 'إضافة' : 'حفظ'}</button></div></>}
          </div>
        </div>
      )}
    </div>
  );
}
