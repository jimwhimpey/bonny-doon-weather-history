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

	const splitInMonths = [];

	const dayKeys = Object.keys(data);
	const days = dayKeys.map((dayKey) => {
		return {
			date: dayKey,
			day: parseInt(dayKey.split('-')[1], 10),
			month: parseInt(dayKey.split('-')[0]),
			keys: Object.keys(data[dayKey]),
			values: Object.keys(data[dayKey]).map(key => data[dayKey][key])
		};
	}).forEach((weatherOb) => {
		const month = splitInMonths[weatherOb.month];
		if (!month) {
			splitInMonths[weatherOb.month] = [];
		}
		splitInMonths[weatherOb.month][weatherOb.month.day] = weatherOb;
	});

	console.log('splitInMonths', splitInMonths);

	res.render('home', {
		days,
		months: splitInMonths,
		fields: Object.keys(splitInMonths[1][1]),
	});

});

app.listen(3000, () => console.log(`Listening on port ${3000}!`))
;
