class ModalManager {
    constructor() {
        this.modalsContainer = document.getElementById('modals-container');
        this.activeModal = null;
        this.lightbox = null;
        this.currentGallery = null;
        this.currentImageIndex = 0;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.init();
    }

    init() {
        this.loadModals();
        this.bindEvents();
        this.initLightbox();
    }

    async loadModals() {
        try {
            // Загружаем все модальные окна проектов
            const modalFiles = [
                './sites/neo-modal.html',
                './sites/rabotaYou-modal.html',
                './sites/dynaOl-modal.html',
                './sites/usupovo-village-modal.html',
                './sites/lesanti-modal.html',
                './sites/metall-naves-modal.html',
                './mobile/vitaminD-modal.html',
                './mobile/evensa-modal.html',
                './mobile/mindfox-modal.html'
            ];

            for (const file of modalFiles) {
                try {
                    const response = await fetch(`../modals/${file}`);
                    if (response.ok) {
                        const html = await response.text();
                        this.modalsContainer.innerHTML += html;
                    }
                } catch (error) {
                    console.warn(`Modal file ${file} not found:`, error);
                }
            }

            this.initializeModals();
            this.initScrollIndicators();
            this.initGalleryImages();
        } catch (error) {
            console.error('Error loading modals:', error);
        }
    }

    initializeModals() {
        // Инициализируем все модальные окна
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    bindEvents() {
        // Обработчик закрытия по клику на overlay
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
            if (e.target.classList.contains('lightbox-overlay')) {
                this.closeLightbox();
            }
        });

        // Обработчик закрытия по кнопке
        document.addEventListener('click', (e) => {
            if (e.target.closest('.modal-close')) {
                this.closeModal();
            }
            if (e.target.closest('.lightbox-close')) {
                this.closeLightbox();
            }
        });

