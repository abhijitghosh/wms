var expressSession = require("express-session");
var requestJson = require("request-json");
var uuid=require('node-uuid');
var _=require('underscore');
var db = require("../db/db.orders.js");

module.exports = function attachHandlers(router) { //, passport) {
    // get requests
    router.post('/api/orders/Add', addItem);
    router.get('/api/orders/clear', clearAll);
    router.get('/api/orders/remove/:id', removeItem);
    router.get('/api/orders/', list);
    router.get('/api/orders/dtl/:id', listdtl);
    router.get('/api/orders/:id',listmyorders);
    router.get('/api/orders/delivery/:id',listmydelivery);
    router.get('/api/orders/barcode/:id',itembybarcode);
    router.get('/api/orders/assign/:id/:personid',assignperson);

};


var assignperson = function(req, res) {


    console.log(req.params.id);

    console.log(req.params.personid);

    db.assignperson(req,function(data) {
        res.json(data);
    });
}


var itembybarcode = function(req, res) {

    db.itembybarcode(req.params.id,function(data) {
        res.json(data);
    });
}


var listdtl = function(req, res) {

    db.getById(req.params.id,function(data) {
        res.json(data);
    });
}


var list = function(req, res) {

    db.getAll(function(data) {
        res.json(data);
    });
}

var listmyorders=function(req,res)
{

    db.listmyorders(req.params.id,function(data) {
        res.json(data);
    });


}

var listmydelivery=function(req,res)
{
    db.listmydelivery(req.params.id,function(data) {
        res.json(data);
    });


}

var removeItem=function(req,res)
{

  console.log("remove " + req.params.id);
  req.session.products= _.reject(req.session.products,function(item)
  {
      return item.id==req.params.id;
  })
    return res.send({
        removed: true
    });

}


var clearAll=function(req,res)
{
    req.session.products=[];

    return res.send({
        cleared: true
    });


}
var addItem = function(req, res) {


   var data=req.body;
    console.log( req.body);


    db.insert(data,function(inserted)
    {
        console.log(inserted);
        req.session.products=[];
        return res.send({
            inserted: true
        });
    })

};