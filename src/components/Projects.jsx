// src/components/Projects.jsx
import React, { useState } from 'react';
import { 
  FolderOpen, Plus, Search, Edit, Trash2, Calendar, AlertTriangle, X,
  FolderPlus, Upload, File, Image, Download, ChevronDown, ChevronUp
} from 'lucide-react';
import { formatNumber, generateCode } from '../utils/helpers';

// ═══════════════ Modal Component (خارج المكون الرئيسي) ═══════════════
const Modal = ({ show, onClose, title, children, onSubmit, submitText, danger, loading, theme }) => {
  const t = theme;
  if (!show) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={onClose}>
      <div style={{ background: t.bg.secondary, borderRadius: 16, width: '100%', maxWidth: 500, border: `1px solid ${t.border.primary}`, maxHeight: '90vh', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${t.border.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: t.bg.tertiary }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: t.text.primary, margin: 0 }}>{title}</h3>
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
};

const Projects = ({ projects, onAdd, onEdit, onDelete, onAddFolder, onUploadFile, onDeleteFile, darkMode, theme }) => {
  const t = theme;
  const colorKeys = t.colorKeys || Object.keys(t.colors);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedProject, setExpandedProject] = useState(null);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const emptyForm = { name: '', description: '', status: 'نشط', client: '', budget: '', startDate: '', endDate: '', code: '' };
  const [formData, setFormData] = useState(emptyForm);
  const [folderName, setFolderName] = useState('');
  const [errors, setErrors] = useState({});

  const statuses = ['نشط', 'متوقف', 'مكتمل'];

  const filteredProjects = projects.filter(project => {
    const matchSearch = project.name?.toLowerCase().includes(searchTerm.toLowerCase()) || project.code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'نشط').length;
  const completedProjects = projects.filter(p => p.status === 'مكتمل').length;

  const getStatusStyle = (status) => {
    if (status === 'مكتمل') return { color: t.status.success.text, bg: t.status.success.bg, border: t.status.success.border };
    if (status === 'متوقف') return { color: t.status.danger.text, bg: t.status.danger.bg, border: t.status.danger.border };
    return { color: t.status.info.text, bg: t.status.info.bg, border: t.status.info.border };
  };

  const getFileIcon = (type) => type?.startsWith('image/') ? <Image size={16} /> : <File size={16} />;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'اسم المشروع مطلوب';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openAddModal = () => { setFormData({ ...emptyForm, code: generateCode('projects') }); setErrors({}); setShowAddModal(true); };
  const openEditModal = (project) => {
    setSelectedProject(project);
    setFormData({ name: project.name || '', description: project.description || '', status: project.status || 'نشط', client: project.client || '', budget: project.budget || '', startDate: project.startDate || '', endDate: project.endDate || '', code: project.code || '' });
    setErrors({}); setShowEditModal(true);
  };
  const openDeleteModal = (project) => { setSelectedProject(project); setShowDeleteModal(true); };
  const openFolderModal = (project) => { setSelectedProject(project); setFolderName(''); setShowFolderModal(true); };

  const handleAdd = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try { await onAdd({ ...formData, budget: parseFloat(formData.budget) || 0 }); setShowAddModal(false); setFormData(emptyForm); } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleEdit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try { await onEdit({ ...selectedProject, ...formData, budget: parseFloat(formData.budget) || 0 }); setShowEditModal(false); } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try { await onDelete(selectedProject.id); setShowDeleteModal(false); } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleAddFolder = async () => {
    if (!folderName.trim()) return;
    setLoading(true);
    try { await onAddFolder(selectedProject.id, folderName); setShowFolderModal(false); setFolderName(''); } catch (e) { console.error(e); }
    setLoading(false);
  };

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${t.border.primary}`, background: t.bg.tertiary, color: t.text.primary, fontSize: 14, fontFamily: 'inherit', outline: 'none' };
  const filterSelectStyle = { padding: '10px 14px', paddingLeft: 32, borderRadius: 10, border: `1px solid ${t.border.primary}`, background: t.bg.tertiary, color: t.text.primary, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', appearance: 'none', outline: 'none', minWidth: 110 };
  const labelStyle = { display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: t.text.secondary };
  const addButtonStyle = { padding: '10px 20px', borderRadius: 10, border: 'none', background: t.button.gradient, color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8 };

  return (
    <div style={{ padding: '24px 0', paddingBottom: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: t.text.primary, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}><FolderOpen size={28} />المشاريع</h2>
          <p style={{ fontSize: 14, color: t.text.muted, marginTop: 4 }}>إدارة المشاريع والملفات</p>
        </div>
        <button onClick={openAddModal} style={addButtonStyle}><Plus size={18} />إضافة مشروع</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[{ label: 'إجمالي المشاريع', value: totalProjects, color: t.colors[colorKeys[0]]?.main }, { label: 'نشط', value: activeProjects, color: t.status.success.text }, { label: 'مكتمل', value: completedProjects, color: t.status.info.text }].map((stat, i) => (
          <div key={i} style={{ background: t.bg.secondary, borderRadius: 14, padding: 20, border: `1px solid ${t.border.primary}` }}>
            <p style={{ fontSize: 13, color: t.text.muted, margin: '0 0 8px 0' }}>{stat.label}</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: stat.color, margin: 0 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center', background: t.bg.secondary, padding: 12, borderRadius: 12, border: `1px solid ${t.border.primary}` }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: t.text.muted }} />
          <input type="text" placeholder="بحث بالاسم أو الرمز..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, paddingRight: 40 }} />
        </div>
        <div style={{ position: 'relative' }}>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={filterSelectStyle}><option value="all">كل الحالات</option>{statuses.map(s => <option key={s} value={s}>{s}</option>)}</select>
          <ChevronDown size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: t.text.muted, pointerEvents: 'none' }} />
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: t.bg.secondary, borderRadius: 14, border: `1px solid ${t.border.primary}` }}>
          <FolderOpen size={48} style={{ color: t.text.muted, marginBottom: 16, opacity: 0.5 }} />
          <p style={{ color: t.text.muted, fontSize: 16 }}>لا توجد مشاريع</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filteredProjects.map((project, index) => {
            const statusStyle = getStatusStyle(project.status);
            const isExpanded = expandedProject === project.id;
            const color = t.colors[colorKeys[index % colorKeys.length]] || t.colors[colorKeys[0]];

            return (
              <div key={project.id} style={{ background: t.bg.secondary, borderRadius: 16, border: `1px solid ${t.border.primary}`, overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${t.border.primary}`, background: `${color.main}08` }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: color.main, fontFamily: 'monospace', background: `${color.main}15`, padding: '2px 6px', borderRadius: 4 }}>{project.code || 'P-0000'}</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => openEditModal(project)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: t.bg.tertiary, color: t.text.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit size={14} /></button>
                    <button onClick={() => openDeleteModal(project)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: t.status.danger.bg, color: t.status.danger.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={14} /></button>
                  </div>
                </div>
                <div style={{ padding: 20, textAlign: 'center' }}>
                  <div style={{ width: 56, height: 56, margin: '0 auto 16px', borderRadius: 14, background: color.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FolderOpen size={28} color="#fff" /></div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text.primary, margin: '0 0 6px 0' }}>{project.name}</h3>
                  {project.client && <p style={{ fontSize: 12, color: t.text.muted, margin: '0 0 12px 0' }}>العميل: {project.client}</p>}
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 11, padding: '5px 12px', borderRadius: 20, background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}`, fontWeight: 600 }}>{project.status}</span>
                    {project.budget > 0 && <span style={{ fontSize: 11, padding: '5px 12px', borderRadius: 20, background: t.bg.tertiary, color: t.text.primary, fontWeight: 700 }}>{formatNumber(project.budget)} ريال</span>}
                  </div>
                  {(project.startDate || project.endDate) && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11, color: t.text.muted }}><Calendar size={12} /><span>{project.startDate || '---'} ← {project.endDate || '---'}</span></div>
                  )}
                  <button onClick={() => setExpandedProject(isExpanded ? null : project.id)} style={{ marginTop: 12, padding: '8px 16px', borderRadius: 8, border: `1px solid ${t.border.primary}`, background: 'transparent', color: t.text.muted, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, width: '100%' }}>
                    {isExpanded ? <><ChevronUp size={14} />إخفاء المجلدات</> : <><ChevronDown size={14} />عرض المجلدات ({project.folders?.length || 0})</>}
                  </button>
                </div>
                {isExpanded && (
                  <div style={{ borderTop: `1px solid ${t.border.primary}`, padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: t.text.secondary }}>المجلدات</span>
                      <button onClick={() => openFolderModal(project)} style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: t.button.gradient, color: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}><FolderPlus size={14} />إضافة</button>
                    </div>
                    {project.folders?.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {project.folders.map(folder => (
                          <div key={folder.id} style={{ background: t.bg.tertiary, borderRadius: 8, padding: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                              <span style={{ fontSize: 12, fontWeight: 600, color: t.text.primary, display: 'flex', alignItems: 'center', gap: 4 }}><FolderOpen size={14} />{folder.name}</span>
                              <label style={{ padding: '4px 8px', borderRadius: 4, background: color.main, color: '#fff', cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', gap: 3 }}><Upload size={12} />رفع<input type="file" style={{ display: 'none' }} onChange={(e) => e.target.files[0] && onUploadFile(project.id, folder.id, e.target.files[0])} /></label>
                            </div>
                            {folder.files?.length > 0 && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {folder.files.map(file => (
                                  <div key={file.id} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', background: t.bg.secondary, borderRadius: 4, fontSize: 10 }}>
                                    {getFileIcon(file.type)}
                                    <span style={{ color: t.text.muted, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                                    <a href={file.url} target="_blank" rel="noopener noreferrer" style={{ color: color.main }}><Download size={12} /></a>
                                    <button onClick={() => onDeleteFile(project.id, folder.id, file.id)} style={{ background: 'none', border: 'none', color: t.status.danger.text, cursor: 'pointer', padding: 0 }}><Trash2 size={12} /></button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : <p style={{ fontSize: 12, color: t.text.muted, textAlign: 'center' }}>لا توجد مجلدات</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal show={showAddModal} onClose={() => setShowAddModal(false)} title="إضافة مشروع جديد" onSubmit={handleAdd} submitText="إضافة" loading={loading} theme={t}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: `${t.button.primary}15`, padding: 12, borderRadius: 12, textAlign: 'center' }}>
            <span style={{ fontSize: 12, color: t.text.muted }}>رقم المشروع</span>
            <p style={{ fontSize: 18, fontWeight: 700, color: t.button.primary, margin: '4px 0 0 0', fontFamily: 'monospace' }}>{formData.code}</p>
          </div>
          <div><label style={labelStyle}>اسم المشروع *</label><input type="text" value={formData.name} onChange={(e) => updateForm('name', e.target.value)} style={{...inputStyle, borderColor: errors.name ? t.status.danger.text : t.border.primary}} placeholder="مثال: مشروع فيلا الرياض" />{errors.name && <span style={{ fontSize: 12, color: t.status.danger.text }}>{errors.name}</span>}</div>
          <div><label style={labelStyle}>الوصف</label><textarea value={formData.description} onChange={(e) => updateForm('description', e.target.value)} style={{...inputStyle, minHeight: 80, resize: 'vertical'}} placeholder="وصف المشروع..." /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={labelStyle}>العميل</label><input type="text" value={formData.client} onChange={(e) => updateForm('client', e.target.value)} style={inputStyle} placeholder="اسم العميل" /></div>
            <div><label style={labelStyle}>الميزانية</label><input type="number" value={formData.budget} onChange={(e) => updateForm('budget', e.target.value)} style={inputStyle} placeholder="0" /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={labelStyle}>تاريخ البداية</label><input type="date" value={formData.startDate} onChange={(e) => updateForm('startDate', e.target.value)} style={inputStyle} /></div>
            <div><label style={labelStyle}>تاريخ النهاية</label><input type="date" value={formData.endDate} onChange={(e) => updateForm('endDate', e.target.value)} style={inputStyle} /></div>
          </div>
          <div><label style={labelStyle}>الحالة</label><select value={formData.status} onChange={(e) => updateForm('status', e.target.value)} style={inputStyle}>{statuses.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
        </div>
      </Modal>

      <Modal show={showEditModal} onClose={() => setShowEditModal(false)} title="تعديل المشروع" onSubmit={handleEdit} submitText="حفظ التعديلات" loading={loading} theme={t}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: `${t.button.primary}15`, padding: 12, borderRadius: 12, textAlign: 'center' }}>
            <span style={{ fontSize: 12, color: t.text.muted }}>رقم المشروع</span>
            <p style={{ fontSize: 18, fontWeight: 700, color: t.button.primary, margin: '4px 0 0 0', fontFamily: 'monospace' }}>{formData.code || 'P-0000'}</p>
          </div>
          <div><label style={labelStyle}>اسم المشروع *</label><input type="text" value={formData.name} onChange={(e) => updateForm('name', e.target.value)} style={{...inputStyle, borderColor: errors.name ? t.status.danger.text : t.border.primary}} /></div>
          <div><label style={labelStyle}>الوصف</label><textarea value={formData.description} onChange={(e) => updateForm('description', e.target.value)} style={{...inputStyle, minHeight: 80, resize: 'vertical'}} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={labelStyle}>العميل</label><input type="text" value={formData.client} onChange={(e) => updateForm('client', e.target.value)} style={inputStyle} /></div>
            <div><label style={labelStyle}>الميزانية</label><input type="number" value={formData.budget} onChange={(e) => updateForm('budget', e.target.value)} style={inputStyle} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={labelStyle}>تاريخ البداية</label><input type="date" value={formData.startDate} onChange={(e) => updateForm('startDate', e.target.value)} style={inputStyle} /></div>
            <div><label style={labelStyle}>تاريخ النهاية</label><input type="date" value={formData.endDate} onChange={(e) => updateForm('endDate', e.target.value)} style={inputStyle} /></div>
          </div>
          <div><label style={labelStyle}>الحالة</label><select value={formData.status} onChange={(e) => updateForm('status', e.target.value)} style={inputStyle}>{statuses.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
        </div>
      </Modal>

      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="حذف المشروع" onSubmit={handleDelete} submitText="حذف" danger loading={loading} theme={t}>
        <div style={{ textAlign: 'center', padding: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: t.status.danger.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><AlertTriangle size={32} color={t.status.danger.text} /></div>
          <p style={{ fontSize: 16, color: t.text.primary, marginBottom: 8 }}>هل أنت متأكد من حذف المشروع؟</p>
          <p style={{ fontSize: 18, fontWeight: 700, color: t.status.danger.text }}>{selectedProject?.code} - {selectedProject?.name}</p>
          <p style={{ fontSize: 13, color: t.text.muted, marginTop: 8 }}>سيتم حذف جميع المجلدات والملفات المرتبطة</p>
        </div>
      </Modal>

      <Modal show={showFolderModal} onClose={() => setShowFolderModal(false)} title="إضافة مجلد جديد" onSubmit={handleAddFolder} submitText="إضافة" loading={loading} theme={t}>
        <div><label style={labelStyle}>اسم المجلد</label><input type="text" value={folderName} onChange={(e) => setFolderName(e.target.value)} style={inputStyle} placeholder="مثال: العقود" /></div>
      </Modal>
    </div>
  );
};

export default Projects;
