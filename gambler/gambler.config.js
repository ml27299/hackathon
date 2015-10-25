(function() {
    'use strict';

    angular
        .module('app')
        .run(config);
    
    config.$inject = ['user'];
    function config(user) {
        user.load();
    }
})();
