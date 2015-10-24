(function() {
    'use strict';

    angular
        .module('app', ['ngRoute'])
        .config(routeConfig);

    routeConfig.$inject = ['$routeProvider'];
    function routeConfig($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'BookieCtrl as bookie',
                templateUrl: 'bookie.html'
            })
            .otherwise('/');
    }
})();
