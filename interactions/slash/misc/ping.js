const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Ping command.'),

	async execute(interaction) {
		const { client } = interaction;

		const apiLatency = client.ws.ping;

		const testEmbed = new MessageEmbed()
			.setColor('BLUE')
			.setDescription('💓 Testing Connection Speed...');

		const reply = await interaction.channel.send({
			embeds: [testEmbed],
		});

		const botLatency = reply.createdTimestamp - interaction.createdTimestamp;
		reply.delete();

		let apiColor = '';
		let botColor = '';

		const circles = {
			green: '🟢',
			yellow: '🟡',
			red: '🔴',
		};

		if (apiLatency >= 0) {
			apiColor = circles.green;
		}

		if (apiLatency >= 100) {
			apiColor = circles.yellow;
		}

		if (apiLatency >= 150) {
			apiColor = circles.red;
		}

		if (botLatency >= 0) {
			botColor = circles.green;
		}

		if (botLatency >= 100) {
			botColor = circles.yellow;
		}

		if (botLatency >= 150) {
			botColor = circles.red;
		}

		const pingEmbed = new MessageEmbed()
			.setColor('BLUE')
			.addFields({
				name: 'API Latency',
				value: `${apiColor} | ${apiLatency}ms`,
			}, {
				name: 'Bot Latency',
				value: `${botColor} | ${botLatency}ms`,
			});

		await interaction.reply({
			embeds: [pingEmbed],
		});
	},
};