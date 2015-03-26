var mongoHandler = require("./db.client.js");
var collectionName = "payments";
var MongoClient = require('mongodb').MongoClient;
var uuid = require('node-uuid');
var accounts=require('./db.account');


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

    console.log(data);
    var mongoclient = mongoHandler.getDbClient();
    MongoClient.connect(url, function (err, mongoclient) {


        if (err) {
            mongoclient.close();
            throw err.Message;
            return;
        }

        var dbName = mongoHandler.dbName();
        var db = mongoclient.db(dbName);

        //    data._id=uid;
        db.collection(collectionName).insert(data, function (err, result) {
            console.log(err);
//            console.log(result);

            if (err) {
                console.log(err);
                mongoclient.close();
                throw err.Message;
                return;
            } else {

  //              console.log(result);
                mongoclient.close();



                return callback(result);
            }

        });


    });
};



exports.confirmPayment=function(id,callback)
{

    var mongoclient = mongoHandler.getDbClient();
    MongoClient.connect(url, function (err, mongoclient) {


        if (err) {
            mongoclient.close();
            throw err.Message;
            return;
        }

        var dbName = mongoHandler.dbName();
        var db = mongoclient.db(dbName);

        //    data._id=uid;
        db.collection(collectionName).update
        (
            {_id:mongoHandler.makeObjectID(id)},

            {'payment.status':'completed'},
            function (err, result) {
            console.log(err);
//            console.log(result);

            if (err) {
                console.log(err);
                mongoclient.close();
                throw err.Message;
                return;
            } else {

                //              console.log(result);
                mongoclient.close();
                return callback(result);
            }

        });


    });



}