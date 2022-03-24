const mysql = require("mysql2/promise");

require("dotenv").config();

const db = async () => {
    try {
    	// db connection
        let connection = await mysql.createConnection({
            host: process.env.DB_HOSTNAME,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            database : process.env.DB_NAME
        });

	// Select all rows from example table
        let [rows, fields] = await connection.query("SELECT * FROM example");
        console.log('1.',rows);

	// insert data
        let data = {
            name: "sample0",
        };

	// insert data into example table
        let [results] = await connection.query(
            "INSERT INTO example SET ?",
            data
        );
        // inserted data's id(auto_increment)
        let insertId = results.insertId;

	// Select all rows from example table
        [rows, fields] = await connection.query("SELECT * FROM example");
        console.log('2.',rows);

	// update row
        [results] = await connection.query("UPDATE example SET name=? WHERE id=?", [
            "updated_sample",
            insertId,
        ]);

	// Select all rows from example table
        [rows, fields] = await connection.query("SELECT * FROM example");
        console.log('3.',rows);

	// delete row
        [results] = await connection.query("DELETE FROM example WHERE id=?", [
            insertId,
        ]);

	// Select all rows from example table
        [rows, fields] = await connection.query("SELECT * FROM example");
        console.log('4.',rows);
    } catch (error) {
        console.log('5.',error);
    }
};

db();
