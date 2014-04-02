var twitter = require('twit');
var underscore = require('underscore')

var Twitter = new twitter({
	consumer_key: process.env.consumer_key,
	consumer_secret: process.env.consumer_secret,
	access_token: process.env.access_token,
	access_token_secret: process.env.access_token_secret
});	


module.exports = function( app ) {

	app.get('/', function(req, res) {
		res.sendfile(__dirname + '/index.html')
	});


	app.post('/username', function( req, res) {

		var userName = req.body.username

		Twitter.get('statuses/user_timeline', { screen_name: userName, count: 2000 },  function (err, reply) {
			
			
			if (!err) {

				var totalTweets = reply.length,
					bgImg = reply[0].user.profile_image_url,
					wordTotals = getWordTotals(reply),
					today = Date.parse(new Date()),
					timePeriodBetweenLastTweet = today - Date.parse(reply[totalTweets-1].created_at),
					avgTweets = (timePeriodBetweenLastTweet / (1000*60*60*24) ) / totalTweets,
					allWords = getAllWords(reply),
					sum = underscore.reduce(wordTotals.totalWordCount, function(memo, num){ return memo + num; }, 0),
					sortedWords = allWords.sort(),
					uniqueWords = underscore.uniq(sortedWords, true),
					wordList = getWordCount( uniqueWords, sortedWords),
					count = {'totalWords': sortedWords.length, 'uniqueWords': uniqueWords.length}


				res.send({'success': true, 
					'wordList': wordList, 
					'totals': count,
					'wordTotals': wordTotals, 
					'generalInfo': { 
						'screenname': userName,
						'totalTweets': totalTweets,
						'allWords': sum,
						'TweetsPerDay': avgTweets.toFixed(3),
						'bgImg': bgImg,
						'avgWordCount': (sum / reply.length).toFixed(3)
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
							
							var ignoredWords = ['are', 'about', 'and', 'but', 'for', 'have', 'how', 'just',
							'like', 'not', 'that', 'the', 'their', 'there', 'this', 'was', 'who',
							'what', 'where', 'were', 'with', 'you', 'your'];

							if (ignoredWords.indexOf(thisWord) === -1) {
								allWords.push(thisWord.toLowerCase() )	
							}

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

			var textArrary = [];
			var counterArray = [];

			for (var i=0; i <= data.length - 1; i ++ ) {

				textArrary.push( { 'text': data[i].text, 'length': data[i].text.length } );
				counterArray.push( data[i].text.length)
			}

			return {'textArray': textArrary, 'totalWordCount': counterArray };
		}
 	})

}