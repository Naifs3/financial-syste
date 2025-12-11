import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { Calendar, CheckSquare, Users, Moon, Sun, Plus, Archive, Clock, AlertCircle, Activity, History, Loader, Power, Pencil, Trash2, RotateCcw, UserCog, ChevronLeft, Image, FolderPlus, FileText } from 'lucide-react';

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

const versionHistory = [
  { version: "2.1.0", date: "2025-01-15", changes: ["إضافة نظام المشاريع", "تحسين واجهة المهام", "إضافة خلفيات متعددة", "تحسين نظام الإشعارات"] },
  { version: "2.0.0", date: "2025-01-10", changes: ["إعادة تصميم كاملة", "إضافة الوضع الليلي", "تحسين الأداء", "إضافة نظام الأرشفة"] },
  { version: "1.5.0", date: "2025-01-05", changes: ["إضافة نظام المستخدمين", "تحسين الأمان", "إضافة السجل"] },
  { version: "1.0.0", date: "2024-12-01", changes: ["الإصدار الأول", "المصروفات والمهام", "نظام الحسابات"] }
];

const APP_VERSION = versionHistory[0].version;

const quotes = [
  "يوم موفق! 🌟", "استمر في التميز! 💪", "النجاح قريب! 🎯", "أنت رائع! ⭐", "يوم مبارك! 🌸", "إلى القمة! 🚀",
  "الطموح لا يتوقف 🎯", "كل خطوة تقربك من الهدف 👣", "العمل الجاد ثمره النجاح 💼", "التميز عادة وليس حدث ⭐",
  "الإصرار مفتاح الإنجاز 🔑", "اليوم فرصة جديدة 🌅", "نحو الأفضل دائماً ⬆️", "القمة في انتظارك 🏔️",
  "التفاؤل طريق النجاح 😊", "كن الأفضل نسخة منك 💪", "الإبداع لا حدود له 🎨", "استثمر وقتك بحكمة ⏰",
  "التخطيط نصف النجاح 📋", "الانضباط يصنع الفرق 📊", "كل يوم خطوة للأمام 🚶", "الجودة قبل الكمية ✨",
  "الثقة بالنفس أساس التميز 💎", "التطوير المستمر طريق الريادة 📈", "الإيجابية تصنع المعجزات 🌟",
  "التحدي يصنع الأبطال 🏆", "الصبر مفتاح الفرج 🗝️", "النظام أساس النجاح 📐", "الإتقان عنوان العمل 👌",
  "التعلم رحلة مستمرة 📚", "الابتكار يقود التغيير 💡", "العزيمة لا تقهر 💪", "الشغف يحرك الجبال ⛰️",
  "التفوق يبدأ من الآن 🎯", "المثابرة طريق الإنجاز 🛤️", "الطاقة الإيجابية معدية ⚡", "التركيز يحقق المستحيل 🎯",
  "الانجاز يتحدث عنك 🗣️", "الاحترافية علامة التميز 💼", "التنظيم يوفر الوقت ⏱️", "الدقة في العمل أساس النجاح ✔️",
  "الإلهام في كل مكان 🌈", "القيادة مسؤولية 👔", "التطور لا يتوقف 🔄", "الرؤية الواضحة تحقق الأهداف 👁️",
  "الفرص لمن يبحث عنها 🔍", "الإنتاجية فن وعلم 🎭", "التوازن سر السعادة ⚖️", "الاستثمار في نفسك الأفضل 💰",
  "البساطة قمة التعقيد 🎯", "الصدق أساس الثقة 🤝", "العطاء يعود بالخير 🎁", "الحكمة من التجربة 📖"
];

const backgrounds = [
  'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
  'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50',
  'bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50',
  'bg-gradient-to-br from-amber-50 via-orange-50 to-red-50',
  'bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50',
  'bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50',
  'bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50',
  'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50',
  'bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50',
  'bg-gradient-to-br from-fuchsia-50 via-purple-50 to-pink-50'
];

