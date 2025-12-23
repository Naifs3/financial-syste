
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>حساب الكميات</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        *{font-family:'Cairo',sans-serif;box-sizing:border-box}
        :root{--glass:rgba(255,255,255,0.05);--border:rgba(255,255,255,0.1);--text:#f1f5f9;--text2:#94a3b8;--blue:#60a5fa;--green:#4ade80;--cyan:#22d3ee;--amber:#fbbf24;--red:#f87171;--purple:#c084fc}
        body{background:linear-gradient(135deg,#0f172a,#1e1b4b,#0f172a);min-height:100vh;margin:0;padding:12px}
        .glass{background:var(--glass);border:1px solid var(--border);backdrop-filter:blur(10px)}
        .modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:999;align-items:center;justify-content:center}
        .modal.show{display:flex}
        .num{background:var(--blue);color:#fff;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:700}
        .opt{cursor:pointer;transition:all 0.15s}
        .opt:hover{background:rgba(255,255,255,0.1)}
        .opt.sel{background:rgba(74,222,128,0.2);border-color:var(--green)!important}
        .card{cursor:pointer;transition:all 0.2s}
        .card:hover{background:rgba(255,255,255,0.08);transform:translateY(-2px)}
        select{background:#1e293b;color:var(--text)}
        input[type=number]::-webkit-inner-spin-button{display:none}
        .btn-del{background:rgba(248,113,113,0.2);color:var(--red);border:none;cursor:pointer;padding:4px 12px;border-radius:8px;font-size:12px}
        .btn-del:hover{background:rgba(248,113,113,0.4)}
    </style>
</head>
<body>
<div class="max-w-6xl mx-auto">
    <div class="text-center mb-4">
        <h1 class="text-xl font-bold mb-2" style="color:var(--text)">حساب الكميات</h1>
        <div class="flex justify-center gap-2">
            <button onclick="openItemsModal()" class="px-3 py-1.5 glass rounded-lg text-sm font-bold" style="color:var(--text)">📋 البنود والأسعار</button>
            <button onclick="openProfitModal()" class="px-3 py-1.5 glass rounded-lg text-sm font-bold" style="color:var(--text)">📊 الأرباح</button>
            <button onclick="openProgModal()" class="px-3 py-1.5 glass rounded-lg text-sm font-bold" style="color:var(--text)">⚙️ البرمجة</button>
        </div>
    </div>
    
    <div class="grid lg:grid-cols-12 gap-4">
        <div class="lg:col-span-4 glass rounded-2xl p-4">
            <h2 class="font-bold mb-3" style="color:var(--text)">➕ إضافة</h2>
            
            <div class="grid grid-cols-3 gap-2 mb-3">
                <button onclick="pickType('dry')" id="t-dry" class="p-2 glass rounded-xl text-center" style="color:var(--text)"><div class="text-xl">🏠</div><div class="text-xs">جاف</div></button>
                <button onclick="pickType('wet')" id="t-wet" class="p-2 glass rounded-xl text-center" style="color:var(--text)"><div class="text-xl">🚿</div><div class="text-xs">رطب</div></button>
                <button onclick="pickType('outdoor')" id="t-out" class="p-2 glass rounded-xl text-center" style="color:var(--text)"><div class="text-xl">🌳</div><div class="text-xs">خارجي</div></button>
            </div>
            
            <!-- المساحات والأبعاد في صف واحد -->
            <div class="flex gap-2 mb-3 items-center flex-wrap">
                <select id="plc" class="flex-1 min-w-[80px] rounded-lg p-2 text-sm border" style="border-color:var(--border)"><option value="">المكان</option></select>
                <input type="number" id="area" placeholder="م²" class="w-14 glass rounded-lg p-2 text-sm text-center" style="color:var(--text)">
                <span style="color:var(--text2)">أو</span>
                <input type="number" id="dL" placeholder="ط" oninput="calcArea()" class="w-11 glass rounded-lg p-2 text-sm text-center" style="color:var(--text)">
                <span style="color:var(--text2)">×</span>
                <input type="number" id="dW" placeholder="ع" oninput="calcArea()" class="w-11 glass rounded-lg p-2 text-sm text-center" style="color:var(--text)">
                <span style="color:var(--text2)">×</span>
                <input type="number" id="dH" value="4" class="w-11 glass rounded-lg p-2 text-sm text-center" style="color:var(--text)">
            </div>
            
            <div id="optsList" class="space-y-1 max-h-[240px] overflow-y-auto mb-3"></div>
            
            <button onclick="addSelectedItems()" class="w-full py-2 rounded-xl text-white font-bold text-sm" style="background:var(--blue)">إضافة المحدد</button>
        </div>
        
        <div class="lg:col-span-8 space-y-4">
            <div class="glass rounded-2xl p-4">
                <div class="flex justify-between items-center mb-3">
                    <h2 class="font-bold" style="color:var(--text)">📝 المضاف</h2>
                    <button class="btn-del" id="btnClearAll">🗑️ مسح الكل</button>
                </div>
                <div id="addedList" class="space-y-2 max-h-[260px] overflow-y-auto"></div>
            </div>
            
            <div class="glass rounded-2xl p-4">
                <div class="grid grid-cols-4 gap-2 mb-2">
                    <div class="p-2 glass rounded-xl text-center" style="border:2px solid var(--cyan)"><div class="text-xs" style="color:var(--cyan)">مقاول</div><div class="font-bold text-sm" id="sumCont" style="color:var(--text)">0</div></div>
                    <div class="p-2 glass rounded-xl text-center" style="border:2px solid var(--amber)"><div class="text-xs" style="color:var(--amber)">منفذ</div><div class="font-bold text-sm" id="sumExec" style="color:var(--text)">0</div></div>
                    <div class="p-2 glass rounded-xl text-center" style="border:2px solid var(--green)"><div class="text-xs" style="color:var(--green)">ربح</div><div class="font-bold text-sm" id="sumProf" style="color:var(--green)">0</div></div>
                    <div class="p-2 glass rounded-xl text-center" style="border:2px solid var(--purple)"><div class="text-xs" style="color:var(--purple)">نسبة</div><div class="font-bold text-sm" id="sumPct" style="color:var(--purple)">0%</div></div>
                </div>
                <div class="flex justify-between p-3 glass rounded-xl" style="border:2px solid var(--blue)">
                    <span class="font-bold" style="color:var(--text)">الإجمالي + 15%:</span>
                    <span class="font-bold" id="sumTotal" style="color:var(--text)">0</span>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Edit Modal -->
<div id="editModal" class="modal">
    <div class="glass rounded-2xl p-5 max-w-md w-full mx-4" style="border:2px solid var(--blue);background:rgba(15,23,42,0.98)">
        <div class="flex justify-between mb-4">
            <h2 class="font-bold" style="color:var(--text)">✏️ تحرير</h2>
            <button onclick="closeEditModal()" class="text-xl" style="color:var(--text)">×</button>
        </div>
        <div id="editContent"></div>
        <div class="mt-4 flex justify-between">
            <button class="btn-del" id="btnDeleteGroup" style="padding:8px 16px">🗑️ حذف البند</button>
            <div class="flex gap-2">
                <button onclick="closeEditModal()" class="px-4 py-2 glass rounded-lg text-sm" style="color:var(--text)">إلغاء</button>
                <button onclick="saveGroupEdit()" class="px-4 py-2 rounded-lg text-sm text-white" style="background:var(--blue)">حفظ</button>
            </div>
        </div>
    </div>
</div>

<!-- Items Modal -->
<div id="itemsModal" class="modal">
    <div class="glass rounded-2xl p-5 max-w-3xl w-full mx-4 max-h-[85vh] overflow-y-auto" style="border:2px solid var(--blue);background:rgba(15,23,42,0.98)">
        <div class="flex justify-between mb-4">
            <h2 class="font-bold" style="color:var(--text)">📋 البنود والأسعار</h2>
            <button onclick="closeItemsModal()" class="text-xl" style="color:var(--text)">×</button>
        </div>
        <button id="btnAddMain" class="px-3 py-1.5 rounded-lg text-sm text-white mb-3" style="background:var(--blue)">+ بند رئيسي</button>
        <div id="itemsContent" class="space-y-3"></div>
        <div class="mt-4 flex justify-end gap-2">
            <button onclick="closeItemsModal()" class="px-4 py-2 glass rounded-lg text-sm" style="color:var(--text)">إغلاق</button>
            <button onclick="saveAllItems()" class="px-4 py-2 rounded-lg text-sm text-white" style="background:var(--blue)">حفظ</button>
        </div>
    </div>
</div>

<!-- Profit Modal -->
<div id="profitModal" class="modal">
    <div class="glass rounded-2xl p-5 max-w-md w-full mx-4" style="border:2px solid var(--blue);background:rgba(15,23,42,0.98)">
        <div class="flex justify-between mb-4">
            <h2 class="font-bold" style="color:var(--text)">📊 الأرباح</h2>
            <button onclick="closeProfitModal()" class="text-xl" style="color:var(--text)">×</button>
        </div>
        <div id="profitContent"></div>
    </div>
</div>

<!-- Prog Modal -->
<div id="progModal" class="modal">
    <div class="glass rounded-2xl p-5 max-w-3xl w-full mx-4 max-h-[85vh] overflow-y-auto" style="border:2px solid var(--blue);background:rgba(15,23,42,0.98)">
        <div class="flex justify-between mb-4">
            <h2 class="font-bold" style="color:var(--text)">⚙️ البرمجة</h2>
            <button onclick="closeProgModal()" class="text-xl" style="color:var(--text)">×</button>
        </div>
        <div id="progContent" class="grid md:grid-cols-3 gap-3"></div>
        <div class="mt-4 flex justify-end gap-2">
            <button onclick="closeProgModal()" class="px-4 py-2 glass rounded-lg text-sm" style="color:var(--text)">إلغاء</button>
            <button onclick="saveProgData()" class="px-4 py-2 rounded-lg text-sm text-white" style="background:var(--blue)">حفظ</button>
        </div>
    </div>
</div>

<script>
// Data
const places = {
    dry: ['صالة','مجلس','مكتب','غرفة طعام','ممر','موزع','مخزن','غرفة ملابس','غرفة نوم 1','غرفة نوم 2','غرفة نوم 3'],
    wet: ['دورة مياه 1','دورة مياه 2','دورة مياه 3','مطبخ','غرفة غسيل'],
    outdoor: ['حوش','سطح','حديقة','ممر خارجي','موقف']
};

let prog = {
    dry: {tiles:['remove','screed','install','baseboards'],paint:['indoor','outdoor'],'paint-renew':['all'],gypsum:['install','remove'],plaster:['all']},
    wet: {tiles:['remove','screed','install'],paint:['outdoor'],gypsum:['install'],plaster:['all']},
    outdoor: {tiles:['install','pavement'],paint:['outdoor'],plaster:['all'],construction:['all']}
};

let mains = [
    {k:'tiles',n:'البلاط',c:1},
    {k:'paint',n:'الدهانات',c:1},
    {k:'paint-renew',n:'تجديد دهانات',c:0},
    {k:'gypsum',n:'الجبس',c:1},
    {k:'plaster',n:'اللياسة',c:0},
    {k:'construction',n:'الإنشائيات',c:0}
];

let data = {
    tiles: {
        remove: {n:'إزالة', o:[{n:'متوسطة',e:13,c:8},{n:'كبيرة',e:20,c:12}]},
        screed: {n:'صبة', o:[{n:'شامل مواد',e:47,c:35},{n:'بدون مواد',e:20,c:14}]},
        install: {n:'تبليط', o:[{n:'كبير',e:33,c:22},{n:'صغير',e:25,c:17}]},
        baseboards: {n:'نعلات', o:[{n:'تركيب',e:13,c:8}]},
        pavement: {n:'رصيف', o:[{n:'بلدورات',e:33,c:22},{n:'بلاط',e:33,c:22}]}
    },
    paint: {
        indoor: {n:'داخلية', o:[{n:'جوتن',e:21,c:14},{n:'الجزيرة',e:20,c:13},{n:'عسيب',e:19,c:12},{n:'بدون مواد',e:12,c:8}]},
        outdoor: {n:'خارجية', o:[{n:'رشة',e:19,c:12},{n:'بروفايل جوتن',e:33,c:22},{n:'بروفايل الجزيرة',e:33,c:22}]}
    },
    'paint-renew': {
        all: {n:'تجديد', o:[{n:'إزالة',e:5,c:3},{n:'جوتن',e:16,c:10},{n:'الجزيرة',e:15,c:9}]}
    },
    gypsum: {
        install: {n:'تركيب', o:[{n:'جبسمبورد',e:60,c:40},{n:'بلدي',e:53,c:35}]},
        remove: {n:'إزالة', o:[{n:'إزالة',e:5,c:3}]}
    },
    plaster: {
        all: {n:'لياسة', o:[{n:'قدة وزاوية',e:13,c:8},{n:'ودع وقدة',e:20,c:13}]}
    },
    construction: {
        all: {n:'إنشائيات', o:[{n:'عظم+مواد',e:998,c:750},{n:'عظم فقط',e:665,c:500}]}
    }
};

// State
let currentType = '';
let selectedOpts = {};
let groupedItems = {};
let currentEditKey = null;

// Helpers
const $ = id => document.getElementById(id);
const fmt = n => n.toLocaleString('en', {minimumFractionDigits:2, maximumFractionDigits:2});

function calcArea() {
    const l = parseFloat($('dL').value) || 0;
    const w = parseFloat($('dW').value) || 0;
    if (l > 0 && w > 0) {
        $('area').value = (l * w).toFixed(2);
    }
}

// Type Selection
function pickType(t) {
    currentType = t;
    selectedOpts = {};
    
    ['dry', 'wet', 'outdoor'].forEach(x => {
        const btn = $(x === 'outdoor' ? 't-out' : 't-' + x);
        btn.style.border = '2px solid transparent';
        btn.style.background = 'var(--glass)';
    });
    
    const btn = $(t === 'outdoor' ? 't-out' : 't-' + t);
    const clr = {dry: 'var(--blue)', wet: 'var(--cyan)', outdoor: 'var(--green)'}[t];
    btn.style.border = '2px solid ' + clr;
    btn.style.background = clr + '22';
    
    $('plc').innerHTML = '<option value="">المكان</option>' + places[t].map(p => '<option>' + p + '</option>').join('');
    
    renderOptions();
}

// Render Options - مع أرقام متسلسلة و ريال/م²
function renderOptions() {
    const items = prog[currentType] || {};
    if (!Object.keys(items).length) {
        $('optsList').innerHTML = '<p class="text-center py-4 text-sm" style="color:var(--text2)">لا توجد بنود</p>';
        return;
    }
    
    let html = '';
    let num = 0;
    
    Object.entries(items).forEach(([mk, cats]) => {
        const m = mains.find(x => x.k === mk);
        if (!m || !data[mk]) return;
        
        cats.forEach(ck => {
            const cat = data[mk][ck];
            if (!cat) return;
            
            cat.o.forEach((o, oi) => {
                num++;
                const key = mk + '|' + ck + '|' + oi;
                const isSel = selectedOpts[key];
                
                html += '<div data-key="' + key + '" class="opt flex justify-between items-center p-2 rounded-lg text-sm ' + (isSel ? 'sel' : '') + '" style="background:var(--glass);border:1px solid ' + (isSel ? 'var(--green)' : 'var(--border)') + ';color:var(--text)">';
                html += '<span><span class="num">' + num + '</span> ' + m.n + ' - ' + o.n + '</span>';
                html += '<span style="color:var(--text2)">' + o.e + ' ريال/م²</span></div>';
            });
        });
    });
    
    $('optsList').innerHTML = html;
    
    // إضافة event listeners للخيارات
    document.querySelectorAll('#optsList .opt').forEach(el => {
        el.addEventListener('click', function() {
            const key = this.dataset.key;
            if (selectedOpts[key]) {
                delete selectedOpts[key];
                this.classList.remove('sel');
                this.style.borderColor = 'var(--border)';
            } else {
                selectedOpts[key] = true;
                this.classList.add('sel');
                this.style.borderColor = 'var(--green)';
            }
        });
    });
}

// Add Selected Items
function addSelectedItems() {
    if (!currentType) { alert('اختر نوع المكان'); return; }
    
    const place = $('plc').value;
    if (!place) { alert('اختر المكان'); return; }
    
    const area = parseFloat($('area').value);
    if (!area || area <= 0) { alert('أدخل المساحة'); return; }
    
    const keys = Object.keys(selectedOpts);
    if (!keys.length) { alert('اختر بنود'); return; }
    
    const l = parseFloat($('dL').value) || 0;
    const w = parseFloat($('dW').value) || 0;
    const h = parseFloat($('dH').value) || 4;
    
    let floorFormula = '';
    let wallFormula = '';
    let wallArea = 0;
    
    if (l > 0 && w > 0) {
        floorFormula = l + '×' + w + '=' + area;
        wallArea = 2 * (l + w) * h;
        wallFormula = '2(' + l + '+' + w + ')×' + h + '=' + wallArea.toFixed(0);
    }
    
    keys.forEach(key => {
        const [mk, ck, oi] = key.split('|');
        const m = mains.find(x => x.k === mk);
        const cat = data[mk][ck];
        const opt = cat.o[parseInt(oi)];
        
        const isWall = ['indoor', 'outdoor'].includes(ck) || ['paint', 'paint-renew', 'plaster', 'gypsum'].includes(mk);
        const useArea = isWall && wallArea > 0 ? wallArea : area;
        const formula = isWall && wallFormula ? wallFormula : floorFormula;
        const fType = isWall ? 'wall' : 'floor';
        
        if (!groupedItems[key]) {
            groupedItems[key] = {
                mainName: m.n,
                catName: cat.n,
                optName: opt.n,
                execPrice: opt.e,
                contPrice: opt.c,
                places: []
            };
        }
        
        groupedItems[key].places.push({
            name: place,
            area: useArea,
            formula: formula,
            fType: fType
        });
    });
    
    selectedOpts = {};
    renderOptions();
    renderGroupedItems();
    alert('✅ تمت الإضافة');
}

// Render Grouped Items - مع العملية الحسابية
function renderGroupedItems() {
    const keys = Object.keys(groupedItems);
    
    if (!keys.length) {
        $('addedList').innerHTML = '<div class="text-center py-6 glass rounded-xl text-sm" style="color:var(--text2)">لا توجد بنود</div>';
        $('sumCont').textContent = '0';
        $('sumExec').textContent = '0';
        $('sumProf').textContent = '0';
        $('sumPct').textContent = '0%';
        $('sumTotal').textContent = '0';
        return;
    }
    
    let totalCont = 0;
    let totalExec = 0;
    let html = '';
    
    keys.forEach((key, idx) => {
        const g = groupedItems[key];
        const totalArea = g.places.reduce((sum, p) => sum + p.area, 0);
        const execTotal = totalArea * g.execPrice;
        const contTotal = totalArea * g.contPrice;
        const profit = execTotal - contTotal;
        
        totalCont += contTotal;
        totalExec += execTotal;
        
        const tags = g.places.map(p => {
            const icon = p.fType === 'wall' ? '🧱' : '🏠';
            const fmHtml = p.formula ? '<span style="font-size:10px;background:' + (p.fType === 'wall' ? 'rgba(74,222,128,0.2)' : 'rgba(192,132,252,0.2)') + ';padding:1px 4px;border-radius:4px;color:' + (p.fType === 'wall' ? 'var(--green)' : 'var(--purple)') + '">' + icon + ' ' + p.formula + '</span>' : '';
            return '<span style="display:inline-flex;align-items:center;gap:4px;background:rgba(96,165,250,0.1);padding:2px 8px;border-radius:99px;font-size:11px;color:var(--text);margin:2px">' + p.name + ' ' + fmHtml + '</span>';
        }).join('');
        
        html += '<div class="card glass rounded-xl p-3" data-key="' + key + '">';
        html += '<div class="flex gap-2 mb-2 text-sm"><span class="font-bold" style="color:var(--text)">' + g.mainName + '</span><span style="color:var(--text2)">›</span><span style="color:var(--blue)">' + g.optName + '</span></div>';
        html += '<div class="flex flex-wrap mb-2">' + tags + '</div>';
        html += '<div class="grid grid-cols-3 gap-2 text-xs">';
        html += '<div class="glass rounded p-1.5 text-center"><div style="color:var(--text2)">منفذ</div><div class="font-bold" style="color:var(--amber)">' + fmt(execTotal) + '</div></div>';
        html += '<div class="glass rounded p-1.5 text-center"><div style="color:var(--text2)">مقاول</div><div class="font-bold" style="color:var(--cyan)">' + fmt(contTotal) + '</div></div>';
        html += '<div class="glass rounded p-1.5 text-center"><div style="color:var(--text2)">ربح</div><div class="font-bold" style="color:' + (profit >= 0 ? 'var(--green)' : 'var(--red)') + '">' + fmt(profit) + '</div></div>';
        html += '</div></div>';
    });
    
    $('addedList').innerHTML = html;
    
    // إضافة event listeners للكروت
    document.querySelectorAll('#addedList .card').forEach(el => {
        el.addEventListener('click', function() {
            openEditModal(this.dataset.key);
        });
    });
    
    const totalProfit = totalExec - totalCont;
    const pct = totalCont > 0 ? ((totalProfit / totalCont) * 100).toFixed(1) : 0;
    
    $('sumCont').textContent = fmt(totalCont);
    $('sumExec').textContent = fmt(totalExec);
    $('sumProf').textContent = fmt(totalProfit);
    $('sumProf').style.color = totalProfit >= 0 ? 'var(--green)' : 'var(--red)';
    $('sumPct').textContent = pct + '%';
    $('sumTotal').textContent = fmt(totalExec * 1.15) + ' ريال';
}

// ==================== EDIT MODAL ====================
function openEditModal(key) {
    currentEditKey = key;
    const g = groupedItems[key];
    
    if (!g) {
        alert('البند غير موجود');
        return;
    }
    
    let html = '<div class="glass rounded-lg p-2 mb-3 text-sm font-bold" style="color:var(--text)">' + g.mainName + ' › ' + g.optName + '</div>';
    
    html += '<div class="grid grid-cols-2 gap-2 mb-3">';
    html += '<div><label class="text-xs" style="color:var(--amber)">منفذ</label><input type="number" id="editExec" value="' + g.execPrice + '" class="w-full glass rounded p-2 text-sm" style="color:var(--text);border:1px solid var(--amber)"></div>';
    html += '<div><label class="text-xs" style="color:var(--cyan)">مقاول</label><input type="number" id="editCont" value="' + g.contPrice + '" class="w-full glass rounded p-2 text-sm" style="color:var(--text);border:1px solid var(--cyan)"></div>';
    html += '</div>';
    
    html += '<div class="space-y-1 mb-2" id="placesContainer">';
    g.places.forEach((p, i) => {
        html += '<div class="flex gap-1 items-center">';
        html += '<select data-place="' + i + '" class="flex-1 rounded p-1.5 text-sm" style="border:1px solid var(--border)">' + getAllPlaceOptions(p.name) + '</select>';
        html += '<input type="number" data-area="' + i + '" value="' + p.area.toFixed(0) + '" class="w-16 glass rounded p-1.5 text-center text-sm" style="color:var(--text)">';
        if (g.places.length > 1) {
            html += '<button class="remove-place-btn" data-index="' + i + '" style="color:var(--red);font-size:16px;cursor:pointer;background:none;border:none">×</button>';
        }
        html += '</div>';
    });
    html += '</div>';
    
    html += '<button id="btnAddPlace" class="w-full py-1.5 glass rounded text-sm" style="color:var(--blue);cursor:pointer">+ مكان</button>';
    
    $('editContent').innerHTML = html;
    $('editModal').classList.add('show');
    
    // إضافة event listeners
    document.getElementById('btnAddPlace').addEventListener('click', addNewPlace);
    document.querySelectorAll('.remove-place-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            removePlace(parseInt(this.dataset.index));
        });
    });
}

function closeEditModal() {
    $('editModal').classList.remove('show');
    currentEditKey = null;
}

function getAllPlaceOptions(selected) {
    let html = '';
    const labels = {dry: 'جاف', wet: 'رطب', outdoor: 'خارجي'};
    Object.entries(labels).forEach(([t, label]) => {
        html += '<optgroup label="' + label + '">';
        places[t].forEach(p => {
            html += '<option' + (p === selected ? ' selected' : '') + '>' + p + '</option>';
        });
        html += '</optgroup>';
    });
    return html;
}

function saveGroupEdit() {
    if (!currentEditKey || !groupedItems[currentEditKey]) return;
    
    const g = groupedItems[currentEditKey];
    g.execPrice = parseFloat($('editExec').value) || g.execPrice;
    g.contPrice = parseFloat($('editCont').value) || g.contPrice;
    
    g.places.forEach((p, i) => {
        const placeSelect = document.querySelector('[data-place="' + i + '"]');
        const areaInput = document.querySelector('[data-area="' + i + '"]');
        if (placeSelect) p.name = placeSelect.value;
        if (areaInput) p.area = parseFloat(areaInput.value) || p.area;
    });
    
    closeEditModal();
    renderGroupedItems();
}

function addNewPlace() {
    if (!currentEditKey || !groupedItems[currentEditKey]) return;
    
    const g = groupedItems[currentEditKey];
    g.execPrice = parseFloat($('editExec').value) || g.execPrice;
    g.contPrice = parseFloat($('editCont').value) || g.contPrice;
    
    g.places.forEach((p, i) => {
        const placeSelect = document.querySelector('[data-place="' + i + '"]');
        const areaInput = document.querySelector('[data-area="' + i + '"]');
        if (placeSelect) p.name = placeSelect.value;
        if (areaInput) p.area = parseFloat(areaInput.value) || p.area;
    });
    
    g.places.push({name: places.dry[0], area: 0, formula: '', fType: 'floor'});
    openEditModal(currentEditKey);
}

function removePlace(index) {
    if (!currentEditKey || !groupedItems[currentEditKey]) return;
    if (groupedItems[currentEditKey].places.length <= 1) return;
    
    const g = groupedItems[currentEditKey];
    g.execPrice = parseFloat($('editExec').value) || g.execPrice;
    g.contPrice = parseFloat($('editCont').value) || g.contPrice;
    
    g.places.forEach((p, i) => {
        const placeSelect = document.querySelector('[data-place="' + i + '"]');
        const areaInput = document.querySelector('[data-area="' + i + '"]');
        if (placeSelect) p.name = placeSelect.value;
        if (areaInput) p.area = parseFloat(areaInput.value) || p.area;
    });
    
    g.places.splice(index, 1);
    openEditModal(currentEditKey);
}

// ==================== ITEMS MODAL ====================
function openItemsModal() {
    $('itemsModal').classList.add('show');
    renderItemsList();
}

function closeItemsModal() {
    $('itemsModal').classList.remove('show');
}

function renderItemsList() {
    let html = '';
    let num = 0;
    
    mains.forEach(m => {
        const d = data[m.k] || {};
        
        html += '<div class="glass rounded-xl p-3">';
        html += '<div class="flex justify-between mb-2"><span class="font-bold" style="color:var(--text)">' + m.n + '</span><button class="delete-main-btn text-xs" data-key="' + m.k + '" style="color:var(--red);cursor:pointer;background:none;border:none">حذف</button></div>';
        
        Object.entries(d).forEach(([ck, cat]) => {
            html += '<div class="glass rounded-lg p-2 mb-2">';
            html += '<input type="text" value="' + cat.n + '" data-main="' + m.k + '" data-cat="' + ck + '" class="w-full glass rounded p-1 text-sm font-bold mb-1" style="color:var(--blue)">';
            
            cat.o.forEach((o, oi) => {
                num++;
                html += '<div class="flex gap-1 items-center mb-1">';
                html += '<span class="num">' + num + '</span>';
                html += '<input type="text" value="' + o.n + '" data-main="' + m.k + '" data-cat="' + ck + '" data-opt="' + oi + '" data-field="n" class="flex-1 glass rounded p-1 text-xs" style="color:var(--text)">';
                html += '<input type="number" value="' + o.e + '" data-main="' + m.k + '" data-cat="' + ck + '" data-opt="' + oi + '" data-field="e" class="w-12 glass rounded p-1 text-center text-xs" style="color:var(--amber);border:1px solid var(--amber)">';
                html += '<input type="number" value="' + o.c + '" data-main="' + m.k + '" data-cat="' + ck + '" data-opt="' + oi + '" data-field="c" class="w-12 glass rounded p-1 text-center text-xs" style="color:var(--cyan);border:1px solid var(--cyan)">';
                html += '<button class="delete-opt-btn text-xs" data-main="' + m.k + '" data-cat="' + ck + '" data-opt="' + oi + '" style="color:var(--red);cursor:pointer;background:none;border:none">×</button>';
                html += '</div>';
            });
            
            html += '<button class="add-opt-btn text-xs" data-main="' + m.k + '" data-cat="' + ck + '" style="color:var(--blue);cursor:pointer;background:none;border:none">+ خيار</button>';
            html += '</div>';
        });
        
        html += '<button class="add-sub-btn text-xs" data-main="' + m.k + '" style="color:var(--blue);cursor:pointer;background:none;border:none">+ فرعي</button>';
        html += '</div>';
    });
    
    $('itemsContent').innerHTML = html;
    
    // إضافة event listeners
    document.querySelectorAll('.delete-main-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            deleteMainItem(this.dataset.key);
        });
    });
    
    document.querySelectorAll('.delete-opt-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            deleteOption(this.dataset.main, this.dataset.cat, parseInt(this.dataset.opt));
        });
    });
    
    document.querySelectorAll('.add-opt-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            addNewOption(this.dataset.main, this.dataset.cat);
        });
    });
    
    document.querySelectorAll('.add-sub-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            addNewSubItem(this.dataset.main);
        });
    });
}

