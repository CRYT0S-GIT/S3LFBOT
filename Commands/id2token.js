const { loadAuthorizedUsers } = require('../utils/authorizeUtils');

module.exports = {
    name: 'id2token',
    description: '🔢 Convertit un ID en Base64 pour obtenir le début d\'un token (réservé aux utilisateurs autorisés).',
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

        // Vérifier si un ID est fourni
        if (!args[0]) {
            return message.channel.send("❌ **Veuillez entrer un ID valide.**");
        }

        try {
            // Vérifier que l'ID est bien un nombre valide
            const id = BigInt(args[0]);

            // Convertir en Base64 sans padding
            const buffer = Buffer.from(id.toString(), 'utf-8');
            const base64ID = buffer.toString('base64').replace(/=+$/, '');

            // ASCII stylisé
            const response = `╔══════════════════════════════════════════════╗
║ 🔢 **ID2TOKEN - CRYT0S SELFBOT**               
╠══════════════════════════════════════════════╣
║ 🆔 **ID Entré:**       \`${id}\`
║ 🔠 **Début du TOKEN:** \`${base64ID}\`
╚══════════════════════════════════════════════╝`;

            await message.channel.send(response);
        } catch (error) {
            console.error("❌ Erreur lors de la conversion en Base64:", error);
            await message.channel.send("❌ **Erreur:** Impossible de convertir l'ID.");
        }
    },
};
