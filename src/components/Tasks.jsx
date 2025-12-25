// src/components/Tasks.jsx
import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Clock,
  AlertTriangle,
  Target,
  Calendar,
  User,
  FolderKanban
} from 'lucide-react';

const Tasks = ({ tasks, projects, onAdd, onEdit, onDelete, onToggleStatus, darkMode, theme }) => {
  const t = theme;
  const colorKeys = t.colorKeys || Object.keys(t.colors);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredTasks = tasks.filter(task => {
    const matchSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchSearch && matchPriority && matchStatus;
  });

  const urgentCount = tasks.filter(t => t.priority === 'urgent' && t.status !== 'مكتمل').length;
  const completedCount = tasks.filter(t => t.status === 'مكتمل').length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  // ألوان الأولوية
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'urgent': 
        return { 
          bg: t.status.danger.bg, 
          text: t.status.danger.text, 
          border: t.status.danger.border,
          name: 'مستعجل'
        };
      case 'medium': 
        return { 
          bg: t.status.warning.bg, 
          text: t.status.warning.text, 
          border: t.status.warning.border,
          name: 'متوسط'
        };
      case 'normal': 
        return { 
          bg: t.status.success.bg, 
          text: t.status.success.text, 
          border: t.status.success.border,
          name: 'عادي'
        };
      default: 
        return { 
          bg: t.status.info.bg, 
          text: t.status.info.text, 
          border: t.status.info.border,
          name: priority
        };
    }
  };

  // ألوان الحالة
  const getStatusStyle = (status) => {
    switch (status) {
      case 'مكتمل':
        return { bg: t.status.success.bg, text: t.status.success.text, border: t.status.success.border };
      case 'قيد التنفيذ':
        return { bg: t.status.info.bg, text: t.status.info.text, border: t.status.info.border };
      default:
        return { bg: `${t.text.muted}15`, text: t.text.muted, border: `${t.text.muted}30` };
    }
  };

  // البطاقات الإحصائية
  const statCards = [
    { 
      label: 'مستعجل', 
      value: urgentCount,
      icon: AlertTriangle,
      colorKey: colorKeys[0]
    },
    { 
      label: 'مكتملة', 
      value: `${completedCount}/${tasks.length}`,
      icon: CheckSquare,
      colorKey: colorKeys[1]
    },
    { 
      label: 'نسبة الإنجاز', 
      value: `${completionRate}%`,
      icon: Target,
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
              background: t.colors[colorKeys[1]]?.gradient || t.button.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: darkMode ? t.colors[colorKeys[1]]?.glow : 'none',
            }}>
              <CheckSquare size={22} color="#fff" />
            </div>
            المهام
          </h2>
          <p style={{ fontSize: 14, color: t.text.muted, marginTop: 6, marginRight: 50 }}>
            إدارة المهام مع متابعة الوقت
          </p>
        </div>
        
        <button
          onClick={() => {}}
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
          إضافة مهمة
        </button>
      </div>

      {/* ═══════════════ البطاقات الإحصائية ═══════════════ */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 16,
        marginBottom: 24,
      }}>
        {statCards.map((card, index) => {
          const color = t.colors[card.colorKey] || t.colors[colorKeys[0]];
          const Icon = card.icon;
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <p style={{ fontSize: 13, color: t.text.muted, margin: 0 }}>
                  {card.label}
                </p>
                <Icon size={18} color={color.main} />
              </div>
              <p style={{ 
                fontSize: 26, 
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
            placeholder="بحث في المهام..."
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
        
        {/* فلتر الأولوية */}
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
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
          <option value="all">كل الأولويات</option>
          <option value="urgent">مستعجل</option>
          <option value="medium">متوسط</option>
          <option value="normal">عادي</option>
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
          <option value="قيد الانتظار">قيد الانتظار</option>
          <option value="قيد التنفيذ">قيد التنفيذ</option>
          <option value="مكتمل">مكتمل</option>
        </select>
      </div>

      {/* ═══════════════ قائمة المهام ═══════════════ */}
      {filteredTasks.length === 0 ? (
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
            <CheckSquare size={40} color={t.text.muted} />
          </div>
          <p style={{ fontSize: 18, fontWeight: 700, color: t.text.primary, marginBottom: 8 }}>
            لا توجد مهام
          </p>
          <p style={{ fontSize: 14, color: t.text.muted }}>
            ابدأ بإضافة أول مهمة
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: 16,
        }}>
          {filteredTasks.map((task) => {
            const priorityStyle = getPriorityStyle(task.priority);
            const statusStyle = getStatusStyle(task.status);
            const project = projects.find(p => p.id === task.projectId);
            const isCompleted = task.status === 'مكتمل';
            
            return (
              <div
                key={task.id}
                style={{
                  background: t.bg.secondary,
                  borderRadius: t.radius.xl,
                  border: `1px solid ${t.border.primary}`,
                  padding: 20,
                  transition: 'all 0.3s ease',
                  opacity: isCompleted ? 0.7 : 1,
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
                      textDecoration: isCompleted ? 'line-through' : 'none',
                    }}>
                      {task.title}
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {/* شارة الأولوية */}
                      <span style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: t.radius.md,
                        background: priorityStyle.bg,
                        color: priorityStyle.text,
                        border: `1px solid ${priorityStyle.border}`,
                      }}>
                        {priorityStyle.name}
                      </span>
                      {/* شارة الحالة */}
                      <span style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: t.radius.md,
                        background: statusStyle.bg,
                        color: statusStyle.text,
                        border: `1px solid ${statusStyle.border}`,
                      }}>
                        {task.status}
                      </span>
                      {/* الرقم المرجعي */}
                      {task.refNumber && (
                        <span style={{ fontSize: 11, color: t.text.muted }}>
                          #{task.refNumber}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* أزرار التحكم */}
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => onToggleStatus(task.id)}
                      title={isCompleted ? 'إلغاء الاكتمال' : 'وضع علامة كمكتمل'}
                      style={{
                        padding: 8,
                        borderRadius: t.radius.md,
                        border: 'none',
                        background: isCompleted ? `${t.text.muted}20` : t.status.success.bg,
                        color: isCompleted ? t.text.muted : t.status.success.text,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                    >
                      <CheckSquare size={16} />
                    </button>
                    <button
                      onClick={() => onEdit(task)}
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
                      onClick={() => onDelete(task.id)}
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

                {/* الوصف */}
                {task.description && (
                  <p style={{ 
                    fontSize: 13, 
                    color: t.text.muted, 
                    marginBottom: 16,
                    lineHeight: 1.6,
                  }}>
                    {task.description}
                  </p>
                )}

                {/* التفاصيل */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {/* موعد الانتهاء */}
                  {task.dueDate && (
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
                        <span style={{ fontSize: 13, color: t.text.muted }}>موعد الانتهاء</span>
                      </div>
                      <span style={{ fontSize: 14, color: t.text.primary }}>
                        {task.dueDate}
                      </span>
                    </div>
                  )}
                  
                  {/* المشروع */}
                  {project && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: t.bg.tertiary,
                      borderRadius: t.radius.md,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FolderKanban size={16} color={t.text.muted} />
                        <span style={{ fontSize: 13, color: t.text.muted }}>المشروع</span>
                      </div>
                      <span style={{ fontSize: 14, color: t.text.primary }}>
                        {project.name}
                      </span>
                    </div>
                  )}
                  
                  {/* المسؤول */}
                  {task.assignedTo && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: t.bg.tertiary,
                      borderRadius: t.radius.md,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <User size={16} color={t.text.muted} />
                        <span style={{ fontSize: 13, color: t.text.muted }}>المسؤول</span>
                      </div>
                      <span style={{ fontSize: 14, color: t.text.primary }}>
                        {task.assignedTo}
                      </span>
                    </div>
                  )}
                </div>

                {/* المؤقت */}
                {task.timerSeconds !== undefined && (
                  <div style={{
                    marginTop: 16,
                    paddingTop: 16,
                    borderTop: `1px solid ${t.border.primary}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: t.radius.md,
                        background: `${t.button.primary}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Clock size={18} color={t.button.primary} />
                      </div>
                      <span style={{ 
                        fontSize: 18, 
                        fontWeight: 600, 
                        fontFamily: 'monospace',
                        color: t.text.primary,
                      }}>
                        {Math.floor(task.timerSeconds / 3600).toString().padStart(2, '0')}:
                        {Math.floor((task.timerSeconds % 3600) / 60).toString().padStart(2, '0')}:
                        {(task.timerSeconds % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                    <button
                      title={task.timerRunning ? 'إيقاف' : 'تشغيل'}
                      style={{
                        padding: 10,
                        borderRadius: t.radius.md,
                        border: 'none',
                        background: task.timerRunning ? t.status.warning.bg : t.status.success.bg,
                        color: task.timerRunning ? t.status.warning.text : t.status.success.text,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                    >
                      {task.timerRunning ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Tasks;
