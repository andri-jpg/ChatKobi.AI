import { config } from '../config.js';
import fs from 'fs/promises';

async function listCommands() {
  const path = `./src/commands/prefixed/`;
  const Cmdlist = [];
  const files = await fs.readdir(path);

  for (const file of files) {
    const nestedFile = await fs.readdir(path + file);

    nestedFile.forEach((name) => {
      if (!name.endsWith('.js')) return;
      const names = name.replace(/\.js/g, '');
      Cmdlist.push({
        name: names,
        group: file,
        path: `./prefixed/${file}/${name}`,
      });
    });
  }

  return Cmdlist;
}

export async function Execute(ctx, obj) {
  const { prefix, owner_id } = config;
  const { room, sender, message } = obj;
  const ids = sender.id.replace(/@s.whatsapp.net/g, '');
  const [arg, ...args] = message.text.trim().split(' ');
  const command = arg.replace(/[^\w\s]/gi, '');

  try {
    const list = await listCommands();
    const cmds = list.find((data) => data.name === command);

    if (cmds) {
      const { run, setup } = await import(cmds.path);
      const is_owner = owner_id.includes(ids);

      /* Check commands permission*/
      if (setup.permission === 1 && !is_owner) {
        return obj.reply('Ups. Only owner can run this commands.');
      }
      if (setup.group_required && !room.is_group) {
        return obj.reply('Ups. Only on group can run this commands')
      }

      await run(ctx, obj, args);
    }
    if (command === 'help' || command === 'menu') {
      const groups = {};
      let text = '*List all commands*\n\n';

      list.forEach((item) => {
        if (!groups[item.group]) groups[item.group] = [];
        groups[item.group].push(item.name);
      });

      for (const group in groups) {
        const member = groups[group].join(', ');
        text += `*- ${group}* (${groups[group].length})\n${member}\n\n`;
      }

      await ctx.sendMessage(room.id, {
        text: text.trim(),
      });
    }
  } catch (error) {
    console.log(error);
    owner_id.forEach((id) =>
      ctx.sendMessage(id + '@s.whatsapp.net', {
        text: `Error found at ${room.id}: ${error.message}`,
      }),
    );
  }
}
