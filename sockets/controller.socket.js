/** @format */
import { checkJWT } from '../helpers/jwt';

export const socketController = async (socket) => {
	const user = await checkJWT(socket.handshake.headers['x-token']);

	if (!user) return socket.disconnect();
};
