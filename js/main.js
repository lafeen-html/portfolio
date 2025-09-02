document.addEventListener('DOMContentLoaded', function () {
    initDirections();
});

/*
// Замедление видео
function videoSlowDown() {
    const video = document.querySelector('.hero-video video');
    video.playbackRate = 0.9; // Замедление на 40%

    // Обработка для мобильных устройств
    video.addEventListener('loadedmetadata', function () {
        // Дополнительная проверка для мобильных
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            video.playbackRate = 0.7; // Немного быстрее на мобильных
        }
    });

    // Перезапускаем видео для применения изменений
    video.play();
}
*/

// Инициализируем направления
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
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href) window.location.href = href;
        });
    });
}

window.addEventListener('load', function () {
    document.body.style.opacity = '1';
    setTimeout(initDirections, 100);
});

document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function () {
        console.warn('Не удалось загрузить изображение:', this.src);
        this.style.backgroundColor = '#dfe5ef';
    });
});