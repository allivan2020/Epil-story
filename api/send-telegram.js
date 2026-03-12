export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  const { name, phone, message, captcha } = req.body;

  try {
    // 1. ПЕРЕВІРКА КАПЧІ
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

    // Якщо капча каже "ні", ми не йдемо далі
    if (!verifyData.success) {
      console.error('Cloudflare error:', verifyData);
      return res.status(400).json({ error: 'Капча не пройдена.' });
    }

    // 2. ПІДГОТОВКА ДАНИХ (БЕЗ ПЕРЕВАЖЕННЯ)
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Чистимо номер для посилань
    const cleanPhone = phone.replace(/[^\d+]/g, ''); // для tel:+380...
    const digitsOnly = phone.replace(/\D/g, ''); // для Viber/WA

    const telegramText = `
✨ *Нова заявка: VelvetSkin* ✨

👤 *Ім'я:* ${name}
📞 *Телефон:* ${phone}
💆‍♀️ *Послуга:* ${message}
    `.trim();

    // 3. ВІДПРАВКА В TELEGRAM
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

    if (!telegramRes.ok) {
      const errorData = await telegramRes.json();
      console.error('Telegram API error:', errorData);
      return res.status(502).json({ error: 'Помилка Telegram' });
    }

    return res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.error('Global Error:', error);
    return res.status(500).json({ error: 'Внутрішня помилка сервера' });
  }
}
