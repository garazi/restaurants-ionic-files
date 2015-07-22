// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('RESTaurants', ['ionic', 'controllers', 'services', 'directives', 'uiGmapgoogle-maps', 'ngCordova'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        // if(window.cordova && window.cordova.plugins.Keyboard) {
        //   cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        // }
        // console.log(window.cordova.plugins)
        if (window.StatusBar) {
            StatusBar.styleLightContent();;
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    .state('list', {
        url: "/",
        templateUrl: 'templates/list.html',
        controller: 'ListCtrl'
    })

    .state('details', {
        url: '/details',
        templateUrl: 'templates/details.html',
        controller: 'DetailsCtrl'
    })

    .state('form', {
        url: '/form',
        templateUrl: 'templates/reviewForm.html',
        controller: 'FormCtrl'
    })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');

    $ionicConfigProvider.backButton.previousTitleText(false).text(' ');

});