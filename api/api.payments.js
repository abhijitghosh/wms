/**
 * Created by social on 3/24/2015.
 */


var expressSession = require("express-session");
var requestJson = require("request-json");
var uuid=require('node-uuid');
var _=require('underscore');
var db=require('../db/db.payment.js')
var gcmclient=require('../gcm/gcmutils.js')
var orderdb=require('../db/db.orders.js');

module.exports = function attachHandlers(router) { //, passport) {
    // get requests
    router.post('/api/payments/Add', addItem);
    router.get('/api/payments/Confirm/:id', confirm);


};

var addItem=function(req,res)
{
    console.log('add payment initiated');
    var data=req.body;
    console.log( req.body);


    db.insert(data,function(inserted)
    {
     //   console.log(inserted);


        orderdb.linkPaymenttoOrder(data,function(updated)
        {

            gcmclient.sendMessageToApp('PaymentAdded',data);
            return res.send({
                inserted: true
            });

        })

    })
}


var confirm=function(req,res)
{
    console.log('confirm payment initiated');
    var id=req.params.id;



    db.confirmPayment(id,function(inserted)
    {
     //   console.log(inserted);

        return res.send({
            confirmed: true
        });
    })
}