export const setup = {
  permission: 0, // All permission: 0 = all, 1 = owner, 2 = onwer, admin group
  group_required: false, // if true command only work on group
};

export async function run(ctx, obj) {
  const userMessage = obj.message.text.replace('!tanya ', ''); 
  await obj.reply('Tunggu sebentar....... \nkirim *!tanya restart* jika chatbot memberikan respon aneh');
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
      await obj.reply('Harap diingat bahwa informasi yang diberikan oleh chatbot ini hanya untuk tujuan informasi umum. Gunakan...');
    }
    if (data.restart) {
      await obj.reply(id,
        { audio : {url:''}})
      await obj.reply('Chatbot bermasalah dan sedang melakukan restart, tunggu sebentar...');
     
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await obj.reply('Chatkobi siap digunakan, silahkan ajukan pertanyaan anda dengan !tanya');
    } else {
      await obj.reply(data.result);
    }

  } catch (error) {
    await obj.reply('Ah, maaf, terjadi kesalahan. Error: ' + error);
  }
};
