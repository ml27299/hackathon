
module.exports = {
	index : function (req, res){
		return res.render('index')
	},

	yo:function(req, res){
		return res.status(200).end('Go Fuck Yourself')
	}
}