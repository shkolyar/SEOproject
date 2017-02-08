var request = require('request');
var config = require('../config');

function HQClient() {
	
}

HQClient.prototype.url = config.HQServerURL;

HQClient.prototype.inc = 0;

HQClient.prototype.get = function(method, params) {
	var self = this;
	return new Promise(function(resolve, reject) {
		self.inc++;
		var data = {
			id: self.inc,
			method: method,
			params: params
		};
		request.post({
			url : this.url,
			json : data
		}, function(error, response, res ){
			if (error) {
				console.log(error)
				return reject(error)
			}
			if (res && !res.error) {
				resolve(res.result);
			} else {
				if (res && res.error) {
					reject(new Error(res.error))
				} else {
					reject(new Error('Request is empty'))
				}
			}
		});
	}.bind(this));
}

module.exports = HQClient;
