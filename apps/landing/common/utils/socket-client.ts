import { io } from 'socket.io-client'

export default io(process.env['NX_WEB_SOCKET_URL'])