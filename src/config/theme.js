// src/config/theme.js
// ═══════════════════════════════════════════════════════════════
// 🎨 نظام القوالب المرن - Flexible Theme System
// ═══════════════════════════════════════════════════════════════
// 
// ✅ لإضافة قالب جديد: فقط أضفه في THEMES وسيظهر تلقائياً
// ✅ لا تحتاج تعديل App.jsx أبداً
// 
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// 📋 الإعدادات المشتركة (لجميع القوالب)
// ═══════════════════════════════════════════════════════════════

export const SHARED = {
  font: {
    family: "'Cairo', sans-serif",
    url: 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap',
    size: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem' },
    weight: { normal: 400, medium: 500, semibold: 600, bold: 700 },
  },
  spacing: { xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '20px', '2xl': '24px', '3xl': '32px', '4xl': '48px' },
  radius: { none: '0', sm: '6px', md: '10px', lg: '14px', xl: '18px', '2xl': '24px', full: '9999px' },
  shadow: { none: 'none', sm: '0 2px 4px rgba(0,0,0,0.1)', md: '0 4px 12px rgba(0,0,0,0.15)', lg: '0 8px 24px rgba(0,0,0,0.2)', xl: '0 16px 40px rgba(0,0,0,0.25)' },
  transition: { fast: '150ms ease', normal: '250ms ease', slow: '350ms ease' },
};

// ═══════════════════════════════════════════════════════════════
// 🎨 القوالب - THEMES
// لإضافة قالب جديد: انسخ أي قالب وغيّر الألوان فقط!
// ═══════════════════════════════════════════════════════════════

