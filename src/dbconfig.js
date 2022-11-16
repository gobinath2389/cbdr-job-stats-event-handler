const { Pool } = require('pg')
const dotenv = require('dotenv')
dotenv.config()

// Instantiates a client to connect to the database, connection settings are passed in
const dbConnection = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  max: process.env.MAX_CONNECTIONS || 5,
  acquireTimeoutMillis: process.env.ACQUIRE_TIMEOUT_MILLIS || 60, // 60 seconds adding to test connectionTimeout
  createTimeoutMillis: process.env.CREATE_TIMEOUT_MILLIS || 30, // 30 seconds adding to test connectionTimeout
  idleTimeoutMillis: process.env.IDLE_TIMEOUT_MILLIS || 30, // 10 minutes updated to test connectionTimeout, Previous Value: 30000
  // connectionTimeoutMillis: process.env.CONNECTION_TIMEOUT_MILLIS // 30 seconds removed to test connectionTimeout, Previous Value: 10000
});

module.exports = dbConnection;
