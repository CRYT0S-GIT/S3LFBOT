// Modules - Ne pas modifier ces imports
const { Client } = require('discord.js-selfbot-v13');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const backups = require('./commands/backups.js');
const selfbotMenu = require('./menu.js'); // Importation du menu

// Charger le fichier de configuration
const configPath = path.resolve(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
const tokens = config.discord.tokens; // Liste des tokens

// Vérifier si les tokens sont bien définis
if (!Array.isArray(tokens) || tokens.length === 0) {
    console.error("❌ Aucun token trouvé dans config.json !");
    process.exit(1);
}

// Charger les utilisateurs autorisés
const authorizedUsersFile = './authorized_users.json';
let authorizedUsers = new Set();

const loadAuthorizedUsers = () => {
    if (fs.existsSync(authorizedUsersFile)) {
        const data = fs.readFileSync(authorizedUsersFile);
        authorizedUsers = new Set(JSON.parse(data));
    }
};

const saveAuthorizedUsers = () => {
    fs.writeFileSync(authorizedUsersFile, JSON.stringify(Array.from(authorizedUsers), null, 2));
};

// Charger les utilisateurs autorisés au démarrage
loadAuthorizedUsers();

// Charger les commandes
const commands = new Map();
const commandsDir = path.join(__dirname, 'commands');

fs.readdir(commandsDir, (err, files) => {
    if (err) console.error('❌ Erreur lors du chargement des commandes :', err);
    files.forEach(file => {
        const commandName = path.basename(file, '.js');
        const commandPath = path.join(commandsDir, file);
        try {
            const command = require(commandPath);
            commands.set(commandName, command);
        } catch (error) {
            console.error(`❌ Erreur lors du chargement de ${commandName} :`, error);
        }
    });
});

// Stocker tous les clients
const clients = [];

// Fonction pour créer un client Discord avec un token
const startClient = (token, index) => {
    const client = new Client({ checkUpdate: false });

    // Vérifie si l'utilisateur est autorisé
    const isAuthorized = (userId) => authorizedUsers.has(userId);

    client.on('ready', async () => {
        console.log(`\n🔹 SelfBot #${index + 1} connecté en tant que ${client.user.tag}`);
        
        
        // Ajouter le client à la liste
        clients.push(client);

        if (clients.length === tokens.length) {
            selfbotMenu(clients);
        }

        
        // 🎥 Statut en STREAMING
        await client.user.setPresence({
            activities: [{
                name: `SelfBot #${index + 1} | CRYT0S v1.0`,
                type: 'STREAMING',
                url: 'https://www.twitch.tv/real_cryt0s'
            }],
            status: 'online'
        });
        
        console.log(`🎥 Statut activé pour ${client.user.tag} !`);
    });

    client.on('messageCreate', async (message) => {
        if (!message.content.startsWith('$') || message.author.bot) return;

        const args = message.content.slice(1).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        if (!isAuthorized(message.author.id)) {
            await message.channel.send('🚫 **Vous n\'êtes pas autorisé à utiliser cette commande.**');
            return;
        }

        const command = commands.get(commandName);
        if (command) {
            try {
                await command.execute(message, args);
            } catch (error) {
                console.error('❌ Erreur lors de l\'exécution de la commande :', error);
                await message.channel.send('❌ **Une erreur est survenue.**');
            }
        } else {
            await message.channel.send('❓ **Commande inconnue.** Tapez `$help` pour voir la liste des commandes.');
        }
    });

    client.login(token).catch(err => {
        console.error(`❌ Échec de connexion pour le token #${index + 1}:`, err.message);
    });
};

// Lancer un client Discord pour chaque token
tokens.forEach((token, index) => startClient(token, index));
