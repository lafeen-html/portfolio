document.addEventListener('DOMContentLoaded', function () {
    // Инициализация табов
    initTabs();

    // Инициализация анимаций карточек
    initCardAnimations();

    // Инициализация ленивой загрузки изображений
    initLazyLoading();

    // Обработка параметров URL
    handleUrlParams();
});

// Новая функция для обработки параметров URL
function handleUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    if (category) {
        // Ждем немного, чтобы DOM полностью загрузился
        setTimeout(() => {
            activateTabByCategory(category);

            // Плавная прокрутка к табам
            setTimeout(() => {
                document.querySelector('.tabs-section').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
        }, 100);
    }
}

// Функция активации таба по категории
function activateTabByCategory(category) {
    const tabButton = document.querySelector(`.tab-button[data-category="${category}"]`);
    const tabContent = document.getElementById(`${category}-content`);

    if (tabButton && tabContent) {
        // Убираем активный класс у всех кнопок и контента
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
            content.style.opacity = '0';
        });

        // Активируем нужный таб
        tabButton.classList.add('active');
        tabContent.classList.add('active');

        // Плавное появление контента
        setTimeout(() => {
            tabContent.style.opacity = '1';
        }, 40);
    }
}

// Обновляем функцию initTabs для сохранения истории
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const category = this.getAttribute('data-category');

            // Обновляем URL без перезагрузки страницы
            const url = new URL(window.location);
            url.searchParams.set('category', category);
            window.history.pushState({}, '', url);

            // Убираем активный класс у всех кнопок
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');

            // Скрываем все содержимое табов
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.style.opacity = '0';
            });

            // Показываем выбранное содержимое
            const targetContent = document.getElementById(`${category}-content`);
            if (targetContent) {
                setTimeout(() => {
                    targetContent.classList.add('active');
                    targetContent.style.opacity = '1';
                }, 50);
            }
        });
    });

    // Обработка кнопок назад/вперед
    window.addEventListener('popstate', function () {
        handleUrlParams();
    });
}

function initCardAnimations() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach((card, index) => {
        card.style.setProperty('--delay', index);
    });

    // Intersection Observer для анимаций при скролле
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    projectCards.forEach(card => {
        observer.observe(card);
    });
}

function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('.project-image img');

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Плавное появление элементов при загрузке
window.addEventListener('load', function () {
    document.body.classList.add('loaded');

    // Анимация для hero секции
    const hero = document.querySelector('.projects-hero');
    if (hero) {
        setTimeout(() => {
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }, 100);
    }
});

// Обработка ошибок загрузки изображений
document.querySelectorAll('.project-image img').forEach(img => {
    img.addEventListener('error', function () {
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjJmMmYyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOHB4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zNWVtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';
        this.alt = 'Изображение не найдено';
    });
});
("./");
