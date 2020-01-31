/**
 * request wait 
 */
 
const {
	get,
	getPage,
	download,
	getByMime
} = require('./request.js');

const {
	saveToFile,
	readToBuffer
} = require('./read-response.js');

const wait = require('./wait.js');

const Cookies = require('./cookies.js');

module.exports = {
	get,
	getPage,
	download,
	getByMime,

	saveToFile,
	readToBuffer,

	wait,

	Cookies
};