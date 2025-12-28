// src/App.jsx
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  orderBy 
} from 'firebase/firestore';
import { getTheme } from './config/theme';
import { generateCode } from './utils/helpers';

// Components
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Expenses from './components/Expenses';
import Tasks from './components/Tasks';
import Projects from './components/Projects';
import Accounts from './components/Accounts';
import Users from './components/Users';
import Resources from './components/Resources';
import DataImport from './components/DataImport';

// Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  // ═══════════════ States ═══════════════
  const [currentView, setCurrentView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });
  const [showSettings, setShowSettings] = useState(false);
  
  // Data States
  const [expenses, setExpenses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [documents, setDocuments] = useState([]);
  
  // Loading States
  const [loading, setLoading] = useState(true);

  // Theme
  const theme = getTheme('professional', darkMode);

  // ═══════════════ Dark Mode Effect ═══════════════
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // ═══════════════ Firebase Listeners ═══════════════
  useEffect(() => {
    const unsubscribes = [];

    // Expenses
    const expensesQuery = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'));
    unsubscribes.push(
      onSnapshot(expensesQuery, (snapshot) => {
        setExpenses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      })
    );

    // Tasks
    const tasksQuery = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
    unsubscribes.push(
      onSnapshot(tasksQuery, (snapshot) => {
        setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      })
    );

    // Projects
    const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    unsubscribes.push(
      onSnapshot(projectsQuery, (snapshot) => {
        setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      })
    );

    // Accounts
    const accountsQuery = query(collection(db, 'accounts'), orderBy('createdAt', 'desc'));
    unsubscribes.push(
      onSnapshot(accountsQuery, (snapshot) => {
        setAccounts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      })
    );

    // Users
    const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    unsubscribes.push(
      onSnapshot(usersQuery, (snapshot) => {
        setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      })
    );

    // Clients
    const clientsQuery = query(collection(db, 'clients'), orderBy('createdAt', 'desc'));
    unsubscribes.push(
      onSnapshot(clientsQuery, (snapshot) => {
        setClients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      })
    );

    // Suppliers
    const suppliersQuery = query(collection(db, 'suppliers'), orderBy('createdAt', 'desc'));
    unsubscribes.push(
      onSnapshot(suppliersQuery, (snapshot) => {
        setSuppliers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      })
    );

    // Materials
    const materialsQuery = query(collection(db, 'materials'), orderBy('createdAt', 'desc'));
    unsubscribes.push(
      onSnapshot(materialsQuery, (snapshot) => {
        setMaterials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      })
    );

    // Equipment
    const equipmentQuery = query(collection(db, 'equipment'), orderBy('createdAt', 'desc'));
    unsubscribes.push(
      onSnapshot(equipmentQuery, (snapshot) => {
        setEquipment(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      })
    );

    // Documents
    const documentsQuery = query(collection(db, 'documents'), orderBy('createdAt', 'desc'));
    unsubscribes.push(
      onSnapshot(documentsQuery, (snapshot) => {
        setDocuments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      })
    );

    setLoading(false);

    return () => unsubscribes.forEach(unsub => unsub());
  }, []);

  // ═══════════════ CRUD Functions ═══════════════
  
  // Expenses
  const handleAddExpense = async (data) => {
    await addDoc(collection(db, 'expenses'), {
      ...data,
      code: data.code || generateCode('expenses'),
      createdAt: new Date()
    });
  };

  const handleUpdateExpense = async (id, data) => {
    await updateDoc(doc(db, 'expenses', id), data);
  };

  const handleDeleteExpense = async (id) => {
    await deleteDoc(doc(db, 'expenses', id));
  };

  // Tasks
  const handleAddTask = async (data) => {
    await addDoc(collection(db, 'tasks'), {
      ...data,
      code: data.code || generateCode('tasks'),
      createdAt: new Date()
    });
  };

  const handleUpdateTask = async (id, data) => {
    await updateDoc(doc(db, 'tasks', id), data);
  };

  const handleDeleteTask = async (id) => {
    await deleteDoc(doc(db, 'tasks', id));
  };

  // Projects
  const handleAddProject = async (data) => {
    await addDoc(collection(db, 'projects'), {
      ...data,
      code: data.code || generateCode('projects'),
      folders: [],
      createdAt: new Date()
    });
  };

  const handleUpdateProject = async (id, data) => {
    await updateDoc(doc(db, 'projects', id), data);
  };

  const handleDeleteProject = async (id) => {
    await deleteDoc(doc(db, 'projects', id));
  };

  // Accounts
  const handleAddAccount = async (data) => {
    await addDoc(collection(db, 'accounts'), {
      ...data,
      code: data.code || generateCode('accounts'),
      createdAt: new Date()
    });
  };

  const handleUpdateAccount = async (id, data) => {
    await updateDoc(doc(db, 'accounts', id), data);
  };

  const handleDeleteAccount = async (id) => {
    await deleteDoc(doc(db, 'accounts', id));
  };

  // Users
  const handleAddUser = async (data) => {
    await addDoc(collection(db, 'users'), {
      ...data,
      code: data.code || generateCode('users'),
      createdAt: new Date()
    });
  };

  const handleUpdateUser = async (id, data) => {
    await updateDoc(doc(db, 'users', id), data);
  };

  const handleDeleteUser = async (id) => {
    await deleteDoc(doc(db, 'users', id));
  };

  // Clients
  const handleAddClient = async (data) => {
    await addDoc(collection(db, 'clients'), {
      ...data,
      code: data.code || generateCode('clients'),
      createdAt: new Date()
    });
  };

  const handleUpdateClient = async (id, data) => {
    await updateDoc(doc(db, 'clients', id), data);
  };

  const handleDeleteClient = async (id) => {
    await deleteDoc(doc(db, 'clients', id));
  };

  // Suppliers
  const handleAddSupplier = async (data) => {
    await addDoc(collection(db, 'suppliers'), {
      ...data,
      code: data.code || generateCode('suppliers'),
      createdAt: new Date()
    });
  };

  const handleUpdateSupplier = async (id, data) => {
    await updateDoc(doc(db, 'suppliers', id), data);
  };

  const handleDeleteSupplier = async (id) => {
    await deleteDoc(doc(db, 'suppliers', id));
  };

  // Materials
  const handleAddMaterial = async (data) => {
    await addDoc(collection(db, 'materials'), {
      ...data,
      code: data.code || generateCode('materials'),
      createdAt: new Date()
    });
  };

  const handleUpdateMaterial = async (id, data) => {
    await updateDoc(doc(db, 'materials', id), data);
  };

  const handleDeleteMaterial = async (id) => {
    await deleteDoc(doc(db, 'materials', id));
  };

  // Equipment
  const handleAddEquipment = async (data) => {
    await addDoc(collection(db, 'equipment'), {
      ...data,
      code: data.code || generateCode('equipment'),
      createdAt: new Date()
    });
  };

  const handleUpdateEquipment = async (id, data) => {
    await updateDoc(doc(db, 'equipment', id), data);
  };

  const handleDeleteEquipment = async (id) => {
    await deleteDoc(doc(db, 'equipment', id));
  };

  // Documents
  const handleAddDocument = async (data) => {
    await addDoc(collection(db, 'documents'), {
      ...data,
      code: data.code || generateCode('documents'),
      createdAt: new Date()
    });
  };

  const handleUpdateDocument = async (id, data) => {
    await updateDoc(doc(db, 'documents', id), data);
  };

  const handleDeleteDocument = async (id) => {
    await deleteDoc(doc(db, 'documents', id));
  };

  // ═══════════════ Import Functions ═══════════════
  const handleImportExpense = async (data) => {
    await addDoc(collection(db, 'expenses'), {
      ...data,
      code: data.code || generateCode('expenses'),
      createdAt: new Date()
    });
  };

  const handleImportTask = async (data) => {
    await addDoc(collection(db, 'tasks'), {
      ...data,
      code: data.code || generateCode('tasks'),
      createdAt: new Date()
    });
  };

  const handleImportProject = async (data) => {
    await addDoc(collection(db, 'projects'), {
      ...data,
      code: data.code || generateCode('projects'),
      folders: [],
      createdAt: new Date()
    });
  };

  const handleImportAccount = async (data) => {
    await addDoc(collection(db, 'accounts'), {
      ...data,
      code: data.code || generateCode('accounts'),
      createdAt: new Date()
    });
  };

  const handleImportClient = async (data) => {
    await addDoc(collection(db, 'clients'), {
      ...data,
      code: data.code || generateCode('clients'),
      createdAt: new Date()
    });
  };

  const handleImportSupplier = async (data) => {
    await addDoc(collection(db, 'suppliers'), {
      ...data,
      code: data.code || generateCode('suppliers'),
      createdAt: new Date()
    });
  };

  const handleImportMaterial = async (data) => {
    await addDoc(collection(db, 'materials'), {
      ...data,
      code: data.code || generateCode('materials'),
      createdAt: new Date()
    });
  };

  const handleImportEquipment = async (data) => {
    await addDoc(collection(db, 'equipment'), {
      ...data,
      code: data.code || generateCode('equipment'),
      createdAt: new Date()
    });
  };

  // ═══════════════ Render Content ═══════════════
  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            expenses={expenses}
            tasks={tasks}
            projects={projects}
            accounts={accounts}
            darkMode={darkMode}
            theme={theme}
          />
        );
      
      case 'expenses':
        return (
          <Expenses
            expenses={expenses}
            accounts={accounts}
            onAdd={handleAddExpense}
            onUpdate={handleUpdateExpense}
            onDelete={handleDeleteExpense}
            darkMode={darkMode}
            theme={theme}
          />
        );
      
      case 'tasks':
        return (
          <Tasks
            tasks={tasks}
            projects={projects}
            onAdd={handleAddTask}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
            darkMode={darkMode}
            theme={theme}
          />
        );
      
      case 'projects':
        return (
          <Projects
            projects={projects}
            clients={clients}
            onAdd={handleAddProject}
            onUpdate={handleUpdateProject}
            onDelete={handleDeleteProject}
            darkMode={darkMode}
            theme={theme}
          />
        );
      
      case 'accounts':
        return (
          <Accounts
            accounts={accounts}
            onAdd={handleAddAccount}
            onUpdate={handleUpdateAccount}
            onDelete={handleDeleteAccount}
            darkMode={darkMode}
            theme={theme}
          />
        );
      
      case 'users':
        return (
          <Users
            users={users}
            onAdd={handleAddUser}
            onUpdate={handleUpdateUser}
            onDelete={handleDeleteUser}
            darkMode={darkMode}
            theme={theme}
          />
        );
      
      case 'resources':
        return (
          <Resources
            clients={clients}
            suppliers={suppliers}
            materials={materials}
            equipment={equipment}
            documents={documents}
            onAddClient={handleAddClient}
            onUpdateClient={handleUpdateClient}
            onDeleteClient={handleDeleteClient}
            onAddSupplier={handleAddSupplier}
            onUpdateSupplier={handleUpdateSupplier}
            onDeleteSupplier={handleDeleteSupplier}
            onAddMaterial={handleAddMaterial}
            onUpdateMaterial={handleUpdateMaterial}
            onDeleteMaterial={handleDeleteMaterial}
            onAddEquipment={handleAddEquipment}
            onUpdateEquipment={handleUpdateEquipment}
            onDeleteEquipment={handleDeleteEquipment}
            onAddDocument={handleAddDocument}
            onUpdateDocument={handleUpdateDocument}
            onDeleteDocument={handleDeleteDocument}
            darkMode={darkMode}
            theme={theme}
          />
        );
      
      case 'import':
        return (
          <DataImport
            onImportExpenses={handleImportExpense}
            onImportTasks={handleImportTask}
            onImportProjects={handleImportProject}
            onImportAccounts={handleImportAccount}
            onImportClients={handleImportClient}
            onImportSuppliers={handleImportSupplier}
            onImportMaterials={handleImportMaterial}
            onImportEquipment={handleImportEquipment}
            expenses={expenses}
            tasks={tasks}
            projects={projects}
            accounts={accounts}
            clients={clients}
            suppliers={suppliers}
            materials={materials}
            equipment={equipment}
            darkMode={darkMode}
            theme={theme}
          />
        );
      
      default:
        return (
          <Dashboard
            expenses={expenses}
            tasks={tasks}
            projects={projects}
            accounts={accounts}
            darkMode={darkMode}
            theme={theme}
          />
        );
    }
  };

  // ═══════════════ Main Render ═══════════════
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.bg.primary,
        color: theme.text.primary
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: 50, 
            height: 50, 
            border: `3px solid ${theme.border.primary}`,
            borderTopColor: theme.button.primary,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.bg.primary,
      fontFamily: 'IBM Plex Sans Arabic, sans-serif',
      direction: 'rtl'
    }}>
      {/* Header */}
      <header style={{
        background: theme.bg.secondary,
        borderBottom: `1px solid ${theme.border.primary}`,
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <h1 style={{ 
          fontSize: 20, 
          fontWeight: 700, 
          color: theme.text.primary,
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          🏗️ نظام إدارة المقاولات
        </h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              border: `1px solid ${theme.border.primary}`,
              background: theme.bg.tertiary,
              color: theme.text.secondary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18
            }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          
          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              border: `1px solid ${theme.border.primary}`,
              background: theme.bg.tertiary,
              color: theme.text.secondary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18
            }}
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div style={{ display: 'flex' }}>
        {/* Navigation */}
        <Navigation
          currentView={currentView}
          setCurrentView={setCurrentView}
          darkMode={darkMode}
          theme={theme}
        />

        {/* Content */}
        <main style={{
          flex: 1,
          padding: 24,
          minHeight: 'calc(100vh - 65px)',
          overflowY: 'auto'
        }}>
          {renderContent()}
        </main>
      </div>

      {/* Global Styles */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: ${theme.bg.secondary};
        }
        
        ::-webkit-scrollbar-thumb {
          background: ${theme.border.primary};
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: ${theme.text.muted};
        }
      `}</style>
    </div>
  );
}

export default App;
