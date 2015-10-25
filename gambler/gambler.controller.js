(function() {
    'use strict';

    angular
        .module('app')
        .controller('GamblerCtrl', GamblerCtrl);

    GamblerCtrl.$inject = ['event', 'gamblerService', 'user'];
    /* @ngInject */
    function GamblerCtrl(event, gamblerService, user) {
        var vm = this; // jshint ignore:line

        vm.event = event.get();
        vm.competitor_1 = vm.event.competitor_1;
        vm.competitor_2 = vm.event.competitor_2;
        vm.odds = vm.event.odds.split('-');
        vm.user = user.get();

        console.log('vm.user: ', vm.user);

        vm.competitor_1_ratio = parseInt(vm.odds[0]) / parseInt(vm.odds[1]);
        vm.competitor_2_ratio = parseInt(vm.odds[1]) / parseInt(vm.odds[0]);

        vm.getPayout = getPayout;

        vm.makeBet = gamblerService.makeBet;

        //////////

        function getPayout(bet, competitor) {
            var payout = '';

            bet = parseInt(bet);

            if (bet) {
                payout = competitor === 1 ? vm.competitor_1_ratio * bet : vm.competitor_2_ratio * bet;
            }

            return payout;
        }
    }
})();
