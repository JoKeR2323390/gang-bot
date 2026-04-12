const { REST, Routes } = require("discord.js");

// ENV KONTROL
const config = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  BOT_ID: process.env.BOT_ID,
  SUNUCU_ID: process.env.SUNUCU_ID
};

// ❗ KONTROL EKLEDİM (çok önemli)
if (!config.BOT_TOKEN || !config.BOT_ID || !config.SUNUCU_ID) {
  console.error("❌ ENV HATALI!");
  console.log("BOT_TOKEN:", config.BOT_TOKEN ? "VAR" : "YOK");
  console.log("BOT_ID:", config.BOT_ID ? "VAR" : "YOK");
  console.log("SUNUCU_ID:", config.SUNUCU_ID ? "VAR" : "YOK");
  process.exit(1);
}

const moderasyon = require("./moderasyon.js");
const temizleme = require("./temizleme.js");

const commands = [];

// MODERASYON (ARRAY)
for (const cmd of moderasyon) {
  commands.push(cmd.data.toJSON());
}

// TEMİZLEME
if (temizleme && temizleme.data) {
  commands.push(temizleme.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(config.BOT_TOKEN);

(async () => {
  try {
    console.log("🚀 Slash komutlar yükleniyor...");
    console.log("Toplam komut:", commands.length);

    await rest.put(
      Routes.applicationGuildCommands(
        config.BOT_ID,
        config.SUNUCU_ID
      ),
      { body: commands }
    );

    console.log("✅ KOMUTLAR BAŞARIYLA YÜKLENDİ");
  } catch (error) {
    console.error("❌ DEPLOY HATA:", error);
  }
})();
