const express = require('express');
const moment = require('moment');
const hbs = require( 'express-handlebars');
const bodyParser = require('body-parser');
const lessMiddleware = require('less-middleware');
const app = express();

/**
 * Handlebars support
 */
app.set('view engine', 'hbs');
app.engine( 'hbs', hbs({
	extname: 'hbs',
	defaultView: 'default',
	defaultLayout: 'default',
	layoutsDir: __dirname + '/views/layouts/',
	partialsDir: __dirname + '/views/partials/',
	helpers: {}
}));

/**
 * More express handlers
 */
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(lessMiddleware(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {

	res.render('home', {});

});

app.listen(3000, () => console.log(`Listening on port ${3000}!`))
