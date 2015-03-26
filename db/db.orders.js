var mongoHandler = require("./db.client.js");
var collectionName = "orders";
var MongoClient = require('mongodb').MongoClient;
var barcode = require('barcode');
var path = require('path');
var uuid = require('node-uuid');

var url = 'mongodb://localhost:27017/ecommerce';
exports.getById = function (id, callback) {
    if (callback === null || typeof(callback) !== "function") {
        throw "Call to db method must include callback function"
    }
    var mongoclient = mongoHandler.getDbClient();
    // Open the connection to the server
    MongoClient.connect(url, function (err, mongoclient) {
        var dbName = mongoHandler.dbName();
        var db = mongoclient.db(dbName);
        var mongoId;
        try {
            mongoId = mongoHandler.makeObjectID(id);
        } catch (e) {
            console.log(e);
            return callback(e);
        }
        console.log("id:" + mongoId);
        db.collection(collectionName).findOne({
            "_id": mongoId
        }, function (err, result) {
            mongoclient.close();
            if (err) {
                callback(err);
                return;
            } else {
                // Close the connection
                return callback(result);
            }
        });
    });
};


exports.itembybarcode = function (id, callback) {
    if (callback === null || typeof(callback) !== "function") {
        throw "Call to db method must include callback function"
    }
    var mongoclient = mongoHandler.getDbClient();
    // Open the connection to the server
    MongoClient.connect(url, function (err, mongoclient) {
        var dbName = mongoHandler.dbName();
        var db = mongoclient.db(dbName);
        /* var mongoId;
         try {
         mongoId = mongoHandler.makeObjectID(id);
         } catch (e) {
         console.log(e);
         return callback(e);
         }
         console.log("id:" + mongoId);*/
        db.collection(collectionName).findOne({
            "shipping.barcode.id": id
        }, function (err, result) {
            mongoclient.close();
            if (err) {
                callback(err);
                return;
            } else {
                // Close the connection
                return callback(result);
            }
        });
    });
}

exports.assignperson = function (req, callback) {

    if (callback === null || typeof(callback) !== "function") {
        throw "Call to db method must include callback function"
    }
    var mongoclient = mongoHandler.getDbClient();
    MongoClient.connect(url, function (err, mongoclient) {

        if (err) {
            mongoclient.close();
            throw err.Message;
            return;
        }

        var dbName = mongoHandler.dbName();
        var db = mongoclient.db(dbName);
        console.log(dbName + "." + collectionName);


        var id = mongoHandler.makeObjectID(req.params.id)

        console.log(id);

        db.collection(collectionName).update(
            {_id: id}, {
                $set: {
                    "shipping.tracking.deliveryperson": req.params.personid
                }
            }, function (err, result) {
                if (err) {

                    console.log(err);
                    mongoclient.close();
                    throw err.Message;
                    return;
                } else {

                  //  console.log(result);
                    return callback(result);


                }
            });

    });
}


exports.listmydelivery = function (id, callback) {
    if (callback === null || typeof(callback) !== "function") {
        throw "Call to db method must include callback function"
    }
    var mongoclient = mongoHandler.getDbClient();
    MongoClient.connect(url, function (err, mongoclient) {

        if (err) {
            mongoclient.close();
            throw err.Message;
            return;
        }

        var dbName = mongoHandler.dbName();
        var db = mongoclient.db(dbName);
        console.log(dbName + "." + collectionName);

        var option = {"sort": [['created_on', -1]]};


        db.collection(collectionName).find({'shipping.tracking.deliveryperson': id}, option, function (err, result) {
            if (err) {
                mongoclient.close();
                throw err.Message;
                return;
            } else {
                result.toArray(function (err, resultArray) {
                    // Close the connection
                    console.log(err);
                    mongoclient.close();

                    console.log("Got data: " + resultArray.length + " records.");
                    return callback(resultArray);

                });
            }
        })
    });


}

exports.listmyorders = function (id, callback) {
    if (callback === null || typeof(callback) !== "function") {
        throw "Call to db method must include callback function"
    }
    var mongoclient = mongoHandler.getDbClient();
    MongoClient.connect(url, function (err, mongoclient) {

        if (err) {
            mongoclient.close();
            throw err.Message;
            return;
        }

        var dbName = mongoHandler.dbName();
        var db = mongoclient.db(dbName);
        console.log(dbName + "." + collectionName);

        var option = {"sort": [['created_on', -1]]};


        db.collection(collectionName).
            find({'customer.accountno': id},
            option, function (err, result) {
                if (err) {
                    mongoclient.close();
                    throw err.Message;
                    return;
                } else {
                    result.toArray(function (err, resultArray) {
                        // Close the connection
                        console.log(err);
                        mongoclient.close();

                        console.log("Got data: " + resultArray.length + " records.");
                        return callback(resultArray);

                    });
                }
            })
    });
}

exports.linkPaymenttoOrder = function (payment, callback) {
    if (callback === null || typeof(callback) !== "function") {
        throw "Call to db method must include callback function"
    }
    var mongoclient = mongoHandler.getDbClient();
    MongoClient.connect(url, function (err, mongoclient) {

        if (err) {
            mongoclient.close();
            throw err.Message;
            return;
        }

        var dbName = mongoHandler.dbName();
        var db = mongoclient.db(dbName);
        console.log(dbName + "." + collectionName);

        console.log(payment.orderid);


        var id = mongoHandler.makeObjectID(payment.orderid)

        db.collection(collectionName).update(
            {_id: id}, {
                $set: {payment: payment}
            }, function (err, result) {
                if (err) {

                    console.log(err);
                    mongoclient.close();
                    throw err.Message;
                    return;
                } else {

                    console.log(result);
                    return callback(result);


                }
            });
    });

}


exports.getAll = function (callback) {
    if (callback === null || typeof(callback) !== "function") {
        throw "Call to db method must include callback function"
    }
    var mongoclient = mongoHandler.getDbClient();
    MongoClient.connect(url, function (err, mongoclient) {

        if (err) {
            mongoclient.close();
            throw err.Message;
            return;
        }

        var dbName = mongoHandler.dbName();
        var db = mongoclient.db(dbName);
        console.log(dbName + "." + collectionName);

        db.collection(collectionName).find({}, function (err, result) {
            if (err) {
                mongoclient.close();
                throw err.Message;
                return;
            } else {
                result.toArray(function (err, resultArray) {
                    // Close the connection
                    mongoclient.close();

                    console.log("Got data: " + resultArray.length + " records.");
                    return callback(resultArray);

                });
            }
        });
    });
};


exports.insert = function (data, callback) {


    var mongoclient = mongoHandler.getDbClient();
    MongoClient.connect(url, function (err, mongoclient) {


        if (err) {
            mongoclient.close();
            throw err.Message;
            return;
        }

        var dbName = mongoHandler.dbName();
        var db = mongoclient.db(dbName);
        var uid = new Date().valueOf().toString();
        console.log(dbName + "." + collectionName);

        var code39 = barcode('code39', {
            data: uid,
            width: 400,
            height: 100
        });
        var outfile = path.join(__dirname, '/../public/img', uid + '.png');

        console.log('uid' + uid)
        code39.saveImage(outfile, function (err) {
            if (err) throw err;

            console.log('File has been written!');
        });

        //    data._id=uid;
        data.shipping.barcode = {id: uid, filepath: '/img/' + uid + '.png'};
        db.collection(collectionName).insert(data, function (err, result) {
            if (err) {
                console.log(err);
                mongoclient.close();
                throw err.Message;
                return;
            } else {

                mongoclient.close();
                return callback(result);
            }

        });
    });
};