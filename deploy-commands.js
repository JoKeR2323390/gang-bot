const { REST, Routes } = require("discord.js");
const config = require("./config.json");

const moderasyon = require("./moderasyon.js");
const temizleme = require("./temizleme.js");

const commands = [];

// moderasyon (array)
for (const cmd of moderasyon) {
  commands.push(cmd.data.toJSON());
}

// temizleme (tek komut veya array)
if (Array.isArray(temizleme)) {
  for (const cmd of temizleme) {
    commands.push(cmd.data.toJSON());
  }
} else {
  commands.push(temizleme.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(config.BOT_TOKEN);

(async () => {
  try {
    console.log("🚀 Slash komutlar yükleniyor...");

    await rest.put(
      Routes.applicationGuildCommands(
        config.BOT_ID,
        config.SUNUCU_ID
      ),
      { body: commands }
    );

    console.log("✅ KOMUTLAR YÜKLENDİ");
  } catch (err) {
    console.error("❌ DEPLOY HATA:", err);
  }
})();
