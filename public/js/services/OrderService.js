frontendApp.factory('Orders', ['$http', '$rootScope',
    function($http, $rootScope) {
        var Orders = {};



        Orders.getAll = function(callback) {
            caller = this;
            $http({
                method: 'get',
                url: '/api/orders/'
            }).success(function(data) {


                callback(data);
            }).error(function() {
              //  alert("error");
            });
        };



        Orders.getOrder = function(id,callback) {
            caller = this;
            $http({
                method: 'get',
                url: '/api/orders/dtl/'+id
            }).success(function(data) {


                callback(data);
            }).error(function() {
               // alert("error");
            });
        };



        Orders.assign = function(id,assignid,callback) {
            caller = this;
            $http({
                method: 'get',
                url: '/api/orders/assign/'+id +"/" + assignid
            }).success(function(data) {


                callback(data);
            }).error(function() {
                //  alert("error");
            });
        };



        return Orders;
    }
]);