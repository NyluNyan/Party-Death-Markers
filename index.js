module.exports = function UnicastFix(mod) {
	
	const brooches = [999001044, 999001045];
	
	let users = {},
	timer = null;
	
	mod.command.add('uf', (cmd)=> {
		mod.log(users);
    });
	
	mod.game.on('leave_loading_screen', () => {
		if(!timer && Object.keys(users).length) timer = mod.setInterval(Clear, 5000);
    });
	
	mod.hook('S_ABNORMALITY_BEGIN', 4, (event) => {
		if(brooches.includes(event.id)) users[event.target] = Date.now();
    });
	
	mod.hook('S_SPAWN_USER', 15, (event) => {
		if(users[event.gameId] && Date.now()-20000 > users[event.gameId]) delete users[event.gameId];
    });
	
	mod.hook('S_UNICAST_TRANSFORM_DATA', 6, (event) => {
		if(users[event.gameId]) {
			if(Date.now()-1000 > users[event.gameId]) delete users[event.gameId];
			return false;
		}
	});
	
	function Clear() {
		var date = Date.now();
		for(var user in users) {
			if(date-users[user] > 20000) delete users[user];
		}
		if(Object.keys(users).length) {
			mod.clearInterval(timer);
			timer = null;
		}
	}
};