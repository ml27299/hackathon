module.exports = {
	index : function(req, res){
		var eventId = req.param('id')

		$.Events.findOne({id:eventId}).exec(function(err, event){
			if(err) return res.status(500).end(err)
			return res.status(200).json({event:event})
		})
	},

	events : function(req, res){
		$.Events.find().exec(function(err, events){
			if(err) return res.status(500).end(err)
			return res.status(200).json({events:events})
		})
	},

	editEvent : function(req, res){
		if(!req.session.email) return res.status(500).end('No logged in user')

		$.Bookies.findOne({email:req.session.email}).exec(function(err, bookie){
			if(err) return res.status(500).end(err)
			if(!bookie) return res.status(500).end(err)

			var eventId = req.param('id')

			$.Events.findOne({id:eventId}).exec(function(err, event){
				if(err) return res.status(500).end(err)

				event.odds = req.body.odds

				event.save(function(err){
					if(err) return res.status(500).end(err)
					return res.status(200).json({event:event})
				})
			})
		})
	}
}