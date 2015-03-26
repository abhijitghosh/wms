frontendApp.controller('OrderListCtrl', function ($scope,$rootScope, Orders, blockUI,
$http,toastr ) {


    $scope.date=new Date();
    $scope.refresh=function()
    {
        Orders.getAll(function (data) {
            blockUI.start();
            $scope.orders = data;

            $scope.orders.forEach(function(order)
            {
                order.url='#/order/' + order._id;
                order.track='#/track/' + order._id;
                console.log(order);
            })
            blockUI.stop();
        });
    }


    $scope.assign=function(id,assignid)
    {
        blockUI.start();
        Orders.assign(id,assignid,function(res)
        {

            blockUI.stop();


            toastr.success('Delivery Order has been assigned', 'Success');


        })



    }

    $scope.refresh();







});