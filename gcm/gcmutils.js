/**
 * Created by social on 3/24/2015.
 */


var gcm = require('node-gcm');

var message = new gcm.Message();

var db=require('../db/db.gcm.js');


var regIds=[]; //['APA91bGtZxETeN2NMRPFXLUnX_dSNYmCR2l1Y5F_s7m8uKn1Hw04E6l1LRspuQ1L6tDlLYb37EJppYcjyg8D67Vcn6RxY547K9Eklo-8roYLvAu81_pX03thD4YAilT_BqGpU4wZJaRKjDdU_W0aPLlGIWe84Em6ObFGLlrBc8zEHez6dYBcmt0'];

var sender = new gcm.Sender('AIzaSyBXtapOII781UZTwNlt-74GY-D7AxFMIbc');


exports.sendMessageToApp=function(type,msg)
{
    message.addData(type,msg);

    db.getAll(function(devices)
    {
        if(regIds)
        regIds=[];
        devices.forEach(function(device)
        {
            regIds.push(device.regid);
        })

        sender.send(message, regIds, function (err, result) {
            if(err) console.log(err);
            else    console.log(result);
        });


    })


}
