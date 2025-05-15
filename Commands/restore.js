const fs = require("fs");
const path = require("path");

module.exports = {
  name: "restore",
  description: "Affiche le contenu d'une backup",
  async execute(client, message, args) {
    // Vérifications de base
    if (!message || !message.channel) {
      console.error("❌ Erreur : `message` ou `message.channel` est undefined !");
      return;
    }

    if (!message.guild) {
      return message.channel.send("❌ Cette commande ne peut être utilisée que dans un serveur !");
    }

    if (message.author.id !== message.guild.ownerId) {
      return message.channel.send("❌ Tu dois être le propriétaire du serveur pour restaurer une backup !");
    }

    // Vérification du dossier de backup
    const backupFolderPath = path.join(__dirname, "backups");
    if (!fs.existsSync(backupFolderPath)) {
      return message.channel.send("❌ Le dossier de backup est introuvable !");
    }

    // Liste des fichiers de backup
    const backupFiles = fs.readdirSync(backupFolderPath).filter(file => file.startsWith("backup_") && file.endsWith(".json"));
    if (backupFiles.length === 0) {
      return message.channel.send("❌ Aucune backup disponible !");
    }

    if (args.length === 0) {
      const backupList = backupFiles.map(file => `📂 \`${file.replace("backup_", "").replace(".json", "")}\``).join("\n");
      return message.channel.send(`📋 **Backups disponibles :**\n${backupList}\n\nUtilise : \`!restore <ID>\` pour voir le contenu d'une backup.`);
    }

    // Récupération de la backup demandée
    const backupID = args[0];
    const backupFileName = `backup_${backupID}.json`;
    const backupFilePath = path.join(backupFolderPath, backupFileName);

    if (!fs.existsSync(backupFilePath)) {
      return message.channel.send(`❌ Aucune backup trouvée pour l'ID : \`${backupID}\``);
    }

    // Lecture du fichier backup
    let backupData;
    try {
      backupData = JSON.parse(fs.readFileSync(backupFilePath, "utf8"));
    } catch (error) {
      console.error("❌ Erreur de lecture du fichier JSON :", error);
      return message.channel.send("❌ Impossible de charger cette backup (fichier corrompu).");
    }

    // ✅ Affichage des informations de la backup
    let response = `📂 **Backup ID:** \`${backupID}\`\n`;
    response += `🛠 **Nom du serveur :** ${backupData.name}\n\n`;
    response += `📜 **Salons (${backupData.channels.length}):**\n`;
    response += backupData.channels.map(c => `🔹 ${c.type} - \`${c.name}\``).join("\n") + "\n\n";
    response += `🎭 **Rôles (${backupData.roles.length}):**\n`;
    response += backupData.roles.map(r => `🔹 ${r.name}`).join(", ") + "\n\n";
    response += `😀 **Emojis (${backupData.emojis.length}):**\n`;
    response += backupData.emojis.map(e => `🔹 ${e.name}`).join(", ") + "\n\n";

    // Discord limite les messages à 2000 caractères
    if (response.length > 2000) {
      const parts = response.match(/[\s\S]{1,1900}/g);
      for (const part of parts) {
        await message.channel.send("```" + part + "```");
      }
    } else {
      message.channel.send("```" + response + "```");
    }
  },
};
