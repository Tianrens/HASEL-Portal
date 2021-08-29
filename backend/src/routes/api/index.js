import express from 'express';
import firebaseAuth from '../../firebase/auth';

import user from './user';
import request from './request';
import resource from './resource';
import booking from './booking';

const router = express.Router();

router.use('/user', firebaseAuth, user);
router.use('/request', request);
router.use('/resource', resource);
router.use('/booking', booking);

export default router;
