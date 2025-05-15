module.exports = {
    name: 'ping',
    description: '📡 Affiche la latence du bot et de l\'API Discord.',
    execute: async (message, args) => {
        const apiPing = message.client.ws.ping;

        // Calcul plus précis du ping du bot
        const msg = await message.channel.send("⏳ Calcul en cours...");
        const botPing = msg.createdTimestamp - message.createdTimestamp;

        const response = `
┌───────────────────────────┐
│ 📡 **PING STATUS**         │
├───────────────────────────┤
│ 🤖 **Bot Ping**  : ${botPing}ms  
│ 🌐 **API Discord** : ${apiPing}ms  
│ 🏓 **Latence totale** : ~${botPing + apiPing}ms  
└───────────────────────────┘`;

        await msg.edit(response);
    },
};
