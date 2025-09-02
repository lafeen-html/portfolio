function initPresentations() {
    initPDFViewers();
    initAnimations();
    initHoverEffects();
}

function initPDFViewers() {
    const viewButtons = document.querySelectorAll('.view-pdf-btn');
    
    viewButtons.forEach(button => {
        if (button.getAttribute('href') && button.getAttribute('href') !== '#') {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Добавляем индикатор загрузки
                this.classList.add('loading');
                
                const pdfUrl = this.getAttribute('href');
                
                // Открываем PDF в новом окне
                setTimeout(() => {
                    try {
                        const newWindow = window.open(pdfUrl, '_blank');
                        
                        if (newWindow) {
                            newWindow.focus();
                        }
                    } catch (error) {
                        console.error('Error opening PDF:', error);
                    }
                    
                    // Убираем индикатор загрузки
                    setTimeout(() => {
                        this.classList.remove('loading');
                    }, 1000);
                }, 300);
            });
        } else {
            // Для недоступных PDF
            button.style.cursor = 'not-allowed';
            button.addEventListener('click', function(e) {
                e.preventDefault();
            });
        }
    });
}

function initAnimations() {
    const cards = document.querySelectorAll('.presentation-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    cards.forEach(card => {
        observer.observe(card);
    });
}

function initHoverEffects() {
    const cards = document.querySelectorAll('.presentation-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
}

// Экспорт функций
window.presentationsModule = { initPresentations };

// Автоматическая инициализация
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.presentation-card')) {
        setTimeout(initPresentations, 100);
    }
});