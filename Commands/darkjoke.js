const fetch = require('node-fetch');

module.exports = {
    name: 'darkjoke',
    description: '💀 Affiche une blague sombre au hasard.',
    execute: async (message, args) => {
        try {
            const jokeResponse = await fetch('https://v2.jokeapi.dev/joke/Dark');
            const jokeData = await jokeResponse.json();

            let jokeText;
            if (jokeData.type === "single") {
                jokeText = jokeData.joke;
            } else if (jokeData.type === "twopart") {
                jokeText = `${jokeData.setup}\n${jokeData.delivery}`;
            } else {
                return message.channel.send('⚠️ **Erreur:** Aucune blague sombre trouvée.');
            }

            // Message stylisé
            const response = `

┌───────────────────────────────┐
│ 💀 DARK JOKE DU JOUR  
├───────────────────────────────┤
│ 🃏 ${jokeText}  
├───────────────────────────────┤
│ 🌍 Source : jokeapi.dev  
└───────────────────────────────┘
            `;

            await message.channel.send(response);

        } catch (error) {
            console.error('❌ Erreur lors de la récupération de la blague:', error);
            await message.channel.send('🚨 **Erreur:** Impossible de récupérer une blague.');
        }
    },
};
