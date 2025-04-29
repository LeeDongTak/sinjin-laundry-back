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
exports.deleteQuestionDao = exports.selectUser = exports.createUser = exports.selectCheckAdminId = void 0;
const mysql_1 = require("../mysql");
// 아이디 중복검사
const selectCheckAdminId = function (admin_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // DB연결 검사
            const connection = yield mysql_1.pool.getConnection();
            try {
                // 쿼리
                const signupQuery = `SELECT admin_id FROM admin_user WHERE admin_id = ?;`;
                const signupParams = [admin_id];
                const [rows] = yield connection.query(signupQuery, signupParams);
                return rows;
            }
            catch (err) {
                console.error(`### check id Query error ### \n ${err}`);
                return false;
            }
            finally {
                connection.release();
            }
        }
        catch (err) {
            console.error(`### check id Query error ### \n ${err}`);
            return false;
        }
    });
};
exports.selectCheckAdminId = selectCheckAdminId;
// 회원가입
const createUser = function (admin_id, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // DB연결 검사
            const connection = yield mysql_1.pool.getConnection();
            try {
                // 쿼리
                const signupQuery = `
        insert into admin_user( admin_id, password, name ) value(?, ?, ?);
      `;
                const signupParams = [admin_id, password, 'admin'];
                const [result] = yield connection.query(signupQuery, signupParams);
                return result;
            }
            catch (err) {
                console.error(`### signup Query error ### \n ${err}`);
                return false;
            }
            finally {
                connection.release();
            }
        }
        catch (err) {
            console.error(`### signup Query error ### \n ${err}`);
            return false;
        }
    });
};
exports.createUser = createUser;
// 로그인
const selectUser = function (admin_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // DB연결 검사
            const connection = yield mysql_1.pool.getConnection();
            try {
                // 쿼리
                const signupQuery = `SELECT id, admin_id, password, name FROM admin_user WHERE admin_id = ?;`;
                const signupParams = [admin_id];
                const [rows] = yield connection.query(signupQuery, signupParams);
                return rows[0];
            }
            catch (err) {
                console.error(`### signin Query error ### \n ${err}`);
                return false;
            }
            finally {
                connection.release();
            }
        }
        catch (err) {
            console.error(`### signin Query error ### \n ${err}`);
            return false;
        }
    });
};
exports.selectUser = selectUser;
// 질문 삭제
const deleteQuestionDao = function (questionId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // DB연결 검사
            const connection = yield mysql_1.pool.getConnection();
            try {
                // 쿼리
                const deleteQuestionQuery = `UPDATE question SET is_delete = 1 WHERE id = ?;`;
                const deleteParams = [questionId];
                const [row] = yield connection.query(deleteQuestionQuery, deleteParams);
                connection.query(`UPDATE answer SET is_delete = 1 WHERE question_id = ?;`, deleteParams);
                yield connection.query(`UPDATE question SET is_answer_done = 0 WHERE id = ?`, deleteParams);
                return row;
            }
            catch (err) {
                console.error(`### Query error ### \n ${err}`);
                return false;
            }
            finally {
                connection.release();
            }
        }
        catch (err) {
            console.error(`### Query error ### \n ${err}`);
            return false;
        }
    });
};
exports.deleteQuestionDao = deleteQuestionDao;
