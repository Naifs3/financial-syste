// src/components/Expenses.jsx
import React, { useState } from 'react';
import { 
  Receipt, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle, 
  RefreshCw,
  Calendar,
  CreditCard,
  AlertTriangle,
  Filter,
  X
} from 'lucide-react';
import { calcDaysRemaining, getStatusColorByDays, formatNumber } from '../utils/helpers';

const Expenses = ({ expenses, onAdd, onEdit, onDelete, onMarkPaid, onRefresh, darkMode, theme }) => {
  const t = theme;
  const colorKeys = t.colorKeys || Object.keys(t.colors);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredExpenses = expenses.filter(expense => {
    const matchSearch = expense.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || expense.type === filterType;
    const matchStatus = filterStatus === 'all' || expense.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const monthlyTotal = expenses.filter(e => e.type === 'monthly').reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const yearlyTotal = expenses.filter(e => e.type === 'yearly').reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const unpaidCount = expenses.filter(e => e.status === 'غير مدفوع').length;

  // دالة للحصول على لون الحالة
  const getStatusStyle = (days) => {
    if (days === null) return { bg: t.status.info.bg, text: t.status.info.text, border: t.status.info.border };
    if (days < 0) return { bg: t.status.danger.bg, text: t.status.danger.text, border: t.status.danger.border };
    if (days <= 7) return { bg: t.status.warning.bg, text: t.status.warning.text, border: t.status.warning.border };
    return { bg: t.status.success.bg, text: t.status.success.text, border: t.status.success.border };
  };

  // البطاقات الإحصائية
  const statCards = [
    { 
      label: 'المصروفات الشهرية', 
      value: `${formatNumber(monthlyTotal)} ريال`,
      colorKey: colorKeys[0]
    },
    { 
      label: 'المصروفات السنوية', 
      value: `${formatNumber(yearlyTotal)} ريال`,
      colorKey: colorKeys[1]
    },
    { 
      label: 'غير مدفوع', 
      value: unpaidCount,
      colorKey: colorKeys[2]
    },
  ];

  return (
    <div style={{ padding: 16, paddingBottom: 80 }}>
      
      {/* ═══════════════ العنوان والأزرار ═══════════════ */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 24,
      }}>
        <div>
          <h2 style={{ 
            fontSize: 24, 
            fontWeight: 700, 
            color: t.text.primary,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            margin: 0,
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: t.radius.lg,
              background: t.colors[colorKeys[0]]?.gradient || t.button.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: darkMode ? t.colors[colorKeys[0]]?.glow : 'none',
            }}>
              <Receipt size={22} color="#fff" />
            </div>
            المصروفات
          </h2>
          <p style={{ fontSize: 14, color: t.text.muted, marginTop: 6, marginRight: 50 }}>
            إدارة المصروفات الشهرية والسنوية
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onRefresh}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: t.radius.lg,
              border: `1px solid ${t.border.secondary}`,
              background: 'transparent',
              color: t.text.primary,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
              fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
          >
            <RefreshCw size={18} />
            تحديث
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: t.radius.lg,
              border: 'none',
              background: t.button.gradient,
              color: '#fff',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: 'inherit',
              boxShadow: t.button.glow,
              transition: 'all 0.2s',
            }}
          >
            <Plus size={18} />
            إضافة مصروف
          </button>
        </div>
      </div>

      {/* ═══════════════ البطاقات الإحصائية ═══════════════ */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 24,
      }}>
        {statCards.map((card, index) => {
          const color = t.colors[card.colorKey] || t.colors[colorKeys[0]];
          return (
            <div
              key={index}
              style={{
                background: t.bg.secondary,
                borderRadius: t.radius.xl,
                border: `1px solid ${color.main}30`,
                padding: 20,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute',
                top: -20,
                left: -20,
                width: 80,
                height: 80,
                background: `radial-gradient(circle, ${color.main}20 0%, transparent 70%)`,
                borderRadius: '50%',
              }} />
              <p style={{ fontSize: 13, color: t.text.muted, marginBottom: 8 }}>
                {card.label}
              </p>
              <p style={{ 
                fontSize: 24, 
                fontWeight: 700, 
                color: color.main,
                margin: 0,
                textShadow: darkMode ? `0 0 20px ${color.main}40` : 'none',
              }}>
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* ═══════════════ البحث والفلترة ═══════════════ */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
      }}>
        {/* حقل البحث */}
        <div style={{ flex: '1 1 250px', position: 'relative' }}>
          <Search 
            size={18} 
            style={{ 
              position: 'absolute', 
              right: 14, 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: t.text.muted,
            }} 
          />
          <input
            type="text"
            placeholder="بحث في المصروفات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 44px 12px 16px',
              borderRadius: t.radius.lg,
              border: `1px solid ${t.border.primary}`,
              background: t.bg.tertiary,
              color: t.text.primary,
              fontSize: 14,
              fontFamily: 'inherit',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
        
        {/* فلتر النوع */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            padding: '12px 16px',
            borderRadius: t.radius.lg,
            border: `1px solid ${t.border.primary}`,
            background: t.bg.tertiary,
            color: t.text.primary,
            fontSize: 14,
            fontFamily: 'inherit',
            cursor: 'pointer',
            minWidth: 130,
          }}
        >
          <option value="all">كل الأنواع</option>
          <option value="monthly">شهري</option>
          <option value="yearly">سنوي</option>
        </select>
        
        {/* فلتر الحالة */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '12px 16px',
            borderRadius: t.radius.lg,
            border: `1px solid ${t.border.primary}`,
            background: t.bg.tertiary,
            color: t.text.primary,
            fontSize: 14,
            fontFamily: 'inherit',
            cursor: 'pointer',
            minWidth: 130,
          }}
        >
          <option value="all">كل الحالات</option>
          <option value="مدفوع">مدفوع</option>
          <option value="غير مدفوع">غير مدفوع</option>
        </select>
      </div>

      {/* ═══════════════ قائمة المصروفات ═══════════════ */}
      {filteredExpenses.length === 0 ? (
        <div style={{
          background: t.bg.secondary,
          borderRadius: t.radius['2xl'],
          border: `1px solid ${t.border.primary}`,
          padding: 60,
          textAlign: 'center',
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: t.radius.xl,
            background: `${t.button.primary}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <Receipt size={40} color={t.text.muted} />
          </div>
          <p style={{ fontSize: 18, fontWeight: 700, color: t.text.primary, marginBottom: 8 }}>
            لا توجد مصروفات
          </p>
          <p style={{ fontSize: 14, color: t.text.muted }}>
            ابدأ بإضافة أول مصروف
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: 16,
        }}>
          {filteredExpenses.map((expense) => {
            const days = calcDaysRemaining(expense.dueDate);
            const statusStyle = getStatusStyle(days);
            const typeColor = expense.type === 'monthly' 
              ? t.colors[colorKeys[0]] 
              : t.colors[colorKeys[1]];
            
            return (
              <div
                key={expense.id}
                style={{
                  background: t.bg.secondary,
                  borderRadius: t.radius.xl,
                  border: `1px solid ${t.border.primary}`,
                  padding: 20,
                  transition: 'all 0.3s ease',
                }}
              >
                {/* الهيدر */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  justifyContent: 'space-between',
                  marginBottom: 16,
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontSize: 18, 
                      fontWeight: 700, 
                      color: t.text.primary,
                      margin: '0 0 10px 0',
                    }}>
                      {expense.name}
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {/* شارة النوع */}
                      <span style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: t.radius.md,
                        background: `${typeColor?.main}20`,
                        color: typeColor?.main,
                        border: `1px solid ${typeColor?.main}30`,
                      }}>
                        {expense.type === 'monthly' ? 'شهري' : 'سنوي'}
                      </span>
                      {/* شارة الحالة */}
                      <span style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: t.radius.md,
                        background: expense.status === 'مدفوع' ? t.status.success.bg : t.status.danger.bg,
                        color: expense.status === 'مدفوع' ? t.status.success.text : t.status.danger.text,
                        border: `1px solid ${expense.status === 'مدفوع' ? t.status.success.border : t.status.danger.border}`,
                      }}>
                        {expense.status}
                      </span>
                      {/* الرقم المرجعي */}
                      {expense.refNumber && (
                        <span style={{
                          fontSize: 11,
                          color: t.text.muted,
                        }}>
                          #{expense.refNumber}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* أزرار التحكم */}
                  <div style={{ display: 'flex', gap: 6 }}>
                    {expense.status === 'غير مدفوع' && (
                      <button
                        onClick={() => onMarkPaid(expense.id)}
                        title="وضع علامة كمدفوع"
                        style={{
                          padding: 8,
                          borderRadius: t.radius.md,
                          border: 'none',
                          background: t.status.success.bg,
                          color: t.status.success.text,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                        }}
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(expense)}
                      title="تعديل"
                      style={{
                        padding: 8,
                        borderRadius: t.radius.md,
                        border: 'none',
                        background: t.bg.tertiary,
                        color: t.text.primary,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(expense.id)}
                      title="حذف"
                      style={{
                        padding: 8,
                        borderRadius: t.radius.md,
                        border: 'none',
                        background: t.status.danger.bg,
                        color: t.status.danger.text,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* التفاصيل */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {/* المبلغ */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: t.bg.tertiary,
                    borderRadius: t.radius.md,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CreditCard size={16} color={t.text.muted} />
                      <span style={{ fontSize: 13, color: t.text.muted }}>المبلغ</span>
                    </div>
                    <span style={{ 
                      fontSize: 16, 
                      fontWeight: 700, 
                      color: t.text.primary,
                    }}>
                      {formatNumber(expense.amount)} ريال
                    </span>
                  </div>
                  
                  {/* تاريخ الاستحقاق */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: t.bg.tertiary,
                    borderRadius: t.radius.md,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Calendar size={16} color={t.text.muted} />
                      <span style={{ fontSize: 13, color: t.text.muted }}>تاريخ الاستحقاق</span>
                    </div>
                    <span style={{ fontSize: 14, color: t.text.primary }}>
                      {expense.dueDate}
                    </span>
                  </div>
                  
                  {/* الأيام المتبقية */}
                  {days !== null && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: statusStyle.bg,
                      borderRadius: t.radius.md,
                      border: `1px solid ${statusStyle.border}`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <AlertTriangle size={16} color={statusStyle.text} />
                        <span style={{ fontSize: 13, color: statusStyle.text }}>
                          {days < 0 ? 'متأخر' : 'الأيام المتبقية'}
                        </span>
                      </div>
                      <span style={{ 
                        fontSize: 14, 
                        fontWeight: 700, 
                        color: statusStyle.text,
                      }}>
                        {days < 0 ? `${Math.abs(days)} يوم` : `${days} يوم`}
                      </span>
                    </div>
                  )}
                  
                  {/* الملاحظات */}
                  {expense.notes && (
                    <div style={{
                      fontSize: 12,
                      color: t.text.muted,
                      padding: 12,
                      background: t.bg.tertiary,
                      borderRadius: t.radius.md,
                      lineHeight: 1.6,
                    }}>
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
