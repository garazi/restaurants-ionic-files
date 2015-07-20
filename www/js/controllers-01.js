angular.module('controllers', [])

.controller('ListCtrl', function($rootScope, $scope, $http, $cordovaGeolocation, $ionicPlatform) {

    $scope.restaurants;
    $scope.hideSpinnerClass;  

    $scope.getRestaurants = function(userLat, userLong) {
        $http.get('http://localhost:10010/restaurants')
                .success(function(data, status, headers, config) {
                    console.log('Data: ' + JSON.stringify(data));
                    $scope.restaurants = data.entities;
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.hideSpinnerClass = "hidden";  
                });
    };

    $ionicPlatform.ready(function() {
        $scope.getRestaurants();
        console.log('ready');
    });

    $rootScope.$on('refreshList', function () {
      $scope.getRestaurants();
    })

})