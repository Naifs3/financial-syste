// src/components/Navigation.jsx
import React from 'react';
import { LayoutDashboard, Receipt, CheckSquare, FolderKanban, Shield, Users, Settings, Calculator } from 'lucide-react';

const Navigation = ({ currentView, setCurrentView, darkMode, accentColor }) => {
  const navItems = [
    { id: 'dashboard', name: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'expenses', name: 'المصروفات', icon: Receipt },
    { id: 'tasks', name: 'المهام', icon: CheckSquare },
    { id: 'projects', name: 'المشاريع', icon: FolderKanban },
    { id: 'accounts', name: 'الحسابات', icon: Shield },
    { id: 'calculator', name: 'حاسبة الكميات', icon: Calculator },
    { id: 'users', name: 'المستخدمين', icon: Users },
    { id: 'settings', name: 'الإعدادات', icon: Settings }
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`hidden md:block sticky top-[73px] z-40 ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${accentColor} text-white shadow-lg`
                      : darkMode
                      ? 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-sm border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-around py-2 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all min-w-0 ${
                  isActive
                    ? `bg-gradient-to-r ${accentColor} text-white shadow-lg`
                    : darkMode
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-[10px] font-medium truncate max-w-full">{item.name}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navigation;
