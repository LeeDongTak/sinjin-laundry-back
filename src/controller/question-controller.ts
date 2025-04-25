import { Request, Response, NextFunction, RequestHandler } from 'express';
import {
  selectQuestion,
  insertQuestion,
  selectQuestionDetail,
  selectDetailBySecretType,
  selectQuestionSecretDetail,
} from '../dao/question-dao';
import crypto from 'crypto';

// 질문 등록
export const createQuestion: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { question_title, question_content, question_name, is_secret, secret_password } = req.body;

    // 에러처리
    if (!question_title) {
      res.status(400).send({
        isSuccess: false,
        message: '제목을 입력해 주세요',
      });
      return;
    }
    if (!question_content) {
      res.status(400).send({
        isSuccess: false,
        message: '내용을 입력해 주세요',
      });
      return;
    }
    if (!question_name) {
      res.status(400).send({
        isSuccess: false,
        message: '작성자를 입력해 주세요',
      });
      return;
    }
    if (is_secret && !secret_password) {
      res.status(400).send({
        isSuccess: false,
        message: '비밀글에는 비밀번호를 입력해 주세요',
      });
      return;
    }
    if (is_secret && secret_password.length > 6) {
      res.status(400).send({
        isSuccess: false,
        message: '비밀번호는 6자리 이하로 적어주세요',
      });
      return;
    }
    const hashedPassword = secret_password
      ? crypto
          .createHash('sha224')
          .update('' + secret_password)
          .digest('base64')
      : null;

    const createQuestionData = await insertQuestion(
      question_title,
      question_content,
      question_name,
      is_secret ? 1 : 0,
      hashedPassword,
    );

    const { insertId } = createQuestionData as { insertId: number };

    if (!createQuestionData) {
      res.status(500).send({
        isSuccess: false,
        message: '서버에 문제가 발생하였습니다.',
      });
      return;
    }

    res.status(200).send({
      isSuccess: true,
      id: insertId,
      message: '요청에 성공하였습니다.',
    });
    return;
  } catch (error) {
    next(error);
  }
};

// 질문 리스트 조회
export const readQuestion: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { pageMum } = req.params;
  const is_answer = req.query.is_answer as string | undefined;

  // 에러처리
  if (!pageMum || pageMum === ' ') {
    res.status(400).send({
      isSuccess: false,
      message: 'pageNum을 보내주세요',
    });
    return;
  }
  const isNumber = /^\d+$/.test(pageMum);
  if (!isNumber) {
    res.status(400).send({
      isSuccess: false,
      message: 'pageNum은 숫자로 보내주세요',
    });
    return;
  }
  try {
    const readQuestionData = await selectQuestion(pageMum, is_answer);

    if (!readQuestionData) {
      res.status(500).send({
        isSuccess: false,
        message: '서버에 문제가 발생하였습니다.',
      });
      return;
    }

    res.status(200).send({
      isSuccess: true,
      data: readQuestionData,
      message: '요청에 성공하였습니다.',
    });
    return;
  } catch (error) {
    next(error);
  }
};

// 질문 상세 내용 조회 (비밀글 x)
export const readQuestionDetail: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { questionId } = req.params;

  // 에러처리
  if (!questionId || questionId === ' ') {
    res.status(400).send({
      isSuccess: false,
      message: 'questionId를 보내주세요',
    });
    return;
  }

  try {
    const readQuestionDetailBySecret = await selectDetailBySecretType(questionId);
    const { is_secret } = JSON.parse(JSON.stringify({ ...readQuestionDetailBySecret }))[0];
    if (is_secret === 1) {
      res.status(400).send({
        isSuccess: false,
        message: '비밀글 입니다. 비밀번호를 입력해 주세요',
      });
      return;
    }

    const readQuestionDetailData = await selectQuestionDetail(questionId);

    if (!readQuestionDetailData) {
      res.status(500).send({
        isSuccess: false,
        message: '서버에 문제가 발생하였습니다.',
      });
      return;
    }

    res.status(200).send({
      isSuccess: true,
      data: readQuestionDetailData,
      message: '요청에 성공하였습니다.',
    });
    return;
  } catch (error) {
    next(error);
  }
};

// 비밀글 질문 상세내용 조회
export const readQuestionDetailBySecret = async (req: Request, res: Response, next: NextFunction) => {
  const { questionId } = req.params;
  const { secret_password } = req.body;

  // 에러처리
  if (!questionId || questionId === ' ') {
    res.status(400).send({
      isSuccess: false,
      message: 'questionId를 보내주세요',
    });
    return;
  }
  if (!secret_password || secret_password === ' ') {
    res.status(400).send({
      isSuccess: false,
      message: '비밀번호를 보내주세요',
    });
    return;
  }
  if (secret_password.length !== 6) {
    res.status(400).send({
      isSuccess: false,
      message: '비밀번호는 6자리로 입력해 주세요',
    });
    return;
  }

  try {
    const hashedPassword = crypto
      .createHash('sha224')
      .update('' + secret_password)
      .digest('base64');

    const readQuestionSecretDetail = await selectQuestionSecretDetail(questionId, hashedPassword);
    const { is_secret } = JSON.parse(JSON.stringify({ ...readQuestionSecretDetail }))[0].question;
    if (is_secret === 3) {
      res.status(400).send({
        isSuccess: false,
        data: is_secret,
        message: '비밀번호가 다릅니다. 올바른 비밀번호를 입력해 주세요.',
      });
      return;
    }

    if (!readQuestionSecretDetail) {
      res.status(500).send({
        isSuccess: false,
        message: '서버에 문제가 발생하였습니다.',
      });
      return;
    }

    const { question, answer } = JSON.parse(JSON.stringify({ ...readQuestionSecretDetail }))[0];
    const result = {
      ...question,
      answer,
    };
    res.status(200).send({
      isSuccess: true,
      data: result,
      message: '요청에 성공하였습니다.',
    });
    return;
  } catch (error) {
    next(error);
  }
};
