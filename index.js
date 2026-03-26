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

// ✅ DOĞRU KOMUT YÜKLEME
for (const cmd of moderasyon) {
  client.commands.set(cmd.data.name, cmd);
}
client.commands.set(temizleme.data.name, temizleme);

// READY
client.once(Events.ClientReady, async () => {
  console.log(`${client.user.tag} aktif!`);

  // BAŞVURU MESAJI
  const basvuruChannel = client.channels.cache.get(config.BASVURU_CHANNEL);
  if (basvuruChannel) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("basvuru")
        .setLabel("Başvuru Yap")
        .setStyle(ButtonStyle.Primary)
    );

    basvuruChannel.send({
      content: `:wave: Ballas Gange Hoş Geldin!\nBaşvuru için butona bas @everyone.`,
      components: [row]
    });
  }

  // ŞİKAYET MESAJI
  const sikayetChannel = client.channels.cache.get(config.SIKAYET_CHANNEL);
  if (sikayetChannel) {
    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("sikayet")
        .setLabel("Şikayet Et")
        .setStyle(ButtonStyle.Danger)
    );

    sikayetChannel.send({
      content: `Şikayetiniz Varsa Aşağıdaki Butona Tıklayın ve Şikayetinizi Yazın.
Boss/OG Şikayetinizle En Kısa Sürede İlgilenecektir @everyone.`,
      components: [row2]
    });
  }

  // STATUS
  client.user.setPresence({
    activities: [{ name: "Sunucunuzu koruyor!", type: 0 }],
    status: "online"
  });
});

// INTERACTION
client.on(Events.InteractionCreate, async interaction => {

  // KOMUT
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction, config, client); // ✅ FIX
    } catch (err) {
      console.error(err);
      interaction.reply({ content: "Hata oluştu", ephemeral: true });
    }
  }

  // BUTON
  if (interaction.isButton()) {

    if (interaction.customId === "basvuru") {
      const modal = new ModalBuilder()
        .setCustomId("basvuruModal")
        .setTitle("Başvuru");

      modal.addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder().setCustomId("soru1").setLabel("OCC + Saat").setStyle(TextInputStyle.Short)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder().setCustomId("soru2").setLabel("Aim").setStyle(TextInputStyle.Short)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder().setCustomId("soru3").setLabel("Harita").setStyle(TextInputStyle.Short)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder().setCustomId("soru4").setLabel("Kurallar").setStyle(TextInputStyle.Short)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder().setCustomId("soru5").setLabel("CK").setStyle(TextInputStyle.Short)
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
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder().setCustomId("kanit").setLabel("Kanıt").setStyle(TextInputStyle.Paragraph)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder().setCustomId("extra").setLabel("Extra").setStyle(TextInputStyle.Short)
        )
      );

      return interaction.showModal(modal);
    }
  }

  // MODAL
  if (interaction.isModalSubmit()) {

    if (interaction.customId === "basvuruModal") {
      const log = client.channels.cache.get(config.BASVURU_LOG);
      if (!log) return;

      log.send(`👤 ${interaction.user}\nBaşvuru geldi`);

      return interaction.reply({ content: "Başvuru gönderildi", ephemeral: true });
    }

    if (interaction.customId === "sikayetModal") {
      const log = client.channels.cache.get(config.SIKAYET_LOG);
      if (!log) return;

      log.send(`🚨 ${interaction.user}\nŞikayet geldi`);

      return interaction.reply({ content: "Şikayet gönderildi", ephemeral: true });
    }
  }
});

// TOKEN
if (!config.BOT_TOKEN) {
  console.error("❌ TOKEN YOK");
  process.exit(1);
}

client.login(config.BOT_TOKEN);
