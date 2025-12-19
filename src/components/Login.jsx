import React, { useState } from 'react';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { decrypt } from '../utils/helpers';

const Login = ({ onLogin, users, darkMode, accentGradient }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (users.length === 0) {
      setError('جاري تحميل المستخدمين...');
      setLoading(false);
      return;
    }

    const user = users.find(u => {
      const decryptedUsername = decrypt(u.username);
      const decryptedPassword = decrypt(u.password);
      return decryptedUsername === username && decryptedPassword === password;
    });

    if (!user) {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
      setLoading(false);
      return;
    }

    if (!user.active) {
      setError('هذا الحساب غير نشط');
      setLoading(false);
      return;
    }

    if (!user.approved) {
      setError('حسابك في انتظار الموافقة');
      setLoading(false);
      return;
    }

    onLogin(user);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${darkMode ? 'from-gray-900 via-gray-800 to-gray-900' : 'from-gray-50 via-white to-gray-50'} p-4`}>
      <div className={`relative w-full max-w-md ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-sm rounded-2xl shadow-2xl p-8 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${accentGradient} mb-4`}>
            <span className="text-3xl font-bold text-white">RKZ</span>
          </div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            نظام الإدارة المالية
          </h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            ركائز الأولى للتعمير
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              اسم المستخدم
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${
                darkMode 
                  ? 'bg-gray-900/50 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              placeholder="أدخل اسم المستخدم"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${
                  darkMode 
                    ? 'bg-gray-900/50 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12`}
                placeholder="أدخل كلمة المرور"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-700/50 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl bg-gradient-to-r ${accentGradient} text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                جاري تسجيل الدخول...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                تسجيل الدخول
              </>
            )}
          </button>
        </form>

        <div className={`mt-6 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
            نظام الإدارة المالية v6.0
          </p>
          <p className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-500'} mt-1`}>
            جميع الحقوق محفوظة © 2024
          </p>
        </div>

        <div className={`mt-4 p-3 rounded-xl ${darkMode ? 'bg-blue-500/10' : 'bg-blue-50'} border ${darkMode ? 'border-blue-500/30' : 'border-blue-200'}`}>
          <p className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'} text-center`}>
            للتجربة: نايف / @Lion12345
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
```

---

## ✅ احفظه:
```
Fix Login.jsx - add missing semicolon
