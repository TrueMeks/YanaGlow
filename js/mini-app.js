// JavaScript для мини-приложения с системой админ-доступа
document.addEventListener('DOMContentLoaded', function () {
    console.log('Mini-app загружен, инициализируем мини-приложение');

    // Переключение вкладок
    const tabs = document.querySelectorAll('.app-tab');
    const tabContents = document.querySelectorAll('.app-tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');

            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Калькулятор стоимости
    const calculateBtn = document.getElementById('calculate');
    const procedureSelect = document.getElementById('procedure');
    const sessionsInput = document.getElementById('sessions');
    const resultDiv = document.getElementById('result');

    if (calculateBtn) {
        calculateBtn.addEventListener('click', function () {
            const procedureText = procedureSelect.options[procedureSelect.selectedIndex].text;
            const procedurePrice = parseFloat(procedureSelect.value);
            const sessions = parseInt(sessionsInput.value);

            if (procedurePrice === 0) {
                resultDiv.innerHTML = '<p style="color: #ff5555;">Пожалуйста, выберите процедуру</p>';
                return;
            }

            if (isNaN(sessions) || sessions < 1) {
                resultDiv.innerHTML = '<p style="color: #ff5555;">Пожалуйста, введите корректное количество сеансов</p>';
                return;
            }

            const totalPrice = procedurePrice * sessions;
            const discount = sessions >= 5 ? 0.1 : 0;
            const finalPrice = totalPrice * (1 - discount);

            let resultHTML = `
                <p>Стоимость одного сеанса: ${procedurePrice} руб.</p>
                <p>Количество сеансов: ${sessions}</p>
                <p>Общая стоимость: ${totalPrice} руб.</p>
            `;

            if (discount > 0) {
                resultHTML += `<p style="color: var(--neon-green);">Скидка ${discount * 100}%: -${totalPrice * discount} руб.</p>`;
            }

            resultHTML += `<p style="font-size: 1.2rem; color: var(--neon-blue); margin-top: 10px;">Итоговая стоимость: ${finalPrice} руб.</p>`;

            resultHTML += `
                <button id="send-calculation" class="btn neon-btn" style="margin-top: 15px;">
                    Отправить расчет на консультацию
                </button>
            `;

            resultDiv.innerHTML = resultHTML;

            document.getElementById('send-calculation').addEventListener('click', function () {
                const formData = {
                    type: 'calculator',
                    procedure: procedureText,
                    sessions: sessions,
                    price: finalPrice
                };

                sendToTelegram(formData, this);
            });
        });
    }

    // Форма записи
    const bookingForm = document.getElementById('booking-form');

    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const date = document.getElementById('date').value;
            const service = document.getElementById('service').value;
            const submitBtn = this.querySelector('button[type="submit"]');

            if (!telegramBot.validateName(name)) {
                alert('Пожалуйста, введите корректное имя (от 2 до 50 символов)');
                return;
            }

            if (!telegramBot.validatePhone(phone)) {
                alert('Пожалуйста, введите корректный номер телефона');
                return;
            }

            const formData = {
                type: 'booking',
                name: name,
                phone: phone,
                date: date,
                service: service
            };

            sendToTelegram(formData, submitBtn);
        });
    }

    // Форма консультации
    const consultationForm = document.getElementById('consultation-form');

    if (consultationForm) {
        consultationForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('consult-name').value;
            const phone = document.getElementById('consult-phone').value;
            const message = document.getElementById('message').value;
            const submitBtn = this.querySelector('button[type="submit"]');

            if (!telegramBot.validateName(name)) {
                alert('Пожалуйста, введите корректное имя (от 2 до 50 символов)');
                return;
            }

            if (!telegramBot.validatePhone(phone)) {
                alert('Пожалуйста, введите корректный номер телефона');
                return;
            }

            const formData = {
                type: 'consultation',
                name: name,
                phone: phone,
                message: message
            };

            sendToTelegram(formData, submitBtn);
        });
    }

    async function sendToTelegram(formData, buttonElement) {
        const originalText = buttonElement.textContent;

        buttonElement.textContent = 'Отправка...';
        buttonElement.disabled = true;

        try {
            const result = await telegramBot.sendMessage(formData);

            if (result.success) {
                buttonElement.textContent = '✓ ' + result.message;
                buttonElement.style.backgroundColor = '#39ff14';
                buttonElement.style.color = '#000';

                if (!result.demo) {
                    const forms = document.querySelectorAll('form');
                    forms.forEach(form => form.reset());

                    if (formData.type === 'calculator') {
                        document.getElementById('result').innerHTML =
                            '<p style="color: var(--neon-green);">' + result.message + '</p>';
                    }
                }

                setTimeout(() => {
                    buttonElement.textContent = originalText;
                    buttonElement.style.backgroundColor = '';
                    buttonElement.style.color = '';
                    buttonElement.disabled = false;
                }, 3000);

            } else {
                buttonElement.textContent = '✗ Ошибка';
                buttonElement.style.backgroundColor = '#ff5555';

                setTimeout(() => {
                    buttonElement.textContent = originalText;
                    buttonElement.style.backgroundColor = '';
                    buttonElement.disabled = false;
                }, 3000);

                alert(result.message);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            buttonElement.textContent = '✗ Ошибка';
            buttonElement.style.backgroundColor = '#ff5555';

            setTimeout(() => {
                buttonElement.textContent = originalText;
                buttonElement.style.backgroundColor = '';
                buttonElement.disabled = false;
            }, 3000);

            alert('Произошла непредвиденная ошибка. Пожалуйста, свяжитесь с нами по телефону.');
        }
    }

    // Установка минимальной даты для формы записи
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');

        dateInput.min = `${yyyy}-${mm}-${dd}`;
    }

    // СИСТЕМА АДМИН-ДОСТУПА
    createAdminAccessSystem();
});