function saveAllItems() {
    document.querySelectorAll('#itemsContent input[data-main]').forEach(inp => {
        const mk = inp.dataset.main;
        const ck = inp.dataset.cat;
        const oi = inp.dataset.opt;
        const field = inp.dataset.field;
        
        if (oi === undefined) {
            if (data[mk] && data[mk][ck]) {
                data[mk][ck].n = inp.value;
            }
        } else {
            if (data[mk] && data[mk][ck] && data[mk][ck].o[oi]) {
                if (field === 'n') data[mk][ck].o[oi].n = inp.value;
                else if (field === 'e') data[mk][ck].o[oi].e = parseFloat(inp.value) || 0;
                else if (field === 'c') data[mk][ck].o[oi].c = parseFloat(inp.value) || 0;
            }
        }
    });
    
    closeItemsModal();
    if (currentType) renderOptions();
    renderGroupedItems();
    alert('✅ تم الحفظ');
}

function addNewMainItem() {
    const name = prompt('اسم البند الرئيسي:');
    if (!name || !name.trim()) return;
    
    const key = 'main_' + Date.now();
    mains.push({k: key, n: name.trim(), c: 1});
    data[key] = {
        default: {n: 'فرعي', o: [{n: 'خيار', e: 0, c: 0}]}
    };
    
    renderItemsList();
}

