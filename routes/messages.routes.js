const Messages = require('../models/Message.model')
const Conversation = require('../models/Conversation.model')

const router = require('express').Router()

router.post('/', async (req, res) => {

    Messages
        .create(req.body)
        .then(data => Conversation.findByIdAndUpdate(data.conversationId, { $push: { messages: data._id } }))
        .catch(err => res.status(400).json(err))
})

router.get('/:messageId', async (req, res) => {
    try {
        const messages = await Messages.find({
            conversationId: req.params.messageId
        })
        res.status(200).json(messages)
    } catch (error) {
        res.status(400).json(error)
    }
})

module.exports = router