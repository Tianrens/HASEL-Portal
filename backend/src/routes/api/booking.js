import express from 'express';
import HTTP from './util/http_codes';

const router = express.Router();

/** POST add a new booking */
router.post('/', (req, res) => {
    // TODO: POST add a new booking
    console.log(req.originalUrl);

    return res.status(HTTP.NOT_IMPLEMENTED).send('Unimplemented');
});

/** GET all bookings */
router.get('/', (req, res) => {
    // TODO: GET all bookings
    console.log(req.originalUrl);

    return res.status(HTTP.NOT_IMPLEMENTED).send('Unimplemented');
});

/** PUT edit a booking */
router.put('/', (req, res) => {
    // TODO: PUT edit a booking
    console.log(req.originalUrl);

    return res.status(HTTP.NOT_IMPLEMENTED).send('Unimplemented');
});

/** DELETE a booking */
router.delete('/', (req, res) => {
    // TODO: DELETE a booking
    console.log(req.originalUrl);

    return res.status(HTTP.NOT_IMPLEMENTED).send('Unimplemented');
});

export default router;
