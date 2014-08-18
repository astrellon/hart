module.exports = function(app, appPath) {
    var entities = app.get('entities');

    app.get(appPath, function(req, res) {
        entities.model.item.find({}, function(err, items) {
            res.render('items.ejs', {
                items: items,
                error: err,
                auth: req.isAuthenticated()
            });
        })
    });
}

