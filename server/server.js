const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const _ = require('lodash');
const { DateTime } = require('luxon');

// const backup = require('./Backup');

const User = require('./Models/User');
const Inventory = require('./Models/Inventory');
const Design = require('./Models/Design');
const Loom = require('./Models/Loom');
const Stock = require('./Models/Stock');

const CronJob = require('cron').CronJob;
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');

// File Storage Configuration
// const multer = require('multer');
// const GridFsStorage = require('multer-gridfs-storage');
// const Grid = require('gridfs-stream');
const fs = require('fs');

const xl = require('excel4node');

const ExcelJS = require('exceljs');

// const emailer = require('./EmailModule');
// emailer.initialise();

// const job = new CronJob('0 */2 * * *', function () {
// 	const d = new Date();
// 	console.log('Backup started: ', d);
// 	backup.backup();
// });

const API_PORT = process.env.PORT || 8880;
const app = express();
const router = express.Router();

// this is our MongoDB database
const dbRoute = 'mongodb+srv://nilutpol:Sh5nqMnWxODumGvT@cluster0.6okv3.mongodb.net/iwa-loom-management-system';

// connects our back end code with the database
mongoose.connect(dbRoute, {
	useNewUrlParser: true,
	useFindAndModify: false,
	useUnifiedTopology: true
});

let db = mongoose.connection;

// Grid.mongo = mongoose.mongo;
db.once('open', () => {
	console.log('connected to the database.');

	// // Backup Routine
	// console.log('Starting Backup Process...');
	// let requests = [];

	// requests.push(Centre.find().lean());
	// requests.push(User.find().lean());
	// requests.push(Entry.find().lean());
	// requests.push(RollCall.find().lean());
	// requests.push(CentrePrelimData.find().lean());
	// requests.push(Hospital.find().lean());
	// requests.push(BedStatus.find().lean());
	// requests.push(Analytics.find().lean());
	// requests.push(BedStatusAnalytics.find().lean());
	// requests.push(IsolationCentre.find().lean());
	// requests.push(CumulativeData.find().lean());

	// Promise.all(requests)
	// 	.then(data => {
	// 		fs.writeFileSync('./backup_data/backup_10_09_2020.json', JSON.stringify(data, null, '\t'));
	// 		console.log('Backup done.');
	// 	})
});

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.json({ limit: '50mb' }));
app.use(
	bodyParser.urlencoded({
		extended: true,
		limit: '50mb',
		parameterLimit: 50000000
	})
);
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cors());
app.use(express.static(path.join(__dirname, '../build')));

/*  PASSPORT SETUP  */
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
	cb(null, user.id);
});

// passport.deserializeUser(function (id, cb) {
// 	// Agent.findById(id, function (err, user) {
// 	// 	cb(err, user);
// 	// });
// });

const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy,
	ExtractJwt = require('passport-jwt').ExtractJwt;

passport.use(
	'user-login',
	new LocalStrategy(function (username, password, cb) {
		User.findOne(
			{
				username: username
			},
			function (err, user) {
				if (err) {
					return cb(err, null);
				}

				if (!user) {
					return cb(null, null);
				}

				if (user.disabled) {
					return cb(null, null);
				}

				user.comparePassword(password, (err, isMatch) => {
					if (err || !isMatch) {
						return cb(null, null);
					} else {
						return cb(null, user);
					}
				});
			}
		);
	})
);

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'rpHijdvi';
passport.use(
	new JwtStrategy(opts, function (jwt_payload, done) {
		if (jwt_payload.username) {
			User.findOne({ _id: jwt_payload._id }, function (err, user) {
				if (err) {
					return done(err, false);
				}
				if (user) {
					if (user.disabled) {
						return done(null, false);
					}
					return done(null, user);
				} else {
					return done(null, false);
				}
			});
		} else {
			return done(null, false);
		}
	})
);

router.post('/user_login', function (req, res, next) {
	passport.authenticate('user-login', function (err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.json({
				success: false,
				data: null
			});
		}
		req.logIn(user, function (err) {
			if (err) {
				return next(err);
			}
			let token = jwt.sign(user.toJSON(), opts.secretOrKey);
			return res.json({
				success: true,
				data: token
			});
		});
	})(req, res, next);
});

router.get('/get_login_names', (req, res) => {
	User.find({}, { _id: 0, username: 1 }).lean()
		.then(data => {
			return res.json({
				success: true,
				data: _.map(data, 'username')
			});
		});
});

