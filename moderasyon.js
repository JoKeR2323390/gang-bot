const { SlashCommandBuilder } = require("discord.js");

module.exports = [

{
data: new SlashCommandBuilder()
.setName("777ban")
.setDescription("Kullanıcıyı banlar")
.addUserOption(o =>
o.setName("kullanici").setDescription("Banlanacak kişi").setRequired(true))
.addStringOption(o =>
o.setName("sebep").setDescription("Sebep")),

async execute(interaction, config, client){

if(!interaction.member.roles.cache.has(config.BOSS_ROLE) &&
!interaction.member.roles.cache.has(config.OG_ROLE)){
return interaction.reply({content:"Yetkin yok",ephemeral:true});
}

const user = interaction.options.getUser("kullanici");
const sebep = interaction.options.getString("sebep") || "Sebep yok";

await interaction.guild.members.ban(user.id, { reason: sebep });

await interaction.reply(`${user.tag} banlandı`);

const log = await client.channels.fetch(config.MOD_LOG_CHANNEL).catch(()=>null);
if(log) log.send(`🔨 ${interaction.user.tag} → ${user.tag} BAN | ${sebep}`);
}
},

{
data: new SlashCommandBuilder()
.setName("777kick")
.setDescription("Kullanıcıyı kickler")
.addUserOption(o =>
o.setName("kullanici").setDescription("Kicklenecek kişi").setRequired(true))
.addStringOption(o =>
o.setName("sebep").setDescription("Sebep")),

async execute(interaction, config, client){

if(!interaction.member.roles.cache.has(config.BOSS_ROLE) &&
!interaction.member.roles.cache.has(config.OG_ROLE)){
return interaction.reply({content:"Yetkin yok",ephemeral:true});
}

const user = interaction.options.getUser("kullanici");
const member = await interaction.guild.members.fetch(user.id).catch(()=>null);
const sebep = interaction.options.getString("sebep") || "Sebep yok";

if(!member)
return interaction.reply({content:"Kullanıcı bulunamadı",ephemeral:true});

await member.kick(sebep);

await interaction.reply(`${user.tag} kicklendi`);

const log = await client.channels.fetch(config.MOD_LOG_CHANNEL).catch(()=>null);
if(log) log.send(`👢 ${interaction.user.tag} → ${user.tag} KICK | ${sebep}`);
}
},

{
data: new SlashCommandBuilder()
.setName("777timeout")
.setDescription("Timeout atar")
.addUserOption(o =>
o.setName("kullanici").setDescription("Kullanıcı").setRequired(true))
.addStringOption(o =>
o.setName("sure")
.setDescription("Süre")
.setRequired(true)
.addChoices(
{name:"1 dakika",value:"60000"},
{name:"5 dakika",value:"300000"},
{name:"10 dakika",value:"600000"},
{name:"1 saat",value:"3600000"}
))
.addStringOption(o =>
o.setName("sebep").setDescription("Sebep")),

async execute(interaction, config, client){

if(!interaction.member.roles.cache.has(config.BOSS_ROLE) &&
!interaction.member.roles.cache.has(config.OG_ROLE)){
return interaction.reply({content:"Yetkin yok",ephemeral:true});
}

const member = interaction.options.getMember("kullanici");
const sure = interaction.options.getString("sure");
const sebep = interaction.options.getString("sebep") || "Sebep yok";

if(!member)
return interaction.reply({content:"Kullanıcı bulunamadı",ephemeral:true});

await member.timeout(parseInt(sure), sebep);

await interaction.reply(`${member.user.tag} timeout yedi`);

const log = await client.channels.fetch(config.MOD_LOG_CHANNEL).catch(()=>null);
if(log) log.send(`⏳ ${interaction.user.tag} → ${member.user.tag} TIMEOUT | ${sebep}`);
}
},

{
data: new SlashCommandBuilder()
.setName("777timeoutkaldir")
.setDescription("Timeout kaldırır")
.addUserOption(o =>
o.setName("kullanici").setDescription("Kullanıcı").setRequired(true)),

async execute(interaction, config, client){

if(!interaction.member.roles.cache.has(config.BOSS_ROLE) &&
!interaction.member.roles.cache.has(config.OG_ROLE)){
return interaction.reply({content:"Yetkin yok",ephemeral:true});
}

const member = interaction.options.getMember("kullanici");

if(!member)
return interaction.reply({content:"Kullanıcı bulunamadı",ephemeral:true});

await member.timeout(0);

await interaction.reply(`${member.user.tag} timeout kaldırıldı`);

const log = await client.channels.fetch(config.MOD_LOG_CHANNEL).catch(()=>null);
if(log) log.send(`✅ ${interaction.user.tag} → ${member.user.tag} TIMEOUT KALDIRILDI`);
}
},

{
data: new SlashCommandBuilder()
.setName("777unban")
.setDescription("Ban kaldırır")
.addStringOption(o =>
o.setName("id").setDescription("User ID").setRequired(true)),

async execute(interaction, config, client){

if(!interaction.member.roles.cache.has(config.BOSS_ROLE) &&
!interaction.member.roles.cache.has(config.OG_ROLE)){
return interaction.reply({content:"Yetkin yok",ephemeral:true});
}

const id = interaction.options.getString("id");

await interaction.guild.members.unban(id);

await interaction.reply(`Ban kaldırıldı: ${id}`);

const log = await client.channels.fetch(config.MOD_LOG_CHANNEL).catch(()=>null);
if(log) log.send(`♻️ ${interaction.user.tag} → UNBAN ${id}`);
}
},

{
data: new SlashCommandBuilder()
.setName("777duyuru")
.setDescription("Duyuru yapar")
.addStringOption(o =>
o.setName("mesaj").setDescription("Mesaj").setRequired(true)),

async execute(interaction){

const mesaj = interaction.options.getString("mesaj");

await interaction.channel.send(`@everyone\n📢 ${mesaj}`);

await interaction.reply({content:"Duyuru gönderildi",ephemeral:true});
}
}

];
