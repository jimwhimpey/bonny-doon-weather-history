const fs = require('fs');
const moment = require('moment');
const daysOfYear = require('./config/days-of-year.js');

const rawContent = fs.readFileSync('history/raw.json');
const rawData = JSON.parse(rawContent);

const days = Object.keys(rawData);

console.log('days.length', days.length);

days.forEach((day) => {

	const dayParsed = moment(day);
	const dayFilename = dayParsed.format('M-D');
	const dayFilePath = `./history/${dayFilename}.json`;
	const year = dayParsed.format('YYYY');
	console.log('dayParsed', dayParsed);

	let dayData = {};

	if (fs.existsSync(dayFilePath)) {
		const dayDataRaw = fs.readFileSync(dayFilePath);
		dayData = JSON.parse(dayDataRaw);
	}

	dayData[year] = rawData[day];

	fs.writeFileSync(dayFilePath, JSON.stringify(dayData));

});
