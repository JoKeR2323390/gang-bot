const {
ActionRowBuilder,
ButtonBuilder,
ButtonStyle,
ModalBuilder,
TextInputBuilder,
TextInputStyle,
Events
} = require("discord.js");

module.exports = (client, config) => {

client.once(Events.ClientReady, async () => {

const kanal = await client.channels.fetch(config.SIKAYET_CHANNEL).catch(()=>{});
if(!kanal) return console.log("Şikayet kanalı bulunamadı");

await kanal.send({
content:
"**Şikayetiniz Varsa Aşağıdaki Butona Tıklayın ve Şikayetinizi Yazın.**\nBoss/OG Şikayetinizle En Kısa Sürede İlgilenecektir.\n\n@everyone",
components: [
new ActionRowBuilder().addComponents(
new ButtonBuilder()
.setCustomId("sikayet_buton")
.setLabel("Şikayet Et")
.setStyle(ButtonStyle.Danger)
)
]
});

});

client.on(Events.InteractionCreate, async interaction => {

if(interaction.isButton()){

if(interaction.customId !== "sikayet_buton") return;

const modal = new ModalBuilder()
.setCustomId("sikayet_modal")
.setTitle("Şikayet Formu");

const kisi = new TextInputBuilder()
.setCustomId("kisi")
.setLabel("Şikayet Ettiğin Kişi")
.setStyle(TextInputStyle.Short)
.setRequired(true);

const sebep = new TextInputBuilder()
.setCustomId("sebep")
.setLabel("Şikayet Sebebi")
.setStyle(TextInputStyle.Paragraph)
.setRequired(true);

const kanit = new TextInputBuilder()
.setCustomId("kanit")
.setLabel("Kanıt (Link veya açıklama)")
.setStyle(TextInputStyle.Short)
.setRequired(true);

const extra = new TextInputBuilder()
.setCustomId("extra")
.setLabel("Extra Bilgi")
.setStyle(TextInputStyle.Paragraph)
.setRequired(false);

modal.addComponents(
new ActionRowBuilder().addComponents(kisi),
new ActionRowBuilder().addComponents(sebep),
new ActionRowBuilder().addComponents(kanit),
new ActionRowBuilder().addComponents(extra)
);

await interaction.showModal(modal);

}

if(interaction.isModalSubmit()){

if(interaction.customId !== "sikayet_modal") return;

const kisi = interaction.fields.getTextInputValue("kisi");
const sebep = interaction.fields.getTextInputValue("sebep");
const kanit = interaction.fields.getTextInputValue("kanit");
const extra = interaction.fields.getTextInputValue("extra") || "Yok";

const log = await client.channels.fetch(config.SIKAYET_LOG).catch(()=>{});
if(!log) return;

await log.send({
content:
`<@&${config.BOSS_ROLE}> **Yeni Şikayet Geldi!**

Şikayet Eden: ${interaction.user}

Şikayet Edilen: ${kisi}

Sebep: ${sebep}

Kanıt: ${kanit}

Extra: ${extra}`
});

await interaction.reply({
content:"Şikayetiniz Boss/OG'ye iletildi.",
ephemeral:true
});

}

});

};