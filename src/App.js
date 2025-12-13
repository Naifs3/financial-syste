بالتأكيد. لقد قمت بدمج وإكمال الكود الذي أرسلته سابقاً، مع إضافة الأجزاء المفقودة في نهاية ملف الـ Modal لجعله يعمل بشكل صحيح.

**تنبيه أمني هام جداً:**

كما ذكرت في المراجعة السابقة، هذا الكود **غير آمن** إذا استخدمته ببيانات حقيقية. يتم تخزين جميع أسماء المستخدمين وكلمات المرور الخاصة بك (بما في ذلك حسابات AWS و GitHub في مصفوفة `accounts`) **مكشوفة داخل الكود**، ويمكن لأي شخص يفتح الموقع رؤيتها.

**لتشغيله على الإنترنت، يجب عليك تغيير كلمات المرور والبيانات الحساسة في مصفوفة `users` و `accounts` أو نقلها إلى بيئة خلفية آمنة.**

-----

### الكود الكامل والمُصلَح (React Component)

```javascript
import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, CheckSquare, Users, Moon, Sun, Eye, EyeOff, Plus, Archive, Clock, AlertCircle, Activity } from 'lucide-react';

const AccountCard = ({ account, cardClass }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className={`${cardClass} p-6 rounded-lg border`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold mb-1">{account.name}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{account.description}</p>
        </div>
        <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{account.id}</span>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">رابط الدخول:</label>
          <a href={account.loginUrl} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline text-sm">
            {account.loginUrl}
          </a>
        </div>
        
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">اسم المستخدم:</label>
          <p className="font-mono text-sm">{account.username}</p>
        </div>
        
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">كلمة المرور:</label>
          <div className="flex items-center gap-2">
            <p className="font-mono flex-1 text-sm">{showPassword ? account.password : '••••••••••••'}</p>
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between text-sm">
            <span>تاريخ الاشتراك: {account.subscriptionDate}</span>
            <span className="font-bold text-green-600">{account.daysRemaining} يوم متبقي</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function FinancialManagementSystem() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [currentView, setCurrentView] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [users] = useState([
    { id: 1, username: 'نايف', password: '123456', role: 'owner' },
    { id: 2, username: 'منوّر', password: '123456', role: 'owner' }
  ]);
  
  const [expenses, setExpenses] = useState([
    { 
      id: 'EXP001', 
      name: 'استضافة الموقع', 
      amount: 500, 
      currency: 'ريال', 
      dueDate: '2025-12-15', 
      type: 'شهري', 
      reason: 'استضافة موقع الشركة', 
      paymentLink: 'https://example.com', 
      status: 'قيد الانتظار' 
    },
    { 
      id: 'EXP002', 
      name: 'اشتراك Adobe', 
      amount: 200, 
      currency: 'ريال', 
      dueDate: '2025-12-20', 
      type: 'شهري', 
      reason: 'برامج التصميم', 
      paymentLink: 'https://adobe.com', 
      status: 'قيد الانتظار' 
    },
    { 
      id: 'EXP003', 
      name: 'ترخيص البرنامج', 
      amount: 3000, 
      currency: 'ريال', 
      dueDate: '2025-12-11', 
      type: 'سنوي', 
      reason: 'تجديد ترخيص سنوي', 
      status: 'قيد الانتظار' 
    }
  ]);
  
  const [tasks, setTasks] = useState([
    { 
      id: 'TASK001', 
      title: 'مراجعة التقارير الشهرية', 
      description: 'مراجعة جميع التقارير المالية', 
      type: 'شهري', 
      dueDate: '2025-12-10', 
      assignedTo: 'نايف', 
      priority: 'عالية', 
      status: 'قيد التنفيذ', 
      updates: [] 
    },
    { 
      id: 'TASK002', 
      title: 'تحديث قاعدة البيانات', 
      description: 'نسخ احتياطي أسبوعي', 
      type: 'أسبوعي', 
      dueDate: '2025-12-14', 
      assignedTo: 'منوّر', 
      priority: 'متوسطة', 
      status: 'قيد الانتظار', 
      updates: [] 
    }
  ]);
  
  const [accounts] = useState([
    { 
      id: 'ACC001', 
      name: 'حساب AWS', 
      description: 'استضافة السحابية', 
      loginUrl: 'https://aws.amazon.com', 
      username: 'admin@company.com', 
      password: 'encrypted_pass123', 
      subscriptionDate: '2025-01-01', 
      daysRemaining: 387 
    },
    { 
      id: 'ACC002', 
      name: 'حساب GitHub', 
      description: 'إدارة الأكواد', 
      loginUrl: 'https://github.com', 
      username: 'company_dev', 
      password: 'encrypted_pass456', 
      subscriptionDate: '2025-06-01', 
      daysRemaining: 174 
    }
  ]);
  
  const [auditLog, setAuditLog] = useState([]);
  const [archivedExpenses, setArchivedExpenses] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const addAuditLog = (action, description) => {
    const log = {
      id: `LOG${Date.now()}`,
      user: currentUser?.username || 'غير معروف',
      action,
      description,
      timestamp: new Date().toISOString()
    };
    setAuditLog(prev => [log, ...prev]);
  };

  const calculateDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  };

  const getColorByDays = (days) => {
    if (days < 0) return 'bg-red-600 text-white';
    if (days < 7) return 'bg-red-500 text-white';
    if (days < 15) return 'bg-orange-500 text-white';
    return 'bg-green-500 text-white';
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      addAuditLog('تسجيل دخول', `${username} قام بتسجيل الدخول`);
    } else {
      alert('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  const handleLogout = () => {
    addAuditLog('تسجيل خروج', `${currentUser.username} قام بتسجيل الخروج`);
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const archiveExpense = (expense) => {
    setExpenses(prev => prev.filter(e => e.id !== expense.id));
    setArchivedExpenses(prev => [...prev, { 
      ...expense, 
      archivedAt: new Date().toISOString(), 
      archivedBy: currentUser.username 
    }]);
    addAuditLog('أرشفة مصروف', `تم أرشفة المصروف: ${expense.name}`);
    setShowModal(false);
  };

  const restoreExpense = (expense) => {
    setArchivedExpenses(prev => prev.filter(e => e.id !== expense.id));
    setExpenses(prev => [...prev, expense]);
    addAuditLog('استعادة مصروف', `تم استعادة المصروف: ${expense.name}`);
  };

  const markAsPaid = (id) => {
    setExpenses(prev => prev.map(e => 
      e.id === id ? { ...e, status: 'مدفوع' } : e
    ));
    addAuditLog('تحديث حالة', `تم تعليم المصروف ${id} كمدفوع`);
  };

  const updateTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    const update = {
      timestamp: new Date().toISOString(),
      user: currentUser.username,
      note: 'تم التحديث'
    };
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, updates: [...t.updates, update] } : t
    ));
    addAuditLog('تحديث مهمة', `تم تحديث المهمة: ${task.title}`);
  };

  const calculateKPIs = () => {
    const today = new Date();
    const todayExpenses = expenses
      .filter(e => new Date(e.dueDate).toDateString() === today.toDateString())
      .reduce((sum, e) => sum + e.amount, 0);
    
    const monthExpenses = expenses
      .filter(e => new Date(e.dueDate).getMonth() === today.getMonth())
      .reduce((sum, e) => sum + e.amount, 0);
    
    const overdueTasks = tasks
      .filter(t => calculateDaysRemaining(t.dueDate) < 0 && t.status !== 'مكتملة')
      .length;
    
    return { todayExpenses, monthExpenses, overdueTasks };
  };

  const kpis = calculateKPIs();

  const fontSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const bgClass = darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';
  const cardClass = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const inputClass = darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300';

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bgClass} ${fontSizes[fontSize]}`} dir="rtl">
        <div className={`${cardClass} p-8 rounded-lg shadow-xl w-full max-w-md border`}>
          <div className="text-center mb-8">
            <DollarSign className="w-16 h-16 mx-auto mb-4 text-blue-500" />
            <h1 className="text-3xl font-bold">نظام الإدارة المالية</h1>
            <p className="text-gray-500 mt-2">تسجيل الدخول للنظام</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">اسم المستخدم</label>
              <input
                type="text"
                name="username"
                className={`w-full p-3 border rounded-lg ${inputClass}`}
                placeholder="أدخل اسم المستخدم"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">كلمة المرور</label>
              <input
                type="password"
                name="password"
                className={`w-full p-3 border rounded-lg ${inputClass}`}
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700"
            >
              دخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass} ${fontSizes[fontSize]}`} dir="rtl">
      <div className={`${cardClass} border-b px-6 py-4 flex flex-wrap items-center justify-between sticky top-0 z-50 gap-4`}>
        <div className="flex items-center gap-4">
          <DollarSign className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold">نظام الإدارة المالية</h1>
            <p className="text-xs md:text-sm text-gray-500">
              {currentTime.toLocaleDateString('ar-SA', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })} - {currentTime.toLocaleTimeString('ar-SA')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <span className="font-medium text-sm md:text-base">{currentUser.username}</span>
          
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className={`p-2 rounded-lg border ${inputClass} text-sm`}
          >
            <option value="small">صغير</option>
            <option value="medium">متوسط</option>
            <option value="large">كبير</option>
          </select>
          
          <button 
            onClick={handleLogout} 
            className="px-3 md:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
          >
            خروج
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className={`w-full md:w-64 ${cardClass} border-b md:border-l p-4`}>
          <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center gap-3 p-3 rounded-lg whitespace-nowrap ${
                currentView === 'dashboard' 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Activity className="w-5 h-5" />
              <span className="text-sm md:text-base">لوحة التحكم</span>
            </button>
            
            <button
              onClick={() => setCurrentView('expenses')}
              className={`flex items-center gap-3 p-3 rounded-lg whitespace-nowrap ${
                currentView === 'expenses' 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <DollarSign className="w-5 h-5" />
              <span className="text-sm md:text-base">المصروفات</span>
            </button>
            
            <button
              onClick={() => setCurrentView('tasks')}
              className={`flex items-center gap-3 p-3 rounded-lg whitespace-nowrap ${
                currentView === 'tasks' 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <CheckSquare className="w-5 h-5" />
              <span className="text-sm md:text-base">المهام</span>
            </button>
            
            <button
              onClick={() => setCurrentView('accounts')}
              className={`flex items-center gap-3 p-3 rounded-lg whitespace-nowrap ${
                currentView === 'accounts' 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="text-sm md:text-base">الحسابات</span>
            </button>
            
            <button
              onClick={() => setCurrentView('archive')}
              className={`flex items-center gap-3 p-3 rounded-lg whitespace-nowrap ${
                currentView === 'archive' 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Archive className="w-5 h-5" />
              <span className="text-sm md:text-base">الأرشيف</span>
            </button>
            
            <button
              onClick={() => setCurrentView('audit')}
              className={`flex items-center gap-3 p-3 rounded-lg whitespace-nowrap ${
                currentView === 'audit' 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="text-sm md:text-base">السجل</span>
            </button>
          </nav>
        </div>

        <div className="flex-1 p-4 md:p-6">
          {currentView === 'dashboard' && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">لوحة التحكم</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                <div className={`${cardClass} p-6 rounded-lg border`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 mb-2">مصروفات اليوم</p>
                      <p className="text-2xl md:text-3xl font-bold">{kpis.todayExpenses} ريال</p>
                    </div>
                    <DollarSign className="w-10 h-10 md:w-12 md:h-12 text-blue-500" />
                  </div>
                </div>
                
                <div className={`${cardClass} p-6 rounded-lg border`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 mb-2">مصروفات الشهر</p>
                      <p className="text-2xl md:text-3xl font-bold">{kpis.monthExpenses} ريال</p>
                    </div>
                    <Calendar className="w-10 h-10 md:w-12 md:h-12 text-green-500" />
                  </div>
                </div>
                
                <div className={`${cardClass} p-6 rounded-lg border`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 mb-2">مهام متأخرة</p>
                      <p className="text-2xl md:text-3xl font-bold">{kpis.overdueTasks}</p>
                    </div>
                    <AlertCircle className="w-10 h-10 md:w-12 md:h-12 text-red-500" />
                  </div>
                </div>
              </div>

              <div className={`${cardClass} p-6 rounded-lg border`}>
                <h3 className="text-xl font-bold mb-4">المصروفات القادمة</h3>
                <div className="space-y-3">
                  {expenses
                    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                    .slice(0, 5)
                    .map(expense => {
                      const days = calculateDaysRemaining(expense.dueDate);
                      return (
                        <div key={expense.id} className={`p-4 rounded-lg ${getColorByDays(days)}`}>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-bold">{expense.name}</p>
                              <p className="text-sm opacity-90">{expense.amount} {expense.currency}</p>
                            </div>
                            <div className="text-left">
                              <p className="font-bold">{days < 0 ? 'متجاوز!' : `${days} يوم`}</p>
                              <p className="text-sm opacity-90">{expense.dueDate}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {currentView === 'expenses' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">المصروفات</h2>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-blue-700 text-sm md:text-base">
                  <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  <span>إضافة</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {expenses
                  .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                  .map(expense => {
                    const days = calculateDaysRemaining(expense.dueDate);
                    return (
                      <div key={expense.id} className={`${cardClass} p-4 md:p-6 rounded-lg border`}>
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                                {expense.id}
                              </span>
                              <h3 className="text-lg md:text-xl font-bold">{expense.name}</h3>
                              <span className={`text-xs px-2 py-1 rounded ${
                                expense.type === 'شهري' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {expense.type}
                              </span>
                            </div>
                            <p className="text-xl md:text-2xl font-bold text-blue-600 mb-2">
                              {expense.amount} {expense.currency}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {expense.reason}
                            </p>
                            <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm">
                              <span>الاستحقاق: {expense.dueDate}</span>
                              <span className={`font-bold ${
                                days < 0 
                                  ? 'text-red-600' 
                                  : days < 7 
                                  ? 'text-orange-600' 
                                  : 'text-green-600'
                              }`}>
                                {days < 0 ? 'متجاوز!' : `${days} يوم`}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex md:flex-col gap-2">
                            {expense.status !== 'مدفوع' && (
                              <button
                                onClick={() => markAsPaid(expense.id)}
                                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                title="مدفوع"
                              >
                                <CheckSquare className="w-5 h-5" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setSelectedItem(expense);
                                setModalType('deleteExpense');
                                setShowModal(true);
                              }}
                              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                              title="أرشفة"
                            >
                              <Archive className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {currentView === 'tasks' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">المهام</h2>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                  <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  <span>إضافة</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {tasks.map(task => {
                  const days = calculateDaysRemaining(task.dueDate);
                  return (
                    <div key={task.id} className={`${cardClass} p-4 md:p-6 rounded-lg border`}>
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                              {task.id}
                            </span>
                            <h3 className="text-lg md:text-xl font-bold">{task.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded ${
                              task.priority === 'عالية' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {task.description}
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                            <span>النوع: {task.type}</span>
                            <span>المسؤول: {task.assignedTo}</span>
                            <span>الاستحقاق: {task.dueDate}</span>
                            <span className={`font-bold ${
                              days < 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {days < 0 ? `متأخر ${Math.abs(days)} يوم` : `${days} يوم متبقي`}
                            </span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => updateTask(task.id)}
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 self-start"
                          title="تحديث"
                        >
                          <Clock className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {task.updates.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <h4 className="font-bold mb-2 text-sm">التحديثات:</h4>
                          <div className="space-y-2">
                            {task.updates.map((update, idx) => (
                              <div key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded">
                                {update.user} - {new Date(update.timestamp).toLocaleString('ar-SA')}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentView === 'accounts' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">الحسابات</h2>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                  <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  <span>إضافة</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {accounts.map(account => (
                  <AccountCard key={account.id} account={account} cardClass={cardClass} />
                ))}
              </div>
            </div>
          )}

          {currentView === 'archive' && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">الأرشيف</h2>
              
              <div>
                <h3 className="text-xl font-bold mb-4">المصروفات المؤرشفة</h3>
                {archivedExpenses.length === 0 ? (
                  <p className="text-gray-500">لا توجد مصروفات مؤرشفة</p>
                ) : (
                  <div className="space-y-3">
                    {archivedExpenses.map(expense => (
                      <div key={expense.id} className={`${cardClass} p-4 rounded-lg border`}>
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div>
                            <h4 className="font-bold">{expense.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              أرشف بواسطة {expense.archivedBy} في{' '}
                              {new Date(expense.archivedAt).toLocaleString('ar-SA')}
                            </p>
                          </div>
                          <button
                            onClick={() => restoreExpense(expense)}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                          >
                            استعادة
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentView === 'audit' && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">سجل الأنشطة</h2>
              
              <div className={`${cardClass} rounded-lg border overflow-hidden`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        <th className="p-4 text-right text-sm md:text-base">الوقت</th>
                        <th className="p-4 text-right text-sm md:text-base">المستخدم</th>
                        <th className="p-4 text-right text-sm md:text-base">الإجراء</th>
                        <th className="p-4 text-right text-sm md:text-base">الوصف</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLog.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="p-4 text-center text-gray-500">
                            لا توجد أنشطة مسجلة
                          </td>
                        </tr>
                      ) : (
                        auditLog.map((log, idx) => (
                          <tr 
                            key={log.id} 
                            className={idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}
                          >
                            <td className="p-4 text-xs md:text-sm">
                              {new Date(log.timestamp).toLocaleString('ar-SA')}
                            </td>
                            <td className="p-4 font-medium text-sm md:text-base">
                              {log.user}
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs md:text-sm">
                                {log.action}
                              </span>
                            </td>
                            <td className="p-4 text-xs md:text-sm">
                              {log.description}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${cardClass} p-6 rounded-lg max-w-md w-full`}>
            {modalType === 'deleteExpense' && (
              <>
                <h3 className="text-xl font-bold mb-4">تأكيد الأرشفة</h3>
                <p className="mb-6">
                  هل أنت متأكد من أرشفة المصروف "{selectedItem?.name}"؟
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowModal(false)} // تم إصلاح الجزء المبتور
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={() => archiveExpense(selectedItem)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    تأكيد الأرشفة
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```
