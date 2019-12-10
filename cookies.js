
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

	setCookie(cookie){
		let map = this.cookies;
		for(let str of cookie){
			let [data, states] = str.split(/;\s+/);
			let [name, value] = data.split('=');
			map.set(name, value);
		}
	}
	
	getCookies(){
		return [...this.cookies].map(([name, value])=>(name+'='+value)).join('; ');
	}
	
	grabCookies(headers){
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