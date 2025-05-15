const { loadAuthorizedUsers } = require('../utils/authorizeUtils');

module.exports = {
    name: 'unban',
    description: '🔓 Réintègre un utilisateur précédemment banni.',
    execute: async (message, args) => {
        // Charger la liste des utilisateurs autorisés
        let authorizedUsers;
        try {
            authorizedUsers = loadAuthorizedUsers();
        } catch (error) {
            console.error('❌ Erreur lors du chargement des utilisateurs autorisés:', error);
            return message.channel.send("⚠️ **Erreur :** Impossible de charger la liste des utilisateurs autorisés.");
        }

        // Vérifier si l'utilisateur exécutant la commande est autorisé
        if (!authorizedUsers.has(message.author.id)) {
            return message.channel.send("🚫 **Accès refusé :** Vous n'êtes pas autorisé à utiliser cette commande.");
        }

        // Vérifier si l'utilisateur a la permission de débannir
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.channel.send("⛔ **Erreur :** Vous n'avez pas la permission de débannir des utilisateurs.");
        }

        // Vérifier si un ID est fourni
        const userId = args[0];
        if (!userId) {
            return message.channel.send(
                `📌 **Utilisation incorrecte :**\n` +
                `📝 **Syntaxe :** \`!unban <userID>\`\n` +
                `🔹 **Exemple :** \`!unban 123456789012345678\``
            );
        }

        // Tenter de débannir l'utilisateur
        try {
            await message.guild.members.unban(userId);
            await message.channel.send(
                `┌──────────────────────────────┐\n` +
                `│ 🔓 **Utilisateur Débanni**    │\n` +
                `├──────────────────────────────┤\n` +
                `│ 👤 ID : **${userId}**         │\n` +
                `│ ✅ Réintégré sur le serveur  │\n` +
                `└──────────────────────────────┘`
            );
        } catch (error) {
            console.error(`❌ Erreur lors du débannissement de ${userId}:`, error);
            await message.channel.send(
                `🚨 **Erreur :** Impossible de débannir l'utilisateur avec l'ID \`${userId}\`.\n` +
                "🔍 **Vérifiez si l'ID est correct et si l'utilisateur est bien banni.**"
            );
        }
    }
};
