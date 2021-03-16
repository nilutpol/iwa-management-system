const mongoose = require('mongoose');

let LoomSchema = new mongoose.Schema({
	loom_no: String,
	weaver: String,
	work_order: [
		{
			design_no: String,
			start_date: {
				type: Date,
				default: Date.now
			},
			end_date: Date,
			progress: Number
		}
	],
	created_at: {
		type: Date,
		default: Date.now
	},
});

module.exports = mongoose.model('loom', LoomSchema);
