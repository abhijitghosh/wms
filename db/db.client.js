
var mongo = require("mongodb");
var MongoClient = mongo.MongoClient,
    Server = require('mongodb').Server,
    ObjectID = mongo.ObjectID;


exports.getDbClient = function() {
    return new MongoClient(new Server("127.0.0.1", 27017), {
        native_parser: true
        , auto_reconnect: true  
    });
};

exports.dbName = function() {
    return "ecommerce";
};

exports.makeObjectID = function(id) {
    return new ObjectID(id);
};
