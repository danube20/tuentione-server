const Conversation = require('../models/Conversation.model')
const User = require('../models/User.model')
const { isAuthenticated } = require('../middlewares/jwt.middleware')

const router = require('express').Router()

router.post('/', isAuthenticated, async (req, res) => {

    const newConversation = {
        members: [req.body.senderId, req.body.receiverId]
    }
    Conversation
        .create(newConversation)
        .then(data => {
            res.status(200).json(data)
            return User.findByIdAndUpdate(req.payload._id, { $push: { conversations: data._id } })
        })
        .catch(err => res.status(400).json(err))
})

router.get('/:userId', async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: { $in: [req.params.userId] }
        })
        res.status(200).json(conversation)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router