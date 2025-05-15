const { loadAuthorizedUsers } = require('../utils/authorizeUtils');

module.exports = {
    name: 'createchannel',
    description: '📌 Crée un nouveau salon textuel.',
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

        // Vérifie si l'utilisateur a la permission de gérer les salons
        if (!message.member.permissions.has('MANAGE_CHANNELS')) {
            return message.channel.send('🚫 **Erreur:** Vous n\'avez pas la permission de créer un salon.');
        }

        // Vérifie si un nom de salon est fourni
        const channelName = args.join(' ');
        if (!channelName) {
            return message.channel.send('⚠️ **Erreur:** Veuillez fournir un nom pour le salon.');
        }

        try {
            // Création du salon
            const newChannel = await message.guild.channels.create(channelName, { type: 'text' });

            // Message de confirmation avec un style ASCII
            const response = `

┌───────────────────────────────┐
│ ✅ **NOUVEAU SALON CRÉÉ**  
├───────────────────────────────┤
│ 📂 **Nom:** #${newChannel.name}  
│ 🆔 **ID:** ${newChannel.id}  
│ 🔗 **Lien:** [Accéder](https://discord.com/channels/${message.guild.id}/${newChannel.id})  
└───────────────────────────────┘

            `;

            await message.channel.send(response);

        } catch (error) {
            console.error('❌ Erreur lors de la création du salon:', error);
            await message.channel.send('⚠️ **Erreur:** Impossible de créer le salon.');
        }
    },
};
