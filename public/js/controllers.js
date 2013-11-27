'use strict';

/* Controllers */

angular.module('csApp.controllers', [])
.controller('mainController', function($scope, IPLookup, Countries) {

  // Defaults
  $scope.transactions = []

  $scope.sidebar = {
    value: 0.0,
    fee: 0.0,
    numInputs: 1,
    numOutputs: 1,
    showLast: 50,
    countries: Countries.all,
    selectedCountry: undefined,
    addresses: [{
      addr: ''
    }, {
      addr: ''
    }, {
      addr: ''
    }]
  }

  $scope.connection = {
    css: "warning",
    status: "WAIT"
  }

  $scope.map = {
    center: {
      latitude: 20,
      longitude: 20
    },
    markers: [],
    sidebar: $scope.sidebar,
    zoom: 2
  }

  // Extract into Factory!
  var host = location.origin.replace(/http/, "ws")
  var ws = new WebSocket(host)

  ws.onopen = function() {
    $scope.$apply(function() {
      $scope.connection = {
        css: "success",
        status: "OPEN"
      }
    });
  }

  ws.onmessage = function(msg) {
    var data = JSON.parse(msg.data)
    // console.log(data)
    $scope.$apply(function() {

      data.infoWindow = buildinfoWindow(data)

      $scope.transactions.unshift(data)
      if (data.map) {
        $scope.map.markers.unshift(data)
      }

      // GC
      if ($scope.transactions.length >= 2000) {
        $scope.transactions.pop()
        $scope.map.markers.pop()
      }

    })
  }

  ws.onclose = function() {
    $scope.connection = {
      css: "danger",
      status: "DOWN"
    }
  }

  // TODO: REFACTOR into html template
  var buildinfoWindow = function(data) {
    var value = (data.value / 100000000) + " BTC"
    var city = buildCity(data.city)
    var country = data.country

    var lineOne = city + country
    var lineTwo = value
    return wrapper(lineOne, lineTwo)
  }

  var buildCity = function(city) {
    if (city !== undefined) {
      return city +  ", "
    } else {
      return ""
    }
  }

  var wrapper = function(lineOne, lineTwo) {
    return "<div class='info-window text-center'>" + lineOne + "</div>" +
    "<div class='info-window text-center'>" + lineTwo + "</div>"
  }

})
.controller('aboutController', function($scope) {

})
