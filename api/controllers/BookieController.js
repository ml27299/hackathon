module.exports = {

	index : function(req, res){

		if(req.session.email) return res.status(200)

		Global.checkUniqueness('Bookies', function(err, email){
			if(err) return res.status(500).end(err)

			var Braintree = BraintreeService.init()

			Braintree.customer().create({email:email}).exec(function(err, response){
  				if(err) return res.status(500).end(err)

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

  				Braintree.merchant().create(merchantParams).exec(function(err, response){
  					if(err) return res.status(500).end(err)

  					params = {email:email, merchantId:merchantResponse.merchantAccount.id, customerId:customerResponse.customer.id}

  					$.Bookies.create(params).exec(function(err, client){
  						if(err) return res.status(500).end(err)

  						//req.session.email = email
  						return res.status(200).json({ sub_merchant: merchantResponse, customer : customerResponse })
  					})
  				})
  			})
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
	}
}