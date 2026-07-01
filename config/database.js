const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// Jika DATABASE_URL atau MYSQL_URL tersedia (Format URL tunggal)
if (process.env.DATABASE_URL || process.env.MYSQL_URL) {
  const connectionString = process.env.DATABASE_URL || process.env.MYSQL_URL;
  sequelize = new Sequelize(connectionString, {
    dialect: 'mysql',
    logging: false,
  });
} else {
  // Fallback: Menggunakan parameter database terpisah (Bawaan otomatis Railway)
  sequelize = new Sequelize(
    process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || 'test', 
    process.env.MYSQLUSER || process.env.MYSQL_USER || 'root',        
    process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD || '',    
    {
      host: process.env.MYSQLHOST || process.env.MYSQL_HOST || '127.0.0.1',
      port: process.env.MYSQLPORT || process.env.MYSQL_PORT || 3306,
      dialect: 'mysql',
      logging: false,
    }
  );
}

module.exports = sequelize;
