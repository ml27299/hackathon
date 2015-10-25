module.exports = {

	index : function(req, res){
		var Braintree = BraintreeService.init()

		if(req.session.email){
			$.Bookies.findOne({email:req.session.email}).exec(function(err, bookie){
				if(err) return res.status(500).end(err)
				if(!bookie) return res.status(200).json({ sub_merchant: {} })

				BraintreeService.getInfo(bookie, function(err, response){
					if(err) return res.status(500).end(err)
					return res.status(200).json({ sub_merchant: response.merchantInfo })
				})
			})
		}else { 

			Global.checkUniqueness('Bookies', function(err, email){
				if(err) return res.status(500).end(err)


				// Braintree.customer().create({email:email}).exec(function(err, customerResponse){
	  				//if(err) return res.status(500).end(err)

	  				var merchantParams = {
	  					individual: {
	  						firstName:Global.randomName(),
	  						lastName:Global.randomName(),
	  						dateOfBirth: "1981-11-19",
						    email: email,
						    address: {
						     	streetAddress: "111 Main St",
						      	locality: "Chicago",
						      	region: "IL",
						     	postalCode: "60622"
						    }
						  },
						  funding: {
						    destination: 'bank',
						    email: email,
						    accountNumber: "1123581321",
						    routingNumber: "071101307"
						  },
						  tosAccepted: true,
						  masterMerchantAccountId: "hackathon",
	  				}

	  				Braintree.merchant().create(merchantParams).exec(function(err, merchantResponse){
	  					if(err) return res.status(500).end(err)

	  					params = {email:email, merchantId:merchantResponse.merchantAccount.id}

	  					$.Bookies.create(params).exec(function(err, bookie){
	  						if(err) return res.status(500).end(err)

	  						BraintreeService.getInfo(bookie, function(err, response){
	  							if(err) return res.status(500).end(err)
	  							req.session.email = email
	  							return res.status(200).json({ sub_merchant: response.merchantInfo, user:bookie})
	  						})
	  					})
	  				})
	  			//})
			})
		}
	},

	editOdds : function(req, res){

	},

	sendBet : function(req, res){

		if(!req.body.email) return res.status(404).json({error:'No email associated with this user'})
		if(!req.param('event_id')) return res.status(404).json({error:'No event specified'})

		$.Bookies.findOne(req.param('bookie_id') ? {id:req.param('bookie_id')} : {email:req.body.email}).exec(function(err, bookie){
			if(err) return res.status(500).end(err)
			if(!bookie) return res.status(404).json({error:'No bookie found'})

			$.Clients.findOne({email:req.body.email}).exec(function(err, client){
				if(err) return res.status(500).end(err)
			
				$.Events.findOne({id:req.param('event_id')}).exec(function(err, event){
					if(err) return res.status(500).end(err)

					var params = {
						cash_amount : req.body.amount,
						odds : event.odds,
						competitor:req.body.competitor,
						bookie_sub_merchant_bt_id : bookie.merchantId,
						//bookie_customer_bt_id : bookie.customerId,
						user_submerchant_bt_id : client.merchantId,
						//user_customer_bt_id :  req.body.client.customerId
					}

					BetService.post.bet(params).exec(function(err, response){
						if(err) return res.status(500).end(err)

						if(client.balance) client.balance = client.balance - parseFloat(req.body.amount)
						if(bookie.balance) bookie.balance = bookie.balance - parseFloat(req.body.amount)

						if(client.save) client.save(function(){
							return res.status(200).json({ response: response,  bookie:bookie, client:client})
						})
						else bookie.save(function(){
							return res.status(200).json({ response: response, bookie:bookie, client:client })
						})
					})
				})
			})
		})
	},

	getBets : function(req, res){

		//if(!req.session.email) return res.status(404).json({error:'No email associated with this user'})
		
		var params = ''
		BetService.get.bet(params).exec(function(err, response){
			if(err) return res.status(500).end(err)

			async.eachSeries(response, function(item, cb){
				//console.log(item)
				$.Competitors.findOne({id:item.competitor}).exec(function(err, competitor){
					if(err) return cb(err)
					else if(!competitor) cb()
					else {
						item.competitor = competitor.name
						cb()
					}
				})
			}, function(err){
				if(err) return res.status(500).end(err)
				return res.status(200).json({ response: response })
			})
		})
	},

	payoutBets : function(req, res){
		var Braintree = BraintreeService.init()

		// var test = [
		// 	{merchantAccountId : 'nwuuu_wgmfq_instant_m2j4v5mb', paymentMethodNonce : 'fake-valid-nonce', amount : 2.00, serviceFeeAmount: 0.00 },
		// 	{merchantAccountId : 'lqvcn_hnmma_instant_8b4z2g68', paymentMethodNonce : 'fake-valid-nonce', amount : 4.00, serviceFeeAmount: 0.00 }
		// ]

		console.log(req.body)

		async.eachSeries(req.body, function(item, cb){
			var _item = {merchantAccountId : item.merchant_id, amount:item.amount, paymentMethodNonce : 'fake-valid-nonce', serviceFeeAmount: 0.00}
			//console.log(_item)
			$.Bookies.findOne({merchantId:_item.merchantAccountId}).exec(function(err, bookie){
				if(err) return cb(err)
				else{
					$.Clients.findOne({merchantId:_item.merchantAccountId}).exec(function(err, client){
						if(err) return cb(err)
						else{
							Braintree.merchant().sale(_item).exec(function(err, response){
								if(err) return cb(err)
								else{
									console.log(response)
									if(client.balance) client.balance = client.balance + parseFloat(req.body.amount)
									if(bookie.balance) bookie.balance = bookie.balance + parseFloat(req.body.amount)
									if(client.save) client.save(function(){
										cb()
									})
									else bookie.save(function(){
										cb()
									})
								}
							})
						}
					})
				}
			})
		}, function(err){
			if(err) return res.status(500).json(err)
			return res.status(200).json({made:'it'})
		})
	}
}



