const darkBackgrounds = [
  'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900',
  'bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900',
  'bg-gradient-to-br from-gray-900 via-rose-900 to-gray-900',
  'bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900',
  'bg-gradient-to-br from-gray-900 via-violet-900 to-gray-900',
  'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900',
  'bg-gradient-to-br from-gray-900 via-green-900 to-gray-900',
  'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900',
  'bg-gradient-to-br from-gray-900 via-amber-900 to-gray-900',
  'bg-gradient-to-br from-gray-900 via-pink-900 to-gray-900'
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [currentUser, setCurrentUser] = useState(() => { const s = localStorage.getItem('currentUser'); return s ? JSON.parse(s) : null; });
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [bgIndex, setBgIndex] = useState(() => parseInt(localStorage.getItem('bgIndex')) || 0);
  const [fontScale, setFontScale] = useState(() => parseInt(localStorage.getItem('fontScale')) || 0);
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
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const auditRef = useRef(null);
  const archiveRef = useRef(null);

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
  const [loginLog, setLoginLog] = useState([]);

  const [newExpense, setNewExpense] = useState({ name: '', amount: '', currency: 'ر.س', dueDate: '', type: 'شهري', reason: '', status: 'قيد الانتظار' });
  const [newTask, setNewTask] = useState({ title: '', description: '', type: 'شهري', dueDate: '', assignedTo: '', priority: 'متوسطة', status: 'قيد الانتظار', project: '', projectId: '' });
  const [newProject, setNewProject] = useState({ name: '', description: '', client: '', location: '', startDate: '', endDate: '', status: 'نشط', documents: [] });
  const [newAccount, setNewAccount] = useState({ name: '', description: '', loginUrl: '', username: '', password: '', subscriptionDate: '', daysRemaining: 365 });
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user', active: true });

  useEffect(() => { localStorage.setItem('isLoggedIn', isLoggedIn); if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser)); }, [isLoggedIn, currentUser]);
  useEffect(() => { localStorage.setItem('darkMode', darkMode); }, [darkMode]);
  useEffect(() => { localStorage.setItem('bgIndex', bgIndex); }, [bgIndex]);
  useEffect(() => { localStorage.setItem('fontScale', fontScale); }, [fontScale]);

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
        setLoginLog(d.loginLog || []);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => { 
    const i = setInterval(() => setQuote(quotes[Math.floor(Math.random() * quotes.length)]), 30000); 
    return () => clearInterval(i); 
  }, []);

  useEffect(() => { 
    const t = setInterval(() => setCurrentTime(new Date()), 1000); 
    return () => clearInterval(t); 
  }, []);

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, [currentView]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showAuditPanel && auditRef.current && !auditRef.current.contains(e.target)) {
        setShowAuditPanel(false);
      }
      if (showArchivePanel && archiveRef.current && !archiveRef.current.contains(e.target)) {
        setShowArchivePanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAuditPanel, showArchivePanel]);

  const save = async (d) => { 
    try { 
      await setDoc(doc(db, 'data', 'main'), { 
        users: d.users || users, 
        expenses: d.expenses || expenses, 
        tasks: d.tasks || tasks, 
        projects: d.projects || projects,
        accounts: d.accounts || accounts, 
        auditLog: d.auditLog || auditLog, 
        archivedExpenses: d.archivedExpenses || archivedExpenses, 
        archivedTasks: d.archivedTasks || archivedTasks, 
        archivedAccounts: d.archivedAccounts || archivedAccounts, 
        loginLog: d.loginLog || loginLog 
      }); 
    } catch (e) { 
      console.error(e); 
    } 
  };

  const addLog = (action, desc) => { 
    const l = { 
      id: `LOG${Date.now()}`, 
      user: currentUser?.username || 'نظام', 
      action, 
      description: desc, 
      timestamp: new Date().toISOString() 
    }; 
    const nl = [l, ...auditLog]; 
    setAuditLog(nl); 
    setNewNotifications(p => p + 1); 
    return nl; 
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
      setLoginLog(ll);
      const al = addLog('دخول', `${u} سجل دخول`);
      save({ auditLog: al, loginLog: ll });
    } else alert('خطأ في البيانات');
  };

  const logout = () => {
    const ll = [{ id: `L${Date.now()}`, user: currentUser.username, timestamp: new Date().toISOString(), action: 'خروج' }, ...loginLog];
    setLoginLog(ll); save({ loginLog: ll });
    setIsLoggedIn(false); setCurrentUser(null);
    localStorage.removeItem('isLoggedIn'); localStorage.removeItem('currentUser');
  };

  const addExpense = () => {
    if (!newExpense.name || !newExpense.amount || !newExpense.dueDate) return alert('املأ الحقول');
    const exp = { ...newExpense, id: `E${Date.now()}`, amount: parseFloat(newExpense.amount), createdAt: new Date().toISOString(), createdBy: currentUser.username };
    const ne = [...expenses, exp];
    const al = addLog('إضافة', `مصروف: ${exp.name}`);
    setExpenses(ne); save({ expenses: ne, auditLog: al });
    setNewExpense({ name: '', amount: '', currency: 'ر.س', dueDate: '', type: 'شهري', reason: '', status: 'قيد الانتظار' });
    setShowModal(false);
  };

  const editExpense = () => {
    if (!editingItem.name || !editingItem.amount) return alert('املأ الحقول');
    const ne = expenses.map(e => e.id === editingItem.id ? { ...editingItem, updatedAt: new Date().toISOString() } : e);
    const al = addLog('تعديل', `مصروف: ${editingItem.name}`);
    setExpenses(ne); save({ expenses: ne, auditLog: al });
    setEditingItem(null); setShowModal(false);
  };

  const delExpense = (exp) => {
    const ne = expenses.filter(e => e.id !== exp.id);
    const na = [{ ...exp, archivedAt: new Date().toISOString(), archivedBy: currentUser.username }, ...archivedExpenses];
    const al = addLog('حذف', `مصروف: ${exp.name}`);
    setExpenses(ne); setArchivedExpenses(na); save({ expenses: ne, archivedExpenses: na, auditLog: al });
    setShowModal(false);
  };

  const restoreExpense = (exp) => {
    const na = archivedExpenses.filter(e => e.id !== exp.id);
    const { archivedAt, archivedBy, ...rest } = exp;
    const ne = [...expenses, rest];
    const al = addLog('استعادة', `مصروف: ${exp.name}`);
    setExpenses(ne); setArchivedExpenses(na); save({ expenses: ne, archivedExpenses: na, auditLog: al });
    setShowArchivePanel(false);
  };

  const markPaid = (id) => {
    const exp = expenses.find(e => e.id === id);
    const ne = expenses.map(e => e.id === id ? { ...e, status: 'مدفوع', paidAt: new Date().toISOString() } : e);
    const al = addLog('دفع', `مصروف: ${exp.name}`);
    setExpenses(ne); save({ expenses: ne, auditLog: al });
  };

  const addTask = () => {
    if (!newTask.title || !newTask.dueDate) return alert('املأ الحقول');
    const t = { ...newTask, id: `T${Date.now()}`, updates: [], createdAt: new Date().toISOString(), createdBy: currentUser.username };
    const nt = [...tasks, t];
    const al = addLog('إضافة', `مهمة: ${t.title}`);
    setTasks(nt); save({ tasks: nt, auditLog: al });
    setNewTask({ title: '', description: '', type: 'شهري', dueDate: '', assignedTo: '', priority: 'متوسطة', status: 'قيد الانتظار', project: '', projectId: '' });
    setShowModal(false);
  };

  const editTask = () => {
    if (!editingItem.title) return alert('املأ الحقول');
    const nt = tasks.map(t => t.id === editingItem.id ? { ...editingItem, updatedAt: new Date().toISOString() } : t);
    const al = addLog('تعديل', `مهمة: ${editingItem.title}`);
    setTasks(nt); save({ tasks: nt, auditLog: al });
    setEditingItem(null); setShowModal(false);
  };

  const delTask = (t) => {
    const nt = tasks.filter(x => x.id !== t.id);
    const na = [{ ...t, archivedAt: new Date().toISOString(), archivedBy: currentUser.username }, ...(archivedTasks || [])];
    const al = addLog('حذف', `مهمة: ${t.title}`);
    setTasks(nt); setArchivedTasks(na); save({ tasks: nt, archivedTasks: na, auditLog: al });
    setShowModal(false);
  };

  const restoreTask = (t) => {
    const na = archivedTasks.filter(x => x.id !== t.id);
    const { archivedAt, archivedBy, ...rest } = t;
    const nt = [...tasks, rest];
    const al = addLog('استعادة', `مهمة: ${t.title}`);
    setTasks(nt); setArchivedTasks(na); save({ tasks: nt, archivedTasks: na, auditLog: al });
    setShowArchivePanel(false);
  };

  const addProject = () => {
    if (!newProject.name) return alert('املأ الحقول');
    const p = { ...newProject, id: `P${Date.now()}`, createdAt: new Date().toISOString(), createdBy: currentUser.username };
    const np = [...projects, p];
    const al = addLog('إضافة', `مشروع: ${p.name}`);
    setProjects(np); save({ projects: np, auditLog: al });
    setNewProject({ name: '', description: '', client: '', location: '', startDate: '', endDate: '', status: 'نشط', documents: [] });
    setShowModal(false);
  };

  const editProject = () => {
    if (!editingItem.name) return alert('املأ الحقول');
    const np = projects.map(p => p.id === editingItem.id ? { ...editingItem, updatedAt: new Date().toISOString() } : p);
    const al = addLog('تعديل', `مشروع: ${editingItem.name}`);
    setProjects(np); save({ projects: np, auditLog: al });
    setEditingItem(null); setShowModal(false);
  };

  const delProject = (p) => {
    const np = projects.filter(x => x.id !== p.id);
    const al = addLog('حذف', `مشروع: ${p.name}`);
    setProjects(np); save({ projects: np, auditLog: al });
    setShowModal(false);
  };

  const addAccount = () => {
    if (!newAccount.name || !newAccount.username) return alert('املأ الحقول');
    const a = { ...newAccount, id: `A${Date.now()}`, createdAt: new Date().toISOString(), createdBy: currentUser.username };
    const na = [...accounts, a];
    const al = addLog('إضافة', `حساب: ${a.name}`);
    setAccounts(na); save({ accounts: na, auditLog: al });
    setNewAccount({ name: '', description: '', loginUrl: '', username: '', password: '', subscriptionDate: '', daysRemaining: 365 });
    setShowModal(false);
  };

  const editAccount = () => {
    if (!editingItem.name) return alert('املأ الحقول');
    const na = accounts.map(a => a.id === editingItem.id ? { ...editingItem, updatedAt: new Date().toISOString() } : a);
    const al = addLog('تعديل', `حساب: ${editingItem.name}`);
    setAccounts(na); save({ accounts: na, auditLog: al });
    setEditingItem(null); setShowModal(false);
  };

  const delAccount = (a) => {
    const na = accounts.filter(x => x.id !== a.id);
    const nar = [{ ...a, archivedAt: new Date().toISOString(), archivedBy: currentUser.username }, ...(archivedAccounts || [])];
    const al = addLog('حذف', `حساب: ${a.name}`);
    setAccounts(na); setArchivedAccounts(nar); save({ accounts: na, archivedAccounts: nar, auditLog: al });
    setShowModal(false);
  };

  const restoreAccount = (a) => {
    const nar = archivedAccounts.filter(x => x.id !== a.id);
    const { archivedAt, archivedBy, ...rest } = a;
    const na = [...accounts, rest];
    const al = addLog('استعادة', `حساب: ${a.name}`);
    setAccounts(na); setArchivedAccounts(nar); save({ accounts: na, archivedAccounts: nar, auditLog: al });
    setShowArchivePanel(false);
  };

  const addUser = () => {
    if (!newUser.username || !newUser.password) return alert('املأ الحقول');
    if (users.find(u => u.username === newUser.username)) return alert('موجود');
    const u = { ...newUser, id: Date.now(), createdAt: new Date().toISOString() };
    const nu = [...users, u];
    const al = addLog('إضافة', `مستخدم: ${u.username}`);
    setUsers(nu); save({ users: nu, auditLog: al });
    setNewUser({ username: '', password: '', role: 'user', active: true });
    setShowModal(false);
  };

  const editUser = () => {
    if (!editingItem.username) return alert('املأ الحقول');
    const nu = users.map(u => u.id === editingItem.id ? { ...editingItem, updatedAt: new Date().toISOString() } : u);
    const al = addLog('تعديل', `مستخدم: ${editingItem.username}`);
    setUsers(nu); save({ users: nu, auditLog: al });
    setEditingItem(null); setShowModal(false);
  };

  const delUser = (u) => {
    if (u.username === currentUser.username) return alert('لا يمكن حذف نفسك');
    const nu = users.filter(x => x.id !== u.id);
    const al = addLog('حذف', `مستخدم: ${u.username}`);
    setUsers(nu); save({ users: nu, auditLog: al });
    setShowModal(false);
  };

  const handleAuditItemClick = (log) => {
    if (log.action.includes('مصروف')) setCurrentView('expenses');
    else if (log.action.includes('مهمة')) setCurrentView('tasks');
    else if (log.action.includes('حساب')) setCurrentView('accounts');
    else if (log.action.includes('مستخدم')) setCurrentView('users');
    else if (log.action.includes('مشروع')) setCurrentView('tasks');
    setShowAuditPanel(false);
  };

  const totalArchived = (archivedExpenses?.length || 0) + (archivedTasks?.length || 0) + (archivedAccounts?.length || 0);
  const highTasks = tasks.filter(t => t.priority === 'عالية');
  const kpis = { 
    totalExp: expenses.length, 
    pendingExp: expenses.filter(e => e.status !== 'مدفوع').length, 
    totalTasks: tasks.length, 
    highTasks: highTasks.length, 
    totalAcc: accounts.length, 
    totalUsers: users.length,
    totalProjects: projects.length 
  };

  const fontSizes = ['text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl'];
  const currentFontSize = fontSizes[Math.min(fontScale, fontSizes.length - 1)];
  
  const bg = darkMode ? darkBackgrounds[bgIndex] : backgrounds[bgIndex];
  const card = darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200';
  const inp = darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900';
  const txt = darkMode ? 'text-white' : 'text-gray-900';
  const sub = darkMode ? 'text-gray-300' : 'text-gray-600';

  const Btn = ({ onClick, icon: Icon, color, title }) => <button onClick={onClick} className={`p-2 ${color} text-white rounded-lg hover:opacity-80`} title={title}><Icon className="w-4 h-4" /></button>;
  const Footer = () => (
    <div className={`text-center py-3 ${sub} text-xs`}>
      ركائز الأولى للتعمير | 
      <button onClick={() => setShowVersionModal(true)} className="hover:underline mx-1">
        v{APP_VERSION}
      </button>
    </div>
  );

  if (loading) return <div className={`min-h-screen ${bg} flex items-center justify-center`} dir="rtl"><Loader className="w-16 h-16 text-blue-500 animate-spin" /></div>;

  if (!isLoggedIn) return (
    <div className={`min-h-screen ${bg} flex items-center justify-center p-4`} dir="rtl">
      <div className={`${card} p-8 rounded-2xl shadow-2xl w-full max-w-md border`}>
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
        <Footer />
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${bg} ${currentFontSize}`} dir="rtl">
      <div className={`${card} border-b px-4 py-3 flex flex-wrap items-center justify-between sticky top-0 z-50 gap-3`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">RKZ</div>
          <div>
            <h1 className={`text-lg font-bold ${txt}`}>نظام الإدارة المالية</h1>
            <p className={`text-xs ${sub}`}>ركائز الأولى للتعمير</p>
            <p className={`text-xs ${sub}`}>{currentTime.toLocaleDateString('ar-SA')} {currentTime.toLocaleTimeString('ar-SA')}</p>
            <p className={`text-xs ${sub}`}>{quote}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${txt}`}>{currentUser.username}</span>
          <button onClick={() => { setShowAuditPanel(!showAuditPanel); setNewNotifications(0); }} className={`p-2 rounded-lg relative ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <Clock className={`w-5 h-5 ${txt}`} />
            {newNotifications > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{newNotifications}</span>}
          </button>
          <button onClick={() => setShowArchivePanel(!showArchivePanel)} className={`p-2 rounded-lg relative ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <Archive className={`w-5 h-5 ${txt}`} />
            {totalArchived > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">{totalArchived}</span>}
          </button>
          <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => setBgIndex((bgIndex + 1) % backgrounds.length)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`} title="تغيير الخلفية">
            <Image className={`w-5 h-5 ${txt}`} />
          </button>
          <div className="flex border rounded-lg overflow-hidden">
            <button onClick={() => setFontScale(Math.max(0, fontScale - 1))} className={`px-2 py-1 text-xs ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-black hover:bg-gray-200'}`}>A-</button>
            <button onClick={() => setFontScale(Math.min(fontSizes.length - 1, fontScale + 1))} className={`px-2 py-1 text-xs ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-black hover:bg-gray-200'}`}>A+</button>
          </div>
          <button onClick={logout} className="p-2 bg-red-600 text-white rounded-lg"><Power className="w-5 h-5" /></button>
        </div>
      </div>

      {showAuditPanel && (
        <div ref={auditRef} className={`absolute left-4 top-16 w-80 ${card} rounded-xl shadow-2xl border z-50 max-h-96 overflow-y-auto`}>
          <div className={`p-3 border-b flex justify-between ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`font-bold ${txt}`}>آخر العمليات</h3>
            <button onClick={() => setShowAuditPanel(false)} className={sub}>✕</button>
          </div>
          <div className="p-2">
            {auditLog.slice(0, 10).map(l => (
              <div key={l.id} onClick={() => handleAuditItemClick(l)} className={`p-2 rounded-lg mb-1 cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                <div className="flex justify-between text-xs"><span className={txt}>{l.user}</span><span className={sub}>{new Date(l.timestamp).toLocaleTimeString('ar-SA')}</span></div>
                <p className={`text-xs ${sub}`}>{l.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {showArchivePanel && (
        <div ref={archiveRef} className={`absolute left-4 top-16 w-96 ${card} rounded-xl shadow-2xl border z-50 max-h-96 overflow-y-auto`}>
          <div className={`p-3 border-b flex justify-between ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`font-bold ${txt}`}>الأرشيف</h3>
            <button onClick={() => setShowArchivePanel(false)} className={sub}>✕</button>
          </div>
          <div className="p-2">
            {totalArchived === 0 ? (
              <p className={`text-center py-8 ${sub}`}>لا توجد عناصر مؤرشفة</p>
            ) : (
              <>
                {archivedExpenses?.length > 0 && (
                  <div className="mb-4">
                    <h4 className={`font-bold mb-2 text-sm ${txt}`}>المصروفات ({archivedExpenses.length})</h4>
                    {archivedExpenses.slice(0, 3).map(e => (
                      <div key={e.id} onClick={() => { restoreExpense(e); }} className={`p-2 rounded-lg mb-1 cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className={`text-sm font-bold ${txt}`}>{e.name}</p>
                            <p className={`text-xs ${sub}`}>{e.amount} ر.س</p>
                          </div>
                          <RotateCcw className="w-4 h-4 text-green-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {archivedTasks?.length > 0 && (
                  <div className="mb-4">
                    <h4 className={`font-bold mb-2 text-sm ${txt}`}>المهام ({archivedTasks.length})</h4>
                    {archivedTasks.slice(0, 3).map(t => (
                      <div key={t.id} onClick={() => { restoreTask(t); }} className={`p-2 rounded-lg mb-1 cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className={`text-sm font-bold ${txt}`}>{t.title}</p>
                            <p className={`text-xs ${sub}`}>{t.description}</p>
                          </div>
                          <RotateCcw className="w-4 h-4 text-green-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {archivedAccounts?.length > 0 && (
                  <div>
                    <h4 className={`font-bold mb-2 text-sm ${txt}`}>الحسابات ({archivedAccounts.length})</h4>
                    {archivedAccounts.slice(0, 3).map(a => (
                      <div key={a.id} onClick={() => { restoreAccount(a); }} className={`p-2 rounded-lg mb-1 cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className={`text-sm font-bold ${txt}`}>{a.name}</p>
                            <p className={`text-xs ${sub}`}>{a.description}</p>
                          </div>
                          <RotateCcw className="w-4 h-4 text-green-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {showVersionModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className={`${card} p-6 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-xl font-bold ${txt}`}>سجل الإصدارات</h3>
              <button onClick={() => setShowVersionModal(false)} className={`${sub} hover:${txt}`}>✕</button>
            </div>
            <div className="space-y-4">
              {versionHistory.map((v, i) => (
                <div key={v.version} className={`p-4 rounded-xl border ${i === 0 ? 'border-blue-500 bg-blue-50/50' : darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className={`font-bold ${txt}`}>إصدار {v.version}</h4>
                    {i === 0 && <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">الحالي</span>}
                  </div>
                  <p className={`text-sm ${sub} mb-3`}>تاريخ التثبيت: {v.date}</p>
                  <div className="space-y-1">
                    <p className={`text-sm font-bold ${txt}`}>التغييرات:</p>
                    <ul className={`text-sm ${sub} space-y-1`}>
                      {v.changes.map((c, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-blue-500">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row">
        <div className={`w-full md:w-56 ${card} border-b md:border-l p-3`}>
          <nav className="flex md:flex-col gap-1">
            {[
              { id: 'dashboard', icon: Activity, label: 'الرئيسية' },
              { id: 'expenses', icon: Calendar, label: 'المصروفات' },
              { id: 'tasks', icon: CheckSquare, label: 'المهام' },
              { id: 'accounts', icon: Users, label: 'الحسابات' },
              { id: 'users', icon: UserCog, label: 'المستخدمين' },
              { id: 'audit', icon: History, label: 'السجل' }
            ].map(item => (
              <button key={item.id} onClick={() => setCurrentView(item.id)} className={`flex items-center gap-2 p-3 rounded-xl ${currentView === item.id ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                <item.icon className="w-5 h-5" /><span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 p-4 md:p-6">
          {currentView === 'dashboard' && (
            <div>
              <h2 className={`text-2xl font-bold mb-6 ${txt}`}>لوحة التحكم</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'المصروفات', value: kpis.totalExp, sub: `${kpis.pendingExp} قيد الانتظار`, color: 'from-blue-500 to-blue-600', view: 'expenses' },
                  { label: 'المهام', value: kpis.totalTasks, sub: `${kpis.highTasks} عالية`, color: 'from-green-500 to-green-600', view: 'tasks' },
                  { label: 'الحسابات', value: kpis.totalAcc, sub: 'حساب', color: 'from-purple-500 to-purple-600', view: 'accounts' },
                  { label: 'المستخدمين', value: kpis.totalUsers, sub: 'مستخدم', color: 'from-orange-500 to-orange-600', view: 'users' }
                ].map((k, i) => (
                  <button key={i} onClick={() => setCurrentView(k.view)} className={`bg-gradient-to-br ${k.color} p-4 rounded-xl text-white text-right hover:opacity-90`}>
                    <p className="text-sm opacity-90">{k.label}</p>
                    <p className="text-3xl font-bold">{k.value}</p>
                    <p className="text-xs opacity-75">{k.sub}</p>
                    <ChevronLeft className="w-5 h-5 mt-2 opacity-75" />
                  </button>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className={`${card} p-4 rounded-xl border`}>
                  <div className="flex justify-between mb-4"><h3 className={`font-bold ${txt}`}>المصروفات القادمة</h3><button onClick={() => setCurrentView('expenses')} className="text-blue-500 text-sm">الكل</button></div>
                  {expenses.length === 0 ? <p className={`text-center py-8 ${sub}`}>لا توجد مصروفات</p> : expenses.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 3).map(e => {
                    const d = calcDays(e.dueDate);
                    return <div key={e.id} className={`p-3 rounded-lg mb-2 ${getColor(d)}`}><div className="flex justify-between"><span>{e.name}</span><span className="font-bold">{e.amount} ر.س</span></div><div className="text-xs mt-1">{d < 0 ? `متأخر ${Math.abs(d)} يوم` : `${d} يوم`}</div></div>;
                  })}
                </div>
                <div className={`${card} p-4 rounded-xl border`}>
                  <div className="flex justify-between mb-4"><h3 className={`font-bold ${txt}`}>مهام عالية الأهمية</h3><button onClick={() => setCurrentView('tasks')} className="text-blue-500 text-sm">الكل</button></div>
                  {highTasks.length === 0 ? <p className={`text-center py-8 ${sub}`}>لا توجد</p> : highTasks.slice(0, 3).map(t => (
                    <div key={t.id} className={`p-3 rounded-lg mb-2 ${darkMode ? 'bg-red-900/50' : 'bg-red-50'} border border-red-200`}>
                      <div className="flex justify-between"><span className={txt}>{t.title}</span><span className="bg-red-500 text-white text-xs px-2 rounded">عالية</span></div>
                      <p className={`text-xs ${sub}`}>{t.project || 'بدون مشروع'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentView === 'expenses' && (
            <div>
              <div className="flex justify-between mb-6">
                <h2 className={`text-2xl font-bold ${txt}`}>المصروفات</h2>
                <button onClick={() => { setModalType('addExp'); setShowModal(true); }} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl"><Plus className="w-5 h-5" />إضافة</button>
              </div>
              {expenses.length === 0 ? <div className={`${card} p-12 rounded-xl border text-center`}><Calendar className={`w-16 h-16 mx-auto mb-4 ${sub}`} /><p className={sub}>لا توجد مصروفات</p></div> : (
                <div className="space-y-3">
                  {expenses.map(e => {
                    const d = calcDays(e.dueDate);
                    return (
                      <div key={e.id} className={`${card} p-4 rounded-xl border`}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs px-2 py-0.5 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{e.id}</span>
                              <h3 className={`font-bold ${txt}`}>{e.name}</h3>
                              <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800">{e.type}</span>
                              {e.status === 'مدفوع' && <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-800">مدفوع</span>}
                            </div>
                            <p className="text-2xl font-bold text-black">{e.amount} ر.س</p>
                            <p className={`text-sm ${sub}`}>{e.reason}</p>
                            <div className={`flex gap-3 text-xs ${sub} mt-2`}>
                              <span>{e.dueDate}</span>
                              <span className={d < 0 ? 'text-red-500 font-bold' : 'text-green-500 font-bold'}>{d < 0 ? `متأخر ${Math.abs(d)} يوم` : `${d} يوم`}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {e.status !== 'مدفوع' && <Btn onClick={() => markPaid(e.id)} icon={CheckSquare} color="bg-green-600" title="دفع" />}
                            <Btn onClick={() => { setEditingItem({ ...e }); setModalType('editExp'); setShowModal(true); }} icon={Pencil} color="bg-blue-600" title="تعديل" />
                            <Btn onClick={() => { setSelectedItem(e); setModalType('delExp'); setShowModal(true); }} icon={Trash2} color="bg-red-600" title="حذف" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {currentView === 'tasks' && (
            <div>
              <div className="flex justify-between mb-6">
                <h2 className={`text-2xl font-bold ${txt}`}>المهام والمشاريع</h2>
                <div className="flex gap-2">
                  <button onClick={() => { setModalType('addProject'); setShowModal(true); }} className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl"><FolderPlus className="w-5 h-5" />إضافة مشروع</button>
                  <button onClick={() => { setModalType('addTask'); setShowModal(true); }} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl"><Plus className="w-5 h-5" />إضافة مهمة</button>
                </div>
              </div>

              {projects.length > 0 && (
                <div className="mb-6">
                  <h3 className={`font-bold mb-3 ${txt}`}>المشاريع ({projects.length})</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {projects.map(p => (
                      <div key={p.id} className={`${card} p-4 rounded-xl border`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className={`font-bold ${txt} mb-1`}>{p.name}</h4>
                            <p className={`text-sm ${sub}`}>{p.description}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${p.status === 'نشط' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{p.status}</span>
                        </div>
                        <div className={`text-xs ${sub} space-y-1`}>
                          {p.client && <p>العميل: {p.client}</p>}
                          {p.location && <p>الموقع: {p.location}</p>}
                          {p.startDate && <p>البداية: {p.startDate}</p>}
                          {p.endDate && <p>النهاية: {p.endDate}</p>}
                          {p.documents && p.documents.length > 0 && (
                            <p className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {p.documents.length} مستند
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Btn onClick={() => { setEditingItem({ ...p }); setModalType('editProject'); setShowModal(true); }} icon={Pencil} color="bg-blue-600" title="تعديل" />
                          <Btn onClick={() => { setSelectedItem(p); setModalType('delProject'); setShowModal(true); }} icon={Trash2} color="bg-red-600" title="حذف" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {highTasks.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {highTasks.slice(0, 4).map(t => (
                    <div key={t.id} className={`${card} p-3 rounded-xl border border-red-300`}>
                      <div className="flex items-center gap-2 mb-1"><AlertCircle className="w-4 h-4 text-red-500" /><span className="text-xs bg-red-100 text-red-800 px-2 rounded">عالية</span></div>
                      <h4 className={`font-bold text-sm ${txt} truncate`}>{t.title}</h4>
                      <p className={`text-xs ${sub}`}>{t.project || 'بدون مشروع'}</p>
                    </div>
                  ))}
                </div>
              )}
              
              <h3 className={`font-bold mb-3 ${txt}`}>جميع المهام ({tasks.length})</h3>
              {tasks.length === 0 ? <div className={`${card} p-12 rounded-xl border text-center`}><CheckSquare className={`w-16 h-16 mx-auto mb-4 ${sub}`} /><p className={sub}>لا توجد مهام</p></div> : (
                <div className="space-y-3">
                  {tasks.map(t => {
                    const d = calcDays(t.dueDate);
                    const projectInfo = projects.find(p => p.id === t.projectId);
                    return (
                      <div key={t.id} className={`${card} p-4 rounded-xl border`}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs px-2 py-0.5 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{t.id}</span>
                              <h3 className={`font-bold ${txt}`}>{t.title}</h3>
                              <span className={`text-xs px-2 py-0.5 rounded ${t.priority === 'عالية' ? 'bg-red-100 text-red-800' : t.priority === 'متوسطة' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{t.priority}</span>
                            </div>
                            <p className={`text-sm ${sub}`}>{t.description}</p>
                            {projectInfo && <p className="text-sm font-medium text-black mt-1">المشروع: {projectInfo.name}</p>}
                            <div className={`flex gap-3 text-xs ${sub} mt-2`}>
                              <span>المسؤول: {t.assignedTo || '-'}</span>
                              <span>{t.dueDate}</span>
                              <span className={d < 0 ? 'text-red-500 font-bold' : 'text-green-500 font-bold'}>{d < 0 ? `متأخر ${Math.abs(d)} يوم` : `${d} يوم`}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Btn onClick={() => { setEditingItem({ ...t }); setModalType('editTask'); setShowModal(true); }} icon={Pencil} color="bg-blue-600" title="تعديل" />
                            <Btn onClick={() => { setSelectedItem(t); setModalType('delTask'); setShowModal(true); }} icon={Trash2} color="bg-red-600" title="حذف" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
