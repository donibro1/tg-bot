require('dotenv').config()

const { User } = require('./db')

const TelegramBot = require('node-telegram-bot-api')

const { send } = require('process')

const bot = new TelegramBot(process.env.TOKEN, {polling: true})
bot.on('polling_error', console.log)

const steps = {
    START: 0, NAME: 1, GMAIL: 2, PHONE: 3,
}

function createUser(id) {
    return{
        id: "",
        name: "",
        gmail: "",
        phone: "",
        step: steps.START
    }
}

const users = {}

bot.on('message', (msg) => {
   
    let user = findUser(msg)
   
    if (msg.text === '/start') {
       onStart(msg)
    }
    else if (user.step === steps.NAME) {
        if (user){
            onName(msg)
        }
        else if (user.step === steps.GMAIL) {
            onGmail(msg)
        }
        else if (user.step === steps.PHONE) {
            onPhone(msg)
        }
    }
    else {
        bot.sendMessage(msg.chat.id, '/start bosing')
    }
})

function onStart(msg){
    let user = authorizeUser(msg)
    requireName(user, msg)
}
function onName(msg) {
    let user = findUser(msg)
    user.name = msg.text

    requireGmail(user, msg)

}
function onGmail(msg) {
    let user = findUser(msg)
    user.gmail = gmail


    requireContact(user, msg)
}

function onPhone(msg) {
    let user = findUser(msg)
    user.phone = contact
}
function requireName(user, msg) {
    bot.sendMessage(msg.chat.id, "Ismingizni kiriting")
    user.step = steps.NAME
}
function requireContact(msg) {
    bot.sendMessage(msg.chat.id, "kontaktingizni yuboring", {reply_markup: {
        keyboard: [
            [ {text: "kontactni yuborish", request_contact: true } ]
        ],
        resize_keyboard: true,
    }})
    user.step = steps.PHONE
}
function complete(user, msg) {
    bot.sendMessage(msg.chat.id, "siz royhatdan otdingiz!")

    sendToAdmin(user)
    sendToDatabase(user)
}
function sendToAdmin(user) {
    const message = `yangi foydalanuvchi, ${user.name}\n` +
                    `elektron pochta manzili: ${user.gmail}\n`+
                    `telefon raqami: ${user.phone}`;

    bot.sendMessage(process.env.adminID, message)
}

function sendToDatabase(user) {
    
    const dbUser = User({
        chatId: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
    })
    dbUser.save()
}

function findUser(msg) {
    return users[msg.chat.id]
}
function authorizeUser(msg) {
    const user = createUser(msg.chat.id)
    users[msg.chat.id] = user

    return user
}