// ============================================
// ANIMATIONS.JS — Частицы, появление при скролле
// ============================================

// ===== ЧАСТИЦЫ НА ФОНЕ =====
function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    // Создаём частицы
    const count = Math.min(60, Math.floor(window.innerWidth / 25));

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 0.5,
            dx: (Math.random() - 0.5) * 0.5,
            dy: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.2
        });
    }

    function getColor() {
        const theme = document.documentElement.getAttribute('data-theme');
        return theme === 'light' ? '42, 122, 154' : '126, 200, 227';
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const color = getColor();

        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
            ctx.fill();

            p.x += p.dx;
            p.y += p.dy;

            if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        });

        animationId = requestAnimationFrame(draw);
    }

    draw();

    // Обновляем цвет при смене темы
    const observer = new MutationObserver(() => {});
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}

// ===== ПОЯВЛЕНИЕ ПРИ СКРОЛЛЕ =====
function initReveal() {
    const reveals = document.querySelectorAll('.reveal, .timeline-item, .card');
    if (reveals.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

// ===== АНИМАЦИЯ ДИАГРАММ =====
function initChartAnimation() {
    const bars = document.querySelectorAll('.chart-bar');
    if (bars.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                if (width) {
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                }
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    bars.forEach(bar => observer.observe(bar));
}

// ===== АНИМАЦИЯ СЧЁТЧИКА ЧИСЕЛ =====
function initNumberAnimation() {
    const numbers = document.querySelectorAll('.counter-number');
    if (numbers.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target') || '0');
                let current = 0;
                const step = target / 50;

                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = Math.floor(current).toLocaleString();
                }, 30);

                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    numbers.forEach(n => observer.observe(n));
}

// ===== ПЛАВНАЯ ПРОКРУТКА ПО ЯКОРЯМ =====
function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initReveal();
    initChartAnimation();
    initNumberAnimation();
    initSmoothAnchors();
});

// ===== ОБНОВЛЕНИЕ ПРИ СМЕНЕ ТЕМЫ =====
const themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
            // Частицы автоматически перекрасятся при следующем кадре
        }
    });
});

themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
});