document.addEventListener('DOMContentLoaded', function () {
    // Проверяем, существует ли элемент header
    const headerElement = document.getElementById('header');

    if (!headerElement) {
        console.error('Элемент с id "header" не найден на странице!');
        return; // Прекращаем выполнение
    }

    // Загружаем header.html
    fetch('/header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Не удалось загрузить header.html');
            }
            return response.text();
        })
        .then(html => {
            // Вставляем содержимое header.html в div#header
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
                        <a href="index.html" class="nav-links">Главная</a>
                        <a href="about.html" class="nav-links">О нас</a>
                        <a href="contact.html" class="nav-links">Контакты</a>
                    </nav>
                    <div class="burger">☰</div>
                </header>
            `;
            highlightCurrentPage();
            initMobileMenu();
            initSmoothScroll();
            initAnimations();
        });

    // Функция подсветки текущей страницы
    function highlightCurrentPage() {
        setTimeout(() => {
            // Определяем текущую страницу по URL
            const path = window.location.pathname;
            let currentPage = '';

            if (path === '/' || path.endsWith('index.html') || path.endsWith('/index.html')) {
                currentPage = 'home';
            } else if (path.includes('about.html')) {
                currentPage = 'about';
            } else if (path.includes('contacts.html')) {
                currentPage = 'contacts';
            } else if (path.includes('projects.html')) {
                currentPage = 'projects';
            }

            console.log('Определенная страница:', currentPage);

            // Находим и подсвечиваем соответствующую ссылку
            const navLinks = document.querySelectorAll('.nav-links a');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-page') === currentPage) {
                    link.classList.add('active');
                    console.log('Подсвечена:', link.textContent);
                }
            });
        }, 0);
    }

    // Функция инициализации мобильного меню
    function initMobileMenu() {
        // Ждем немного, чтобы DOM обновился после вставки шапки
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

                // Закрытие меню при клике вне его области
                document.addEventListener('click', function (e) {
                    if (!nav.contains(e.target) && navLinks.classList.contains('active')) {
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
            } else {
                console.warn('Элементы мобильного меню не найдены');
            }
        }, 100);
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

document.addEventListener('DOMContentLoaded', function() {
    // Плавный переход при клике на карточки направлений
    const directionItems = document.querySelectorAll('.direction-item');
    
    directionItems.forEach(item => {
        item.addEventListener('click', function(e) {
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