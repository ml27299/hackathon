(function() {
    'use strict';

    angular
        .module('app')
        .factory('event', eventService);

    eventService.$inject = [];
    /* @ngInject */
    function eventService() {
        var event = {};

        return {
            get: get,
            set: set,
            bookie: {}
        };

        //////////

        function get() {
            return event;
        }

        function set(newEvent) {
            angular.copy(newEvent, event);
        }
    }
})();
