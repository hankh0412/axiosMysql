const axios = require("axios");
const mysql = require("mysql");

require("dotenv").config();

// console.log("DB_HOST:", process.env);

const con = mysql.createConnection({
  host: process.env.DB_HOSTNAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database : process.env.DB_NAME
});


exports.handler = async (event, context, callback) => {
  const response = await axios.get(
    process.env.API_URL
  );
  console.log(JSON.stringify(response["data"]));

  con.connect();

  // con.query("CREATE DATABASE public", function (err, result) {
  //   if (err) throw err;
  //   console.log("Database created");
  // });

  // const sql = "CREATE TABLE B551182 (message VARCHAR(255))";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("Table created");
  // });
  //return "Table Created"

  // allows for using callbacks as finish/error-handlers
  // context.callbackWaitsForEmptyEventLoop = false;
  const sql = "INSERT INTO B551182 (yadmNm, sidoNm) VALUES ('I am MySQL', 'test')";
  con.query(sql, (err, res) => {
    if (err) {
      throw err
    }
    // callback(null, '1 records inserted.');
  })


  con.end();

  return "Database Created";

  // return {
  //     statusCode: 200,
  //     body: JSON.stringify(response["data"]),
  // };
};

exports.handler();
