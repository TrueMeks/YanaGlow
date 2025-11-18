// Конфигурационный файд для Telegram бота
// ДАННЫЕ НАСТРАИВАЮТСЯ ВРУЧНУЮ ПЕРЕД ЗАГРУЗКОЙ НА САЙТ

const config = {
    // ЗАМЕНИТЕ НА РЕАЛЬНЫЕ ЗНАЧЕНИЯ ПЕРЕД РАЗМЕЩЕНИЕМ САЙТА
    BOT_TOKEN: 'YOUR_BOT_TOKEN',    // Токен вашего бота
    CHAT_ID: 'YOUR_CHAT_ID',        // Ваш chat_id

    // Настройки сайта
    SITE_NAME: 'NeonGlow Cosmetology',
    ADMIN_EMAIL: 'admin@neonglow.ru'
};

// Для демонстрации проверяем наличие реальных значений в localStorage
try {
    const storedToken = localStorage.getItem('neonglow_bot_token');
    const storedChatId = localStorage.getItem('neonglow_chat_id');

    if (storedToken && storedToken !== 'YOUR_BOT_TOKEN') {
        config.BOT_TOKEN = storedToken;
    }
    if (storedChatId && storedChatId !== 'YOUR_CHAT_ID') {
        config.CHAT_ID = storedChatId;
    }
} catch (e) {
    console.log('LocalStorage не доступен');
}

console.log('Config загружен:', config.BOT_TOKEN !== 'YOUR_BOT_TOKEN' ? 'Настроен' : 'Демо-режим');