/** @format */
import { checkJWT } from '../helpers/jwt.js';
import { ChatMessage } from '../models';

const chatMessage = new ChatMessage();

export const socketController = async (socket, io) => {
	const user = await checkJWT(socket.handshake.headers['x-token']);

	if (!user) return socket.disconnect();

	// Agregar el usuario conectado.
	chatMessage.connectUser(user);
	io.emit('usuarios-activos', chatMessage.usersArr);

	// Limpiar cuando alguien se desconecta.
	socket.on('disconnect', () => {
		chatMessage.disconnect(user.id);
		io.emit('usuarios-activos', chatMessage.usersArr);
	});
};