router.get('/get_yarn_list', passport.authenticate('jwt', { session: false }), (req, res) => {
	return res.json({
		success: true,
		data: [
			{
				type: 'Mulberry',
				colors: [
					'Red',
					'White',
					'Black',
					'Yellow',
					'Blue',
					'Green',
					'Grey',
					'Brown'
				]
			},
			{
				type: 'Cotton',
				colors: [
					'Red',
					'White',
					'Black',
					'Yellow',
					'Blue',
					'Green',
					'Grey',
					'Brown'
				]
			},
			{
				type: 'Tassar',
				colors: [
					'Red',
					'White',
					'Black',
					'Yellow',
					'Blue',
					'Green',
					'Grey',
					'Brown'
				]
			},
			{
				type: 'Eri',
				colors: [
					'Red',
					'White',
					'Black',
					'Yellow',
					'Blue',
					'Green',
					'Grey',
					'Brown'
				]
			},
			{
				type: 'Acrylic',
				colors: [
					'Red',
					'White',
					'Black',
					'Yellow',
					'Blue',
					'Green',
					'Grey',
					'Brown'
				]
			},
			{
				type: 'Ghicha',
				colors: [
					'Red',
					'White',
					'Black',
					'Yellow',
					'Blue',
					'Green',
					'Grey',
					'Brown'
				]
			},
			{
				type: 'Muga',
				colors: [
					'Red',
					'White',
					'Black',
					'Yellow',
					'Blue',
					'Green',
					'Grey',
					'Brown'
				]
			},
			{
				type: 'Zari',
				colors: [
					'Golden',
					'Silver',
					'Copper',
					'Metalic'
				]
			}
		]
	});
});

router.get('/get_design_type_list', passport.authenticate('jwt', { session: false }), (req, res) => {
	return res.json({
		success: true,
		data: [
			'Mekhela',
			'Sari',
			'Stole',
			'Gamusa',
			'Fabric'
		]
	});
});

router.get('/get_designs', passport.authenticate('jwt', { session: false }), (req, res) => {
	const options = {
		page: req.query.page || 1,
		limit: 10,
		collation: {
			locale: 'en',
		},
	};

	Design.paginate({}, options)
		.then(data => {
			return res.json({
				success: true,
				data: data
			})
		});
});

router.post('/add_design', passport.authenticate('jwt', { session: false }), (req, res) => {
	if (req.body.design_no !== undefined) {
		let item = new Design(req.body);
		item.save()
			.then(data => {
				return res.json({
					success: true
				});
			});
	} else {
		return res.json({
			success: false,
			data: 'Required parameters are missing.'
		});
	}
});

router.get('/get_inventory', passport.authenticate('jwt', { session: false }), (req, res) => {
	Inventory.find().lean()
		.then(data => {
			return res.json({
				success: true,
				data: data
			});
		});
});

router.get('/get_inventory_summary', passport.authenticate('jwt', { session: false }), async (req, res) => {
	let data = await Inventory.aggregate([
		{
			'$group': {
				'_id': {
					'yarn': '$yarn',
					'type': '$type',
					'color': '$color',
					'count': '$count'
				},
				'count': {
					'$sum': 1
				},
				'weight': {
					'$sum': {
						'$toDouble': '$weight'
					}
				}
			}
		}
	])

	return res.json({
		success: true,
		data: _.sortBy(data, i => i._id.yarn + i._id.type + i._id.color + i._id.count)
	});
});

router.post('/add_inventory', passport.authenticate('jwt', { session: false }), (req, res) => {
	if (req.body.yarn !== undefined) {
		let item = new Inventory(req.body);
		item.save()
			.then(data => {
				return res.json({
					success: true
				});
			});
	} else {
		return res.json({
			success: false,
			data: 'Required parameters are missing.'
		});
	}
});

router.get('/get_looms', passport.authenticate('jwt', { session: false }), (req, res) => {
	Loom.find().lean()
		.then(data => {
			return res.json({
				success: true,
				data: data
			});
		});
});

router.post('/add_loom', passport.authenticate('jwt', { session: false }), (req, res) => {
	if (req.body.loom_no !== undefined) {
		let item = new Loom(req.body);
		item.save()
			.then(data => {
				return res.json({
					success: true
				});
			});
	} else {
		return res.json({
			success: false,
			data: 'Required parameters are missing.'
		});
	}
});

router.get('/get_stock', passport.authenticate('jwt', { session: false }), (req, res) => {
	const options = {
		page: req.query.page || 1,
		limit: 10,
		collation: {
			locale: 'en',
		},
	};

	Stock.paginate({}, options)
		.then(data => {
			return res.json({
				success: true,
				data: data
			})
		});
});

router.post('/add_stock', passport.authenticate('jwt', { session: false }), (req, res) => {
	if (req.body.stock_no !== undefined) {
		let item = new Stock(req.body);
		item.save()
			.then(data => {
				return res.json({
					success: true
				});
			});
	} else {
		return res.json({
			success: false,
			data: 'Required parameters are missing.'
		});
	}
});

router.get('/get_weavers', passport.authenticate('jwt', { session: false }), (req, res) => {
	return res.json({
		success: true,
		data: []
	});
});


// append /api for our http requests
app.use('/api', router);

app.get('/*', function (req, res) {
	// Catch all path except /
	res.sendFile(path.join(__dirname, '../build/index.html'));
});

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
