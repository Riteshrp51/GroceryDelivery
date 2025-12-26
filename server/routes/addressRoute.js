import express from 'express';

import { addAddress, getAddresses } from '../controllers/addressController.js';
import authUser from '../middleware/authUser.js';

const addressRouter = express.Router();

addressRouter.post('/add', authUser, addAddress);
addressRouter.get('/get', authUser, getAddresses);

export default addressRouter;