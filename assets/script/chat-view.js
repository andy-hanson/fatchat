import ChatClient from './ChatClient'
import ChatShow from './ChatShow'

// RequireJS doesn't play nice with links, so the script runs in index.html.
// This means we need help finding our way back to the content in the link.
const template =
	document.getElementById('link-chat-view').import.querySelector('template').content

export default document.registerElement('chat-view', {
	prototype: Object.assign(Object.create(HTMLElement.prototype), {
		createdCallback: function() {
			const root = this.createShadowRoot()
			root.appendChild(document.importNode(template, true))

			const client = new ChatClient()
			// This is evil, but works!
			client.onFail(msg => alert(msg))
			new ChatShow(root).begin(client)
		}
	})
})
