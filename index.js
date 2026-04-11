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
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();

const moderasyon = require("./moderasyon.js");
const temizleme = require("./temizleme.js");

// ❗ DEPLOY KALDIRILDI (EN ÖNEMLİ FIX)
// require("./deploy-commands.js"); ❌

// KOMUT YÜKLE
for (const cmd of moderasyon) {
  client.commands.set(cmd.data.name, cmd);
}
client.commands.set(temizleme.data.name, temizleme);

// READY
client.once(Events.ClientReady, async () => {
  console.log(`${client.user.tag} aktif!`);

  // BAŞVURU
  const basvuruChannel = await client.channels.fetch(config.BASVURU_CHANNEL);
  if (basvuruChannel) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("basvuru")
        .setLabel("Başvuru Yap")
        .setStyle(ButtonStyle.Primary)
    );

    await basvuruChannel.send({
      content: "📢 777 FAMILY BAŞVURU @everyone",
      components: [row]
    });
  }

  // ŞİKAYET
  const sikayetChannel = await client.channels.fetch(config.SIKAYET_CHANNEL);
  if (sikayetChannel) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("sikayet")
        .setLabel("Şikayet Et")
        .setStyle(ButtonStyle.Danger)
    );

    await sikayetChannel.send({
      content: "🚨 777 FAMILY ŞİKAYET @everyone",
      components: [row]
    });
  }

  client.user.setPresence({
    activities: [{ name: "777 FAMILY", type: 0 }],
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
      await command.execute(interaction, config, client);
    } catch (err) {
      console.error(err);
      return interaction.reply({ content: "Hata oluştu", ephemeral: true });
    }
  }

  // BUTON
  if (interaction.isButton()) {

    // BAŞVURU
    if (interaction.customId === "basvuru") {
      const modal = new ModalBuilder()
        .setCustomId("basvuruModal")
        .setTitle("777 Family Başvuru");

      modal.addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder().setCustomId("soru1").setLabel("Aktiflik Süren").setStyle(TextInputStyle.Short)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder().setCustomId("soru2").setLabel("Aim 10/?").setStyle(TextInputStyle.Short)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder().setCustomId("soru3").setLabel("Harita Bilgin").setStyle(TextInputStyle.Short)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder().setCustomId("soru4").setLabel("Kuralları kabul ediyor musun").setStyle(TextInputStyle.Short)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder().setCustomId("soru5").setLabel("CK kabul ediyor musun").setStyle(TextInputStyle.Short)
        )
      );

      return interaction.showModal(modal);
    }

    // ŞİKAYET
    if (interaction.customId === "sikayet") {
      const modal = new ModalBuilder()
        .setCustomId("sikayetModal")
        .setTitle("777 Family Şikayet");

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

    // BAŞVURU LOG
    if (interaction.customId === "basvuruModal") {
      const log = await client.channels.fetch(config.BASVURU_LOG);

      await log.send(
`📋 777 FAMILY BAŞVURU @everyone

👤 Kullanıcı: ${interaction.user.tag}
1️⃣ Aktiflik: ${interaction.fields.getTextInputValue("soru1")}
2️⃣ Aim: ${interaction.fields.getTextInputValue("soru2")}
3️⃣ Harita: ${interaction.fields.getTextInputValue("soru3")}
4️⃣ Kurallar: ${interaction.fields.getTextInputValue("soru4")}
5️⃣ CK: ${interaction.fields.getTextInputValue("soru5")}

<@&${config.ALIM_GOREVLI_ROLE}>`
      );

      return interaction.reply({ content: "✅ Başvurun gönderildi!", ephemeral: true });
    }

    // ŞİKAYET LOG
    if (interaction.customId === "sikayetModal") {
      const log = await client.channels.fetch(config.SIKAYET_LOG);

      await log.send(
`🚨 777 FAMILY ŞİKAYET @everyone

👤 Şikayet Eden: ${interaction.user.tag}
🎯 Kişi: ${interaction.fields.getTextInputValue("kisi")}
📄 Sebep: ${interaction.fields.getTextInputValue("sebep")}
📎 Kanıt: ${interaction.fields.getTextInputValue("kanit")}
➕ Extra: ${interaction.fields.getTextInputValue("extra")}

<@&${config.BOSS_ROLE}> <@&${config.OG_ROLE}>`
      );

      return interaction.reply({ content: "✅ Şikayet gönderildi!", ephemeral: true });
    }
  }
});

// TOKEN
if (!config.BOT_TOKEN) {
  console.error("❌ TOKEN YOK");
  process.exit(1);
}

client.login(config.BOT_TOKEN);
