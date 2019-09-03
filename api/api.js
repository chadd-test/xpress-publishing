const apiRouter = require('express').Router();
const artistRouter = require('./artists');
const seriesRouter = require('./series');
const issuesRouter = require('./issues');

// Import Routers
apiRouter.use('/artists', artistRouter);
apiRouter.use('/series', seriesRouter);
apiRouter.use('/:seriesId/issues', issuesRouter);


module.exports = apiRouter;

