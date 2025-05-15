module.exports = {
    name: "help",
    description: "Affiche la liste des commandes disponibles.",
    async execute(message, args) {
        const helpMessage = `
\`\`\`
╔════════════════════════════════════════════════╗
║ 📜  CRYT0S SELFBOT HELPER  |  V1.0  📜        ║
╠════════════════════════════════════════════════╣
║ 🛠️ UTILITAIRES                                 ║
║ ├── 🔔 ping - Vérifier la latence du bot       ║
║ ├── ⏳ time - Affiche l'heure actuelle         ║
║ ├── 🎭 pfp - Obtenir la PP de quelqu'un        ║
║ ├── 🤣 fun - Racontre une blague aléatoire     ║
║ ├── 🌑 darkjoke - Blague sombre aléatoire      ║
╠════════════════════════════════════════════════╣
║ ⚔️ MODÉRATION                                  ║
║ ├── 🔒 lock - Verrouiller un salon              ║
║ ├── 🔓 unlock - Déverrouiller un salon         ║
║ ├── 🔨 ban - Bannir un utilisateur             ║
║ ├── 🛑 unban - Débannir via ID/Tag             ║
║ ├── 👢 kick - Expulser un utilisateur          ║
║ ├── ⏲️ timeout - Mute temporaire               ║
║ ├── 🏗️ createchannel - Créer un salon          ║
║ ├── 🗑️ removechannel - Supprimer un salon      ║
║ ├── 🔑 auth - Autoriser quelqu'un              ║
║ ├── 🚫 unauth - Retirer l'accès                ║
║ ├── ➕ addr - Ajouter un rôle                  ║
║ ├── ➖ rmr - Retirer un rôle                   ║
║ ├── 🗑️ clearms - Supprimer un nombre de message║
╠════════════════════════════════════════════════╣
║ 🔎 OSINT (Cyber Investigation)                 ║
║ ├── 🆔 info - Informations sur un ID           ║
║ ├── 🌍 iplookup - Infos détaillées d'une IP    ║
║ ├── 🌍 id2token - Donne le debut du  token     ║
╚════════════════════════════════════════════════╝
\`\`\``;

        await message.channel.send(helpMessage);
    }
};
