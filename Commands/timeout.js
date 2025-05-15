const { loadAuthorizedUsers } = require('../utils/authorizeUtils');

module.exports = {
    name: 'timeout',
    description: '⏳ Timeout un utilisateur pour une durée définie.',
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
            return message.channel.send("🚫 **Accès refusé :** Vous n'êtes pas autorisé à utiliser cette commande.");
        }

        // Vérifier si l'utilisateur a la permission d'effectuer un timeout
        if (!message.member.permissions.has('MODERATE_MEMBERS')) {
            return message.channel.send(
                "❌ **Erreur :** Vous n'avez pas la permission d'effectuer un timeout."
            );
        }

        const user = message.mentions.users.first();
        const duration = args[1];

        if (!user || isNaN(duration) || duration <= 0) {
            return message.channel.send(
                "⚠️ **Utilisation incorrecte :**\n" +
                "📝 **Syntaxe :** `!timeout @CRYT0S <durée en secondes>`\n" +
                "🔹 **Exemple :** `!timeout @CRYT0S 300` (5 minutes)"
            );
        }

        const member = message.guild.members.cache.get(user.id);
        if (!member) {
            return message.channel.send("❌ **Erreur :** L'utilisateur n'est pas dans le serveur.");
        }

        const milliseconds = parseInt(duration) * 1000;

        try {
            await member.timeout(milliseconds, "Timeout effectué via Selfbot Helper");
            await message.channel.send(
                `┌──────────────────────────────┐
│ ⏳ **Timeout Appliqué**          │
├──────────────────────────────┤
│ 👤 Utilisateur : ${user.tag}   │
│ ⏰ Durée : ${duration} secondes │
└──────────────────────────────┘`
            );
        } catch (error) {
            console.error("❌ Erreur lors du timeout :", error);
            await message.channel.send("❌ **Erreur :** Impossible d'appliquer le timeout.");
        }
    },
};
