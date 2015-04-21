import socketIO from 'socket.io'
import EventEmitter from 'eventEmitter'

// Handles interactions with the server and exposes events.
export default class ChatClient {
	constructor() {
		this._socket = socketIO()
		this._events = new EventEmitter()

		this._socket.on('fail', message => this._events.emitEvent('fail', [ message ]))
		this._socket.on('message', ({ name, message }) =>
			this._events.emitEvent('message', [ name, message ]))
		this._socket.on('rooms', ({ yourRoom, usersInRoom, allRooms }) =>
			this._events.emitEvent('rooms', [ yourRoom, usersInRoom, allRooms ]))
	}

	// If name succeeds, we'll get a 'rooms' event, otherwise we'll get a 'fail' event.
	tryName(name) {
		this._name = name
		this._socket.emit('name', name)
	}

	onFail(act) { this._events.on('fail', act) }
	onMessage(act) { this._events.on('message', act) }
	onRooms(act) { this._events.on('rooms', act) }

	send(message) {
		this._events.emitEvent('message', [ this._name, message ])
		this._socket.emit('message', message)
	}

	// Optionally creates the room.
	goToRoom(room) {
		this._socket.emit('go-to-room', room)
	}
}
