var db = require("../db/db.products.js");

// define the routes for /api/users
module.exports = function attachHandlers(router) { //, passport) {
    // get requests
    router.get('/api/products/seed', seed);
    router.get('/api/products', list);
    router.get('/api/products/:id', view);
};


function list(req, res) {
    db.getAll(function(data) {
        res.json(data);
    });
}

function seed(req, res) {
    db.insert({
        "name": "Samsung Galaxy Grand 2 Black",
        "description": "Samsung Galaxy Grand 2 is driven by the latest Quad-Core 1.2 GHz processor and comes with Android v4.3 Jelly Bean operating system.",
        "minPrice": 259.99,
        "image" :'http://n4.sdlcdn.com/imgs/a/j/0/Samsung-Galaxy-Grand-2-Black-SDL175350551-1-64a6b.jpg',
        "offers": {
            "price": 239.99,
            "stock": 100
        }
    });
    db.insert({
        "name": "LG Google Nexus 5 16 GB (Black)",
        "description": "The LG Google Nexus 5 sports a 4.95-inch Full HD IPS touchscreen that lets users enjoy images and videos in a way like never before. It supports capacitive touch that functions quite smoothly and you will have a great time while accessing the plethora of pre-installed applications. The Corning Gorilla Glass 3 makes the screen sturdy and capable enough to withstand daily wear and tear.",
        "minPrice": 459.99,
        "offers": {
            "price": 419.99,
            "stock": 10
        }
    });
    db.insert({
        "name": "HTC Desire 816G Blue",
        "description": "Designed to give you an ultimate viewing experience, this HTC dual sim smartphone comes with 5.5 inch HD display screen. You can watch movies, view photos and navigate through different applications easily on this device",
        "minPrice": 349.99,
        "offers": {
            "price": 341.99,
            "stock": 10
        }
    });
    res.json({
        "Status": "OK"
    });
}

function view(req, res) {
    db.getById(req.params.id, function(err, data) {
        if (err) {
            console.log(err);
            res.statusCode = 500;
            return res.json({
                "Error": err
            });
        } else {
            return res.json(data);
        }
    });
}
