const { Schema, model } = require('mongoose')

const conversationSchema = new Schema(
    {
        members: Array,
        messages: [{
            type: Schema.Types.ObjectId,
            ref: 'Message'
        }]
    },
    {
        timestamps: true
    }
)

module.exports = model('Conversation', conversationSchema)