import { pool } from '../mysql';

// 질문 등록
export const insertQuestion = async function (
  question_title: string,
  question_content: string,
  question_name: string,
  is_secret: number,
  hashedPassword?: string | null,
) {
  try {
    // DB연결 검사
    const connection = await pool.getConnection();

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
          is_answer_done, 
          is_delete
        )
        value(?, ?, ?, ?, ?, 0, 0);
      `;
      const insertQuestionParams = [question_title, question_content, question_name, is_secret, hashedPassword];

      const [row] = await connection.query(insertQuestionQuery, insertQuestionParams);
      return row;
    } catch (err) {
      console.error(`### insertTodo Query error ### \n ${err}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(`### insertTodo Query error ### \n ${err}`);
    return false;
  }
};

// 질문 리스트 조회
export const selectQuestion = async (pageNum: string) => {
  try {
    const connection = await pool.getConnection();

    try {
      const selectQuestionQuery = `
        SELECT 
        id, question_title, question_name, is_secret,
        is_answer_done, is_delete, created_at 
        FROM question ORDER BY id DESC LIMIT 10 OFFSET ?;
      `;
      const selectQuestionParams = [Number(pageNum) - 1];
      const [row] = await connection.query(selectQuestionQuery, selectQuestionParams);
      return row;
    } catch (err) {
      console.log(`### getUserRows Query error ### ${err}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

// 질문의 비밀번호 검사
export const selectDetailBySecretType = async (questionId: string) => {
  try {
    const connection = await pool.getConnection();

    try {
      const selectDetailBySecretQuery = `SELECT is_secret FROM question WHERE id = ?;`;
      const selectDetailBySecretParams = [questionId];
      const [row] = await connection.query(selectDetailBySecretQuery, selectDetailBySecretParams);
      return row;
    } catch (err) {
      console.log('### getUserRows Query error ###', err);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

// 비밀질문 상세내용 조회
export const selectQuestionSecretDetail = async (questionId: string, hashedPassword: string) => {
  try {
    const connection = await pool.getConnection();

    try {
      const selectQuestionSecretDetailQuery = `
        SELECT 
        CASE 
          WHEN question.secret_password = ? THEN JSON_OBJECT(
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
            'is_delete', answer.is_delete
          )
          ELSE NULL
        END AS answer
        FROM question
        LEFT JOIN answer ON question.id = answer.question_id 
        WHERE question.id = ?;
      `;
      const selectQuestionSecretDetailParams = [hashedPassword, questionId];
      const [row] = await connection.query(selectQuestionSecretDetailQuery, selectQuestionSecretDetailParams);
      return row;
    } catch (err) {
      console.log('### getUserRows Query error ###', err);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const selectQuestionDetail = async (questionId: string) => {
  try {
    const connection = await pool.getConnection();

    try {
      const selectQuestionDetailQuery = `
        SELECT question.*,
        CASE
          WHEN answer.id IS NOT NULL THEN JSON_OBJECT(
            'id', answer.id,
            'question_id', answer.question_id,
            'answer_title', answer.answer_title,
            'answer_content', answer.answer_content,
            'is_delete', answer.is_delete
          )
          ELSE NULL
        END AS answer
        FROM question
        LEFT JOIN answer ON question.id = answer.question_id 
        WHERE question.id = ?;
      `;
      const selectQuestionDetailParams = [questionId];
      const [row] = await connection.query(selectQuestionDetailQuery, selectQuestionDetailParams);
      return row;
    } catch (err) {
      console.log('### getUserRows Query error ###', err);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};
