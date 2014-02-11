/*
 * Module dependencies.
 */

var 
	request = require('supertest'),
	should = require('should'),
	app = require('../../web'),
	mongoose = require('mongoose');
	Image = mongoose.model('Map'),
	Content = mongoose.model('Content'),
	Factory = require('../../lib/factory');

var
	apiPrefix = '/api/v1',
	imageFile = 'fixtures/ecolab.png';

describe('Image controller', function(){
	var
		user,
		layer,
		content,
		image1,
		image2;

	before(function(done){
		Factory.create('User', function(usr){
			Factory.create('Layer', function(lyr){
				Factory.create('Image', {sourcefile: imageFile}, function(img1){
					Factory.create('Image', function(img2){
						img1.uploadImageAndSave(imageFile, 'url', function(err){
							img2.uploadImageAndSave(imageFile, 'url', function(err){
								Factory.create('Content', {
									creator: user, 
									layer: lyr,
								}, function(cnt){
									user = usr;
									content = cnt;
									image1 = img1;
									image2 = img2;
									content.updateSirTrevor([{
										data: img1,
										type: "image"
									},{
										data: img2,
										type: "image"
									}], done)
								});
							});
						});
					});
				});
			});
		});
	});


	describe('DEL /images', function(){
		it('should remove from associated content', function(){
			
		console.log('the content\n' +content);
			content.sirTrevorData[0].data._id.should.eql(image1._id);
			content.sirTrevorData[1].data._id.should.eql(image2._id);

			image1.remove(function(err){
				should.not.exist(err);
				Content.findById(content._id, function(err, ct){
					ct.sirTrevorData[0].data._id.should.not.eql(image1._id);
					ct.sirTrevorData[0].data._id.should.eql(image2._id);
				})
			});
		});
	});
})
