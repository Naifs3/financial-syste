// src/components/Resources.jsx
import React, { useState } from 'react';
import { 
  Package, Plus, Search, Edit, Trash2, AlertTriangle, X, ChevronDown,
  Users, Building2, FileText, Boxes, Wrench, Receipt, FileSignature, 
  CreditCard, Wallet, Paperclip, Phone, Mail, MapPin, Calendar,
  ExternalLink, Eye, Download, FolderOpen, User, Truck, Hash
} from 'lucide-react';
import { formatNumber, generateCode } from '../utils/helpers';

const Resources = ({ 
  // البيانات
  clients = [],
  suppliers = [],
  documents = [],
  materials = [],
  equipment = [],
  // البيانات المرتبطة
  projects = [],
  accounts = [],
  users = [],
  expenses = [],
  // الأحداث
  onAddClient, onEditClient, onDeleteClient,
  onAddSupplier, onEditSupplier, onDeleteSupplier,
  onAddDocument, onEditDocument, onDeleteDocument,
  onAddMaterial, onEditMaterial, onDeleteMaterial,
  onAddEquipment, onEditEquipment, onDeleteEquipment,
  onNavigate,
  // الثيم
  darkMode, 
  theme 
}) => {
  const t = theme;
  const colorKeys = t.colorKeys || Object.keys(t.colors);
  
  // التبويب النشط
  const [activeTab, setActiveTab] = useState('clients');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // حالات المودال
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ═══════════════════════════════════════════════════════════
  // تعريفات التبويبات
  // ═══════════════════════════════════════════════════════════
  const tabs = [
    { id: 'clients', label: 'العملاء', icon: Users, color: '#3b82f6', count: clients.length },
    { id: 'suppliers', label: 'الموردين', icon: Building2, color: '#f97316', count: suppliers.length },
    { id: 'documents', label: 'المستندات', icon: FileText, color: '#8b5cf6', count: documents.length },
    { id: 'materials', label: 'المواد', icon: Boxes, color: '#10b981', count: materials.length },
    { id: 'equipment', label: 'المعدات', icon: Wrench, color: '#ef4444', count: equipment.length },
  ];

  // ═══════════════════════════════════════════════════════════
  // أنواع المستندات
  // ═══════════════════════════════════════════════════════════
  const documentTypes = [
    { value: 'invoice_out', label: 'فاتورة مبيعات', icon: Receipt, color: '#10b981' },
    { value: 'invoice_in', label: 'فاتورة مشتريات', icon: Receipt, color: '#ef4444' },
    { value: 'contract', label: 'عقد', icon: FileSignature, color: '#8b5cf6' },
    { value: 'receipt', label: 'سند قبض', icon: CreditCard, color: '#3b82f6' },
    { value: 'payment', label: 'سند صرف', icon: Wallet, color: '#f97316' },
    { value: 'attachment', label: 'مرفق', icon: Paperclip, color: '#64748b' },
  ];

  // ═══════════════════════════════════════════════════════════
  // حالات المعدات
  // ═══════════════════════════════════════════════════════════
  const equipmentStatuses = [
    { value: 'available', label: 'متاح', color: '#10b981' },
    { value: 'in_use', label: 'قيد الاستخدام', color: '#3b82f6' },
    { value: 'maintenance', label: 'صيانة', color: '#f97316' },
    { value: 'broken', label: 'معطل', color: '#ef4444' },
  ];

  // ═══════════════════════════════════════════════════════════
  // النماذج الفارغة
  // ═══════════════════════════════════════════════════════════
  const emptyForms = {
    clients: { name: '', phone: '', email: '', address: '', type: 'individual', notes: '', code: '' },
    suppliers: { name: '', phone: '', email: '', address: '', category: '', notes: '', code: '' },
    documents: { title: '', type: 'invoice_out', number: '', date: '', amount: '', clientId: '', supplierId: '', projectId: '', accountId: '', status: 'pending', notes: '', code: '' },
    materials: { name: '', unit: 'unit', quantity: 0, minQuantity: 0, price: 0, supplierId: '', location: '', notes: '', code: '' },
    equipment: { name: '', type: '', plateNumber: '', status: 'available', projectId: '', purchaseDate: '', value: 0, notes: '', code: '' },
  };

  const [formData, setFormData] = useState(emptyForms.clients);

  // ═══════════════════════════════════════════════════════════
  // الفلترة والبحث
  // ═══════════════════════════════════════════════════════════
  const getFilteredData = () => {
    let data = [];
    switch (activeTab) {
      case 'clients': data = clients; break;
      case 'suppliers': data = suppliers; break;
      case 'documents': data = documents; break;
      case 'materials': data = materials; break;
      case 'equipment': data = equipment; break;
      default: data = [];
    }

    return data.filter(item => {
      const searchFields = [item.name, item.title, item.code, item.phone, item.email, item.number].filter(Boolean);
      const matchSearch = searchFields.some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchType = filterType === 'all' || item.type === filterType || item.status === filterType;
      return matchSearch && matchType;
    });
  };

  const filteredData = getFilteredData();

  // ═══════════════════════════════════════════════════════════
  // الإحصائيات
  // ═══════════════════════════════════════════════════════════
  const getStats = () => {
    switch (activeTab) {
      case 'clients':
        return [
          { label: 'إجمالي العملاء', value: clients.length, color: '#3b82f6' },
          { label: 'أفراد', value: clients.filter(c => c.type === 'individual').length, color: '#10b981' },
          { label: 'شركات', value: clients.filter(c => c.type === 'company').length, color: '#8b5cf6' },
        ];
      case 'suppliers':
        return [
          { label: 'إجمالي الموردين', value: suppliers.length, color: '#f97316' },
          { label: 'نشط', value: suppliers.filter(s => s.status !== 'inactive').length, color: '#10b981' },
        ];
      case 'documents':
        const invoicesOut = documents.filter(d => d.type === 'invoice_out');
        const invoicesIn = documents.filter(d => d.type === 'invoice_in');
        return [
          { label: 'إجمالي المستندات', value: documents.length, color: '#8b5cf6' },
          { label: 'فواتير مبيعات', value: `${formatNumber(invoicesOut.reduce((s, d) => s + (parseFloat(d.amount) || 0), 0))} ﷼`, color: '#10b981' },
          { label: 'فواتير مشتريات', value: `${formatNumber(invoicesIn.reduce((s, d) => s + (parseFloat(d.amount) || 0), 0))} ﷼`, color: '#ef4444' },
        ];
      case 'materials':
        const totalValue = materials.reduce((s, m) => s + ((parseFloat(m.quantity) || 0) * (parseFloat(m.price) || 0)), 0);
        const lowStock = materials.filter(m => (parseFloat(m.quantity) || 0) <= (parseFloat(m.minQuantity) || 0)).length;
        return [
          { label: 'إجمالي الأصناف', value: materials.length, color: '#10b981' },
          { label: 'قيمة المخزون', value: `${formatNumber(totalValue)} ﷼`, color: '#3b82f6' },
          { label: 'نقص مخزون', value: lowStock, color: '#ef4444' },
        ];
      case 'equipment':
        const available = equipment.filter(e => e.status === 'available').length;
        const inUse = equipment.filter(e => e.status === 'in_use').length;
        return [
          { label: 'إجمالي المعدات', value: equipment.length, color: '#ef4444' },
          { label: 'متاح', value: available, color: '#10b981' },
          { label: 'قيد الاستخدام', value: inUse, color: '#3b82f6' },
        ];
      default:
        return [];
    }
  };

  // ═══════════════════════════════════════════════════════════
  // الدوال المساعدة
  // ═══════════════════════════════════════════════════════════
  const validateForm = () => {
    const newErrors = {};
    switch (activeTab) {
      case 'clients':
      case 'suppliers':
        if (!formData.name?.trim()) newErrors.name = 'الاسم مطلوب';
        break;
      case 'documents':
        if (!formData.title?.trim()) newErrors.title = 'العنوان مطلوب';
        break;
      case 'materials':
      case 'equipment':
        if (!formData.name?.trim()) newErrors.name = 'الاسم مطلوب';
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openAddModal = () => {
    const codePrefix = { clients: 'CL', suppliers: 'SP', documents: 'DOC', materials: 'MT', equipment: 'EQ' };
    setFormData({ ...emptyForms[activeTab], code: generateCode(codePrefix[activeTab] || 'X') });
    setErrors({});
    setShowAddModal(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormData({ ...item });
    setErrors({});
    setShowEditModal(true);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const openViewModal = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleAdd = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const handlers = { clients: onAddClient, suppliers: onAddSupplier, documents: onAddDocument, materials: onAddMaterial, equipment: onAddEquipment };
      await handlers[activeTab]?.(formData);
      setShowAddModal(false);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleEdit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const handlers = { clients: onEditClient, suppliers: onEditSupplier, documents: onEditDocument, materials: onEditMaterial, equipment: onEditEquipment };
      await handlers[activeTab]?.({ ...selectedItem, ...formData });
      setShowEditModal(false);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const handlers = { clients: onDeleteClient, suppliers: onDeleteSupplier, documents: onDeleteDocument, materials: onDeleteMaterial, equipment: onDeleteEquipment };
      await handlers[activeTab]?.(selectedItem.id);
      setShowDeleteModal(false);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  // ═══════════════════════════════════════════════════════════
  // الأنماط
  // ═══════════════════════════════════════════════════════════
  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${t.border.primary}`, background: t.bg.tertiary, color: t.text.primary, fontSize: 14, fontFamily: 'inherit', outline: 'none' };
  const labelStyle = { display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: t.text.secondary };
  const addButtonStyle = { padding: '10px 20px', borderRadius: 10, border: 'none', background: t.button.gradient, color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8 };

  // ═══════════════════════════════════════════════════════════
  // ألوان الشارات
  // ═══════════════════════════════════════════════════════════
  const tagColors = {
    project: { bg: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', border: 'rgba(99, 102, 241, 0.3)' },
    client: { bg: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' },
    supplier: { bg: 'rgba(249, 115, 22, 0.1)', color: '#fb923c', border: 'rgba(249, 115, 22, 0.3)' },
    account: { bg: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
    user: { bg: 'rgba(236, 72, 153, 0.1)', color: '#f472b6', border: 'rgba(236, 72, 153, 0.3)' },
  };

  const LinkedTag = ({ type, icon: Icon, label, data }) => {
    const colors = tagColors[type] || tagColors.project;
    const [isHovered, setIsHovered] = useState(false);
    if (!data) return null;
    return (
      <span onClick={() => onNavigate?.(type, data)} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
        style={{ fontSize: 11, padding: '4px 10px', borderRadius: 15, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5, cursor: 'pointer', transition: 'all 0.2s', background: isHovered ? colors.border : colors.bg, color: colors.color, border: `1px solid ${colors.border}`, transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}>
        <Icon size={11} />{label}<ExternalLink size={9} style={{ opacity: isHovered ? 1 : 0 }} />
      </span>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // مكون المودال
  // ═══════════════════════════════════════════════════════════
  const Modal = ({ show, onClose, title, children, onSubmit, submitText, danger, hideFooter }) => {
    if (!show) return null;
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={onClose}>
        <div style={{ background: t.bg.secondary, borderRadius: 16, width: '100%', maxWidth: 550, border: `1px solid ${t.border.primary}`, maxHeight: '90vh', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} onClick={e => e.stopPropagation()}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${t.border.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: t.bg.tertiary }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: t.text.primary, margin: 0 }}>{title}</h3>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: t.bg.secondary, color: t.text.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
          </div>
          <div style={{ padding: 20, overflowY: 'auto', maxHeight: 'calc(90vh - 140px)' }}>{children}</div>
          {!hideFooter && (
            <div style={{ padding: '14px 20px', borderTop: `1px solid ${t.border.primary}`, display: 'flex', gap: 10, justifyContent: 'flex-end', background: t.bg.tertiary }}>
              <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: 10, border: `1px solid ${t.border.primary}`, background: 'transparent', color: t.text.secondary, cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}>إلغاء</button>
              <button onClick={onSubmit} disabled={loading} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: danger ? t.status.danger.text : t.button.gradient, color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}>{loading ? 'جاري...' : submitText}</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // محتوى نموذج الإضافة/التعديل
  // ═══════════════════════════════════════════════════════════
  const renderFormContent = () => {
    switch (activeTab) {
      case 'clients':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: `${t.button.primary}15`, padding: 12, borderRadius: 12, textAlign: 'center' }}>
              <span style={{ fontSize: 12, color: t.text.muted }}>رقم العميل</span>
              <p style={{ fontSize: 18, fontWeight: 700, color: t.button.primary, margin: '4px 0 0 0', fontFamily: 'monospace' }}>{formData.code}</p>
            </div>
            <div>
              <label style={labelStyle}>نوع العميل</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => setFormData({...formData, type: 'individual'})} style={{ flex: 1, padding: '10px', borderRadius: 10, border: `1px solid ${formData.type === 'individual' ? t.button.primary : t.border.primary}`, background: formData.type === 'individual' ? `${t.button.primary}15` : 'transparent', color: formData.type === 'individual' ? t.button.primary : t.text.secondary, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>👤 فرد</button>
                <button type="button" onClick={() => setFormData({...formData, type: 'company'})} style={{ flex: 1, padding: '10px', borderRadius: 10, border: `1px solid ${formData.type === 'company' ? t.button.primary : t.border.primary}`, background: formData.type === 'company' ? `${t.button.primary}15` : 'transparent', color: formData.type === 'company' ? t.button.primary : t.text.secondary, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>🏢 شركة</button>
              </div>
            </div>
            <div><label style={labelStyle}>الاسم *</label><input type="text" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{...inputStyle, borderColor: errors.name ? t.status.danger.text : t.border.primary}} placeholder="اسم العميل" />{errors.name && <span style={{ fontSize: 12, color: t.status.danger.text }}>{errors.name}</span>}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label style={labelStyle}><Phone size={12} style={{ marginLeft: 4 }} />الجوال</label><input type="tel" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={inputStyle} placeholder="05xxxxxxxx" /></div>
              <div><label style={labelStyle}><Mail size={12} style={{ marginLeft: 4 }} />البريد</label><input type="email" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} style={inputStyle} placeholder="email@example.com" /></div>
            </div>
            <div><label style={labelStyle}><MapPin size={12} style={{ marginLeft: 4 }} />العنوان</label><input type="text" value={formData.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})} style={inputStyle} placeholder="المدينة - الحي - الشارع" /></div>
            <div><label style={labelStyle}>ملاحظات</label><textarea value={formData.notes || ''} onChange={(e) => setFormData({...formData, notes: e.target.value})} style={{...inputStyle, minHeight: 70, resize: 'vertical'}} placeholder="ملاحظات إضافية..." /></div>
          </div>
        );

      case 'suppliers':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: `#f9731615`, padding: 12, borderRadius: 12, textAlign: 'center' }}>
              <span style={{ fontSize: 12, color: t.text.muted }}>رقم المورد</span>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#f97316', margin: '4px 0 0 0', fontFamily: 'monospace' }}>{formData.code}</p>
            </div>
            <div><label style={labelStyle}>اسم المورد *</label><input type="text" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{...inputStyle, borderColor: errors.name ? t.status.danger.text : t.border.primary}} placeholder="اسم المورد أو الشركة" /></div>
            <div><label style={labelStyle}>التصنيف</label><input type="text" value={formData.category || ''} onChange={(e) => setFormData({...formData, category: e.target.value})} style={inputStyle} placeholder="مثال: مواد بناء، كهرباء، سباكة..." /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label style={labelStyle}><Phone size={12} style={{ marginLeft: 4 }} />الجوال</label><input type="tel" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={inputStyle} placeholder="05xxxxxxxx" /></div>
              <div><label style={labelStyle}><Mail size={12} style={{ marginLeft: 4 }} />البريد</label><input type="email" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} style={inputStyle} placeholder="email@example.com" /></div>
            </div>
            <div><label style={labelStyle}><MapPin size={12} style={{ marginLeft: 4 }} />العنوان</label><input type="text" value={formData.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})} style={inputStyle} placeholder="العنوان" /></div>
            <div><label style={labelStyle}>ملاحظات</label><textarea value={formData.notes || ''} onChange={(e) => setFormData({...formData, notes: e.target.value})} style={{...inputStyle, minHeight: 70, resize: 'vertical'}} /></div>
          </div>
        );

      case 'documents':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: `#8b5cf615`, padding: 12, borderRadius: 12, textAlign: 'center' }}>
              <span style={{ fontSize: 12, color: t.text.muted }}>رقم المستند</span>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#8b5cf6', margin: '4px 0 0 0', fontFamily: 'monospace' }}>{formData.code}</p>
            </div>
            <div>
              <label style={labelStyle}>نوع المستند</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {documentTypes.map(type => (
                  <button key={type.value} type="button" onClick={() => setFormData({...formData, type: type.value})}
                    style={{ padding: '10px 8px', borderRadius: 10, border: `1px solid ${formData.type === type.value ? type.color : t.border.primary}`, background: formData.type === type.value ? `${type.color}15` : 'transparent', color: formData.type === type.value ? type.color : t.text.secondary, cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <type.icon size={18} />{type.label}
                  </button>
                ))}
              </div>
            </div>
            <div><label style={labelStyle}>العنوان *</label><input type="text" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} style={{...inputStyle, borderColor: errors.title ? t.status.danger.text : t.border.primary}} placeholder="عنوان المستند" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label style={labelStyle}><Hash size={12} style={{ marginLeft: 4 }} />رقم المستند</label><input type="text" value={formData.number || ''} onChange={(e) => setFormData({...formData, number: e.target.value})} style={inputStyle} placeholder="رقم الفاتورة/العقد" /></div>
              <div><label style={labelStyle}><Calendar size={12} style={{ marginLeft: 4 }} />التاريخ</label><input type="date" value={formData.date || ''} onChange={(e) => setFormData({...formData, date: e.target.value})} style={inputStyle} /></div>
            </div>
            <div><label style={labelStyle}>المبلغ</label><input type="number" value={formData.amount || ''} onChange={(e) => setFormData({...formData, amount: e.target.value})} style={inputStyle} placeholder="0" /></div>
            <div style={{ background: t.bg.tertiary, padding: 14, borderRadius: 10, border: `1px solid ${t.border.primary}` }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: t.text.secondary, marginBottom: 12 }}>🔗 ربط المستند</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {(formData.type === 'invoice_out' || formData.type === 'contract' || formData.type === 'receipt') && (
                  <div><label style={labelStyle}><Users size={12} style={{ marginLeft: 4 }} />العميل</label><select value={formData.clientId || ''} onChange={(e) => setFormData({...formData, clientId: e.target.value})} style={inputStyle}><option value="">اختر العميل</option>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                )}
                {(formData.type === 'invoice_in' || formData.type === 'payment') && (
                  <div><label style={labelStyle}><Building2 size={12} style={{ marginLeft: 4 }} />المورد</label><select value={formData.supplierId || ''} onChange={(e) => setFormData({...formData, supplierId: e.target.value})} style={inputStyle}><option value="">اختر المورد</option>{suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
                )}
                <div><label style={labelStyle}><FolderOpen size={12} style={{ marginLeft: 4 }} />المشروع</label><select value={formData.projectId || ''} onChange={(e) => setFormData({...formData, projectId: e.target.value})} style={inputStyle}><option value="">اختر المشروع</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
                <div><label style={labelStyle}><Wallet size={12} style={{ marginLeft: 4 }} />الحساب</label><select value={formData.accountId || ''} onChange={(e) => setFormData({...formData, accountId: e.target.value})} style={inputStyle}><option value="">اختر الحساب</option>{accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div>
              </div>
            </div>
            <div><label style={labelStyle}>ملاحظات</label><textarea value={formData.notes || ''} onChange={(e) => setFormData({...formData, notes: e.target.value})} style={{...inputStyle, minHeight: 60, resize: 'vertical'}} /></div>
          </div>
        );

      case 'materials':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: `#10b98115`, padding: 12, borderRadius: 12, textAlign: 'center' }}>
              <span style={{ fontSize: 12, color: t.text.muted }}>رقم الصنف</span>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#10b981', margin: '4px 0 0 0', fontFamily: 'monospace' }}>{formData.code}</p>
            </div>
            <div><label style={labelStyle}>اسم الصنف *</label><input type="text" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{...inputStyle, borderColor: errors.name ? t.status.danger.text : t.border.primary}} placeholder="مثال: حديد تسليح 16مم" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label style={labelStyle}>الوحدة</label><select value={formData.unit || 'unit'} onChange={(e) => setFormData({...formData, unit: e.target.value})} style={inputStyle}>
                <option value="unit">قطعة</option>
                <option value="kg">كيلو</option>
                <option value="ton">طن</option>
                <option value="m">متر</option>
                <option value="m2">متر مربع</option>
                <option value="m3">متر مكعب</option>
                <option value="bag">كيس</option>
                <option value="box">صندوق</option>
              </select></div>
              <div><label style={labelStyle}>السعر</label><input type="number" value={formData.price || ''} onChange={(e) => setFormData({...formData, price: e.target.value})} style={inputStyle} placeholder="0" /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label style={labelStyle}>الكمية الحالية</label><input type="number" value={formData.quantity || ''} onChange={(e) => setFormData({...formData, quantity: e.target.value})} style={inputStyle} placeholder="0" /></div>
              <div><label style={labelStyle}>الحد الأدنى</label><input type="number" value={formData.minQuantity || ''} onChange={(e) => setFormData({...formData, minQuantity: e.target.value})} style={inputStyle} placeholder="0" /></div>
            </div>
            <div><label style={labelStyle}><Building2 size={12} style={{ marginLeft: 4 }} />المورد</label><select value={formData.supplierId || ''} onChange={(e) => setFormData({...formData, supplierId: e.target.value})} style={inputStyle}><option value="">اختر المورد</option>{suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
            <div><label style={labelStyle}><MapPin size={12} style={{ marginLeft: 4 }} />موقع التخزين</label><input type="text" value={formData.location || ''} onChange={(e) => setFormData({...formData, location: e.target.value})} style={inputStyle} placeholder="المستودع، الرف..." /></div>
            <div><label style={labelStyle}>ملاحظات</label><textarea value={formData.notes || ''} onChange={(e) => setFormData({...formData, notes: e.target.value})} style={{...inputStyle, minHeight: 60, resize: 'vertical'}} /></div>
          </div>
        );

      case 'equipment':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: `#ef444415`, padding: 12, borderRadius: 12, textAlign: 'center' }}>
              <span style={{ fontSize: 12, color: t.text.muted }}>رقم المعدة</span>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#ef4444', margin: '4px 0 0 0', fontFamily: 'monospace' }}>{formData.code}</p>
            </div>
            <div><label style={labelStyle}>اسم المعدة *</label><input type="text" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{...inputStyle, borderColor: errors.name ? t.status.danger.text : t.border.primary}} placeholder="مثال: حفارة كوماتسو" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label style={labelStyle}>النوع</label><input type="text" value={formData.type || ''} onChange={(e) => setFormData({...formData, type: e.target.value})} style={inputStyle} placeholder="حفارة، شاحنة، رافعة..." /></div>
              <div><label style={labelStyle}><Truck size={12} style={{ marginLeft: 4 }} />رقم اللوحة</label><input type="text" value={formData.plateNumber || ''} onChange={(e) => setFormData({...formData, plateNumber: e.target.value})} style={inputStyle} placeholder="أ ب ج 1234" /></div>
            </div>
            <div>
              <label style={labelStyle}>الحالة</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                {equipmentStatuses.map(status => (
                  <button key={status.value} type="button" onClick={() => setFormData({...formData, status: status.value})}
                    style={{ padding: '8px', borderRadius: 8, border: `1px solid ${formData.status === status.value ? status.color : t.border.primary}`, background: formData.status === status.value ? `${status.color}15` : 'transparent', color: formData.status === status.value ? status.color : t.text.secondary, cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'inherit' }}>
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label style={labelStyle}><Calendar size={12} style={{ marginLeft: 4 }} />تاريخ الشراء</label><input type="date" value={formData.purchaseDate || ''} onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})} style={inputStyle} /></div>
              <div><label style={labelStyle}>القيمة</label><input type="number" value={formData.value || ''} onChange={(e) => setFormData({...formData, value: e.target.value})} style={inputStyle} placeholder="0" /></div>
            </div>
            <div><label style={labelStyle}><FolderOpen size={12} style={{ marginLeft: 4 }} />المشروع الحالي</label><select value={formData.projectId || ''} onChange={(e) => setFormData({...formData, projectId: e.target.value})} style={inputStyle}><option value="">غير مخصص</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
            <div><label style={labelStyle}>ملاحظات</label><textarea value={formData.notes || ''} onChange={(e) => setFormData({...formData, notes: e.target.value})} style={{...inputStyle, minHeight: 60, resize: 'vertical'}} /></div>
          </div>
        );

      default:
        return null;
    }
  };

  // ═══════════════════════════════════════════════════════════
  // عرض البطاقات
  // ═══════════════════════════════════════════════════════════
  const renderCard = (item, index) => {
    const color = t.colors[colorKeys[index % colorKeys.length]] || t.colors[colorKeys[0]];
    const activeTabInfo = tabs.find(tab => tab.id === activeTab);

    switch (activeTab) {
      case 'clients':
        const clientProjects = projects.filter(p => p.clientId === item.id);
        return (
          <div key={item.id} style={{ background: t.bg.secondary, borderRadius: 14, border: `1px solid ${t.border.primary}`, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${t.border.primary}`, background: `${color.main}08` }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: color.main, fontFamily: 'monospace', background: `${color.main}15`, padding: '2px 6px', borderRadius: 4 }}>{item.code}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => openViewModal(item)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: t.bg.tertiary, color: t.text.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Eye size={14} /></button>
                <button onClick={() => openEditModal(item)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: t.bg.tertiary, color: t.text.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit size={14} /></button>
                <button onClick={() => openDeleteModal(item)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: t.status.danger.bg, color: t.status.danger.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={14} /></button>
              </div>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: color.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff' }}>{item.type === 'company' ? '🏢' : '👤'}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: t.text.primary, margin: 0 }}>{item.name}</h3>
                  <span style={{ fontSize: 11, color: t.text.muted }}>{item.type === 'company' ? 'شركة' : 'فرد'}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {item.phone && <div style={{ fontSize: 12, color: t.text.secondary, display: 'flex', alignItems: 'center', gap: 6 }}><Phone size={12} />{item.phone}</div>}
                {item.email && <div style={{ fontSize: 12, color: t.text.secondary, display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={12} />{item.email}</div>}
              </div>
            </div>
            {clientProjects.length > 0 && (
              <div style={{ padding: '10px 16px', borderTop: `1px solid ${t.border.primary}`, background: `${t.bg.tertiary}50` }}>
                <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 15, background: tagColors.project.bg, color: tagColors.project.color, border: `1px solid ${tagColors.project.border}`, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <FolderOpen size={11} />{clientProjects.length} مشروع
                </span>
              </div>
            )}
          </div>
        );

      case 'suppliers':
        const supplierMaterials = materials.filter(m => m.supplierId === item.id);
        return (
          <div key={item.id} style={{ background: t.bg.secondary, borderRadius: 14, border: `1px solid ${t.border.primary}`, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${t.border.primary}`, background: `#f9731608` }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#f97316', fontFamily: 'monospace', background: '#f9731615', padding: '2px 6px', borderRadius: 4 }}>{item.code}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => openEditModal(item)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: t.bg.tertiary, color: t.text.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit size={14} /></button>
                <button onClick={() => openDeleteModal(item)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: t.status.danger.bg, color: t.status.danger.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={14} /></button>
              </div>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #f97316, #fb923c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building2 size={22} color="#fff" /></div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: t.text.primary, margin: 0 }}>{item.name}</h3>
                  {item.category && <span style={{ fontSize: 11, color: t.text.muted }}>{item.category}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {item.phone && <div style={{ fontSize: 12, color: t.text.secondary, display: 'flex', alignItems: 'center', gap: 6 }}><Phone size={12} />{item.phone}</div>}
              </div>
            </div>
            {supplierMaterials.length > 0 && (
              <div style={{ padding: '10px 16px', borderTop: `1px solid ${t.border.primary}`, background: `${t.bg.tertiary}50` }}>
                <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 15, background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Boxes size={11} />{supplierMaterials.length} صنف
                </span>
              </div>
            )}
          </div>
        );

      case 'documents':
        const docType = documentTypes.find(dt => dt.value === item.type) || documentTypes[0];
        const linkedClient = clients.find(c => c.id === item.clientId);
        const linkedSupplier = suppliers.find(s => s.id === item.supplierId);
        const linkedProject = projects.find(p => p.id === item.projectId);
        return (
          <div key={item.id} style={{ background: t.bg.secondary, borderRadius: 14, border: `1px solid ${t.border.primary}`, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${t.border.primary}`, background: `${docType.color}08` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: docType.color, fontFamily: 'monospace', background: `${docType.color}15`, padding: '2px 6px', borderRadius: 4 }}>{item.code}</span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: `${docType.color}15`, color: docType.color }}>{docType.label}</span>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => openViewModal(item)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: t.bg.tertiary, color: t.text.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Eye size={14} /></button>
                <button onClick={() => openEditModal(item)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: t.bg.tertiary, color: t.text.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit size={14} /></button>
                <button onClick={() => openDeleteModal(item)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: t.status.danger.bg, color: t.status.danger.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={14} /></button>
              </div>
            </div>
            <div style={{ padding: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: t.text.primary, margin: '0 0 8px 0' }}>{item.title}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                {item.amount && <span style={{ fontSize: 14, fontWeight: 700, color: docType.color }}>{formatNumber(item.amount)} ﷼</span>}
                {item.date && <span style={{ fontSize: 11, color: t.text.muted, display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={11} />{item.date}</span>}
                {item.number && <span style={{ fontSize: 11, color: t.text.muted }}>#{item.number}</span>}
              </div>
            </div>
            {(linkedClient || linkedSupplier || linkedProject) && (
              <div style={{ padding: '10px 16px', borderTop: `1px solid ${t.border.primary}`, display: 'flex', gap: 8, flexWrap: 'wrap', background: `${t.bg.tertiary}50` }}>
                {linkedClient && <LinkedTag type="client" icon={Users} label={linkedClient.name} data={linkedClient} />}
                {linkedSupplier && <LinkedTag type="supplier" icon={Building2} label={linkedSupplier.name} data={linkedSupplier} />}
                {linkedProject && <LinkedTag type="project" icon={FolderOpen} label={linkedProject.name} data={linkedProject} />}
              </div>
            )}
          </div>
        );

      case 'materials':
        const matSupplier = suppliers.find(s => s.id === item.supplierId);
        const isLowStock = (parseFloat(item.quantity) || 0) <= (parseFloat(item.minQuantity) || 0);
        const totalValue = (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0);
        return (
          <div key={item.id} style={{ background: t.bg.secondary, borderRadius: 14, border: `1px solid ${isLowStock ? t.status.danger.border : t.border.primary}`, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${t.border.primary}`, background: isLowStock ? t.status.danger.bg : `#10b98108` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981', fontFamily: 'monospace', background: '#10b98115', padding: '2px 6px', borderRadius: 4 }}>{item.code}</span>
                {isLowStock && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: t.status.danger.bg, color: t.status.danger.text }}>⚠️ نقص</span>}
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => openEditModal(item)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: t.bg.tertiary, color: t.text.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit size={14} /></button>
                <button onClick={() => openDeleteModal(item)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: t.status.danger.bg, color: t.status.danger.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={14} /></button>
              </div>
            </div>
            <div style={{ padding: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: t.text.primary, margin: '0 0 10px 0' }}>{item.name}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ background: t.bg.tertiary, padding: 10, borderRadius: 8, textAlign: 'center' }}>
                  <p style={{ fontSize: 11, color: t.text.muted, margin: 0 }}>الكمية</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: isLowStock ? t.status.danger.text : '#10b981', margin: '4px 0 0 0' }}>{item.quantity || 0}</p>
                </div>
                <div style={{ background: t.bg.tertiary, padding: 10, borderRadius: 8, textAlign: 'center' }}>
                  <p style={{ fontSize: 11, color: t.text.muted, margin: 0 }}>القيمة</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: t.text.primary, margin: '4px 0 0 0' }}>{formatNumber(totalValue)} ﷼</p>
                </div>
              </div>
            </div>
            {matSupplier && (
              <div style={{ padding: '10px 16px', borderTop: `1px solid ${t.border.primary}`, background: `${t.bg.tertiary}50` }}>
                <LinkedTag type="supplier" icon={Building2} label={matSupplier.name} data={matSupplier} />
              </div>
            )}
          </div>
        );

      case 'equipment':
        const eqStatus = equipmentStatuses.find(s => s.value === item.status) || equipmentStatuses[0];
        const eqProject = projects.find(p => p.id === item.projectId);
        return (
          <div key={item.id} style={{ background: t.bg.secondary, borderRadius: 14, border: `1px solid ${t.border.primary}`, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${t.border.primary}`, background: `#ef444408` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', fontFamily: 'monospace', background: '#ef444415', padding: '2px 6px', borderRadius: 4 }}>{item.code}</span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: `${eqStatus.color}15`, color: eqStatus.color }}>{eqStatus.label}</span>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => openEditModal(item)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: t.bg.tertiary, color: t.text.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit size={14} /></button>
                <button onClick={() => openDeleteModal(item)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: t.status.danger.bg, color: t.status.danger.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={14} /></button>
              </div>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #ef4444, #f87171)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Wrench size={22} color="#fff" /></div>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: t.text.primary, margin: 0 }}>{item.name}</h3>
                  {item.type && <span style={{ fontSize: 11, color: t.text.muted }}>{item.type}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                {item.plateNumber && <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: t.bg.tertiary, color: t.text.secondary, display: 'flex', alignItems: 'center', gap: 4 }}><Truck size={11} />{item.plateNumber}</span>}
                {item.value && <span style={{ fontSize: 12, fontWeight: 600, color: '#ef4444' }}>{formatNumber(item.value)} ﷼</span>}
              </div>
            </div>
            {eqProject && (
              <div style={{ padding: '10px 16px', borderTop: `1px solid ${t.border.primary}`, background: `${t.bg.tertiary}50` }}>
                <LinkedTag type="project" icon={FolderOpen} label={eqProject.name} data={eqProject} />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // ═══════════════════════════════════════════════════════════
  // الـ Render الرئيسي
  // ═══════════════════════════════════════════════════════════
  const activeTabInfo = tabs.find(tab => tab.id === activeTab);
  const stats = getStats();

  return (
    <div style={{ padding: '24px 0', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: t.text.primary, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Package size={28} />إدارة الموارد
          </h2>
          <p style={{ fontSize: 14, color: t.text.muted, marginTop: 4 }}>العملاء، الموردين، المستندات، المواد، المعدات</p>
        </div>
        <button onClick={openAddModal} style={addButtonStyle}>
          <Plus size={18} />إضافة {activeTabInfo?.label}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, background: t.bg.secondary, padding: 6, borderRadius: 14, border: `1px solid ${t.border.primary}`, overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSearchTerm(''); setFilterType('all'); }}
            style={{
              flex: 1,
              minWidth: 100,
              padding: '12px 16px',
              borderRadius: 10,
              border: 'none',
              background: activeTab === tab.id ? t.button.gradient : 'transparent',
              color: activeTab === tab.id ? '#fff' : t.text.muted,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            <tab.icon size={16} />
            {tab.label}
            <span style={{ background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : t.bg.tertiary, padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ background: t.bg.secondary, borderRadius: 14, padding: 18, border: `1px solid ${t.border.primary}` }}>
            <p style={{ fontSize: 12, color: t.text.muted, margin: '0 0 6px 0' }}>{stat.label}</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: stat.color, margin: 0 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, background: t.bg.secondary, padding: 12, borderRadius: 12, border: `1px solid ${t.border.primary}` }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: t.text.muted }} />
          <input
            type="text"
            placeholder={`بحث في ${activeTabInfo?.label}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ ...inputStyle, paddingRight: 40 }}
          />
        </div>
      </div>

      {/* Content Grid */}
      {filteredData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: t.bg.secondary, borderRadius: 14, border: `1px solid ${t.border.primary}` }}>
          {activeTabInfo && <activeTabInfo.icon size={48} style={{ color: t.text.muted, marginBottom: 16, opacity: 0.5 }} />}
          <p style={{ color: t.text.muted, fontSize: 16 }}>لا يوجد {activeTabInfo?.label}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filteredData.map((item, index) => renderCard(item, index))}
        </div>
      )}

      {/* Add Modal */}
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)} title={`إضافة ${activeTabInfo?.label}`} onSubmit={handleAdd} submitText="إضافة">
        {renderFormContent()}
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)} title={`تعديل ${activeTabInfo?.label}`} onSubmit={handleEdit} submitText="حفظ التعديلات">
        {renderFormContent()}
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="تأكيد الحذف" onSubmit={handleDelete} submitText="حذف" danger>
        <div style={{ textAlign: 'center', padding: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: t.status.danger.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <AlertTriangle size={32} color={t.status.danger.text} />
          </div>
          <p style={{ fontSize: 16, color: t.text.primary, marginBottom: 8 }}>هل أنت متأكد من الحذف؟</p>
          <p style={{ fontSize: 18, fontWeight: 700, color: t.status.danger.text }}>{selectedItem?.name || selectedItem?.title}</p>
          <p style={{ fontSize: 13, color: t.text.muted, marginTop: 8 }}>لا يمكن التراجع عن هذا الإجراء</p>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal show={showViewModal} onClose={() => setShowViewModal(false)} title="تفاصيل" hideFooter>
        {selectedItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(selectedItem).filter(([key]) => !['id'].includes(key)).map(([key, value]) => (
              value && (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${t.border.primary}` }}>
                  <span style={{ fontSize: 13, color: t.text.muted }}>{key}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: t.text.primary }}>{value}</span>
                </div>
              )
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Resources;
