document.addEventListener('DOMContentLoaded', function () {
    // Основная инициализация
    initializePage();
});

function initializePage() {
    // Загружаем шапку
    loadHeader();
    
    // Исправляем все пути на странице
    fixAllPaths();

    // Инициализируем основные функции
    initMobileMenu();
    initSmoothScroll();
    
    // Инициализируем только направления
    initDirections();
}

// Определяем, находимся ли мы на GitHub Pages
function isGitHubPages() {
    return window.location.hostname.includes('github.io');
}

// Определяем базовый путь
function getBasePath() {
    const path = window.location.pathname;
    
    if (isGitHubPages()) {
        // На GitHub Pages - путь включает имя репозитория
        const repoName = path.split('/')[1];
        return repoName ? `/${repoName}` : '';
    } else {
        // Локально - относительные пути
        if (path.includes('/pages/')) {
            return '..';
        } else {
            return '.';
        }
    }
}

// Исправляем все пути на странице
function fixAllPaths() {
    const basePath = getBasePath();
    const isGH = isGitHubPages();
    
    // Исправляем ссылки
    const links = document.querySelectorAll('a:not(.nav-link):not(.logo a)');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
            if (isGH) {
                // На GitHub Pages - абсолютные пути
                if (href.startsWith('./')) {
                    const newHref = href.replace('./', basePath + '/');
                    link.setAttribute('href', newHref);
                } else if (href.startsWith('/')) {
                    const newHref = href.replace(/^\//, basePath + '/');
                    link.setAttribute('href', newHref);
                } else if (!href.startsWith('/')) {
                    link.setAttribute('href', basePath + '/' + href);
                }
            } else {
                // Локально - относительные пути
                if (href.startsWith('/')) {
                    const newHref = href.replace('/', basePath + '/');
                    link.setAttribute('href', newHref);
                }
            }
        }
    });
    
    // Исправляем изображения
    const images = document.querySelectorAll('img:not([src^="http"]):not([src^="data:"])');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('http')) {
            if (isGH) {
                // На GitHub Pages - абсолютные пути
                if (src.startsWith('./')) {
                    const newSrc = src.replace('./', basePath + '/');
                    img.setAttribute('src', newSrc);
                } else if (src.startsWith('/')) {
                    const newSrc = src.replace(/^\//, basePath + '/');
                    img.setAttribute('src', newSrc);
                } else if (!src.startsWith('/')) {
                    img.setAttribute('src', basePath + '/' + src);
                }
            } else {
                // Локально - относительные пути
                if (src.startsWith('/')) {
                    const newSrc = src.replace('/', basePath + '/');
                    img.setAttribute('src', newSrc);
                }
            }
        }
    });
    
    // Исправляем видео
    const videos = document.querySelectorAll('video source');
    videos.forEach(video => {
        const src = video.getAttribute('src');
        if (src && !src.startsWith('http')) {
            if (isGH) {
                if (src.startsWith('./')) {
                    const newSrc = src.replace('./', basePath + '/');
                    video.setAttribute('src', newSrc);
                } else if (src.startsWith('/')) {
                    const newSrc = src.replace(/^\//, basePath + '/');
                    video.setAttribute('src', newSrc);
                } else if (!src.startsWith('/')) {
                    video.setAttribute('src', basePath + '/' + src);
                }
            } else {
                if (src.startsWith('/')) {
                    const newSrc = src.replace('/', basePath + '/');
                    video.setAttribute('src', newSrc);
                }
            }
        }
    });
}

