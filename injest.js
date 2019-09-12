const fs = require('fs');
const moment = require('moment');
const request = require('superagent');

const API_KEY = process.env.DARKSKY;
const firstDate = moment('1944-01-01T09:00:00Z');
const lastDate = moment('1944-01-04T09:00:00Z');
const momentFormat = 'YYYY-MM-DD[T]HH:mm[Z]';
const excludeParam = '?exclude=currently,minutely,hourly,flags';
const bonnyDoonCoords = '38.587384,-122.881365';
const host = 'https://api.darksky.net';
const path = 'forecast';

let dateCursor = firstDate;

const interval = setInterval(() => {
	fetchDay(dateCursor);
	dateCursor.add(1, 'day');
	if (dateCursor.isSame(lastDate, 'day')) {
		clearInterval(interval);
	}
}, 1000);

function fetchDay(date) {
	const url = `${host}/${path}/${API_KEY}/${bonnyDoonCoords},${encodeURIComponent(dateCursor.format(momentFormat))}${excludeParam}`;
	console.log('fetchDay', date);
}

// request
// 	.get(url)
// 	.then(res => {
//
// 		const newDayData = {};
// 		newDayData[firstDate] = res.body.daily.data[0];
//
// 		// write to a new file named 2pac.txt
// 		fs.writeFile(`data/${firstDate}.json`, JSON.stringify(newDayData), (err) => {
// 			console.log('write_success');
// 		});
//
// 	});
