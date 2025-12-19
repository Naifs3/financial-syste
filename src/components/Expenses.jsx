// src/components/Expenses.jsx
import React, { useState } from 'react';
import { Receipt, Plus, Search, Filter, Edit, Trash2, CheckCircle, RefreshCw } from 'lucide-react';
import { calcDaysRemaining, getStatusColorByDays, formatNumber } from '../utils/helpers';
import { STATUS_COLORS } from '../config/constants';

const Expenses = ({ expenses, onAdd, onEdit, onDelete, onMarkPaid, onRefresh, darkMode, txt, txtSm, card, accentGradient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // تصفية المصروفات
  const filteredExpenses = expenses.filter(expense => {
    const matchSearch = expense.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || expense.type === filterType;
    const matchStatus = filterStatus === 'all' || expense.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  // حساب الإحصائيات
  const monthlyTotal = expenses.filter(e => e.type === 'monthly').reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const yearlyTotal = expenses.filter(e => e.type === 'yearly').reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const unpaidCount = expenses.filter(e => e.status === 'غير مدفوع').length;

  return (
    <div className="p-4 space-y-6 pb-20 md:pb-6">
      {/* العنوان */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${txt} flex items-center gap-2`}>
            <Receipt className="w-6 h-6" />
            المصروفات
          </h2>
          <p className={`text-sm ${txtSm} mt-1`}>إدارة المصروفات الشهرية والسنوية</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${txt} transition-colors flex items-center gap-2`}
          >
            <RefreshCw className="w-4 h-4" />
            تحديث
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className={`px-4 py-2 rounded-xl bg-gradient-to-r ${accentGradient} text-white transition-all hover:opacity-90 flex items-center gap-2`}
          >
            <Plus className="w-4 h-4" />
            إضافة مصروف
          </button>
        </div>
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`${card} p-4 rounded-xl border ${darkMode ? 'border-blue-500/30' : 'border-blue-200'} bg-blue-500/10`}>
          <p className={`text-sm ${txtSm} mb-1`}>المصروفات الشهرية</p>
          <p className="text-2xl font-bold text-blue-400">{formatNumber(monthlyTotal)} ريال</p>
        </div>
        <div className={`${card} p-4 rounded-xl border ${darkMode ? 'border-green-500/30' : 'border-green-200'} bg-green-500/10`}>
          <p className={`text-sm ${txtSm} mb-1`}>المصروفات السنوية</p>
          <p className="text-2xl font-bold text-green-400">{formatNumber(yearlyTotal)} ريال</p>
        </div>
        <div className={`${card} p-4 rounded-xl border ${darkMode ? 'border-orange-500/30' : 'border-orange-200'} bg-orange-500/10`}>
          <p className={`text-sm ${txtSm} mb-1`}>غير مدفوع</p>
          <p className="text-2xl font-bold text-orange-400">{unpaidCount}</p>
        </div>
      </div>

      {/* البحث والتصفية */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${txtSm}`} />
          <input
            type="text"
            placeholder="بحث في المصروفات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pr-10 pl-4 py-2 rounded-xl border ${
              darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className={`px-4 py-2 rounded-xl border ${
            darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="all">كل الأنواع</option>
          <option value="monthly">شهري</option>
          <option value="yearly">سنوي</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`px-4 py-2 rounded-xl border ${
            darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="all">كل الحالات</option>
          <option value="مدفوع">مدفوع</option>
          <option value="غير مدفوع">غير مدفوع</option>
        </select>
      </div>

      {/* قائمة المصروفات */}
      {filteredExpenses.length === 0 ? (
        <div className={`${card} p-12 rounded-2xl text-center border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <Receipt className={`w-16 h-16 mx-auto mb-4 ${txtSm}`} />
          <p className={`${txt} font-bold mb-2`}>لا توجد مصروفات</p>
          <p className={`${txtSm} text-sm`}>ابدأ بإضافة أول مصروف</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredExpenses.map((expense) => {
            const days = calcDaysRemaining(expense.dueDate);
            const statusColor = getStatusColorByDays(days);
            const colors = STATUS_COLORS[statusColor];
            
            return (
              <div
                key={expense.id}
                className={`${card} p-5 rounded-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-all`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className={`font-bold ${txt} text-lg mb-1`}>{expense.name}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-1 rounded ${
                        expense.type === 'monthly' 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {expense.type === 'monthly' ? 'شهري' : 'سنوي'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${colors.badge}`}>
                        {expense.status}
                      </span>
                      {expense.refNumber && (
                        <span className={`text-xs ${txtSm}`}>#{expense.refNumber}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {expense.status === 'غير مدفوع' && (
                      <button
                        onClick={() => onMarkPaid(expense.id)}
                        className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                        title="وضع علامة كمدفوع"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(expense)}
                      className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${txt} transition-colors`}
                      title="تعديل"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${txtSm}`}>المبلغ:</span>
                    <span className={`font-bold ${txt}`}>{formatNumber(expense.amount)} ريال</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${txtSm}`}>تاريخ الاستحقاق:</span>
                    <span className={`text-sm ${txt}`}>{expense.dueDate}</span>
                  </div>
                  {days !== null && (
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${txtSm}`}>الأيام المتبقية:</span>
                      <span className={`text-sm font-bold ${colors.text}`}>
                        {days < 0 ? `متأخر ${Math.abs(days)} يوم` : `${days} يوم`}
                      </span>
                    </div>
                  )}
                  {expense.notes && (
                    <div className={`text-xs ${txtSm} mt-2 p-2 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                      {expense.notes}
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

export default Expenses;
```

