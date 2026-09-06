// ============================================================
// 1. LOADING SCREEN
// ============================================================
window.addEventListener('load', function() {
    const loader = document.getElementById('loader');
    setTimeout(function() {
        loader.classList.add('hide');
    }, 600);
});

// ============================================================
// 2. NAVIGATION
// ============================================================
const links = document.querySelectorAll('#navMenu a');
const pages = {
    home: 'page-home',
    install: 'page-install',
    callbacks: 'page-callbacks',
    player: 'page-player',
    world: 'page-world',
    commands: 'page-commands',
    storage: 'page-storage',
    dialogs: 'page-dialogs'
};

const pageNames = {
    home: '🏠 Home',
    install: '📦 Installation',
    callbacks: '🔔 Callbacks',
    player: '👤 Player Methods',
    world: '🌍 World Methods',
    commands: '⚡ Commands',
    storage: '💾 Data Storage',
    dialogs: '💬 Dialogs'
};

function navigateTo(page) {
    // Update active link
    links.forEach(l => l.classList.remove('active'));
    document.querySelector(`#navMenu a[data-page="${page}"]`)?.classList.add('active');

    // Show page
    Object.keys(pages).forEach(key => {
        const el = document.getElementById(pages[key]);
        el.style.display = key === page ? 'block' : 'none';
    });

    // Update breadcrumb
    document.getElementById('breadcrumb').textContent = pageNames[page] || '📄 ' + page;

    // Close mobile menu
    closeMobileMenu();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

links.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        navigateTo(this.dataset.page);
    });
});

// ============================================================
// 3. SEARCH
// ============================================================
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('keyup', function() {
    const query = this.value.toLowerCase().trim();
    const navItems = document.querySelectorAll('#navMenu a');

    navItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        const shouldShow = !query || text.includes(query);
        item.style.display = shouldShow ? '' : 'none';
    });
});

// Ctrl+K shortcut
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
});

// ============================================================
// 4. COPY CODE
// ============================================================
function copyCode(btn) {
    const pre = btn.parentElement.querySelector('pre');
    const code = pre.textContent;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
            showCopiedFeedback(btn);
        }).catch(() => {
            fallbackCopy(code, btn);
        });
    } else {
        fallbackCopy(code, btn);
    }
}

function fallbackCopy(text, btn) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showCopiedFeedback(btn);
}

function showCopiedFeedback(btn) {
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
    btn.classList.add('done');
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('done');
    }, 2000);
}

// ============================================================
// 5. THEME TOGGLE (Dark / Light)
// ============================================================
const themeToggle = document.getElementById('themeToggle');
const themeToggleTop = document.getElementById('themeToggleTop');
const html = document.documentElement;

function toggleTheme() {
    const current = html.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Update icons
    const icon = newTheme === 'dark' ? 'fa-moon' : 'fa-sun';
    const label = newTheme === 'dark' ? 'Dark' : 'Light';
    themeToggle.querySelector('i').className = 'fas ' + icon;
    themeToggle.querySelector('span').textContent = label;
    themeToggleTop.querySelector('i').className = 'fas ' + icon;
}

themeToggle.addEventListener('click', toggleTheme);
themeToggleTop.addEventListener('click', toggleTheme);

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
const icon = savedTheme === 'dark' ? 'fa-moon' : 'fa-sun';
const label = savedTheme === 'dark' ? 'Dark' : 'Light';
themeToggle.querySelector('i').className = 'fas ' + icon;
themeToggle.querySelector('span').textContent = label;
themeToggleTop.querySelector('i').className = 'fas ' + icon;

// ============================================================
// 6. TYPING EFFECT
// ============================================================
const typingTexts = [
    'Build custom systems with Lua',
    'Create events and dialogs',
    'Complete API reference',
    'GTPS Cloud documentation'
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById('typing-text');

function typeEffect() {
    const currentText = typingTexts[textIndex];
    if (!isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(typeEffect, 2000);
            return;
        }
        setTimeout(typeEffect, 50);
    } else {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typingTexts.length;
            setTimeout(typeEffect, 500);
            return;
        }
        setTimeout(typeEffect, 30);
    }
}

setTimeout(typeEffect, 800);

// ============================================================
// 7. BACK TO TOP
// ============================================================
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
// 8. MOBILE MENU
// ============================================================
const menuToggle = document.getElementById('menuToggle');
const closeMenu = document.getElementById('closeMenu');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

function openMobileMenu() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

menuToggle.addEventListener('click', openMobileMenu);
closeMenu.addEventListener('click', closeMobileMenu);
overlay.addEventListener('click', closeMobileMenu);

// ============================================================
// 9. SMOOTH SCROLL UNTUK TOC LINKS
// ============================================================
document.querySelectorAll('.toc a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ============================================================
// 10. KEYBOARD SHORTCUT: ESC untuk close menu
// ============================================================
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
});

console.log('✅ GTPS Docs v2.0 loaded!');
