const issuesRouter = require('express').Router({mergeParams:true});
const sqlite = require('sqlite3');
const db = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');

/********************************/
/* Issue Routes without PARAMS */
/********************************/

// GET route for all in Issue
issuesRouter.get('/', (req, res, next) => {
	const issues = []
	db.each("SELECT * FROM Issue where series_id = " + req.params.seriesId,
		(err, row) => {
			if (err) {
				next(err);
			} else {
				issues.push(row);	
			}},
		(err) => {
				res.json({issues: issues});
	})
});

// POST route for Issue
issuesRouter.post('/', (req, res, next) => {
 
	if (!req.body.issue.name || !req.body.issue.issueNumber || !req.body.issue.publicationDate || !req.body.issue.artistId) {
		res.status(400).json({msg: `Please also include a name, issueNumber, publicationDate and artistId`});
	} else {
		db.get("SELECT * FROM Artist WHERE id = " + req.body.issue.artistId, (err, row) => {
			if (err || !row) {
				res.status(400).json({msg: `Invalid ArtistId`});		
			} else {
				db.run("INSERT INTO Issue(name, issue_number, publication_date, artist_id, series_id) VALUES($_name, $_issueNumber, $_publicationDate, $_artistId, $_seriesId)",
			{
				$_name: req.body.issue.name,
				$_issueNumber: req.body.issue.issueNumber,
				$_publicationDate: req.body.issue.publicationDate,
				$_artistId: req.body.issue.artistId,
				$_seriesId: req.params.seriesId
			},
			function (err) {
				if (err) {
					next(err);
				} else {
					db.get("SELECT * FROM Issue WHERE id=" + this.lastID,
						(err, row) => {
							if (err) {
								next(err);
							} else {
								res.status(201).json({issue: row});
							}
					})
				}
			});	
		}
	})
}});



/****************************/
/* Issue Routes with PARAMS */
/****************************/

// PARAM for all :issueId routes
issuesRouter.param('issueId', (req, res, next, issueId) => {
	db.get("SELECT * FROM Issue WHERE id = " + issueId,
		(err, row) => {
			if(err) {
				next(err);
			} else if (!row) {
				res.status(404).json({msg: `issueId invalid`});	
			} else {
				next();
			}	
		})
});

// GET individual issueId
issuesRouter.get('/:issueId', (req, res, next) => {
	db.get("SELECT * FROM Issue WHERE id = " + req.params.issueId,
		(err, row) => {
			if (err) {
				next(err);
			} else {
				res.json({issue: row});
			}
		});
});

// PUT route for Issue
issuesRouter.put('/:issueId', (req, res, next) => {

	if(!req.body.issue.name || !req.body.issue.issueNumber || !req.body.issue.publicationDate || !req.body.issue.artistId) {
		res.status(400).json({msg: `Please include a name, issueNumber, publicationDate and artistId`})

	} else {
			  
		db.get("SELECT * FROM Artist WHERE id = " + req.body.issue.artistId, (err, row) => {
			if (err || !row) {
				res.status(400).json({msg: `Invalid ArtistId`});		
			} else {

				values = {
					$_name: req.body.issue.name,
					$_issueNumber: req.body.issue.issueNumber,
					$_publicationDate: req.body.issue.publicationDate, 
					$_artistId: req.body.issue.artistId 
				};
					  
				db.run("UPDATE Issue SET name = $_name, issue_number = $_issueNumber, publication_date = $_publicationDate, artist_id = $_artistId WHERE id = " + req.params.issueId, values,
					(err) => {
						if (err) {
							next(err);	
						} else {
							db.get("SELECT * FROM Issue WHERE id = " + req.params.issueId,
								(err, row) => {
									if (err) {
										next(err);
									} else {
										res.json({issue: row})
									}			
							})
						}
				});
			}

		});
	}
});

// DELETE route for Issue
issuesRouter.delete('/:issueId', (req, res, next) =>  {
	db.run("DELETE FROM Issue WHERE id = " + req.params.issueId,
		(err) => {
			if (err) {
				next(err);
			} else {
				res.status(204).send();
			}
		})	

});

module.exports = issuesRouter;
