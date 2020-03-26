module.exports = function PartyDeathMarks(mod)
{
	let Members = [],
	Marks = [],
	index = 0,
	markId = 777777777;

	mod.game.on('enter_loading_screen', UnmarkAll);
	
	mod.hook('S_PARTY_MEMBER_LIST', 7, event =>
	{
		Members = [];
		for(var i = 0; i < event.members.length; i++) Members.push(event.members[i].gameId, event.members[i].playerId, event.members[i].class);
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
			item: getMarker(Members[index+2]),
			amount: 1,
			expiry: 999999,
			owners: [{playerId: mod.game.me.playerId}]
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
		markId = 777777777;
	}
	
	function getMarker(classid)
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
			return 98260;
		}
	}
}