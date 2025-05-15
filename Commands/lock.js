const { loadAuthorizedUsers } = require('../utils/authorizeUtils');

module.exports = {
    name: 'lock',
    description: '🔒 Verrouille le salon pour empêcher l\'envoi de messages (réservé aux utilisateurs autorisés).',
    execute: async (message, args) => {
        // Charger la liste des utilisateurs autorisés
        let authorizedUsers;
        try {
            authorizedUsers = loadAuthorizedUsers();
        } catch (error) {
            console.error('❌ Erreur lors du chargement des utilisateurs autorisés:', error);
            return message.channel.send('⚠️ **Erreur:** Impossible de vérifier les autorisations.');
        }

        // Vérifier si l'utilisateur est autorisé
        if (!authorizedUsers.has(message.author.id)) {
            return message.channel.send('🚫 **Accès refusé:** Vous n\'êtes pas autorisé à utiliser cette commande.');
        }

        try {
            await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                SEND_MESSAGES: false,
            });

            await message.channel.send(`┌────────────────────────────┐
│ 🔒 **Salon Verrouillé**       │
├────────────────────────────┤
│ 🏠 Salon : #${message.channel.name}  
│ 🆔 ID : ${message.channel.id}  
│ 👮‍♂️ Verrouillé par : ${message.author.username}  
│ 📅 Date : ${new Date().toLocaleString()}  
└────────────────────────────┘`);
        } catch (error) {
            console.error("Erreur lors du verrouillage :", error);
            await message.channel.send("❌ **Une erreur est survenue lors du verrouillage du salon.**");
        }
    },
};
