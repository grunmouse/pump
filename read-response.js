const fs = require('fs');

/**
 * Сохранить поток в файл
 */
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
 * Прочитать весь поток в буфер
 */
function readToBuffer(stream){
	return new Promise((resolve, reject)=>{
		let data = [];
		
		stream.on('data', (chunk)=>{
			data.push(chunk);
		})
		
		stream.on('end', (chunk)=>{
			if(chunk){
				data.push(chunk);
			}
			let buf = Buffer.concat(data);
			resolve(buf);
		});
		stream.on('error', (err)=>(reject(err)));
	});
}

module.exports = {
	saveToFile,
	readToBuffer
};