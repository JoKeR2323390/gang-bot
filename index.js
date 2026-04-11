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

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers
  ]
});

// ENV CONFIG
const config = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  BOT_ID: process.env.BOT_ID,
  SUNUCU_ID: process.env.SUNUCU_ID,
  MOD_LOG_CHANNEL: process.env.MOD_LOG_CHANNEL,
  BASVURU_CHANNEL: process.env.BASVURU_CHANNEL,
  BASVURU_LOG: process.env.BASVURU_LOG,
  SIKAYET_CHANNEL: process.env.SIKAYET_CHANNEL,
  SIKAYET_LOG: process.env.SIKAYET_LOG,
  BOSS_ROLE: process.env.BOSS_ROLE,
  OG_ROLE: process.env.OG_ROLE
};

client.commands = new Collection();

const moderasyon = require("./moderasyon.js");
const temizleme = require("./temizleme.js");

require("./deploy-commands.js");

// COMMAND LOAD
for (const cmd of moderasyon) {
  client.commands.set(cmd.data.name, cmd);
}
client.commands.set(temizleme.data.name, temizleme);

// READY
client.once(Events.ClientReady, async () => {
  console.log(`${client.user.tag} aktif!`);

  const basvuru = await client.channels.fetch(config.BASVURU_CHANNEL).catch(()=>null);
  if (basvuru) {
    await basvuru.send({
      content: "777 Family Başvuru Sistemi",
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("basvuru")
            .setLabel("Başvuru Yap")
            .setStyle(ButtonStyle.Primary)
        )
      ]
    });
  }

  const sikayet = await client.channels.fetch(config.SIKAYET_CHANNEL).catch(()=>null);
  if (sikayet) {
    await sikayet.send({
      content: "777 Family Şikayet Sistemi",
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("sikayet")
            .setLabel("Şikayet Et")
            .setStyle(ButtonStyle.Danger)
        )
      ]
    });
  }

  client.user.setPresence({
    activities: [{ name: "777 Family", type: 0 }],
    status: "online"
  });
});

// INTERACTIONS
client.on(Events.InteractionCreate, async interaction => {
  try {

    // COMMANDS
    if (interaction.isChatInputCommand()) {
      const cmd = client.commands.get(interaction.commandName);
      if (!cmd) return;
      return await cmd.execute(interaction, config, client);
    }

    // BUTTONS
    if (interaction.isButton()) {

      if (interaction.customId === "basvuru") {
        const modal = new ModalBuilder()
          .setCustomId("basvuruModal")
          .setTitle("777 Family Başvuru");

        modal.addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId("soru1").setLabel("Aktiflik").setStyle(TextInputStyle.Short)
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

    // MODALS
    if (interaction.isModalSubmit()) {

      if (interaction.customId === "basvuruModal") {
        const log = await client.channels.fetch(config.BASVURU_LOG).catch(()=>null);
        if (!log) return;

        await log.send(
`📋 777 FAMILY BAŞVURU
👤 ${interaction.user.tag}
1️⃣ ${interaction.fields.getTextInputValue("soru1")}
2️⃣ ${interaction.fields.getTextInputValue("soru2")}
3️⃣ ${interaction.fields.getTextInputValue("soru3")}
4️⃣ ${interaction.fields.getTextInputValue("soru4")}
5️⃣ ${interaction.fields.getTextInputValue("soru5")}`
        );

        return interaction.reply({ content: "Başvuru gönderildi", ephemeral: true });
      }

      if (interaction.customId === "sikayetModal") {
        const log = await client.channels.fetch(config.SIKAYET_LOG).catch(()=>null);
        if (!log) return;

        await log.send(
`🚨 777 FAMILY ŞİKAYET
👤 ${interaction.user.tag}
🎯 ${interaction.fields.getTextInputValue("kisi")}
📄 ${interaction.fields.getTextInputValue("sebep")}
📎 ${interaction.fields.getTextInputValue("kanit") || "Yok"}
➕ ${interaction.fields.getTextInputValue("extra") || "Yok"}`
        );

        return interaction.reply({ content: "Şikayet gönderildi", ephemeral: true });
      }

    }

  } catch (err) {
    console.error("HATA:", err);
  }
});

// LOGIN
if (!config.BOT_TOKEN) {
  console.error("❌ BOT_TOKEN yok");
  process.exit(1);
}

client.login(config.BOT_TOKEN);
