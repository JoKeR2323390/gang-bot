const { SlashCommandBuilder } = require("discord.js");

module.exports = [
{
data: new SlashCommandBuilder()
.setName("ballasban")
.setDescription("Kullanıcıyı banlar")
.addUserOption(o =>
o.setName("kullanici").setDescription("Banlanacak kişi").setRequired(true))
.addStringOption(o =>
o.setName("sebep").setDescription("Sebep")),

async execute(interaction, config, client){

const logChannel = client.channels.cache.get(config.MOD_LOG_CHANNEL);

if(!interaction.member.roles.cache.has(config.BOSS_ROLE) &&
!interaction.member.roles.cache.has(config.OG_ROLE)){
return interaction.reply({content:"Yetkin yok",ephemeral:true});
}

const user = interaction.options.getUser("kullanici");
const sebep = interaction.options.getString("sebep") || "Sebep yok";

await interaction.guild.members.ban(user.id,{reason:sebep});

await interaction.reply(`${user.tag} banlandı`);

if(logChannel){
logChannel.send(`🔨 ${interaction.user.tag} → ${user.tag} banladı\nID: ${user.id}\nSebep: ${sebep}`);
}
}
},

{
data: new SlashCommandBuilder()
.setName("ballaskick")
.setDescription("Kullanıcıyı kickler")
.addUserOption(o =>
o.setName("kullanici").setDescription("Kicklenecek kişi").setRequired(true))
.addStringOption(o =>
o.setName("sebep").setDescription("Sebep")),

async execute(interaction, config, client){

const logChannel = client.channels.cache.get(config.MOD_LOG_CHANNEL);

if(!interaction.member.roles.cache.has(config.BOSS_ROLE) &&
!interaction.member.roles.cache.has(config.OG_ROLE)){
return interaction.reply({content:"Yetkin yok",ephemeral:true});
}

const user = interaction.options.getUser("kullanici");
const sebep = interaction.options.getString("sebep") || "Sebep yok";

await interaction.guild.members.kick(user.id,sebep);

await interaction.reply(`${user.tag} kicklendi`);

if(logChannel){
logChannel.send(`👢 ${interaction.user.tag} → ${user.tag} kickledi\nSebep: ${sebep}`);
}
}
},

{
data: new SlashCommandBuilder()
.setName("ballastimeout")
.setDescription("Timeout atar")
.addUserOption(o =>
o.setName("kullanici").setDescription("Kullanıcı").setRequired(true))
.addStringOption(o =>
o.setName("sure")
.setDescription("Süre")
.setRequired(true)
.addChoices(
{name:"1 saniye",value:"1000"},
{name:"10 saniye",value:"10000"},
{name:"30 saniye",value:"30000"},
{name:"1 dakika",value:"60000"},
{name:"3 dakika",value:"180000"},
{name:"5 dakika",value:"300000"},
{name:"10 dakika",value:"600000"},
{name:"1 saat",value:"3600000"}
))
.addStringOption(o =>
o.setName("sebep").setDescription("Sebep")),

async execute(interaction, config, client){

const logChannel = client.channels.cache.get(config.MOD_LOG_CHANNEL);

if(!interaction.member.roles.cache.has(config.BOSS_ROLE) &&
!interaction.member.roles.cache.has(config.OG_ROLE)){
return interaction.reply({content:"Yetkin yok",ephemeral:true});
}

const user = interaction.options.getMember("kullanici");
const sure = interaction.options.getString("sure");
const sebep = interaction.options.getString("sebep") || "Sebep yok";

if(!user) return interaction.reply({content:"Kullanıcı bulunamadı",ephemeral:true});

await user.timeout(parseInt(sure),sebep);

await interaction.reply(`${user.user.tag} timeout yedi`);

if(logChannel){
logChannel.send(`⏳ ${interaction.user.tag} → ${user.user.tag} timeout attı\nSüre: ${sure}ms\nSebep: ${sebep}`);
}
}
},

{
data: new SlashCommandBuilder()
.setName("timeoutkaldir")
.setDescription("Timeout kaldırır")
.addUserOption(o =>
o.setName("kullanici").setDescription("Kullanıcı").setRequired(true)),

async execute(interaction, config, client){

const logChannel = client.channels.cache.get(config.MOD_LOG_CHANNEL);

const user = interaction.options.getMember("kullanici");

if(!user) return interaction.reply({content:"Kullanıcı bulunamadı",ephemeral:true});

await user.timeout(null);

await interaction.reply(`${user.user.tag} timeout kaldırıldı`);

if(logChannel){
logChannel.send(`✅ ${interaction.user.tag} → ${user.user.tag} timeout kaldırdı`);
}
}
},

{
data: new SlashCommandBuilder()
.setName("ballasunban")
.setDescription("Ban kaldırır")
.addStringOption(o =>
o.setName("id").setDescription("ID").setRequired(true)),

async execute(interaction, config, client){

const logChannel = client.channels.cache.get(config.MOD_LOG_CHANNEL);

const id = interaction.options.getString("id");

await interaction.guild.members.unban(id);

await interaction.reply(`Ban kaldırıldı: ${id}`);

if(logChannel){
logChannel.send(`♻️ ${interaction.user.tag} → ${id} unbanladı`);
}
}
},

{
data: new SlashCommandBuilder()
.setName("gangduyuru")
.setDescription("Duyuru yapar")
.addStringOption(o =>
o.setName("mesaj").setDescription("Mesaj").setRequired(true)),

async execute(interaction){

const mesaj = interaction.options.getString("mesaj");

await interaction.channel.send(`@everyone\n${mesaj}`);

await interaction.reply({content:"Duyuru gönderildi",ephemeral:true});
}
}
];
