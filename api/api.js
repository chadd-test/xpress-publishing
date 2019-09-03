const apiRouter = require('express').Router();
const artistRouter = require('./artists');
const seriesRouter = require('./series');

// Import Routers
apiRouter.use('/artists', artistRouter);
apiRouter.use('/series', seriesRouter);

module.exports = apiRouter;

