angular.module('controllers', [])

.controller('ListCtrl', function($rootScope, $scope, $http, $cordovaGeolocation, $ionicPlatform, restaurantService) {

    $scope.restaurants;
    $scope.hideSpinnerClass;

    //attach service function to scope
    $scope.setSelected = restaurantService.setSelected;

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

    $rootScope.$on('refreshList', function() {
        $scope.getRestaurants();
    })

})

.controller('DetailsCtrl', function($rootScope, $scope, $http, restaurantService) {

    $scope.restaurant;
    $scope.reviews;
    $scope.stars;
    $scope.map;
    $scope.restID;
    $scope.userLocation;
    $scope.markerOptions;
    $scope.restID;
    $scope.hideReviewsClass = "hidden";
    $scope.hideSpinnerClass;

    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.restaurant = restaurantService.getSelected();
        $scope.restID = $scope.restaurant.restID;
        $scope.userLocation = {
            latitude: $scope.restaurant.location.latitude,
            longitude: $scope.restaurant.location.longitude
        }

        $scope.map = {
            center: $scope.userLocation,
            zoom: 15
        };
        $scope.markerOptions = {
            animation: google.maps.Animation.DROP
        };
    });

    $scope.$on('$ionicView.enter', function() {
        getReviews($scope.restID);
    })

    var getReviews = function(restID) {
        $http.get('http://localhost:10010/restaurants/' + restID + '/reviews?limit=999&ql=order by modified DESC')
            .success(function(data, status, headers, config) {
                $scope.hideSpinnerClass = "hidden";                
                $scope.reviews = data.entities;
                if ($scope.reviews.length <= 0) {
                    $scope.hideReviewsClass = false;
                }
            });
    };

    $scope.getRating = function(ratingIndex) {
        var rating = parseInt($scope.reviews[ratingIndex].rating);
        return new Array(rating)
    };

        // refresh restaurant list whenever we enter this view
    $scope.$on('$ionicView.beforeLeave', function() {
      $rootScope.$broadcast("refreshList");
    }, false);

})
