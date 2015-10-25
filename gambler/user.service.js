(function() {
    'use strict';

    angular
        .module('app')
        .factory('user', userService);

    userService.$inject = ['$http', '$q', 'api'];
    /* @ngInject */
    function userService($http, $q, api) {
        var user = {};

        return {
            get: get,
            set: set,
            load: load
        };

        //////////

        function get() {
            return user;
        }

        function set(data) {
            angular.copy(data, user);
        }

        function load() {
            var deferred = $q.defer();

            $http({
                url: api + 'client'
            })
                .success(successCallback)
                .error(errorCallback);

            return deferred.promise;

            //////////

            function errorCallback(response) {
                deferred.reject(response);
            }

            function successCallback(response) {
                console.log('response: ', response);
                set(response.user);
                deferred.resolve(response);
            }
        }
    }
})();
