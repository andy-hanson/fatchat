import { validateMessage, validateRoomName } from './validate'

export default class SingleClient {
	constructor(server) {
		this._server = server
		this._name = this._room = null
	}

	begin(socket) {
		this._socket = socket
		socket.on('name', name => this.tryName(name))
		socket.on('message', message => this.sendMessage(message))
		socket.on('go-to-room', roomName => this.moveToRoom(roomName))
		socket.on('disconnect', () => {
			if (this._name)
				console.log(`Goodbye ${this._name}!`)
			this._server.cleanupClient(this, this._room)
		})
	}

	tryName(name) {
		if (this._server.tryName(this, name)) {
			console.log(`Hello ${name}!`)
			this._name = name
			this.moveToRoom('lobby')
		}
	}

	sendMessage(message) {
		console.log(`${this._name} says ${message}`)
		if (!this._name)
			this.fail('Sent message before registering name.')
		else {
			const err = validateMessage(message)
			if (err)
				this.fail(err)
			else
				this._socket.in(this._room.getName()).emit('message', {
					name: this._name,
					message
				})
		}
	}

	getName() {
		return this._name
	}

	moveToRoom(roomName) {
		const err = validateRoomName(roomName)
		if (err)
			this.fail(`Bad room name: ${err}`)
		else {
			console.log(`${this._name} is going to ${roomName}`)
			if (this._room)
				this._socket.leave(this._room.getName())
			this._socket.join(roomName)
			this._room = this._server.moveClientToRoom(this, roomName, this._room)
			this._server.updateRooms()
		}
	}

	fail(message) {
		console.log(`${this._name} fails because ${message}`)
		this._socket.emit('fail', message)
	}

	updateRooms(allRooms) {
		this._socket.emit('rooms', {
			yourRoom: this._room.getName(),
			usersInRoom: this._room.userNames(),
			allRooms
		})
	}
}
