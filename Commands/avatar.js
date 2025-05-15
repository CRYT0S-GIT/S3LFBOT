const { loadAuthorizedUsers } = require('../utils/authorizeUtils');

module.exports = {
    name: 'Avatar',
    description: '📷 Affiche l\'avatar d\'un utilisateur via mention, ID ou par défaut (auteur).',
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

        let user;

        try {
            // Si un argument est donné (mention ou ID), on tente de récupérer l'utilisateur
            if (args[0]) {
                const mention = message.mentions.users.first();
                if (mention) {
                    user = mention;
                } else {
                    // Recherche de l'utilisateur par ID
                    user = await message.client.users.fetch(args[0]).catch(() => null);
                }
            } else {
                user = message.author; // Par défaut, c'est l'auteur du message
            }

            // Vérification si l'utilisateur est valide
            if (!user) {
                return message.channel.send("❌ **ERREUR:** Utilisateur introuvable.");
            }

            // URL de l'avatar en haute qualité
            const avatarURL = user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });

            // Affichage du résultat avec un encadré propre
            const response = `

╔══════════════════════════════╗
║ 📷 AVATAR FETCHER            ║
╠══════════════════════════════╣
║ 👤 Utilisateur : ${user.tag}  
║ 🆔 ID : ${user.id}  
╠══════════════════════════════╣
║ 🖼️ Avatar : ${avatarURL}  
╚══════════════════════════════╝
`;

            // Envoi du message
            await message.channel.send(response);

        } catch (error) {
            console.error('❌ Erreur lors de l\'exécution de la commande :', error);
            await message.channel.send('❌ **ERREUR:** Impossible de récupérer l\'avatar.');
        }
    },
};
