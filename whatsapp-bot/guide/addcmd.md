## Adding New Commands - Step by Step Guide

This guide will walk you through the process of creating your own commands.

**Step 1: Create Command Group Folder**

1. Navigate to [commands/prefixed](../commands/prefixed).
2. Create a new folder in this directory. The name of this folder will become the name of your command group.

**Step 2: Create Command File**

1. Inside the newly created folder, make a new file with the name of the command you wish to add.
2. Add the `.js` extension to the filename. For example: `hello.js`.

**Step 3: Edit Command File**

1. Open the created `.js` file using a text editor like Sublime Text.
2. In this file, you need to include both the `setup` and `run` components.

**Understanding the Components:**

- The `run` function is executed when a user triggers the command.
- The `setup` section contains command configurations like permissions and whether group is required.

**Example:**

```js
export const setup = {
   permission: 1,
   group_required: true
}

/**
 * @param ctx - socket baileys
 * @param obj - object chat (e.g., room.id, sender.name)
 * @param args - text from sender as an array of objects ["hello", "how"]
 * @returns void
 **/
export async function run(ctx, obj, args){
   ctx.sendMessage(obj.room.id, { text: "hello" })
}
```

This code demonstrates a simple configuration example. The `setup` section specifies permission level and whether group is required. The `run` function sends a "hello" message to the chat room specified by `obj.room.id`.

Follow these steps and use the provided example to create your custom commands effortlessly.