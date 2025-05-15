module.exports = {
    name: 'time',
    description: '🕒 Affiche l\'heure et la date actuelles.',
    execute: async (message, args) => {
        // Récupérer l'heure et la date actuelles
        const now = new Date();
        const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const formattedDate = now.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });

        // Afficher l'heure et la date dans un encadré ASCII
        await message.channel.send(
            `┌──────────────────────────────┐
│ ⏰ **Heure actuelle**            │
├──────────────────────────────┤
│ 📅 Date : ${formattedDate}     │
│ 🕒 Heure : ${formattedTime}     │
└──────────────────────────────┘`
        );
    },
};
