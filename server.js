var express = require('express'),
	app = express();
	
app.set('port', process.env.PORT || 3000);

//linking static files to the root folder
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());

require('./routes/routes.js')( app );

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});