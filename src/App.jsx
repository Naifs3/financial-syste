// src/App.jsx
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Receipt, CheckSquare, FolderOpen, Wallet, Users,
  Package, Moon, Sun, Menu, X, LogOut, Settings, Bell, ChevronLeft
} from 'lucide-react';

// استيراد المكونات
import Expenses from './components/Expenses';
import Tasks from './components/Tasks';
import Projects from './components/Projects';
import Accounts from './components/Accounts';
import UsersComponent from './components/Users';
import Resources from './components/Resources';

// استيراد الثيم والمساعدات
import { getTheme } from './config/theme';
import { formatNumber, generateCode, calcDaysRemaining } from './utils/helpers';

function App() {
  // ═══════════════════════════════════════════════════════════
  // الحالات الرئيسية
  // ═══════════════════════════════════════════════════════════
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  // ═══════════════════════════════════════════════════════════
  // بيانات الأقسام الأساسية
  // ═══════════════════════════════════════════════════════════
  const [expenses, setExpenses] = useState([
    { id: 1, code: 'E-0001', name: 'إيجار المكتب', amount: 15000, type: 'monthly', dueDate: '2025-01-15', status: 'غير مدفوع', projectId: 1, accountId: 1, userId: 1, notes: '' },
    { id: 2, code: 'E-0002', name: 'رواتب الموظفين', amount: 45000, type: 'monthly', dueDate: '2025-01-01', status: 'مدفوع', projectId: null, accountId: 1, userId: 1, notes: '' },
    { id: 3, code: 'E-0003', name: 'فاتورة الكهرباء', amount: 2500, type: 'monthly', dueDate: '2025-01-20', status: 'غير مدفوع', projectId: 1, accountId: 2, userId: 2, notes: '' },
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, code: 'T-0001', title: 'مراجعة العقود', description: 'مراجعة عقود المشروع الجديد', status: 'قيد التنفيذ', priority: 'عاجل', dueDate: '2025-01-10', projectId: 1, assignedTo: 1 },
    { id: 2, code: 'T-0002', title: 'تجهيز الموقع', description: 'تجهيز موقع المشروع للبناء', status: 'معلق', priority: 'عالي', dueDate: '2025-01-15', projectId: 1, assignedTo: 2 },
    { id: 3, code: 'T-0003', title: 'طلب المواد', description: 'طلب مواد البناء من الموردين', status: 'مكتمل', priority: 'متوسط', dueDate: '2025-01-05', projectId: 2, assignedTo: 1 },
  ]);

  const [projects, setProjects] = useState([
    { id: 1, code: 'P-0001', name: 'فيلا الرياض', client: 'شركة الإنشاءات المتحدة', status: 'نشط', budget: 500000, startDate: '2024-06-01', endDate: '2025-06-01', managerId: 1, accountId: 1, clientId: 1, description: 'بناء فيلا سكنية' },
    { id: 2, code: 'P-0002', name: 'مجمع تجاري جدة', client: 'مؤسسة البناء الحديث', status: 'نشط', budget: 1200000, startDate: '2024-09-01', endDate: '2025-12-01', managerId: 2, accountId: 1, clientId: 2, description: 'بناء مجمع تجاري' },
  ]);

  const [accounts, setAccounts] = useState([
    { id: 1, code: 'A-0001', name: 'بنك الراجحي - الحساب الرئيسي', type: 'bank', bankName: 'بنك الراجحي', accountNumber: 'SA0380000000608010167519', balance: 250000, notes: '' },
    { id: 2, code: 'A-0002', name: 'صندوق المكتب', type: 'cash', balance: 15000, notes: 'الصندوق النقدي للمصروفات اليومية' },
    { id: 3, code: 'A-0003', name: 'STC Pay', type: 'stcpay', accountNumber: '0501234567', balance: 5000, notes: '' },
  ]);

  const [users, setUsers] = useState([
    { id: 1, code: 'U-0001', username: 'أحمد محمد', email: 'ahmed@company.com', phone: '0501234567', role: 'owner', status: 'نشط' },
    { id: 2, code: 'U-0002', username: 'خالد علي', email: 'khaled@company.com', phone: '0507654321', role: 'admin', status: 'نشط' },
    { id: 3, code: 'U-0003', username: 'سعد عبدالله', email: 'saad@company.com', phone: '0509876543', role: 'editor', status: 'نشط' },
  ]);

  // ═══════════════════════════════════════════════════════════
  // بيانات إدارة الموارد (الجديدة)
  // ═══════════════════════════════════════════════════════════
  const [clients, setClients] = useState([
    { id: 1, code: 'CL-0001', name: 'شركة الإنشاءات المتحدة', type: 'company', phone: '0112345678', email: 'info@construction.com', address: 'الرياض - حي العليا', notes: '' },
    { id: 2, code: 'CL-0002', name: 'مؤسسة البناء الحديث', type: 'company', phone: '0126543210', email: 'info@modern-build.com', address: 'جدة - حي الروضة', notes: '' },
    { id: 3, code: 'CL-0003', name: 'محمد عبدالرحمن', type: 'individual', phone: '0551234567', email: 'mohammed@email.com', address: 'الدمام - حي الفيصلية', notes: '' },
  ]);

  const [suppliers, setSuppliers] = useState([
    { id: 1, code: 'SP-0001', name: 'مصنع الحديد السعودي', category: 'حديد ومعادن', phone: '0138765432', email: 'sales@steel.com', address: 'الجبيل - المنطقة الصناعية', notes: '' },
    { id: 2, code: 'SP-0002', name: 'شركة الأسمنت الوطنية', category: 'أسمنت ومواد بناء', phone: '0114567890', email: 'orders@cement.com', address: 'الرياض - المنطقة الصناعية الثانية', notes: '' },
    { id: 3, code: 'SP-0003', name: 'مؤسسة الكهرباء المتكاملة', category: 'كهرباء', phone: '0509988776', email: 'info@electric.com', address: 'الرياض - حي السلي', notes: '' },
  ]);

  const [documents, setDocuments] = useState([
    { id: 1, code: 'DOC-0001', title: 'فاتورة دفعة أولى - فيلا الرياض', type: 'invoice_out', number: 'INV-2025-001', date: '2025-01-01', amount: 150000, clientId: 1, supplierId: null, projectId: 1, accountId: 1, status: 'paid', notes: '' },
    { id: 2, code: 'DOC-0002', title: 'عقد مشروع فيلا الرياض', type: 'contract', number: 'CNT-2024-001', date: '2024-06-01', amount: 500000, clientId: 1, supplierId: null, projectId: 1, accountId: null, status: 'active', notes: '' },
    { id: 3, code: 'DOC-0003', title: 'فاتورة شراء حديد', type: 'invoice_in', number: 'PO-2025-001', date: '2025-01-05', amount: 85000, clientId: null, supplierId: 1, projectId: 1, accountId: 1, status: 'pending', notes: '' },
    { id: 4, code: 'DOC-0004', title: 'سند قبض - دفعة ثانية', type: 'receipt', number: 'REC-2025-001', date: '2025-01-10', amount: 100000, clientId: 1, supplierId: null, projectId: 1, accountId: 1, status: 'completed', notes: '' },
  ]);

  const [materials, setMaterials] = useState([
    { id: 1, code: 'MT-0001', name: 'حديد تسليح 16مم', unit: 'ton', quantity: 50, minQuantity: 10, price: 3500, supplierId: 1, location: 'المستودع الرئيسي - رف A1', notes: '' },
    { id: 2, code: 'MT-0002', name: 'أسمنت بورتلاندي', unit: 'bag', quantity: 500, minQuantity: 100, price: 22, supplierId: 2, location: 'المستودع الرئيسي - رف B2', notes: '' },
    { id: 3, code: 'MT-0003', name: 'رمل أبيض', unit: 'm3', quantity: 200, minQuantity: 50, price: 85, supplierId: null, location: 'ساحة التخزين', notes: '' },
    { id: 4, code: 'MT-0004', name: 'بلوك خرساني 20سم', unit: 'unit', quantity: 5, minQuantity: 1000, price: 3.5, supplierId: null, location: 'المستودع الرئيسي - رف C1', notes: 'نقص في المخزون!' },
  ]);

  const [equipment, setEquipment] = useState([
    { id: 1, code: 'EQ-0001', name: 'حفارة كوماتسو PC200', type: 'حفارة', plateNumber: 'أ ب ج 1234', status: 'in_use', projectId: 1, purchaseDate: '2020-01-15', value: 450000, notes: '' },
    { id: 2, code: 'EQ-0002', name: 'شاحنة قلاب هينو', type: 'شاحنة', plateNumber: 'س ع د 5678', status: 'available', projectId: null, purchaseDate: '2021-06-20', value: 280000, notes: '' },
    { id: 3, code: 'EQ-0003', name: 'خلاطة خرسانة', type: 'خلاطة', plateNumber: '', status: 'maintenance', projectId: null, purchaseDate: '2019-03-10', value: 85000, notes: 'في الصيانة الدورية' },
    { id: 4, code: 'EQ-0004', name: 'رافعة شوكية', type: 'رافعة', plateNumber: 'ر ف ع 9012', status: 'in_use', projectId: 2, purchaseDate: '2022-08-05', value: 120000, notes: '' },
  ]);

  // ═══════════════════════════════════════════════════════════
  // الثيم
  // ═══════════════════════════════════════════════════════════
  const theme = getTheme(darkMode);
  const t = theme;

  // ═══════════════════════════════════════════════════════════
  // القائمة الجانبية
  // ═══════════════════════════════════════════════════════════
  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'projects', label: 'المشاريع', icon: FolderOpen, count: projects.length },
    { id: 'tasks', label: 'المهام', icon: CheckSquare, count: tasks.filter(t => t.status !== 'مكتمل').length },
    { id: 'expenses', label: 'المصروفات', icon: Receipt, count: expenses.filter(e => e.status === 'غير مدفوع').length },
    { id: 'accounts', label: 'الحسابات', icon: Wallet, count: accounts.length },
    { id: 'resources', label: 'إدارة الموارد', icon: Package, count: clients.length + suppliers.length },
    { id: 'users', label: 'المستخدمين', icon: Users, count: users.length },
  ];

  // ═══════════════════════════════════════════════════════════
  // دوال المصروفات
  // ═══════════════════════════════════════════════════════════
  const handleAddExpense = async (data) => {
    const newExpense = { ...data, id: Date.now(), code: data.code || generateCode('E') };
    setExpenses([...expenses, newExpense]);
  };

  const handleEditExpense = async (data) => {
    setExpenses(expenses.map(e => e.id === data.id ? data : e));
  };

  const handleDeleteExpense = async (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const handleMarkPaid = async (id) => {
    setExpenses(expenses.map(e => e.id === id ? { ...e, status: 'مدفوع' } : e));
  };

  // ═══════════════════════════════════════════════════════════
  // دوال المهام
  // ═══════════════════════════════════════════════════════════
  const handleAddTask = async (data) => {
    const newTask = { ...data, id: Date.now(), code: data.code || generateCode('T') };
    setTasks([...tasks, newTask]);
  };

  const handleEditTask = async (data) => {
    setTasks(tasks.map(t => t.id === data.id ? data : t));
  };

  const handleDeleteTask = async (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleToggleTaskStatus = async (id) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        return { ...t, status: t.status === 'مكتمل' ? 'قيد التنفيذ' : 'مكتمل' };
      }
      return t;
    }));
  };

  // ═══════════════════════════════════════════════════════════
  // دوال المشاريع
  // ═══════════════════════════════════════════════════════════
  const handleAddProject = async (data) => {
    const newProject = { ...data, id: Date.now(), code: data.code || generateCode('P') };
    setProjects([...projects, newProject]);
  };

  const handleEditProject = async (data) => {
    setProjects(projects.map(p => p.id === data.id ? data : p));
  };

  const handleDeleteProject = async (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  // ═══════════════════════════════════════════════════════════
  // دوال الحسابات
  // ═══════════════════════════════════════════════════════════
  const handleAddAccount = async (data) => {
    const newAccount = { ...data, id: Date.now(), code: data.code || generateCode('A') };
    setAccounts([...accounts, newAccount]);
  };

  const handleEditAccount = async (data) => {
    setAccounts(accounts.map(a => a.id === data.id ? data : a));
  };

  const handleDeleteAccount = async (id) => {
    setAccounts(accounts.filter(a => a.id !== id));
  };

  // ═══════════════════════════════════════════════════════════
  // دوال المستخدمين
  // ═══════════════════════════════════════════════════════════
  const handleAddUser = async (data) => {
    const newUser = { ...data, id: Date.now(), code: data.code || generateCode('U') };
    setUsers([...users, newUser]);
  };

  const handleEditUser = async (data) => {
    setUsers(users.map(u => u.id === data.id ? data : u));
  };

  const handleDeleteUser = async (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  // ═══════════════════════════════════════════════════════════
  // دوال إدارة الموارد
  // ═══════════════════════════════════════════════════════════
  // العملاء
  const handleAddClient = async (data) => {
    const newClient = { ...data, id: Date.now() };
    setClients([...clients, newClient]);
  };
  const handleEditClient = async (data) => {
    setClients(clients.map(c => c.id === data.id ? data : c));
  };
  const handleDeleteClient = async (id) => {
    setClients(clients.filter(c => c.id !== id));
  };

  // الموردين
  const handleAddSupplier = async (data) => {
    const newSupplier = { ...data, id: Date.now() };
    setSuppliers([...suppliers, newSupplier]);
  };
  const handleEditSupplier = async (data) => {
    setSuppliers(suppliers.map(s => s.id === data.id ? data : s));
  };
  const handleDeleteSupplier = async (id) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
  };

  // المستندات
  const handleAddDocument = async (data) => {
    const newDocument = { ...data, id: Date.now() };
    setDocuments([...documents, newDocument]);
  };
  const handleEditDocument = async (data) => {
    setDocuments(documents.map(d => d.id === data.id ? data : d));
  };
  const handleDeleteDocument = async (id) => {
    setDocuments(documents.filter(d => d.id !== id));
  };

  // المواد
  const handleAddMaterial = async (data) => {
    const newMaterial = { ...data, id: Date.now() };
    setMaterials([...materials, newMaterial]);
  };
  const handleEditMaterial = async (data) => {
    setMaterials(materials.map(m => m.id === data.id ? data : m));
  };
  const handleDeleteMaterial = async (id) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  // المعدات
  const handleAddEquipment = async (data) => {
    const newEquipment = { ...data, id: Date.now() };
    setEquipment([...equipment, newEquipment]);
  };
  const handleEditEquipment = async (data) => {
    setEquipment(equipment.map(e => e.id === data.id ? data : e));
  };
  const handleDeleteEquipment = async (id) => {
    setEquipment(equipment.filter(e => e.id !== id));
  };

  // ═══════════════════════════════════════════════════════════
  // التنقل بين الأقسام
  // ═══════════════════════════════════════════════════════════
  const handleNavigate = (type, data) => {
    switch (type) {
      case 'project':
        setCurrentPage('projects');
        break;
      case 'account':
        setCurrentPage('accounts');
        break;
      case 'user':
        setCurrentPage('users');
        break;
      case 'task':
        setCurrentPage('tasks');
        break;
      case 'expense':
        setCurrentPage('expenses');
        break;
      case 'client':
      case 'supplier':
      case 'document':
      case 'material':
      case 'equipment':
        setCurrentPage('resources');
        break;
      default:
        break;
    }
  };

  // ═══════════════════════════════════════════════════════════
  // لوحة التحكم
  // ═══════════════════════════════════════════════════════════
  const Dashboard = () => {
    const totalBalance = accounts.reduce((sum, a) => sum + (parseFloat(a.balance) || 0), 0);
    const unpaidExpenses = expenses.filter(e => e.status === 'غير مدفوع').reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const activeTasks = tasks.filter(t => t.status !== 'مكتمل').length;
    const activeProjects = projects.filter(p => p.status === 'نشط').length;

    const stats = [
      { label: 'إجمالي الرصيد', value: `${formatNumber(totalBalance)} ﷼`, color: t.colors[Object.keys(t.colors)[0]]?.main, icon: Wallet },
      { label: 'مصروفات غير مدفوعة', value: `${formatNumber(unpaidExpenses)} ﷼`, color: t.status.danger.text, icon: Receipt },
      { label: 'مشاريع نشطة', value: activeProjects, color: t.status.success.text, icon: FolderOpen },
      { label: 'مهام قيد التنفيذ', value: activeTasks, color: t.status.warning.text, icon: CheckSquare },
      { label: 'العملاء', value: clients.length, color: '#3b82f6', icon: Users },
      { label: 'الموردين', value: suppliers.length, color: '#f97316', icon: Package },
    ];

    return (
      <div style={{ padding: '24px 0' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: t.text.primary, marginBottom: 24 }}>لوحة التحكم</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ background: t.bg.secondary, borderRadius: 16, padding: 20, border: `1px solid ${t.border.primary}`, cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <stat.icon size={24} style={{ color: stat.color }} />
              </div>
              <p style={{ fontSize: 13, color: t.text.muted, margin: '0 0 6px 0' }}>{stat.label}</p>
              <p style={{ fontSize: 26, fontWeight: 700, color: stat.color, margin: 0 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* آخر المهام */}
        <div style={{ background: t.bg.secondary, borderRadius: 16, padding: 20, border: `1px solid ${t.border.primary}`, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: t.text.primary, marginBottom: 16 }}>آخر المهام</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tasks.slice(0, 5).map(task => (
              <div key={task.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, background: t.bg.tertiary, borderRadius: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckSquare size={18} style={{ color: task.status === 'مكتمل' ? t.status.success.text : t.text.muted }} />
                  <span style={{ color: t.text.primary, textDecoration: task.status === 'مكتمل' ? 'line-through' : 'none' }}>{task.title}</span>
                </div>
                <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, background: task.status === 'مكتمل' ? t.status.success.bg : t.status.warning.bg, color: task.status === 'مكتمل' ? t.status.success.text : t.status.warning.text }}>{task.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* آخر المصروفات */}
        <div style={{ background: t.bg.secondary, borderRadius: 16, padding: 20, border: `1px solid ${t.border.primary}` }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: t.text.primary, marginBottom: 16 }}>آخر المصروفات</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {expenses.slice(0, 5).map(expense => (
              <div key={expense.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, background: t.bg.tertiary, borderRadius: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Receipt size={18} style={{ color: t.text.muted }} />
                  <span style={{ color: t.text.primary }}>{expense.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontWeight: 600, color: t.colors[Object.keys(t.colors)[0]]?.main }}>{formatNumber(expense.amount)} ﷼</span>
                  <span style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, background: expense.status === 'مدفوع' ? t.status.success.bg : t.status.danger.bg, color: expense.status === 'مدفوع' ? t.status.success.text : t.status.danger.text }}>{expense.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // Render الرئيسي
  // ═══════════════════════════════════════════════════════════
  return (
    <div style={{ minHeight: '100vh', background: t.bg.primary, fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      {/* Header */}
      <header style={{ 
        position: 'fixed', 
        top: 0, 
        right: 0, 
        left: 0, 
        height: 64, 
        background: t.bg.secondary, 
        borderBottom: `1px solid ${t.border.primary}`, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 20px',
        zIndex: 100 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ width: 40, height: 40, borderRadius: 10, border: 'none', background: t.bg.tertiary, color: t.text.primary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: t.text.primary, margin: 0 }}>🏗️ نظام إدارة المقاولات</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => setDarkMode(!darkMode)} style={{ width: 40, height: 40, borderRadius: 10, border: 'none', background: t.bg.tertiary, color: t.text.primary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button style={{ width: 40, height: 40, borderRadius: 10, border: 'none', background: t.bg.tertiary, color: t.text.primary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Bell size={20} />
            <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: '50%', background: t.status.danger.text }}></span>
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside style={{ 
        position: 'fixed', 
        top: 64, 
        right: 0, 
        bottom: 0, 
        width: sidebarOpen ? 260 : 70, 
        background: t.bg.secondary, 
        borderLeft: `1px solid ${t.border.primary}`, 
        transition: 'width 0.3s',
        zIndex: 90,
        overflowY: 'auto',
        overflowX: 'hidden'
      }}>
        <nav style={{ padding: '16px 12px' }}>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              style={{
                width: '100%',
                padding: sidebarOpen ? '12px 16px' : '12px',
                marginBottom: 6,
                borderRadius: 12,
                border: 'none',
                background: currentPage === item.id ? t.button.gradient : 'transparent',
                color: currentPage === item.id ? '#fff' : t.text.secondary,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                gap: 12,
                fontSize: 14,
                fontWeight: 600,
                fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
            >
              <item.icon size={20} />
              {sidebarOpen && (
                <>
                  <span style={{ flex: 1, textAlign: 'right' }}>{item.label}</span>
                  {item.count !== undefined && (
                    <span style={{ 
                      fontSize: 11, 
                      padding: '2px 8px', 
                      borderRadius: 10, 
                      background: currentPage === item.id ? 'rgba(255,255,255,0.2)' : t.bg.tertiary 
                    }}>
                      {item.count}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ 
        marginRight: sidebarOpen ? 260 : 70, 
        marginTop: 64, 
        padding: '0 24px', 
        transition: 'margin-right 0.3s',
        minHeight: 'calc(100vh - 64px)'
      }}>
        {currentPage === 'dashboard' && <Dashboard />}
        
        {currentPage === 'expenses' && (
          <Expenses
            expenses={expenses}
            accounts={accounts}
            projects={projects}
            users={users}
            onAdd={handleAddExpense}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
            onMarkPaid={handleMarkPaid}
            onRefresh={() => {}}
            onNavigate={handleNavigate}
            darkMode={darkMode}
            theme={theme}
          />
        )}

        {currentPage === 'tasks' && (
          <Tasks
            tasks={tasks}
            projects={projects}
            users={users}
            onAdd={handleAddTask}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onToggleStatus={handleToggleTaskStatus}
            onNavigate={handleNavigate}
            darkMode={darkMode}
            theme={theme}
          />
        )}

        {currentPage === 'projects' && (
          <Projects
            projects={projects}
            accounts={accounts}
            users={users}
            tasks={tasks}
            expenses={expenses}
            clients={clients}
            onAdd={handleAddProject}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
            onNavigate={handleNavigate}
            darkMode={darkMode}
            theme={theme}
          />
        )}

        {currentPage === 'accounts' && (
          <Accounts
            accounts={accounts}
            expenses={expenses}
            projects={projects}
            onAdd={handleAddAccount}
            onEdit={handleEditAccount}
            onDelete={handleDeleteAccount}
            onNavigate={handleNavigate}
            darkMode={darkMode}
            theme={theme}
          />
        )}

        {currentPage === 'users' && (
          <UsersComponent
            users={users}
            projects={projects}
            tasks={tasks}
            expenses={expenses}
            onAdd={handleAddUser}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onNavigate={handleNavigate}
            darkMode={darkMode}
            theme={theme}
          />
        )}

        {currentPage === 'resources' && (
          <Resources
            clients={clients}
            suppliers={suppliers}
            documents={documents}
            materials={materials}
            equipment={equipment}
            projects={projects}
            accounts={accounts}
            users={users}
            expenses={expenses}
            onAddClient={handleAddClient}
            onEditClient={handleEditClient}
            onDeleteClient={handleDeleteClient}
            onAddSupplier={handleAddSupplier}
            onEditSupplier={handleEditSupplier}
            onDeleteSupplier={handleDeleteSupplier}
            onAddDocument={handleAddDocument}
            onEditDocument={handleEditDocument}
            onDeleteDocument={handleDeleteDocument}
            onAddMaterial={handleAddMaterial}
            onEditMaterial={handleEditMaterial}
            onDeleteMaterial={handleDeleteMaterial}
            onAddEquipment={handleAddEquipment}
            onEditEquipment={handleEditEquipment}
            onDeleteEquipment={handleDeleteEquipment}
            onNavigate={handleNavigate}
            darkMode={darkMode}
            theme={theme}
          />
        )}
      </main>
    </div>
  );
}

export default App;
