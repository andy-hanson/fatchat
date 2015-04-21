export const
	div = (className, ...content) => {
		const _ = document.createElement('div')
		_.className = className
		content.forEach(child => _.appendChild(toNode(child)))
		return _
	},

	onTextInputEnter = (textInput, act) => {
		textInput.onkeypress = event => {
			if (event.keyCode === EnterKeyCode) {
				const val = textInput.value
				textInput.value = ''
				act(val)
			}
		}
	},

	scrollToBottom = domElement => {
		domElement.scrollTop = domElement.scrollHeight
	},

	setContentsFromList = (parent, children) => {
		empty(parent)
		children.forEach(child => parent.appendChild(child))
	}

const
	EnterKeyCode = 13,

	empty = node => {
		while (node.firstChild)
			node.removeChild(node.firstChild)
	},

	toNode = _ =>
		(typeof _ === 'string' || typeof _ === 'number') ?
			document.createTextNode(_) :
			_
