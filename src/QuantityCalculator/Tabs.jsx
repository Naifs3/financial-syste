// ╔═══════════════════════════════════════════════════════════════════════════════════╗
// ║                              التبويبات - Tabs                                     ║
// ╚═══════════════════════════════════════════════════════════════════════════════════╝

import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════════════
// 📋 تعريف التبويبات
// ═══════════════════════════════════════════════════════════════════════════════════
export const TABS = [
  { id: 'calculator', name: 'الحاسبة', icon: '🧮' },
  { id: 'places', name: 'الأماكن', icon: '🏠' },
  { id: 'workItems', name: 'البنود', icon: '📦' },
  { id: 'areaTypes', name: 'برمجة القياس', icon: '📐' }
];

// ═══════════════════════════════════════════════════════════════════════════════════
// 🧩 مكون شريط التبويبات
// ═══════════════════════════════════════════════════════════════════════════════════
const TabBar = ({ activeTab, onTabChange, colors }) => {
  return (
    <div style={{
      display: 'flex',
      gap: 8,
      padding: '12px 16px',
      background: colors.card,
      borderRadius: 16,
      marginBottom: 20,
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch'
    }}>
      {TABS.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 20px',
              borderRadius: 12,
              border: 'none',
              background: isActive 
                ? `linear-gradient(135deg, ${colors.primary}, ${colors.purple})` 
                : 'transparent',
              color: isActive ? '#fff' : colors.muted,
              fontSize: 15,
              fontWeight: isActive ? 700 : 500,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
              minWidth: 'fit-content'
            }}
          >
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            <span>{tab.name}</span>
          </button>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════════
// 🧩 مكون شريط التبويبات السفلي
// ═══════════════════════════════════════════════════════════════════════════════════
export const BottomTabBar = ({ activeTab, onTabChange, colors }) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'space-around',
      padding: '8px 0 12px',
      background: colors.card,
      borderTop: `1px solid ${colors.border}`,
      zIndex: 1000
    }}>
      {TABS.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: '6px 16px',
              border: 'none',
              background: 'transparent',
              color: isActive ? colors.primary : colors.muted,
              fontSize: 10,
              fontWeight: isActive ? 700 : 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: 24, transform: isActive ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.2s ease' }}>
              {tab.icon}
            </span>
            <span>{tab.name}</span>
          </button>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════════
// 🧩 مكون عنوان التبويب
// ═══════════════════════════════════════════════════════════════════════════════════
export const TabHeader = ({ activeTab, colors }) => {
  const tab = TABS.find(t => t.id === activeTab);
  if (!tab) return null;

  const descriptions = {
    calculator: 'حساب التكاليف والكميات',
    places: 'إدارة أنواع الأماكن وقوائمها',
    workItems: 'إدارة الأقسام والبنود والأسعار',
    areaTypes: 'أنواع المساحة والمعادلات'
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
      <div style={{
        width: 48, height: 48,
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`,
        borderRadius: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 26
      }}>
        {tab.icon}
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: colors.text }}>{tab.name}</div>
        <div style={{ fontSize: 13, color: colors.muted }}>{descriptions[tab.id]}</div>
      </div>
    </div>
  );
};

export default TabBar;
