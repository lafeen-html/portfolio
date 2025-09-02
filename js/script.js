// Кэш базового пути для повторного использования
let CACHED_BASE_PATH = null;

document.addEventListener('DOMContentLoaded', function () {
    initializePage();
});

function initializePage() {
    loadHeader();
    loadFooter();
    fixAllPaths();
    initSmoothScroll();
    updateCurrentYear();
    initFaq();
}

// Определяем, находимся ли мы на GitHub Pages
function isGitHubPages() {
    return window.location.hostname.includes('github.io');
}

// Пытаемся определить базовый путь по пути к текущему скрипту (устойчиво к вложенным папкам)
function detectBasePathFromScript() {
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
        const src = scripts[i].getAttribute('src') || '';
        if (src.endsWith('/js/script.js') || src.includes('/js/script.js')) {
            try {
                const url = new URL(src, document.baseURI || window.location.href);
                // Обрезаем "/js/script.js"
                const base = url.pathname.replace(/\/?js\/script\.js$/, '');
                if (base) return base;
            } catch (_) {
                // игнорируем
            }
        }
    }
    // Фоллбек: первая директория после корня как база репозитория
    const path = window.location.pathname;
    const parts = path.split('/').filter(Boolean);
    return parts.length > 0 ? `/${parts[0]}` : '';
}