// ==================== СИСТЕМА АДМИН-ДОСТУПА ====================

const ADMIN_PASSWORD = "8Nirvana8!"; // Поменяйте этот пароль!

function createAdminAccessSystem() {
    console.log('Создаем систему админ-доступа');

    // Проверяем, активирован ли уже админ-режим
    if (localStorage.getItem('neonglow_admin') === 'true') {
        createBotConfigPanel();
        return;
    }

    // Создаем кнопку активации админ-режима (малозаметную)
    const adminButton = document.createElement('button');
    adminButton.id = 'admin-activate-btn';
    adminButton.innerHTML = '⚙️ Админ';
    adminButton.title = 'Нажмите для доступа к настройкам';

    adminButton.addEventListener('click', function (e) {
        e.stopPropagation();
        activateAdminMode();
    });

    document.body.appendChild(adminButton);

    // Секретная комбинация клавиш для админа
    let konamiCode = [];
    const secretCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

    document.addEventListener('keydown', function (e) {
        konamiCode.push(e.keyCode);
        if (konamiCode.length > secretCode.length) {
            konamiCode.shift();
        }

        if (arraysEqual(konamiCode, secretCode)) {
            activateAdminMode();
            konamiCode = [];
        }
    });

    console.log('Система админ-доступа создана');
}

function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function activateAdminMode() {
    const password = prompt('🔐 Введите пароль для доступа к настройкам бота:');

    if (password === ADMIN_PASSWORD) {
        localStorage.setItem('neonglow_admin', 'true');
        alert('✅ Админ-режим активирован!');

        // Удаляем кнопку активации и создаем панель настроек
        const adminBtn = document.getElementById('admin-activate-btn');
        if (adminBtn) adminBtn.remove();

        createBotConfigPanel();
    } else if (password !== null) {
        alert('❌ Неверный пароль!');
    }
}

function deactivateAdminMode() {
    localStorage.removeItem('neonglow_admin');
    const button = document.getElementById('bot-config-button');
    if (button) {
        button.remove();
    }

    // Восстанавливаем кнопку активации
    createAdminAccessSystem();

    alert('🔓 Админ-режим деактивирован.');
}

// Создание панели настройки бота
function createBotConfigPanel() {
    console.log('Создаем кнопку настройки бота (админ-режим)');

    if (document.getElementById('bot-config-button')) {
        return;
    }

    const configButton = document.createElement('button');
    configButton.id = 'bot-config-button';
    configButton.innerHTML = '⚙️ Настройка бота';

    configButton.addEventListener('mouseenter', function () {
        this.style.opacity = '1';
        this.style.transform = 'scale(1.05)';
        this.style.boxShadow = '0 0 20px rgba(191, 0, 255, 0.8)';
    });

    configButton.addEventListener('mouseleave', function () {
        this.style.opacity = '0.9';
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 0 15px rgba(191, 0, 255, 0.5)';
    });

    configButton.addEventListener('click', function (e) {
        e.stopPropagation();
        showBotConfigPanel();
    });

    // Добавляем долгое нажатие для деактивации админ-режима
    let pressTimer;
    configButton.addEventListener('mousedown', function () {
        pressTimer = window.setTimeout(function () {
            deactivateAdminMode();
        }, 3000);
    });

    configButton.addEventListener('mouseup', function () {
        clearTimeout(pressTimer);
    });

    configButton.addEventListener('mouseleave', function () {
        clearTimeout(pressTimer);
    });

    configButton.addEventListener('touchstart', function () {
        pressTimer = window.setTimeout(function () {
            deactivateAdminMode();
        }, 3000);
    });

    configButton.addEventListener('touchend', function () {
        clearTimeout(pressTimer);
    });

    document.body.appendChild(configButton);
    console.log('Кнопка настройки бота создана');
}

