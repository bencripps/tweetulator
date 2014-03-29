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

			$.post('/username', {'username': userName }, function(data) {

				$('.show').css('visibility', 'visible');
				$('.progbar').css('visibility', 'hidden');

				displayGraph(data)
				showGeneralInfo(data)
			})
		})
	};

	var showGeneralInfo = function(data) {

		var userObject = data.generalInfo;
		console.log(userObject)

		$('label#username').html('User Name: ' + userObject.screenname);
		$('label#totalTweets').html('Number of Tweets Analyzed: ' + userObject.totalTweets);
		$('label#totalWords').html('Total Number of Words Processed: ' + userObject.allWords);
		$('label#TweetsPerDay').html('Average Number of Tweets per day: ' + userObject.TweetsPerDay);
		$('#twitterImg').attr('src', userObject.bgImg);
	}

	var displayGraph = function(data) {

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

		textBox.append(htmlInsert)
		console.log(justNumbers)

	    var chart,
		    width = 700,
		    bar_height = 2,
		    height = bar_height * justNames.length;

		chart = d3.select(".chart") 
		  .append('svg')
		  .attr('class', 'chart')
		  .attr('width', width)
		  .attr('height', height);

		var x, y;
		x = d3.scale.linear()
		   .domain([0, d3.max(justNumbers)])
		   .range([0, width]);

		y = d3.scale.ordinal()
		   .domain(justNumbers)
		   .rangeBands([0, height]);

		chart.selectAll("rect")
		   .data(justNumbers)
		   .enter().append("rect")
		   .attr("x", 0)
		   .attr("y", y)
		   .attr("width", x)
		   .attr("height", y.rangeBand()); 

		chart.selectAll("text")
		  .data(justNumbers)
		  .enter().append("text")
		  .attr("x", x)
		  .attr("y", function(d){ return y(d) + y.rangeBand()/2; } )
		  .attr("dx", -5)
		  .attr("dy", ".36em")
		  .attr("text-anchor", "end")
		  .text(String);

		}
	
	return {

		'init': init
	}

})();