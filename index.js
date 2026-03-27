const {
  Client,
  GatewayIntentBits,
  Collection,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  Events
} = require("discord.js");

// CONFIG
const config = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  MOD_LOG_CHANNEL: process.env.MOD_LOG_CHANNEL,
  BASVURU_CHANNEL: process.env.BASVURU_CHANNEL,
  BASVURU_LOG: process.env.BASVURU_LOG,
  ALIM_GOREVLI_ROLE: process.env.ALIM_GOREVLI_ROLE,
  SIKAYET_CHANNEL: process.env.SIKAYET_CHANNEL,
  SIKAYET_LOG: process.env.SIKAYET_LOG,
  BOSS_ROLE: process.env.BOSS_ROLE,
  OG_ROLE: process.env.OG_ROLE
};

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();

const moderasyon = require("./moderasyon.js");
const temizleme = require("./temizleme.js");

// ✅ ARRAY DESTEKLİ KOMUT YÜKLEME
for (const cmd of moderasyon) {
  client.commands.set(cmd.data.name, cmd);
}
client.commands.set(temizleme.data.name, temizleme);

// READY
client.once(Events.ClientReady, async () => {
  console.log(`${client.user.tag} aktif!`);

  try {
    const basvuruChannel = await client.channels.fetch(config.BASVURU_CHANNEL);
    if (basvuruChannel) {
      const messages = await basvuruChannel.messages.fetch({ limit: 10 });
      if (!messages.find(m => m.author.id === client.user.id)) {
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId("basvuru").setLabel("Başvuru Yap").setStyle(ButtonStyle.Primary)
        );

        await basvuruChannel.send({
          content: `:wave: Ballas Gange Hoş Geldin!\nBaşvuru için butona bas @everyone.`,
          components: [row]
        });
      }
    }

    const sikayetChannel = await client.channels.fetch(config.SIKAYET_CHANNEL);
    if (sikayetChannel) {
      const messages = await sikayetChannel.messages.fetch({ limit: 10 });
      if (!messages.find(m => m.author.id === client.user.id)) {
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId("sikayet").setLabel("Şikayet Et").setStyle(ButtonStyle.Danger)
        );

        await sikayetChannel.send({
          content: `Şikayetiniz varsa butona basın @everyone.`,
          components: [row]
        });
      }
    }

  } catch (err) {
    console.error("READY HATA:", err);
  }
});

// INTERACTION
client.on(Events.InteractionCreate, async interaction => {

  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction, config, client);
    } catch (err) {
      console.error(err);
      return interaction.reply({ content: "Hata oluştu", ephemeral: true });
    }
  }

  if (interaction.isButton()) {
    try {
      if (interaction.customId === "basvuru") {
        const modal = new ModalBuilder()
          .setCustomId("basvuruModal")
          .setTitle("Başvuru");

        modal.addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId("soru1").setLabel("Aktiflik Süren").setStyle(TextInputStyle.Short)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId("soru2").setLabel("Aim 10/?").setStyle(TextInputStyle.Short)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId("soru3").setLabel("Harita Bilgin").setStyle(TextInputStyle.Short)
          )
        );

        return interaction.showModal(modal);
      }

      if (interaction.customId === "sikayet") {
        const modal = new ModalBuilder()
          .setCustomId("sikayetModal")
          .setTitle("Şikayet");

        modal.addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId("kisi").setLabel("Kişi").setStyle(TextInputStyle.Short)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId("sebep").setLabel("Sebep").setStyle(TextInputStyle.Short)
          )
        );

        return interaction.showModal(modal);
      }

    } catch (err) {
      console.error("BUTON HATA:", err);
    }
  }

  if (interaction.isModalSubmit()) {

    if (interaction.customId === "basvuruModal") {
      const log = await client.channels.fetch(config.BASVURU_LOG);

      await log.send(`📋 Yeni Başvuru\n👤 ${interaction.user.tag}\nSaat: ${interaction.fields.getTextInputValue("soru1")}`);

      return interaction.reply({ content: "Başvuru gönderildi", ephemeral: true });
    }

    if (interaction.customId === "sikayetModal") {
      const log = await client.channels.fetch(config.SIKAYET_LOG);

      await log.send(`🚨 Şikayet\n👤 ${interaction.user.tag}\nKişi: ${interaction.fields.getTextInputValue("kisi")}`);

      return interaction.reply({ content: "Şikayet gönderildi", ephemeral: true });
    }

  }

});

// TOKEN
client.login(config.BOT_TOKEN);
