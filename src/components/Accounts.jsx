// src/components/Accounts.jsx
import React, { useState } from 'react';
import { 
  CreditCard, Plus, Search, Edit, Trash2, AlertTriangle, X, Save,
  FileText, Building, Wallet, PiggyBank, Banknote
} from 'lucide-react';

const Accounts = ({ accounts, onAdd, onEdit, onDelete, darkMode, theme }) => {
  const t = theme;
  const colorKeys = t.colorKeys || Object.keys(t.colors);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const emptyForm = { name: '', type: 'bank', balance: '', bankName: '', accountNumber: '', notes: '' };
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const accountTypes = [
    { value: 'bank', label: 'حساب بنكي', icon: <Building size={18} /> },
    { value: 'cash', label: 'صندوق نقدي', icon: <Wallet size={18} /> },
    { value: 'savings', label: 'حساب ادخار', icon: <PiggyBank size={18} /> },
    { value: 'other', label: 'أخرى', icon: <Banknote size={18} /> }
  ];

  const filteredAccounts = accounts.filter(account => {
    const matchSearch = account.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || account.type === filterType;
    return matchSearch && matchType;
  });

  const totalBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0);
  const bankAccounts = accounts.filter(a => a.type === 'bank').length;
  const cashAccounts = accounts.filter(a => a.type === 'cash').length;

  const formatNumber = (num) => new Intl.NumberFormat('ar-SA').format(num || 0);
  const getAccountTypeInfo = (type) => accountTypes.find(t => t.value === type) || accountTypes[3];
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'اسم الحساب مطلوب';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openAddModal = () => { setFormData(emptyForm); setErrors({}); setShowAddModal(true); };
  const openEditModal = (account) => {
    setSelectedAccount(account);
    setFormData({ name: account.name || '', type: account.type || 'bank', balance: account.balance || '', bankName: account.bankName || '', accountNumber: account.accountNumber || '', notes: account.notes || '' });
    setErrors({}); setShowEditModal(true);
  };
  const openDeleteModal = (account) => { setSelectedAccount(account); setShowDeleteModal(true); };
  const closeAllModals = () => { setShowAddModal(false); setShowEditModal(false); setShowDeleteModal(false); setSelectedAccount(null); setFormData(emptyForm); setErrors({}); setLoading(false); };

  const handleAdd = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try { await onAdd({ ...formData, balance: formData.balance ? parseFloat(formData.balance) : 0 }); closeAllModals(); }
    catch (error) { console.error('Error:', error); }
    setLoading(false);
  };

  const handleEdit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try { await onEdit({ ...selectedAccount, ...formData, balance: formData.balance ? parseFloat(formData.balance) : 0 }); closeAllModals(); }
    catch (error) { console.error('Error:', error); }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try { await onDelete(selectedAccount.id); closeAllModals(); }
    catch (error) { console.error('Error:', error); }
    setLoading(false);
  };

  const modalOverlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 };
  const modalStyle = { background: t.bg.primary, borderRadius: t.radius.xl, border: `1px solid ${t.border.primary}`, width: '100%', maxWidth: 500, maxHeight: '90vh', overflow: 'auto' };
  const modalHeaderStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: `1px solid ${t.border.primary}` };
  const modalBodyStyle = { padding: 24, display: 'flex', flexDirection: 'column', gap: 20 };
  const modalFooterStyle = { display: 'flex', gap: 12, padding: '16px 24px', borderTop: `1px solid ${t.border.primary}` };
  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: t.radius.lg, border: `1px solid ${t.border.primary}`, background: t.bg.tertiary, color: t.text.primary, fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' };
  const inputErrorStyle = { ...inputStyle, border: `1px solid ${t.status.danger.text}` };
  const labelStyle = { fontSize: 13, fontWeight: 600, color: t.text.secondary, marginBottom: 8, display: 'block' };
  const errorTextStyle = { fontSize: 12, color: t.status.danger.text, marginTop: 4 };
  const btnPrimary = { flex: 1, padding: '12px 20px', borderRadius: t.radius.lg, border: 'none', background: t.button.gradient, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 };
  const btnSecondary = { flex: 1, padding: '12px 20px', borderRadius: t.radius.lg, border: `1px solid ${t.border.primary}`, background: 'transparent', color: t.text.primary, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' };
  const btnDanger = { ...btnPrimary, background: `linear-gradient(135deg, ${t.status.danger.text}, #dc2626)` };

  const statCards = [
    { label: 'إجمالي الرصيد', value: `${formatNumber(totalBalance)} ريال`, colorKey: colorKeys[0] },
    { label: 'حسابات بنكية', value: bankAccounts, colorKey: colorKeys[1] },
    { label: 'صناديق نقدية', value: cashAccounts, colorKey: colorKeys[2] },
  ];

  return (
    <div style={{ padding: 16, paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: t.text.primary, display: 'flex', alignItems: 'center', gap: 10, margin: 0 }}>
            <div style={{ width: 40, height: 40, borderRadius: t.radius.lg, background: t.colors[colorKeys[0]]?.gradient || t.button.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: darkMode ? t.colors[colorKeys[0]]?.glow : 'none' }}>
              <CreditCard size={22} color="#fff" />
            </div>
            الحسابات
          </h2>
          <p style={{ fontSize: 14, color: t.text.muted, marginTop: 6, marginRight: 50 }}>إدارة الحسابات البنكية والصناديق</p>
        </div>
        <button onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: t.radius.lg, border: 'none', background: t.button.gradient, color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', boxShadow: t.button.glow }}>
          <Plus size={18} />إضافة حساب
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {statCards.map((card, index) => {
          const color = t.colors[card.colorKey] || t.colors[colorKeys[0]];
          return (
            <div key={index} style={{ background: t.bg.secondary, borderRadius: t.radius.xl, border: `1px solid ${color.main}30`, padding: 20, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, left: -20, width: 80, height: 80, background: `radial-gradient(circle, ${color.main}15 0%, transparent 70%)` }} />
              <p style={{ fontSize: 13, color: t.text.muted, marginBottom: 8 }}>{card.label}</p>
              <p style={{ fontSize: 24, fontWeight: 700, color: color.main, margin: 0 }}>{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', background: t.bg.secondary, padding: 16, borderRadius: t.radius.xl, border: `1px solid ${t.border.primary}` }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: t.text.muted }} />
          <input type="text" placeholder="بحث في الحسابات..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, paddingRight: 40 }} />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: 150, cursor: 'pointer' }}>
          <option value="all">كل الأنواع</option>
          {accountTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      {/* Accounts List */}
      {filteredAccounts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: t.bg.secondary, borderRadius: t.radius.xl, border: `1px solid ${t.border.primary}` }}>
          <CreditCard size={48} style={{ color: t.text.muted, marginBottom: 16, opacity: 0.5 }} />
          <p style={{ color: t.text.muted, fontSize: 16 }}>لا توجد حسابات</p>
          <button onClick={openAddModal} style={{ marginTop: 16, padding: '10px 24px', borderRadius: t.radius.lg, border: 'none', background: t.button.gradient, color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}>
            <Plus size={18} style={{ marginLeft: 8, verticalAlign: 'middle' }} />إضافة حساب جديد
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filteredAccounts.map(account => {
            const typeInfo = getAccountTypeInfo(account.type);
            const color = t.colors[colorKeys[accounts.indexOf(account) % colorKeys.length]] || t.colors[colorKeys[0]];
            return (
              <div key={account.id} style={{ background: t.bg.secondary, borderRadius: t.radius.xl, border: `1px solid ${t.border.primary}`, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: `1px solid ${t.border.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: `${color.main}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: t.radius.md, background: color.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      {typeInfo.icon}
                    </div>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 600, color: t.text.primary, margin: 0 }}>{account.name}</h3>
                      <span style={{ fontSize: 11, color: t.text.muted }}>{typeInfo.label}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEditModal(account)} style={{ width: 32, height: 32, borderRadius: t.radius.md, border: 'none', background: t.bg.tertiary, color: t.text.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit size={14} /></button>
                    <button onClick={() => openDeleteModal(account)} style={{ width: 32, height: 32, borderRadius: t.radius.md, border: 'none', background: t.status.danger.bg, color: t.status.danger.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={14} /></button>
                  </div>
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '14px 18px', background: t.bg.tertiary, borderRadius: t.radius.lg }}>
                    <span style={{ fontSize: 13, color: t.text.muted }}>الرصيد</span>
                    <span style={{ fontSize: 22, fontWeight: 700, color: color.main }}>{formatNumber(account.balance)} <span style={{ fontSize: 12 }}>ريال</span></span>
                  </div>
                  {account.bankName && <div style={{ fontSize: 13, color: t.text.muted, marginBottom: 8 }}>البنك: <span style={{ color: t.text.primary }}>{account.bankName}</span></div>}
                  {account.accountNumber && <div style={{ fontSize: 13, color: t.text.muted, marginBottom: 8 }}>رقم الحساب: <span style={{ color: t.text.primary, direction: 'ltr', display: 'inline-block' }}>{account.accountNumber}</span></div>}
                  {account.notes && <div style={{ fontSize: 12, color: t.text.muted, padding: 12, background: t.bg.tertiary, borderRadius: t.radius.md, marginTop: 12, lineHeight: 1.6 }}>{account.notes}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div style={modalOverlayStyle} onClick={closeAllModals}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: t.text.primary, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: t.radius.md, background: t.button.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={20} color="#fff" /></div>
                إضافة حساب جديد
              </h3>
              <button onClick={closeAllModals} style={{ width: 36, height: 36, borderRadius: t.radius.md, border: 'none', background: t.bg.tertiary, color: t.text.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
            </div>
            <div style={modalBodyStyle}>
              <div><label style={labelStyle}>اسم الحساب *</label><input type="text" placeholder="مثال: حساب الراجحي" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={errors.name ? inputErrorStyle : inputStyle} />{errors.name && <span style={errorTextStyle}>{errors.name}</span>}</div>
              <div><label style={labelStyle}>نوع الحساب</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                  {accountTypes.map(type => (<button key={type.value} type="button" onClick={() => setFormData({ ...formData, type: type.value })} style={{ padding: '12px 16px', borderRadius: t.radius.lg, border: formData.type === type.value ? `2px solid ${t.button.primary}` : `1px solid ${t.border.primary}`, background: formData.type === type.value ? `${t.button.primary}15` : t.bg.tertiary, color: formData.type === type.value ? t.button.primary : t.text.secondary, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>{type.icon}{type.label}</button>))}
                </div>
              </div>
              <div><label style={labelStyle}>الرصيد الحالي (ريال)</label><input type="number" placeholder="0" value={formData.balance} onChange={(e) => setFormData({ ...formData, balance: e.target.value })} style={inputStyle} /></div>
              <div><label style={labelStyle}>اسم البنك</label><input type="text" placeholder="مثال: بنك الراجحي" value={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} style={inputStyle} /></div>
              <div><label style={labelStyle}>رقم الحساب</label><input type="text" placeholder="SA..." value={formData.accountNumber} onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} style={inputStyle} /></div>
              <div><label style={labelStyle}>ملاحظات</label><textarea placeholder="أي ملاحظات..." value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} /></div>
            </div>
            <div style={modalFooterStyle}>
              <button onClick={closeAllModals} style={btnSecondary} disabled={loading}>إلغاء</button>
              <button onClick={handleAdd} style={btnPrimary} disabled={loading}>{loading ? 'جاري الحفظ...' : (<><Save size={18} />حفظ الحساب</>)}</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedAccount && (
        <div style={modalOverlayStyle} onClick={closeAllModals}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: t.text.primary, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: t.radius.md, background: t.status.warning.bg, border: `1px solid ${t.status.warning.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit size={18} color={t.status.warning.text} /></div>
                تعديل الحساب
              </h3>
              <button onClick={closeAllModals} style={{ width: 36, height: 36, borderRadius: t.radius.md, border: 'none', background: t.bg.tertiary, color: t.text.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
            </div>
            <div style={modalBodyStyle}>
              <div><label style={labelStyle}>اسم الحساب *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={errors.name ? inputErrorStyle : inputStyle} />{errors.name && <span style={errorTextStyle}>{errors.name}</span>}</div>
              <div><label style={labelStyle}>نوع الحساب</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                  {accountTypes.map(type => (<button key={type.value} type="button" onClick={() => setFormData({ ...formData, type: type.value })} style={{ padding: '12px 16px', borderRadius: t.radius.lg, border: formData.type === type.value ? `2px solid ${t.button.primary}` : `1px solid ${t.border.primary}`, background: formData.type === type.value ? `${t.button.primary}15` : t.bg.tertiary, color: formData.type === type.value ? t.button.primary : t.text.secondary, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>{type.icon}{type.label}</button>))}
                </div>
              </div>
              <div><label style={labelStyle}>الرصيد الحالي (ريال)</label><input type="number" value={formData.balance} onChange={(e) => setFormData({ ...formData, balance: e.target.value })} style={inputStyle} /></div>
              <div><label style={labelStyle}>اسم البنك</label><input type="text" value={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} style={inputStyle} /></div>
              <div><label style={labelStyle}>رقم الحساب</label><input type="text" value={formData.accountNumber} onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} style={inputStyle} /></div>
              <div><label style={labelStyle}>ملاحظات</label><textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} /></div>
            </div>
            <div style={modalFooterStyle}>
              <button onClick={closeAllModals} style={btnSecondary} disabled={loading}>إلغاء</button>
              <button onClick={handleEdit} style={btnPrimary} disabled={loading}>{loading ? 'جاري الحفظ...' : (<><Save size={18} />حفظ التعديلات</>)}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedAccount && (
        <div style={modalOverlayStyle} onClick={closeAllModals}>
          <div style={{ ...modalStyle, maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: t.status.danger.text, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: t.radius.md, background: t.status.danger.bg, border: `1px solid ${t.status.danger.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={18} color={t.status.danger.text} /></div>
                تأكيد الحذف
              </h3>
              <button onClick={closeAllModals} style={{ width: 36, height: 36, borderRadius: t.radius.md, border: 'none', background: t.bg.tertiary, color: t.text.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
            </div>
            <div style={{ padding: 24, textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: t.status.danger.bg, border: `2px solid ${t.status.danger.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}><AlertTriangle size={32} color={t.status.danger.text} /></div>
              <p style={{ fontSize: 16, color: t.text.primary, marginBottom: 8 }}>هل أنت متأكد من حذف هذا الحساب؟</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: t.text.primary, padding: '12px 20px', background: t.bg.tertiary, borderRadius: t.radius.lg, display: 'inline-block' }}>"{selectedAccount.name}"</p>
              <p style={{ fontSize: 13, color: t.status.danger.text, marginTop: 16 }}>⚠️ هذا الإجراء لا يمكن التراجع عنه</p>
            </div>
            <div style={modalFooterStyle}>
              <button onClick={closeAllModals} style={btnSecondary} disabled={loading}>إلغاء</button>
              <button onClick={handleDelete} style={btnDanger} disabled={loading}>{loading ? 'جاري الحذف...' : (<><Trash2 size={18} />نعم، احذف</>)}</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Accounts;
