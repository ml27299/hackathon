// angular.module('controllers', [])

// .controller('controller_1', ['$scope', '$http',
// 	function ($scope, $http) {
// 		alert('yo')
// 		console.log('yo')
//     	$http.get('/ho').success(function(data) {
//       		$scope.label = data;
//     	});

// 	}
// ]);


var controllers = angular.module('controllers', []);

controllers.controller('controller_1', ['$scope', '$http',
  function ($scope, $http) {
    $http.get('/ho').success(function(data) {

      $scope.label = data;

    });
 }]);

