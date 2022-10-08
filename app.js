/** @format */
import { config } from 'dotenv';

import { Server } from './models/server.js';

config();

const server = new Server();

server.listen();
