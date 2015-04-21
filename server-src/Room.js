export default class Room {
	constructor(name) {
		this._name = name
		this._clients = [ ]
	}

	getName() {
		return this._name
	}

	addClient(client) {
		this._clients.push(client)
	}

	removeClient(client) {
		const idx = this._clients.indexOf(client)
		if (idx !== -1)
			this._clients.splice(idx, 1)
	}

	info() {
		return {
			name: this._name,
			count: this._clients.length
		}
	}

	isEmpty() {
		return this._clients.length === 0
	}

	userNames() {
		return this._clients.map(_ => _.getName())
	}
}
