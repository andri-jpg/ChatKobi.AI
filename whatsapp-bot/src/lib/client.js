import newWASockets, {
  DisconnectReason,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys';
import { pino } from 'pino';

import { Execute } from '../commands/listen.js';
import { config } from '../config.js';
import { event } from '../index.js';
import { MessageObj } from '../utils/messages.js';

export async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('session');

  const socket = newWASockets.default({
    logger: pino({ level: 'silent' }),
    auth: state,
    printQRInTerminal: true,
  });

  socket.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      if (lastDisconnect?.output?.statusCode !== DisconnectReason.loggedOut) {
        console.log('[Info] Reconnect to server...');
        start();
      } else {
        console.log(
          '[Error] Disconnected from server due logged out, please login and try again.',
        );
      }
    } else if (connection === 'connecting') {
      console.log('[Info] Connecting to server...');
    } else if (connection === 'open') {
      console.clear();
      console.log('[Info] Connected, Waiting a message.');
    }
  });

  socket.ev.on('messages.upsert', async ({ messages }) => {
    for (const message of messages) {
      const obj = await MessageObj(socket, message);

      /* Mark as read all event*/
      socket.readMessages([message.key]);

      /* Ignoring status boardcast and message from me */
      if (obj.room.id === 'status@broadcast') return;
      if (obj.sender.self) return;

      /* Print push message*/
      console.log(
        `[Info] Get messages from ${obj.sender.name} on ${obj.room.id}: ${obj.message.text}`,
      );

      event.get_messages(socket, obj);

      if (obj.message.text) {
        const getPrefix = obj.message.text[0].trim();
        if (!config.prefix.includes(getPrefix)) return;
        try {
          await Execute(socket, obj);
        } catch (error) {
          console.log(error);
        }
      }
    }
  });

  socket.ev.on('creds.update', saveCreds);
}