// Загрузка шапки
function loadHeader() {
    const headerElement = document.getElementById('header');
    if (!headerElement) {
        console.warn('Элемент header не найден');
        return;
    }

    const basePath = getBasePath();
    const isGH = isGitHubPages();
    
    fetch(`${basePath}/header.html`)
        .then(response => {
            if (!response.ok) throw new Error('Не удалось загрузить header.html');
            return response.text();
        })
        .then(html => {
            let processedHtml = html;
            
            if (isGH) {
                // GitHub Pages - абсолютные пути
                processedHtml = processedHtml
                    .replace(/MAIN_PAGE/g, `${basePath}/index.html`)
                    .replace(/LOGO_PATH/g, `${basePath}/images/logo.svg`)
                    .replace(/PROJECTS_PAGE/g, `${basePath}/pages/projects.html`)
                    .replace(/ABOUT_PAGE/g, `${basePath}/pages/about.html`)
                    .replace(/CONTACTS_PAGE/g, `${basePath}/pages/contacts.html`);
            } else {
                // Локально - относительные пути
                const isPagesFolder = window.location.pathname.includes('/pages/');
                if (isPagesFolder) {
                    processedHtml = processedHtml
                        .replace(/MAIN_PAGE/g, '../index.html')
                        .replace(/LOGO_PATH/g, '../images/logo.svg')
                        .replace(/PROJECTS_PAGE/g, 'projects.html')
                        .replace(/ABOUT_PAGE/g, 'about.html')
                        .replace(/CONTACTS_PAGE/g, 'contacts.html');
                } else {
                    processedHtml = processedHtml
                        .replace(/MAIN_PAGE/g, 'index.html')
                        .replace(/LOGO_PATH/g, 'images/logo.svg')
                        .replace(/PROJECTS_PAGE/g, 'pages/projects.html')
                        .replace(/ABOUT_PAGE/g, 'pages/about.html')
                        .replace(/CONTACTS_PAGE/g, 'pages/contacts.html');
                }
            }
            
            headerElement.innerHTML = processedHtml;
            highlightCurrentPage();
            initMobileMenu();
            // После вставки хедера ещё раз правим пути внутри него
            fixAllPaths();
        })
        .catch(error => {
            console.error('Ошибка загрузки шапки:', error);
            createFallbackHeader();
        });
}

// Резервная шапка
function createFallbackHeader() {
    const headerElement = document.getElementById('header');
    if (!headerElement) return;
    
    const basePath = getBasePath();
    const isGH = isGitHubPages();
    const isPagesFolder = window.location.pathname.includes('/pages/');
    
    if (isGH) {
        headerElement.innerHTML = `
            <header class="header">
                <nav class="nav">
                    <div class="logo">
                        <a href="${basePath}/index.html">
                            <img src="${basePath}/images/logo.svg" alt="Логотип">
                        </a>
                    </div>
                    <ul class="nav-links">
                        <li><a href="${basePath}/pages/projects.html" class="nav-link">Проекты</a></li>
                        <li><a href="${basePath}/pages/about.html" class="nav-link">Обо мне</a></li>
                        <li><a href="${basePath}/pages/contacts.html" class="nav-link">Контакты</a></li>
                    </ul>
                    <div class="burger">
                        <i class="fas fa-bars"></i>
                    </div>
                </nav>
            </header>
        `;
    } else if (isPagesFolder) {
        headerElement.innerHTML = `
            <header class="header">
                <nav class="nav">
                    <div class="logo">
                        <a href="../index.html">
                            <img src="../images/logo.svg" alt="Лogoтип">
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
    // После вставки резервного хедера правим пути внутри него
    fixAllPaths();
}

// Остальные функции без изменений
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

        const links = document.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', function () {
                navLinks.classList.remove('active');
                burger.classList.remove('active');
            });
        });
    }
}

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

function initDirections() {
    const directionItems = document.querySelectorAll('.direction-item');
    
    if (!directionItems.length) return;

    directionItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease';

        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 150 + index * 100);
    });

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

    directionItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href) window.location.href = href;
        });
    });
}

window.addEventListener('load', function() {
    document.body.style.opacity = '1';
    setTimeout(initDirections, 100);
});

document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        console.warn('Не удалось загрузить изображение:', this.src);
        this.style.backgroundColor = '#f5f5f5';
    });
});