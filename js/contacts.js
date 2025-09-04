document.addEventListener('DOMContentLoaded', function () {
    initializeContactsPage();
});

function initializeContactsPage() {
    // Инициализация анимаций
    initContactAnimations();
    
    // Инициализация карты
    initMapPlaceholder();
    
    // Инициализация интерактивных элементов
    initInteractiveElements();
    
    // Инициализация плавающих элементов
    initFloatingElements();
}

// Анимация появления элементов
function initContactAnimations() {
    const contactCards = document.querySelectorAll('.contact-card');
    const extraSection = document.querySelector('.contacts-extra');
    
    // Анимация для карточек
    contactCards.forEach((card, index) => {
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.style.transitionDelay = `${index * 0.1}s`;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + index * 100);
    });
    
    // Анимация для дополнительной секции
    if (extraSection) {
        setTimeout(() => {
            extraSection.style.opacity = '1';
            extraSection.style.transform = 'translateY(0)';
        }, 500);
    }
    
    // Intersection Observer для анимации при скролле
    if ('IntersectionObserver' in window) {
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
        
        // Наблюдаем за всеми элементами
        document.querySelectorAll('[data-aos]').forEach(el => {
            observer.observe(el);
        });
    }
}

// Заглушка для карты с анимацией
function initMapPlaceholder() {
    const mapPlaceholder = document.getElementById('map-placeholder');
    
    if (mapPlaceholder) {
        mapPlaceholder.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                
                // Здесь можно добавить функционал для открытия реальной карты
                alert('Здесь могла бы быть интерактивная карта Москвы');
            }, 150);
        });
    }
}

// Интерактивные элементы
function initInteractiveElements() {
    // Анимация при наведении на иконки
    const contactIcons = document.querySelectorAll('.contact-icon');
    
    contactIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.15) rotate(5deg)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    // Анимация ссылок
    const contactLinks = document.querySelectorAll('.contact-link');
    
    contactLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'translateX(5px)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'translateX(0)';
            }
        });
    });
}

// Анимация плавающих элементов
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach(element => {
        // Добавляем случайные параметры для разнообразия
        const randomDelay = Math.random() * 2;
        const randomDuration = 8 + Math.random() * 4;
        
        element.style.animationDelay = `${randomDelay}s`;
        element.style.animationDuration = `${randomDuration}s`;
    });
}

// Обработка отправки формы (если будет добавлена в будущем)
function handleContactForm(event) {
    event.preventDefault();
    // Логика обработки формы
}

// Показать/скрыть дополнительную информацию
function toggleAdditionalInfo() {
    const extraInfo = document.querySelector('.response-time');
    if (extraInfo) {
        extraInfo.classList.toggle('expanded');
    }
}

// Копирование email в буфер обмена
function copyEmailToClipboard() {
    const email = 'your.email@example.com';
    
    navigator.clipboard.writeText(email).then(() => {
        // Показать уведомление об успешном копировании
        showNotification('Email скопирован в буфер обмена!');
    }).catch(err => {
        console.error('Ошибка при копировании email: ', err);
    });
}

// Вспомогательная функция для показа уведомлений
function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    // Убираем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Обработчик изменения размера окна
window.addEventListener('resize', function() {
    // Переинициализируем анимации при изменении размера
    initFloatingElements();
});

// Инициализация при полной загрузке страницы
window.addEventListener('load', function() {
    document.body.classList.add('contacts-loaded');
    
    // Добавляем небольшую задержку для лучшего визуального эффекта
    setTimeout(() => {
        document.querySelectorAll('.contact-card').forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    }, 200);
});