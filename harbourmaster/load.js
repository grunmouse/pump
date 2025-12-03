const {
	getPage,
	wait,
	download
} = require('../index.js');

async function loadHarborMaster(){
	const archives = [
		'http://www.waywardmartian.com/archive.html'
	];
	const pages = [];
	const images = []
	
	function addArchive(url){
		if(!archives.includes(url)){
			archives.push(url);
		}
	}
	function addPage(url){
		if(!pages.includes(url)){
			pages.push(url);
		}
	}
	function addImage(url){
		if(!images.includes(url)){
			console.log(url);
			images.push(url);
		}
	}
	
	async function loadArchive(url){
		url = url.replace(/^http:/, 'https:')
		console.log(url + ' ...');
		let page = await getPage(url);
		page.body.replace(/A HREF="(http:\/\/www\.waywardmartian\.com\/[^\/.]+\.html)"/gi, (str, url)=>{
			addArchive(url);
		});
		
		page.body.replace(/href="(https?:\/\/www\.waywardmartian\.com\/harbourmaster\d*\/\d\d\d-\d\d\d\.html)"/gi, (str, url)=>{
			addPage(url);
		});
	}
	
	async function loadPage(url){
		//https://www.waywardmartian.com/harbourmaster1/images/001-002.jpg
		url = url.replace(/^http:/, 'https:')
		
		let m = /(https?:\/\/www\.waywardmartian\.com\/harbourmaster\d*\/)(\d\d\d-\d\d\d)\.html/.exec(url);
		
		if(m){
			let img = m[1]+'images/'+m[2]+'.jpg';
			addImage(img);
		}
		else{
			console.log(url + ' ...');
			let page = await getPage(url);
			page.body.replace(/src="(https?:\/\/www\.waywardmartian\.com\/harbourmaster\d*\/images\/\d\d\d-\d\d\d\.jpg)"/gi, (str, url)=>{
				addImage(url);
			});
			await wait(100);
		}
	}
	
	async function downloadImage(url){
		let m = /https?:\/\/www\.waywardmartian\.com\/harbourmaster\d*\/images\/(\d\d\d-\d\d\d\.jpg)/.exec(url);
		let name = m[1];
		let part = parseInt(name.split('-')[0]);
		if(part>=48){
			console.log(url + ' ...');
			await download(url, {}, '.\\files\\'+name);
			await wait(100);
		}
	}
	
	for(let i=0; i<archives.length; ++i){
		await loadArchive(archives[i]);
		await wait(100);
	}
	
	for(let i=0; i<pages.length; ++i){
		await loadPage(pages[i]);
	}	
	
	for(let i=0; i<images.length; ++i){
		await downloadImage(images[i]);
	}
	

}


loadHarborMaster().catch(err=>(console.log(err.stack)));