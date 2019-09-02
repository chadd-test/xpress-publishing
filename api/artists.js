const artistRouter = require('express').Router();
const sqlite = require('sqlite3');
const db = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');

// GET route for all Artists
artistRouter.get('/', (req, res, next) => {
	let artists = [];
   db.each("SELECT * FROM Artist WHERE is_currently_employed = 1",
      (err, row) => {
         if (err) {
				next(err); 
         } else {
            artists.push(row);
         }
      },
      (err) => { 
         if (err) {
				next(err);
         } else { 
            res.json({artists: artists});
         }
      }

   );
});


// POST route for all Artists
artistRouter.post('/', (req, res) => {

	function validate(obj) {
			if (!obj.name || !obj.dateOfBirth || !obj.biography) {
				return false;
			} else {
				return true;
			}
	}

	const checkArtist = validate(req.body.artist);
  
	if (!checkArtist) {
			res.status(400).json({msg: 'Requires that you include: name, date of birth and biography'});
	} else {
	      db.run("INSERT INTO Artist(name, date_of_birth, biography, is_currently_employed) VALUES($_name, $_date_of_birth, $_biography, $_is_currently_employed)",
      { 
         $_name: req.body.artist.name,
         $_date_of_birth: req.body.artist.dateOfBirth,
         $_biography: req.body.artist.biography,
			$_is_currently_employed: req.body.artist.isCurrentlyEmployed ? req.body.artist.isCurrentlyEmployed : 1 
      },
      function (err) {
          if (err) {
				next(err);
          } else {
               db.get("SELECT * FROM Artist WHERE id = $_id",
                  { 
                     $_id: this.lastID                              
                  },
                       function (err, row) {
									if (err) {
										next(err);
									} else {
										res.status(201).json({artist: row});
										// res.json({artist: row});	  
									}
								// Close IF err ELSE & db.get
							})
			// Close IF err ELSE
				}
		// Close db.run 
		})
	// Close IF !checkArtist ELSE
	}
// Close route for POST 
})


// ALL :artistId Routes
artistRouter.param('artistId', (req, res, next, artistId) => {
	db.get("SELECT * FROM Artist WHERE Artist.id = $artistId",
		{ $artistId: artistId },
		(err, row) => { 
			if (err) {
				next(err)	
			} else if (!row) { 
				res.status(404).json({msg:`No such artist with id: ${artistId}`}); 
			} else {
				req.artist = row;
				next();	
			}
		})
});

// GET route for :artistId
artistRouter.get('/:artistId', (req, res) => {
	res.json({artist:req.artist});
});

// PUT route for :artistId
artistRouter.put('/:artistId', (req, res) => {
	
});

module.exports = artistRouter;
