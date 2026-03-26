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

    // BOT READY
    client.once(Events.ClientReady, async () => {
        console.log('Bot hazır! 5 soruluk başvuru sistemi aktif.');

        try {
            const kanal = await client.channels.fetch(config.BASVURU_CHANNEL);

            if (!kanal) {
                console.log("❌ Başvuru kanalı bulunamadı!");
                return;
            }

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

        } catch (err) {
            console.error("READY HATASI:", err);
        }
    });

    // INTERACTION
    client.on(Events.InteractionCreate, async interaction => {
        try {

            // BUTON
            if (interaction.isButton() && interaction.customId === 'basvur_button') {

                const modal = new ModalBuilder()
                    .setCustomId(`basvuru_modal_${interaction.user.id}`)
                    .setTitle('Mülakat Başvuru Formu - 5 Soru');

                const inputs = [
                    { id: 'aim', label: 'Aimine 10 üzerinden kaç verirsin' },
                    { id: 'terimler', label: 'Fivem Terimlerini Biliyor musun' },
                    { id: 'ck', label: 'Çeteden Çıkınca CK kabul ediyor musun' },
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

                return await interaction.showModal(modal);
            }

            // MODAL SUBMIT
            if (interaction.isModalSubmit() && interaction.customId.startsWith('basvuru_modal_')) {

                // DM kontrolü (çok önemli)
                if (!interaction.guild) {
                    return interaction.reply({ content: "Bu komut sadece sunucuda çalışır.", ephemeral: true });
                }

                const fields = interaction.fields;

                const mesaj = `**Yeni Mülakat Başvurusu**\n` +
                    `👤 Kullanıcı: ${interaction.user.tag}\n\n` +
                    `1️⃣ Aim: ${fields.getTextInputValue('aim')}\n` +
                    `2️⃣ Terimler: ${fields.getTextInputValue('terimler')}\n` +
                    `3️⃣ CK: ${fields.getTextInputValue('ck')}\n` +
                    `4️⃣ Kurallar: ${fields.getTextInputValue('kurallar')}\n` +
                    `5️⃣ Saat: ${fields.getTextInputValue('fivem')}`;

                const logKanal = await client.channels.fetch(config.BASVURU_LOG);

                // KRİTİK KONTROL (senin hatayı çözen yer)
                if (!logKanal) {
                    console.log("❌ Log kanalı bulunamadı!");
                    return interaction.reply({ content: "Log kanalı bulunamadı.", ephemeral: true });
                }

                await logKanal.send({
                    content: `<@&${config.ALIM_GOREVLI_ROLE}> Yeni Mülakat Başvurusu!\n\n${mesaj}`
                });

                await interaction.reply({
                    content: '✅ Başvurun gönderildi!',
                    ephemeral: true
                });
            }

        } catch (error) {
            console.error('❌ Basvuru Hatası:', error);

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'Bir hata oluştu.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Bir hata oluştu.', ephemeral: true });
            }
        }
    });
};
