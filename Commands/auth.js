const { saveAuthorizedUsers, loadAuthorizedUsers } = require('../utils/authorizeUtils');

module.exports = {
    name: 'auth',
    description: '🔐 Autorise un utilisateur à utiliser le selfbot.',
    async execute(message, args) {
        let authorizedUsers;

        try {
            authorizedUsers = loadAuthorizedUsers();
        } catch (error) {
            console.error('❌ Erreur lors du chargement des utilisateurs autorisés:', error);
            return message.channel.send('⚠️ **Erreur:** Impossible de charger la liste des utilisateurs autorisés.');
        }

        // Vérifie si l'utilisateur exécutant la commande est le propriétaire du selfbot
        if (message.author.id !== message.client.user.id) {
            return message.channel.send('🚫 **Accès refusé:** Seul le propriétaire du selfbot peut utiliser cette commande.');
        }

        // Récupération de l'utilisateur via mention ou ID
        let userToAuthorize = message.mentions.users.first();
        if (!userToAuthorize && args[0]) {
            try {
                userToAuthorize = await message.client.users.fetch(args[0]);
            } catch (error) {
                return message.channel.send('⚠️ **Erreur:** ID utilisateur invalide ou introuvable.');
            }
        }

        // Vérifie si un utilisateur valide a été trouvé
        if (!userToAuthorize) {
            return message.channel.send('❌ **Erreur:** Veuillez mentionner un utilisateur ou fournir un ID.');
        }

        // Ajout de l'utilisateur à la liste des autorisés
        authorizedUsers.add(userToAuthorize.id);

        try {
            saveAuthorizedUsers(authorizedUsers);
        } catch (error) {
            console.error('❌ Erreur lors de l\'enregistrement des utilisateurs autorisés:', error);
            return message.channel.send('⚠️ **Erreur:** Impossible d\'enregistrer les modifications.');
        }

        // Message de confirmation avec style ASCII
        const response = `
┌───────────────────────────────┐
│ ✅ **NOUVEL UTILISATEUR AUTORISÉ**  
├───────────────────────────────┤
│ 👤 **Utilisateur:** ${userToAuthorize.tag}  
│ 🆔 **ID:** ${userToAuthorize.id}  
└───────────────────────────────┘
        `;
        
        await message.channel.send(response);
    }
};
