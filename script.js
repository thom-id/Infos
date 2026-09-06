// ===== NAVIGATION =====
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

links.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const page = this.dataset.page;

        // Update active link
        links.forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        // Show selected page, hide others
        Object.keys(pages).forEach(key => {
            const el = document.getElementById(pages[key]);
            el.style.display = key === page ? 'block' : 'none';
        });

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// ===== SEARCH =====
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

// ===== COPY CODE =====
function copyCode(btn) {
    const pre = btn.parentElement.querySelector('pre');
    const code = pre.textContent;

    // Try using clipboard API
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
    const originalText = btn.textContent;
    btn.textContent = '✅ Copied!';
    btn.classList.add('done');
    setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('done');
    }, 2000);
}

// ===== KEYBOARD SHORTCUT =====
document.addEventListener('keydown', function(e) {
    // Ctrl + K = focus search
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
});

console.log('✅ GTPS Docs loaded!');
