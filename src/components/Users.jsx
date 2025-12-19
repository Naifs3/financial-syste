import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, CheckCircle, XCircle, Shield, User as UserIcon, Clock } from 'lucide-react';
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

const Users = ({ currentUser, darkMode, txt, txtSm, card, accentGradient }) => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'users'), orderBy('createdAt', 'desc')),
      snapshot => {
        const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
      },
      error => console.error('Users error:', error)
    );

    return () => unsubscribe();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        approved: true,
        active: true,
        approvedAt: new Date().toISOString(),
        approvedBy: currentUser.username
      });
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleReject = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        approved: false,
        active: false
      });
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  const handleToggleActive = async (userId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        active: !currentStatus
      });
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'pending') return !user.approved;
    if (filter === 'approved') return user.approved && user.active;
    if (filter === 'inactive') return !user.active;
    return true;
  });

  const pendingCount = users.filter(u => !u.approved).length;

  if (currentUser.role !== 'owner') {
    return (
      <div className="p-6">
        <div className={`${card} rounded-2xl p-8 text-center`}>
          <Shield className={`w-16 h-16 ${txtSm} mx-auto mb-4`} />
          <p className={txt}>ليس لديك صلاحية لعرض هذه الصفحة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className={`${card} rounded-2xl p-6 mb-6`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${accentGradient} rounded-xl flex items-center justify-center`}>
              <UsersIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${txt}`}>إدارة المستخدمين</h2>
              <p className={txtSm}>الموافقة على الطلبات الجديدة وإدارة الحسابات</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              filter === 'all'
                ? `bg-gradient-to-r ${accentGradient} text-white`
                : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'} hover:opacity-80`
            }`}
          >
            الكل ({users.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              filter === 'pending'
                ? `bg-gradient-to-r ${accentGradient} text-white`
                : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'} hover:opacity-80`
            }`}
          >
            في الانتظار ({pendingCount})
            {pendingCount > 0 && (
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full ml-2 animate-pulse" />
            )}
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              filter === 'approved'
                ? `bg-gradient-to-r ${accentGradient} text-white`
                : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'} hover:opacity-80`
            }`}
          >
            معتمد
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              filter === 'inactive'
                ? `bg-gradient-to-r ${accentGradient} text-white`
                : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'} hover:opacity-80`
            }`}
          >
            غير نشط
          </button>
        </div>

        {pendingCount > 0 && filter !== 'pending' && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <p className="text-yellow-400 text-sm text-center">
              ⚠️ لديك {pendingCount} طلب جديد في انتظار الموافقة
            </p>
          </div>
        )}

        <div className="space-y-4">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <UsersIcon className={`w-16 h-16 ${txtSm} mx-auto mb-4`} />
              <p className={txtSm}>لا يوجد مستخدمين</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} rounded-xl p-4 border ${
                  !user.approved 
                    ? 'border-yellow-500/50' 
                    : user.active 
                    ? 'border-green-500/30' 
                    : 'border-red-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      user.role === 'owner' 
                        ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
                        : 'bg-gradient-to-br from-blue-600 to-cyan-600'
                    }`}>
                      {user.role === 'owner' ? (
                        <Shield className="w-6 h-6 text-white" />
                      ) : (
                        <UserIcon className="w-6 h-6 text-white" />
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`font-bold ${txt}`}>{user.username}</p>
                        {!user.approved && (
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            في الانتظار
                          </span>
                        )}
                        {user.approved && user.active && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                            معتمد
                          </span>
                        )}
                        {!user.active && user.approved && (
                          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                            غير نشط
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${txtSm}`}>{user.email}</p>
                      <p className={`text-xs ${txtSm}`}>
                        {user.role === 'owner' ? 'مالك النظام' : 'مستخدم'}
                      </p>
                    </div>
                  </div>

                  {user.id !== currentUser.id && (
                    <div className="flex items-center gap-2">
                      {!user.approved && (
                        <>
                          <button
                            onClick={() => handleApprove(user.id)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            موافقة
                          </button>
                          <button
                            onClick={() => handleReject(user.id)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            رفض
                          </button>
                        </>
                      )}
                      {user.approved && (
                        <button
                          onClick={() => handleToggleActive(user.id, user.active)}
                          className={`px-4 py-2 rounded-xl transition-all ${
                            user.active
                              ? 'bg-red-600 hover:bg-red-700'
                              : 'bg-green-600 hover:bg-green-700'
                          } text-white`}
                        >
                          {user.active ? 'تعطيل' : 'تفعيل'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
