const { Schema, model } = require('mongoose')

const messageSchema = new Schema(
    {
        conversationId: String,
        sender: String,
        text: String
    },
    {
        timestamps: true
    }
)

module.exports = model('Message', messageSchema)