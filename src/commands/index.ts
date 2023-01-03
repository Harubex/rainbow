import type { Client, Message } from "discord.js";
import pickColor from "./pickColor";

export default {
    "!pickColor": pickColor
} as { [name: string]: (client: Client, msg: Message, color?: string) => Promise<string> };

