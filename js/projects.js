document.addEventListener('DOMContentLoaded', function () {
    // Сначала обрабатываем параметры URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    // Инициализируем табы с учетом категории
    initTabs(category);
    initModalTriggers();
});

// Модальное окно
function initModalTriggers() {
    document.addEventListener('click', function (e) {
        const actionBtn = e.target.closest('.project-action-btn');
        if (actionBtn && actionBtn.querySelector('.fa-circle-info')) {
            e.preventDefault();

            const projectCard = actionBtn.closest('.project-card');
            const projectTitle = projectCard.querySelector('h4').textContent;
            const modalId = getModalIdFromTitle(projectTitle);

            if (window.modalManager) {
                window.modalManager.openModal(modalId);
            }
        }
    });
}

function getModalIdFromTitle(title) {
    // Преобразуем название проекта в ID модального окна
    const idMap = {
        'Neo AI Solutions': 'neo-modal',
        'RabotaYou': 'rabotaYou-modal',
        'DynaOL': 'dynaOl-modal',
        'Юсупово Village': 'usupovo-village-modal',
        'Le Santi': 'lesanti-modal',
        'Металл Навес': 'metall-naves-modal',
        'Vitamin D': 'vitaminD-modal',
        'Evensa': 'evensa-modal',
        'МыслеЛис': 'mindfox-modal'
    };

    return idMap[title] || null;
}

// Функция активации таба по категории
function activateTabByCategory(category, file) {
    const tabButton = document.querySelector(`.tab-button[data-category="${category}"]`);

    if (tabButton) {
        // Убираем активный класс у всех кнопок
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
            btn.style.opacity = '0.7';
        });

        // Активируем нужный таб
        tabButton.classList.add('active');
        tabButton.style.opacity = '1';

        // Загружаем контент для этого таба
        loadTabContent(category, file);
    }
}

