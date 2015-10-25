(function() {
    'use strict';

    angular
        .module('app')
        .controller('BookieCtrl', BookieCtrl);

    BookieCtrl.$inject = ['$interval', 'bookieService', 'event'];
    /* @ngInject */
    function BookieCtrl($interval, bookieService, event) {
        var vm = this; // jshint ignore:line

        vm.event = event.get();
        vm.competitor_1 = vm.event.competitor_1;
        vm.competitor_2 = vm.event.competitor_2;
        vm.odds = vm.event.odds.split('-');
        vm.competitor_1_odds = parseInt(vm.odds[0]);
        vm.competitor_2_odds = parseInt(vm.odds[1]);
        vm.bets = bookieService.data.bets;

        vm.competitor_1_ratio = vm.competitor_1_odds / vm.competitor_2_odds;
        vm.competitor_2_ratio = vm.competitor_2_odds / vm.competitor_1_odds;

        bookieService.getBets();
        $interval(bookieService.getBets, 1500);

        vm.editOdds = bookieService.editOdds;

        vm.getSpread = getSpread;

        //////////

        function getSpread(competitor, odds) {
            var total = 0,
                losses = 0;
            angular.forEach(vm.bets, function(bet) {
                if (bet.competitor === competitor.name) {
                    losses += bet.cash_amount * vm['competitor_' + odds + '_ratio'];
                } else {
                    total += bet.cash_amount;
                }
            });
            return total - losses;
        }
    }
})();
