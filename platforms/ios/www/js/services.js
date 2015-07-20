angular.module('services', [])

.service('restaurantService', function() {
  var selectedRestaurant;
  var userLocation = {}

  var setSelected = function(restaurant) {
      selectedRestaurant = restaurant;
  };

  var getSelected = function(){
      return selectedRestaurant;
  };

  return {
    setSelected: setSelected,
    getSelected: getSelected
  };

});
