const { REST, Routes } = require("discord.js");
const config = require("./config.json");

const moderasyon = require("./moderasyon.js");
const temizleme = require("./temizleme.js");

const commands = [];

// Moderasyon komutlarını ekle
for (const cmd of moderasyon.data) {
  commands.push(cmd.toJSON());
}

// Temizleme komutunu ekle
commands.push(temizleme.data.toJSON());

const rest = new REST({ version: "10" }).setToken(config.BOT_TOKEN);

(async () => {
  try {
    console.log("Yükleniyor...");

    await rest.put(
      Routes.applicationGuildCommands(
        config.BOT_ID,
        config.SUNUCU_ID
      ),
      { body: commands }
    );

    console.log("✅ KOMUTLAR YÜKLENDİ");
  } catch (error) {
    console.error(error);
  }
})();