// src/components/Header.jsx
import React from 'react';
import { LogOut, Sun, Moon, Monitor, Settings } from 'lucide-react';

const Header = ({ 
  currentUser, 
  currentTime, 
  darkMode, 
  themeMode,
  setThemeMode,
  onLogout,
  sessionMinutes,
  headerClass,
  txtClass,
  txtSmClass
}) => {
  const formatTime = (date) => {
    return date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <header className={`sticky top-0 z-50 ${headerClass} backdrop-blur-sm border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* اليمين: الشعار والتاريخ */}
          <div className="flex items-center gap-4">
            {/* الشعار */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">RKZ</span>
              </div>
              <div>
                <h1 className={`text-lg font-bold ${txtClass}`}>
                  ركائز الأولى للتعمير
                </h1>
                <p className={`text-xs ${txtSmClass}`}>نظام الإدارة المالية</p>
              </div>
            </div>

            {/* التاريخ والوقت */}
            <div className={`hidden md:block ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'} rounded-xl px-4 py-2`}>
              <p className={`text-sm ${txtClass} font-bold`}>{formatTime(currentTime)}</p>
              <p className={`text-xs ${txtSmClass}`}>{formatDate(currentTime)}</p>
            </div>
          </div>

          {/* اليسار: معلومات المستخدم والأزرار */}
          <div className="flex items-center gap-3">
            {/* معلومات المستخدم */}
            <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'} rounded-xl px-4 py-2 text-left`}>
              <p className={`text-sm font-bold ${txtClass}`}>{currentUser?.username || 'مستخدم'}</p>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  currentUser?.role === 'owner' ? 'bg-red-500/20 text-red-400' :
                  currentUser?.role === 'manager' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {currentUser?.role === 'owner' ? 'مالك' : 
                   currentUser?.role === 'manager' ? 'مدير' : 'عضو'}
                </span>
                {sessionMinutes > 0 && (
                  <span className={`text-xs ${txtSmClass}`}>
                    {sessionMinutes} دقيقة
                  </span>
                )}
              </div>
            </div>

            {/* وضع العرض */}
            <div className={`flex items-center gap-1 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'} rounded-xl p-1`}>
              <button
                onClick={() => setThemeMode('light')}
                className={`p-2 rounded-lg transition-colors ${themeMode === 'light' ? 'bg-yellow-500/20 text-yellow-400' : txtSmClass + ' hover:bg-gray-700/50'}`}
                title="نهاري"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setThemeMode('dark')}
                className={`p-2 rounded-lg transition-colors ${themeMode === 'dark' ? 'bg-blue-500/20 text-blue-400' : txtSmClass + ' hover:bg-gray-700/50'}`}
                title="ليلي"
              >
                <Moon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setThemeMode('auto')}
                className={`p-2 rounded-lg transition-colors ${themeMode === 'auto' ? 'bg-purple-500/20 text-purple-400' : txtSmClass + ' hover:bg-gray-700/50'}`}
                title="تلقائي"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>

            {/* زر تسجيل الخروج */}
            <button
              onClick={onLogout}
              className={`p-2 rounded-xl ${darkMode ? 'bg-red-500/20 hover:bg-red-500/30' : 'bg-red-100 hover:bg-red-200'} text-red-400 transition-colors`}
              title="تسجيل الخروج"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
```

---
