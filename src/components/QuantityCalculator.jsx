import React, { useState, useRef } from 'react';
import { Calculator, FileText, Printer, Upload, Plus, Trash2, Image, Move, X, GripVertical } from 'lucide-react';

const QuantityCalculatorPro = () => {
  const [mainTab, setMainTab] = useState('report');
  const darkMode = true;
  const reportRef = useRef(null);
  
  const c = {
    bg: darkMode ? '#0a0a0f' : '#f8fafc',
    card: darkMode ? '#101018' : '#ffffff',
    cardAlt: darkMode ? '#1a1a28' : '#f1f5f9',
    border: darkMode ? '#252538' : '#e2e8f0',
    text: darkMode ? '#f0f0f8' : '#1e293b',
    muted: darkMode ? '#707088' : '#64748b',
    accent: '#00d4ff',
    accentGradient: 'linear-gradient(135deg, #0099bb, #00d4ff)',
    success: '#4ade80',
  };

  // الصور مع إمكانية التحرير الكامل
  const [images, setImages] = useState({
    logo: { src: null, width: 80, height: 60 },
    vision2030: { src: null, width: 70, height: 50 },
    stamp: { src: null, width: 60, height: 60 },
    signature: { src: null, width: 100, height: 50 },
  });

  // بيانات التقرير - كل شيء قابل للتحرير
  const [reportData, setReportData] = useState({
    companyName: 'ركائز الأولى',
    companySubtitle: 'للتعمير',
    headerTitle: 'تقدير تكلفة مبدئي',
    quoteNumber: '22224100',
    quoteDate: 'Monday, 29/12/2025',
    contactPhone: '+96653 244 5054',
    contactLabel: 'تليفون المعني (معتم العرض)',
    quoteNumberLabel: 'رقم العرض',
    dateLabel: 'التاريخ',
    
    introTitle: 'المقدمة',
    introText: 'بمعادلة توازن الجودة متميزون في مجال المقاولات و نوفر لعملائنا قيمة تحتوي على أعلى الأضافات المعلومية للانتاج المشروع الخاص بك وتكلفة المقاولة لذلك',
    
    clientDataTitle: 'بيانات العميل:',
    clientNameLabel: 'الأسم:',
    clientName: 'محب لبيتي',
    clientPhoneLabel: 'الهاتف:',
    clientPhone: '0533043030',
    clientLocationLabel: 'الموقع:',
    clientLocation: 'حي الحمدانية',
    
    projectTitle: 'مشروع اعمال داخلية - خارجية فيلا',
    
    sideTotalLabel: 'ريال',
    sideTotal: '74,590.38',
    
    subtotalLabel: 'المبلغ',
    subtotal: '74,590.38',
    discountLabel: 'مصروفات أخرى',
    discount: '',
    vatLabel: 'ضريبة القيمة المضافة',
    vatAmount: '11,188.56',
    grandTotalLabel: 'الإجمالي',
    grandTotal: '85,778.94',
    currency: 'ريال',
    
    noteTitle: '📌 ملاحظة توضيحية:',
    noteText: 'يرجى ملاحظة أن الأسعار المقدم محسوبة بالمواصفات والاحترافيه في هذه الميزانية فقط ولا يشمل أي أعمال أخرى',
    
    termsTitle: '📋 الشروط والأحكام:',
    terms: [
      'الأسعار المقدمة في هذا العرض تقديرية وتشمل الأعمال المحددة فقط',
      'يسري العرض لمدة 15 يوماً من تاريخ تقديمه',
      'يبدأ العمل فوراً غير مرتبط بما تم ترسيته منذ تحويل دفعة مقدمة',
      'قد تتغير الأسعار لظروف طارئة بنسبة لا تتجاوز 10%',
    ],
    
    bankTitle: '🏦 بيانات التحويل',
    bankNameLabel: 'البنك:',
    bankName: 'الراجحي',
    accountLabel: 'رقم الحساب:',
    accountNumber: '2B200001009080891660',
    ibanLabel: 'رقم الايبان:',
    iban: 'SA 26 8000 0282 6080 1089 1660',
    
    footerEmail: 'Rkaz3600@Gmail.com',
  });

  // بنود التقرير
  const [reportItems, setReportItems] = useState([
    { id: 'AC-2420', title: 'أعمال البلاط', desc: 'تشمل الخدمة: إزالة بلاط تكسير كبير سيور حاوية والنقل -380م و تأسيس تركيب بلاط مقاسات أكبر من 1م', area: '760.0', areaLabel: 'مجموع الأمتار', price: '22,956.47', priceLabel: 'ريال' },
    { id: 'AC-2422', title: 'دهانات الحوائط', desc: 'تشمل الخدمة: دهان جدران عدة طبقات سيور مواد تنظيف وصنفرة الأسطح ومعالجة الشروخ الدقيقة', area: '1,800.0', areaLabel: 'مجموع الأمتار', price: '19,023.44', priceLabel: 'ريال' },
    { id: 'AC-2424', title: 'دهانات جبسمبورد', desc: 'تشمل الخدمة: دهان جبسمبورد سيور مواد 350م', area: '350.0', areaLabel: 'مجموع الأمتار', price: '6,345.97', priceLabel: 'ريال' },
    { id: 'AC-2426', title: 'المجبس', desc: 'تشمل الخدمة: تركيب جبسمبورد ZB0 وطبقة الجبس القديم سيور حاوية', area: '460.0', areaLabel: 'مجموع الأمتار', price: '17,027.34', priceLabel: 'ريال' },
    { id: 'AC-2427', title: 'العزل', desc: 'تشمل الخدمة: لياسة بالقسم وترويب مع تجهيز السطح', area: '', areaLabel: '', price: '2,043.85', priceLabel: 'ريال' },
    { id: 'AC-2428', title: 'تحميل النظام', desc: 'تشمل الخدمة: أعادة اختبار السباكي المعلق و نقل إلى المستودعات', area: '', areaLabel: '', price: '7,193.31', priceLabel: 'ريال' },
  ]);

  const [freeItems, setFreeItems] = useState([
    { id: 'AC-2425', title: 'الاستشارات و المتابعات في التصميم الداخلي', desc: 'تشمل الخدمة: تقييم الاحتياجات والمقترحات المتعلقة بتصميم جوانب المساحة', price: 'مجاناً' },
    { id: 'AC-2429', title: 'الإشراف والمتابعة', desc: 'تشمل الخدمة: متابعة تنفيذ الأعمال في الموقع', price: 'مجاناً' },
  ]);

  // إدارة التحرير
  const [selectedElement, setSelectedElement] = useState(null);
  const [imageEditModal, setImageEditModal] = useState(null);

  const handlePrint = () => window.print();

  // رفع صورة
  const handleImageUpload = (key, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImages(prev => ({
          ...prev,
          [key]: { ...prev[key], src: ev.target.result }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // تغيير حجم الصورة
  const updateImageSize = (key, dimension, value) => {
    setImages(prev => ({
      ...prev,
      [key]: { ...prev[key], [dimension]: parseInt(value) || 50 }
    }));
  };

  // حذف صورة
  const removeImage = (key) => {
    setImages(prev => ({
      ...prev,
      [key]: { ...prev[key], src: null }
    }));
    setImageEditModal(null);
  };

  // تحديث بند
  const updateReportItem = (index, field, value) => {
    const newItems = [...reportItems];
    newItems[index][field] = value;
    setReportItems(newItems);
  };

  const updateFreeItem = (index, field, value) => {
    const newItems = [...freeItems];
    newItems[index][field] = value;
    setFreeItems(newItems);
  };

  const addNewItem = () => {
    setReportItems([...reportItems, {
      id: `AC-${2430 + reportItems.length}`,
      title: 'بند جديد',
      desc: 'تشمل الخدمة: وصف البند هنا',
      area: '0',
      areaLabel: 'مجموع الأمتار',
      price: '0',
      priceLabel: 'ريال'
    }]);
  };

  const addNewFreeItem = () => {
    setFreeItems([...freeItems, {
      id: `AC-${2440 + freeItems.length}`,
      title: 'خدمة مجانية جديدة',
      desc: 'تشمل الخدمة: وصف الخدمة',
      price: 'مجاناً'
    }]);
  };

  const deleteItem = (index) => setReportItems(reportItems.filter((_, i) => i !== index));
  const deleteFreeItem = (index) => setFreeItems(freeItems.filter((_, i) => i !== index));

  const updateTerm = (index, value) => {
    const newTerms = [...reportData.terms];
    newTerms[index] = value;
    setReportData({ ...reportData, terms: newTerms });
  };

  const addNewTerm = () => {
    setReportData({ ...reportData, terms: [...reportData.terms, 'شرط جديد'] });
  };

  const deleteTerm = (index) => {
    setReportData({ ...reportData, terms: reportData.terms.filter((_, i) => i !== index) });
  };

  const cardStyle = {
    background: c.card, borderRadius: 16,
    border: `1px solid ${c.border}`, padding: 20, marginBottom: 16
  };

  const btnStyle = (active) => ({
    padding: '12px 20px', borderRadius: 12, border: 'none',
    background: active ? c.accentGradient : c.cardAlt,
    color: active ? '#fff' : c.muted, fontSize: 14, fontWeight: 600,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
  });

  // مكون الصورة القابلة للتحرير
  const EditableImage = ({ imageKey, placeholder, style = {} }) => {
    const inputRef = useRef(null);
    const img = images[imageKey];
    
    return (
      <div style={{ position: 'relative', display: 'inline-block', ...style }}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(imageKey, e)}
          ref={inputRef}
          style={{ display: 'none' }}
        />
        {img.src ? (
          <div 
            style={{ position: 'relative', cursor: 'pointer' }}
            onClick={() => setImageEditModal(imageKey)}
          >
            <img 
              src={img.src} 
              alt={placeholder}
              style={{ 
                width: img.width, 
                height: img.height, 
                objectFit: 'contain',
                border: selectedElement === imageKey ? '2px solid #0099bb' : '2px solid transparent',
                borderRadius: 4
              }} 
            />
            <div className="no-print" style={{
              position: 'absolute', top: -8, right: -8,
              background: '#0099bb', color: '#fff', borderRadius: '50%',
              width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, cursor: 'pointer'
            }}>✎</div>
          </div>
        ) : (
          <div
            onClick={() => inputRef.current?.click()}
            style={{
              width: img.width,
              height: img.height,
              background: '#f5f5f5',
              border: '2px dashed #ccc',
              borderRadius: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 10,
              color: '#999',
              gap: 4
            }}
          >
            <Image size={16} />
            {placeholder}
          </div>
        )}
      </div>
    );
  };

  // مكون النص القابل للتحرير (مثل الوورد)
  const EditableText = ({ value, onChange, style = {}, multiline = false, placeholder = 'انقر للكتابة...' }) => {
    const [isFocused, setIsFocused] = useState(false);
    
    const baseStyle = {
      ...style,
      border: 'none',
      borderBottom: isFocused ? '2px solid #0099bb' : '1px solid transparent',
      background: isFocused ? '#fffef0' : 'transparent',
      outline: 'none',
      fontFamily: 'inherit',
      transition: 'all 0.2s',
      padding: '2px 4px',
      margin: '-2px -4px',
      borderRadius: 2,
      width: style.width || 'auto',
      minWidth: 50,
    };

    if (multiline) {
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          style={{
            ...baseStyle,
            resize: 'both',
            minHeight: 40,
            width: '100%',
          }}
        />
      );
    }
    
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        style={baseStyle}
      />
    );
  };

  return (
    <div dir="rtl" style={{ color: c.text, padding: 16, background: c.bg, minHeight: '100vh' }}>
      <style>{`
        input, textarea { font-family: inherit; }
        input:focus, textarea:focus { background: #fffef0 !important; }
        .no-print { }
        @media print {
          body * { visibility: hidden; }
          .report-print, .report-print * { visibility: visible; }
          .report-print { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
        .editable-row:hover { background: #f8f8f8 !important; }
        .delete-btn { opacity: 0; transition: opacity 0.2s; }
        .editable-row:hover .delete-btn { opacity: 1; }
      `}</style>

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: c.accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calculator size={26} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>حاسبة الكميات</h1>
            <p style={{ fontSize: 14, color: c.muted, margin: 0 }}>تقرير قابل للتحرير الكامل</p>
          </div>
        </div>

        {/* شريط الأدوات */}
        <div className="no-print" style={{ ...cardStyle, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <button onClick={addNewItem} style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: c.success, color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <Plus size={16} /> بند جديد
          </button>
          <button onClick={addNewFreeItem} style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: '#8b5cf6', color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <Plus size={16} /> خدمة مجانية
          </button>
          <button onClick={addNewTerm} style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: '#f59e0b', color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <Plus size={16} /> شرط جديد
          </button>
          <div style={{ flex: 1 }} />
          <button onClick={handlePrint} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#667eea', color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <Printer size={16} /> طباعة / PDF
          </button>
        </div>

        {/* نصيحة التحرير */}
        <div className="no-print" style={{ background: '#e0f2fe', padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 12, color: '#0369a1', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>💡</span>
          <span><strong>نصيحة:</strong> انقر على أي نص لتحريره مباشرة • انقر على الصور لتغييرها أو تغيير حجمها • مرر على البند واضغط 🗑️ لحذفه</span>
        </div>

        {/* ========== التقرير القابل للتحرير الكامل ========== */}
        <div className="report-print" ref={reportRef} style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e0e0e0', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          
          {/* === HEADER === */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px 24px', borderBottom: '1px solid #e0e0e0' }}>
            {/* الشعار */}
            <div style={{ textAlign: 'right' }}>
              <EditableImage imageKey="logo" placeholder="الشعار" />
              <div style={{ marginTop: 8 }}>
                <EditableText value={reportData.companyName} onChange={(v) => setReportData({...reportData, companyName: v})} style={{ fontSize: 16, fontWeight: 700, color: '#2d5a3d', display: 'block' }} />
                <EditableText value={reportData.companySubtitle} onChange={(v) => setReportData({...reportData, companySubtitle: v})} style={{ fontSize: 11, color: '#666' }} />
              </div>
            </div>

            {/* العنوان */}
            <div style={{ textAlign: 'center', flex: 1, padding: '0 20px' }}>
              <div style={{ background: '#6b7b3d', color: '#fff', padding: '12px 30px', borderRadius: 25, display: 'inline-block', marginBottom: 12 }}>
                <EditableText value={reportData.headerTitle} onChange={(v) => setReportData({...reportData, headerTitle: v})} style={{ fontSize: 18, fontWeight: 700, color: '#fff', textAlign: 'center', background: 'transparent' }} />
              </div>
              <div style={{ fontSize: 11, color: '#666', textAlign: 'right' }}>
                <div style={{ marginBottom: 4 }}>
                  <EditableText value={reportData.quoteNumberLabel} onChange={(v) => setReportData({...reportData, quoteNumberLabel: v})} style={{ color: '#888', fontSize: 10 }} />
                  : <EditableText value={reportData.quoteNumber} onChange={(v) => setReportData({...reportData, quoteNumber: v})} style={{ fontWeight: 600, fontSize: 12 }} />
                </div>
                <div style={{ marginBottom: 4 }}>
                  <EditableText value={reportData.dateLabel} onChange={(v) => setReportData({...reportData, dateLabel: v})} style={{ color: '#888', fontSize: 10 }} />
                  : <EditableText value={reportData.quoteDate} onChange={(v) => setReportData({...reportData, quoteDate: v})} style={{ fontWeight: 600, fontSize: 11 }} />
                </div>
                <div style={{ marginBottom: 4 }}>
                  <EditableText value={reportData.contactLabel} onChange={(v) => setReportData({...reportData, contactLabel: v})} style={{ color: '#888', fontSize: 10 }} />
                </div>
                <div>
                  <EditableText value={reportData.contactPhone} onChange={(v) => setReportData({...reportData, contactPhone: v})} style={{ fontWeight: 600, fontSize: 12, color: '#333' }} />
                </div>
              </div>
            </div>

            {/* رؤية 2030 */}
            <EditableImage imageKey="vision2030" placeholder="رؤية 2030" />
          </div>

          {/* === المقدمة وبيانات العميل === */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #e0e0e0' }}>
            {/* بيانات العميل */}
            <div style={{ padding: '16px 24px', borderLeft: '1px solid #e0e0e0' }}>
              <EditableText value={reportData.clientDataTitle} onChange={(v) => setReportData({...reportData, clientDataTitle: v})} style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, display: 'block', color: '#333' }} />
              <div style={{ fontSize: 12, lineHeight: 2.2 }}>
                <div>
                  <EditableText value={reportData.clientNameLabel} onChange={(v) => setReportData({...reportData, clientNameLabel: v})} style={{ color: '#888', fontSize: 11 }} />
                  {' '}<EditableText value={reportData.clientName} onChange={(v) => setReportData({...reportData, clientName: v})} style={{ fontWeight: 600 }} />
                </div>
                <div>
                  <EditableText value={reportData.clientPhoneLabel} onChange={(v) => setReportData({...reportData, clientPhoneLabel: v})} style={{ color: '#888', fontSize: 11 }} />
                  {' '}<EditableText value={reportData.clientPhone} onChange={(v) => setReportData({...reportData, clientPhone: v})} style={{ fontWeight: 600 }} />
                </div>
                <div>
                  <EditableText value={reportData.clientLocationLabel} onChange={(v) => setReportData({...reportData, clientLocationLabel: v})} style={{ color: '#888', fontSize: 11 }} />
                  {' '}<EditableText value={reportData.clientLocation} onChange={(v) => setReportData({...reportData, clientLocation: v})} style={{ fontWeight: 600 }} />
                </div>
              </div>
            </div>
            {/* المقدمة */}
            <div style={{ padding: '16px 24px' }}>
              <EditableText value={reportData.introTitle} onChange={(v) => setReportData({...reportData, introTitle: v})} style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, display: 'block', color: '#333' }} />
              <EditableText value={reportData.introText} onChange={(v) => setReportData({...reportData, introText: v})} multiline style={{ fontSize: 11, color: '#666', lineHeight: 1.7, width: '100%' }} />
            </div>
          </div>

          {/* === عنوان المشروع === */}
          <div style={{ background: '#5a6a3a', padding: '14px 24px' }}>
            <EditableText value={reportData.projectTitle} onChange={(v) => setReportData({...reportData, projectTitle: v})} style={{ fontSize: 18, fontWeight: 700, color: '#fff', background: 'transparent' }} />
          </div>

          {/* === جدول البنود === */}
          <div style={{ display: 'flex' }}>
            {/* البنود */}
            <div style={{ flex: 1 }}>
              {reportItems.map((item, idx) => (
                <div key={idx} className="editable-row" style={{ display: 'flex', borderBottom: '1px solid #eee', background: idx % 2 === 0 ? '#fff' : '#fafafa', position: 'relative' }}>
                  {/* زر الحذف */}
                  <button className="delete-btn no-print" onClick={() => deleteItem(idx)} style={{ position: 'absolute', left: 8, top: 8, background: '#fee2e2', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '4px 8px', borderRadius: 4, fontSize: 11 }}>
                    <Trash2 size={12} />
                  </button>
                  
                  {/* الكود */}
                  <div style={{ width: 70, padding: '14px 10px', textAlign: 'center', borderLeft: '1px solid #eee' }}>
                    <EditableText value={item.id} onChange={(v) => updateReportItem(idx, 'id', v)} style={{ fontSize: 10, fontWeight: 600, color: '#5a6a3a' }} />
                  </div>
                  {/* المحتوى */}
                  <div style={{ flex: 1, padding: '14px' }}>
                    <EditableText value={item.title} onChange={(v) => updateReportItem(idx, 'title', v)} style={{ fontSize: 14, fontWeight: 700, color: '#333', display: 'block', marginBottom: 8 }} />
                    <EditableText value={item.desc} onChange={(v) => updateReportItem(idx, 'desc', v)} multiline style={{ fontSize: 10, color: '#666', lineHeight: 1.6, width: '100%' }} />
                    {item.area && (
                      <div style={{ marginTop: 8, fontSize: 10, color: '#888' }}>
                        <EditableText value={item.areaLabel} onChange={(v) => updateReportItem(idx, 'areaLabel', v)} style={{ color: '#888' }} />
                        {' = '}<EditableText value={item.area} onChange={(v) => updateReportItem(idx, 'area', v)} style={{ fontWeight: 600, color: '#5a6a3a' }} /> م²
                      </div>
                    )}
                  </div>
                  {/* السعر */}
                  <div style={{ width: 100, padding: '14px', textAlign: 'right', borderRight: '1px solid #eee' }}>
                    <EditableText value={item.price} onChange={(v) => updateReportItem(idx, 'price', v)} style={{ fontSize: 13, fontWeight: 700, display: 'block' }} />
                    <EditableText value={item.priceLabel} onChange={(v) => updateReportItem(idx, 'priceLabel', v)} style={{ fontSize: 9, color: '#888' }} />
                  </div>
                </div>
              ))}

              {/* البنود المجانية */}
              {freeItems.map((item, idx) => (
                <div key={`free-${idx}`} className="editable-row" style={{ display: 'flex', borderBottom: '1px solid #eee', background: '#f0fff0', position: 'relative' }}>
                  <button className="delete-btn no-print" onClick={() => deleteFreeItem(idx)} style={{ position: 'absolute', left: 8, top: 8, background: '#fee2e2', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '4px 8px', borderRadius: 4, fontSize: 11 }}>
                    <Trash2 size={12} />
                  </button>
                  <div style={{ width: 70, padding: '14px 10px', textAlign: 'center', borderLeft: '1px solid #eee' }}>
                    <EditableText value={item.id} onChange={(v) => updateFreeItem(idx, 'id', v)} style={{ fontSize: 10, fontWeight: 600, color: '#5a6a3a' }} />
                  </div>
                  <div style={{ flex: 1, padding: '14px' }}>
                    <EditableText value={item.title} onChange={(v) => updateFreeItem(idx, 'title', v)} style={{ fontSize: 14, fontWeight: 700, color: '#333', display: 'block', marginBottom: 8 }} />
                    <EditableText value={item.desc} onChange={(v) => updateFreeItem(idx, 'desc', v)} multiline style={{ fontSize: 10, color: '#666', lineHeight: 1.6, width: '100%' }} />
                  </div>
                  <div style={{ width: 100, padding: '14px', textAlign: 'right', borderRight: '1px solid #eee' }}>
                    <EditableText value={item.price} onChange={(v) => updateFreeItem(idx, 'price', v)} style={{ fontSize: 13, fontWeight: 700, color: '#16a34a' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* الإجمالي الجانبي */}
            <div style={{ width: 100, background: '#f8f8f8', borderRight: '2px solid #5a6a3a', padding: '20px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <EditableText value={reportData.sideTotalLabel} onChange={(v) => setReportData({...reportData, sideTotalLabel: v})} style={{ fontSize: 11, color: '#888', marginBottom: 6 }} />
              <EditableText value={reportData.sideTotal} onChange={(v) => setReportData({...reportData, sideTotal: v})} style={{ fontSize: 18, fontWeight: 700, color: '#333' }} />
            </div>
          </div>

          {/* === الإجماليات === */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '3px solid #5a6a3a' }}>
            {/* المبالغ */}
            <div style={{ padding: '20px 24px', borderLeft: '1px solid #e0e0e0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 12 }}>
                <EditableText value={reportData.subtotal} onChange={(v) => setReportData({...reportData, subtotal: v})} style={{ fontWeight: 600 }} />
                <EditableText value={reportData.subtotalLabel} onChange={(v) => setReportData({...reportData, subtotalLabel: v})} style={{ color: '#888' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 12 }}>
                <EditableText value={reportData.discount} onChange={(v) => setReportData({...reportData, discount: v})} style={{ fontWeight: 600 }} placeholder="-" />
                <EditableText value={reportData.discountLabel} onChange={(v) => setReportData({...reportData, discountLabel: v})} style={{ color: '#888' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 12 }}>
                <EditableText value={reportData.vatAmount} onChange={(v) => setReportData({...reportData, vatAmount: v})} style={{ fontWeight: 600 }} />
                <EditableText value={reportData.vatLabel} onChange={(v) => setReportData({...reportData, vatLabel: v})} style={{ color: '#888' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '2px solid #5a6a3a', fontSize: 14 }}>
                <span>
                  <EditableText value={reportData.grandTotal} onChange={(v) => setReportData({...reportData, grandTotal: v})} style={{ fontWeight: 700, color: '#5a6a3a', fontSize: 16 }} />
                  {' '}<EditableText value={reportData.currency} onChange={(v) => setReportData({...reportData, currency: v})} style={{ fontSize: 11, color: '#666' }} />
                </span>
                <EditableText value={reportData.grandTotalLabel} onChange={(v) => setReportData({...reportData, grandTotalLabel: v})} style={{ fontWeight: 700 }} />
              </div>
            </div>
            {/* الملاحظة */}
            <div style={{ padding: '20px 24px' }}>
              <EditableText value={reportData.noteTitle} onChange={(v) => setReportData({...reportData, noteTitle: v})} style={{ fontSize: 12, fontWeight: 700, marginBottom: 10, display: 'block', color: '#92400e' }} />
              <div style={{ background: '#fef3c7', padding: 12, borderRadius: 8 }}>
                <EditableText value={reportData.noteText} onChange={(v) => setReportData({...reportData, noteText: v})} multiline style={{ fontSize: 10, color: '#92400e', lineHeight: 1.7, width: '100%' }} />
              </div>
            </div>
          </div>

          {/* === الشروط وبيانات التحويل === */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid #e0e0e0' }}>
            {/* الشروط */}
            <div style={{ padding: '20px 24px', borderLeft: '1px solid #e0e0e0' }}>
              <EditableText value={reportData.termsTitle} onChange={(v) => setReportData({...reportData, termsTitle: v})} style={{ fontSize: 12, fontWeight: 700, marginBottom: 12, display: 'block' }} />
              <ul style={{ fontSize: 10, color: '#666', paddingRight: 18, margin: 0, lineHeight: 2 }}>
                {reportData.terms.map((term, idx) => (
                  <li key={idx} className="editable-row" style={{ position: 'relative' }}>
                    <EditableText value={term} onChange={(v) => updateTerm(idx, v)} style={{ width: '90%' }} />
                    <button className="delete-btn no-print" onClick={() => deleteTerm(idx)} style={{ position: 'absolute', left: 0, top: 0, background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 10, padding: 2 }}>✕</button>
                  </li>
                ))}
              </ul>
            </div>
            {/* بيانات التحويل */}
            <div style={{ padding: '20px 24px' }}>
              <EditableText value={reportData.bankTitle} onChange={(v) => setReportData({...reportData, bankTitle: v})} style={{ fontSize: 12, fontWeight: 700, marginBottom: 12, display: 'block', color: '#5a6a3a' }} />
              <div style={{ fontSize: 11, lineHeight: 2.2 }}>
                <div>
                  <EditableText value={reportData.bankNameLabel} onChange={(v) => setReportData({...reportData, bankNameLabel: v})} style={{ color: '#888' }} />
                  {' '}<EditableText value={reportData.bankName} onChange={(v) => setReportData({...reportData, bankName: v})} style={{ fontWeight: 600 }} />
                </div>
                <div>
                  <EditableText value={reportData.accountLabel} onChange={(v) => setReportData({...reportData, accountLabel: v})} style={{ color: '#888' }} />
                  {' '}<EditableText value={reportData.accountNumber} onChange={(v) => setReportData({...reportData, accountNumber: v})} style={{ fontWeight: 600 }} />
                </div>
                <div>
                  <EditableText value={reportData.ibanLabel} onChange={(v) => setReportData({...reportData, ibanLabel: v})} style={{ color: '#888' }} />
                  {' '}<EditableText value={reportData.iban} onChange={(v) => setReportData({...reportData, iban: v})} style={{ fontWeight: 600, fontSize: 10 }} />
                </div>
              </div>
              {/* التوقيع والختم */}
              <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'flex-end' }}>
                <EditableImage imageKey="stamp" placeholder="الختم" />
                <EditableImage imageKey="signature" placeholder="التوقيع" />
              </div>
            </div>
          </div>

          {/* === Footer === */}
          <div style={{ background: '#5a6a3a', padding: '12px 24px', textAlign: 'center' }}>
            <EditableText value={reportData.footerEmail} onChange={(v) => setReportData({...reportData, footerEmail: v})} style={{ fontSize: 12, color: '#fff', background: 'transparent' }} />
          </div>
        </div>
      </div>

      {/* Modal تعديل الصورة */}
      {imageEditModal && (
        <div className="no-print" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, maxWidth: 400, width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>تعديل الصورة</h3>
              <button onClick={() => setImageEditModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>✕</button>
            </div>
            
            {images[imageEditModal]?.src && (
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <img src={images[imageEditModal].src} alt="" style={{ maxWidth: '100%', maxHeight: 150, objectFit: 'contain' }} />
              </div>
            )}
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>العرض (px)</label>
                <input
                  type="number"
                  value={images[imageEditModal]?.width || 80}
                  onChange={(e) => updateImageSize(imageEditModal, 'width', e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14 }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>الارتفاع (px)</label>
                <input
                  type="number"
                  value={images[imageEditModal]?.height || 60}
                  onChange={(e) => updateImageSize(imageEditModal, 'height', e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14 }}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => handleImageUpload(imageEditModal, e);
                  input.click();
                }}
                style={{ flex: 1, padding: '12px', borderRadius: 8, border: 'none', background: '#0099bb', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
              >
                تغيير الصورة
              </button>
              <button
                onClick={() => removeImage(imageEditModal)}
                style={{ padding: '12px 20px', borderRadius: 8, border: 'none', background: '#fee2e2', color: '#dc2626', fontWeight: 600, cursor: 'pointer' }}
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuantityCalculatorPro;
