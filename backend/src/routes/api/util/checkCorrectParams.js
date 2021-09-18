import HTTP from './http_codes';

function checkCorrectParams(schemaParams) {
    return (req, res, next) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const param of schemaParams) {
            if (!req.body[param]) {
                return res.status(HTTP.BAD_REQUEST).send(`Missing ${param}`);
            }
        }
        return next();
    };
}

export { checkCorrectParams };
