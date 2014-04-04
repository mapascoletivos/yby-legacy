

/**
 * Show admin registration, the first user will be the site admin.
 */

exports.register = function (req, res) {
	res.render('admin/register');
}


/**
 * Show admin login
 */

exports.login = function (req, res) {
	res.render('admin/login');
}

/**
 * Show admin panel
 */

exports.index = function (req, res) {
}