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
                var userLat = position.coords.latitude;
                var userLong = position.coords.longitude;
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
                    window.localStorage.setItem('list', JSON.parse($scope.restaurants));
                })
                .error(function(data, status, headers, config) {
                    console.log('Loading saved data');
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.hideSpinnerClass = "hidden";
                    $scope.restaurants = JSON.parse(window.localStorage.getItem('list'));
                });
        };
    };

    $ionicPlatform.ready(function() {
        $scope.getRestaurants();
        console.log('ready');
    });

    $rootScope.$on('refreshList', function () {
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

.controller('FormCtrl', function($scope, $http, $ionicHistory, restaurantService) {
    $scope.restaurant;
    $scope.restID;

    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.restaurant = restaurantService.getSelected();
        $scope.restID = $scope.restaurant.restID;
    });

    $scope.createReview = function(review) {
        var payload = {
            restID: $scope.restID,
            title: review.title,
            reviewer: review.name,
            rating: +review.rating,
            body: review.body
        }
        $http.post('http://localhost:10010/reviews', payload)
            .success(function(data, status, headers, config) {
                review.title = null;
                review.name = null;
                review.rating = null;
                review.body = null;
                $ionicHistory.goBack();
            })
    }
});
