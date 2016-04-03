// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'jett.ionic.filter.bar', 'ngCordova', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function($cordovaSplashscreen) {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    
   /*  setTimeout(function() {
       $cordovaSplashscreen.hide()
     }, 3000);*/

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    Parse.initialize("nKHMuBAtrvQPDbGmmXDfqrOCloh92L5u3uif8OPA",
                    "186FSkeCcmLJ5kGtUV7212MASXq3X1PQQAXQMpV5");

  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.tabs.position('bottom');

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  
  .state('developers', {
    url: '/developers',
    templateUrl: 'templates/developers.html',
    controller: 'DevelopersCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.entry', {
    url: '/entry',
    views: {
      'tab-entry': {
        templateUrl: 'templates/tab-entry.html',
        controller: 'EntryCtrl'
      }
    }
  })

  .state('tab.challan', {
    url: '/challan',
    views: {
      'tab-challan': {
        templateUrl: 'templates/tab-challan.html',
        controller: 'ChallanCtrl'
      }
    }
  })

  .state('tab.stolen', {
      url: '/stolen',
      views: {
        'tab-stolen': {
          templateUrl: 'templates/tab-stolen.html',
          controller: 'StolenCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/stolen/:chatId',
      views: {
        'tab-stolen': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.search', {
    url: '/search',
    views: {
      'tab-search': {
        templateUrl: 'templates/tab-search.html',
        controller: 'SearchCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/entry');

});
