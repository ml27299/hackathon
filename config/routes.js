var routes = {
	'get /':'IndexController.index',
	'get /client' : 'ClientController.index',
	'get /bookie' : 'BookieController.index',
	'post /edit/event/:id' : 'EventsController.editEvent',
	'get /event/:id' : 'EventsController.index', 
	'get /events' : 'EventsController.events',
	'get /transactions' : 'BookieController.payoutBets'
}

module.exports = routes