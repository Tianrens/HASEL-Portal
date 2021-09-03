import express from 'express';
import HTTP from './util/http_codes';

const router = express.Router();

/** POST add a new resource */
router.post('/', (req, res) => {
    // TODO: POST add a new resource
    console.log(req.originalUrl);

    return res.status(HTTP.NOT_IMPLEMENTED).send('Unimplemented');
});

/** GET all resources */
router.get('/', (req, res) => {
    // TODO: GET all resources
    console.log(req.originalUrl);

    return res.status(HTTP.NOT_IMPLEMENTED).send('Unimplemented');
});

/** GET bookings for a resource */
router.get('/booking', (req, res) => {
    // TODO: GET bookings for a resource
    console.log(req.originalUrl);

    return res.status(HTTP.NOT_IMPLEMENTED).send('Unimplemented');
});

/** PUT edit a resource */
router.put('/', (req, res) => {
    // TODO: PUT edit a resource
    console.log(req.originalUrl);

    return res.status(HTTP.NOT_IMPLEMENTED).send('Unimplemented');
});

/** DELETE a resource */
router.delete('/', (req, res) => {
    // TODO: DELETE a resource
    console.log(req.originalUrl);

    return res.status(HTTP.NOT_IMPLEMENTED).send('Unimplemented');
});

export default router;
