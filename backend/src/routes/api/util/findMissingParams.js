function findMissingParams(body, expectedParams) {
    // eslint-disable-next-line no-restricted-syntax
    for (const param of expectedParams) {
        if (!body[param]) {
            return `Missing ${param}`;
        }
    }
    return null;
}

export default findMissingParams;
