const { 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    Events, 
    Collection 
} = require('discord.js');

module.exports = (client) => {

    // 1vs1 düellolarını takip edecek koleksiyon
    client.duels = new Collection();

    client.on(Events.InteractionCreate, async interaction => {

        // Slash komutu /1vs1
        if (interaction.isChatInputCommand() && interaction.commandName === '1vs1') {

            const opponent = interaction.options.getUser('oyuncu');
            if (!opponent) return interaction.reply({ content: 'Rakip oyuncuyu etiketle!', ephemeral: true });
            if (opponent.id === interaction.user.id) return interaction.reply({ content: 'Kendinle düello başlatamazsın!', ephemeral: true });

            // Eğer başka düello devam ediyorsa engelle
            if (client.duels.has(interaction.user.id) || client.duels.has(opponent.id)) {
                return interaction.reply({ content: 'Bir oyuncu zaten düelloda!', ephemeral: true });
            }

            // Kabul / Red butonları
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`accept_${interaction.user.id}`)
                        .setLabel('Kabul')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId(`decline_${interaction.user.id}`)
                        .setLabel('Red')
                        .setStyle(ButtonStyle.Danger)
                );

            await interaction.reply({ content: `${opponent} sana düello daveti gönderdi! Kabul etmek için butona tıkla.`, components: [row] });

        }

        // Kabul veya Red butonları
        if (interaction.isButton()) {
            const [action, initiatorId] = interaction.customId.split('_');

            // Sadece daveti edilen oyuncu etkileşim yapabilir
            if (interaction.user.id === initiatorId) {
                return interaction.reply({ content: 'Bu düello senin için değil!', ephemeral: true });
            }

            const duelMessage = interaction.message;
            const challengerId = initiatorId;
            const opponentId = interaction.user.id;

            if (action === 'accept') {
                // Düello başlat
                client.duels.set(challengerId, {
                    challenger: { id: challengerId, hp: 500, energy: 150, yumrukCount: 0 },
                    opponent: { id: opponentId, hp: 500, energy: 150, yumrukCount: 0 },
                    turn: challengerId,
                    channel: interaction.channel
                });

                await duelMessage.edit({ content: 'Düello başladı!', components: [] });
                await interaction.reply({ content: 'Düello kabul edildi! Sıra başlangıç oyuncusunda.', ephemeral: true });
                sendTurnMessage(client, challengerId);

            } else if (action === 'decline') {
                await duelMessage.edit({ content: 'Düello reddedildi.', components: [] });
                await interaction.reply({ content: 'Düello reddedildi.', ephemeral: true });
            }
        }

        // Oyun komutları: yumruk, kalkan, şifa, ultra, pas, kaç
        if (interaction.isMessageComponent() || interaction.isChatInputCommand()) return;

        const msg = interaction.content?.toLowerCase();
        if (!msg) return;

        // Hangi düelloda olduğunu bul
        const duel = Array.from(client.duels.values()).find(d => 
            d.challenger.id === interaction.user.id || d.opponent.id === interaction.user.id
        );
        if (!duel) return;

        // Oyuncu sırası değilse geri dön
        if (duel.turn !== interaction.user.id) return;

        handleMove(client, duel, interaction);
    });

    // Tur mesajını atar
    async function sendTurnMessage(client, duel) {
        const currentPlayer = duel.turn === duel.challenger.id ? duel.challenger : duel.opponent;
        const otherPlayer = duel.turn === duel.challenger.id ? duel.opponent : duel.challenger;

        await duel.channel.send(`${currentPlayer.id}, sıra sende! \n${currentPlayer.id} Can: ${currentPlayer.hp}, Enerji: ${currentPlayer.energy}\n${otherPlayer.id} Can: ${otherPlayer.hp}, Enerji: ${otherPlayer.energy}`);
    }

    // Hamleleri işle
    async function handleMove(client, duel, interaction) {
        const input = interaction.content.toLowerCase();
        const currentPlayer = duel.turn === duel.challenger.id ? duel.challenger : duel.opponent;
        const otherPlayer = duel.turn === duel.challenger.id ? duel.opponent : duel.challenger;

        if (input === 'yumruk') {
            currentPlayer.yumrukCount++;
            let dmg = 0;
            const rand = Math.random();
            if (rand < 0.5) dmg = randomInt(15, 20);   // %50 15-20
            else if (rand < 0.9) dmg = randomInt(20, 40); // %40 20-40
            else dmg = randomInt(60, 70); // %10 60-70
            otherPlayer.hp -= dmg;
            await duel.channel.send(`<@${currentPlayer.id}> yumruk attı! ${dmg} hasar verdi. ${otherPlayer.id} Can: ${otherPlayer.hp}, Enerji: ${otherPlayer.energy}`);
        }

        else if (input === 'kalkan') {
            const success = Math.random() < 0.2; // %20 başarılı
            if (success) {
                otherPlayer.hp -= 0; // hasar düşürüldü
                currentPlayer.energy -= 30;
                await duel.channel.send(`<@${currentPlayer.id}> kalkan başarıyla aktif! Enerji: -30`);
            } else {
                await duel.channel.send(`<@${currentPlayer.id}> kalkan başarısız! Enerji: -30`);
                currentPlayer.energy -= 30;
            }
        }

        else if (input === 'şifa') {
            const success = Math.random() < 0.2; // %20 başarılı
            if (success) {
                const heal = randomInt(50, 80);
                currentPlayer.hp += heal;
                currentPlayer.energy -= 30;
                await duel.channel.send(`<@${currentPlayer.id}> şifa kullandı! Can: +${heal}, Enerji: -30`);
            } else {
                currentPlayer.energy -= 30;
                await duel.channel.send(`<@${currentPlayer.id}> şifa başarısız! Enerji: -30`);
            }
        }

        else if (input === 'ultra güç') {
            if (currentPlayer.yumrukCount < 5) return duel.channel.send(`<@${currentPlayer.id}> ultra güç için en az 5 yumruk atmalısın!`);
            const success = Math.random() < 0.1; // %10 başarılı
            if (success) {
                const dmg = randomInt(200, 220);
                otherPlayer.hp -= dmg;
                currentPlayer.energy -= 100;
                await duel.channel.send(`<@${currentPlayer.id}> ultra güç kullandı! Hasar: ${dmg}, Enerji: -100`);
            } else {
                currentPlayer.energy -= 100;
                await duel.channel.send(`<@${currentPlayer.id}> ultra güç başarısız! Enerji: -100`);
            }
        }

        else if (input === 'pas') {
            currentPlayer.energy += 25;
            await duel.channel.send(`<@${currentPlayer.id}> pas geçti! Enerji: +25`);
        }

        else if (input === 'kaç') {
            otherPlayer.hp = 0; // kaçan kaybetti
            await duel.channel.send(`<@${currentPlayer.id}> kaçtı! <@${otherPlayer.id}> kazandı!`);
            client.duels.delete(duel.challenger.id);
            client.duels.delete(duel.opponent.id);
            return;
        }

        // Kazanan varsa bitir
        if (duel.challenger.hp <= 0 || duel.opponent.hp <= 0) {
            const winner = duel.challenger.hp > 0 ? duel.challenger : duel.opponent;
            const loser = duel.challenger.hp <= 0 ? duel.challenger : duel.opponent;
            await duel.channel.send(`<@${winner.id}> kazandı! <@${loser.id}> kaybetti!`);
            client.duels.delete(duel.challenger.id);
            client.duels.delete(duel.opponent.id);
            return;
        }

        // Sıra değiştir
        duel.turn = duel.turn === duel.challenger.id ? duel.opponent.id : duel.challenger.id;
        sendTurnMessage(client, duel);
    }

    // Rastgele sayı
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};