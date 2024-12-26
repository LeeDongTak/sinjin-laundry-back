require('dotenv').config();

// exports.jwtSecret = process.env.JWT_SECRET_KEY;

interface mMysqlConfig {
  host?: string;
  user?: string;
  port?: number;
  password?: string;
  database?: string;
}

export const mysqlConfig: mMysqlConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: Number(process.env.DB_PORT ?? 3306),
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};
