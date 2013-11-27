'use strict';

/* Directives */


angular.module('csApp.directives', [])
.directive('appVersion', ['version', function(version) {
  return function(scope, elm, attrs) {
    elm.text(version);
  };
}])
.directive('navbar', function(){
 return {
  restrict: 'E',
  templateUrl: 'partials/navbar.html',
  transclude: true,
};
})
.directive('sidebar', function(){
  return {
    restrict: 'E',
    templateUrl: 'partials/sidebar.html',
    transclude: true,
  };
})
.directive('list', function(){
  return {
    restrict: 'E',
    templateUrl: 'partials/list.html',
    transclude: true,
  };
})
// .directive('float', function(){
//   return {
//     require: 'ngModel',
//     link: function(scope, ele, attr, ctrl){
//       ctrl.$parsers.unshift(function(viewValue){
//         console.log(viewValue)
//         return parseFloat(viewValue);
//       });
//     }
//   };
// });
