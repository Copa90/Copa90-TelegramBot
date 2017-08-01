module.exports = function(user) {
	user.validatesUniquenessOf('telegramId', {message: 'telegramId is not unique'});
}
