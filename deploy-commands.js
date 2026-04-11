const { REST, Routes } = require("discord.js");

const moderasyon = require("./moderasyon.js");
const temizleme = require("./temizleme.js");

const commands = [];

// moderasyon
for (const cmd of moderasyon) {
  commands.push(cmd.data.toJSON());
}

// temizleme (array veya tek)
if (Array.isArray(temizleme)) {
  for (const cmd of temizleme) {
    commands.push(cmd.data.toJSON());
  }
} else {
  commands.push(temizleme.data.toJSON());
}

// ENV TOKEN CHECK
const token = process.env.BOT_TOKEN;
const clientId = process.env.BOT_ID;
const guildId = process.env.SUNUCU_ID;

if (!token) {
  console.error("❌ BOT_TOKEN yok (Railway ENV)");
  process.exit(1);
}

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log("🚀 Deploy başlıyor...");

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log("✅ Slash komutlar yüklendi");
  } catch (err) {
    console.error("❌ DEPLOY HATA:", err);
  }
})();
