let https = require('https');
let fs = require('fs');

const {
	saveToFile,
	readToBuffer
} = require('./read-response.js');

/**
 * Делает GET-запрос, асинхронно возвращает полученный поток или бросает ошибку в случае ошибки загрузки
 * @return Promise
 */
function get(url, headers){
	let options = {headers, method:"GET"}
	return new Promise((resolve, reject)=>{
		let req = https.request(url, options);
		req.once('response', (res)=>{
			if(res.statusCode === 200){
				resolve(res);
			}
			else{
				reject(res);
			}
		});
		req.on('error', (err)=>{
			reject(err);
		});
		req.once('timeout', ()=>{
			reject('timeout');
		});		
		req.once('aborted', ()=>{
			reject('aborted');
		});
		req.end();
	});
}


/**
 * @returned {object}
 *   @property {object} headers - карта пришедших заголовков
 *   @property {string} body - текст ответа
 */
function getPage(url, headers){
	return get(url, headers).then((res)=>{
		let headers = res.headers;
		let rawHeaders = res.rawHeaders;
		
		return readToBuffer(res).then((buf)=>{
			let body = buf.toString();
			
			return {
				headers,
				body,
				rawHeaders
			}
		});
	});
}

function download(url, headers, filename){
	return get(url, headers).then((res)=>{
		let headers = res.headers;
		
		let r = saveToFile(res, filename)
			.then(()=>({headers}))
			;
		return r;
	})
}

function getByMime(url, headers, handlers){
	return get(url, headers).then((res)=>{
		const type = res.getHeader('Content-Type');
		const fun = handlers[type] || handlers['*/*'];
		return fun(res);
	});
}


module.exports = {
	get,
	getPage,
	download,
	getByMime
}