// src/components/Tasks.jsx
import React, { useState } from 'react';
import { CheckSquare, Plus, Search, Edit, Trash2, Play, Pause, Clock } from 'lucide-react';

const Tasks = ({ tasks, projects, onAdd, onEdit, onDelete, onToggleStatus, darkMode, txt, txtSm, card, accentGradient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // تصفية المهام
  const filteredTasks = tasks.filter(task => {
    const matchSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchSearch && matchPriority && matchStatus;
  });

  // حساب الإحصائيات
  const urgentCount = tasks.filter(t => t.priority === 'urgent' && t.status !== 'مكتمل').length;
  const completedCount = tasks.filter(t => t.status === 'مكتمل').length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  // ألوان الأولوية
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' };
      case 'medium': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' };
      case 'normal': return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' };
      default: return { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' };
    }
  };

  const getPriorityName = (priority) => {
    switch (priority) {
      case 'urgent': return 'مستعجل';
      case 'medium': return 'متوسط';
      case 'normal': return 'عادي';
      default: return priority;
    }
  };

  return (
    <div className="p-4 space-y-6 pb-20 md:pb-6">
      {/* العنوان */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${txt} flex items-center gap-2`}>
            <CheckSquare className="w-6 h-6" />
            المهام
          </h2>
          <p className={`text-sm ${txtSm} mt-1`}>إدارة المهام مع متابعة الوقت</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className={`px-4 py-2 rounded-xl bg-gradient-to-r ${accentGradient} text-white transition-all hover:opacity-90 flex items-center gap-2`}
        >
          <Plus className="w-4 h-4" />
          إضافة مهمة
        </button>
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`${card} p-4 rounded-xl border ${darkMode ? 'border-red-500/30' : 'border-red-200'} bg-red-500/10`}>
          <p className={`text-sm ${txtSm} mb-1`}>مستعجل</p>
          <p className="text-2xl font-bold text-red-400">{urgentCount}</p>
        </div>
        <div className={`${card} p-4 rounded-xl border ${darkMode ? 'border-green-500/30' : 'border-green-200'} bg-green-500/10`}>
          <p className={`text-sm ${txtSm} mb-1`}>مكتملة</p>
          <p className="text-2xl font-bold text-green-400">{completedCount}/{tasks.length}</p>
        </div>
        <div className={`${card} p-4 rounded-xl border ${darkMode ? 'border-blue-500/30' : 'border-blue-200'} bg-blue-500/10`}>
          <p className={`text-sm ${txtSm} mb-1`}>نسبة الإنجاز</p>
          <p className="text-2xl font-bold text-blue-400">{completionRate}%</p>
        </div>
      </div>

      {/* البحث والتصفية */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${txtSm}`} />
          <input
            type="text"
            placeholder="بحث في المهام..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pr-10 pl-4 py-2 rounded-xl border ${
              darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
        </div>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className={`px-4 py-2 rounded-xl border ${
            darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="all">كل الأولويات</option>
          <option value="urgent">مستعجل</option>
          <option value="medium">متوسط</option>
          <option value="normal">عادي</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`px-4 py-2 rounded-xl border ${
            darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="all">كل الحالات</option>
          <option value="قيد الانتظار">قيد الانتظار</option>
          <option value="قيد التنفيذ">قيد التنفيذ</option>
          <option value="مكتمل">مكتمل</option>
        </select>
      </div>

      {/* قائمة المهام */}
      {filteredTasks.length === 0 ? (
        <div className={`${card} p-12 rounded-2xl text-center border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <CheckSquare className={`w-16 h-16 mx-auto mb-4 ${txtSm}`} />
          <p className={`${txt} font-bold mb-2`}>لا توجد مهام</p>
          <p className={`${txtSm} text-sm`}>ابدأ بإضافة أول مهمة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTasks.map((task) => {
            const priorityColor = getPriorityColor(task.priority);
            const project = projects.find(p => p.id === task.projectId);
            
            return (
              <div
                key={task.id}
                className={`${card} p-5 rounded-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-all ${
                  task.status === 'مكتمل' ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className={`font-bold ${txt} text-lg mb-1 ${task.status === 'مكتمل' ? 'line-through' : ''}`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-1 rounded ${priorityColor.bg} ${priorityColor.text}`}>
                        {getPriorityName(task.priority)}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        task.status === 'مكتمل' 
                          ? 'bg-green-500/20 text-green-400' 
                          : task.status === 'قيد التنفيذ'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {task.status}
                      </span>
                      {task.refNumber && (
                        <span className={`text-xs ${txtSm}`}>#{task.refNumber}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onToggleStatus(task.id)}
                      className={`p-2 rounded-lg ${
                        task.status === 'مكتمل'
                          ? 'bg-gray-500/20 text-gray-400'
                          : 'bg-green-500/20 text-green-400'
                      } hover:opacity-80 transition-colors`}
                      title={task.status === 'مكتمل' ? 'إلغاء الاكتمال' : 'وضع علامة كمكتمل'}
                    >
                      <CheckSquare className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(task)}
                      className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${txt} transition-colors`}
                      title="تعديل"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {task.description && (
                  <p className={`text-sm ${txtSm} mb-3`}>{task.description}</p>
                )}

                <div className="space-y-2">
                  {task.dueDate && (
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${txtSm}`}>موعد الانتهاء:</span>
                      <span className={`text-sm ${txt}`}>{task.dueDate}</span>
                    </div>
                  )}
                  {project && (
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${txtSm}`}>المشروع:</span>
                      <span className={`text-sm ${txt}`}>{project.name}</span>
                    </div>
                  )}
                  {task.assignedTo && (
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${txtSm}`}>المسؤول:</span>
                      <span className={`text-sm ${txt}`}>{task.assignedTo}</span>
                    </div>
                  )}
                </div>

                {/* Timer (مبسط) */}
                {task.timerSeconds !== undefined && (
                  <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${txtSm}`} />
                      <span className={`text-sm font-mono ${txt}`}>
                        {Math.floor(task.timerSeconds / 3600).toString().padStart(2, '0')}:
                        {Math.floor((task.timerSeconds % 3600) / 60).toString().padStart(2, '0')}:
                        {(task.timerSeconds % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                    <button
                      className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${txt} transition-colors`}
                      title={task.timerRunning ? 'إيقاف' : 'تشغيل'}
                    >
                      {task.timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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
```

---
