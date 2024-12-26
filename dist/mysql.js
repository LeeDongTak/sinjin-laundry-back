"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const setting_1 = require("./setting");
const promise_1 = require("mysql2/promise");
exports.pool = (0, promise_1.createPool)(setting_1.mysqlConfig);
