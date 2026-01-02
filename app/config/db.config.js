const mysql = require("mysql2");

/**
 * PRIMARY DB CONNECTION (WRITE)
 */
const writeDB = mysql.createConnection({
  host: process.env.MASTER_DB_HOST,
  user: process.env.MASTER_DB_USER,
  password: process.env.MASTER_DB_PASSWORD,
  database: process.env.MASTER_DB_NAME
});

/**
 * READ REPLICA CONNECTION (READ ONLY)
 */
const readDB = mysql.createConnection({
  host: process.env.READ_DB_HOST,
  user: process.env.READ_DB_USER,
  password: process.env.READ_DB_PASSWORD,
  database: process.env.READ_DB_NAME
});

// Connect PRIMARY
writeDB.connect(error => {
  if (error) {
    console.error("❌ Error connecting to PRIMARY DB:", error);
  } else {
    console.log("✅ Connected to PRIMARY DB");
  }
});

// Connect REPLICA
readDB.connect(error => {
  if (error) {
    console.error("❌ Error connecting to READ REPLICA:", error);
  } else {
    console.log("✅ Connected to READ REPLICA");
  }
});

module.exports = {
  writeDB,
  readDB
};
