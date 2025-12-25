// src/components/Accounts.jsx
import React, { useState } from 'react';
import { 
  Shield, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Copy, 
  ExternalLink, 
  Tag,
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  Key,
  Link
} from 'lucide-react';
import { decrypt, calcDaysRemaining, getStatusColorByDays, copyToClipboard } from '../utils/helpers';

const Accounts = ({ accounts, categories, onAdd, onEdit, onDelete, darkMode, theme }) => {
  const t = theme;
  const colorKeys = t.colorKeys || Object.keys(t.colors);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showPasswords, setShowPasswords] = useState({});
  const [copiedField, setCopiedField] = useState(null);

  const filteredAccounts = accounts.filter(account => {
    const matchSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory === 'all' || account.categoryId === filterCategory;
    return matchSearch && matchCategory;
  });

  const totalAccounts = accounts.length;
  const expiredAccounts = accounts.filter(a => {
    if (!a.expiryDate) return false;
    const days = calcDaysRemaining(a.expiryDate);
    return days !== null && days < 0;
  }).length;

  const expiringSoon = accounts.filter(a => {
    if (!a.expiryDate) return false;
    const days = calcDaysRemaining(a.expiryDate);
    return days !== null && days >= 0 && days <= 30;
  }).length;

  // البطاقات الإحصائية
  const statCards = [
    { label: 'إجمالي الحسابات', value: totalAccounts, colorKey: colorKeys[0], icon: Shield },
    { label: 'منتهية الصلاحية', value: expiredAccounts, colorKey: colorKeys[1], icon: AlertTriangle },
    { label: 'تنتهي قريباً', value: expiringSoon, colorKey: colorKeys[2], icon: Clock },
  ];

  const handleCopy = async (text, fieldId) => {
    await copyToClipboard(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const togglePasswordVisibility = (accountId) => {
    setShowPasswords(prev => ({ ...prev, [accountId]: !prev[accountId] }));
  };

  // دالة للحصول على لون الحالة
  const getExpiryStyle = (days) => {
    if (days === null) return null;
    if (days < 0) return { bg: t.status.danger.bg, text: t.status.danger.text, border: t.status.danger.border, label: 'منتهي' };
    if (days <= 7) return { bg: t.status.danger.bg, text: t.status.danger.text, border: t.status.danger.border, label: `${days} يوم` };
    if (days <= 30) return { bg: t.status.warning.bg, text: t.status.warning.text, border: t.status.warning.border, label: `${days} يوم` };
    return { bg: t.status.success.bg, text: t.status.success.text, border: t.status.success.border, label: `${days} يوم` };
  };

  return (
    <div style={{ padding: 16, paddingBottom: 80 }}>
      
      {/* ═══════════════ العنوان والأزرار ═══════════════ */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 24,
      }}>
        <div>
          <h2 style={{ 
            fontSize: 24, 
            fontWeight: 700, 
            color: t.text.primary,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            margin: 0,
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: t.radius.lg,
              background: t.colors[colorKeys[3]]?.gradient || t.button.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: darkMode ? t.colors[colorKeys[3]]?.glow : 'none',
            }}>
              <Shield size={22} color="#fff" />
            </div>
            الحسابات
          </h2>
          <p style={{ fontSize: 14, color: t.text.muted, marginTop: 6, marginRight: 50 }}>
            إدارة الحسابات المشفرة
          </p>
        </div>
        
        <button
          onClick={() => {}}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            borderRadius: t.radius.lg,
            border: 'none',
            background: t.button.gradient,
            color: '#fff',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: 'inherit',
            boxShadow: t.button.glow,
            transition: 'all 0.2s',
          }}
        >
          <Plus size={18} />
          إضافة حساب
        </button>
      </div>

      {/* ═══════════════ البطاقات الإحصائية ═══════════════ */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 16,
        marginBottom: 24,
      }}>
        {statCards.map((card, index) => {
          const color = t.colors[card.colorKey] || t.colors[colorKeys[0]];
          const Icon = card.icon;
          return (
            <div
              key={index}
              style={{
                background: t.bg.secondary,
                borderRadius: t.radius.xl,
                border: `1px solid ${color.main}30`,
                padding: 20,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute',
                top: -20,
                left: -20,
                width: 80,
                height: 80,
                background: `radial-gradient(circle, ${color.main}20 0%, transparent 70%)`,
                borderRadius: '50%',
              }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <p style={{ fontSize: 13, color: t.text.muted, margin: 0 }}>{card.label}</p>
                <Icon size={18} color={color.main} />
              </div>
              <p style={{ 
                fontSize: 28, 
                fontWeight: 700, 
                color: color.main,
                margin: 0,
                textShadow: darkMode ? `0 0 20px ${color.main}40` : 'none',
              }}>
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* ═══════════════ البحث والفلترة ═══════════════ */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
      }}>
        <div style={{ flex: '1 1 250px', position: 'relative' }}>
          <Search 
            size={18} 
            style={{ 
              position: 'absolute', 
              right: 14, 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: t.text.muted,
            }} 
          />
          <input
            type="text"
            placeholder="بحث في الحسابات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 44px 12px 16px',
              borderRadius: t.radius.lg,
              border: `1px solid ${t.border.primary}`,
              background: t.bg.tertiary,
              color: t.text.primary,
              fontSize: 14,
              fontFamily: 'inherit',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
        
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{
            padding: '12px 16px',
            borderRadius: t.radius.lg,
            border: `1px solid ${t.border.primary}`,
            background: t.bg.tertiary,
            color: t.text.primary,
            fontSize: 14,
            fontFamily: 'inherit',
            cursor: 'pointer',
            minWidth: 130,
          }}
        >
          <option value="all">كل الفئات</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* ═══════════════ قائمة الحسابات ═══════════════ */}
      {filteredAccounts.length === 0 ? (
        <div style={{
          background: t.bg.secondary,
          borderRadius: t.radius['2xl'],
          border: `1px solid ${t.border.primary}`,
          padding: 60,
          textAlign: 'center',
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: t.radius.xl,
            background: `${t.button.primary}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <Shield size={40} color={t.text.muted} />
          </div>
          <p style={{ fontSize: 18, fontWeight: 700, color: t.text.primary, marginBottom: 8 }}>
            لا توجد حسابات
          </p>
          <p style={{ fontSize: 14, color: t.text.muted }}>
            ابدأ بإضافة أول حساب
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: 16,
        }}>
          {filteredAccounts.map((account) => {
            const category = categories.find(c => c.id === account.categoryId);
            const days = account.expiryDate ? calcDaysRemaining(account.expiryDate) : null;
            const expiryStyle = getExpiryStyle(days);
            const showPassword = showPasswords[account.id];
            const categoryColor = t.colors[colorKeys[2]] || t.colors[colorKeys[0]];
            
            return (
              <div
                key={account.id}
                style={{
                  background: t.bg.secondary,
                  borderRadius: t.radius.xl,
                  border: `1px solid ${t.border.primary}`,
                  padding: 20,
                  transition: 'all 0.3s ease',
                }}
              >
                {/* الهيدر */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  justifyContent: 'space-between',
                  marginBottom: 16,
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontSize: 18, 
                      fontWeight: 700, 
                      color: t.text.primary,
                      margin: '0 0 10px 0',
                    }}>
                      {account.name}
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {/* شارة الفئة */}
                      {category && (
                        <span style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: '4px 10px',
                          borderRadius: t.radius.md,
                          background: `${categoryColor.main}20`,
                          color: categoryColor.main,
                          border: `1px solid ${categoryColor.main}30`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}>
                          <Tag size={10} />
                          {category.name}
                        </span>
                      )}
                      {/* الرقم المرجعي */}
                      {account.refNumber && (
                        <span style={{ fontSize: 11, color: t.text.muted }}>
                          #{account.refNumber}
                        </span>
                      )}
                      {/* شارة الصلاحية */}
                      {expiryStyle && (
                        <span style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: '4px 10px',
                          borderRadius: t.radius.md,
                          background: expiryStyle.bg,
                          color: expiryStyle.text,
                          border: `1px solid ${expiryStyle.border}`,
                        }}>
                          {expiryStyle.label}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* أزرار التحكم */}
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => onEdit(account)}
                      title="تعديل"
                      style={{
                        padding: 8,
                        borderRadius: t.radius.md,
                        border: 'none',
                        background: t.bg.tertiary,
                        color: t.text.primary,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(account.id)}
                      title="حذف"
                      style={{
                        padding: 8,
                        borderRadius: t.radius.md,
                        border: 'none',
                        background: t.status.danger.bg,
                        color: t.status.danger.text,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* بيانات الحساب */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  
                  {/* اسم المستخدم */}
                  <div style={{
                    padding: 14,
                    background: t.bg.tertiary,
                    borderRadius: t.radius.lg,
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <User size={14} color={t.text.muted} />
                        <span style={{ fontSize: 11, color: t.text.muted }}>اسم المستخدم</span>
                      </div>
                      <button
                        onClick={() => handleCopy(decrypt(account.username), `${account.id}-user`)}
                        title="نسخ"
                        style={{
                          padding: 6,
                          borderRadius: t.radius.sm,
                          border: 'none',
                          background: copiedField === `${account.id}-user` ? t.status.success.bg : 'transparent',
                          color: copiedField === `${account.id}-user` ? t.status.success.text : t.text.muted,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                        }}
                      >
                        {copiedField === `${account.id}-user` ? <CheckCircle size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                    <p style={{ 
                      fontSize: 14, 
                      fontFamily: 'monospace',
                      color: t.text.primary,
                      margin: 0,
                    }}>
                      {decrypt(account.username)}
                    </p>
                  </div>

                  {/* كلمة المرور */}
                  <div style={{
                    padding: 14,
                    background: t.bg.tertiary,
                    borderRadius: t.radius.lg,
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Key size={14} color={t.text.muted} />
                        <span style={{ fontSize: 11, color: t.text.muted }}>كلمة المرور</span>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          onClick={() => togglePasswordVisibility(account.id)}
                          title={showPassword ? 'إخفاء' : 'إظهار'}
                          style={{
                            padding: 6,
                            borderRadius: t.radius.sm,
                            border: 'none',
                            background: 'transparent',
                            color: t.text.muted,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                          }}
                        >
                          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button
                          onClick={() => handleCopy(decrypt(account.password), `${account.id}-pass`)}
                          title="نسخ"
                          style={{
                            padding: 6,
                            borderRadius: t.radius.sm,
                            border: 'none',
                            background: copiedField === `${account.id}-pass` ? t.status.success.bg : 'transparent',
                            color: copiedField === `${account.id}-pass` ? t.status.success.text : t.text.muted,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                          }}
                        >
                          {copiedField === `${account.id}-pass` ? <CheckCircle size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                    <p style={{ 
                      fontSize: 14, 
                      fontFamily: 'monospace',
                      color: t.text.primary,
                      margin: 0,
                      letterSpacing: showPassword ? 'normal' : '2px',
                    }}>
                      {showPassword ? decrypt(account.password) : '••••••••••••'}
                    </p>
                  </div>

                  {/* الرابط */}
                  {account.url && (
                    <div style={{
                      padding: 14,
                      background: t.bg.tertiary,
                      borderRadius: t.radius.lg,
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        marginBottom: 8,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Link size={14} color={t.text.muted} />
                          <span style={{ fontSize: 11, color: t.text.muted }}>الرابط</span>
                        </div>
                        <a
                          href={account.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="فتح الرابط"
                          style={{
                            padding: 6,
                            borderRadius: t.radius.sm,
                            background: `${t.button.primary}15`,
                            color: t.button.primary,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                          }}
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                      <p style={{ 
                        fontSize: 13, 
                        color: t.text.primary,
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {account.url}
                      </p>
                    </div>
                  )}

                  {/* ملاحظات */}
                  {account.notes && (
                    <div style={{
                      padding: 12,
                      background: t.bg.tertiary,
                      borderRadius: t.radius.md,
                      fontSize: 12,
                      color: t.text.muted,
                      lineHeight: 1.6,
                    }}>
                      {account.notes}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Accounts;
