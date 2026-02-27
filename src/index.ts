import { Client, GatewayIntentBits, GuildMember } from 'discord.js';
import * as dotenv from "dotenv";

dotenv.config();

const client = new Client({
    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
});

client.once("clientReady", () => {
    console.log(`Logged in as ${client.user?.tag}`);
    startMsgTimer();
});

client.on("messageCreate", (message) => {
    if (message.author.bot) return;
    console.log(`[${message.guild?.name}] ${message.author.username}: ${message.content}`);
})

async function decideTargetAndDm(){
    const guild = await client.guilds.fetch(process.env.GUILD_ID!);
    const members = await guild.members.fetch();
    const humanMembers = members.filter((m:GuildMember) => !m.user.bot);

    if(humanMembers.size === 0){
        console.log("No one is home!");
        return;
    }

    const randomIndex = Math.floor(Math.random() * humanMembers.size);
    const randomMember = humanMembers.at(randomIndex)!;
    const messages =[
        "test 1",
        "test 2",
        "test 3",
    ];

    const randMsg = messages[Math.floor(Math.random() * messages.length)];

    try {
        await randomMember.send(randMsg);
        console.log(`Sent ${randMsg} to ${randomMember.user.username}`);
    } catch (err){
        console.log(`couldn't dm ${randomMember.user.username}`);
    }
}

function startMsgTimer(){
    const interval = 60*60*1000;

    setInterval(() => {
        decideTargetAndDm();
    }, interval);

    setTimeout(() => decideTargetAndDm(), 5000);
}

client.login(process.env.BOT_TOKEN)