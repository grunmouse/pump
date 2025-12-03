const fs = require('fs');
const URL = require('@grunmouse/url-decoder');
const PATH = require('path');
const {
	getPage,
	wait,
	download
} = require('../index.js');

function* execAll(str, regex) {
  if (!regex.global) {
    console.error('RegExp must have the global flag to retrieve multiple results.');
  }

  let match;
  while (match = regex.exec(str)) {
    yield match;
  }
}

async function loadWheeldust(){
	let episodes = new Map();
	
	let lastPage = 1;
	async function loadPage(page){
		let res = await getPage(`https://tapas.io/series/29969/episodes?page=${page}&sort=OLDEST&init_load=0&since=1761993815000&large=true&last_access=0&`);
		let pageData = JSON.parse(res.body);
	/*
page: 29,
  has_next: true,
  total: 569,	
	*/		
		console.log(pageData.data.pagination.page)
		if(!pageData.data.pagination.has_next){
			lastPage = pageData.data.pagination.page;
		}
		else{
			lastPage = Math.ceil(pageData.data.pagination.total/20);
		}
		let epi = pageData.data.episodes;
		for(let ep of epi){
			episodes.set(ep.scene, ep);
		}
	}

	async function prepareEpisode(epData){
		console.log(epData.title + ' ...');
		let episode = await getPage(`https://tapas.io/episode/${epData.id}`);
		let pat = /data-src="(https:\/\/us-a\.tapas\.io\/[^"]+)"/g;
		let m = [...execAll(episode.body, pat)];
				
		epData.imageUrl = m.map(m=>(m[1]));

		await downloadEpisode(epData);
	}
	
	function oldfilename(epData, fileExt, i){
		if(typeof i === 'number'){
			return epData.title + ' - ' + i + '.'+fileExt;
		}
		else{
			return epData.title + '.'+fileExt;
		}
	}
	
	function filename(epData, fileExt, i){
		let prefix = epData.scene.toString(10).padStart(4, '0');
		if(typeof i === 'number'){
			return prefix + ' ' + epData.title + ' - ' + i + '.'+fileExt;
		}
		else{
			return prefix + ' ' + epData.title + '.'+fileExt;
		}
	}
	
	async function downloadEpisode(epData){
		if(epData.scene<569) return;
		let imageUrl = epData.imageUrl;
		if(imageUrl.length == 1){
			let url = imageUrl[0];
			let urlData = URL.parse(url);
			let filename = filename(epData, urlData.fileExt);
			console.log(filename);
			await download(url, {}, '.\\files\\'+filename);
		}
		else{
			for(let i=0; i<imageUrl.length; ++i){
				let url = imageUrl[i];
				let urlData = URL.parse(url);
				let filename = filename(epData, urlData.fileExt, i);
				console.log(filename);
				await download(url, {}, '.\\files\\'+filename);
			}
		}
	}
	
	async function handleFiles(epData){
		let title = epData.title;
		let files = fs.readdirSync('.\\files');
		files = files.filter(name=>(name.indexOf(title)===0 && !/[a-z]|\d/.test(name[title.length])));
		
		let prefix = epData.scene.toString(10).padStart(4, '0');
		
		for(let name of files){
			console.log(prefix + ' ' + name)
			fs.renameSync('.\\files\\'+name, '.\\files\\'+prefix + ' ' + name);
		}
		
	}
	

	for(let i=0; i<=lastPage; ++i){
		await loadPage(i);
	}

	for(let ep of episodes.values()){
		//await prepareEpisode(ep);
		//await handleFiles(ep);
	}
}

loadWheeldust().catch(err=>(console.log(err.stack)));

/* let files = fs.readdirSync('.\\files');
for(let name of files){
	let newname = name.replace(/^\d\d\d\d /, '');
	fs.renameSync('.\\files\\'+name, '.\\files\\'+newname);
} */