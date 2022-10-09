/** @format */
import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';
import { createServer } from 'http';
import { Server as Socket } from 'socket.io';

import { dbConnection } from '../database/config.db.js';
import { authRouter } from '../routes/auth.routes.js';
import { categoriesRouter } from '../routes/categories.routes.js';
import { productsRouter } from '../routes/products.routes.js';
import { searchRouter } from '../routes/search.routes.js';
import { uploadRouter } from '../routes/upload.routes.js';
import { userRouter } from '../routes/users.routes.js';
import { socketController } from '../sockets/controller.socket.js';

export class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;
		this.server = createServer(this.app);
		this.io = new Socket(this.server);

		this.paths = {
			auth: '/api/auth',
			categories: '/api/categories',
			products: '/api/products',
			search: '/api/search',
			uploads: '/api/uploads',
			user: '/api/users',
		};

		// DB Connection
		this.dbConnect();
		// Middlewares
		this.middlewares();
		// Routes
		this.routes();
		// Sockets
		this.sockets();
	}

	async dbConnect() {
		await dbConnection();
	}

	/**
	 * Middlewares for the server.
	 */
	middlewares() {
		// "use" is the keyword to middlewares.
		this.app.use(express.static('public')); // To use the files in the public folder.
		this.app.use(express.json()); // To read and parse the body of the requests.
		this.app.use(cors()); // To allow cors.

		this.app.use(
			// Middleware to accept the file uploads.
			fileUpload({
				useTempFiles: true,
				tempFileDir: '/tmp/',
				createParentPath: true, // To create a folder if not exist.
			})
		);
	}

	/**
	 * Routes for the server.
	 */
	routes() {
		this.app.use(this.paths.auth, authRouter); // For /api/auth
		this.app.use(this.paths.user, userRouter); // For the "/api/users" path we use the routes that we defined in our user.routes.js file
		this.app.use(this.paths.categories, categoriesRouter);
		this.app.use(this.paths.products, productsRouter);
		this.app.use(this.paths.search, searchRouter);
		this.app.use(this.paths.uploads, uploadRouter);
	}

	/**
	 * To start de server.
	 */
	listen() {
		this.app.listen(this.port, () => {
			console.log(`server running in port: ${this.port}`);
		});
	}

	/**
	 * Sockets events.
	 */
	sockets() {
		this.io.on('connection', (socket) => socketController(socket, this.io));
	}
}
