/**
 * request wait 
 */
 
const {
	getPage,
	download
} = require('./request.js');

const wait = require('./wait.js');

const Cookies = require('./cookies.js');

module.exports = {
	getPage,
	download,
	wait,
	Cookies
};