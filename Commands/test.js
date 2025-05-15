module.exports = {
    name: "test",
    description: "Vérifie si le bot fonctionne",
    async execute(client, message, args) {
      console.log("✅ Commande test exécutée !");
      message.channel.send("✅ **Selfbot opérationnel !**");
    },
  };
  