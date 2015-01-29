// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var db = null;
angular.module('starter', ['ionic', 'starter.controllers','ngCordova','ngSanitize'])

.run(function($ionicPlatform,$cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
   
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      
    }

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    db = $cordovaSQLite.openDB({ name: "dev.db" });
    $cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS contact(id integer primary key,nickname text,phone text,github text)");
    
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    
  })

  .state('app.add',{
      url:"/add",
      views:{
        'menuContent':{
          templateUrl:"templates/add.html",
          controller:'AddCtrl'
        }
      }
    })

    .state('app.contactlist',{
      url:"/contactlist",
      views:{
        'menuContent':{
          templateUrl:"templates/contactlist.html",
          controller:'ContactListCtrl'
        }
      }
    })
     .state('app.contact',{
      url:"/contactlist/:contactId",
      views:{
        'menuContent':{
          templateUrl:"templates/contact.html",
          controller:'ContactCtrl'
        }
      }
    });
    
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/contactlist');
});
