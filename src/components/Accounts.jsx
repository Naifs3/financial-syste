// src/components/Accounts.jsx
import React, { useState } from 'react';
import { Shield, Plus, Search, Edit, Trash2, Eye, EyeOff, Copy, ExternalLink, Tag } from 'lucide-react';
import { decrypt, calcDaysRemaining, getStatusColorByDays, copyToClipboard } from '../utils/helpers';
import { STATUS_COLORS } from '../config/constants';

const Accounts = ({ accounts, categories, onAdd, onEdit, onDelete, onAddCategory, onDeleteCategory, darkMode, txt, txtSm, card, accentGradient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showPasswords, setShowPasswords] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // تصفية الحسابات
  const filteredAccounts = accounts.filter(account => {
    const matchSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory === 'all' || account.categoryId === filterCategory;
    return matchSearch && matchCategory;
  });

  // حساب الإحصائيات
  const totalAccounts = accounts.length;
  const expiredAccounts = accounts.filter(a => {
    if (!a.expiryDate) return false;
    const days = calcDaysRemaining(a.expiryDate);
    return days !== null && days < 0;
  }).length;
  const expiringSoon = accounts.filter(a => {
    if (!a.expiryDate) return false;
    const days = calcDaysRemaining(a.expiryDate);
    return days !== null && days >= 0 && days <= 30;
  }).length;

  // نسخ إلى الحافظة
  const handleCopy = async (text, field) => {
    const success = await copyToClipboard(text);
    if (success) {
      // يمكن إضافة إشعار هنا
    }
  };

  // إظهار/إخفاء كلمة المرور
  const togglePasswordVisibility = (accountId) => {
    setShowPasswords(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }));
  };

  return (
    <div className="p-4 space-y-6 pb-20 md:pb-6">
      {/* العنوان */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${txt} flex items-center gap-2`}>
            <Shield className="w-6 h-6" />
            الحسابات
          </h2>
          <p className={`text-sm ${txtSm} mt-1`}>إدارة الحسابات المشفرة</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCategoryModal(true)}
            className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${txt} transition-colors flex items-center gap-2`}
          >
            <Tag className="w-4 h-4" />
            الفئات
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className={`px-4 py-2 rounded-xl bg-gradient-to-r ${accentGradient} text-white transition-all hover:opacity-90 flex items-center gap-2`}
          >
            <Plus className="w-4 h-4" />
            إضافة حساب
          </button>
        </div>
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`${card} p-4 rounded-xl border ${darkMode ? 'border-blue-500/30' : 'border-blue-200'} bg-blue-500/10`}>
          <p className={`text-sm ${txtSm} mb-1`}>إجمالي الحسابات</p>
          <p className="text-2xl font-bold text-blue-400">{totalAccounts}</p>
        </div>
        <div className={`${card} p-4 rounded-xl border ${darkMode ? 'border-red-500/30' : 'border-red-200'} bg-red-500/10`}>
          <p className={`text-sm ${txtSm} mb-1`}>منتهية الصلاحية</p>
          <p className="text-2xl font-bold text-red-400">{expiredAccounts}</p>
        </div>
        <div className={`${card} p-4 rounded-xl border ${darkMode ? 'border-orange-500/30' : 'border-orange-200'} bg-orange-500/10`}>
          <p className={`text-sm ${txtSm} mb-1`}>تنتهي قريباً</p>
          <p className="text-2xl font-bold text-orange-400">{expiringSoon}</p>
        </div>
      </div>

      {/* التنبيهات */}
      {(expiredAccounts > 0 || expiringSoon > 0) && (
        <div className={`${card} p-4 rounded-xl border border-orange-500/30 bg-orange-500/10`}>
          <h3 className={`font-bold ${txt} mb-2 flex items-center gap-2`}>
            <Shield className="w-5 h-5 text-orange-400" />
            تنبيهات الحسابات
          </h3>
          <div className="space-y-1">
            {expiredAccounts > 0 && (
              <p className={`text-sm text-red-400`}>• {expiredAccounts} حساب منتهي الصلاحية</p>
            )}
            {expiringSoon > 0 && (
              <p className={`text-sm text-orange-400`}>• {expiringSoon} حساب ينتهي خلال 30 يوم</p>
            )}
          </div>
        </div>
      )}

      {/* البحث والتصفية */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${txtSm}`} />
          <input
            type="text"
            placeholder="بحث في الحسابات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pr-10 pl-4 py-2 rounded-xl border ${
              darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className={`px-4 py-2 rounded-xl border ${
            darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="all">كل الفئات</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* قائمة الحسابات */}
      {filteredAccounts.length === 0 ? (
        <div className={`${card} p-12 rounded-2xl text-center border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <Shield className={`w-16 h-16 mx-auto mb-4 ${txtSm}`} />
          <p className={`${txt} font-bold mb-2`}>لا توجد حسابات</p>
          <p className={`${txtSm} text-sm`}>ابدأ بإضافة أول حساب</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredAccounts.map((account) => {
            const category = categories.find(c => c.id === account.categoryId);
            const days = account.expiryDate ? calcDaysRemaining(account.expiryDate) : null;
            const statusColor = days !== null ? getStatusColorByDays(days) : 'gray';
            const colors = STATUS_COLORS[statusColor];
            const showPassword = showPasswords[account.id];
            
            return (
              <div
                key={account.id}
                className={`${card} p-5 rounded-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-all`}
              >
                {/* رأس الحساب */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className={`font-bold ${txt} text-lg mb-1`}>{account.name}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      {category && (
                        <span className={`text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-400`}>
                          {category.name}
                        </span>
                      )}
                      {account.refNumber && (
                        <span className={`text-xs ${txtSm}`}>#{account.refNumber}</span>
                      )}
                      {days !== null && (
                        <span className={`text-xs px-2 py-1 rounded ${colors.badge}`}>
                          {days < 0 ? `منتهي` : days === 0 ? 'ينتهي اليوم' : `${days} يوم`}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(account)}
                      className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${txt} transition-colors`}
                      title="تعديل"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(account.id)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* بيانات الحساب */}
                <div className="space-y-3">
                  {/* اسم المستخدم */}
                  <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} p-3 rounded-xl`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs ${txtSm}`}>اسم المستخدم</span>
                      <button
                        onClick={() => handleCopy(decrypt(account.username), 'username')}
                        className={`p-1 rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} transition-colors`}
                        title="نسخ"
                      >
                        <Copy className={`w-3 h-3 ${txtSm}`} />
                      </button>
                    </div>
                    <p className={`text-sm font-mono ${txt}`}>{decrypt(account.username)}</p>
                  </div>

                  {/* كلمة المرور */}
                  <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} p-3 rounded-xl`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs ${txtSm}`}>كلمة المرور</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => togglePasswordVisibility(account.id)}
                          className={`p-1 rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} transition-colors`}
                          title={showPassword ? 'إخفاء' : 'إظهار'}
                        >
                          {showPassword ? <EyeOff className={`w-3 h-3 ${txtSm}`} /> : <Eye className={`w-3 h-3 ${txtSm}`} />}
                        </button>
                        <button
                          onClick={() => handleCopy(decrypt(account.password), 'password')}
                          className={`p-1 rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} transition-colors`}
                          title="نسخ"
                        >
                          <Copy className={`w-3 h-3 ${txtSm}`} />
                        </button>
                      </div>
                    </div>
                    <p className={`text-sm font-mono ${txt}`}>
                      {showPassword ? decrypt(account.password) : '••••••••'}
                    </p>
                  </div>

                  {/* الرابط */}
                  {account.url && (
                    <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} p-3 rounded-xl`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs ${txtSm}`}>الرابط</span>
                        <div className="flex gap-1">
                          
                            href={account.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-1 rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} transition-colors`}
                            title="فتح"
                          >
                            <ExternalLink className={`w-3 h-3 ${txtSm}`} />
                          </a>
                          <button
                            onClick={() => handleCopy(account.url, 'url')}
                            className={`p-1 rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} transition-colors`}
                            title="نسخ"
                          >
                            <Copy className={`w-3 h-3 ${txtSm}`} />
                          </button>
                        </div>
                      </div>
                      <p className={`text-sm ${txt} truncate`}>{account.url}</p>
                    </div>
                  )}

                  {/* معلومات إضافية */}
                  <div className="grid grid-cols-2 gap-2">
                    {account.subscriptionType && (
                      <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} p-2 rounded-xl`}>
                        <p className={`text-xs ${txtSm}`}>نوع الاشتراك</p>
                        <p className={`text-sm font-bold ${txt}`}>{account.subscriptionType}</p>
                      </div>
                    )}
                    {account.expiryDate && (
                      <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} p-2 rounded-xl`}>
                        <p className={`text-xs ${txtSm}`}>تاريخ الانتهاء</p>
                        <p className={`text-sm font-bold ${txt}`}>{account.expiryDate}</p>
                      </div>
                    )}
                  </div>

                  {/* الملاحظات */}
                  {account.notes && (
                    <div className={`text-xs ${txtSm} p-2 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                      {account.notes}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Accounts;
```

---
