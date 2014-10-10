(function(module) {
	"use strict";

	var User = module.parent.require('./user'),
		meta = module.parent.require('./meta'),
		db = module.parent.require('../src/database'),
		passport = module.parent.require('passport'),
  		passportSmugMug = require('passport-smugmug').Strategy,
  		fs = module.parent.require('fs'),
  		path = module.parent.require('path'),
  		async = module.parent.require('async'),
  		nconf = module.parent.require('nconf');

	var constants = Object.freeze({
		'name': "SmugMug",
		'admin': {
			'route': '/plugins/sso-smugmug',
			'icon': 'fa-camera-retro'
		}
	});

	var SmugMug = {};

	SmugMug.init = function(app, middleware, controllers, callback) {
		function render(req, res, next) {
			res.render('admin/plugins/sso-smugmug', {
				url: nconf.get('url')
			});
		}

		app.get('/admin/plugins/sso-smugmug', middleware.admin.buildHeader, render);
		app.get('/api/admin/plugins/sso-smugmug', render);

		callback();
	}

	SmugMug.getStrategy = function(strategies, callback) {
		meta.settings.get('sso-smugmug', function(err, settings) {
			if (!err && settings['key'] && settings['secret']) {
				passport.use(new passportSmugMug({
					consumerKey: settings['key'],
					consumerSecret: settings['secret'],
					callbackURL: nconf.get('url') + '/auth/smugmug/callback'
				}, function(token, tokenSecret, profile, done) {
					SmugMug.login(profile.id, profile.displayName, function(err, user) {
						if (err) {
							return done(err);
						}
						done(null, user);
					});
				}));

				strategies.push({
					name: 'smugmug',
					url: '/auth/smugmug',
					callbackURL: '/auth/smugmug/callback',
					icon: 'fa-camera-retro'
				});
			}

			callback(null, strategies);
		});
	};

	SmugMug.login = function(smugmugId, handle, callback) {
		SmugMug.getUid(smugmugId, function(err, uid) {
			if(err) {
				return callback(err);
			}

			if (uid !== null) {
				// Existing User
				callback(null, {
					uid: uid
				});
			} else {
				// New User
				var success = function(uid) {
					// Save smugmug-specific information to the user
					User.setUserField(uid, 'smugmugId', smugmugId);
					db.setObjectField('smugmugId:uid', smugmugId, uid);
					callback(null, {
						uid: uid
					});
				};

				// User.getUidByEmail(email, function(err, uid) {
				// 	if(err) {
				// 		return callback(err);
				// 	}

				// 	if (!uid) {
						User.create({username: handle/*, email: email*/}, function(err, uid) {
							if(err) {
								return callback(err);
							}

							success(uid);
						});
				// 	} else {
				// 		success(uid); // Existing account -- merge
				// 	}
				// });
			}
		});
	};

	SmugMug.getUid = function(smugmugId, callback) {
		db.getObjectField('smugmugId:uid', smugmugId, function(err, uid) {
			if (err) {
				return callback(err);
			}
			callback(null, uid);
		});
	};

	SmugMug.addMenuItem = function(custom_header, callback) {
		custom_header.authentication.push({
			"route": constants.admin.route,
			"icon": constants.admin.icon,
			"name": constants.name
		});

		callback(null, custom_header);
	};

	SmugMug.deleteUserData = function(uid, callback) {
		async.waterfall([
			async.apply(User.getUserField, uid, 'smugmugId'),
			function(oAuthIdToDelete, next) {
				db.deleteObjectField('smugmugId:uid', oAuthIdToDelete, next);
			}
		], function(err) {
			if (err) {
				winston.error('[sso-oauth] Could not remove SmugMug data for uid ' + uid + '. Error: ' + err);
				return callback(err);
			}
			callback();
		});
	};

	module.exports = SmugMug;
}(module));