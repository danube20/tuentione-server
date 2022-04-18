const Conversation = require('../models/Conversation.model')
const User = require('../models/User.model')
const { isAuthenticated } = require('../middlewares/jwt.middleware')

const router = require('express').Router()

router.post('/', isAuthenticated, (req, res) => {

    const newConversation = {
        members: [req.body.senderId, req.body.receiverId]
    }
    Conversation
        .create(newConversation)
        .then(data => {
            res.status(200).json(data)
            return User
                .findByIdAndUpdate(req.payload._id, { $push: { conversations: data._id } })
                .then(() => User.findByIdAndUpdate(req.body.receiverId, { $push: { conversations: data._id } }))
        })
        .catch(err => res.status(400).json(err))
})

router.delete('/cnv/:convId', (req, res) => {
    Conversation
        .findByIdAndDelete(req.params.convId)
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

router.put('/cnv/update/:friendId/:convId', isAuthenticated, (req, res) => { // Delete conversation id from conversation's array

    const { friendId, convId } = req.params

    User
        .findByIdAndUpdate(friendId, { $pull: { conversations: convId } })
        .then(() => User.findByIdAndUpdate(req.payload._id, { $pull: { conversations: convId } }))
        .then(() => res.status(200))
        .catch(err => res.status(400).json(err))
})

module.exports = router