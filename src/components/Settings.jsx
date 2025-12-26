import React, { useState } from 'react';
import { User, Bell, Palette, Shield, ChevronLeft } from 'lucide-react';
import AppearanceSettings from './AppearanceSettings';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('appearance');

  // ألوان الثيم
  const colors = {
    bgPrimary: '#0a0a0f',
    bgSecondary: '#12121a',
    bgTertiary: '#1a1a24',
    textPrimary: '#ffffff',
    textSecondary: '#a0a0b0',
    textMuted: '#6b6b80',
    border: '#2a2a3a',
    primary: '#6366f1',
  };

  const c = colors;

  // التبويبات
  const tabs = [
    { id: 'account', name: 'الحساب', icon: User },
    { id: 'notifications', name: 'الإشعارات', icon: Bell },
    { id: 'appearance', name: 'المظهر', icon: Palette },
    { id: 'privacy', name: 'الخصوصية', icon: Shield },
  ];

  // محتوى التبويبات
  const renderTabContent = () => {
    switch (activeTab) {
      case 'appearance':
        return <AppearanceSettings embedded={true} />;
      
      case 'account':
        return (
          <div style={{ padding: 20 }}>
            <h3 style={{ color: c.textPrimary, marginBottom: 20 }}>إعدادات الحساب</h3>
            <p style={{ color: c.textMuted }}>قريباً...</p>
          </div>
        );
      
      case 'notifications':
        return (
          <div style={{ padding: 20 }}>
            <h3 style={{ color: c.textPrimary, marginBottom: 20 }}>إعدادات الإشعارات</h3>
            <p style={{ color: c.textMuted }}>قريباً...</p>
          </div>
        );
      
      case 'privacy':
        return (
          <div style={{ padding: 20 }}>
            <h3 style={{ color: c.textPrimary, marginBottom: 20 }}>إعدادات الخصوصية</h3>
            <p style={{ color: c.textMuted }}>قريباً...</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div dir="rtl" style={{
      minHeight: '100vh',
      background: c.bgPrimary,
      fontFamily: "'Tajawal', sans-serif",
    }}>
      {/* تحميل الخط */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;600;700&display=swap" />

      {/* الهيدر */}
      <div style={{
        background: c.bgSecondary,
        borderBottom: `1px solid ${c.border}`,
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <button style={{
          background: 'transparent',
          border: 'none',
          color: c.textSecondary,
          cursor: 'pointer',
          padding: 8,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <ChevronLeft size={24} />
        </button>
        <h1 style={{
          fontSize: 20,
          fontWeight: 700,
          color: c.textPrimary,
          margin: 0,
        }}>الإعدادات</h1>
      </div>

      <div style={{
        maxWidth: 900,
        margin: '0 auto',
        display: 'flex',
        gap: 0,
      }}>
        {/* القائمة الجانبية */}
        <div style={{
          width: 220,
          background: c.bgSecondary,
          borderLeft: `1px solid ${c.border}`,
          minHeight: 'calc(100vh - 65px)',
          padding: '20px 0',
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  background: isActive ? `${c.primary}15` : 'transparent',
                  border: 'none',
                  borderRight: isActive ? `3px solid ${c.primary}` : '3px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={20} color={isActive ? c.primary : c.textMuted} />
                <span style={{
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? c.primary : c.textSecondary,
                }}>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* المحتوى */}
        <div style={{
          flex: 1,
          minHeight: 'calc(100vh - 65px)',
          overflowY: 'auto',
        }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
