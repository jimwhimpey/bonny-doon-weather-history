const fs = require('fs');
const moment = require('moment');
const request = require('superagent');

const INTERVAL = 1000 * 60 * 2; // 2 minutes

const API_KEY = process.env.DARKSKY;
const dateCursor = moment('1944-01-02 09:00');
const lastDate = moment('1944-01-05 09:00');
const keyFormat = 'YYYY-MM-DD[T]HH:mm[:00][Z]';
const displayFormat = 'YYYY-MM-DD';
const excludeParam = '?exclude=currently,minutely,hourly,flags';
const bonnyDoonCoords = '38.587384,-122.881365';
const host = 'https://api.darksky.net';
const path = 'forecast';

// Fetch one instantly
fetchDay(dateCursor);

/**
 * Fetch a day's worth of weather and append it to a fresh file
 * @param  {moment} date Date to fetchDay
 * @return {void}
 */
function fetchDay(date) {

	console.log('----------------');

	const now = date.clone();

	const latestDate = now.clone().subtract(1, 'day');
	process.stdout.write(`Reading ${latestDate.format(displayFormat)} existing file... `);
	const latestFileName = `data/${latestDate.format(keyFormat)}.json`;
	const latestFileContent = fs.readFileSync(latestFileName);
	const latestData = JSON.parse(latestFileContent);
	console.log('OK!');

	const url = `${host}/${path}/${API_KEY}/${bonnyDoonCoords},${encodeURIComponent(now.format(keyFormat))}${excludeParam}`;

	process.stdout.write(`Fetching ${now.format(displayFormat)} data... `);

	request.get(url).then(res => {

		console.log('OK!');

		latestData[now.format(keyFormat)] = res.body.daily.data[0];

		process.stdout.write(`Writing ${now.format(displayFormat)} data to new file... `);
		// write to a new file named 2pac.txt
		fs.writeFile(`data/${now.format(keyFormat)}.json`, JSON.stringify(latestData), (err) => {
			console.log('OK!');

			const nextDay = now.add(1, 'day');

			if (!nextDay.isSame(lastDate)) {
				console.log(`Moving to ${nextDay.format(displayFormat)} in ${INTERVAL}ms...`);
				setTimeout(() => {
					fetchDay(nextDay);
				}, INTERVAL);
			} else {
				console.log('DONE');
			}

		});

	});

}