        // Закрытие по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.lightbox && this.lightbox.classList.contains('active')) {
                    this.closeLightbox();
                } else if (this.activeModal) {
                    this.closeModal();
                }
            }
        });

        // Предотвращаем закрытие при клике на контент
        document.addEventListener('click', (e) => {
            if (e.target.closest('.modal-container')) {
                e.stopPropagation();
            }
            if (e.target.closest('.lightbox-content')) {
                e.stopPropagation();
            }
        });

        // Навигация по лайтбоксу с клавишами
        document.addEventListener('keydown', (e) => {
            if (this.lightbox && this.lightbox.classList.contains('active')) {
                if (e.key === 'ArrowRight') {
                    this.nextImage();
                } else if (e.key === 'ArrowLeft') {
                    this.prevImage();
                }
            }
        });

        // Обработчики для кнопок навигации лайтбокса
        document.addEventListener('click', (e) => {
            if (e.target.closest('.lightbox-next')) {
                this.nextImage();
            } else if (e.target.closest('.lightbox-prev')) {
                this.prevImage();
            }
        });
    }

    initLightbox() {
        this.lightbox = document.getElementById('lightbox');
        if (!this.lightbox) {
            // Создаем лайтбокс если его нет в DOM
            this.lightbox = document.createElement('div');
            this.lightbox.id = 'lightbox';
            this.lightbox.className = 'lightbox';
            this.lightbox.innerHTML = `
                <div class="lightbox-overlay"></div>
                <div class="lightbox-content">
                    <button class="lightbox-close">
                        <i class="fas fa-times"></i>
                    </button>
                    <button class="lightbox-nav lightbox-prev">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="lightbox-nav lightbox-next">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    <div class="lightbox-image-container">
                        <img class="lightbox-image" src="" alt="">
                    </div>
                    <div class="lightbox-pagination"></div>
                    <div class="lightbox-caption"></div>
                </div>
            `;
            document.body.appendChild(this.lightbox);
        }
    }

    initGalleryImages() {
        // Инициализируем обработчики кликов для всех изображений галереи
        document.addEventListener('click', (e) => {
            const galleryImage = e.target.closest('.gallery-image');
            if (galleryImage) {
                const galleryId = galleryImage.getAttribute('data-gallery');
                this.openLightbox(galleryImage, galleryId);
            }
        });
    }

    openLightbox(imageElement, galleryId) {
        if (!this.lightbox) return;

        // Находим все изображения в этой галерее
        const galleryImages = document.querySelectorAll(`.gallery-image[data-gallery="${galleryId}"]`);
        this.currentGallery = Array.from(galleryImages);

        // Находим индекс текущего изображения
        this.currentImageIndex = this.currentGallery.findIndex(img => img.src === imageElement.src);

        if (this.currentImageIndex === -1) {
            this.currentImageIndex = 0;
        }

        // Показываем лайтбокс
        this.updateLightboxImage();
        this.createSmartPagination(); // Используем умную пагинацию
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Добавляем обработчики свайпа для мобильных устройств
        this.addSwipeHandlers();
    }

    updateLightboxImage() {
        if (!this.currentGallery || this.currentImageIndex < 0) return;

        const currentImage = this.currentGallery[this.currentImageIndex];
        const lightboxImage = this.lightbox.querySelector('.lightbox-image');
        const lightboxCaption = this.lightbox.querySelector('.lightbox-caption');

        if (lightboxImage && lightboxCaption) {
            lightboxImage.src = currentImage.src;
            lightboxImage.alt = currentImage.alt;
            lightboxCaption.textContent = currentImage.alt || '';

            // Оптимизация отображения для разных размеров изображений
            const img = new Image();
            img.onload = () => {
                // Автоматическое масштабирование для больших изображений
                if (img.width > window.innerWidth || img.height > window.innerHeight) {
                    lightboxImage.style.maxWidth = '80vw';
                    lightboxImage.style.maxHeight = '80vh';
                    lightboxImage.style.width = 'auto';
                    lightboxImage.style.height = 'auto';
                } else {
                    // Для маленьких изображений показываем в оригинальном размере
                    lightboxImage.style.maxWidth = 'none';
                    lightboxImage.style.maxHeight = 'none';
                    lightboxImage.style.width = img.width + 'px';
                    lightboxImage.style.height = img.height + 'px';
                }
            };
            img.src = currentImage.src;
        }
    }

    // Умная пагинация для большого количества изображений
    createSmartPagination() {
        if (!this.currentGallery || this.currentGallery.length <= 1) return;

        const paginationContainer = this.lightbox.querySelector('.lightbox-pagination');
        paginationContainer.innerHTML = '';

        const totalImages = this.currentGallery.length;

        // Автоматически скрываем пагинацию для больших галерей
        if (totalImages > 10) {
            // Для больших галерей показываем только текстовый индикатор
            const counter = document.createElement('div');
            counter.className = 'lightbox-counter';
            counter.textContent = `${this.currentImageIndex + 1} / ${totalImages}`;
            paginationContainer.appendChild(counter);
            paginationContainer.classList.add('compact');
        } else {
            // Для маленьких галерей показываем точки
            paginationContainer.classList.remove('compact');
            this.currentGallery.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('lightbox-pagination-dot');
                if (index === this.currentImageIndex) {
                    dot.classList.add('active');
                }

                dot.addEventListener('click', () => {
                    this.currentImageIndex = index;
                    this.updateLightboxImage();
                    this.updatePagination();
                });

                paginationContainer.appendChild(dot);
            });
        }
    }

    // Обновляем активную точку в пагинации
    updatePagination() {
        const paginationContainer = this.lightbox.querySelector('.lightbox-pagination');
        const dots = paginationContainer.querySelectorAll('.lightbox-pagination-dot');
        const counter = paginationContainer.querySelector('.lightbox-counter');

        dots.forEach((dot, index) => {
            if (index === this.currentImageIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        if (counter) {
            counter.textContent = `${this.currentImageIndex + 1} / ${this.currentGallery.length}`;
        }
    }

    nextImage() {
        if (!this.currentGallery) return;

        this.currentImageIndex = (this.currentImageIndex + 1) % this.currentGallery.length;
        this.updateLightboxImage();
        this.updatePagination();
    }

    prevImage() {
        if (!this.currentGallery) return;

        this.currentImageIndex = (this.currentImageIndex - 1 + this.currentGallery.length) % this.currentGallery.length;
        this.updateLightboxImage();
        this.updatePagination();
    }

    closeLightbox() {
        if (this.lightbox) {
            this.lightbox.classList.remove('active');
            document.body.style.overflow = '';
            this.currentGallery = null;
            this.currentImageIndex = 0;

            // Удаляем обработчики свайпа
            this.removeSwipeHandlers();
        }
    }

    addSwipeHandlers() {
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);

        this.lightbox.addEventListener('touchstart', this.handleTouchStart, { passive: true });
        this.lightbox.addEventListener('touchmove', this.handleTouchMove, { passive: true });
        this.lightbox.addEventListener('touchend', this.handleTouchEnd, { passive: true });
    }

    removeSwipeHandlers() {
        this.lightbox.removeEventListener('touchstart', this.handleTouchStart);
        this.lightbox.removeEventListener('touchmove', this.handleTouchMove);
        this.lightbox.removeEventListener('touchend', this.handleTouchEnd);
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.isSwiping = false;
    }

    handleTouchMove(e) {
        if (!this.touchStartX || !this.touchStartY) return;

        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;

        const diffX = this.touchStartX - touchX;
        const diffY = this.touchStartY - touchY;

        // Определяем, это свайп по горизонтали (а не по вертикали)
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
            this.isSwiping = true;
        }
    }

    handleTouchEnd(e) {
        if (!this.isSwiping) return;

        this.touchEndX = e.changedTouches[0].clientX;
        this.handleSwipe();

        this.touchStartX = 0;
        this.touchStartY = 0;
        this.isSwiping = false;
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diffX = this.touchStartX - this.touchEndX;

        if (diffX > swipeThreshold) {
            this.nextImage(); // Свайп влево
        } else if (diffX < -swipeThreshold) {
            this.prevImage(); // Свайп вправо
        }
    }

    initScrollIndicators() {
        const modalWrappers = document.querySelectorAll('.modal-content-wrapper');

        modalWrappers.forEach(wrapper => {
            wrapper.addEventListener('scroll', () => {
                this.updateScrollIndicators(wrapper);
            });

            // Инициализируем начальное состояние
            this.updateScrollIndicators(wrapper);
        });
    }

    updateScrollIndicators(wrapper) {
        const container = wrapper.closest('.modal-container');
        if (!container) return;

        const isAtTop = wrapper.scrollTop === 0;
        const isAtBottom = wrapper.scrollTop + wrapper.clientHeight >= wrapper.scrollHeight - 1;

        container.classList.toggle('scroll-top', !isAtTop);
        container.classList.toggle('scroll-bottom', !isAtBottom);
    }

    openModal(modalId) {
        // Закрываем предыдущее модальное окно
        if (this.activeModal) {
            this.closeModal();
        }

        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';

            // Блокируем скролл body
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';

            // Анимация открытия
            requestAnimationFrame(() => {
                modal.classList.add('active');
                this.activeModal = modal;

                // Обновляем индикаторы скролла
                const wrapper = modal.querySelector('.modal-content-wrapper');
                if (wrapper) {
                    this.updateScrollIndicators(wrapper);
                }
            });
        }
    }

    closeModal() {
        if (this.activeModal) {
            this.activeModal.classList.remove('active');

            // Разблокируем скролл body
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';

            // Задержка перед скрытием для анимации
            setTimeout(() => {
                if (this.activeModal) {
                    this.activeModal.style.display = 'none';
                    this.activeModal = null;
                }
            }, 300);
        }
    }

    // Метод для открытия модального окна по названию проекта
    openProjectModal(projectTitle) {
        const modalId = this.getModalIdFromTitle(projectTitle);
        if (modalId) {
            this.openModal(modalId);
        }
    }

    getModalIdFromTitle(title) {
        const idMap = {
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
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.modalManager = new ModalManager();
});

// Глобальные функции для совместимости
function openProjectModal(projectTitle) {
    if (window.modalManager) {
        window.modalManager.openProjectModal(projectTitle);
    }
}

function closeModal() {
    if (window.modalManager) {
        window.modalManager.closeModal();
    }
}

// Обработка ошибок загрузки изображений в модальных окнах
function initModalImageHandling() {
    document.addEventListener('error', function (e) {
        if (e.target.tagName === 'IMG' && e.target.closest('.modal')) {
            console.warn('Modal image failed to load:', e.target.src);
            e.target.style.display = 'none';
        }
    }, true);
}

// Инициализация при полной загрузке страницы
window.addEventListener('load', function () {
    initModalImageHandling();
});