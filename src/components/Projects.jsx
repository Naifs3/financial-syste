// src/components/Projects.jsx
import React, { useState } from 'react';
import { FolderKanban, Plus, Search, Edit, Trash2, FolderPlus, Upload, FileText, Image, Video, X } from 'lucide-react';

const Projects = ({ projects, onAdd, onEdit, onDelete, onAddFolder, onUploadFile, onDeleteFile, darkMode, txt, txtSm, card, accentGradient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredProjects = projects.filter(project => {
    const matchSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const activeCount = projects.filter(p => p.status === 'active').length;
  const pausedCount = projects.filter(p => p.status === 'paused').length;
  const completedCount = projects.filter(p => p.status === 'completed').length;
  const totalBudget = projects.reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' };
      case 'paused': return { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' };
      case 'completed': return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' };
      default: return { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' };
    }
  };

  const getStatusName = (status) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'paused': return 'متوقف';
      case 'completed': return 'مكتمل';
      default: return status;
    }
  };

  const handleFileUpload = async (projectId, folderId, files) => {
    for (const file of files) {
      await onUploadFile(projectId, folderId, file);
    }
  };

  return (
    <div className="p-4 space-y-6 pb-20 md:pb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${txt} flex items-center gap-2`}>
            <FolderKanban className="w-6 h-6" />
            المشاريع
          </h2>
          <p className={`text-sm ${txtSm} mt-1`}>إدارة المشاريع والملفات</p>
        </div>
        <button
          onClick={() => {}}
          className={`px-4 py-2 rounded-xl bg-gradient-to-r ${accentGradient} text-white transition-all hover:opacity-90 flex items-center gap-2`}
        >
          <Plus className="w-4 h-4" />
          إضافة مشروع
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={`${card} p-4 rounded-xl border ${darkMode ? 'border-blue-500/30' : 'border-blue-200'} bg-blue-500/10`}>
          <p className={`text-sm ${txtSm} mb-1`}>نشط</p>
          <p className="text-2xl font-bold text-blue-400">{activeCount}</p>
        </div>
        <div className={`${card} p-4 rounded-xl border ${darkMode ? 'border-orange-500/30' : 'border-orange-200'} bg-orange-500/10`}>
          <p className={`text-sm ${txtSm} mb-1`}>متوقف</p>
          <p className="text-2xl font-bold text-orange-400">{pausedCount}</p>
        </div>
        <div className={`${card} p-4 rounded-xl border ${darkMode ? 'border-green-500/30' : 'border-green-200'} bg-green-500/10`}>
          <p className={`text-sm ${txtSm} mb-1`}>مكتمل</p>
          <p className="text-2xl font-bold text-green-400">{completedCount}</p>
        </div>
        <div className={`${card} p-4 rounded-xl border ${darkMode ? 'border-purple-500/30' : 'border-purple-200'} bg-purple-500/10`}>
          <p className={`text-sm ${txtSm} mb-1`}>الميزانية</p>
          <p className="text-lg font-bold text-purple-400">{totalBudget.toLocaleString('ar-SA')}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${txtSm}`} />
          <input
            type="text"
            placeholder="بحث في المشاريع..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pr-10 pl-4 py-2 rounded-xl border ${
              darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`px-4 py-2 rounded-xl border ${
            darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="all">كل الحالات</option>
          <option value="active">نشط</option>
          <option value="paused">متوقف</option>
          <option value="completed">مكتمل</option>
        </select>
      </div>

      {filteredProjects.length === 0 ? (
        <div className={`${card} p-12 rounded-2xl text-center border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <FolderKanban className={`w-16 h-16 mx-auto mb-4 ${txtSm}`} />
          <p className={`${txt} font-bold mb-2`}>لا توجد مشاريع</p>
          <p className={`${txtSm} text-sm`}>ابدأ بإضافة أول مشروع</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProjects.map((project) => {
            const statusColor = getStatusColor(project.status);
            const filesCount = project.folders?.reduce((sum, f) => sum + (f.files?.length || 0), 0) || 0;
            
            return (
              <div
                key={project.id}
                className={`${card} p-5 rounded-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-all`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className={`font-bold ${txt} text-xl mb-2`}>{project.name}</h3>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`text-xs px-2 py-1 rounded ${statusColor.bg} ${statusColor.text}`}>
                        {getStatusName(project.status)}
                      </span>
                      {project.refNumber && (
                        <span className={`text-xs ${txtSm}`}>#{project.refNumber}</span>
                      )}
                      {project.client && (
                        <span className={`text-xs ${txtSm}`}>العميل: {project.client}</span>
                      )}
                    </div>
                    {project.description && (
                      <p className={`text-sm ${txtSm}`}>{project.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {}}
                      className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                      title="إضافة مجلد"
                    >
                      <FolderPlus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(project)}
                      className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${txt} transition-colors`}
                      title="تعديل"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(project.id)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {project.budget && (
                    <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} p-3 rounded-xl`}>
                      <p className={`text-xs ${txtSm} mb-1`}>الميزانية</p>
                      <p className={`text-sm font-bold ${txt}`}>{parseFloat(project.budget).toLocaleString('ar-SA')}</p>
                    </div>
                  )}
                  {project.startDate && (
                    <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} p-3 rounded-xl`}>
                      <p className={`text-xs ${txtSm} mb-1`}>تاريخ البداية</p>
                      <p className={`text-sm font-bold ${txt}`}>{project.startDate}</p>
                    </div>
                  )}
                  {project.endDate && (
                    <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} p-3 rounded-xl`}>
                      <p className={`text-xs ${txtSm} mb-1`}>تاريخ النهاية</p>
                      <p className={`text-sm font-bold ${txt}`}>{project.endDate}</p>
                    </div>
                  )}
                  <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} p-3 rounded-xl`}>
                    <p className={`text-xs ${txtSm} mb-1`}>الملفات</p>
                    <p className={`text-sm font-bold ${txt}`}>{filesCount}</p>
                  </div>
                </div>

                {project.folders && project.folders.length > 0 && (
                  <div className="space-y-3">
                    <h4 className={`text-sm font-bold ${txt} flex items-center gap-2`}>
                      <FolderKanban className="w-4 h-4" />
                      المجلدات ({project.folders.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {project.folders.map((folder) => (
                        <div
                          key={folder.id}
                          className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} p-4 rounded-xl`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className={`font-bold ${txt} text-sm`}>{folder.name}</h5>
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                multiple
                                className="hidden"
                                onChange={(e) => handleFileUpload(project.id, folder.id, Array.from(e.target.files))}
                              />
                              <Upload className={`w-4 h-4 ${txtSm} hover:text-blue-400 transition-colors`} />
                            </label>
                          </div>
                          <p className={`text-xs ${txtSm}`}>
                            {folder.files?.length || 0} ملف
                          </p>
                          
                          {folder.files && folder.files.length > 0 && (
                            <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                              {folder.files.map((file) => (
                                <div
                                  key={file.id}
                                  className={`flex items-center justify-between p-2 rounded ${darkMode ? 'bg-gray-800/50' : 'bg-white'}`}
                                >
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    {file.type.startsWith('image/') ? (
                                      <Image className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                    ) : file.type.startsWith('video/') ? (
                                      <Video className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                    ) : (
                                      <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    )}
                                    <span className={`text-xs ${txt} truncate`}>{file.name}</span>
                                  </div>
                                  <button
                                    onClick={() => onDeleteFile(project.id, folder.id, file.id)}
                                    className="p-1 rounded hover:bg-red-500/20 text-red-400 transition-colors flex-shrink-0"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
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

export default Projects;
