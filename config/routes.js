var routes = {
	'get /':'IndexController.index',
	'get /client' : 'ClientController.index',
	'get /bookie' : 'BookieController.index',
	'get /bets' : 'BookieController.getBets',
	'post /edit/event/:id' : 'EventsController.editEvent',
	'get /event/:id' : 'EventsController.index', 
	'get /events' : 'EventsController.events',
	'post /transactions' : 'BookieController.payoutBets',
	'post /send/bet/:event_id' : 'BookieController.sendBet'
}

module.exports = routes