export const THEMES = {

  // ─────────────────────────────────────────────────────────────
  // 💼 القالب الاحترافي (Professional)
  // ─────────────────────────────────────────────────────────────
  'professional': {
    id: 'professional',
    name: 'الاحترافي',
    nameEn: 'Professional',
    icon: '💼',
    description: 'تصميم احترافي رسمي مناسب للأعمال',
    dark: {
      bg: { primary: '#111827', secondary: '#1f2937', tertiary: '#374151', hover: '#4b5563' },
      text: { primary: '#f9fafb', secondary: '#d1d5db', muted: '#9ca3af' },
      border: { primary: '#374151', secondary: '#4b5563', light: '#1f2937' },
      button: { primary: '#3b82f6', gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', glow: '0 0 20px rgba(59, 130, 246, 0.3)', text: '#ffffff' },
      colors: {
        blue: { main: '#3b82f6', gradient: 'linear-gradient(135deg, #2563eb, #3b82f6)', glow: '0 0 20px rgba(59, 130, 246, 0.4)' },
        green: { main: '#10b981', gradient: 'linear-gradient(135deg, #059669, #10b981)', glow: '0 0 20px rgba(16, 185, 129, 0.4)' },
        yellow: { main: '#f59e0b', gradient: 'linear-gradient(135deg, #d97706, #f59e0b)', glow: '0 0 20px rgba(245, 158, 11, 0.4)' },
        red: { main: '#ef4444', gradient: 'linear-gradient(135deg, #dc2626, #ef4444)', glow: '0 0 20px rgba(239, 68, 68, 0.4)' },
        purple: { main: '#8b5cf6', gradient: 'linear-gradient(135deg, #7c3aed, #8b5cf6)', glow: '0 0 20px rgba(139, 92, 246, 0.4)' },
        cyan: { main: '#06b6d4', gradient: 'linear-gradient(135deg, #0891b2, #06b6d4)', glow: '0 0 20px rgba(6, 182, 212, 0.4)' },
      },
      status: {
        success: { bg: '#10b98115', text: '#10b981', border: '#10b98130' },
        warning: { bg: '#f59e0b15', text: '#f59e0b', border: '#f59e0b30' },
        danger: { bg: '#ef444415', text: '#ef4444', border: '#ef444430' },
        info: { bg: '#3b82f615', text: '#3b82f6', border: '#3b82f630' },
      },
    },
    light: {
      bg: { primary: '#ffffff', secondary: '#f9fafb', tertiary: '#f3f4f6', hover: '#e5e7eb' },
      text: { primary: '#111827', secondary: '#4b5563', muted: '#9ca3af' },
      border: { primary: '#e5e7eb', secondary: '#d1d5db', light: '#f3f4f6' },
      button: { primary: '#2563eb', gradient: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)', glow: '0 0 15px rgba(37, 99, 235, 0.2)', text: '#ffffff' },
      colors: {
        blue: { main: '#2563eb', gradient: 'linear-gradient(135deg, #1d4ed8, #2563eb)', glow: '0 0 15px rgba(37, 99, 235, 0.3)' },
        green: { main: '#059669', gradient: 'linear-gradient(135deg, #047857, #059669)', glow: '0 0 15px rgba(5, 150, 105, 0.3)' },
        yellow: { main: '#d97706', gradient: 'linear-gradient(135deg, #b45309, #d97706)', glow: '0 0 15px rgba(217, 119, 6, 0.3)' },
        red: { main: '#dc2626', gradient: 'linear-gradient(135deg, #b91c1c, #dc2626)', glow: '0 0 15px rgba(220, 38, 38, 0.3)' },
        purple: { main: '#7c3aed', gradient: 'linear-gradient(135deg, #6d28d9, #7c3aed)', glow: '0 0 15px rgba(124, 58, 237, 0.3)' },
        cyan: { main: '#0891b2', gradient: 'linear-gradient(135deg, #0e7490, #0891b2)', glow: '0 0 15px rgba(8, 145, 178, 0.3)' },
      },
      status: {
        success: { bg: '#05966912', text: '#059669', border: '#05966925' },
        warning: { bg: '#d9770612', text: '#d97706', border: '#d9770625' },
        danger: { bg: '#dc262612', text: '#dc2626', border: '#dc262625' },
        info: { bg: '#2563eb12', text: '#2563eb', border: '#2563eb25' },
      },
    },
  },

  // ─────────────────────────────────────────────────────────────
  // 🌃 أضواء طوكيو (Tokyo Lights)
  // ─────────────────────────────────────────────────────────────
  'tokyo-lights': {
    id: 'tokyo-lights',
    name: 'أضواء طوكيو',
    nameEn: 'Tokyo Lights',
    icon: '🌃',
    description: 'سيان + بنفسجي + وردي - الأكثر حيوية',
    dark: {
      bg: { primary: '#0a0a0f', secondary: '#101018', tertiary: '#18182a', hover: '#222235' },
      text: { primary: '#f0f0f8', secondary: '#9090a8', muted: '#606078' },
      border: { primary: '#252538', secondary: '#353548', light: '#1a1a28' },
      button: { primary: '#00d4ff', gradient: 'linear-gradient(135deg, #00b0e0 0%, #00d4ff 100%)', glow: '0 0 20px rgba(0, 212, 255, 0.4)', text: '#ffffff' },
      colors: {
        cyan: { main: '#00d4ff', gradient: 'linear-gradient(135deg, #00b0e0, #00d4ff)', glow: '0 0 25px rgba(0, 212, 255, 0.5)' },
        purple: { main: '#bf5af2', gradient: 'linear-gradient(135deg, #9040d0, #bf5af2)', glow: '0 0 25px rgba(191, 90, 242, 0.5)' },
        pink: { main: '#ff6b9d', gradient: 'linear-gradient(135deg, #e05080, #ff6b9d)', glow: '0 0 25px rgba(255, 107, 157, 0.5)' },
        green: { main: '#00ff88', gradient: 'linear-gradient(135deg, #00d070, #00ff88)', glow: '0 0 25px rgba(0, 255, 136, 0.5)' },
        yellow: { main: '#ffd000', gradient: 'linear-gradient(135deg, #e0b000, #ffd000)', glow: '0 0 25px rgba(255, 208, 0, 0.5)' },
        red: { main: '#ff4757', gradient: 'linear-gradient(135deg, #e03040, #ff4757)', glow: '0 0 25px rgba(255, 71, 87, 0.5)' },
      },
      status: {
        success: { bg: '#00ff8815', text: '#00ff88', border: '#00ff8830' },
        warning: { bg: '#ffd00015', text: '#ffd000', border: '#ffd00030' },
        danger: { bg: '#ff475715', text: '#ff4757', border: '#ff475730' },
        info: { bg: '#00d4ff15', text: '#00d4ff', border: '#00d4ff30' },
      },
      mixGradient: 'linear-gradient(135deg, #00d4ff 0%, #bf5af2 50%, #ff6b9d 100%)',
    },
    light: {
      bg: { primary: '#f8f8fc', secondary: '#ffffff', tertiary: '#f0f0f8', hover: '#e8e8f0' },
      text: { primary: '#1a1a28', secondary: '#5a5a70', muted: '#9090a0' },
      border: { primary: '#e0e0e8', secondary: '#d0d0d8', light: '#f0f0f5' },
      button: { primary: '#0099bb', gradient: 'linear-gradient(135deg, #0088aa 0%, #0099bb 100%)', glow: '0 0 15px rgba(0, 153, 187, 0.25)', text: '#ffffff' },
      colors: {
        cyan: { main: '#0099bb', gradient: 'linear-gradient(135deg, #0080a0, #0099bb)', glow: '0 0 15px rgba(0, 153, 187, 0.3)' },
        purple: { main: '#9040c0', gradient: 'linear-gradient(135deg, #7030a0, #9040c0)', glow: '0 0 15px rgba(144, 64, 192, 0.3)' },
        pink: { main: '#d04070', gradient: 'linear-gradient(135deg, #b03060, #d04070)', glow: '0 0 15px rgba(208, 64, 112, 0.3)' },
        green: { main: '#00a060', gradient: 'linear-gradient(135deg, #008050, #00a060)', glow: '0 0 15px rgba(0, 160, 96, 0.3)' },
        yellow: { main: '#c09000', gradient: 'linear-gradient(135deg, #a08000, #c09000)', glow: '0 0 15px rgba(192, 144, 0, 0.3)' },
        red: { main: '#d03040', gradient: 'linear-gradient(135deg, #b02030, #d03040)', glow: '0 0 15px rgba(208, 48, 64, 0.3)' },
      },
      status: {
        success: { bg: '#00a06012', text: '#00a060', border: '#00a06025' },
        warning: { bg: '#c0900012', text: '#c09000', border: '#c0900025' },
        danger: { bg: '#d0304012', text: '#d03040', border: '#d0304025' },
        info: { bg: '#0099bb12', text: '#0099bb', border: '#0099bb25' },
      },
      mixGradient: 'linear-gradient(135deg, #0099bb 0%, #9040c0 50%, #d04070 100%)',
    },
  },

  // ─────────────────────────────────────────────────────────────
  // 🌅 شروق طوكيو (Tokyo Sunrise)
  // ─────────────────────────────────────────────────────────────
  'tokyo-sunrise': {
    id: 'tokyo-sunrise',
    name: 'شروق طوكيو',
    nameEn: 'Tokyo Sunrise',
    icon: '🌅',
    description: 'أزرق + برتقالي + ذهبي - دافئ وحيوي',
    dark: {
      bg: { primary: '#08080c', secondary: '#0f0f14', tertiary: '#181820', hover: '#222230' },
      text: { primary: '#f8f0e8', secondary: '#a09080', muted: '#706860' },
      border: { primary: '#282420', secondary: '#383430', light: '#1a1815' },
      button: { primary: '#00d4ff', gradient: 'linear-gradient(135deg, #00b0e0 0%, #00d4ff 100%)', glow: '0 0 20px rgba(0, 212, 255, 0.4)', text: '#ffffff' },
      colors: {
        blue: { main: '#4a9fff', gradient: 'linear-gradient(135deg, #3080e0, #4a9fff)', glow: '0 0 25px rgba(74, 159, 255, 0.5)' },
        orange: { main: '#ff7a3d', gradient: 'linear-gradient(135deg, #e06020, #ff7a3d)', glow: '0 0 25px rgba(255, 122, 61, 0.5)' },
        gold: { main: '#ffc93c', gradient: 'linear-gradient(135deg, #e0a820, #ffc93c)', glow: '0 0 25px rgba(255, 201, 60, 0.5)' },
        teal: { main: '#20e3b2', gradient: 'linear-gradient(135deg, #10c090, #20e3b2)', glow: '0 0 25px rgba(32, 227, 178, 0.5)' },
        coral: { main: '#ff6b6b', gradient: 'linear-gradient(135deg, #e05050, #ff6b6b)', glow: '0 0 25px rgba(255, 107, 107, 0.5)' },
        lime: { main: '#c8e600', gradient: 'linear-gradient(135deg, #a8c000, #c8e600)', glow: '0 0 25px rgba(200, 230, 0, 0.5)' },
      },
      status: {
        success: { bg: '#20e3b215', text: '#20e3b2', border: '#20e3b230' },
        warning: { bg: '#ffc93c15', text: '#ffc93c', border: '#ffc93c30' },
        danger: { bg: '#ff6b6b15', text: '#ff6b6b', border: '#ff6b6b30' },
        info: { bg: '#4a9fff15', text: '#4a9fff', border: '#4a9fff30' },
      },
      mixGradient: 'linear-gradient(135deg, #4a9fff 0%, #ff7a3d 50%, #ffc93c 100%)',
    },
    light: {
      bg: { primary: '#fffcf8', secondary: '#ffffff', tertiary: '#fff8f0', hover: '#f8f0e8' },
      text: { primary: '#201810', secondary: '#605040', muted: '#a09080' },
      border: { primary: '#e8e0d8', secondary: '#d8d0c8', light: '#f5f0e8' },
      button: { primary: '#0099bb', gradient: 'linear-gradient(135deg, #0088aa 0%, #0099bb 100%)', glow: '0 0 15px rgba(0, 153, 187, 0.25)', text: '#ffffff' },
      colors: {
        blue: { main: '#2070c0', gradient: 'linear-gradient(135deg, #1060a0, #2070c0)', glow: '0 0 15px rgba(32, 112, 192, 0.3)' },
        orange: { main: '#d05020', gradient: 'linear-gradient(135deg, #b04010, #d05020)', glow: '0 0 15px rgba(208, 80, 32, 0.3)' },
        gold: { main: '#c09010', gradient: 'linear-gradient(135deg, #a08000, #c09010)', glow: '0 0 15px rgba(192, 144, 16, 0.3)' },
        teal: { main: '#10a080', gradient: 'linear-gradient(135deg, #008060, #10a080)', glow: '0 0 15px rgba(16, 160, 128, 0.3)' },
        coral: { main: '#c04040', gradient: 'linear-gradient(135deg, #a03030, #c04040)', glow: '0 0 15px rgba(192, 64, 64, 0.3)' },
        lime: { main: '#80a000', gradient: 'linear-gradient(135deg, #608000, #80a000)', glow: '0 0 15px rgba(128, 160, 0, 0.3)' },
      },
      status: {
        success: { bg: '#10a08012', text: '#10a080', border: '#10a08025' },
        warning: { bg: '#c0901012', text: '#c09010', border: '#c0901025' },
        danger: { bg: '#c0404012', text: '#c04040', border: '#c0404025' },
        info: { bg: '#2070c012', text: '#2070c0', border: '#2070c025' },
      },
      mixGradient: 'linear-gradient(135deg, #2070c0 0%, #d05020 50%, #c09010 100%)',
    },
  },

  // ─────────────────────────────────────────────────────────────
  // 🌸 حدائق طوكيو (Tokyo Garden)
  // ─────────────────────────────────────────────────────────────
  'tokyo-garden': {
    id: 'tokyo-garden',
    name: 'حدائق طوكيو',
    nameEn: 'Tokyo Garden',
    icon: '🌸',
    description: 'أخضر + بنفسجي + وردي - طبيعي وهادئ',
    dark: {
      bg: { primary: '#080a0c', secondary: '#0e1214', tertiary: '#161a1e', hover: '#1e2428' },
      text: { primary: '#f0f5f0', secondary: '#90a090', muted: '#607060' },
      border: { primary: '#202828', secondary: '#303838', light: '#181e1e' },
      button: { primary: '#00d4ff', gradient: 'linear-gradient(135deg, #00b0e0 0%, #00d4ff 100%)', glow: '0 0 20px rgba(0, 212, 255, 0.4)', text: '#ffffff' },
      colors: {
        emerald: { main: '#10b981', gradient: 'linear-gradient(135deg, #059669, #10b981)', glow: '0 0 25px rgba(16, 185, 129, 0.5)' },
        violet: { main: '#8b5cf6', gradient: 'linear-gradient(135deg, #7c3aed, #8b5cf6)', glow: '0 0 25px rgba(139, 92, 246, 0.5)' },
        rose: { main: '#f472b6', gradient: 'linear-gradient(135deg, #ec4899, #f472b6)', glow: '0 0 25px rgba(244, 114, 182, 0.5)' },
        sky: { main: '#38bdf8', gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', glow: '0 0 25px rgba(56, 189, 248, 0.5)' },
        amber: { main: '#fbbf24', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)', glow: '0 0 25px rgba(251, 191, 36, 0.5)' },
        mint: { main: '#6ee7b7', gradient: 'linear-gradient(135deg, #34d399, #6ee7b7)', glow: '0 0 25px rgba(110, 231, 183, 0.5)' },
      },
      status: {
        success: { bg: '#10b98115', text: '#10b981', border: '#10b98130' },
        warning: { bg: '#fbbf2415', text: '#fbbf24', border: '#fbbf2430' },
        danger: { bg: '#f472b615', text: '#f472b6', border: '#f472b630' },
        info: { bg: '#38bdf815', text: '#38bdf8', border: '#38bdf830' },
      },
      mixGradient: 'linear-gradient(135deg, #10b981 0%, #8b5cf6 50%, #f472b6 100%)',
    },
    light: {
      bg: { primary: '#f8fcf8', secondary: '#ffffff', tertiary: '#f0f8f0', hover: '#e8f0e8' },
      text: { primary: '#102010', secondary: '#406040', muted: '#809080' },
      border: { primary: '#d8e8d8', secondary: '#c8d8c8', light: '#e8f0e8' },
      button: { primary: '#0099bb', gradient: 'linear-gradient(135deg, #0088aa 0%, #0099bb 100%)', glow: '0 0 15px rgba(0, 153, 187, 0.25)', text: '#ffffff' },
      colors: {
        emerald: { main: '#059669', gradient: 'linear-gradient(135deg, #047857, #059669)', glow: '0 0 15px rgba(5, 150, 105, 0.3)' },
        violet: { main: '#7c3aed', gradient: 'linear-gradient(135deg, #6d28d9, #7c3aed)', glow: '0 0 15px rgba(124, 58, 237, 0.3)' },
        rose: { main: '#ec4899', gradient: 'linear-gradient(135deg, #db2777, #ec4899)', glow: '0 0 15px rgba(236, 72, 153, 0.3)' },
        sky: { main: '#0ea5e9', gradient: 'linear-gradient(135deg, #0284c7, #0ea5e9)', glow: '0 0 15px rgba(14, 165, 233, 0.3)' },
        amber: { main: '#f59e0b', gradient: 'linear-gradient(135deg, #d97706, #f59e0b)', glow: '0 0 15px rgba(245, 158, 11, 0.3)' },
        mint: { main: '#34d399', gradient: 'linear-gradient(135deg, #10b981, #34d399)', glow: '0 0 15px rgba(52, 211, 153, 0.3)' },
      },
      status: {
        success: { bg: '#05966912', text: '#059669', border: '#05966925' },
        warning: { bg: '#f59e0b12', text: '#f59e0b', border: '#f59e0b25' },
        danger: { bg: '#ec489912', text: '#ec4899', border: '#ec489925' },
        info: { bg: '#0ea5e912', text: '#0ea5e9', border: '#0ea5e925' },
      },
      mixGradient: 'linear-gradient(135deg, #059669 0%, #7c3aed 50%, #ec4899 100%)',
    },
  },

};

// ═══════════════════════════════════════════════════════════════
// 📋 قائمة القوالب (تُبنى تلقائياً)
// ═══════════════════════════════════════════════════════════════

export const THEME_LIST = Object.values(THEMES).map(t => ({
  id: t.id, name: t.name, nameEn: t.nameEn, icon: t.icon, description: t.description,
}));

// ═══════════════════════════════════════════════════════════════
// 🔧 دالة الحصول على القالب
// ═══════════════════════════════════════════════════════════════

export const getTheme = (themeId = 'professional', isDarkMode = true) => {
  const theme = THEMES[themeId] || THEMES['professional'];
  const mode = isDarkMode ? theme.dark : theme.light;
  const colorKeys = Object.keys(mode.colors);
  const dangerKey = colorKeys.find(k => ['red', 'coral', 'rose', 'pink'].includes(k)) || colorKeys[colorKeys.length - 1];
  
  return {
    id: theme.id, name: theme.name, nameEn: theme.nameEn, icon: theme.icon, description: theme.description,
    ...mode, ...SHARED,
    isDark: isDarkMode, colorKeys, dangerColor: mode.colors[dangerKey],
  };
};

// ═══════════════════════════════════════════════════════════════
// 🎨 دالة الستايلات الجاهزة
// ═══════════════════════════════════════════════════════════════

export const getStyles = (themeId = 'professional', isDarkMode = true) => {
  const t = getTheme(themeId, isDarkMode);
  
  return {
    page: { minHeight: '100vh', background: t.bg.primary, color: t.text.primary, fontFamily: t.font.family, direction: 'rtl' },
    card: { background: t.bg.secondary, borderRadius: t.radius.xl, border: `1px solid ${t.border.primary}`, padding: t.spacing['2xl'] },
    buttonPrimary: { padding: `${t.spacing.md} ${t.spacing['2xl']}`, borderRadius: t.radius.lg, border: 'none', background: t.button.gradient, color: t.button.text, fontWeight: t.font.weight.semibold, fontSize: t.font.size.sm, cursor: 'pointer', fontFamily: t.font.family, boxShadow: t.button.glow, transition: t.transition.fast },
    buttonSecondary: { padding: `${t.spacing.md} ${t.spacing['2xl']}`, borderRadius: t.radius.lg, border: `1px solid ${t.border.secondary}`, background: 'transparent', color: t.text.primary, fontWeight: t.font.weight.medium, fontSize: t.font.size.sm, cursor: 'pointer', fontFamily: t.font.family, transition: t.transition.fast },
    buttonGhost: { padding: `${t.spacing.md} ${t.spacing['2xl']}`, borderRadius: t.radius.lg, border: 'none', background: `${t.button.primary}18`, color: t.button.primary, fontWeight: t.font.weight.medium, fontSize: t.font.size.sm, cursor: 'pointer', fontFamily: t.font.family, transition: t.transition.fast },
    buttonDanger: { padding: `${t.spacing.md} ${t.spacing['2xl']}`, borderRadius: t.radius.lg, border: 'none', background: `${t.dangerColor.main}18`, color: t.dangerColor.main, fontWeight: t.font.weight.medium, fontSize: t.font.size.sm, cursor: 'pointer', fontFamily: t.font.family, transition: t.transition.fast },
    input: { width: '100%', padding: `${t.spacing.md} ${t.spacing.lg}`, borderRadius: t.radius.lg, border: `1px solid ${t.border.primary}`, background: t.bg.tertiary, color: t.text.primary, fontSize: t.font.size.sm, fontFamily: t.font.family, outline: 'none', boxSizing: 'border-box', transition: t.transition.fast },
    label: { fontSize: t.font.size.sm, fontWeight: t.font.weight.medium, color: t.text.secondary, marginBottom: t.spacing.sm, display: 'block' },
    heading: { fontSize: t.font.size['2xl'], fontWeight: t.font.weight.bold, color: t.text.primary, margin: 0 },
    badge: (colorKey) => { const c = t.colors[colorKey] || t.colors[t.colorKeys[0]]; return { fontSize: t.font.size.xs, fontWeight: t.font.weight.semibold, padding: `${t.spacing.xs} ${t.spacing.md}`, borderRadius: t.radius.md, background: `${c.main}15`, color: c.main, border: `1px solid ${c.main}30` }; },
    iconBox: (colorKey) => { const c = t.colors[colorKey] || t.colors[t.colorKeys[0]]; return { width: 48, height: 48, borderRadius: t.radius.lg, background: c.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isDarkMode ? c.glow : 'none' }; },
    statusBadge: (status) => { const s = t.status[status] || t.status.info; return { fontSize: t.font.size.xs, fontWeight: t.font.weight.semibold, padding: `${t.spacing.xs} ${t.spacing.md}`, borderRadius: t.radius.md, background: s.bg, color: s.text, border: `1px solid ${s.border}` }; },
    modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: t.spacing['2xl'], zIndex: 1000 },
    modalContent: { background: t.bg.primary, borderRadius: t.radius['2xl'], border: `1px solid ${t.border.primary}`, padding: t.spacing['2xl'], maxWidth: '500px', width: '100%', maxHeight: '90vh', overflow: 'auto' },
  };
};

// ═══════════════════════════════════════════════════════════════
// 📤 التصدير
// ═══════════════════════════════════════════════════════════════

export default { THEMES, THEME_LIST, SHARED, getTheme, getStyles };
