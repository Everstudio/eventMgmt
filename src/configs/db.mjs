//import mysql from 'mysql2/promise';
import mysql from "mysql2/promise";
import "dotenv/config";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // whether the pool should wait for connections to become available if the connection limit is reached
  connectionLimit: 10, // max number of connections
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0, // max number of connection requests in the queue, the default value is 0
  enableKeepAlive: true, // whether keep-alive is enabled on the socket
  keepAliveInitialDelay: 0, // initial delay for TCP keep-alive probe
});

export default pool;
