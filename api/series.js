const seriesRouter = require('express').Router();

const sqlite = require('sqlite3');
const db = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');


/* Routes without PARAMS */

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



/* Routes with PARAMS */

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



module.exports = seriesRouter;
