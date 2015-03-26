var expressSession = require("express-session");
var requestJson = require("request-json");
var uuid=require('node-uuid');
var _=require('underscore');

module.exports = function attachHandlers(router) { //, passport) {
    // get requests
    router.get('/api/basketItems/Add/:productId/:qty', addItem);
    router.get('/api/basketItems/clear', clearAll);
    router.get('/api/basketItems/remove/:id', removeItem);
    router.get('/api/basketItems/', list);
};

var list = function(req, res) {

    var sess = req.session;
    if (sess.products) {
        return res.json(sess.products);
    } else {
        return res.json({});
    }
};

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

    console.log(req.params);
    var productId = req.params.productId;
    var qty=req.params.qty;

    var client = requestJson.newClient('http://127.0.0.1:5000/');


    client.get('api/products/' + productId, function(err, result, data) {

        console.log(result);
        if (err) {
            return res.send(500);
        }

        var productInfo = {
            "id" :uuid.v4(),
            "productId": data._id,
            "name": data.name,
            "price": data.offers.price,
            "description" : data.description,
            "image" : data.image,
            "qty": qty
        };


        var sess = req.session;
        if (!sess.products) {
            sess.products = new Array();
        }
        sess.products.push(productInfo);
        return res.send({
            ItemCount: sess.products.length
        });

        //return console.log(body.rows[0].title);
    });

};