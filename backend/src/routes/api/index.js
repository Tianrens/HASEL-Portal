import express from 'express';
import firebaseAuth from '../../firebase/auth';

import user from './user';
import request from './request';
import workstation from './workstation';
import booking from './booking';

const router = express.Router();

router.use('/user', firebaseAuth, user);
router.use('/request', firebaseAuth, request);
router.use('/workstation', firebaseAuth, workstation);
router.use('/booking', firebaseAuth, booking);

export default router;
