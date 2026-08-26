const Message = require('../models/message.model');
const ok = require('../utils/ok');

exports.createAnnouncement = async (req, res, next) => {
  try {
    const { eventId, text } = req.body;
    const senderId = req.user.id;

    const message = await Message.create({
      event: eventId,
      sender: senderId,
      text
    });

    const populatedMessage = await message.populate('sender', 'name email');

    const io = req.app.get('io');
    if (io) {
      io.to(eventId).emit('announcement', populatedMessage);
    }

    ok(res, populatedMessage, 'Announcement sent successfully', 201);
  } catch (error) {
    next(error);
  }
};

exports.getAnnouncementsByEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const messages = await Message.find({ event: eventId })
      .sort({ createdAt: 1 })
      .populate('sender', 'name email');

    ok(res, messages);
  } catch (error) {
    next(error);
  }
};