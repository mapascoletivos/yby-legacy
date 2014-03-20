
/*!
 * Module dependencies
 */

var 
	mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Area schema
 */

var AreaSchema = new Schema({
	title: { type: String, required: true },
	description: String,
	geometry: { type: {type: String}, coordinates: []},
	data: {}
});


/**
 * Geo index
 **/

AreaSchema.index({ loc: '2dsphere' })

/**
 * Statics
 */

AreaSchema.statics = {
	load: function (id, cb) {
		this.findOne({ _id : id })
			.exec(cb)
	},
	list: function (options, cb) {
		var criteria = options.criteria || {}

		this.find(criteria)
			.sort({'createdAt': -1}) // sort by date
			.limit(options.perPage)
			.skip(options.perPage * options.page)
		.exec(cb)
	}	
}

mongoose.model('Area', AreaSchema);