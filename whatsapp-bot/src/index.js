import * as client from './lib/client.js';

export const event = {};

/**
 * Handle incoming messages
 * @param ctx - socket baileys
 * @param obj - object messages
 * @returns {void}
 */
event.get_messages = async (ctx, obj) => {
  const messageText = obj.message.text;

 
  if (messageText.indexOf('!') === -1) {
    await ctx.downloadMediaMessage(messageText)

    await obj.reply('Gunakan *!tanya* untuk bertanya kepada chatkobi\n*Contoh : !tanya apa itu diabetes?.*\n*Contoh !tanya bagaimana cara mengatasi kesemutan?*\nUntuk informasi lebih lanjut kirim pesan *!info*');
  }
};


client.start();
