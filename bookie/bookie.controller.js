(function() {
    'use strict';

    angular
        .module('app')
        .controller('BookieCtrl', BookieCtrl);

    BookieCtrl.$inject = [];
    /* @ngInject */
    function BookieCtrl() {
        var vm = this; // jshint ignore:line

        vm.foo = 'Bar';
    }
})();
