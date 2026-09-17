/* =====================================================
   HTS | How To Service — Main Script
   ===================================================== */

'use strict';

/* =====================================================
   1. DATA & CONFIGURATION
   ===================================================== */

const SERVICES = {
    'paket-b': {
        id: 'paket-b',
        name: 'Paket B',
        slug: 'paket-b',
        description: 'Cocok untuk komunitas kecil yang baru memulai server Discord.',
        price: 15000,
        maxRevisions: 0,
        features: [
            'Setup Category & Channel',
            'Setup Roles & Auto Role',
            'Setup Permissions',
        ],
    },
    'paket-a': {
        id: 'paket-a',
        name: 'Paket A',
        slug: 'paket-a',
        description: 'Paket lengkap dengan sistem ticket, welcome, dan custom request.',
        price: 25000,
        maxRevisions: 2,
        features: [
            'Setup Category & Channel',
            'Ticket System',
            'Invite Log',
            'Welcome System & Banner',
            'Setup Bot All',
            'Setup Roles & Auto Role',
            'Setup Permissions',
            'Custom Request (2x Req)',
        ],
    },
};

const FAQ_DATA = [
    {
        q: 'Apakah saya harus memiliki server Discord?',
        a: 'Tidak. Server Discord akan disediakan oleh HTS.',
    },
    {
        q: 'Apakah server akan menjadi milik saya?',
        a: 'Ya. Setelah setup selesai, server akan diserahkan sepenuhnya kepada pembeli.',
    },
    {
        q: 'Apakah server dibuat dari awal?',
        a: 'Ya. Server akan dibuat dan disusun dari awal sesuai kebutuhan dan permintaan pembeli.',
    },
    {
        q: 'Berapa lama proses Aktivasi?',
        a: 'Proses Aktivasi paket akan diproses kurang dari 15 menit setelah payment berhasil dikonfirmasi oleh kami.',
    },
    {
        q: 'Apakah bisa request sesuai keinginan?',
        a: 'Bisa. Paket A sudah termasuk request custom.',
    },
    {
        q: 'Apakah bisa revisi?',
        a: 'Ya, gratis revisi sebanyak 2 kali untuk Paket A.',
    },
    {
        q: 'Apakah saya bisa menambahkan bot sendiri?',
        a: 'Bisa. Kamu dapat meminta bot tertentu untuk ditambahkan selama sesuai dengan kebutuhan server.',
    },
    {
        q: 'Bagaimana cara melakukan pembayaran?',
        a: 'Pembayaran dilakukan sebelum pengerjaan dimulai, melalui QRIS yang tersedia di halaman pembayaran.',
    },
    {
        q: 'Apakah bisa refund?',
        a: 'Tidak. Refund tidak berlaku setelah pengerjaan dimulai. Kebijakan kami adalah No Refund.',
    },
];

const STORAGE_KEYS = {
    USER: 'hts_user',
    ORDERS: 'hts_orders',
    CURRENT_ORDER: 'hts_current_order',
};

/* =====================================================
   2. UTILITIES
   ===================================================== */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

function formatRupiah(num) {
    return 'Rp ' + num.toLocaleString('id-ID');
}

function generateOrderNumber() {
    const rand = Math.floor(10000 + Math.random() * 90000);
    return 'HTS-' + rand;
}

function generateId() {
    return 'ord_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}

function showToast(message, type = 'info') {
    const container = $('#toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
}

function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('.modal-overlay.active')) {
        document.body.classList.remove('modal-open');
    }
}

function closeAllModals() {
    $$('.modal-overlay').forEach((m) => closeModal(m));
}

/* =====================================================
   3. STORAGE (SIMULASI BACKEND)
   ===================================================== */

const Store = {
    getUser() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null');
        } catch {
            return null;
        }
    },
    setUser(user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    },
    clearUser() {
        localStorage.removeItem(STORAGE_KEYS.USER);
    },
    getOrders() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
        } catch {
            return [];
        }
    },
    saveOrder(order) {
        const orders = Store.getOrders();
        orders.push(order);
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        return order;
    },
    updateOrder(orderId, updates) {
        const orders = Store.getOrders();
        const idx = orders.findIndex((o) => o.id === orderId);
        if (idx === -1) return null;
        orders[idx] = { ...orders[idx], ...updates, updatedAt: new Date().toISOString() };
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        return orders[idx];
    },
    findOrder(orderId) {
        return Store.getOrders().find((o) => o.id === orderId) || null;
    },
};

/* =====================================================
   4. NAVBAR & NAVIGATION
   ===================================================== */

