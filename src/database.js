import mysql from "mysql";
import { promisify } from "node:util";
import { database } from "./keys.js";

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("DATABASE CONNECTION WAS CLOSED");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("DATABASE HAS TO MANY CONNECTIONS");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("DATABASE CONNECTIONS WAS REFUSED");
    }
  }

  if (connection) connection.release();
  console.log("DB is connected");
  return;
});

// Promisify Pool Querys
pool.query = promisify(pool.query);

export { pool };
