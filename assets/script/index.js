window.requirejs.config({
	baseUrl: './lib',
	paths: {
		eventEmitter: 'eventEmitter/EventEmitter',
		jquery: 'jquery/dist/jquery',
		'socket.io': 'socket.io-client/socket.io'
	}
})

require([ '../script/chat-view' ])
