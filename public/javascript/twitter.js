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
					displayWordCountGraph(data.wordTotals.textArray)
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

		var textBox = $('.textBox');
		var totals = [];
		var htmlInsert = ""; 

		_.each(data.wordList, function(val, key) {

			if (val > 1 && key.length > 1) {

				htmlInsert += '<div class="word" id="popularity'+ val +'"><font size="' + (val + 2) + '">'  + key + '</div>';
				totals.push(val)
			}
		});

		var mostPopularValue = _.max(totals)

		textBox.html(htmlInsert)

		$('#popularity' + mostPopularValue).addClass('mostPopular')

		}

		var displayWordCountGraph = function(data) {

			$('.chart').empty();
				
			var canvas = d3.select('.chart')
							.append('svg')
							.attr('width', 1000)
							.attr('height', data.length * 6)			

			var div = d3.select(".chart").append("div")   
					    .attr("class", "tooltip")               
					    .style("opacity", 0);					
											
								
			var XaxisScale = d3.scale.linear()
                         .domain([0,150])
                         .range([0,data.length * 4])

            var YaxisScale = d3.scale.linear()
                         .domain([0,150])
                         .range([0,data.length * 150])             

            var xAxis = d3.svg.axis()
            			.scale(XaxisScale)
            			.ticks(7)

            var yAxis = d3.svg.axis()
            			.scale(YaxisScale)
            			.ticks(data.length)			

            var xAxisGroup = canvas.append("g")
            				.attr('class', 'axis')
            				.attr('transform', 'translate(5,8)')
                             .call(xAxis);

            var yAxisGroup = canvas.append('g')
            			     .attr('class', 'axis')
            			     .attr('transform', function(d) {
         							return "rotate(-65)"})             

            var bars = canvas.selectAll('rect')
							.data(data)
							.enter()
								.append('rect')
								.attr('width', function(d){ return d.length * 5; })
								.attr('height', 5)
								.attr('y', function(d, i) { return i * 5; })
								.attr('transform', 'translate(0,50)')

								.on('mouseover', function(d) {
									div.transition()
										.duration(200)
										.style('opacity', .9);

								div.html('<b>Character Count:' + d.length + '<br/> Text: </b>' + d.text)
								   .style('left', (d3.event.pageX) + "px")
								   .style("top", (d3.event.pageY - 28) + "px");		

								})

								.on('mouseout', function(d) {
									div.transition()
										.duration(500)
										.style('opacity', 0);
								})                 

                             			             				
		}
	
	return {

		'init': init
	}

})();