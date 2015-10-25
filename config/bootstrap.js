
module.exports.bootstrap = function(cb){
	// seed(function(err){
	// 	if(err) console.log(err)
		//else 
			return cb()
	//})
}

function seed(cb){
	var eventParams = {
		name : 'my event name',
		odds:'1-2'
	}, competitors = [
		{name : 'red'},
		{name : 'blue'}
	], _competitors = []

	async.eachSeries(competitors, function(competitor, call){
		$.Competitors.create(competitor).exec(function(err, competitor){
			if(err) return call(err)
			else {
				_competitors.push(competitor)
				call()
			}
		})
	}, function(err){
		if(err) return cb(err)

		_competitors.forEach(function(_competitor){
			if(!eventParams.competitor_1) eventParams.competitor_1 = _competitor.id
			else eventParams.competitor_2 = _competitor.id
		})

		$.Events.create(eventParams).exec(function(err, event){
			if(err) return cb(err)
			else return cb()
		})
	})
}