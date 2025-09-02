document.addEventListener('DOMContentLoaded', function () {
    // Основная инициализация
    initializePage();
});

function initializePage() {
    // Загружаем шапку
    loadHeader();
    
    // Инициализируем основные функции
    initMobileMenu();
    initSmoothScroll();
    
    // Инициализируем только направления
    initDirections();
}

// Загрузка шапки
function loadHeader() {
    const headerElement = document.getElementById('header');
    if (!headerElement) {
        console.warn('Элемент header не найден');
        return;
    }

    // Определяем базовый путь
    const isPagesFolder = window.location.pathname.includes('/pages/');
    const basePath = isPagesFolder ? '..' : '.';
    
    fetch(`${basePath}/header.html`)
        .then(response => {
            if (!response.ok) throw new Error('Не удалось загрузить header.html');
            return response.text();
        })
        .then(html => {
            // Заменяем плейсхолдеры на реальные пути
            let processedHtml = html;
            
            if (isPagesFolder) {
                // Мы в папке pages
                processedHtml = processedHtml
                    .replace(/MAIN_PAGE/g, '../index.html')
                    .replace(/LOGO_PATH/g, '../images/logo.svg')
                    .replace(/PROJECTS_PAGE/g, 'projects.html')
                    .replace(/ABOUT_PAGE/g, 'about.html')
                    .replace(/CONTACTS_PAGE/g, 'contacts.html');
            } else {
                // Мы на главной странице
                processedHtml = processedHtml
                    .replace(/MAIN_PAGE/g, 'index.html')
                    .replace(/LOGO_PATH/g, 'images/logo.svg')
                    .replace(/PROJECTS_PAGE/g, 'pages/projects.html')
                    .replace(/ABOUT_PAGE/g, 'pages/about.html')
                    .replace(/CONTACTS_PAGE/g, 'pages/contacts.html');
            }
            
            headerElement.innerHTML = processedHtml;
            highlightCurrentPage();
            initMobileMenu();
        })
        .catch(error => {
            console.error('Ошибка загрузки шапки:', error);
            createFallbackHeader(isPagesFolder);
        });
}

// Резервная шапка при ошибке загрузки
function createFallbackHeader(isPagesFolder) {
    const headerElement = document.getElementById('header');
    if (!headerElement) return;
    
    if (isPagesFolder) {
        // Мы в папке pages
        headerElement.innerHTML = `
            <header class="header">
                <nav class="nav">
                    <div class="logo">
                        <a href="../index.html">
                            <img src="../images/logo.svg" alt="Логотип">
                        </a>
                    </div>
                    <ul class="nav-links">
                        <li><a href="projects.html" class="nav-link">Проекты</a></li>
                        <li><a href="about.html" class="nav-link">Обо мне</a></li>
                        <li><a href="contacts.html" class="nav-link">Контакты</a></li>
                    </ul>
                    <div class="burger">
                        <i class="fas fa-bars"></i>
                    </div>
                </nav>
            </header>
        `;
    } else {
        // Мы на главной странице
        headerElement.innerHTML = `
            <header class="header">
                <nav class="nav">
                    <div class="logo">
                        <a href="index.html">
                            <img src="images/logo.svg" alt="Логотип">
                        </a>
                    </div>
                    <ul class="nav-links">
                        <li><a href="pages/projects.html" class="nav-link">Проекты</a></li>
                        <li><a href="pages/about.html" class="nav-link">Обо мне</a></li>
                        <li><a href="pages/contacts.html" class="nav-link">Контакты</a></li>
                    </ul>
                    <div class="burger">
                        <i class="fas fa-bars"></i>
                    </div>
                </nav>
            </header>
        `;
    }
    
    highlightCurrentPage();
    initMobileMenu();
}

// Подсветка текущей страницы в навигации
function highlightCurrentPage() {
    const path = window.location.pathname;
    let currentPage = '';

    if (path.endsWith('/') || path.endsWith('index.html')) {
        currentPage = 'index';
    } else if (path.includes('about.html')) {
        currentPage = 'about';
    } else if (path.includes('contacts.html')) {
        currentPage = 'contacts';
    } else if (path.includes('projects.html')) {
        currentPage = 'projects';
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href') || '';
        
        if ((currentPage === 'projects' && linkHref.includes('projects.html')) ||
            (currentPage === 'about' && linkHref.includes('about.html')) ||
            (currentPage === 'contacts' && linkHref.includes('contacts.html')) ||
            (currentPage === 'index' && (linkHref.includes('index.html') || linkHref.endsWith('/')))) {
            link.classList.add('active');
        }
    });
}

// Мобильное меню
function initMobileMenu() {
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');

    if (burger && navLinks) {
        burger.addEventListener('click', function (e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            burger.classList.toggle('active');
        });

        document.addEventListener('click', function (e) {
            if (!e.target.closest('.nav') && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                burger.classList.remove('active');
            }
        });

        // Закрытие меню при клике на ссылку
        const links = document.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', function () {
                navLinks.classList.remove('active');
                burger.classList.remove('active');
            });
        });
    }
}

// Плавная прокрутка
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();

            const targetElement = document.querySelector(href);
            if (targetElement) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Инициализация направлений деятельности
function initDirections() {
    const directionItems = document.querySelectorAll('.direction-item');
    
    if (!directionItems.length) {
        return;
    }

    // Анимация появления только для направлений
    directionItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease';

        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 150 + index * 100);
    });

    // Обработчики hover
    directionItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
        });
    });

    // Обработчики кликов
    directionItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            if (!href) return;

            // Немедленный переход
            window.location.href = href;
        });
    });
}

// Обработка полной загрузки страницы
window.addEventListener('load', function() {
    // Убираем мерцание - страница всегда видима
    document.body.style.opacity = '1';
    
    // Повторная инициализация направлений после полной загрузки
    setTimeout(initDirections, 100);
});

// Обработка ошибок изображений
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        console.warn('Не удалось загрузить изображение:', this.src);
        // Можно добавить плейсхолдер при ошибке
        this.style.backgroundColor = '#f5f5f5';
    });
});