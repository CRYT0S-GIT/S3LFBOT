const { loadAuthorizedUsers } = require('../utils/authorizeUtils');

module.exports = {
    name: 'kick',
    description: '👢 Expulse un utilisateur du serveur (réservé aux utilisateurs autorisés).',
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

        let user = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => null);

        if (!user) {
            return message.channel.send("⚠️ **Veuillez mentionner un utilisateur ou entrer son ID.**");
        }

        const member = message.guild.members.cache.get(user.id);
        if (!member) {
            return message.channel.send("❌ **Cet utilisateur n'est pas présent sur le serveur.**");
        }

        try {
            await member.kick();
            await message.channel.send(`┌────────────────────────────┐
│ 👢 **Utilisateur expulsé**      │
├────────────────────────────┤
│ 🆔 ID : ${user.id}  
│ 👤 Pseudo : ${user.username}  
│ 📛 Tag : ${user.tag}  
│ 🏠 Serveur : ${message.guild.name}  
└────────────────────────────┘`);
        } catch (error) {
            console.error("Erreur lors du kick :", error);
            await message.channel.send("❌ **Impossible d'expulser cet utilisateur.**");
        }
    },
};