// Функция загрузки контента таба
async function loadTabContent(category, file) {
    const container = document.getElementById('tab-content-container');
    const loadingState = document.querySelector('.loading-state');

    // Показываем состояние загрузки
    container.innerHTML = '';
    loadingState.style.display = 'flex';

    try {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const content = await response.text();
        loadingState.style.display = 'none';
        container.innerHTML = content;

        const tabContent = container.querySelector('.tab-content');
        if (tabContent) {
            tabContent.classList.add('active');
        }

        // Основные инициализации
        initCardAnimations();
        initLazyLoading();
        initProjectActions();
        ProjectImages();

        // Специфичные инициализации для разных категорий
        if (category === 'mentoring') {
            initMentoringAnimations();
            // Инициализируем FAQ после загрузки контента
            setTimeout(() => {
                initMentoringFaq();
            }, 100);
        }

    } catch (error) {
        console.error('Error loading tab content:', error);
        loadingState.style.display = 'none';
        container.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Ошибка загрузки</h3>
                <p>Не удалось загрузить проекты: ${error.message}</p>
                <p>Файл: ${file}</p>
            </div>
        `;
    }
}

// Добавьте эту функцию для инициализации FAQ наставничества
function initMentoringFaq() {
    const mentoringAccordion = document.querySelector('#tab-content-container .accordion');

    if (mentoringAccordion) {
        console.log('Initializing mentoring FAQ');
        if (typeof initSingleAccordion === 'function') {
            initSingleAccordion(mentoringAccordion);
        } else {
            // Fallback
            const accordionItems = mentoringAccordion.querySelectorAll('.accordion-item');

            // Открываем первый элемент
            if (accordionItems[0]) {
                accordionItems[0].classList.add('open');
            }

            accordionItems.forEach((item) => {
                const btn = item.querySelector('.accordion-btn');
                if (btn) {
                    btn.addEventListener('click', () => {
                        const isCurrentlyOpen = item.classList.contains('open');

                        // Закрываем все элементы
                        accordionItems.forEach(otherItem => {
                            otherItem.classList.remove('open');
                        });

                        // Открываем текущий, если был закрыт
                        if (!isCurrentlyOpen) {
                            item.classList.add('open');
                        }
                    });
                }
            });
        }
    } else {
        console.log('No mentoring accordion found');
    }
}

// Инициализация табов
function initTabs(initialCategory) {
    const tabButtons = document.querySelectorAll('.tab-button');

    // Активируем начальную категорию или первую
    if (initialCategory) {
        const tabButton = document.querySelector(`.tab-button[data-category="${initialCategory}"]`);
        if (tabButton) {
            const file = tabButton.getAttribute('data-file');
            activateTabByCategory(initialCategory, file);
        }
    } else {
        // Активируем первый таб, если категория не указана
        const firstTab = tabButtons[0];
        const firstCategory = firstTab?.getAttribute('data-category');
        const firstFile = firstTab?.getAttribute('data-file');
        if (firstCategory && firstFile) {
            activateTabByCategory(firstCategory, firstFile);
        }
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const category = this.getAttribute('data-category');
            const file = this.getAttribute('data-file');

            // Обновляем URL без перезагрузки страницы
            const url = new URL(window.location);
            if (category) {
                url.searchParams.set('category', category);
            } else {
                url.searchParams.delete('category');
            }
            window.history.pushState({}, '', url);

            activateTabByCategory(category, file);
        });
    });

    // Обработка кнопок назад/вперед
    window.addEventListener('popstate', function () {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');

        if (category) {
            const tabButton = document.querySelector(`.tab-button[data-category="${category}"]`);
            if (tabButton) {
                const file = tabButton.getAttribute('data-file');
                activateTabByCategory(category, file);
            }
        } else {
            // Активируем первый таб, если категория не указана
            const firstTab = tabButtons[0];
            const firstCategory = firstTab?.getAttribute('data-category');
            const firstFile = firstTab?.getAttribute('data-file');
            if (firstCategory && firstFile) {
                activateTabByCategory(firstCategory, firstFile);
            }
        }
    });
}

// Анимации карточек проектов
function initCardAnimations() {
    const projectCards = document.querySelectorAll('.project-card');

    // Устанавливаем задержки для анимации
    projectCards.forEach((card, index) => {
        card.style.setProperty('--delay', index);
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Intersection Observer для анимации при скролле
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Наблюдаем за всеми карточками
    projectCards.forEach(card => {
        observer.observe(card);
    });
}

// Ленивая загрузка изображений
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('.project-image img');

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Загружаем изображение (если уже не загружено)
                    if (img.getAttribute('src') !== img.getAttribute('src')) {
                        img.src = img.getAttribute('src');
                    }
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px 0px 50px 0px'
        });

        // Наблюдаем за всеми изображениями
        lazyImages.forEach(img => {
            // Устанавливаем placeholder, если нужно
            if (!img.getAttribute('src')) {
                img.setAttribute('src', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI�MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjJmMmYyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOHB4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zNWVtIj5Mb2FkaW5nLi4uPC90ZXh0Pjwvc3ZnPg==');
            }
            imageObserver.observe(img);
        });
    }
}



// Изображения проектов
function ProjectImages() {
    const basePath = window.location.pathname.includes('/pages/') ? '..' : '.';
    const projectImages = document.querySelectorAll('.project-image img');

    projectImages.forEach(img => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('http') && !src.startsWith('data:')) {
            // Если путь уже начинается с ../, оставляем как есть
            if (src.startsWith('../')) {
                return;
            }
            // Если путь начинается с ./, исправляем в зависимости от basePath
            if (src.startsWith('./')) {
                const newSrc = src.replace('./', basePath === '.' ? './' : '../');
                img.setAttribute('src', newSrc);
                return;
            }
            // Если путь абсолютный (начинается с /) или без префикса
            const newSrc = basePath === '.' ? `./${src.replace(/^\//, '')}` : `../${src.replace(/^\//, '')}`;
            img.setAttribute('src', newSrc);
        }
    });
}

// Обработка ошибок загрузки изображений
function handleImageErrors() {
    const images = document.querySelectorAll('.project-image img');

    images.forEach(img => {
        img.addEventListener('error', function () {
            console.warn('Не удалось загрузить изображение:', this.src);
            // Устанавливаем placeholder при ошибке
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjJmMmYyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOHB4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zNWVtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';
            this.alt = 'Изображение не найдено';
        });
    });
}

