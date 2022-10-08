/** @format */
import { Router } from 'express';

import { search } from '../controllers/search.controller.js';

export const searchRouter = Router();

searchRouter.get('/:collection/:term', search);
