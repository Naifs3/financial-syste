// src/components/Tasks.jsx
import React, { useState } from 'react';
import { 
  CheckSquare, Plus, Search, Edit, Trash2, Calendar,
  AlertTriangle, X, Check, Clock, Flag
} from 'lucide-react';
import { calcDaysRemaining, generateCode } from '../utils/helpers';

const Tasks = ({ tasks, projects = [], onAdd, onEdit, onDelete, onToggleStatus, darkMode, theme }) => {
  const t = theme;
  const colorKeys = t.colorKeys || Object.keys(t.colors);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const emptyForm = { title: '', description: '', status: 'قيد التنفيذ', priority: 'متوسط', dueDate: '', projectId: '', code: '' };
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const priorities = ['عاجل', 'عالي', 'متوسط', 'منخفض'];
  const statuses = ['قيد التنفيذ', 'مكتمل', 'معلق'];

  const filteredTasks = tasks.filter(task => {
    const matchSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) || task.code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'مكتمل').length;
  const pendingTasks = tasks.filter(t => t.status === 'قيد التنفيذ').length;

  const getStatusStyle = (status) => {
    if (status === 'مكتمل') return { bg: t.status.success.bg, text: t.status.success.text, border: t.status.success.border };
    if (status === 'معلق') return { bg: t.status.warning.bg, text: t.status.warning.text, border: t.status.warning.border };
    return { bg: t.status.info.bg, text: t.status.info.text, border: t.status.info.border };
  };

  const getPriorityStyle = (priority) => {
    if (priority === 'عاجل') return { bg: t.status.danger.bg, text: t.status.danger.text };
    if (priority === 'عالي') return { bg: t.status.warning.bg, text: t.status.warning.text };
    if (priority === 'منخفض') return { bg: t.status.success.bg, text: t.status.success.text };
    return { bg: t.status.info.bg, text: t.status.info.text };
  };

  const getDaysStyle = (days) => {
    if (days === null) return { bg: t.status.info.bg, text: t.status.info.text };
    if (days < 0) return { bg: t.status.danger.bg, text: t.status.danger.text };
    if (days <= 3) return { bg: t.status.warning.bg, text: t.status.warning.text };
    return { bg: t.status.success.bg, text: t.status.success.text };
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'عنوان المهمة مطلوب';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openAddModal = () => { setFormData({ ...emptyForm, code: generateCode('tasks') }); setErrors({}); setShowAddModal(true); };
  const openEditModal = (task) => {
    setSelectedTask(task);
    setFormData({ title: task.title || '', description: task.description || '', status: task.status || 'قيد التنفيذ', priority: task.priority || 'متوسط', dueDate: task.dueDate || '', projectId: task.projectId || '', code: task.code || '' });
    setErrors({}); setShowEditModal(true);
  };
  const openDeleteModal = (task) => { setSelectedTask(task); setShowDeleteModal(true); };

  const handleAdd = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try { await onAdd(formData); setShowAddModal(false); setFormData(emptyForm); } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleEdit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try { await onEdit({ ...selectedTask, ...formData }); setShowEditModal(false); } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try { await onDelete(selectedTask.id); setShowDeleteModal(false); } catch (e) { console.error(e); }
    setLoading(false);
  };

  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: t.radius.lg, border: `1px solid ${t.border.primary}`, background: t.bg.tertiary, color: t.text.primary, fontSize: 14, fontFamily: 'inherit' };
  const labelStyle = { display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: t.text.secondary };

  const Modal = ({ show, onClose, title, children, onSubmit, submitText, danger }) => {
    if (!show) return null;
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={onClose}>
        <div style={{ background: t.bg.secondary, borderRadius: t.radius.xl, width: '100%', maxWidth: 500, border: `1px solid ${t.border.primary}`, maxHeight: '90vh', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
          <div style={{ padding: '20px 24px', borderBottom: `1px solid ${t.border.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: t.text.primary, margin: 0 }}>{title}</h3>
            <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: t.radius.md, border: 'none', background: t.bg.tertiary, color: t.text.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
          </div>
          <div style={{ padding: 24, overflowY: 'auto', maxHeight: 'calc(90vh - 140px)' }}>{children}</div>
          <div style={{ padding: '16px 24px', borderTop: `1px solid ${t.border.primary}`, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: t.radius.lg, border: `1px solid ${t.border.primary}`, background: 'transparent', color: t.text.secondary, cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}>إلغاء</button>
            <button onClick={onSubmit} disabled={loading} style={{ padding: '10px 24px', borderRadius: t.radius.lg, border: 'none', background: danger ? t.status.danger.text : t.button.gradient, color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}>{loading ? 'جاري...' : submitText}</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '24px 0', paddingBottom: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: t.text.primary, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}><CheckSquare size={28} />المهام</h2>
          <p style={{ fontSize: 14, color: t.text.muted, marginTop: 4 }}>إدارة وتتبع المهام</p>
        </div>
        <button onClick={openAddModal} style={{ padding: '12px 24px', borderRadius: t.radius.lg, border: 'none', background: t.button.gradient, color: '#fff', cursor: 'pointer', fontSize: 15, fontWeight: 600, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}><Plus size={20} />إضافة مهمة</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[{ label: 'إجمالي المهام', value: totalTasks, color: t.colors[colorKeys[0]]?.main }, { label: 'مكتملة', value: completedTasks, color: t.status.success.text }, { label: 'قيد التنفيذ', value: pendingTasks, color: t.status.warning.text }].map((stat, i) => (
          <div key={i} style={{ background: t.bg.secondary, borderRadius: t.radius.xl, padding: 20, border: `1px solid ${t.border.primary}` }}>
            <p style={{ fontSize: 13, color: t.text.muted, margin: '0 0 8px 0' }}>{stat.label}</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: stat.color, margin: 0 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', background: t.bg.secondary, padding: 16, borderRadius: t.radius.xl, border: `1px solid ${t.border.primary}` }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: t.text.muted }} />
          <input type="text" placeholder="بحث بالعنوان أو الرمز..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, paddingRight: 40 }} />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: 130, cursor: 'pointer' }}>
          <option value="all">كل الحالات</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: 130, cursor: 'pointer' }}>
          <option value="all">كل الأولويات</option>
          {priorities.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {filteredTasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: t.bg.secondary, borderRadius: t.radius.xl, border: `1px solid ${t.border.primary}` }}>
          <CheckSquare size={48} style={{ color: t.text.muted, marginBottom: 16, opacity: 0.5 }} />
          <p style={{ color: t.text.muted, fontSize: 16 }}>لا توجد مهام</p>
          <button onClick={openAddModal} style={{ marginTop: 16, padding: '10px 24px', borderRadius: t.radius.lg, border: 'none', background: t.button.gradient, color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}><Plus size={18} style={{ marginLeft: 8, verticalAlign: 'middle' }} />إضافة مهمة جديدة</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filteredTasks.map((task, index) => {
            const days = calcDaysRemaining(task.dueDate);
            const statusStyle = getStatusStyle(task.status);
            const priorityStyle = getPriorityStyle(task.priority);
            const daysStyle = getDaysStyle(days);
            const isCompleted = task.status === 'مكتمل';
            const color = t.colors[colorKeys[index % colorKeys.length]] || t.colors[colorKeys[0]];
            const project = projects.find(p => p.id === task.projectId);

            return (
              <div key={task.id} style={{ width: '100%', background: t.bg.secondary, borderRadius: 12, border: `1px solid ${t.border.primary}`, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, opacity: isCompleted ? 0.7 : 1 }}>
                <button onClick={() => onToggleStatus(task.id)} style={{ width: 40, height: 40, borderRadius: 10, background: isCompleted ? t.status.success.bg : color.gradient, border: isCompleted ? `2px solid ${t.status.success.text}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                  {isCompleted ? <Check size={20} color={t.status.success.text} /> : <CheckSquare size={20} color="#fff" />}
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: color.main, fontFamily: 'monospace', background: `${color.main}15`, padding: '2px 6px', borderRadius: 4 }}>{task.code || 'T-0000'}</span>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: t.text.primary, margin: 0, textDecoration: isCompleted ? 'line-through' : 'none' }}>{task.title}</h3>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 5, background: priorityStyle.bg, color: priorityStyle.text, display: 'flex', alignItems: 'center', gap: 3 }}><Flag size={10} />{task.priority}</span>
                    <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 5, background: statusStyle.bg, color: statusStyle.text, border: `1px solid ${statusStyle.border}` }}>{task.status}</span>
                    {task.dueDate && <span style={{ fontSize: 11, color: t.text.muted, display: 'flex', alignItems: 'center', gap: 3 }}><Calendar size={12} />{task.dueDate}</span>}
                    {!isCompleted && days !== null && <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 5, background: daysStyle.bg, color: daysStyle.text, display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={11} />{days < 0 ? `متأخر ${Math.abs(days)} يوم` : `متبقي ${days} يوم`}</span>}
                    {project && <span style={{ fontSize: 11, color: t.text.muted }}>📁 {project.name}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  <button onClick={() => openEditModal(task)} style={{ width: 30, height: 30, borderRadius: 6, border: 'none', background: t.bg.tertiary, color: t.text.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit size={14} /></button>
                  <button onClick={() => openDeleteModal(task)} style={{ width: 30, height: 30, borderRadius: 6, border: 'none', background: t.status.danger.bg, color: t.status.danger.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal show={showAddModal} onClose={() => setShowAddModal(false)} title="إضافة مهمة جديدة" onSubmit={handleAdd} submitText="إضافة">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: `${t.button.primary}15`, padding: 12, borderRadius: t.radius.lg, textAlign: 'center' }}>
            <span style={{ fontSize: 12, color: t.text.muted }}>رقم المهمة</span>
            <p style={{ fontSize: 18, fontWeight: 700, color: t.button.primary, margin: '4px 0 0 0', fontFamily: 'monospace' }}>{formData.code}</p>
          </div>
          <div>
            <label style={labelStyle}>عنوان المهمة *</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} style={{...inputStyle, borderColor: errors.title ? t.status.danger.text : t.border.primary}} placeholder="مثال: مراجعة العقود" />
            {errors.title && <span style={{ fontSize: 12, color: t.status.danger.text }}>{errors.title}</span>}
          </div>
          <div><label style={labelStyle}>الوصف</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{...inputStyle, minHeight: 80, resize: 'vertical'}} placeholder="وصف المهمة..." /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={labelStyle}>الأولوية</label><select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} style={inputStyle}>{priorities.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
            <div><label style={labelStyle}>الحالة</label><select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} style={inputStyle}>{statuses.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={labelStyle}>تاريخ الاستحقاق</label><input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} style={inputStyle} /></div>
            <div><label style={labelStyle}>المشروع</label><select value={formData.projectId} onChange={(e) => setFormData({...formData, projectId: e.target.value})} style={inputStyle}><option value="">بدون مشروع</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          </div>
        </div>
      </Modal>

      <Modal show={showEditModal} onClose={() => setShowEditModal(false)} title="تعديل المهمة" onSubmit={handleEdit} submitText="حفظ التعديلات">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: `${t.button.primary}15`, padding: 12, borderRadius: t.radius.lg, textAlign: 'center' }}>
            <span style={{ fontSize: 12, color: t.text.muted }}>رقم المهمة</span>
            <p style={{ fontSize: 18, fontWeight: 700, color: t.button.primary, margin: '4px 0 0 0', fontFamily: 'monospace' }}>{formData.code || 'T-0000'}</p>
          </div>
          <div><label style={labelStyle}>عنوان المهمة *</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} style={{...inputStyle, borderColor: errors.title ? t.status.danger.text : t.border.primary}} /></div>
          <div><label style={labelStyle}>الوصف</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{...inputStyle, minHeight: 80, resize: 'vertical'}} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={labelStyle}>الأولوية</label><select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} style={inputStyle}>{priorities.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
            <div><label style={labelStyle}>الحالة</label><select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} style={inputStyle}>{statuses.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={labelStyle}>تاريخ الاستحقاق</label><input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} style={inputStyle} /></div>
            <div><label style={labelStyle}>المشروع</label><select value={formData.projectId} onChange={(e) => setFormData({...formData, projectId: e.target.value})} style={inputStyle}><option value="">بدون مشروع</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          </div>
        </div>
      </Modal>

      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="حذف المهمة" onSubmit={handleDelete} submitText="حذف" danger>
        <div style={{ textAlign: 'center', padding: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: t.status.danger.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><AlertTriangle size={32} color={t.status.danger.text} /></div>
          <p style={{ fontSize: 16, color: t.text.primary, marginBottom: 8 }}>هل أنت متأكد من حذف المهمة؟</p>
          <p style={{ fontSize: 18, fontWeight: 700, color: t.status.danger.text }}>{selectedTask?.code} - {selectedTask?.title}</p>
          <p style={{ fontSize: 13, color: t.text.muted, marginTop: 8 }}>لا يمكن التراجع عن هذا الإجراء</p>
        </div>
      </Modal>
    </div>
  );
};

export default Tasks;
