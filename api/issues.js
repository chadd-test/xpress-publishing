const issuesRouter = require('express').Router({mergeParams:true});
const sqlite = require('sqlite3');
const db = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');

/********************************/
/* Issue Routes without PARAMS */
/********************************/

issuesRouter.get('/', (req, res, next) => {
	const issues = [];	  
	db.each("SELECT * FROM Issue",
		(err, row) => {
			issues.push(row);
		},
			(err) => {
				if (err) {
					next(err);
				} else {
					res.json({issues: issues})
				}
			})
});



/****************************/
/* Issue Routes with PARAMS */
/****************************/


module.exports = issuesRouter;
