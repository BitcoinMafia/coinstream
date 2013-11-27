'use strict';

/* Filters */

angular.module('csApp.filters', [])
.filter('reverse', function() {
  return function(array) {
    return array.slice().reverse();
  };
})
.filter('above', function() {
	return function(array, num) {
		var selected = []
		array.forEach(function(a) {
			if (a.numInputs >= num) {
				selected.push(a)
			}
		})
		return selected
	}
})
.filter('sidebarFilter', function() {
	return function(array, sidebar) {
		var array = array.slice(0, sidebar.showLast)

		var selected = []

		array.forEach(function(a) {
			if (
			(a.value >= sidebar.value * 100000000)
			&& (a.fee >= sidebar.fee  * 100000000)
			&& a.numInputs >= sidebar.numInputs
			&& a.numOutputs >= sidebar.numOutputs) {
				selected.push(a)
			}
		})

		return selected
	}
})
.filter("countryFilter", function() {
	return function(array, country) {
		if (country === undefined || country === "") {
			return array
		}
		var selected = []
		array.forEach(function(a) {
			if (a.country === country) {
				selected.push(a)
			}
		})
		return selected
	}
})
.filter("addressFilter", function() {
	return function(array, addrObjs) {
		var userAddresses = []
		addrObjs.forEach(function(o) {
			if (o.addr === undefined || o.addr === "") {

			} else {
				userAddresses.push(o.addr)
			}
		})

		if (userAddresses.length === 0) {
			return array;
		}

		var selected = []

		array.forEach(function(a) {
			if (a.addresses.containsAnyOf(userAddresses)) {
				selected.push(a)
			}

		})
		return selected
	}
})
