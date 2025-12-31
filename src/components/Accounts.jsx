// src/components/Accounts.jsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Wallet, Plus, Search, Edit, Trash2, AlertTriangle, X, CreditCard, Building2, Smartphone, Globe } from 'lucide-react';
import { formatNumber, generateCode } from '../utils/helpers';

// ═══════════════ Modal Component with Portal ═══════════════
const Modal = ({ show, onClose, title, code, children, onSubmit, submitText, danger, loading, theme }) => {
  const t = theme;
  if (!show) return null;
  
  const modalContent = (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999, padding: 20 }} onClick={onClose}>
      <div style={{ background: t.bg.secondary, borderRadius: 16, width: '100%', maxWidth: 500, border: `1px solid ${t.border.primary}`, maxHeight: '90vh', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${t.border.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: t.bg.tertiary }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: t.text.primary, margin: 0 }}>{title}</h3>
            {code && <span style={{ fontSize: 12, fontWeight: 700, color: t.button.primary, background: `${t.button.primary}15`, padding: '4px 10px', borderRadius: 6, fontFamily: 'monospace' }}>{code}</span>}
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: t.bg.secondary, color: t.text.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
        </div>
        <div style={{ padding: 20, overflowY: 'auto', maxHeight: 'calc(90vh - 130px)' }}>{children}</div>
        <div style={{ padding: '14px 20px', borderTop: `1px solid ${t.border.primary}`, display: 'flex', gap: 10, justifyContent: 'flex-end', background: t.bg.tertiary }}>
          <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: 10, border: `1px solid ${t.border.primary}`, background: 'transparent', color: t.text.secondary, cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}>إلغاء</button>
          <button onClick={onSubmit} disabled={loading} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: danger ? t.status.danger.text : t.button.gradient, color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}>{loading ? 'جاري...' : submitText}</button>
        </div>
      </div>
    </div>
  );
  
  // استخدام Portal لعرض النافذة في body مباشرة
  return ReactDOM.createPortal(modalContent, document.body);
};

