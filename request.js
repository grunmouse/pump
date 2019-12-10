let https = require('https');
let fs = require('fs');

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
 * @param {ReadableStream} stream
 * @returned {Promise.<Array<stream chunk>>} - возвращает массив считанных из потока кусков
 */
function allChunks(stream){
	return new Promise((resolve)=>{
		let data = [];
		
		stream.on('data', (chunk)=>{
			data.push(chunk);
		})
		
		stream.on('end', (chunk)=>{
			if(chunk){
				data.push(chunk);
			}
			resolve(data);
		});
	});
}

function saveToFile(stream, filename){
	return new Promise((resolve, reject)=>{
		let st = stream.pipe(fs.createWriteStream(filename));
		//stream.resume();
		st.on('close', ()=>(resolve()));
		st.on('error', (err)=>(reject(err)));
		stream.on('error', (err)=>(reject(err)));
	});
}

/**
 * @returned {object}
 *   @property {object} headers - карта пришедших заголовков
 *   @propertt {string} body - текст ответа
 */
function getPage(url, headers){
	return get(url, headers).then((res)=>{
		let headers = res.headers;
		let rawHeaders = res.rawHeaders;
		
		return allChunks(res).then((chunks)=>{
			let buf = Buffer.concat(chunks);
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


module.exports = {
	getPage,
	download
}