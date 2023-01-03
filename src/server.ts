import Discord from "discord.js";
import fetch from "node-fetch";

import commands from "./commands";

const disc = new Discord.Client();

disc.on("ready", async () => {
    if (disc && disc.user) {
        console.log(`Logged in as ${disc.user.tag}!`);
    }
});

disc.on("message", async (msg: Discord.Message) => {
    try {
        let content = msg.content;

        // Don't respond to yourself.
        if (msg.author.username.indexOf(process.env.BOT_NAME!) >= 0) {
            return;
        }

        // If the message is too big and is read as an attachment, read out the text.
        if (msg.attachments.size > 0) {
            const file = msg.attachments.first()!;
            const resp = await fetch(file.url);
            content = await resp.text();
        }

        for (const cmd in commands) {
            if (cmd === content.substr(0, cmd.length)) {
                const response = await commands[cmd](disc, msg, content.substr(cmd.length));
                await msg.reply(response);
                const roles = await msg.guild?.roles.fetch()!;
                roles.cache.forEach(async (role) => {
                    if (role.members.size === 0) {
                        try {
//                            await role.delete();
                        } catch (e) {
                            console.log("Error when deleting roles:", e);
                        }
                    }
                });
                return;
            }
        }
    } catch (e) {
        msg.reply(`An error has occurred; please complain to hannah about it: \n\n ${e}`);
    }
    // Spams every message
    //await msg.reply(`I'm unable to read your command. Here's a list of available commands: \n${Object.keys(commands).join(", ")}`);
});

disc.login(process.env.DISCORD_TOKEN);

