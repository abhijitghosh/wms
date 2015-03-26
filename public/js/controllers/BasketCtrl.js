    frontendApp.controller('BasketController', function ($scope,$rootScope, BasketItems, blockUI,
    $http,toastr ) {


    $scope.refresh=function()
    {
        BasketItems.getAll(function (data) {
            blockUI.start();
            $scope.products = data;
            $scope.sum = 0;


            console.log($.isArray($scope.products));
            if ($.isArray($scope.products)) {
                $scope.products.forEach(function (item) {
                    item.unitprice = item.qty * item.price;
                    $scope.sum += item.unitprice;

                })
            }

            blockUI.stop();
        });
    }

    $scope.refresh();

    $scope.clearAll=function()
    {

        $http.get('/api/basketItems/clear').
            success(function(data, status, headers, config) {

                $scope.basketItemCount= 0;
                toastr.success('Cart Cleared', 'Success');

                $scope.refresh();


            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                toastr.error('Failed to clear cart', 'Failure');
            });



    }

    $scope.remoteItem=function(id)
    {

        $http.get('/api/basketItems/remove/' + id).
            success(function(data, status, headers, config) {

                if(!($scope.basketItemCount<=0))
                    $scope.basketItemCount=  $scope.basketItemCount-1;

                toastr.success('Product Removed', 'Success');
                $scope.refresh();


            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                toastr.error('Failed to clear cart', 'Failure');
            });



    }


    $scope.basketItemCount = BasketItems.itemCount;


    $rootScope.$on('orderfinished',function()
    {
        $scope.basketItemCount=0;
    })

    $rootScope.$on('handleItemCount', function () {
        $scope.basketItemCount = BasketItems.itemCount;
    });

    $rootScope.$on('basketUpdate', function(event, args) {

         console.log('basketUpdate');


        $scope.basketItemCount= (angular.isUndefined($scope.basketItemCount)?0:$scope.basketItemCount)+1;
    });


});