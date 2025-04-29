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
exports.deleteAnswerDao = exports.updateAnswerDao = exports.insertAnswer = void 0;
const mysql_1 = require("../mysql");
// 답변 등록
const insertAnswer = function (user, questionId, answer_content) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // DB연결 검사
            const connection = yield mysql_1.pool.getConnection();
            try {
                // 쿼리
                const insertAnswerQuery = `
        insert into 
        answer(
          question_id,
          admin_id,
          answer_title,
          answer_content, 
          is_delete
        )
        value(?, ?, '0', ?, 0);
      `;
                const insertAnswerParams = [questionId, user, answer_content];
                const [row] = yield connection.query(insertAnswerQuery, insertAnswerParams);
                yield connection.query(`UPDATE question SET is_answer_done = 1 WHERE id = ?`, [questionId]);
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
exports.insertAnswer = insertAnswer;
// 답변 수정
const updateAnswerDao = function (answerId, answer_content) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // DB연결 검사
            const connection = yield mysql_1.pool.getConnection();
            try {
                // 쿼리
                const updateAnswerQuery = `
        UPDATE answer
        SET answer_content = ?
        WHERE id = ?;
      `;
                const updateAnswerParams = [answer_content, answerId];
                const [row] = yield connection.query(updateAnswerQuery, updateAnswerParams);
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
exports.updateAnswerDao = updateAnswerDao;
// 답변 삭제
const deleteAnswerDao = function (questionId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // DB연결 검사
            const connection = yield mysql_1.pool.getConnection();
            try {
                // 쿼리
                const deleteAnswerQuery = `UPDATE answer SET is_delete = 1 WHERE question_id = ?;`;
                const deleteAnswerParams = [questionId];
                const [row] = yield connection.query(deleteAnswerQuery, deleteAnswerParams);
                yield connection.query(`UPDATE question SET is_answer_done = 0 WHERE id = ?`, [questionId]);
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
exports.deleteAnswerDao = deleteAnswerDao;
