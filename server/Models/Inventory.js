const mongoose = require('mongoose');

let InventorySchema = new mongoose.Schema({
	yarn: String,
	type: String,
	count: String,
	color: String,
	weight: Number,
	cost: Number,
	created_at: {
		type: Date,
		default: Date.now
	},
});

module.exports = mongoose.model('inventory', InventorySchema);
