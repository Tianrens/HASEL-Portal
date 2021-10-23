import HTTP from './http_codes';

/**
 * Checks if any parameters are missing in a request. If missing, returns a BAD_REQUEST error.
 * @param schemaParams an array of expected parameter names
 */
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
