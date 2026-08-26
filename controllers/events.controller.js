const Event = require('../models/event.model');
const ok = require('../utils/ok');

exports.getEvents = async (req, res, next) => {
  try {
    const { category, city, startDate, endDate, search, page, limit, sortBy, order } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (city) filter.city = city;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const allowedSortFields = ['date', 'registrations'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'date';
    const sortDirection = order === 'desc' ? -1 : 1;
    const sort = { [sortField]: sortDirection };

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [data, total] = await Promise.all([
      Event.find(filter)
        .populate('category')
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Event.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    ok(res, data, 'Success', 200, 'success', {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages
    });
  } catch (error) {
    next(error);
  }
};

exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('category')
      .populate('organizer');

    if (!event) {
      return ok(res, null, 'Event not found', 404, 'fail');
    }

    ok(res, event);
  } catch (error) {
    next(error);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const newEvent = await Event.create(req.body);
    ok(res, newEvent, 'Event created successfully', 201);
  } catch (error) {
    next(error);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedEvent) {
      return ok(res, null, 'Event not found', 404, 'fail');
    }

    ok(res, updatedEvent, 'Event updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return ok(res, null, 'Event not found', 404, 'fail');
    }

    ok(res, null, 'Event deleted successfully');
  } catch (error) {
    next(error);
  }
};