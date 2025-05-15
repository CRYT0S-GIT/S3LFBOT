const { loadAuthorizedUsers } = require('../utils/authorizeUtils');

module.exports = {
    name: 'mpclear',
    description: '🗑️ Supprime un nombre spécifié de messages envoyés par le bot.',
    async execute(message, args) {
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

        // Vérifier que le nombre de messages est spécifié et valide
        const numMessages = parseInt(args[0], 10);
        if (isNaN(numMessages) || numMessages <= 0) {
            return message.channel.send("⚠️ **Veuillez spécifier un nombre valide de messages à supprimer.**\n`Exemple: $mpclear 10`");
        }

        try {
            // Récupérer les messages du canal
            const messages = await message.channel.messages.fetch({ limit: numMessages });

            // Filtrer uniquement les messages envoyés par le bot
            const botMessages = messages.filter(msg => msg.author.id === message.client.user.id);

            if (botMessages.size === 0) {
                return message.channel.send("❌ **Aucun message du bot à supprimer.**");
            }

            // Suppression des messages un par un
            for (const msg of botMessages.values()) {
                await msg.delete();
            }

            // Message de confirmation (se supprime après 5 secondes)
            const confirmationMessage = await message.channel.send(`

┌───────────────────────┐
│ ✅ **Messages Supprimés** │
├───────────────────────┤
│ 🗑️ **Nombre supprimé** : ${botMessages.size}  
│ 🤖 **Auteur** : ${message.client.user.username}  
│ 🔄 **Commande exécutée par** : ${message.author.username}  
└───────────────────────┘
`);
            
            setTimeout(() => confirmationMessage.delete(), 5000);

        } catch (error) {
            console.error("❌ Erreur lors de la suppression des messages du bot :", error);
            await message.channel.send("⚠️ **Une erreur est survenue lors de la suppression des messages.**");
        }
    }
};
