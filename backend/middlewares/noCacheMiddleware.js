const noCacheMiddleware = (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
};

export default noCacheMiddleware;