import { pool } from '../mysql';
import { RowDataPacket } from 'mysql2';

// 아이디 중복검사
export const selectCheckAdminId = async function (admin_id: string) {
  try {
    // DB연결 검사
    const connection = await pool.getConnection();
    try {
      // 쿼리
      const signupQuery = `SELECT admin_id FROM admin_user WHERE admin_id = ?;`;
      const signupParams = [admin_id];

      const [rows] = await connection.query<RowDataPacket[]>(signupQuery, signupParams);
      return rows;
    } catch (err) {
      console.error(`### check id Query error ### \n ${err}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(`### check id Query error ### \n ${err}`);
    return false;
  }
};

// 회원가입
export const createUser = async function (admin_id: string, password: string) {
  try {
    // DB연결 검사
    const connection = await pool.getConnection();
    try {
      // 쿼리
      const signupQuery = `
        insert into admin_user( admin_id, password, name ) value(?, ?, ?);
      `;
      const signupParams = [admin_id, password, 'admin'];

      const [result] = await connection.query(signupQuery, signupParams);
      return result;
    } catch (err) {
      console.error(`### signup Query error ### \n ${err}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(`### signup Query error ### \n ${err}`);
    return false;
  }
};

// 로그인
export const selectUser = async function (admin_id: string) {
  try {
    // DB연결 검사
    const connection = await pool.getConnection();
    try {
      // 쿼리
      const signupQuery = `SELECT id, admin_id, password, name FROM admin_user WHERE admin_id = ?;`;
      const signupParams = [admin_id];

      const [rows] = await connection.query<RowDataPacket[]>(signupQuery, signupParams);

      return rows[0] as { id: string; admin_id: string; password: string; name: string } | undefined;
    } catch (err) {
      console.error(`### signin Query error ### \n ${err}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(`### signin Query error ### \n ${err}`);
    return false;
  }
};

// 질문 삭제
export const deleteQuestionDao = async function (questionId: string) {
  try {
    // DB연결 검사
    const connection = await pool.getConnection();

    try {
      // 쿼리
      const deleteQuestionQuery = `UPDATE question SET is_delete = 1 WHERE id = ?;`;
      const deleteParams = [questionId];
      const [row] = await connection.query(deleteQuestionQuery, deleteParams);
      connection.query(`UPDATE answer SET is_delete = 1 WHERE question_id = ?;`, deleteParams);
      await connection.query(`UPDATE question SET is_answer_done = 0 WHERE id = ?`, deleteParams);

      return row;
    } catch (err) {
      console.error(`### Query error ### \n ${err}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(`### Query error ### \n ${err}`);
    return false;
  }
};
