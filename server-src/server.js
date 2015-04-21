import express from 'express'
import { Server } from 'http'
import { join as pathJoin } from 'path'
import ChatServer from './ChatServer'

export default () => {
	const app = express()
	app.use(express.static(pathJoin(process.cwd(), 'public')))
	const http = Server(app)

	new ChatServer().begin(http)

	const port = process.env.PORT || 8000
	http.listen(port, () => console.log(`Listening on localhost:${port}`))
}
