const { loadAuthorizedUsers } = require('../utils/authorizeUtils');

module.exports = {
    name: 'removechannel',
    description: '🚫 Supprime un salon par mention ou ID (réservé aux personnes autorisées).',
    execute: async (message, args) => {
        // Charger les utilisateurs autorisés
        let authorizedUsers;
        try {
            authorizedUsers = loadAuthorizedUsers();
        } catch (error) {
            console.error('❌ Erreur lors du chargement des utilisateurs autorisés:', error);
            return message.channel.send('⚠️ **Erreur:** Impossible de charger la liste des utilisateurs autorisés.');
        }

        // Vérifier si l'utilisateur exécutant la commande est autorisé
        if (!authorizedUsers.has(message.author.id)) {
            return message.channel.send("🚫 **Accès refusé:** Vous n'êtes pas autorisé à utiliser cette commande.");
        }

        // Vérifier si un salon est mentionné ou si un ID valide est fourni
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);

        if (!channel) {
            return message.channel.send(
                `┌────────────────────────────────────┐
│ ❌ **Erreur** : Salon introuvable       │
├────────────────────────────────────┤
│ 🔹 Utilisation : \`$removechannel #salon\` │
│ 🔹 Ou par ID : \`$removechannel 123456789\` │
│ ⚠️ Assurez-vous que l'ID est valide.        │
└────────────────────────────────────┘`
            );
        }

        try {
            await channel.delete();
            await message.channel.send(
                `┌──────────────────────────────┐
│ 🗑️ **Salon supprimé !**            │
├──────────────────────────────┤
│ 📌 Nom : **#${channel.name}**         │
│ 🆔 ID : **${channel.id}**            │
└──────────────────────────────┘`
            );
        } catch (error) {
            console.error('Erreur lors de la suppression du salon:', error);
            await message.channel.send(
                `┌──────────────────────────────┐
│ ❌ **Erreur** : Suppression échouée  │
├──────────────────────────────┤
│ ⚠️ Vérifiez mes permissions ou      │
│    essayez un autre salon.         │
└──────────────────────────────┘`
            );
        }
    },
};
