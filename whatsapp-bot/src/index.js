import * as client from './lib/client.js';

export const event = {};

event.get_messages = async (ctx, obj) => {
  const userMessage = obj.message.text;
  if (userMessage) {
    try {
      const response = await fetch('http://127.0.0.1:8089/handleinput', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: userMessage,
          history: '',
        }),
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      if (data.warning) {
        await obj.reply('Harap di ingat bahwa informasi yang diberikan oleh chatbot ini hanya untuk tujuan informasi umum. Gunakan dengan tanggung jawab.');
      }
      if (data.restart) {
        await obj.reply('Chatbot bermasalah, tunggu sebentar...');
      }

      await obj.reply(data.result);

    } catch (error) {
      await obj.reply('Ah, maaf, terjadi kesalahan');
    }
  }
};

client.start();
