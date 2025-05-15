const { loadAuthorizedUsers } = require('../utils/authorizeUtils');

module.exports = {
    name: 'addr',
    description: '➕ Ajoute un rôle à un utilisateur mentionné ou via ID.',
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

        // Vérifier si l'utilisateur a la permission de gérer les rôles
        if (!message.member.permissions.has('MANAGE_ROLES')) {
            return message.channel.send("❌ **Vous n'avez pas la permission d'ajouter un rôle.**");
        }

        // Récupération de l'utilisateur et du rôle via mention ou ID
        const user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);

        if (!user || !role) {
            return message.channel.send("⚠️ **Usage incorrect !**\nMentionnez un utilisateur et un rôle ou utilisez leur ID.\n`$addr @utilisateur @rôle` ou `$addr <userID> <roleID>`");
        }

        const member = message.guild.members.cache.get(user.id);
        if (!member) {
            return message.channel.send("❌ **L'utilisateur n'est pas dans le serveur.**");
        }

        try {
            await member.roles.add(role);

            await message.channel.send(`
┌────────────────────────────┐
│ ✅ **Rôle Ajouté**          │
├────────────────────────────┤
│ 🆔 Utilisateur : ${user.tag || user.id}  
│ 🎭 Rôle : ${role.name}  
│ 👮‍♂️ Ajouté par : ${message.author.username}  
│ 📅 Date : ${new Date().toLocaleString()}  
└────────────────────────────┘`);
        } catch (error) {
            console.error("Erreur lors de l'ajout du rôle :", error);
            await message.channel.send("❌ **Une erreur est survenue lors de l'ajout du rôle.**");
        }
    },
};
