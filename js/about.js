document.addEventListener('DOMContentLoaded', function () {
    initAboutFaq();
    updateExperienceYears();
    initToolsReveal();
});

// Анимация появления карточек инструментов на странице Обо мне
function initToolsReveal() {
    const toolItems = document.querySelectorAll('.tools-grid .tool-item');
    if (!toolItems.length) return;

    toolItems.forEach((item, index) => {
        item.style.transitionDelay = `${Math.min(index * 60, 360)}ms`;
    });

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('tool-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -10%' });

        toolItems.forEach(item => observer.observe(item));
    } else {
        // Фоллбек без Observer
        toolItems.forEach(item => item.classList.add('tool-visible'));
    }

    // Эффект "подсветки" под курсором внутри карточки
    document.querySelectorAll('.tool-item').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mx', x + '%');
            card.style.setProperty('--my', y + '%');
        });
    });
}

// FAQ аккордеон на странице Обо мне
function initAboutFaq() {
    const faqItems = document.querySelectorAll('.faq .faq-item');
    if (!faqItems.length) return;

    const openItem = (item) => {
        const answer = item.querySelector('.faq-answer');
        const btn = item.querySelector('.faq-question');
        if (!answer || !btn) return;

        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');

        // Временно открываем для измерения полной высоты
        answer.style.height = 'auto';
        const fullHeight = answer.getBoundingClientRect().height;
        answer.style.height = '0px';

        // Принудительный reflow
        void answer.offsetHeight;

        // Анимируем до полной высоты
        requestAnimationFrame(() => {
            answer.style.height = `${fullHeight}px`;
        });

        // После анимации переводим в auto для адаптивности
        const onTransitionEnd = (e) => {
            if (e.propertyName === 'height' && item.classList.contains('open')) {
                answer.style.height = 'auto';
                answer.removeEventListener('transitionend', onTransitionEnd);
            }
        };
        answer.addEventListener('transitionend', onTransitionEnd);
    };

    const closeItem = (item) => {
        const answer = item.querySelector('.faq-answer');
        const btn = item.querySelector('.faq-question');
        if (!answer || !btn) return;

        // Получаем текущую высоту
        const currentHeight = answer.getBoundingClientRect().height;
        answer.style.height = `${currentHeight}px`;

        // Принудительный reflow
        void answer.offsetHeight;

        // Анимируем до 0
        requestAnimationFrame(() => {
            answer.style.height = '0px';
        });

        btn.setAttribute('aria-expanded', 'false');
        item.classList.remove('open');
    };

    faqItems.forEach((item) => {
        const btn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (!btn || !answer) return;

        // Начальная установка
        if (item.classList.contains('open')) {
            // Для открытого по умолчанию сразу ставим auto
            answer.style.height = 'auto';
            btn.setAttribute('aria-expanded', 'true');
        } else {
            answer.style.height = '0px';
            btn.setAttribute('aria-expanded', 'false');
        }

        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Закрываем все
            faqItems.forEach(other => {
                if (other !== item) {
                    closeItem(other);
                }
            });

            // Переключаем текущий
            if (!isOpen) {
                openItem(item);
            } else {
                closeItem(item);
            }
        });

        // Адаптация при изменении размера окна
        window.addEventListener('resize', () => {
            if (item.classList.contains('open')) {
                // При ресайзе поддерживаем auto для адаптивности
                answer.style.height = 'auto';
            }
        });
    });
}


// Динамическое обновление лет опыта
function updateExperienceYears() {
    const el = document.querySelector('.experience-years');
    if (!el) return;
    const startYearAttr = el.getAttribute('data-start-year');
    const startYear = startYearAttr ? parseInt(startYearAttr, 10) : null;
    if (!startYear || Number.isNaN(startYear)) return;

    const now = new Date();
    let years = now.getFullYear() - startYear;

    // Уточняем по месяцу/дню: считаем опыт полных лет
    // Если старт позже текущей даты по месяцу/дню — уменьшаем на 1
    const started = new Date(startYear, 0, 1);
    const anniversary = new Date(now.getFullYear(), started.getMonth(), started.getDate());
    if (now < anniversary) {
        years = Math.max(0, years - 1);
    }

    el.textContent = String(years);
}