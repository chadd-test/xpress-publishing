const apiRouter = require('express').Router();
const artistRouter = require('./artists');

// Import Router 
apiRouter.use('/artists', artistRouter);


module.exports = apiRouter;

