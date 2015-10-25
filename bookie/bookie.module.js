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
                controller: 'BookieCtrl as bookie',
                templateUrl: 'bookie.html',
                resolve: {
                    preload: preload,
                    bets: ['bookieService', function(bookieService) {return bookieService.getBets();}]
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
                event.bookie = response.bookies[0];
                event.set(response.events[0]);
                deferred.resolve(response);
            }
        }
    }
})();