function deleteMainItem(key) {
    if (!confirm('حذف هذا البند الرئيسي؟')) return;
    
    mains = mains.filter(m => m.k !== key);
    delete data[key];
    ['dry', 'wet', 'outdoor'].forEach(t => {
        if (prog[t] && prog[t][key]) delete prog[t][key];
    });
    
    renderItemsList();
    if (currentType) renderOptions();
}

function addNewSubItem(mainKey) {
    const key = 'sub_' + Date.now();
    if (!data[mainKey]) data[mainKey] = {};
    data[mainKey][key] = {n: 'جديد', o: [{n: 'خيار', e: 0, c: 0}]};
    renderItemsList();
}

function addNewOption(mainKey, catKey) {
    data[mainKey][catKey].o.push({n: 'خيار جديد', e: 0, c: 0});
    renderItemsList();
}

function deleteOption(mainKey, catKey, optIndex) {
    data[mainKey][catKey].o.splice(optIndex, 1);
    renderItemsList();
}

// ==================== PROFIT MODAL ====================
function openProfitModal() {
    const keys = Object.keys(groupedItems);
    let totalCont = 0;
    let totalExec = 0;
    let byMain = {};
    
    keys.forEach(key => {
        const g = groupedItems[key];
        const area = g.places.reduce((s, p) => s + p.area, 0);
        totalCont += area * g.contPrice;
        totalExec += area * g.execPrice;
        
        if (!byMain[g.mainName]) byMain[g.mainName] = {e: 0, c: 0};
        byMain[g.mainName].e += area * g.execPrice;
        byMain[g.mainName].c += area * g.contPrice;
    });
    
    const totalProfit = totalExec - totalCont;
    const pct = totalCont > 0 ? ((totalProfit / totalCont) * 100).toFixed(1) : 0;
    
    let html = '<div class="grid grid-cols-2 gap-2 mb-3">';
    html += '<div class="p-2 glass rounded text-center"><div class="text-xs" style="color:var(--cyan)">مقاول</div><div class="font-bold" style="color:var(--cyan)">' + fmt(totalCont) + '</div></div>';
    html += '<div class="p-2 glass rounded text-center"><div class="text-xs" style="color:var(--amber)">منفذ</div><div class="font-bold" style="color:var(--amber)">' + fmt(totalExec) + '</div></div>';
    html += '<div class="p-2 glass rounded text-center"><div class="text-xs" style="color:var(--green)">ربح</div><div class="font-bold" style="color:' + (totalProfit >= 0 ? 'var(--green)' : 'var(--red)') + '">' + fmt(totalProfit) + '</div></div>';
    html += '<div class="p-2 glass rounded text-center"><div class="text-xs" style="color:var(--purple)">نسبة</div><div class="font-bold" style="color:var(--purple)">' + pct + '%</div></div>';
    html += '</div>';
    
    html += '<div class="space-y-1 mb-3">';
    Object.entries(byMain).forEach(([name, d]) => {
        const p = d.e - d.c;
        html += '<div class="flex justify-between p-2 glass rounded text-sm"><span style="color:var(--text)">' + name + '</span><span style="color:' + (p >= 0 ? 'var(--green)' : 'var(--red)') + '">' + fmt(p) + '</span></div>';
    });
    html += '</div>';
    
    html += '<button onclick="closeProfitModal()" class="w-full py-2 glass rounded text-sm" style="color:var(--text)">إغلاق</button>';
    
    $('profitContent').innerHTML = html || '<p class="text-center py-4" style="color:var(--text2)">لا توجد بنود</p>';
    $('profitModal').classList.add('show');
}

