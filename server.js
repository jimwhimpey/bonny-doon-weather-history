const _ = require('lodash');
const express = require('express');
const fs = require('fs');
const moment = require('moment');
const hbs = require( 'express-handlebars');
const bodyParser = require('body-parser');
const lessMiddleware = require('less-middleware');
const chroma = require('chroma-js');
const app = express();

const colorScale = chroma.scale(['#256cba', '#256cba','d32529']).mode('lch').colors(70);

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
	helpers: {
		percentage: function (input) {
			return `${Math.round(input * 100)}%`;
		},
		temperatureF: (input) => {
			return `<span style="color: ${colorScale[Math.round(input)]}">${Math.round(input)}℉</span>`;
		},
		intensity: (input) => {
			return input ? `${input.toFixed(2).substr(1)}mm/h` : 0;
		},
		pressure: (input) => {
			return `${Math.round(input)}hPa`;
		},
		momentFormat: function (input, format) {
			return moment(input).format(format);
		},
		ozone: function (input, format) {
			return moment(Math.round(input));
		}
	}
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

	// One per day
	const days = dayKeys.map((dayKey) => {

		return {
			date: dayKey,
			day: parseInt(dayKey.split('-')[1], 10),
			month: parseInt(dayKey.split('-')[0]),
			dateMoment: moment(dayKey, "M-D"),
			data: data[dayKey],
			keys: Object.keys(data[dayKey]),
			values: Object.keys(data[dayKey]).map(key => data[dayKey][key])
		};

	});

	// Then split it into an array of months and then
	// days within those months.
	const splitInMonths = [];
	days.forEach((weatherOb) => {
		const month = splitInMonths[weatherOb.month-1];
		if (!month) splitInMonths[weatherOb.month-1] = {
			date: moment(`${weatherOb.month}-1`, "M-D"),
			days: [],
		};
		splitInMonths[weatherOb.month-1].days[weatherOb.day-1] = weatherOb;
	});

	res.render('home', {
		days: days,
		months: splitInMonths,
		daysJson: JSON.stringify(days),
		monthsJson: JSON.stringify(splitInMonths),
	});

});

app.listen(3000, () => console.log(`Listening on port ${3000}!`))
;
