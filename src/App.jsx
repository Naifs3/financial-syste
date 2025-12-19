import React, { useState, useEffect } from 'react';
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, 
  query, orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { db, storage, auth } from './config/firebase';
import {
  generateId, compressImage
} from './utils/helpers';
import {
  THEMES, FONTS, ACCENT_COLORS, HEADER_COLORS
} from './config/constants';

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

  const [themeMode, setThemeMode] = useState('dark');
  const [darkMode, setDarkMode] = useState(true);
  const [bgIndex, setBgIndex] = useState(0);
  const [accentIndex, setAccentIndex] = useState(0);
  const [headerColorIndex, setHeaderColorIndex] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [fontIndex, setFontIndex] = useState(0);

  const [sessionStart, setSessionStart] = useState(null);

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

  useEffect(() => {
    const savedThemeMode = localStorage.getItem('themeMode') || 'dark';
    const savedBgIndex = parseInt(localStorage.getItem('bgIndex')) || 0;
    const savedAccentIndex = parseInt(localStorage.getItem('accentIndex')) || 0;
    const savedHeaderColorIndex = parseInt(localStorage.getItem('headerColorIndex')) || 0;
    const savedFontSize = parseInt(localStorage.getItem('fontSize')) || 16;
    const savedFontIndex = parseInt(localStorage.getItem('fontIndex')) || 0;

    setThemeMode(savedThemeMode);
    setBgIndex(savedBgIndex);
    setAccentIndex(savedAccentIndex);
    setHeaderColorIndex(savedHeaderColorIndex);
    setFontSize(savedFontSize);
    setFontIndex(savedFontIndex);
  }, []);

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

  useEffect(() => { localStorage.setItem('themeMode', themeMode); }, [themeMode]);
  useEffect(() => { localStorage.setItem('bgIndex', bgIndex); }, [bgIndex]);
  useEffect(() => { localStorage.setItem('accentIndex', accentIndex); }, [accentIndex]);
  useEffect(() => { localStorage.setItem('headerColorIndex', headerColorIndex); }, [headerColorIndex]);
  useEffect(() => { localStorage.setItem('fontSize', fontSize); }, [fontSize]);
  useEffect(() => { localStorage.setItem('fontIndex', fontIndex); }, [fontIndex]);

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

  const handleRefreshExpenses = () => {
    console.log('Refreshing...');
  };

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

  const bg = darkMode 
    ? `bg-gradient-to-br ${THEMES[bgIndex].dark}` 
    : `bg-gradient-to-br ${THEMES[bgIndex].light}`;
  
  const card = darkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm';
  const txt = darkMode ? 'text-white' : 'text-gray-900';
  const txtSm = darkMode ? 'text-gray-400' : 'text-gray-600';
  const accentGradient = ACCENT_COLORS[accentIndex].gradient;
  const headerClass = darkMode 
    ? HEADER_COLORS[headerColorIndex].dark 
    : HEADER_COLORS[headerColorIndex].light;

  const calculateSessionDuration = (start) => {
    if (!start) return 0;
    return Math.floor((Date.now() - start) / 60000);
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${bg} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={txt}>جاري التحميل...</p>
        </div>
      </div>
    );
  }

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

  return (
    <div 
      className={`min-h-screen ${bg} transition-all duration-300`}
      style={{ 
        fontSize: `${fontSize}px`,
        fontFamily: FONTS[fontIndex].value 
      }}
    >
      <link href={FONTS[fontIndex].url} rel="stylesheet" />

      <header className={`${headerClass} sticky top-0 z-50 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${accentGradient} rounded-xl flex items-center justify-center`}>
                <span className="text-xl font-bold text-white">RKZ</span>
              </div>
              <div>
                <h1 className={`text-xl font-bold ${txt}`}>نظام الإدارة المالية</h1>
                <p className={`text-sm ${txtSm}`}>ركائز الأولى للتعمير</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className={`text-sm font-semibold ${txt}`}>{currentUser.username}</p>
                <p className={`text-xs ${txtSm}`}>{currentTime.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setThemeMode('light')}
                  className={`p-2 rounded-lg transition-colors ${themeMode === 'light' ? 'bg-yellow-500 text-white' : `${txtSm} hover:bg-gray-700`}`}
                  title="وضع نهاري"
                >
                  <Sun className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setThemeMode('dark')}
                  className={`p-2 rounded-lg transition-colors ${themeMode === 'dark' ? 'bg-blue-500 text-white' : `${txtSm} hover:bg-gray-700`}`}
                  title="وضع ليلي"
                >
                  <Moon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setThemeMode('auto')}
                  className={`p-2 rounded-lg transition-colors ${themeMode === 'auto' ? 'bg-gray-500 text-white' : `${txtSm} hover:bg-gray-700`}`}
                  title="تلقائي"
                >
                  <Monitor className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={handleLogout}
                className={`flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors`}
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">خروج</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <Navigation
        currentView={currentView}
        setCurrentView={setCurrentView}
        darkMode={darkMode}
        accentColor={accentGradient}
      />

      <main className="container mx-auto max-w-7xl">
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
          />
        )}

        {currentView === 'expenses' && (
          <Expenses
            expenses={expenses}
            onAdd={handleAddExpense}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
            onMarkPaid={handleMarkPaid}
            onRefresh={handleRefreshExpenses}
            darkMode={darkMode}
            txt={txt}
            txtSm={txtSm}
            card={card}
            accentGradient={accentGradient}
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
            accentGradient={accentGradient}
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
            accentGradient={accentGradient}
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
            accentGradient={accentGradient}
          />
        )}

        {currentView === 'users' && (
          <Users
            currentUser={currentUser}
            darkMode={darkMode}
            txt={txt}
            txtSm={txtSm}
            card={card}
            accentGradient={accentGradient}
          />
        )}

        {currentView === 'settings' && (
          <Settings
            darkMode={darkMode}
            themeMode={themeMode}
            setThemeMode={setThemeMode}
            bgIndex={bgIndex}
            setBgIndex={setBgIndex}
            accentIndex={accentIndex}
            setAccentIndex={setAccentIndex}
            headerColorIndex={headerColorIndex}
            setHeaderColorIndex={setHeaderColorIndex}
            fontSize={fontSize}
            setFontSize={setFontSize}
            fontIndex={fontIndex}
            setFontIndex={setFontIndex}
            txt={txt}
            txtSm={txtSm}
            card={card}
          />
        )}
      </main>

      <footer className={`text-center py-4 ${txtSm} text-xs`}>
        <p>نظام الإدارة المالية v6.0 - جميع الحقوق محفوظة © 2024</p>
      </footer>
    </div>
  );
}

export default App;
