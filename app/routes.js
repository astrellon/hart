module.exports = function(app, passport) {
    var entities = app.get('entities');

// normal routes ===============================================================

	// show the home page (will also have our login links)
	app.get('/', function(req, res) {
		res.render('index.ejs', {
            auth: req.isAuthenticated()
        });
	});

	// PROFILE SECTION =========================
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user,
            auth : true
		});
	});

    app.get('/profile/:id', function(req, res) {
        var auth = req.session && 
            req.session.passport && 
            req.session.passport.user == req.params.id &&
            req.isAuthenticated();

        entities.model.user.findOne({ '_id': req.params.id }, function(err, user) {
            res.render('profile.ejs', {
                user : user,
                auth : auth
            });
        });
    });

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

    // Handle goto queries for redirecting after a process completes.
    function handleGoto(req, res, next) {
        if (req.query.goto) {
            var goto = req.query.goto;
            if (goto.length > 0) {
                if (goto[0] !== '/') {
                    goto = '/' + goto;
                }
                req.flash('redirectTo', goto);
            }
        }
        next();
    }

    // show the login form
    app.get('/login', handleGoto, function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', function(req, res, next) {
       passport.authenticate('local-login', function(err, user, info) {
           if (err) {
               return next(err);
           }

           if (!user) {
               return res.redirect('/login');
           }

           req.logIn(user, function(err) {
               if (err) {
                   return next(err);
               }

               var gotoRedirect = req.flash('redirectTo');
               if (gotoRedirect.length > 0) {
                   return res.redirect(gotoRedirect[0]);
               }
               return res.redirect('/profile');
           });
       })(req, res, next);
   });

    // show the signup form
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { 
            message: req.flash('signupMessage')
        });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // login locally --------------------------------
    app.get('/connect/local', function(req, res) {
        res.render('connect-local.ejs', { message: req.flash('loginMessage') });
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
        
	// unlink local -----------------------------------
	app.get('/unlink/local', isLoggedIn, function(req, res) {
		var user            = req.user;
		user.local.email    = undefined;
		user.local.password = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

    entities.routes.upload(app, '/upload');
    entities.routes.item(app, '/item');
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
    }

	res.redirect('/');
}

