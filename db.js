const mongoose = require('mongoose')

const User = mongoose.model('User', new mongoose.Schema({
    chatId: 'string',
    name: 'string',
    email: 'string',
    phone: 'string',
}))

mongoose.connect(process.env.mongoURL, (err) => {
    if (err) {
        console.log("error");
    }
    else {
        console.log("connected");
    }
})
module.exports = {
    User
}