function initNavbar() {
    const navbar = $('#navbar');
    const navToggle = $('#navToggle');
    const navMenu = $('#navMenu');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    });

    navToggle?.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close mobile menu on link click
    $$('.nav-link').forEach((link) => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            $$('.nav-link').forEach((l) => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Active link on scroll
    const sections = $$('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 120;
        sections.forEach((sec) => {
            const top = sec.offsetTop;
            const bottom = top + sec.offsetHeight;
            const id = sec.getAttribute('id');
            const link = $(`.nav-link[data-nav="${id}"]`);
            if (link) {
                if (scrollY >= top && scrollY < bottom) {
                    $$('.nav-link').forEach((l) => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });
}

/* =====================================================
   5. FAQ
   ===================================================== */

function renderFAQ() {
    const list = $('#faqList');
    if (!list) return;

    list.innerHTML = FAQ_DATA.map(
        (item, i) => `
        <div class="faq-item" data-faq-index="${i}">
            <button class="faq-question" aria-expanded="false">
                <span>${item.q}</span>
                <span class="faq-icon" aria-hidden="true">+</span>
            </button>
            <div class="faq-answer">
                <p>${item.a}</p>
            </div>
        </div>
    `
    ).join('');

    $$('.faq-question', list).forEach((btn) => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isActive = item.classList.contains('active');
            $$('.faq-item', list).forEach((f) => {
                f.classList.remove('active');
                $('.faq-question', f).setAttribute('aria-expanded', 'false');
            });
            if (!isActive) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

/* =====================================================
   6. AUTH (SIMULASI)
   ===================================================== */

function initAuth() {
    // Login
    $('#formLogin')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = $('#loginEmail').value.trim();
        const password = $('#loginPassword').value;

        if (!email || !password) {
            showToast('Email dan password wajib diisi.', 'error');
            return;
        }

        // Simulasi login sukses
        const user = {
            id: 'user_' + Date.now(),
            name: email.split('@')[0],
            email,
            role: 'CUSTOMER',
        };
        Store.setUser(user);
        showToast('Login berhasil!', 'success');
        closeAllModals();
        updateAuthUI();
    });

    // Register
    $('#formRegister')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = $('#registerName').value.trim();
        const email = $('#registerEmail').value.trim();
        const password = $('#registerPassword').value;
        const confirm = $('#registerConfirm').value;

        if (password.length < 8) {
            showToast('Password minimal 8 karakter.', 'error');
            return;
        }
        if (password !== confirm) {
            showToast('Konfirmasi password tidak cocok.', 'error');
            return;
        }

        const user = {
            id: 'user_' + Date.now(),
            name,
            email,
            role: 'CUSTOMER',
        };
        Store.setUser(user);
        showToast('Akun berhasil dibuat!', 'success');
        closeAllModals();
        updateAuthUI();
    });

    // Modal switch links
    $('#linkRegister')?.addEventListener('click', (e) => {
        e.preventDefault();
        closeAllModals();
        openModal('modalRegister');
    });
    $('#linkLogin')?.addEventListener('click', (e) => {
        e.preventDefault();
        closeAllModals();
        openModal('modalLogin');
    });
    $('#linkForgot')?.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Fitur reset password segera hadir.', 'info');
    });
}

function updateAuthUI() {
    const user = Store.getUser();
    const btnLogin = $('#btnLogin');
    if (!btnLogin) return;

    if (user) {
        btnLogin.textContent = 'Logout';
        btnLogin.onclick = () => {
            Store.clearUser();
            showToast('Berhasil logout.', 'info');
            updateAuthUI();
        };
    } else {
        btnLogin.textContent = 'Login';
        btnLogin.onclick = () => openModal('modalLogin');
    }
}

/* =====================================================
   7. CHECKOUT
   ===================================================== */

function initPurchaseButtons() {
    $$('[data-purchase]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceId = btn.getAttribute('data-purchase');
            startCheckout(serviceId);
        });
    });
}

function startCheckout(serviceId) {
    const user = Store.getUser();
    if (!user) {
        showToast('Silakan login terlebih dahulu.', 'warning');
        openModal('modalLogin');
        return;
    }

    const service = SERVICES[serviceId];
    if (!service) {
        showToast('Service tidak ditemukan.', 'error');
        return;
    }

    // Isi form checkout
    $('#checkoutServiceId').value = service.id;
    renderOrderSummary(service);
    openModal('modalCheckout');
}

function renderOrderSummary(service) {
    const summary = $('#orderSummary');
    if (!summary) return;

    summary.innerHTML = `
        <div class="order-summary-row">
            <span>Service</span>
            <span>${service.name}</span>
        </div>
        <div class="order-summary-row">
            <span>Harga</span>
            <span>${formatRupiah(service.price)}</span>
        </div>
        <ul class="order-summary-features">
            ${service.features.map((f) => `<li>${f}</li>`).join('')}
        </ul>
    `;
    $('#orderTotal').textContent = formatRupiah(service.price);
}

