document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM Ready');

    var savedTheme = localStorage.getItem('padilsync_theme') || 'light';
    document.body.className = savedTheme;

    function applyThemeColors(theme) {
        try {
            var navbar = document.getElementById('navbar');
            var infoBanner = document.getElementById('infoBanner');
            var actBadge = document.getElementById('actBadge');
            var timeCard = document.getElementById('timeCard');
            var batteryCard = document.getElementById('batteryCard');
            var brandBadge = document.getElementById('brandBadge');
            var todayCard = document.getElementById('todayCard');
            var todayCardBulk = document.getElementById('todayCardBulk');
            var userCard = document.getElementById('userCard');
            var verifBadge = document.getElementById('verifBadge');
            var bulkBadge = document.getElementById('bulkBadge');

            if (theme === 'dark') {
                if(navbar){navbar.style.background='#111827';navbar.style.borderColor='#1e3a8a';}
                if(infoBanner){infoBanner.style.background='#3b82f6';infoBanner.style.color='white';infoBanner.style.borderColor='#1e3a8a';}
                [actBadge, verifBadge, bulkBadge].forEach(function(b){if(b){b.style.background='#3b82f6';b.style.color='white';b.style.borderColor='#1e3a8a';}});
                if(timeCard){timeCard.style.background='#3b82f6';timeCard.style.color='white';}
                if(batteryCard){batteryCard.style.background='#1e3a8a';batteryCard.style.color='white';}
                if(brandBadge){brandBadge.style.background='#3b82f6';brandBadge.style.color='white';brandBadge.style.borderColor='#1e3a8a';}
                [todayCard, todayCardBulk].forEach(function(c){if(c){c.style.background='#3b82f6';c.style.color='white';c.style.borderColor='#1e3a8a';}});
                if(userCard) userCard.style.background='linear-gradient(135deg,#1e40af,#3b82f6)';
            } else {
                if(navbar){navbar.style.background='white';navbar.style.borderColor='#0f172a';}
                if(infoBanner){infoBanner.style.background='#fde047';infoBanner.style.color='#0f172a';infoBanner.style.borderColor='#000';}
                [actBadge, verifBadge, bulkBadge].forEach(function(b){if(b){b.style.background='#fde047';b.style.color='#0f172a';b.style.borderColor='#000';}});
                if(timeCard){timeCard.style.background='#fde047';timeCard.style.color='#0f172a';}
                if(batteryCard){batteryCard.style.background='#bbf7d0';batteryCard.style.color='#0f172a';}
                if(brandBadge){brandBadge.style.background='#fde047';brandBadge.style.color='#0f172a';brandBadge.style.borderColor='#0f172a';}
                [todayCard, todayCardBulk].forEach(function(c){if(c){c.style.background='#fde047';c.style.color='#0f172a';c.style.borderColor='#000';}});
                if(userCard) userCard.style.background='linear-gradient(135deg,#a3e635,#22d3ee)';
            }
        } catch(e) { console.error('Theme error:', e); }
    }
    setTimeout(function(){ applyThemeColors(document.body.className); }, 100);

    var themeSwitch = document.getElementById('themeSwitch');
    if (themeSwitch) themeSwitch.addEventListener('click', function() {
        var current = document.body.className;
        var newTheme = current === 'light' ? 'dark' : 'light';
        document.body.className = newTheme;
        localStorage.setItem('padilsync_theme', newTheme);
        applyThemeColors(newTheme);
    });

    function updateClock() {
        try {
            var now = new Date();
            var h = String(now.getHours()).padStart(2, '0');
            var m = String(now.getMinutes()).padStart(2, '0');
            var s = String(now.getSeconds()).padStart(2, '0');
            document.getElementById('clock').innerText = h + ':' + m + ':' + s;
            var days = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
            var months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
            document.getElementById('date').innerText = days[now.getDay()] + ', ' + now.getDate() + ' ' + months[now.getMonth()];
        } catch(e) { console.error('Clock error:', e); }
    }
    setInterval(updateClock, 1000);
    updateClock();

    try {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(function(battery) {
                function updateBatteryInfo() {
                    document.getElementById('battery').innerText = Math.round(battery.level * 100) + '%';
                }
                updateBatteryInfo();
                battery.addEventListener('levelchange', updateBatteryInfo);
            });
        }
    } catch(e) { console.error('Battery error:', e); }

    function switchTab(tabName) {
    try {
        document.querySelectorAll('.tab-content').forEach(function(el){ el.classList.remove('active'); });
        var target = document.getElementById('tab-' + tabName);
        if (target) {
            target.classList.add('active');
            // 🔥 RESTART ANIMASI
            var slideElements = target.querySelectorAll('.slide-up');
            slideElements.forEach(function(el) {
                el.style.animation = 'none';
                el.offsetHeight; // trigger reflow
                el.style.animation = '';
            });
        }
        document.querySelectorAll('.nav-btn').forEach(function(el){ el.classList.remove('active'); });
        var navBtn = document.querySelector('.nav-btn[data-tab="' + tabName + '"]');
        if (navBtn) navBtn.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch(e) { console.error('SwitchTab error:', e); }
    }

    document.querySelectorAll('.nav-btn').forEach(function(btn){
        btn.addEventListener('click', function(){
            switchTab(this.getAttribute('data-tab'));
        });
    });

    var btnVerifTop = document.getElementById('btnVerifTop');
    if (btnVerifTop) btnVerifTop.addEventListener('click', function(){ switchTab('verif'); });

    var btnTempelLink = document.getElementById('btnTempelLink');
    if (btnTempelLink) btnTempelLink.addEventListener('click', function(){ switchTab('verif'); });

    var btnKembali = document.getElementById('btnKembali');
    if (btnKembali) btnKembali.addEventListener('click', function(){ switchTab('activation'); });

    async function callAPI(endpoint, payload) {
        var response = await fetch('/api' + endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        var text = await response.text();
        var data;
        try { data = JSON.parse(text); } catch (e) { data = { raw: text }; }
        if (!response.ok) throw new Error(data.error || data.message || data.raw || 'HTTP ' + response.status);
        return data;
    }

    var globalTotal = 0, globalToday = 0;
    var todayKey = new Date().toISOString().split('T')[0];

    function updateGlobalUI() {
        try {
            ['total-global','total-global-bulk'].forEach(function(id){
                var el = document.getElementById(id);
                if (el) el.innerText = globalTotal.toLocaleString('id-ID');
            });
            ['total-hari-ini','total-hari-ini-bulk'].forEach(function(id){
                var el = document.getElementById(id);
                if (el) el.innerText = globalToday.toLocaleString('id-ID');
            });
        } catch(e) { console.error('GlobalUI error:', e); }
    }

    function tambahGlobalCounter(jumlah) {
        try {
            jumlah = jumlah || 1;
            if (!window.firebaseReady) return;
            var db = window.firebaseDB;
            window.firebaseRunTransaction(window.firebaseRef(db, 'counter/total'), function(c){ return (c || 0) + jumlah; });
            window.firebaseRunTransaction(window.firebaseRef(db, 'counter/daily/' + todayKey), function(c){ return (c || 0) + jumlah; });
        } catch(e) { console.error('Global counter error:', e); }
    }

    function initFirebaseListeners() {
        try {
            if (!window.firebaseReady) { setTimeout(initFirebaseListeners, 2000); return; }
            var db = window.firebaseDB;
            window.firebaseOnValue(window.firebaseRef(db, 'counter/total'), function(s){ globalTotal = s.val() || 0; updateGlobalUI(); });
            window.firebaseOnValue(window.firebaseRef(db, 'counter/daily/' + todayKey), function(s){ globalToday = s.val() || 0; updateGlobalUI(); });
        } catch(e) { console.error('Firebase listener error:', e); }
    }
    initFirebaseListeners();

    var userTotal = parseInt(localStorage.getItem('padilsync_user_total') || '0');
    var userLastUsed = localStorage.getItem('padilsync_user_last') || '';

    function updateUserUI() {
        try {
            document.getElementById('user-counter').innerText = userTotal;
            if (userLastUsed) {
                var d = new Date(userLastUsed);
                document.getElementById('last-used').innerText = d.toLocaleString('id-ID', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' });
            }
        } catch(e) { console.error('UserUI error:', e); }
    }

    function tambahUserCounter() {
        try {
            userTotal += 1;
            userLastUsed = new Date().toISOString();
            localStorage.setItem('padilsync_user_total', userTotal);
            localStorage.setItem('padilsync_user_last', userLastUsed);
            updateUserUI();
            var el = document.getElementById('user-counter');
            el.classList.add('counter-pop');
            setTimeout(function(){ el.classList.remove('counter-pop'); }, 400);
        } catch(e) { console.error('User counter error:', e); }
    }
    updateUserUI();

    var jumlahAkun = 1;
    var isGenerating = false;
    var dataAkunTerakhir = [];

    var btnMinus = document.getElementById('btnMinus');
    var btnPlus = document.getElementById('btnPlus');
    var inputJumlah = document.getElementById('jumlahAkun');

    if (btnMinus) btnMinus.disabled = true;
    if (btnPlus) btnPlus.disabled = false;

    if (btnMinus) {
        btnMinus.addEventListener('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            try {
                if (isGenerating) return;
                if (jumlahAkun > 1) {
                    jumlahAkun--;
                    inputJumlah.value = jumlahAkun;
                    btnMinus.disabled = (jumlahAkun <= 1);
                    btnPlus.disabled = (jumlahAkun >= 5);
                }
            } catch(err) { console.error('Minus error:', err); }
        });
    }

    if (btnPlus) {
        btnPlus.addEventListener('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            try {
                if (isGenerating) return;
                if (jumlahAkun < 5) {
                    jumlahAkun++;
                    inputJumlah.value = jumlahAkun;
                    btnMinus.disabled = (jumlahAkun <= 1);
                    btnPlus.disabled = (jumlahAkun >= 5);
                }
            } catch(err) { console.error('Plus error:', err); }
        });
    }

    var btnKirimLink = document.getElementById('btnKirimLink');
    if (btnKirimLink) {
        btnKirimLink.addEventListener('click', async function(){
            try {
                var email = document.getElementById('emailInput').value.trim();
                var terminal = document.getElementById('terminalContent');
                var btn = document.getElementById('btnKirimLink');
                if (!email || email.indexOf('@') === -1) { alert('Masukkan Gmail yang valid!'); return; }
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
                terminal.innerHTML = '<div class="font-bold">[SYSTEM]</div><div>Memproses: <span class="text-white">' + email + '</span></div><div class="text-yellow-400">[PROCESS]</div>';
                try {
                    await callAPI('/send', { gmail: email });
                        localStorage.setItem('padilsync_last_email', email);
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Magic Link ke Email';
                    terminal.innerHTML = '<div class="font-bold">[SYSTEM]</div><div class="font-bold">[SUCCESS]</div><div>Magic link berhasil dikirim!</div>';
                    tambahGlobalCounter(1);
                    tambahUserCounter();
                    document.getElementById('emailInput').value = '';
                } catch (error) {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Magic Link ke Email';
                    terminal.innerHTML = '<div class="text-red-400 font-bold">[ERROR]</div><div>' + error.message + '</div>';
                    alert('Gagal: ' + error.message);
                }
            } catch(err) { console.error('KirimLink error:', err); }
        });
    }

    var btnVerif = document.getElementById('btnVerif');
    if (btnVerif) {
        btnVerif.addEventListener('click', async function(){
            try {
                var link = document.getElementById('linkInput').value.trim();
                var terminal = document.getElementById('terminalVerif');
                var btn = document.getElementById('btnVerif');
                if (!link) { alert('Tempel magic link terlebih dahulu!'); return; }
                var savedEmail = localStorage.getItem('padilsync_last_email') || '';
if (!savedEmail) { alert('Kirim link dulu di tab Activation!'); return; }
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memverifikasi...';
                try {
                    await callAPI('/verif', { gmail: savedEmail, link: link });
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fas fa-shield-alt"></i> Proses Verifikasi';
                    terminal.innerHTML = '<div class="font-bold">[SYSTEM]</div><div class="font-bold">[SUCCESS]</div><div>Akun Premium diaktifkan!</div>';
                    tambahGlobalCounter(1);
                    tambahUserCounter();
                    document.getElementById('linkInput').value = '';
                } catch (error) {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fas fa-shield-alt"></i> Proses Verifikasi';
                    terminal.innerHTML = '<div class="text-red-400 font-bold">[ERROR]</div><div>' + error.message + '</div>';
                    alert('Gagal: ' + error.message);
                }
            } catch(err) { console.error('Verif error:', err); }
        });
    }

    var btnGenerate = document.getElementById('btnGenerate');
    if (btnGenerate) {
        btnGenerate.addEventListener('click', async function(){
            try {
                if (isGenerating) return;
                isGenerating = true;
                var hasilBox = document.getElementById('hasilBulk');
                var btnGen = document.getElementById('btnGenerate');
                btnGen.disabled = true;
                btnMinus.disabled = true;
                btnPlus.disabled = true;
                btnGen.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
                hasilBox.innerHTML = '<div class="loader-box"><div class="spinner"></div><div class="text-sm font-bold text-gray-500">Memproses Akun...</div></div>';
                try {
                    var result = await callAPI('/bulk', { total: jumlahAkun });
                    var accounts = [];
                    if (Array.isArray(result)) accounts = result;
                    else if (result.data && Array.isArray(result.data)) accounts = result.data;
                    else if (result.accounts && Array.isArray(result.accounts)) accounts = result.accounts;
                    else {
                        for (var i = 1; i <= jumlahAkun; i++) {
                            var r = Math.random().toString(36).substring(2, 10);
                            accounts.push({ email: 'amprem' + r + '@akunlama.com', inbox: 'https://akunlama.com/inbox/amprem' + r + '/list' });
                        }
                    }
                    dataAkunTerakhir = accounts.map(function(acc, i){
                        return {
                            email: acc.email || acc.gmail || ('akun' + (i+1) + '@akunlama.com'),
                            inbox: acc.inbox || acc.inbox_url || acc.link || ('https://akunlama.com/inbox/akun' + (i+1) + '/list')
                        };
                    });
                    var html = '';
                    dataAkunTerakhir.forEach(function(akun, i){
                        html += '<div class="flex flex-col p-3 mb-2 rounded-lg border-2" style="border-color:#3b82f6">' +
                            '<div class="flex items-center gap-2 mb-1"><i class="fas fa-check-circle text-green-500"></i><span class="text-[10px] font-bold text-gray-500">AKUN ' + (i+1) + '</span></div>' +
                            '<div class="text-xs font-bold break-all mb-1">' + akun.email + '</div>' +
                            '<div class="flex items-start gap-1 text-[10px] text-gray-500"><i class="fas fa-envelope mt-0.5"></i><span>Inbox: <a href="' + akun.inbox + '" target="_blank" class="underline" style="color:#3b82f6">' + akun.inbox + '</a></span></div>' +
                            '</div>';
                    });
                    hasilBox.innerHTML = '<div class="text-left"><div class="text-[10px] font-bold text-gray-500 mb-2 uppercase">Hasil Generate (' + dataAkunTerakhir.length + ' Akun)</div>' + html + '</div>';
                    tambahGlobalCounter(dataAkunTerakhir.length);
                    for (var j = 0; j < dataAkunTerakhir.length; j++) tambahUserCounter();
                    btnGen.disabled = false;
                    btnGen.innerHTML = '<i class="fas fa-bolt"></i> Generate Akun Sekarang';
                    btnMinus.disabled = (jumlahAkun <= 1);
                    btnPlus.disabled = (jumlahAkun >= 5);
                    isGenerating = false;
                } catch (error) {
                    btnGen.disabled = false;
                    btnGen.innerHTML = '<i class="fas fa-bolt"></i> Generate Akun Sekarang';
                    btnMinus.disabled = (jumlahAkun <= 1);
                    btnPlus.disabled = (jumlahAkun >= 5);
                    isGenerating = false;
                    hasilBox.innerHTML = '<div class="text-red-500 text-center"><i class="fas fa-exclamation-triangle text-3xl mb-2"></i><div class="text-xs font-bold">Gagal Generate</div><div class="text-[10px] mt-1">' + error.message + '</div></div>';
                }
            } catch(err) { console.error('Generate error:', err); }
        });
    }

    console.log('✅ PadilSync siap!');
});
