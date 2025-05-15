const axios = require('axios');
const { loadAuthorizedUsers } = require('../utils/authorizeUtils');

module.exports = {
    name: 'iplookup',
    description: '🔍 Recherche d\'informations sur une adresse IP (réservé aux utilisateurs autorisés).',
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

        if (!args[0]) {
            return message.channel.send("❌ **Veuillez entrer une adresse IP valide.**");
        }

        const ip = args[0];
        const apiKey = 'dcea7b49a253a6'; // Remplacez par votre propre clé API ipinfo.io
        const url = `https://ipinfo.io/${ip}/json?token=${apiKey}`;

        try {
            const response = await axios.get(url);
            const data = response.data;

            if (data.error) {
                return message.channel.send("❌ **Adresse IP invalide ou API inaccessible.**");
            }

            const infoMessage = `┌──────────────────────────────────────┐
│ 🌍 IP LOOKUP - Informations sur l'IP │
├──────────────────────────────────────┤
│ 📡 Adresse IP : ${data.ip}  
│ 🌍 Pays : ${data.country || 'Inconnu'}  
│ 🏙️ Région : ${data.region || 'Inconnu'}  
│ 🏠 Ville : ${data.city || 'Inconnu'}  
│ 📌 Code Postal : ${data.postal || 'Inconnu'}  
│ 📶 FAI : ${data.org || 'Inconnu'}  
│ 📍 Localisation : ${data.loc || 'Inconnu'}  
│ ⏳ Fuseau Horaire : ${data.timezone || 'Inconnu'}  
└──────────────────────────────────────┘`;

            await message.channel.send(infoMessage);
        } catch (error) {
            console.error("❌ Erreur lors de la récupération des infos IP:", error);
            await message.channel.send("❌ **Erreur lors de la récupération des informations.**");
        }
    },
};
