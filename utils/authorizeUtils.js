const fs = require('fs');
const path = require('path');

const authorizedUsersFile = path.join(__dirname, '../authorized_users.json');

// Charger les utilisateurs autorisés depuis le fichier JSON
const loadAuthorizedUsers = () => {
    if (fs.existsSync(authorizedUsersFile)) {
        const data = fs.readFileSync(authorizedUsersFile);
        return new Set(JSON.parse(data)); // Retourner un Set des IDs des utilisateurs autorisés
    }
    return new Set();
};

// Sauvegarder les utilisateurs autorisés dans le fichier JSON
const saveAuthorizedUsers = (authorizedUsers) => {
    fs.writeFileSync(authorizedUsersFile, JSON.stringify(Array.from(authorizedUsers), null, 2));
};

module.exports = {
    loadAuthorizedUsers,
    saveAuthorizedUsers
};
