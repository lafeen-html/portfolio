document.addEventListener('DOMContentLoaded', function () {
    initFaq();
});

// FAQ
function initFaq() {
    const accordionItems = document.querySelectorAll('.accordion-item');

    if (!accordionItems.length) return;

    // Открываем первый элемент по умолчанию
    accordionItems[0].classList.add('open');

    accordionItems.forEach((item) => {
        const btn = item.querySelector('.accordion-btn');
        if (!btn) return;

        btn.addEventListener('click', () => {
            const isCurrentlyOpen = item.classList.contains('open');

            // Закрываем все элементы
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