function initCheckoutForm() {
    $('#formCheckout')?.addEventListener('submit', (e) => {
        e.preventDefault();

        const user = Store.getUser();
        if (!user) {
            showToast('Session habis. Silakan login kembali.', 'error');
            openModal('modalLogin');
            return;
        }

        const serviceId = $('#checkoutServiceId').value;
        const service = SERVICES[serviceId];
        if (!service) {
            showToast('Service tidak valid.', 'error');
            return;
        }

        const discordUsername = $('#discordUsername').value.trim();
        if (!discordUsername) {
            showToast('Discord Username wajib diisi.', 'error');
            return;
        }

        // Buat order (simulasi backend)
        const order = {
            id: generateId(),
            orderNumber: generateOrderNumber(),
            userId: user.id,
            serviceId: service.id,
            serviceName: service.name,
            price: service.price, // Backend asli ambil dari DB
            discordUsername,
            discordId: $('#discordId').value.trim() || null,
            request: $('#customRequest').value.trim() || null,
            notes: $('#notes').value.trim() || null,
            status: 'PENDING_PAYMENT',
            paymentStatus: 'PENDING',
            paymentProof: null,
            createdAt: new Date().toISOString(),
        };

        Store.saveOrder(order);
        closeAllModals();

        // Buka halaman pembayaran
        showPaymentPage(order);
    });
}

/* =====================================================
   8. PAYMENT
   ===================================================== */

let currentPaymentOrder = null;

function showPaymentPage(order) {
    currentPaymentOrder = order;

    $('#paymentOrderNumber').textContent = order.orderNumber;
    $('#paymentService').textContent = order.serviceName;
    $('#paymentTotal').textContent = formatRupiah(order.price);
    $('#paymentStatus').textContent = 'Menunggu Pembayaran';
    $('#paymentStatus').className = 'status-badge status-pending';
    $('#proofStatus').textContent = '';

    openModal('modalPayment');
}

function initPaymentActions() {
    // Upload bukti bayar
    $('#btnUploadProof')?.addEventListener('click', () => {
        $('#proofInput').click();
    });

    $('#proofInput')?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast('File harus berupa gambar.', 'error');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            showToast('Ukuran file maksimal 5MB.', 'error');
            return;
        }

        // Simulasi upload
        const reader = new FileReader();
        reader.onload = () => {
            if (currentPaymentOrder) {
                Store.updateOrder(currentPaymentOrder.id, {
                    paymentProof: reader.result,
                });
                $('#proofStatus').textContent = '✓ Bukti bayar terupload (menunggu verifikasi)';
                showToast('Bukti bayar berhasil diupload.', 'success');
            }
        };
        reader.readAsDataURL(file);
    });

    // Tombol "Saya Sudah Bayar"
    $('#btnAlreadyPaid')?.addEventListener('click', () => {
        if (!currentPaymentOrder) return;

        // PENTING: Tidak langsung set PAID
        // Hanya tandai sebagai konfirmasi customer
        Store.updateOrder(currentPaymentOrder.id, {
            customerConfirmed: true,
            customerConfirmedAt: new Date().toISOString(),
        });

        showToast(
            'Konfirmasi diterima. Status PAID akan diberikan setelah verifikasi tim HTS.',
            'info'
        );

        // Tampilkan modal sukses
        $('#successOrderNumber').textContent = currentPaymentOrder.orderNumber;
        $('#successService').textContent = currentPaymentOrder.serviceName;
        $('#successTotal').textContent = formatRupiah(currentPaymentOrder.price);

        closeAllModals();
        setTimeout(() => openModal('modalSuccess'), 200);
    });
}

/* =====================================================
   9. MODAL HANDLERS
   ===================================================== */

function initModals() {
    // Close button
    $$('[data-close-modal]').forEach((btn) => {
        btn.addEventListener('click', () => {
            closeModal(btn.closest('.modal-overlay'));
        });
    });

    // Click outside modal
    $$('.modal-overlay').forEach((overlay) => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal(overlay);
        });
    });

    // ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const active = $('.modal-overlay.active');
            if (active) closeModal(active);
        }
    });
}

/* =====================================================
   10. FOOTER YEAR
   ===================================================== */

function initFooter() {
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* =====================================================
   11. INIT
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    renderFAQ();
    initAuth();
    initPurchaseButtons();
    initCheckoutForm();
    initPaymentActions();
    initModals();
    initFooter();
    updateAuthUI();

    console.log('%cHTS | How To Service', 'color:#3b82f6;font-size:16px;font-weight:bold;');
    console.log('%cWebsite loaded successfully.', 'color:#94a3b8;font-size:12px;');
});
