import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, 
  query, orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { db, storage, auth } from './config/firebase';
import { generateId, compressImage } from './utils/helpers';
import { getTheme, getStyles, THEME_LIST, SHARED } from './config/theme';

import Login from './components/Login';
import SignUp from './components/SignUp';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Expenses from './components/Expenses';
import Tasks from './components/Tasks';
import Projects from './components/Projects';
import Accounts from './components/Accounts';
import Users from './components/Users';
import Settings from './components/Settings';
import QuantityCalculator from './components/QuantityCalculator';
import { LogOut, Settings as SettingsIcon, Bell, Clock } from 'lucide-react';

const HEADER_COLORS = {
  default: null, blue: '#1e3a5f', purple: '#2d1b4e', green: '#1a3a2a',
  red: '#3d1a1a', orange: '#3d2a1a', teal: '#1a3d3d', pink: '#3d1a2d',
  gold: '#3d3a1a', navy: '#0a1628', dark: '#0a0a0a', charcoal: '#1a1a1a',
};

const BUTTON_COLORS = {
  default: null,
  blue: { color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
  purple: { color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' },
  green: { color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
  red: { color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
  orange: { color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #ea580c)' },
  teal: { color: '#14b8a6', gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)' },
  pink: { color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #db2777)' },
  indigo: { color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
  cyan: { color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
  amber: { color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
  rose: { color: '#f43f5e', gradient: 'linear-gradient(135deg, #f43f5e, #e11d48)' },
};

const FONTS = {
  tajawal: "'Tajawal', sans-serif", cairo: "'Cairo', sans-serif",
  almarai: "'Almarai', sans-serif", ibm: "'IBM Plex Sans Arabic', sans-serif",
  noto: "'Noto Sans Arabic', sans-serif", rubik: "'Rubik', sans-serif",
  changa: "'Changa', sans-serif", amiri: "'Amiri', serif",
};

const StarryBackground = () => {
  const stars = Array.from({ length: 35 }, (_, i) => ({
    id: i, left: Math.random() * 100, top: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5, delay: Math.random() * 5, duration: Math.random() * 3 + 3,
  }));
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {stars.map((star) => (
        <div key={star.id} style={{
          position: 'absolute', left: `${star.left}%`, top: `${star.top}%`,
          width: star.size, height: star.size, background: '#fff', borderRadius: '50%',
          opacity: 0.6, animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
        }} />
      ))}
      <div className="meteor" />
      <style>{`
        @keyframes twinkle { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.9; } }
        .meteor { position: absolute; top: 15%; right: -5%; width: 80px; height: 1px;
          background: linear-gradient(to left, #fff, transparent); transform: rotate(-35deg);
          opacity: 0; animation: shootingStar 12s ease-out infinite; animation-delay: 3s; }
        @keyframes shootingStar { 0% { opacity: 0; transform: rotate(-35deg) translateX(0); }
          2% { opacity: 0.8; } 8% { opacity: 0; transform: rotate(-35deg) translateX(-400px); }
          100% { opacity: 0; transform: rotate(-35deg) translateX(-400px); } }
      `}</style>
    </div>
  );
};

const VegasBackground = () => {
  const neonLights = Array.from({ length: 15 }, (_, i) => ({
    id: i, left: Math.random() * 90 + 5, top: Math.random() * 90 + 5,
    size: Math.random() * 3 + 1, delay: Math.random() * 4, duration: Math.random() * 2 + 1.5,
    color: ['#ff00ff', '#00ffff', '#ff0066', '#00ff66', '#6600ff', '#ff3300'][Math.floor(Math.random() * 6)],
  }));
  const symbols = [
    { symbol: '♠', left: 8, top: 15, size: 12, opacity: 0.04, delay: 0 },
    { symbol: '♦', left: 92, top: 25, size: 14, opacity: 0.03, delay: 1 },
    { symbol: '♣', left: 15, top: 75, size: 10, opacity: 0.04, delay: 2 },
    { symbol: '♥', left: 85, top: 80, size: 11, opacity: 0.03, delay: 1.5 },
    { symbol: '7', left: 50, top: 10, size: 20, opacity: 0.02, delay: 0.5 },
    { symbol: '★', left: 70, top: 40, size: 18, opacity: 0.03, delay: 2.5 },
  ];
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {symbols.map((item, i) => (
        <div key={`s-${i}`} style={{
          position: 'absolute', left: `${item.left}%`, top: `${item.top}%`,
          fontSize: item.size, color: '#fff', opacity: item.opacity, fontFamily: 'serif',
          animation: `mysteryPulse 8s ease-in-out ${item.delay}s infinite`,
        }}>{item.symbol}</div>
      ))}
      {neonLights.map((light) => (
        <div key={light.id} style={{
          position: 'absolute', left: `${light.left}%`, top: `${light.top}%`,
          width: light.size, height: light.size, background: light.color, borderRadius: '50%',
          boxShadow: `0 0 ${light.size * 4}px ${light.size}px ${light.color}40`,
          animation: `neonFloat ${light.duration}s ease-in-out ${light.delay}s infinite alternate`, opacity: 0.6,
        }} />
      ))}
      <style>{`
        @keyframes neonFloat { 0% { opacity: 0.3; transform: scale(0.9) translateY(0); }
          100% { opacity: 0.7; transform: scale(1.1) translateY(-5px); } }
        @keyframes mysteryPulse { 0%, 100% { opacity: 0.02; transform: scale(1); }
          50% { opacity: 0.06; transform: scale(1.1); } }
      `}</style>
    </div>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [expenses, setExpenses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const [themeMode, setThemeMode] = useState('dark');
  const [darkMode, setDarkMode] = useState(true);
  const [currentThemeId, setCurrentThemeId] = useState('tokyo-lights');
  const [fontSize, setFontSize] = useState(16);
  const [city, setCity] = useState('Riyadh');
  const [weather, setWeather] = useState(null);
  
  const [bgEffect, setBgEffect] = useState(() => localStorage.getItem('rkz_bgEffect') || 'none');
  const [headerColor, setHeaderColor] = useState(() => localStorage.getItem('rkz_headerColor') || 'default');
  const [buttonColor, setButtonColor] = useState(() => localStorage.getItem('rkz_buttonColor') || 'default');
  const [fontFamily, setFontFamily] = useState(() => localStorage.getItem('rkz_fontFamily') || 'tajawal');

  useEffect(() => {
    const checkSettings = () => {
      setBgEffect(localStorage.getItem('rkz_bgEffect') || 'none');
      setHeaderColor(localStorage.getItem('rkz_headerColor') || 'default');
      setButtonColor(localStorage.getItem('rkz_buttonColor') || 'default');
      setFontFamily(localStorage.getItem('rkz_fontFamily') || 'tajawal');
    };
    const interval = setInterval(checkSettings, 500);
    window.addEventListener('storage', checkSettings);
    return () => { clearInterval(interval); window.removeEventListener('storage', checkSettings); };
  }, []);

  const theme = getTheme(currentThemeId, darkMode);
  const t = theme;
  const appliedHeaderColor = HEADER_COLORS[headerColor] || t.bg.secondary;
  const appliedButtonColor = BUTTON_COLORS[buttonColor]?.color || t.button.primary;
  const appliedButtonGradient = BUTTON_COLORS[buttonColor]?.gradient || t.button.gradient;
  const appliedFont = FONTS[fontFamily] || "'Tajawal', sans-serif";
  
  const [activeSeconds, setActiveSeconds] = useState(0);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const activeSecondsRef = useRef(0);

  const motivationalQuotes = [
    "النجاح يبدأ بخطوة واحدة 🚀", "كل يوم هو فرصة جديدة للإنجاز ✨", "العمل الجاد يصنع المستحيل 💪",
    "معاً نبني المستقبل 🏗️", "الإتقان هو سر التميز ⭐", "خطوة بخطوة نحو القمة 📈",
    "الجودة هي عنواننا 🎯", "نحن نبني أحلامكم 🏠", "التميز ليس خياراً بل أسلوب حياة 🌟",
    "معاً لبناء مستقبل أفضل 🤝", "الطموح لا حدود له 🌈", "نصنع الفرق في كل مشروع 💎",
    "الإبداع هو وقودنا 🔥", "نحول الأفكار إلى واقع ✅", "التفاني في العمل سر نجاحنا 🏆",
    "نبني بثقة ونسلم بفخر 🎖️", "كل تفصيلة تهمنا 🔍", "الجودة قبل الكمية دائماً 💯",
  ];

  const greetingPhrases = [
    { text: "أهلاً وسهلاً", emoji: "👋" }, { text: "مرحباً بك", emoji: "🌟" },
    { text: "سعداء بوجودك", emoji: "😊" }, { text: "حياك الله", emoji: "💫" },
    { text: "نورت", emoji: "✨" }, { text: "أهلاً بالغالي", emoji: "💎" },
  ];

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [greetingIndex, setGreetingIndex] = useState(0);

  const cityCoordinates = {
    'Riyadh': { lat: 24.7136, lon: 46.6753, name: 'الرياض' },
    'Jeddah': { lat: 21.4858, lon: 39.1925, name: 'جدة' },
    'Mecca': { lat: 21.3891, lon: 39.8579, name: 'مكة' },
    'Medina': { lat: 24.5247, lon: 39.5692, name: 'المدينة' },
    'Dammam': { lat: 26.4207, lon: 50.0888, name: 'الدمام' },
    'Khobar': { lat: 26.2172, lon: 50.1971, name: 'الخبر' },
    'Tabuk': { lat: 28.3838, lon: 36.5550, name: 'تبوك' },
    'Abha': { lat: 18.2164, lon: 42.5053, name: 'أبها' },
  };

  const changeQuotes = () => {
    setQuoteIndex(prev => (prev + 1) % motivationalQuotes.length);
    setGreetingIndex(prev => (prev + 1) % greetingPhrases.length);
  };

  const handleViewChange = (view) => { setCurrentView(view); changeQuotes(); };

  useEffect(() => {
    const handleVisibilityChange = () => setIsPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    const savedTime = localStorage.getItem('activeSessionTime');
    if (savedTime) { const parsed = parseInt(savedTime); setActiveSeconds(parsed); activeSecondsRef.current = parsed; }
  }, []);

  useEffect(() => {
    let interval;
    if (isPageVisible && isLoggedIn) {
      interval = setInterval(() => {
        activeSecondsRef.current += 1;
        setActiveSeconds(activeSecondsRef.current);
        if (activeSecondsRef.current % 10 === 0) localStorage.setItem('activeSessionTime', activeSecondsRef.current.toString());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPageVisible, isLoggedIn]);

  const formatActiveTime = () => {
    const mins = Math.floor(activeSeconds / 60);
    const secs = activeSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => { const timer = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(timer); }, []);
  useEffect(() => { const quoteTimer = setInterval(changeQuotes, 30000); return () => clearInterval(quoteTimer); }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const coords = cityCoordinates[city] || cityCoordinates['Riyadh'];
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weather_code&timezone=auto`);
        if (response.ok) {
          const data = await response.json();
          let icon = '☀️';
          if (data.current.weather_code <= 3) icon = '⛅';
          else if (data.current.weather_code <= 49) icon = '🌫️';
          else if (data.current.weather_code <= 69) icon = '🌧️';
          setWeather({ temp: Math.round(data.current.temperature_2m), icon });
        }
      } catch (error) { setWeather({ temp: 25, icon: '☀️' }); }
    };
    fetchWeather();
    const weatherTimer = setInterval(fetchWeather, 600000);
    return () => clearInterval(weatherTimer);
  }, [city]);

  const formatDate = () => {
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return { dayName: days[currentTime.getDay()], day: currentTime.getDate(), month: currentTime.getMonth() + 1, year: currentTime.getFullYear() };
  };

  const translateRole = (role) => {
    const roles = { 'owner': 'المالك', 'admin': 'مدير', 'user': 'مستخدم', 'viewer': 'مشاهد' };
    return roles[role?.toLowerCase()] || role || 'مستخدم';
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) { setCurrentUser(JSON.parse(savedUser)); setIsLoggedIn(true); }
      } else { setIsLoggedIn(false); setCurrentUser(null); }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setThemeMode(localStorage.getItem('themeMode') || 'dark');
    setCurrentThemeId(localStorage.getItem('currentThemeId') || 'tokyo-lights');
    setFontSize(parseInt(localStorage.getItem('fontSize')) || 16);
    setCity(localStorage.getItem('city') || 'Riyadh');
  }, []);

  useEffect(() => { localStorage.setItem('themeMode', themeMode); }, [themeMode]);
  useEffect(() => { localStorage.setItem('currentThemeId', currentThemeId); }, [currentThemeId]);
  useEffect(() => { localStorage.setItem('fontSize', fontSize); }, [fontSize]);
  useEffect(() => { localStorage.setItem('city', city); }, [city]);

  useEffect(() => {
    if (themeMode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setDarkMode(mediaQuery.matches);
      const handleChange = () => setDarkMode(mediaQuery.matches);
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else { setDarkMode(themeMode === 'dark'); }
  }, [themeMode]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const unsubExpenses = onSnapshot(query(collection(db, 'expenses'), orderBy('createdAt', 'desc')), (s) => setExpenses(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubTasks = onSnapshot(query(collection(db, 'tasks'), orderBy('createdAt', 'desc')), (s) => setTasks(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubProjects = onSnapshot(query(collection(db, 'projects'), orderBy('createdAt', 'desc')), (s) => setProjects(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubAccounts = onSnapshot(query(collection(db, 'accounts'), orderBy('createdAt', 'desc')), (s) => setAccounts(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => { unsubExpenses(); unsubTasks(); unsubProjects(); unsubAccounts(); };
  }, [isLoggedIn]);

  const handleLogin = async (userData) => {
    setCurrentUser(userData); setIsLoggedIn(true);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setActiveSeconds(0); activeSecondsRef.current = 0;
    localStorage.setItem('activeSessionTime', '0');
  };
  
  const handleSignupSuccess = (userData) => { setShowSignup(false); handleLogin(userData); };
  
  const handleLogout = async () => {
    try {
      await signOut(auth); setIsLoggedIn(false); setCurrentUser(null);
      localStorage.removeItem('currentUser'); localStorage.removeItem('activeSessionTime');
      setActiveSeconds(0); activeSecondsRef.current = 0;
    } catch (e) { console.error(e); }
  };

  const handleAddExpense = async (e) => { await addDoc(collection(db, 'expenses'), { ...e, createdAt: new Date() }); };
  const handleEditExpense = async (e) => { const { id, ...d } = e; await updateDoc(doc(db, 'expenses', id), d); };
  const handleDeleteExpense = async (id) => { await deleteDoc(doc(db, 'expenses', id)); };
  const handleMarkPaid = async (id) => { await updateDoc(doc(db, 'expenses', id), { status: 'مدفوع' }); };
  const handleRefreshExpenses = () => {};

  const handleAddTask = async (t) => { await addDoc(collection(db, 'tasks'), { ...t, createdAt: new Date() }); };
  const handleEditTask = async (t) => { const { id, ...d } = t; await updateDoc(doc(db, 'tasks', id), d); };
  const handleDeleteTask = async (id) => { await deleteDoc(doc(db, 'tasks', id)); };
  const handleToggleTaskStatus = async (id) => {
    const task = tasks.find(t => t.id === id);
    await updateDoc(doc(db, 'tasks', id), { status: task.status === 'مكتمل' ? 'قيد التنفيذ' : 'مكتمل' });
  };

  const handleAddProject = async (p) => { await addDoc(collection(db, 'projects'), { ...p, folders: [], createdAt: new Date() }); };
  const handleEditProject = async (p) => { const { id, ...d } = p; await updateDoc(doc(db, 'projects', id), d); };
  const handleDeleteProject = async (id) => { await deleteDoc(doc(db, 'projects', id)); };
  const handleAddFolder = async (pId, name) => {
    const p = projects.find(x => x.id === pId);
    await updateDoc(doc(db, 'projects', pId), { folders: [...(p.folders || []), { id: generateId(), name, files: [] }] });
  };
  const handleUploadFile = async (pId, fId, file) => {
    const p = projects.find(x => x.id === pId);
    const compressed = file.type.startsWith('image/') ? await compressImage(file) : file;
    const fileRef = ref(storage, `projects/${pId}/${fId}/${file.name}`);
    await uploadBytes(fileRef, compressed);
    const url = await getDownloadURL(fileRef);
    const updated = p.folders.map(f => f.id === fId ? { ...f, files: [...f.files, { id: generateId(), name: file.name, url, type: file.type }] } : f);
    await updateDoc(doc(db, 'projects', pId), { folders: updated });
  };
  const handleDeleteFile = async (pId, fId, fileId) => {
    const p = projects.find(x => x.id === pId);
    const folder = p.folders.find(f => f.id === fId);
    const file = folder.files.find(f => f.id === fileId);
    await deleteObject(ref(storage, `projects/${pId}/${fId}/${file.name}`));
    const updated = p.folders.map(f => f.id === fId ? { ...f, files: f.files.filter(x => x.id !== fileId) } : f);
    await updateDoc(doc(db, 'projects', pId), { folders: updated });
  };

  const handleAddAccount = async (a) => { await addDoc(collection(db, 'accounts'), { ...a, createdAt: new Date() }); };
  const handleEditAccount = async (a) => { const { id, ...d } = a; await updateDoc(doc(db, 'accounts', id), d); };
  const handleDeleteAccount = async (id) => { await deleteDoc(doc(db, 'accounts', id)); };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.bg.primary }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: `3px solid ${t.border.primary}`, borderTopColor: appliedButtonColor, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: t.text.primary, fontFamily: appliedFont }}>جاري التحميل...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isLoggedIn) {
    if (showSignup) return <SignUp onBack={() => setShowSignup(false)} onSuccess={handleSignupSuccess} darkMode={darkMode} theme={theme} />;
    return <Login onLogin={handleLogin} onShowSignup={() => setShowSignup(true)} darkMode={darkMode} theme={theme} />;
  }

  const dateInfo = formatDate();
  const cityName = cityCoordinates[city]?.name || 'الرياض';
  const currentGreeting = greetingPhrases[greetingIndex];
  const customTheme = { ...theme, button: { ...theme.button, primary: appliedButtonColor, gradient: appliedButtonGradient } };

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: t.bg.primary, color: t.text.primary, fontFamily: appliedFont, fontSize: `${fontSize}px`, position: 'relative' }}>
      <link href={SHARED.font.url} rel="stylesheet" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;600;700&family=Cairo:wght@400;500;600;700&family=Almarai:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" />
      
      {bgEffect === 'stars' && darkMode && <StarryBackground />}
      {bgEffect === 'vegas' && darkMode && <VegasBackground />}
      
      <style>{`
        * { font-feature-settings: "tnum"; font-variant-numeric: tabular-nums; }
        input, select, textarea { font-family: ${appliedFont}; }
        input[type="number"] { direction: ltr; text-align: right; -moz-appearance: textfield; }
        input[type="number"]::-webkit-outer-spin-button, input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: ${darkMode ? '#0a0a0a' : '#f1f1f1'}; border-radius: 4px; }
        ::-webkit-scrollbar-thumb { background: ${darkMode ? '#1a1a1a' : '#c1c1c1'}; border-radius: 4px; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <header style={{ background: `${appliedHeaderColor}ee`, backdropFilter: 'blur(10px)', borderBottom: `1px solid ${t.border.primary}`, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '10px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 46, height: 46, background: 'linear-gradient(135deg, #d4c5a9 0%, #9ca3af 100%)', borderRadius: t.radius.lg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #b8a88a' }}>
                <span style={{ fontSize: 17, fontWeight: 800, color: '#3d3d3d' }}>RKZ</span>
              </div>
              <div>
                <h1 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: t.text.primary }}>ركائز الأولى للتعمير</h1>
                <p style={{ fontSize: 11, color: t.text.muted, margin: '2px 0 0 0', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span>📅 {dateInfo.dayName} {dateInfo.day}/{dateInfo.month}/{dateInfo.year}</span>
                  <span style={{ opacity: 0.4 }}>|</span>
                  <span>🕐 {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                  <span style={{ opacity: 0.4 }}>|</span>
                  <span>{weather?.icon || '☀️'} {weather?.temp || '--'}° {cityName}</span>
                </p>
                <p style={{ fontSize: 11, color: t.text.muted, margin: '2px 0 0 0', fontWeight: 700 }}>{motivationalQuotes[quoteIndex]}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 11, color: t.text.muted, fontWeight: 700 }}>{currentGreeting.text}</span>
                <span style={{ fontSize: 15 }}>{currentGreeting.emoji}</span>
              </div>
              
              <button onClick={() => handleViewChange('users')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: t.bg.tertiary, padding: '0 12px', height: 36, borderRadius: t.radius.lg, border: `1px solid ${t.border.primary}`, cursor: 'pointer', fontFamily: appliedFont }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: t.text.primary }}>
                  {currentUser?.username || 'مستخدم'}: <span style={{ color: t.text.muted, fontWeight: 500 }}>{translateRole(currentUser?.role)}</span>
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: appliedButtonColor, borderRight: `1px solid ${t.border.primary}`, paddingRight: 8, marginRight: 4 }}>
                  <Clock size={12} />
                  <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{formatActiveTime()}</span>
                </div>
              </button>

              <button style={{ width: 36, height: 36, borderRadius: t.radius.lg, border: 'none', background: t.bg.tertiary, color: t.text.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <Bell size={18} />
                <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: t.status.danger.text, borderRadius: '50%' }} />
              </button>

              <button onClick={() => handleViewChange('settings')} style={{ width: 36, height: 36, borderRadius: t.radius.lg, border: 'none', background: currentView === 'settings' ? appliedButtonGradient : t.bg.tertiary, color: currentView === 'settings' ? '#fff' : t.text.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SettingsIcon size={18} />
              </button>

              <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0 12px', height: 36, borderRadius: t.radius.lg, border: 'none', background: `${t.status.danger.text}15`, color: t.status.danger.text, cursor: 'pointer', fontSize: 12, fontFamily: appliedFont }}>
                <LogOut size={15} />
                <span>خروج</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <Navigation currentView={currentView} setCurrentView={handleViewChange} darkMode={darkMode} theme={customTheme} />

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        {currentView === 'dashboard' && <Dashboard expenses={expenses} tasks={tasks} projects={projects} accounts={accounts} darkMode={darkMode} theme={customTheme} />}
        {currentView === 'expenses' && <Expenses expenses={expenses} accounts={accounts} onAdd={handleAddExpense} onEdit={handleEditExpense} onDelete={handleDeleteExpense} onMarkPaid={handleMarkPaid} onRefresh={handleRefreshExpenses} darkMode={darkMode} theme={customTheme} />}
        {currentView === 'tasks' && <Tasks tasks={tasks} projects={projects} onAdd={handleAddTask} onEdit={handleEditTask} onDelete={handleDeleteTask} onToggleStatus={handleToggleTaskStatus} darkMode={darkMode} theme={customTheme} />}
        {currentView === 'projects' && <Projects projects={projects} onAdd={handleAddProject} onEdit={handleEditProject} onDelete={handleDeleteProject} onAddFolder={handleAddFolder} onUploadFile={handleUploadFile} onDeleteFile={handleDeleteFile} darkMode={darkMode} theme={customTheme} />}
        {currentView === 'accounts' && <Accounts accounts={accounts} onAdd={handleAddAccount} onEdit={handleEditAccount} onDelete={handleDeleteAccount} darkMode={darkMode} theme={customTheme} />}
        {currentView === 'users' && <Users currentUser={currentUser} darkMode={darkMode} theme={customTheme} />}
        {currentView === 'settings' && <Settings darkMode={darkMode} themeMode={themeMode} setThemeMode={setThemeMode} currentThemeId={currentThemeId} setCurrentThemeId={setCurrentThemeId} fontSize={fontSize} setFontSize={setFontSize} city={city} setCity={setCity} theme={customTheme} themeList={THEME_LIST} />}
        {currentView === 'calculator' && <QuantityCalculator darkMode={darkMode} theme={customTheme} />}
      </main>

      <footer style={{ textAlign: 'center', padding: 16, color: t.text.muted, fontSize: 10, position: 'relative', zIndex: 1 }}>
        <p style={{ margin: 0 }}>نظام ركائز الأولى للتعمير v7.0 © 2024</p>
      </footer>
    </div>
  );
}

export default App;
