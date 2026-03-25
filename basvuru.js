const { 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle, 
    Events 
} = require('discord.js');

module.exports = (client, config) => {

    client.once(Events.ClientReady, async () => {
        console.log('Bot hazır! 5 soruluk başvuru sistemi aktif.');

        const kanal = await client.channels.fetch(config.BASVURU_CHANNEL);
        if (!kanal) return console.log("Mülakat kanalı bulunamadı!");

        await kanal.send({
            content: "**:wave: Gange Hoş Geldin!**\n**Mülakata Başvurmak için aşağıdaki butona tıklayın.**\n||@everyone||",
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('basvur_button')
                        .setLabel('Başvur')
                        .setStyle(ButtonStyle.Primary)
                )
            ]
        });
    });

    client.on(Events.InteractionCreate, async interaction => {
        try {
            // --- Butona basıldığında modal göster ---
            if (interaction.isButton() && interaction.customId === 'basvur_button') {

                const modal = new ModalBuilder()
                    .setCustomId(`basvuru_modal_${interaction.user.id}`)
                    .setTitle('Mülakat Başvuru Formu - 5 Soru');

                const inputs = [
                    { id: 'aim', label: 'Aimine 10 üzerinden kaç verirsin' },
                    { id: 'terimler', label: 'Fivem Terimlerini Biliyor musun' },
                    { id: 'ck', label: 'Çeteden Çıkınca CK yemeyi kabul ediyormusun' },
                    { id: 'kurallar', label: 'Kurallar ve hiyerarşiyi kabul ediyor musun' },
                    { id: 'fivem', label: 'Fivem saatin kaç' }
                ];

                for (const i of inputs) {
                    const input = new TextInputBuilder()
                        .setCustomId(i.id)
                        .setLabel(i.label)
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true);

                    modal.addComponents(new ActionRowBuilder().addComponents(input));
                }

                await interaction.showModal(modal);
            }

            // --- Modal gönderildiğinde ---
            if (interaction.isModalSubmit() && interaction.customId.startsWith('basvuru_modal_')) {
                const fields = interaction.fields;

                const mesaj = `**Yeni Mülakat Başvurusu**\n**Kullanıcı:** ${interaction.user.tag}\n\n` +
                    `1️⃣ Aimine 10 üzerinden: ${fields.getTextInputValue('aim')}\n` +
                    `2️⃣ Fivem Terimleri: ${fields.getTextInputValue('terimler')}\n` +
                    `3️⃣ CK kabulü: ${fields.getTextInputValue('ck')}\n` +
                    `4️⃣ Kurallar & Hiyerarşi: ${fields.getTextInputValue('kurallar')}\n` +
                    `5️⃣ Fivem Saat: ${fields.getTextInputValue('fivem')}`;

                const logKanal = await client.channels.fetch(config.BASVURU_LOG);
                if (!logKanal) return console.log("Başvuru log kanalı bulunamadı!");

                // @Alım-Görevlisi rolünü etiketle
                await logKanal.send({ content: `<@&${config.ALIM_GOREVLI_ROLE}> Yeni Mülakat Başvurusu!\n\n${mesaj}` });

                await interaction.reply({ content: 'Başvurunuz tamamlandı! Alım görevlisi sizinle ilgilenecek.', ephemeral: true });
            }
        } catch (error) {
            console.error('Basvuru Hatası:', error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'Bir hata oluştu.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Bir hata oluştu.', ephemeral: true });
            }
        }
    });
};