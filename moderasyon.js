const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const config = require("./config.json");

const data = [

new SlashCommandBuilder()
.setName("ballasban")
.setDescription("Kullanıcıyı banlar")
.addUserOption(o =>
o.setName("kullanici")
.setDescription("Banlanacak kişi")
.setRequired(true)
)
.addStringOption(o =>
o.setName("sebep")
.setDescription("Sebep")
),

new SlashCommandBuilder()
.setName("ballaskick")
.setDescription("Kullanıcıyı kickler")
.addUserOption(o =>
o.setName("kullanici")
.setDescription("Kicklenecek kişi")
.setRequired(true)
)
.addStringOption(o =>
o.setName("sebep")
.setDescription("Sebep")
),

new SlashCommandBuilder()
.setName("ballastimeout")
.setDescription("Timeout atar")
.addUserOption(o =>
o.setName("kullanici")
.setDescription("Timeout atılacak kişi")
.setRequired(true)
)
.addStringOption(o =>
o.setName("sure")
.setDescription("Süre seç")
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
)
)
.addStringOption(o =>
o.setName("sebep")
.setDescription("Sebep")
),

new SlashCommandBuilder()
.setName("timeoutkaldir")
.setDescription("Timeout kaldırır")
.addUserOption(o =>
o.setName("kullanici")
.setDescription("Kullanıcı")
.setRequired(true)
),

new SlashCommandBuilder()
.setName("ballasunban")
.setDescription("Ban kaldırır")
.addStringOption(o =>
o.setName("id")
.setDescription("Discord ID")
.setRequired(true)
),

new SlashCommandBuilder()
.setName("gangduyuru")
.setDescription("Duyuru yapar")
.addStringOption(o =>
o.setName("mesaj")
.setDescription("Mesaj")
.setRequired(true)
)

];

async function execute(interaction, client){

const logChannel = client.channels.cache.get(config.MOD_LOG_CHANNEL);

// YETKİ KONTROL
if(!interaction.member.roles.cache.has(config.BOSS_ROLE) &&
!interaction.member.roles.cache.has(config.OG_ROLE)){
return interaction.reply({content:"Yetkin yok",ephemeral:true});
}

// BAN
if(interaction.commandName === "ballasban"){
const user = interaction.options.getUser("kullanici");
const sebep = interaction.options.getString("sebep") || "Sebep yok";

await interaction.guild.members.ban(user.id,{reason:sebep});

interaction.reply(`${user.tag} banlandı`);

logChannel.send(`🔨 ${interaction.user.tag} → ${user.tag} banladı\nID: ${user.id}\nSebep: ${sebep}`);
}

// KICK
if(interaction.commandName === "ballaskick"){
const user = interaction.options.getUser("kullanici");
const sebep = interaction.options.getString("sebep") || "Sebep yok";

await interaction.guild.members.kick(user.id,sebep);

interaction.reply(`${user.tag} kicklendi`);

logChannel.send(`👢 ${interaction.user.tag} → ${user.tag} kickledi\nSebep: ${sebep}`);
}

// TIMEOUT
if(interaction.commandName === "ballastimeout"){
const user = interaction.options.getMember("kullanici");
const sure = interaction.options.getString("sure");
const sebep = interaction.options.getString("sebep") || "Sebep yok";

await user.timeout(parseInt(sure),sebep);

interaction.reply(`${user.user.tag} timeout yedi`);

logChannel.send(`⏳ ${interaction.user.tag} → ${user.user.tag} timeout attı\nSüre: ${sure}ms\nSebep: ${sebep}`);
}

// TIMEOUT KALDIR
if(interaction.commandName === "timeoutkaldir"){
const user = interaction.options.getMember("kullanici");

await user.timeout(null);

interaction.reply(`${user.user.tag} timeout kaldırıldı`);

logChannel.send(`✅ ${interaction.user.tag} → ${user.user.tag} timeout kaldırdı`);
}

// UNBAN
if(interaction.commandName === "ballasunban"){
const id = interaction.options.getString("id");

await interaction.guild.members.unban(id);

interaction.reply(`Ban kaldırıldı: ${id}`);

logChannel.send(`♻️ ${interaction.user.tag} → ${id} unbanladı`);
}

// DUYURU
if(interaction.commandName === "gangduyuru"){
const mesaj = interaction.options.getString("mesaj");

interaction.channel.send(`@everyone\n${mesaj}`);

interaction.reply({content:"Duyuru gönderildi",ephemeral:true});
}

}

module.exports = { data, execute };