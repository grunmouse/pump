const fs = require('fs');
const URL = require('@grunmouse/url-decoder');
const PATH = require('path');
const {
	getPage,
	wait,
	download
} = require('../index.js');

async function loadLittlefoot(){
	let code = await getPage('https://www.furaffinity.net/view/52954064/');
	console.log(code);
}

loadLittlefoot().catch(e=>console.log(e.stack));
