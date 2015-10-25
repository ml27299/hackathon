(function() {
    'use strict';

    angular
        .module('app')
        .factory('gamblerService', gamblerService);

    gamblerService.$inject = ['$http', 'api', 'event', 'user'];
    /* @ngInject */
    function gamblerService($http, api, event, user) {
        return {
            makeBet: makeBet
        };

        //////////

        function makeBet(bet, competitor) {
            console.log('event: ', event.get());
            $http({
                method: 'POST',
                url: api + 'send/bet/' + event.get().id,
                data: {
                    amount: parseInt(bet),
                    bookie_id: event.bookie.id,
                    competitor: competitor,
                    email: user.get().email
                }
            });
        }
    }
})();
