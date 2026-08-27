require('dotenv').config();

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Category = require('./models/category.model');
const Event = require('./models/event.model');
const Message = require('./models/message.model');
const Registration = require('./models/registration.model');
const User = require('./models/user.model');

const seed = async () => {
	await connectDB();

	await Registration.deleteMany({});
	await Message.deleteMany({});
	await Event.deleteMany({});
	await Category.deleteMany({});
	await User.deleteMany({});

	const admin = await User.create({
		name: 'EventPulse Admin',
		email: 'admin@eventpulse.com',
		password: await bcrypt.hash('Admin123!', 12),
		role: 'admin',
	});

	const categories = await Category.insertMany([
		{ name: 'Music', description: 'Concerts, festivals, and live performances' },
		{ name: 'Tech', description: 'Technology conferences, talks, and workshops' },
		{ name: 'Sports', description: 'Competitions, matches, and athletic events' },
	]);

	const categoryByName = Object.fromEntries(
		categories.map((category) => [category.name, category._id])
	);

	await Event.insertMany([
		{
			title: 'Summer Sounds Festival',
			description: 'An outdoor day of live music from local and international artists.',
			category: categoryByName.Music,
			date: new Date('2026-06-20T18:00:00.000Z'),
			city: 'Cairo',
			venue: 'Nile Arena',
			capacity: 5000,
			organizer: admin._id,
		},
		{
			title: 'Future Tech Summit',
			description: 'A conference exploring practical applications of emerging technology.',
			category: categoryByName.Tech,
			date: new Date('2026-07-11T09:00:00.000Z'),
			city: 'Alexandria',
			venue: 'Bibliotheca Alexandrina',
			capacity: 800,
			organizer: admin._id,
		},
		{
			title: 'Community Football Cup',
			description: 'A friendly tournament bringing local teams together for a full day of sport.',
			category: categoryByName.Sports,
			date: new Date('2026-08-08T10:00:00.000Z'),
			city: 'Giza',
			venue: 'Dream Sports Club',
			capacity: 1200,
			organizer: admin._id,
		},
		{
			title: 'AI Builders Meetup',
			description: 'An evening meetup for developers building useful AI-powered products.',
			category: categoryByName.Tech,
			date: new Date('2026-09-19T17:30:00.000Z'),
			city: 'Cairo',
			venue: 'Smart Village Hub',
			capacity: 250,
			organizer: admin._id,
		},
	]);

	console.log('Seed completed: 1 admin, 3 categories, and 4 events created.');
};

seed()
	.catch((error) => {
		console.error('Seed failed:', error.message);
		process.exitCode = 1;
	})
	.finally(async () => {
		await mongoose.disconnect();
	});
