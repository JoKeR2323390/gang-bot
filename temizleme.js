const { SlashCommandBuilder } = require("discord.js");

const data = new SlashCommandBuilder()
.setName("temizle")
.setDescription("Mesaj siler")
.addIntegerOption(o =>
o.setName("miktar")
.setDescription("Kaç mesaj silinecek")
.setRequired(true)
);

async function execute(interaction){

const miktar = interaction.options.getInteger("miktar");

await interaction.channel.bulkDelete(miktar, true);

await interaction.reply({
content: `${miktar} mesaj silindi`,
ephemeral: true
});
}

module.exports = { data, execute };