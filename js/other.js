document.addEventListener('DOMContentLoaded', function () {
    // Ждем загрузки основного контента
    setTimeout(initOtherTab, 100);
});

function initOtherTab() {
    // Проверяем, что мы на нужной вкладке
    const otherContent = document.getElementById('other-content');
    if (!otherContent || otherContent.style.display === 'none') {
        return;
    }
    
    try {
        initBannersLightbox();
        initBannerHoverEffects();
    } catch (error) {
        console.error('Error initializing other tab:', error);
    }
}

// Лайтбокс для баннеров
function initBannersLightbox() {
    // Используем существующую систему modalManager
    // Все изображения уже имеют класс gallery-image и data-gallery="banners-gallery"
    // Существующая система автоматически обработает клики на них
    
    // Дополнительно: добавляем обработчик для кнопок просмотра
    document.addEventListener('click', function (e) {
        const viewBtn = e.target.closest('.view-banner-btn');
        if (viewBtn) {
            const bannerItem = viewBtn.closest('.banner-item');
            if (!bannerItem) return;
            
            const img = bannerItem.querySelector('img');
            if (!img || !window.modalManager) return;

            // Используем встроенный функционал modalManager
            const galleryId = img.getAttribute('data-gallery');
            window.modalManager.openLightbox(img, galleryId);
        }
    });
}

// Эффекты при наведении
function initBannerHoverEffects() {
    const bannerItems = document.querySelectorAll('.banner-item');
    
    bannerItems.forEach(item => {
        const img = item.querySelector('img');
        if (!img.complete) {
            // Если изображение еще грузится, ждем его загрузки
            img.addEventListener('load', () => {
                applyNaturalAspectRatio(img);
            });
        } else {
            applyNaturalAspectRatio(img);
        }
    });
}

// Сохраняем естественное соотношение сторон
function applyNaturalAspectRatio(img) {
    if (img.naturalWidth && img.naturalHeight) {
        const aspectRatio = img.naturalHeight / img.naturalWidth;
        img.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
    }
}

// Экспортируем функции
window.otherModule = {
    initOtherTab,
    initBannersLightbox
};