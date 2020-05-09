module.exports = function PartyDeathMarks(mod)
{
	let Members = [],
	Marks = [],
	index = 0,
	markId = 777777777n;
	//ClassMarker = {1: 91177, 2: 88704, 3: 88704, 4: 88704, 5: 88704, 6: 91113, 7: 91113, 8: 88704, 9: 88704, 10: 91177, 11: 88704, 12: 88704, 13: 88704};
	
	mod.command.add('pd', (cmd, arg1, arg2)=> {
		if(!isNaN(cmd))
		{
			mod.command.message('spawning item');
			mod.toClient('S_SPAWN_DROPITEM', 8,
			{
				gameId: markId,
				loc: mod.game.info.loc,
				item: cmd,
				amount: 1,
				expiry: 999999,
				explode: false,
				masterwork: false,
				enchant: 0,
				source: 0n,
				debug: false,
				owners: [0n]
			});
			markId++;
		}
    });
	
	mod.game.on('enter_loading_screen', UnmarkAll);
	
	mod.hook('S_PARTY_MEMBER_LIST', 7, event =>
	{
		Members = [];
		for(var i = 0; i < event.members.length; i++) Members.push(event.members[i].gameId, event.members[i].playerId, event.members[i].class);
	});
	
	mod.hook('S_SPAWN_DROPITEM', 8, event =>
	{
		mod.log(event);
	});
	
	mod.hook('S_SPAWN_USER', 15, event =>
	{
		if(!event.alive)
		{
			index = Members.indexOf(event.gameId);
			if(index !== -1 && event.playerId !== mod.game.me.playerId && !Marks.includes(event.playerId)) Mark(event.gameId, event.loc);
		}
		else if(Marks.includes(event.gameId))
		{
			index = Marks.indexOf(event.gameId);
			Unmark(Marks[index+2]);
		}
	});
	
	mod.hook('S_CREATURE_LIFE', 3, event =>
	{
		if(mod.game.me.gameId === event.gameId) return;
		if(!event.alive && !Marks.includes(event.gameId))
		{
			index = Members.indexOf(event.gameId);
			Mark(event.gameId, event.loc);
		}
		else if(event.alive && Marks.includes(event.gameId))
		{
			index = Marks.indexOf(event.gameId);
			Unmark(Marks[index+2]);
		}
	});
	
	mod.hook('S_LEAVE_PARTY_MEMBER', 2, event =>
	{
		if(Marks.includes(event.playerId))
		{
			index = Marks.indexOf(event.playerId)-1;
			Unmark(Marks[index+2]);
		}
	});
	
	mod.hook('S_LEAVE_PARTY', 1, UnmarkAll);
	
	function Mark(gameId, loc)
	{
		loc.z -= 100;
		mod.toClient('S_SPAWN_DROPITEM', 8,
		{
			gameId: markId,
			loc: loc,
			item: 88704,
			amount: 1,
			expiry: 999999,
			explode: false,
			masterwork: false,
			enchant: 0,
			source: 0n,
			debug: false,
			owners: [0n]
		});
		Marks.push(gameId, Members[index+1], markId);
		markId++;
	}
	
	function Unmark(id)
	{
		mod.toClient('S_DESPAWN_DROPITEM', 4, { gameId: id });
		Marks.splice(Marks.indexOf(id)-2, 3);
	}
	
	function UnmarkAll()
	{
		if(Marks.length) for(var i = 0; Marks.length > 0; i++) Unmark(Marks[2]);
		markId = 777777777n;
	}
	
	/*function getMarker(classid)
	{
		switch (classid)
		{
			case 1:
			case 10:
			return 91177;
			case 6:
			case 7:
			return 91113;
			default:
			return 88704;
		}
	}*/
}