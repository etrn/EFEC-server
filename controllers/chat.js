const Conversation = require('../models/conversation');
const Message = require('../models/message');
const User = require('../models/user');
const OK = require('../constatns').OK;
const UNPROCESSABLE = require('../constatns').UNPROCESSABLE;

exports.getConversations = function (req, res, next) {
  // Only return one message from each conversation to display as snippet
    Conversation.find({ participants: req.user._id })
    .select('_id')
    .exec((err, conversations) => {
        if (err) {
            res.send({ error: err });
            return next(err);
        }
      // Set up empty array to hold conversations + most recent message
        const fullConversations = [];

        conversations.forEach(conversation => {
            Message.find({ conversationId: conversation._id })
            .sort('-createdAt')
            .limit(1)
            .populate({
                path: 'author',
                select: 'userName'
            })
            .exec((err, message) => {
                if (err) {
                    res.send({ error: err });
                    return next(err);
                }
                fullConversations.push(message);
                if (fullConversations.length === conversations.length)
                    return res.status(OK).json({ conversations: fullConversations });
          });
        });
    });
};
// Get conversation
exports.getConversation = function (req, res, next) {
    Message.find({ conversationId: req.params.conversationId })
    .select('createdAt body author')
    .sort('-createdAt')
    .populate({
        path: 'author',
        select: 'userName'
    })
    .exec((err, messages) => {
        if (err) {
            res.send({ error: err });
            return next(err);
        }

        return res.status(OK).json({ conversation: messages });
    });
};

exports.newConversation = function (req, res, next) {
    if (!req.params.recipient) {
        res.status(UNPROCESSABLE).send({ error: 'Please choose a valid recipient for your message.' });
        return next();
    }

    if (!req.body.composedMessage) {
        res.status(UNPROCESSABLE).send({ error: 'Please enter a message.' });
        return next();
    }

    const conversation = new Conversation({
        participants: [req.user._id, req.params.recipient]
    });

    conversation.save((err, newConversation) => {
        if (err) {
            res.send({ error: err });
            return next(err);
        }

        const message = new Message({
            conversationId: newConversation._id,
            body: req.body.composedMessage,
            author: req.user._id
        });

        message.save((err, newMessage) => {
            if (err) {
                res.send({ error: err });
                return next(err);
            }

            return res.status(OK).json({ message: 'Conversation started!', conversationId: conversation._id });
        });
    });
};

exports.sendReply = function (req, res, next) {
    const reply = new Message({
        conversationId: req.params.conversationId,
        body: req.body.composedMessage,
        author: req.user._id
    });

    reply.save((err, sentReply) => {
        if (err) {
            res.send({ error: err });
            return next(err);
        }

        return res.status(OK).json({ message: 'Reply successfully sent!' });
    });
};
