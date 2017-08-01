const TelegramBot = require('node-telegram-bot-api')

var app = require('../../server/server')

var fs = require('fs')
var path = require('path')

function generateQueryString(data) {
	var ret = []
	for (var d in data)
		if (data[d])
			ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]))
	return ret.join("&")
}

var gameBaseURL = 'www.flieral.com'

module.exports = function (controller) {

  const token = '416991514:AAEK5ws4BGtNyMayT8q-u6GVfK_XXYHQgBw'

  var bot = new TelegramBot(token, {
    polling: true
	})

	if (!bot)
		throw 'bot not defined'

  bot.onText(/\/start/, (msg) => {
		var directory = path.resolve(__dirname + '/../../images/')
		var fp = directory + '/' + 'welcome.png'
    bot.sendPhoto(msg.chat.id, fp, {
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [{
              text: "🏆 بازی رو بفرست 🏆",
              callback_data: JSON.stringify({
                button: "Start"
              })
            }]
          ]
        })
      }
    )
  })

  bot.on("callback_query", function (cq) {
		console.log(JSON.stringify(cq))
		if (cq.data) {
			var data = JSON.parse(cq.data)
			if (data.button === 'Start') {
				bot.answerCallbackQuery(cq.id, 'خیلی خوشحالیم که به جمع ما پیوستی ️⚽️', false);
				bot.sendGame(
					cq.message.chat.id,
					"copa90", {
						reply_markup: JSON.stringify({
							inline_keyboard: [
								[{
									text: "بزن بریم بازی رو شروع کنیم 😎",
									callback_game: JSON.stringify({
										game_short_name: "Copa90.ir"
									})
								}]
							]
						})
					}
				)
			}
		}

		if (cq.game_short_name) {
			if (cq.game_short_name === 'copa90') {
				var client = app.models.client
				client.getCredential(cq.from.id, function(err, result) {
					if (err)
						return bot.answerCallbackQuery(cq.id, 'متاسفانه مشکلی برای شروع بازی رخ داده ☹️', false);
					var qs = generateQueryString(result)
					var url = gameBaseURL + '?' + qs
					bot.answerCallbackQuery(cq.id, undefined, false, {
						url: url
					})
				})
			}
			else {
				bot.answerCallbackQuery(cq.id, 'متاسفانه بازی مورد نظرت پیدا نشد ☹️', false);
			}
    }
  })

  bot.on("inline_query", function (iq) {
    bot.answerInlineQuery(iq.id, [{
      type: "game",
      id: "0",
      game_short_name: "copa90"
    }])
  })

}
