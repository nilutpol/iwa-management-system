const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

let DesignSchema = new mongoose.Schema({
	design_no: String,
	design_type: String,
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
	image_data_design: String,
	image_data_card: String,
	created_at: {
		type: Date,
		default: Date.now
	},
});

DesignSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('design', DesignSchema);
