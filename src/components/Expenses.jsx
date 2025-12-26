// src/components/Expenses.jsx
import React, { useState } from 'react';
import { 
  Receipt, Plus, Search, Edit, Trash2, CheckCircle, RefreshCw,
  Calendar, AlertTriangle, X, Save
} from 'lucide-react';
import { calcDaysRemaining, formatNumber, generateCode } from '../utils/helpers';

const Expenses = ({ expenses, accounts = [], onAdd, onEdit, onDelete, onMarkPaid, onRefresh, darkMode, theme }) => {
  const t = theme;
  const colorKeys = t.colorKeys || Object.keys(t.colors);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const emptyForm = {
    name: '', amount: '', type: 'monthly', dueDate: '',
    status: 'غير مدفوع', accountId: '', notes: '', code: ''
  };
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // الفلترة
  const filteredExpenses = expenses.filter(expense => {
    const matchSearch = expense.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       expense.code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || expense.type === filterType;
    const matchStatus = filterStatus === 'all' || expense.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  // الإحصائيات
  const monthlyTotal = expenses.filter(e => e.type === 'monthly').reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const yearlyTotal = expenses.filter(e => e.type === 'yearly').reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const unpaidCount = expenses.filter(e => e.status === 'غير مدفوع').length;

  const getStatusStyle = (days) => {
    if (days === null) return { bg: t.status.info.bg, text: t.status.info.text, border: t.status.info.border };
    if (days < 0) return { bg: t.status.danger.bg, text: t.status.danger.text, border: t.status.danger.border };
    if (days <= 7) return { bg: t.status.warning.bg, text: t.status.warning.text, border: t.status.warning.border };
    return { bg: t.status.success.bg, text: t.status.success.text, border: t.status.success.border };
  };

  const getPaidStyle = (status) => {
    if (status === 'مدفوع') return { bg: t.status.success.bg, text: t.status.success.text, border: t.status.success.border };
    return { bg: t.status.danger.bg, text: t.status.danger.text, border: t.status.danger.border };
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'اسم المصروف مطلوب';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'المبلغ مطلوب';
    if (!formData.dueDate) newErrors.dueDate = 'تاريخ الاستحقاق مطلوب';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openAddModal = () => {
    setFormData({ ...emptyForm, code: generateCode('expenses') });
    setErrors({});
    setShowAddModal(true);
  };

  const openEditModal = (expense) => {
    setSelectedExpense(expense);
    setFormData({
      name: expense.name || '', amount: expense.amount || '', type: expense.type || 'monthly',
      dueDate: expense.dueDate || '', status: expense.status || 'غير مدفوع',
      accountId: expense.accountId || '', notes: expense.notes || '', code: expense.code || ''
    });
    setErrors({});
    setShowEditModal(true);
  };

  const openDeleteModal = (expense) => {
    setSelectedExpense(expense);
    setShowDeleteModal(true);
  };

  const handleAdd = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await onAdd({ ...formData, amount: parseFloat(formData.amount) });
      setShowAddModal(false);
      setFormData(emptyForm);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
    setLoading(false);
  };

  const handleEdit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await onEdit({ ...selectedExpense, ...formData, amount: parseFloat(formData.amount) });
      setShowEditModal(false);
    } catch (error) {
      console.error('Error editing expense:', error);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(selectedExpense.id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: t.radius.lg,
    border: `1px solid ${t.border.primary}`, background: t.bg.tertiary,
    color: t.text.primary, fontSize: 14, fontFamily: 'inherit',
    transition: 'all 0.2s', outline: 'none',
  };

  const labelStyle = { display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: t.text.secondary };

  // Modal Component
  const Modal = ({ show, onClose, title, children, onSubmit, submitText, danger }) => {
    if (!show) return null;
    return (
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20,
      }} onClick={onClose}>
        <div style={{
          background: t.bg.secondary, borderRadius: t.radius.xl, width: '100%', maxWidth: 500,
          border: `1px solid ${t.border.primary}`, maxHeight: '90vh', overflow: 'hidden',
        }} onClick={e => e.stopPropagation()}>
          <div style={{
            padding: '20px 24px', borderBottom: `1px solid ${t.border.primary}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: t.text.primary, margin: 0 }}>{title}</h3>
            <button onClick={onClose} style={{
              width: 36, height: 36, borderRadius: t.radius.md, border: 'none',
              background: t.bg.tertiary, color: t.text.muted, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><X size={20} /></button>
          </div>
          <div style={{ padding: 24, overflowY: 'auto', maxHeight: 'calc(90vh - 140px)' }}>{children}</div>
          <div style={{
            padding: '16px 24px', borderTop: `1px solid ${t.border.primary}`,
            display: 'flex', gap: 12, justifyContent: 'flex-end',
          }}>
            <button onClick={onClose} style={{
              padding: '10px 20px', borderRadius: t.radius.lg, border: `1px solid ${t.border.primary}`,
              background: 'transparent', color: t.text.secondary, cursor: 'pointer',
              fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
            }}>إلغاء</button>
            <button onClick={onSubmit} disabled={loading} style={{
              padding: '10px 24px', borderRadius: t.radius.lg, border: 'none',
              background: danger ? t.status.danger.text : t.button.gradient,
              color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
              opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {loading ? 'جاري...' : submitText}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '24px 0', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: t.text.primary, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Receipt size={28} />المصروفات
          </h2>
          <p style={{ fontSize: 14, color: t.text.muted, marginTop: 4 }}>إدارة المصروفات الشهرية والسنوية</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onRefresh} style={{
            width: 44, height: 44, borderRadius: t.radius.lg, border: `1px solid ${t.border.primary}`,
            background: t.bg.secondary, color: t.text.muted, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><RefreshCw size={20} /></button>
          <button onClick={openAddModal} style={{
            padding: '12px 24px', borderRadius: t.radius.lg, border: 'none',
            background: t.button.gradient, color: '#fff', cursor: 'pointer',
            fontSize: 15, fontWeight: 600, fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 8,
          }}><Plus size={20} />إضافة مصروف</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'إجمالي الشهري', value: `${formatNumber(monthlyTotal)} ريال`, color: t.colors[colorKeys[0]]?.main },
          { label: 'إجمالي السنوي', value: `${formatNumber(yearlyTotal)} ريال`, color: t.colors[colorKeys[1]]?.main },
          { label: 'غير مدفوع', value: unpaidCount, color: t.status.danger.text },
        ].map((stat, i) => (
          <div key={i} style={{
            background: t.bg.secondary, borderRadius: t.radius.xl, padding: 20,
            border: `1px solid ${t.border.primary}`,
          }}>
            <p style={{ fontSize: 13, color: t.text.muted, margin: '0 0 8px 0' }}>{stat.label}</p>
            <p style={{ fontSize: 24, fontWeight: 700, color: stat.color, margin: 0 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div style={{
        display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap',
        background: t.bg.secondary, padding: 16, borderRadius: t.radius.xl,
        border: `1px solid ${t.border.primary}`,
      }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: t.text.muted }} />
          <input type="text" placeholder="بحث بالاسم أو الرمز..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, paddingRight: 40 }} />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: 120, cursor: 'pointer' }}>
          <option value="all">كل الأنواع</option>
          <option value="monthly">شهري</option>
          <option value="yearly">سنوي</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: 130, cursor: 'pointer' }}>
          <option value="all">كل الحالات</option>
          <option value="مدفوع">مدفوع</option>
          <option value="غير مدفوع">غير مدفوع</option>
        </select>
      </div>

      {/* Expenses List - Rectangle Cards */}
      {filteredExpenses.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 60, background: t.bg.secondary,
          borderRadius: t.radius.xl, border: `1px solid ${t.border.primary}`,
        }}>
          <Receipt size={48} style={{ color: t.text.muted, marginBottom: 16, opacity: 0.5 }} />
          <p style={{ color: t.text.muted, fontSize: 16 }}>لا توجد مصروفات</p>
          <button onClick={openAddModal} style={{
            marginTop: 16, padding: '10px 24px', borderRadius: t.radius.lg,
            border: 'none', background: t.button.gradient, color: '#fff',
            cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
          }}><Plus size={18} style={{ marginLeft: 8, verticalAlign: 'middle' }} />إضافة مصروف جديد</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filteredExpenses.map((expense, index) => {
            const days = calcDaysRemaining(expense.dueDate);
            const daysStyle = getStatusStyle(days);
            const paidStyle = getPaidStyle(expense.status);
            const isPaid = expense.status === 'مدفوع';
            const color = t.colors[colorKeys[index % colorKeys.length]] || t.colors[colorKeys[0]];

            return (
              <div key={expense.id} style={{
                width: '100%', background: t.bg.secondary, borderRadius: 12,
                border: `1px solid ${t.border.primary}`, padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                {/* Icon */}
                <div style={{
                  width: 40, height: 40, borderRadius: 10, background: color.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Receipt size={20} color="#fff" />
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  {/* Row 1: Code + Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: color.main, fontFamily: 'monospace',
                      background: `${color.main}15`, padding: '2px 6px', borderRadius: 4,
                    }}>{expense.code || 'E-0000'}</span>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: t.text.primary, margin: 0 }}>{expense.name}</h3>
                  </div>

                  {/* Row 2: Details */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: 10, padding: '3px 8px', borderRadius: 5,
                      background: t.status.info.bg, color: t.status.info.text,
                    }}>{expense.type === 'monthly' ? 'شهري' : 'سنوي'}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: color.main }}>
                      {formatNumber(expense.amount)} ريال
                    </span>
                    <span style={{
                      fontSize: 10, padding: '3px 8px', borderRadius: 5,
                      background: paidStyle.bg, color: paidStyle.text, border: `1px solid ${paidStyle.border}`,
                    }}>{expense.status}</span>
                    <span style={{ fontSize: 11, color: t.text.muted, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Calendar size={12} />{expense.dueDate}
                    </span>
                    {!isPaid && days !== null && (
                      <span style={{
                        fontSize: 10, padding: '3px 8px', borderRadius: 5,
                        background: daysStyle.bg, color: daysStyle.text,
                        display: 'flex', alignItems: 'center', gap: 3,
                      }}>
                        <AlertTriangle size={11} />
                        {days < 0 ? `متأخر ${Math.abs(days)} يوم` : `متبقي ${days} يوم`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  {!isPaid && (
                    <button onClick={() => onMarkPaid(expense.id)} title="تحديد كمدفوع" style={{
                      width: 30, height: 30, borderRadius: 6, border: 'none',
                      background: t.status.success.bg, color: t.status.success.text, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}><CheckCircle size={14} /></button>
                  )}
                  <button onClick={() => openEditModal(expense)} style={{
                    width: 30, height: 30, borderRadius: 6, border: 'none',
                    background: t.bg.tertiary, color: t.text.muted, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}><Edit size={14} /></button>
                  <button onClick={() => openDeleteModal(expense)} style={{
                    width: 30, height: 30, borderRadius: 6, border: 'none',
                    background: t.status.danger.bg, color: t.status.danger.text, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}><Trash2 size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)} title="إضافة مصروف جديد" onSubmit={handleAdd} submitText="إضافة">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: `${t.button.primary}15`, padding: 12, borderRadius: t.radius.lg, textAlign: 'center' }}>
            <span style={{ fontSize: 12, color: t.text.muted }}>رقم المصروف</span>
            <p style={{ fontSize: 18, fontWeight: 700, color: t.button.primary, margin: '4px 0 0 0', fontFamily: 'monospace' }}>{formData.code}</p>
          </div>
          <div>
            <label style={labelStyle}>اسم المصروف *</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={{...inputStyle, borderColor: errors.name ? t.status.danger.text : t.border.primary}} placeholder="مثال: إيجار المكتب" />
            {errors.name && <span style={{ fontSize: 12, color: t.status.danger.text }}>{errors.name}</span>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>المبلغ *</label>
              <input type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})}
                style={{...inputStyle, borderColor: errors.amount ? t.status.danger.text : t.border.primary}} placeholder="0" />
            </div>
            <div>
              <label style={labelStyle}>النوع</label>
              <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} style={inputStyle}>
                <option value="monthly">شهري</option>
                <option value="yearly">سنوي</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>تاريخ الاستحقاق *</label>
              <input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                style={{...inputStyle, borderColor: errors.dueDate ? t.status.danger.text : t.border.primary}} />
            </div>
            <div>
              <label style={labelStyle}>الحالة</label>
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} style={inputStyle}>
                <option value="غير مدفوع">غير مدفوع</option>
                <option value="مدفوع">مدفوع</option>
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>الحساب</label>
            <select value={formData.accountId} onChange={(e) => setFormData({...formData, accountId: e.target.value})} style={inputStyle}>
              <option value="">اختر الحساب</option>
              {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>ملاحظات</label>
            <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}
              style={{...inputStyle, minHeight: 80, resize: 'vertical'}} placeholder="ملاحظات إضافية..." />
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)} title="تعديل المصروف" onSubmit={handleEdit} submitText="حفظ التعديلات">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: `${t.button.primary}15`, padding: 12, borderRadius: t.radius.lg, textAlign: 'center' }}>
            <span style={{ fontSize: 12, color: t.text.muted }}>رقم المصروف</span>
            <p style={{ fontSize: 18, fontWeight: 700, color: t.button.primary, margin: '4px 0 0 0', fontFamily: 'monospace' }}>{formData.code || 'E-0000'}</p>
          </div>
          <div>
            <label style={labelStyle}>اسم المصروف *</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={{...inputStyle, borderColor: errors.name ? t.status.danger.text : t.border.primary}} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>المبلغ *</label>
              <input type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})}
                style={{...inputStyle, borderColor: errors.amount ? t.status.danger.text : t.border.primary}} />
            </div>
            <div>
              <label style={labelStyle}>النوع</label>
              <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} style={inputStyle}>
                <option value="monthly">شهري</option>
                <option value="yearly">سنوي</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>تاريخ الاستحقاق *</label>
              <input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                style={{...inputStyle, borderColor: errors.dueDate ? t.status.danger.text : t.border.primary}} />
            </div>
            <div>
              <label style={labelStyle}>الحالة</label>
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} style={inputStyle}>
                <option value="غير مدفوع">غير مدفوع</option>
                <option value="مدفوع">مدفوع</option>
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>الحساب</label>
            <select value={formData.accountId} onChange={(e) => setFormData({...formData, accountId: e.target.value})} style={inputStyle}>
              <option value="">اختر الحساب</option>
              {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>ملاحظات</label>
            <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}
              style={{...inputStyle, minHeight: 80, resize: 'vertical'}} />
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="حذف المصروف" onSubmit={handleDelete} submitText="حذف" danger>
        <div style={{ textAlign: 'center', padding: 20 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: t.status.danger.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
          }}>
            <AlertTriangle size={32} color={t.status.danger.text} />
          </div>
          <p style={{ fontSize: 16, color: t.text.primary, marginBottom: 8 }}>
            هل أنت متأكد من حذف المصروف؟
          </p>
          <p style={{ fontSize: 18, fontWeight: 700, color: t.status.danger.text }}>
            {selectedExpense?.code} - {selectedExpense?.name}
          </p>
          <p style={{ fontSize: 13, color: t.text.muted, marginTop: 8 }}>
            لا يمكن التراجع عن هذا الإجراء
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Expenses;
