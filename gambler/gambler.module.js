(function() {
    'use strict';

    angular
        .module('app', ['ngRoute'])
        .constant('api', 'http://55915b6e.ngrok.com/')
        .config(routeConfig);

    routeConfig.$inject = ['$routeProvider'];
    function routeConfig($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'GamblerCtrl as gambler',
                templateUrl: 'gambler.html',
                resolve: {
                    preload: preload
                }
            })
            .otherwise('/');

        //////////

        preload.$inject = ['$http', '$q', 'api', 'event'];
        function preload($http, $q, api, event) {
            var deferred = $q.defer();

            $http({
                url: api + 'events'
            })
                .success(successCallback)
                .error(errorCallback);

            return deferred.promise;

            //////////

            function errorCallback(response) {
                deferred.reject(response);
            }

            function successCallback(response) {
                event.set(response.events[0]);
                event.bookie = response.bookies[0];
                deferred.resolve(response);
            }
        }
    }
})();
