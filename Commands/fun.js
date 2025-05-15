const fetch = require('node-fetch');

module.exports = {
    name: 'fun',
    description: '🤣 Obtiens une blague aléatoire.',
    execute: async (message, args) => {
        try {
            const jokeResponse = await fetch('https://official-joke-api.appspot.com/jokes/random');
            const jokeData = await jokeResponse.json();

            if (jokeData.setup && jokeData.punchline) {
                const jokeText = 
`┌───────────────────────────────┐
│ 🎭 BLAGUE DU JOUR  
├───────────────────────────────┤
│ 🤣 ${jokeData.setup}  
│ 🤔 ${jokeData.punchline}  
└───────────────────────────────┘`;

                await message.channel.send(jokeText);
            } else {
                await message.channel.send("⚠️ **Erreur:** Impossible de récupérer une blague.");
            }
        } catch (error) {
            console.error("❌ Erreur lors de la récupération de la blague :", error);
            await message.channel.send("🚨 **Erreur:** Impossible de récupérer une blague.");
        }
    },
};
