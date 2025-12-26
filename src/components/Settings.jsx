// src/components/Settings.jsx
import React, { useState } from 'react';
import { Settings as SettingsIcon, Sun, Moon, Monitor, Palette, Type, Check, MapPin } from 'lucide-react';

const Settings = ({ 
  darkMode, themeMode, setThemeMode, currentThemeId, setCurrentThemeId,
  fontSize, setFontSize, city, setCity, theme, themeList
}) => {
  const t = theme;

  const cities = [
    { value: 'Riyadh', label: 'الرياض' },
    { value: 'Jeddah', label: 'جدة' },
    { value: 'Mecca', label: 'مكة المكرمة' },
    { value: 'Medina', label: 'المدينة المنورة' },
    { value: 'Dammam', label: 'الدمام' },
    { value: 'Khobar', label: 'الخبر' },
    { value: 'Dhahran', label: 'الظهران' },
    { value: 'Al Ahsa', label: 'الأحساء' },
    { value: 'Tabuk', label: 'تبوك' },
    { value: 'Abha', label: 'أبها' },
    { value: 'Taif', label: 'الطائف' },
    { value: 'Buraidah', label: 'بريدة' },
    { value: 'Khamis Mushait', label: 'خميس مشيط' },
    { value: 'Hail', label: 'حائل' },
    { value: 'Najran', label: 'نجران' },
    { value: 'Yanbu', label: 'ينبع' },
    { value: 'Al Jubail', label: 'الجبيل' }
  ];

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: t.radius.lg,
    border: `1px solid ${t.border.primary}`, background: t.bg.tertiary,
    color: t.text.primary, fontSize: 14, fontFamily: 'inherit', cursor: 'pointer'
  };

  const sectionStyle = {
    background: t.bg.secondary, borderRadius: t.radius.xl,
    border: `1px solid ${t.border.primary}`, padding: 24, marginBottom: 20
  };

  const titleStyle = {
    fontSize: 16, fontWeight: 700, color: t.text.primary, marginBottom: 16,
    display: 'flex', alignItems: 'center', gap: 8
  };

  return (
    <div style={{ padding: 16, paddingBottom: 80 }}>
      
      {/* العنوان */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: t.text.primary, display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
          <SettingsIcon size={22} />
          الإعدادات
        </h2>
        <p style={{ fontSize: 13, color: t.text.muted, marginTop: 4 }}>تخصيص المظهر والقوالب</p>
      </div>

      {/* تنبيه */}
      <div style={{ background: `${t.button.primary}15`, border: `1px solid ${t.button.primary}30`, borderRadius: t.radius.lg, padding: 14, marginBottom: 24 }}>
        <p style={{ fontSize: 13, color: t.button.primary, margin: 0 }}>💡 جميع الإعدادات يتم حفظها تلقائياً</p>
      </div>

      {/* ═══════════════ وضع العرض (نهاري/ليلي/تلقائي) ═══════════════ */}
      <div style={sectionStyle}>
        <h3 style={titleStyle}>
          {themeMode === 'light' ? <Sun size={18} /> : themeMode === 'dark' ? <Moon size={18} /> : <Monitor size={18} />}
          وضع العرض
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { mode: 'light', icon: <Sun size={22} />, label: 'فاتح' },
            { mode: 'dark', icon: <Moon size={22} />, label: 'داكن' },
            { mode: 'auto', icon: <Monitor size={22} />, label: 'تلقائي' }
          ].map(({ mode, icon, label }) => (
            <button key={mode} onClick={() => setThemeMode(mode)} style={{
              padding: 18, borderRadius: t.radius.xl,
              border: themeMode === mode ? `2px solid ${t.button.primary}` : `1px solid ${t.border.primary}`,
              background: themeMode === mode ? `${t.button.primary}15` : t.bg.tertiary, cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8
            }}>
              <div style={{ color: themeMode === mode ? t.button.primary : t.text.muted }}>{icon}</div>
              <span style={{ fontSize: 13, fontWeight: 600, color: themeMode === mode ? t.button.primary : t.text.secondary }}>{label}</span>
              {themeMode === mode && <Check size={14} color={t.button.primary} />}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════ اختيار المدينة ═══════════════ */}
      <div style={sectionStyle}>
        <h3 style={titleStyle}><MapPin size={18} />المدينة (للطقس)</h3>
        <select value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle}>
          {cities.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <p style={{ fontSize: 11, color: t.text.muted, marginTop: 8 }}>اختر مدينتك لعرض حالة الطقس</p>
      </div>

      {/* ═══════════════ حجم الخط ═══════════════ */}
      <div style={sectionStyle}>
        <h3 style={titleStyle}><Type size={18} />حجم الخط</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <input type="range" min="12" max="24" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))}
            style={{ flex: 1, accentColor: t.button.primary }} />
          <div style={{ minWidth: 45, padding: '8px 12px', background: t.bg.tertiary, borderRadius: t.radius.md, textAlign: 'center' }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: t.text.primary }}>{fontSize}</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 11, color: t.text.muted }}>صغير</span>
          <span style={{ fontSize: 11, color: t.text.muted }}>كبير</span>
        </div>
      </div>

      {/* ═══════════════ اختيار القالب ═══════════════ */}
      <div style={sectionStyle}>
        <h3 style={titleStyle}><Palette size={18} />اختر القالب</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {themeList?.map((themeItem) => {
            const isSelected = currentThemeId === themeItem.id;
            const previewColors = themeItem.colorKeys?.slice(0, 5).map(key => themeItem.colors[key]?.main) || [];
            return (
              <button key={themeItem.id} onClick={() => setCurrentThemeId(themeItem.id)} style={{
                padding: 18, borderRadius: t.radius.xl, textAlign: 'right',
                border: isSelected ? `2px solid ${t.button.primary}` : `1px solid ${t.border.primary}`,
                background: isSelected ? `${t.button.primary}10` : t.bg.tertiary, cursor: 'pointer', position: 'relative'
              }}>
                {isSelected && (
                  <div style={{ position: 'absolute', top: 10, left: 10, width: 22, height: 22, borderRadius: '50%',
                    background: t.button.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={12} color="#fff" />
                  </div>
                )}
                <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
                  {previewColors.map((color, i) => (
                    <div key={i} style={{ width: 22, height: 22, borderRadius: '50%', background: color, border: '2px solid rgba(255,255,255,0.2)' }} />
                  ))}
                </div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: t.text.primary, margin: '0 0 4px 0' }}>{themeItem.name}</h4>
                <p style={{ fontSize: 11, color: t.text.muted, margin: 0 }}>{themeItem.description || 'قالب مميز'}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Settings;
