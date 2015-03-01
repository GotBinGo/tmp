exports
	create(user, name, pw)		
	join(user, gid)
	leave(user)
	send(gid, msg)
	sendUser(user, msg)
	listGroup(gid)
	listGroups()
inner
	groups[]
	group_counter
	getGroup //cancelled