// Определяем базовый путь
function getBasePath() {
    const path = window.location.pathname;

    if (isGitHubPages()) {
        // На GitHub Pages - берём базу по реальному пути скрипта (поддержка вложенных путей)
        if (CACHED_BASE_PATH !== null) return CACHED_BASE_PATH;
        const detected = detectBasePathFromScript();
        CACHED_BASE_PATH = detected || '';
        return CACHED_BASE_PATH;
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
    const basePrefix = `${basePath}/`;

    // Исправляем ссылки
    const links = document.querySelectorAll('a:not(.nav-link):not(.logo a)');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
            // Не трогаем ссылки, которые уже указывают на родительскую директорию
            if (href.startsWith('../')) return;
            if (isGH) {
                // На GitHub Pages - абсолютные пути
                if (href.startsWith('./')) {
                    const newHref = href.replace('./', basePath + '/');
                    link.setAttribute('href', newHref);
                } else if (href.startsWith('/')) {
                    // Пропускаем, если уже начинается с basePath
                    if (!href.startsWith(basePrefix)) {
                        const newHref = href.replace(/^\//, basePath + '/');
                        link.setAttribute('href', newHref);
                    }
                } else if (!href.startsWith('/')) {
                    // Пропускаем, если уже начинается с basePath
                    if (!href.startsWith(basePrefix)) {
                        link.setAttribute('href', basePath + '/' + href);
                    }
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

    // Изображения
    const images = document.querySelectorAll('img:not([src^="http"]):not([src^="data:"])');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('http')) {
            // Не трогаем изображения, указывающие на родительскую директорию
            if (src.startsWith('../')) return;
            if (isGH) {
                // На GitHub Pages - абсолютные пути
                if (src.startsWith('./')) {
                    const newSrc = src.replace('./', basePath + '/');
                    img.setAttribute('src', newSrc);
                } else if (src.startsWith('/')) {
                    if (!src.startsWith(basePrefix)) {
                        const newSrc = src.replace(/^\//, basePath + '/');
                        img.setAttribute('src', newSrc);
                    }
                } else if (!src.startsWith('/')) {
                    if (!src.startsWith(basePrefix)) {
                        img.setAttribute('src', basePath + '/' + src);
                    }
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

    // Видео
    const videos = document.querySelectorAll('video source');
    videos.forEach(video => {
        const src = video.getAttribute('src');
        if (src && !src.startsWith('http')) {
            // Не трогаем видео, указывающие на родительскую директорию
            if (src.startsWith('../')) return;
            if (isGH) {
                if (src.startsWith('./')) {
                    const newSrc = src.replace('./', basePath + '/');
                    video.setAttribute('src', newSrc);
                } else if (src.startsWith('/')) {
                    if (!src.startsWith(basePrefix)) {
                        const newSrc = src.replace(/^\//, basePath + '/');
                        video.setAttribute('src', newSrc);
                    }
                } else if (!src.startsWith('/')) {
                    if (!src.startsWith(basePrefix)) {
                        video.setAttribute('src', basePath + '/' + src);
                    }
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
            fixAllPaths();
        })
        .catch(error => {
            console.error('Ошибка загрузки шапки:', error);
            createFallbackHeader();
        });
}
/* Резервная шапка
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
    fixAllPaths();
}
    */

// Подсветка текущей страницы
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

// Загрузка футера
function loadFooter() {
    const footerElement = document.getElementById('footer');
    if (!footerElement) {
        console.warn('Элемент footer не найден');
        return;
    }

    const basePath = getBasePath();
    const isGH = isGitHubPages();

    fetch(`${basePath}/footer.html`)
        .then(response => {
            if (!response.ok) throw new Error('Не удалось загрузить footer.html');
            return response.text();
        })
        .then(html => {
            let processedHtml = html;

            if (isGH) {
                processedHtml = processedHtml
                    .replace(/LOGO_PATH/g, `${basePath}/images/logo.svg`)
                    .replace(/PROJECTS_PAGE/g, `${basePath}/pages/projects.html`)
                    .replace(/ABOUT_PAGE/g, `${basePath}/pages/about.html`)
                    .replace(/CONTACTS_PAGE/g, `${basePath}/pages/contacts.html`);
            } else {
                const isPagesFolder = window.location.pathname.includes('/pages/');
                if (isPagesFolder) {
                    processedHtml = processedHtml
                        .replace(/LOGO_PATH/g, '../images/logo.svg')
                        .replace(/PROJECTS_PAGE/g, 'projects.html')
                        .replace(/ABOUT_PAGE/g, 'about.html')
                        .replace(/CONTACTS_PAGE/g, 'contacts.html');
                } else {
                    processedHtml = processedHtml
                        .replace(/LOGO_PATH/g, 'images/logo.svg')
                        .replace(/PROJECTS_PAGE/g, 'pages/projects.html')
                        .replace(/ABOUT_PAGE/g, 'pages/about.html')
                        .replace(/CONTACTS_PAGE/g, 'pages/contacts.html');
                }
            }

            footerElement.innerHTML = processedHtml;
            fixAllPaths();
        })
        .catch(error => {
            console.error('Ошибка загрузки футера:', error);
            createFallbackFooter();
        });
}

function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// FAQ
function initFaq() {
    const accordions = document.querySelectorAll('.accordion');

    accordions.forEach(accordion => {
        initSingleAccordion(accordion);
    });
}

// Инициализация отдельного аккордеона
function initSingleAccordion(accordion) {
    const accordionItems = accordion.querySelectorAll('.accordion-item');

    if (!accordionItems.length) {
        console.log('No accordion items found in this accordion');
        return;
    }

    // Открываем первый элемент по умолчанию
    const firstItem = accordionItems[0];
    if (firstItem && !firstItem.classList.contains('open')) {
        firstItem.classList.add('open');
    }

    accordionItems.forEach((item) => {
        const btn = item.querySelector('.accordion-btn');
        if (!btn) return;

        // Удаляем предыдущие обработчики, чтобы избежать дублирования
        btn.replaceWith(btn.cloneNode(true));
        const newBtn = item.querySelector('.accordion-btn');

        newBtn.addEventListener('click', () => {
            const isCurrentlyOpen = item.classList.contains('open');

            // Закрываем все элементы в этом аккордеоне
            accordionItems.forEach(otherItem => {
                otherItem.classList.remove('open');
            });

            // Если элемент был закрыт - открываем его
            if (!isCurrentlyOpen) {
                item.classList.add('open');
            }
        });
    });
}

// Делаем функцию глобально доступной
window.initFaq = initFaq;
window.initSingleAccordion = initSingleAccordion;