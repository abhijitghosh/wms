var express = require('express'),
 bodyParser     =        require("body-parser"),
 session = require('express-session'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session');

var routes = require('./routes/routes.js');
var MongoStore = require('connect-mongo')({
    session: session
});


createServer = function createServer() {

    var server = express();
    // specify middleware 
    server.use(bodyParser.json({limit: '500mb'}));
    server.use(bodyParser.urlencoded({extended: false}));
    server.use(express.static(__dirname + '/public'));
    server.use('/product/*', express.static(__dirname + '/public'));
    server.use('/basket/', express.static(__dirname + '/public'));

    server.use(cookieParser());
    server.use(session({
        secret: 'mdfkldfgkl&*(sas/d,asldsjf()*)(mlksdmfNfjSDsdfYUHNn',
       saveUninitialized: false,
       resave: false,


    }));


    // attach router handlers
    routes.attachHandlers(server); //, passport);

    return server;

};


var server = createServer();
var port = Number(process.env.PORT || 8080);
server.listen(port, function() {
    console.log("Listening on " + port);
});
