var fs = require('fs');
var path = require('path');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function(app, appPath) {
    var entities = app.get('entities');
    function processUpload(req, res) {

        var image = req.files.image;

        var origPath = image.path;
        var base = path.basename(origPath);

        // Upload to the users folder.
        var dir = app.get('loc') + '/public/uploads/' + req.session.passport.user;

        function cleanupTemp() {
            fs.unlink(origPath, function(err) {
                if (err) {
                    console.log('Error removing temp file: ', origPath, err);
                }
            });
        }

        if (!req.isAuthenticated()) {
            cleanupTemp();
            res.redirect(appPath);
            return;
        }

        fs.mkdir(dir, function(err) {
            // If the folder already exists then ignore the error.
            if (err && err.code !== 'EEXIST') {
                console.log("Error making dir: ", err);
                cleanupTemp();
                res.redirect(appPath);
                return;
            }
            var full = dir + '/' + base ;
            fs.rename(origPath, full, function(err) {
                if (err) {
                    console.log("Error renaming: ", err);
                    cleanupTemp();

                    req.flash('uploadErrorMessage', 'Error retrieving uploaded file: ' + err);
                    res.redirect(appPath);
                    return;
                }

                // Success
                var newItem = new entities.model.item();
                newItem.text = 'No description.';
                newItem.owner = req.session.passport.user.toString();
                newItem.timestamp = new Date();

                newItem.uploadedFilename = base;
                newItem.originalFilename = image.name;
                newItem.filesize = image.size;
                newItem.mimeType = image.type;

                newItem.save(function(err) {
                    if (err) {
                        // Error :(
                        req.flash('uploadErrorMessage', 'Error saving item to database: ' + err);
                    }
                    else {
                        req.flash('uploadMessage', 'Uploaded successfully.');
                    }
                    res.redirect(appPath);
                })
            });
        });
    }

    // route middleware to ensure user is logged in
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        res.redirect(appPath);
    }

    app.post(appPath, multipartMiddleware, processUpload);
    app.get(appPath, function(req, res) {
        res.render('upload.ejs', {
            auth: req.isAuthenticated(),
            message: req.flash('uploadMessage'),
            errorMessage: req.flash('uploadErrorMessage'),
            user: req.user
        });
    });
}

