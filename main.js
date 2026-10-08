// ============================================
// MAIN.JS — Основная логика сайта
// ============================================

// ===== ТЕКУЩИЙ ЯЗЫК И ТЕМА =====
let currentLang = localStorage.getItem('lang') || 'en';
let currentTheme = localStorage.getItem('theme') || 'dark';

// ===== ПРИМЕНИТЬ ПЕРЕВОД =====
function applyTranslation(lang) {
    const t = translations[lang];
    if (!t) return;

    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (t[key] !== undefined) {
            if (el.tagName === 'TITLE') {
                document.title = t[key];
            } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = t[key];
            } else {
                el.textContent = t[key];
            }
        }
    });

    document.documentElement.lang = lang;
}

// ===== УСТАНОВИТЬ ЯЗЫК =====
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    applyTranslation(lang);
}

// ===== УСТАНОВИТЬ ТЕМУ =====
function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    const darkBtn = document.getElementById('themeDark');
    const lightBtn = document.getElementById('themeLight');
    if (darkBtn && lightBtn) {
        darkBtn.classList.toggle('active', theme === 'dark');
        lightBtn.classList.toggle('active', theme === 'light');
    }
}

// ===== НАСТРОЙКИ =====
function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    if (panel) panel.classList.toggle('open');
}

// Закрыть настройки при клике вне
document.addEventListener('click', function(e) {
    const panel = document.getElementById('settingsPanel');
    const btn = document.querySelector('.settings-btn');
    if (panel && btn && !panel.contains(e.target) && !btn.contains(e.target)) {
        panel.classList.remove('open');
    }
});

// ===== БУРГЕР-МЕНЮ =====
function toggleMenu() {
    const menu = document.getElementById('navLinks');
    if (menu) menu.classList.toggle('open');
}

// Закрыть меню при клике на ссылку (на мобильных)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        const menu = document.getElementById('navLinks');
        if (menu) menu.classList.remove('open');
    });
});

// ===== КНОПКА НАВЕРХ =====
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', () => {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;
    if (window.scrollY > 400) {
        btn.classList.add('visible');
    } else {
        btn.classList.remove('visible');
    }
});

// ===== АВТООПРЕДЕЛЕНИЕ ЯЗЫКА ПО БРАУЗЕРУ =====
function detectBrowserLanguage() {
    const browserLang = (navigator.language || 'en').toLowerCase();
    const supported = Object.keys(translations);
    if (supported.includes(browserLang)) return browserLang;
    const short = browserLang.slice(0, 2);
    if (supported.includes(short)) return short;
    return 'en';
}

// ===== СЧЁТЧИК ПОСЕЩЕНИЙ =====
function initCounter() {
    const counterEl = document.getElementById('counterNumber');
    if (!counterEl) return;

    // Получаем текущее значение из localStorage
    let visits = parseInt(localStorage.getItem('visitCount') || '0');
    visits += 1;
    localStorage.setItem('visitCount', visits);

    // Анимированное увеличение
    let current = 0;
    const target = visits;
    const duration = 1500;
    const step = target / (duration / 30);

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        counterEl.textContent = Math.floor(current).toLocaleString();
    }, 30);
}

// ===== ПОИСК ПО САЙТУ =====
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const resultsBox = document.getElementById('searchResults');
    if (!searchInput || !resultsBox) return;

    // Собираем все секции
    const sections = [
        { id: 'flag', key: 'flag_title' },
        { id: 'countries', key: 'countries_title' },
        { id: 'peoples', key: 'peoples_title' },
        { id: 'history', key: 'history_title' },
        { id: 'timeline', key: 'timeline_title' },
        { id: 'people', key: 'people_title' },
        { id: 'mythology', key: 'myth_title' },
        { id: 'tamga', key: 'tamga_title' },
        { id: 'holidays', key: 'holidays_title' },
        { id: 'languages', key: 'languages_title' },
        { id: 'alphabets', key: 'alphabets_title' },
        { id: 'population', key: 'population_title' },
        { id: 'distance', key: 'distance_title' },
        { id: 'facts', key: 'facts_title' }
    ];

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        resultsBox.innerHTML = '';

        if (query.length < 2) return;

        const t = translations[currentLang] || translations.en;
        const found = sections.filter(s => {
            const title = (t[s.key] || '').toLowerCase();
            return title.includes(query);
        });

        if (found.length === 0) {
            resultsBox.innerHTML = '<div class="search-result-item">—</div>';
            return;
        }

        found.forEach(s => {
            const div = document.createElement('div');
            div.className = 'search-result-item';
            div.innerHTML = `<strong>${t[s.key]}</strong>`;
            div.onclick = () => {
                document.getElementById(s.id).scrollIntoView({ behavior: 'smooth' });
                resultsBox.innerHTML = '';
                searchInput.value = '';
            };
            resultsBox.appendChild(div);
        });
    });
}

// ===== ПАРАЛЛАКС ФОНА =====
function initParallax() {
    const parallax = document.querySelector('.parallax-bg');
    if (!parallax) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        parallax.style.transform = `translateY(${scrolled * 0.3}px)`;
    });
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    // Язык по браузеру, если ещё не сохранён
    if (!localStorage.getItem('lang')) {
        currentLang = detectBrowserLanguage();
        localStorage.setItem('lang', currentLang);
    }

    setTheme(currentTheme);
    setLanguage(currentLang);

    const langSelect = document.getElementById('langSelect');
    if (langSelect) langSelect.value = currentLang;

    // Дополнительные функции
    initCounter();
    initSearch();
    initParallax();
});