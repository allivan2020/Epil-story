export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  const { name, phone, message, captcha } = req.body;

  try {
    // 1. ПРОВЕРКА КАПЧИ (Cloudflare)
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

    // Чистим номер: оставляем только цифры для кнопок
    const cleanPhone = phone.replace(/[^\d+]/g, ''); // для tel:+380...
    const digitsOnly = phone.replace(/\D/g, ''); // для мессенджеров

    // Текст в формате HTML (теперь не сломается от спецсимволов)
    const telegramText = `
<b>✨ Нова заявка: VelvetSkin ✨</b>

<b>👤 Ім'я:</b> ${name}
<b>📞 Телефон:</b> <a href="tel:${cleanPhone}">${phone}</a>
<b>💆‍♀️ Послуга:</b> ${message}
    `.trim();

    // 3. ОТПРАВКА В TELEGRAM
    const telegramRes = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramText,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '💬 Viber',
                  url: `viber://chat?number=%2B${digitsOnly}`,
                },
                { text: '📱 WhatsApp', url: `https://wa.me/${digitsOnly}` },
              ],
              [
                {
                  text: '✈️ Написати в Telegram',
                  url: `https://t.me/+${digitsOnly}`,
                },
              ],
            ],
          },
        }),
      }
    );

    const result = await telegramRes.json();

    if (!telegramRes.ok) {
      console.error('Telegram Error:', result);
      return res
        .status(502)
        .json({ error: 'Помилка Telegram', details: result.description });
    }

    return res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.error('Global Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
