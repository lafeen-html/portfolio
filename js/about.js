document.addEventListener('DOMContentLoaded', function () {
    updateExperienceYears();
    initToolsReveal();
    initFadeInAnimations();
    initEducationAnimations();
    initSkillsAnimation();
});

// Анимация появления карточек инструментов
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
        toolItems.forEach(item => item.classList.add('tool-visible'));
    }

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

// Анимация для секции образования
function initEducationAnimations() {
    const educationItems = document.querySelectorAll('.education-item');
    
    if (!educationItems.length) return;
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                    
                    // Добавляем небольшую задержку между элементами
                    const index = Array.from(educationItems).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        educationItems.forEach(item => observer.observe(item));
    } else {
        educationItems.forEach((item, index) => {
            item.classList.add('visible');
            item.style.transitionDelay = `${index * 0.1}s`;
        });
    }
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

    const started = new Date(startYear, 0, 1);
    const anniversary = new Date(now.getFullYear(), started.getMonth(), started.getDate());
    if (now < anniversary) {
        years = Math.max(0, years - 1);
    }

    el.textContent = String(years);
}

// Анимация плавного появления элементов
function initFadeInAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in-element');
    
    if (!fadeElements.length) return;
    
    // Функция для проверки видимости элемента
    function checkFadeElements() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                // Применяем задержку из CSS переменной, если она есть
                const delay = getComputedStyle(element).getPropertyValue('--delay') || '0s';
                element.style.transitionDelay = delay;
                element.classList.add('visible');
            }
        });
    }
    
    // Проверяем при загрузке и скролле
    checkFadeElements();
    window.addEventListener('scroll', checkFadeElements);
}

// Обработка ошибок загрузки изображений
function handleEducationImageErrors() {
    const educationImages = document.querySelectorAll('.education-image img');
    
    educationImages.forEach(img => {
        img.addEventListener('error', function() {
            this.style.opacity = '0.7';
            this.style.filter = 'grayscale(100%)';
        });
    });
}

// Инициализация при полной загрузке
window.addEventListener('load', function() {
    handleEducationImageErrors();
    
    // Принудительно показываем видимые элементы образования
    const educationItems = document.querySelectorAll('.education-item');
    educationItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            item.classList.add('visible');
        }
    });
});

// Анимация прогресс-баров
function initSkillsAnimation() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const progressFill = progressBar.querySelector('.progress-fill');
                const level = progressBar.getAttribute('data-level');
                
                // Задержка для последовательной анимации
                const index = Array.from(progressBars).indexOf(progressBar);
                const delay = index * 200;
                
                setTimeout(() => {
                    progressFill.style.width = level + '%';
                }, delay);
                
                observer.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => observer.observe(bar));
}

function initFadeInAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in-element');
    
    if (!fadeElements.length) return;
    
    function checkFadeElements() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                const delay = getComputedStyle(element).getPropertyValue('--delay') || '0s';
                element.style.transitionDelay = delay;
                element.classList.add('visible');
            }
        });
    }
    
    checkFadeElements();
    window.addEventListener('scroll', checkFadeElements);
    
    // Инициализируем анимацию навыков
    initSkillsAnimation();
}