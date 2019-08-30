// Import Express Server
const express = require('express');
const app = express();

const PORT = process.env.PORT || 4001;

// import Express Middleware
const bodyparser = require('body-parser');
const morgan = require('morgan');

// Import SQLite ORM
const sqlite = require('sqlite3');
const db = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');

// Initialize Middleware
app.use(bodyparser.json());
app.use(morgan('tiny'));


// Start ExpressJS Routes

/* GET - Contains all currently-Employed Artists */
app.get('/api/artists', (req, res) => {
        let artists = [];
        db.each("SELECT * FROM Artist WHERE is_currently_employed = 1",
                (err, row) => {
                        if (err) {
                                console.log('error retrieving row from Artist' + err.message);
                                res.status(500).send;
                        } else {
                                artists.push(row);
                        }
                },
                (err, row) => { 
                        if (err) {
                                console.log('error sending rows from Artist' + err.message);
                                res.status(500).send;
                        } else { 
                                res.json({artists: artists});
                        }
                }

        );
});

/* POST Creates a new Artist */
app.post('/api/artists', (req, res) => {
        
});


// END ExpressJS Routes

// Listen on Express Server
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})


// Export app.js
module.exports = app;
