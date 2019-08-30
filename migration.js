// Migrate the database via SQLite3 ORM

const sqlite = require('sqlite3');
const db = new sqlite.Database('./database.sqlite');

db.serialize(() => {
        db.run ("DROP TABLE IF EXISTS Artist", 
                (err) => {
                        if(err) {
                            console.log('error in DROP TABLE Artist');     
                            console.log(err.message);
                        } else {
                            console.log('success in DROP TABLE Artist'); 
                        }
                });

        db.run ("DROP TABLE IF EXISTS Series", 
                (err) => {
                        if(err) {
                            console.log('error in DROP TABLE Series');     
                            console.log(err.message);
                        } else {
                            console.log('success in DROP TABLE Series'); 
                        }
                });
 

        db.run ("DROP TABLE IF EXISTS Issue", 
                (err) => {
                        if(err) {
                            console.log('error in DROP TABLE Issue');     
                            console.log(err.message);
                        } else {
                            console.log('success in DROP TABLE Issue'); 
                        }
                });
 

        db.run("CREATE TABLE IF NOT EXISTS Artist(id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, date_of_birth TEXT NOT NULL, biography TEXT NOT NULL, is_currently_employed INTEGER DEFAULT 1)",
                 (err) => {
                         if(err) {
                            console.log('error in CREATE TABLE Artist');
                            console.log(err.message);
                         } else {
                            console.log('success in CREATE TABLE Artist');
                        }
                });
        

        db.run("CREATE TABLE IF NOT EXISTS Series(id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, description TEXT NOT NULL)",
                (err) => {
                        if(err) {
                            console.log('error in CREATE TABLE Series');
                            console.log(err.message);
                        } else {
                            console.log('success in CREATE TABLE Series');
                        }
                });


        db.run("CREATE TABLE IF NOT EXISTS Issue(id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, issue_number TEXT NOT NULL, publication_date TEXT NOT NULL, artist_id INTEGER NOT NULL, series_id INTEGER NOT NULL, FOREIGN KEY(artist_id) REFERENCES artist(id), FOREIGN KEY(series_id) REFERENCES series(id))",
                 (err) => {
                         if(err) {
                            console.log('error in CREATE TABLE Issue');
                            console.log(err.message);
                        } else {
                            console.log('success in CREATE TABLE Issue'); 
                        }
                });

});

db.close();