const Accounts = ({ accounts, onAdd, onEdit, onDelete, darkMode, theme }) => {
  const t = theme;
  const colorKeys = t.colorKeys || Object.keys(t.colors);
  
  const [activeTab, setActiveTab] = useState('bank');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const emptyForm = { name: '', category: 'bank', type: 'bank', bankName: '', accountNumber: '', balance: '', notes: '', code: '' };
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // أنواع الحسابات البنكية
  const bankTypes = [
    { value: 'bank', label: 'حساب بنكي', icon: Building2 },
    { value: 'cash', label: 'صندوق نقدي', icon: Wallet },
    { value: 'card', label: 'بطاقة ائتمان', icon: CreditCard },
  ];

  // أنواع الحسابات الإلكترونية
  const electronicTypes = [
    { value: 'stcpay', label: 'STC Pay', icon: Smartphone },
    { value: 'applepay', label: 'Apple Pay', icon: Smartphone },
    { value: 'paypal', label: 'PayPal', icon: Globe },
    { value: 'other_ewallet', label: 'محفظة أخرى', icon: Wallet },
  ];

  // تصنيف الحسابات
  const bankAccounts = accounts.filter(acc => ['bank', 'cash', 'card'].includes(acc.type));
  const electronicAccounts = accounts.filter(acc => ['stcpay', 'applepay', 'paypal', 'other_ewallet'].includes(acc.type));

  // الحسابات المعروضة حسب التبويب
  const currentAccounts = activeTab === 'bank' ? bankAccounts : electronicAccounts;
  
  const filteredAccounts = currentAccounts.filter(account => {
    const matchSearch = account.name?.toLowerCase().includes(searchTerm.toLowerCase()) || account.code?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  // الإحصائيات
  const bankBalance = bankAccounts.reduce((sum, a) => sum + parseFloat(a.balance || 0), 0);
  const electronicBalance = electronicAccounts.reduce((sum, a) => sum + parseFloat(a.balance || 0), 0);
  const totalBalance = bankBalance + electronicBalance;

  const getTypeInfo = (type) => {
    const allTypes = [...bankTypes, ...electronicTypes];
    return allTypes.find(at => at.value === type) || bankTypes[0];
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'اسم الحساب مطلوب';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openAddModal = () => { 
    const defaultType = activeTab === 'bank' ? 'bank' : 'stcpay';
    setFormData({ ...emptyForm, category: activeTab, type: defaultType, code: generateCode('accounts') }); 
    setErrors({}); 
    setShowAddModal(true); 
  };
  
  const openEditModal = (account) => {
    setSelectedAccount(account);
    const category = ['bank', 'cash', 'card'].includes(account.type) ? 'bank' : 'electronic';
    setFormData({ 
      name: account.name || '', 
      category: category,
      type: account.type || 'bank', 
      bankName: account.bankName || '', 
      accountNumber: account.accountNumber || '', 
      balance: account.balance || '', 
      notes: account.notes || '', 
      code: account.code || '' 
    });
    setErrors({}); 
    setShowEditModal(true);
  };
  
  const openDeleteModal = (account) => { setSelectedAccount(account); setShowDeleteModal(true); };

  const handleAdd = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try { await onAdd({ ...formData, balance: parseFloat(formData.balance) || 0 }); setShowAddModal(false); setFormData(emptyForm); } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleEdit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try { await onEdit({ ...selectedAccount, ...formData, balance: parseFloat(formData.balance) || 0 }); setShowEditModal(false); } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try { await onDelete(selectedAccount.id); setShowDeleteModal(false); } catch (e) { console.error(e); }
    setLoading(false);
  };

  // دالة تحديث الفورم
  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${t.border.primary}`, background: t.bg.tertiary, color: t.text.primary, fontSize: 14, fontFamily: 'inherit', outline: 'none' };
  const labelStyle = { display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: t.text.secondary };

  const addButtonStyle = {
    padding: '10px 20px', borderRadius: 10, border: 'none',
    background: t.button.gradient, color: '#fff', cursor: 'pointer',
    fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
    display: 'flex', alignItems: 'center', gap: 8,
  };

  // الأنواع المتاحة حسب التصنيف في الفورم
  const availableTypes = formData.category === 'bank' ? bankTypes : electronicTypes;

  return (
    <div style={{ padding: '24px 0', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: t.text.primary, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}><Wallet size={28} />الحسابات</h2>
          <p style={{ fontSize: 14, color: t.text.muted, marginTop: 4 }}>إدارة الحسابات البنكية والإلكترونية</p>
        </div>
        <button onClick={openAddModal} style={addButtonStyle}><Plus size={18} />إضافة حساب</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'إجمالي الرصيد', value: `${formatNumber(totalBalance)} ﷼`, color: t.colors[colorKeys[0]]?.main },
          { label: 'الحسابات البنكية', value: `${formatNumber(bankBalance)} ﷼`, color: t.status.info.text },
          { label: 'الحسابات الإلكترونية', value: `${formatNumber(electronicBalance)} ﷼`, color: t.status.success.text },
        ].map((stat, i) => (
          <div key={i} style={{ background: t.bg.secondary, borderRadius: 14, padding: 20, border: `1px solid ${t.border.primary}` }}>
            <p style={{ fontSize: 13, color: t.text.muted, margin: '0 0 8px 0' }}>{stat.label}</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: stat.color, margin: 0 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: t.bg.secondary, padding: 6, borderRadius: 12, border: `1px solid ${t.border.primary}` }}>
        <button
          onClick={() => setActiveTab('bank')}
          style={{
            flex: 1, padding: '12px 20px', borderRadius: 10, border: 'none',
            background: activeTab === 'bank' ? t.button.gradient : 'transparent',
            color: activeTab === 'bank' ? '#fff' : t.text.muted,
            cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.2s',
          }}
        >
          <Building2 size={18} />
          الحسابات البنكية
          <span style={{
            background: activeTab === 'bank' ? 'rgba(255,255,255,0.2)' : t.bg.tertiary,
            padding: '2px 8px', borderRadius: 10, fontSize: 12,
          }}>{bankAccounts.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('electronic')}
          style={{
            flex: 1, padding: '12px 20px', borderRadius: 10, border: 'none',
            background: activeTab === 'electronic' ? t.button.gradient : 'transparent',
            color: activeTab === 'electronic' ? '#fff' : t.text.muted,
            cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.2s',
          }}
        >
          <Smartphone size={18} />
          الحسابات الإلكترونية
          <span style={{
            background: activeTab === 'electronic' ? 'rgba(255,255,255,0.2)' : t.bg.tertiary,
            padding: '2px 8px', borderRadius: 10, fontSize: 12,
          }}>{electronicAccounts.length}</span>
        </button>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, background: t.bg.secondary, padding: 12, borderRadius: 12, border: `1px solid ${t.border.primary}` }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: t.text.muted }} />
          <input type="text" placeholder="بحث بالاسم أو الرمز..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, paddingRight: 40 }} />
        </div>
      </div>

      {/* Accounts Grid */}
      {filteredAccounts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: t.bg.secondary, borderRadius: 14, border: `1px solid ${t.border.primary}` }}>
          {activeTab === 'bank' ? <Building2 size={48} style={{ color: t.text.muted, marginBottom: 16, opacity: 0.5 }} /> : <Smartphone size={48} style={{ color: t.text.muted, marginBottom: 16, opacity: 0.5 }} />}
          <p style={{ color: t.text.muted, fontSize: 16 }}>
            {activeTab === 'bank' ? 'لا توجد حسابات بنكية' : 'لا توجد حسابات إلكترونية'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filteredAccounts.map((account, index) => {
            const typeInfo = getTypeInfo(account.type);
            const TypeIcon = typeInfo.icon;
            const color = t.colors[colorKeys[index % colorKeys.length]] || t.colors[colorKeys[0]];

            return (
              <div key={account.id} style={{ background: t.bg.secondary, borderRadius: 16, border: `1px solid ${t.border.primary}`, overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${t.border.primary}`, background: `${color.main}08` }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: color.main, fontFamily: 'monospace', background: `${color.main}15`, padding: '2px 6px', borderRadius: 4 }}>{account.code || 'A-0000'}</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => openEditModal(account)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: t.bg.tertiary, color: t.text.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit size={14} /></button>
                    <button onClick={() => openDeleteModal(account)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: t.status.danger.bg, color: t.status.danger.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={14} /></button>
                  </div>
                </div>
                <div style={{ padding: 20, textAlign: 'center' }}>
                  <div style={{ width: 56, height: 56, margin: '0 auto 16px', borderRadius: 14, background: color.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TypeIcon size={28} color="#fff" /></div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text.primary, margin: '0 0 6px 0' }}>{account.name}</h3>
                  {account.bankName && <p style={{ fontSize: 12, color: t.text.muted, margin: '0 0 6px 0' }}>{account.bankName}</p>}
                  {account.accountNumber && <p style={{ fontSize: 11, color: t.text.muted, margin: '0 0 12px 0', fontFamily: 'monospace' }}>****{account.accountNumber.slice(-4)}</p>}
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, padding: '5px 12px', borderRadius: 20, background: t.status.info.bg, color: t.status.info.text }}>{typeInfo.label}</span>
                  </div>
                  <div style={{ padding: '12px 16px', background: t.bg.tertiary, borderRadius: 10, marginTop: 8 }}>
                    <p style={{ fontSize: 11, color: t.text.muted, margin: '0 0 4px 0' }}>الرصيد</p>
                    <p style={{ fontSize: 22, fontWeight: 700, color: color.main, margin: 0 }}>{formatNumber(account.balance)} <span style={{ fontSize: 14 }}>﷼</span></p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)} title="إضافة حساب جديد" code={formData.code} onSubmit={handleAdd} submitText="إضافة" loading={loading} theme={t}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* اختيار التصنيف */}
          <div>
            <label style={labelStyle}>تصنيف الحساب</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button
                type="button"
                onClick={() => setFormData({...formData, category: 'bank', type: 'bank'})}
                style={{
                  padding: '12px', borderRadius: 10, border: `2px solid ${formData.category === 'bank' ? t.button.primary : t.border.primary}`,
                  background: formData.category === 'bank' ? `${t.button.primary}15` : t.bg.tertiary,
                  color: formData.category === 'bank' ? t.button.primary : t.text.muted,
                  cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <Building2 size={18} />
                حساب بنكي
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, category: 'electronic', type: 'stcpay'})}
                style={{
                  padding: '12px', borderRadius: 10, border: `2px solid ${formData.category === 'electronic' ? t.button.primary : t.border.primary}`,
                  background: formData.category === 'electronic' ? `${t.button.primary}15` : t.bg.tertiary,
                  color: formData.category === 'electronic' ? t.button.primary : t.text.muted,
                  cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <Smartphone size={18} />
                حساب إلكتروني
              </button>
            </div>
          </div>

          <div>
            <label style={labelStyle}>اسم الحساب *</label>
            <input type="text" value={formData.name} onChange={(e) => updateForm('name', e.target.value)} style={{...inputStyle, borderColor: errors.name ? t.status.danger.text : t.border.primary}} placeholder={formData.category === 'bank' ? 'مثال: الحساب الرئيسي' : 'مثال: محفظة STC'} />
            {errors.name && <span style={{ fontSize: 12, color: t.status.danger.text }}>{errors.name}</span>}
          </div>
          
          <div>
            <label style={labelStyle}>نوع الحساب</label>
            <select value={formData.type} onChange={(e) => updateForm('type', e.target.value)} style={inputStyle}>
              {availableTypes.map(at => <option key={at.value} value={at.value}>{at.label}</option>)}
            </select>
          </div>
          
          {formData.category === 'bank' && formData.type === 'bank' && (
            <>
              <div>
                <label style={labelStyle}>اسم البنك</label>
                <input type="text" value={formData.bankName} onChange={(e) => updateForm('bankName', e.target.value)} style={inputStyle} placeholder="مثال: بنك الراجحي" />
              </div>
              <div>
                <label style={labelStyle}>رقم الحساب البنكي</label>
                <input type="text" value={formData.accountNumber} onChange={(e) => updateForm('accountNumber', e.target.value)} style={inputStyle} placeholder="رقم الآيبان أو الحساب" />
              </div>
            </>
          )}
          
          {formData.category === 'electronic' && (
            <div>
              <label style={labelStyle}>رقم الجوال / الحساب</label>
              <input type="text" value={formData.accountNumber} onChange={(e) => updateForm('accountNumber', e.target.value)} style={inputStyle} placeholder="05xxxxxxxx" />
            </div>
          )}
          
          <div>
            <label style={labelStyle}>الرصيد الحالي</label>
            <input type="number" value={formData.balance} onChange={(e) => updateForm('balance', e.target.value)} style={inputStyle} placeholder="0" />
          </div>
          
          <div>
            <label style={labelStyle}>ملاحظات</label>
            <textarea value={formData.notes} onChange={(e) => updateForm('notes', e.target.value)} style={{...inputStyle, minHeight: 80, resize: 'vertical'}} placeholder="ملاحظات إضافية..." />
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)} title="تعديل الحساب" code={formData.code || 'A-0000'} onSubmit={handleEdit} submitText="حفظ التعديلات" loading={loading} theme={t}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* اختيار التصنيف */}
          <div>
            <label style={labelStyle}>تصنيف الحساب</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button
                type="button"
                onClick={() => setFormData({...formData, category: 'bank', type: 'bank'})}
                style={{
                  padding: '12px', borderRadius: 10, border: `2px solid ${formData.category === 'bank' ? t.button.primary : t.border.primary}`,
                  background: formData.category === 'bank' ? `${t.button.primary}15` : t.bg.tertiary,
                  color: formData.category === 'bank' ? t.button.primary : t.text.muted,
                  cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <Building2 size={18} />
                حساب بنكي
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, category: 'electronic', type: 'stcpay'})}
                style={{
                  padding: '12px', borderRadius: 10, border: `2px solid ${formData.category === 'electronic' ? t.button.primary : t.border.primary}`,
                  background: formData.category === 'electronic' ? `${t.button.primary}15` : t.bg.tertiary,
                  color: formData.category === 'electronic' ? t.button.primary : t.text.muted,
                  cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <Smartphone size={18} />
                حساب إلكتروني
              </button>
            </div>
          </div>

          <div>
            <label style={labelStyle}>اسم الحساب *</label>
            <input type="text" value={formData.name} onChange={(e) => updateForm('name', e.target.value)} style={{...inputStyle, borderColor: errors.name ? t.status.danger.text : t.border.primary}} />
            {errors.name && <span style={{ fontSize: 12, color: t.status.danger.text }}>{errors.name}</span>}
          </div>
          
          <div>
            <label style={labelStyle}>نوع الحساب</label>
            <select value={formData.type} onChange={(e) => updateForm('type', e.target.value)} style={inputStyle}>
              {availableTypes.map(at => <option key={at.value} value={at.value}>{at.label}</option>)}
            </select>
          </div>
          
          {formData.category === 'bank' && formData.type === 'bank' && (
            <>
              <div>
                <label style={labelStyle}>اسم البنك</label>
                <input type="text" value={formData.bankName} onChange={(e) => updateForm('bankName', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>رقم الحساب البنكي</label>
                <input type="text" value={formData.accountNumber} onChange={(e) => updateForm('accountNumber', e.target.value)} style={inputStyle} />
              </div>
            </>
          )}
          
          {formData.category === 'electronic' && (
            <div>
              <label style={labelStyle}>رقم الجوال / الحساب</label>
              <input type="text" value={formData.accountNumber} onChange={(e) => updateForm('accountNumber', e.target.value)} style={inputStyle} />
            </div>
          )}
          
          <div>
            <label style={labelStyle}>الرصيد الحالي</label>
            <input type="number" value={formData.balance} onChange={(e) => updateForm('balance', e.target.value)} style={inputStyle} />
          </div>
          
          <div>
            <label style={labelStyle}>ملاحظات</label>
            <textarea value={formData.notes} onChange={(e) => updateForm('notes', e.target.value)} style={{...inputStyle, minHeight: 80, resize: 'vertical'}} />
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="حذف الحساب" code={selectedAccount?.code} onSubmit={handleDelete} submitText="حذف" danger loading={loading} theme={t}>
        <div style={{ textAlign: 'center', padding: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: t.status.danger.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><AlertTriangle size={32} color={t.status.danger.text} /></div>
          <p style={{ fontSize: 16, color: t.text.primary, marginBottom: 8 }}>هل أنت متأكد من حذف الحساب؟</p>
          <p style={{ fontSize: 18, fontWeight: 700, color: t.status.danger.text }}>{selectedAccount?.code} - {selectedAccount?.name}</p>
          <p style={{ fontSize: 13, color: t.text.muted, marginTop: 8 }}>لا يمكن التراجع عن هذا الإجراء</p>
        </div>
      </Modal>
    </div>
  );
};

export default Accounts;
