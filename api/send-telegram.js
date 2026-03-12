export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, message, captcha } = req.body;

  try {
    // 1. ПРОВЕРКА КАПЧИ
    const verifyRes = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: captcha,
        }),
      }
    );

    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      return res.status(400).json({ error: 'Капча не пройдена.' });
    }

    // 2. ПОДГОТОВКА ДАННЫХ
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Очищаем номер: cleanPhone для ссылок tel:, digitsOnly для мессенджеров
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    const digitsOnly = phone.replace(/\D/g, '');

    const telegramText = `
✨ *Нова заявка: VelvetSkin* ✨

👤 *Ім'я:* ${name}
📞 *Телефон:* ${phone}
💆‍♀️ *Послуга:* ${message}
`.trim();

    // 3. ОТПРАВКА В TELEGRAM С КНОПКАМИ
    const telegramRes = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramText,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: '📞 Зателефонувати', url: `tel:${cleanPhone}` }],
              [
                { text: '💬 Viber', url: `viber://add?number=${digitsOnly}` },
                { text: '📱 WhatsApp', url: `https://wa.me/${digitsOnly}` },
              ],
            ],
          },
        }),
      }
    );

    if (telegramRes.ok) {
      return res.status(200).json({ message: 'Success' });
    } else {
      throw new Error('Telegram API error');
    }
  } catch (error) {
    console.error('Global error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
