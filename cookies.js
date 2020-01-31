
class Cookies{

	constructor(){
		this.cookies = new Map();
	}
	
	initCookies(cookies){
		cookies = cookies;
		if(cookies){
			this.setCookie(cookies.split(/;\s+/));
		}
	}

	setCookie(cookie, host){
		let map = this.cookies;
		for(let str of cookie){
			let [data, ...states] = str.split(/\s*;\s+/g);
			let [name, value] = data.split(/\s*=\s*/);
			
			states = new Map(states.map((str)=>{
				let [key, value] = data.split(/\s*=\s*/);
				return [key.toLowerCase(), value || ""];
			}));
			
			let origin = states.get('domain') || host;
			let path = states.get('path') || '/';
			
			map.set(name, value);
		}
	}
	
	getCookies(){
		return [...this.cookies].map(([name, value])=>(name+'='+value)).join('; ');
	}
	
	grabCookies(headers, host){
		let cookie = headers['set-cookie'];//Array
		//console.log(cookie);
		if(cookie){
			this.setCookie(cookie);
		}
	}
	
	includeCookies(headers){
		headers.cookie = this.getCookies();
	}
}

module.exports = Cookies;