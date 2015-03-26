    // public/js/appRoutes.js
frontendApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/views/orders.html',
                controller: 'OrderListCtrl'
            })
            .when('/order/:id', {
            templateUrl: '/views/order.html',
            controller: 'OrderController'
        })
            .when('/track/:id', {
                templateUrl: '/views/flow.html',
                controller: 'flowctrl'
            })


           /* .when('/product/:id', {
                templateUrl: '/views/product-details.html',
                controller: 'ProductDetailsController'
            })
            .when('/basket', {
                templateUrl: '/views/basket.html',
                controller: 'BasketController'
            }).
            .when('/orders',{
                templateUrl :'/views/orders.html',
                controller:'OrderListCtrl'

            })*/

            .otherwise({
            redirectTo: '/'
        });



       // $locationProvider.html5Mode(true);
    }
]);