// Import Express Server
const express = require('express');
const app = express();
const apiRouter = require('./api/api');

const PORT = process.env.PORT || 4001;
// import Express Middleware
const bodyparser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler');
const morgan = require('morgan');

// Import SQLite OR
const sqlite = require('sqlite3');
const db = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');

// Initialize Middleware
app.use(bodyparser.json());
app.use(cors());
app.use(errorhandler());
app.use(morgan('tiny'));

// Import API Router
app.use('/api', apiRouter);

// Listen on Express Server
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})

// Export app.js
module.exports = app;

