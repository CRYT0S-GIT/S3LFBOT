const { saveAuthorizedUsers, loadAuthorizedUsers } = require('../utils/authorizeUtils');

module.exports = {
    name: 'unauth',
    description: '❌ Retire l\'autorisation d\'un utilisateur d\'utiliser le selfbot.',
    async execute(message, args) {
        let authorizedUsers;
        try {
            authorizedUsers = loadAuthorizedUsers();
        } catch (error) {
            console.error('❌ Erreur lors du chargement des utilisateurs autorisés:', error);
            return message.channel.send("❌ **Erreur :** Impossible de charger les utilisateurs autorisés.");
        }

        if (message.author.id !== message.client.user.id) {
            return message.channel.send("⛔ **Erreur :** Vous n'êtes pas autorisé à utiliser cette commande.");
        }

        const userToDeauthorize = message.mentions.users.first();
        if (!userToDeauthorize) {
            return message.channel.send("⚠️ **Utilisation incorrecte :**\n" +
                "📝 **Syntaxe :** `!unauth @user`\n" +
                "🔹 **Exemple :** `!unauth @user`");
        }

        if (!authorizedUsers.has(userToDeauthorize.id)) {
            return message.channel.send(`❌ **Erreur :** ${userToDeauthorize.tag} n'est pas autorisé.`);
        }

        authorizedUsers.delete(userToDeauthorize.id);
        try {
            saveAuthorizedUsers(authorizedUsers);
        } catch (error) {
            console.error('❌ Erreur lors de l\'enregistrement des utilisateurs autorisés:', error);
            return message.channel.send("❌ **Erreur :** Impossible d'enregistrer les modifications.");
        }

        await message.channel.send(
            `┌──────────────────────────────┐
│ ❌ **Utilisateur Désautorisé**   │
├──────────────────────────────┤
│ 👤 Utilisateur : ${userToDeauthorize.tag} │
│ 🔒 Accès retiré               │
└──────────────────────────────┘`
        );
    }
};
