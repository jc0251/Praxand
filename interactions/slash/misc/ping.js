const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription(
			'Ping command.',
		),

	async execute(interaction) {
		const { client } = interaction;

		const testEmbed = new MessageEmbed()
			.setColor('BLUE')
			.setDescription('💓 Testing Connection Speed...');

		const reply = await interaction.channel.send({
			embeds: [testEmbed],
		});

		const bPing = reply.createdTimestamp - interaction.createdTimestamp;
		reply.delete();

		const pingEmbed = new MessageEmbed()
			.setColor('BLUE')
			.addFields({
				name: 'Bot Ping',
				value: `${bPing}ms`,
			}, {
				name: 'API Latency',
				value: `${client.ws.ping}ms`,
			});

		await interaction.reply({
			embeds: [pingEmbed],
		});
	},
};