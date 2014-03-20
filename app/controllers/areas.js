
/**
 * Module dependencies.
 */

var 
	async = require('async'),
	fs = require('fs'),
	path = require('path'),
	unzip = require('unzip'),
	shapefile = require('shapefile'),
	mongoose = require('mongoose'), 
	Area = mongoose.model('Area');

/**
 * Show info of uploaded shapefiles
 */

exports.shapefiles = function(req, res, next){

	var 
		shpPath = 'public/uploads/shapefiles',
		allFiles = fs.readdirSync(shpPath),
		availableShapefiles = [];

	var getShpProperties = function(filename, doneGetShpProperties) {
		
		var 
			reader = shapefile.reader(shpPath + '/' + filename),
			properties = {};

		reader.readHeader(function(err, header){
			if (err) doneGetShpProperties(err);
			else 
				reader.readRecord(function(err, record){
					if (err) doneGetShpProperties(err);
					doneGetShpProperties(null, {
						filename: filename,
						type: record.geometry.type,
						properties: Object.keys(record.properties)
					});
				});
		});
	}

	async.each(allFiles, function(file, done){
		if(path.extname(file) === ".shp") {
			getShpProperties(file, function(err, properties){
				if (err) done(err)
				else {
					availableShapefiles.push(properties);
					done();
				}
			})
     	} else {
     		done();
     	}
	}, function(err){
		if (err) console.log(err);
		else {
			console.log(availableShapefiles);
			res.render('areas/upload', {
				shapefiles: availableShapefiles
			});
		}
	});


}


/**
 * Upload areas
 */

exports.upload = function(req, res, next){

	uploadedFile = req.files.shapefile;

	// Is a zip file?
	if (uploadedFile.type != 'application/zip') {
		return res.json({messages: [{status: 'ok', text: 'O arquivo deve ser um zip que contenha um shapefile.'}]});
	}

	// Zip contain only one valid shapefile
	fs.createReadStream(uploadedFile.path)
		.pipe(unzip.Extract({ path: 'public/uploads/shapefiles' }));

	res.redirect('/areas');
}

exports.generateFromShape = function(req, res, next) {



}