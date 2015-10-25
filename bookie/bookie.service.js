(function() {
    'use strict';

    angular
        .module('app')
        .factory('bookieService', bookieService);

    bookieService.$inject = ['$http', '$q', 'api', 'event'];
    /* @ngInject */
    function bookieService($http, $q, api, event) {
        var data = {
            bets: []
        };

        return {
            data: data,
            editOdds: editOdds,
            getBets: getBets
        };

        //////////

        function editOdds(first, second) {
            var deferred = $q.defer();

            $http({
                url: api + 'edit/event/' + event.get().id,
                method: 'POST',
                data: {
                    email: event.bookie.email,
                    odds: first + '-' + second
                }
            })
                .success(successCallback)
                .error(errorCallback);

            return deferred.promise;

            //////////

            function errorCallback(response) {
                deferred.reject(response);
            }

            function successCallback(response) {
                event.set(response.event);
                deferred.resolve(response);
            }
        }

        function getBets() {
            var deferred = $q.defer();

            $http({
                url: api + 'bets'
            })
                .success(successCallback)
                .error(errorCallback);

            return deferred.promise;

            //////////

            function errorCallback(response) {
                deferred.reject(response);
            }

            function successCallback(response) {
                angular.copy(response.response/*[{
                    amount: 100,
                    competitor: 1,
                    odds: '1-2'
                }]*/, data.bets);
                deferred.resolve(response);
            }
        }
    }
})();
