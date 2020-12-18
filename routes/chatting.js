const express = require('express');
const { Room } = require('../modules/room');
const { Chat } = require('../modules/chat');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/:id', isAuth, async (req, res, next) => {
  try {
    const room = await Room.findOne({ _id: req.params.id }).populate(
      'productItem'
    );

    if (req.user.id == room.productItem.author) {
      await Room.findByIdAndUpdate(
        { _id: req.params.id },
        {
          alert: false,
        },
        { new: true }
      );
    }

    const chats = await Chat.find({ room: room._id })
      .populate('user')
      .sort('createdAt');
    chats.forEach((e) => {
      console.log(e.user.id == req.user.id);
    });
    return res.render('chat', {
      room,
      title: room.title,
      chats,
      user: req.user.id,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await Room.remove({ _id: req.params.id });
    await Chat.remove({ room: req.params.id });
    console.log('방에서 나가기 완료');
    setTimeout(() => {
      req.app.get('io').of('/chatting').emit('removeRoom', req.params.id);
    }, 2000);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/:id/chat', isAuth, async (req, res, next) => {
  try {
    const room = await Room.find({ _id: req.params.id, alert: false });
    if (room) {
      await Room.findByIdAndUpdate(
        { _id: req.params.id },
        {
          alert: true,
        },
        { new: true }
      );
    }

    const chat = await Chat.create({
      room: req.params.id,
      user: req.user.id,
      chat: req.body.chat,
    });
    res.redirect(`/chatting/${req.params.id}`);
    return req.app
      .get('io')
      .of('/chatting')
      .to(req.params.id)
      .emit('chat', chat);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
