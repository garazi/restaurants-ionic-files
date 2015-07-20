angular.module('controllers', [])

.controller('ListCtrl', function($rootScope, $scope, $http, $cordovaGeolocation, $ionicPlatform, restaurantService) {

    $scope.restaurants;
    $scope.hideSpinnerClass;  

    //attach service function to scope
    $scope.setSelected = restaurantService.setSelected;

    $scope.getRestaurants = function(userLat, userLong) {
        var posOptions = {
            timeout: 10000,
            maximumAge: 30000,
            enableHighAccuracy: false
        };

        $cordovaGeolocation.getCurrentPosition(posOptions)
            .then(function(position) {
                var userLat = position.coords.latitude
                var userLong = position.coords.longitude
                console.log('lat', userLat);
                console.log('long', userLong);
                restaurantsLookup(userLat, userLong)
            }, function(error) {
                console.log('error:', JSON.stringify(error));
                var userLat = 33.313542;
                var userLong = -112.075483;
                restaurantsLookup(userLat, userLong);
            });

        function restaurantsLookup(userLat, userLong) {
            $http.get('http://grewis-test.apigee.net/api-mobile-app/yelp?ll=' + userLat + ',' + userLong)
                .success(function(data, status, headers, config) {
                    console.log('Data: ' + JSON.stringify(data));
                    $scope.restaurants = data.entities;
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.hideSpinnerClass = "hidden";  
                });
        };
    };
    $scope.getRestaurants();
    $ionicPlatform.ready(function() {
        $scope.getRestaurants();
        console.log('ready');
    });

    $rootScope.$on('refreshList', function () {
      $scope.getRestaurants();
    })

})