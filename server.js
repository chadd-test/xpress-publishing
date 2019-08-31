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


// Custom Validation Middleware
const validateArtist = () => {
	return (req, res, next) => {

	function validate(obj) {
			if (!obj.id || !obj.name || !obj.dateOfBirth || !obj.biography || !obj.isCurrentlyEmployed) {
				return false;
			} else {
				return true;
			}
	}

	const checkArtist = validate(req.body.artist);
		if (!checkArtist) {
			// console.log('failed - invalid POST values');
			res.status(400);
			res.json({msg: 'Requires that you include: id, name, date of birth, biography and currentlyEmployed set to 1'});
		} else {
			// console.log('success - completed check');
			next();
		}
	}
};

// Start ExpressJS Routes

/* GET - Contains all currently-Employed Artists */
app.get('/api/artists', (req, res) => {
	let artists = [];
   db.each("SELECT * FROM Artist WHERE is_currently_employed = 1",
      (err, row) => {
         if (err) {
				// console.log('error retrieving row from Artist' + err.message);
            res.status(500).send;
         } else {
            artists.push(row);
         }
      },
      (err) => { 
         if (err) {
				// console.log('error sending rows from Artist' + err.message);
            res.status(500).send;
         } else { 
            res.json({artists: artists});
         }
      }

   );
});

/* POST Creates a new Artist */
app.post('/api/artists', validateArtist(), (req, res) => {
   db.serialize( () => { 
      db.run("insert into Artist(id, name, date_of_birth, biography, is_currently_employed) VALUES($_id, $_name, $_date_of_birth, $_biography, $_is_currently_employed)",
      { 
         $_id: req.body.artist.id,
         $_name: req.body.artist.name,
         $_date_of_birth: req.body.artist.dateOfBirth,
         $_biography: req.body.artist.biography,
         $_is_currently_employed: req.body.artist.isCurrentlyEmployed 
      },
      (err) => {
          if (err) {
				// console.log('error with INSERT INTO Artist'+ err.message);
				res.status(500).send;
          } else {
					// console.log('success with INSERT INTO Artist');
               db.get("SELECT * FROM Artist WHERE id = $_id",
                  { 
                     $_id: req.body.artist.id                              
                  },
                       (err, row) => {
									if (err) {
										// console.log('error with retrieving row from Artist' + err.message);
										res.status(500).send;
									} else {
										res.status(201);
										res.json({artist: row});	  
									}
                              
               })
          }
      }) 

   });
});

// GET req.params Route
app.get('/api/artists/:artistId', (req, res) => {
	db.get("SELECT * FROM Artist WHERE id = $_artistId",
		{
			$_artistId: req.params.artistId
		},
		(err, row) => { 
			if (err) {
				res.status(500).send;
			} else if (!row) {
				// console.log('error, artist not found');
				res.status(404);
				res.json({msg:`No such artist with id: ${req.params.artistId}`});
			} else {
				// console.log(`success - reading artist now`);
				res.json({artist: row});
			}
		}
	)
});

// PUT req.params Route - artistId
app.put('/api/artists/:artistId', (req, res) => {
 
	// Validate PUT request data
	if (!req.body.artist.id) {
		console.log('error - unable to find Id');	  
		res.status(400);
		res.json({msg: `Please include an ID`});
	} else {
		// scope this. required to update the database.	  
		console.log('success - artistId good');
		let updatedObject = {};
	
		db.get("SELECT * FROM Artist WHERE id = $artist_id",
			{ $artist_id: req.body.artist.id },
			(err, row) => {
				if (err) {
						console.log('error - DB Validation' + err.message);
						res.status(500).send;
				} else {
						console.log('success - sanitizing objects');
						delete row.id; 
						updatedObject = {
							name: req.body.artist.name,
							date_of_birth: req.body.artist.dateOfBirth,
							biography: req.body.artist.biography,
							is_currently_employed: req.body.artist.isCurrentlyEmployed
						}
						console.log('success - updatedObject created ' + updatedObject.name);
						for(let key in row) {
							if (row[key] === updatedObject[key] || updatedObject[key] === undefined) {
								console.log(`DELETED - ${key} ${row[key]}`);
								delete updatedObject[key];	
							}
						}
					}
		});

			// NOT RUNNING
			console.log('running 2nd FOR/IN loop');
			for(let key in updatedObject) {
					db.run("UPDATE Artist SET $column = $colValue WHERE id = $updateId", 
						{ 
							$updateId: req.body.artist.id,		  
							$column: key,
							$colValue: updatedObject[key] 
						},
						(err) => { 
							if (err) { 
								console.log('Error updating Artist'+ err.message);
								res.status(500).send;
							} else {
								db.get("SELECT * FROM Artist WHERE id = $updateId",
									(err, row) => {
										if (err) {
											res.status(500).send;
										} else {
											res.status(201);
											res.json({artist: row});
										}
									}
								)	
							}			  
					})
			}		
	} 
});
// END ExpressJS Routes


// Listen on Express Server
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})


// Export app.js
module.exports = 'server';


