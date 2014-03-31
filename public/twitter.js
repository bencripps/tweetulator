$( function() {

	twitterClient.init();
})

var twitterClient = (function() {

	var init = function() {
		getUserClick();
	}


	var getUserClick = function() {

		var submit = $('#submit');

		submit.on('click', function(e) {
			e.preventDefault();

			var userName = $('#username').val();
			$('.progbar').css('visibility', 'visible');

			$.post('/username', {'username': userName })

			.success( function(data) {
				var error = $('#error')
					progBar = $('.progbar'),
					show = $('.show')

				if (data.totals) {

					show.css('visibility', 'visible');
					progBar.css('visibility', 'hidden');
					error.css('visibility', 'hidden');

					displayCommonWords(data)
					displayDatesGraph(data.wordTotals)
					showGeneralInfo(data)
					
				}

				else {
					error.css('visibility', 'visible');
					progBar.css('visibility', 'hidden');
					show.css('visibility', 'hidden');
				}
			})

		})
	};

	var showGeneralInfo = function(data) {

		var userObject = data.generalInfo;
		console.log(userObject)

		$('label#username').html(userObject.screenname);
		$('label#totalTweets').html(userObject.totalTweets);
		$('label#totalWords').html(userObject.allWords);
		$('label#TweetsPerDay').html(userObject.TweetsPerDay);
		$('#twitterImg').attr('src', userObject.bgImg);
		$('#avgWordCount').html(userObject.avgWordCount);
	}

	var displayCommonWords = function(data) {

		var totals = data.totals.totalWords;
		var unique = data.totals.uniqueWords;

		var justNumbers = [];
		var justNames = [];
		var indexNumber =[];
		var textBox = $('.textBox');
		var htmlInsert; 
		var index = 0;

		_.each(data.wordList, function(val, key) {

			if (val > 1 && key.length > 1) {
				indexNumber.push(index)
				justNumbers.push(val)
				justNames.push(key)

				htmlInsert += '<div class="word"><font size="' + val +'">'  + key + '</div>';
				index++;
			}
		});

		textBox.html(htmlInsert)

		}

		var displayDatesGraph = function(data) {
			
			console.log(data)

			$('.chart').empty();
				
			var canvas = d3.select('.chart')
							.append('svg')
							.attr('width', 2900)
							.attr('height', data.length * 5.2)

			var bars = canvas.selectAll('rect')
							.data(data)
							.enter()
								.append('rect')
								.attr('width', function(d){ return d; })
								.attr('height', 5)
								.attr('y', function(d, i) { return i * 5; })
								
		}
	
	return {

		'init': init
	}

})();