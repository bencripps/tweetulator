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

			$.post('/username', {'username': userName })
		})
	}
	
	return {
		'init': init
	}

})();