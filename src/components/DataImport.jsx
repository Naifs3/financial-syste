// src/components/DataImport.jsx
import React, { useState } from 'react';
import { 
  Upload, Copy, Check, X, FileSpreadsheet,
  Receipt, CheckSquare, FolderOpen, Wallet, Users, 
  Truck, Wrench, Boxes, Trash2, CheckCircle, AlertCircle,
  ArrowLeft, Download, Table, ClipboardList
} from 'lucide-react';

const DataImport = ({ 
  onImportExpenses, 
  onImportTasks, 
  onImportProjects, 
  onImportAccounts,
  onImportClients, 
  onImportSuppliers, 
  onImportMaterials, 
  onImportEquipment,
  darkMode, 
  theme 
}) => {
  const t = theme;
  
  const [step, setStep] = useState(1); // 1: اختيار القسم, 2: إدخال البيانات, 3: المعاينة
  const [selectedSection, setSelectedSection] = useState(null);
  const [pasteData, setPasteData] = useState('');
  const [parsedData, setParsedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // success أو error
  const [copied, setCopied] = useState(false);

  // تعريف الأقسام
  const sections = [
    {
      id: 'expenses',
      name: 'المصروفات',
      icon: Receipt,
      color: '#ef4444',
      description: 'استيراد فواتير ومصروفات',
      fields: [
        { key: 'name', label: 'اسم المصروف', required: true, example: 'إيجار المكتب' },
        { key: 'amount', label: 'المبلغ', required: true, type: 'number', example: '5000' },
        { key: 'dueDate', label: 'تاريخ الاستحقاق', required: true, example: '2024-01-15' },
        { key: 'status', label: 'الحالة', example: 'غير مدفوع' },
        { key: 'notes', label: 'ملاحظات', example: 'ملاحظة' },
      ],
      onImport: onImportExpenses,
    },
    {
      id: 'tasks',
      name: 'المهام',
      icon: CheckSquare,
      color: '#10b981',
      description: 'استيراد مهام العمل',
      fields: [
        { key: 'title', label: 'عنوان المهمة', required: true, example: 'مراجعة العقود' },
        { key: 'description', label: 'الوصف', example: 'وصف المهمة' },
        { key: 'priority', label: 'الأولوية', example: 'عالي' },
        { key: 'status', label: 'الحالة', example: 'قيد التنفيذ' },
        { key: 'dueDate', label: 'تاريخ الاستحقاق', example: '2024-01-20' },
      ],
      onImport: onImportTasks,
    },
    {
      id: 'projects',
      name: 'المشاريع',
      icon: FolderOpen,
      color: '#8b5cf6',
      description: 'استيراد بيانات المشاريع',
      fields: [
        { key: 'name', label: 'اسم المشروع', required: true, example: 'مشروع فيلا الرياض' },
        { key: 'client', label: 'العميل', example: 'أحمد محمد' },
        { key: 'budget', label: 'الميزانية', type: 'number', example: '500000' },
        { key: 'status', label: 'الحالة', example: 'قيد التنفيذ' },
        { key: 'startDate', label: 'تاريخ البداية', example: '2024-01-01' },
      ],
      onImport: onImportProjects,
    },
    {
      id: 'accounts',
      name: 'الحسابات',
      icon: Wallet,
      color: '#f59e0b',
      description: 'استيراد الحسابات البنكية',
      fields: [
        { key: 'name', label: 'اسم الحساب', required: true, example: 'حساب الراجحي' },
        { key: 'bankName', label: 'اسم البنك', example: 'مصرف الراجحي' },
        { key: 'accountNumber', label: 'رقم الحساب', example: '1234567890' },
        { key: 'balance', label: 'الرصيد', type: 'number', example: '50000' },
      ],
      onImport: onImportAccounts,
    },
    {
      id: 'clients',
      name: 'العملاء',
      icon: Users,
      color: '#3b82f6',
      description: 'استيراد بيانات العملاء',
      fields: [
        { key: 'name', label: 'اسم العميل', required: true, example: 'شركة البناء' },
        { key: 'phone', label: 'الهاتف', example: '0501234567' },
        { key: 'email', label: 'البريد', example: 'info@company.com' },
        { key: 'address', label: 'العنوان', example: 'الرياض' },
      ],
      onImport: onImportClients,
    },
    {
      id: 'suppliers',
      name: 'الموردين',
      icon: Truck,
      color: '#06b6d4',
      description: 'استيراد بيانات الموردين',
      fields: [
        { key: 'name', label: 'اسم المورد', required: true, example: 'مصنع الحديد' },
        { key: 'phone', label: 'الهاتف', example: '0551234567' },
        { key: 'email', label: 'البريد', example: 'supplier@mail.com' },
        { key: 'category', label: 'التصنيف', example: 'مواد بناء' },
      ],
      onImport: onImportSuppliers,
    },
    {
      id: 'materials',
      name: 'المواد',
      icon: Boxes,
      color: '#84cc16',
      description: 'استيراد المواد والمخزون',
      fields: [
        { key: 'name', label: 'اسم المادة', required: true, example: 'حديد تسليح' },
        { key: 'unit', label: 'الوحدة', example: 'طن' },
        { key: 'quantity', label: 'الكمية', type: 'number', example: '100' },
        { key: 'price', label: 'السعر', type: 'number', example: '3500' },
      ],
      onImport: onImportMaterials,
    },
    {
      id: 'equipment',
      name: 'المعدات',
      icon: Wrench,
      color: '#ec4899',
      description: 'استيراد بيانات المعدات',
      fields: [
        { key: 'name', label: 'اسم المعدة', required: true, example: 'رافعة شوكية' },
        { key: 'type', label: 'النوع', example: 'معدات ثقيلة' },
        { key: 'status', label: 'الحالة', example: 'متاح' },
        { key: 'dailyRate', label: 'الإيجار اليومي', type: 'number', example: '500' },
      ],
      onImport: onImportEquipment,
    },
  ];

  const currentSection = sections.find(s => s.id === selectedSection);

  // نسخ القالب
  const copyTemplate = () => {
    if (!currentSection) return;
    const headers = currentSection.fields.map(f => f.label).join('\t');
    const example = currentSection.fields.map(f => f.example || '').join('\t');
    navigator.clipboard.writeText(headers + '\n' + example);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // تحليل البيانات
  const parseData = () => {
    if (!pasteData.trim() || !currentSection) return;
    
    const lines = pasteData.trim().split('\n');
    const parsed = lines.map((line, index) => {
      const values = line.split('\t');
      const row = { _index: index, _valid: true };
      currentSection.fields.forEach((field, i) => {
        let value = values[i]?.trim() || '';
        if (field.type === 'number') {
          value = parseFloat(value) || 0;
        }
        row[field.key] = value;
        // تحقق من الحقول المطلوبة
        if (field.required && !value) {
          row._valid = false;
        }
      });
      return row;
    });
    
    setParsedData(parsed);
    setStep(3);
  };

  // حذف صف
  const removeRow = (index) => {
    setParsedData(parsedData.filter((_, i) => i !== index));
  };

  // استيراد البيانات
  const handleImport = async () => {
    if (!currentSection?.onImport || parsedData.length === 0) return;
    
    setLoading(true);
    try {
      const validData = parsedData.filter(row => row._valid);
      for (const row of validData) {
        const { _index, _valid, ...data } = row;
        await currentSection.onImport(data);
      }
      setResult({ type: 'success', count: validData.length });
      setTimeout(() => {
        resetAll();
      }, 2000);
    } catch (error) {
      console.error('Import error:', error);
      setResult({ type: 'error', message: 'حدث خطأ أثناء الاستيراد' });
    }
    setLoading(false);
  };

  // إعادة تعيين
  const resetAll = () => {
    setStep(1);
    setSelectedSection(null);
    setPasteData('');
    setParsedData([]);
    setResult(null);
  };

  // الرجوع للخلف
  const goBack = () => {
    if (step === 3) {
      setStep(2);
      setParsedData([]);
    } else if (step === 2) {
      setStep(1);
      setSelectedSection(null);
      setPasteData('');
    }
  };

  // ═══════════════ Styles ═══════════════
  const cardBg = t?.bg?.secondary || '#1e293b';
  const borderColor = t?.border?.primary || '#334155';
  const textPrimary = t?.text?.primary || '#f8fafc';
  const textMuted = t?.text?.muted || '#94a3b8';
  const bgPrimary = t?.bg?.primary || '#0f172a';
  const bgTertiary = t?.bg?.tertiary || '#334155';

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      
      {/* ═══════════════ Header ═══════════════ */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: 30 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {step > 1 && (
            <button
              onClick={goBack}
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                border: `1px solid ${borderColor}`,
                background: cardBg,
                color: textMuted,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Upload size={26} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: textPrimary, margin: 0 }}>
              استيراد البيانات
            </h1>
            <p style={{ fontSize: 14, color: textMuted, margin: 0 }}>
              {step === 1 && 'اختر القسم المراد استيراد البيانات إليه'}
              {step === 2 && `استيراد ${currentSection?.name}`}
              {step === 3 && `مراجعة ${parsedData.length} سجل`}
            </p>
          </div>
        </div>

        {/* Steps Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {[1, 2, 3].map(s => (
            <div
              key={s}
              style={{
                width: s === step ? 32 : 10,
                height: 10,
                borderRadius: 5,
                background: s <= step ? '#3b82f6' : bgTertiary,
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>
      </div>

      {/* ═══════════════ Result Message ═══════════════ */}
      {result && (
        <div style={{
          padding: 18,
          borderRadius: 14,
          background: result.type === 'success' ? '#10b98115' : '#ef444415',
          border: `1px solid ${result.type === 'success' ? '#10b98140' : '#ef444440'}`,
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          {result.type === 'success' ? (
            <CheckCircle size={24} color="#10b981" />
          ) : (
            <AlertCircle size={24} color="#ef4444" />
          )}
          <span style={{ 
            color: result.type === 'success' ? '#10b981' : '#ef4444', 
            fontWeight: 600,
            fontSize: 15
          }}>
            {result.type === 'success' 
              ? `تم استيراد ${result.count} سجل بنجاح!` 
              : result.message
            }
          </span>
        </div>
      )}

      {/* ═══════════════ Step 1: اختيار القسم ═══════════════ */}
      {step === 1 && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
          gap: 16 
        }}>
          {sections.map(section => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => {
                  setSelectedSection(section.id);
                  setStep(2);
                }}
                style={{
                  padding: 24,
                  borderRadius: 16,
                  border: `1px solid ${borderColor}`,
                  background: cardBg,
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = section.color;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = borderColor;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: `${section.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px'
                }}>
                  <Icon size={28} color={section.color} />
                </div>
                <h3 style={{ 
                  fontSize: 17, 
                  fontWeight: 600, 
                  color: textPrimary, 
                  margin: '0 0 6px' 
                }}>
                  {section.name}
                </h3>
                <p style={{ 
                  fontSize: 13, 
                  color: textMuted, 
                  margin: 0 
                }}>
                  {section.description}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* ═══════════════ Step 2: إدخال البيانات ═══════════════ */}
      {step === 2 && currentSection && (
        <div style={{
          background: cardBg,
          borderRadius: 20,
          border: `1px solid ${borderColor}`,
          overflow: 'hidden'
        }}>
          {/* Section Header */}
          <div style={{
            padding: '20px 24px',
            background: `${currentSection.color}10`,
            borderBottom: `1px solid ${borderColor}`,
            display: 'flex',
            alignItems: 'center',
            gap: 14
          }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: `${currentSection.color}25`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {React.createElement(currentSection.icon, { size: 24, color: currentSection.color })}
            </div>
            <div>
              <h2 style={{ fontSize: 19, fontWeight: 600, color: textPrimary, margin: 0 }}>
                استيراد {currentSection.name}
              </h2>
              <p style={{ fontSize: 13, color: textMuted, margin: 0 }}>
                {currentSection.fields.length} حقول
              </p>
            </div>
          </div>

          <div style={{ padding: 24 }}>
            {/* الحقول المطلوبة */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ 
                fontSize: 14, 
                fontWeight: 600, 
                color: textMuted, 
                margin: '0 0 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <Table size={16} />
                الحقول المطلوبة
              </h4>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 8 
              }}>
                {currentSection.fields.map(field => (
                  <span
                    key={field.key}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 500,
                      background: field.required ? `${currentSection.color}20` : bgTertiary,
                      color: field.required ? currentSection.color : textMuted,
                    }}
                  >
                    {field.label}
                    {field.required && ' *'}
                  </span>
                ))}
              </div>
            </div>

            {/* زر نسخ القالب */}
            <button
              onClick={copyTemplate}
              style={{
                width: '100%',
                padding: 16,
                borderRadius: 12,
                border: `2px dashed ${borderColor}`,
                background: 'transparent',
                color: textPrimary,
                cursor: 'pointer',
                fontSize: 15,
                fontWeight: 600,
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                marginBottom: 20,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = currentSection.color;
                e.currentTarget.style.background = `${currentSection.color}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = borderColor;
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {copied ? (
                <>
                  <Check size={20} color="#10b981" />
                  <span style={{ color: '#10b981' }}>تم نسخ القالب!</span>
                </>
              ) : (
                <>
                  <Copy size={20} />
                  انسخ القالب للإكسل
                </>
              )}
            </button>

            {/* منطقة اللصق */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8,
                fontSize: 14, 
                fontWeight: 600, 
                color: textMuted, 
                marginBottom: 10 
              }}>
                <ClipboardList size={16} />
                الصق البيانات من Excel
              </label>
              <textarea
                value={pasteData}
                onChange={(e) => setPasteData(e.target.value)}
                placeholder={`الصق البيانات هنا...\n\nمثال:\n${currentSection.fields.map(f => f.example || '-').join('\t')}`}
                style={{
                  width: '100%',
                  height: 180,
                  padding: 16,
                  borderRadius: 12,
                  border: `1px solid ${borderColor}`,
                  background: bgPrimary,
                  color: textPrimary,
                  fontSize: 14,
                  fontFamily: 'monospace',
                  resize: 'vertical',
                  outline: 'none',
                  boxSizing: 'border-box',
                  lineHeight: 1.6
                }}
              />
            </div>

            {/* زر المعاينة */}
            <button
              onClick={parseData}
              disabled={!pasteData.trim()}
              style={{
                width: '100%',
                padding: 16,
                borderRadius: 12,
                border: 'none',
                background: pasteData.trim() 
                  ? `linear-gradient(135deg, ${currentSection.color}, ${currentSection.color}dd)`
                  : bgTertiary,
                color: pasteData.trim() ? '#fff' : textMuted,
                cursor: pasteData.trim() ? 'pointer' : 'not-allowed',
                fontSize: 16,
                fontWeight: 600,
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10
              }}
            >
              <FileSpreadsheet size={20} />
              معاينة البيانات
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════ Step 3: المعاينة ═══════════════ */}
      {step === 3 && currentSection && (
        <div style={{
          background: cardBg,
          borderRadius: 20,
          border: `1px solid ${borderColor}`,
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '18px 24px',
            background: bgTertiary,
            borderBottom: `1px solid ${borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Table size={20} color={currentSection.color} />
              <span style={{ fontSize: 16, fontWeight: 600, color: textPrimary }}>
                معاينة {parsedData.length} سجل
              </span>
            </div>
            <span style={{ 
              padding: '6px 12px', 
              borderRadius: 8, 
              background: `${currentSection.color}20`,
              color: currentSection.color,
              fontSize: 13,
              fontWeight: 600
            }}>
              {currentSection.name}
            </span>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto', maxHeight: 400 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
              <thead>
                <tr style={{ background: bgPrimary }}>
                  <th style={{ 
                    padding: '14px 16px', 
                    textAlign: 'right',
                    color: textMuted,
                    fontSize: 13,
                    fontWeight: 600,
                    position: 'sticky',
                    top: 0,
                    background: bgPrimary
                  }}>
                    #
                  </th>
                  {currentSection.fields.map(field => (
                    <th 
                      key={field.key}
                      style={{ 
                        padding: '14px 16px', 
                        textAlign: 'right',
                        color: textMuted,
                        fontSize: 13,
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        position: 'sticky',
                        top: 0,
                        background: bgPrimary
                      }}
                    >
                      {field.label}
                    </th>
                  ))}
                  <th style={{ 
                    padding: '14px 16px',
                    width: 60,
                    position: 'sticky',
                    top: 0,
                    background: bgPrimary
                  }}></th>
                </tr>
              </thead>
              <tbody>
                {parsedData.map((row, index) => (
                  <tr 
                    key={index}
                    style={{ 
                      background: !row._valid ? '#ef444410' : (index % 2 === 0 ? 'transparent' : `${bgTertiary}30`),
                      borderRight: !row._valid ? '3px solid #ef4444' : 'none'
                    }}
                  >
                    <td style={{ 
                      padding: '12px 16px',
                      color: textMuted,
                      fontSize: 13
                    }}>
                      {index + 1}
                    </td>
                    {currentSection.fields.map(field => (
                      <td 
                        key={field.key}
                        style={{ 
                          padding: '12px 16px',
                          color: (!row[field.key] && field.required) ? '#ef4444' : textPrimary,
                          fontSize: 13
                        }}
                      >
                        {row[field.key] || (field.required ? '⚠️ مطلوب' : '-')}
                      </td>
                    ))}
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => removeRow(index)}
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 8,
                          border: 'none',
                          background: '#ef444420',
                          color: '#ef4444',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div style={{
            padding: '18px 24px',
            borderTop: `1px solid ${borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: bgTertiary
          }}>
            <div style={{ color: textMuted, fontSize: 14 }}>
              <span style={{ color: '#10b981', fontWeight: 600 }}>
                {parsedData.filter(r => r._valid).length}
              </span>
              {' '}سجل صالح من{' '}
              <span style={{ fontWeight: 600 }}>{parsedData.length}</span>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={goBack}
                style={{
                  padding: '12px 24px',
                  borderRadius: 10,
                  border: `1px solid ${borderColor}`,
                  background: 'transparent',
                  color: textMuted,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: 'inherit'
                }}
              >
                رجوع
              </button>
              <button
                onClick={handleImport}
                disabled={loading || parsedData.filter(r => r._valid).length === 0}
                style={{
                  padding: '12px 28px',
                  borderRadius: 10,
                  border: 'none',
                  background: loading ? bgTertiary : currentSection.color,
                  color: '#fff',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                {loading ? (
                  'جاري الاستيراد...'
                ) : (
                  <>
                    <CheckCircle size={18} />
                    استيراد {parsedData.filter(r => r._valid).length} سجل
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataImport;