// Плавное появление страницы
window.addEventListener('load', function () {
    document.body.classList.add('loaded');

    // Добавляем обработчики ошибок изображений после загрузки
    handleImageErrors();
});

// Обновление табов при изменении размера окна (для адаптивности)
window.addEventListener('resize', function () {
    // Переинициализируем анимации при изменении размера
    initCardAnimations();
});

// Экспортируем функции для глобального доступа
window.projectsModule = {
    activateTabByCategory,
    initTabs,
    initCardAnimations,
    initLazyLoading,
    ProjectImages
};

// Функция загрузки контента таба
async function loadTabContent(category, file) {
    const container = document.getElementById('tab-content-container');
    const loadingState = document.querySelector('.loading-state');

    // Показываем состояние загрузки
    container.innerHTML = '';
    loadingState.style.display = 'flex';

    try {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const content = await response.text();
        loadingState.style.display = 'none';
        container.innerHTML = content;

        const tabContent = container.querySelector('.tab-content');
        if (tabContent) {
            tabContent.classList.add('active');
        }

        // Основные инициализации
        initCardAnimations();
        initLazyLoading();
        ProjectImages();

        // Специфичные инициализации для разных категорий
        if (category === 'presentations') {
            // Даем время для рендера DOM
            setTimeout(() => {
                // Проверяем, загружен ли модуль презентаций
                if (typeof window.presentationsModule !== 'undefined' &&
                    typeof window.presentationsModule.initPresentations === 'function') {
                    window.presentationsModule.initPresentations();
                } else {
                    console.warn('Presentations module not loaded');
                    // Fallback: базовые инициализации
                    initCardAnimations();
                    initLazyLoading();

                    // Простая обработка кнопок просмотра
                    const viewButtons = document.querySelectorAll('.preview-action');
                    viewButtons.forEach(button => {
                        const pdfUrl = button.getAttribute('data-pdf');
                        if (pdfUrl && pdfUrl !== '#') {
                            button.addEventListener('click', function () {
                                this.classList.add('loading');
                                setTimeout(() => {
                                    window.open(pdfUrl, '_blank');
                                    this.classList.remove('loading');
                                }, 1000);
                            });
                        }
                    });
                }
            }, 300);
        }

        if (category === 'other') {
            setTimeout(() => {
                if (typeof window.otherModule !== 'undefined' &&
                    typeof window.otherModule.initOtherTab === 'function') {
                    window.otherModule.initOtherTab();
                } else {
                    initCardAnimations();
                    initLazyLoading();
                }

                // Переинициализируем обработчики для новых элементов
                // (убираем вызов несуществующего метода)
                if (window.modalManager && window.modalManager.initGalleryImages) {
                    // Просто переинициализируем обработчики галереи
                    window.modalManager.initGalleryImages();
                }
            }, 300);
        }

        if (category === 'mentoring') {
            initMentoringAnimations();
            // Даем время для рендера DOM перед инициализацией FAQ
            setTimeout(() => {
                if (typeof initFaq === 'function') {
                    initFaq();
                }
            }, 300);
        }

    } catch (error) {
        console.error('Error loading tab content:', error);
        loadingState.style.display = 'none';
        container.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Ошибка загрузки</h3>
                <p>Не удалось загрузить проекты: ${error.message}</p>
                <p>Файл: ${file}</p>
            </div>
        `;
    }
}

function initMentoringAnimations() {
    const fadeElements = document.querySelectorAll('#tab-content-container .fade-in-element');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.style.getPropertyValue('--delay') || '0s';
                entry.target.style.transitionDelay = delay;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // Инициализация плавной прокрутки
    initSmoothScroll();

    // Инициализация FAQ после небольшой задержки, чтобы DOM успел обновиться
    setTimeout(() => {
        if (typeof initFaq === 'function') {
            initFaq();
        }
    }, 100);
}

// Плавная прокрутка к контактам
function initSmoothScroll() {
    const contactLinks = document.querySelectorAll('#tab-content-container a[href="#contact"]');

    contactLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}