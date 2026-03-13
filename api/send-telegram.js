export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  const { name = '', phone = '', message = '', captcha } = req.body;

  if (!name.trim() || !phone.trim()) {
    return res.status(400).json({ error: "Ім'я та телефон обов'язкові." });
  }

  if (name.length > 50 || phone.length > 20 || message.length > 500) {
    return res
      .status(400)
      .json({ error: 'Занадто довгі дані. Спробуйте коротше.' });
  }

  const escapeHTML = str =>
    str
      ? String(str).replace(
          /[&<>"']/g,
          m =>
            ({
              '&': '&amp;',
              '<': '&lt;',
              '>': '&gt;',
              '"': '&quot;',
              "'": '&#39;',
            })[m]
        )
      : '';

  try {
    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
      throw new Error('Missing Telegram configuration');
    }

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

    const cleanPhone = phone.replace(/[^\d+]/g, '');

    const telegramText = [
      `<b>✨ Нова заявка: VelvetSkin ✨</b>`,
      `\n<b>👤 Ім'я:</b> ${escapeHTML(name)}`,
      `<b>📞 Телефон:</b> <a href="tel:${cleanPhone}">${escapeHTML(phone)}</a>`,
      `<b>💆‍♀️ Послуга:</b> ${escapeHTML(message)}`,
    ].join('\n');

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: telegramText,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              // Оставили только 100% работающую кнопку Telegram
              [
                {
                  text: '✈️ Написати в Telegram',
                  url: `https://t.me/${cleanPhone}`,
                },
              ],
            ],
          },
        }),
      }
    );

    const result = await telegramRes.json();
    if (!telegramRes.ok) throw new Error(result.description);

    return res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.error('Server Error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
