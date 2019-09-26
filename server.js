const express = require('express');
const fs = require('fs');
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

const dataRaw = fs.readFileSync('./history/averages.json');
data = JSON.parse(dataRaw);

app.get('/', (req, res) => {

	const dayKeys = Object.keys(data);
	const days = dayKeys.map((dayKey) => {
		return {
			day: dayKey,
			keys: Object.keys(data[dayKey]),
			values: Object.keys(data[dayKey]).map(key => data[dayKey][key])
		};
	});

	res.render('home', { days });

});

app.listen(3000, () => console.log(`Listening on port ${3000}!`))
