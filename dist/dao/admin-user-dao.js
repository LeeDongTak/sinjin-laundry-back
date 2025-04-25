"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const mysql_1 = require("../mysql");
const createUser = function (admin_id, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // DB연결 검사
            const connection = yield mysql_1.pool.getConnection();
            try {
                // 쿼리
                const signupQuery = `
        insert into 
        admin_user(
          admin_id,
          password, 
          name,
        )
        value(?, ?, admin);
      `;
                const signupParams = [admin_id, password];
                const [row] = yield connection.query(signupQuery, signupParams);
                return row;
            }
            catch (err) {
                console.error(`### insertTodo Query error ### \n ${err}`);
                return false;
            }
            finally {
                connection.release();
            }
        }
        catch (err) {
            console.error(`### insertTodo Query error ### \n ${err}`);
            return false;
        }
    });
};
exports.createUser = createUser;
