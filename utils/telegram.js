const TelegramBot = require('node-telegram-bot-api');

const isTelegram = process.env.IS_TELEGRAM
const token = process.env.TELEGRAM_BOT_TOKEN
const _chatId = process.env.TELEGRAM_CHAT_ID
let bot={}
if (isTelegram === 'true') {
    bot = new TelegramBot(token)
}
const sendTeleMessage  = async (message, chatId = _chatId) =>{
   await bot.sendMessage(chatId, message)
}

module.exports = {
    sendTeleMessage
}