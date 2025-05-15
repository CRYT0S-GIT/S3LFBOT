const { loadAuthorizedUsers } = require('../utils/authorizeUtils');

module.exports = {
    name: 'userinfo',
    description: 'Affiche les informations d\'un utilisateur (réservé aux utilisateurs autorisés).',
    async execute(message, args) {
        let authorizedUsers;
        try {
            authorizedUsers = loadAuthorizedUsers();
        } catch (error) {
            console.error('❌ Erreur lors du chargement des utilisateurs autorisés:', error);
            return message.channel.send('⚠️ **Erreur:** Impossible de vérifier les autorisations.');
        }

        if (!authorizedUsers.has(message.author.id)) {
            return message.channel.send('🚫 **Accès refusé:** Vous n\'êtes pas autorisé à utiliser cette commande.');
        }

        let user;
        try {
            if (args[0]) {
                const mention = message.mentions.users.first();
                user = mention || await message.client.users.fetch(args[0]).catch(() => null);
            } else {
                user = message.author;
            }

            if (!user) {
                return message.channel.send("❌ **Erreur:** Utilisateur introuvable.");
            }

            // Vérifier si le message a été envoyé dans un serveur
            const member = message.guild ? message.guild.members.cache.get(user.id) : null;
            const joinedAt = member ? member.joinedAt : null;
            const createdAt = user.createdAt;

            const now = new Date();
            const accountAge = now - createdAt;
            const serverAge = joinedAt ? now - joinedAt : null;

            function formatDuration(ms) {
                const seconds = Math.floor(ms / 1000) % 60;
                const minutes = Math.floor(ms / (1000 * 60)) % 60;
                const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
                const days = Math.floor(ms / (1000 * 60 * 60 * 24));
                return `${days}d ${hours}h ${minutes}m ${seconds}s`;
            }

            const avatarURL = user.displayAvatarURL({ dynamic: true, size: 1024 });
            let bannerURL = "Aucune donnée";
            try {
                const userData = await user.fetch();
                if (userData.banner) {
                    bannerURL = `https://cdn.discordapp.com/banners/${user.id}/${userData.banner}.png?size=1024`;
                }
            } catch (error) {
                console.error("❌ Erreur lors de la récupération de la bannière:", error);
            }

            const response = `╔════════════════════════════════════════════════╗
║ 🔹 SYSTEM SCAN: **Utilisateur détecté \`${user.username}\`**                                      
╠════════════════════════════════════════════════╣
║ 🆔 ID:          \`${user.id}\`
║ 👤 Pseudo:      \`${user.username}\`
║ 🎭 Pseudo Serveur: \`${member ? member.displayName : "N/A"}\`
╠════════════════════════════════════════════════╣
║ 📅 Création du compte: \`${createdAt.toLocaleString()}\`
║ ⏳ Âge du compte:      \`${formatDuration(accountAge)}\`
╠════════════════════════════════════════════════╣
║ 🏠 Arrivée sur le serveur: \`${joinedAt ? joinedAt.toLocaleString() : "Utilisateur non trouvé"}\`
║ 📆 Ancienneté serveur:    \`${serverAge ? formatDuration(serverAge) : "N/A"}\`
╠════════════════════════════════════════════════╣
║ 🖼️ Avatar:   [Lien](${avatarURL})
║ 🎨 Bannière: ${bannerURL !== "Aucune donnée" ? `[Lien](${bannerURL})` : "Aucune donnée"}
╚════════════════════════════════════════════════╝`;

            await message.channel.send(response);

        } catch (error) {
            console.error("❌ Erreur lors de l'exécution de userinfo:", error);
            message.channel.send("❌ **Erreur:** Une erreur est survenue lors de l'exécution de la commande.");
        }
    }
};
