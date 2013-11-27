'use strict';


// Declare app level module which depends on filters, and services
// the [] array is for dependency injections
angular.module('csApp', [
  'ngRoute',
  'ngResource',
  'csApp.filters',
  'csApp.services',
  'csApp.directives',
  'csApp.controllers',

  // third party
  'uiSlider',
  'ui.bootstrap',
  'google-maps',
  'ui.select2'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
  	templateUrl: 'partials/main.html',
  	controller: 'mainController'
  });

  $routeProvider.when('/about/', {
  	templateUrl: 'partials/about.html',
  	controller: 'aboutController'
  });

  $routeProvider.otherwise({redirectTo: '/'});
}]);


// Monkey Patch
Array.prototype.contains = function(obj) {
  var i = this.length;
  while (i--) {
    if (this[i] === obj) {
      return true;
    }
  }
  return false;
}

Array.prototype.containsAnyOf = function(array) {
  var i = this.length;
  while (i--) {
    for (var x in array) {
      if (this[i] === array[x]) {
        return true;
      }
    }
  }
  return false;
}
