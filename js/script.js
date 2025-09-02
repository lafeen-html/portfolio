document.addEventListener('DOMContentLoaded', function () {
    const headerElement = document.getElementById('header');

    if (!headerElement) {
        console.error('Элемент с id "header" не найден на странице!');
        return;
    }

    // Определяем базовый путь в зависимости от окружения
    const isGithubPages = window.location.hostname.includes('github.io');
    const basePath = isGithubPages ? '/portfolio' : ''; // Замените your-repo-name на имя вашего репозитория

    // Загружаем header.html
    fetch(`${basePath}/header.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Не удалось загрузить header.html');
            }
            return response.text();
        })
        .then(html => {
            headerElement.innerHTML = html;
            highlightCurrentPage();
            initMobileMenu();
            initSmoothScroll();
            initAnimations();
        })
        .catch(error => {
            console.error('Ошибка:', error);
            // Резервный вариант
            headerElement.innerHTML = `
                <header class="header">
                    <nav class="nav">
                        <div class="logo"><a href="${basePath}/index.html"><img src="${basePath}/images/logo.svg" alt="Логотип"></a></div>
                        <ul class="nav-links">
                            <li><a href="${basePath}/pages/projects.html">Проекты</a></li>
                            <li><a href="${basePath}/pages/about.html">Обо мне</a></li>
                            <li><a href="${basePath}/pages/contacts.html">Контакты</a></li>
                        </ul>
                        <div class="burger">
                            <i class="fas fa-bars"></i>
                        </div>
                    </nav>
                </header>
            `;
            highlightCurrentPage();
            initMobileMenu();
            initSmoothScroll();
            initAnimations();
        });

    function highlightCurrentPage() {
        setTimeout(() => {
            const path = window.location.pathname;
            let currentPage = '';

            if (path === '/' || path.endsWith('index.html') || path.includes('/index.html')) {
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
                if (link.getAttribute('data-page') === currentPage) {
                    link.classList.add('active');
                }
            });
        }, 100);
    }

    function initMobileMenu() {
        setTimeout(() => {
            const burger = document.querySelector('.burger');
            const nav = document.querySelector('.nav');
            const navLinks = document.querySelector('.nav-links');

            if (burger && navLinks) {
                burger.addEventListener('click', function (e) {
                    e.stopPropagation();
                    navLinks.classList.toggle('active');
                    burger.classList.toggle('active');
                });

                document.addEventListener('click', function (e) {
                    if (!nav.contains(e.target) && navLinks.classList.contains('active')) {
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
        }, 200);
    }

    // Плавная прокрутка - инициализация после загрузки шапки
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                if (this.getAttribute('href') === '#') return;

                e.preventDefault();

                const targetId = this.getAttribute('href');
                if (targetId.startsWith('#')) {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });

                        // Закрываем мобильное меню после клика
                        const navLinks = document.querySelector('.nav-links');
                        if (navLinks) {
                            navLinks.classList.remove('active');
                        }
                    }
                }
            });
        });
    }

    // Анимация появления элементов при прокрутке
    function initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Плавный переход при клике на карточки направлений
    const directionItems = document.querySelectorAll('.direction-item');

    directionItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            const href = this.getAttribute('href');

            // Добавляем анимацию перехода
            document.body.style.opacity = '0.7';
            document.body.style.transition = 'opacity 0.3s ease';

            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });

    // Восстанавливаем opacity при возврате на страницу
    if (document.body.style.opacity === '0.7') {
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    }
});