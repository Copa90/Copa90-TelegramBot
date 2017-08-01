module.exports = function(client) {
	client.getCredential = function(telegramId, callback) {
		client.find({'where':{'telegramId': telegramId}}, function(err, clientInst) {
			if (err)
				return callback(err, null)
			var data = {}
			data.source = 'telegram'
			if (clientInst && clientInst.coreAccessToken && clientInst.clientId) {
				data.userId = clientInst.clientId
				data.telegramId = clientInst.telegramId
				data.userCoreAccessToken = clientInst.coreAccessToken
			}
			return callback(null, data)
		})
	}

	client.checkExistance = function(telegramId, callback) {
		client.find({'where':{'telegramId': telegramId}}, function(err, clientInst) {
			if (err)
				return callback(err, null)
			if (!clientInst)
				return callback(null, false)
			return callback(null, true)
		})		
	}
}
