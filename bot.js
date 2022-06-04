const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, clientID, testGuildID } = require('./config.json');

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES],
});

const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, async (...args) => await event.execute(...args, client));
	}
}

client.slashCommands = new Collection();
// client.buttonCommands = new Collection();
// client.selectCommands = new Collection();
client.contextCommands = new Collection();
// client.modalCommands = new Collection();

const slashCommands = fs.readdirSync('./interactions/slash');

for (const module of slashCommands) {
	const commandFiles = fs.readdirSync(`./interactions/slash/${module}`).filter((file) => file.endsWith('.js'));

	for (const commandFile of commandFiles) {
		const command = require(`./interactions/slash/${module}/${commandFile}`);
		client.slashCommands.set(command.data.name, command);
	}
}

// const buttonCommands = fs.readdirSync('./interactions/buttons');

// for (const module of buttonCommands) {
// 	const commandFiles = fs.readdirSync(`./interactions/buttons/${module}`).filter((file) => file.endsWith('.js'));

// 	for (const commandFile of commandFiles) {
// 		const command = require(`./interactions/buttons/${module}/${commandFile}`);
// 		client.buttonCommands.set(command.id, command);
// 	}
// }

// const selectMenus = fs.readdirSync('./interactions/select-menus');

// for (const module of selectMenus) {
// 	const commandFiles = fs.readdirSync(`./interactions/select-menus/${module}`).filter((file) => file.endsWith('.js'));

// 	for (const commandFile of commandFiles) {
// 		const command = require(`./interactions/select-menus/${module}/${commandFile}`);
// 		client.selectCommands.set(command.id, command);
// 	}
// }

// const contextMenus = fs.readdirSync('./interactions/context-menus');

// for (const folder of contextMenus) {
// 	const files = fs.readdirSync(`./interactions/context-menus/${folder}`).filter((file) => file.endsWith('.js'));

// 	for (const file of files) {
// 		const menu = require(`./interactions/context-menus/${folder}/${file}`);
// 		const keyName = `${folder.toUpperCase()} ${menu.data.name}`;
// 		client.contextCommands.set(keyName, menu);
// 	}
// }

// const modalCommands = fs.readdirSync('./interactions/modals');

// for (const module of modalCommands) {
// 	const commandFiles = fs.readdirSync(`./interactions/modals/${module}`).filter((file) => file.endsWith('.js'));

// 	for (const commandFile of commandFiles) {
// 		const command = require(`./interactions/modals/${module}/${commandFile}`);
// 		client.modalCommands.set(command.id, command);
// 	}
// }

const rest = new REST({ version: '9' }).setToken(token);

const commandJsonData = [
	...Array.from(client.slashCommands.values()).map((c) => c.data.toJSON()),
	...Array.from(client.contextCommands.values()).map((c) => c.data),
];

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		// await rest.put(Routes.applicationGuildCommands(clientID), { body: commandJsonData });
		await rest.put(Routes.applicationGuildCommands(clientID, testGuildID), { body: commandJsonData });

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

client.login(token);