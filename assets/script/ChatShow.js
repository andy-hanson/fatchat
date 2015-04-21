import { div, onTextInputEnter, scrollToBottom, setContentsFromList } from './U/dom'
import { bind } from './U/util'

export default class ChatShow {
	constructor(chatViewRoot) {
		this.chatViewRoot = chatViewRoot

		// Clear text so that the user can enter the room name.
		this.em('new-room').onfocus = function() { this.value = '' }
	}

	em(emName) {
		return this.chatViewRoot.querySelector(`#${emName}`)
	}

	begin(client) {
		this._client = client
		onTextInputEnter(this.em('name'), name => client.tryName(name))

		onTextInputEnter(this.em('message'), bind(client, 'send'))
		onTextInputEnter(this.em('new-room'), room => client.goToRoom(room))
		client.onMessage(bind(this, 'showMessage'))
		client.onRooms(bind(this, 'showRooms'))
	}

	showRooms(myRoom, usersInRoom, allRooms) {
		this.em('login').style.display = 'none'
		this.em('chat').style.display = 'flex'

		setContentsFromList(this.em('room-list'), allRooms.map(({ name, count }) => {
			const isMine = name === myRoom
			const className = isMine ? 'room current' : 'room'
			const r = div(className, div('name', name), div('count', count))
			if (!isMine)
				r.onclick = () => this._client.goToRoom(name)
			return r
		}))

		setContentsFromList(this.em('users-in-room'), usersInRoom.map(name => div('users', name)))
	}

	showMessage(name, message) {
		this.em('messages').appendChild(div('message', div('name', name), message))
		scrollToBottom(this.em('messages'))
	}
}
