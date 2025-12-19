// src/utils/helpers.js
import CryptoJS from 'crypto-js';

// مفتاح التشفير (يجب تغييره في الإنتاج!)
const SECRET_KEY = 'RKZ-FINANCIAL-SYSTEM-2024-SECRET-KEY';

// ==================== التشفير ====================

export const encrypt = (text) => {
  if (!text) return '';
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

export const decrypt = (ciphertext) => {
  if (!ciphertext) return '';
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
};

// ==================== الأرقام المرجعية ====================

export const generateRefNumber = (prefix, number) => {
  return `${prefix}-${String(number).padStart(4, '0')}`;
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('ar-SA').format(num);
};

export const formatCurrency = (amount) => {
  return `${formatNumber(amount)} ريال`;
};

// ==================== التواريخ ====================

export const calcDaysRemaining = (dueDate) => {
  if (!dueDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const calcNextDueDate = (currentDate, type) => {
  const date = new Date(currentDate);
  if (type === 'monthly') {
    date.setMonth(date.getMonth() + 1);
  } else if (type === 'yearly') {
    date.setFullYear(date.getFullYear() + 1);
  }
  return date.toISOString().split('T')[0];
};

export const getStatusColorByDays = (days) => {
  if (days === null) return 'green';
  if (days < 0) return 'red';
  if (days <= 7) return 'orange';
  if (days <= 14) return 'yellow';
  return 'green';
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatTime12 = (date) => {
  return date.toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
};

// ==================== ضغط الصور ====================

export const compressImage = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          file.type,
          quality
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// ==================== التحقق من الملفات ====================

export const validateFileType = (file, allowedTypes) => {
  return allowedTypes.some(type => file.type.startsWith(type));
};

export const validateFileSize = (file, maxSize) => {
  return file.size <= maxSize;
};

// ==================== المشاريع ====================

export const calculateProgress = (project) => {
  if (!project.folders || project.folders.length === 0) return 0;
  const totalFiles = project.folders.reduce((sum, folder) => sum + (folder.files?.length || 0), 0);
  return Math.min(100, Math.round(totalFiles * 10));
};

// ==================== الصلاحيات ====================

export const hasPermission = (userRole, requiredLevel) => {
  const roles = {
    owner: 3,
    manager: 2,
    member: 1
  };
  return roles[userRole] >= requiredLevel;
};

// ==================== الأدوات العامة ====================

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Copy failed:', error);
    return false;
  }
};

export const calculateSessionDuration = (startTime) => {
  if (!startTime) return 0;
  const now = Date.now();
  const diff = now - startTime;
  return Math.floor(diff / 60000); // minutes
};

export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidPhone = (phone) => {
  const regex = /^(05|5)[0-9]{8}$/;
  return regex.test(phone);
};

// ==================== التحيات والاقتباسات ====================

export const getRandomGreeting = (greetings, username) => {
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];
  return `${greeting} ${username}`;
};

export const getRandomQuote = (quotes) => {
  return quotes[Math.floor(Math.random() * quotes.length)];
};
```

---
