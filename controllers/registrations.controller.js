const Registration = require('../models/registration.model');
const Event = require('../models/event.model');
const ok = require('../utils/ok');

exports.registerForEvent = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const eventId = req.body.event;

    const event = await Event.findById(eventId);
    if (!event) {
        return ok(res, null, 'Event not found', 404, 'fail');
    }

    const existing = await Registration.findOne({
        event: eventId,
        attendee: userId
    });
    if (existing) {
        return ok(res, null, 'You are already registered for this event', 400, 'fail');
    }

    const currentCount = await Registration.countDocuments({ event: eventId });
    if (currentCount >= event.capacity) {
        return ok(res, null, 'This event is full', 400, 'fail');
    }

    const registration = await Registration.create({
        event: eventId,
        attendee: userId
    });

    ok(res, registration, 'Registration created successfully', 201);
  } catch (error) {
    next(error);
  }
}

exports.getMyRegistrations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const registrations = await Registration
      .find({ attendee: userId })
      .populate('event');

    ok(res, registrations);
  } catch (error) {
    next(error);
  }
}

exports.cancelRegistration = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const registrationId = req.params.id;

    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return ok(res, null, 'Registration not found', 404, 'fail');
    }

    if (registration.attendee.toString() !== userId) {
      return ok(res, null, 'You can only cancel your own registration', 403, 'fail');
    }

    await registration.deleteOne();

    ok(res, null, 'Registration cancelled successfully');
  } catch (error) {
    next(error);
  }
}

