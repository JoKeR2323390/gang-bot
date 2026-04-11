const { REST, Routes } = require("discord.js");

const config = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  BOT_ID: process.env.BOT_ID,
  SUNUCU_ID: process.env.SUNUCU_ID
};

const moderasyon = require("./moderasyon.js");
const temizleme = require("./temizleme.js");

const commands = [];

for (const cmd of moderasyon) {
  commands.push(cmd.data.toJSON());
}

commands.push(temizleme.data.toJSON());

const rest = new REST({ version: "10" }).setToken(config.BOT_TOKEN);

(async () => {
  try {
    console.log("🚀 Slash yükleniyor...");

    await rest.put(
      Routes.applicationGuildCommands(
        config.BOT_ID,
        config.SUNUCU_ID
      ),
      { body: commands }
    );

    console.log("✅ KOMUTLAR YÜKLENDİ");
  } catch (e) {
    console.error("DEPLOY HATA:", e);
  }
})();
