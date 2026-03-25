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

// ---------------------
// CONFIG JSON YERİNE ENVIRONMENT VARIABLES
// ---------------------
const config = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  BOT_ID: process.env.BOT_ID,
  SUNUCU_ID: process.env.SUNUCU_ID,
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

// ---------------------
// KOMUT YÜKLE
// ---------------------
for (const cmd of moderasyon.data) {
  client.commands.set(cmd.name, cmd);
}
client.commands.set(temizleme.data.name, temizleme);

// ---------------------
// BOT READY EVENT
// ---------------------
client.once(Events.ClientReady, async () => {
  console.log(`${client.user.tag} aktif!`);

  // 📌 MÜLAKAT MESAJI
  const basvuruChannel = client.channels.cache.get(config.BASVURU_CHANNEL);
  if (basvuruChannel) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("basvuru")
        .setLabel("Başvuru Yap")
        .setStyle(ButtonStyle.Primary)
    );

    basvuruChannel.send({
      content: `:wave: Ballas Gange Hoş Geldin!\nMülakata Başvurmak için aşağıdaki butona tıklayın.\n@everyone`,
      components: [row]
    });
  }

  // 📌 ŞİKAYET MESAJI
  const sikayetChannel = client.channels.cache.get(config.SIKAYET_CHANNEL);
  if (sikayetChannel) {
    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("sikayet")
        .setLabel("Şikayet Et")
        .setStyle(ButtonStyle.Danger)
    );

    sikayetChannel.send({
      content: `@everyone\nŞikayetiniz Varsa Aşağıdaki Butona Tıklayın ve Şikayetinizi Yazın.\nBoss/OG Şikayetinizle En Kısa Sürede İlgilenecektir.`,
      components: [row2]
    });
  }
});

// ---------------------
// INTERACTION CREATE
// ---------------------
client.on(Events.InteractionCreate, async interaction => {

  // KOMUTLAR
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction, client);
    } catch (err) {
      console.error(err);
      interaction.reply({ content: "Hata oluştu", ephemeral: true });
    }
  }

  // BUTONLAR
  if (interaction.isButton()) {
    if (interaction.customId === "basvuru") {
      const modal = new ModalBuilder()
        .setCustomId("basvuruModal")
        .setTitle("Ballas Başvuru");

      modal.addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("soru1")
            .setLabel("OCC İsim ve Fivem Saatin")
            .setStyle(TextInputStyle.Short)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("soru2")
            .setLabel("Aimine Kaç Puan verirsin")
            .setStyle(TextInputStyle.Short)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("soru3")
            .setLabel("Harita Bilgin Var mı")
            .setStyle(TextInputStyle.Short)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("soru4")
            .setLabel("Kuralları Kabul Ediyor musun")
            .setStyle(TextInputStyle.Short)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("soru5")
            .setLabel("CK kabul ediyor musun")
            .setStyle(TextInputStyle.Short)
        )
      );

      await interaction.showModal(modal);
    }

    if (interaction.customId === "sikayet") {
      const modal = new ModalBuilder()
        .setCustomId("sikayetModal")
        .setTitle("Şikayet Formu");

      modal.addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("kisi")
            .setLabel("Şikayet edilen kişi")
            .setStyle(TextInputStyle.Short)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("sebep")
            .setLabel("Sebep")
            .setStyle(TextInputStyle.Short)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("kanit")
            .setLabel("Kanıt")
            .setStyle(TextInputStyle.Paragraph)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("extra")
            .setLabel("Extra")
            .setStyle(TextInputStyle.Short)
        )
      );

      await interaction.showModal(modal);
    }
  }

  // MODAL SUBMIT
  if (interaction.isModalSubmit()) {
    // BAŞVURU
    if (interaction.customId === "basvuruModal") {
      const log = client.channels.cache.get(config.BASVURU_LOG);
      const mesaj = `
👤 ${interaction.user}

1️⃣ OCC: ${interaction.fields.getTextInputValue("soru1")}
2️⃣ Aim: ${interaction.fields.getTextInputValue("soru2")}
3️⃣ Harita: ${interaction.fields.getTextInputValue("soru3")}
4️⃣ Kurallar: ${interaction.fields.getTextInputValue("soru4")}
5️⃣ CK: ${interaction.fields.getTextInputValue("soru5")}

<@&${config.ALIM_GOREVLI_ROLE}>
`;
      log.send(mesaj);
      interaction.reply({ content: "Başvuru gönderildi", ephemeral: true });
    }

    // ŞİKAYET
    if (interaction.customId === "sikayetModal") {
      const log = client.channels.cache.get(config.SIKAYET_LOG);
      const mesaj = `
🚨 ${interaction.user}

👤 Kişi: ${interaction.fields.getTextInputValue("kisi")}
📄 Sebep: ${interaction.fields.getTextInputValue("sebep")}
📎 Kanıt: ${interaction.fields.getTextInputValue("kanit")}
➕ Extra: ${interaction.fields.getTextInputValue("extra")}

<@&${config.BOSS_ROLE}> <@&${config.OG_ROLE}>
`;
      log.send(mesaj);
      interaction.reply({ content: "Şikayet gönderildi", ephemeral: true });
    }
  }
});

// ---------------------
// BOT LOGIN
// ---------------------
client.login(config.BOT_TOKEN);