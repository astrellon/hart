module.exports = function(app, appPath) {
    var entities = app.get('entities');

    var imageRegex  =/^image/;

    function renderItems(auth, id, req, res) {
        entities.model.item.find({ owner: id }, function(err, items) {
            if (items) {
                for (var i = items.length - 1; i >= 0; i--) {
                    var item = items[i];
                    // Can probably do this kind of culling in the mongoose find request.
                    if (!item.mimeType || !imageRegex.test(item.mimeType)) {
                        items.splice(i, 1);
                        continue;
                    }

                    item.loadUrl = '/uploads/' + item.owner + '/' + item.uploadedFilename;
                }
            }
            res.render('items.ejs', {
                items: items,
                error: err,
                auth: auth,
                user: req.user,
                redirect: 'item'
            });
        })
    }

    app.get(appPath, function(req, res) {
        if (!req.isAuthenticated() || !req.session || !req.session.passport) {
            return res.redirect('/');
        }

        renderItems(true, req.session.passport.user, req, res);
    });
    app.get(appPath + '/user/:id', function(req, res) {
        var id = req.params.id;
        var auth = req.session && 
            req.session.passport && 
            req.session.passport.user == id &&
            req.isAuthenticated();


        renderItems(auth, id, req, res);
    });

    app.put(appPath + '/:id', function(req, res) {
        res.status(200);
        entities.model.item.update({
            '_id': req.params.id
        }, req.body).exec(function(err) {
            res.json({
                result: err
            });
        });
    });

    function grabItem(req, res, next) {
        var id = req.params.id;
        entities.model.item.findOne({'_id': id}, function(err, item) {
            req.item = item;
            next();
        });
    }

}

