const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const { token } = require('./config.json');
const { createCanvas, Image } = require('@napi-rs/canvas');
const { readFile } = require('node:fs');


const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));



for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}


client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found`);
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.log(error);
        await interaction.reply({ content: 'These was an error while executing this command!', ephemeral: true })

    }
})





for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}




/* const applyText = (canvas, text) => {
    const context = canvas.getContext('2d');
    let fontSize = 70;

    do {
        context.font = `${fontSize -= 10}px sans-serif`;
    } while (context.measureText(text).width > canvas.width - 300);

    return context.font;
}; */

/* client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        const canvas = createCanvas(700, 250);
        const context = canvas.getContext('2d');

        const background = await readFile('./swort.jpg');
        const backgroundImage = new Image();
        backgroundImage.src = background;
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        context.strokeStyle = '#0099ff';
        context.strokeRect(0, 0, canvas.width, canvas.height);

        context.font = '28px sans-serif';
        context.fillStyle = '#ffffff';
        context.fillText('Profile', canvas.width / 2.5, canvas.height / 3.5);

        context.font = applyText(canvas, `${interaction.member.displayName}!`);
        context.fillStyle = '#ffffff';
        context.fillText(`${interaction.member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

        context.beginPath();
        context.arc(125, 125, 100, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();

        const { body } = await request(interaction.user.displayAvatarURL({ format: 'jpg' }));
        const avatar = new Image();
        avatar.src = Buffer.from(await body.arrayBuffer());
        context.drawImage(avatar, 25, 25, 200, 200);

        const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'profile-image.png' });

        interaction.reply({ files: [attachment] });
    }
});
 */

/* 
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
        await interaction.followUp('Pong again!');
    }
});
 */

client.login(token);