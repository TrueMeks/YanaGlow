class TelegramBot {
    constructor() {
        this.botToken = 'YOUR_BOT_TOKEN';
        this.chatId = 'YOUR_CHAT_ID';

        if (typeof config !== 'undefined') {
            this.botToken = config.BOT_TOKEN || this.botToken;
            this.chatId = config.CHAT_ID || this.chatId;
        }

        console.log('Telegram Bot инициализирован');
    }

    async sendMessage(formData) {
        if (this.botToken === 'YOUR_BOT_TOKEN' || this.chatId === 'YOUR_CHAT_ID') {
            console.log('Демо-режим: данные формы', formData);
            return this.demoMode(formData);
        }

        try {
            const message = this.formatMessage(formData);
            const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: this.chatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });

            const result = await response.json();

            if (result.ok) {
                return { success: true, message: 'Заявка успешно отправлена!' };
            } else {
                console.error('Ошибка Telegram API:', result);
                return {
                    success: false,
                    message: 'Ошибка при отправке. Пожалуйста, свяжитесь с нами по телефону.'
                };
            }
        } catch (error) {
            console.error('Ошибка отправки в Telegram:', error);
            return {
                success: false,
                message: 'Ошибка соединения. Пожалуйста, попробуйте позже или свяжитесь по телефону.'
            };
        }
    }

    formatMessage(formData) {
        let message = '<b>🚨 НОВАЯ ЗАЯВКА С САЙТА</b>\n\n';

        switch (formData.type) {
            case 'booking':
                message += `<b>Тип:</b> Запись на процедуру\n`;
                message += `<b>Имя:</b> ${formData.name}\n`;
                message += `<b>Телефон:</b> ${formData.phone}\n`;
                message += `<b>Дата:</b> ${formData.date}\n`;
                message += `<b>Услуга:</b> ${formData.service}\n`;
                break;

            case 'consultation':
                message += `<b>Тип:</b> Запрос на консультацию\n`;
                message += `<b>Имя:</b> ${formData.name}\n`;
                message += `<b>Телефон:</b> ${formData.phone}\n`;
                if (formData.message) {
                    message += `<b>Сообщение:</b> ${formData.message}\n`;
                }
                break;

            case 'calculator':
                message += `<b>Тип:</b> Расчет стоимости\n`;
                message += `<b>Процедура:</b> ${formData.procedure}\n`;
                message += `<b>Количество сеансов:</b> ${formData.sessions}\n`;
                message += `<b>Стоимость:</b> ${formData.price} руб.\n`;
                break;
        }

        message += `\n<b>📅 Время заявки:</b> ${new Date().toLocaleString('ru-RU')}`;
        message += `\n<b>🌐 Источник:</b> сайт NeonGlow`;

        return message;
    }

    demoMode(formData) {
        console.log('📧 Демо-режим - данные формы:', formData);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'Заявка отправлена! (демо-режим)',
                    demo: true
                });
            }, 1000);
        });
    }

    validatePhone(phone) {
        const phoneRegex = /^[\+]?[78][-\(]?\d{3}\)?-?\d{3}-?\d{2}-?\d{2}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    validateName(name) {
        return name.length >= 2 && name.length <= 50;
    }
}

const telegramBot = new TelegramBot();