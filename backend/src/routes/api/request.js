import express from 'express';

const router = express.Router();

/** POST new request */
router.post('/',  (req, res) => {
    // TODO: POST new request
    console.log(req.originalUrl);

    return res.status(501).send('Unimplemented');
});

/** GET all requests */
router.get('/',  (req, res) => {
    // TODO: GET all requests
    console.log(req.originalUrl);

    return res.status(501).send('Unimplemented');
});

/** PATCH approve or deny request */
router.patch('/',  (req, res) => {
    // TODO: PATCH approve or deny request
    console.log(req.originalUrl);

    return res.status(501).send('Unimplemented');
});

/** DELETE a request */
router.delete('/',  (req, res) => {
    // TODO: DELETE a request
    console.log(req.originalUrl);

    return res.status(501).send('Unimplemented');
});


export default router;