import React, { useState } from 'react';
import { LogIn, Eye, EyeOff, Mail, Lock, UserPlus } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const Login = ({ onLogin, onShowSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (!userDoc.exists()) {
        setError('بيانات المستخدم غير موجودة');
        setLoading(false);
        return;
      }

      const userData = userDoc.data();

      if (!userData.approved) {
        setError('حسابك في انتظار موافقة المدير');
        setLoading(false);
        return;
      }

      if (!userData.active) {
        setError('هذا الحساب غير نشط');
        setLoading(false);
        return;
      }

      onLogin({
        id: uid,
        email: userCredential.user.email,
        username: userData.username,
        role: userData.role,
        active: userData.active,
        approved: userData.approved
      });

    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/invalid-credential') {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } else if (error.code === 'auth/user-not-found') {
        setError('المستخدم غير موجود');
      } else if (error.code === 'auth/wrong-password') {
        setError('كلمة المرور غير صحيحة');
      } else if (error.code === 'auth/too-many-requests') {
        setError('محاولات كثيرة. حاول مرة أخرى لاحقاً');
      } else {
        setError('حدث خطأ في تسجيل الدخول');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-lg mb-4">
              <span className="text-3xl font-bold text-white">RKZ</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">نظام الإدارة المالية</h1>
            <p className="text-sm text-gray-400">ركائز الأولى للتعمير</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="أدخل البريد الإلكتروني"
                  className="w-full pr-11 pl-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">كلمة المرور</label>
              <div className="relative">
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className="w-full pr-11 pl-11 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  disabled={loading}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

          <div className="mt-6 pt-6 border-t border-gray-700">
            <button
              onClick={onShowSignup}
              className="w-full py-3 bg-gray-700/50 hover:bg-gray-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              إنشاء حساب جديد
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">نظام الإدارة المالية v6.0</p>
            <p className="text-xs text-gray-600 mt-1">جميع الحقوق محفوظة © 2024</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
