// Основной JavaScript для сайта
document.addEventListener('DOMContentLoaded', function () {
    console.log('Основной скрипт загружен');

    // Мобильное меню
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');

    if (burger) {
        burger.addEventListener('click', function () {
            this.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }

    // Плавная прокрутка для якорных ссылок
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Закрываем мобильное меню после клика
                if (nav && nav.classList.contains('active')) {
                    burger.classList.remove('active');
                    nav.classList.remove('active');
                }
            }
        });
    });

    // Изменение стиля хедера при скролле
    const header = document.querySelector('.header');

    if (header) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 100) {
                header.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
                header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
            } else {
                header.style.backgroundColor = 'rgba(10, 10, 10, 0.9)';
                header.style.boxShadow = 'none';
            }
        });
    }

    // Анимация появления элементов при скролле
    const fadeElements = document.querySelectorAll('.service-card, .about-text, .about-image, .contact-info, .contact-map');

    const fadeInOnScroll = function () {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('fade-in', 'visible');
            }
        });
    };

    // Запускаем при загрузке и при скролле
    fadeInOnScroll();
    window.addEventListener('scroll', fadeInOnScroll);

    // Добавляем класс fade-in для элементов при загрузке
    fadeElements.forEach(element => {
        element.classList.add('fade-in');
    });
});