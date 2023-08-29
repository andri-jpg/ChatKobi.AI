import { isJidGroup, downloadMediaMessage } from '@whiskeysockets/baileys';

/**
 * @typedef {Object} MessageObj
 * @property {Object} room - Room information eg. id, is_group
 * @property {Object} sender - Sender information eg. name, id
 * @property {Object} messenge - Messenge information eg. text, type
 * @property {Object} replied - Replied information if user reply a message eg. text, sender, type
 * @property {Object} group - Group information if sender om group eg. name_group, description
 * @property {Function} reply - Reply message eg. .reply("Hallo")
 */

/**
 * Parsing messenge Object to readeble Object
 * @param ctx - socket baileys
 * @param obj - obj message to convert
 * @returns {MessageObj} Object messenge with readeble Object
 */
export async function MessageObj(ctx, obj) {
  /* Parse Room Information */
  const room_id = obj.key.remoteJid;

  /* Parse Sender Information */
  const sender_id = obj.key.participant || obj.key.remoteJid;
  const fromMe = obj.key.fromMe;
  const sender_name = obj.pushName;

  /* Get Group Information if available */
  const group = await Group(ctx, room_id);

  return {
    room: {
      is_group: group ? true : false,
      id: room_id,
    },
    sender: {
      id: sender_id,
      self: fromMe,
      name: sender_name,
    },
    message: {
      type: Type(obj.message),
      text: Text(obj.message),
      media: Media(obj),
    },
    replied: await Replied(obj),
    group: group,
    reply: (text) => {
      reply(ctx, obj, text);
    },
  };
}

export async function MessageObjQuoted(obj) {
  return {
    sender: {
      id: obj.participant,
    },
    message: {
      type: Type(obj.quotedMessage),
      text: Text(obj.quotedMessage),
      media: MediaQuoted(obj),
    },
  };
}

export function Type(obj) {
  const typeMappings = {
    stickerMessage: 'sticker',
    imageMessage: 'image',
    videoMessage: 'video',
    audioMessage:
      obj?.audioMessage && obj?.audioMessage.ppt ? 'audio_vn' : 'audio',
    documentMessage: 'document',
    contactMessage: 'contact',
    productMessage: 'catalog',
    pollCreationMessage: 'polling',
    locationMessage: 'locate',
    editedMessage: 'message_edited',
  };
  for (const key in typeMappings) {
    if (obj?.[Object.keys(obj)]?.contextInfo?.quotedMessage) {
      return 'message_reply';
    } else if (obj?.[key]) {
      return typeMappings[key];
    }
  }
  return 'message';
}

export function Text(obj) {
  return (
    obj?.conversation ||
    obj?.extendedTextMessage?.text ||
    obj?.imageMessage?.caption ||
    obj?.videoMessage?.caption ||
    obj?.editedMessage?.message?.protocolMessage?.editedMessage?.conversation ||
    ''
  );
}

export function Media(obj) {
  const mediaType = [
    'imageMessage',
    'videoMessage',
    'stickerMessage',
    'audioMessage',
  ];

  for (const type of mediaType) {
    if (obj?.message?.[type]) {
      const objectkey = obj.message?.[Object.keys(obj.message)];
      return {
        buffer: async () => await downloadMediaMessage(obj, 'buffer'),
        mimetype: objectkey?.mimetype,
        height: objectkey?.height,
        width: objectkey?.width,
        ppt: objectkey?.ppt,
        second: objectkey?.seconds,
      };
    }
  }
  return undefined;
}

export function MediaQuoted(obj) {
  const mediaType = [
    'imageMessage',
    'videoMessage',
    'stickerMessage',
    'audioMessage',
  ];

  for (const type of mediaType) {
    if (obj?.quotedMessage?.[type]) {
      const objectkey = obj.quotedMessage?.[Object.keys(obj.quotedMessage)];
      return {
        buffer: async () =>
          await downloadMediaMessage({ message: obj.quotedMessage }, 'buffer'),
        mimetype: objectkey?.mimetype,
        height: objectkey?.height,
        width: objectkey?.width,
        ppt: objectkey?.ppt,
        second: objectkey?.seconds,
      };
    }
  }
  return undefined;
}

export async function Replied(obj) {
  const type = Type(obj.message);

  if (type === 'message_reply') {
    const key = Object.keys(obj.message);
    return await MessageObjQuoted(obj.message?.[key].contextInfo);
  } else {
    return undefined;
  }
}

export async function Group(ctx, jid) {
  const is_group = isJidGroup(jid);
  if (is_group) {
    return fetchGroupInfo(ctx, jid);
  } else {
    return undefined;
  }
}

export async function fetchGroupInfo(ctx, jid) {
  const GroupMetadata = await ctx.groupMetadata(jid);
  return {
    id: GroupMetadata.id,
    name: GroupMetadata.subject,
    description: GroupMetadata.desc,
    member: GroupMetadata.participants,
  };
}

function reply(ctx, obj, data) {
  return new Promise(async (resolve, reject) => {
    if (typeof data !== 'string')
      return reject(new Error('Value must a string!'));
    ctx.sendMessage(
      obj.key.remoteJid,
      {
        text: data,
      },
      { quoted: obj },
    );
  });
}
