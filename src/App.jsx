import React, { useState, useEffect } from 'react';
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, 
  query, orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { db, storage, auth } from './config/firebase';
import { generateId, compressImage } from './utils/helpers';

// ✅ استيراد نظام القوالب الجديد
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
import { LogOut, Sun, Moon, Monitor } from 'lucide-react';

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
  const [categories, setCategories] = useState([]);

  // ✅ إعدادات القالب الجديدة
  const [themeMode, setThemeMode] = useState('dark');
  const [darkMode, setDarkMode] = useState(true);
  const [currentThemeId, setCurrentThemeId] = useState('tokyo-lights'); // القالب الافتراضي
  const [fontSize, setFontSize] = useState(16);

  const [sessionStart, setSessionStart] = useState(null);

  // ✅ الحصول على القالب والستايلات
  const theme = getTheme(currentThemeId, darkMode);
  const styles = getStyles(currentThemeId, darkMode);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
          setIsLoggedIn(true);
          const savedSessionStart = localStorage.getItem('sessionStart');
          setSessionStart(savedSessionStart ? parseInt(savedSessionStart) : Date.now());
        }
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ تحميل الإعدادات المحفوظة
  useEffect(() => {
    const savedThemeMode = localStorage.getItem('themeMode') || 'dark';
    const savedThemeId = localStorage.getItem('currentThemeId') || 'tokyo-lights';
    const savedFontSize = parseInt(localStorage.getItem('fontSize')) || 16;

    setThemeMode(savedThemeMode);
    setCurrentThemeId(savedThemeId);
    setFontSize(savedFontSize);
  }, []);

  // ✅ حفظ الإعدادات
  useEffect(() => { localStorage.setItem('themeMode', themeMode); }, [themeMode]);
  useEffect(() => { localStorage.setItem('currentThemeId', currentThemeId); }, [currentThemeId]);
  useEffect(() => { localStorage.setItem('fontSize', fontSize); }, [fontSize]);

  // ✅ وضع السمة (ليلي/نهاري/تلقائي)
  useEffect(() => {
    const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (themeMode === 'auto') {
      setDarkMode(getSystemTheme());
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => setDarkMode(mediaQuery.matches);
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      setDarkMode(themeMode === 'dark');
    }
  }, [themeMode]);

  // Firebase listeners
  useEffect(() => {
    if (!isLoggedIn) return;

    const unsubscribes = [
      onSnapshot(
        query(collection(db, 'expenses'), orderBy('createdAt', 'desc')),
        snapshot => setExpenses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
        error => console.error('Expenses error:', error)
      ),
      onSnapshot(
        query(collection(db, 'tasks'), orderBy('createdAt', 'desc')),
        snapshot => setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
        error => console.error('Tasks error:', error)
      ),
      onSnapshot(
        query(collection(db, 'projects'), orderBy('createdAt', 'desc')),
        snapshot => setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
        error => console.error('Projects error:', error)
      ),
      onSnapshot(
        query(collection(db, 'accounts'), orderBy('createdAt', 'desc')),
        snapshot => setAccounts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
        error => console.error('Accounts error:', error)
      ),
      onSnapshot(
        collection(db, 'categories'),
        snapshot => setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
        error => console.error('Categories error:', error)
      )
    ];

    return () => unsubscribes.forEach(unsub => unsub());
  }, [isLoggedIn]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (user) => {
    const loginTime = Date.now();
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('sessionStart', loginTime.toString());
    setCurrentUser(user);
    setSessionStart(loginTime);
    setIsLoggedIn(true);
  };

  const handleSignupSuccess = () => {
    setShowSignup(false);
    alert('تم إنشاء حسابك بنجاح! سيتم مراجعة طلبك من قبل المدير.');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setCurrentUser(null);
      setSessionStart(null);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('sessionStart');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Expense handlers
  const handleAddExpense = async (expense) => {
    try {
      await addDoc(collection(db, 'expenses'), {
        ...expense,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.username
      });
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleEditExpense = async (expense) => {
    try {
      await updateDoc(doc(db, 'expenses', expense.id), expense);
    } catch (error) {
      console.error('Error editing expense:', error);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await deleteDoc(doc(db, 'expenses', expenseId));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleMarkPaid = async (expenseId) => {
    try {
      await updateDoc(doc(db, 'expenses', expenseId), {
        status: 'مدفوع',
        paidAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error marking paid:', error);
    }
  };

  const handleRefreshExpenses = () => console.log('Refreshing...');

  // Task handlers
  const handleAddTask = async (task) => {
    try {
      await addDoc(collection(db, 'tasks'), {
        ...task,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.username
      });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleEditTask = async (task) => {
    try {
      await updateDoc(doc(db, 'tasks', task.id), task);
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleTaskStatus = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      await updateDoc(doc(db, 'tasks', taskId), { 
        status: task.status === 'مكتمل' ? 'قيد الانتظار' : 'مكتمل' 
      });
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  // Project handlers
  const handleAddProject = async (project) => {
    try {
      await addDoc(collection(db, 'projects'), {
        ...project,
        folders: [],
        createdAt: new Date().toISOString(),
        createdBy: currentUser.username
      });
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const handleEditProject = async (project) => {
    try {
      await updateDoc(doc(db, 'projects', project.id), project);
    } catch (error) {
      console.error('Error editing project:', error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteDoc(doc(db, 'projects', projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleAddFolder = async (projectId, folderName) => {
    try {
      const project = projects.find(p => p.id === projectId);
      const newFolder = {
        id: generateId(),
        name: folderName,
        files: [],
        createdAt: new Date().toISOString()
      };
      await updateDoc(doc(db, 'projects', projectId), {
        folders: [...(project.folders || []), newFolder]
      });
    } catch (error) {
      console.error('Error adding folder:', error);
    }
  };

  const handleUploadFile = async (projectId, folderId, file) => {
    try {
      const project = projects.find(p => p.id === projectId);
      
      let fileToUpload = file;
      if (file.type.startsWith('image/')) {
        const compressed = await compressImage(file);
        fileToUpload = new File([compressed], file.name, { type: file.type });
      }
      
      const storageRef = ref(storage, `projects/${projectId}/${folderId}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, fileToUpload);
      const url = await getDownloadURL(snapshot.ref);
      
      const newFile = {
        id: generateId(),
        name: file.name,
        type: file.type,
        url,
        storagePath: snapshot.ref.fullPath,
        uploadedAt: new Date().toISOString(),
        uploadedBy: currentUser.username
      };
      
      const updatedFolders = project.folders.map(f => 
        f.id === folderId 
          ? { ...f, files: [...(f.files || []), newFile] }
          : f
      );
      
      await updateDoc(doc(db, 'projects', projectId), { folders: updatedFolders });
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleDeleteFile = async (projectId, folderId, fileId) => {
    try {
      const project = projects.find(p => p.id === projectId);
      const folder = project.folders.find(f => f.id === folderId);
      const file = folder.files.find(f => f.id === fileId);
      
      if (file.storagePath) {
        await deleteObject(ref(storage, file.storagePath));
      }
      
      const updatedFolders = project.folders.map(f =>
        f.id === folderId
          ? { ...f, files: f.files.filter(file => file.id !== fileId) }
          : f
      );
      
      await updateDoc(doc(db, 'projects', projectId), { folders: updatedFolders });
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  // Account handlers
  const handleAddAccount = async (account) => {
    try {
      await addDoc(collection(db, 'accounts'), {
        ...account,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.username
      });
    } catch (error) {
      console.error('Error adding account:', error);
    }
  };

  const handleEditAccount = async (account) => {
    try {
      await updateDoc(doc(db, 'accounts', account.id), account);
    } catch (error) {
      console.error('Error editing account:', error);
    }
  };

  const handleDeleteAccount = async (accountId) => {
    try {
      await deleteDoc(doc(db, 'accounts', accountId));
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  // ✅ متغيرات الستايل من القالب
  const t = theme;
  const card = `${darkMode ? 'bg-gray-800/80' : 'bg-white/90'} backdrop-blur-sm`;
  const txt = darkMode ? 'text-white' : 'text-gray-900';
  const txtSm = darkMode ? 'text-gray-400' : 'text-gray-600';

  // Loading screen
  if (loading) {
    return (
      <div 
        style={{ 
          minHeight: '100vh', 
          background: t.bg.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: t.font.family,
        }}
      >
        <link href={SHARED.font.url} rel="stylesheet" />
        <div style={{ textAlign: 'center' }}>
          <div 
            style={{
              width: 64,
              height: 64,
              border: `4px solid ${t.button.primary}`,
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: t.text.primary }}>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Auth screens
  if (!isLoggedIn) {
    if (showSignup) {
      return (
        <SignUp 
          onBack={() => setShowSignup(false)}
          onSuccess={handleSignupSuccess}
        />
      );
    }
    return (
      <Login 
        onLogin={handleLogin}
        onShowSignup={() => setShowSignup(true)}
      />
    );
  }

  // Main App
  return (
    <div 
      dir="rtl"
      style={{ 
        minHeight: '100vh',
        background: t.bg.primary,
        color: t.text.primary,
        fontFamily: t.font.family,
        fontSize: `${fontSize}px`,
        transition: 'all 0.3s ease',
      }}
    >
      <link href={SHARED.font.url} rel="stylesheet" />
      
      {/* ═══════════════ Global Styles - أرقام إنجليزية ═══════════════ */}
      <style>{`
        * {
          font-feature-settings: "tnum";
        }
        input, select, textarea {
          font-family: inherit;
        }
        input[type="number"], 
        input[type="date"], 
        input[type="time"],
        input[type="tel"] {
          direction: ltr;
          text-align: right;
        }
        /* إجبار الأرقام الإنجليزية في كل مكان */
        .en-nums, [data-en-nums] {
          font-variant-numeric: tabular-nums;
        }
      `}</style>

      {/* ═══════════════ Header ═══════════════ */}
      <header 
        style={{
          background: `${t.bg.secondary}ee`,
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${t.border.primary}`,
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '16px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div 
                style={{
                  width: 48,
                  height: 48,
                  background: t.button.gradient,
                  borderRadius: t.radius.lg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: t.button.glow,
                }}
              >
                <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>RKZ</span>
              </div>
              <div>
                <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: t.text.primary }}>
                  نظام الإدارة المالية
                </h1>
                <p style={{ fontSize: 12, color: t.text.muted, margin: 0 }}>
                  ركائز الأولى للتعمير
                </p>
              </div>
            </div>
            
            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              
              {/* User info */}
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: t.text.primary }}>
                  {currentUser.username}
                </p>
                <p style={{ fontSize: 12, color: t.text.muted, margin: 0 }}>
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              
              {/* Theme mode buttons */}
              <div style={{ display: 'flex', gap: 4 }}>
                {[
                  { mode: 'light', icon: <Sun size={18} />, title: 'نهاري' },
                  { mode: 'dark', icon: <Moon size={18} />, title: 'ليلي' },
                  { mode: 'auto', icon: <Monitor size={18} />, title: 'تلقائي' },
                ].map(({ mode, icon, title }) => (
                  <button
                    key={mode}
                    onClick={() => setThemeMode(mode)}
                    title={title}
                    style={{
                      padding: 8,
                      borderRadius: t.radius.md,
                      border: 'none',
                      background: themeMode === mode ? t.button.gradient : 'transparent',
                      color: themeMode === mode ? '#fff' : t.text.muted,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  borderRadius: t.radius.lg,
                  border: 'none',
                  background: `${t.dangerColor.main}20`,
                  color: t.dangerColor.main,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                <LogOut size={16} />
                <span>خروج</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════ Navigation ═══════════════ */}
      <Navigation
        currentView={currentView}
        setCurrentView={setCurrentView}
        darkMode={darkMode}
        accentColor={t.button.gradient}
        theme={theme}
      />

      {/* ═══════════════ Main Content ═══════════════ */}
      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
        {currentView === 'dashboard' && (
          <Dashboard
            expenses={expenses}
            tasks={tasks}
            projects={projects}
            accounts={accounts}
            darkMode={darkMode}
            txt={txt}
            txtSm={txtSm}
            card={card}
            theme={theme}
          />
        )}

        {currentView === 'expenses' && (
          <Expenses
            expenses={expenses}
            accounts={accounts}
            onAdd={handleAddExpense}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
            onMarkPaid={handleMarkPaid}
            onRefresh={handleRefreshExpenses}
            darkMode={darkMode}
            theme={theme}
          />
        )}

        {currentView === 'tasks' && (
          <Tasks
            tasks={tasks}
            projects={projects}
            onAdd={handleAddTask}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onToggleStatus={handleToggleTaskStatus}
            darkMode={darkMode}
            txt={txt}
            txtSm={txtSm}
            card={card}
            accentGradient={t.button.gradient}
            theme={theme}
          />
        )}

        {currentView === 'projects' && (
          <Projects
            projects={projects}
            onAdd={handleAddProject}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
            onAddFolder={handleAddFolder}
            onUploadFile={handleUploadFile}
            onDeleteFile={handleDeleteFile}
            darkMode={darkMode}
            txt={txt}
            txtSm={txtSm}
            card={card}
            accentGradient={t.button.gradient}
            theme={theme}
          />
        )}

        {currentView === 'accounts' && (
          <Accounts
            accounts={accounts}
            categories={categories}
            onAdd={handleAddAccount}
            onEdit={handleEditAccount}
            onDelete={handleDeleteAccount}
            darkMode={darkMode}
            txt={txt}
            txtSm={txtSm}
            card={card}
            accentGradient={t.button.gradient}
            theme={theme}
          />
        )}

        {currentView === 'users' && (
          <Users
            currentUser={currentUser}
            darkMode={darkMode}
            txt={txt}
            txtSm={txtSm}
            card={card}
            accentGradient={t.button.gradient}
            theme={theme}
          />
        )}

        {currentView === 'settings' && (
          <Settings
            darkMode={darkMode}
            themeMode={themeMode}
            setThemeMode={setThemeMode}
            currentThemeId={currentThemeId}
            setCurrentThemeId={setCurrentThemeId}
            fontSize={fontSize}
            setFontSize={setFontSize}
            txt={txt}
            txtSm={txtSm}
            card={card}
            theme={theme}
            themeList={THEME_LIST}
          />
        )}

        {currentView === 'calculator' && (
          <QuantityCalculator 
            darkMode={darkMode} 
            theme={theme}
          />
        )}
      </main>

      {/* ═══════════════ Footer ═══════════════ */}
      <footer style={{ textAlign: 'center', padding: 16, color: t.text.muted, fontSize: 12 }}>
        <p style={{ margin: 0 }}>نظام الإدارة المالية v7.0 - جميع الحقوق محفوظة © 2024</p>
      </footer>
    </div>
  );
}

export default App;