// Показ панели настройки бота
function showBotConfigPanel() {
    const panel = document.createElement('div');
    panel.id = 'bot-config-panel';

    panel.innerHTML = `
        <h3>Настройка Telegram бота</h3>
        <div class="form-group">
            <label for="bot-token">Токен бота:</label>
            <input type="text" id="bot-token" class="neon-input" value="${localStorage.getItem('neonglow_bot_token') || 'YOUR_BOT_TOKEN'}">
            <small>Получите у @BotFather в Telegram</small>
        </div>
        <div class="form-group">
            <label for="chat-id">Chat ID:</label>
            <input type="text" id="chat-id" class="neon-input" value="${localStorage.getItem('neonglow_chat_id') || 'YOUR_CHAT_ID'}">
            <small>Узнайте у @userinfobot в Telegram</small>
        </div>
        <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button id="save-bot-config" class="btn neon-btn">Сохранить</button>
            <button id="close-bot-config" class="btn" style="background: #555; color: white;">Закрыть</button>
            <button id="test-bot-config" class="btn" style="background: var(--neon-green); color: black;">Тест</button>
            <button id="deactivate-admin" class="btn" style="background: #ff5555; color: white;">Выйти</button>
        </div>
        <div id="config-message"></div>
        <div style="margin-top: 15px; font-size: 12px; color: var(--text-secondary);">
            💡 Для деактивации админ-режима: зажмите кнопку "Настройка бота" на 3 секунды
        </div>
    `;

    document.body.appendChild(panel);

    document.getElementById('save-bot-config').addEventListener('click', saveBotConfig);
    document.getElementById('close-bot-config').addEventListener('click', () => {
        document.body.removeChild(panel);
    });
    document.getElementById('test-bot-config').addEventListener('click', testBotConfig);
    document.getElementById('deactivate-admin').addEventListener('click', deactivateAdminMode);

    panel.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', () => {
        if (document.getElementById('bot-config-panel')) {
            document.body.removeChild(panel);
        }
    });
}

function saveBotConfig() {
    const token = document.getElementById('bot-token').value;
    const chatId = document.getElementById('chat-id').value;
    const messageDiv = document.getElementById('config-message');

    if (token && token !== 'YOUR_BOT_TOKEN' && chatId && chatId !== 'YOUR_CHAT_ID') {
        localStorage.setItem('neonglow_bot_token', token);
        localStorage.setItem('neonglow_chat_id', chatId);

        messageDiv.innerHTML = '<p style="color: var(--neon-green);">✅ Настройки сохранены!</p>';

        if (typeof telegramBot !== 'undefined') {
            telegramBot.botToken = token;
            telegramBot.chatId = chatId;
        }

        setTimeout(() => {
            const panel = document.getElementById('bot-config-panel');
            if (panel) document.body.removeChild(panel);
        }, 2000);
    } else {
        messageDiv.innerHTML = '<p style="color: #ff5555;">❌ Заполните все поля корректными значениями</p>';
    }
}

async function testBotConfig() {
    const token = document.getElementById('bot-token').value;
    const chatId = document.getElementById('chat-id').value;
    const messageDiv = document.getElementById('config-message');

    if (!token || token === 'YOUR_BOT_TOKEN' || !chatId || chatId === 'YOUR_CHAT_ID') {
        messageDiv.innerHTML = '<p style="color: #ff5555;">❌ Заполните все поля перед тестом</p>';
        return;
    }

    messageDiv.innerHTML = '<p>📤 Отправка тестового сообщения...</p>';

    try {
        const testBot = new TelegramBot();
        testBot.botToken = token;
        testBot.chatId = chatId;

        const result = await testBot.sendMessage({
            type: 'consultation',
            name: 'Тестовое сообщение',
            phone: '+79991234567',
            message: 'Это тестовое сообщение для проверки работы бота'
        });

        if (result.success) {
            messageDiv.innerHTML = '<p style="color: var(--neon-green);">✅ Тест пройден! Бот работает корректно.</p>';
        } else {
            messageDiv.innerHTML = `<p style="color: #ff5555;">❌ Ошибка: ${result.message}</p>`;
        }
    } catch (error) {
        messageDiv.innerHTML = `<p style="color: #ff5555;">❌ Ошибка: ${error.message}</p>`;
    }
}

// Резервное создание кнопки админа через 3 секунды
setTimeout(() => {
    if (!document.getElementById('admin-activate-btn') && !document.getElementById('bot-config-button')) {
        console.log('Резервное создание системы админ-доступа');
        createAdminAccessSystem();
    }
}, 3000);