const sqlite = require('sqlite3');
const db = new sqlite.Database('./database.sqlite');

db.get("SELECT * FROM Artist WHERE id = 1",
	(err, row) => {
		if (err) {
			console.log('error - unable to retrieve row');
			return;
		} else {
				  // const testObject = (row);
				for(let key in row) {
					console.log(`${key}`);
				}			  
		}
	});

db.close();
