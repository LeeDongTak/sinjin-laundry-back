"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.mysqlConfig = void 0;
require('dotenv').config();
exports.mysqlConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: Number((_a = process.env.DB_PORT) !== null && _a !== void 0 ? _a : 3306),
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};
