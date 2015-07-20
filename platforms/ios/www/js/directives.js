angular.module('directives', [])
  .directive('reviews', function() {
    return {
      restrict: 'E',
      scope: false,
      templateUrl: 'templates/reviews.html'
    };
  })
