var _braintree = require("braintree");

var Braintree = function(){
	
	var options = {
		environment:  _braintree.Environment.Sandbox,
	 	merchantId:   BRAINTREE_MERCHANT_ID,
	 	publicKey:    BRAINTREE_PUBLIC_KEY,
	 	privateKey:   BRAINTREE_PRIVATE_KEY
	}

	this.gateway =  _braintree.connect(options);
}

Braintree.prototype.customer = function(){
	var self = this

	return {

		find:function(params){

			return {
				exec:function(cb){
					self.gateway.customer.find(params.id.toString(),function (err, result) {
				  		if(err) return cb(err)
				  		return cb(null,result)
				  	})
				}
			}
		},

		create:function(params){

			return {
				exec:function(cb){
					self.gateway.customer.create(params,function (err, result) {
				  		if(err) return cb(err)
				  		if(!result.success) return cb()

						return cb(null,result);
				  	})
				}
			}
		}
	}
}

Braintree.prototype.merchant = function(){
	var self = this

	return {

		find:function(params){

			return {
				exec:function(cb){
					self.gateway.merchantAccount.find(params.id,function (err, result) {
				  		if(err) return cb(err)
				  		return cb(null,result)
				  	})
				}
			}
		},

		create:function(params){

			return {
				exec:function(cb){

					self.gateway.merchantAccount.create(params, function(err, result){
						if(err) return cb(err)
						return cb(null, result)
					})
				}
			}
		},

		sale:function(params){

			return {
				exec:function(cb){
					self.gateway.transaction.sale(params, function (err, result) {
						if(err) return cb(err)
						return cb(null, result)
					})
				}
			}
		}
	}
}

module.exports = {
	init:function(credentials){
		return new Braintree()
	},

	getInfo : function(user, cb){
		var Braintree = BraintreeService.init()
		// Braintree.customer().find({id:user.customerId}).exec(function(err, customerResponse){
		// 	if(err) return cb(err)

			Braintree.merchant().find({id:user.merchantId}).exec(function(err, merchantResponse){
	  			if(err) return cb(err)

	  			return cb(null, {merchantInfo : merchantResponse})
	  		})
		//})
	}
}