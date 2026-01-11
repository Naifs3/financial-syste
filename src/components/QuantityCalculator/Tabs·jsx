import React from 'react';

export const TABS = [
  { id: 'calculator', name: 'الحاسبة', icon: '🧮', desc: 'حساب الكميات والتكاليف' },
  { id: 'places', name: 'الأماكن', icon: '🏠', desc: 'إدارة أنواع الأماكن' },
  { id: 'workItems', name: 'البنود', icon: '📦', desc: 'إدارة بنود العمل' },
  { id: 'areaTypes', name: 'القياس', icon: '📐', desc: 'برمجة أنواع المساحة' }
];

const TabBar = ({ activeTab, onTabChange, colors }) => {
  return (
    <div style={{
      display: 'flex',
      gap: 8,
      marginBottom: 20,
      padding: 6,
      background: colors.card,
      borderRadius: 14,
      border: `1px solid ${colors.border}`,
      overflowX: 'auto'
    }}>
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            flex: 1,
            minWidth: 100,
            padding: '12px 16px',
            borderRadius: 10,
            border: 'none',
            background: activeTab === tab.id 
              ? `linear-gradient(135deg, ${colors.primary}, ${colors.purple})` 
              : 'transparent',
            color: activeTab === tab.id ? '#fff' : colors.muted,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.3s',
            transform: activeTab === tab.id ? 'scale(1.02)' : 'scale(1)'
          }}
        >
          <span style={{ fontSize: 18 }}>{tab.icon}</span>
          <span>{tab.name}</span>
        </button>
      ))}
    </div>
  );
};

export default TabBar;
