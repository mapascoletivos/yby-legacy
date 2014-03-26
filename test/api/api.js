
/*
 * Module dependencies.
 */

var request = require('supertest'),
	should = require('should'),
	app = require('../../web'),
	mongoose = require('mongoose'),
	Layer = mongoose.model('Layer'),
	Feature = mongoose.model('Feature'),
	Content = mongoose.model('Content'),
	User = mongoose.model('User');

var apiPrefix = '/api/v1';

var 
	user,
	layerCounter,
	contentId,
	featureId;


describe('API', function(){

	before(function (done) {
		// Clear DB before testing
		Layer.collection.remove(function(){		
			Content.collection.remove(function(){
				User.collection.remove(function(){
					// Then creates API User
					user = new User({
						email: 'foobar@example.com',
						name: 'Foo bar',
						username: 'foobar',
						password: 'foobar',
						needsEmailConfirmation: false
					});
					user.save(done);
				});
			});
		});
	});
	
	/**
	 * Layer tests
	 **/

	describe('Layers', function(){	
		describe('POST /layers', function(){
			context('When not logged in', function(){
				it('should redirect to /login', function (done) {
					request(app)
						.post(apiPrefix + '/layers')
						.expect('Content-Type', /plain/)
						.expect(302)
						.expect('Location', '/login')
						.expect(/Moved Temporarily/)
						.end(done)
				})
			});
			
			context('When logged in, ', function(){

				var agent = request.agent(app);
				
				before(loginRegularUser(agent))
				
				describe('invalid', function(){
				
					var layerCount;

					before(function(done){
						Layer.count(function(err,cnt){
							layerCount = cnt;
							done();
						})
					})
					
					it('layer type', function(done){
						agent
							.post(apiPrefix + '/layers')
							.field('title', 'A layer')
							.expect('Content-Type', /json/)
							.expect(400)
							.expect(/Invalid or missing layer type./)
							.end(done)
					});	

					it('should respond with error', function(done){
						agent
							.post(apiPrefix + '/layers')
							.field('type', 'FeatureLayer')
							.expect('Content-Type', /json/)
							.expect(400)
							.expect(/Path `title` is required./)
							.end(done)
					});
					
					it('should not save to database', function(done){
						Layer.count(function(err,cnt){
							cnt.should.eql(layerCount);
							done();
						})
					});
				})
				
				describe('Valid parameters', function(){
					it('should insert a record to database');
					it('should save the layer');
				});
			});
		});
	});
	
	/**
	 * Content tests
	 **/
	
	describe(' - Contents', function(){
		
		// populate some content
		before(function(done){
			
			var layer = new Layer({
				creator: user,
				title: 'Content test',
				type: 'FeatureLayer'
			});
			
			var content = new Content({
				creator: user,
				type: 'Markdown',
				title: 'Title of content',
				layer: layer
			});
			
			var feature = new Feature({
				creator: user,
				title: 'a feature'
			});
			

			layer.contents.addToSet(content);
			layer.features.addToSet(feature);

			// save all
			layer.save(function(err){
				feature.save(function(err){
					featureId = feature._id;
					content.save(function(err){
						contentId = content._id;
						done();
					});
				});
			});
		})
		
		/**
		 * Content x feature association
		 **/
		
		describe('PUT ' + apiPrefix + '/features/:featureId/contents/:contentId', function(){
			context('When not logged in', function(){
				it('should redirect to /login', function (done) {
					request(app)
						.put(apiPrefix + '/features/' + featureId + '/contents/' + contentId )
						.expect('Content-Type', /plain/)
						.expect(302)
						.expect('Location', '/login')
						.expect(/Moved Temporarily/)
						.end(done)
				});
			});
			
			context('When logged in', function(){
				var 
					agent = request.agent(app),
					contentCount;
				
				before(loginRegularUser(agent));
				
				it('should return success message', function(done){
					agent
						.put(apiPrefix + '/features/' + featureId + '/contents/' + contentId)
						.expect('Content-Type', /json/)
						.expect(200)
						.expect(/Content added successfully./)
						.end(done)
				});
				
				it('should have association in both sides', function(done){
					Feature.findOne(featureId, function(err,ft){
						ft.contents.should.include(contentId);
						Content.findOne(contentId, function(err,ct){
							ct.features.should.include(featureId);
							done();
						});
					})
				});
			});
		});
		
		describe('DEL ' + apiPrefix + '/contents/:contentId', function(){
			context('When not logged in', function(){
				it('should redirect to /login', function (done) {
					request(app)
						.del(apiPrefix + '/contents/' + contentId )
						.expect('Content-Type', /plain/)
						.expect(302)
						.expect('Location', '/login')
						.expect(/Moved Temporarily/)
						.end(done)
				});
			});
			
			context('When logged in', function(){
				var 
					agent = request.agent(app),
					contentCount;
				
				before(loginRegularUser(agent));
				
				it('should return success message', function(done){
					agent
						.del(apiPrefix + '/contents/' + contentId)
						.expect('Content-Type', /json/)
						.expect(200)
						.expect(/Content removed successfully./)
						.end(done)
				});
				
				it('should remove association in both sides', function(done){
					Feature.findOne(featureId, function(err,ft){
						should.not.exist(err);
						ft.contents.should.not.include(contentId);
						Content.findOne(contentId, function(err,ct){
							should.not.exist(err);
							should.not.exist(ct);
							done();
						});
					})
				});
			});
		});
		
		/**
		 * Delete content
		 **/
		
		describe('DEL ' + apiPrefix +'/contents', function(){
			context('When not logged in', function(){
				it('should redirect to /login', function (done) {
					request(app)
						.del(apiPrefix + '/contents/' + contentId)
						.expect('Content-Type', /plain/)
						.expect(302)
						.expect('Location', '/login')
						.expect(/Moved Temporarily/)
						.end(done)
				});
			});
			
			context('When logged in', function(){
				var 
					agent = request.agent(app),
					contentCount;
				
				before(function(done){
					Content.count(function(err,cnt){
						contentCount = cnt;
						loginRegularUser(agent)(done);
					})
				});
				
				it('should return true', function(done){
					agent
						.del(apiPrefix + '/contents/' + contentId)
						.expect('Content-Type', /json/)
						.expect(200)
						.expect(/true/)
						.end(done)
				});
				
				it('should delete a record to the database', function (done) {
					Content.count(function (err, cnt) {
						cnt.should.equal(contentCount - 1)
						done()
					});
				});
			});
		});
	});
});

function loginRegularUser(agent){
	return function(done) {
		agent
		.post('/users/session')
		.send({ email: 'foobar@example.com', password: 'foobar' })
		.end(onResponse);

		function onResponse(err, res) {
			// test redirect to dashboard
			res.should.have.status(302); 
			res.header['location'].should.not.include('/login');
			return done();
		}
	}
}