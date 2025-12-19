// src/App.jsx
import React, { useState, useEffect } from 'react';
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, 
  query, orderBy, runTransaction
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './config/firebase';
import {
  encrypt, decrypt, generateRefNumber, 
  calcDaysRemaining, calculateSessionDuration, generateId, compressImage
} from './utils/helpers';
import {
  THEMES, FONTS, ACCENT_COLORS, HEADER_COLORS
} from './config/constants';

// استيراد المكونات
import Login from './components/Login';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Expenses from './components/Expenses';
import Tasks from './components/Tasks';
import Projects from './components/Projects';
import Accounts from './components/Accounts';
import Users from './components/Users';
import Settings from './components/Settings';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [expenses, setExpenses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [users, setUsers] = useState([]);
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
    const savedLogin = localStorage.getItem('isLoggedIn') === 'true';
    const savedUser = localStorage.getItem('currentUser');
    const savedThemeMode = localStorage.getItem('themeMode') || 'dark';
    const savedBgIndex = parseInt(localStorage.getItem('bgIndex')) || 0;
    const savedAccentIndex = parseInt(localStorage.getItem('accentIndex')) || 0;
    const savedHeaderColorIndex = parseInt(localStorage.getItem('headerColorIndex')) || 0;
    const savedFontSize = parseInt(localStorage.getItem('fontSize')) || 16;
    const savedFontIndex = parseInt(localStorage.getItem('fontIndex')) || 0;

    if (savedLogin && savedUser) {
      setIsLoggedIn(true);
      setCurrentUser(JSON.parse(savedUser));
      setSessionStart(Date.now());
    }

    setThemeMode(savedThemeMode);
    setBgIndex(savedBgIndex);
    setAccentIndex(savedAccentIndex);
    setHeaderColorIndex(savedHeaderColorIndex);
    setFontSize(savedFontSize);
    setFontIndex(savedFontIndex);
    
    setLoading(false);
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

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('bgIndex', bgIndex);
  }, [bgIndex]);

  useEffect(() => {
    localStorage.setItem('accentIndex', accentIndex);
  }, [accentIndex]);

  useEffect(() => {
    localStorage.setItem('headerColorIndex', headerColorIndex);
  }, [headerColorIndex]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('fontIndex', fontIndex);
  }, [fontIndex]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const unsubscribes = [
      onSnapshot(
        query(collection(db, 'expenses'), orderBy('createdAt', 'desc')),
        snapshot => setExpenses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      ),
      onSnapshot(
        query(collection(db, 'tasks'), orderBy('createdAt', 'desc')),
        snapshot => setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      ),
      onSnapshot(
        query(collection(db, 'projects'), orderBy('createdAt', 'desc')),
        snapshot => setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      ),
      onSnapshot(
        query(collection(db, 'accounts'), orderBy('createdAt', 'desc')),
        snapshot => setAccounts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      ),
      onSnapshot(
        collection(db, 'users'),
        snapshot => {
          const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setUsers(usersData.length ? usersData : [
            { 
              id: 'default-1',
              username: encrypt('نايف'), 
              password: encrypt('@Lion12345'), 
              role: 'owner', 
              active: true,
              approved: true 
            }
          ]);
        }
      ),
      onSnapshot(
        collection(db, 'categories'),
        snapshot => setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      )
    ];

    return () => unsubscribes.forEach(unsub => unsub());
  }, [isLoggedIn]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setSessionStart(Date.now());
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setSessionStart(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
  };

  const handleAddExpense = async (expense) => {
    await addDoc(collection(db, 'expenses'), {
      ...expense,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.username
    });
  };

  const handleEditExpense = async (expense) => {
    await updateDoc(doc(db, 'expenses', expense.id), expense);
  };

  const handleDeleteExpense = async (expenseId) => {
    await deleteDoc(doc(db, 'expenses', expenseId));
  };

  const handleMarkPaid = async (expenseId) => {
    const expense = expenses.find(e => e.id === expenseId);
    await updateDoc(doc(db, 'expenses', expenseId), {
      status: 'مدفوع',
      paidAt: new Date().toISOString()
    });
  };

  const handleRefreshExpenses = async () => {
    // تحديث المصروفات
  };

  const handleAddTask = async (task) => {
    await addDoc(collection(db, 'tasks'), {
      ...task,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.username
    });
  };

  const handleEditTask = async (task) => {
    await updateDoc(doc(db, 'tasks', task.id), task);
  };

  const handleDeleteTask = async (taskId) => {
    await deleteDoc(doc(db, 'tasks', taskId));
  };

  const handleToggleTaskStatus = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    await updateDoc(doc(db, 'tasks', taskId), { 
      status: task.status === 'مكتمل' ? 'قيد الانتظار' : 'مكتمل' 
    });
  };

  const handleAddProject = async (project) => {
    await addDoc(collection(db, 'projects'), {
      ...project,
      folders: [],
      createdAt: new Date().toISOString(),
      createdBy: currentUser.username
    });
  };

  const handleEditProject = async (project) => {
    await updateDoc(doc(db, 'projects', project.id), project);
  };

  const handleDeleteProject = async (projectId) => {
    await deleteDoc(doc(db, 'projects', projectId));
  };

  const handleAddFolder = async (projectId, folderName) => {
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
  };

  const handleUploadFile = async (projectId, folderId, file) => {
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
  };

  const handleDeleteFile = async (projectId, folderId, fileId) => {
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
  };

  const handleAddAccount = async (account) => {
    await addDoc(collection(db, 'accounts'), {
      ...account,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.username
    });
  };

  const handleEditAccount = async (account) => {
    await updateDoc(doc(db, 'accounts', account.id), account);
  };

  const handleDeleteAccount = async (accountId) => {
    await deleteDoc(doc(db, 'accounts', accountId));
  };

  const handleAddCategory = async (categoryName) => {
    await addDoc(collection(db, 'categories'), {
      name: categoryName,
      createdAt: new Date().toISOString()
    });
  };

  const handleDeleteCategory = async (categoryId) => {
    await deleteDoc(doc(db, 'categories', categoryId));
  };

  const handleAddUser = async (user) => {
    await addDoc(collection(db, 'users'), {
      ...user,
      createdAt: new Date().toISOString()
    });
  };

  const handleApproveUser = async (userId) => {
    await updateDoc(doc(db, 'users', userId), { approved: true });
  };

  const handleToggleUserActive = async (userId) => {
    const user = users.find(u => u.id === userId);
    await updateDoc(doc(db, 'users', userId), { active: !user.active });
  };

  const handleDeleteUser = async (userId) => {
    await deleteDoc(doc(db, 'users', userId));
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
    return (
      <Login 
        onLogin={handleLogin}
        users={users}
        darkMode={darkMode}
        accentGradient={accentGradient}
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

      <Header
        currentUser={currentUser}
        currentTime={currentTime}
        darkMode={darkMode}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        onLogout={handleLogout}
        sessionMinutes={calculateSessionDuration(sessionStart)}
        headerClass={headerClass}
        txtClass={txt}
        txtSmClass={txtSm}
      />

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
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            darkMode={darkMode}
            txt={txt}
            txtSm={txtSm}
            card={card}
            accentGradient={accentGradient}
          />
        )}

        {currentView === 'users' && (
          <Users
            users={users}
            currentUser={currentUser}
            onAdd={handleAddUser}
            onApprove={handleApproveUser}
            onToggleActive={handleToggleUserActive}
            onDelete={handleDeleteUser}
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
