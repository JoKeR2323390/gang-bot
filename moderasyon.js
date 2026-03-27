const { SlashCommandBuilder } = require("discord.js");

module.exports = [
{
data: new SlashCommandBuilder()
.setName("ballasban")
.setDescription("Ban atar")
.addUserOption(o => o.setName("kullanici").setDescription("Kişi").setRequired(true)),

async execute(interaction, config, client){

const user = interaction.options.getUser("kullanici");

await interaction.guild.members.ban(user.id);

await interaction.reply(`${user.tag} banlandı`);

const log = await client.channels.fetch(config.MOD_LOG_CHANNEL);
log.send(`🔨 ${interaction.user.tag} → ${user.tag} banladı`);
}
},

{
data: new SlashCommandBuilder()
.setName("ballaskick")
.setDescription("Kick atar")
.addUserOption(o => o.setName("kullanici").setDescription("Kişi").setRequired(true)),

async execute(interaction, config, client){

const user = interaction.options.getUser("kullanici");

await interaction.guild.members.kick(user.id);

await interaction.reply(`${user.tag} kicklendi`);

const log = await client.channels.fetch(config.MOD_LOG_CHANNEL);
log.send(`👢 ${interaction.user.tag} → ${user.tag} kickledi`);
}
}
];
