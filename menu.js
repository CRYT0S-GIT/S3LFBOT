const figlet = require('figlet');
const chalk = require('chalk');
const config = require('./config.json');

function clearConsole() {
    console.clear();
}

function selfbotMenu(clients) {
    clearConsole();

  
    console.log(chalk.red(`
██████╗ ██████╗ ██╗   ██╗████████╗ ██████╗ ███████╗    ██████╗ ███████╗██╗   ██╗
██╔════╝██╔══██╗╚██╗ ██╔╝╚══██╔══╝██╔═████╗██╔════╝    ██╔══██╗██╔════╝██║   ██║
██║     ██████╔╝ ╚████╔╝    ██║   ██║██╔██║███████╗    ██║  ██║█████╗  ██║   ██║
██║     ██╔══██╗  ╚██╔╝     ██║   ████╔╝██║╚════██║    ██║  ██║██╔══╝  ╚██╗ ██╔╝
╚██████╗██║  ██║   ██║      ██║   ╚██████╔╝███████║    ██████╔╝███████╗ ╚████╔╝ 
 ╚═════╝╚═╝  ╚═╝   ╚═╝      ╚═╝    ╚═════╝ ╚══════╝    ╚═════╝ ╚══════╝  ╚═══╝  
`));

   
    console.log(chalk.red(figlet.textSync('CRYT0S SELF BOT', { horizontalLayout: 'full' })));

    console.log(chalk.red(`------------------------------------------------------------------------------------------------------------------------`));
    console.log(chalk.white(`CRYT0S | https://github.com/CRYT0S-GIT | https://github.com/CRYT0S-GIT | https://github.com/CRYT0S-GIT | https://github.com`));
    console.log(chalk.red(`------------------------------------------------------------------------------------------------------------------------\n`));

    console.log(chalk.red(`[+] SelfBot Information:\n`));

    clients.forEach((client, index) => {
        const prefix = config.prefix || '!';
        const username = client.user.username;
        const userId = client.user.id;
        const cachedUsers = client.users.cache.size;
        const guildsCount = client.guilds.cache.size;

        console.log(chalk.red(`🚀​​ SelfBot #${index + 1}`));
        console.log(chalk.white(`\t[✔️​] Connecté en tant que: ${chalk.bold(username)} (${userId})`));
        console.log(chalk.white(`\t[👥​] Utilisateurs en cache: ${cachedUsers}`));
        console.log(chalk.white(`\t[🔥​] Serveurs connectés: ${guildsCount}`));
        console.log(chalk.white(`\t[🚀] Préfixe: ${chalk.bold(prefix)}\n`));
    });

    console.log(chalk.red(`✔ Tous les SelfBots sont en ligne et prêts !`));
}

module.exports = selfbotMenu;
