const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

let StockSchema = new mongoose.Schema({
	stock_no: String,
	design_no: String,
	type: String,
	warp: String,
	warp_color: String,
	weft: String,
	weft_color: String,
	design_yarn: String,
	design_yarn_color: String,
	length: Number,
	width: Number,
	other_colors: String,
	remarks: String,
	image_data: String,
	created_at: {
		type: Date,
		default: Date.now
	},
});

StockSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('stock', StockSchema);
