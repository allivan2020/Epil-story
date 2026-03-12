export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, message, captcha } = req.body;

  // Лог для отладки (увидишь в панели Vercel Logs)
  console.log('Получен токен капчи:', captcha ? 'Да (есть)' : 'Нет (пусто!)');

  try {
    // 1. ПРОВЕРКА КАПЧИ
    const verifyRes = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        // Используем URLSearchParams для надёжной кодировки ключей
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: captcha,
        }),
      }
    );

    const verifyData = await verifyRes.json();
    console.log('Ответ от Cloudflare:', verifyData);

    if (!verifyData.success) {
      return res.status(400).json({
        error: 'Капча не пройдена.',
        details: verifyData['error-codes'],
      });
    }

    // 2. ОТПРАВКА В TELEGRAM (твой проверенный код)
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const telegramText = `
✨ *Нова заявка: VelvetSkin* ✨

👤 *Ім'я:* ${name}
📞 *Телефон:* [${phone}](tel:${phone})
💆‍♀️ *Послуга:* ${message}
    `.trim();

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramText,
          parse_mode: 'Markdown',
        }),
      }
    );

    if (telegramRes.ok) {
      return res.status(200).json({ message: 'Success' });
    } else {
      const tgError = await telegramRes.json();
      console.error('Ошибка Telegram:', tgError);
      throw new Error('Telegram API error');
    }
  } catch (error) {
    console.error('Global error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
