import { pool } from '../mysql';

// 답변 등록
export const insertAnswer = async function (user: string, questionId: string, answer_content: string) {
  try {
    // DB연결 검사
    const connection = await pool.getConnection();

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
      const [row] = await connection.query(insertAnswerQuery, insertAnswerParams);
      await connection.query(`UPDATE question SET is_answer_done = 1 WHERE id = ?`, [questionId]);

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

// 답변 수정
export const updateAnswerDao = async function (answerId: string, answer_content: string) {
  try {
    // DB연결 검사
    const connection = await pool.getConnection();

    try {
      // 쿼리
      const updateAnswerQuery = `
        UPDATE answer
        SET answer_content = ?
        WHERE id = ?;
      `;
      const updateAnswerParams = [answer_content, answerId];
      const [row] = await connection.query(updateAnswerQuery, updateAnswerParams);

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

// 답변 삭제
export const deleteAnswerDao = async function (questionId: string) {
  try {
    // DB연결 검사
    const connection = await pool.getConnection();

    try {
      // 쿼리
      const deleteAnswerQuery = `UPDATE answer SET is_delete = 1 WHERE question_id = ?;`;
      const deleteAnswerParams = [questionId];
      const [row] = await connection.query(deleteAnswerQuery, deleteAnswerParams);
      await connection.query(`UPDATE question SET is_answer_done = 0 WHERE id = ?`, [questionId]);

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
