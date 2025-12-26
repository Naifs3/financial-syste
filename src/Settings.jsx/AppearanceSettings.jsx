import React, { useState, useEffect } from 'react';
import { Sun, Moon, Check, Type, Palette, Sparkles } from 'lucide-react';

export default function AppearanceSettings({ embedded = false }) {
  // ═══════════════════════════════════════════════════════════════
  // 🎨 الإعدادات
  // ═══════════════════════════════════════════════════════════════
  
  const [theme, setTheme] = useState('dark'); // dark / light
  const [headerColor, setHeaderColor] = useState('purple'); // لون الهيدر
  const [buttonColor, setButtonColor] = useState('purple'); // لون الأزرار
  const [font, setFont] = useState('tajawal');
  const [fontSize, setFontSize] = useState('medium'); // حجم الخط
  const [bgEffect, setBgEffect] = useState('none'); // none / stars / vegas

  // ═══════════════════════════════════════════════════════════════
  // 🔤 أحجام الخط
  // ═══════════════════════════════════════════════════════════════
  
  const fontSizes = {
    small: { name: 'صغير', scale: 0.85 },
    medium: { name: 'متوسط', scale: 1 },
    large: { name: 'كبير', scale: 1.15 },
    xlarge: { name: 'كبير جداً', scale: 1.3 },
  };

  // ═══════════════════════════════════════════════════════════════
  // 🎨 الألوان المتاحة (12 لون)
  // ═══════════════════════════════════════════════════════════════
  
  const colors = {
    // الصف الأول
    purple: {
      name: 'بنفسجي',
      primary: '#6366f1',
      secondary: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      light: '#6366f120',
    },
    blue: {
      name: 'أزرق',
      primary: '#3b82f6',
      secondary: '#0ea5e9',
      gradient: 'linear-gradient(135deg, #3b82f6, #0ea5e9)',
      light: '#3b82f620',
    },
    cyan: {
      name: 'سماوي',
      primary: '#06b6d4',
      secondary: '#22d3ee',
      gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
      light: '#06b6d420',
    },
    green: {
      name: 'أخضر',
      primary: '#10b981',
      secondary: '#34d399',
      gradient: 'linear-gradient(135deg, #10b981, #34d399)',
      light: '#10b98120',
    },
    // الصف الثاني
    lime: {
      name: 'ليموني',
      primary: '#84cc16',
      secondary: '#a3e635',
      gradient: 'linear-gradient(135deg, #84cc16, #a3e635)',
      light: '#84cc1620',
    },
    yellow: {
      name: 'أصفر',
      primary: '#eab308',
      secondary: '#facc15',
      gradient: 'linear-gradient(135deg, #eab308, #facc15)',
      light: '#eab30820',
    },
    orange: {
      name: 'برتقالي',
      primary: '#f97316',
      secondary: '#fb923c',
      gradient: 'linear-gradient(135deg, #f97316, #fb923c)',
      light: '#f9731620',
    },
    red: {
      name: 'أحمر',
      primary: '#ef4444',
      secondary: '#f87171',
      gradient: 'linear-gradient(135deg, #ef4444, #f87171)',
      light: '#ef444420',
    },
    // الصف الثالث
    rose: {
      name: 'وردي',
      primary: '#f43f5e',
      secondary: '#ec4899',
      gradient: 'linear-gradient(135deg, #f43f5e, #ec4899)',
      light: '#f43f5e20',
    },
    pink: {
      name: 'زهري',
      primary: '#ec4899',
      secondary: '#f472b6',
      gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
      light: '#ec489920',
    },
    slate: {
      name: 'رمادي',
      primary: '#64748b',
      secondary: '#94a3b8',
      gradient: 'linear-gradient(135deg, #64748b, #94a3b8)',
      light: '#64748b20',
    },
    dark: {
      name: 'داكن',
      primary: '#1e293b',
      secondary: '#334155',
      gradient: 'linear-gradient(135deg, #1e293b, #334155)',
      light: '#1e293b20',
    },
  };

  // ═══════════════════════════════════════════════════════════════
  // ✏️ الخطوط المتاحة
  // ═══════════════════════════════════════════════════════════════
  
  const fonts = {
    tajawal: { name: 'تجول', family: "'Tajawal', sans-serif" },
    cairo: { name: 'القاهرة', family: "'Cairo', sans-serif" },
    almarai: { name: 'المراعي', family: "'Almarai', sans-serif" },
    ibmPlex: { name: 'IBM بلكس', family: "'IBM Plex Sans Arabic', sans-serif" },
    notoSans: { name: 'نوتو سانس', family: "'Noto Sans Arabic', sans-serif" },
    rubik: { name: 'روبيك', family: "'Rubik', sans-serif" },
    sfArabic: { name: 'خط آبل', family: "-apple-system, 'SF Pro Arabic', sans-serif" },
    calibri: { name: 'كاليبري', family: "'Calibri', 'Segoe UI', sans-serif" },
  };

  // ═══════════════════════════════════════════════════════════════
  // 🌙 ألوان الثيم
  // ═══════════════════════════════════════════════════════════════
  
  const themeColors = theme === 'dark' ? {
    bgPrimary: '#0a0a0f',
    bgSecondary: '#12121a',
    bgTertiary: '#1a1a24',
    textPrimary: '#ffffff',
    textSecondary: '#a0a0b0',
    textMuted: '#6b6b80',
    border: '#2a2a3a',
  } : {
    bgPrimary: '#f8fafc',
    bgSecondary: '#ffffff',
    bgTertiary: '#f1f5f9',
    textPrimary: '#1e293b',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    border: '#e2e8f0',
  };

  const c = { ...themeColors, ...colors[buttonColor] };

  // ═══════════════════════════════════════════════════════════════
  // 💾 حفظ واسترجاع الإعدادات
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    const saved = localStorage.getItem('rkz_appearance');
    if (saved) {
      const data = JSON.parse(saved);
      setTheme(data.theme || 'dark');
      setHeaderColor(data.headerColor || 'purple');
      setButtonColor(data.buttonColor || 'purple');
      setFont(data.font || 'tajawal');
      setFontSize(data.fontSize || 'medium');
      setBgEffect(data.bgEffect || 'none');
    }
  }, []);

  const saveSettings = () => {
    const settings = { theme, headerColor, buttonColor, font, fontSize, bgEffect };
    localStorage.setItem('rkz_appearance', JSON.stringify(settings));
  };

  // ═══════════════════════════════════════════════════════════════
  // ⭐ خلفية النجوم والشهب (النمط الياباني)
  // ═══════════════════════════════════════════════════════════════
  
  const StarryBackground = () => {
    // النجوم الثابتة
    const stars = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 3,
    }));

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
        background: '#08080c',
      }}>
        {/* النجوم المتلألئة */}
        {stars.map((star) => (
          <div
            key={star.id}
            style={{
              position: 'absolute',
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: star.size,
              height: star.size,
              background: '#fff',
              borderRadius: '50%',
              opacity: 0.6,
              animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            }}
          />
        ))}

        {/* شهاب واحد فقط */}
        <div className="meteor" />

        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.9; }
          }
          
          .meteor {
            position: absolute;
            top: 15%;
            right: -5%;
            width: 80px;
            height: 1px;
            background: linear-gradient(to left, #fff, transparent);
            transform: rotate(-35deg);
            opacity: 0;
            animation: shootingStar 12s ease-out infinite;
            animation-delay: 3s;
          }
          
          @keyframes shootingStar {
            0% {
              opacity: 0;
              transform: rotate(-35deg) translateX(0);
            }
            2% {
              opacity: 0.8;
            }
            8% {
              opacity: 0;
              transform: rotate(-35deg) translateX(-400px);
            }
            100% {
              opacity: 0;
              transform: rotate(-35deg) translateX(-400px);
            }
          }
        `}</style>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // 🎰 خلفية لاس فيغاس مع رموز غامضة (محسّنة)
  // ═══════════════════════════════════════════════════════════════
  
  const VegasBackground = () => {
    // أضواء النيون المتحركة - عشوائية ومتناثرة
    const neonLights = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 90 + 5,
      top: Math.random() * 90 + 5,
      size: Math.random() * 3 + 1,
      color: ['#ff00ff', '#00ffff', '#ff0066', '#00ff66', '#6600ff', '#ff3300'][Math.floor(Math.random() * 6)],
      delay: Math.random() * 4,
      duration: Math.random() * 2 + 1.5,
    }));

    // الرموز الغامضة المخفية
    const mysterySymbols = [
      { symbol: '♠', left: 8, top: 15, size: 12, opacity: 0.04, delay: 0 },
      { symbol: '♦', left: 92, top: 25, size: 14, opacity: 0.03, delay: 1 },
      { symbol: '♣', left: 15, top: 75, size: 10, opacity: 0.04, delay: 2 },
      { symbol: '♥', left: 85, top: 80, size: 11, opacity: 0.03, delay: 1.5 },
      { symbol: '7', left: 50, top: 10, size: 20, opacity: 0.02, delay: 0.5 },
      { symbol: '777', left: 30, top: 50, size: 16, opacity: 0.015, delay: 3 },
      { symbol: '★', left: 70, top: 40, size: 18, opacity: 0.03, delay: 2.5 },
      { symbol: '$', left: 25, top: 30, size: 15, opacity: 0.025, delay: 1.2 },
      { symbol: '∞', left: 75, top: 60, size: 14, opacity: 0.02, delay: 0.8 },
      { symbol: '☾', left: 5, top: 45, size: 16, opacity: 0.03, delay: 2 },
      { symbol: '◇', left: 95, top: 55, size: 12, opacity: 0.025, delay: 1.8 },
      { symbol: '⚡', left: 40, top: 85, size: 13, opacity: 0.03, delay: 0.3 },
    ];

    // رسائل مشفرة تظهر وتختفي
    const hiddenMessages = [
      { text: 'JACKPOT', left: 20, top: 20, delay: 5 },
      { text: 'LUCKY', left: 80, top: 70, delay: 8 },
      { text: '21', left: 50, top: 50, delay: 12 },
      { text: 'ACE', left: 10, top: 60, delay: 15 },
      { text: 'WIN', left: 90, top: 35, delay: 10 },
    ];

    // عيون مراقبة خفية
    const watchingEyes = [
      { left: 3, top: 8, delay: 0 },
      { left: 97, top: 12, delay: 2 },
      { left: 2, top: 88, delay: 4 },
      { left: 98, top: 92, delay: 1 },
    ];

    // أرقام محظوظة تطفو
    const luckyNumbers = ['7', '11', '21', '77', '13'];

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
        background: '#050508',
      }}>
        {/* الرموز الغامضة المخفية */}
        {mysterySymbols.map((item, i) => (
          <div
            key={`mystery-${i}`}
            style={{
              position: 'absolute',
              left: `${item.left}%`,
              top: `${item.top}%`,
              fontSize: item.size,
              color: '#fff',
              opacity: item.opacity,
              fontFamily: 'serif',
              animation: `mysteryPulse 8s ease-in-out ${item.delay}s infinite`,
              textShadow: '0 0 10px rgba(255,255,255,0.3)',
            }}
          >
            {item.symbol}
          </div>
        ))}

        {/* رسائل مشفرة تظهر وتختفي */}
        {hiddenMessages.map((msg, i) => (
          <div
            key={`msg-${i}`}
            style={{
              position: 'absolute',
              left: `${msg.left}%`,
              top: `${msg.top}%`,
              fontSize: 10,
              color: '#ff00ff',
              opacity: 0,
              fontFamily: 'monospace',
              letterSpacing: 3,
              animation: `secretReveal 20s ease-in-out ${msg.delay}s infinite`,
              textShadow: '0 0 8px #ff00ff',
            }}
          >
            {msg.text}
          </div>
        ))}

        {/* عيون مراقبة خفية */}
        {watchingEyes.map((eye, i) => (
          <div
            key={`eye-${i}`}
            style={{
              position: 'absolute',
              left: `${eye.left}%`,
              top: `${eye.top}%`,
              fontSize: 8,
              opacity: 0,
              animation: `watchingEye 15s ease-in-out ${eye.delay}s infinite`,
            }}
          >
            👁
          </div>
        ))}

        {/* أرقام محظوظة تطفو */}
        {luckyNumbers.map((num, i) => (
          <div
            key={`lucky-${i}`}
            style={{
              position: 'absolute',
              left: `${15 + i * 18}%`,
              bottom: -20,
              fontSize: 14,
              color: '#ff00ff',
              opacity: 0,
              fontFamily: 'monospace',
              fontWeight: 'bold',
              animation: `floatUp 25s linear ${i * 5}s infinite`,
              textShadow: '0 0 10px #ff00ff',
            }}
          >
            {num}
          </div>
        ))}

        {/* أضواء النيون العشوائية والمتناثرة */}
        {neonLights.map((light) => (
          <div
            key={light.id}
            style={{
              position: 'absolute',
              left: `${light.left}%`,
              top: `${light.top}%`,
              width: light.size,
              height: light.size,
              background: light.color,
              borderRadius: '50%',
              boxShadow: `0 0 ${light.size * 4}px ${light.size}px ${light.color}40`,
              animation: `neonFloat ${light.duration}s ease-in-out ${light.delay}s infinite alternate`,
              opacity: 0.6,
            }}
          />
        ))}

        {/* رمز الهرم الماسوني المخفي جداً */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 60,
          color: '#fff',
          opacity: 0.008,
          animation: `deepMystery 30s ease-in-out infinite`,
        }}>
          △
        </div>

        {/* عين في المثلث - تظهر نادراً */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '48%',
          transform: 'translate(-50%, -50%)',
          fontSize: 15,
          opacity: 0,
          animation: `rareReveal 60s ease-in-out 30s infinite`,
        }}>
          👁
        </div>

        {/* توهج خفيف جداً */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(100,0,150,0.05) 0%, transparent 70%)',
          animation: 'vegasGlow 5s ease-in-out infinite alternate',
        }} />

        <style>{`
          @keyframes neonFloat {
            0% { opacity: 0.3; transform: scale(0.9) translateY(0); }
            100% { opacity: 0.7; transform: scale(1.1) translateY(-5px); }
          }
          @keyframes vegasGlow {
            0% { opacity: 0.3; transform: translateX(-50%) scale(0.9); }
            100% { opacity: 0.5; transform: translateX(-50%) scale(1.1); }
          }
          @keyframes mysteryPulse {
            0%, 100% { opacity: 0.02; transform: scale(1); }
            50% { opacity: 0.06; transform: scale(1.1); }
          }
          @keyframes secretReveal {
            0%, 85%, 100% { opacity: 0; }
            90%, 95% { opacity: 0.15; }
          }
          @keyframes watchingEye {
            0%, 90%, 100% { opacity: 0; }
            93%, 97% { opacity: 0.3; }
          }
          @keyframes floatUp {
            0% { bottom: -20px; opacity: 0; }
            5% { opacity: 0.08; }
            95% { opacity: 0.08; }
            100% { bottom: 110%; opacity: 0; }
          }
          @keyframes deepMystery {
            0%, 100% { opacity: 0.005; transform: translate(-50%, -50%) rotate(0deg); }
            50% { opacity: 0.015; transform: translate(-50%, -50%) rotate(180deg); }
          }
          @keyframes rareReveal {
            0%, 98%, 100% { opacity: 0; }
            99% { opacity: 0.2; }
          }
        `}</style>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // 🖥️ واجهة المستخدم
  // ═══════════════════════════════════════════════════════════════

  return (
    <div dir="rtl" style={{
      minHeight: embedded ? 'auto' : '100vh',
      background: embedded ? 'transparent' : c.bgPrimary,
      fontFamily: fonts[font]?.family || "'Tajawal', sans-serif",
      position: 'relative',
    }}>
      {/* خلفية التأثيرات - فقط في الوضع المستقل */}
      {!embedded && bgEffect === 'stars' && theme === 'dark' && <StarryBackground />}
      {!embedded && bgEffect === 'vegas' && theme === 'dark' && <VegasBackground />}

      {/* تحميل الخطوط */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;600;700&family=Cairo:wght@400;500;600;700&family=Almarai:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@400;500;600;700&family=Rubik:wght@400;500;600;700&display=swap" />

      <div style={{
        maxWidth: embedded ? '100%' : 500,
        margin: '0 auto',
        padding: 20,
        position: 'relative',
        zIndex: 1,
      }}>
        {/* العنوان - فقط في الوضع المستقل */}
        {!embedded && (
          <div style={{
            textAlign: 'center',
            marginBottom: 24,
          }}>
            <h1 style={{
              fontSize: 22,
              fontWeight: 700,
              color: c.textPrimary,
              margin: '0 0 8px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}>
              <Palette size={24} color={c.primary} />
              إعدادات المظهر
            </h1>
            <p style={{ fontSize: 13, color: c.textMuted, margin: 0 }}>
              خصّص مظهر التطبيق حسب ذوقك
            </p>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* الثيم (داكن / فاتح) */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div style={{
          background: c.bgSecondary,
          borderRadius: 16,
          border: `1px solid ${c.border}`,
          padding: 20,
          marginBottom: 16,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 16,
          }}>
            {theme === 'dark' ? <Moon size={20} color={c.primary} /> : <Sun size={20} color="#f59e0b" />}
            <span style={{ fontSize: 15, fontWeight: 600, color: c.textPrimary }}>الوضع</span>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            {/* فاتح */}
            <button
              onClick={() => setTheme('light')}
              style={{
                flex: 1,
                padding: 16,
                borderRadius: 12,
                border: theme === 'light' ? `2px solid ${c.primary}` : `1px solid ${c.border}`,
                background: theme === 'light' ? c.light : c.bgTertiary,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                width: 50,
                height: 35,
                borderRadius: 8,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Sun size={18} color="#f59e0b" />
              </div>
              <span style={{
                fontSize: 13,
                fontWeight: 600,
                color: theme === 'light' ? c.primary : c.textSecondary,
              }}>فاتح</span>
              {theme === 'light' && <Check size={16} color={c.primary} />}
            </button>

            {/* داكن */}
            <button
              onClick={() => setTheme('dark')}
              style={{
                flex: 1,
                padding: 16,
                borderRadius: 12,
                border: theme === 'dark' ? `2px solid ${c.primary}` : `1px solid ${c.border}`,
                background: theme === 'dark' ? c.light : c.bgTertiary,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                width: 50,
                height: 35,
                borderRadius: 8,
                background: '#12121a',
                border: '1px solid #2a2a3a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Moon size={18} color="#6366f1" />
              </div>
              <span style={{
                fontSize: 13,
                fontWeight: 600,
                color: theme === 'dark' ? c.primary : c.textSecondary,
              }}>داكن</span>
              {theme === 'dark' && <Check size={16} color={c.primary} />}
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* الألوان (الهيدر والأزرار في نافذة واحدة) */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div style={{
          background: c.bgSecondary,
          borderRadius: 16,
          border: `1px solid ${c.border}`,
          overflow: 'hidden',
          marginBottom: 16,
        }}>
          {/* لون الهيدر */}
          <div style={{ padding: 20, borderBottom: `1px solid ${c.border}` }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 14,
            }}>
              <div style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: colors[headerColor]?.gradient,
              }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: c.textPrimary }}>لون الهيدر</span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: 8,
            }}>
              {Object.entries(colors).map(([key, color]) => (
                <button
                  key={key}
                  onClick={() => setHeaderColor(key)}
                  title={color.name}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    borderRadius: 8,
                    border: headerColor === key ? `2px solid #fff` : `1px solid ${c.border}`,
                    background: color.gradient,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    boxShadow: headerColor === key ? `0 0 12px ${color.primary}60` : 'none',
                    transform: headerColor === key ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  {headerColor === key && <Check size={14} color="#fff" />}
                </button>
              ))}
            </div>
          </div>

          {/* لون الأزرار */}
          <div style={{ padding: 20 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 14,
            }}>
              <Palette size={20} color={colors[buttonColor]?.primary} />
              <span style={{ fontSize: 14, fontWeight: 600, color: c.textPrimary }}>لون الأزرار</span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: 8,
            }}>
              {Object.entries(colors).map(([key, color]) => (
                <button
                  key={key}
                  onClick={() => setButtonColor(key)}
                  title={color.name}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    borderRadius: 8,
                    border: buttonColor === key ? `2px solid #fff` : `1px solid ${c.border}`,
                    background: color.gradient,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    boxShadow: buttonColor === key ? `0 0 12px ${color.primary}60` : 'none',
                    transform: buttonColor === key ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  {buttonColor === key && <Check size={14} color="#fff" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* نوع الخط */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div style={{
          background: c.bgSecondary,
          borderRadius: 16,
          border: `1px solid ${c.border}`,
          padding: 20,
          marginBottom: 16,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 16,
          }}>
            <Type size={20} color={c.primary} />
            <span style={{ fontSize: 15, fontWeight: 600, color: c.textPrimary }}>نوع الخط</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 8,
          }}>
            {Object.entries(fonts).map(([key, fontData]) => (
              <button
                key={key}
                onClick={() => setFont(key)}
                style={{
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: font === key ? `2px solid ${c.primary}` : `1px solid ${c.border}`,
                  background: font === key ? c.light : c.bgTertiary,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s',
                  fontFamily: fontData.family,
                }}
              >
                <span style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: font === key ? c.primary : c.textPrimary,
                }}>{fontData.name}</span>
                {font === key && <Check size={16} color={c.primary} />}
              </button>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* حجم الخط */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div style={{
          background: c.bgSecondary,
          borderRadius: 16,
          border: `1px solid ${c.border}`,
          padding: 20,
          marginBottom: 16,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 16,
          }}>
            <span style={{ fontSize: 20 }}>🔤</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: c.textPrimary }}>حجم الخط</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 8,
          }}>
            {Object.entries(fontSizes).map(([key, size]) => (
              <button
                key={key}
                onClick={() => setFontSize(key)}
                style={{
                  padding: '12px 8px',
                  borderRadius: 10,
                  border: fontSize === key ? `2px solid ${c.primary}` : `1px solid ${c.border}`,
                  background: fontSize === key ? c.light : c.bgTertiary,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.2s',
                }}
              >
                <span style={{
                  fontSize: 14 * size.scale,
                  fontWeight: 700,
                  color: fontSize === key ? c.primary : c.textSecondary,
                }}>أ</span>
                <span style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: fontSize === key ? c.primary : c.textMuted,
                }}>{size.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* تأثيرات الخلفية */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div style={{
          background: c.bgSecondary,
          borderRadius: 16,
          border: `1px solid ${c.border}`,
          padding: 20,
          marginBottom: 16,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 16,
          }}>
            <Sparkles size={20} color={c.primary} />
            <span style={{ fontSize: 15, fontWeight: 600, color: c.textPrimary }}>تأثيرات الخلفية</span>
            <span style={{ fontSize: 10, color: c.textMuted }}>(الوضع الداكن فقط)</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10,
          }}>
            {/* بدون تأثير */}
            <button
              onClick={() => setBgEffect('none')}
              style={{
                padding: 16,
                borderRadius: 12,
                border: bgEffect === 'none' ? `2px solid ${c.primary}` : `1px solid ${c.border}`,
                background: bgEffect === 'none' ? `${c.primary}20` : c.bgTertiary,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: c.bgPrimary,
                border: `1px solid ${c.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ fontSize: 18 }}>○</span>
              </div>
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                color: bgEffect === 'none' ? c.primary : c.textSecondary,
              }}>بدون</span>
            </button>

            {/* النمط الياباني */}
            <button
              onClick={() => setBgEffect('stars')}
              style={{
                padding: 16,
                borderRadius: 12,
                border: bgEffect === 'stars' ? `2px solid ${c.primary}` : `1px solid ${c.border}`,
                background: bgEffect === 'stars' ? `${c.primary}20` : c.bgTertiary,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <span style={{ fontSize: 18 }}>✨</span>
                <div style={{
                  position: 'absolute',
                  top: 5,
                  left: 8,
                  width: 2,
                  height: 2,
                  background: '#fff',
                  borderRadius: '50%',
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: 8,
                  right: 6,
                  width: 1.5,
                  height: 1.5,
                  background: '#fff',
                  borderRadius: '50%',
                }} />
              </div>
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                color: bgEffect === 'stars' ? c.primary : c.textSecondary,
              }}>ياباني</span>
            </button>

            {/* لاس فيغاس */}
            <button
              onClick={() => setBgEffect('vegas')}
              style={{
                padding: 16,
                borderRadius: 12,
                border: bgEffect === 'vegas' ? `2px solid ${c.primary}` : `1px solid ${c.border}`,
                background: bgEffect === 'vegas' ? `${c.primary}20` : c.bgTertiary,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'linear-gradient(180deg, #1a0a20 0%, #0a0a15 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <span style={{ fontSize: 18 }}>🎰</span>
                <div style={{
                  position: 'absolute',
                  top: 4,
                  left: 6,
                  width: 3,
                  height: 3,
                  background: '#ff00ff',
                  borderRadius: '50%',
                  boxShadow: '0 0 4px #ff00ff',
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: 6,
                  right: 5,
                  width: 3,
                  height: 3,
                  background: '#00ffff',
                  borderRadius: '50%',
                  boxShadow: '0 0 4px #00ffff',
                }} />
              </div>
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                color: bgEffect === 'vegas' ? c.primary : c.textSecondary,
              }}>فيغاس</span>
            </button>
          </div>

          {/* تحذير: يعمل فقط في الوضع الداكن */}
          {bgEffect !== 'none' && theme === 'light' && (
            <div style={{
              marginTop: 12,
              padding: '8px 12px',
              borderRadius: 8,
              background: '#f59e0b20',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={{ fontSize: 14 }}>⚠️</span>
              <span style={{ fontSize: 11, color: '#f59e0b' }}>
                تأثيرات الخلفية تعمل في الوضع الداكن فقط
              </span>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* معاينة */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div style={{
          background: c.bgSecondary,
          borderRadius: 16,
          border: `1px solid ${c.border}`,
          overflow: 'hidden',
          marginBottom: 16,
        }}>
          <div style={{
            padding: '12px 20px',
            borderBottom: `1px solid ${c.border}`,
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: c.textMuted }}>معاينة</span>
          </div>
          
          {/* الهيدر */}
          <div style={{
            height: 50,
            background: colors[headerColor]?.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
          }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>RKZ</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.2)' }} />
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.2)' }} />
            </div>
          </div>

          {/* المحتوى */}
          <div style={{ padding: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: c.textPrimary, margin: '0 0 8px 0' }}>
              عنوان تجريبي
            </h3>
            <p style={{ fontSize: 13, color: c.textSecondary, margin: '0 0 16px 0' }}>
              هذا نص تجريبي لمعاينة الخط واللون المختار
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{
                padding: '10px 20px',
                borderRadius: 8,
                border: 'none',
                background: colors[buttonColor]?.gradient,
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}>زر رئيسي</button>
              <button style={{
                padding: '10px 20px',
                borderRadius: 8,
                border: `1px solid ${c.border}`,
                background: c.bgTertiary,
                color: c.textPrimary,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}>زر ثانوي</button>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* زر الحفظ */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <button
          onClick={saveSettings}
          style={{
            width: '100%',
            padding: 16,
            borderRadius: 12,
            border: 'none',
            background: colors[buttonColor]?.gradient,
            color: '#fff',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Check size={20} />
          حفظ الإعدادات
        </button>

      </div>
    </div>
  );
}
