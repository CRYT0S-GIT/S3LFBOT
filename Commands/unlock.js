const { loadAuthorizedUsers } = require('../utils/authorizeUtils');

module.exports = {
    name: 'unlock',
    description: '🔓 Déverrouille un canal pour permettre aux utilisateurs d\'envoyer des messages.',
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

        // Vérifier si l'utilisateur a la permission de gérer les salons
        if (!message.member.permissions.has('MANAGE_CHANNELS')) {
            return message.channel.send("⛔ **Erreur :** Vous n'avez pas la permission de déverrouiller ce canal.");
        }

        try {
            // Modifier les permissions du salon pour permettre l'envoi de messages
            await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                SEND_MESSAGES: true,
            });

            await message.channel.send(
                `┌──────────────────────────────┐\n` +
                `│ 🔓 **Canal Déverrouillé**    │\n` +
                `├──────────────────────────────┤\n` +
                `│ 🏠 Salon : **#${message.channel.name}** │\n` +
                `│ ✅ Les messages sont activés │\n` +
                `└──────────────────────────────┘`
            );
        } catch (error) {
            console.error("❌ Erreur lors du déverrouillage :", error);
            await message.channel.send(
                `🚨 **Erreur :** Impossible de déverrouiller ce canal.\n` +
                `🔍 **Vérifiez mes permissions et réessayez.**`
            );
        }
    }
};
