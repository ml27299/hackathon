module.exports = {

	randomEmail : function(){
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for( var i=0; i < 8; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));

	    return text+'@gmail.com';
	},

	randomName : function(){
		var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

	    for( var i=0; i < 5; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));

	    return text;
	},

	getBraintreeInfo : function(user, cb){
		Braintree.customer().find({id:user.customerId}).exec(function(err, customerResponse){
			if(err) return cb(err)

			Braintree.merchant().find({id:user.merchantId}).exec(function(err, merchantResponse){
	  			if(err) return cb(err)

	  			return cb(null, {merchantInfo : merchantResponse, customerInfo : customerResponse})
	  		})
		})
	},

	checkUniqueness : function(Model, cb){

		var unique = false, email
		async.whilst(function () {
			return !unique 
		},function (next) {

			email = Global.randomEmail()
			$[Model].findOne({email:email}).exec(function(err, user){
				if(err) return next(err)
				else {

					if(!user) unique = true
					else email = Global.randomEmail()

					next()
				}
			})

		},function (err) {
			if(err) return cb(err)
			return cb(null, email)
		})
	}
}