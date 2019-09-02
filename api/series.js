const seriesRouter = require('express').Router();

const sqlite = require('sqlite3');
const db = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');


/* Routes without PARAMS */

// GET route for all in Series
seriesRouter.get('/', (req, res, next) => {
	let series = [];
	db.each("SELECT * FROM Series",
		(err, row) => {
			if (err) {
				next(err)
			} else {
				series.push(row);
			} 
		},
		(err) => {
			if (err) {
				next(err);
			} else {
				res.json({series: series});
			}
		})
});


// POST route for Series
seriesRouter.post('/', (req, res, next) => {
	if (!req.body.series.name ||	!req.body.series.description) {
		res.status(400).json({msg: 'Please enter both name and description for your POST request.'});
	} else {
		db.run("INSERT INTO Series(name, description) VALUES ($_name, $_description)",
			{ 
				$_name: req.body.series.name,
				$_description: req.body.series.description
			},
			function (err) {
				if (err) {
					next(err);
				} else {
					db.get("SELECT * FROM Series WHERE id = " + this.lastID,
						(err, row) => {
							if (err) {
								next(err);
							} else {
								res.status(201).json({series: row});
							}
					})
				}
		}) 
	} 

}); 


/* Routes with PARAMS */

// .param for all routes to seriesId
seriesRouter.param('seriesId', (req, res, next, seriesId) => {
	db.get("SELECT * FROM Series WHERE id = " + seriesId,
		(err, row) => {
			if (err) {
				next(err);
			} else if (!row) {
				res.status(404).json({msg: `Series with the ID of ${seriesId} does not exist.`});
			} else {
				req.series = row;
				next();
			}
	})
});

// GET request for :seriesId
seriesRouter.get('/:seriesId', (req, res) => {
	res.json({series: req.series});
});

// PUT request for :seriesId


module.exports = seriesRouter;
