// api/send-telegram.js
export default async function handler(req, res) {
  // 1. Проверяем метод (только POST)
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Метод не разрешен' });
  }

  const { name, phone, message } = req.body;

  // 2. Базовая проверка данных на стороне сервера (на всякий случай)
  if (!name || !phone) {
    return res.status(400).json({ message: 'Имя и телефон обязательны' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // 3. Формируем текст (экранируем спецсимволы, если нужно, но для простоты используем HTML)
  const text =
    `<b>🚀 Новая заявка Epil-story</b>\n\n` +
    `<b>Имя:</b> ${name}\n` +
    `<b>Телефон:</b> <code>${phone}</code>\n` +
    `<b>Сообщение:</b> ${message || '—'}`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          parse_mode: 'HTML',
          text: text,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      console.error('Telegram Error:', data);
      return res.status(502).json({ message: 'Ошибка Telegram API' });
    }
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}
