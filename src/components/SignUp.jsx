// src/components/SignUp.jsx
import React, { useState } from 'react';
import { UserPlus, Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const SignUp = ({ onBack, onSuccess, darkMode = true, theme }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // استخدام ألوان القالب أو الافتراضية
  const c = {
    bg: theme?.bg?.primary || (darkMode ? '#0a0a0f' : '#f8fafc'),
    card: theme?.bg?.secondary || (darkMode ? '#101018' : '#ffffff'),
    cardAlt: theme?.bg?.tertiary || (darkMode ? '#1a1a28' : '#f1f5f9'),
    border: theme?.border?.primary || (darkMode ? '#252538' : '#e2e8f0'),
    text: theme?.text?.primary || (darkMode ? '#f0f0f8' : '#1e293b'),
    secondary: theme?.text?.secondary || (darkMode ? '#b0b0c0' : '#475569'),
    muted: theme?.text?.muted || (darkMode ? '#707088' : '#94a3b8'),
    accent: theme?.button?.primary || '#00d4ff',
    accentGlow: theme?.button?.glow || '0 0 20px #00d4ff40',
    success: theme?.status?.success?.text || '#4ade80',
    successGradient: 'linear-gradient(135deg, #16a34a, #22c55e)',
    successGlow: '0 0 20px #22c55e40',
    danger: theme?.status?.danger?.text || '#f87171',
    dangerBg: theme?.status?.danger?.bg || '#f8717115',
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('كلمة المرور غير متطابقة');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'users', uid), {
        username: formData.username,
        email: formData.email,
        role: 'user',
        active: false,
        approved: false,
        createdAt: new Date().toISOString()
      });

      onSuccess();

    } catch (error) {
      console.error('Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('البريد الإلكتروني مستخدم بالفعل');
      } else if (error.code === 'auth/invalid-email') {
        setError('البريد الإلكتروني غير صحيح');
      } else if (error.code === 'auth/weak-password') {
        setError('كلمة المرور ضعيفة جداً');
      } else {
        setError('حدث خطأ في إنشاء الحساب');
      }
      setLoading(false);
    }
  };

  // الأنماط المشتركة
  const inputStyle = {
    width: '100%',
    padding: '14px 44px 14px 44px',
    background: c.cardAlt,
    border: `1px solid ${c.border}`,
    borderRadius: 12,
    color: c.text,
    fontSize: 14,
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'all 0.2s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 13,
    fontWeight: 500,
    color: c.secondary,
    marginBottom: 8,
  };

  const iconWrapperStyle = {
    position: 'absolute',
    right: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    color: c.muted,
    display: 'flex',
  };

  const eyeButtonStyle = {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: c.muted,
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    transition: 'color 0.2s',
  };

  return (
    <div 
      dir="rtl" 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${c.bg} 0%, ${c.card} 50%, ${c.bg} 100%)`,
        padding: 16,
        fontFamily: 'inherit',
      }}
    >
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ width: '100%', maxWidth: 420 }}>
        <div 
          style={{
            background: `${c.card}ee`,
            backdropFilter: 'blur(12px)',
            borderRadius: 24,
            padding: 32,
            border: `1px solid ${c.border}`,
            boxShadow: darkMode ? `0 25px 50px -12px rgba(0,0,0,0.5), 0 0 40px ${c.success}10` : '0 25px 50px -12px rgba(0,0,0,0.1)',
          }}
        >
          {/* الشعار والعنوان */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                background: c.successGradient,
                borderRadius: 20,
                marginBottom: 16,
                boxShadow: darkMode ? c.successGlow : 'none',
              }}
            >
              <UserPlus size={40} color="#fff" />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: c.text, margin: '0 0 8px' }}>
              إنشاء حساب جديد
            </h1>
            <p style={{ fontSize: 14, color: c.muted, margin: 0 }}>
              سيتم مراجعة طلبك من قبل المدير
            </p>
          </div>

          {/* رسالة الخطأ */}
          {error && (
            <div 
              style={{
                marginBottom: 20,
                padding: 16,
                background: c.dangerBg,
                border: `1px solid ${c.danger}30`,
                borderRadius: 12,
              }}
            >
              <p style={{ color: c.danger, fontSize: 14, textAlign: 'center', margin: 0 }}>
                {error}
              </p>
            </div>
          )}

          {/* النموذج */}
          <form onSubmit={handleSubmit}>
            
            {/* اسم المستخدم */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>اسم المستخدم</label>
              <div style={{ position: 'relative' }}>
                <div style={iconWrapperStyle}>
                  <User size={20} />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="أدخل اسم المستخدم"
                  style={{ ...inputStyle, paddingLeft: 16 }}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* البريد الإلكتروني */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>البريد الإلكتروني</label>
              <div style={{ position: 'relative' }}>
                <div style={iconWrapperStyle}>
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="أدخل البريد الإلكتروني"
                  style={{ ...inputStyle, paddingLeft: 16 }}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* كلمة المرور */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>كلمة المرور</label>
              <div style={{ position: 'relative' }}>
                <div style={iconWrapperStyle}>
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="أدخل كلمة المرور"
                  style={inputStyle}
                  required
                  disabled={loading}
                  minLength={6}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  style={eyeButtonStyle}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* تأكيد كلمة المرور */}
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>تأكيد كلمة المرور</label>
              <div style={{ position: 'relative' }}>
                <div style={iconWrapperStyle}>
                  <Lock size={20} />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="أعد إدخال كلمة المرور"
                  style={inputStyle}
                  required
                  disabled={loading}
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  style={eyeButtonStyle}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* زر إنشاء الحساب */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: 16,
                background: c.successGradient,
                border: 'none',
                borderRadius: 14,
                color: '#fff',
                fontSize: 16,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                fontFamily: 'inherit',
                boxShadow: darkMode ? c.successGlow : 'none',
                transition: 'all 0.2s',
              }}
            >
              {loading ? (
                <>
                  <div 
                    style={{
                      width: 20,
                      height: 20,
                      border: '2px solid #fff',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                  جاري إنشاء الحساب...
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  إنشاء حساب
                </>
              )}
            </button>
          </form>

          {/* زر العودة */}
          <div 
            style={{
              marginTop: 24,
              paddingTop: 24,
              borderTop: `1px solid ${c.border}`,
            }}
          >
            <button
              onClick={onBack}
              disabled={loading}
              style={{
                width: '100%',
                padding: 14,
                background: c.cardAlt,
                border: `1px solid ${c.border}`,
                borderRadius: 14,
                color: c.text,
                fontSize: 15,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
            >
              <ArrowRight size={20} />
              العودة لتسجيل الدخول
            </button>
          </div>

          {/* التذييل */}
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: c.muted, margin: 0 }}>
              نظام الإدارة المالية v7.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
