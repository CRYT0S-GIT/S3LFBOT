const { loadAuthorizedUsers } = require('../utils/authorizeUtils');

module.exports = {
    name: 'ban',
    description: '🔨 Bannit un utilisateur mentionné ou via ID (requiert BAN_MEMBERS).',
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

        // Vérifier si l'utilisateur a la permission de bannir
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.channel.send("🚫 **ERREUR :** Vous n'avez pas la permission de bannir quelqu'un.");
        }

        let user;
        try {
            user = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => null);
        } catch (error) {
            console.error("❌ Erreur lors de la récupération de l'utilisateur :", error);
            return message.channel.send("❌ **ERREUR :** Impossible de récupérer l'utilisateur.");
        }

        if (!user) {
            return message.channel.send("⚠️ **ERREUR :** Veuillez mentionner un utilisateur ou fournir son ID.");
        }

        const member = message.guild.members.cache.get(user.id);
        if (!member) {
            return message.channel.send("❌ **ERREUR :** Cet utilisateur n'est pas sur le serveur.");
        }

        try {
            await member.ban();
            const response = `

╔══════════════════════════════╗
║ 🔨 BAN SYSTEM                ║
╠══════════════════════════════╣
║ 👤 Utilisateur : ${user.tag}  
║ 🆔 ID : ${user.id}  
╠══════════════════════════════╣
║ ✅ Statut : BANNI AVEC SUCCÈS 🚫  
╚══════════════════════════════╝
`;
            await message.channel.send(response);
        } catch (error) {
            console.error("❌ Erreur lors du bannissement :", error);
            return message.channel.send("❌ **ERREUR :** Impossible de bannir cet utilisateur.");
        }
    },
};
