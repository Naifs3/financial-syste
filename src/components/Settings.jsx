import React, { useState } from 'react';
import { 
  Sun, Moon, Monitor, Check, Type, Palette, MapPin, ChevronDown, 
  Save, RotateCcw, Layout, Square, Sparkles, AlertCircle
} from 'lucide-react';

export default function Settings({
  darkMode,
  themeMode,
  setThemeMode,
  currentThemeId,
  setCurrentThemeId,
  fontSize,
  setFontSize,
  city,
  setCity,
  theme,
  themeList = [],
  // الإعدادات المخصصة
  headerColor,
  setHeaderColor,
  buttonColor,
  setButtonColor,
  fontFamily,
  setFontFamily,
  bgEffect,
  setBgEffect,
}) {
  const t = theme;
  
  // حالات مؤقتة
  const [tempThemeMode, setTempThemeMode] = useState(themeMode);
  const [tempThemeId, setTempThemeId] = useState(currentThemeId);
  const [tempFontSize, setTempFontSize] = useState(fontSize);
  const [tempCity, setTempCity] = useState(city);
  const [tempHeaderColor, setTempHeaderColor] = useState(headerColor || 'default');
  const [tempButtonColor, setTempButtonColor] = useState(buttonColor || 'default');
  const [tempFontFamily, setTempFontFamily] = useState(fontFamily || 'tajawal');
  const [tempBgEffect, setTempBgEffect] = useState(bgEffect || 'none');
  
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // ═══════════════════════════════════════════════════════════════
  // البيانات
  // ═══════════════════════════════════════════════════════════════

  const cities = [
    { id: 'Riyadh', name: 'الرياض' }, { id: 'Jeddah', name: 'جدة' },
    { id: 'Mecca', name: 'مكة المكرمة' }, { id: 'Medina', name: 'المدينة المنورة' },
    { id: 'Dammam', name: 'الدمام' }, { id: 'Khobar', name: 'الخبر' },
    { id: 'Tabuk', name: 'تبوك' }, { id: 'Abha', name: 'أبها' },
    { id: 'Taif', name: 'الطائف' }, { id: 'Hail', name: 'حائل' },
  ];

  const headerColors = [
    { id: 'default', name: 'افتراضي', color: t.bg.secondary },
    { id: 'navy', name: 'كحلي', color: '#0f172a' },
    { id: 'slate', name: 'رمادي', color: '#1e293b' },
    { id: 'zinc', name: 'فحمي', color: '#18181b' },
    { id: 'blue', name: 'أزرق', color: '#1e3a5f' },
    { id: 'indigo', name: 'نيلي', color: '#312e81' },
    { id: 'purple', name: 'بنفسجي', color: '#3b0764' },
    { id: 'pink', name: 'وردي', color: '#500724' },
    { id: 'red', name: 'أحمر', color: '#450a0a' },
    { id: 'orange', name: 'برتقالي', color: '#431407' },
    { id: 'green', name: 'أخضر', color: '#052e16' },
    { id: 'teal', name: 'فيروزي', color: '#042f2e' },
  ];

  const buttonColors = [
    { id: 'default', name: 'افتراضي', color: t.button.primary, gradient: t.button.gradient },
    { id: 'blue', name: 'أزرق', color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
    { id: 'indigo', name: 'نيلي', color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
    { id: 'purple', name: 'بنفسجي', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
    { id: 'pink', name: 'وردي', color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #db2777)' },
    { id: 'red', name: 'أحمر', color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
    { id: 'orange', name: 'برتقالي', color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #ea580c)' },
    { id: 'amber', name: 'ذهبي', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    { id: 'green', name: 'أخضر', color: '#22c55e', gradient: 'linear-gradient(135deg, #22c55e, #16a34a)' },
    { id: 'teal', name: 'فيروزي', color: '#14b8a6', gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)' },
    { id: 'cyan', name: 'سماوي', color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
    { id: 'rose', name: 'روز', color: '#f43f5e', gradient: 'linear-gradient(135deg, #f43f5e, #e11d48)' },
  ];

  const fonts = [
    { id: 'tajawal', name: 'تجول', sample: 'نص تجريبي' },
    { id: 'cairo', name: 'القاهرة', sample: 'نص تجريبي' },
    { id: 'almarai', name: 'المراعي', sample: 'نص تجريبي' },
    { id: 'ibm', name: 'IBM', sample: 'نص تجريبي' },
  ];

  const bgEffects = [
    { id: 'none', name: 'بدون', icon: '○', desc: 'خلفية عادية' },
    { id: 'stars', name: 'نجوم', icon: '✨', desc: 'سماء ليلية' },
    { id: 'particles', name: 'جزيئات', icon: '◌', desc: 'جزيئات متحركة' },
    { id: 'gradient', name: 'متدرج', icon: '◐', desc: 'ألوان متدرجة' },
  ];

  // ═══════════════════════════════════════════════════════════════
  // الدوال
  // ═══════════════════════════════════════════════════════════════

  const updateSetting = (setter) => (value) => {
    setter(value);
    setHasChanges(true);
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // تطبيق كل الإعدادات
    setThemeMode(tempThemeMode);
    setCurrentThemeId(tempThemeId);
    setFontSize(tempFontSize);
    setCity(tempCity);
    if (setHeaderColor) setHeaderColor(tempHeaderColor);
    if (setButtonColor) setButtonColor(tempButtonColor);
    if (setFontFamily) setFontFamily(tempFontFamily);
    if (setBgEffect) setBgEffect(tempBgEffect);
    
    setSaved(true);
    setHasChanges(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setTempThemeMode('dark');
    setTempThemeId('tokyo-lights');
    setTempFontSize(16);
    setTempCity('Riyadh');
    setTempHeaderColor('default');
    setTempButtonColor('default');
    setTempFontFamily('tajawal');
    setTempBgEffect('none');
    setHasChanges(true);
  };

  // ═══════════════════════════════════════════════════════════════
  // الستايلات
  // ═══════════════════════════════════════════════════════════════

  const cardStyle = {
    background: t.bg.secondary,
    borderRadius: 16,
    border: `1px solid ${t.border.primary}`,
    padding: 20,
    marginBottom: 16,
  };

  const sectionTitle = (icon, title, subtitle) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: `${t.button.primary}20`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 600, color: t.text.primary }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: t.text.muted }}>{subtitle}</div>}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  // الواجهة
  // ═══════════════════════════════════════════════════════════════

  return (
    <div style={{ padding: '20px 0', maxWidth: 700, margin: '0 auto' }}>
      
      {/* العنوان */}
      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        marginBottom: 24, flexWrap: 'wrap', gap: 12 
      }}>
        <h2 style={{ 
          fontSize: 24, fontWeight: 700, color: t.text.primary, margin: 0,
          display: 'flex', alignItems: 'center', gap: 12 
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: t.button.gradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Palette size={24} color="#fff" />
          </div>
          الإعدادات
        </h2>
        
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleReset} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 16px', borderRadius: 10,
            border: `1px solid ${t.border.primary}`,
            background: t.bg.tertiary, color: t.text.muted,
            fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            <RotateCcw size={16} />
            إعادة تعيين
          </button>
          
          <button onClick={handleSave} disabled={!hasChanges} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 24px', borderRadius: 10, border: 'none',
            background: hasChanges ? t.button.gradient : t.bg.tertiary,
            color: hasChanges ? '#fff' : t.text.muted,
            fontSize: 14, fontWeight: 600, 
            cursor: hasChanges ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit', opacity: hasChanges ? 1 : 0.5,
            boxShadow: hasChanges ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
          }}>
            <Save size={18} />
            حفظ التغييرات
          </button>
        </div>
      </div>

      {/* رسالة النجاح */}
      {saved && (
        <div style={{
          background: '#10b98115', border: '1px solid #10b98140',
          borderRadius: 12, padding: '14px 18px', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 12,
          color: '#10b981', fontSize: 14, fontWeight: 600,
        }}>
          <Check size={20} />
          تم حفظ الإعدادات بنجاح! ✓
        </div>
      )}

      {/* ═══════════════ وضع العرض ═══════════════ */}
      <div style={cardStyle}>
        {sectionTitle(
          darkMode ? <Moon size={20} color={t.button.primary} /> : <Sun size={20} color={t.button.primary} />,
          'وضع العرض',
          'اختر المظهر المناسب'
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { id: 'light', name: 'فاتح', icon: Sun },
            { id: 'dark', name: 'داكن', icon: Moon },
            { id: 'auto', name: 'تلقائي', icon: Monitor },
          ].map((mode) => {
            const Icon = mode.icon;
            const isActive = tempThemeMode === mode.id;
            return (
              <button key={mode.id} onClick={() => updateSetting(setTempThemeMode)(mode.id)} style={{
                padding: 18, borderRadius: 12,
                border: isActive ? `2px solid ${t.button.primary}` : `1px solid ${t.border.primary}`,
                background: isActive ? `${t.button.primary}15` : t.bg.tertiary,
                cursor: 'pointer', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 10, fontFamily: 'inherit',
              }}>
                <Icon size={28} color={isActive ? t.button.primary : t.text.muted} />
                <span style={{ fontSize: 14, fontWeight: 600, color: isActive ? t.button.primary : t.text.secondary }}>
                  {mode.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════════ لون الهيدر ═══════════════ */}
      <div style={cardStyle}>
        {sectionTitle(<Layout size={20} color={t.button.primary} />, 'لون الهيدر', 'لون الشريط العلوي')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
          {headerColors.map((item) => {
            const isActive = tempHeaderColor === item.id;
            return (
              <button key={item.id} onClick={() => updateSetting(setTempHeaderColor)(item.id)} title={item.name} style={{
                aspectRatio: '1', borderRadius: 12,
                border: isActive ? `3px solid ${t.button.primary}` : `2px solid ${t.border.primary}`,
                background: item.color, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                boxShadow: isActive ? `0 0 0 3px ${t.button.primary}30` : 'none',
                transition: 'all 0.15s ease',
              }}>
                {isActive && <Check size={18} color="#fff" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════════ لون الأزرار ═══════════════ */}
      <div style={cardStyle}>
        {sectionTitle(<Square size={20} color={t.button.primary} />, 'لون الأزرار', 'اللون الرئيسي للتطبيق')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
          {buttonColors.map((item) => {
            const isActive = tempButtonColor === item.id;
            return (
              <button key={item.id} onClick={() => updateSetting(setTempButtonColor)(item.id)} title={item.name} style={{
                aspectRatio: '1', borderRadius: 12,
                border: isActive ? `3px solid #fff` : `2px solid transparent`,
                background: item.gradient, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                boxShadow: isActive ? `0 4px 15px ${item.color}50` : '0 2px 8px rgba(0,0,0,0.2)',
                transition: 'all 0.15s ease',
              }}>
                {isActive && <Check size={18} color="#fff" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════════ تأثير الخلفية ═══════════════ */}
      <div style={cardStyle}>
        {sectionTitle(<Sparkles size={20} color={t.button.primary} />, 'تأثير الخلفية', 'للوضع الداكن فقط')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {bgEffects.map((effect) => {
            const isActive = tempBgEffect === effect.id;
            return (
              <button key={effect.id} onClick={() => updateSetting(setTempBgEffect)(effect.id)} style={{
                padding: 16, borderRadius: 12,
                border: isActive ? `2px solid ${t.button.primary}` : `1px solid ${t.border.primary}`,
                background: isActive ? `${t.button.primary}15` : t.bg.tertiary,
                cursor: 'pointer', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 8, fontFamily: 'inherit',
              }}>
                <span style={{ fontSize: 28 }}>{effect.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: isActive ? t.button.primary : t.text.secondary }}>
                  {effect.name}
                </span>
                <span style={{ fontSize: 10, color: t.text.muted }}>{effect.desc}</span>
              </button>
            );
          })}
        </div>
        
        {tempBgEffect !== 'none' && !darkMode && (
          <div style={{
            marginTop: 14, padding: '12px 16px', borderRadius: 10,
            background: '#f59e0b15', border: '1px solid #f59e0b30',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <AlertCircle size={18} color="#f59e0b" />
            <span style={{ fontSize: 12, color: '#f59e0b' }}>
              تأثيرات الخلفية تظهر في الوضع الداكن فقط
            </span>
          </div>
        )}
      </div>

      {/* ═══════════════ نوع الخط ═══════════════ */}
      <div style={cardStyle}>
        {sectionTitle(<Type size={20} color={t.button.primary} />, 'نوع الخط', 'اختر الخط المناسب')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {fonts.map((font) => {
            const isActive = tempFontFamily === font.id;
            return (
              <button key={font.id} onClick={() => updateSetting(setTempFontFamily)(font.id)} style={{
                padding: '14px 10px', borderRadius: 10,
                border: isActive ? `2px solid ${t.button.primary}` : `1px solid ${t.border.primary}`,
                background: isActive ? `${t.button.primary}15` : t.bg.tertiary,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: isActive ? t.button.primary : t.text.secondary }}>
                  {font.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════════ حجم الخط ═══════════════ */}
      <div style={cardStyle}>
        {sectionTitle(
          <Type size={20} color={t.button.primary} />, 
          'حجم الخط',
          <span style={{ background: t.button.gradient, color: '#fff', padding: '2px 10px', borderRadius: 20, fontSize: 11 }}>
            {tempFontSize}px
          </span>
        )}
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
          <span style={{ fontSize: 12, color: t.text.muted }}>أ</span>
          <input
            type="range" min="12" max="22" value={tempFontSize}
            onChange={(e) => updateSetting(setTempFontSize)(parseInt(e.target.value))}
            style={{ flex: 1, height: 8, borderRadius: 4, appearance: 'none', background: t.bg.tertiary, cursor: 'pointer' }}
          />
          <span style={{ fontSize: 22, color: t.text.muted }}>أ</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[{ size: 14, label: 'صغير' }, { size: 16, label: 'متوسط' }, { size: 18, label: 'كبير' }, { size: 20, label: 'أكبر' }].map((item) => (
            <button key={item.size} onClick={() => updateSetting(setTempFontSize)(item.size)} style={{
              padding: '10px 8px', borderRadius: 8,
              border: tempFontSize === item.size ? `2px solid ${t.button.primary}` : `1px solid ${t.border.primary}`,
              background: tempFontSize === item.size ? `${t.button.primary}15` : 'transparent',
              cursor: 'pointer', fontSize: 12, fontWeight: 600,
              color: tempFontSize === item.size ? t.button.primary : t.text.muted, fontFamily: 'inherit',
            }}>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════ الثيمات ═══════════════ */}
      {themeList.length > 0 && (
        <div style={cardStyle}>
          {sectionTitle(<Palette size={20} color={t.button.primary} />, 'الثيم', 'نظام الألوان')}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {themeList.map((themeItem) => {
              const isActive = tempThemeId === themeItem.id;
              return (
                <button key={themeItem.id} onClick={() => updateSetting(setTempThemeId)(themeItem.id)} style={{
                  padding: 16, borderRadius: 12,
                  border: isActive ? `2px solid ${t.button.primary}` : `1px solid ${t.border.primary}`,
                  background: isActive ? `${t.button.primary}15` : t.bg.tertiary,
                  cursor: 'pointer', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 10, fontFamily: 'inherit',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: themeItem.preview || t.button.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isActive && <Check size={20} color="#fff" />}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: isActive ? t.button.primary : t.text.secondary }}>
                    {themeItem.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════ المدينة ═══════════════ */}
      <div style={cardStyle}>
        {sectionTitle(<MapPin size={20} color={t.button.primary} />, 'المدينة', 'لعرض حالة الطقس')}
        <div style={{ position: 'relative' }}>
          <select
            value={tempCity}
            onChange={(e) => updateSetting(setTempCity)(e.target.value)}
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 12,
              border: `1px solid ${t.border.primary}`, background: t.bg.tertiary,
              color: t.text.primary, fontSize: 14, fontFamily: 'inherit',
              cursor: 'pointer', appearance: 'none',
            }}
          >
            {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <ChevronDown size={20} color={t.text.muted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* تنبيه التغييرات */}
      {hasChanges && (
        <div style={{
          background: `${t.button.primary}10`, border: `1px solid ${t.button.primary}30`,
          borderRadius: 12, padding: '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ color: t.button.primary, fontSize: 14, fontWeight: 500 }}>
            💡 لديك تغييرات غير محفوظة
          </span>
          <button onClick={handleSave} style={{
            padding: '10px 20px', borderRadius: 8, border: 'none',
            background: t.button.gradient, color: '#fff',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            حفظ الآن
          </button>
        </div>
      )}

    </div>
  );
}
