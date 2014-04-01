'use strict';

/*
 * User service
 */

exports.User = [
	'$resource',
	'apiPrefix',
	function($resource, apiPrefix) {

		var gravatar = function(email, size) {

			if(typeof size === 'undefined')
				size = 100;

			return grvtr.create(email, {
				size: size,
				defaultImage: 'mm',
				rating: 'g'
			});
		}

		return {
			resource: $resource(apiPrefix + '/users/:userId', {}, {
				'get': {
					method: 'GET',
					loadingMessage: 'Carregando usuário',
					interceptor: {
						response: function(data) {
							var res = data.data;
							res.gravatar = function(size) {
								return gravatar(res.email, size);
							}
							return res;
						}
					}
				},
				'update': {
					method: 'PUT',
					loadingMessage: 'Atualizando usuário',
					url: apiPrefix + '/users',
					transformRequest: function(data) {
						if(data.email && data.name)
							delete data.email;
						return JSON.stringify(data);
					}
				},
				'updatePwd': {
					method: 'PUT',
					loadingMessage: 'Alterando senha'
				}
			}),
			gravatar: gravatar
		}

	}
]