function closeProfitModal() {
    $('profitModal').classList.remove('show');
}

// ==================== PROG MODAL ====================
function openProgModal() {
    const types = {dry: '🏠 جاف', wet: '🚿 رطب', outdoor: '🌳 خارجي'};
    let html = '';
    
    Object.entries(types).forEach(([t, label]) => {
        html += '<div class="glass rounded-xl p-3"><h3 class="font-bold mb-2 text-sm" style="color:var(--text)">' + label + '</h3>';
        
        mains.forEach(m => {
            const d = data[m.k];
            if (!d) return;
            
            const isOn = prog[t] && prog[t][m.k];
            
            html += '<div class="mb-2">';
            html += '<label class="flex items-center gap-2 p-1.5 glass rounded cursor-pointer text-sm">';
            html += '<input type="checkbox" ' + (isOn ? 'checked' : '') + ' data-type="' + t + '" data-main="' + m.k + '" data-ismain="1">';
            html += '<span class="font-bold" style="color:var(--text)">' + m.n + '</span></label>';
            
            if (m.c) {
                html += '<div class="mr-4 mt-1 space-y-1 ' + (isOn ? '' : 'hidden') + '" id="prog-' + t + '-' + m.k + '">';
                Object.keys(d).forEach(ck => {
                    const isChecked = isOn && prog[t][m.k] && prog[t][m.k].includes(ck);
                    html += '<label class="flex items-center gap-2 text-xs cursor-pointer">';
                    html += '<input type="checkbox" ' + (isChecked ? 'checked' : '') + ' data-type="' + t + '" data-main="' + m.k + '" data-cat="' + ck + '">';
                    html += '<span style="color:var(--text2)">' + d[ck].n + '</span></label>';
                });
                html += '</div>';
            }
            
            html += '</div>';
        });
        
        html += '</div>';
    });
    
    $('progContent').innerHTML = html;
    $('progModal').classList.add('show');
    
    // إضافة event listeners للـ checkboxes الرئيسية
    document.querySelectorAll('[data-ismain="1"]').forEach(cb => {
        cb.addEventListener('change', function() {
            const t = this.dataset.type;
            const mk = this.dataset.main;
            const div = $('prog-' + t + '-' + mk);
            if (div) {
                div.classList.toggle('hidden', !this.checked);
                if (!this.checked) {
                    div.querySelectorAll('input').forEach(inp => inp.checked = false);
                }
            }
        });
    });
}

