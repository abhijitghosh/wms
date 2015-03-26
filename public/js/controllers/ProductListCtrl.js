frontendApp.controller('ProductListController', function($scope, $rootScope,Products,$http,toastr,blockUI ) {

    console.log(toastr);

    Products.getAll(function(data) {

        $scope.products = data;
    });





    $scope.addtocart=function(id,qty)
    {

        $http.get('/api/basketItems/Add/' + id +'/' + qty).
            success(function(data, status, headers, config) {

                $rootScope.$emit('basketUpdate');
                toastr.success('Added Product to your cart!', 'Success');


            }).
        error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
                toastr.error('Failed to add product to cart', 'Failure');
        });



    }
});