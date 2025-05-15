const { loadAuthorizedUsers } = require('../utils/authorizeUtils');

module.exports = {
    name: 'rmrole',
    description: '🚫 Supprime un rôle d\'un utilisateur par mention ou ID (réservé aux personnes autorisées).',
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

        // Vérifier si un utilisateur et un rôle sont mentionnés ou fournis par ID
        const user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);

        if (!user || !role) {
            return message.channel.send(
                `┌────────────────────────────────┐
│ ❌ **Erreur** : Paramètres manquants │
├────────────────────────────────┤
│ 🔹 Utilisation : \`$rmrole @user @role\` │
│ 🔹 Ou par ID : \`$rmrole ID_USER ID_ROLE\` │
│ ⚠️ Assurez-vous que les ID sont valides. │
└────────────────────────────────┘`
            );
        }

        const member = message.guild.members.cache.get(user.id);
        if (!member) {
            return message.channel.send(
                `┌──────────────────────────────┐
│ ❌ **Erreur** : Utilisateur introuvable │
├──────────────────────────────┤
│ 🔍 L'utilisateur n'est pas sur ce serveur. │
└──────────────────────────────┘`
            );
        }

        try {
            await member.roles.remove(role);
            await message.channel.send(
                `┌──────────────────────────────┐
│ 🏷️ **Rôle retiré avec succès !**   │
├──────────────────────────────┤
│ 👤 Utilisateur : **${user.tag}**    │
│ 🏷️ Rôle : **${role.name}**          │
└──────────────────────────────┘`
            );
        } catch (error) {
            console.error('Erreur lors de la suppression du rôle:', error);
            await message.channel.send(
                `┌──────────────────────────────┐
│ ❌ **Erreur** : Suppression échouée  │
├──────────────────────────────┤
│ ⚠️ Vérifiez mes permissions ou      │
│    essayez un autre rôle.         │
└──────────────────────────────┘`
            );
        }
    },
};
