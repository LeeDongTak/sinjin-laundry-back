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
exports.selectQuestionDetail = exports.selectQuestionSecretDetail = exports.selectDetailBySecretType = exports.selectQuestion = exports.insertQuestion = void 0;
const mysql_1 = require("../mysql");
// 질문 등록
const insertQuestion = function (question_title, question_content, question_name, is_secret, hashedPassword, user_email, user_phone, user_site) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // DB연결 검사
            const connection = yield mysql_1.pool.getConnection();
            try {
                // 쿼리
                const insertQuestionQuery = `
        insert into 
        question(
          question_title,
          question_content, 
          question_name, 
          is_secret, 
          secret_password, 
          user_email,
          user_phone,
          user_site,
          is_answer_done, 
          is_delete
        )
        value(?, ?, ?, ?, ?, ?, ?, ?, 0, 0);
      `;
                const insertQuestionParams = [
                    question_title,
                    question_content,
                    question_name,
                    is_secret,
                    hashedPassword,
                    user_email,
                    user_phone,
                    user_site,
                ];
                const [row] = yield connection.query(insertQuestionQuery, insertQuestionParams);
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
exports.insertQuestion = insertQuestion;
// 질문 리스트 조회
const selectQuestion = (pageNum, is_answer) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield mysql_1.pool.getConnection();
        const answer = !is_answer ? 'ALL' : is_answer;
        try {
            const [countRows] = yield connection.query(`SELECT COUNT(*) as total FROM question WHERE is_delete = 0 ${answer !== 'ALL' ? 'WHERE is_answer_done = ?' : ''}`, answer !== 'ALL' ? [answer] : []);
            const total = countRows[0].total;
            const limit = 10;
            const offset = (+pageNum - 1) * limit;
            const selectQuestionQuery = `
        SELECT 
        id, question_title, question_name, is_secret,
        is_answer_done, is_delete, created_at 
        FROM question
        WHERE is_delete = 0
        ${answer !== 'ALL' ? 'WHERE is_answer_done = ?' : ''}
        ORDER BY id DESC LIMIT ? OFFSET ?;
      `;
            const selectQuestionParams = answer === 'ALL' ? [limit, offset] : [answer, limit, offset];
            const [question] = yield connection.query(selectQuestionQuery, selectQuestionParams);
            return { total, question };
        }
        catch (err) {
            console.log(`### getUserRows Query error ### ${err}`);
            return false;
        }
        finally {
            connection.release();
        }
    }
    catch (err) {
        console.log(err);
        return false;
    }
});
exports.selectQuestion = selectQuestion;
// 질문의 비밀번호 검사
const selectDetailBySecretType = (questionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield mysql_1.pool.getConnection();
        try {
            const selectDetailBySecretQuery = `SELECT is_secret FROM question WHERE id = ?;`;
            const selectDetailBySecretParams = [questionId];
            const [row] = yield connection.query(selectDetailBySecretQuery, selectDetailBySecretParams);
            return row;
        }
        catch (err) {
            console.log('### getUserRows Query error ###', err);
            return false;
        }
        finally {
            connection.release();
        }
    }
    catch (err) {
        console.log(err);
        return false;
    }
});
exports.selectDetailBySecretType = selectDetailBySecretType;
// 비밀질문 상세내용 조회
const selectQuestionSecretDetail = (questionId, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield mysql_1.pool.getConnection();
        try {
            const selectQuestionSecretDetailQuery = `
        SELECT 
        CASE 
          WHEN question.secret_password = ? AND question.is_delete = 0 THEN JSON_OBJECT(
            'id', question.id,
            'question_title', question.question_title,
            'question_content', question.question_content,
            'question_name', question.question_name,
            'is_secret', question.is_secret,
            'is_answer_done', question.is_answer_done,
            'is_delete', question.is_delete,
            'created_at', question.created_at,
            'updated_at', question.updated_at
          )
          ELSE JSON_OBJECT(
            'is_secret', 3
          )
          END AS question,
          CASE
          WHEN answer.id IS NOT NULL THEN JSON_OBJECT(
            'id', answer.id,
            'question_id', answer.question_id,
            'answer_title', answer.answer_title,
            'answer_content', answer.answer_content,
            'is_delete', answer.is_delete,
            'created_at', answer.created_at,
            'admin_name', admin_user.name
          )
          ELSE NULL
        END AS answer
        FROM question
        LEFT JOIN answer ON question.id = answer.question_id AND answer.is_delete = 0
        LEFT JOIN admin_user ON answer.admin_id = admin_user.id
        WHERE question.id = ?;
      `;
            const selectQuestionSecretDetailParams = [hashedPassword, questionId];
            const [row] = yield connection.query(selectQuestionSecretDetailQuery, selectQuestionSecretDetailParams);
            return row;
        }
        catch (err) {
            console.log('### getUserRows Query error ###', err);
            return false;
        }
        finally {
            connection.release();
        }
    }
    catch (err) {
        console.log(err);
        return false;
    }
});
exports.selectQuestionSecretDetail = selectQuestionSecretDetail;
// 질문 상세내용 조회
const selectQuestionDetail = (questionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield mysql_1.pool.getConnection();
        try {
            const selectQuestionDetailQuery = `
         SELECT 
        CASE 
          WHEN question.is_delete = 0 THEN JSON_OBJECT(
            'id', question.id,
            'question_title', question.question_title,
            'question_content', question.question_content,
            'question_name', question.question_name,
            'is_secret', question.is_secret,
            'is_answer_done', question.is_answer_done,
            'is_delete', question.is_delete,
            'created_at', question.created_at,
            'updated_at', question.updated_at
          )
          ELSE JSON_OBJECT(
            'is_secret', 3
          )
          END AS question,
          CASE
          WHEN answer.id IS NOT NULL THEN JSON_OBJECT(
            'id', answer.id,
            'question_id', answer.question_id,
            'answer_title', answer.answer_title,
            'answer_content', answer.answer_content,
            'is_delete', answer.is_delete,
            'created_at', answer.created_at,
            'admin_name', admin_user.name
          )
          ELSE NULL
        END AS answer
        FROM question
        LEFT JOIN answer ON question.id = answer.question_id AND answer.is_delete = 0
        LEFT JOIN admin_user ON answer.admin_id = admin_user.id
        WHERE question.id = ?
      `;
            const selectQuestionDetailParams = [questionId];
            const [row] = yield connection.query(selectQuestionDetailQuery, selectQuestionDetailParams);
            return row;
        }
        catch (err) {
            console.log('### getUserRows Query error ###', err);
            return false;
        }
        finally {
            connection.release();
        }
    }
    catch (err) {
        console.log(err);
        return false;
    }
});
exports.selectQuestionDetail = selectQuestionDetail;
