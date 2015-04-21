import socketIO from 'socket.io'
import Room from './Room'
import SingleClient from './SingleClient'
import { mapVals } from './util'
import { validateName } from './validate'

export default class ChatServer {
	constructor() {
		// Maps room name to list of clients in that room.
		this.rooms = new Map()
		// Maps name to SingleClient
		this._clients = new Map()

		// This room will always stay open to welcome new users.
		this._addRoom('lobby')
	}

	begin(http) {
		this._socketServer = socketIO(http)
		this._socketServer.on('connection', socket => new SingleClient(this).begin(socket))
	}

	tryName(client, name) {
		if (this._clients.has(name))
			client.fail('Name taken.')
		else {
			const err = validateName(name)
			if (err)
				client.fail(err)
			else
				this._clients.set(name, client)
			return !err
		}
	}

	moveClientToRoom(client, roomName, clientCurrentRoom) {
		if (clientCurrentRoom)
			this._removeClientFromRoom(client, clientCurrentRoom)
		let room = this.rooms.get(roomName)
		if (room === undefined)
			room = this._addRoom(roomName)
		room.addClient(client)
		return room
	}

	cleanupClient(client, clientRoom) {
		if (clientRoom)
			this._removeClientFromRoom(client, clientRoom)
		this._clients.delete(client.getName())
	}

	// Tell everyone about a change in room info by resending all room info.
	// This could be more efficient, of course, but it's easier to just update everything.
	updateRooms() {
		mapVals(this._clients).forEach(client => client.updateRooms(this._roomInfo()))
	}

	_roomInfo() {
		return mapVals(this.rooms).map(_ => _.info())
	}

	_addRoom(name) {
		const room = new Room(name)
		this.rooms.set(name, room)
		return room
	}

	_removeClientFromRoom(client, room) {
		room.removeClient(client)
		// Delete empty rooms, but always leave the lobby open.
		if (room.getName() !== 'lobby' && room.isEmpty())
			this.rooms.delete(room.getName())
	}
}
