var request = require('request')

module.exports = {
	post : {
		bet : function(params){

			var options = {
			    method: 'post',
				body: params,
				json: true,
				url: BASECHAINURL+'/chain/bet'
			}
			console.log(options)
			return {
				exec : function(cb){
					request.post(options, function (err, httpResponse, response) {
						if(err) return cb(err)
						if(httpResponse.statusCode !== 200 && httpResponse.statusCode !== 201) return cb('Response Code: '+httpResponse.statusCode)

					  	return cb(null, response)

					})
				}
			}
		}
	},

	get : {
		bet : function(params){

			var options = {
				method: 'get',
				qs: params,
				url: BASECHAINURL+'/chain/bet',
				headers:{
					'Content-Type' : 'application/json',
				}
			}

			return {
				exec : function(cb){
					request.get(options, function (err, httpResponse, response) {
						if(err) return cb(err)
						if(httpResponse.statusCode !== 200 && httpResponse.statusCode !== 201) return cb('Response Code: '+httpResponse.statusCode)

						return cb(null, JSON.parse(response))
					})
				}
			}
		}
	}
}