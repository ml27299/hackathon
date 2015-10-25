
module.exports = {
	index : function(req, res){
		var Braintree = BraintreeService.init()

		if(req.session.email){
			$.Clients.findOne({email:req.session.email}).exec(function(err, client){
				if(err) return res.status(500).end(err)

				BraintreeService.getInfo(client, function(err, response){
					if(err) return res.status(500).end(err)
					return res.status(200).json({ sub_merchant: response.merchantInfo, customer : response.customerInfo })
				})
			})
		}

		Global.checkUniqueness('Clients', function(err, email){
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

  					$.Clients.create(params).exec(function(err, client){
  						if(err) return res.status(500).end(err)

  						BraintreeService.getInfo(client, function(err, response){
  							if(err) return res.status(500).end(err)
  							//req.session.email = email
  							return res.status(200).json({ sub_merchant: response.merchantInfo })
  						})
  					})
  			 	})
  			// })
		})
	}
}