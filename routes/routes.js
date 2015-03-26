  exports.attachHandlers = function attachHandlers(server) { //, passport) {

      require('../api/api.products.js')(server); //, passport);  
      require('../api/api.basketItems.js')(server); //, passport);
      require('../api/api.orders.js')(server); //, passport);
      require('../api/api.gcm.js')(server); //, passport);
      require('../api/api.payments.js')(server); //, passport);


  };