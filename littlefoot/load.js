const fs = require('fs');
const URL = require('@grunmouse/url-decoder');
const PATH = require('path');
const {
	getPage,
	wait,
	download
} = require('../index.js');

async function loadLittlefoot(){
	let main = 'https://www.furaffinity.net/view/29922364';
	
	const pages = [main];
	const images = [];
	let lastPage = -1;
	
	async function loadPage(url){
		let code = await getPage(url);
		if(code.body){
			const reNext = /<a\s+href\s*=\s*"(\/view\/\d+)"\s*>NEXT&nbsp;&gt;&gt;&gt;<\/a>/;
			const reDownload = /href="([^"]+)"\s*>Download<\/a>/;
			
			let m = reNext.exec(code.body);
			if(m && m[1]){
				//console.log(m[1]);
				pages.push('https://www.furaffinity.net' + m[1]);
			}
			m = reDownload.exec(code.body);
			if(m && m[1]){
				//console.log(m[1]);
				images.push('https:' + m[1]);
			}
		}
	}
	
	for(let i = lastPage+1; i<pages.length; ++i){
		console.log(pages[i]);
		await loadPage(pages[i]);
	}
	
	for(let url of images){
		console.log(url);
		let urlData = URL.parse(url);
		let filename = urlData.file;
		//console.log(urlData);
		await download(url, {}, '.\\files\\'+filename);
		await wait(100);
	}
}

loadLittlefoot().catch(e=>console.log(e.stack));
