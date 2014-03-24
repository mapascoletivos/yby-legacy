
/**
 * Module dependencies.
 */

var 
	mongoose = require('mongoose'),
	Layer = mongoose.model('Layer'),
	Map = mongoose.model('Map'),
	Feature = mongoose.model('Feature'),
	Content = mongoose.model('Content'),
	User = mongoose.model('User');


var adminAccess = function(req, res, callback) {

	if(req.user) {
		if(req.user.isAdmin && typeof callback == 'function') {
			callback();
		} else {
			res.redirect('/');
		}
	} else {
		User.count({isAdmin: true}, function(err, count) {
			if (count == 0) 
				req.flash('error', 'Não há usuários administradores. O primeiro usuário criado será o administrador.');
			res.redirect('/login');
		})
	}

}

/**
 * Index
 */


exports.index = function (req, res, next) {

	adminAccess(req, res, function() {
		res.render('admin', {

		});
	});

}

exports.settings = function(req, res, next) {

	adminAccess(req, res, function() {
		res.render('admin/settings', {

		});
	});

}

exports.privacy = function(req, res, next) {

	adminAccess(req, res, function() {
		res.render('admin/settings/privacy', {

		});
	});

}

exports.users = function(req, res, next) {

	adminAccess(req, res, function() {
		res.render('admin/users', {
			
		});
	});

}

exports.newUser = function(req, res, next) {

	adminAccess(req, res, function() {
		res.render('admin/users/new', {
			
		});
	});

}

exports.permissions = function(req, res, next) {

	adminAccess(req, res, function() {
		res.render('admin/users/permissions', {
			
		});
	});

}