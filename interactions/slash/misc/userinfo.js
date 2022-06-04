const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Get information about a member')
		.addUserOption((option) => option.setName('member').setDescription('The target @member')),

	async execute(interaction) {
		const target = interaction.options.getMember('member') || interaction.member;
		await target.user.fetch();

		const getPresence = (status) => {
			const statusType = {
				online: 'Online',
				idle: 'Idle',
				dnd: 'Do Not Disturb',
				offline: 'Offline',
			};

			return statusType[status] || statusType['offline'];
		};

		const flags = {
			DISCORD_EMPLOYEE: 'Discord Employee',
			PARTNERED_SERVER_OWNER: 'Partnered Server Owner',
			HYPESQUAD_EVENTS: 'HypeSquad Events',
			BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
			HOUSE_BRAVERY: 'House of Bravery',
			HOUSE_BRILLIANCE: 'House of Brilliance',
			HOUSE_BALANCE: 'House of Balance',
			EARLY_SUPPORTER: 'Early Supporter',
			TEAM_USER: 'Team User',
			BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
			VERIFIED_BOT: 'Verified Bot',
			EARLY_VERIFIED_BOT_DEVELOPER: 'Early Verified Bot Developer',
			DISCORD_CERTIFIED_MODERATOR: 'Discord Certified Moderator',
			BOT_HTTP_INTERACTIONS: 'Bot HTTP Interactions',
		};

		const userFlags = target.user.flags.toArray();

		const getActivity = (activity) => {
			const activityType = {
				PLAYING: 'Playing',
				STREAMING: 'Streaming',
				LISTENING: 'Listening to',
				WATCHING: 'Watching',
			};

			return activityType[activity] || 'Unknown';
		};

		const activitiesArray = [];
		const activities = target.presence?.activities;

		if (activities === undefined) {
			activitiesArray.push();
		} else {
			for (const activity of activities) {
				const activitiesArrayEach = [];

				activitiesArrayEach.push(getActivity(activity.type), activity.name);
				activitiesArray.push(activitiesArrayEach);
			}
		}

		let banner = '';
		if (target.user.bannerURL()) {
			banner = `[Link to banner](${target.user.bannerURL({ dynamic: true, size: 512 })})`;
		} else {
			banner = 'None';
		}

		const roles = target.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()).slice(0, -1);

		const userinfoEmbed = new MessageEmbed()
			.setColor('BLUE')
			.setThumbnail(target.user.displayAvatarURL({
				dynamic: true,
			}))
			.addField(`Information about ${target.user.tag}`, [
				`**Username:** ${target.user.username}`,
				`**Discriminator:** ${target.user.discriminator}`,
				`**ID:** ${target.user.id}`,
				`**Flags:** ${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ').replace(/, ([^,]*)$/, ' & $1') : 'None'}`,
				`**Avatar:** [Link to avatar](${target.user.displayAvatarURL({ dynamic: true, size: 256 })})`,
				`**Banner:** ${banner}`,
				`**Joined Server:** <t:${parseInt(target.joinedTimestamp / 1000)}:R>`,
				`**Account Created:** <t:${parseInt(target.user.createdTimestamp / 1000)}:R>`,
				`**Status:** ${getPresence(target.presence?.status)}`,
				`**Activity:** ${activitiesArray.length ? activitiesArray.map(activity => activity.join(' ')).join(', ').replace(/, ([^,]*)$/, ' & $1') : 'None'}`,
				`**Roles [${roles.length}]:** ${roles.length ? roles.join(', ').replace(/, ([^,]*)$/, ' & $1') : 'None'}`,
			].join('\n'));

		await interaction.reply({
			embeds: [userinfoEmbed],
		});
	},
};