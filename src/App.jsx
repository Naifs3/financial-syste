import React from 'react';

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '50px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '48px',
          color: '#667eea',
          margin: '0 0 20px 0'
        }}>
          ✅ اختبار ناجح!
        </h1>
        <p style={{
          fontSize: '24px',
          color: '#333',
          margin: '0'
        }}>
          التحديث يعمل بنجاح على Vercel
        </p>
        <p style={{
          fontSize: '18px',
          color: '#666',
          marginTop: '20px'
        }}>
          الوقت: {new Date().toLocaleString('ar-SA')}
        </p>
      </div>
    </div>
  );
}

export default App;
