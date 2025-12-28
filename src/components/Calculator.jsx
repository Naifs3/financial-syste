// src/components/Calculator.jsx
import React, { useState, useMemo } from 'react';
import { 
  Calculator as CalcIcon, Plus, Trash2, Copy, Check, RefreshCw,
  Building2, PaintBucket, Layers, Zap, Droplets, Wind, Home,
  DoorOpen, Square, Box, Cylinder, Triangle, Grid3X3, Ruler,
  FileText, Download, ChevronDown, ChevronUp, Settings, Info,
  Package, Truck, Clock, Percent, DollarSign, Hash, Wrench
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// قاعدة بيانات المواد والمعايير
// ═══════════════════════════════════════════════════════════════
const MATERIALS_DATABASE = {
  concrete: {
    name: 'الخرسانة',
    unit: 'م³',
    defaultPrice: 350,
    wastePercent: 5,
    mixRatios: {
      'عادية (150)': { cement: 250, sand: 0.4, gravel: 0.8, water: 125 },
      'مسلحة (250)': { cement: 350, sand: 0.45, gravel: 0.9, water: 175 },
      'مسلحة (350)': { cement: 400, sand: 0.5, gravel: 0.95, water: 200 },
      'عالية (450)': { cement: 450, sand: 0.55, gravel: 1.0, water: 225 },
    }
  },
  steel: {
    name: 'حديد التسليح',
    unit: 'طن',
    defaultPrice: 4500,
    wastePercent: 3,
    ratios: {
      'قواعد': 80,
      'أعمدة': 120,
      'جسور': 100,
      'سقف': 90,
      'درج': 110,
    }
  },
  blocks: {
    name: 'البلوك',
    unit: 'حبة',
    sizes: {
      '20×20×40': { perSqm: 12.5, defaultPrice: 3.5 },
      '15×20×40': { perSqm: 12.5, defaultPrice: 3 },
      '10×20×40': { perSqm: 12.5, defaultPrice: 2.5 },
    },
    wastePercent: 5
  },
  bricks: {
    name: 'الطوب الأحمر',
    unit: 'حبة',
    perSqm: 60,
    defaultPrice: 0.8,
    wastePercent: 7
  },
  tiles: {
    name: 'البلاط/السيراميك',
    unit: 'م²',
    defaultPrice: 80,
    wastePercent: 10,
    adhesive: 5, // كجم لكل م²
    grout: 0.5 // كجم لكل م²
  },
  paint: {
    name: 'الدهان',
    unit: 'لتر',
    coverage: 12, // م² لكل لتر
    coats: 2,
    defaultPrice: 150,
    wastePercent: 10
  },
  plaster: {
    name: 'اللياسة',
    unit: 'م²',
    thickness: 2, // سم
    cementPerSqm: 18, // كجم
    sandPerSqm: 0.025, // م³
    defaultPrice: 35,
    wastePercent: 5
  },
  gypsum: {
    name: 'الجبس',
    unit: 'م²',
    defaultPrice: 45,
    wastePercent: 8
  },
  insulation: {
    name: 'العزل',
    types: {
      'عزل مائي': { defaultPrice: 25, unit: 'م²' },
      'عزل حراري': { defaultPrice: 35, unit: 'م²' },
      'عزل صوتي': { defaultPrice: 45, unit: 'م²' },
    },
    wastePercent: 5
  },
  electrical: {
    name: 'الكهرباء',
    pointPrice: 150,
    items: {
      'نقطة إضاءة': 150,
      'نقطة بريزة': 120,
      'نقطة مكيف': 200,
      'نقطة سخان': 180,
      'لوحة توزيع': 500,
    }
  },
  plumbing: {
    name: 'السباكة',
    pointPrice: 200,
    items: {
      'نقطة ماء بارد': 150,
      'نقطة ماء حار': 180,
      'نقطة صرف': 200,
      'مغسلة': 350,
      'مرحاض': 450,
      'دش': 300,
      'بانيو': 600,
      'سخان مركزي': 1500,
    }
  },
  doors: {
    name: 'الأبواب',
    types: {
      'باب خشب داخلي': 800,
      'باب خشب خارجي': 1500,
      'باب حديد': 2000,
      'باب ألمنيوم': 1200,
      'باب زجاج': 1800,
    }
  },
  windows: {
    name: 'النوافذ',
    pricePerSqm: {
      'ألمنيوم عادي': 350,
      'ألمنيوم مزدوج': 550,
      'UPVC': 650,
      'خشب': 800,
    }
  },
  falseCeiling: {
    name: 'الأسقف المستعارة',
    types: {
      'جبس بورد': { price: 85, unit: 'م²' },
      'معدني 60×60': { price: 75, unit: 'م²' },
      'خشبي': { price: 150, unit: 'م²' },
      'PVC': { price: 65, unit: 'م²' },
    },
    wastePercent: 8
  },
  flooring: {
    name: 'الأرضيات',
    types: {
      'سيراميك': { price: 80, unit: 'م²' },
      'بورسلان': { price: 120, unit: 'م²' },
      'رخام': { price: 250, unit: 'م²' },
      'جرانيت': { price: 200, unit: 'م²' },
      'باركيه': { price: 150, unit: 'م²' },
      'فينيل': { price: 60, unit: 'م²' },
      'إيبوكسي': { price: 100, unit: 'م²' },
    },
    wastePercent: 10
  }
};

// ═══════════════════════════════════════════════════════════════
// أنواع الحسابات
// ═══════════════════════════════════════════════════════════════
const CALCULATION_TYPES = [
  {
    id: 'concrete',
    name: 'الخرسانة',
    icon: Box,
    color: '#6b7280',
    category: 'structural',
    fields: [
      { key: 'length', label: 'الطول (م)', type: 'number', required: true },
      { key: 'width', label: 'العرض (م)', type: 'number', required: true },
      { key: 'height', label: 'السُمك/الارتفاع (م)', type: 'number', required: true },
      { key: 'mixType', label: 'نوع الخلطة', type: 'select', options: Object.keys(MATERIALS_DATABASE.concrete.mixRatios) },
      { key: 'price', label: 'سعر المتر المكعب', type: 'number', default: 350 },
    ],
    calculate: (values) => {
      const volume = values.length * values.width * values.height;
      const waste = volume * (MATERIALS_DATABASE.concrete.wastePercent / 100);
      const totalVolume = volume + waste;
      const mix = MATERIALS_DATABASE.concrete.mixRatios[values.mixType] || MATERIALS_DATABASE.concrete.mixRatios['مسلحة (250)'];
      return {
        volume: volume.toFixed(3),
        totalWithWaste: totalVolume.toFixed(3),
        cement: (totalVolume * mix.cement).toFixed(0) + ' كجم',
        sand: (totalVolume * mix.sand).toFixed(2) + ' م³',
        gravel: (totalVolume * mix.gravel).toFixed(2) + ' م³',
        water: (totalVolume * mix.water).toFixed(0) + ' لتر',
        cost: (totalVolume * (values.price || 350)).toFixed(0),
      };
    }
  },
  {
    id: 'steel',
    name: 'حديد التسليح',
    icon: Cylinder,
    color: '#374151',
    category: 'structural',
    fields: [
      { key: 'concreteVolume', label: 'حجم الخرسانة (م³)', type: 'number', required: true },
      { key: 'elementType', label: 'نوع العنصر', type: 'select', options: Object.keys(MATERIALS_DATABASE.steel.ratios) },
      { key: 'price', label: 'سعر الطن', type: 'number', default: 4500 },
    ],
    calculate: (values) => {
      const ratio = MATERIALS_DATABASE.steel.ratios[values.elementType] || 100;
      const steelKg = values.concreteVolume * ratio;
      const steelTon = steelKg / 1000;
      const waste = steelTon * (MATERIALS_DATABASE.steel.wastePercent / 100);
      const totalTon = steelTon + waste;
      return {
        steelKg: steelKg.toFixed(0) + ' كجم',
        steelTon: steelTon.toFixed(3) + ' طن',
        totalWithWaste: totalTon.toFixed(3) + ' طن',
        ratio: ratio + ' كجم/م³',
        cost: (totalTon * (values.price || 4500)).toFixed(0),
      };
    }
  },
  {
    id: 'blocks',
    name: 'البلوك',
    icon: Grid3X3,
    color: '#9ca3af',
    category: 'structural',
    fields: [
      { key: 'length', label: 'طول الجدار (م)', type: 'number', required: true },
      { key: 'height', label: 'ارتفاع الجدار (م)', type: 'number', required: true },
      { key: 'openings', label: 'مساحة الفتحات (م²)', type: 'number', default: 0 },
      { key: 'blockSize', label: 'مقاس البلوك', type: 'select', options: Object.keys(MATERIALS_DATABASE.blocks.sizes) },
      { key: 'price', label: 'سعر الحبة', type: 'number', default: 3.5 },
    ],
    calculate: (values) => {
      const area = (values.length * values.height) - (values.openings || 0);
      const blockInfo = MATERIALS_DATABASE.blocks.sizes[values.blockSize] || MATERIALS_DATABASE.blocks.sizes['20×20×40'];
      const blocks = area * blockInfo.perSqm;
      const waste = blocks * (MATERIALS_DATABASE.blocks.wastePercent / 100);
      const totalBlocks = Math.ceil(blocks + waste);
      const mortarBags = Math.ceil(area * 0.5); // نصف كيس لكل م²
      return {
        area: area.toFixed(2) + ' م²',
        blocks: Math.ceil(blocks) + ' حبة',
        totalWithWaste: totalBlocks + ' حبة',
        mortarBags: mortarBags + ' كيس أسمنت',
        sand: (area * 0.02).toFixed(2) + ' م³ رمل',
        cost: (totalBlocks * (values.price || blockInfo.defaultPrice)).toFixed(0),
      };
    }
  },
  {
    id: 'tiles',
    name: 'البلاط والسيراميك',
    icon: Square,
    color: '#f59e0b',
    category: 'finishing',
    fields: [
      { key: 'length', label: 'الطول (م)', type: 'number', required: true },
      { key: 'width', label: 'العرض (م)', type: 'number', required: true },
      { key: 'tileType', label: 'نوع البلاط', type: 'select', options: Object.keys(MATERIALS_DATABASE.flooring.types) },
      { key: 'price', label: 'سعر المتر المربع', type: 'number', default: 80 },
    ],
    calculate: (values) => {
      const area = values.length * values.width;
      const waste = area * (MATERIALS_DATABASE.tiles.wastePercent / 100);
      const totalArea = area + waste;
      const adhesive = totalArea * MATERIALS_DATABASE.tiles.adhesive;
      const grout = totalArea * MATERIALS_DATABASE.tiles.grout;
      const typePrice = MATERIALS_DATABASE.flooring.types[values.tileType]?.price || 80;
      return {
        area: area.toFixed(2) + ' م²',
        totalWithWaste: totalArea.toFixed(2) + ' م²',
        adhesive: adhesive.toFixed(0) + ' كجم لاصق',
        grout: grout.toFixed(1) + ' كجم روبة',
        tilesCount: Math.ceil(totalArea / 0.36) + ' بلاطة (60×60)',
        cost: (totalArea * (values.price || typePrice)).toFixed(0),
      };
    }
  },
  {
    id: 'paint',
    name: 'الدهانات',
    icon: PaintBucket,
    color: '#8b5cf6',
    category: 'finishing',
    fields: [
      { key: 'length', label: 'محيط/طول الجدران (م)', type: 'number', required: true },
      { key: 'height', label: 'الارتفاع (م)', type: 'number', required: true },
      { key: 'openings', label: 'مساحة الفتحات (م²)', type: 'number', default: 0 },
      { key: 'coats', label: 'عدد الأوجه', type: 'number', default: 2 },
      { key: 'price', label: 'سعر الجالون (18 لتر)', type: 'number', default: 250 },
    ],
    calculate: (values) => {
      const area = (values.length * values.height) - (values.openings || 0);
      const totalArea = area * (values.coats || 2);
      const liters = totalArea / MATERIALS_DATABASE.paint.coverage;
      const waste = liters * (MATERIALS_DATABASE.paint.wastePercent / 100);
      const totalLiters = liters + waste;
      const gallons = Math.ceil(totalLiters / 18);
      return {
        wallArea: area.toFixed(2) + ' م²',
        paintableArea: totalArea.toFixed(2) + ' م² (مع الأوجه)',
        liters: totalLiters.toFixed(1) + ' لتر',
        gallons: gallons + ' جالون',
        primer: Math.ceil(area / 15) + ' لتر أساس',
        cost: (gallons * (values.price || 250)).toFixed(0),
      };
    }
  },
  {
    id: 'plaster',
    name: 'اللياسة',
    icon: Layers,
    color: '#d97706',
    category: 'finishing',
    fields: [
      { key: 'length', label: 'محيط/طول الجدران (م)', type: 'number', required: true },
      { key: 'height', label: 'الارتفاع (م)', type: 'number', required: true },
      { key: 'openings', label: 'مساحة الفتحات (م²)', type: 'number', default: 0 },
      { key: 'thickness', label: 'السُمك (سم)', type: 'number', default: 2 },
      { key: 'price', label: 'سعر المتر المربع', type: 'number', default: 35 },
    ],
    calculate: (values) => {
      const area = (values.length * values.height) - (values.openings || 0);
      const waste = area * (MATERIALS_DATABASE.plaster.wastePercent / 100);
      const totalArea = area + waste;
      const thicknessRatio = (values.thickness || 2) / 2;
      const cement = totalArea * MATERIALS_DATABASE.plaster.cementPerSqm * thicknessRatio;
      const sand = totalArea * MATERIALS_DATABASE.plaster.sandPerSqm * thicknessRatio;
      return {
        area: area.toFixed(2) + ' م²',
        totalWithWaste: totalArea.toFixed(2) + ' م²',
        cement: Math.ceil(cement / 50) + ' كيس أسمنت',
        sand: sand.toFixed(2) + ' م³ رمل',
        cost: (totalArea * (values.price || 35)).toFixed(0),
      };
    }
  },
  {
    id: 'insulation',
    name: 'العزل',
    icon: Wind,
    color: '#06b6d4',
    category: 'finishing',
    fields: [
      { key: 'length', label: 'الطول (م)', type: 'number', required: true },
      { key: 'width', label: 'العرض (م)', type: 'number', required: true },
      { key: 'insulationType', label: 'نوع العزل', type: 'select', options: Object.keys(MATERIALS_DATABASE.insulation.types) },
      { key: 'price', label: 'سعر المتر المربع', type: 'number', default: 30 },
    ],
    calculate: (values) => {
      const area = values.length * values.width;
      const waste = area * (MATERIALS_DATABASE.insulation.wastePercent / 100);
      const totalArea = area + waste;
      const typePrice = MATERIALS_DATABASE.insulation.types[values.insulationType]?.defaultPrice || 30;
      return {
        area: area.toFixed(2) + ' م²',
        totalWithWaste: totalArea.toFixed(2) + ' م²',
        rolls: Math.ceil(totalArea / 10) + ' رول (10م²/رول)',
        cost: (totalArea * (values.price || typePrice)).toFixed(0),
      };
    }
  },
  {
    id: 'electrical',
    name: 'الكهرباء',
    icon: Zap,
    color: '#eab308',
    category: 'mep',
    fields: [
      { key: 'lightPoints', label: 'نقاط الإضاءة', type: 'number', default: 0 },
      { key: 'socketPoints', label: 'نقاط البرايز', type: 'number', default: 0 },
      { key: 'acPoints', label: 'نقاط المكيفات', type: 'number', default: 0 },
      { key: 'heaterPoints', label: 'نقاط السخانات', type: 'number', default: 0 },
      { key: 'panels', label: 'لوحات التوزيع', type: 'number', default: 1 },
    ],
    calculate: (values) => {
      const items = MATERIALS_DATABASE.electrical.items;
      const lightCost = (values.lightPoints || 0) * items['نقطة إضاءة'];
      const socketCost = (values.socketPoints || 0) * items['نقطة بريزة'];
      const acCost = (values.acPoints || 0) * items['نقطة مكيف'];
      const heaterCost = (values.heaterPoints || 0) * items['نقطة سخان'];
      const panelCost = (values.panels || 1) * items['لوحة توزيع'];
      const totalPoints = (values.lightPoints || 0) + (values.socketPoints || 0) + (values.acPoints || 0) + (values.heaterPoints || 0);
      const totalCost = lightCost + socketCost + acCost + heaterCost + panelCost;
      return {
        totalPoints: totalPoints + ' نقطة',
        wireLength: (totalPoints * 8) + ' متر سلك تقريباً',
        lightCost: lightCost.toFixed(0) + ' ر.س',
        socketCost: socketCost.toFixed(0) + ' ر.س',
        acCost: acCost.toFixed(0) + ' ر.س',
        cost: totalCost.toFixed(0),
      };
    }
  },
  {
    id: 'plumbing',
    name: 'السباكة',
    icon: Droplets,
    color: '#3b82f6',
    category: 'mep',
    fields: [
      { key: 'coldPoints', label: 'نقاط ماء بارد', type: 'number', default: 0 },
      { key: 'hotPoints', label: 'نقاط ماء حار', type: 'number', default: 0 },
      { key: 'drainPoints', label: 'نقاط صرف', type: 'number', default: 0 },
      { key: 'sinks', label: 'مغاسل', type: 'number', default: 0 },
      { key: 'toilets', label: 'مراحيض', type: 'number', default: 0 },
      { key: 'showers', label: 'دشات', type: 'number', default: 0 },
    ],
    calculate: (values) => {
      const items = MATERIALS_DATABASE.plumbing.items;
      const coldCost = (values.coldPoints || 0) * items['نقطة ماء بارد'];
      const hotCost = (values.hotPoints || 0) * items['نقطة ماء حار'];
      const drainCost = (values.drainPoints || 0) * items['نقطة صرف'];
      const sinkCost = (values.sinks || 0) * items['مغسلة'];
      const toiletCost = (values.toilets || 0) * items['مرحاض'];
      const showerCost = (values.showers || 0) * items['دش'];
      const totalCost = coldCost + hotCost + drainCost + sinkCost + toiletCost + showerCost;
      return {
        totalPoints: ((values.coldPoints || 0) + (values.hotPoints || 0) + (values.drainPoints || 0)) + ' نقطة',
        fixtures: ((values.sinks || 0) + (values.toilets || 0) + (values.showers || 0)) + ' قطعة صحية',
        pipeLength: (((values.coldPoints || 0) + (values.hotPoints || 0)) * 5) + ' متر مواسير تقريباً',
        cost: totalCost.toFixed(0),
      };
    }
  },
  {
    id: 'doors',
    name: 'الأبواب',
    icon: DoorOpen,
    color: '#92400e',
    category: 'finishing',
    fields: [
      { key: 'doorType', label: 'نوع الباب', type: 'select', options: Object.keys(MATERIALS_DATABASE.doors.types) },
      { key: 'quantity', label: 'العدد', type: 'number', required: true },
      { key: 'price', label: 'سعر الباب', type: 'number', default: 800 },
    ],
    calculate: (values) => {
      const typePrice = MATERIALS_DATABASE.doors.types[values.doorType] || 800;
      const total = (values.quantity || 1) * (values.price || typePrice);
      return {
        quantity: (values.quantity || 1) + ' باب',
        unitPrice: (values.price || typePrice) + ' ر.س',
        frames: (values.quantity || 1) + ' حلق باب',
        handles: (values.quantity || 1) + ' كالون',
        cost: total.toFixed(0),
      };
    }
  },
  {
    id: 'windows',
    name: 'النوافذ',
    icon: Square,
    color: '#0891b2',
    category: 'finishing',
    fields: [
      { key: 'width', label: 'العرض (م)', type: 'number', required: true },
      { key: 'height', label: 'الارتفاع (م)', type: 'number', required: true },
      { key: 'quantity', label: 'العدد', type: 'number', required: true },
      { key: 'windowType', label: 'نوع النافذة', type: 'select', options: Object.keys(MATERIALS_DATABASE.windows.pricePerSqm) },
      { key: 'price', label: 'سعر المتر المربع', type: 'number', default: 450 },
    ],
    calculate: (values) => {
      const area = values.width * values.height * (values.quantity || 1);
      const typePrice = MATERIALS_DATABASE.windows.pricePerSqm[values.windowType] || 450;
      return {
        singleArea: (values.width * values.height).toFixed(2) + ' م²',
        totalArea: area.toFixed(2) + ' م²',
        quantity: (values.quantity || 1) + ' نافذة',
        glass: area.toFixed(2) + ' م² زجاج',
        cost: (area * (values.price || typePrice)).toFixed(0),
      };
    }
  },
  {
    id: 'falseCeiling',
    name: 'الأسقف المستعارة',
    icon: Layers,
    color: '#64748b',
    category: 'finishing',
    fields: [
      { key: 'length', label: 'الطول (م)', type: 'number', required: true },
      { key: 'width', label: 'العرض (م)', type: 'number', required: true },
      { key: 'ceilingType', label: 'نوع السقف', type: 'select', options: Object.keys(MATERIALS_DATABASE.falseCeiling.types) },
      { key: 'price', label: 'سعر المتر المربع', type: 'number', default: 85 },
    ],
    calculate: (values) => {
      const area = values.length * values.width;
      const waste = area * (MATERIALS_DATABASE.falseCeiling.wastePercent / 100);
      const totalArea = area + waste;
      const typeInfo = MATERIALS_DATABASE.falseCeiling.types[values.ceilingType] || { price: 85 };
      return {
        area: area.toFixed(2) + ' م²',
        totalWithWaste: totalArea.toFixed(2) + ' م²',
        mainChannels: Math.ceil(values.length / 1.2) * Math.ceil(values.width) + ' متر قناة رئيسية',
        crossChannels: Math.ceil(area / 0.36) + ' قطعة',
        cost: (totalArea * (values.price || typeInfo.price)).toFixed(0),
      };
    }
  },
  {
    id: 'excavation',
    name: 'الحفر',
    icon: Triangle,
    color: '#a16207',
    category: 'structural',
    fields: [
      { key: 'length', label: 'الطول (م)', type: 'number', required: true },
      { key: 'width', label: 'العرض (م)', type: 'number', required: true },
      { key: 'depth', label: 'العمق (م)', type: 'number', required: true },
      { key: 'price', label: 'سعر المتر المكعب', type: 'number', default: 25 },
    ],
    calculate: (values) => {
      const volume = values.length * values.width * values.depth;
      const truckLoads = Math.ceil(volume / 10); // شاحنة 10 م³
      return {
        volume: volume.toFixed(2) + ' م³',
        truckLoads: truckLoads + ' شاحنة (10م³)',
        backfill: (volume * 0.3).toFixed(2) + ' م³ ردم متوقع',
        cost: (volume * (values.price || 25)).toFixed(0),
      };
    }
  },
  {
    id: 'custom',
    name: 'حساب مخصص',
    icon: Ruler,
    color: '#10b981',
    category: 'other',
    fields: [
      { key: 'name', label: 'اسم البند', type: 'text', required: true },
      { key: 'length', label: 'الطول (م)', type: 'number', required: true },
      { key: 'width', label: 'العرض (م)', type: 'number', required: true },
      { key: 'height', label: 'الارتفاع (م)', type: 'number', default: 0 },
      { key: 'quantity', label: 'الكمية', type: 'number', default: 1 },
      { key: 'wastePercent', label: 'نسبة الهدر %', type: 'number', default: 5 },
      { key: 'price', label: 'سعر الوحدة', type: 'number', default: 100 },
    ],
    calculate: (values) => {
      const area = values.length * values.width * (values.quantity || 1);
      const volume = values.height ? values.length * values.width * values.height * (values.quantity || 1) : 0;
      const waste = area * ((values.wastePercent || 5) / 100);
      const totalArea = area + waste;
      return {
        name: values.name || 'بند مخصص',
        area: area.toFixed(2) + ' م²',
        volume: volume ? volume.toFixed(3) + ' م³' : '-',
        totalWithWaste: totalArea.toFixed(2) + ' م²',
        cost: (totalArea * (values.price || 100)).toFixed(0),
      };
    }
  },
];

// تصنيفات الحسابات
const CATEGORIES = {
  structural: { name: 'أعمال هيكلية', icon: Building2, color: '#6b7280' },
  finishing: { name: 'أعمال تشطيبات', icon: PaintBucket, color: '#8b5cf6' },
  mep: { name: 'أعمال كهروميكانيكية', icon: Zap, color: '#eab308' },
  other: { name: 'أخرى', icon: Wrench, color: '#10b981' },
};

// ═══════════════════════════════════════════════════════════════
// المكون الرئيسي
// ═══════════════════════════════════════════════════════════════
const Calculator = ({ darkMode, theme }) => {
  const t = theme;
  
  // States
  const [items, setItems] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showProjectInfo, setShowProjectInfo] = useState(true);
  const [projectInfo, setProjectInfo] = useState({
    name: '',
    client: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [activeCategory, setActiveCategory] = useState('all');

  // إضافة بند جديد
  const addItem = (type) => {
    const calcType = CALCULATION_TYPES.find(t => t.id === type);
    if (!calcType) return;

    const newItem = {
      id: Date.now(),
      type: type,
      typeName: calcType.name,
      icon: calcType.icon,
      color: calcType.color,
      fields: calcType.fields,
      values: calcType.fields.reduce((acc, field) => {
        acc[field.key] = field.default || (field.type === 'number' ? '' : '');
        return acc;
      }, {}),
      results: null,
      expanded: true,
    };

    setItems([...items, newItem]);
    setShowTypeSelector(false);
  };

  // تحديث قيم البند
  const updateItemValue = (itemId, key, value) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const newValues = { ...item.values, [key]: value };
        const calcType = CALCULATION_TYPES.find(t => t.id === item.type);
        const results = calcType ? calcType.calculate(newValues) : null;
        return { ...item, values: newValues, results };
      }
      return item;
    }));
  };

  // حذف بند
  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  // توسيع/طي البند
  const toggleExpand = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, expanded: !item.expanded } : item
    ));
  };

  // حساب الإجمالي
  const totals = useMemo(() => {
    let totalCost = 0;
    let itemsCount = items.length;
    
    items.forEach(item => {
      if (item.results?.cost) {
        totalCost += parseFloat(item.results.cost) || 0;
      }
    });

    return { totalCost, itemsCount };
  }, [items]);

  // نسخ النتائج
  const copyResults = () => {
    let text = '═══════════════════════════════════\n';
    text += '📊 تقرير حاسبة الكميات\n';
    text += '═══════════════════════════════════\n\n';
    
    if (projectInfo.name) {
      text += `📁 المشروع: ${projectInfo.name}\n`;
      if (projectInfo.client) text += `👤 العميل: ${projectInfo.client}\n`;
      if (projectInfo.location) text += `📍 الموقع: ${projectInfo.location}\n`;
      text += `📅 التاريخ: ${projectInfo.date}\n\n`;
    }
    
    text += '───────────────────────────────────\n';
    text += 'البنود والحسابات:\n';
    text += '───────────────────────────────────\n\n';
    
    items.forEach((item, index) => {
      text += `${index + 1}. ${item.typeName}\n`;
      if (item.results) {
        Object.entries(item.results).forEach(([key, value]) => {
          if (key !== 'cost') {
            text += `   • ${value}\n`;
          }
        });
        text += `   💰 التكلفة: ${item.results.cost} ر.س\n`;
      }
      text += '\n';
    });
    
    text += '═══════════════════════════════════\n';
    text += `📊 الإجمالي: ${totals.totalCost.toLocaleString()} ر.س\n`;
    text += `📝 عدد البنود: ${totals.itemsCount}\n`;
    text += '═══════════════════════════════════\n';
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // إعادة تعيين
  const resetAll = () => {
    setItems([]);
    setProjectInfo({
      name: '',
      client: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  // فلترة الأنواع حسب التصنيف
  const filteredTypes = activeCategory === 'all' 
    ? CALCULATION_TYPES 
    : CALCULATION_TYPES.filter(t => t.category === activeCategory);

  // ═══════════════ Styles ═══════════════
  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: `1px solid ${t.border.primary}`,
    background: t.bg.primary,
    color: t.text.primary,
    fontSize: 14,
    fontFamily: 'inherit',
    outline: 'none',
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
  };

  const cardStyle = {
    background: t.bg.secondary,
    borderRadius: 16,
    border: `1px solid ${t.border.primary}`,
    overflow: 'hidden',
    marginBottom: 16,
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* ═══════════════ Header ═══════════════ */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: t.button.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: t.button.glow
          }}>
            <CalcIcon size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: t.text.primary, margin: 0 }}>
              حاسبة الكميات الشاملة
            </h1>
            <p style={{ fontSize: 14, color: t.text.muted, margin: 0 }}>
              حساب المواد والتكاليف لجميع أعمال البناء
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={resetAll}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              borderRadius: 10,
              border: `1px solid ${t.border.primary}`,
              background: t.bg.secondary,
              color: t.text.secondary,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: 'inherit',
            }}
          >
            <RefreshCw size={18} />
            تعيين
          </button>
          <button
            onClick={copyResults}
            disabled={items.length === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              borderRadius: 10,
              border: 'none',
              background: copied ? '#10b981' : items.length === 0 ? t.bg.tertiary : t.button.gradient,
              color: items.length === 0 ? t.text.muted : '#fff',
              cursor: items.length === 0 ? 'not-allowed' : 'pointer',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: 'inherit',
            }}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'تم النسخ' : 'نسخ التقرير'}
          </button>
        </div>
      </div>

      {/* ═══════════════ Project Info ═══════════════ */}
      <div style={cardStyle}>
        <div 
          onClick={() => setShowProjectInfo(!showProjectInfo)}
          style={{ 
            padding: '14px 20px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            cursor: 'pointer',
            background: t.bg.tertiary,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FileText size={20} color={t.text.muted} />
            <span style={{ fontSize: 15, fontWeight: 600, color: t.text.primary }}>
              معلومات المشروع
            </span>
          </div>
          {showProjectInfo ? <ChevronUp size={20} color={t.text.muted} /> : <ChevronDown size={20} color={t.text.muted} />}
        </div>
        
        {showProjectInfo && (
          <div style={{ padding: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: t.text.muted, marginBottom: 6 }}>
                  اسم المشروع
                </label>
                <input
                  type="text"
                  value={projectInfo.name}
                  onChange={(e) => setProjectInfo({ ...projectInfo, name: e.target.value })}
                  placeholder="مثال: فيلا الرياض"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: t.text.muted, marginBottom: 6 }}>
                  العميل
                </label>
                <input
                  type="text"
                  value={projectInfo.client}
                  onChange={(e) => setProjectInfo({ ...projectInfo, client: e.target.value })}
                  placeholder="اسم العميل"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: t.text.muted, marginBottom: 6 }}>
                  الموقع
                </label>
                <input
                  type="text"
                  value={projectInfo.location}
                  onChange={(e) => setProjectInfo({ ...projectInfo, location: e.target.value })}
                  placeholder="موقع المشروع"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: t.text.muted, marginBottom: 6 }}>
                  التاريخ
                </label>
                <input
                  type="date"
                  value={projectInfo.date}
                  onChange={(e) => setProjectInfo({ ...projectInfo, date: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════ Items List ═══════════════ */}
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={item.id} style={{ ...cardStyle, borderRight: `4px solid ${item.color}` }}>
            {/* Item Header */}
            <div 
              style={{ 
                padding: '14px 20px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                background: t.bg.tertiary,
              }}
            >
              <div 
                onClick={() => toggleExpand(item.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', flex: 1 }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: `${item.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={20} color={item.color} />
                </div>
                <div>
                  <span style={{ fontSize: 15, fontWeight: 600, color: t.text.primary }}>
                    {index + 1}. {item.typeName}
                  </span>
                  {item.results?.cost && (
                    <span style={{ 
                      fontSize: 13, 
                      color: item.color, 
                      marginRight: 12,
                      fontWeight: 600 
                    }}>
                      {parseFloat(item.results.cost).toLocaleString()} ر.س
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => toggleExpand(item.id)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    border: 'none',
                    background: t.bg.secondary,
                    color: t.text.muted,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    border: 'none',
                    background: `${t.status?.danger?.text || '#ef4444'}15`,
                    color: t.status?.danger?.text || '#ef4444',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Item Content */}
            {item.expanded && (
              <div style={{ padding: 20 }}>
                {/* Fields */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                  gap: 16,
                  marginBottom: 20
                }}>
                  {item.fields.map(field => (
                    <div key={field.key}>
                      <label style={{ 
                        display: 'block', 
                        fontSize: 13, 
                        color: t.text.muted, 
                        marginBottom: 6 
                      }}>
                        {field.label}
                        {field.required && <span style={{ color: '#ef4444' }}> *</span>}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          value={item.values[field.key] || ''}
                          onChange={(e) => updateItemValue(item.id, field.key, e.target.value)}
                          style={selectStyle}
                        >
                          <option value="">اختر...</option>
                          {field.options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          value={item.values[field.key] || ''}
                          onChange={(e) => updateItemValue(item.id, field.key, 
                            field.type === 'number' ? parseFloat(e.target.value) || '' : e.target.value
                          )}
                          placeholder={field.default?.toString() || '0'}
                          style={inputStyle}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Results */}
                {item.results && (
                  <div style={{ 
                    background: `${item.color}08`,
                    borderRadius: 12,
                    padding: 16,
                    border: `1px solid ${item.color}20`,
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8, 
                      marginBottom: 12 
                    }}>
                      <Info size={16} color={item.color} />
                      <span style={{ fontSize: 14, fontWeight: 600, color: t.text.primary }}>
                        النتائج
                      </span>
                    </div>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
                      gap: 12 
                    }}>
                      {Object.entries(item.results).map(([key, value]) => {
                        if (key === 'cost') return null;
                        return (
                          <div 
                            key={key}
                            style={{
                              padding: '10px 14px',
                              borderRadius: 8,
                              background: t.bg.secondary,
                              border: `1px solid ${t.border.primary}`,
                            }}
                          >
                            <span style={{ fontSize: 14, color: t.text.primary, fontWeight: 500 }}>
                              {value}
                            </span>
                          </div>
                        );
                      })}
                      <div 
                        style={{
                          padding: '10px 14px',
                          borderRadius: 8,
                          background: `${item.color}15`,
                          border: `1px solid ${item.color}30`,
                        }}
                      >
                        <span style={{ fontSize: 12, color: t.text.muted }}>التكلفة: </span>
                        <span style={{ fontSize: 16, color: item.color, fontWeight: 700 }}>
                          {parseFloat(item.results.cost).toLocaleString()} ر.س
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* ═══════════════ Add Item Button ═══════════════ */}
      <button
        onClick={() => setShowTypeSelector(!showTypeSelector)}
        style={{
          width: '100%',
          padding: 18,
          borderRadius: 12,
          border: `2px dashed ${showTypeSelector ? t.button.primary : t.border.primary}`,
          background: showTypeSelector ? `${t.button.primary}10` : 'transparent',
          color: showTypeSelector ? t.button.primary : t.text.muted,
          cursor: 'pointer',
          fontSize: 15,
          fontWeight: 600,
          fontFamily: 'inherit',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          transition: 'all 0.2s',
          marginBottom: 16,
        }}
      >
        {showTypeSelector ? <ChevronUp size={20} /> : <Plus size={20} />}
        {showTypeSelector ? 'إخفاء القائمة' : 'إضافة بند جديد'}
      </button>

      {/* ═══════════════ Type Selector ═══════════════ */}
      {showTypeSelector && (
        <div style={cardStyle}>
          {/* Category Tabs */}
          <div style={{ 
            display: 'flex', 
            gap: 8, 
            padding: '12px 16px',
            borderBottom: `1px solid ${t.border.primary}`,
            overflowX: 'auto',
            flexWrap: 'wrap',
          }}>
            <button
              onClick={() => setActiveCategory('all')}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                background: activeCategory === 'all' ? t.button.gradient : t.bg.tertiary,
                color: activeCategory === 'all' ? '#fff' : t.text.secondary,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}
            >
              الكل
            </button>
            {Object.entries(CATEGORIES).map(([key, cat]) => {
              const CatIcon = cat.icon;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    border: 'none',
                    background: activeCategory === key ? `${cat.color}20` : t.bg.tertiary,
                    color: activeCategory === key ? cat.color : t.text.secondary,
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <CatIcon size={16} />
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Types Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
            gap: 12,
            padding: 16,
          }}>
            {filteredTypes.map(type => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => addItem(type.id)}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    border: `1px solid ${t.border.primary}`,
                    background: t.bg.secondary,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 10,
                    transition: 'all 0.2s',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = type.color;
                    e.currentTarget.style.background = `${type.color}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = t.border.primary;
                    e.currentTarget.style.background = t.bg.secondary;
                  }}
                >
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${type.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Icon size={24} color={type.color} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: t.text.primary }}>
                    {type.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════ Totals ═══════════════ */}
      {items.length > 0 && (
        <div style={{
          ...cardStyle,
          background: `linear-gradient(135deg, ${t.bg.secondary}, ${t.bg.tertiary})`,
          marginTop: 24,
        }}>
          <div style={{ padding: 24 }}>
            <h3 style={{ 
              fontSize: 18, 
              fontWeight: 700, 
              color: t.text.primary, 
              margin: '0 0 20px 0',
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
              <CalcIcon size={22} />
              ملخص التكاليف
            </h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: 16 
            }}>
              <div style={{
                padding: 20,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${t.button.primary}20, ${t.button.primary}10)`,
                border: `1px solid ${t.button.primary}30`,
                textAlign: 'center'
              }}>
                <p style={{ fontSize: 14, color: t.text.muted, margin: '0 0 8px 0' }}>
                  إجمالي التكلفة
                </p>
                <p style={{ 
                  fontSize: 32, 
                  fontWeight: 800, 
                  color: t.button.primary, 
                  margin: 0 
                }}>
                  {totals.totalCost.toLocaleString()}
                  <span style={{ fontSize: 16, fontWeight: 600 }}> ر.س</span>
                </p>
              </div>
              
              <div style={{
                padding: 20,
                borderRadius: 12,
                background: `linear-gradient(135deg, #10b98120, #10b98110)`,
                border: `1px solid #10b98130`,
                textAlign: 'center'
              }}>
                <p style={{ fontSize: 14, color: t.text.muted, margin: '0 0 8px 0' }}>
                  عدد البنود
                </p>
                <p style={{ 
                  fontSize: 32, 
                  fontWeight: 800, 
                  color: '#10b981', 
                  margin: 0 
                }}>
                  {totals.itemsCount}
                  <span style={{ fontSize: 16, fontWeight: 600 }}> بند</span>
                </p>
              </div>
              
              <div style={{
                padding: 20,
                borderRadius: 12,
                background: `linear-gradient(135deg, #8b5cf620, #8b5cf610)`,
                border: `1px solid #8b5cf630`,
                textAlign: 'center'
              }}>
                <p style={{ fontSize: 14, color: t.text.muted, margin: '0 0 8px 0' }}>
                  مع ضريبة 15%
                </p>
                <p style={{ 
                  fontSize: 32, 
                  fontWeight: 800, 
                  color: '#8b5cf6', 
                  margin: 0 
                }}>
                  {(totals.totalCost * 1.15).toLocaleString()}
                  <span style={{ fontSize: 16, fontWeight: 600 }}> ر.س</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ Empty State ═══════════════ */}
      {items.length === 0 && !showTypeSelector && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: t.text.muted,
        }}>
          <CalcIcon size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
          <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px 0', color: t.text.secondary }}>
            لا توجد بنود حتى الآن
          </h3>
          <p style={{ fontSize: 14, margin: 0 }}>
            اضغط على "إضافة بند جديد" لبدء حساب الكميات
          </p>
        </div>
      )}
    </div>
  );
};

export default Calculator;
