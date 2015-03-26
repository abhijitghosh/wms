/**
 * Created by social on 3/24/2015.
 */


var expressSession = require("express-session");
var requestJson = require("request-json");
var uuid=require('node-uuid');
var _=require('underscore');
var db=require('../db/db.gcm.js')

module.exports = function attachHandlers(router) { //, passport) {
    // get requests
    router.post('/api/device/Add', addItem);
   // router.get('/api/device/Remove', removeItem);
    router.get('/api/device/list', list);

};


var list = function(req, res) {

    db.getAll(function(data) {
        res.json(data);
    });
};


var addItem=function(req,res)
{

    var data=req.body;
    console.log( req.body);


    db.insert(data,function(inserted)
    {
        console.log(inserted);

        return res.send({
            inserted: true
        });
    })
}