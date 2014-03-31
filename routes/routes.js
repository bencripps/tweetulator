var twitter = require('twit');
var underscore = require('underscore')

var Twitter = new twitter({
	consumer_key: 'sISe5FQF93i5OJS9PtgQww',
	consumer_secret: 'h8X1Lw6122f6GcHVGRS8RN0FAjROwfiJY4r7z0Azs',
	access_token: '55620549-TpzCSU5Xu1YivaKwFeiVxMeG6M2MY7DaCuOUe4lrF',
	access_token_secret: 'oHqXloMcYRUwkxHR4rvW3rVA8RNRrGQJBdRPUU59qVqeW'
});	


module.exports = function( app ) {

	app.get('/', function(req, res) {
		res.sendfile(__dirname + '/index.html')
	});


	app.post('/username', function( req, res) {

		var userName = req.body.username

		Twitter.get('statuses/user_timeline', { screen_name: userName, count: 2000 },  function (err, reply) {
			
			
			if (!err) {
				var totalTweets = reply.length;

				var bgImg = reply[0].user.profile_image_url;

				var wordTotals = getWordTotals(reply)

				var today = Date.parse(new Date());

				var timePeriodBetweenLastTweet = today - Date.parse(reply[totalTweets-1].created_at);

				var avgTweets = (timePeriodBetweenLastTweet / (1000*60*60*24) ) / totalTweets 

				var allWords = getAllWords(reply);

				var sum = underscore.reduce(wordTotals, function(memo, num){ return memo + num; }, 0);

				var sortedWords = allWords.sort();

				var uniqueWords = underscore.uniq(sortedWords, true)

				var wordList = getWordCount( uniqueWords, sortedWords);

				var count = {'totalWords': sortedWords.length, 'uniqueWords': uniqueWords.length}


				res.send({'success': true, 
					'wordList': wordList, 
					'totals': count,
					'wordTotals': wordTotals, 
					'generalInfo': { 
						'screenname': userName,
						'totalTweets': totalTweets,
						'allWords': sum,
						'TweetsPerDay': avgTweets.toFixed(3),
						'bgImg': bgImg
					}
				})

			}

			else {
				res.send({'success': false})
			}
		})
		
		var getAllWords = function(tweets) {

			//function removes words with: 
			//@, # and :
			//then removes any non-alphanumeric chars with regex

			var allWords = [];

			for (var i = 0; i <= tweets.length-1; i++) {

				var currentwords = tweets[i].text.split(' ');

				for (var x=0; x <= currentwords.length-1; x++) {

					var thisWord = currentwords[x]

					if ( !/\W/.test(thisWord) && thisWord.length > 2  && !/\d/.test(thisWord) ) {
							
							//thisWord = thisWord.replace(/[^\w\s]|_/g, "");

							allWords.push(thisWord.toLowerCase() )
						}
				}
			};

			return allWords;

		}

		var getWordCount = function(uniqueWords, sortedWords) {

			var finalTally = {};

			for (var i=0; i <= uniqueWords.length-1; i++) {

				finalTally[uniqueWords[i]] = 0;
			}

			for (var x = 0; x <= sortedWords.length-1; x++) {

				finalTally[sortedWords[x]] += 1
			}
			
			return finalTally;
		}

		var getWordTotals = function(data) {

			var countArrary = [];

			for (var i=0; i <= data.length - 1; i ++ ) {

				countArrary.push( data[i].text.length );
			}

			return countArrary;
		}
 	})

}