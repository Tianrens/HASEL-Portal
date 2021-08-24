import express from 'express';

const router = express.Router();

/** POST a new user from Firebase */
router.post('/',  (req, res) => {
    // TODO: POST a new user from Firebase
    console.log(req.originalUrl);

    return res.status(501).send('Unimplemented');
});

/** GET all users */
router.get('/',  (req, res) => {
    // TODO: GET all users
    console.log(req.originalUrl);

    return res.status(501).send('Unimplemented');
});

/** PUT edit Firebase information */
router.put('/',  (req, res) => {
    // TODO: PUT edit Firebase information
    console.log(req.originalUrl);

    return res.status(501).send('Unimplemented');
});

/** GET user bookings */
router.get('/booking',  (req, res) => {
    // TODO: GET user bookings
    console.log(req.originalUrl);

    return res.status(501).send('Unimplemented');
});

/** GET user info */
router.get('/info',  (req, res) => {
    // TODO: GET user info
    console.log(req.originalUrl);

    return res.status(501).send('Unimplemented');
});

/** GET user resource */
router.get('/resource',  (req, res) => {
    // TODO: GET user resource
    console.log(req.originalUrl);

    return res.status(501).send('Unimplemented');
});


export default router;