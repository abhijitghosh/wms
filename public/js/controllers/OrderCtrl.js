frontendApp.controller('OrderController', function ($scope,$rootScope, BasketItems, blockUI,Orders,
$http,toastr,$routeParams  ) {


    console.log('OrderController')

    $scope.refresh=function()
    {

        console.log('refresh');
        console.log($routeParams );
        Orders.getOrder($routeParams.id,function (data) {
            blockUI.start();
            $scope.order = data;

            blockUI.stop();
        });





    }

    $scope.refresh();



    $scope.addOrder=function(id)
    {

        blockUI.start();

        $http({
            url: '/api/orders/Add',
            method: "POST",
            data: angular.toJson($scope.order)
            })
            .success(function(response) {
                // success
                toastr.success('Order Added', 'Success');
                $rootScope.$emit('orderfinished');

                console.log(response);
            }).error(
            function(response) { // optional
                // failed
                console.log(response);
            }
        );

        blockUI.stop();


    }





});