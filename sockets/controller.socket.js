/** @format */
import { checkJWT } from '../helpers/jwt.js';
import { ChatMessage } from '../models/chat-info.js';

const chatMessage = new ChatMessage();

export const socketController = async (socket, io) => {
	const user = await checkJWT(socket.handshake.headers['x-token']);

	if (!user) return socket.disconnect();

	// Agregar el usuario conectado.
	chatMessage.connectUser(user);
	io.emit('usuarios-activos', chatMessage.usersArr);
	socket.emit('recibir-mensajes', chatMessage.lastTen);

	// Conectarlo a una sala especial
	socket.join(user.id); // global, socket.id, user.id.

	/**
	 * socket.to para eventos privados
	 */
	// socket.to(socket.id).emit()

	// Limpiar cuando alguien se desconecta.
	socket.on('disconnect', () => {
		chatMessage.disconnect(user.id);
		io.emit('usuarios-activos', chatMessage.usersArr);
	});

	socket.on('enviar-mensaje', ({ uid, msg }) => {
		// Mensaje privado
		if (uid) {
			socket.to(uid).emit('mensaje-privado', {
				from: user.name,
				msg,
			});
		} else {
			chatMessage.sendMessage(user.id, user.modelName, msg);
			io.emit('recibir-mensajes', chatMessage.lastTen);
		}
	});
};
