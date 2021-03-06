var mongoHandler = require("./db.client.js");
var collectionName = "account";
var MongoClient = require('mongodb').MongoClient;
var uuid = require('node-uuid');
var paymentdb = require('./db.payment.js')

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
         //   console.log(result);

            if (err) {
                console.log(err);
                mongoclient.close();
                throw err.Message;
                return;
            } else {

               // console.log(result);
                mongoclient.close();
                return callback(result);
            }

        });


    });
};


exports.debitBalance = function (accountno, newbal, callback) {

    MongoClient.connect(url, function (err, mongoclient) {


        if (err) {
            mongoclient.close();
            throw err.Message;
            return;
        }

        var dbName = mongoHandler.dbName();
        var db = mongoclient.db(dbName);

        db.collection(collectionName).update({"accountno": accountno},
            {"balance": newbal}, function (result) {

                callback(null, result);


            });
    });


}

exports.debitAccount = function (accountno, amount, orderid, deliverypersonid,
                                 callback) {
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
        db.collection(collectionName).find({accountno: accountno}, function (err, result) {
            if (err) {
             //   mongoclient.close();
                throw err.Message;
                return;
            } else {
                result.toArray(function (err, resultArray) {
                    // Close the connection

                    if (resultArray.length > 0)
                        if (parseFloat(resultArray[0].balance) - parseFloat(amount) > 0) {

                            //create a entry for the payment  for pod

                            var payment = {
                                orderid: orderid,
                                accountno: accountno,
                                amount: amount,
                                created_on: new Date(),
                                deliveryperson: deliverypersonid
                            }

                            paymentdb.insert(payment, function (err, res) {

                                if (err) {
                                    mongoclient.close();
                                    callback(err, null);
                                }
                                else {


                                    this.debitBalance(accountno,
                                        parseFloat(resultArray[0].balance) - parseFloat(amount),
                                        function (err, result) {


                                            callback(result);

                                        });


                                }


                            })


                        }


                    return callback(resultArray);

                });
            }
        });


    });
}