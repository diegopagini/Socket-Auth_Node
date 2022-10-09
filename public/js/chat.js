/** @format */

// HTML References

const txtUid = document.querySelector('#txtUid');
const txtMsg = document.querySelector('#txtMsg');
const ulUsers = document.querySelector('#ulUsers');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');

let user = null;
let socket = null;

const validateJWT = async () => {
	const token = localStorage.getItem('token') || '';

	if (token.length <= 10) {
		window.location = 'index.html';
		throw new Error('There is no token ');
	}

	const resp = await fetch('http://localhost:8080/api/auth', {
		headers: { 'x-token': token },
	});

	const { user: userDB, token: tokenDB } = await resp.json();
	localStorage.setItem('token', tokenDB);
	user = userDB;
	document.title = user.name;

	await connectSocket();
};

const connectSocket = async () => {
	socket = io({
		extraHeaders: {
			'x-token': localStorage.getItem('token'),
		},
	});

	// Listenners:
	socket.on('connect', () => {});

	socket.on('disconnect', () => {});

	socket.on('recibir-mensajes', () => {});

	// socket.on('usuarios-activos', (payload) => {
	// 	printUsers(payload);
	// });
	socket.on('usuarios-activos', printUsers); // Shorter version.

	socket.on('mensaje-privado', () => {});
};

const printUsers = (users = []) => {
	let usersHtml = '';
	user.forEach(({ name, uid }) => {
		usersHtml += `
		<li>
			<p>
				<h5 class="text-success"> ${name} </h5>
				<span class="fs-6 text-muted">${uid}</span>
			</p>
		</li>
		`;
	});

	ulUsers.innerHTML = usersHtml;
};

const main = async () => {
	await validateJWT();
};

main();