function closeProgModal() {
    $('progModal').classList.remove('show');
}

function saveProgData() {
    prog = {dry: {}, wet: {}, outdoor: {}};
    
    ['dry', 'wet', 'outdoor'].forEach(type => {
        mains.forEach(m => {
            const mainCb = document.querySelector('[data-type="' + type + '"][data-main="' + m.k + '"][data-ismain]');
            if (!mainCb || !mainCb.checked) return;
            
            if (m.c) {
                const cats = [];
                document.querySelectorAll('[data-type="' + type + '"][data-main="' + m.k + '"][data-cat]').forEach(cb => {
                    if (cb.checked) cats.push(cb.dataset.cat);
                });
                if (cats.length) prog[type][m.k] = cats;
            } else {
                prog[type][m.k] = ['all'];
            }
        });
    });
    
    closeProgModal();
    if (currentType) renderOptions();
    alert('✅ تم الحفظ');
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', function() {
    // زر مسح الكل
    $('btnClearAll').addEventListener('click', function() {
        const keys = Object.keys(groupedItems);
        if (keys.length === 0) {
            alert('لا توجد بنود للمسح');
            return;
        }
        if (confirm('هل تريد مسح جميع البنود؟')) {
            groupedItems = {};
            renderGroupedItems();
            alert('تم المسح');
        }
    });
    
    // زر حذف البند
    $('btnDeleteGroup').addEventListener('click', function() {
        if (!currentEditKey) {
            alert('لا يوجد بند محدد');
            return;
        }
        if (confirm('هل تريد حذف هذا البند؟')) {
            delete groupedItems[currentEditKey];
            closeEditModal();
            renderGroupedItems();
            alert('تم الحذف');
        }
    });
    
    // زر إضافة بند رئيسي
    $('btnAddMain').addEventListener('click', addNewMainItem);
    
    renderGroupedItems();
});
</script>
</body>
</html>
