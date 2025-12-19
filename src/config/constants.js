// src/config/constants.js

export const APP_VERSION = 'v6.0.0';

export const GOOGLE_MAPS_API_KEY = '';

export const EXPENSE_TYPES = {
  monthly: { name: 'شهري', days: 30 },
  yearly: { name: 'سنوي', days: 365 }
};

export const TASK_PRIORITIES = {
  urgent: { name: 'مستعجل', color: 'red' },
  medium: { name: 'متوسط', color: 'yellow' },
  normal: { name: 'عادي', color: 'green' }
};

export const PROJECT_STATUS = {
  active: { name: 'نشط', color: 'blue' },
  paused: { name: 'متوقف', color: 'orange' },
  completed: { name: 'مكتمل', color: 'green' }
};

export const USER_ROLES = {
  owner: { name: 'مالك', level: 3 },
  manager: { name: 'مدير', level: 2 },
  member: { name: 'عضو', level: 1 }
};

export const STATUS_COLORS = {
  red: {
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    border: 'border-red-500/30',
    badge: 'bg-red-500/20 text-red-400'
  },
  orange: {
    bg: 'bg-orange-500/20',
    text: 'text-orange-400',
    border: 'border-orange-500/30',
    badge: 'bg-orange-500/20 text-orange-400'
  },
  yellow: {
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-400',
    border: 'border-yellow-500/30',
    badge: 'bg-yellow-500/20 text-yellow-400'
  },
  green: {
    bg: 'bg-green-500/20',
    text: 'text-green-400',
    border: 'border-green-500/30',
    badge: 'bg-green-500/20 text-green-400'
  },
  blue: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    badge: 'bg-blue-500/20 text-blue-400'
  },
  purple: {
    bg: 'bg-purple-500/20',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    badge: 'bg-purple-500/20 text-purple-400'
  },
  gray: {
    bg: 'bg-gray-500/20',
    text: 'text-gray-400',
    border: 'border-gray-500/30',
    badge: 'bg-gray-500/20 text-gray-400'
  }
};

export const FONTS = [
  { id: 0, name: 'Cairo', value: 'Cairo', url: 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap' },
  { id: 1, name: 'Tajawal', value: 'Tajawal', url: 'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap' },
  { id: 2, name: 'Almarai', value: 'Almarai', url: 'https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&display=swap' },
  { id: 3, name: 'Noto Kufi', value: 'Noto Kufi Arabic', url: 'https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;500;700&display=swap' },
  { id: 4, name: 'Rubik', value: 'Rubik', url: 'https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap' }
];

export const THEMES = [
  { id: 0, name: 'أسود', dark: 'from-gray-900 via-gray-800 to-gray-900', light: 'from-gray-50 via-white to-gray-50' },
  { id: 1, name: 'كلاسيكي', dark: 'from-slate-900 via-slate-800 to-slate-900', light: 'from-slate-50 via-white to-slate-50' },
  { id: 2, name: 'أزرق ملكي', dark: 'from-blue-950 via-slate-900 to-blue-950', light: 'from-blue-50 via-white to-blue-50' },
  { id: 3, name: 'ذهبي فاخر', dark: 'from-amber-950 via-slate-900 to-amber-950', light: 'from-amber-50 via-white to-amber-50' },
  { id: 4, name: 'أخضر النجاح', dark: 'from-emerald-950 via-slate-900 to-emerald-950', light: 'from-emerald-50 via-white to-emerald-50' },
  { id: 5, name: 'بنفسجي راقي', dark: 'from-purple-950 via-slate-900 to-purple-950', light: 'from-purple-50 via-white to-purple-50' },
  { id: 6, name: 'طوكيو الليلي', dark: 'from-slate-950 via-cyan-950 to-purple-950', light: 'from-slate-50 via-cyan-50 to-purple-50' }
];

export const ACCENT_COLORS = [
  { id: 0, name: 'أزرق', gradient: 'from-blue-600 to-cyan-600' },
  { id: 1, name: 'بنفسجي', gradient: 'from-purple-600 to-pink-600' },
  { id: 2, name: 'أخضر', gradient: 'from-emerald-600 to-teal-600' },
  { id: 3, name: 'برتقالي', gradient: 'from-orange-600 to-red-600' },
  { id: 4, name: 'وردي', gradient: 'from-pink-600 to-rose-600' },
  { id: 5, name: 'سماوي', gradient: 'from-cyan-600 to-blue-600' }
];

export const HEADER_COLORS = [
  { id: 0, name: 'شفاف', dark: 'bg-transparent', light: 'bg-transparent' },
  { id: 1, name: 'أسود', dark: 'bg-gray-900/95', light: 'bg-white/95' },
  { id: 2, name: 'أزرق', dark: 'bg-blue-900/95', light: 'bg-blue-50/95' },
  { id: 3, name: 'بنفسجي', dark: 'bg-purple-900/95', light: 'bg-purple-50/95' },
  { id: 4, name: 'رمادي', dark: 'bg-slate-900/95', light: 'bg-slate-50/95' },
  { id: 5, name: 'أخضر', dark: 'bg-emerald-900/95', light: 'bg-emerald-50/95' }
];

export const FILE_LIMITS = {
  image: 5 * 1024 * 1024,
  video: 50 * 1024 * 1024
};

export const IMAGE_COMPRESSION = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8
};

export const VIDEO_COMPRESSION = {
  maxWidth: 1280,
  maxHeight: 720,
  quality: 0.7
};

export const QUOTES = [
  'النجاح لا يأتي من الفراغ، بل من العمل الجاد والإصرار',
  'كل إنجاز عظيم بدأ بخطوة صغيرة',
  'التخطيط الجيد نصف النجاح',
  'المال خادم جيد لكنه سيد سيء',
  'الإدارة الحكيمة للمال مفتاح الاستقرار',
  'استثمر في نفسك، فهو أفضل استثمار',
  'الميزانية ليست قيداً، بل خريطة طريق للنجاح',
  'لا تدخر ما تبقى بعد الإنفاق، بل أنفق ما تبقى بعد الادخار'
];

export const GREETINGS = [
  'مرحباً',
  'أهلاً',
  'السلام عليكم',
  'صباح الخير',
  'مساء الخير',
  'حياك الله',
  'نورت',
  'أهلاً وسهلاً',
  'يا هلا',
  'مرحبتين',
  'الله يحييك',
  'تشرفنا',
  'فرصة سعيدة',
  'يوم سعيد',
  'وقت ممتع'
];
