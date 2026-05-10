const storage = {
    get(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    },
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

if (!localStorage.getItem('transactions')) {
    storage.set('transactions', [
        {
            id: '1',
            date: '2026-01-01',
            type: 'Masuk',
            amount: 500000,
            rt: 'RT 01',
            description: 'Iuran warga'
        },
        {
            id: '2',
            date: '2026-01-05',
            type: 'Keluar',
            amount: 200000,
            rt: 'RT 01',
            description: 'Kebersihan'
        }
    ]);
}

if (!localStorage.getItem('rts')) {
    storage.set('rts', ['RW', 'RT 01', 'RT 02', 'RT 03', 'RT 04', 'RT 05', 'RT 06', 'RT 07']);
}

function formatRupiah(angka) {
    const numericValue = Number(angka) || 0;
    return 'Rp. ' + numericValue.toLocaleString('id-ID');
}

const UI = {
    initSidebar() {
        this.initTheme();

        const settings = JSON.parse(localStorage.getItem('settings')) || { neighborhoodName: 'RW 07 Kelurahan Babakan', logo: null };
        const sidebarName = document.getElementById('sidebar-neighborhood-name');
        // Hilangkan teks RW 07 Kelurahan Babakan pada sidebar
        if (sidebarName) sidebarName.style.display = 'none';

        // Update deskripsi welcome di dashboard dengan nama wilayah
        const welcomeDesc = document.getElementById('dashboard-welcome-desc');
        if (welcomeDesc) welcomeDesc.innerText = settings.neighborhoodName;

        // Update deskripsi di halaman warga dengan nama wilayah
        const wargaDesc = document.getElementById('warga-welcome-desc');
        if (wargaDesc) wargaDesc.innerText = settings.neighborhoodName;

        // Update deskripsi di halaman keuangan dengan nama wilayah
        const keuanganDesc = document.getElementById('keuangan-welcome-desc');
        if (keuanganDesc) keuanganDesc.innerText = settings.neighborhoodName;

        // Update deskripsi di halaman galeri dengan nama wilayah
        const galeriDesc = document.getElementById('galeri-welcome-desc');
        if (galeriDesc) galeriDesc.innerText = settings.neighborhoodName;

        // Rapihkan kontainer branding agar terpusat
        const sidebarBrand = document.querySelector('.sidebar-brand');
        if (sidebarBrand) {
            sidebarBrand.style.display = 'flex';
            sidebarBrand.style.flexDirection = 'column';
            sidebarBrand.style.alignItems = 'center';
            sidebarBrand.style.textAlign = 'center';
            sidebarBrand.style.padding = '1.5rem 1rem';
        }

        // Ganti teks branding DAWALA dengan logo gambar di Sidebar & Mobile Header
        const brandTitles = document.querySelectorAll('.sidebar-brand-main h2, .mobile-brand h2');
        brandTitles.forEach(title => {
            title.style.margin = '0';
            title.innerHTML = `<img src="assets/img/Logo App/LOGO DAWALA teks.png" alt="DAWALA" style="height: 100px; width: auto; display: block;">`;
        });

        // Render Logo di Sidebar & Mobile Header jika tersedia
        const logoContainers = document.querySelectorAll('.sidebar-logo');
        // Hilangkan Logo utama pada Sidebar & Mobile Header
        logoContainers.forEach(container => container.style.display = 'none');

        // Mobile Toggle Logic
        const mobileToggle = document.querySelector('.mobile-toggle');
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');

        if (mobileToggle && sidebar && overlay) {
            mobileToggle.addEventListener('click', () => {
                sidebar.classList.toggle('is-open');
                overlay.classList.toggle('is-visible');
            });
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('is-open');
                overlay.classList.remove('is-visible');
            });
        }

        this.addThemeToggle();
    },

    initTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        document.body.classList.toggle('dark-mode', theme === 'dark');
        this.injectDarkStyles();
    },

    toggleTheme() {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    },

    injectDarkStyles() {
        if (document.getElementById('dark-mode-styles')) return;
        const style = document.createElement('style');
        style.id = 'dark-mode-styles';
        style.innerHTML = `
            body.dark-mode {
                --bg-body: #0f172a;
                --bg-card: #1e293b;
                --bg-header: #334155;
                --text-main: #f8fafc;
                --text-muted: #cbd5e1;
                --border-color: #334155;
                background-color: var(--bg-body) !important;
                color: var(--text-main);
            }
            /* Update latar belakang kontainer */
            body.dark-mode .sidebar,
            body.dark-mode .top-nav,
            body.dark-mode .stat-card,
            body.dark-mode .card,
            body.dark-mode .card-header,
            body.dark-mode .settings-card,
            body.dark-mode .table-card,
            body.dark-mode .modal-content,
            body.dark-mode .user-item,
            body.dark-mode .album-card,
            body.dark-mode .rt-tags-container,
            body.dark-mode .icon-box,
            body.dark-mode .extra-btn {
                background-color: var(--bg-card) !important;
                border-color: var(--border-color) !important;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
            }
            /* Perbaikan keterbacaan teks judul dan paragraf */
            body.dark-mode h1, body.dark-mode h2, body.dark-mode h3, body.dark-mode p {
                color: var(--text-main) !important;
            }
            body.dark-mode .text-muted,
            body.dark-mode .sidebar-brand-desc,
            body.dark-mode .header-title p,
            body.dark-mode .stat-info p,
            body.dark-mode .section-desc,
            body.dark-mode .form-label,
            body.dark-mode .extra-label,
            body.dark-mode .pie-legend span,
            body.dark-mode .v-label,
            body.dark-mode .chart-label {
                color: var(--text-muted) !important;
            }
            /* Perbaikan Legend Chart Dashboard */
            body.dark-mode .pie-legend strong {
                color: var(--text-main) !important;
            }
            /* Perbaikan kontras Tabel */
            body.dark-mode table th {
                background-color: var(--bg-header) !important;
                color: var(--text-main) !important;
            }
            body.dark-mode table td {
                color: var(--text-main);
                border-color: var(--border-color) !important;
            }
            body.dark-mode tr:hover td {
                background-color: #334155 !important;
            }
            /* Perbaikan tombol aksi di tabel agar terlihat di mode gelap */
            body.dark-mode td button {
                background-color: #334155 !important;
                border: 1px solid var(--border-color) !important;
                border-radius: 4px;
            }
            body.dark-mode input, body.dark-mode select, body.dark-mode textarea {
                background-color: #0f172a !important;
                color: white !important;
                border: 1px solid var(--border-color) !important;
            }
            /* Perbaikan khusus filter dropdown di Header Card Dashboard */
            body.dark-mode .card-header select {
                background-color: #0f172a !important;
                color: #f8fafc !important;
                border-color: #475569 !important;
            }
            body.dark-mode .card-header {
                border-bottom: 1px solid var(--border-color) !important;
            }
            /* Perbaikan Kotak Logo di Pengaturan */
            body.dark-mode .settings-card div[onclick*="input-logo-file"] {
                background-color: #0f172a !important;
                border-color: var(--border-color) !important;
            }
            body.dark-mode #settings-logo-preview {
                background-color: var(--bg-card) !important;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5) !important;
            }
            /* Perbaikan warna RT Tag agar tetap menonjol namun terbaca */
            body.dark-mode .rt-tag {
                background-color: #334155 !important;
                color: #818cf8 !important;
                border-color: #475569 !important;
            }
            .theme-toggle-btn {
                cursor: pointer;
                padding: 0.6rem 1rem;
                border-radius: 0.5rem;
                border: 1px solid #e2e8f0;
                background: white;
                margin-top: 1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.85rem;
                font-weight: 600;
                transition: all 0.2s;
                color: var(--text-main);
            }
            body.dark-mode .theme-toggle-btn {
                background: #334155;
                color: #fbbf24;
                border-color: #475569;
            }
        `;
        document.head.appendChild(style);
    },

    addThemeToggle() {
        const brand = document.querySelector('.sidebar-brand');
        if (brand && !document.getElementById('theme-toggle')) {
            const btn = document.createElement('button');
            btn.id = 'theme-toggle';
            btn.className = 'theme-toggle-btn';
            const updateBtnContent = () => {
                const isDark = document.body.classList.contains('dark-mode');
                btn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        ${isDark ? '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>' : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>'}
                    </svg>
                    <span>${isDark ? 'Mode Terang' : 'Mode Gelap'}</span>
                `;
            };
            
            btn.onclick = () => {
                this.toggleTheme();
                updateBtnContent();
            };
            
            updateBtnContent();
            brand.appendChild(btn);
        }
    }
};

const WargaController = {
    data: [],
    currentEditNik: null,

    async load() {
        try {
            const res = await fetch('/api/warga');
            this.data = await res.json();
            storage.set('warga_local', this.data);
        } catch (err) {
            console.warn('Server offline, mengambil data lokal...');
            this.data = storage.get('warga_local');
        }
        this.render();
    },

    render() {
        const tbody = document.getElementById('tbody-warga');
        if (!tbody) return;
        
        const filterVal = document.getElementById('filter-rt-warga')?.value;
        const filterUsia = document.getElementById('filter-usia-warga')?.value;
        const filterKelurahan = document.getElementById('filter-kelurahan-warga')?.value;
        const filterHunian = document.getElementById('filter-hunian-warga')?.value;
        const filterFinansial = document.getElementById('filter-finansial-warga')?.value;
        const filterKondisi = document.getElementById('filter-kondisi-warga')?.value;
        const filterYatim = document.getElementById('filter-yatim-warga')?.value;
        const filterKehamilan = document.getElementById('filter-kehamilan-warga')?.value;
        const searchVal = document.getElementById('search-warga')?.value.toLowerCase();

        let displayData = [...this.data];

        if (searchVal) {
            displayData = displayData.filter(w => 
                w.nama.toLowerCase().includes(searchVal) || 
                String(w.nik).toLowerCase().includes(searchVal) ||
                String(w.no_kk || '').toLowerCase().includes(searchVal)
            );
        }

        if (filterVal) displayData = displayData.filter(w => w.rt === filterVal);
        if (filterHunian) displayData = displayData.filter(w => w.status_hunian === filterHunian);
        if (filterKondisi) displayData = displayData.filter(w => w.kondisi === filterKondisi);
        if (filterYatim) displayData = displayData.filter(w => w.status_yatim === filterYatim);
        if (filterKehamilan) displayData = displayData.filter(w => w.status_kehamilan === filterKehamilan);
        if (filterFinansial) displayData = displayData.filter(w => w.status_finansial === filterFinansial);
        if (filterKelurahan) {
            displayData = displayData.filter(w => {
                const isBabakan = (w.kelurahan || '').toString().trim().toLowerCase() === 'babakan';
                return filterKelurahan === 'Babakan' ? isBabakan : !isBabakan;
            });
        }

        if (filterUsia) {
            const now = new Date();
            displayData = displayData.filter(w => {
                if (!w.tanggal_lahir) return false;
                
                const birthDate = new Date(w.tanggal_lahir);
                let age = now.getFullYear() - birthDate.getFullYear();
                const m = now.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
                    age--;
                }

                switch(filterUsia) {
                    case 'balita': return age < 5;
                    case 'anak': return age >= 5 && age <= 11;
                    case 'remaja': return age >= 12 && age <= 18;
                    case 'dewasa': return age >= 19 && age <= 59;
                    case 'lansia': return age >= 60;
                    default: return true;
                }
            });
        }

        if (!displayData.length) {
            tbody.innerHTML = '<tr><td colspan="21" style="text-align:center">Tidak ada data warga yang sesuai kriteria</td></tr>';
            return;
        }

        tbody.innerHTML = displayData.map(warga => `
            <tr>
                <td><span class="rt-tag">${warga.rt}</span></td> <!-- Tetap menggunakan warga.rt karena ini adalah data RT, hanya label yang berubah -->
                <td style="font-weight:600">${warga.nama}</td>
                <td style="color:var(--text-muted)">${warga.no_kk || '-'}</td>
                <td style="color:var(--text-muted)">${warga.nik}</td>
                <td>${warga.tempat_lahir}, ${new Date(warga.tanggal_lahir).toLocaleDateString('id-ID')}</td>
                <td>${warga.jenis_kelamin === 'Laki-laki' ? 'L' : 'P'}</td>
                <td>${warga.alamat}</td>
                <td>${warga.rt_num || '-'}</td>
                <td>${warga.rw_num || '-'}</td>
                <td>${warga.kelurahan}</td>
                <td>${warga.kecamatan}</td>
                <td>${warga.agama}</td>
                <td>${warga.status_perkawinan}</td>
                <td>${warga.pekerjaan}</td>
                <td>${warga.kewarganegaraan}</td>
                <td><span class="badge ${warga.status_hunian === 'Tetap' ? 'badge-success' : 'badge-warning'}">${warga.status_hunian}</span></td>
                <td><span class="badge ${warga.status_finansial === 'Mampu' ? 'badge-success' : 'badge-warning'}">${warga.status_finansial || '-'}</span></td>
                <td><span class="badge ${warga.kondisi === 'Difabel' ? 'badge-danger' : 'badge-info'}">${warga.kondisi}</span></td>
                <td><span class="badge ${warga.status_yatim === 'Yatim' ? 'badge-danger' : 'badge-info'}">${warga.status_yatim || '-'}</span></td>
                <td><span class="badge ${warga.status_kehamilan === 'Hamil' ? 'badge-danger' : 'badge-info'}">${warga.status_kehamilan || '-'}</span></td>
                <td style="text-align:center; white-space: nowrap;">
                    <button onclick="WargaController.edit('${warga.nik}')" class="btn-action" style="color:var(--primary);" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button onclick="WargaController.hapus('${warga.nik}')" class="btn-action" style="color:var(--danger)" title="Hapus">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    open() { document.getElementById('modal-warga').style.display = 'flex'; },
    close() { document.getElementById('modal-warga').style.display = 'none'; },

    edit(nik) {
        const warga = this.data.find(w => w.nik === nik);
        if (!warga) return;

        this.currentEditNik = nik;
        document.getElementById('input-nama').value = warga.nama;
        document.getElementById('input-no-kk').value = warga.no_kk || '';
        document.getElementById('input-nik').value = warga.nik;
        document.getElementById('input-tempat-lahir').value = warga.tempat_lahir;
        document.getElementById('input-tgl-lahir').value = warga.tanggal_lahir;
        document.getElementById('input-jk').value = warga.jenis_kelamin;
        document.getElementById('input-agama').value = warga.agama;
        document.getElementById('input-alamat').value = warga.alamat;
        document.getElementById('input-rt').value = warga.rt;
        document.getElementById('input-rt-num').value = warga.rt_num || '';
        document.getElementById('input-rw-num').value = warga.rw_num || '';
        document.getElementById('input-kelurahan').value = warga.kelurahan;
        document.getElementById('input-kecamatan').value = warga.kecamatan;
        document.getElementById('input-pekerjaan').value = warga.pekerjaan;
        document.getElementById('input-perkawinan').value = warga.status_perkawinan;
        document.getElementById('input-kwn').value = warga.kewarganegaraan;
        document.getElementById('input-status-hunian').value = warga.status_hunian;
        document.getElementById('input-finansial').value = warga.status_finansial || 'Mampu';
        document.getElementById('input-kondisi').value = warga.kondisi === 'Umum' ? '-' : (warga.kondisi || '-');
        document.getElementById('input-yatim').value = warga.status_yatim || '-';
        document.getElementById('input-kehamilan').value = warga.status_kehamilan || '-';

        // NIK sekarang tetap aktif agar dapat diubah
        document.getElementById('btn-save-warga').innerText = 'Update Data Warga';
        this.open();
    },

    async save(e) {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('currentUser'));

    const newWarga = {
        operator: user ? user.username : 'System',
        nama: document.getElementById('input-nama').value,
        no_kk: document.getElementById('input-no-kk').value,
        nik: document.getElementById('input-nik').value,
        tempat_lahir: document.getElementById('input-tempat-lahir').value,
        tanggal_lahir: document.getElementById('input-tgl-lahir').value,
        jenis_kelamin: document.getElementById('input-jk').value,
        agama: document.getElementById('input-agama').value,
        alamat: document.getElementById('input-alamat').value,
        rt: document.getElementById('input-rt').value,
        rt_num: document.getElementById('input-rt-num').value,
        rw_num: document.getElementById('input-rw-num').value,
        kelurahan: document.getElementById('input-kelurahan').value,
        kecamatan: document.getElementById('input-kecamatan').value,
        pekerjaan: document.getElementById('input-pekerjaan').value,
        status_perkawinan: document.getElementById('input-perkawinan').value,
        kewarganegaraan: document.getElementById('input-kwn').value,
        status_hunian: document.getElementById('input-status-hunian').value,
        status_finansial: document.getElementById('input-finansial').value,
        kondisi: document.getElementById('input-kondisi').value,
        status_yatim: document.getElementById('input-yatim').value,
        status_kehamilan: document.getElementById('input-kehamilan').value
    };

    if (this.currentEditNik) {
        newWarga.oldNik = this.currentEditNik;
    }

    try {

        const method = this.currentEditNik ? 'PUT' : 'POST';

        const res = await fetch('/api/warga', {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newWarga)
        });

        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.error || 'Gagal menyimpan data warga');
        }

        await this.load();

        this.currentEditNik = null;
        document.getElementById('form-warga').reset();
        this.close();

        alert('Data warga berhasil disimpan');

    } catch (err) {

        console.error('Error simpan warga:', err);
        alert('Gagal menyimpan data warga');
    }
    console.log('WargaController loaded');
},
    async hapus(nik) {

        console.log('DELETE CLICKED', nik);

        if(!confirm('Hapus warga ini?')) return;
        
        try {
            const res = await fetch(`/api/warga?nik=${nik}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nik: nik, operator: JSON.parse(localStorage.getItem('currentUser'))?.username || 'System' })
            });
            const result = await res.json();
            console.log(result);

            if (!res.ok) {
                throw new Error(result.error || 'Gagal menghapus data warga');
            }

            alert('Data warga berhasil dihapus');
            await this.load();

        } catch (err) {
            
            console.error('Error', err);
            
            alert('Gagal menghapus data warga');
        }
    },

    pilihExportRT() {
    document.getElementById("modal-export").style.display = 'flex';
    },

    exportDataRT: async function () {

    try {

        const selectedRT =
            document.getElementById('export-rt').value;

        // ambil data dari API
        const response =
            await fetch('/api/warga');

        const data =
            await response.json();

        // filter rt
        let filteredData = data;

        if (selectedRT) {

            filteredData = data.filter(
                w => w.rt == selectedRT
            );

        }

        // format excel
        const excelData = filteredData.map(w => ({

            "Nama": w.nama,
            "NIK": w.nik,
            "No KK": w.no_kk,
            "Tempat Lahir": w.tempat_lahir,
            "Tanggal Lahir": w.tanggal_lahir,
            "Alamat": w.alamat,
            "RT": w.rt_num,
            "RW": w.rw_num,
            "Kelurahan": w.kelurahan,
            "Kecamatan": w.kecamatan,
            "Pekerjaan": w.pekerjaan,
            "Agama": w.agama
        }));

        // worksheet
        const worksheet =
            XLSX.utils.json_to_sheet(excelData);

        // workbook
        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Data Warga"
        );

        // nama file
        const fileName = selectedRT
            ? `data-rt-${selectedRT}.xlsx`
            : 'data-semua-rt.xlsx';

        // download
        XLSX.writeFile(workbook, fileName);

        // tutup modal
        document.getElementById('modal-export').style.display = 'none';

    } catch (err) {

        console.error(err);

        alert('Gagal export data');

    }
},

    setupRTSelect() {
        const rtSelect = document.getElementById('input-rt');
        if (rtSelect) {
            const rts = storage.get('rts') || [];
            rtSelect.innerHTML = rts.map(rt => `<option value="${rt}">${rt}</option>`).join('');
        }
    },

    setupFilterRT() {
        const select = document.getElementById('filter-rt-warga');
        if (select) {
            const rts = storage.get('rts') || [];
            select.innerHTML = '<option value="">Semua Unit</option>' + 
                rts.map(rt => `<option value="${rt}">${rt}</option>`).join('');
        }
    },

    async init() {
        this.setupRTSelect();
        this.setupFilterRT(); // Ensure filter is set up
        await this.load();
        const form = document.getElementById('form-warga');
        if (form) form.addEventListener('submit', (e) => this.save(e));
    }
};

const LogController = {
    async init() {
        await this.load();
    },
    async load() {
        const tbody = document.getElementById('log-table-body');
        if (!tbody) return;

        try {
            const res = await fetch('/api/logs');
            if (!res.ok) {
                throw new Error('Gagal memuat log historis');
            }
            const logs = await res.json();
            if (!Array.isArray(logs)) {
                throw new Error('Format data log tidak valid');
            }

            tbody.innerHTML = logs.map(l => `
                <tr>
                    <td style="padding: 0.5rem; color: var(--text-muted);">${l.timestamp}</td>
                    <td style="padding: 0.5rem; font-weight: 600;">${l.user}</td>
                    <td style="padding: 0.5rem;"><span class="badge" style="background:#e2e8f0; color:#334155">${l.action}</span></td>
                    <td style="padding: 0.5rem;">${l.details}</td>
                </tr>
            `).join('');
        } catch (err) {
            console.error('Error:', err);
            tbody.innerHTML = '<tr><td colspan="4">Gagal memuat log historis</td></tr>';
        }
    }
};

const DashboardController = {
    data: [], // Menyimpan data warga secara lokal

    async init() {
        this.setupFilters();
        await this.loadStats();
    },

    setupFilters() {
        const filterIds = ['gender-rt-filter', 'age-rt-filter', 'kondisi-rt-filter', 'finansial-rt-filter', 'yatim-rt-filter', 'kehamilan-rt-filter', 'hunian-rt-filter', 'kelurahan-rt-filter'];
        const rts = storage.get('rts') || [];
        filterIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.innerHTML = '<option value="">Semua Unit</option>' + 
                    rts.map(rt => `<option value="${rt}">${rt}</option>`).join('');
            }
        });
    },

    async loadStats() {
        try {
            const resKas = await fetch('/api/kas');
            if (!resKas.ok) {
                throw new Error('Gagal memuat data kas');
            }
            const kas = await resKas.json();
            const resWarga = await fetch('/api/warga');
            if (!resWarga.ok) {
                throw new Error('Gagal memuat data warga');
            }
            this.data = await resWarga.json();
            const warga = this.data;

            // Perhitungan Kas
            const totalMasuk = kas.filter(t => t.type === 'Masuk').reduce((a, b) => a + Number(b.amount || 0), 0);
            const totalKeluar = kas.filter(t => t.type === 'Keluar').reduce((a, b) => a + Number(b.amount || 0), 0);
            const saldo = totalMasuk - totalKeluar;

            // Perhitungan Warga
            const totalWarga = warga.length;
            document.getElementById('total-warga-count').innerText = totalWarga;
            const totalDifabel = warga.filter(w => w.kondisi === 'Difabel').length;
            const wargaBabakan = warga.filter(w => (w.kelurahan || '').toString().trim().toLowerCase() === 'babakan').length;
            const wargaLuarBabakan = warga.filter(w => (w.kelurahan || '').toString().trim().toLowerCase() !== 'babakan').length;
            const totalTidakMampu = warga.filter(w => w.status_finansial === 'Tidak Mampu').length;
            const totalYatim = warga.filter(w => w.status_yatim === 'Yatim').length;
            const totalKehamilan = warga.filter(w => w.status_kehamilan === 'Hamil').length;
            const totalKK = new Set(warga.map(w => String(w.no_kk || '').trim()).filter(kk => kk && kk !== '' && kk !== '-')).size;
            const totalHunianTetap = warga.filter(w => w.status_hunian === 'Tetap').length;

            // Render Stats Utama
            const stats = document.querySelectorAll('.stat-card h3');
            if (stats.length >= 8) { // Sekarang ada 8 stat card
                document.getElementById('total-warga-count').innerText = totalWarga;
                document.getElementById('total-kk-count').innerText = totalKK;
                document.getElementById('total-saldo').innerText = formatRupiah(saldo);
                document.getElementById('total-difabel').innerText = totalDifabel;
                document.getElementById('total-kehamilan').innerText = totalKehamilan;
                document.getElementById('total-tidak-mampu').innerText = totalTidakMampu;
                document.getElementById('total-yatim').innerText = totalYatim;
                document.getElementById('total-hunian-tetap').innerText = totalHunianTetap;
            }

            const breakdownEl = document.getElementById('total-warga-breakdown');
            if (breakdownEl) {
                breakdownEl.innerText = `${wargaBabakan} Babakan • ${wargaLuarBabakan} Luar`;
            }

            this.renderAll();
            
        } catch (err) {
            console.log('Gagal memuat statistik', err);
        }
    },

    renderAll() {
        this.renderCharts(this.data);
    },

    renderCharts(warga) {
        if (!Array.isArray(warga)) return;
        // Filter per unit untuk Gender
        const genderRt = document.getElementById('gender-rt-filter')?.value;
        const gData = genderRt ? warga.filter(w => w.rt === genderRt) : warga;

        const male = gData.filter(w => (w.jenis_kelamin || '').toLowerCase() .trim() === 'laki-laki').length;
        const female = gData.filter(w => (w.jenis_kelamin || '').toLowerCase() .trim() === 'perempuan').length;
        const genderContainer = document.getElementById('gender-chart-container');
        if (genderContainer) {
            const total = gData.length || 1;
            const malePct = Math.round((male / total) * 100);
            const femalePct = 100 - malePct;
            genderContainer.innerHTML = `
                <div class="pie-chart-wrapper">
                    <div class="pie-chart" style="background: conic-gradient(#2563eb ${malePct}%, #f472b6 0);"></div>
                    <div class="pie-legend">
                        <div class="legend-item">
                            <div class="legend-color" style="background: #2563eb;"></div>
                            <span>Laki-laki: <strong>${male}</strong> (${malePct}%)</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background: #f472b6;"></div>
                            <span>Perempuan: <strong>${female}</strong> (${femalePct}%)</span>
                        </div>
                    </div>
                </div>
            `;
        }

        // Filter per unit untuk Usia
        const ageRt = document.getElementById('age-rt-filter')?.value;
        const aData = ageRt ? warga.filter(w => w.rt === ageRt) : warga;

        const ageContainer = document.getElementById('age-chart-container');
        if (ageContainer) {
            const now = new Date();
            const ages = aData.map(w => {
                if (!w.tanggal_lahir) return null;
            const birth = new Date(w.tanggal_lahir);
                if (isNaN(birth)) return null; // Cek validitas tanggal
            let age = now.getFullYear() - birth.getFullYear();
            const m = now.getMonth() - birth.getMonth();
                if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
                    age--;
                }
                return age;
            }).filter(a => a !== null); // Hanya ambil yang valid
            if (ages.length === 0) {
                ageContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted);">Tidak ada data usia yang valid</p>';
                return;
            }

            const total = ages.length || 1;
            const groups = [
                { label: 'Bayi/Balita (0-4th)', count: ages.filter(a => a < 5).length, color: '#06b6d4' },
                { label: 'Anak-anak (5-11th)', count: ages.filter(a => a >= 5 && a <= 11).length, color: '#22c55e' },
                { label: 'Remaja (12-18th)', count: ages.filter(a => a >= 12 && a <= 18).length, color: '#8b5cf6' },
                { label: 'Dewasa (19-59th)', count: ages.filter(a => a >= 19 && a <= 59).length, color: '#f97316' },
                { label: 'Lansia (60th+)', count: ages.filter(a => a >= 60).length, color: '#dc2626' }
            ];

            let cumulative = 0;
            const gradientParts = groups.map(g => {
                const start = cumulative;
                const percent = (g.count / total) * 100;
                cumulative += percent;
                return `${g.color} ${start}% ${cumulative}%`;
            });

            ageContainer.innerHTML = `
                <div class="pie-chart-wrapper">
                    <div class="pie-chart" style="background: conic-gradient(${gradientParts.join(', ')});"></div>
                    <div class="pie-legend">
                        ${groups.map(g => `
                            <div class="legend-item">
                                <div class="legend-color" style="background: ${g.color};"></div>
                                <span>${g.label}: <strong>${g.count}</strong> (${Math.round((g.count/total)*100)}%)</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Filter per unit untuk Wilayah
        const kelFilter = document.getElementById('kelurahan-rt-filter')?.value;
        let kData = warga;
        if (kelFilter) {
            kData = warga.filter(w => {
                const isBabakan = (w.kelurahan || '').toString().trim().toLowerCase() === 'babakan';
                return kelFilter === 'Babakan' ? isBabakan : !isBabakan;
            });
        }

        const kelurahanContainer = document.getElementById('kelurahan-chart-container');
        if (kelurahanContainer) {
            const total = kData.length;
            if (total === 0) {
                kelurahanContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted);">Tidak ada data kelurahan yang valid</p>';
                return;
            }
            const babakan = kData.filter(w => (w.kelurahan || '').toString().trim().toLowerCase() === 'babakan').length;
            const luarBabakan = total - babakan;
            
            const babakanPct = Math.round((babakan / total) * 100);
            const luarPct = 100 - babakanPct;

            kelurahanContainer.innerHTML = `
                <div class="pie-chart-wrapper">
                    <div class="pie-chart" style="background: conic-gradient(#0d9488 ${babakanPct}%, #64748b 0);"></div>
                    <div class="pie-legend">
                        <div class="legend-item">
                            <div class="legend-color" style="background: #0d9488;"></div>
                            <span>Babakan: <strong>${babakan}</strong> (${babakanPct}%)</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background: #64748b;"></div>
                            <span>Luar Babakan: <strong>${luarBabakan}</strong> (${luarPct}%)</span>
                        </div>
                    </div>
                </div>
            `;
        }

        // 4. Chart Kondisi (Pie Chart)
        const kondisiRt = document.getElementById('kondisi-rt-filter')?.value;
        const konData = kondisiRt ? warga.filter(w => w.rt === kondisiRt) : warga;

        const kondisiContainer = document.getElementById('kondisi-chart-container');
        if (kondisiContainer) {
            const total = konData.length;
            if (total === 0) {
                kondisiContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted);">Tidak ada data kondisi yang valid</p>';
                return;
            }
            const umum = konData.filter(w => (w.kondisi || '').toString().trim().toLowerCase() !== 'difabel').length;
            const difabel = konData.filter(w => (w.kondisi || '').toString().trim().toLowerCase() === 'difabel').length;
            
            const umumPct = Math.round((umum / total) * 100);
            const difabelPct = 100 - umumPct;

            kondisiContainer.innerHTML = `
                <div class="pie-chart-wrapper">
                    <div class="pie-chart" style="background: conic-gradient(#4338ca ${umumPct}%, #7f1d1d 0);"></div>
                    <div class="pie-legend">
                        <div class="legend-item">
                            <div class="legend-color" style="background: #4338ca;"></div>
                            <span>Umum: <strong>${umum}</strong> (${umumPct}%)</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background: #7f1d1d;"></div>
                            <span>Difabel: <strong>${difabel}</strong> (${difabelPct}%)</span>
                        </div>
                    </div>
                </div>
            `;
        }

        // Demografi Finansial (Pie Chart)
        const finRt = document.getElementById('finansial-rt-filter')?.value;
        const fData = finRt ? warga.filter(w => w.rt === finRt) : warga;
        const finansialContainer = document.getElementById('finansial-chart-container');
        if (finansialContainer) {
            const total = fData.length;
            if (total === 0) {
                finansialContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted);">Tidak ada data finansial yang valid</p>';
                return;
            }
            const mampu = fData.filter(w => (w.status_finansial || '').toString().trim().toLowerCase() === 'mampu').length;
            const tidakMampu = fData.filter(w => (w.status_finansial || '').toString().trim().toLowerCase() === 'tidak mampu').length;
            const mampuPct = Math.round((mampu / total) * 100);
            const tidakMampuPct = Math.round((tidakMampu / total) * 100);

            finansialContainer.innerHTML = `
                <div class="pie-chart-wrapper">
                    <div class="pie-chart" style="background: conic-gradient(#059669 ${mampuPct}%, #ea580c 0);"></div>
                    <div class="pie-legend">
                        <div class="legend-item">
                            <div class="legend-color" style="background: #059669;"></div>
                            <span>Mampu: <strong>${mampu}</strong> (${mampuPct}%)</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background: #ea580c;"></div>
                            <span>Tidak Mampu: <strong>${tidakMampu}</strong> (${tidakMampuPct}%)</span>
                        </div>
                    </div>
                </div>
            `;
        }

        // Demografi Yatim (Pie Chart)
        const yatimRt = document.getElementById('yatim-rt-filter')?.value;
        const yData = yatimRt ? warga.filter(w => w.rt === yatimRt) : warga;
        const yatimContainer = document.getElementById('yatim-chart-container');
        if (yatimContainer) {
            const total = yData.length;
            if (total === 0) {
                yatimContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted);">Tidak ada data yatim yang valid</p>';
                return;
            }
            const yatim = yData.filter(w => (w.status_yatim || '').toString().trim().toLowerCase() === 'yatim').length;
            const umum = yData.filter(w => (w.status_yatim || '').toString().trim().toLowerCase() !== 'yatim').length;
            const yatimPct = Math.round((yatim / total) * 100);
            const umumPct = Math.round((umum / total) * 100);

            yatimContainer.innerHTML = `
                <div class="pie-chart-wrapper">
                    <div class="pie-chart" style="background: conic-gradient(#b91c1c ${yatimPct}%, #0891b2 0);"></div>
                    <div class="pie-legend">
                        <div class="legend-item">
                            <div class="legend-color" style="background: #b91c1c;"></div>
                            <span>Yatim: <strong>${yatim}</strong> (${yatimPct}%)</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background: #0891b2;"></div>
                            <span>Umum: <strong>${umum}</strong> (${umumPct}%)</span>
                        </div>
                    </div>
                </div>
            `;
        }

        // Demografi Kehamilan (Pie Chart)
        const hamilRt = document.getElementById('kehamilan-rt-filter')?.value;
        const hData = hamilRt ? warga.filter(w => w.rt === hamilRt) : warga;
        const kehamilanContainer = document.getElementById('kehamilan-chart-container');
        if (kehamilanContainer) {
            const total = hData.length;
            if (total === 0) {
                kehamilanContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted);">Tidak ada data kehamilan yang valid</p>';
                return;
            }
            const hamil = hData.filter(w => (w.status_kehamilan || '').toString().trim().toLowerCase() === 'hamil').length;
            const umum = hData.filter(w => (w.status_kehamilan || '').toString().trim().toLowerCase() !== 'hamil').length;
            const hamilPct = Math.round((hamil / total) * 100);
            const umumPct = Math.round((umum / total) * 100);

            kehamilanContainer.innerHTML = `
                <div class="pie-chart-wrapper">
                    <div class="pie-chart" style="background: conic-gradient(#be185d ${hamilPct}%, #334155 0);"></div>
                    <div class="pie-legend">
                        <div class="legend-item">
                            <div class="legend-color" style="background: #be185d;"></div>
                            <span>Hamil: <strong>${hamil}</strong> (${hamilPct}%)</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background: #334155;"></div>
                            <span>Umum/-: <strong>${umum}</strong> (${umumPct}%)</span>
                        </div>
                    </div>
                </div>
            `;
        }

        // Demografi Hunian (Pie Chart)
        const hunianRt = document.getElementById('hunian-rt-filter')?.value;
        const hnnData = hunianRt ? warga.filter(w => w.rt === hunianRt) : warga;
        const hunianContainer = document.getElementById('hunian-chart-container');
        if (hunianContainer) {
            const total = hnnData.length;
            if (total === 0) {
                hunianContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted);">Tidak ada data hunian yang valid</p>';
                return;
            }
            const tetap = hnnData.filter(w => (w.status_hunian || '').toString().trim().toLowerCase() === 'tetap').length;
            const kontrak = hnnData.filter(w => (w.status_hunian || '').toString().trim().toLowerCase() !== 'tetap').length;
            const tetapPct = Math.round((tetap / total) * 100);
            const kontrakPct = Math.round((kontrak / total) * 100);

            hunianContainer.innerHTML = `
                <div class="pie-chart-wrapper">
                    <div class="pie-chart" style="background: conic-gradient(#166534 ${tetapPct}%, #eab308 0);"></div>
                    <div class="pie-legend">
                        <div class="legend-item">
                            <div class="legend-color" style="background: #166534;"></div>
                            <span>Tetap: <strong>${tetap}</strong> (${tetapPct}%)</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background: #eab308;"></div>
                            <span>Kontrak: <strong>${kontrak}</strong> (${kontrakPct}%)</span>
                        </div>
                    </div>
                </div>
            `;
        }
    },
};

const PenggunaController = {
    async init() {
        await this.load();
        this.setupRTSelect();
        document.getElementById('form-tambah-pengguna')?.addEventListener('submit', (e) => this.save(e));
    },

    setupRTSelect() {
        const select = document.getElementById('user-rt');
        if (select) {
            const rts = storage.get('rts');
            select.innerHTML = rts.map(rt => `<option value="${rt}">${rt}</option>`).join('');
        }
    },

    async load() {
        const container = document.getElementById('user-list-container');
        if (!container) return;

        try {
            const res = await fetch('/api/pengguna');
            const users = await res.json();
            
            container.innerHTML = users.map(u => `
                <div class="user-item">
                    <div><strong>${u.username}</strong> <br> <small style="color:var(--text-muted)">Wilayah: ${u.rt}</small></div>
                    <button class="remove" onclick="PenggunaController.hapus('${u.username}')" style="border:none; background:none; color:var(--danger); cursor:pointer; font-weight:700;">Hapus</button>
                </div>
            `).join('');
        } catch (err) {
            container.innerHTML = 'Gagal memuat daftar pengguna.';
        }
    },

    async save(e) {
        e.preventDefault();
        const newUser = {
            username: document.getElementById('user-username').value,
            password: document.getElementById('user-password').value,
            rt: document.getElementById('user-rt').value,
            
            role: 'Pengurus'
        };
        try {
            const res = await fetch('/api/pengguna', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });
            const data = await res.json();
            if (data.status !== 'success') {
                alert(data.error || 'Gagal menambahkan pengguna');
                return;
            }
        document.getElementById('form-tambah-pengguna').reset();
        await this.load();
        } catch (err) {
            console.error(err);
            alert('koneksi server gagal');
        }
    },

    async hapus(username) {
        if (username === 'admin') {
            alert('Akun admin utama tidak dapat dihapus');
            return;
        }
        if (!confirm(`Hapus pengguna ${username}?`)){
            return;
        }
    
    try {
        const res = await fetch('/api/pengguna', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });
        const data = await res.json();
        if (data.status !== 'success') {
            alert(data.error || 'Gagal menghapus pengguna');
            return;
        }
        await this.load();
    } catch (err) {
        console.error(err);
        alert('koneksi server gagal');
        }
    }
};

const SettingsController = {
    init() {
        this.renderRTs();
        this.setupEventListeners();
        this.loadProfile();
    },

    loadProfile() {
        const settings = JSON.parse(localStorage.getItem('settings')) || {};
        const nameInput = document.getElementById('input-neighborhood-name');
        const addrInput = document.getElementById('input-address');
        const preview = document.getElementById('settings-logo-preview');
        
        if (nameInput) nameInput.value = settings.neighborhoodName || '';
        if (addrInput) addrInput.value = settings.address || '';
        if (preview && settings.logo) {
            preview.innerHTML = `<img src="${settings.logo}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 1rem;">`;
        }
    },

    saveProfile() {
        const name = document.getElementById('input-neighborhood-name').value;
        const address = document.getElementById('input-address').value;
        const settings = JSON.parse(localStorage.getItem('settings')) || {};
        
        settings.neighborhoodName = name;
        settings.address = address;
        
        localStorage.setItem('settings', JSON.stringify(settings));
        UI.initSidebar();
        alert('Profil berhasil disimpan!');
    },

    renderRTs() {
        const container = document.querySelector('.rt-tags-container');
        if (!container) return;
        
        const rts = storage.get('rts') || [];
        container.innerHTML = rts.map(rt => `
            <div class="rt-tag">
                ${rt}
                <span class="remove" onclick="SettingsController.removeRT('${rt}')">&times;</span>
            </div>
        `).join('');
    },

    addRT() {
        const input = document.getElementById('input-rt-name');
        const value = input?.value.trim();
        if (!value) return;

        let rts = storage.get('rts') || [];
        if (rts.includes(value)) {
            alert('Unit ini sudah terdaftar!');
            return;
        }

        rts.push(value);
        rts.sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' }));
        storage.set('rts', rts);
        input.value = '';
        this.renderRTs();
    },

    removeRT(name) {
        let rts = storage.get('rts') || [];
        if (rts.length <= 1) {
            alert('Minimal harus ada 1 unit!');
            return;
        }
        if (!confirm(`Hapus unit ${name}?`)){return;
        }
        rts = rts.filter(rt => rt !== name);
        storage.set('rts', rts);
        this.renderRTs();
    },

    handleLogoUpload(input) {
        const file = input.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            alert('Ukuran gambar minimal 1mb dan maksimal 2mb');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target.result;
            const settings = JSON.parse(localStorage.getItem('settings')) || {};
            settings.logo = base64;
            localStorage.setItem('settings', JSON.stringify(settings));
            
            const preview = document.getElementById('settings-logo-preview');
            if (preview) {
                preview.innerHTML = `<img src="${base64}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 1rem;">`;
            }
            UI.initSidebar();
        };
        reader.readAsDataURL(file);
    },

    setupEventListeners() {
        document.getElementById('btn-save-profile')?.addEventListener('click', () => this.saveProfile());
        document.getElementById('btn-add-rt')?.addEventListener('click', () => this.addRT());
        document.getElementById('input-logo-file')?.addEventListener('change', (e) => this.handleLogoUpload(e.target));
        document.getElementById('input-rt-name')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addRT();
        });
    }
};

const KeuanganController = {
    currentEditId: null,

    async loadFromServer() {
        try {
            const res = await fetch('/api/kas');
            if (!res.ok) {
                throw new Error('Gagal memuat data transaksi');
            }
            const data = await res.json();
            storage.set('transactions', data);
        } catch (err) {
            console.log('Server offline, pakai localStorage');
        }
    },

    async init() {
        await this.loadFromServer();

        this.setupRTFilter();
        this.setupYearFilter();
        this.renderTransactions();
        this.updateSummary();
        this.setupEventListeners();
        this.setupModal();
    },

    setupRTFilter() {
        const rtSelect = document.getElementById('filter-rt');
        if (rtSelect) {
            const rts = storage.get('rts');
            rtSelect.innerHTML =
                '<option value="">Semua RT</option>' +
                rts.map(rt => `<option value="${rt}">${rt}</option>`).join('');
        }
    },

    setupYearFilter() {
        const yearSelect = document.getElementById('filter-year');
        if (yearSelect) {
            const currentYear = new Date().getFullYear();
            let html = '<option value="">Semua Tahun</option>';
            for (let y = currentYear; y >= 2020; y--) {
                html += `<option value="${y}">${y}</option>`;
            }
            yearSelect.innerHTML = html;
        }
    },

    updateSummary(filteredTransactions) {
        const transactions = storage.get('transactions');
        const filtered = filteredTransactions || transactions;

        const totalMasuk = filtered
            .filter(t => t.type === 'Masuk')
            .reduce((a, b) => a + Number(b.amount || 0), 0);

        const totalKeluar = filtered
            .filter(t => t.type === 'Keluar')
            .reduce((a, b) => a + Number(b.amount || 0), 0);

        const balance = totalMasuk - totalKeluar;

        document.getElementById('total-saldo').innerText = formatRupiah(balance);
        document.getElementById('total-masuk').innerText = '+ ' + formatRupiah(totalMasuk);
        document.getElementById('total-keluar').innerText = '- ' + formatRupiah(totalKeluar);
    },

    pilihexportData() {
        document.getElementById('kas-export').style.display = 'flex';
    },

    exportDataKas: async function() {

        try {

        const selectedRT =
            document.getElementById('export-kas-rt').value;

        // ambil data dari API
        const response =
            await fetch('/api/kas');

        const data =
            await response.json();

        // filter rt
        let filteredData = data;

        if (selectedRT) {

            filteredData = data.filter(
                w => w.rt == selectedRT
            );

        }

        // format excel
        const excelData = filteredData.map(w => ({

            "Tanggal": w.date,
            "Jenis": w.type,
            "Deskripsi": w.description,
            "RT": w.rt,
            "Jumlah": w.amount
        }));

        // worksheet
        const worksheet =
            XLSX.utils.json_to_sheet(excelData);

        // workbook
        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Data Kas"
        );

        // nama file
        const fileName = selectedRT
            ? `data-kas-rt-${selectedRT}.xlsx`
            : 'data-kas-semua-rt.xlsx';

        // download
        XLSX.writeFile(workbook, fileName);

        // tutup modal
        document.getElementById('kas-export').style.display = 'none';

    } catch (err) {

        console.error(err);

        alert('Gagal export data');

    }
},

    renderTransactions(filter = '', rtFilter = '', typeFilter = '', yearFilter = '', monthFilter = '') {
        const transactions = storage.get('transactions');
        const tbody = document.querySelector('table tbody');
        if (!tbody) return;

        const filtered = transactions.filter(t => {
            const desc = (t.description || '').toLowerCase();
            const matchSearch = desc.includes(filter.toLowerCase());
            const matchRT = !rtFilter || t.rt === rtFilter;
            const matchType = !typeFilter || t.type === typeFilter;
            const matchYear = !yearFilter || new Date(t.date).getFullYear().toString() === yearFilter;
            const matchMonth = !monthFilter || (new Date(t.date).getMonth() + 1).toString() === monthFilter;
            return (
                matchSearch && 
                matchRT && 
                matchType && 
                matchYear && 
                matchMonth
            );
        });

        this.updateSummary(filtered);

        if (!filtered.length) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Tidak ada data</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(t => `
            <tr>
                <td>${new Date(t.date).toLocaleDateString('id-ID')}</td>
                <td>${t.type}</td>
                <td>${t.description}</td>
                <td>${t.rt}</td>
                <td style="text-align:right" class="${t.type === 'Masuk' ? 'amount-in' : 'amount-out'}">${formatRupiah(t.amount)}</td>
                <td>
                    <button onclick="KeuanganController.edit('${t.id}')">✏️</button>
                    <button onclick="KeuanganController.hapus('${t.id}')">🗑️</button>
                </td>
            </tr>
        `).join('');
    },

    setupEventListeners() {
        const searchInput = document.querySelector('.search-input');
        const rtSelect = document.getElementById('filter-rt');
        const typeSelect = document.getElementById('filter-type');
        const yearSelect = document.getElementById('filter-year');
        const monthSelect = document.getElementById('filter-month');

        const apply = () => {
            this.renderTransactions(
                searchInput?.value || '',
                rtSelect?.value || '',
                typeSelect?.value || '',
                yearSelect?.value || '',
                monthSelect?.value || ''
            );
        };

        searchInput?.addEventListener('input', apply);
        rtSelect?.addEventListener('change', apply);
        typeSelect?.addEventListener('change', apply);
        yearSelect?.addEventListener('change', apply);
        monthSelect?.addEventListener('change', apply);
    },

    setupModal() {
        const form = document.getElementById('form-add-transaksi');
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTransaction();
        });
    },

    openModal() {
        this.currentEditId = null;
        const form = document.getElementById('form-add-transaksi');
        if (form) form.reset();
        
        const modal = document.getElementById('modal-add-transaksi');
        if (modal) modal.style.display = 'flex';
        
        this.setupRTSelectModal();
},

    closeModal() {
        const modal = document.getElementById('modal-add-transaksi');
        if (modal) modal.style.display = 'none';
    },

    setupRTSelectModal() {
        const rtInput = document.getElementById('input-rt');
        if (rtInput) {
            const rts = storage.get('rts');
            rtInput.innerHTML = rts.map(rt => `<option value="${rt}">${rt}</option>`).join('');
        }
    },

    edit(id) {
        const data = storage.get('transactions');
        const t = data.find(x => x.id === id);
        if (!t) return;
        
        this.setupRTSelectModal();

        document.getElementById('input-date').value = t.date;
        document.getElementById('input-type').value = t.type;
        document.getElementById('input-amount').value = t.amount;
        document.getElementById('input-rt').value = t.rt;
        document.getElementById('input-desc').value = t.description;

        this.currentEditId = id;
        document.getElementById('modal-add-transaksi').style.display = 'flex';
    },

    async saveTransaction() {
        const user = JSON.parse(localStorage.getItem('user'));
        const data = {
            id: this.currentEditId || Date.now().toString(),
            operator: user ? user.username : 'System',
            date: document.getElementById('input-date').value,
            type: document.getElementById('input-type').value,
            amount: parseInt(document.getElementById('input-amount').value),
            rt: document.getElementById('input-rt').value,
            description: document.getElementById('input-desc').value
        };

        // TAMBAH / EDIT
            try {
                let res;

                if (this.currentEditId) {
                res = await fetch('/api/kas', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } else {
                res = await fetch('/api/kas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }

                if (!res.ok){ 
                    const text = await res.text();
                    console.log(text);
                    throw new Error(text);
                }
                // reload data terbaru
                await this.loadFromServer();

            } catch (err) {
                console.log('Offline mode');
                
                // fallback localStorage
                let local = storage.get('transactions') || [];

                if (this.currentEditId) {
                    local = local.map(item =>
                    item.id === data.id ? data : item
                );
            } else {
                local.push(data);
                }

                storage.set('transactions', local);
            }
                this.currentEditId = null;

                this.renderTransactions();
                this.updateSummary();

                document.getElementById('form-add-transaksi').reset();
                document.getElementById('modal-add-transaksi').style.display = 'none';
    },

    async hapus(id) {
        if (!confirm('Hapus data ini?')) return;

        try {
            const res = await fetch('/api/kas', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });

            if (!res.ok) {
                const text = await res.text();
                console.log(text);
                throw new Error(text);
            }

            await this.loadFromServer();
        
        } catch (err) {
            console.log('Offline mode');

            let local = storage.get('transactions') || [];
            local = local.filter(item => item.id !== id);
            storage.set('transactions', local);
        }

        this.renderTransactions();
        this.updateSummary();
    }
};

const GaleriController = {
    data: [],
    currentEditId: null,
    tempPhotos: [],
    currentLightboxAlbum: null,
    currentPhotoIndex: 0,

    init() {
        this.setupRTFilter();
        this.load();
        const form = document.getElementById('form-add-album');
        if (form) form.addEventListener('submit', (e) => this.saveAlbum(e));
    },

    setupRTFilter() {
        const selects = [document.getElementById('filter-rt-galeri'), document.getElementById('input-rt')];
        const rts = storage.get('rts');
        
        selects.forEach(select => {
            if (select) {
                const isFilter = select.id === 'filter-rt-galeri';
                select.innerHTML = (isFilter ? '<option value="">Semua Unit</option>' : '') + 
                    rts.map(rt => `<option value="${rt}">${rt}</option>`).join('');
            }
        });
    },

    async load() {

    try {

        const res =
            await fetch('/api/upload-galeri');

        this.data =
            await res.json();

        this.render();

    } catch (err) {

        console.error(err);

    }
},

    render() {
        const container = document.querySelector('.gallery-grid');
        if (!container) return;

        const filterRT = document.getElementById('filter-rt-galeri')?.value;
        const searchVal = document.getElementById('search-galeri')?.value.toLowerCase();

        const filtered = this.data.filter(a => {
            const matchRT = !filterRT || a.rt === filterRT;
            const matchSearch = !searchVal || a.activityName.toLowerCase().includes(searchVal);
            return matchRT && matchSearch;
        });

        if (!filtered.length) {
            container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted); font-style: italic;">Tidak ada dokumentasi yang sesuai.</p>';
            return;
        }

        container.innerHTML = filtered.map(a => `
            <div class="album-card">
                <div class="album-image-wrapper">
                    <img src="${a.photos[0]}" class="album-image" alt="${a.activityName}">
                    <span class="album-badge-rt">${a.rt}</span>
                    <span class="album-badge-count">${a.photos.length} Foto</span>
                </div>
                <div class="album-content">
                    <div class="album-date">${new Date(a.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    <h3 class="album-title">${a.activityName}</h3>
                    <p class="album-desc">${a.description}</p>
                    <div class="album-footer">
                        <button class="btn-primary" onclick="GaleriController.viewAlbum('${a.id}')" style="background: var(--text-muted);">👁️ Lihat</button>
                        <button class="btn-primary" onclick="GaleriController.editAlbum('${a.id}')">✏️ Edit</button>
                        <button class="btn-primary" onclick="GaleriController.deleteAlbum('${a.id}')" style="background: var(--danger);">🗑️</button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    openModal() {
        if (!this.currentEditId) {
            document.getElementById('form-add-album').reset();
            this.tempPhotos = [];
            document.querySelector('#modal-add-album h3').innerText = 'Tambah Album Kegiatan';
            document.querySelector('#form-add-album button[type="submit"]').innerText = 'Simpan Album';
        }
        document.getElementById('modal-add-album').style.display = 'flex';
        this.setupRTFilter(); // Refresh list RT saat buka modal
        this.renderPhotoList();
    },

    closeModal() {
        this.currentEditId = null;
        document.getElementById('modal-add-album').style.display = 'none';
    },

    editAlbum(id) {
        const album = this.data.find(a => a.id === id);
        if (!album) return;

        this.currentEditId = id;
        document.getElementById('input-activityName').value = album.activityName;
        document.getElementById('input-date').value = album.date;
        document.getElementById('input-rt').value = album.rt;
        document.getElementById('input-description').value = album.description;
        this.tempPhotos = [...album.photos];    

            // tampilkan preview foto
        this.renderPhotoList();

        document.querySelector('#modal-add-album h3').innerText = 'Edit Album Kegiatan';
        document.querySelector('#form-add-album button[type="submit"]').innerText = 'Update Album';
        this.openModal();
    },

    deleteAlbum(id) {
    await fetch('/api/upload-galeri', {
    method: 'delete',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id })
});
    },

    async saveAlbum(e) {
        e.preventDefault();
        if (this.tempPhotos.length === 0) return alert('Pilih minimal satu foto!');

        const albumData = {
            id: this.currentEditId || Date.now().toString(),
            activityName: document.getElementById('input-activityName').value,
            date: document.getElementById('input-date').value,
            rt: document.getElementById('input-rt').value,
            description: document.getElementById('input-description').value,
            photos: this.tempPhotos
        };

        if (this.currentEditId) {
            this.data = this.data.map(a => a.id === this.currentEditId ? albumData : a);
        } else {
            this.data.push(albumData);
        }

        await fetch('/api/upload-galeri', {
        method: this.currentEditId ? 'PUT' : 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(albumData)
    });
        this.closeModal();
        this.render();
    },

    addPhotoFromUrl() {
        const urlInput = document.getElementById('input-photo-url');
        const url = urlInput.value.trim();
        if (url) {
            this.tempPhotos.push(url);
            urlInput.value = '';
            this.renderPhotoList();
        }
    },

async handleFilesSelect(input) {

    const files = Array.from(input.files);

    for (const file of files) {

        const fileName =
            `${Date.now()}-${file.name}`;

        const formData = new FormData();
        formData.append('file', file);

        try {

            const res =
                await fetch('/api/upload-galeri', {
                    method: 'POST',
                    body: formData
                });

            const result =
                await res.json();

            if (result.url) {
                this.tempPhotos.push(result.url);
            }

        } catch (err) {

            console.error(err);

            alert('Upload gagal');

        }
    }

    this.renderPhotoList();
},

    renderPhotoList() {
        const container = document.getElementById('photo-list-container');
        if (!container) return;
        container.innerHTML = this.tempPhotos.map((p, index) => `
            <div style="display: flex; align-items: center; gap: 0.5rem; background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; border: 1px solid #e2e8f0;">
                <img src="${p}" style="width: 30px; height: 30px; object-fit: cover; border-radius: 0.125rem;">
                <span style="flex: 1; font-size: 0.7rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${p.startsWith('data:') ? 'File Terunggah' : p}</span>
                <button type="button" onclick="GaleriController.removePhoto(${index})" style="background: none; border: none; color: var(--danger); cursor: pointer; font-size: 1rem;">&times;</button>
            </div>
        `).join('');
    },

    removePhoto(index) {
        this.tempPhotos.splice(index, 1);
        this.renderPhotoList();
    },

    viewAlbum(id) {
        const album = this.data.find(a => a.id === id);
        if (!album || !album.photos.length) return;

        this.currentLightboxAlbum = album;
        this.currentPhotoIndex = 0;
        this.updateLightbox();
        document.getElementById('lightbox-overlay').style.display = 'flex';
    },

    updateLightbox() {
        const img = document.getElementById('lightbox-image');
        const caption = document.getElementById('lightbox-caption');
        if (!img || !this.currentLightboxAlbum) return;

        const currentPhoto = this.currentLightboxAlbum.photos[this.currentPhotoIndex];
        img.src = currentPhoto;
        caption.innerText = `${this.currentLightboxAlbum.activityName} (${this.currentPhotoIndex + 1} / ${this.currentLightboxAlbum.photos.length})`;
    },

    nextPhoto() {
        if (!this.currentLightboxAlbum) return;
        this.currentPhotoIndex = (this.currentPhotoIndex + 1) % this.currentLightboxAlbum.photos.length;
        this.updateLightbox();
    },

    prevPhoto() {
        if (!this.currentLightboxAlbum) return;
        this.currentPhotoIndex = (this.currentPhotoIndex - 1 + this.currentLightboxAlbum.photos.length) % this.currentLightboxAlbum.photos.length;
        this.updateLightbox();
    },

    closeLightbox() {
        document.getElementById('lightbox-overlay').style.display = 'none';
        this.currentLightboxAlbum = null;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    UI.initSidebar();
    if (typeof KeuanganController !== 'undefined') {
        const keuanganPage = document.getElementById('total-saldo');
        if (keuanganPage) KeuanganController.init();
    }
    if (typeof WargaController !== 'undefined') {
        const wargaPage = document.getElementById('tbody-warga');
        if (wargaPage) WargaController.init();
    }
    if (typeof DashboardController !== 'undefined') {
        const dashboardPage = document.querySelector('.stats-grid');
        if (dashboardPage) DashboardController.init();
    }
    if (typeof SettingsController !== 'undefined') {
        const settingsPage = document.querySelector('.settings-grid');
        if (settingsPage) SettingsController.init();
    }
    if (typeof PenggunaController !== 'undefined') {
        const settingsPage = document.querySelector('.settings-grid');
        if (settingsPage) PenggunaController.init();
    }
    if (typeof LogController !== 'undefined') {
        const settingsPage = document.querySelector('.settings-grid');
        if (settingsPage) LogController.init();
    }
    if (typeof GaleriController !== 'undefined') {
        const galeriPage = document.querySelector('.gallery-grid');
        if (galeriPage) GaleriController.init();
    }
});