const asyncWrapper = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            console.log('async fle', error);
            next(error);
        }
    };
};

module.exports = asyncWrapper;
