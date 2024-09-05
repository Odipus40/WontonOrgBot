// index.js
const { Telegraf } = require('telegraf');
require('dotenv').config();

// Initialize the bot with your bot token from the .env file
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Start command handler
bot.start((ctx) => ctx.reply('Welcome to WontonOrgBot! Send /help to see available commands.'));

// Help command handler
bot.help((ctx) => ctx.reply('Available commands:\n/start - Start the bot\n/help - Show help message\n/guess - Play the autocomplete game'));

// Autocomplete game command
const gameData = [
    { prompt: 'To be or not to...', answer: 'be' },
    { prompt: 'A penny saved is a penny...', answer: 'earned' },
    { prompt: 'Actions speak louder than...', answer: 'words' },
];

function getRandomPrompt() {
    return gameData[Math.floor(Math.random() * gameData.length)];
}

bot.command('guess', (ctx) => {
    const currentGame = getRandomPrompt();
    ctx.reply(`Complete the phrase: "${currentGame.prompt}"`);
    ctx.session = { currentAnswer: currentGame.answer.toLowerCase() };
});

// On text message, check if it's the correct answer
bot.on('text', (ctx) => {
    if (ctx.session && ctx.session.currentAnswer) {
        if (ctx.message.text.toLowerCase() === ctx.session.currentAnswer) {
            ctx.reply('Correct! Well done!');
            ctx.session = null; // Clear the session
        } else {
            ctx.reply('Try again!');
        }
    }
});

// Launch the bot
bot.launch();

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
