const { SlashCommandBuilder } = require("discord.js");

module.exports = [

{
data: new SlashCommandBuilder()
.setName("777ban")
.setDescription("Ban")
.addUserOption(o =>
o.setName("kullanici").setRequired(true))
.addStringOption(o =>
o.setName("sebep")),

async execute(interaction, config, client){

const user = interaction.options.getUser("kullanici");
const sebep = interaction.options.getString("sebep") || "Yok";

await interaction.guild.members.ban(user.id, { reason: sebep });

await interaction.reply(`${user.tag} banlandı`);
}
},

{
data: new SlashCommandBuilder()
.setName("777kick")
.setDescription("Kick")
.addUserOption(o =>
o.setName("kullanici").setRequired(true)),

async execute(interaction, config, client){

const user = interaction.options.getUser("kullanici");
const member = await interaction.guild.members.fetch(user.id);

await member.kick();

await interaction.reply(`${user.tag} kicklendi`);
}
},

{
data: new SlashCommandBuilder()
.setName("777timeout")
.setDescription("Timeout")
.addUserOption(o => o.setName("kullanici").setRequired(true))
.addStringOption(o => o.setName("sure").setRequired(true)
.addChoices(
{name:"1 dk",value:"60000"},
{name:"5 dk",value:"300000"},
{name:"10 dk",value:"600000"},
{name:"1 saat",value:"3600000"}
)),

async execute(interaction, config, client){

const user = await interaction.guild.members.fetch(
interaction.options.getUser("kullanici").id
);

const sure = interaction.options.getString("sure");

await user.timeout(Number(sure));

await interaction.reply("timeout atıldı");
}
},

{
data: new SlashCommandBuilder()
.setName("777timeoutkaldir")
.setDescription("Timeout kaldır")
.addUserOption(o => o.setName("kullanici").setRequired(true)),

async execute(interaction, config, client){

const user = await interaction.guild.members.fetch(
interaction.options.getUser("kullanici").id
);

await user.timeout(null);

await interaction.reply("timeout kaldırıldı");
}
},

{
data: new SlashCommandBuilder()
.setName("777unban")
.setDescription("Unban")
.addStringOption(o =>
o.setName("id").setRequired(true)),

async execute(interaction){

await interaction.guild.members.unban(
interaction.options.getString("id")
);

await interaction.reply("unbanlandı");
}
}

];
