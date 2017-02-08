function Utils() {

}

Utils.prototype.queue = function(arr, action) {
	if (!arr || !arr.reduce) {
		return Promise.resolve();
	}
	return arr.reduce(function (soFar, s) {
		return soFar.then(function() {
			return action(s);
		});
	}, Promise.resolve());
}

module.exports = new Utils();
