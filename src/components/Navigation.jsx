// src/components/Navigation.jsx
import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  CheckSquare, 
  FolderKanban, 
  Shield, 
  Users, 
  Settings, 
  Calculator 
} from 'lucide-react';

const Navigation = ({ currentView, setCurrentView, darkMode, theme }) => {
  const t = theme;
  const colorKeys = t?.colorKeys || Object.keys(t?.colors || {});
  
  const navItems = [
    { id: 'dashboard', name: 'لوحة التحكم', icon: LayoutDashboard, colorKey: colorKeys[0] },
    { id: 'expenses', name: 'المصروفات', icon: Receipt, colorKey: colorKeys[1] },
    { id: 'tasks', name: 'المهام', icon: CheckSquare, colorKey: colorKeys[2] },
    { id: 'projects', name: 'المشاريع', icon: FolderKanban, colorKey: colorKeys[3] },
    { id: 'accounts', name: 'الحسابات', icon: Shield, colorKey: colorKeys[4] },
    { id: 'calculator', name: 'حاسبة الكميات', icon: Calculator, colorKey: colorKeys[5] },
    { id: 'users', name: 'المستخدمين', icon: Users, colorKey: colorKeys[0] }
  ];

  return (
    <>
      {/* ═══════════════ Desktop Navigation ═══════════════ */}
      <nav 
        style={{
          display: 'none',
          position: 'sticky',
          top: 73,
          zIndex: 40,
          background: `${t.bg.secondary}dd`,
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${t.border.primary}`,
        }}
        className="desktop-nav"
      >
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8,
            overflowX: 'auto',
            padding: '12px 0',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              const color = t.colors[item.colorKey] || t.colors[colorKeys[0]];
              
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 18px',
                    borderRadius: t.radius.lg,
                    border: 'none',
                    background: isActive ? t.button.gradient : 'transparent',
                    color: isActive ? '#fff' : t.text.muted,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.25s ease',
                    boxShadow: isActive ? t.button.glow : 'none',
                    fontFamily: 'inherit',
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 500,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = `${t.button.primary}15`;
                      e.currentTarget.style.color = t.text.primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = t.text.muted;
                    }
                  }}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ═══════════════ Mobile Navigation ═══════════════ */}
      <nav 
        style={{
          display: 'none',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: `${t.bg.secondary}f5`,
          backdropFilter: 'blur(10px)',
          borderTop: `1px solid ${t.border.primary}`,
          padding: '8px 4px',
        }}
        className="mobile-nav"
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-around',
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const color = t.colors[item.colorKey] || t.colors[colorKeys[0]];
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  padding: '8px 6px',
                  borderRadius: t.radius.lg,
                  border: 'none',
                  background: isActive ? t.button.gradient : 'transparent',
                  color: isActive ? '#fff' : t.text.muted,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: isActive ? t.button.glow : 'none',
                  fontFamily: 'inherit',
                  minWidth: 0,
                  flex: '1 1 0',
                  maxWidth: 70,
                }}
              >
                <Icon size={20} style={{ flexShrink: 0 }} />
                <span style={{ 
                  fontSize: 10, 
                  fontWeight: isActive ? 600 : 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '100%',
                }}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ═══════════════ CSS للتجاوب ═══════════════ */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: block !important; }
          .mobile-nav { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: block !important; }
        }
        .desktop-nav > div > div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default Navigation;
