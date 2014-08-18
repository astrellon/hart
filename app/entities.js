var itemModel = require('./models/item')
  , userModel = require('./models/user');

var itemRoute = require('./routes/items')
  , uploadRoute = require('./routes/uploads');

module.exports = function(app) {
    var entities = {
        model: {
            item: itemModel,
            user: userModel
        },
        routes: {
            item: itemRoute,
            upload: uploadRoute
        }
    };
    app.set('entities', entities);
}
