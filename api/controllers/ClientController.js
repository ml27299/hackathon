
module.exports = {
	index : function(req, res){

		if(req.session.email) return res.status(200)

		Global.checkUniqueness('Clients', function(err, email){
			if(err) return res.status(500).end(err)

			var Braintree = BraintreeService.init()

			Braintree.customer().create({email:email}).exec(function(err, customerResponse){
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

  				Braintree.merchant().create(merchantParams).exec(function(err, merchantResponse){
  					if(err) return res.status(500).end(err)
  					
  					params = {email:email, merchantId:merchantResponse.merchantAccount.id, customerId:customerResponse.customer.id}

  					$.Clients.create(params).exec(function(err, client){
  						if(err) return res.status(500).end(err)

  						//req.session.email = email
  						return res.status(200).json({ made: 'it' })
  					})
  				})
  			})
		})
	}
}