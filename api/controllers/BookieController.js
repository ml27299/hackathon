module.exports = {

	index : function(req, res){

		if(req.session.email){
			$.Bookies.findOne({email:req.session.email}).exec(function(err, bookie){
				if(err) return res.status(500).end(err)

				BraintreeService.getInfo(bookie, function(err, response){
					if(err) return res.status(500).end(err)
					return res.status(200).json({ sub_merchant: response.merchantInfo, customer : response.customerInfo })
				})
			})
		}

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
  							//req.session.email = email
  							return res.status(200).json({ sub_merchant: response.merchantInfo })
  						})
  					})
  				})
  			//})
		})
	},

	editOdds : function(req, res){

	},

	sendBet : function(req, res){

		if(!req.session.email) return res.status(404).json({error:'No email associated with this user'})
		
		$.Bookies.findOne({email:req.session.email}).exec(function(err, bookie){
			if(err) return res.status(500).end(err)
		
			var params = {
				cash_amount : '3.50',
				odds : '1-0',
				bookie_sub_merchant_bt_id : bookie.merchantId,
				bookie_customer_bt_id : bookie.customerId,
				user_submerchant_bt_id : req.body.client.merchantId,
				user_customer_bt_id :  req.body.client.customerId
			}

			BetService.post.bet(params).exec(function(err, response){
				if(err) return res.status(500).end(err)
				return res.status(200).json({ made: 'it' })
			})
		})
	},

	getBets : function(req, res){

		if(!req.session.email) return res.status(404).json({error:'No email associated with this user'})

		var params = ''
		BetService.get.bet(params).exec(function(err, response){
			if(err) return res.status(500).end(err)
			return res.status(200).json({ made: 'it' })
		})
	},

	payoutBets : function(req, res){
		var Braintree = BraintreeService.init()

		var test = [
			{merchantAccountId : 'nwuuu_wgmfq_instant_m2j4v5mb', paymentMethodNonce : 'fake-valid-nonce', amount : 2.00, serviceFeeAmount: 0.00 },
			{merchantAccountId : 'lqvcn_hnmma_instant_8b4z2g68', paymentMethodNonce : 'fake-valid-nonce', amount : 4.00, serviceFeeAmount: 0.00 }
		]

		async.eachSeries(test, function(item, cb){
			Braintree.merchant().sale(item).exec(function(err, response){
				if(err) return cb(err)
				else{
					console.log(response)
					cb()
				}
			})
		}, function(err){
			if(err) return res.status(500).end(err)
			return res.status(200).json({made:'it'})
		})
	}
}



















