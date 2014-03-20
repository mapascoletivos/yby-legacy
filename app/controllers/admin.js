
/**
 * Module dependencies.
 */

var 
	mongoose = require('mongoose'),
	User = mongoose.model('User');


/**
 * Index
 */

exports.index = function (req, res, next) {

	if (req.user) {
		if (req.user.isAdmin) {
			res.render('admin/index');
		} else {
			// Access not allowed, send user to home
			res.redirect('/');
		}
	} else {
		User.count({isAdmin: true}, function(err, count){
			if (count == 0) 
				req.flash('error', 'Não há usuários administradores. O primeiro usuário criado será o administrador.');
			res.redirect('/login');
		})
	}
}
