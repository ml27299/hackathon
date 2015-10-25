module.exports = {
	index : function(req, res){
		var eventId = req.param('id')

		$.Events.findOne({id:eventId}).exec(function(err, event){
			if(err) return res.status(500).end(err)
			return res.status(200).json({event:event})
		})
	},

	events : function(req, res){
		$.Events.find().populate('competitor_1').populate('competitor_2').exec(function(err, events){
			if(err) return res.status(500).end(err)

			$.Bookies.find().exec(function(err, bookies){
				return res.status(200).json({events:events, bookies:bookies})
			})
		})
	},

	editEvent : function(req, res){
		if(!req.body.email) return res.status(500).end('No logged in user')

		$.Bookies.findOne({email:req.body.email}).exec(function(err, bookie){
			if(err) return res.status(500).end(err)
			if(!bookie) return res.status(500).end(err)

			var eventId = req.param('id')

			$.Events.findOne({id:eventId}).exec(function(err, event){
				if(err) return res.status(500).end(err)
				//console.log(event)
				event.odds = req.body.odds

				event.save(function(err){
					if(err) return res.status(500).end(err)
					return res.status(200).json({event:event})
				})
			})
		})
	}
}