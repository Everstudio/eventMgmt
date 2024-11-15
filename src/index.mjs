import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import MySQLStore from "express-mysql-session";
import "dotenv/config";
import morgan from "morgan";
import cors from "cors";
import jwt from "jsonwebtoken";

import "./strategies/jwt-strategy.mjs";

import routes from "./routes/index.mjs";
import pool from "./configs/db.mjs";

import paymentRouter from "./routes/paymentCallback.mjs";

const app = express();
const options = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  waitForConnections: true,
  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: 86400000,
};

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(morgan("combined"));
app.use(express.json()); // for parsing application/json
app.use(cookieParser()); 
app.use(passport.initialize());

//enable cors
app.use(cors());

//set timezone to UTC
process.env.TZ = "UTC";

const testDbConnection = async () => {
  try {
    const [rows, fields] = await pool.query("SELECT 1 + 1 AS result");
    console.log("Database connected. Test query result:", rows[0].result); // Should output: 2
    console.log('Timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

//exclude authenticated routes
app.use(paymentRouter);

app.use(routes);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await testDbConnection();

  // console.log('Public Key:', publicKey.export({ type: 'pkcs1', format: 'pem' }));
  // console.log('Private Key:', privateKey.export({ type: 'pkcs1', format: 'pem' }));
});
